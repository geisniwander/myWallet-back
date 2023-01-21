import joi from "joi";

export const movementSchema = joi.object({
  value: joi.number().required(),
  description: joi.string().required(),
  type: joi.any().valid("entry", "exit").required(),
});
