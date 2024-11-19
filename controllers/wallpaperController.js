const logger = require("../logger");
const User = require("../models/User");
const cloudinary = require("../utils/cloudinary");
const { emitWallpaperChange } = require("../websocket/sockets/wallpaper");

const createWallpaper = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const file = req.file;

    const responseURL = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "wallpaper" }, (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        })
        .end(file.buffer);
    });

    logger.info("responseURL", responseURL.secure_url);

    const wallpaper = await User.findOneAndUpdate(
      { employeeId },
      { image: responseURL.secure_url },
      { new: true }
    );

    if (!wallpaper) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    return res.status(200).json({
      message: "Wallpaper created successfully",
      success: true,
      data: wallpaper,
    });
  } catch (error) {
    logger.error("Error creating wallpaper:", error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createWallpaper };
