const expect = require('chai').expect
const generateInterface = require('./generate-interface.js')

describe( 'generate-interface', () => {

	it( 'should return a stringified TypeScript interface', () => {

		const input = generateInterface('EmptyInterface', {})
		const output = `
interface EmptyInterface {
}`

		expect(input).to.equal(output)

	})

})
