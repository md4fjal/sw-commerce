import express from "express";
import {
  createRazorpayOrder,
  verifyPayment,
  cancelOrder,
  refundPayment,
  getMyOrders,
} from "../controllers/payment.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(auth);

router.post("/create-order", createRazorpayOrder);
router.post("/verify", verifyPayment);
router.put("/cancel/:orderId", cancelOrder);
router.put("/refund/:orderId", refundPayment);
router.get("/my-orders", getMyOrders);

export default router;
