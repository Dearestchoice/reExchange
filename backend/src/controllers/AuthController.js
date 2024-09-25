const User = require("../models/user");
const {
  verifyAccessToken,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/jwt");
const {
  registrationSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require("../utils/schema");
const bcrypt = require("bcrypt");

const registerUser = async (req, res) => {
  try {
    const filteredData = await registrationSchema.validate(req.body);

    if (filteredData.error) {
      return res.status(400).json({ message: filteredData.error.message });
    }

    const data = filteredData.value;

    const userExists = await User.findOne({ email: data.email });
    if (userExists)
      return res.status(400).json({
        status: "FAILED",
        message: "User already exists, please login instead.",
      });

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create a new user
    const user = new User({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });
    const newUser = await user.save();

    // Generate a token (JWT)
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    console.log(accessToken);

    return res.status(201).json({
      message: "User registered successfully",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const filteredData = await loginSchema.validate(req.body);
    if (filteredData.error) {
      return res
        .status(400)
        .json({ status: "FAILED", message: filteredData.error.message });
    }

    const data = filteredData.value;

    // Check if the user exists
    const user = await User.findOne({ email: data.email });
    if (!user)
      return res.status(400).json({
        status: "FAILED",
        message: "User not found, please signup instead.",
      });

    // Check password
    const passwordCheck = await bcrypt.compare(data.password, user.password);
    if (!passwordCheck)
      return res.status(400).json({ message: "Invalid credentials." });

    // Generate a token (JWT)
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    console.log(accessToken);

    res
      .status(200)
      .json({ message: "login successful", accessToken, refreshToken });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token required" });
  }

  const decoded = verifyRefreshToken(refreshToken);
  if (!decoded) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    return res.status(403).json({ message: "User not found" });
  }

  const newAccessToken = generateAccessToken(user);
  res.status(200).json({ accessToken: newAccessToken });
};

const forgetPassword = async (req, res) => {
  try {
    // Validate email
    const data = await forgotPasswordSchema.validate(req.body);
    if (data.error) {
      return res
        .status(400)
        .json({ status: "FAILED", message: data.error.message });
    }

    // Find the user by email
    const user = await User.findOne({ email: data.value.email });
    if (!user) {
      return res.status(400).json({
        status: "FAILED",
        message: "User not found, please signup instead.",
      });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expirationTime = Date.now() + 15 * 60 * 1000; // OTP expires in 15 minutes

    // Update user with OTP and expiration
    user.otp = otp;
    user.otpExpiry = expirationTime;

    await user.save();

    // Send OTP via email (implement email sending logic)
    sendEmail(user.email, `Your OTP is: ${otp}`);

    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: "FAILED", message: error.message });
  }
};

const verifyOtpResetPassword = async (req, res) => {
  try {
    const data = await resetPasswordSchema.validate(req.body);
    if (data.error) {
      return res
        .status(400)
        .json({ status: "FAILED", message: data.error.message });
    }

    // Find the OTP entry and ensure it has not expired
    const otpEntry = await Otp.findOne({
      otp: data.value.otp,
      expiresAt: { $gt: new Date() }, // Check for OTP that hasn't expired
    }).populate("user"); // Populate the related user

    if (!otpEntry) {
      return res
        .status(400)
        .json({ status: "FAILED", message: "Invalid or expired OTP" });
    }

    // Extract the user from the OTP entry
    const user = otpEntry.user;

    // Hash the new password
    const hashedPassword = await hashPassword(data.value.newPassword);

    // Update password and clear OTP
    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    return res.status(200).json({
      status: "SUCCESS",
      message: "Password reset successfully",
    });
  } catch (error) {
    res.status(400).json({ status: "FAILED", message: error.message });
  }
};

module.exports = { registerUser, loginUser, refreshToken, forgetPassword, verifyOtpResetPassword };
