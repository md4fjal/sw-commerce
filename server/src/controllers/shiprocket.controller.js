import axios from "axios";
import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

let shiprocketToken = null;

const authenticateShiprocket = async () => {
  const response = await axios.post(
    "https://apiv2.shiprocket.in/v1/external/auth/login",
    {
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }
  );
  shiprocketToken = response.data.token;
  return shiprocketToken;
};

export const createShiprocketOrder = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate(
    "cart.product",
    "name price"
  );

  if (!user || !user.shippingAddress)
    return res.status(400).json({ message: "Shipping address required" });

  if (!shiprocketToken) await authenticateShiprocket();

  const totalAmount = user.cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const orderPayload = {
    order_id: `ORD_${Date.now()}`,
    order_date: new Date().toISOString(),
    pickup_location: "Primary",
    channel_id: "",
    billing_customer_name: user.firstname,
    billing_last_name: user.lastname,
    billing_address: user.shippingAddress.streetAddress,
    billing_city: user.shippingAddress.city,
    billing_pincode: user.shippingAddress.pinCode,
    billing_state: user.shippingAddress.state,
    billing_country: user.shippingAddress.country,
    billing_email: user.email,
    billing_phone: user.phone,
    shipping_is_billing: true,
    order_items: user.cart.map((item) => ({
      name: item.product.name,
      sku: item.product._id,
      units: item.quantity,
      selling_price: item.product.price,
    })),
    payment_method: "Prepaid",
    sub_total: totalAmount,
    length: 10,
    breadth: 10,
    height: 10,
    weight: 1.0,
  };

  const response = await axios.post(
    "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
    orderPayload,
    { headers: { Authorization: `Bearer ${shiprocketToken}` } }
  );

  res.status(200).json({
    success: true,
    shiprocketOrder: response.data,
  });
});
