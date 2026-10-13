const Joi = require('joi');

const updateMe = {
  body: Joi.object({
    name: Joi.string().trim().min(2).max(50),
    phone: Joi.string()
      .trim()
      .pattern(/^[6-9]\d{9}$/)
      .messages({ 'string.pattern.base': 'Phone must be a valid 10 digit mobile number' }),
  })

  
};

const deactivateMe = {
  body: Joi.object({
    password: Joi.string().required(),
  }),
};




const address = {
  body: Joi.object({
    fullName: Joi.string().trim().min(2).max(50).required(),
    phone: Joi.string().trim().pattern(/^[6-9]\d{9}$/).required()
      .messages({ 'string.pattern.base': 'Phone must be a valid 10 digit mobile number' }),
    line1: Joi.string().trim().min(3).max(100).required(),
    line2: Joi.string().trim().max(100).allow(''),
    city: Joi.string().trim().min(2).max(50).required(),
    state: Joi.string().trim().min(2).max(50).required(),
    pincode: Joi.string().trim().pattern(/^\d{6}$/).required()
      .messages({ 'string.pattern.base': 'Pincode must be 6 digits' }),
    country: Joi.string().trim().max(50),
    isDefault: Joi.boolean(),
  }),
};

module.exports = { updateMe, deactivateMe, address };

