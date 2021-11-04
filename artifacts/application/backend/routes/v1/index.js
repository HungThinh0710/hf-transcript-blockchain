const express = require('express');
const router = express.Router();

/**
 * ROUTE
 */
router.use('/test', require('./test'));
router.use('/transcripts', require('./transcript'));

module.exports = router;