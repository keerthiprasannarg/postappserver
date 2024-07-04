const mongoose = require("mongoose");

const User = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  username: { type: String, unique: true },
  password: { type: String },
});
module.exports = mongoose.model("users", User, "users");
