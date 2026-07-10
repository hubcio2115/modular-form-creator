import { queryOptions, infiniteQueryOptions } from "@tanstack/react-query";
import { getById, list, type Resource } from "./resource";
import type { Nullable, PaginationParams } from "@lib/types";

export const resourceQueryOptions = {
  all: "resources",
  getById: (id: Resource["resourceId"]) =>
    queryOptions({
      queryKey: [resourceQueryOptions.all, id],
      queryFn: () => {
        return getById(id);
      },
    }),

  list: (params: PaginationParams & Nullable<Pick<Resource, "status" | "name">>) =>
    infiniteQueryOptions({
      queryKey: [resourceQueryOptions.all, params],
      queryFn: ({ pageParam }) => {
        return list({ ...params, page: pageParam });
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        const { page, totalPages } = lastPage.pagination;
        return page < totalPages ? page + 1 : undefined;
      },
      placeholderData: (previousData, previousQuery) => {
        const previousParams = previousQuery?.queryKey[1] as typeof params | undefined;
        const sameFilter = previousParams?.status === params.status && previousParams?.sortOrder === params.sortOrder;
        return sameFilter ? previousData : undefined;
      },
      throwOnError: true,
    }),
};
