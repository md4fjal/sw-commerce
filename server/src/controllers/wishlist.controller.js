import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Product } from "../models/product.model.js";

export const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate(
    "wishlist",
    "name price images"
  );
  res.status(200).json({ success: true, wishlist: user.wishlist });
});

export const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: "Product not found" });

  const user = await User.findById(req.user._id);

  if (user.wishlist.includes(productId)) {
    return res.status(400).json({ message: "Product already in wishlist" });
  }

  user.wishlist.push(productId);
  await user.save();

  res.status(200).json({ success: true, message: "Product added to wishlist" });
});

export const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  const user = await User.findById(req.user._id);

  user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
  await user.save();

  res
    .status(200)
    .json({ success: true, message: "Product removed from wishlist" });
});
