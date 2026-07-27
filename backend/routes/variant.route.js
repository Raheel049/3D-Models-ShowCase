import express from "express"
import { authMiddleware } from "../middleware/middleware.js";
import { createVariant, getVariants, getVariant,  updateVariant, deleteVariant } from "../controllers/product/productVariant.controller.js";
const variantRouter = express.Router()



variantRouter.post(
    "/create-variant",
    authMiddleware,
    createVariant
    );
    
    variantRouter.get(
    "/get-all",
    getVariants
    );
    
    variantRouter.get(
    "/get-variant/:id",
    getVariant
    );
    
    variantRouter.put(
    "/update-variant/:id",
    authMiddleware,
    updateVariant
    );
    
    variantRouter.delete(
    "/delete-variant/:id",
    authMiddleware,
    deleteVariant
    );

    export default variantRouter