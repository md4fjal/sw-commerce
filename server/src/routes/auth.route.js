import Router from "express";
import {
  changePassword,
  getMe,
  login,
  register,
} from "../controllers/auth.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", auth, getMe);
router.put("/change-password", auth, changePassword);

export default router;
