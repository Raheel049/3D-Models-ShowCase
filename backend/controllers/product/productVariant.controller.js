import Product from '../../models/product/product.js';
import * as variantService from '../../services/productVariant.service.js'
import { createVariantSchema } from "../../validation/productVariant.validation.js";
import { updateVariantSchema } from '../../validation/productVariant.validation.js';

export const createVariant = async (req, res) => {
  try {
    const { error } = createVariantSchema.validate(req.body);
    const {product} = req.body
    

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const productData = await Product.findById(product);
    

    if (!productData) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const existingSku =
      await variantService.findVariantBySku(req.body.sku);

    if (existingSku) {
      return res.status(409).json({
        success: false,
        message: "SKU already exists",
      });
    }

    if (req.body.isDefault) {
      const defaultVariant =
        await variantService.findDefaultVariant(
          req.body.product
        );

      if (defaultVariant) {
        defaultVariant.isDefault = false;
        await defaultVariant.save();
      }
    }

    const variant =
      await variantService.createVariant({
        ...req.body,
        createdBy: req.user.id,
      });

    return res.status(201).json({
      success: true,
      data: variant,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getVariants = async (req, res) => {
  try {
    const {
      page,
      limit,
      search,
      product,
      status,
      sort,
    } = req.query;

    const filter = {};

    if (search) {
      filter.name = {
        $regex: search,
        $options: "i",
      };
    }

    if (product) {
      filter.product = product;
    }

    if (status) {
      filter.status = status;
    }

    const variants =
      await variantService.getVariants(filter, {
        page,
        limit,
        sort,
      });

    return res.status(200).json({
      success: true,
      ...variants,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getVariant = async (req, res) => {
  try {
    const variant =
      await variantService.getVariantById(req.params.id);

    if (!variant) {
      return res.status(404).json({
        success: false,
        message: "Variant not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: variant,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateVariant = async (req, res) => {
  try {
    const { error } = updateVariantSchema.validate(
      req.body
    );

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const variant =
      await variantService.getVariantById(req.params.id);

    if (!variant) {
      return res.status(404).json({
        success: false,
        message: "Variant not found",
      });
    }

    if (
      req.body.sku &&
      req.body.sku !== variant.sku
    ) {
      const existingSku =
        await variantService.findVariantBySku(
          req.body.sku
        );

      if (existingSku) {
        return res.status(409).json({
          success: false,
          message: "SKU already exists",
        });
      }
    }

    if (req.body.isDefault) {
      const defaultVariant =
        await variantService.findDefaultVariant(
          variant.product
        );

      if (
        defaultVariant &&
        defaultVariant._id.toString() !==
          req.params.id
      ) {
        defaultVariant.isDefault = false;
        await defaultVariant.save();
      }
    }

    const updatedVariant =
      await variantService.updateVariant(
        req.params.id,
        {
          ...req.body,
          updatedBy: req.user.id,
        }
      );

    return res.status(200).json({
      success: true,
      data: updatedVariant,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteVariant = async (req, res) => {
  try {
    const variant =
      await variantService.getVariantById(req.params.id);

    if (!variant) {
      return res.status(404).json({
        success: false,
        message: "Variant not found",
      });
    }

    await variantService.deleteVariant(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Variant deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};