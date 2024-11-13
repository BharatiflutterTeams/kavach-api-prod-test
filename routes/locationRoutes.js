const express = require("express");
const {
  saveLocation,
  getLocationsByEmployeeId,
  getAllUsersLocations,
} = require("../controllers/locationController");
const router = express.Router();

// Route to save location data
router.post("/location", saveLocation);

// Route to get locations by employee ID
router.get("/location/:employeeId", getLocationsByEmployeeId);

router.get("/locations", getAllUsersLocations);


module.exports = router;
