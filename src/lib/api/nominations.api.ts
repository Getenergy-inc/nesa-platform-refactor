import { http, uploadRequest } from "./client";
import type { ListQuery } from "@/types/api/common";
import type { CreateNominationPayload, Nomination, NominationStatus, EvidenceFile } from "@/types/api/domain";

export type NominationListQuery = ListQuery & {
  status?: NominationStatus;
  categoryId?: string;
  region?: string;
  country?: string;
};

export const nominationsApi = {
  create: (body: CreateNominationPayload) => http.post<Nomination>("/nominations", body),
  list: (q: NominationListQuery = {}) => http.get<Nomination[]>("/nominations", q),
  get: (id: string) => http.get<Nomination>(`/nominations/${id}`),
  updateDraft: (id: string, body: Partial<CreateNominationPayload>) =>
    http.patch<Nomination>(`/nominations/${id}`, body),
  submit: (id: string) => http.patch<Nomination>(`/nominations/${id}/submit`),
  approve: (id: string) => http.patch<Nomination>(`/nominations/${id}/approve`),
  reject: (id: string, reason: string) =>
    http.patch<Nomination>(`/nominations/${id}/reject`, { reason }),
  requestInfo: (id: string, message: string) =>
    http.patch<Nomination>(`/nominations/${id}/request-info`, { message }),

  uploadEvidence: (nominationId: string, file: File, fileType: string, caption?: string) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("nominationId", nominationId);
    fd.append("fileType", fileType);
    if (caption) fd.append("caption", caption);
    return uploadRequest<EvidenceFile>("/evidence/upload", fd);
  },
  listEvidence: (nominationId: string) =>
    http.get<EvidenceFile[]>(`/evidence/nomination/${nominationId}`),
  deleteEvidence: (id: string) => http.del<null>(`/evidence/${id}`),
};
