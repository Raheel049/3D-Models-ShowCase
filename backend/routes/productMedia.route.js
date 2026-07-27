import express from "express"
import upload from "../middleware/upload.js";
import { authMiddleware } from "../middleware/middleware.js";
import {uploadImages, uploadModel, getVariantMedia, deleteMedia, setPrimaryImage, reorderImages} from "../controllers/product/productMedia.controller.js"

const uploadRouter = express.Router()

uploadRouter.post(
    "/upload-images",
    authMiddleware,
    upload.array("images",20),
    uploadImages
);

uploadRouter.post(
    "/upload-model",
    authMiddleware,
    upload.single("model"),
    uploadModel
);

uploadRouter.get(
    "/variant/:variantId",
    getVariantMedia
);

uploadRouter.delete(
    "/:id",
    authMiddleware,
    deleteMedia
);

uploadRouter.patch(
    "/set-primary/:id",
    authMiddleware,
    setPrimaryImage
);

uploadRouter.patch(
    "/reorder",
    authMiddleware,
    reorderImages
);

export default uploadRouter