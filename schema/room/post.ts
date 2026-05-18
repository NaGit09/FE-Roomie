import { addressCardSchema } from "./address";
import z from "zod";
import { roomCardSchema, roomDetailSchema } from "./room";
import { feedbackSchema } from "./feedback";

export const PostCardSchema = z.object({
    post_id: z.number(),
    title: z.string(),
    is_verified: z.boolean(),
    created_at: z.string(),
    image_url: z.string().nullable(),
    room : roomCardSchema
});

export type PostCardType = z.infer<typeof PostCardSchema>;

export const PostDetailSchema = z.object({
    post_id: z.number(),
    title: z.string(),
    content: z.string(),
    image_url: z.string().nullable(),
    created_by: z.string(),
    is_verified: z.boolean(),
    views: z.number(),
    created_at: z.string(),
    room: roomDetailSchema,
    feedbacks: z.array(feedbackSchema)
});

export type PostDetailType = z.infer<typeof PostDetailSchema>;