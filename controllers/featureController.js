const mongoose = require("mongoose");
const Feature = require("../models/Feature");
const User = require("../models/User");
const logger = require("../logger/index");
const { FEATURE_CTRL } = require("../constant_message/constant");

// Helper function for logging and responding
function logAndResponse(message, status, res, req, service, data = null) {
  logger.info(message, {
    metaData: {
      path: req.path,
      service: service,
      method: req.method,
    },
  });
  return res.status(status).json({ message, data });
}

// ======================== Create Default Feature Settings ===============================
async function createDefaultFeatureSettings(user) {
  try {
    const defaultFeatures = new Feature({
      usbPolicy: false,
      taskManager: false,
      rightClick: false,
      systemSettings: false,
      internetAccess: false,
      gps: false,
      websiteBlocker: [],
      keyLogger: false,
      copyPaste: false,
      cameraSetting: false,
      forcefullyRestart: {
        enabled: false,
        dayInterval: 0,
        time: "00:00",
      },
      whiteListing: {
        proxyAddress: "127.0.0.1",
        port: 80,
        exception: [],
      },
    });

    await defaultFeatures.save();
    user.featureSettings = defaultFeatures._id;
    await user.save();

    return defaultFeatures;
  } catch (error) {
    logger.error(FEATURE_CTRL.ERROR_CREATING_FEATURE, {
      metaData: {
        path: req.path,
        service: "Feature_Controller",
        method: req.method,
      },
    });
    throw new Error("Error creating default feature settings");
  }
}

// ======================== Update Feature Settings ===============================
async function updateFeatureSettings(req, res) {
  const employeeId = req.params.employeeId;
  console.log("REQ<", employeeId);
  
  const {
    usbPolicy,
    rightClick,
    taskManager,
    systemSettings,
    internetAccess,
    gps,
    websiteBlocker,
    keyLogger,
    copyPaste,
    cameraSetting,
    forcefullyRestart,
    whiteListing,
  } = req.body;

  try {
    const user = await User.findOne({ employeeId });
    if (!user) {
      return logAndResponse(FEATURE_CTRL.USER_NOT_FOUND, 404, res, req, "Feature_Controller");
    }

    let featureSettings = await Feature.findOne({ user: user._id }) || await createDefaultFeatureSettings(user);
    
    // Update feature settings
    const updateFeature = (key, defaultValue) => {
      featureSettings[key] = req.body[key] !== undefined ? req.body[key] : defaultValue;
    };

    updateFeature("internetAccess", featureSettings.internetAccess);
    updateFeature("gps", featureSettings.gps);
    updateFeature("taskManager", featureSettings.taskManager);
    updateFeature("usbPolicy", featureSettings.usbPolicy);
    updateFeature("rightClick", featureSettings.rightClick);
    updateFeature("systemSettings", featureSettings.systemSettings);
    updateFeature("websiteBlocker", featureSettings.websiteBlocker);
    updateFeature("keyLogger", featureSettings.keyLogger);
    updateFeature("copyPaste", featureSettings.copyPaste);
    updateFeature("cameraSetting", featureSettings.cameraSetting);

    if (forcefullyRestart) {
      featureSettings.forcefullyRestart.enabled = forcefullyRestart.enabled !== undefined ? forcefullyRestart.enabled : featureSettings.forcefullyRestart.enabled;
      featureSettings.forcefullyRestart.dayInterval = forcefullyRestart.dayInterval !== undefined ? forcefullyRestart.dayInterval : featureSettings.forcefullyRestart.dayInterval;
      featureSettings.forcefullyRestart.time = forcefullyRestart.time !== undefined ? forcefullyRestart.time : featureSettings.forcefullyRestart.time;
    }

    if (whiteListing) {
      featureSettings.whiteListing.proxyAddress = whiteListing.proxyAddress !== undefined ? whiteListing.proxyAddress : featureSettings.whiteListing.proxyAddress;
      featureSettings.whiteListing.port = whiteListing.port !== undefined ? whiteListing.port : featureSettings.whiteListing.port;
      featureSettings.whiteListing.exception = whiteListing.exception !== undefined ? whiteListing.exception : featureSettings.whiteListing.exception;
    }

    await featureSettings.save();
    return logAndResponse(FEATURE_CTRL.FEATURE_SAVE, 200, res, req, "Feature_Controller", featureSettings);
  } catch (error) {
    console.error("Error updating feature settings:", error);
    return logAndResponse(FEATURE_CTRL.ERROR_UPDATING_FEATURE, 500, res, req, "Feature_Controller");
  }
}

