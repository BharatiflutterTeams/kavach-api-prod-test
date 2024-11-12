const User = require("../models/User");
const Feature = require("../models/Feature");
const logger = require("../logger/index");
const { logAndRespond } = require("../utils/responseUtils"); // Importing helper function
const { USER_CTRL } = require("../constant_message/constant");
const { empLiveStatus } = require("../websocket/index");

// ========================== CREATE USER ================================

async function createUser(req, res) {
  const { name, email, department, teamLead, employeeId } = req.body;

  try {
    const existingUserByEmail = await User.findOne({ email });
    const existingUserById = await User.findOne({ employeeId });

    if (existingUserByEmail) {
      return logAndRespond(
        "User with this email already exists",
        400,
        res,
        req,
        "User_Controller"
      );
    }

    if (existingUserById) {
      return logAndRespond(
        "User with this employee ID already exists",
        400,
        res,
        req,
        "User_Controller"
      );
    }

    const newUser = new User({ name, email, department, teamLead, employeeId });
    await newUser.save();

    const initialFeatures = new Feature({ user: newUser._id });
    await initialFeatures.save();

    // Update the user with the featureSettings reference
    newUser.featureSettings = initialFeatures._id;
    await newUser.save();

    return logAndRespond(
      "User created successfully",
      201,
      res,
      req,
      "User_Controller",
      newUser
    );
  } catch (error) {
    console.error("Error creating user:", error);
    logAndRespond("Server Error", 500, res, req, "User_Controller");
  }
}

// ========================== UPDATE USER ================================

async function updateUser(req, res) {
  const employeeId = req.params.employeeId;
  const { name, email, department, teamLead } = req.body;

  try {
    const existingUserByEmail = await User.findOne({ email });

    if (existingUserByEmail && existingUserByEmail.employeeId !== employeeId) {
      return logAndRespond(
        "Email already in use by another user",
        400,
        res,
        req,
        "User_Controller"
      );
    }

    const user = await User.findOne({ employeeId });

    if (!user) {
      return logAndRespond("User not found", 404, res, req, "User_Controller");
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.department = department || user.department;
    user.teamLead = teamLead || user.teamLead;

    await user.save();
    return logAndRespond(
      "User updated successfully",
      200,
      res,
      req,
      "User_Controller",
      user
    );
  } catch (error) {
    console.error(error);
    logAndRespond("Server error", 500, res, req, "User_Controller");
  }
}

// ========================== DELETE USER ================================

async function deleteUser(req, res) {
  const employeeId = req.params.employeeId;

  try {
    const user = await User.findOne({ employeeId });

    if (!user) {
      return logAndRespond("User not found", 404, res, req, "User_Controller");
    }

    await Feature.deleteMany({ user: user._id });
    await User.deleteOne({ employeeId });
    return logAndRespond(
      "User and associated features deleted successfully",
      200,
      res,
      req,
      "User_Controller"
    );
  } catch (error) {
    console.error(error);
    logAndRespond("Server Error", 500, res, req, "User_Controller");
  }
}

// ========================== GET USERS ================================

async function getUser(req, res) {
  try {
    const users = await User.find().populate("featureSettings");

    if (!users || users.length === 0) {
      return logAndRespond("No users found", 404, res, req, "User_Controller");
    }
    // console.log(`SENDING USER DATA >>> ${empLiveStatus["DESKTOP-QOOPHHU"]}`);

    // const userAndLiveStatus = users.map((user) => {
    //   user.status = empLiveStatus[user.employeeId];
    //   console.log(user.employeeId, "=>", user.status);
    // });

    return logAndRespond(
      "Success",
      200,
      res,
      req,
      "User_Controller",
      users
      // empLiveStatus
    );
  } catch (error) {
    console.error(error);
    logAndRespond("Server Error", 500, res, req, "User_Controller");
  }
}

// ========================== GET USER BY ID ================================

async function getUserById(req, res) {
  const { employeeId } = req.params;

  try {
    const user = await User.findOne({ employeeId }).populate("featureSettings");

    if (!user) {
      return logAndRespond("User not found", 404, res, req, "User_Controller");
    }

    return logAndRespond("Success", 200, res, req, "User_Controller", user);
  } catch (error) {
    console.error(error);
    logAndRespond("Server Error", 500, res, req, "User_Controller");
  }
}

module.exports = {
  createUser,
  updateUser,
  deleteUser,
  getUser,
  getUserById,
};
