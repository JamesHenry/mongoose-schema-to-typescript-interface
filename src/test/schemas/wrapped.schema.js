const Schema = require('mongoose').Schema

const wrappedSchema = new Schema({
	age: {
		type: Number,
	},
}, {
	strict: true,
})

exports.name = 'wrapped'

exports.schema = wrappedSchema
