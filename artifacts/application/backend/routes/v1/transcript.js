const express = require('express');
const router = express.Router();
// const Schemas = require('../../libs/Schemas');
const transcriptsController = require('../../controllers/transcripts-controller');

router.get('/beta/:trxid', transcriptsController.betaFeature);
router.post('/add-new-transcript', transcriptsController.addNewTranscriptForStudent);

module.exports = router;