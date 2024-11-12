// const User = require("../models/User");
// const Location = require("../models/Location");
// const { logAndRespond } = require("../utils/responseUtils");
// const logger = require("../logger/index");

// const saveLocation = async (req, res) => {
//   const { employeeId, latitude, longitude } = req.body;

//   console.log("data >>>", employeeId, latitude, longitude);

//   // Logging the received request
//   logger.info("Received request to save location data.", {
//     metaData: {
//       Path: req.path,
//       Service: "Location_service",
//       Method: req.method,
//       employeeId,
//       latitude,
//       longitude,
//     },
//   });

//   // Validate required fields
//   if (!employeeId || !latitude || !longitude) {
//     return logAndRespond(
//       "Missing required fields",
//       400,
//       res,
//       req,
//       "Location_service"
//     );
//   }

//   try {
//     // Find user by employeeId field
//     const user = await User.findOne({ employeeId });
//     if (!user) {
//       return logAndRespond("User not found", 404, res, req, "Location_service");
//     }

//     // Check if a location entry already exists for the user
//     const existingLocation = await Location.findOne({ employeeId: user._id });

//     if (existingLocation) {
//       // Update the existing location
//       existingLocation.latitude = latitude;
//       existingLocation.longitude = longitude;
//       await existingLocation.save();

//       logger.info("Location updated successfully.", {
//         metaData: {
//           Path: req.path,
//           Service: "Location_service",
//           Method: req.method,
//           employeeId,
//         },
//       });

//       return logAndRespond(
//         "Location updated successfully!",
//         200,
//         res,
//         req,
//         "Location_service"
//       );
//     } else {
//       // Create a new location entry if none exists
//       const newLocation = new Location({
//         employeeId: user._id,
//         latitude,
//         longitude,
//       });
//       await newLocation.save();

//       // Optionally update the user's last known location
//       user.lastLocation = { latitude, longitude };
//       await user.save();

//       logger.info("Location saved successfully.", {
//         metaData: {
//           Path: req.path,
//           Service: "Location_service",
//           Method: req.method,
//           employeeId,
//         },
//       });

//       return logAndRespond(
//         "Location saved successfully!",
//         200,
//         res,
//         req,
//         "Location_service"
//       );
//     }
//   } catch (error) {
//     logger.error("Error saving location.", {
//       metaData: {
//         Path: req.path,
//         Service: "Location_service",
//         Method: req.method,
//       },
//       error: error.message,
//     });

//     return logAndRespond(
//       "Error saving location",
//       500,
//       res,
//       req,
//       "Location_service"
//     );
//   }
// };

// const getLocationsByEmployeeId = async (req, res) => {
//   const { employeeId } = req.params;

//   // Logging the received request
//   logger.info("Received request to fetch location data for employee.", {
//     metaData: {
//       Path: req.path,
//       Service: "Location_service",
//       Method: req.method,
//       employeeId,
//     },
//   });

//   try {
//     const locations = await Location.find({ employeeId });

//     if (locations.length === 0) {
//       // Log no data found
//       logger.info("No location data found for this employee.", {
//         metaData: {
//           Path: req.path,
//           Service: "Location_service",
//           Method: req.method,
//           employeeId,
//         },
//       });

//       return logAndRespond(
//         "No location data found for this employee",
//         404,
//         res,
//         req,
//         "Location_service"
//       );
//     }

//     // Log success and respond with locations
//     logger.info("Location data fetched successfully.", {
//       metaData: {
//         Path: req.path,
//         Service: "Location_service",
//         Method: req.method,
//         employeeId,
//       },
//     });

//     return logAndRespond(
//       "Location data fetched successfully.",
//       200,
//       res,
//       req,
//       "Location_service",
//       locations
//     );
//   } catch (error) {
//     // Log error during fetching
//     logger.error("Error fetching location data.", {
//       metaData: {
//         Path: req.path,
//         Service: "Location_service",
//         Method: req.method,
//       },
//       error: error.message,
//     });

//     return logAndRespond(
//       "Error fetching location data",
//       500,
//       res,
//       req,
//       "Location_service"
//     );
//   }
// };

