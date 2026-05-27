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
    updated_at: z.string(),
    landlord_profile: z.object({
        phonenumber: z.string().nullable(),
        facebook: z.string().nullable(),
        gmail: z.email(),
        id: z.uuid(),
        user_id: z.uuid(),
        created_at: z.string(),
        updated_at: z.string(),
    }).optional(),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;