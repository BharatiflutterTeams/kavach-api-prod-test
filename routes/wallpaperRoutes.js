const express = require("express");
const router = express.Router();
const { createWallpaper } = require("../controllers/wallpaperController");
const upload = require("../utils/uploader");

router.post("/upload/:employeeId", upload.single("image"), createWallpaper);

module.exports = router;
