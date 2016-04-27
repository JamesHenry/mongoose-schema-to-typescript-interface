"use strict";
var chai_1 = require('chai');
var utilities_1 = require('../utilities');
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
    describe('extendRefTypes', function () {
        it('should scan the generated output for matching refs and extend the type annotation', function () {
            var refMapping = {
                'IMainInterface_propWithRef': 'OtherThing',
            };
            var generatedOutput = "interface OtherThing {\n\tfoo: string;\n}\n\ninterface IMainInterface {\n\tpropWithRef: string;\n\tbar: number;\n}\n\n";
            var expected = "interface OtherThing {\n\tfoo: string;\n}\n\ninterface IMainInterface {\n\tpropWithRef: string | OtherThing;\n\tbar: number;\n}\n\n";
            chai_1.expect(utilities_1.extendRefTypes(generatedOutput, refMapping)).to.equal(expected);
        });
        it('should support prefixed and suffixed matches of the ref value', function () {
            var refMapping = {
                'IMainInterface_propWithRef': 'OtherThing',
            };
            var generatedOutput1 = "interface IOtherThing {\n\tfoo: string;\n}\n\ninterface IMainInterface {\n\tpropWithRef: string;\n\tbar: number;\n}\n\n";
            var expected1 = "interface IOtherThing {\n\tfoo: string;\n}\n\ninterface IMainInterface {\n\tpropWithRef: string | IOtherThing;\n\tbar: number;\n}\n\n";
            var generatedOutput2 = "interface IOtherThingIMoreStuff {\n\tfoo: string;\n}\n\ninterface IMainInterface {\n\tpropWithRef: string;\n\tbar: number;\n}\n\n";
            var expected2 = "interface IOtherThingIMoreStuff {\n\tfoo: string;\n}\n\ninterface IMainInterface {\n\tpropWithRef: string | IOtherThingIMoreStuff;\n\tbar: number;\n}\n\n";
            chai_1.expect(utilities_1.extendRefTypes(generatedOutput1, refMapping)).to.equal(expected1);
        });
    });
});
//# sourceMappingURL=utilities.spec.js.map