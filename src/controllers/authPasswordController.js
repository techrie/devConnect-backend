const crypto = require("crypto");
const User = require("../models/User");

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send("User not found");
    }

    // 1. generate token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // 2. hash token before saving
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // 3. save to DB
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 min

    await user.save();

    // 4. create reset link
    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

    // (normally send email here)
    console.log("Reset Link:", resetLink);

    res.send("Password reset link sent to email");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    // hash incoming token
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // find user
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).send("Invalid or expired token");
    }

    // update password
    user.password = await bcrypt.hash(newPassword, 10);

    // clear reset fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.send("Password reset successful");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = { forgotPassword, resetPassword };

// /auth/forgot-password
// /auth/reset-password/:token

// Add in usee Model
// resetPasswordToken: String,
// resetPasswordExpires: Date,

// Why we hash reset token?

// Even if DB leaks:

// ✔ attackers cannot use raw reset token
// ✔ only hashed version is stored

// Same idea as password hashing.
