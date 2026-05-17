import z from "zod";

export const changePasswordSchema = z
  .object({
    old_password: z.string(),
    new_password: z.string(),

  })
export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
