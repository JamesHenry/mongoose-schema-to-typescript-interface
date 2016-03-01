"use strict";
var utilities_1 = require('./utilities');
/**
 * Wrap the given stringified contents in a stringified TypeScript module,
 * using the given module name
 * @public
 */
function typescriptModuleGenerator(moduleName, moduleContents) {
    if (!moduleName) {
        throw new Error("\"moduleName\" is required to generate a TypeScript module");
    }
    var typescriptModule = utilities_1.appendNewline("declare module " + moduleName + " {");
    typescriptModule += utilities_1.indentEachLine(moduleContents);
    typescriptModule += utilities_1.appendNewline('}');
    return typescriptModule;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = typescriptModuleGenerator;
//# sourceMappingURL=generate-module.js.map