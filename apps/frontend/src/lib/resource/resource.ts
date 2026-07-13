import { z } from "zod/mini";
import { $fetch } from "@lib/$fetch";
import type { Nullable, PaginatedResponse, PaginationParams } from "@lib/types";

export const basicInfoSchema = z.object({
  resourceName: z.string(),
  owner: z.string(),
  email: z.string(),
  description: z.string(),
  priority: z.enum(["low", "medium", "high", ""], { error: "Priority is required" }),
});

export const projectDetailsSchema = z.object({
  projectName: z.string(),
  budget: z.string(),
  category: z.enum(["internal", "external", "vendor", ""], { error: "Category is required" }),
  options: z.array(z.string()),
});

export const resourceSchema = z.object({
  _id: z.string(),
  resourceId: z.number(),
  name: z.string(),
  status: z.enum(["draft", "completed"]),

  basicInfo: basicInfoSchema,

  projectDetails: projectDetailsSchema,

  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type Resource = z.infer<typeof resourceSchema>;

export function isBasicInfoComplete(basicInfo: Resource["basicInfo"]) {
  return Boolean(
    basicInfo.resourceName && basicInfo.owner && basicInfo.email && basicInfo.description && basicInfo.priority,
  );
}

export function isProjectDetailsComplete(projectDetails: Resource["projectDetails"]) {
  return Boolean(
    projectDetails.projectName && projectDetails.budget && projectDetails.category && projectDetails.options.length > 0,
  );
}

export function getById(id: Resource["resourceId"]) {
  return $fetch<Resource>(`/api/resources/${id}`);
}

export function list(params: PaginationParams & Nullable<Pick<Resource, "status" | "name">> & { page: number }) {
  return $fetch<PaginatedResponse<Resource>>("/api/resources", {
    query: params,
  });
}

export function createResource(name: Resource["name"]) {
  return $fetch<Resource>("/api/resources", {
    method: "POST",
    body: {
      resourceName: name,
    },
  });
}

export function replaceResource(resource: Resource) {
  return $fetch(`/api/resources/${resource.resourceId}`, {
    method: "PUT",
    body: resource,
  });
}

export function deleteById(id: Resource["resourceId"]) {
  return $fetch<Resource>(`/api/resources/${id}`, {
    method: "DELETE",
  });
}

export function patchBasicInfo({ resourceId: id, basicInfo }: Pick<Resource, "resourceId" | "basicInfo">) {
  return $fetch(`/api/resources/${id}/basic-info`, {
    method: "PATCH",
    body: basicInfo,
  });
}

export function patchProjectDetails({
  resourceId: id,
  projectDetails,
}: Pick<Resource, "resourceId" | "projectDetails">) {
  return $fetch(`/api/resources/${id}/project-details`, {
    method: "PATCH",
    body: projectDetails,
  });
}

export function provision(id: Resource["resourceId"]) {
  return $fetch(`/api/resources/${id}/provisioning`, {
    method: "PATCH",
  });
}
