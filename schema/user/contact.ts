import { z } from "zod";
// ── Schema ──────────────────────────────────────────────────────
export const contactSchema = z.object({
  firstName:   z.string().min(1, "Vui lòng nhập tên của bạn"),
  lastName:    z.string().min(1, "Vui lòng nhập họ của bạn"),
  email:       z.email("Địa chỉ email không hợp lệ").min(1, "Vui lòng nhập email"),
  phone:       z.string().min(7, "Vui lòng nhập số điện thoại hợp lệ"),
  problem:     z.string().min(10, "Vui lòng mô tả yêu cầu của bạn (tối thiểu 10 ký tự)"),
});
export type ContactSchema = z.infer<typeof contactSchema>;