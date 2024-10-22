const mongoose = require("mongoose");

const emailSettingsSchema = new mongoose.Schema({
  senderEmail: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  receiverEmail: {
    type: String,
    required: true,
  },
  ccEmail: {
    type: String,
   
  },
  screenshotInterval: {
    type: Number,
    required: true,
  },
  screenshotDays: {
    type: Number,
   
  },
  date: {
    type: String,
    match: /^\d{2}-\d{2}-\d{4}$/,
},

  startTime: {
    type: String,
   
    match: /^\d{2}:\d{2}:\d{2}$/, 
  },
  endTime: {
    type: String,
  
    match: /^\d{2}:\d{2}:\d{2}$/, 
  },
  authorizedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const EmailSettings = mongoose.model("EmailSettings", emailSettingsSchema);

module.exports = EmailSettings;
