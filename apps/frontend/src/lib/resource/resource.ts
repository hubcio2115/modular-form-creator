import { z } from "zod/mini";

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
    priority: z.enum(["low"])
  }),

  projectDetails: z.object({
    projectName: z.string(),
    budget: z.string(),
    category: z.string(),
    options: z.array(z.string())
  }),

  createdAt: z.iso.date(),
  updatedAt: z.iso.date(),
})

export type Resource = z.infer<typeof resourceSchema>
