const express = require("express");
const { sendMessage, getMessages } = require("../controllers/chat.controller");

const router = express.Router();

router.post("/send", sendMessage);
router.get("/get/:user2", getMessages);

module.exports = router;
