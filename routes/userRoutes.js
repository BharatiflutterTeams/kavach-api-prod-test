const express = require("express");
const router = express.Router();
const {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  getUserById,
} = require("../controllers/userController");
const { verifyToken } = require("../middleware/authMiddleware");
const cacheMiddleware = require("../redis/getCacheMiddleware")
// User routes
router.get("/alluser", verifyToken, cacheMiddleware, getUser);
router.get("/employee/:employeeId", verifyToken, getUserById);
router.post("/create", verifyToken, createUser);   
router.put("/update/:employeeId", verifyToken, updateUser);
router.delete("/delete/:employeeId", verifyToken, deleteUser);

module.exports = router;
  