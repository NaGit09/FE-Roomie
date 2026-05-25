import {z} from "zod";

export const UserMatchingSchema = z.object({
        user: z.object({
            user_id: z.uuid(),
            email: z.string().email(),
            full_name: z.string(),
            status: z.enum(["ACTIVE", "INACTIVE"]),
            role: z.enum(["RENTER", "LANDLORD"])
        }),
        score: z.number()
})

export type UserMatching = z.infer<typeof UserMatchingSchema>