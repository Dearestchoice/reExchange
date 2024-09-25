const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  refreshToken,
  forgetPassword,
  verifyOtpResetPassword,
} = require("../controllers/AuthController");
const { authMiddleware } = require("../middlewares/auth");

// use this route to test the login and registerv tokens
router.get("/test-token", authMiddleware(""), (req, res) => {
  res.send("Hello Auth");
});

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshToken);
router.post("/forget-password", forgetPassword);
router.post("/reset-password", verifyOtpResetPassword);

module.exports = router;
