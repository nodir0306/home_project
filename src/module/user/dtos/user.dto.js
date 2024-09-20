import Joi from "joi";

export const userCreateValidation = Joi.object({
    name: Joi.string().required(),
    surname: Joi.string().required(),
    email: Joi.string().required().email(),
    phone: Joi.string().regex(/^998([378]{2}|(9[013-57-9]))\d{7}$/).required(),
    password: Joi.string().regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/).required(),
    password_repeat: Joi.string().regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/).required(),
    role: Joi.string().valid("user", "admin", "owner")
});


export const userUpdateValidation = Joi.object({
    name: Joi.string(),
    surname: Joi.string(),
    email: Joi.string().email(),
    phone: Joi.string().regex(/^998([378]{2}|(9[013-57-9]))\d{7}$/),
    password: Joi.string().regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
});