import type { QueryClient } from "@tanstack/react-query";
import { redirect, type LoaderFunction } from "react-router";
import { isBasicInfoComplete, resourceSchema } from "~/lib/resource/resource";
import { resourceQueryOptions } from "~/lib/resource/resource.queries";

export function loader(queryClient: QueryClient): LoaderFunction {
  return async ({ params }) => {
    const { resourceId } = params;

    const { data: id, error } = resourceSchema.shape.resourceId.safeParse(Number(resourceId));

    if (error) {
      throw new Response("Resource not found", { status: 404 });
    }

    const resource = await queryClient.ensureQueryData(resourceQueryOptions.getById(id));

    if (resource.status === "draft" && !isBasicInfoComplete(resource.basicInfo)) {
      return redirect(`/resources/${id}/`);
    }

    return null;
  };
}
