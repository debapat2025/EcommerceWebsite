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

module.exports = { updateMe, deactivateMe };

