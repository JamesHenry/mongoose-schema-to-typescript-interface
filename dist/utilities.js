"use strict";
var generate_module_1 = require('./generate-module');
var generate_interface_1 = require('./generate-interface');
/**
 * Library constants
 */
exports.INDENT_CHAR = '\t';
exports.NEWLINE_CHAR = '\n';
exports.INTERFACE_PREFIX = 'I';
exports.TYPESCRIPT_TYPES = {
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
};
exports.MONGOOSE_SCHEMA_TYPES = {
    OBJECT_ID: 'ObjectId',
    MIXED: 'Mixed',
};
/**
 * Append the newline character to a given string
 */
function appendNewline(str) {
    return "" + str + exports.NEWLINE_CHAR;
}
exports.appendNewline = appendNewline;
/**
 * Prepend a given string with the indentation character
 */
function indent(str) {
    return "" + exports.INDENT_CHAR + str;
}
exports.indent = indent;
/**
 * Split on the newline character and prepend each of the
 * resulting strings with the indentation character
 */
function indentEachLine(content) {
    return content
        .split(exports.NEWLINE_CHAR)
        .map(function (line) {
        /**
         * Do not indent a line which purely consists of
         * a newline character
         */
        if (line.length) {
            return indent(line);
        }
        return line;
    })
        .join(exports.NEWLINE_CHAR);
}
exports.indentEachLine = indentEachLine;
function generateOutput(moduleName, currentDir, schemaFiles) {
    var output = "";
    for (var _i = 0, schemaFiles_1 = schemaFiles; _i < schemaFiles_1.length; _i++) {
        var schemaFile = schemaFiles_1[_i];
        var interfaceName = schemaFile.name;
        var schemaTree = schemaFile.schema;
        if (!interfaceName) {
            throw new Error("Schema file does not export a 'name': " + schemaFile);
        }
        output += generate_interface_1.default(interfaceName, schemaTree);
    }
    output = generate_module_1.default(moduleName, output);
    return output;
}
exports.generateOutput = generateOutput;
//# sourceMappingURL=utilities.js.map