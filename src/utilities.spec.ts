import { expect }     from 'chai'
import {
	NEWLINE_CHAR,
	INDENT_CHAR,
	appendNewline,
	indent,
	indentEachLine
} from './utilities'

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

})
