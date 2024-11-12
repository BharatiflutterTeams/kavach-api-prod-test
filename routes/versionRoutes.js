const express = require("express");
const router = express.Router();
const { getVersion, updateVersion} = require("../controllers/versionController");
 
router.patch("/", updateVersion);
 
router.get("/", getVersion);
 
module.exports = router;