import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import type { LoaderFunction } from "react-router";
import { resourceSchema, type Resource } from "~/lib/resource/resource";
import { resourceQueryOptions } from "~/lib/resource/resource.queries";
import type { PaginatedResponse } from "~/lib/types";

export function loader(queryClient: QueryClient): LoaderFunction {
  return async ({ params }) => {
    const { resourceId } = params;

    const { data: id, error } = resourceSchema.shape.resourceId.safeParse(Number(resourceId));

    if (error) {
      throw new Response("Resource not found", { status: 404 });
    }

    const options = resourceQueryOptions.getById(id);

    if (!queryClient.getQueryData(options.queryKey)) {
      const resources = queryClient
        .getQueriesData<InfiniteData<PaginatedResponse<Resource>>>({ queryKey: [resourceQueryOptions.all] })
        .flatMap(([, data]) => data?.pages ?? [])
        .flatMap((page) => page.items);

      const cached = resources.find((resource) => resource.resourceId === id);

      if (cached) {
        queryClient.setQueryData(options.queryKey, cached);
      }
    }

    void queryClient.ensureQueryData(options);

    return null;
  };
}
