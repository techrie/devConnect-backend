const express = require("express");

const router = express.Router();

const { userAuth } = require("../middlewares/authMiddleware");

const { signup, login, logout } = require("../controllers/authController");

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", userAuth, logout);

module.exports = router;
