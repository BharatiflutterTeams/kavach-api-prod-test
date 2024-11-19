const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const {
  login,
  createAdmin,
  getdata,
  getToken,
} = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/login", login);
router.post(
  "/create",
  [
    body("name")
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ min: 2 })
      .withMessage("Name must be at least 2 characters long"),
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email address"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long")
      .matches(/\d/)
      .withMessage("Password must contain a number")
      .matches(/[!@#$%^&*]/)
      .withMessage("Password must contain a special character"),
  ],
  createAdmin
);
router.get("/getdata", getdata);
router.get("/token", getToken);

module.exports = router;
