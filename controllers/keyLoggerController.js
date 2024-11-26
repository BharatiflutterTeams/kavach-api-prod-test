const KeyLog = require("../models/Keylogger");
const User = require("../models/User");

const getKeyLogById = async (req, res) => {
  const { employeeId } = req.params;

  try {
    const employee = await User.findOne({ employeeId: employeeId });
    if (!employee) {
      return res.status(404).json({ error: "Employee not found." });
    }

    const keyLogs = await KeyLog.find({ userId: employeeId });
    if (keyLogs.length === 0) {
      return res
        .status(404)
        .json({ error: "No keylog entries found for this employee." });
    }

    res
      .status(200)
      .json({ message: "Keylogs fetched successfully.", data: keyLogs });
  } catch (error) {
    console.error("Error fetching keylog:", error);
    res
      .status(500)
      .json({ error: "Internal server error. Could not fetch keylog data." });
  }
};

const storeKeyLog = async (req, res) => {
  const { employeeId } = req.params; // employeeId is a string here
  const { logs } = req.body;

  // Validate logs input
  if (!logs || !Array.isArray(logs)) {
    return res
      .status(400)
      .json({ error: "Invalid input. Ensure logs are provided as an array." });
  }

  try {
    // Find the employee by employeeId (as a string, not ObjectId)
    const employee = await User.findOne({ employeeId: employeeId });
    if (!employee) {
      return res.status(404).json({ error: "Employee not found." });
    }

    // Create a new KeyLog with the found employeeId
    const newKeyLog = new KeyLog({
      userId: employeeId, // Save employeeId directly as a string
      logs,
    });

    // Save the new keylog
    const savedKeyLog = await newKeyLog.save();

    res
      .status(201)
      .json({ message: "Keylog stored successfully.", data: savedKeyLog });
  } catch (error) {
    console.error("Error storing keylog:", error);
    res
      .status(500)
      .json({ error: "Internal server error. Could not store the keylog." });
  }
};

const updateKeyLogById = async (req, res) => {
  const { employeeId } = req.params;
  const { logs } = req.body;

  if (!logs || !Array.isArray(logs)) {
    return res
      .status(400)
      .json({ error: "Invalid input. Ensure logs are provided as an array." });
  }

  try {
    const employee = await User.findOne({ employeeId: employeeId });
    if (!employee) {
      return res.status(404).json({ error: "Employee not found." });
    }

    const keyLog = await KeyLog.findOne({ userId: employeeId });
    if (!keyLog) {
      return res
        .status(404)
        .json({ error: "Keylog entry not found for this employee." });
    }

    keyLog.logs = logs;
    const updatedKeyLog = await keyLog.save();

    res
      .status(200)
      .json({ message: "Keylog updated successfully.", data: updatedKeyLog });
  } catch (error) {
    console.error("Error updating keylog:", error);
    res
      .status(500)
      .json({ error: "Internal server error. Could not update keylog data." });
  }
};

module.exports = { storeKeyLog, getKeyLogById, updateKeyLogById };
