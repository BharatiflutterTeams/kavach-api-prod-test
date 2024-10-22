const mongoose = require("mongoose");

// Common fields for all schemas
const commonSchemaOptions = {
  employeeId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
};

// Download History Schema
const downloadHistorySchema = new mongoose.Schema({
  ...commonSchemaOptions,
  downloads: { type: Array, required: true },
  downloadDate: { type: Date, required: true },
});

// Browser History Schema
const browserHistorySchema = new mongoose.Schema({
  ...commonSchemaOptions,
  data: {
    Chrome: [{ title: String, url: String, visit_count: Number }],
    Firefox: [{ title: String, url: String, visit_count: Number }],
    Edge: [{ title: String, url: String, visit_count: Number }],
  },
  historyDate: { type: Date, default: Date.now },
});

// Employee Status Schema
const employeeStatusSchema = new mongoose.Schema({
  ...commonSchemaOptions,
  status: {
    type: String,
    enum: ["active", "idle", "inactive", "unknown"],
    default: "unknown",
  },
});

// Screenshot Schema
const screenshotSchema = new mongoose.Schema({
  ...commonSchemaOptions,
  screenshotUrl: { type: String, required: true },
});

// Restart Setting Schema
const restartSettingSchema = new mongoose.Schema({
  ...commonSchemaOptions,
  enabled: { type: Boolean, default: false },
  dayInterval: { type: Number, default: 1 },
  time: { type: String, default: "00:00" },
});

//wallpaper
const wallpaperChangeSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  imageUrl: { type: String, required: true },
  changeDate: { type: Date, default: Date.now },
});

// Export models
const DownloadHistory = mongoose.model(
  "DownloadHistory",
  downloadHistorySchema
);
const BrowserHistory = mongoose.model("BrowserHistory", browserHistorySchema);
const EmployeeStatus = mongoose.model("EmployeeStatus", employeeStatusSchema);
const Screenshot = mongoose.model("Screenshot", screenshotSchema);
const RestartSettings = mongoose.model("RestartSettings", restartSettingSchema);
const WallpaperChangeLog = mongoose.model(
  "WallpaperChangeLog",
  wallpaperChangeSchema
);

module.exports = {
  DownloadHistory,
  BrowserHistory,
  EmployeeStatus,
  Screenshot,
  RestartSettings,
  WallpaperChangeLog,
};
