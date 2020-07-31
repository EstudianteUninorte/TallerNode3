const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const User = require('./../../models/users');
const Tweet = require('./../../models/tweets');
const bcrypt = require('bcryptjs');
const cryptojs = require('crypto-js');
const jwt = require('jsonwebtoken');
const config = require("./../../../config");
const validatePwd = require('./../../functions/pws');

const decrypt = (data) =>{
	var bytes  = cryptojs.AES.decrypt(data, 'secret key 123');
	var originalText = bytes.toString(cryptojs.enc.Utf8);
	return originalText;
}

const loginUser = (req, res) => {
	const user = {
		username: req.body.username,
		password: req.body.password
	};
	
	User.findOne({username:user.username},["password"]).then(response => {
		const password = response.password;
		if(bcrypt.compareSync(user.password, password)){ 
			var token = jwt.sign({ id: response._id}, config.tokenKey); //Backdate a jwt 30 seconds
			res.status(200).json({id:response._id, username: user.username, token:token}) 
		}else{
			res.sendStatus();
		}
		
	}).catch(err=>{
		res.sendStatus(err);
	});
}


const getAll = (req, res) =>{
    User.find({}, ["name", "username", "password", "birthdate"])
    .then((response)=>{
        res.status(200).send(response);
    })
    .catch((err)=>{
        res.sendStatus(500);
    })
};
const getUser = (req, res) => {
    const id = req.params.id;
    User.find({_id : id}, ["name", "username", "birthdate"])
    .then((response)=>{
		
		const user = {
			name: response[0].name,
			username: response[0].username,
			birthdate: decrypt(response[0].birthdate)
		}
        res.status(200).send(user);
    })
    .catch((err)=>{
        res.sendStatus(500);
    })
};
const newUser = (req, res) => {
	
	if(validatePwd(req.body.password)){

		const saltRounds = 10;
		const salt = bcrypt.genSaltSync(saltRounds);
		const password = bcrypt.hashSync(req.body.password, salt);
		
		const birthdate = cryptojs.AES.encrypt(req.body.birthdate, 'secret key 123').toString();
		
		const user = {
			name: req.body.name, 
			age: req.body.age,
			username: req.body.username,
			password: password,
			email: req.body.email,
			birthdate:birthdate,
			telephone: req.body.telephone,
			role_ids: req.body.role_ids
		}; 
		
		if(user.name && user.age && user.username && user.password && user.email){
			
			User.find( { $or:[ {'username':user.username}, {'email':user.email}]})
			.then((response)=>{
				if(response.length > 0){
					res.status(500).send("Ya existe un registro con estos datos");
				}else{
					const object = new User(user);
					object.save()
					.then((response)=>{
						res.status(201).send(response._id);
					})
					.catch((err)=>{
						res.sendStatus(500);
					})
				}
			
			}).catch((err)=>{
				res.sendStatus(500);
			});
			
		}else{
			res.sendStatus(500);
		}
	
	}else{
		res.status(401).send('El password no cumple con las medidas de seguridad basica');
	}
};

const updateUser = (req, res) => {
	const id = req.params.id;

	User.updateOne({_id:id}, req.body, function(err,result){
		if (err) {
			res.status(500).send("Imposible actualizar el registro");
		} else {
			res.status(200).send("Registro Actualizado");
		}
	});
		
};

const deleteUser = (req, res) => {

	User.findOneAndDelete({_id: req.body.id}).then(response=>{
        res.status(202).send('Usuario eliminado');
    })
    .catch(err=>{
        res.status(500).send('Imposible eliminar usuario');
    });
};

const getTweetsByUser = (req, res) => {
    let id = req.params.id; 
    Tweet.find({ 'user': id }, (err, response) => {
    if (err) { res.status(500).send("Error al consultar tweet del usuario"); console.log(err); }
    
    else res.status(200).send(response);
    });
   };

   const totalTweetsbyUser = (req, res) => {
	const id = req.body.id;


	User.aggregate([
	{ $match: { "_id": ObjectId(id) }},
	   { $group: {_id: "$_id" , count: { $sum: 1 } }},
	   {
		 $lookup:
		   {
			 from: "tweets",
			 localField: "_id",
			 foreignField: "user",
			 as: "tweets"
		   }
	  },
		//{ $match: { "_id": ObjectId(id) }},
		{ $project: { tweets: 1} },
        { $unwind: '$tweets' }, 
        { $group: { 
               _id: "$_id" 
             , count: { $sum: 1 } 
           }
        }
	  
	],function(err, result) {
		if (err) {
			res.send(err);
		} else {
			res.json(result);
		}
	})
		
}; 



module.exports = {getAll, getUser, newUser, updateUser, deleteUser, getTweetsByUser,totalTweetsbyUser, loginUser};