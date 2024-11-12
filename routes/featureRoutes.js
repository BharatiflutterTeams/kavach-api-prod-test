const express = require("express");
const router = express.Router();
const { updateFeatureSettings, getFeatureSettings } = require("../controllers/featureController");
const { verifyToken } = require("../middleware/authMiddleware");


router.put("/features/:employeeId", verifyToken, updateFeatureSettings);
router.get("/features/:employeeId", verifyToken, getFeatureSettings);

router.get("/feature/:employeeId", getFeatureSettings);

module.exports = router;
