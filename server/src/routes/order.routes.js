import express from "express";

import {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getOrderStats,
} from "../controllers/order.controller.js";
import { auth, admin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/all", auth, admin, getAllOrders);
router.get("/stats", auth, admin, getOrderStats);
router.get("/:orderId", auth, getOrderById);
router.put("/status/:orderId", auth, admin, updateOrderStatus);
router.delete("/:orderId", auth, admin, deleteOrder);

export default router;
