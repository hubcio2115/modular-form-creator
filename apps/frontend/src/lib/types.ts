export interface PaginationParams {
  page: number;
  pageSize: number;
  sortOrder: "desc" | "asc";
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}
