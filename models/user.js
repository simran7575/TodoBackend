const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: [true, "Please provide a firstname"],
    minlength: [3, "Name should be more than 2 characters"],
    maxlength: [40, "Name should be under 40 characters"],
    validate: [validator.isAlpha, "Name should contain only alphabets"],
  },
  address: {
    type: String,
    pattern: "^[a-zA-Z0-9s,'-]*$",
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Email required"],
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  phone: {
    type: String,
    required: [true, "Please add phone number"],
    validate: [validator.isMobilePhone, "Please enter a valid Mobile Number"],
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

//Added a function to check the email uniqueness
// userSchema.path("email").validate(async (email) => {
//   const emailCount = await mongoose.models.User.countDocuments({ email });
//   return !emailCount;
// }, "Email already exists");

userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

module.exports = mongoose.model("User", userSchema);
