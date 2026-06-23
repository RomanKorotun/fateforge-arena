interface PaginationParams {
  page: number;
  limit: number;
  totalItems: number;
}

export const createPagination = ({
  page,
  limit,
  totalItems,
}: PaginationParams) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

  return {
    page,
    totalItems,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};
