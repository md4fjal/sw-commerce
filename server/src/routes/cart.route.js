import express from "express";

import { auth } from "../middlewares/auth.middleware.js";
import {
  addToCart,
  clearCart,
  getCart,
  removeFromCart,
  updateCartItem,
} from "../controllers/cart.controller.js";

const router = express.Router();

router.use(auth);

router.get("/", getCart);
router.post("/add", addToCart);
router.put("/update", updateCartItem);
router.put("/remove", removeFromCart);
router.delete("/clear", clearCart);

export default router;
