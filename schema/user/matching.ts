import { z } from "zod";

export const UserPreferenceSchema = z.object({
    user_id: z.uuid(),
    cleanliness_level: z.number().int(),
    budget_min: z.number(),
    budget_max: z.number(),
    noise_tolerance: z.number().int(),
    sleep_time: z.number().int(),
    pet_friendly: z.boolean().optional(),
    smoking: z.boolean().optional(),
    area: z.number(),
    district: z.string(),
});

export type UserPreference = z.infer<typeof UserPreferenceSchema>;
