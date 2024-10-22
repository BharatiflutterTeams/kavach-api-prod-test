const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  password:{
    type:String,
  },
  token: {
    type: String,
  },


});

adminSchema.virtual("initials").get(function () {
  if (!this.username) return "";
 
  const nameParts = this.username.trim().split(" ");
  const initials = nameParts
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
 
  return initials;
});
 
adminSchema.set("toJSON", { virtuals: true });

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
