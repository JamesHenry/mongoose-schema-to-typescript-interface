"use strict";
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
    DATE: 'Date',
    OBJECT_LITERAL: '{}',
    ANY: 'any',
    ARRAY_THEREOF: '[]',
    OPTIONAL_PROP: '?',
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
//# sourceMappingURL=utilities.js.map