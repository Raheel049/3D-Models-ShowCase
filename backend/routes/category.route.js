import express from "express";
import * as categoryController from "../controllers/product/category.controller.js";
import { authMiddleware } from '../middleware/middleware.js'

const categoryRouter = express.Router();

categoryRouter.post(
  "/create-category",
  authMiddleware,
  categoryController.createCategory
);

categoryRouter.get(
  "/get-all",
  categoryController.getCategories
);

categoryRouter.get(
  "/get-category/:id",
  categoryController.getCategory
);

categoryRouter.put(
  "/update-category/:id",
  authMiddleware,
  categoryController.updateCategory
);

categoryRouter.delete(
  "/delete-category/:id",
  authMiddleware,
  categoryController.deleteCategory
);

export default categoryRouter;