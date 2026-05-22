import z from "zod";

export const changePasswordSchema = z.object({
  old_password: z.string().min(1, "Mật khẩu hiện tại không được để trống"),
  new_password: z
    .string()
    .min(8, "Mật khẩu mới phải có ít nhất 8 ký tự")
    .regex(/[A-Z]/, "Mật khẩu mới phải chứa ít nhất một chữ cái viết hoa")
    .regex(/\d/, "Mật khẩu mới phải chứa ít nhất một chữ số"),
});

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
