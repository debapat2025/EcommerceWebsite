const Joi = require('joi');

// MongoDB ids are exactly 24 hexadecimal characters
const objectId = Joi.string()
  .hex()
  .length(24)
  .messages({
    'string.base': '{{#label}} must be a valid id',
    'string.empty': '{{#label}} must be a valid id',
    'string.hex': '{{#label}} must be a valid id',
    'string.length': '{{#label}} must be a valid id',
  });

// idParams('id')                  -> validates req.params.id
// idParams('id', 'addressId')     -> validates both
const idParams = (...names) => ({
  params: Joi.object(
    Object.fromEntries(names.map((name) => [name, objectId.required()]))
  ),
});

const idParam = idParams('id');

// Keys you spread into any list endpoint's query schema
const paginationKeys = {
  page: Joi.number().integer().min(1).max(10000).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10),
  sort: Joi.string().trim().max(100),
};

const paginationQuery = { query: Joi.object(paginationKeys) };

module.exports = { objectId, idParams, idParam, paginationKeys, paginationQuery };