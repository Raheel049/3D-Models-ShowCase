import Joi from "joi";

export const createHotspotSchema = Joi.object({
  variant: Joi.string()
    .hex()
    .length(24)
    .required(),

  title: Joi.string()
    .max(100)
    .required(),

  description: Joi.string()
    .max(500)
    .required(),

  position: Joi.object({
    x: Joi.number().required(),
    y: Joi.number().required(),
    z: Joi.number().required(),
  }).required(),

  icon: Joi.string()
    .valid(
      "pin",
      "plus",
      "info",
      "star",
      "circle"
    )
    .optional(),

  color: Joi.string()
    .optional(),

  isVisible: Joi.boolean()
    .optional(),

  displayOrder: Joi.number()
    .optional(),
});

export const updateHotspotSchema =
  createHotspotSchema.fork(
    ["variant", "title", "description", "position"],
    (field) => field.optional()
  );