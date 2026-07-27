import Product from '../models/product/product.js'

export const createProduct = async (payload) => {
  return await Product.create(payload);
};

export const getProducts = async (
  filter,
  options = {}
) => {
  const {
    page = 1,
    limit = 10,
    sort = "-createdAt",
  } = options;

  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate("category", "name")
      .sort(sort)
      .skip(skip)
      .limit(limit),

    Product.countDocuments(filter),
  ]);

  return {
    products,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

export const getProductById = async (id) => {
  return await Product.findById(id).populate(
    "category",
    "name"
  );
};

export const updateProduct = async (
  id,
  payload
) => {
  return await Product.findByIdAndUpdate(
    id,
    payload,
    {
      new: true,
      runValidators: true,
    }
  );
};

export const deleteProduct = async (id) => {
  return await Product.findByIdAndDelete(id);
};

