import Category from "../models/product/category.js";

export const createCategory = async (payload) => {
  return await Category.create(payload);
};

export const getCategories = async () => {
  return await Category.find().sort({ createdAt: -1 });
};

export const getCategoryById = async (id) => {
  return await Category.findById(id);
};

export const updateCategory = async (id, payload) => {
  return await Category.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
};

export const deleteCategory = async (id) => {
  return await Category.findByIdAndDelete(id);
};