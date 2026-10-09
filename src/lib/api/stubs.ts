/**
 * Stub service files for the remaining 18 contract modules.
 * Each function compiles, types correctly, and hits the documented route —
 * but no backend implementation exists yet on the Lovable Cloud (Supabase)
 * side and the standalone Express server hasn't been deployed.
 *
 * They are exposed so frontend components can be coded against the final
 * shape today. Calls will return ApiError until the backend is live.
 */
import { http, uploadRequest } from "./client";
import type { ListQuery } from "@/types/api/common";

const list = <T>(path: string) => (q: ListQuery & Record<string, unknown> = {}) => http.get<T[]>(path, q as any);
const get = <T>(path: string) => (id: string) => http.get<T>(`${path}/${id}`);
const create = <T>(path: string) => (body: unknown) => http.post<T>(path, body);
const patch = <T>(path: string) => (id: string, body: unknown) => http.patch<T>(`${path}/${id}`, body);
const remove = (path: string) => (id: string) => http.del<null>(`${path}/${id}`);

// 13. Regional chapters
export const chaptersApi = {
  regions: () => http.get<unknown[]>("/regions"),
  countries: (region?: string) => http.get<unknown[]>("/countries", { region }),
  dashboard: () => http.get<unknown>("/chapters/dashboard"),
  nominees: (q?: { region?: string; country?: string }) => http.get<unknown[]>("/chapters/nominees", q),
  reports: (q?: { region?: string; country?: string }) => http.get<unknown[]>("/chapters/reports", q),
};

// 14. NRC research corps
export const nrcApi = {
  tasks: list<unknown>("/nrc/tasks"),
  createTask: create<unknown>("/nrc/tasks"),
  updateTask: patch<unknown>("/nrc/tasks"),
  submitNominee: create<unknown>("/nrc/nominees"),
  markDuplicate: (id: string) => http.patch<unknown>(`/nrc/nominees/${id}/duplicate`),
};

// 15. Partners & sponsors
export const partnersApi = {
  me: () => http.get<unknown>("/partners/me"),
  updateMe: (body: unknown) => http.patch<unknown>("/partners/me", body),
  listPublic: () => http.get<unknown[]>("/partners/public"),
  adminList: list<unknown>("/partners"),
  approve: (id: string) => http.patch<unknown>(`/partners/${id}/approve`),
  uploadLogo: (file: File) => {
    const fd = new FormData(); fd.append("logo", file);
    return uploadRequest<{ logoUrl: string }>("/partners/me/logo", fd);
  },
};

// 16. CSR recognition
export const csrApi = {
  create: create<unknown>("/csr/applications"),
  list: list<unknown>("/csr/applications"),
  get: get<unknown>("/csr/applications"),
  update: patch<unknown>("/csr/applications"),
};

// 17. Global grants
export const globalGrantsApi = {
  create: create<unknown>("/global-grants"),
  list: list<unknown>("/global-grants"),
  get: get<unknown>("/global-grants"),
  update: patch<unknown>("/global-grants"),
};

// 18. Digital voices
export const digitalVoicesApi = {
  create: create<unknown>("/digital-voices"),
  list: list<unknown>("/digital-voices"),
  get: get<unknown>("/digital-voices"),
  update: patch<unknown>("/digital-voices"),
};

// 19. Media
export const mediaApi = {
  list: list<unknown>("/media"),
  upload: (file: File, fields: Record<string, string> = {}) => {
    const fd = new FormData(); fd.append("file", file);
    Object.entries(fields).forEach(([k, v]) => fd.append(k, v));
    return uploadRequest<unknown>("/media/upload", fd);
  },
  createArticle: create<unknown>("/media/articles"),
  publishArticle: (id: string) => http.patch<unknown>(`/media/articles/${id}/publish`),
  publicArticles: () => http.get<unknown[]>("/media/public/articles"),
};

// 20. Events & tickets
export const eventsApi = {
  list: () => http.get<unknown[]>("/events"),
  getBySlug: (slug: string) => http.get<unknown>(`/events/${slug}`),
  create: create<unknown>("/events"),
};
export const ticketsApi = {
  createOrder: create<unknown>("/tickets/orders"),
  mine: () => http.get<unknown[]>("/tickets/me"),
  verifyQr: (code: string) => http.post<unknown>("/tickets/verify", { code }),
  checkIn: (code: string) => http.post<unknown>("/tickets/check-in", { code }),
};

