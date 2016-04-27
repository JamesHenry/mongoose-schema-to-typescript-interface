import * as path from 'path'

import generateModule     from './generate-module'
import generateInterface  from './generate-interface'

/**
 * Library constants
 */
export const INDENT_CHAR = '\t'
export const NEWLINE_CHAR = '\n'
export const INTERFACE_PREFIX = 'I'
export const REF_PATH_DELIMITER = '::'
export const TYPESCRIPT_TYPES = {
	STRING: 'string',
	NUMBER: 'number',
	BOOLEAN: 'boolean',
	ARRAY: 'Array',
	DATE: 'Date',
	OBJECT_LITERAL: '{}',
	ANY: 'any',
	ARRAY_THEREOF: '[]',
	OPTIONAL_PROP: '?',
	UNSUPPORTED: 'Unsupported',
	SCHEMA: 'SCHEMA',
}
export const MONGOOSE_SCHEMA_TYPES = {
	OBJECT_ID: 'ObjectId',
	MIXED: 'Mixed',
}

/**
 * Append the newline character to a given string
 */
export function appendNewline(str: string): string {
	return `${str}${NEWLINE_CHAR}`
}

/**
 * Prepend a given string with the indentation character
 */
export function indent(str: string): string {
	return `${INDENT_CHAR}${str}`
}

/**
 * Split on the newline character and prepend each of the
 * resulting strings with the indentation character
 */
export function indentEachLine(content: string): string {

	return content
		.split(NEWLINE_CHAR)
		.map((line) => {

			/**
			 * Do not indent a line which purely consists of
			 * a newline character
			 */
			if (line.length) {
				return indent(line)
			}

			return line

		})
		.join(NEWLINE_CHAR)
}

export function generateOutput(moduleName: string, currentDir: string, schemaFiles: any[], extendRefs: boolean = false): string {

	let output = ``
	const refMapping = {}

	for (const schemaFile of schemaFiles) {

		const interfaceName = schemaFile.name
		const schemaTree = schemaFile.schema

		if (!interfaceName) {
			throw new Error(`Schema file does not export a 'name': ${schemaFile}`)
		}

		output += generateInterface(interfaceName, schemaTree, refMapping)

	}

	if (extendRefs) {
		output = extendRefTypes(output, refMapping)
	}

	output = generateModule(moduleName, output)

	return output

}

function stripInterface(str: string): string {
	return str.replace('interface ', '').replace(' {', '')
}

export function extendRefTypes(generatedOutput: string, refMapping: any = {}): string {

	const refPaths = Object.keys(refMapping)
	if (!refPaths || !refPaths.length) {
		return generatedOutput
	}

	let updatedOutput = generatedOutput

	refPaths.forEach((refPath) => {

		const [interfaceName, propertyName] = refPath.split(REF_PATH_DELIMITER)
		const refValue = refMapping[refPath]
		const targetInterfaceStartRegexp = new RegExp(`interface ${interfaceName} {`)

		/**
		 * Check the given output for an applicable interface for the refValue
		 */
		const refInterfaceStartRegexp = new RegExp(`interface ${INTERFACE_PREFIX}${refValue} {`)
		const foundInterface = generatedOutput.match(refInterfaceStartRegexp)
		if (!foundInterface) {
			return null
		}

		const matchingReferencedInterfaceName: string = stripInterface(foundInterface[0])

		/**
		 * Split the given output by line
		 */
		const outputLines = generatedOutput.split('\n')

		/**
		 * Locate the start of the target interface
		 */
		let startIndexOfTargetInterface: number
		for (let i = 0; i < outputLines.length; i++) {
			if (outputLines[i].match(targetInterfaceStartRegexp)) {
				startIndexOfTargetInterface = i;
				break;
			}
		}

		if (typeof startIndexOfTargetInterface !== 'number') {
			return null
		}

		let endIndexOfTargetInterface: number
		for (let i = startIndexOfTargetInterface; i < outputLines.length; i++) {
			if (outputLines[i].indexOf('}') > -1) {
				endIndexOfTargetInterface = i;
				break;
			}
		}

		const refPropertyRegexp = new RegExp(`${propertyName}: string;`)
		const updatedLines = outputLines.map((line, index) => {

			if (index > startIndexOfTargetInterface && index < endIndexOfTargetInterface) {
				const targetFieldDefinition = line.match(refPropertyRegexp)
				if (targetFieldDefinition) {
					return line.replace(`string;`, `string | ${matchingReferencedInterfaceName};`)
				}
			}

			return line

		})

		updatedOutput = updatedLines.join('\n')

	})

	return updatedOutput

}
