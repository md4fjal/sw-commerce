import express from "express";
import { createShiprocketOrder } from "../controllers/shiprocket.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(auth);

router.post("/create-order", createShiprocketOrder);

export default router;
