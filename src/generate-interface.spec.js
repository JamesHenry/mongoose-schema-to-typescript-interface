var expect = require('chai').expect;
var generateInterface = require('./generate-interface.js');
describe('generate-interface', function () {
    it('should return a stringified TypeScript interface', function () {
        var input = generateInterface('EmptyInterface', {});
        var output = "\ninterface EmptyInterface {\n}";
        expect(input).to.equal(output);
    });
});
//# sourceMappingURL=generate-interface.spec.js.map