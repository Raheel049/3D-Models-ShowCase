import ProductVariant from '../../models/product/productVariant.js';
import * as mediaService from '../../services/productMedia.service.js'
import { uploadBuffer } from "../../utils/cloudinary.js"

export const uploadImages = async (req, res) => {
  try {

    const { variant } = req.body;

    if (!variant) {
      return res.status(400).json({
        success: false,
        message: "Variant is required",
      });
    }

    const variantData =
      await ProductVariant.findById(variant);

    if (!variantData) {
      return res.status(404).json({
        success: false,
        message: "Variant not found",
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please upload images",
      });
    }

    const media = [];

    let order = 1;

    for (const file of req.files) {

      const upload = await uploadBuffer(
        file.buffer,
        `3d-showcase/${variantData.name}/images`
      );

      media.push({

        variant,

        mediaType: "image",

        url: upload.secure_url,

        publicId: upload.public_id,

        originalName: file.originalname,

        mimeType: file.mimetype,

        size: file.size,

        displayOrder: order++,

        createdBy: req.user.id,

      });

    }

    const result =
      await mediaService.createManyMedia(media);

    return res.status(201).json({

      success: true,

      total: result.length,

      data: result,

    });

  } catch (error) {

    return res.status(500).json({

      success: false,

      message: error.message,

    });

  }
};