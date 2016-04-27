import { expect }     from 'chai'
import {
	NEWLINE_CHAR,
	INDENT_CHAR,
	appendNewline,
	indent,
	indentEachLine,
	extendRefTypes,
} from '../utilities'

describe('utilities', () => {

	describe('appendNewline', () => {

		it('should append a newline character to the given string', () => {
			expect(appendNewline('test string')).to.equal('test string' + NEWLINE_CHAR)
		})

	})

	describe('indent', () => {

		it('should prepend an indent character to the given string', () => {
			expect(indent('test string')).to.equal(INDENT_CHAR + 'test string')
		})

	})

	describe('indentEachLine', () => {

		it('should prepend an indent character to each line of the given string', () => {

			expect(indentEachLine(`
test1
test2
test3
`
			)).to.equal(`
${INDENT_CHAR}test1
${INDENT_CHAR}test2
${INDENT_CHAR}test3
`
			)

		})

	})

	describe('extendRefTypes', () => {

		it('should scan the generated output for matching refs and extend the type annotation', () => {

			const refMapping = {
				'IMainInterface_propWithRef': 'OtherThing',
			}

			const generatedOutput = `interface OtherThing {
	foo: string;
}

interface IMainInterface {
	propWithRef: string;
	bar: number;
}

`
			const expected = `interface OtherThing {
	foo: string;
}

interface IMainInterface {
	propWithRef: string | OtherThing;
	bar: number;
}

`

			expect(extendRefTypes(generatedOutput, refMapping)).to.equal(expected)

		})

		it('should support prefixed and suffixed matches of the ref value', () => {

			const refMapping = {
				'IMainInterface_propWithRef': 'OtherThing',
			}

			const generatedOutput1 = `interface IOtherThing {
	foo: string;
}

interface IMainInterface {
	propWithRef: string;
	bar: number;
}

`
			const expected1 = `interface IOtherThing {
	foo: string;
}

interface IMainInterface {
	propWithRef: string | IOtherThing;
	bar: number;
}

`

const generatedOutput2 = `interface IOtherThingIMoreStuff {
	foo: string;
}

interface IMainInterface {
	propWithRef: string;
	bar: number;
}

`
			const expected2 = `interface IOtherThingIMoreStuff {
	foo: string;
}

interface IMainInterface {
	propWithRef: string | IOtherThingIMoreStuff;
	bar: number;
}

`

			expect(extendRefTypes(generatedOutput1, refMapping)).to.equal(expected1)

		})

	})

})
