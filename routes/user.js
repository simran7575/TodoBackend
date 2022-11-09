const express = require("express");
const router = express.Router();
const {
  sendingOtp,
  verifyOtpForSignup,
  verifyOtpForLogin,
  allUsers,
  userDetails,
} = require("../controllers/userConroller");
const { isLoggedIn } = require("../middlewares/user");

router.route("/sendotp").post(sendingOtp);
router.route("/verifysignup").post(verifyOtpForSignup);
router.route("/verifylogin").post(verifyOtpForLogin);
router.route("/allusers").get(allUsers);
router.route("/user").get(isLoggedIn, userDetails);

module.exports = router;