// =============================== Get Feature Settings ==============================
async function getFeatureSettings(req, res) {
  const employeeId = req.params.employeeId;

  try {
    const user = await User.findOne({ employeeId });
    if (!user) {
      return logAndResponse(FEATURE_CTRL.USER_NOT_FOUND, 404, res, req, "Feature_Controller");
    }

    const featureSettings = await Feature.findOne({ user: user._id });
    if (!featureSettings) {
      return logAndResponse(FEATURE_CTRL.FEATURE_NOT_FOUND, 404, res, req, "Feature_Controller");
    }

    res.json({ featureSettings });
  } catch (error) {
    logger.error(FEATURE_CTRL.ERROR_GETTING_FEATURE, {
      metaData: {
        path: req.path,
        service: "Feature_Controller",
        method: req.method,
      },
    });
    console.error("Error getting feature settings:", error);
    return logAndResponse("Server Error", 500, res, req, "Feature_Controller");
  }
}


async function updateAllFeatureSettings(req, res) {
  try {
    // Ensure the user is authenticated and the userId is available in req.user (from verifyToken middleware)
    
    if (!req.user || !req.user.userId) {
      return logAndResponse(FEATURE_CTRL.USER_NOT_FOUND, 404, res, req, "Feature_Controller");
    }

    // Fetch the features to update for all users
    const {
      usbPolicy,
      rightClick,
      taskManager,
      systemSettings,
      internetAccess,
      gps,
      websiteBlocker,
      keyLogger,
      copyPaste,
      cameraSetting,
      forcefullyRestart,
      whiteListing,
    } = req.body;

    // Get all users (you might want to add filtering if needed, e.g., for admins)
    const users = await User.find({});
    if (users.length === 0) {
      return logAndResponse(FEATURE_CTRL.NO_USERS_FOUND, 404, res, req, "Feature_Controller");
    }

    // Iterate over each user to update their feature settings
    for (const user of users) {
      let featureSettings = await Feature.findOne({ user: user._id }) || await createDefaultFeatureSettings(user);

      // Function to update feature setting if defined in the request
      const updateFeature = (key, defaultValue) => {
        featureSettings[key] = req.body[key] !== undefined ? req.body[key] : defaultValue;
      };

      // Update the settings for the current user
      updateFeature("internetAccess", featureSettings.internetAccess);
      updateFeature("gps", featureSettings.gps);
      updateFeature("taskManager", featureSettings.taskManager);
      updateFeature("usbPolicy", featureSettings.usbPolicy);
      updateFeature("rightClick", featureSettings.rightClick);
      updateFeature("systemSettings", featureSettings.systemSettings);
      updateFeature("websiteBlocker", featureSettings.websiteBlocker);
      updateFeature("keyLogger", featureSettings.keyLogger);
      updateFeature("copyPaste", featureSettings.copyPaste);
      updateFeature("cameraSetting", featureSettings.cameraSetting);

      // Handle forcefullyRestart settings if provided
      if (forcefullyRestart) {
        featureSettings.forcefullyRestart.enabled = forcefullyRestart.enabled !== undefined ? forcefullyRestart.enabled : featureSettings.forcefullyRestart.enabled;
        featureSettings.forcefullyRestart.dayInterval = forcefullyRestart.dayInterval !== undefined ? forcefullyRestart.dayInterval : featureSettings.forcefullyRestart.dayInterval;
        featureSettings.forcefullyRestart.time = forcefullyRestart.time !== undefined ? forcefullyRestart.time : featureSettings.forcefullyRestart.time;
      }

      // Handle whiteListing settings if provided
      if (whiteListing) {
        featureSettings.whiteListing.proxyAddress = whiteListing.proxyAddress !== undefined ? whiteListing.proxyAddress : featureSettings.whiteListing.proxyAddress;
        featureSettings.whiteListing.port = whiteListing.port !== undefined ? whiteListing.port : featureSettings.whiteListing.port;
        featureSettings.whiteListing.exception = whiteListing.exception !== undefined ? whiteListing.exception : featureSettings.whiteListing.exception;
      }

      // Save the updated settings for this user
      await featureSettings.save();
    }

    // Return success message after all users are updated
    return logAndResponse(FEATURE_CTRL.FEATURE_SAVE, 200, res, req, "Feature_Controller", { message: 'Feature settings updated for all users' });

  } catch (error) {
    console.error("Error updating feature settings for all users:", error);
    return logAndResponse(FEATURE_CTRL.ERROR_UPDATING_FEATURE, 500, res, req, "Feature_Controller");
  }
}

// Utility function to create default feature settings for a user
async function createDefaultFeatureSettings(user) {
  const defaultSettings = {
    user: user._id,
    internetAccess: false,
    gps: false,
    taskManager: true,
    usbPolicy: true,
    rightClick: true,
    systemSettings: true,
    websiteBlocker: false,
    keyLogger: false,
    copyPaste: true,
    cameraSetting: true,
    forcefullyRestart: {
      enabled: false,
      dayInterval: 7,
      time: '03:00',
    },
    whiteListing: {
      proxyAddress: '',
      port: 8080,
      exception: [],
    },
  };
  const featureSettings = new Feature(defaultSettings);
  await featureSettings.save();
  return featureSettings;
}



module.exports = {
  updateFeatureSettings,
  getFeatureSettings,
  updateAllFeatureSettings,
};
