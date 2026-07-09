import { z } from "zod/mini";
import { $fetch } from "../$fetch";

export const resourceSchema = z.object({
  _id: z.string(),
  resourceId: z.string(),
  name: z.string(),
  status: z.enum(["draft", "completed"]),

  basicInfo: z.object({
    resourceName: z.string(),
    owner: z.string(),
    email: z.string(),
    description: z.string(),
    priority: z.enum(["low"]),
  }),

  projectDetails: z.object({
    projectName: z.string(),
    budget: z.string(),
    category: z.string(),
    options: z.array(z.string()),
  }),

  createdAt: z.iso.date(),
  updatedAt: z.iso.date(),
});

export type Resource = z.infer<typeof resourceSchema>;

export function getById(id: Resource["resourceId"]) {
  return $fetch<Resource>(`/api/resources/${id}`);
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

export function patchProjectDetails({ resourceId: id, basicInfo }: Pick<Resource, "resourceId" | "basicInfo">) {
  return $fetch(`/api/resources/${id}/project-details`, {
    method: "PATCH",
    body: basicInfo,
  });
}

export function provision(id: Resource["resourceId"]) {
  return $fetch(`/api/resources/${id}/provisioning`, {
    method: "PATCH",
  });
}
