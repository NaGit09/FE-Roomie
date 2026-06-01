import { z } from "zod";

export const UploadReqSchema = z.object({
  file: z.instanceof(File),
  reference_id: z.uuid(),
  context: z.enum(["ROOM", "AVATAR", "POST", "ADVERTISEMENT"]),
  is_primary: z.boolean().optional().default(false),
});

export type UploadReq = z.infer<typeof UploadReqSchema>;

export const mediaSchema = z.object({
  reference_id: z.uuid(),
  context: z.enum(["ROOM", "AVATAR", "POST", "ADVERTISEMENT"]),
  id: z.uuid(),
  user_id: z.uuid(),
  public_id: z.string(),
  file_url: z.url(),
  is_primary: z.boolean(),
  is_active: z.boolean(),
  created_at: z.date(),
});

export type Media = z.infer<typeof mediaSchema>;
