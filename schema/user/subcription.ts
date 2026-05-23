import { z } from "zod";

export const SubscriptionSchema = z.object({
    id: z.number(),
    sub_description: z.string(),
    sub_exception: z.string(),
    sub_type: z.string(),
    sub_title: z.string(),
    sub_time: z.string(),
    sub_price: z.number()
});

export type Subscription = z.infer<typeof SubscriptionSchema>;