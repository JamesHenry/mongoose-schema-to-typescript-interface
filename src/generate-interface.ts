import { VirtualType, Schema } from 'mongoose'

import {
	TYPESCRIPT_TYPES,
	MONGOOSE_SCHEMA_TYPES,
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
	return typeof fieldConfig === 'object' && !fieldConfig.type
}

/**
 * Return true if the given mongoose field config is an array of nested schema objects
 * @private
 */
function isNestedSchemaArrayType(fieldConfig: any): boolean {
	return Array.isArray(fieldConfig.type) && fieldConfig.type.every((nestedConfig: any) => isNestedSchemaType(nestedConfig))
}

/**
 * Return true if the given mongoose field config is an instance of VirtualType
 * @private
 */
function isVirtualType(fieldConfig: any): boolean {
	// In some cases fieldConfig will not pass true for instanceof, do some additional duck typing
	const looksLikeVirtualType = (fieldConfig && fieldConfig.path && Array.isArray(fieldConfig.getters) && Array.isArray(fieldConfig.setters) && typeof fieldConfig.options === 'object')
	return fieldConfig instanceof VirtualType || looksLikeVirtualType
}

/**
 * Return true if the given mongoose field config has enum values
 * @private
 */
function hasEnumValues(fieldConfig: any): boolean {
	return fieldConfig.enum && fieldConfig.enum.length
}

/**
 * If the provided schema has already been instantiated with mongoose,
 * use the `tree` definition as the schema config
 * @private
 */
function getSchemaConfig(rawSchema: any): any {
	// In some cases rawSchema will not pass true for instanceof, do some additional duck typing
	if (rawSchema instanceof Schema || rawSchema.tree) {
		return rawSchema.tree
	}
	return rawSchema
}

/**
 * Convert an array of strings into a stringified TypeScript string literal type
 * @private
 */
function generateStringLiteralTypeFromEnum(enumOptions: string[]): string {

	let stringLiteralStr = ``

	enumOptions.forEach((option, index) => {

		stringLiteralStr += `'${option}'`

		if (index !== enumOptions.length - 1) {
			stringLiteralStr += ` | `
		}

	})

	return stringLiteralStr

}

/**
 * Return a string representing the deterimed TypeScript type, if supported,
 * otherwise return the value of TYPESCRIPT_TYPES.UNSUPPORTED
 * @private
 */
function determineSupportedType(mongooseType: any): string {

	if (!mongooseType) {
		return TYPESCRIPT_TYPES.UNSUPPORTED
	}

	switch (true) {

		case mongooseType === String:
			return TYPESCRIPT_TYPES.STRING

		case mongooseType.schemaName === MONGOOSE_SCHEMA_TYPES.OBJECT_ID:
		case mongooseType.name === MONGOOSE_SCHEMA_TYPES.OBJECT_ID:
			return 'OBJECT_ID'

		case mongooseType === Number:
			return TYPESCRIPT_TYPES.NUMBER

		case mongooseType.schemaName === MONGOOSE_SCHEMA_TYPES.MIXED:
			return TYPESCRIPT_TYPES.OBJECT_LITERAL

		case mongooseType === Date:
			return TYPESCRIPT_TYPES.DATE

		case mongooseType === Boolean:
			return TYPESCRIPT_TYPES.BOOLEAN

		case Array.isArray(mongooseType) === true:
			return TYPESCRIPT_TYPES.ARRAY

		case typeof mongooseType === 'object' && Object.keys(mongooseType).length > 0:
			return TYPESCRIPT_TYPES.SCHEMA

		default:
			return TYPESCRIPT_TYPES.UNSUPPORTED

	}

}

/**
 * Predicate function to filter out invalid fields from a schema object
 * @private
 */
function filterOutInvalidFields(fieldName: string) {
	return fieldName !== '0' && fieldName !== '1'
}

/**
 * Generate a field value (type definition) for a particular TypeScript interface
 * @private
 */
function generateInterfaceFieldValue(supportedType: string, fieldConfig: any) {

	switch (supportedType) {

		/**
		 * Single values
		 */
		case TYPESCRIPT_TYPES.NUMBER:
		case TYPESCRIPT_TYPES.OBJECT_LITERAL:
		case TYPESCRIPT_TYPES.DATE:
		case TYPESCRIPT_TYPES.BOOLEAN:
			return supportedType

		/**
		 * Strings and string literals
		 */
		case TYPESCRIPT_TYPES.STRING:
			if (hasEnumValues(fieldConfig)) {
				return generateStringLiteralTypeFromEnum(fieldConfig.enum)
			}
			return supportedType

	}

}

/**
 * For the `rawSchema`, generate a TypeScript interface under the given `interfaceName`,
 * and any requisite nested interfaces
 * @public
 */
