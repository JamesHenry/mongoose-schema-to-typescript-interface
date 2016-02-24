"use strict";
var mongoose_1 = require('mongoose');
var chai_1 = require('chai');
var generateInterface = require("./generate-interface.js").default;
describe("generateInterface", function () {
    it("should return a stringified TypeScript interface", function () {
        var input = generateInterface("EmptyInterface", {});
        var output = "interface IEmptyInterface {}\n";
        chai_1.expect(input).to.equal(output);
    });
    it("should convert mongoose 'type: ObjectId' to TypeScript type 'string'", function () {
        var input = generateInterface("ObjectIdInterface", {
            id: {
                type: mongoose_1.Schema.Types.ObjectId,
                required: true,
            },
        });
        var output = "interface IObjectIdInterface {\n\tid: string;\n}\n";
        chai_1.expect(input).to.equal(output);
    });
    it("should convert mongoose 'required: false' to TypeScript optional property syntax", function () {
        var input = generateInterface("OptionalPropInterface", {
            id: {
                type: mongoose_1.Schema.Types.ObjectId,
                required: false,
            },
        });
        var output = "interface IOptionalPropInterface {\n\tid?: string;\n}\n";
        chai_1.expect(input).to.equal(output);
    });
    it("should convert mongoose 'type: Mixed' to TypeScript type '{}'", function () {
        var input = generateInterface("MixedInterface", {
            id: {
                type: mongoose_1.Schema.Types.Mixed,
                required: true,
            },
        });
        var output = "interface IMixedInterface {\n\tid: {};\n}\n";
        chai_1.expect(input).to.equal(output);
    });
    it("should convert mongoose 'type: String' to TypeScript type 'string'", function () {
        var input = generateInterface("NameStringInterface", {
            name: {
                type: String,
                required: true,
            },
        });
        var output = "interface INameStringInterface {\n\tname: string;\n}\n";
        chai_1.expect(input).to.equal(output);
    });
    it("should convert mongoose 'type: String' and 'enum: [...]' to TypeScript 'string literal type'", function () {
        var input = generateInterface("StringOptionsInterface", {
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
        var input = generateInterface("AgeNumberInterface", {
            age: {
                type: Number,
                required: true,
            },
        });
        var output = "interface IAgeNumberInterface {\n\tage: number;\n}\n";
        chai_1.expect(input).to.equal(output);
    });
    it("should convert mongoose 'type: Number' to TypeScript type 'number'", function () {
        var input = generateInterface("AgeNumberInterface", {
            age: {
                type: Number,
                required: true,
            },
        });
        var output = "interface IAgeNumberInterface {\n\tage: number;\n}\n";
        chai_1.expect(input).to.equal(output);
    });
    it("should convert mongoose 'type: Boolean' to TypeScript type 'boolean'", function () {
        var input = generateInterface("EnabledBooleanInterface", {
            enabled: {
                type: Boolean,
                required: true,
            },
        });
        var output = "interface IEnabledBooleanInterface {\n\tenabled: boolean;\n}\n";
        chai_1.expect(input).to.equal(output);
    });
    it("should convert mongoose 'type: Date' to TypeScript type 'Date'", function () {
        var input = generateInterface("StartInterface", {
            start: {
                type: Date,
                required: true,
            },
        });
        var output = "interface IStartInterface {\n\tstart: Date;\n}\n";
        chai_1.expect(input).to.equal(output);
    });
    it("should convert mongoose 'type: []' to TypeScript type 'any[]'", function () {
        var input = generateInterface("AnyListInterface", {
            stuff: {
                type: [],
                required: true,
            },
        });
        var output = "interface IAnyListInterface {\n\tstuff: any[];\n}\n";
        chai_1.expect(input).to.equal(output);
    });
    it("should convert mongoose 'type: [Number]' to TypeScript type 'number[]'", function () {
        var input = generateInterface("NumberListInterface", {
            list: {
                type: [Number],
                required: true,
            },
        });
        var output = "interface INumberListInterface {\n\tlist: number[];\n}\n";
        chai_1.expect(input).to.equal(output);
    });
    it("should convert mongoose 'type: [String]' to TypeScript type 'string[]'", function () {
        var input = generateInterface("NameListInterface", {
            names: {
                type: [String],
                required: true,
            },
        });
        var output = "interface INameListInterface {\n\tnames: string[];\n}\n";
        chai_1.expect(input).to.equal(output);
    });
    it("should convert mongoose 'type: [Boolean]' to TypeScript type 'boolean[]'", function () {
        var input = generateInterface("StatusListInterface", {
            statuses: {
                type: [Boolean],
                required: true,
            },
        });
        var output = "interface IStatusListInterface {\n\tstatuses: boolean[];\n}\n";
        chai_1.expect(input).to.equal(output);
    });
    it("should convert mongoose 'type: [Date]' to TypeScript type 'Date[]'", function () {
        var input = generateInterface("DateListInterface", {
            dates: {
                type: [Date],
                required: true,
            },
        });
        var output = "interface IDateListInterface {\n\tdates: Date[];\n}\n";
        chai_1.expect(input).to.equal(output);
    });
    it("should convert mongoose 'type: [ObjectId]' to TypeScript type 'string[]'", function () {
        var input = generateInterface("ObjectIdListInterface", {
            ids: {
                type: [mongoose_1.Schema.Types.ObjectId],
                required: true,
            },
        });
        var output = "interface IObjectIdListInterface {\n\tids: string[];\n}\n";
        chai_1.expect(input).to.equal(output);
    });
    it("should convert mongoose 'type: [Mixed]' to TypeScript type '[{}]'", function () {
        var input = generateInterface("MixedListInterface", {
            id: {
                type: [mongoose_1.Schema.Types.Mixed],
                required: true,
            },
        });
        var output = "interface IMixedListInterface {\n\tid: {}[];\n}\n";
        chai_1.expect(input).to.equal(output);
    });
    it("should dynamically create any nested mongoose schemas as TypeScript interfaces", function () {
        var input = generateInterface("MainInterface", {
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
        var input = generateInterface("MainInterface", {
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
});
//# sourceMappingURL=generate-interface.spec.js.map