const Joi = require('joi');

// At least 1 lowercase, 1 uppercase, 1 number, 1 special character, 8-64 chars
const passwordRule = Joi.string()
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,64}$/)
  .required()
  .messages({
    'string.pattern.base':
      'Password must be 8-64 characters and include uppercase, lowercase, number and special character',
  });

const register = {
  body: Joi.object({
    name: Joi.string().trim().min(2).max(50).required(),
    email: Joi.string().trim().lowercase().email().required(),
    password: passwordRule,
  }),
};

const login = {
  body: Joi.object({
    email: Joi.string().trim().lowercase().email().required(),
    password: Joi.string().required(), // no strength rule on login, only check it exists
  }),
};


const changePassword = {
  body: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: passwordRule
      .invalid(Joi.ref('currentPassword'))
      .messages({ 'any.invalid': 'New password must be different from the current password' }),
    confirmPassword: Joi.any()
      .valid(Joi.ref('newPassword'))
      .required()
      .messages({ 'any.only': 'Passwords do not match' }),
  }),
};


const verifyEmail = {
  params: Joi.object({
    token: Joi.string().hex().length(64).required(),
  }),
};

const resendVerification = {
  body: Joi.object({
    email: Joi.string().trim().lowercase().email().required(),
  }),
};


const forgotPassword = {
  body: Joi.object({
    email: Joi.string().trim().lowercase().email().required(),
  }),
};

const resetPassword = {
  params: Joi.object({
    token: Joi.string().hex().length(64).required(),
  }),
  body: Joi.object({
    password: passwordRule,
    confirmPassword: Joi.any()
      .valid(Joi.ref('password'))
      .required()
      .messages({ 'any.only': 'Passwords do not match' }),
  }),
};

module.exports = {
  register, login, changePassword, verifyEmail, resendVerification,
  forgotPassword, resetPassword,
};



