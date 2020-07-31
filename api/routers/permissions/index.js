const express = require('express');
const router = express.Router();
const controller = require('./../../controllers/permissions');
const logger = require('./../../middlewares/logger');
const authentication = require('./../../middlewares/authentication');

router.route('/').post(controller.newPermission);


module.exports = router;