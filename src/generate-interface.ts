import { Schema } from 'mongoose'
const camelCase = require('lodash.camelcase')
const upperFirst = require('lodash.upperfirst')

/**
 * Internal constants
 */
const INDENT_CHAR = '\t'
const NEWLINE_CHAR = '\n'
const INTERFACE_PREFIX = 'I'
const TYPESCRIPT_TYPES = {
	STRING: 'string',
	NUMBER: 'number',
	BOOLEAN: 'boolean',
	DATE: 'Date',
	OBJECT_LITERAL: '{}',
	ANY: 'any',
	ARRAY_THEREOF: '[]',
	OPTIONAL_PROP: '?',
}

/**
 * Prepend a given string with the indentation character
 * @private
 */
function indent(str: string): string {
	return `${INDENT_CHAR}${str}`
}

/**
 * Append the newline character to a given string
 * @private
 */
function appendNewline(str: string): string {
	return `${str}${NEWLINE_CHAR}`
}

/**
 * Format a given nested interface name
 * @private
 */
function formatNestedInterfaceName(name: string): string {
	return upperFirst(camelCase(name))
}

/**
 * Return true if the given mongoose field config is a nested schema object
 * @private
 */
function isNestedSchemaType(fieldConfig: any): boolean {
	return !fieldConfig.type && Object.keys(fieldConfig).length > 0
}

/**
 * For a given mongoose schema type, return the relevant TypeScript type as a string
 * @private
 */
function getTypeScriptTypeFromMongooseType(mongooseType: any): string {

	switch (true) {

	case mongooseType === String:
	case mongooseType === Schema.Types.ObjectId:
		return TYPESCRIPT_TYPES.STRING

	case mongooseType === Number:
		return TYPESCRIPT_TYPES.NUMBER

	case mongooseType === Schema.Types.Mixed:
		return TYPESCRIPT_TYPES.OBJECT_LITERAL

	case mongooseType === Date:
		return TYPESCRIPT_TYPES.DATE

	case mongooseType === Boolean:
		return TYPESCRIPT_TYPES.BOOLEAN

	case Array.isArray(mongooseType) === true:

		if (!mongooseType.length) {
			return `${TYPESCRIPT_TYPES.ANY}${TYPESCRIPT_TYPES.ARRAY_THEREOF}`
		}

		const arrayOfType = mongooseType[0]

		return `${getTypeScriptTypeFromMongooseType(arrayOfType)}${TYPESCRIPT_TYPES.ARRAY_THEREOF}`

	default:
		throw new Error(`Mongoose type not recognised/supported: ${mongooseType}`)

	}

}

/**
 * For the `rawSchema`, generate a TypeScript interface under the given `interfaceName`,
 * and any requisite nested interfaces
 * @public
 */
function typescriptInterfaceGenerator(interfaceName: string, rawSchema: any): string {

	let generatedContent = ''

	function generateFieldTypeString(fieldName: string, fieldConfig: any) {

		let interfaceString = ''

		/**
		 * Create nested interfaces, if applicable
		 */
		if (isNestedSchemaType(fieldConfig)) {

			const nestedInterfaceName = formatNestedInterfaceName(fieldName)
			const nestedInterface = generateInterface(nestedInterfaceName, fieldConfig)

			generatedContent += appendNewline(nestedInterface)

			return `${INTERFACE_PREFIX}${nestedInterfaceName}`

		}

		return getTypeScriptTypeFromMongooseType(fieldConfig.type)

	}

	function generateInterface(name: string, fromSchema: any) {

		const fields = Object.keys(fromSchema)
		let interfaceString = `interface ${INTERFACE_PREFIX}${name} {`

		if ( fields.length ) {
			interfaceString = appendNewline(interfaceString)
		}

		fields.forEach((fieldName, index) => {

			const fieldConfig = fromSchema[fieldName]

			interfaceString += indent(fieldName)

			if (!isNestedSchemaType(fieldConfig) && !fieldConfig.required) {
				interfaceString += TYPESCRIPT_TYPES.OPTIONAL_PROP
			}

			interfaceString += ': ' + generateFieldTypeString(fieldName, fieldConfig)

			interfaceString += ';'

			if (index === fields.length - 1) {
				interfaceString = appendNewline(interfaceString)
			}

		})

		interfaceString += appendNewline('}')

		return interfaceString

	}

	const mainInterface = generateInterface(interfaceName, rawSchema)

	generatedContent += mainInterface

	return generatedContent

}

export default typescriptInterfaceGenerator
