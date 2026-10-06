const ApiError = require('../utils/ApiError');

/**
 * Usage: validate({ body: schema, params: schema, query: schema })
 * You can pass any one of body, params, query, or all of them.
 */
const validate = (schemas) => (req, res, next) => {
  const errors = [];

  ['body', 'params', 'query'].forEach((key) => {
    if (!schemas[key]) return;

    const { error, value } = schemas[key].validate(req[key], {
      abortEarly: false,   // collect ALL errors, not just the first one
      stripUnknown: true,  // silently remove fields not in the schema
      convert: true,       // convert types, e.g. "5" -> 5 in query strings
    });

    if (error) {
      error.details.forEach((detail) => {
        errors.push({
          field: detail.path.join('.'),
          message: detail.message.replace(/"/g, ''), // remove quotes from Joi message
        });
      });
    } else if (key === 'query') {
      // req.query can be read-only in newer Express versions, so redefine it safely
      Object.defineProperty(req, 'query', {
        value,
        writable: true,
        configurable: true,
        enumerable: true,
      });
    } else {
      req[key] = value; // replace with the cleaned, validated data
    }
  });

  if (errors.length > 0) {
    return next(new ApiError(400, 'Validation failed', errors));
  }

  next();
};

module.exports = validate;