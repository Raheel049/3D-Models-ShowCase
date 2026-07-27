import express from "express"
import upload from "../middleware/upload.js";
import { authMiddleware } from "../middleware/middleware.js";
import {uploadImages} from "../controllers/product/productMedia.controller.js"

const uploadRouter = express.Router()

uploadRouter.post(
    "/upload-images",
    authMiddleware,
    upload.array("images",20),
    uploadImages
);

export default uploadRouter