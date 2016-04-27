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
    ARRAY: string;
    DATE: string;
    OBJECT_LITERAL: string;
    ANY: string;
    ARRAY_THEREOF: string;
    OPTIONAL_PROP: string;
    UNSUPPORTED: string;
    SCHEMA: string;
};
export declare const MONGOOSE_SCHEMA_TYPES: {
    OBJECT_ID: string;
    MIXED: string;
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
export declare function generateOutput(moduleName: string, currentDir: string, schemaFiles: any[], extendRefs?: boolean): string;
export declare function extendRefTypes(generatedOutput: string, refMapping?: any): string;
