import Router from "express";
import { admin, auth } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.js";
import {
  addCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  getCategoryBySlug,
  updateCategory,
} from "../controllers/category.controller.js";

const router = Router();

router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.get("/slug/:slug", getCategoryBySlug);

router.use(auth, admin);

router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "banner", maxCount: 1 },
    { name: "icon", maxCount: 1 },
  ]),
  addCategory
);

router.put(
  "/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "banner", maxCount: 1 },
    { name: "icon", maxCount: 1 },
  ]),
  updateCategory
);

router.delete("/:id", deleteCategory);

export default router;
