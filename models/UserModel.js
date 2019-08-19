const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		lowercase: true,
	},
	password: {
		type: String,
		required: true,
		select: false,
	},
});

module.exports = mongoose.model('User', UserSchema);