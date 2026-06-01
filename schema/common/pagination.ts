import { z } from "zod";

export const PaginationSchema = z.object({
    items: z.array(z.any()),
    total: z.number().int(),
    page: z.number().int(),
    size: z.number().int(),
    total_pages: z.number().int().optional(),
});

export type Pagination<T> = z.infer<typeof PaginationSchema> & {
    items: T[];
}

export const PaginationQuerySchema = z.object({
    skip: z.number().int().optional(),
    limit: z.number().int().optional(),
});

export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;
