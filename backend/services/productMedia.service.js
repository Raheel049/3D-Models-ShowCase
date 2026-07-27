import ProductMedia from "../models/product/productMedia.js";

export const createManyMedia = async (payload) => {
  return await ProductMedia.insertMany(payload);
};

export const getMediaByVariant = async (variantId) => {
  return await ProductMedia.find({
    variant: variantId,
  }).sort({
    displayOrder: 1,
  });
};

export const getMediaById = async (id) => {
  return await ProductMedia.findById(id);
};

export const deleteMedia = async (id) => {
  return await ProductMedia.findByIdAndDelete(id);
};


export const findModelByVariant = async (variantId) => {
  return await ProductMedia.findOne({
    variant: variantId,
    mediaType: "model",
  });
};


export const resetPrimaryImages = async (variantId) => {

  return await ProductMedia.updateMany(
      {
          variant: variantId,
          mediaType:"image"
      },
      {
          isPrimary:false
      }
  );

};