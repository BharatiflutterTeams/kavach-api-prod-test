const express = require('express');
const router = express.Router();
const { getDownloadHistory } = require('../controllers/downloadHistory'); 

router.get('/:employeeId', getDownloadHistory);

module.exports = router;
