import { queryOptions, keepPreviousData } from "@tanstack/react-query";
import type { Resource } from "./resource";
import { $fetch } from "@lib/$fetch";
import type { PaginationParams, PaginatedResponse } from "@lib/types";

const resourceQueryOptions = {
  all: "resources",
  getById: (id: Resource["resourceId"]) =>
    queryOptions({
      queryKey: [resourceQueryOptions.all, id],
      queryFn: () => {
        return $fetch<Resource>(`/api/resources/${id}`);
      },
    }),

  list: (params: PaginationParams & Pick<Resource, "status" | "name">) =>
    queryOptions({
      queryKey: [resourceQueryOptions.all, params],
      queryFn: () => {
        return $fetch<PaginatedResponse<Resource>>("/api/resources", {
          params,
        });
      },
      placeholderData: keepPreviousData,
    }),
};
