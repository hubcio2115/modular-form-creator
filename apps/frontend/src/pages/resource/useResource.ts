import { useOutletContext } from "react-router";
import { resourceSchema, type Resource } from "~/lib/resource/resource";

/**
 * Gets the resource provided in an `OutletContext`.
 *
 * @throws {Error} When used outside of the `OutletContext`, or it was not provided in one.
 */
export function useResource(): Resource {
  const context = useOutletContext();

  const { data, error } = resourceSchema.safeParse(context);

  if (error) {
    throw new Error("Resource was used outside of the Outlet context, or it was not provided in one.");
  }

  return data;
}
