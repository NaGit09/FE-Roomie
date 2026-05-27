import { z } from "zod";

export const CreatePaymentSchema = z.object({
  payment_method: z.string(),
  metadata: z.object().optional(),
});

export type CreatePayment = z.infer<typeof CreatePaymentSchema>;
