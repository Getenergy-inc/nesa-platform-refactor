/**
 * NESA Africa unified API client (spec v1) — barrel export.
 * Import everything from "@/lib/api".
 *
 * This sits ALONGSIDE the legacy `src/api/*` Supabase client. Migrate pages
 * gradually; both can coexist.
 */
export * from "./client";
export * from "./roles";

export { authApi } from "./auth.api";
export { usersApi } from "./users.api";
export { profilesApi } from "./profiles.api";
export { categoriesApi } from "./categories.api";
export { nominationsApi } from "./nominations.api";
export { nomineesApi } from "./nominees.api";
export { judgingApi } from "./judging.api";
export { votingApi } from "./voting.api";
export { paymentsApi } from "./payments.api";

// Stubbed / not yet wired modules
export {
  publicApi, awardSeasonsApi, chaptersApi, nrcApi, partnersApi,
  csrApi, globalGrantsApi, digitalVoicesApi, mediaApi,
  eventsApi, ticketsApi, walletApi, certificatesApi, grievancesApi,
  notificationsApi, analyticsApi, settingsApi, auditLogsApi, voteIntegrityApi,
} from "./stubs";

export type * from "@/types/api/common";
export type * from "@/types/api/auth";
export type * from "@/types/api/domain";
