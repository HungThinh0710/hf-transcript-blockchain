const express = require('express');
const router = express.Router();

/**
 * ROUTE
 */
router.use('/test', require('./test'));
router.use('/transcripts', require('./transcript'));
router.use('/enrolls', require('./enroll'));
router.use('/auth', require('./authenticate'));

module.exports = router;