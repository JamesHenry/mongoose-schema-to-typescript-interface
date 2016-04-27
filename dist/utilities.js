"use strict";
var generate_module_1 = require('./generate-module');
var generate_interface_1 = require('./generate-interface');
/**
 * Library constants
 */
exports.INDENT_CHAR = '\t';
exports.NEWLINE_CHAR = '\n';
exports.INTERFACE_PREFIX = 'I';
exports.REF_PATH_DELIMITER = '::';
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
function generateOutput(moduleName, currentDir, schemaFiles, extendRefs) {
    if (extendRefs === void 0) { extendRefs = false; }
    var output = "";
    var refMapping = {};
    for (var _i = 0, schemaFiles_1 = schemaFiles; _i < schemaFiles_1.length; _i++) {
        var schemaFile = schemaFiles_1[_i];
        var interfaceName = schemaFile.name;
        var schemaTree = schemaFile.schema;
        if (!interfaceName) {
            throw new Error("Schema file does not export a 'name': " + schemaFile);
        }
        output += generate_interface_1.default(interfaceName, schemaTree, refMapping);
    }
    if (extendRefs) {
        output = extendRefTypes(output, refMapping);
    }
    output = generate_module_1.default(moduleName, output);
    return output;
}
exports.generateOutput = generateOutput;
function stripInterface(str) {
    return str.replace('interface ', '').replace(' {', '');
}
function extendRefTypes(generatedOutput, refMapping) {
    if (refMapping === void 0) { refMapping = {}; }
    var refPaths = Object.keys(refMapping);
    if (!refPaths || !refPaths.length) {
        return generatedOutput;
    }
    var updatedOutput = generatedOutput;
    refPaths.forEach(function (refPath) {
        var _a = refPath.split(exports.REF_PATH_DELIMITER), interfaceName = _a[0], propertyName = _a[1];
        var refValue = refMapping[refPath];
        var targetInterfaceStartRegexp = new RegExp("interface " + interfaceName + " {");
        /**
         * Check the given output for an applicable interface for the refValue
         */
        var refInterfaceStartRegexp = new RegExp("interface " + exports.INTERFACE_PREFIX + refValue + " {");
        var foundInterface = generatedOutput.match(refInterfaceStartRegexp);
        if (!foundInterface) {
            return null;
        }
        var matchingReferencedInterfaceName = stripInterface(foundInterface[0]);
        /**
         * Split the given output by line
         */
        var outputLines = generatedOutput.split('\n');
        /**
         * Locate the start of the target interface
         */
        var startIndexOfTargetInterface;
        for (var i = 0; i < outputLines.length; i++) {
            if (outputLines[i].match(targetInterfaceStartRegexp)) {
                startIndexOfTargetInterface = i;
                break;
            }
        }
        if (typeof startIndexOfTargetInterface !== 'number') {
            return null;
        }
        var endIndexOfTargetInterface;
        for (var i = startIndexOfTargetInterface; i < outputLines.length; i++) {
            if (outputLines[i].indexOf('}') > -1) {
                endIndexOfTargetInterface = i;
                break;
            }
        }
        var refPropertyRegexp = new RegExp(propertyName + ": string;");
        var updatedLines = outputLines.map(function (line, index) {
            if (index > startIndexOfTargetInterface && index < endIndexOfTargetInterface) {
                var targetFieldDefinition = line.match(refPropertyRegexp);
                if (targetFieldDefinition) {
                    return line.replace("string;", "string | " + matchingReferencedInterfaceName + ";");
                }
            }
            return line;
        });
        updatedOutput = updatedLines.join('\n');
    });
    return updatedOutput;
}
exports.extendRefTypes = extendRefTypes;
//# sourceMappingURL=utilities.js.map