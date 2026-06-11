const express = require("express");
const router = express.Router();

const { userAuth } = require("../middlewares/authMiddleware");

const {
  viewProfile,
  editProfile,
  changePassword,
} = require("../controllers/profileController");

router.get("/viewProfile", userAuth, viewProfile);
router.patch("/editProfile", userAuth, editProfile);
router.patch("/changePassword", userAuth, changePassword);
module.exports = router;
