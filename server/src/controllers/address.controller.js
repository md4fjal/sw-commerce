import { User } from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getAddresses = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const user = await User.findById(userId)
    .select("billingAddress shippingAddress")
    .lean();

  if (!user) return res.status(404).json({ message: "User not found" });

  res.status(200).json({
    success: true,
    billingAddress: user.billingAddress,
    shippingAddress: user.shippingAddress,
  });
});

export const updateBillingAddress = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { billingAddress } = req.body;

  if (!billingAddress)
    return res.status(400).json({ message: "Billing address required" });

  const user = await User.findByIdAndUpdate(
    userId,
    { billingAddress },
    { new: true }
  ).select("billingAddress shippingAddress");

  res.status(200).json({
    success: true,
    message: "Billing address updated successfully",
    billingAddress: user.billingAddress,
  });
});

export const updateShippingAddress = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { shippingAddress } = req.body;

  if (!shippingAddress)
    return res.status(400).json({ message: "Shipping address required" });

  const user = await User.findByIdAndUpdate(
    userId,
    { shippingAddress },
    { new: true }
  ).select("billingAddress shippingAddress");

  res.status(200).json({
    success: true,
    message: "Shipping address updated successfully",
    shippingAddress: user.shippingAddress,
  });
});
