import Joi from "joi";

export const createProductSchema = Joi.object({
  name: Joi.string().trim().min(3).max(100).required(),

  slug: Joi.string().trim().lowercase().required(),

  shortDescription: Joi.string().allow("", null),

  description: Joi.string().allow("", null),

  category: Joi.string().hex().length(24).required(),

  status: Joi.string()
    .valid("draft", "published", "archived")
    .optional(),

  featured: Joi.boolean().optional(),
});

export const updateProductSchema = Joi.object({
  name: Joi.string().trim().min(3).max(100),

  slug: Joi.string().trim().lowercase(),

  shortDescription: Joi.string().allow("", null),

  description: Joi.string().allow("", null),

  category: Joi.string().hex().length(24),

  status: Joi.string().valid("draft", "published", "archived"),

  featured: Joi.boolean(),
}).min(1);