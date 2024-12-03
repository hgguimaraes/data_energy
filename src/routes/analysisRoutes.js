const express = require('express');
const { getAnalysis } = require('../controllers/analysisController');

const router = express.Router();

router.get('/', getAnalysis);

module.exports = router;