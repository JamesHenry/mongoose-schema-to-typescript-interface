"use strict";
var mongoose_1 = require('mongoose');
var utilities_1 = require('./utilities');
var camelCase = require('lodash.camelcase');
var upperFirst = require('lodash.upperfirst');
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
 * Return true if the given mongoose field config is an instance of VirtualType
 * @private
 */
function isVirtualType(fieldConfig) {
    return fieldConfig instanceof mongoose_1.VirtualType;
}
/**
 * Return true if the given mongoose field config has enum values
 * @private
 */
function hasEnumValues(fieldConfig) {
    return fieldConfig.enum && fieldConfig.enum.length;
}
/**
 * Convert an array of strings into a stringified TypeScript string literal type
 * @private
 */
function generateStringLiteralTypeFromEnum(enumOptions) {
    var stringLiteralStr = "";
    enumOptions.forEach(function (option, index) {
        stringLiteralStr += "'" + option + "'";
        if (index !== enumOptions.length - 1) {
            stringLiteralStr += " | ";
        }
    });
    return stringLiteralStr;
}
/**
 * For a given mongoose schema type, return the relevant TypeScript type as a string
 * @private
 */
function getTypeScriptTypeFromMongooseType(mongooseType) {
    switch (true) {
        case mongooseType === String:
        case mongooseType.schemaName && mongooseType.schemaName === utilities_1.MONGOOSE_SCHEMA_TYPES.OBJECT_ID:
            return utilities_1.TYPESCRIPT_TYPES.STRING;
        case mongooseType === Number:
            return utilities_1.TYPESCRIPT_TYPES.NUMBER;
        case mongooseType.schemaName && mongooseType.schemaName === utilities_1.MONGOOSE_SCHEMA_TYPES.MIXED:
            return utilities_1.TYPESCRIPT_TYPES.OBJECT_LITERAL;
        case mongooseType === Date:
            return utilities_1.TYPESCRIPT_TYPES.DATE;
        case mongooseType === Boolean:
            return utilities_1.TYPESCRIPT_TYPES.BOOLEAN;
        case Array.isArray(mongooseType) === true:
            if (!mongooseType.length) {
                return "" + utilities_1.TYPESCRIPT_TYPES.ANY + utilities_1.TYPESCRIPT_TYPES.ARRAY_THEREOF;
            }
            var arrayOfType = mongooseType[0];
            return "" + getTypeScriptTypeFromMongooseType(arrayOfType) + utilities_1.TYPESCRIPT_TYPES.ARRAY_THEREOF;
        default:
            throw new Error("Mongoose type not recognised/supported: " + mongooseType);
    }
}
/**
 * Predicate function to filter out invalid fields from a schema object
 * @private
 */
function filterOutInvalidFields(fieldName) {
    return fieldName !== '0' && fieldName !== '1';
}
/**
 * For the `rawSchema`, generate a TypeScript interface under the given `interfaceName`,
 * and any requisite nested interfaces
 * @public
 */
function typescriptInterfaceGenerator(interfaceName, rawSchema) {
    var generatedContent = '';
    function generateFieldTypeString(fieldName, fieldConfig) {
        /**
         * Create nested interfaces, if applicable
         */
        if (isNestedSchemaType(fieldConfig)) {
            var nestedInterfaceName = formatNestedInterfaceName(fieldName);
            var nestedInterface = generateInterface(nestedInterfaceName, fieldConfig);
            generatedContent += utilities_1.appendNewline(nestedInterface);
            return "" + utilities_1.INTERFACE_PREFIX + nestedInterfaceName;
        }
        var typeString = getTypeScriptTypeFromMongooseType(fieldConfig.type);
        if (typeString === utilities_1.TYPESCRIPT_TYPES.STRING && hasEnumValues(fieldConfig)) {
            return generateStringLiteralTypeFromEnum(fieldConfig.enum);
        }
        return typeString;
    }
    function generateInterface(name, fromSchema) {
        var fields = Object.keys(fromSchema).filter(filterOutInvalidFields);
        var interfaceString = "interface " + utilities_1.INTERFACE_PREFIX + name + " {";
        if (fields.length) {
            interfaceString = utilities_1.appendNewline(interfaceString);
        }
        fields.forEach(function (fieldName, index) {
            var fieldConfig = fromSchema[fieldName];
            // VirtualType fields are not supported yet
            if (isVirtualType(fieldConfig)) {
                return null;
            }
            interfaceString += utilities_1.indent(fieldName);
            if (!isNestedSchemaType(fieldConfig) && !fieldConfig.required) {
                interfaceString += utilities_1.TYPESCRIPT_TYPES.OPTIONAL_PROP;
            }
            interfaceString += ': ' + generateFieldTypeString(fieldName, fieldConfig);
            interfaceString += ';';
            interfaceString = utilities_1.appendNewline(interfaceString);
        });
        interfaceString += utilities_1.appendNewline('}');
        return interfaceString;
    }
    var mainInterface = generateInterface(interfaceName, rawSchema);
    generatedContent += mainInterface;
    return generatedContent;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = typescriptInterfaceGenerator;
//# sourceMappingURL=generate-interface.js.map