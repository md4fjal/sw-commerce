import mongoose, { Schema } from "mongoose";

const OrderItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

const PaymentInfoSchema = new Schema({
  razorpay_order_id: { type: String },
  razorpay_payment_id: { type: String },
  razorpay_signature: { type: String },
  status: {
    type: String,
    enum: ["pending", "paid", "failed", "refunded"],
    default: "pending",
  },
  amount: { type: Number },
  currency: { type: String, default: "INR" },
});

const OrderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    orderItems: [OrderItemSchema],
    shippingAddress: {
      country: String,
      streetAddress: String,
      apartment: String,
      city: String,
      state: String,
      pinCode: String,
      phone: String,
    },
    paymentInfo: PaymentInfoSchema,
    orderStatus: {
      type: String,
      enum: ["processing", "shipped", "delivered", "cancelled"],
      default: "processing",
    },
    totalAmount: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", OrderSchema);
