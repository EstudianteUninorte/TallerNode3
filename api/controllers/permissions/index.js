const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Permission = require('./../../models/permission');


const newPermission = (req, res) => {
    const data = {
        nombrepermiso: req.body.nombrepermiso,
        codigopermiso: req.body.codigopermiso
    };
    console.log(data);
    const object = new Permission(data);
    object.save()
        .then((response)=>{
            res.status(201).send(response);
        })
        .catch((err)=>{
            res.sendStatus(500);
        })
};

module.exports = {newPermission};
