// Turns ?page=2&limit=10 into safe numbers plus the "skip" MongoDB needs
const getPagination = ({ page, limit } = {}, { defaultLimit = 10, maxLimit = 50 } = {}) => {
  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.min(Math.max(parseInt(limit, 10) || defaultLimit, 1), maxLimit);

  return { page: pageNum, limit: limitNum, skip: (pageNum - 1) * limitNum };
};

// Builds the "meta" block sent back with every list
const buildMeta = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit);

  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

module.exports = { getPagination, buildMeta };