const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  name: String,
  email: String,
  department: String,
  teamLead: String,
  employeeId: String,
  image: { type: String, default: null },
  featureSettings: { type: Schema.Types.ObjectId, ref: "Feature" }, // Single reference to a Feature document
});

const User = mongoose.model("User", userSchema);

module.exports = User;
