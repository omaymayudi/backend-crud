import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controller/ProductController.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/", verifyUser, getProducts);
router.get("/:id", verifyUser, getProductById);
router.post("/", verifyUser, createProduct);
router.put("/:id", verifyUser, updateProduct);
router.delete("/:id", verifyUser, deleteProduct);

export default router;
