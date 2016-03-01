"use strict";
var chai_1 = require('chai');
var generate_module_1 = require('./generate-module');
describe("generateModule", function () {
    it("should return a stringified TypeScript module", function () {
        var input = generate_module_1.default("ModuleName", '');
        var output = "declare module ModuleName {\n}\n";
        chai_1.expect(input).to.equal(output);
    });
    it("should name the TypeScript module based on the given name", function () {
        var input = generate_module_1.default("GivenModuleName", '');
        var output = "declare module GivenModuleName {\n}\n";
        chai_1.expect(input).to.equal(output);
    });
    it("should wrap the given stringified content in a stringified TypeScript module", function () {
        var input = generate_module_1.default("ModuleName", "interface IEmptyInterface {}\n");
        var output = "declare module ModuleName {\n\tinterface IEmptyInterface {}\n}\n";
        chai_1.expect(input).to.equal(output);
    });
});
//# sourceMappingURL=generate-module.spec.js.map