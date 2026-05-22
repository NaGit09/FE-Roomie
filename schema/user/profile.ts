import { z } from "zod";

export const UserProfileSchema = z.object({
    email: z.email(),
    full_name: z.string(),
    id: z.uuid(),
    profile_id: z.uuid(),
    role: z.enum(["RENTER", "LANDLORD", "ADMIN"]),
    free_usage_count: z.number().int(),
    status: z.enum(["ACTIVE", "INACTIVE"]),
    created_at: z.string(),
    updated_at: z.string()
});

export type UserProfile = z.infer<typeof UserProfileSchema>;