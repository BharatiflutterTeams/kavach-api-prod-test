const express = require("express");
const router = express.Router();
const {
  getEmailSettingsForUser,
  setEmailSettingsForUser,
  updateEmailSettingsForUser,
  deleteUser,
} = require("../controllers/emailSettingsController");
const { verifyToken } = require("../middleware/authMiddleware");

// Grouped routes for email settings with middleware
router.route("/email/:employeeId")
  .get(verifyToken, getEmailSettingsForUser)    // Get email settings
  .post(verifyToken, setEmailSettingsForUser)   // Create email settings
  .put(verifyToken, updateEmailSettingsForUser) // Update email settings
  .delete(verifyToken, deleteUser);             // Delete email settings

module.exports = router;
