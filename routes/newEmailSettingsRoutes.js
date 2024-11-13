const express = require("express");
const router = express.Router();

const { createEmailSettings, getEmailSettings,updateEmailSettings } = require("../controllers/newEmailSettings");

router.get("/emailSettings", getEmailSettings);
router.post("/emailSettings", createEmailSettings);
router.put("/emailSettings", updateEmailSettings);

module.exports = router;
