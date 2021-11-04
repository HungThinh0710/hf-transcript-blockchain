const express = require('express');
const router = express.Router();
// const validatorMiddleware = require('../../middleware/Validator');
// const authGuardMiddleware = require('../../middleware/AuthGuard');
// const adminGuardMiddleware = require('../../middleware/AdminGuard');
// const Schemas = require('../../libs/Schemas');
const testController = require('../../controllers/test-controller');

router.get('/', testController.test);

module.exports = router;