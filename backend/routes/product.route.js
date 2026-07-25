import express from "express";
import * as productController from "../controller/product.controller.js";
import authMiddleware

const router = express.Router();

router.post(
  "/create-product",
  authMiddleware,
  productController.createProduct
);

router.get(
  "/get-all",
  productController.getProducts
);

router.get(
  "/get-product:id",
  productController.getProduct
);

router.put(
  "/update:id",
  authMiddleware,
  productController.updateProduct
);

router.delete(
  "/delete-product:id",
  authMiddleware,
  productController.deleteProduct
);

export default router;