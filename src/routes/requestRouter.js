const express = require("express");
const router = express.Router();

const { userAuth } = require("../middlewares/authMiddleware");

const {
  sendOrIgnoreConnectionRequest,
  reviewRequestReceived,
} = require("../controllers/requestController");

router.post("/send/:status/:toUserId", userAuth, sendOrIgnoreConnectionRequest);
router.post("/review/:status/:requestId", userAuth, reviewRequestReceived);

module.exports = router;
