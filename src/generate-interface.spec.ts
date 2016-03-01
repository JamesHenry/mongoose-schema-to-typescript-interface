import { Schema }        from 'mongoose'
import { expect }        from 'chai'
import generateInterface from './generate-interface'

describe(`generateInterface`, () => {

	it(`should return a stringified TypeScript interface`, () => {

		const input = generateInterface(`EmptyInterface`, {})
		const output = `interface IEmptyInterface {}
`

		expect(input).to.equal(output)

	})

	it(`should convert mongoose 'type: ObjectId' to TypeScript type 'string'`, () => {

		const input = generateInterface(`ObjectIdInterface`, {
			id: {
				type: Schema.Types.ObjectId,
				required: true,
			},
		})

		const output = `interface IObjectIdInterface {
	id: string;
}
`

		expect(input).to.equal(output)

	})

	it(`should convert mongoose 'required: false' to TypeScript optional property syntax`, () => {

		const input = generateInterface(`OptionalPropInterface`, {
			id: {
				type: Schema.Types.ObjectId,
				required: false,
			},
		})

		const output = `interface IOptionalPropInterface {
	id?: string;
}
`

		expect(input).to.equal(output)

	})

	it(`should convert mongoose 'type: Mixed' to TypeScript type '{}'`, () => {

		const input = generateInterface(`MixedInterface`, {
			id: {
				type: Schema.Types.Mixed,
				required: true,
			},
		})

		const output = `interface IMixedInterface {
	id: {};
}
`

		expect(input).to.equal(output)

	})

	it(`should convert mongoose 'type: String' to TypeScript type 'string'`, () => {

		const input = generateInterface(`NameStringInterface`, {
			name: {
				type: String,
				required: true,
			},
		})

		const output = `interface INameStringInterface {
	name: string;
}
`

		expect(input).to.equal(output)

	})

	it(`should convert mongoose 'type: String' and 'enum: [...]' to TypeScript 'string literal type'`, () => {

		const input = generateInterface(`StringOptionsInterface`, {
			chosen_letter: {
				type: String,
				enum: ['a', 'b', 'c'],
				required: true,
			},
		})

		const output = `interface IStringOptionsInterface {
	chosen_letter: 'a' | 'b' | 'c';
}
`

		expect(input).to.equal(output)

	})

	it(`should convert mongoose 'type: Number' to TypeScript type 'number'`, () => {

		const input = generateInterface(`AgeNumberInterface`, {
			age: {
				type: Number,
				required: true,
			},
		})

		const output = `interface IAgeNumberInterface {
	age: number;
}
`

		expect(input).to.equal(output)

	})

	it(`should convert mongoose 'type: Number' to TypeScript type 'number'`, () => {

		const input = generateInterface(`AgeNumberInterface`, {
			age: {
				type: Number,
				required: true,
			},
		})

		const output = `interface IAgeNumberInterface {
	age: number;
}
`

		expect(input).to.equal(output)

	})

	it(`should convert mongoose 'type: Boolean' to TypeScript type 'boolean'`, () => {

		const input = generateInterface(`EnabledBooleanInterface`, {
			enabled: {
				type: Boolean,
				required: true,
			},
		})

		const output = `interface IEnabledBooleanInterface {
	enabled: boolean;
}
`

		expect(input).to.equal(output)

	})

	it(`should convert mongoose 'type: Date' to TypeScript type 'Date'`, () => {

		const input = generateInterface(`StartInterface`, {
			start: {
				type: Date,
				required: true,
			},
		})

		const output = `interface IStartInterface {
	start: Date;
}
`

		expect(input).to.equal(output)

	})

	it(`should convert mongoose 'type: []' to TypeScript type 'any[]'`, () => {

		const input = generateInterface(`AnyListInterface`, {
			stuff: {
				type: [],
				required: true,
			},
		})

		const output = `interface IAnyListInterface {
	stuff: any[];
}
`

		expect(input).to.equal(output)

	})

	it(`should convert mongoose 'type: [Number]' to TypeScript type 'number[]'`, () => {

		const input = generateInterface(`NumberListInterface`, {
			list: {
				type: [Number],
				required: true,
			},
		})

		const output = `interface INumberListInterface {
	list: number[];
}
`

		expect(input).to.equal(output)

	})

	it(`should convert mongoose 'type: [String]' to TypeScript type 'string[]'`, () => {

		const input = generateInterface(`NameListInterface`, {
			names: {
				type: [String],
				required: true,
			},
		})

		const output = `interface INameListInterface {
	names: string[];
}
`

		expect(input).to.equal(output)

	})

	it(`should convert mongoose 'type: [Boolean]' to TypeScript type 'boolean[]'`, () => {

		const input = generateInterface(`StatusListInterface`, {
			statuses: {
				type: [Boolean],
				required: true,
			},
		})

		const output = `interface IStatusListInterface {
	statuses: boolean[];
}
`

		expect(input).to.equal(output)

	})

	it(`should convert mongoose 'type: [Date]' to TypeScript type 'Date[]'`, () => {

		const input = generateInterface(`DateListInterface`, {
			dates: {
				type: [Date],
				required: true,
			},
		})

		const output = `interface IDateListInterface {
	dates: Date[];
}
`

		expect(input).to.equal(output)

	})

	it(`should convert mongoose 'type: [ObjectId]' to TypeScript type 'string[]'`, () => {

		const input = generateInterface(`ObjectIdListInterface`, {
			ids: {
				type: [Schema.Types.ObjectId],
				required: true,
			},
		})

		const output = `interface IObjectIdListInterface {
	ids: string[];
}
`

		expect(input).to.equal(output)

	})

	it(`should convert mongoose 'type: [Mixed]' to TypeScript type '[{}]'`, () => {

		const input = generateInterface(`MixedListInterface`, {
			id: {
				type: [Schema.Types.Mixed],
				required: true,
			},
		})

		const output = `interface IMixedListInterface {
	id: {}[];
}
`

		expect(input).to.equal(output)

	})

	it(`should dynamically create any nested mongoose schemas as TypeScript interfaces`, () => {

		const input = generateInterface(`MainInterface`, {
			nested: {
				stuff: {
					type: String,
					required: false,
				},
			},
		})

		const output = `interface INested {
	stuff?: string;
}

interface IMainInterface {
	nested: INested;
}
`

		expect(input).to.equal(output)

	})

	it(`should format nested schema names as TitleCase`, () => {

		const input = generateInterface(`MainInterface`, {
			snake_case: {
				stuff: {
					type: String,
					required: false,
				},
			},
		})

		const output = `interface ISnakeCase {
	stuff?: string;
}

interface IMainInterface {
	snake_case: ISnakeCase;
}
`

		expect(input).to.equal(output)

	})

	it(`should support multiple schema fields on newlines`, () => {

		const input = generateInterface(`MultipleFieldsInterface`, {
			field1: {
				type: String,
				required: true,
			},
			field2: {
				type: String,
				required: true,
			},
		})

		const output = `interface IMultipleFieldsInterface {
	field1: string;
	field2: string;
}
`

		expect(input).to.equal(output)

	})

})
