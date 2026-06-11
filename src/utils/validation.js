const validator = require("validator");

const validateSignupData = (req) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    throw new Error("All fields are required");
  }

  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters long");
  }

  if (!validator.isEmail(email)) {
    throw new Error("Invalid email format");
  }
};

const validateEditProfile = (req) => {
  const allowedUpdates = ["age", "about", "gender", "skills", "photoUrl"];
  const isUpdateAllowed = Object.keys(req.body).every((update) =>
    allowedUpdates.includes(update),
  );
  return isUpdateAllowed;
};

module.exports = {
  validateSignupData,
  validateEditProfile,
};
