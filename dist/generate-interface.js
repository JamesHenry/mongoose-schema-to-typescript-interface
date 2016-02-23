"use strict";
var mongoose_1 = require('mongoose');
var camelCase = require('lodash.camelcase');
var upperFirst = require('lodash.upperfirst');
/**
 * Internal constants
 */
var INDENT_CHAR = '\t';
var NEWLINE_CHAR = '\n';
var INTERFACE_PREFIX = 'I';
var TYPESCRIPT_TYPES = {
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
 * Prepend a given string with the indentation character
 * @private
 */
function indent(str) {
    return "" + INDENT_CHAR + str;
}
/**
 * Append the newline character to a given string
 * @private
 */
function appendNewline(str) {
    return "" + str + NEWLINE_CHAR;
}
/**
 * Format a given nested interface name
 * @private
 */
function formatNestedInterfaceName(name) {
    return upperFirst(camelCase(name));
}
/**
 * Return true if the given mongoose field config is a nested schema object
 * @private
 */
function isNestedSchemaType(fieldConfig) {
    return !fieldConfig.type && Object.keys(fieldConfig).length > 0;
}
/**
 * For a given mongoose schema type, return the relevant TypeScript type as a string
 * @private
 */
function getTypeScriptTypeFromMongooseType(mongooseType) {
    switch (true) {
        case mongooseType === String:
        case mongooseType === mongoose_1.Schema.Types.ObjectId:
            return TYPESCRIPT_TYPES.STRING;
        case mongooseType === Number:
            return TYPESCRIPT_TYPES.NUMBER;
        case mongooseType === mongoose_1.Schema.Types.Mixed:
            return TYPESCRIPT_TYPES.OBJECT_LITERAL;
        case mongooseType === Date:
            return TYPESCRIPT_TYPES.DATE;
        case mongooseType === Boolean:
            return TYPESCRIPT_TYPES.BOOLEAN;
        case Array.isArray(mongooseType) === true:
            if (!mongooseType.length) {
                return "" + TYPESCRIPT_TYPES.ANY + TYPESCRIPT_TYPES.ARRAY_THEREOF;
            }
            var arrayOfType = mongooseType[0];
            return "" + getTypeScriptTypeFromMongooseType(arrayOfType) + TYPESCRIPT_TYPES.ARRAY_THEREOF;
        default:
            throw new Error("Mongoose type not recognised/supported: " + mongooseType);
    }
}
/**
 * For the `rawSchema`, generate a TypeScript interface under the given `interfaceName`,
 * and any requisite nested interfaces
 * @public
 */
function typescriptInterfaceGenerator(interfaceName, rawSchema) {
    var generatedContent = '';
    function generateFieldTypeString(fieldName, fieldConfig) {
        var interfaceString = '';
        /**
         * Create nested interfaces, if applicable
         */
        if (isNestedSchemaType(fieldConfig)) {
            var nestedInterfaceName = formatNestedInterfaceName(fieldName);
            var nestedInterface = generateInterface(nestedInterfaceName, fieldConfig);
            generatedContent += appendNewline(nestedInterface);
            return "" + INTERFACE_PREFIX + nestedInterfaceName;
        }
        return getTypeScriptTypeFromMongooseType(fieldConfig.type);
    }
    function generateInterface(name, fromSchema) {
        var fields = Object.keys(fromSchema);
        var interfaceString = "interface " + INTERFACE_PREFIX + name + " {";
        if (fields.length) {
            interfaceString = appendNewline(interfaceString);
        }
        fields.forEach(function (fieldName, index) {
            var fieldConfig = fromSchema[fieldName];
            interfaceString += indent(fieldName);
            if (!isNestedSchemaType(fieldConfig) && !fieldConfig.required) {
                interfaceString += TYPESCRIPT_TYPES.OPTIONAL_PROP;
            }
            interfaceString += ': ' + generateFieldTypeString(fieldName, fieldConfig);
            interfaceString += ';';
            if (index === fields.length - 1) {
                interfaceString = appendNewline(interfaceString);
            }
        });
        interfaceString += appendNewline('}');
        return interfaceString;
    }
    var mainInterface = generateInterface(interfaceName, rawSchema);
    generatedContent += mainInterface;
    return generatedContent;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = typescriptInterfaceGenerator;
//# sourceMappingURL=generate-interface.js.map