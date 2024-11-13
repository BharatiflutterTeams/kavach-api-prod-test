const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const logger = require("../logger/index");
const { AUTH_CTRL_MSG } = require("../constant_message/constant");

require("dotenv").config();

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

// =============================== LOGIN ADMIN ==============================
async function login(req, res) {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });

    if (!admin) {
      return logAndRespond(
        AUTH_CTRL_MSG.ADMIN_NOT_FOUND,
        404,
        res,
        req,
        "Admin_service"
      );
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return logAndRespond(
        AUTH_CTRL_MSG.INVALID_CREDENTIALS,
        400,
        res,
        req,
        "Admin_service"
      );
    }

    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.SECRET_KEY,
      { expiresIn: "8h" }
    );

    admin.token = token;
    await admin.save();

    return logAndRespond(
      AUTH_CTRL_MSG.LOGIN_SUCCESSFUL,
      200,
      res,
      req,
      "Admin_service",
      {
        token,
        expiresIn: "1 hour",
        userInitials: admin.initials,
      }
    );
  } catch (error) {
    logAndRespond(
      AUTH_CTRL_MSG.INTERNAL_SERVER_ERROR,
      500,
      res,
      req,
      "Admin_service"
    );
  }
}

// ============================== CREATE ADMIN ===============================
async function createAdmin(req, res) {
  const { username, password } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return logAndRespond(
        AUTH_CTRL_MSG.ADMIN_ALREADY_EXISTS,
        400,
        res,
        req,
        "Admin_service"
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newAdmin = new Admin({
      username,
      password: hashPassword,
    });

    await newAdmin.save();
    return logAndRespond(
      AUTH_CTRL_MSG.ADMIN_CREATED,
      201,
      res,
      req,
      "Admin_service"
    );
  } catch (error) {
    logAndRespond(
      AUTH_CTRL_MSG.INTERNAL_SERVER_ERROR,
      500,
      res,
      req,
      "Admin_service"
    );
  }
}

// =============================== GET ALL ADMINS ============================
async function getdata(req, res) {
  try {
    const findData = await Admin.find();
    return logAndRespond("Success", 200, res, req, "Admin_service", findData);
  } catch (error) {
    logAndRespond(
      AUTH_CTRL_MSG.INTERNAL_SERVER_ERROR,
      500,
      res,
      req,
      "Admin_service"
    );
  }
}

// =============================== GET TOKEN ==============================
async function getToken(req, res) {
  try {
    const admin = await Admin.findOne();

    if (!admin) {
      return logAndRespond(
        AUTH_CTRL_MSG.ADMIN_NOT_FOUND,
        404,
        res,
        req,
        "Admin_service"
      );
    }

    if (!admin.token) {
      return logAndRespond("Token not found", 404, res, req, "Admin_service");
    }

    return logAndRespond("Success", 200, res, req, "Admin_service", {
      token: admin.token,
    });
  } catch (error) {
    logAndRespond(
      AUTH_CTRL_MSG.INTERNAL_SERVER_ERROR,
      500,
      res,
      req,
      "Admin_service"
    );
  }
}

module.exports = {
  login,
  createAdmin,
  getdata,
  getToken,
};
