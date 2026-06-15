const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://poojitham255:U9wM94SUnnBCUdti@nodecourse.id077.mongodb.net/devConnect",
  );
};
module.exports = connectDB;

// mongodb+srv://poojitham255:<db_password>@nodecourse.id077.mongodb.net/NodeCourse

//Notes

//Go to mongodb website
// Create a free cluster M0 cluster on mongodb atlas
// create a user to access to mongodb atlas
// Get the connection string
// Install mongodb compass
