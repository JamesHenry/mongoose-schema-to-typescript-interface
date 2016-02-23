"use strict";
var mongoose_1 = require('mongoose');
function typescriptInterfaceGenerator(interfaceName, rawSchema) {
    var mainString = '';
    function generateFieldTypeString(fieldName, fieldConfig) {
        var interfaceString = '';
        switch (true) {
            case fieldConfig.type === String:
            case fieldConfig.type === mongoose_1.Schema.Types.ObjectId:
                interfaceString += 'string';
                break;
            case fieldConfig.type === Number:
                interfaceString += 'number';
                break;
            case fieldConfig.type === Boolean:
                interfaceString += 'boolean';
                break;
            case Array.isArray(fieldConfig.type) === true:
                var arrayOfType = fieldConfig.type[0];
                switch (true) {
                    case arrayOfType === String:
                    case arrayOfType === mongoose_1.Schema.Types.ObjectId:
                        interfaceString += 'string';
                        break;
                    case arrayOfType === Number:
                        interfaceString += 'number';
                        break;
                    case arrayOfType === Boolean:
                        interfaceString += 'boolean';
                        break;
                    default:
                        console.warn('Array type not recognised', fieldConfig);
                }
                interfaceString += '[]';
                break;
            case !fieldConfig.type && Object.keys(fieldConfig).length > 0:
                var nestedInterface = generateInterface(fieldName, fieldConfig);
                mainString += nestedInterface + '\n\n';
                interfaceString += fieldName;
                break;
            default:
                console.warn('Field type not recognised', fieldConfig);
        }
        return interfaceString;
    }
    function generateInterface(name, fromSchema) {
        var interfaceString = 'interface ' + name + ' {\n';
        Object.keys(fromSchema).forEach(function (fieldName) {
            var fieldConfig = fromSchema[fieldName];
            interfaceString += '\t' + fieldName;
            if (!fieldConfig.required) {
                interfaceString += '?';
            }
            interfaceString += ': ' + generateFieldTypeString(fieldName, fieldConfig);
            interfaceString += ';\n';
        });
        interfaceString += '}';
        return interfaceString;
    }
    var accountInterface = generateInterface(interfaceName, rawSchema);
    mainString += '\n' + accountInterface;
    return mainString;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = typescriptInterfaceGenerator;
//# sourceMappingURL=generate-interface.js.map