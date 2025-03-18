// middleware/auth.js
const jwt = require("jsonwebtoken");
const Token = require("../models/token.model");

module.exports = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Access Denied" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const storedToken = await Token.findOne({ token });

    if (!storedToken) return res.status(401).json({ message: "Invalid Token" });

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or Expired Token" });
  }
};
