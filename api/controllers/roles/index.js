const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Role = require('./../../models/role');


const newRole = (req, res) => {
    const data = {
        roleName: req.body.roleName,
        permission_ids: req.body.permission_ids
    };
    const object = new Role(data);
    object.save()
        .then((response)=>{
            res.status(201).send(response);
        })
        .catch((err)=>{
            res.sendStatus(err);
        })
};

module.exports = {newRole};