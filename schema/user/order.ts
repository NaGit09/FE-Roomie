import { z } from "zod";

export const CreateOrderReqSchema = z.object({
  item_type: z.string(),
  item_id: z.uuid(),
  total_amount: z.number(),
});
export type CreateOrderReq = z.infer<typeof CreateOrderReqSchema>;

export const OrderSchema = z.object({
  id: z.uuid(),
  order_code: z.string(),
  user_id: z.uuid(),
  item_type: z.string(),
  item_id: z.uuid(),
  total_amount: z.number(),
  status: z.string(),
  paid_at: z.date().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});


export type Order = z.infer<typeof OrderSchema>;
