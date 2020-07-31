const express = require('express');
const router = express.Router();
const controller = require('./../../controllers/roles');
const logger = require('./../../middlewares/logger');
const authentication = require('./../../middlewares/authentication');

router.route('/').post(controller.newRole);


module.exports = router;