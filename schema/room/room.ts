import { z } from "zod";
import { addressSchema, addressCardSchema } from "./address";

export const roomCardSchema = z.object({
    price: z.number(),
    area: z.number(),
    amenities: z.array(z.string()),
    address: addressCardSchema,
});

export type RoomCard = z.infer<typeof roomCardSchema>

export const roomDetailSchema = z.object({
    id: z.number().optional(),
    owner_id: z.string().optional(),
    name: z.string(),
    description: z.string(),
    price: z.number(),
    area: z.number(),
    deposit: z.number(),
    status: z.string(),
    amenities: z.array(z.string()),
    attributes: z.array(z.string()),
    images: z.array(z.string()),
    address: addressSchema,
});

export type RoomDetail = z.infer<typeof roomDetailSchema>