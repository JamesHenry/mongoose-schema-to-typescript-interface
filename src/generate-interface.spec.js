"use strict";
var mongoose_1 = require('mongoose');
var chai_1 = require('chai');
var generateInterface = require('./generate-interface.js').default;
describe('generate-interface', function () {
    it('should return a stringified TypeScript interface', function () {
        var input = generateInterface('EmptyInterface', {});
        var output = "\ninterface EmptyInterface {\n}";
        chai_1.expect(input).to.equal(output);
    });
    it("should use TypeScript type 'string' for mongoose type ObjectId", function () {
        var input = generateInterface('ObjectIdInterface', {
            id: {
                type: mongoose_1.Schema.Types.ObjectId,
                required: true,
            },
        });
        var output = "\ninterface ObjectIdInterface {\n\tid: string;\n}";
        chai_1.expect(input).to.equal(output);
    });
    it("should use convert mongoose 'required: false' to '?' TypeScript interface syntax", function () {
        var input = generateInterface('OptionalPropInterface', {
            id: {
                type: mongoose_1.Schema.Types.ObjectId,
                required: false,
            },
        });
        var output = "\ninterface OptionalPropInterface {\n\tid?: string;\n}";
        chai_1.expect(input).to.equal(output);
    });
});
//# sourceMappingURL=generate-interface.spec.js.map