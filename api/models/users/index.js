const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collection = 'users';

const userSchema = new Schema({
    name:           { type: String, required: true },
    age:            { type: Number, required: true },
    username:       { type: String, required: true , unique:true},
    password:       { type: String, required: true },
    email:          { type: String, required: true , unique:true},
	birthdate: 		{ type: String, required:true  },	//2020-02-01
    telephones:     { type: Array, required: false },
    role_ids:           [{ type: Schema.ObjectId, ref: "roles" }]
}, { timestamps: true});

const User = mongoose.model(collection, userSchema);
module.exports = User;