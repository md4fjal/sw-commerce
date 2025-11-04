import { User } from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getAllUsers = asyncHandler(async (req, res) => {
  let { search, sortBy, order, page, limit } = req.query;

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  sortBy = sortBy || "createdAt";
  order = order === "asc" ? 1 : -1;

  const skip = (page - 1) * limit;

  const query = search
    ? {
        $or: [
          { firstname: { $regex: search, $options: "i" } },
          { lastname: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }
    : {};

  const total = await User.countDocuments(query);

  const users = await User.find(query)
    .select("-password")
    .sort({ [sortBy]: order })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    total,
    page,
    pages: Math.ceil(total / limit),
    users,
  });
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });

  res.status(200).json({ success: true, user });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  res.status(200).json({ success: true, message: "User deleted successfully" });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { firstname, lastname, email } = req.body;

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (firstname) user.firstname = firstname;
  if (lastname) user.lastname = lastname;
  if (email) user.email = email;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user,
  });
});

export const toggleRole = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) return res.status(400).json({ message: "User ID is required" });

  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.role = user.role === "admin" ? "user" : "admin";
  await user.save();

  res.status(200).json({
    success: true,
    message: `User role toggled to ${user.role}`,
    user,
  });
});
