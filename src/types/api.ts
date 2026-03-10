export type ApiSuccessResponse<T> = {
  data: T;
};

export type ApiErrorResponse = {
  error: string;
  resource?: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  page: number;
  limit: number;
  total: number;
};
