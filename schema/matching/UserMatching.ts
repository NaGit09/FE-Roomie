import { z } from "zod";
import { UserPreferenceSchema } from "./UserPreference";

export const UserMatchingSchema = z.object({
  user: z.object({
    user_id: z.string().uuid(),
    email: z.string().email(),
    full_name: z.string(),
    status: z.enum(["ACTIVE", "INACTIVE"]),
    role: z.enum(["RENTER", "LANDLORD"]),
  }),
  preference: UserPreferenceSchema.optional(),
  score: z.number(),
});

export type UserMatching = z.infer<typeof UserMatchingSchema>;