import type { QueryClient } from "@tanstack/react-query";
import { createLoader, parseAsString, parseAsStringEnum, type inferParserType } from "nuqs";
import type { LoaderFunction } from "react-router";
import { resourceQueryOptions } from "~/lib/resource/resource.queries";
import { paginationParams } from "~/lib/types";

export const paginatedResourceParams = {
  name: parseAsString.withDefault(""),
  status: parseAsStringEnum(["draft", "completed"]),
  ...paginationParams,
};

export type PaginatedResourceParams = inferParserType<typeof paginatedResourceParams>;

const paginatedResourceLoader = createLoader(paginatedResourceParams);

export function loader(queryClient: QueryClient): LoaderFunction {
  return async ({ url }) => {
    const searchParams = paginatedResourceLoader(url.searchParams);

    await queryClient.ensureInfiniteQueryData(resourceQueryOptions.list(searchParams));
    return null;
  };
}
