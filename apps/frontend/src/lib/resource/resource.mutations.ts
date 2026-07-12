import { mutationOptions } from "@tanstack/react-query";
import {
  createResource,
  deleteById,
  patchBasicInfo,
  patchProjectDetails,
  provision,
  replaceResource,
  type Resource,
} from "./resource";

export const resourceMutationOptions = {
  all: "resources",
  create: () =>
    mutationOptions({
      mutationKey: [resourceMutationOptions.all, "create"],
      mutationFn: (name: Resource["name"]) => {
        return createResource(name);
      },
    }),

  replace: () =>
    mutationOptions({
      mutationKey: [resourceMutationOptions.all, "replace"],
      mutationFn: (resource: Resource) => {
        return replaceResource(resource);
      },
    }),

  deleteById: () =>
    mutationOptions({
      mutationKey: [resourceMutationOptions.all, "deleteById"],
      mutationFn: (id: Resource["resourceId"]) => {
        return deleteById(id);
      },
    }),

  patchBasicInfo: () =>
    mutationOptions({
      mutationKey: [resourceMutationOptions.all, "patchBasicInfo"],
      mutationFn: (params: Pick<Resource, "resourceId" | "basicInfo">) => {
        return patchBasicInfo(params);
      },
    }),

  patchProjectDetails: () =>
    mutationOptions({
      mutationKey: [resourceMutationOptions.all, "patchProjectDetails"],
      mutationFn: (params: Pick<Resource, "resourceId" | "projectDetails">) => {
        return patchProjectDetails(params);
      },
    }),

  provision: () =>
    mutationOptions({
      mutationKey: [resourceMutationOptions.all, "provision"],
      mutationFn: (id: Resource["resourceId"]) => {
        return provision(id);
      },
    }),
};
