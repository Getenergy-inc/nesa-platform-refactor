import { API_BASE } from "@/contexts/AuthContext";
import { apiRequest } from "./client";
import { ApiResponse } from "./http";

export type fileType = "VIDEO" | "DOCUMENT" | "IMAGE";

export interface UploadUrl {
  signedUrl: string;
  path: string;
}

export const uploadApi = {
  getPresignedUrl: async (
    accessToken: string,
    fileName: string,
    mimeType: string,
    fileSize: string,
    fileType: fileType,
  ) => {
    const res: ApiResponse<UploadUrl> = await apiRequest(
      `${API_BASE}/storage/upload/signedurl`,
      {
        credentials: "include",
        accessToken,
        method: "POST",
        body: JSON.stringify({
          fileName,
          mimeType,
          fileSize,
          fileType,
        }),
      },
    );
    return res.data;
  },
  getPublicUrl: async (accessToken: string, filePath: string) => {
    const res: ApiResponse<string> = await apiRequest(
      `${API_BASE}/storage/publicurl?file_path=${filePath}`,
      {
        credentials: "include",
        accessToken,
        method: "GET",
      },
    );
    return res.data;
  },

  uploadFile: async (file: File, signedUrl: string) => {
    try {
      await fetch(signedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });
    } catch (err) {
      console.log(err);
      throw new Error("error uploading file to supabase");
    }
  },

  deleteFile: async (accessToken: string, filePaths: string[]) => {
    await apiRequest(`${API_BASE}/storage/file`, {
      method: "DELETE",
      credentials: "include",
      accessToken,
      body: JSON.stringify({
        files: filePaths,
      }),
    });
  },
};
