import Joi from "joi";

export const resetPasswordValidation = Joi.object({
  password: Joi.string().alphanum().min(6).max(20).required(),
  confirmPassword: Joi.allow()
});
