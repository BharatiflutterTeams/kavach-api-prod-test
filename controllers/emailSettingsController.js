const EmailSettings = require("../models/EmailSettings");
const User = require("../models/User");
const logger = require("../logger/index");
const { EMAIL_SETT_CTRL } = require("../constant_message/constant");

// Helper function for logging and responding
function logAndRespond(message, status, res, req, service, data = null) {
  logger.info(message, {
    metaData: {
      path: req.path,
      service,
      method: req.method,
    },
  });
  return res.status(status).json({ message, data });
}

// ========================== GET EMAIL SETTINGS ================================
async function getEmailSettingsForUser(req, res) {
  const { employeeId } = req.params;

  try {
    const user = await User.findOne({ employeeId });
    if (!user) return logAndRespond(EMAIL_SETT_CTRL.USER_NOT_FOUND, 404, res, req, "EmailSetting_Controller");

    const settings = await EmailSettings.findOne({ authorizedUser: user._id }).populate("authorizedUser", "name email");
    if (!settings) return logAndRespond(EMAIL_SETT_CTRL.EMAIL_SETT_NOT_FOUND, 404, res, req, "EmailSetting_Controller");

    return logAndRespond("Success", 200, res, req, "EmailSetting_Controller", settings);
  } catch (error) {
    logAndRespond(EMAIL_SETT_CTRL.SERVER_ERROR, 500, res, req, "EmailSetting_Controller");
  }
}

// ======================= SET EMAIL SETTINGS =============================
async function setEmailSettingsForUser(req, res) {
  const { employeeId } = req.params;
  const { senderEmail, password, receiverEmail, ccEmail, screenshotInterval, screenshotDays, date, startTime, endTime } = req.body;

  try {
    const user = await User.findOne({ employeeId });
    if (!user) return logAndRespond(EMAIL_SETT_CTRL.USER_NOT_FOUND, 404, res, req, "EmailSetting_Controller");

    const existingSettings = await EmailSettings.findOne({ authorizedUser: user._id });
    if (existingSettings) return logAndRespond(EMAIL_SETT_CTRL.EMAIL_SETT_ALREADY_EXIST, 400, res, req, "EmailSetting_Controller");

    const settings = new EmailSettings({
      senderEmail,
      password,
      receiverEmail,
      ccEmail,
      screenshotInterval,
      screenshotDays,
      date,
      startTime,
      endTime,
      authorizedUser: user._id,
    });

    await settings.save();
    return logAndRespond(EMAIL_SETT_CTRL.EMAIL_SETT_CREATED_SUCCESSFULLY, 201, res, req, "EmailSetting_Controller", settings);
  } catch (error) {
    logAndRespond(EMAIL_SETT_CTRL.SERVER_ERROR, 500, res, req, "EmailSetting_Controller");
  }
}

// ============================ UPDATE EMAIL SETTINGS ===========================
async function updateEmailSettingsForUser(req, res) {
  const { employeeId } = req.params;
  const updateData = req.body;

  try {
    const user = await User.findOne({ employeeId });
    if (!user) return logAndRespond(EMAIL_SETT_CTRL.USER_NOT_FOUND, 404, res, req, "EmailSetting_Controller");

    const updatedSettings = await EmailSettings.findOneAndUpdate(
      { authorizedUser: user._id },
      { $set: updateData },
      { new: true }
    );

    if (!updatedSettings) return logAndRespond(EMAIL_SETT_CTRL.EMAIL_SETT_NOT_FOUND, 404, res, req, "EmailSetting_Controller");

    return logAndRespond(EMAIL_SETT_CTRL.EMAIL_SETT_UPDATED_SUCCESSFULLY, 200, res, req, "EmailSetting_Controller", updatedSettings);
  } catch (error) {
    logAndRespond(EMAIL_SETT_CTRL.SERVER_ERROR, 500, res, req, "EmailSetting_Controller");
  }
}

async function updateEmailSettingsForAllUsers(req, res) {
  const updateData = req.body;

  try {
    // Find all users
    const users = await User.find({});
    if (!users || users.length === 0) {
      return logAndRespond(EMAIL_SETT_CTRL.NO_USERS_FOUND, 404, res, req, "EmailSetting_Controller");
    }

    // Iterate over all users and update their email settings
    const updatedSettingsPromises = users.map(async (user) => {
      const updatedSettings = await EmailSettings.findOneAndUpdate(
        { authorizedUser: user._id },
        { $set: updateData },
        { new: true }
      );

      // If no email settings were found for the user, log it and skip updating
      if (!updatedSettings) {
        logAndRespond(EMAIL_SETT_CTRL.EMAIL_SETT_NOT_FOUND, 404, res, req, "EmailSetting_Controller", user._id);
        return; // Skip this user
      }

      return updatedSettings; // Return the updated settings if successful
    });

    // Wait for all updates to complete
    const updatedSettingsResults = await Promise.all(updatedSettingsPromises);

    // Send only one response after all updates are complete
    return logAndRespond(
      EMAIL_SETT_CTRL.EMAIL_SETT_UPDATED_SUCCESSFULLY_FOR_ALL,
      200,
      res,
      req,
      "EmailSetting_Controller",
      updatedSettingsResults
    );
  } catch (error) {
    console.error(error); // Optional: log the error for debugging
    return logAndRespond(EMAIL_SETT_CTRL.SERVER_ERROR, 500, res, req, "EmailSetting_Controller");
  }
}



// ============================ DELETE USER EMAIL SETTINGS ========================
async function deleteUser(req, res) {
  const { employeeId } = req.params;

  try {
    const user = await User.findOne({ employeeId });
    if (!user) return logAndRespond(EMAIL_SETT_CTRL.USER_NOT_FOUND, 404, res, req, "EmailSetting_Controller");

    await EmailSettings.deleteOne({ authorizedUser: user._id });
    return logAndRespond(EMAIL_SETT_CTRL.EMAIL_SETT_DELETED, 200, res, req, "EmailSetting_Controller");
  } catch (error) {
    logAndRespond(EMAIL_SETT_CTRL.SERVER_ERROR, 500, res, req, "EmailSetting_Controller");
  }
}

module.exports = {
  getEmailSettingsForUser,
  setEmailSettingsForUser,
  updateEmailSettingsForUser,
  updateEmailSettingsForAllUsers,
  deleteUser,
};
