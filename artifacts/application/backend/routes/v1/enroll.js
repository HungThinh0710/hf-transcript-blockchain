const express = require('express');
const router = express.Router();
const enrollController = require('../../controllers/enroll-controller');
const Schemas = require('../../libs/Schemas');
const validatorMiddleware = require('../../middleware/validator');

router.post('/enroll-admin', 
    validatorMiddleware(Schemas.enroll.enrollAdmin, 'body'),
    enrollController.enrollAdmin
); //Not for user

router.post('/register-user', enrollController.registerUser);

module.exports = router;