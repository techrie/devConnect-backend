const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignupData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  try {
    //Validation of data - use helper function
    validateSignupData(req);

    const { firstName, lastName, email, password } = req.body;
    //Encrypt the password - bcrypt

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("Error :  " + err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    // console.log(user);
    if (!user) {
      return res.status(404).send("Invalid credentials");
    }

    //instead of bcrypt.compare, use the validatePassword method from the user model
    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) {
      return res.status(401).send("Invalid credentials");
    }

    //create a jwt token

    //instead of jwt.sign, use the getJWT method from the user model
    const token = await user.getJWT();

    //Add the token to cookie ans send the response back to the user
    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 1 * 3600000),
    });
    res.send("Login successful");
  } catch (err) {
    res.status(400).send("Error :  " + err.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(400).send("Error fetching profile" + err.message);
  }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;
    // Logic to send connection request
    res.send(user.firstName + " " + "sent a connection request");
  } catch (err) {
    res.status(400).send("Error sending connection request" + err.message);
  }
});

app.post("/logout", userAuth, (req, res) => {
  res.clearCookie("token");
  res.send("Logged out successfully");
});

connectDB()
  .then(() => {
    console.log("Database connection established");
    app.listen(7777, () => {
      console.log("Server is listening on port 7777");
    });
  })
  .catch((err) => {
    console.log("Database cannot be connected");
  });

// /*

// app.get("/user", async (req, res) => {
//   try {
//     const user = await User.findOne({ email: req.body.email });
//     if (!user) {
//       return res.status(404).send("User not found");
//     }
//     res.send(user);
//   } catch (err) {
//     res.status(400).send("Error fetching user" + err.message);
//   }
// });

// app.get("/feed", async (req, res) => {
//   try {
//     const users = await User.find({});
//     if (users.length === 0) {
//       return res.status(404).send("No users found");
//     }
//     res.send(users);
//   } catch (err) {
//     res.status(400).send("Error fetching users" + err.message);
//   }
// });

// app.delete("/user", async (req, res) => {
//   try {
//     const user = await User.findByIdAndDelete(req.body.userId);
//     if (!user) {
//       return res.status(404).send("User not found");
//     }
//     res.send("User deleted successfully");
//   } catch (err) {
//     res.status(400).send("Error deleting user" + err.message);
//   }
// });

// app.patch("/user/:userId", async (req, res) => {
//   try {
//     const allowedUpdates = ["age", "gender", "about", "photoUrl", "skills"];

//     const isUpdateAllowed = Object.keys(req.body).every((update) =>
//       allowedUpdates.includes(update),
//     );

//     if (!isUpdateAllowed) {
//       throw new Error("Invalid updates!");
//     }
//     // if (req.body?.skills?.length > 10) {
//     //   throw new Error("Maximum 10 skills are allowed");
//     // }

//     const user = await User.findByIdAndUpdate(
//       { _id: req.params?.userId },
//       req.body,
//       { new: true, runValidators: true },
//     );
//     if (!user) {
//       return res.status(404).send("User not found");
//     }
//     res.send("User updated successfully");
//   } catch (err) {
//     res.status(400).send("Error updating user : " + err.message);
//   }
// });

// const { adminAuth, userAuth } = require("./middleware/auth");
// //Order of routes is important

// //Works for all requests GET, POST, PATCH, DELETE
// app.use("/admin", adminAuth);
// app.use("/user", userAuth);

// app.get("/admin/getAllData", (req, res) => {
//   res.send("All data is sent");
// });

// app.delete("/admin/deleteUser", (req, res) => {
//   res.send("Deleted a user");
// });

// app.use("/user/data", userAuth, (req, res) => {
//   res.send({ firstname: "USer", lastname: "Da" });
// });

// app.post("/user/login", (req, res) => {
//   res.send("Data saved successfully");
// });

// app.delete("/user", (req, res) => {
//   res.send("User deleted");
// });

// //this will match all HTTP method API calls to /hello
// app.use("/hello", (req, res) => {
//   res.send("Hello hello hello");
// });

// //keep this at the end . It matches all requests. Wild card error handling
// app.use("/", (err, req, res, next) => {
//   if (err) {
//     //console.log(err);
//     res.status(500).send("something went wrong");
//   }
// });

// // //b is optional to test APi's use localhost:7777/ac also works for /abc
// // app.get("/ab?c", (req, res) => {
// //   res.send({ firstname: "USer", lastname: "Da" });
// // });

// // //works for /abcd /abUSERcd /abanythingcd
// // app.get("/ab*cd", (req, res) => {
// //   res.send({ firstname: "USer", lastname: "Da" });
// // });

// // //works for /abc /abbbbbbbc /abbc we can add as many b's
// // app.get("/ab+c", (req, res) => {
// //   res.send({ firstname: "USer", lastname: "Da" });
// // });

// // //works for /abcd /abcbcbcbcd /abcbcd we can add as many bc's
// // app.get("/abc+d", (req, res) => {
// //   res.send({ firstname: "USer", lastname: "Da" });
// // });

// // //grouping bc is optional works for /ad /abcd
// // app.get("/a(bc)?d", (req, res) => {
// //   res.send({ firstname: "USer", lastname: "Da" });
// // });

// // //works for regex /a /cab
// // app.get(/a/, (req, res) => {
// //   res.send({ firstname: "USer", lastname: "Da" });
// // });

// // //works for /fly, /dragonfly, /butterfly
// // app.get(/.*fly$/, (req, res) => {
// //   res.send({ firstname: "USer", lastname: "Da" });
// // });

// //next() will go to the next route handler. As soon as the response is sent, connection will be closed

// app.use(
//   "/user",
//   (req, res, next) => {
//     console.log("HAndling the route user!!");
//     next();
//   },
//   (req, res) => {
//     console.log("HAndling the 2nd route handler!");
//     res.send("2nd Response!!");
//   }
// );

// //Express js does this
// //when a request is sent to the server or an API call is made,it takes the matching route and it goes through the middleware chain(which has next()) and finally goes to the request handler which handles the response

// //JWT token and authentication
// The user is logging in with email and pwd, the server is validating whether the email and pwd are correct. Thse server creates a JWt token
// and places inside a cookie and sends  the cookie back with response. Everytime the cookie comes to the server through the request, the
// server validates the cookie and gives the respective data back. the token has a hidden info about which user the cookie belongs to and
// that is only possible becoz of JWT

// the token has three parts : header, payload and signature
// payload stores the secret here userid

// Why de we need middleware? For all API's to be secure,  we need authentication except signup and login
// For all API's to work, we need to authenticate
// Create auth middleware and validate the token here
// */

//handle errors globally(gracefully). We can also create a custom error class and throw that error from anywhere in the code and handle it here
//app.use("/",(err, req,res,next) => {
// if(err) {
//log the error for you to debug.
// res.status(500).send("Something went wrong");
// }})
