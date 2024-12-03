const express = require('express');
const { processBill, getBill } = require('../controllers/billController');

const router = express.Router();

router.post('/', processBill);
router.get('/:id', getBill);

module.exports = router;