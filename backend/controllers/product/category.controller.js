import * as categoryService from '../../services/category.service.js'
import {
  createCategorySchema,
  updateCategorySchema,
} from "../../validation/category.validation.js";

export const createCategory = async (req, res) => {
  try {
    const { error } = createCategorySchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const existing = await categoryService.getCategories();

    if (
      existing.find(
        (cat) => cat.slug === req.body.slug || cat.name === req.body.name
      )
    ) {
      return res.status(409).json({
        message: "Category already exists",
      });
    }

    const category = await categoryService.createCategory({
      ...req.body,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await categoryService.getCategories();

    res.json({
      success: true,
      data: categories,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const getCategory = async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.id);

  if (!category) {
    return res.status(404).json({
      message: "Category not found",
    });
  }

  res.json({
    success: true,
    data: category,
  });
};

export const updateCategory = async (req, res) => {
  const { error } = updateCategorySchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  const category = await categoryService.updateCategory(req.params.id, {
    ...req.body,
    updatedBy: req.user.id,
  });

  res.json({
    success: true,
    data: category,
  });
};

export const deleteCategory = async (req, res) => {
  await categoryService.deleteCategory(req.params.id);

  res.json({
    success: true,
    message: "Category deleted successfully",
  });
};