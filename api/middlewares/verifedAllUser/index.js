const jwt = require('jsonwebtoken');
const config = require('./../../../config');
const User = require('./../../models/users');
const Role = require('./../../models/users');
const Tweet  = require('./../../models/tweets');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


const verifedAllUser = (req, res, next) => {
		const token = req.headers["x-access-token"];
	
    const permissionId = config.idAllUser;

		jwt.verify(token, config.tokenKey, (err, decoded) =>{
			if(err){
				res.sendStatus(401);
			}else{
				const id = decoded.id;
				
				const resultFind = User.findOne({_id: id})
				.populate('role_ids')
				.exec(function (err, roles) { 
					if (err){
						res.sendStatus(500);
					}else{
						var access = false;
						roles.role_ids.forEach(element => {
							element.permission_ids.forEach(permission => {
								if(permission == permissionId){
									access = true;
								}
							});
						});
						if(access){
							next();
						}else{
							console.log(access);
							res.sendStatus(401);
						}
					}
				});
				
				const getResponse = () => {
					return new Promise((resolve, reject)=>{
						resolve(resultFind);
					});
				}
				
				getResponse();
				// const getResponse = () => {
					// return new Promise((resolve, reject)=>{
						// if(access){
							// next();
						// }else{
							// console.log(access);
							// res.sendStatus(401);
						// }
					// });
				// } 
			}
		});
};	


module.exports = verifedAllUser;

const verifedDeleteTweet = (req, res, next) => {
	const token = req.headers["x-access-token"];

	const permissionId = config.idAllUser;

	jwt.verify(token, config.tokenKey, (err, decoded) =>{
		if(err){
			res.sendStatus(401);
		}else{
			const idUser = decoded.id;
			//let idTweet = req.params.idTweet;
			let idTweet = req.body.idTweet;
			Tweet.findOne({"user": idUser, _id: idTweet} , (err, response) => {
				if (err) { 
					res.status(500).send("Error al consultar tweet del usuario"); 		
				}else {
					if(response  != null){
						next();
					}else{
						res.status(404).send('No encontrado');
					}
				}
			});
		};
	});
};	


module.exports = {verifedAllUser, verifedDeleteTweet}