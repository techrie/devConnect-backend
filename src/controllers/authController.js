const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { validateSignupData } = require("../utils/validation");
const User = require("../models/userModel");

const signup = async (req, res) => {
  try {
    //Validation of data - use helper function
    validateSignupData(req);

    const { firstName, lastName, email, password } = req.body;
    //Encrypt the password - bcrypt

    // Hash the password is handled in the user model using a pre-save hook
    // const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password,
    });
    await user.save();
    // res.send("User added successfully");
    res.status(201).json({
      message: "User added successfully",
    });
  } catch (err) {
    res.status(400).send("Error :  " + err.message);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    console.log(user);
    if (!user) {
      return res.status(404).send("Email Invalid credentials");
    }

    //instead of bcrypt.compare, use the validatePassword method from the user model
    const isPasswordValid = await user.validatePassword(password);
    console.log("isPasswordValid: " + isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).send("Pwd Invalid credentials");
    }

    //create a jwt token

    //instead of jwt.sign, use the getJWT method from the user model
    const token = await user.getJWT();
    console.log("token is :" + token);

    //Add the token to cookie ans send the response back to the user
    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 1 * 3600000),
    });
    res.json({
      message: "Login successful",
    });
  } catch (err) {
    res.status(400).send("Error :  " + err.message);
  }
};

const logout = async (req, res) => {
  try {
    // Implementation for logout
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
    });
    res.json({
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  signup,
  login,
  logout,
};
