import z from "zod";

export const SavePostSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  post_id: z.number(),
  created_at: z.string(),
});

export type SavePost = z.infer<typeof SavePostSchema>;
