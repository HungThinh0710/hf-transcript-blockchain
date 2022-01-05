const express = require('express');
const router = express.Router();
const mspidsController = require('../../controllers/mspids-controller');

router.post('/', mspidsController.getMsPids);

module.exports = router;