const express = require("express");
const { body } = require("express-validator");
const { signup, login } = require("../controllers/auth.controller");

const router = express.Router();


const validateSignup = [
    body("username").notEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
];

const validateLogin = [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
];


router.post("/signup", validateSignup, signup);
router.get("/signup", (req, res) => res.status(200).json({ message: "Signup page" }));
router.post("/login", validateLogin, login);
router.get("/login", (req, res) => res.status(200).json({ message: "login page" }));

module.exports = router;
