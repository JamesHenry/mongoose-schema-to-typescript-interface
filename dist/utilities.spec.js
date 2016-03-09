"use strict";
var chai_1 = require('chai');
var utilities_1 = require('./utilities');
describe('utilities', function () {
    describe('appendNewline', function () {
        it('should append a newline character to the given string', function () {
            chai_1.expect(utilities_1.appendNewline('test string')).to.equal('test string' + utilities_1.NEWLINE_CHAR);
        });
    });
    describe('indent', function () {
        it('should prepend an indent character to the given string', function () {
            chai_1.expect(utilities_1.indent('test string')).to.equal(utilities_1.INDENT_CHAR + 'test string');
        });
    });
    describe('indentEachLine', function () {
        it('should prepend an indent character to each line of the given string', function () {
            chai_1.expect(utilities_1.indentEachLine("\ntest1\ntest2\ntest3\n")).to.equal("\n" + utilities_1.INDENT_CHAR + "test1\n" + utilities_1.INDENT_CHAR + "test2\n" + utilities_1.INDENT_CHAR + "test3\n");
        });
    });
});
//# sourceMappingURL=utilities.spec.js.map