import Joi from "joi";


export const createCategorySchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),

  slug: Joi.string().trim().lowercase().required(),

  description: Joi.string().allow("", null),

  isActive: Joi.boolean(),
});

export const updateCategorySchema = Joi.object({
  name: Joi.string().trim().min(2).max(50),

  slug: Joi.string().trim().lowercase(),

  description: Joi.string().allow("", null),

  isActive: Joi.boolean(),
}).min(1);