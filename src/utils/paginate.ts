export const paginate = (count: number, limit: number): { totalItems: number; totalPages: number } => {
  const pagination = {
    totalItems: count,
    totalPages: Math.ceil(count / (limit || count)) || 0,
  };
  return pagination;
};
