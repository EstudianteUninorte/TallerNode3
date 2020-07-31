const express = require('express');
const router = express.Router();
const controller = require('./../../controllers/tweets');
const logger = require('./../../middlewares/logger');
const authentication = require('./../../middlewares/authentication');


router.route('/')
    .get(authentication,controller.getTweets)
    .post(authentication,controller.newTweet)
    .delete(authentication,controller.deleteTweet);

router.route('/comment').post(authentication,controller.newComment);
router.route('/:id').get(authentication,controller.getTweet);

router.route('/comments').delete(authentication,controller.deleteComment);
router.route('/lasts/:count').get(authentication,controller.lastTweets);
router.route('/top/commenters/:count').get(authentication,controller.usersTopTweets);
router.route('/:id/comments/count').get(authentication,controller.totalCommentsTweet);
router.route('/top/:count').get(authentication,controller.commentsTopTweets);

module.exports = router;