export default function typescriptInterfaceGenerator(interfaceName: string, rawSchema: any, refMapping: any = {}): string {

	let generatedContent = ''

	function generateInterface(name: string, fromSchema: any) {

		const fields = Object.keys(fromSchema).filter(filterOutInvalidFields)
		let interfaceString = `interface ${INTERFACE_PREFIX}${name} {`

		if (fields.length) {
			interfaceString = appendNewline(interfaceString)
		}

		fields.forEach((fieldName, index) => {

			const fieldConfig = fromSchema[fieldName]

			// VirtualType fields are not supported yet
			if (isVirtualType(fieldConfig)) {
				return null
			}

			interfaceString += indent(fieldName)

			let supportedType: string

			if (isNestedSchemaType(fieldConfig)) {
				supportedType = TYPESCRIPT_TYPES.OBJECT_LITERAL
			} else {
				supportedType = determineSupportedType(fieldConfig.type)
			}

			/**
			 * Unsupported type
			 */
			if (supportedType === TYPESCRIPT_TYPES.UNSUPPORTED) {
				throw new Error(`Mongoose type not recognised/supported: ${JSON.stringify(fieldConfig)}`)
			}

			let interfaceVal: string = ''

			/**
			 * Nested schema type
			 */
			if (supportedType === TYPESCRIPT_TYPES.OBJECT_LITERAL) {

				if (fieldConfig.type && fieldConfig.type.schemaName === MONGOOSE_SCHEMA_TYPES.MIXED) {

					interfaceVal = '{}'

				} else {

					const nestedInterfaceName = formatNestedInterfaceName(name) + INTERFACE_PREFIX + formatNestedInterfaceName(fieldName)
					const nestedSchemaConfig = getSchemaConfig(fieldConfig)
					const nestedInterface = generateInterface(nestedInterfaceName, nestedSchemaConfig)

					generatedContent += appendNewline(nestedInterface)

					interfaceVal = INTERFACE_PREFIX + nestedInterfaceName

				}

			} else if (supportedType === TYPESCRIPT_TYPES.ARRAY) {

				/**
				 * Empty array
				 */
				if (!fieldConfig.type.length) {

					interfaceVal = `${TYPESCRIPT_TYPES.ANY}${TYPESCRIPT_TYPES.ARRAY_THEREOF}`

				} else if (isNestedSchemaArrayType(fieldConfig)) {

					const nestedSchemaConfig = getSchemaConfig(fieldConfig.type[0])
					let nestedSupportedType = determineSupportedType(nestedSchemaConfig)

					if (nestedSupportedType === TYPESCRIPT_TYPES.UNSUPPORTED) {
						throw new Error(`Mongoose type not recognised/supported: ${JSON.stringify(fieldConfig)}`)
					}

					/**
					 * Nested Mixed types
					 */
					if (nestedSupportedType === TYPESCRIPT_TYPES.OBJECT_LITERAL) {

						interfaceVal = generateInterfaceFieldValue(nestedSupportedType, fieldConfig) + TYPESCRIPT_TYPES.ARRAY_THEREOF

					} else {

						/**
						 * Array of nested schema types
						 */
						const nestedInterfaceName = formatNestedInterfaceName(name) + INTERFACE_PREFIX + formatNestedInterfaceName(fieldName)
						const nestedInterface = generateInterface(nestedInterfaceName, nestedSchemaConfig)

						generatedContent += appendNewline(nestedInterface)

						interfaceVal = INTERFACE_PREFIX + nestedInterfaceName + TYPESCRIPT_TYPES.ARRAY_THEREOF

					}

				} else {

					/**
					 * Array of single value types
					 */
					let nestedSupportedType = determineSupportedType(fieldConfig.type[0])
					if (nestedSupportedType === TYPESCRIPT_TYPES.UNSUPPORTED) {
						throw new Error(`Mongoose type not recognised/supported: ${JSON.stringify(fieldConfig)}`)
					}

					if (nestedSupportedType === 'OBJECT_ID') {
						if (fieldConfig.ref) {
							refMapping[`${INTERFACE_PREFIX}${name}_${fieldName}`] = fieldConfig.ref
						}
						nestedSupportedType = TYPESCRIPT_TYPES.STRING
					}

					interfaceVal = generateInterfaceFieldValue(nestedSupportedType, fieldConfig) + TYPESCRIPT_TYPES.ARRAY_THEREOF

				}

			} else {

				if (supportedType === 'OBJECT_ID') {
					if (fieldConfig.ref) {
						refMapping[`${INTERFACE_PREFIX}${name}_${fieldName}`] = fieldConfig.ref
					}
					supportedType = TYPESCRIPT_TYPES.STRING
				}

				/**
				 * Single value types
				 */
				interfaceVal = generateInterfaceFieldValue(supportedType, fieldConfig)

			}

			if (!isNestedSchemaType(fieldConfig) && !isNestedSchemaArrayType(fieldConfig) && !fieldConfig.required) {
				interfaceString += TYPESCRIPT_TYPES.OPTIONAL_PROP
			}

			interfaceString += `: ${interfaceVal}`

			interfaceString += ';'

			interfaceString = appendNewline(interfaceString)

		})

		interfaceString += appendNewline('}')

		return interfaceString

	}

	const schemaConfig = getSchemaConfig(rawSchema)
	const mainInterface = generateInterface(interfaceName, schemaConfig)

	generatedContent += appendNewline(mainInterface)

	return generatedContent

}
