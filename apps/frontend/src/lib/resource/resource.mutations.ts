import { mutationOptions } from "@tanstack/react-query";
import type { Resource } from "./resource";
import { $fetch } from "@lib/$fetch";

export const resourceMutationOptions = {
  all: "resources",
  create: () =>
    mutationOptions({
      mutationKey: [resourceMutationOptions.all, "create"],
      mutationFn: ({ name }: Pick<Resource, "name">) => {
        return $fetch<Resource>("/api/resources", {
          method: "POST",
          body: {
            resourceName: name,
          },
        });
      },
    }),

  replace: () =>
    mutationOptions({
      mutationKey: [resourceMutationOptions.all, "replace"],
      mutationFn: (resource: Resource) => {
        return $fetch(`/api/resources/${resource.resourceId}`, {
          method: "PUT",
          body: resource,
        });
      },
    }),

  deleteById: () =>
    mutationOptions({
      mutationKey: [resourceMutationOptions.all, "deleteById"],
      mutationFn: ({ resourceId: id }: Pick<Resource, "resourceId">) => {
        return $fetch<Resource>(`/api/resources/${id}`, {
          method: "DELETE",
        });
      },
    }),

  patchBasicInfo: () =>
    mutationOptions({
      mutationKey: [resourceMutationOptions.all, "patchBasicInfo"],
      mutationFn: ({ resourceId: id, basicInfo }: Pick<Resource, "resourceId" | "basicInfo">) => {
        return $fetch(`/api/resources/${id}/basic-info`, {
          method: "PATCH",
          body: basicInfo,
        });
      },
    }),

  patchProjectDetails: () =>
    mutationOptions({
      mutationKey: [resourceMutationOptions.all, "patchProjectDetails"],
      mutationFn: ({ resourceId: id, basicInfo }: Pick<Resource, "resourceId" | "basicInfo">) => {
        return $fetch(`/api/resources/${id}/project-details`, {
          method: "PATCH",
          body: basicInfo,
        });
      },
    }),

  provision: () =>
    mutationOptions({
      mutationKey: [resourceMutationOptions.all, "provision"],
      mutationFn: ({ resourceId: id }: Pick<Resource, "resourceId">) => {
        return $fetch(`/api/resources/${id}/provisioning`, {
          method: "PATCH",
        });
      },
    }),
};
