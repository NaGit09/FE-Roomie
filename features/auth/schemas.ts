import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional(),
});

export const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/\d/, "Must contain at least one number"),
  terms: z.literal(true, {
    error: "You must accept the terms and privacy policy",
  }),
});

export const forgotPasswordSchema = z.object({
  email: z.email("Invalid email address"),
});

export const verifyOtpSchema = z.object({
  otp: z.string().length(6, "Code must be exactly 6 digits").regex(/^\d+$/, "Code must be digits only"),
});

export const changePasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/\d/, "Must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Inferred types
export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
export type VerifyOtpSchema = z.infer<typeof verifyOtpSchema>;
export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
