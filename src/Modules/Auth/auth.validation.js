import joi from "joi";
import { generalFields } from "../../middlewares/validation.middleware.js";

export const registerSchema=joi.object({
    userName:generalFields.userName.required(),
    email:generalFields.email.required(),
    password:generalFields.password.required(),
    confirmPassword:generalFields.confirmPassword.required(),
    gender:generalFields.gender,
    phone:generalFields.phone,
    role:generalFields.role
}).required();

export const loginSchema=joi.object({
    email:generalFields.email.required(),
    password:generalFields.password.required(),
}).required();

export const forgetPasswordSchema=joi.object({
    email:generalFields.email.required(),
}).required();

export const verifyOTPschema=joi.object({
    email:generalFields.email.required(),
    code:generalFields.code.required(),
}).required()

export const resetPasswordSchema=joi.object({
    email:generalFields.email.required(),
    password:generalFields.password.required(),
    confirmPassword:generalFields.confirmPassword.required()
}).required()