import { ApiResponse } from "@/schema/common/api.type";
import axiosInstance from "../axiosInstance";
import { Media } from "@/schema/common/upload";
import { UploadReq } from "@/schema/common/upload";
import { Pagination, PaginationQuery } from "@/schema/common/pagination";
const BASE_URL = "/upload/media";

export const UploadApi = {

  uploadFile: async (req: UploadReq) => {

    const formData = new FormData();

    formData.append("file", req.file);
    formData.append("reference_id", req.reference_id);
    formData.append("context", req.context);

    if (req.is_primary !== undefined) {
      formData.append("is_primary", String(req.is_primary));
    }

    const response = await axiosInstance.post<ApiResponse<Media>>(
      `${BASE_URL}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },

  my_media: async (query: PaginationQuery) => {
    const response = await axiosInstance.get<ApiResponse<Pagination<Media>>>(
      `${BASE_URL}/my`,
      {
        params: {
          skip: query.skip,
          limit: query.limit
        }
      }
    );
    return response.data;
  },

  asset_reference: async (user_id : string , context : string) => {
    const response = await axiosInstance.get<ApiResponse<Pagination<Media>>>(
      `${BASE_URL}/reference/${user_id}`,
      {
        params: {
          context: context
        }
      }
    );
    return response.data;
  }
};
