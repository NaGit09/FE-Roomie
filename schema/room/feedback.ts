import z from "zod";
import { ratingTypeSchema } from "./rating";

export const feedbackSchema = z.object({
    feedback: z.string(),
    rating: z.array(ratingTypeSchema),
    created_at: z.string(),
    images: z.array(z.string()).optional(),
    user_id: z.string(),
    post_id: z.number(),
    feedback_id: z.number(),
    content : z.string()
    
});

export type Feedback = z.infer<typeof feedbackSchema>;