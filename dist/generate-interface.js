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
    return typeof fieldConfig === 'object' && !fieldConfig.type;
}
/**
 * Return true if the given mongoose field config is an array of nested schema objects
 * @private
 */
function isNestedSchemaArrayType(fieldConfig) {
    return Array.isArray(fieldConfig.type) && fieldConfig.type.every(function (nestedConfig) { return isNestedSchemaType(nestedConfig); });
}
/**
 * Return true if the given mongoose field config is an instance of VirtualType
 * @private
 */
function isVirtualType(fieldConfig) {
    // In some cases fieldConfig will not pass true for instanceof, do some additional duck typing
    var looksLikeVirtualType = (fieldConfig && fieldConfig.path && Array.isArray(fieldConfig.getters) && Array.isArray(fieldConfig.setters) && typeof fieldConfig.options === 'object');
    return fieldConfig instanceof mongoose_1.VirtualType || looksLikeVirtualType;
}
/**
 * Return true if the given mongoose field config has enum values
 * @private
 */
function hasEnumValues(fieldConfig) {
    return fieldConfig.enum && fieldConfig.enum.length;
}
/**
 * If the provided schema has already been instantiated with mongoose,
 * use the `tree` definition as the schema config
 * @private
 */
function getSchemaConfig(rawSchema) {
    // In some cases rawSchema will not pass true for instanceof, do some additional duck typing
    if (rawSchema instanceof mongoose_1.Schema || rawSchema.tree) {
        return rawSchema.tree;
    }
    return rawSchema;
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
 * Return a string representing the deterimed TypeScript type, if supported,
 * otherwise return the value of TYPESCRIPT_TYPES.UNSUPPORTED
 * @private
 */
function determineSupportedType(mongooseType) {
    if (!mongooseType) {
        return utilities_1.TYPESCRIPT_TYPES.UNSUPPORTED;
    }
    switch (true) {
        case mongooseType === String:
        case mongooseType.schemaName === utilities_1.MONGOOSE_SCHEMA_TYPES.OBJECT_ID:
        case mongooseType.name === utilities_1.MONGOOSE_SCHEMA_TYPES.OBJECT_ID:
            return utilities_1.TYPESCRIPT_TYPES.STRING;
        case mongooseType === Number:
            return utilities_1.TYPESCRIPT_TYPES.NUMBER;
        case mongooseType.schemaName === utilities_1.MONGOOSE_SCHEMA_TYPES.MIXED:
            return utilities_1.TYPESCRIPT_TYPES.OBJECT_LITERAL;
        case mongooseType === Date:
            return utilities_1.TYPESCRIPT_TYPES.DATE;
        case mongooseType === Boolean:
            return utilities_1.TYPESCRIPT_TYPES.BOOLEAN;
        case Array.isArray(mongooseType) === true:
            return utilities_1.TYPESCRIPT_TYPES.ARRAY;
        case typeof mongooseType === 'object' && Object.keys(mongooseType).length > 0:
            return utilities_1.TYPESCRIPT_TYPES.SCHEMA;
        default:
            return utilities_1.TYPESCRIPT_TYPES.UNSUPPORTED;
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
 * Generate a field value (type definition) for a particular TypeScript interface
 * @private
 */
function generateInterfaceFieldValue(supportedType, fieldConfig) {
    switch (supportedType) {
        /**
         * Single values
         */
        case utilities_1.TYPESCRIPT_TYPES.NUMBER:
        case utilities_1.TYPESCRIPT_TYPES.OBJECT_LITERAL:
        case utilities_1.TYPESCRIPT_TYPES.DATE:
        case utilities_1.TYPESCRIPT_TYPES.BOOLEAN:
            return supportedType;
        /**
         * Strings and string literals
         */
        case utilities_1.TYPESCRIPT_TYPES.STRING:
            if (hasEnumValues(fieldConfig)) {
                return generateStringLiteralTypeFromEnum(fieldConfig.enum);
            }
            return supportedType;
    }
}
/**
 * For the `rawSchema`, generate a TypeScript interface under the given `interfaceName`,
 * and any requisite nested interfaces
 * @public
 */
function typescriptInterfaceGenerator(interfaceName, rawSchema) {
    var generatedContent = '';
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
            var supportedType;
            if (isNestedSchemaType(fieldConfig)) {
                supportedType = utilities_1.TYPESCRIPT_TYPES.OBJECT_LITERAL;
            }
            else {
                supportedType = determineSupportedType(fieldConfig.type);
            }
            /**
             * Unsupported type
             */
            if (supportedType === utilities_1.TYPESCRIPT_TYPES.UNSUPPORTED) {
                throw new Error("Mongoose type not recognised/supported: " + JSON.stringify(fieldConfig));
            }
            var interfaceVal = '';
            /**
             * Nested schema type
             */
            if (supportedType === utilities_1.TYPESCRIPT_TYPES.OBJECT_LITERAL) {
                if (fieldConfig.type && fieldConfig.type.schemaName === utilities_1.MONGOOSE_SCHEMA_TYPES.MIXED) {
                    interfaceVal = '{}';
                }
                else {
                    var nestedInterfaceName = formatNestedInterfaceName(fieldName);
                    var nestedSchemaConfig = getSchemaConfig(fieldConfig);
                    var nestedInterface = generateInterface(nestedInterfaceName, nestedSchemaConfig);
                    generatedContent += utilities_1.appendNewline(nestedInterface);
                    interfaceVal = utilities_1.INTERFACE_PREFIX + nestedInterfaceName;
                }
            }
            else if (supportedType === utilities_1.TYPESCRIPT_TYPES.ARRAY) {
                /**
                 * Empty array
                 */
                if (!fieldConfig.type.length) {
                    interfaceVal = "" + utilities_1.TYPESCRIPT_TYPES.ANY + utilities_1.TYPESCRIPT_TYPES.ARRAY_THEREOF;
                }
                else if (isNestedSchemaArrayType(fieldConfig)) {
                    var nestedSchemaConfig = getSchemaConfig(fieldConfig.type[0]);
                    var nestedSupportedType = determineSupportedType(nestedSchemaConfig);
                    if (nestedSupportedType === utilities_1.TYPESCRIPT_TYPES.UNSUPPORTED) {
                        throw new Error("Mongoose type not recognised/supported: " + JSON.stringify(fieldConfig));
                    }
                    /**
                     * Nested ObjectId or Mixed types
                     */
                    if (nestedSupportedType === utilities_1.TYPESCRIPT_TYPES.OBJECT_LITERAL || nestedSupportedType === utilities_1.TYPESCRIPT_TYPES.STRING) {
                        interfaceVal = generateInterfaceFieldValue(nestedSupportedType, fieldConfig) + utilities_1.TYPESCRIPT_TYPES.ARRAY_THEREOF;
                    }
                    else {
                        /**
                         * Array of nested schema types
                         */
                        var nestedInterfaceName = formatNestedInterfaceName(fieldName);
                        var nestedInterface = generateInterface(nestedInterfaceName, nestedSchemaConfig);
                        generatedContent += utilities_1.appendNewline(nestedInterface);
                        interfaceVal = utilities_1.INTERFACE_PREFIX + nestedInterfaceName + utilities_1.TYPESCRIPT_TYPES.ARRAY_THEREOF;
                    }
                }
                else {
                    /**
                     * Array of single value types
                     */
                    var nestedSupportedType = determineSupportedType(fieldConfig.type[0]);
                    if (nestedSupportedType === utilities_1.TYPESCRIPT_TYPES.UNSUPPORTED) {
                        throw new Error("Mongoose type not recognised/supported: " + JSON.stringify(fieldConfig));
                    }
                    interfaceVal = generateInterfaceFieldValue(nestedSupportedType, fieldConfig) + utilities_1.TYPESCRIPT_TYPES.ARRAY_THEREOF;
                }
            }
            else {
                /**
                 * Single value types
                 */
                interfaceVal = generateInterfaceFieldValue(supportedType, fieldConfig);
            }
            if (!isNestedSchemaType(fieldConfig) && !isNestedSchemaArrayType(fieldConfig) && !fieldConfig.required) {
                interfaceString += utilities_1.TYPESCRIPT_TYPES.OPTIONAL_PROP;
            }
            interfaceString += ": " + interfaceVal;
            interfaceString += ';';
            interfaceString = utilities_1.appendNewline(interfaceString);
        });
        interfaceString += utilities_1.appendNewline('}');
        return interfaceString;
    }
    var schemaConfig = getSchemaConfig(rawSchema);
    var mainInterface = generateInterface(interfaceName, schemaConfig);
    generatedContent += mainInterface;
    return generatedContent;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = typescriptInterfaceGenerator;
//# sourceMappingURL=generate-interface.js.map