import { api } from "./http";

export interface UploadInitResponse {
  uploadUrl: string;
  token: string;
  filePath: string;
  publicUrl?: string;
}

export interface FileMetadata {
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
  last_accessed_at: string;
  metadata: Record<string, unknown>;
}

// Allowed file types for evidence uploads
export const ALLOWED_EVIDENCE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "video/mp4",
];

export const MAX_EVIDENCE_SIZE = 10 * 1024 * 1024; // 10MB

// Initialize an evidence upload (get signed URL)
export async function initEvidenceUpload(filename: string, mimeType: string, size: number) {
  return api.post<UploadInitResponse>("uploads", "/evidence/init", { filename, mimeType, size });
}

// Get evidence file metadata
export async function getEvidenceFile(filePath: string) {
  return api.get<{ files: FileMetadata[] }>("uploads", `/evidence/${encodeURIComponent(filePath)}`);
}

// Initialize an avatar upload
export async function initAvatarUpload(filename: string, mimeType: string, size: number) {
  return api.post<UploadInitResponse>("uploads", "/avatar/init", { filename, mimeType, size });
}

// Helper to upload a file using the signed URL
export async function uploadFile(signedUrl: string, file: File): Promise<void> {
  const response = await fetch(signedUrl, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type,
    },
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }
}

// Helper to validate file before upload
export function validateEvidenceFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_EVIDENCE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "Invalid file type. Allowed: JPEG, PNG, GIF, WebP, PDF, MP4",
    };
  }

  if (file.size > MAX_EVIDENCE_SIZE) {
    return {
      valid: false,
      error: "File too large. Maximum size is 10MB",
    };
  }

  return { valid: true };
}
