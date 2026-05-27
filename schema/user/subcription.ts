import { z } from "zod";

export const SubscriptionSchema = z.object({
    id: z.number().optional(),
    sub_description: z.string(),
    sub_exception: z.string(),
    sub_type: z.string(),
    sub_title: z.string(),
    sub_time: z.string(),
    sub_price: z.number()
});

export type Subscription = z.infer<typeof SubscriptionSchema>;

export const SubscriptionDetailSchema = z.object({
    id: z.number().optional(),
    is_active: z.boolean(),
    time_end: z.string(),
    deleted_at: z.string().nullable(),
    updated_at: z.string(),
    created_at: z.string(),
    sub_id: z.number(),
    user_id: z.string()
});

export type SubscriptionDetail = z.infer<typeof SubscriptionDetailSchema>;

export const UpgradeSubscriptionSchema = z.object({
    can_upgrade: z.boolean(),
    current_subscription: SubscriptionDetailSchema.extend({
        subscription: SubscriptionSchema
    }),
    higher_packages: SubscriptionSchema.array()

});
export type UpgradeSubscription = z.infer<typeof UpgradeSubscriptionSchema>;