const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minLength: 4,
      maxLength: 20,
    },
    email: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email format " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error(
            "Password must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and symbols" +
              value,
          );
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      lowercase: true,
      enum: ["male", "female", "other"],
      // validate(value) {
      //   if (!["male", "female", "other"].includes(value.toLowerCase())) {
      //     throw new Error("Gender must be Male, Female, or Other");
      //   }
      // },
    },
    about: {
      type: String,
      default: "Hello! I'm new here.",
      maxLength: 500,
    },
    photoUrl: {
      type: String,
      default:
        "https://hostalitecloud.com/crb/wp-content/uploads/2025/10/dummy-user-male.jpg",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid URL format " + value);
        }
      },
    },
    skills: {
      type: [String],
      maxLength: 10,
      validate(value) {
        if (value.length > 10) {
          throw new Error("Maximum 10 skills are allowed");
        }
      },
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

module.exports = User;
