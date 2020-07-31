const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collection = 'roles';

const roleSchema = new Schema({
    roleName:           { type: String, required: true },
    permission_ids: [{ type: Schema.ObjectId, ref: "permissions" }]
}, { timestamps: true});

const Role = mongoose.model(collection, roleSchema);
module.exports = Role;