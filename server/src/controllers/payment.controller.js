import crypto from "crypto";
import { razorpayInstance } from "../utils/razorpay.js";
import { User } from "../models/user.model.js";
import { Order } from "../models/order.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Product } from "../models/product.model.js";

export const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  let orderItems = [];
  let totalAmount = 0;

  if (productId) {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.stock < (quantity || 1)) {
      return res.status(400).json({
        message: "Insufficient stock available",
      });
    }

    const productPrice = product.salePrice || product.price;
    totalAmount = productPrice * (quantity || 1);
    orderItems.push({
      product: product._id,
      name: product.name,
      price: productPrice,
      quantity: quantity || 1,
    });
  } else {
    const user = await User.findById(req.user._id).populate(
      "cart.product",
      "price salePrice name stock"
    );

    if (!user || !user.cart.length) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    for (const item of user.cart) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${item.product.name}`,
        });
      }
    }

    orderItems = user.cart.map((item) => {
      const productPrice = item.product.salePrice || item.product.price;
      return {
        product: item.product._id,
        name: item.product.name,
        price: productPrice,
        quantity: item.quantity,
      };
    });

    totalAmount = user.cart.reduce(
      (sum, item) =>
        sum + (item.product.salePrice || item.product.price) * item.quantity,
      0
    );
  }

  const options = {
    amount: Math.round(totalAmount * 100),
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  };

  const order = await razorpayInstance.orders.create(options);

  const newOrder = await Order.create({
    user: req.user._id,
    orderItems,
    totalAmount,
    paymentInfo: {
      razorpay_order_id: order.id,
      status: "pending",
      amount: totalAmount,
      currency: "INR",
    },
  });

  res.status(200).json({
    success: true,
    orderId: order.id,
    amount: options.amount,
    currency: options.currency,
    key: process.env.RAZORPAY_KEY_ID,
    dbOrderId: newOrder._id,
  });
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  const order = await Order.findOne({
    "paymentInfo.razorpay_order_id": razorpay_order_id,
  });

  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  if (!isAuthentic) {
    order.paymentInfo.status = "failed";
    await order.save();
    return res
      .status(400)
      .json({ success: false, message: "Invalid signature" });
  }

  order.paymentInfo = {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    status: "paid",
    amount: order.totalAmount,
    currency: "INR",
  };

  await order.save();

  for (const item of order.orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity },
    });
  }

  await User.findByIdAndUpdate(order.user, { $set: { cart: [] } });

  res.status(200).json({ success: true, message: "Payment verified", order });
});

export const cancelOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const order = await Order.findById(orderId);

  if (!order) return res.status(404).json({ message: "Order not found" });
  if (order.orderStatus !== "processing") {
    return res.status(400).json({ message: "Cannot cancel now" });
  }

  order.orderStatus = "cancelled";
  await order.save();

  res.status(200).json({ success: true, message: "Order cancelled", order });
});

export const refundPayment = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ message: "Order not found" });
  if (order.paymentInfo.status !== "paid") {
    return res.status(400).json({ message: "Order not paid yet" });
  }

  const refund = await razorpayInstance.payments.refund(
    order.paymentInfo.razorpay_payment_id,
    {
      amount: Math.round(order.totalAmount * 100),
    }
  );

  order.paymentInfo.status = "refunded";
  order.orderStatus = "cancelled";
  await order.save();

  for (const item of order.orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: item.quantity },
    });
  }

  res.status(200).json({
    success: true,
    message: "Refund initiated",
    refund,
  });
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate("orderItems.product", "name price images slug")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, orders });
});
