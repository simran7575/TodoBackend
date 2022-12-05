const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const User = require("../models/user");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceId = process.env.TWILIO_SERVICE_ID;
const client = require("twilio")(accountSid, authToken);
const mongoose = require("mongoose");

//signing up using otp authentication
exports.sendingOtp = BigPromise(async (req, res, next) => {
  let { phone, isLogin, email } = req.body;

  phone = "+91" + phone;
  const user = await User.findOne({ phone });
  const emailCount = await mongoose.models.User.countDocuments({ email });
  if (emailCount) {
    return res.status(200).json(CustomError("Email Already in Use", 400));
  }

  if (user && !isLogin) {
    return res.status(200).json(CustomError("User Already Exist", 400));
  } else if (!user && isLogin) {
    return res.status(200).json(CustomError("User does not exist", 400));
  } else {
    const response = await sendOtp(phone);
    responseupdated = {
      to: response.to,
      channel: response.channel,
      status: response.status,
      valid: response.valid,
      lookup: response.lookup,
      amount: response.amount,
      payee: response.payee,
      sendCodeAttempts: [
        {
          channel: response.sendCodeAttempts[0].channel,
          time: response.sendCodeAttempts[0].time,
        },
      ],
      dateCreated: response.dateCreated,
      dateUpdated: response.dateUpdated,
      sna: response.sna,
    };
    res.status(200).json({
      success: true,
      response: responseupdated,
    });
  }
});

//verifying the otp
exports.verifyOtpForSignup = BigPromise(async (req, res, next) => {
  let { phone, code, fullname, address, email } = req.body;
  if (!phone && !fullname && !email) {
    return res
      .status(200)
      .json(CustomError("Please provide fullname and mobile number", 400));
  }
  phone = "+91" + phone;
  const response = await verifyOtp(phone, code);
  if (response.status == "approved") {
    const user = await User.create({
      fullname,
      address,
      email,
      phone,
    });
    const token = user.getJwtToken();

    return res.status(200).json({
      success: "true",
      message: "User created successfully",
      user,
      token,
    });
  } else {
    return res.status(200).json(CustomError("Invalid OTP", 400));
  }
});
exports.verifyOtpForLogin = BigPromise(async (req, res, next) => {
  let { phone, code } = req.body;
  phone = "+91" + phone;

  const response = await verifyOtp(phone, code);
  const user = await User.findOne({ phone });
  if (response.status == "approved") {
    const token = user.getJwtToken();

    return res.status(200).json({
      success: "true",
      message: "User logged in  successfully",
      user,
      token,
    });
  } else {
    return res.status(200).json(CustomError("Invalid OTP", 400));
  }
});

exports.allUsers = BigPromise(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
  });
});
exports.userDetails = BigPromise(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

async function sendOtp(phone) {
  const response = await client.verify
    .services(serviceId)
    .verifications.create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
      channel: "sms",
    });

  return response;
}

async function verifyOtp(phone, code) {
  const response = await client.verify
    .services(serviceId)
    .verificationChecks.create({
      to: phone,
      code: code,
    });

  return response;
}
