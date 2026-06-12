const express = require("express");
const router = express.Router();

const { userAuth } = require("../middlewares/authMiddleware");

const {
  sendOrIgnoreConnectionRequest,
} = require("../controllers/requestController");

router.post("/send/:status/:toUserId", userAuth, sendOrIgnoreConnectionRequest);

module.exports = router;
