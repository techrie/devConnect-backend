const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { validateSignupData } = require("../utils/validation");
const User = require("../models/userModel");
const ConnectionRequest = require("../models/connectionRequestModel");

const USER_SAFE_DATA = "firstName lastName age gender about skills photoUrl";

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
    console.log("User added successfully");
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

    if (!isPasswordValid) {
      return res.status(401).send("Pwd Invalid credentials");
    }

    //create a jwt token

    //instead of jwt.sign, use the getJWT method from the user model
    const token = await user.getJWT();
    // console.log("token is :" + token);

    //Add the token to cookie ans send the response back to the user
    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 1 * 3600000),
    });
    res.json({
      message: "Login successful",
      data: user,
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

const feed = async (req, res) => {
  try {
    //if loggedInUser sent a request interested or ignored, then he shouldn't see those users in the feed.
    //if other users are his connections, then he shouldn't see those users in the feed.
    // except the current user all other users are sent

    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((request) => {
      hideUsersFromFeed.add(request.fromUserId.toString());
      hideUsersFromFeed.add(request.toUserId.toString());
    });

    console.log(hideUsersFromFeed);

    // Now, fetch users for the feed, excluding the ones in hideUsersFromFeed

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.json({ message: "Users fetched successfully", data: users });
  } catch (err) {
    res.status(400).send("Error fetching users" + err.message);
  }
};

module.exports = {
  signup,
  login,
  logout,
  feed,
};
