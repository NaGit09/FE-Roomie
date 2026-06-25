import z from "zod";
import { roomDetailSchema } from "./room";

export const RentalStatusSchema = z.enum(["INTERESTED", "ACTIVE", "COMPLETED", "CANCELLED"]);
export type RentalStatus = z.infer<typeof RentalStatusSchema>;

export const RentalSchema = z.object({
  rental_id: z.number(),
  room_id: z.number(),
  user_id: z.string(),
  start_date: z.string().nullable().optional(),
  end_date: z.string().nullable().optional(),
  deposit: z.number().nullable().optional(),
  monthly_rent: z.number().nullable().optional(),
  status: RentalStatusSchema,
  created_at: z.string(),
  room: roomDetailSchema.nullable().optional(),
});

export type Rental = z.infer<typeof RentalSchema>;

export const RentalInterestCreateSchema = z.object({
  room_id: z.number(),
});

export type RentalInterestCreate = z.infer<typeof RentalInterestCreateSchema>;

export const RentalConfirmSchema = z.object({
  renter_id: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  deposit: z.number().optional(),
  monthly_rent: z.number().optional(),
});

export type RentalConfirm = z.infer<typeof RentalConfirmSchema>;
