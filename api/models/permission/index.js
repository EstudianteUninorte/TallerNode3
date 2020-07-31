const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collection = 'permissions';

const permissionSchema = new Schema({
    nombrepermiso:           { type: String, required: true },
    codigopermiso:       { type: String, required: true }
}, { timestamps: true});

const Permission = mongoose.model(collection, permissionSchema);
module.exports = Permission;