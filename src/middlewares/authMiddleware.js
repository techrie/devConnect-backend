const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
require("dotenv").config();

// const adminAuth = (req, res, next) => {
//   console.log("Admin auth is getting checked");
//   const token = "xyz";
//   const isAuthenticated = token === "xyz";

//   if (!isAuthenticated) {
//     res.status(401).send("Unauthorized request");
//   } else {
//     next();
//   }
// };

const userAuth = async (req, res, next) => {
  try {
    //read the token fro req.cookies
    const token = req.cookies.token;
    //validate the token
    if (!token) {
      throw new Error("Unauthorized");
    }
    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = decodedToken;
    //find the user
    const user = await User.findById(_id);
    console.log(user);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send("Unauthorized request");
  }
};

module.exports = { userAuth };
