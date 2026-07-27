import ProductHotspot from "../models/product/productHotspot.js";

export const createHotspot = async (payload) => {
  return await ProductHotspot.create(payload);
};

export const getHotspots = async (variantId) => {
  return await ProductHotspot.find({
    variant: variantId,
  }).sort({
    displayOrder: 1,
  });
};

export const getHotspotById = async (id) => {
  return await ProductHotspot.findById(id);
};

export const updateHotspot = async (id, payload) => {
  return await ProductHotspot.findByIdAndUpdate(
    id,
    payload,
    {
      new: true,
      runValidators: true,
    }
  );
};

export const deleteHotspot = async (id) => {
  return await ProductHotspot.findByIdAndDelete(id);
};

export const reorderHotspots = async (hotspots) => {
  const promises = hotspots.map((item) =>
    ProductHotspot.findByIdAndUpdate(item.id, {
      displayOrder: item.displayOrder,
    })
  );

  return await Promise.all(promises);
};