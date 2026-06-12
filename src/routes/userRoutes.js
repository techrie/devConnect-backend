const { userAuth } = require("../middlewares/authMiddleware");

const express = require("express");

const router = express.Router();

const {
  requestsReceived,
  connections,
} = require("../controllers/userController");

router.get("/requests/received", userAuth, requestsReceived);
router.get("/connections", userAuth, connections);

module.exports = router;
