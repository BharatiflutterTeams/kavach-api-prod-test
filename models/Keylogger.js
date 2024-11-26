const mongoose = require("mongoose");

const KeyLogSchema = new mongoose.Schema({
  userId: {
    type: String,  
    required: true,
  },
  logs: [
    {
      type: String,
    },
  ],
  timestamp: { 
    type: Date, 
    default: Date.now 
  },
});

module.exports = mongoose.model("KeyLog", KeyLogSchema);
