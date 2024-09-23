const User = require("../models/user");
const {
  verifyAccessToken,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/jwt");
const { registrationSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } = require("../utils/schema");
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

// const forgetPassword = async () => {
//   try {
//     // Validate email
//     const data = await forgotPasswordSchema.validate(req.body);

//     // Find the user by email
//     const user = await User.findOne({ email: data.value.email });
//     if (!user) return res.status(400).json({ message: "User not found" });

//     // Generate OTP
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     user.otp = otp;
//     user.otpExpiry = Date.now() + 15 * 60 * 1000; // OTP expires in 15 minutes

//     await user.save();

//     // Send OTP via email (implement email sending logic)
//     sendEmail(user.email, `Your OTP is: ${otp}`); // Implement sendEmail

//     res.status(200).json({ message: "OTP sent to your email" });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// const verifyOtpUpdatePassword = async () => {
//   try {
//     // Validate input
//     await resetPasswordSchema.validate(req.body);

//     const { otp, newPassword } = req.body;

//     // Find user with the OTP and check if OTP is not expired
//     const user = await User.findOne({ otp, otpExpiry: { $gt: Date.now() } });
//     if (!user)
//       return res.status(400).json({ message: "Invalid or expired OTP" });

//     // Hash the new password
//     const hashedPassword = await bcrypt.hash(newPassword, 10);

//     // Update password and clear OTP
//     user.password = hashedPassword;
//     user.otp = undefined;
//     user.otpExpiry = undefined;

//     await user.save();

//     res.status(200).json({ message: "Password updated successfully" });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

module.exports = { registerUser, loginUser, refreshToken };
