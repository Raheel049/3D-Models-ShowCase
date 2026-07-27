import ProductVariant from '../../models/product/productVariant.js';
import * as mediaService from '../../services/productMedia.service.js'
import { uploadBuffer } from "../../utils/cloudinary.js"
import cloudinary from '../../config/cloudinary.js';
import ProductMedia from '../../models/product/productMedia.js';

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




export const uploadModel = async (req, res) => {
  try {

    const { variant } = req.body;

    if (!variant) {
      return res.status(400).json({
        success: false,
        message: "Variant is required",
      });
    }

    const variantData = await ProductVariant.findById(variant);

    if (!variantData) {
      return res.status(404).json({
        success: false,
        message: "Variant not found",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a GLB model",
      });
    }

    const oldModel = await mediaService.findModelByVariant(variant);

    if (oldModel) {
      await cloudinary.uploader.destroy(oldModel.publicId, {
        resource_type: "raw",
      });

      await ProductMedia.findByIdAndDelete(oldModel._id);
    }

    const upload = await uploadBuffer(
      req.file.buffer,
      `3d-showcase/${variantData.name}/model`,
      "raw"
    );

    const model = await ProductMedia.create({
      variant,
      mediaType: "model",
      url: upload.secure_url,
      publicId: upload.public_id,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      createdBy: req.user.id,
    });

    return res.status(201).json({
      success: true,
      data: model,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


export const getVariantMedia = async (req, res) => {
  try {

    const variant = await ProductVariant.findById(req.params.variantId);

    if (!variant) {
      return res.status(404).json({
        success: false,
        message: "Variant not found",
      });
    }

    const media = await mediaService.getVariantMedia(
      req.params.variantId
    );

    const response = {
      cover: null,
      thumbnail: null,
      model: null,
      images: [],
    };

    media.forEach((item) => {

      switch (item.mediaType) {

        case "cover":
          response.cover = item;
          break;

        case "thumbnail":
          response.thumbnail = item;
          break;

        case "model":
          response.model = item;
          break;

        case "image":
          response.images.push(item);
          break;

      }

    });

    return res.status(200).json({
      success: true,
      data: response,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};





export const deleteMedia = async (req, res) => {
  try {

    const media = await mediaService.getMediaById(req.params.id);

    if (!media) {
      return res.status(404).json({
        success: false,
        message: "Media not found",
      });
    }

    await cloudinary.uploader.destroy(
      media.publicId,
      {
        resource_type:
          media.mediaType === "model"
            ? "raw"
            : "image",
      }
    );

    await mediaService.deleteMedia(media._id);

    return res.status(200).json({
      success: true,
      message: "Media deleted successfully",
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};



export const setPrimaryImage = async (req, res) => {

  try{

      const media = await mediaService.getMediaById(req.params.id);

      if(!media){

          return res.status(404).json({
              success:false,
              message:"Media not found"
          });

      }

      await mediaService.resetPrimaryImages(media.variant);

      media.isPrimary = true;

      await media.save();

      return res.status(200).json({

          success:true,

          message:"Primary image updated",

          data:media

      });

  }catch(error){

      return res.status(500).json({

          success:false,

          message:error.message

      });

  }

};


export const reorderImages = async(req,res)=>{

  try{

      const {images}=req.body;

      for(const image of images){

          await ProductMedia.findByIdAndUpdate(

              image.id,

              {

                  displayOrder:image.displayOrder

              }

          );

      }

      return res.status(200).json({

          success:true,

          message:"Images reordered"

      });

  }catch(error){

      return res.status(500).json({

          success:false,

          message:error.message

      });

  }

};