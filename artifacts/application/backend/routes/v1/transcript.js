const express = require('express');
const router = express.Router();
// const Schemas = require('../../libs/Schemas');
const transcriptsController = require('../../controllers/transcripts-controller');
const authGuardMiddleware = require('../../middleware/auth-guard');

router.get('/beta/:trxid', authGuardMiddleware, transcriptsController.betaFeature);
router.post('/beta', authGuardMiddleware, transcriptsController.betaPost);
router.post('/add-new-transcript', authGuardMiddleware, transcriptsController.addNewTranscriptForStudent);

module.exports = router;