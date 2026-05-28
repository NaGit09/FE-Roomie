import z from "zod";

export const addressSchema = z.object({
    street: z.string(),
    ward: z.string(),
    district: z.string(),
    city: z.string(),
    country : z.string(),
    latitude: z.number(),
    longitude: z.number(),
    full_text: z.string(),
});

export type AddressType = z.infer<typeof addressSchema>;

export const addressCardSchema = z.object({
    district: z.string(),
    city: z.string(),
})

export type AddressCardType = z.infer<typeof addressCardSchema>