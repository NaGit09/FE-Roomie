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

export const GetPostsQuerySchema = z.object({
    skip: z.number().optional().default(0),
    limit: z.number().optional().default(10),
    province_code: z.number().optional(),
    district_code: z.number().optional(),
    ward_code: z.number().optional(),
    price_from: z.number().optional(),
    price_to: z.number().optional(),
    sort_by: z.string().optional().default("created_at"),
    order: z.string().optional().default("desc"),
})

export type GetPostsQueryType = z.infer<typeof GetPostsQuerySchema>;

export const RoomPaginationSchema = z.object({
    items: z.array(PostCardSchema),
    total: z.number(),
    page: z.number(),
    size: z.number(),
    total_pages: z.number(),
});

export type RoomPaginationType = z.infer<typeof RoomPaginationSchema>;