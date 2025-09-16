import z from "zod";

export const cameraSchema = z.object({
  id: z.string(),
  description: z.string(),
  url: z.string(),
  position: z.string(),
  creator: z.object({
    firstName: z.string(),
    email: z.string().email(),
  }),
  status: z.string(),
  name: z.string(),
  externalId: z.string(),
});
