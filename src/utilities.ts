/**
 * Library constants
 */
export const INDENT_CHAR = '\t'
export const NEWLINE_CHAR = '\n'
export const INTERFACE_PREFIX = 'I'
export const TYPESCRIPT_TYPES = {
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
