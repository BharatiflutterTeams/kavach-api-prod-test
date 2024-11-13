const mongoose = require("mongoose");

const NewEmailSettingsSchema = new mongoose.Schema({
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
});

const EmailSettings = mongoose.model("newEmailSettings", NewEmailSettingsSchema);

module.exports = EmailSettings;
