import * as productService from "../service/product.service.js";
import {
  createProductSchema,
  updateProductSchema,
} from "../validation/product.validation.js";

export const createProduct = async (req, res) => {
  try {
    const { error } =
      createProductSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const product =
      await productService.createProduct({
        ...req.body,
        createdBy: req.user._id,
      });

    return res.status(201).json({
      success: true,
      data: product,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    const {
      page,
      limit,
      search,
      category,
      status,
      featured,
      sort,
    } = req.query;

    const filter = {};

    if (search)
      filter.name = {
        $regex: search,
        $options: "i",
      };

    if (category)
      filter.category = category;

    if (status)
      filter.status = status;

    if (featured !== undefined)
      filter.featured =
        featured === "true";

    const data =
      await productService.getProducts(
        filter,
        {
          page,
          limit,
          sort,
        }
      );

    res.json(data);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const getProduct = async (
  req,
  res
) => {
  const product =
    await productService.getProductById(
      req.params.id
    );

  if (!product)
    return res
      .status(404)
      .json({ message: "Product not found" });

  res.json(product);
};

export const updateProduct = async (
  req,
  res
) => {
  const { error } =
    updateProductSchema.validate(req.body);

  if (error)
    return res.status(400).json({
      message: error.details[0].message,
    });

  const product =
    await productService.updateProduct(
      req.params.id,
      {
        ...req.body,
        updatedBy: req.user.id,
      }
    );

  res.json(product);
};

export const deleteProduct = async (
  req,
  res
) => {
  await productService.deleteProduct(
    req.params.id
  );

  res.json({
    success: true,
    message: "Product deleted",
  });
};