import express from "express";
import { authMiddleware } from "../middleware/middleware.js";
import * as productController from '../controllers/product/product.controller.js'


const productRouter = express.Router();

productRouter.post(
  "/create-product",
  authMiddleware,
  productController.createProduct
);

productRouter.get(
  "/get-all",
  productController.getProducts
);

productRouter.get(
  "/get-product/:id",
  productController.getProduct
);

productRouter.put(
  "/update-product/:id",
  authMiddleware,
  productController.updateProduct
);

productRouter.delete(
  "/delete-product/:id",
  authMiddleware,
  productController.deleteProduct
);

export default productRouter;