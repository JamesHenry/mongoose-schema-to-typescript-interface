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
            var refMapping = (_a = {},
                _a["IMainInterface" + utilities_1.REF_PATH_DELIMITER + "propWithRef"] = 'OtherThing',
                _a
            );
            var generatedOutput = "interface IOtherThing {\n\tfoo: string;\n}\n\ninterface IMainInterface {\n\tpropWithRef: string;\n\tbar: number;\n}\n\n";
            var expected = "interface IOtherThing {\n\tfoo: string;\n}\n\ninterface IMainInterface {\n\tpropWithRef: string | IOtherThing;\n\tbar: number;\n}\n\n";
            chai_1.expect(utilities_1.extendRefTypes(generatedOutput, refMapping)).to.equal(expected);
            var _a;
        });
    });
});
//# sourceMappingURL=utilities.spec.js.map