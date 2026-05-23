import { z } from "zod";

export const UserPreferenceSchema = z.object({
            user_id: z.uuid().optional(),
            budget_max: z.number(),
            sleep_time: z.number(),
            smoking: z.boolean(),
            district: z.string(),
            noise_tolerance: z.number(),
            budget_min: z.number(),
            cleanliness_level: z.number(),
            pet_friendly: z.boolean(),
            area: z.number()
})

export type UserPreference = z.infer<typeof UserPreferenceSchema>