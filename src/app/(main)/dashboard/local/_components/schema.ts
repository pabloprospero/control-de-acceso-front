import { z } from "zod";

export const locationSchema = z.object({
  externalId: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  address: z.string(),
  createdBy: z.string(),
});

export const locationsResponseSchema = z.array(locationSchema);
