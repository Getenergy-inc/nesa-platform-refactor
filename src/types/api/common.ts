/**
 * NESA Africa API — Shared response & pagination types.
 * Matches the public API contract in docs/openapi.yaml.
 */

export type ApiMeta = {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
};

export type ApiSuccess<T> = {
  success: true;
  message: string;
  data: T;
  meta?: ApiMeta;
};

export type ApiErrorBody = {
  success: false;
  message: string;
  error?: {
    code: string;
    details?: Array<{ field?: string; message: string }>;
  };
};

export type ApiResponse<T> = ApiSuccess<T>;

export type ListQuery = {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
};

export type Id = string;
