import { Router } from "express";
import { auth } from "../middlewares/auth.middleware.js";
import {
  getAddresses,
  updateBillingAddress,
  updateShippingAddress,
} from "../controllers/address.controller.js";

const router = Router();

router.get("/", auth, getAddresses);
router.put("/billing", auth, updateBillingAddress);
router.put("/shipping", auth, updateShippingAddress);

export default router;
