const express = require("express");
const router = express.Router();
const {
  login,
  createAdmin,
  getdata,
  getToken,
} = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/login", login);
router.post("/create", createAdmin);
router.get("/getdata", getdata);
router.get("/token", getToken);



module.exports = router;
