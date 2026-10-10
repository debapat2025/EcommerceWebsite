// "-createdAt,name" -> { createdAt: -1, name: 1, _id: 1 }
// Only fields in the allowed list are used. Anything else is ignored.
const parseSort = (sortParam, allowedFields, defaultSort = { createdAt: -1 }) => {
  const sort = {};

  if (sortParam) {
    sortParam.split(',').forEach((part) => {
      const descending = part.startsWith('-');
      const field = descending ? part.slice(1) : part;

      if (allowedFields.includes(field)) {
        sort[field] = descending ? -1 : 1;
      }
    });
  }

  const result = Object.keys(sort).length > 0 ? sort : { ...defaultSort };

  // Tie-breaker: makes the order identical on every request (explained below)
  if (!result._id) result._id = 1;

  return result;
};

// Makes user text safe to put inside a regular expression
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

module.exports = { parseSort, escapeRegex };