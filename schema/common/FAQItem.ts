
import { z } from "zod";

export const FAQItemSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

export type FAQItem = z.infer<typeof FAQItemSchema>;