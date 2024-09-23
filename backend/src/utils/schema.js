const Joi = require('joi');

const registrationSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(225).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(225).required(),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

const resetPasswordSchema = Joi.object({
  otp: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
});

module.exports = {registrationSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema}
