const express = require('express');
const router = express.Router();
const Schemas = require('../../libs/Schemas');
const transcriptsController = require('../../controllers/transcripts-controller');
const authGuardMiddleware = require('../../middleware/auth-guard');
const validatorMiddleware = require('../../middleware/validator');

router.post('/new',
    authGuardMiddleware,
    validatorMiddleware(Schemas.transcript.newTranscript, 'body'),
    transcriptsController.addNewTranscriptForStudent
);

router.post('/detail',
    authGuardMiddleware,
    validatorMiddleware(Schemas.transcript.detail, 'body'),
    transcriptsController.showDetailTranscript
);

router.post('/history',
    authGuardMiddleware,
    validatorMiddleware(Schemas.transcript.history, 'body'),
    transcriptsController.historyTranscript
)

router.post('/update',
    authGuardMiddleware,
    validatorMiddleware(Schemas.transcript.updateTranscript, 'body'),
    transcriptsController.updateTranscript
)


// New Routes
// router.patch('/update-transcript', authGuardMiddleware, transcriptsController.betaPost);
// router.post('/delete-transcript', authGuardMiddleware, transcriptsController.betaPost);

module.exports = router;