// 22. Wallet & ledger
export const walletApi = {
  me: () => http.get<unknown>("/wallet/me"),
  ledger: list<unknown>("/ledger/transactions"),
  adjust: create<unknown>("/ledger/adjustments"),
  approveAdjust: (id: string) => http.patch<unknown>(`/ledger/adjustments/${id}/approve`),
};

// 23. Certificates
export const certificatesApi = {
  mine: () => http.get<unknown[]>("/certificates/me"),
  generate: create<unknown>("/certificates/generate"),
  download: (id: string) => http.get<{ url: string }>(`/certificates/${id}/download`),
  verify: (code: string) => http.get<unknown>(`/certificates/verify/${code}`),
};

// 24. Grievances
export const grievancesApi = {
  submit: create<unknown>("/grievances"),
  mine: () => http.get<unknown[]>("/grievances/me"),
  adminList: list<unknown>("/grievances"),
  assign: (id: string, assigneeId: string) => http.patch<unknown>(`/grievances/${id}/assign`, { assigneeId }),
  resolve: (id: string, body: unknown) => http.patch<unknown>(`/grievances/${id}/resolve`, body),
};

// 25. Notifications
export const notificationsApi = {
  mine: () => http.get<unknown[]>("/notifications/me"),
  read: (id: string) => http.patch<unknown>(`/notifications/${id}/read`),
  readAll: () => http.patch<unknown>("/notifications/read-all"),
  send: create<unknown>("/notifications/send"),
};

// 26. Analytics
export const analyticsApi = {
  overview: () => http.get<unknown>("/analytics/overview"),
  nominations: (q?: Record<string, string>) => http.get<unknown>("/analytics/nominations", q),
  voting: (q?: Record<string, string>) => http.get<unknown>("/analytics/voting", q),
  finance: (q?: Record<string, string>) => http.get<unknown>("/analytics/finance", q),
  exportReport: (q: { type: string; format: "csv" | "json" | "pdf" }) =>
    http.get<{ url: string }>("/analytics/export", q),
};

// 27. Settings
export const settingsApi = {
  get: () => http.get<unknown>("/settings"),
  update: (body: unknown) => http.patch<unknown>("/settings", body),
  voting: {
    get: () => http.get<unknown>("/settings/voting"),
    update: (body: unknown) => http.patch<unknown>("/settings/voting", body),
  },
  judgingRubrics: {
    get: () => http.get<unknown>("/settings/judging-rubrics"),
    update: (body: unknown) => http.patch<unknown>("/settings/judging-rubrics", body),
  },
};

// 28. Audit logs
export const auditLogsApi = {
  list: list<unknown>("/audit-logs"),
  get: get<unknown>("/audit-logs"),
};

// 12. Vote integrity
export const voteIntegrityApi = {
  overview: () => http.get<unknown>("/vote-integrity/overview"),
  suspicious: list<unknown>("/vote-integrity/suspicious"),
  quarantine: (id: string) => http.patch<unknown>(`/vote-integrity/votes/${id}/quarantine`),
  restore: (id: string) => http.patch<unknown>(`/vote-integrity/votes/${id}/restore`),
  invalidate: (id: string) => http.patch<unknown>(`/vote-integrity/votes/${id}/invalidate`),
};

// 5. Award seasons
export const awardSeasonsApi = {
  list: () => http.get<unknown[]>("/award-seasons"),
  create: create<unknown>("/award-seasons"),
  update: patch<unknown>("/award-seasons"),
  publish: (id: string) => http.patch<unknown>(`/award-seasons/${id}/publish`),
};

// 1. Public website
export const publicApi = {
  home: () => http.get<unknown>("/public/home"),
  page: (slug: string) => http.get<unknown>(`/public/pages/${slug}`),
  contact: (body: { name: string; email: string; subject: string; message: string }) =>
    http.post<null>("/public/contact", body),
};
