import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

export const register = asyncHandler(async (req, res) => {
  const { firstname, lastname, email, password, acceptTermsAndCond } = req.body;

  if (!firstname || !lastname || !email || !password || !acceptTermsAndCond) {
    return res
      .status(400)
      .json({ success: false, message: "All required fields must be filled." });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "User already exists with this email.",
    });
  }

  const newUser = await User.create({
    firstname,
    lastname,
    email,
    password,
    acceptTermsAndCond,
  });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    user: {
      id: newUser._id,
      firstname: newUser.firstname,
      lastname: newUser.lastname,
      email: newUser.email,
      role: newUser.role,
    },
    token: generateToken(newUser),
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password are required." });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials." });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials." });
  }

  res.status(200).json({
    success: true,
    message: "User logged in successfully",
    user: {
      id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role,
    },
    token: generateToken(user),
  });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(404).json({ message: "user not found." });
  }

  return res.status(200).json({ message: "user found", user });
});

export const changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("+password");
  const { currentPassword, newPassword } = req.body;

  if (!user) return res.status(404).json({ message: "User not found." });

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch)
    return res.status(400).json({ message: "Current password incorrect." });

  user.password = newPassword;
  await user.save();

  res
    .status(200)
    .json({ success: true, message: "Password changed successfully." });
});
