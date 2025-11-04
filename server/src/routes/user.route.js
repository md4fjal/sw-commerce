import { Router } from "express";
import { auth, admin } from "../middlewares/auth.middleware.js";
import {
  getAllUsers,
  getUserById,
  deleteUser,
  updateProfile,
  toggleRole,
} from "../controllers/user.controller.js";

const router = Router();

router.get("/", auth, admin, getAllUsers);
router.get("/:id", auth, admin, getUserById);
router.delete("/:id", auth, admin, deleteUser);
router.put("/toggle-role", auth, admin, toggleRole);

router.put("/profile", auth, updateProfile);

export default router;
