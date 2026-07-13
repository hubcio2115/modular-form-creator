import { parseAsInteger, parseAsStringEnum, type inferParserType } from "nuqs";

export const paginationParams = {
  pageSize: parseAsInteger.withDefault(10),
  sortOrder: parseAsStringEnum(["desc", "asc"]).withDefault("desc"),
};

export type PaginationParams = inferParserType<typeof paginationParams>;

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface ErrorResponse {
  message: string;
  details: Record<string, unknown>;
}

export type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};
