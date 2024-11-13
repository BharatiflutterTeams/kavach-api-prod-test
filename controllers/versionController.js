const Download = require("../models/version");

exports.updateVersion = async (req, res) => {
  try {
    const { id, version, url, prev_packages, package_name } = req.body;

    const updatedDownload = await Download.findOneAndUpdate(
      { _id: id },
      { version, url, prev_packages, package_name, timestamp: Date.now() },
      { new: true, upsert: false }
    );

    if (updatedDownload) {
      res.status(200).json({
        message: "Download entry updated successfully",
        data: updatedDownload,
      });
    } else {
      res.status(404).json({ message: "Download entry not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating download entry", error });
  }
};

exports.getVersion = async (req, res) => {
  try {
    const downloads = await Download.find();
    res.status(200).json(downloads);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving downloads", error });
  }
};
