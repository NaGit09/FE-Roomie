import z from "zod";

export const ratingTypeSchema = z.object({
  rating_type: z.string(),
  rating_value: z.number(),
  id: z.number(),
});

export type RatingType = z.infer<typeof ratingTypeSchema>;
