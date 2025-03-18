// User model
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true }, 
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin", "medical", "shop"], default: "user" },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
