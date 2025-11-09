import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";

const calculateCartTotals = (cart) => {
  let subtotal = 0;
  let totalQuantity = 0;

  cart.forEach((item) => {
    const productPrice = item.product.salePrice || item.product.price || 0;
    const quantity = item.quantity || 1;
    subtotal += productPrice * quantity;
    totalQuantity += quantity;
  });

  const taxRate = 0.18;
  const taxAmount = subtotal * taxRate;
  const shippingFee = subtotal > 1000 ? 0 : 50;
  const totalAmount = subtotal + taxAmount + shippingFee;

  return {
    subtotal,
    taxAmount,
    shippingFee,
    totalAmount,
    totalQuantity,
  };
};

export const getCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate(
    "cart.product",
    "name price salePrice images stock slug"
  );

  if (!user) return res.status(404).json({ message: "User not found" });

  const totals = calculateCartTotals(user.cart);

  res.status(200).json({
    success: true,
    cart: user.cart,
    ...totals,
  });
});

export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: "Product not found" });

  if (product.stock < quantity) {
    return res.status(400).json({
      message: `Only ${product.stock} items available in stock`,
    });
  }

  const user = await User.findById(req.user._id);

  const itemIndex = user.cart.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex > -1) {
    const newQuantity = user.cart[itemIndex].quantity + quantity;

    if (product.stock < newQuantity) {
      return res.status(400).json({
        message: `Cannot add more than ${product.stock} items`,
      });
    }

    user.cart[itemIndex].quantity = newQuantity;
  } else {
    user.cart.push({ product: productId, quantity });
  }

  await user.save();
  await user.populate("cart.product", "name price salePrice images stock");

  const totals = calculateCartTotals(user.cart);

  res.status(200).json({
    success: true,
    message: "Product added to cart",
    cart: user.cart,
    ...totals,
  });
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  const user = await User.findById(req.user._id);
  await user.populate("cart.product", "name price salePrice images stock");

  const itemIndex = user.cart.findIndex(
    (item) => item.product._id.toString() === productId
  );

  if (itemIndex === -1) {
    return res.status(404).json({ message: "Product not in cart" });
  }

  if (quantity <= 0) {
    user.cart.splice(itemIndex, 1);
  } else {
    // Check stock before updating quantity
    const product = user.cart[itemIndex].product;
    if (product.stock < quantity) {
      return res.status(400).json({
        message: `Only ${product.stock} items available in stock`,
      });
    }
    user.cart[itemIndex].quantity = quantity;
  }

  await user.save();

  const totals = calculateCartTotals(user.cart);

  res.status(200).json({
    success: true,
    message: "Cart updated",
    cart: user.cart,
    ...totals,
  });
});

export const removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  const user = await User.findById(req.user._id);

  user.cart = user.cart.filter((item) => item.product.toString() !== productId);
  await user.save();
  await user.populate("cart.product", "name price salePrice images stock");

  const totals = calculateCartTotals(user.cart);

  res.status(200).json({
    success: true,
    message: "Product removed from cart",
    cart: user.cart,
    ...totals,
  });
});

export const clearCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.cart = [];
  await user.save();

  res.status(200).json({
    success: true,
    message: "Cart cleared",
    cart: [],
    subtotal: 0,
    taxAmount: 0,
    shippingFee: 0,
    totalAmount: 0,
    totalQuantity: 0,
  });
});
