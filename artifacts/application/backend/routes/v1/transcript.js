const express = require('express');
const router = express.Router();
const Schemas = require('../../libs/Schemas');
const transcriptsController = require('../../controllers/transcripts-controller');
const authGuardMiddleware = require('../../middleware/auth-guard');
const validatorMiddleware = require('../../middleware/validator');

router.get('/beta/:trxid', authGuardMiddleware, transcriptsController.betaFeature);
router.post('/beta', authGuardMiddleware, transcriptsController.betaPost);

router.post('/new-transcript',
    authGuardMiddleware,
    validatorMiddleware(Schemas.transcript.newTranscript, 'body'),
    transcriptsController.addNewTranscriptForStudent
);

// New Routes
// router.patch('/update-transcript', authGuardMiddleware, transcriptsController.betaPost);
// router.post('/delete-transcript', authGuardMiddleware, transcriptsController.betaPost);

module.exports = router;