// module.exports = { saveLocation, getLocationsByEmployeeId };

const User = require("../models/User");
const Location = require("../models/Location");
const { logAndRespond } = require("../utils/responseUtils");
const logger = require("../logger/index");

const saveLocation = async (req, res) => {
  const { employeeId, latitude, longitude } = req.body;

  console.log("data >>>", employeeId, latitude, longitude);

  logger.info("Received request to save location data.", {
    metaData: {
      Path: req.path,
      Service: "Location_service",
      Method: req.method,
      employeeId,
      latitude,
      longitude,
    },
  });

  // Validate required fields
  if (!employeeId || !latitude || !longitude) {
    return logAndRespond(
      "Missing required fields",
      400,
      res,
      req,
      "Location_service"
    );
  }

  try {
    // Find user by employeeId field
    const user = await User.findOne({ employeeId });
    if (!user) {
      return logAndRespond("User not found", 404, res, req, "Location_service");
    }

    // Check if a location entry already exists for the user
    const existingLocation = await Location.findOne({ employeeId: user._id });

    if (existingLocation) {
      // Update the existing location
      existingLocation.latitude = latitude;
      existingLocation.longitude = longitude;
      await existingLocation.save();

      logger.info("Location updated successfully.", {
        metaData: {
          Path: req.path,
          Service: "Location_service",
          Method: req.method,
          employeeId,
        },
      });

      return logAndRespond(
        "Location updated successfully!",
        200,
        res,
        req,
        "Location_service"
      );
    } else {
      // Create a new location entry if none exists
      const newLocation = new Location({
        employeeId: user._id,
        latitude,
        longitude,
      });
      await newLocation.save();

      // Optionally update the user's last known location
      user.lastLocation = { latitude, longitude };
      await user.save();

      logger.info("Location saved successfully.", {
        metaData: {
          Path: req.path,
          Service: "Location_service",
          Method: req.method,
          employeeId,
        },
      });

      return logAndRespond(
        "Location saved successfully!",
        200,
        res,
        req,
        "Location_service"
      );
    }
  } catch (error) {
    logger.error("Error saving location.", {
      metaData: {
        Path: req.path,
        Service: "Location_service",
        Method: req.method,
      },
      error: error.message,
    });

    return logAndRespond(
      "Error saving location",
      500,
      res,
      req,
      "Location_service"
    );
  }
};

const getLocationsByEmployeeId = async (req, res) => {
  const { employeeId } = req.params;

  logger.info("Received request to fetch location data for employee.", {
    metaData: {
      Path: req.path,
      Service: "Location_service",
      Method: req.method,
      employeeId,
    },
  });

  try {
    const user = await User.findOne({ employeeId });

    if (!user) {
      logger.info("User not found with this employeeId.", {
        metaData: {
          Path: req.path,
          Service: "Location_service",
          Method: req.method,
          employeeId,
        },
      });

      return logAndRespond("User not found", 404, res, req, "Location_service");
    }

    const locations = await Location.find({ employeeId: user._id });

    if (locations.length === 0) {
      logger.info("No location data found for this employee.", {
        metaData: {
          Path: req.path,
          Service: "Location_service",
          Method: req.method,
          employeeId,
        },
      });

      return logAndRespond(
        "No location data found for this employee",
        404,
        res,
        req,
        "Location_service"
      );
    }

    logger.info("Location data fetched successfully.", {
      metaData: {
        Path: req.path,
        Service: "Location_service",
        Method: req.method,
        employeeId,
      },
    });

    return logAndRespond(
      "Location data fetched successfully.",
      200,
      res,
      req,
      "Location_service",
      locations
    );
  } catch (error) {
    logger.error("Error fetching location data.", {
      metaData: {
        Path: req.path,
        Service: "Location_service",
        Method: req.method,
      },
      error: error.message,
    });

    return logAndRespond(
      "Error fetching location data",
      500,
      res,
      req,
      "Location_service"
    );
  }
};

module.exports = { saveLocation, getLocationsByEmployeeId };
