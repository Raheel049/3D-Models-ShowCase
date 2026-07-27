import ProductVariant from "../models/product/productVariant.js";

export const createVariant = async (payload) => {
  return await ProductVariant.create(payload);
};

export const getVariants = async (filter, options = {}) => {
  const {
    page = 1,
    limit = 10,
    sort = "-createdAt",
  } = options;

  const skip = (page - 1) * limit;

  const [variants, total] = await Promise.all([
    ProductVariant.find(filter)
      .populate("product", "name slug")
      .sort(sort)
      .skip(skip)
      .limit(limit),

    ProductVariant.countDocuments(filter),
  ]);

  return {
    variants,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / limit),
  };
};

export const getVariantById = async (id) => {
  return await ProductVariant.findById(id).populate(
    "product",
    "name slug"
  );
};

export const updateVariant = async (id, payload) => {
  return await ProductVariant.findByIdAndUpdate(
    id,
    payload,
    {
      new: true,
      runValidators: true,
    }
  );
};

export const deleteVariant = async (id) => {
  return await ProductVariant.findByIdAndDelete(id);
};

export const findVariantBySku = async (sku) => {
  return await ProductVariant.findOne({ sku });
};

export const findDefaultVariant = async (productId) => {
  return await ProductVariant.findOne({
    product: productId,
    isDefault: true,
  });
};