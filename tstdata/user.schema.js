exports.name = 'User'

exports.schema = {
	name: {
		type: String,
		required: true,
	},
	age: {
		type: Number,
		required: true,
	},
	gender: {
		type: String,
		enum: [ 'male', 'female' ],
		required: true,
	},
	email: {
		type: String,
	},
}
