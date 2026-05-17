import { z } from "zod";

export const loginReqSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export type LoginReqSchema = z.infer<typeof loginReqSchema>;

export const loginResSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  token_type: z.string(),
  expires_in: z.number(),
});

export type LoginResSchema = z.infer<typeof loginResSchema>;
