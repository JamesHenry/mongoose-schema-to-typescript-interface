import { Schema } from 'mongoose'
import { expect } from 'chai'

const generateInterface = require('./generate-interface.js').default

describe( 'generate-interface', () => {

	it( 'should return a stringified TypeScript interface', () => {

		const input = generateInterface('EmptyInterface', {})
		const output = `
interface EmptyInterface {
}`

		expect(input).to.equal(output)

	})

	it( `should use TypeScript type 'string' for mongoose type ObjectId`, () => {

		const input = generateInterface('ObjectIdInterface', {
			id: {
				type: Schema.Types.ObjectId,
				required: true,
			},
		})
		const output = `
interface ObjectIdInterface {
	id: string;
}`

		expect(input).to.equal(output)

	})

	it(`should use convert mongoose 'required: false' to '?' TypeScript interface syntax`, () => {

		const input = generateInterface('OptionalPropInterface', {
			id: {
				type: Schema.Types.ObjectId,
				required: false,
			},
		})
		const output = `
interface OptionalPropInterface {
	id?: string;
}`

		expect(input).to.equal(output)

	})

})
