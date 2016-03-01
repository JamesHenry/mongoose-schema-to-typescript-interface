/**
 * Library constants
 */
export declare const INDENT_CHAR: string;
export declare const NEWLINE_CHAR: string;
export declare const INTERFACE_PREFIX: string;
export declare const TYPESCRIPT_TYPES: {
    STRING: string;
    NUMBER: string;
    BOOLEAN: string;
    DATE: string;
    OBJECT_LITERAL: string;
    ANY: string;
    ARRAY_THEREOF: string;
    OPTIONAL_PROP: string;
};
/**
 * Append the newline character to a given string
 */
export declare function appendNewline(str: string): string;
/**
 * Prepend a given string with the indentation character
 */
export declare function indent(str: string): string;
/**
 * Split on the newline character and prepend each of the
 * resulting strings with the indentation character
 */
export declare function indentEachLine(content: string): string;
