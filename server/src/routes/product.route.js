import Router from "express";
import { admin, auth } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.js";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  getProductBySlug,
  updateProduct,
} from "../controllers/product.controller.js";

const router = Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.get("/slug/:slug", getProductBySlug);

router.use(auth, admin);

router.post("/", upload.fields([{ name: "images", maxCount: 10 }]), addProduct);

router.put(
  "/:id",
  upload.fields([{ name: "images", maxCount: 10 }]),
  updateProduct
);

router.delete("/:id", deleteProduct);

export default router;
