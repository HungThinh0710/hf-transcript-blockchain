const express = require('express');
const router = express.Router();
const enrollController = require('../../controllers/enroll-controller');

router.post('/enroll-admin', enrollController.enrollAdmin); //Not for user
router.post('/register-user', enrollController.registerUser);

module.exports = router;