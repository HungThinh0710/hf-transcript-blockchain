const express = require('express');
const router = express.Router();
const authGuardMiddleware = require('../../middleware/auth-guard');
const authenticateController = require('../../controllers/authenticate-controller');

router.post('/login', authenticateController.login);

module.exports = router;