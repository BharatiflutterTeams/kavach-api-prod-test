const mongoose = require("mongoose");

const featureSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    unique: true
  },
  usbPolicy: {
    type: Boolean,
    default: false
  },
  taskManager: {
    type: Boolean,
    default: false
  },
  internetAccess:{
    type: Boolean,
    default: false
  },
  gps:{
    type:Boolean,
    default:false,

  },
  rightClick: {
    type: Boolean,
    default: false
  },
  systemSettings: {
    type: Boolean,
    default: false
  },
  
  keyLogger: {
    type: Boolean,
    default: false
  },
  copyPaste: {
    type: Boolean,
    default: false
  },
  cameraSetting: {
    type: Boolean,
    default: false
  },
  forcefullyRestart: {
    enabled: {
      type: Boolean,
      default: false
    },
    dayInterval: {
      type: Number,
      default: 0
    },
    time: {
      type: String,
      default: "00:00"
    }
  },
  websiteBlocker: {
    type: [String], 
    default: []
  },
  
  whiteListing: {
    proxyAddress: {
      type: String,
      default: "127.0.0.1"
    },
    port: {
      type: Number,
      default: 80
    },
    exception: {
      type: [[String]],
      default: []
    }
  },

    visitedWeb:{
      type: [String], 
      default: []
    },
    webListCount: {
      type: Number, 
      default: 0
    }
  
});

const Feature = mongoose.model("Feature", featureSchema);

module.exports = Feature;
