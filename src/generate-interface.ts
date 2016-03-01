import { Schema } from 'mongoose'

import {
	TYPESCRIPT_TYPES,
	INTERFACE_PREFIX,
	appendNewline,
	indent,
} from './utilities'

const camelCase = require('lodash.camelcase')
const upperFirst = require('lodash.upperfirst')

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
 * Return true if the given mongoose field config has enum values
 * @private
 */
function hasEnumValues(fieldConfig: any): boolean {
	return fieldConfig.enum && fieldConfig.enum.length
}

/**
 * Convert an array of strings into a stringified TypeScript string literal type
 * @private
 */
function generateStringLiteralTypeFromEnum(enumOptions: string[]): string {

	let stringLiteralStr = ``

	enumOptions.forEach(( option, index ) => {

		stringLiteralStr += `'${option}'`

		if (index !== enumOptions.length - 1) {
			stringLiteralStr += ` | `
		}

	})

	return stringLiteralStr

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
export default function typescriptInterfaceGenerator(interfaceName: string, rawSchema: any): string {

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

		const typeString = getTypeScriptTypeFromMongooseType(fieldConfig.type)

		if (typeString === TYPESCRIPT_TYPES.STRING && hasEnumValues(fieldConfig)) {
			return generateStringLiteralTypeFromEnum(fieldConfig.enum)
		}

		return typeString

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

			interfaceString = appendNewline(interfaceString)

		})

		interfaceString += appendNewline('}')

		return interfaceString

	}

	const mainInterface = generateInterface(interfaceName, rawSchema)

	generatedContent += mainInterface

	return generatedContent

}
