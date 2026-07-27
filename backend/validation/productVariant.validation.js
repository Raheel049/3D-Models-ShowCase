import Joi from "joi";

export const createVariantSchema = Joi.object({
  product: Joi.string().hex().length(24).required(),

  name: Joi.string().required(),

  sku: Joi.string().required(),

  color: Joi.string().allow("", null),

  material: Joi.string().allow("", null),

  isDefault: Joi.boolean(),

  displayOrder: Joi.number(),

  status: Joi.string().valid("active", "inactive"),
});

export const updateVariantSchema = Joi.object({
  name: Joi.string(),

  sku: Joi.string(),

  color: Joi.string().allow("", null),

  material: Joi.string().allow("", null),

  isDefault: Joi.boolean(),

  displayOrder: Joi.number(),

  status: Joi.string().valid("active", "inactive"),
}).min(1);