import { ApiResponse } from "@/schema/common/api.type";
import { Pagination } from "@/schema/common/pagination";
import axiosInstance from "../axiosInstance";
import {
  ReportCreate,
  GetMyReportsQuery,
  GetAllReportsQuery,
  GetMyAssignedReportsQuery,
  ReportUpdateStatus,
  ReportAccept,
  ReportAssign,
  ReportResponse,
  ReportListResponse,
} from "@/schema/report/report";

export const ReportApi = {
  // --- USER ENDPOINTS ---
  createReport: async (body: ReportCreate) => {
    const res = await axiosInstance.post<ApiResponse<boolean>>("/reports", body);
    return res.data;
  },

  getMyReports: async (query?: GetMyReportsQuery) => {
    const res = await axiosInstance.get<ApiResponse<Pagination<ReportListResponse>>>("/reports/me", {
      params: query,
    });
    return res.data;
  },

  getReport: async (reportId: number) => {
    const res = await axiosInstance.get<ApiResponse<ReportResponse>>(`/reports/${reportId}`);
    return res.data;
  },

  deleteReport: async (reportId: number) => {
    const res = await axiosInstance.delete<ApiResponse<boolean>>(`/reports/${reportId}`);
    return res.data;
  },

  // --- ADMIN ENDPOINTS ---
  getAllReports: async (query?: GetAllReportsQuery) => {
    const res = await axiosInstance.get<ApiResponse<Pagination<ReportListResponse>>>("/admin/reports", {
      params: query,
    });
    return res.data;
  },

  getMyAssignedReports: async (query?: GetMyAssignedReportsQuery) => {
    const res = await axiosInstance.get<ApiResponse<Pagination<ReportListResponse>>>(
      "/admin/reports/assigned/me",
      {
        params: query,
      }
    );
    return res.data;
  },

  updateReportStatus: async (reportId: number, body: ReportUpdateStatus) => {
    const res = await axiosInstance.put<ApiResponse<ReportResponse>>(
      `/admin/reports/${reportId}/status`,
      body
    );
    return res.data;
  },

  acceptReportRequest: async (reportId: number, body: ReportAccept) => {
    const res = await axiosInstance.post<ApiResponse<ReportResponse>>(
      `/admin/reports/${reportId}/accept`,
      body
    );
    return res.data;
  },

  assignReport: async (reportId: number, body: ReportAssign) => {
    const res = await axiosInstance.post<ApiResponse<ReportResponse>>(
      `/admin/reports/${reportId}/assign`,
      body
    );
    return res.data;
  },
};
