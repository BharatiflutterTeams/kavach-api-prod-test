const express = require('express');
const router = express.Router();
const { getInternetHistory } = require('../controllers/internetHistory'); 

router.get('/:employeeId', getInternetHistory);

module.exports = router;
