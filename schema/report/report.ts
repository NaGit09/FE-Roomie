import { z } from 'zod';

// ==========================================
// 1. Enums (Shared Database Types)
// ==========================================
export const TargetTypeSchema = z.enum(["ROOM", "POST", "USER", "COMMENT"]);
export type TargetType = z.infer<typeof TargetTypeSchema>;

export const ReportStatusSchema = z.enum(["PENDING", "IN_REVIEW", "RESOLVED", "REJECTED"]);
export type ReportStatus = z.infer<typeof ReportStatusSchema>;

export const ReportPrioritySchema = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]);
export type ReportPriority = z.infer<typeof ReportPrioritySchema>;

// ==========================================
// 2. Generic Wrappers
// ==========================================
/**
 * Generic API response envelope standard in report-service.
 */
export function createApiResponseSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.object({
    code: z.number().int(),
    message: z.string(),
    data: dataSchema.nullable().optional(),
  });
}

/**
 * Generic paginated response structure.
 */
export function createPaginatedDataSchema<T extends z.ZodTypeAny>(itemSchema: T) {
  return z.object({
    items: z.array(itemSchema),
    total: z.number().int().nonnegative(),
    page: z.number().int().positive(),
    size: z.number().int().positive(),
    total_pages: z.number().int().nonnegative(),
  });
}

// ==========================================
// 3. Core Models
// ==========================================
export const ReportBaseSchema = z.object({
  target_type: TargetTypeSchema,
  target_id: z.string(),
  reason: z.string(),
  report_type: z.string().nullable().optional(),
  attachments: z.array(z.string()).nullable().optional(),
});
export type ReportBase = z.infer<typeof ReportBaseSchema>;

export const ReportCreateSchema = ReportBaseSchema.extend({
  reporter_name: z.string().nullable().optional(),
  reporter_avatar: z.string().nullable().optional(),
});
export type ReportCreate = z.infer<typeof ReportCreateSchema>;

export const ReportUpdateStatusSchema = z.object({
  status: ReportStatusSchema,
  admin_notes: z.string().nullable().optional(),
});
export type ReportUpdateStatus = z.infer<typeof ReportUpdateStatusSchema>;

export const AdminActionBaseSchema = z.object({
  priority: ReportPrioritySchema,
  deadline: z.string().datetime().nullable().optional(),
  admin_name: z.string().nullable().optional(),
  admin_avatar: z.string().nullable().optional(),
});

export const ReportAssignSchema = AdminActionBaseSchema.extend({
  assignee_id: z.string(),
});
export type ReportAssign = z.infer<typeof ReportAssignSchema>;

export const ReportAcceptSchema = AdminActionBaseSchema.extend({
  priority: ReportPrioritySchema.default("MEDIUM"),
});
export type ReportAccept = z.infer<typeof ReportAcceptSchema>;

export const ReportCommonResponseSchema = ReportBaseSchema.extend({
  id: z.number().int(),
  report_code: z.string().nullable().optional(),
  reporter_id: z.string(),
  reporter_name: z.string().nullable().optional(),
  reporter_avatar: z.string().nullable().optional(),
  priority: ReportPrioritySchema,
  status: ReportStatusSchema,
  admin_id: z.string().nullable().optional(),
  admin_name: z.string().nullable().optional(),
  admin_avatar: z.string().nullable().optional(),
  created_at: z.string().datetime(),
});

export const ReportListResponseSchema = ReportCommonResponseSchema.omit({
  attachments: true,
});
export type ReportListResponse = z.infer<typeof ReportListResponseSchema>;

export const ReportResponseSchema = ReportCommonResponseSchema.extend({
  deadline: z.string().datetime().nullable().optional(),
  admin_notes: z.string().nullable().optional(),
  updated_at: z.string().datetime(),
});
export type ReportResponse = z.infer<typeof ReportResponseSchema>;

// ==========================================
// 4. Request Query Parameters
// ==========================================
export const GetMyReportsQuerySchema = z.object({
  page: z.preprocess((val) => Number(val), z.number().int().min(1)).default(1),
  size: z.preprocess((val) => Number(val), z.number().int().min(1).max(100)).default(10),
});
export type GetMyReportsQuery = z.infer<typeof GetMyReportsQuerySchema>;

export const GetAllReportsQuerySchema = z.object({
  page: z.preprocess((val) => Number(val), z.number().int().min(1)).default(1),
  size: z.preprocess((val) => Number(val), z.number().int().min(1).max(100)).default(10),
  status: z.union([ReportStatusSchema, z.string()]).optional(),
  assignee_id: z.string().optional(),
});
export type GetAllReportsQuery = z.infer<typeof GetAllReportsQuerySchema>;

export const GetMyAssignedReportsQuerySchema = z.object({
  page: z.preprocess((val) => Number(val), z.number().int().min(1)).default(1),
  size: z.preprocess((val) => Number(val), z.number().int().min(1).max(100)).default(10),
  status: z.union([ReportStatusSchema, z.string()]).optional(),
});
export type GetMyAssignedReportsQuery = z.infer<typeof GetMyAssignedReportsQuerySchema>;

// ==========================================
// 5. Complete API Endpoints Map (Requests & Responses)
// ==========================================
export const API_ENDPOINTS = {
  // --- PUBLIC & GENERAL ---
  healthCheck: {
    method: "GET",
    path: "/health",
    response: z.object({ status: z.string() }),
  },
  // --- USER ENDPOINTS ---
  createReport: {
    method: "POST",
    path: "/reports",
    body: ReportCreateSchema,
    response: createApiResponseSchema(z.boolean()),
  },
  getMyReports: {
    method: "GET",
    path: "/reports/me",
    query: GetMyReportsQuerySchema,
    response: createApiResponseSchema(createPaginatedDataSchema(ReportListResponseSchema)),
  },
  getReport: {
    method: "GET",
    path: (reportId: number) => `/reports/${reportId}`,
    response: createApiResponseSchema(ReportResponseSchema),
  },
  deleteReport: {
    method: "DELETE",
    path: (reportId: number) => `/reports/${reportId}`,
    response: createApiResponseSchema(z.boolean()),
  },
  // --- ADMIN ENDPOINTS ---
  getAllReports: {
    method: "GET",
    path: "/admin/reports",
    query: GetAllReportsQuerySchema,
    response: createApiResponseSchema(createPaginatedDataSchema(ReportListResponseSchema)),
  },
  getMyAssignedReports: {
    method: "GET",
    path: "/admin/reports/assigned/me",
    query: GetMyAssignedReportsQuerySchema,
    response: createApiResponseSchema(createPaginatedDataSchema(ReportListResponseSchema)),
  },
  updateReportStatus: {
    method: "PUT",
    path: (reportId: number) => `/admin/reports/${reportId}/status`,
    body: ReportUpdateStatusSchema,
    response: createApiResponseSchema(ReportResponseSchema),
  },
  acceptReportRequest: {
    method: "POST",
    path: (reportId: number) => `/admin/reports/${reportId}/accept`,
    body: ReportAcceptSchema,
    response: createApiResponseSchema(ReportResponseSchema),
  },
  assignReport: {
    method: "POST",
    path: (reportId: number) => `/admin/reports/${reportId}/assign`,
    body: ReportAssignSchema,
    response: createApiResponseSchema(ReportResponseSchema),
  },
} as const;