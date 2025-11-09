import express from "express";

import { auth } from "../middlewares/auth.middleware.js";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "../controllers/wishlist.controller.js";

const router = express.Router();

router.use(auth);

router.get("/", getWishlist);
router.post("/add", addToWishlist);
router.delete("/remove", removeFromWishlist);

export default router;
