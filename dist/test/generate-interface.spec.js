"use strict";
var mongoose_1 = require('mongoose');
var chai_1 = require('chai');
var generate_interface_1 = require('../generate-interface');
describe("generateInterface", function () {
    it("should return a stringified TypeScript interface", function () {
        var input = generate_interface_1.default("EmptyInterface", {});
        var output = "interface IEmptyInterface {}\n";
        chai_1.expect(input).to.equal(output);
    });
    it("should convert mongoose 'type: ObjectId' to TypeScript type 'string'", function () {
        var input = generate_interface_1.default("ObjectIdInterface", {
            id: {
                type: mongoose_1.Schema.Types.ObjectId,
                required: true,
            },
        });
        var output = "interface IObjectIdInterface {\n\tid: string;\n}\n";
        chai_1.expect(input).to.equal(output);
    });
    it("should convert mongoose 'required: false' to TypeScript optional property syntax", function () {
        var input = generate_interface_1.default("OptionalPropInterface", {
            id: {
                type: mongoose_1.Schema.Types.ObjectId,
                required: false,
            },
        });
        var output = "interface IOptionalPropInterface {\n\tid?: string;\n}\n";
        chai_1.expect(input).to.equal(output);
    });
    it("should convert mongoose 'type: Mixed' to TypeScript type '{}'", function () {
        var input = generate_interface_1.default("MixedInterface", {
            id: {
                type: mongoose_1.Schema.Types.Mixed,
                required: true,
            },
        });
        var output = "interface IMixedInterface {\n\tid: {};\n}\n";
        chai_1.expect(input).to.equal(output);
    });
    it("should convert mongoose 'type: String' to TypeScript type 'string'", function () {
        var input = generate_interface_1.default("NameStringInterface", {
            name: {
                type: String,
                required: true,
            },
        });
        var output = "interface INameStringInterface {\n\tname: string;\n}\n";
        chai_1.expect(input).to.equal(output);
    });
    it("should convert mongoose 'type: String' and 'enum: [...]' to TypeScript 'string literal type'", function () {
        var input = generate_interface_1.default("StringOptionsInterface", {
            chosen_letter: {
                type: String,
                enum: ['a', 'b', 'c'],
                required: true,
            },
        });
        var output = "interface IStringOptionsInterface {\n\tchosen_letter: 'a' | 'b' | 'c';\n}\n";
        chai_1.expect(input).to.equal(output);
    });
    it("should convert mongoose 'type: Number' to TypeScript type 'number'", function () {
        var input = generate_interface_1.default("AgeNumberInterface", {
            age: {
                type: Number,
                required: true,
            },
        });
        var output = "interface IAgeNumberInterface {\n\tage: number;\n}\n";
        chai_1.expect(input).to.equal(output);
    });
    it("should convert mongoose 'type: Number' to TypeScript type 'number'", function () {
        var input = generate_interface_1.default("AgeNumberInterface", {
            age: {
                type: Number,
                required: true,
            },
        });
        var output = "interface IAgeNumberInterface {\n\tage: number;\n}\n";
        chai_1.expect(input).to.equal(output);
    });
    it("should convert mongoose 'type: Boolean' to TypeScript type 'boolean'", function () {
        var input = generate_interface_1.default("EnabledBooleanInterface", {
            enabled: {
                type: Boolean,
                required: true,
            },
        });
        var output = "interface IEnabledBooleanInterface {\n\tenabled: boolean;\n}\n";
        chai_1.expect(input).to.equal(output);
    });
    it("should convert mongoose 'type: Date' to TypeScript type 'Date'", function () {
        var input = generate_interface_1.default("StartInterface", {
            start: {
                type: Date,
                required: true,
            },
        });
        var output = "interface IStartInterface {\n\tstart: Date;\n}\n";
        chai_1.expect(input).to.equal(output);
    });
    it("should convert mongoose 'type: []' to TypeScript type 'any[]'", function () {
        var input = generate_interface_1.default("AnyListInterface", {
            stuff: {
                type: [],
                required: true,
            },
        });
        var output = "interface IAnyListInterface {\n\tstuff: any[];\n}\n";
        chai_1.expect(input).to.equal(output);
    });
    it("should convert mongoose 'type: [Number]' to TypeScript type 'number[]'", function () {
        var input = generate_interface_1.default("NumberListInterface", {
            list: {
                type: [Number],
                required: true,
            },
        });
        var output = "interface INumberListInterface {\n\tlist: number[];\n}\n";
        chai_1.expect(input).to.equal(output);
    });
    it("should convert mongoose 'type: [String]' to TypeScript type 'string[]'", function () {
        var input = generate_interface_1.default("NameListInterface", {
            names: {
                type: [String],
                required: true,
            },
        });
        var output = "interface INameListInterface {\n\tnames: string[];\n}\n";
        chai_1.expect(input).to.equal(output);
    });
    it("should convert mongoose 'type: [Boolean]' to TypeScript type 'boolean[]'", function () {
        var input = generate_interface_1.default("StatusListInterface", {
            statuses: {
                type: [Boolean],
                required: true,
            },
        });
        var output = "interface IStatusListInterface {\n\tstatuses: boolean[];\n}\n";
        chai_1.expect(input).to.equal(output);
    });
    it("should convert mongoose 'type: [Date]' to TypeScript type 'Date[]'", function () {
        var input = generate_interface_1.default("DateListInterface", {
            dates: {
                type: [Date],
                required: true,
            },
        });
        var output = "interface IDateListInterface {\n\tdates: Date[];\n}\n";
        chai_1.expect(input).to.equal(output);
    });
    it("should convert mongoose 'type: [ObjectId]' to TypeScript type 'string[]'", function () {
        var input = generate_interface_1.default("ObjectIdListInterface", {
            ids: {
                type: [mongoose_1.Schema.Types.ObjectId],
                required: true,
            },
        });
        var output = "interface IObjectIdListInterface {\n\tids: string[];\n}\n";
        chai_1.expect(input).to.equal(output);
    });
    it("should convert mongoose 'type: [Mixed]' to TypeScript type '[{}]'", function () {
        var input = generate_interface_1.default("MixedListInterface", {
            id: {
                type: [mongoose_1.Schema.Types.Mixed],
                required: true,
            },
        });
        var output = "interface IMixedListInterface {\n\tid: {}[];\n}\n";
        chai_1.expect(input).to.equal(output);
    });
    it("should dynamically create any nested mongoose schemas as TypeScript interfaces", function () {
        var input = generate_interface_1.default("MainInterface", {
            nested: {
                stuff: {
                    type: String,
                    required: false,
                },
            },
        });
        var output = "interface INested {\n\tstuff?: string;\n}\n\ninterface IMainInterface {\n\tnested: INested;\n}\n";
        chai_1.expect(input).to.equal(output);
    });
    it("should format nested schema names as TitleCase", function () {
        var input = generate_interface_1.default("MainInterface", {
            snake_case: {
                stuff: {
                    type: String,
                    required: false,
                },
            },
        });
        var output = "interface ISnakeCase {\n\tstuff?: string;\n}\n\ninterface IMainInterface {\n\tsnake_case: ISnakeCase;\n}\n";
        chai_1.expect(input).to.equal(output);
    });
    it("should support multiple schema fields on newlines", function () {
        var input = generate_interface_1.default("MultipleFieldsInterface", {
            field1: {
                type: String,
                required: true,
            },
            field2: {
                type: String,
                required: true,
            },
        });
        var output = "interface IMultipleFieldsInterface {\n\tfield1: string;\n\tfield2: string;\n}\n";
        chai_1.expect(input).to.equal(output);
    });
    it("should support arrays of nested schemas as a field type", function () {
        var nested = {
            stuff: {
                type: String,
                required: false,
            }
        };
        var input = generate_interface_1.default("MainInterface", {
            multipleNested: {
                type: [nested],
            },
        });
        var output = "interface IMultipleNested {\n\tstuff?: string;\n}\n\ninterface IMainInterface {\n\tmultipleNested: IMultipleNested[];\n}\n";
        chai_1.expect(input).to.equal(output);
    });
});
//# sourceMappingURL=generate-interface.spec.js.map