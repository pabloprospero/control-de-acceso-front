import { z } from "zod";

export const eventSchema = z.object({
  id: z.number(),
  externalId: z.string(),
  documentType: z.string(),
  documentNumber: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  type: z.enum(["entry", "exit"]), // si solo hay esos 2 valores
  photoPath: z.string().nullable().optional(),
  cameraExternalId: z.string(),
  locationExternalId: z.string(),
  createdAt: z.string().datetime(), // valida formato ISO
});

export const eventsResponseSchema = z.object({
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
  events: z.array(eventSchema),
});
