import { z } from "zod";

export const CreatePaymentSchema = z.object({
  payment_method: z.string(),
  metadata: z.object().optional(),
});

export type CreatePayment = z.infer<typeof CreatePaymentSchema>;

export const PaymentResSchema = z.object({
    order_id : z.uuid(),
    status : z.string(),
    paid_at : z.date(),
    checkout_url : z.string(),
    qr_code : z.string(),
    message : z.string()
  });

export type  PaymentRes = z.infer < typeof PaymentResSchema>;
