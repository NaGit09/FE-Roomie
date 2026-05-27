import { z } from "zod";

export const LocationItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string(),
  roomCount: z.number(),
});

export type LocationItem = z.infer<typeof LocationItemSchema>;