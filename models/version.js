const mongoose = require("mongoose");

const versionSchema = new mongoose.Schema({
  version: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  prev_packages: {
    type: [String],
    default: [],
  },
  package_name: {
    type: [String],
    default: [],
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Download", versionSchema);
