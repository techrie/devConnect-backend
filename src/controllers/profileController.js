const validator = require("validator");
const bcrypt = require("bcrypt");
const { validateEditProfile } = require("../utils/validation");

const viewProfile = async (req, res) => {
  try {
    const user = req.user;

    res.json({ data: user });
  } catch (err) {
    res.status(400).send("Error fetching profile" + err.message);
  }
};

const editProfile = async (req, res) => {
  try {
    if (!validateEditProfile(req)) {
      throw new Error("Invalid update fields");
    }

    const loggedInUser = req.user;
    // const { age, about, gender, skills, photoUrl } = req.body;

    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });

    // loggedInUser.age = age;
    // loggedInUser.about = about;
    // loggedInUser.gender = gender;
    // loggedInUser.skills = skills;
    // loggedInUser.photoUrl = photoUrl;

    await loggedInUser.save();

    res.json({ message: "Profile updated successfully", data: loggedInUser });
  } catch (err) {
    res.status(400).send("Error editing profile : " + err.message);
  }
};

const changePassword = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Check if the old password is correct
    const isPasswordValid =
      await loggedInUser.validatePassword(currentPassword);

    if (!isPasswordValid) {
      throw new Error("Current password is incorrect");
    }

    // Check if the new password and confirm password match
    if (newPassword !== confirmPassword) {
      throw new Error("Passwords do not match");
    }

    if (!validator.isStrongPassword(newPassword)) {
      throw new Error(
        "New password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
      );
    }
    // Update the password
    loggedInUser.password = await bcrypt.hash(newPassword, 10);
    await loggedInUser.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(400).send("Error changing password : " + err.message);
  }
};

module.exports = {
  viewProfile,
  editProfile,
  changePassword,
};

// Additional Security Enhancements

// Many production systems also:

// Require the current password.
// Prevent reusing the old password.
// Log the password change event.
// Invalidate all active sessions/JWT refresh tokens after a password change.
// Send an email notification:

// "Your password was changed on August 12, 2026."
