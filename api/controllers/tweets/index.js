const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Tweet = require('./../../models/tweets');

const getTweets = (req, res) =>{
    Tweet
    .find({})
    .populate('user', 'username')
    .populate('comments.user', 'username')
    .then((response)=>{
        res.status(200).send(response);
    })
    .catch((err)=>{
        res.sendStatus(500);
    })
};
const getTweet = (req, res) => {
    const id = req.params.id;
    Tweet
    .find({_id : id})
    .populate('user', 'username')
    .then((response)=>{
        res.status(200).send(response);
    })
    .catch((err)=>{
        res.sendStatus(500);
    })
};
const newTweet = (req, res) => {
    const tweet = {
        content: req.body.content,
        user: req.userId
    };
    
    if(tweet.content && tweet.user){
        const object = new Tweet(tweet);
        object.save()
        .then((response)=>{
            res.status(201).send(response);
        })
        .catch((err)=>{
            res.sendStatus(500);
        })
    }else{
        res.sendStatus(500);
    }
};

const deleteTweet = (req, res) => {
 let idTweet = req.body.idTweet; 
 Tweet.findByIdAndDelete(idTweet, (err, response) =>{
 if(err) res.status(500).send('Imposible eliminar el tweet');
 else res.status(202).send('Tweet eliminado');
 });
};

const newComment = (req, res) => {
    const tweet = req.body.tweet;
    const comment = {
        comment: req.body.comment,
        user: req.body.user
    };
    Tweet.updateOne({_id :tweet}, {$addToSet: {comments : comment}})
    .then(response=>{
        res.status(202).send(response);
    })
    .catch(err=>{
        res.status(500).send(err);
    })
};

const deleteComment = (req, res) => {
    let idTweet = req.body.idTweet;
    let idComment = req.body.idComment;
	
	
	Tweet.findByIdAndUpdate(idTweet,{ $pull: { 'comments': {  _id: idComment } } })
	.then(response=>{
        res.status(202).send('Comentario eliminado');
    })
    .catch(err=>{
        res.status(500).send('Imposible eliminar comentario');
    })
	
	
};

const lastTweets = (req, res) => {
    
	const num = parseInt(req.params.count); 
	if(num > 0){
		Tweet.find().sort({ _id: -1 }).limit(num).find(function(err, post) {
			if(err){
				return res.send(err);
			}
			return res.send(post);
		});
	}else{
		res.status(500).send('Limite invalido');
	}
};

const usersTopTweets = (req, res) => {
	
	const num = parseInt(req.params.count); 
	
	if(num > 0){
		Tweet.aggregate(
			[
				{
					$group: {
						_id : "$user",
						count: { $sum: 1 }
					}
				},
				{ 
					$sort: { 
						count: -1 
					} 
				},
				{ $limit : num }
			],function(err, result) {
				if (err) {
					res.send(err);
				} else {
					res.json(result);
				}
			}
		);
	}else{
		res.status(500).send('Limite invalido');
	}
		
};
 
const totalCommentsTweet  = (req, res) =>{
    const id = req.params.id;
    
     Tweet.aggregate([
       
		{ $match: { "_id": ObjectId(id) }},
        { $project: { comments: 1} },
        { $unwind: '$comments' }, 
        { $group: { 
               _id: "$_id" 
             , count: { $sum: 1 } 
           }
        }
		
     ], function(err, topTopics) {
         if(err){
             return res.send(err);
         }
         return res.send(topTopics);
     });
	
	
	
};

const commentsTopTweets = (req, res) => {

	const num = parseInt(req.params.count);

	if (num > 0) {
		Tweet.aggregate(
			[
				{
					$unwind: "$comments"
				},
				{
					$group: {
						_id: "$_id",
						content: { $first: "$content" },
						countComments: { $sum: 1 }
					}
				},
				{
					$sort: {
						countComments: -1
					}
				},
				{
					$limit: num
				}
			], function (err, result) {
				if (err) {
					res.send(err);
				} else {
					res.json(result);
				}
			}
		);
	} else {
		res.status(500).send('Limite invalido');
	}

};


module.exports = {getTweets, getTweet, newTweet, deleteTweet, newComment, deleteComment, lastTweets, usersTopTweets, totalCommentsTweet, commentsTopTweets};

