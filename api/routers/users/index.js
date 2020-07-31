const express = require('express');
const router = express.Router();
const controller = require('./../../controllers/users');
const logger = require('./../../middlewares/logger');
const verifedAllUser = require('./../../middlewares/verifedAllUser');

router.route('/')
    .get(verifedAllUser,controller.getAll)
    .post(logger,controller.newUser)
    .delete(logger,controller.deleteUser);

router.route('/:id')
    .get(controller.getUser)
    .put(logger, controller.updateUser);

router.route('/login').post(logger, controller.loginUser);

router.route('/tweets/count').get(controller.totalTweetsbyUser);

router.route('/:id/tweets').get(controller.getTweetsByUser);



module.exports = router;