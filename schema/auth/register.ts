import z from "zod";

export const registerReqSchema = z.object({
 full_name: z.string(),
  email: z.email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/\d/, "Must contain at least one number"),
});

export type RegisterReqSchema = z.infer<typeof registerReqSchema>;

export const registerLandlordReqSchema = z.object({
  full_name: z.string(),
  email: z.email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/\d/, "Must contain at least one number"),
  phone_number: z.string().optional(),
});

export type RegisterLandlordReqSchema = z.infer<typeof registerLandlordReqSchema>;