/**
 * Stub routers for the remaining 27 modules. Each one returns the canonical
 * `{success, message, data, meta?}` envelope with placeholder data so the
 * frontend client and integration tests can exercise the full surface area.
 *
 * Replace each handler with real Prisma logic as features are built.
 */
import { Router, type RequestHandler } from "express";
import { ok, created } from "../utils/http.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { iconNominationPayloadSchema } from "../schemas/iconNomination.js";

const stubList: RequestHandler = (_req, res) =>
  ok(res, [], "OK", { page: 1, limit: 20, total: 0, totalPages: 0 });

const stubItem: RequestHandler = (req, res) =>
  ok(res, { id: req.params.id ?? null, _stub: true });

const stubCreate: RequestHandler = (req, res) =>
  created(res, { id: `stub_${Date.now()}`, ...(req.body ?? {}), _stub: true });

const stubAck: RequestHandler = (_req, res) => ok(res, null, "Accepted (stub)");

function crud(path = "") {
  const r = Router();
  r.get(path || "/", stubList);
  r.post(path || "/", requireAuth, stubCreate);
  r.get(`${path}/:id`, stubItem);
  r.patch(`${path}/:id`, requireAuth, stubItem);
  r.delete(`${path}/:id`, requireAuth, stubAck);
  return r;
}

// 1. Public
export const publicRouter = (() => {
  const r = Router();
  r.get("/home", (_q, res) => ok(res, {
    hero: {
      title: "NESA Africa",
      subtitle: "Celebrating Education for All across Africa and the diaspora",
      ctaPrimary: "Start a Nomination",
      ctaSecondary: "Explore Categories",
    },
    stats: { categories: 17, regions: 10, nominees: 1000 },
    featuredCategories: [],
  }));
  r.get("/pages/:slug", (req, res) => ok(res, { slug: req.params.slug, body: "" }));
  r.post("/contact", stubAck);
  return r;
})();

// 3. Users
export const usersRouter = (() => {
  const r = crud();
  r.patch("/:id/role", requireAuth, requireRole("ADMIN", "SUPER_ADMIN"), stubItem);
  return r;
})();

// 4. Profiles
export const profilesRouter = (() => {
  const r = Router();
  r.get("/me", requireAuth, (req, res) => ok(res, { id: req.user!.sub, email: req.user!.email, role: req.user!.role }));
  r.patch("/me", requireAuth, (req, res) => ok(res, { ...req.body, id: req.user!.sub }));
  r.post("/me/avatar", requireAuth, (_q, res) => ok(res, { avatarUrl: "https://placehold.co/256" }));
  return r;
})();

// 5. Award seasons
export const awardSeasonsRouter = (() => {
  const r = crud();
  r.patch("/:id/publish", requireAuth, requireRole("ADMIN", "SUPER_ADMIN", "PROGRAM_MANAGER"), stubItem);
  return r;
})();

// 6. Categories
export const categoriesRouter = crud();

// 7. Nominations
export const nominationsRouter = (() => {
  const r = crud();
  r.patch("/:id/submit", requireAuth, stubItem);
  r.patch("/:id/approve", requireAuth, requireRole("ADMIN", "SUPER_ADMIN", "OPERATIONS_MANAGER"), stubItem);
  r.patch("/:id/reject", requireAuth, requireRole("ADMIN", "SUPER_ADMIN", "OPERATIONS_MANAGER"), stubItem);
  r.patch("/:id/request-info", requireAuth, stubItem);
  // Africa Education Icon pathway — locked to 3 categories + 3 nominee types.
  r.post("/icon", requireAuth, validateBody(iconNominationPayloadSchema), stubCreate);
  return r;
})();

// 8. Nominees
export const nomineesRouter = (() => {
  const r = Router();
  r.get("/public", stubList);
  r.get("/public/:slug", (req, res) => ok(res, { slug: req.params.slug, _stub: true }));
  r.get("/me", requireAuth, (req, res) => ok(res, { id: req.user!.sub }));
  r.patch("/me", requireAuth, (req, res) => ok(res, req.body));
  r.get("/", requireAuth, requireRole("ADMIN", "SUPER_ADMIN", "OPERATIONS_MANAGER", "PROGRAM_MANAGER"), stubList);
  return r;
})();

// 9. Evidence
export const evidenceRouter = (() => {
  const r = Router();
  r.post("/upload", requireAuth, (req, res) => created(res, { id: `ev_${Date.now()}`, ...req.body }));
  r.get("/nomination/:nominationId", stubList);
  r.delete("/:id", requireAuth, stubAck);
  r.patch("/:id/verify", requireAuth, requireRole("ADMIN", "SUPER_ADMIN", "OPERATIONS_MANAGER", "NRC_RESEARCHER"), stubItem);
  return r;
})();

// 10. Judging
export const judgingRouter = (() => {
  const r = Router();
  r.get("/assignments", requireAuth, requireRole("JUDGE", "HEAD_JUDGE"), stubList);
  r.get("/assignments/:id", requireAuth, requireRole("JUDGE", "HEAD_JUDGE"), stubItem);
  r.post("/assignments", requireAuth, requireRole("ADMIN", "SUPER_ADMIN", "HEAD_JUDGE"), stubCreate);
  r.post("/scores", requireAuth, requireRole("JUDGE", "HEAD_JUDGE"), stubCreate);
  r.patch("/scores/:id/draft", requireAuth, requireRole("JUDGE", "HEAD_JUDGE"), stubItem);
  r.post("/conflicts", requireAuth, requireRole("JUDGE", "HEAD_JUDGE"), stubCreate);
  r.get("/head-judge/overview", requireAuth, requireRole("HEAD_JUDGE", "ADMIN", "SUPER_ADMIN"), (_q, res) => ok(res, {}));
  return r;
})();

// 11. Voting
export const votingRouter = (() => {
  const r = Router();
  r.get("/categories", stubList);
  r.get("/categories/:categoryId/nominees", stubList);
  r.post("/votes", stubCreate);
  r.post("/verify", stubItem);
  r.get("/my-receipts", requireAuth, stubList);
  r.get("/results", requireAuth, requireRole("ADMIN", "SUPER_ADMIN"), stubList);
  return r;
})();

// 12. Vote integrity
export const voteIntegrityRouter = (() => {
  const r = Router();
  r.use(requireAuth, requireRole("ADMIN", "SUPER_ADMIN"));
  r.get("/overview", (_q, res) => ok(res, {}));
  r.get("/suspicious", stubList);
  r.patch("/votes/:id/quarantine", stubItem);
  r.patch("/votes/:id/restore", stubItem);
  r.patch("/votes/:id/invalidate", stubItem);
  return r;
})();

// 13. Regions / Chapters
export const regionsRouter = (() => { const r = Router(); r.get("/", stubList); return r; })();
export const countriesRouter = (() => { const r = Router(); r.get("/", stubList); return r; })();
export const chaptersRouter = (() => {
  const r = Router();
  r.get("/dashboard", requireAuth, requireRole("CHAPTER_LEAD", "ADMIN", "SUPER_ADMIN"), (_q, res) => ok(res, {}));
  r.get("/nominees", stubList);
  r.get("/reports", stubList);
  return r;
})();

// 14. NRC
export const nrcRouter = (() => {
  const r = Router();
  r.use(requireAuth, requireRole("NRC_RESEARCHER", "ADMIN", "SUPER_ADMIN"));
  r.get("/tasks", stubList);
  r.post("/tasks", stubCreate);
  r.patch("/tasks/:id", stubItem);
  r.post("/nominees", stubCreate);
  r.patch("/nominees/:id/duplicate", stubItem);
  return r;
})();

// 15. Partners
export const partnersRouter = (() => {
  const r = Router();
  r.get("/me", requireAuth, (req, res) => ok(res, { ownerId: req.user!.sub }));
  r.patch("/me", requireAuth, (req, res) => ok(res, req.body));
  r.get("/public", stubList);
  r.get("/", requireAuth, requireRole("ADMIN", "SUPER_ADMIN"), stubList);
  r.patch("/:id/approve", requireAuth, requireRole("ADMIN", "SUPER_ADMIN"), stubItem);
  r.post("/me/logo", requireAuth, (_q, res) => ok(res, { logoUrl: "https://placehold.co/256" }));
  return r;
})();

// 16. CSR  17. Global grants  18. Digital voices
export const csrRouter = crud("/applications");
export const globalGrantsRouter = crud();
export const digitalVoicesRouter = crud();

// 19. Media
export const mediaRouter = (() => {
  const r = Router();
  r.get("/", stubList);
  r.post("/upload", requireAuth, stubCreate);
  r.post("/articles", requireAuth, requireRole("MEDIA_EDITOR", "ADMIN", "SUPER_ADMIN"), stubCreate);
  r.patch("/articles/:id/publish", requireAuth, requireRole("MEDIA_EDITOR", "ADMIN", "SUPER_ADMIN"), stubItem);
  r.get("/public/articles", stubList);
  return r;
})();

// 20. Events / Tickets
export const eventsRouter = (() => {
  const r = Router();
  r.get("/", stubList);
  r.get("/:slug", stubItem);
  r.post("/", requireAuth, requireRole("ADMIN", "SUPER_ADMIN"), stubCreate);
  return r;
})();
export const ticketsRouter = (() => {
  const r = Router();
  r.post("/orders", stubCreate);
  r.get("/me", requireAuth, stubList);
  r.post("/verify", stubItem);
  r.post("/check-in", requireAuth, stubItem);
  return r;
})();

// 21. Payments
export const paymentsRouter = (() => {
  const r = Router();
  r.post("/initialize", (req, res) => created(res, {
    reference: `pay_${Date.now()}`, authorizationUrl: "https://payments.example/redirect", provider: "stub",
    ...req.body,
  }));
  r.post("/verify", (req, res) => ok(res, { status: "success", reference: req.body?.reference }));
  r.post("/webhook", stubAck);
  r.get("/", requireAuth, requireRole("ADMIN", "SUPER_ADMIN", "FINANCE_MANAGER"), stubList);
  return r;
})();

// 22. Wallet / Ledger
export const walletRouter = (() => {
  const r = Router();
  r.get("/me", requireAuth, (req, res) => ok(res, { ownerId: req.user!.sub, balance: 0 }));
  return r;
})();
export const ledgerRouter = (() => {
  const r = Router();
  r.use(requireAuth, requireRole("ADMIN", "SUPER_ADMIN", "FINANCE_MANAGER"));
  r.get("/transactions", stubList);
  r.post("/adjustments", stubCreate);
  r.patch("/adjustments/:id/approve", stubItem);
  return r;
})();

// 23. Certificates
export const certificatesRouter = (() => {
  const r = Router();
  r.get("/me", requireAuth, stubList);
  r.post("/generate", requireAuth, requireRole("ADMIN", "SUPER_ADMIN", "PROGRAM_MANAGER"), stubCreate);
  r.get("/:id/download", (_q, res) => ok(res, { url: "https://placehold.co/cert.pdf" }));
  r.get("/verify/:code", (req, res) => ok(res, { code: req.params.code, status: "valid" }));
  return r;
})();

// 24. Grievances
export const grievancesRouter = (() => {
  const r = Router();
  r.post("/", requireAuth, stubCreate);
  r.get("/me", requireAuth, stubList);
  r.get("/", requireAuth, requireRole("ADMIN", "SUPER_ADMIN"), stubList);
  r.patch("/:id/assign", requireAuth, requireRole("ADMIN", "SUPER_ADMIN"), stubItem);
  r.patch("/:id/resolve", requireAuth, requireRole("ADMIN", "SUPER_ADMIN"), stubItem);
  return r;
})();

// 25. Notifications
export const notificationsRouter = (() => {
  const r = Router();
  r.get("/me", requireAuth, stubList);
  r.patch("/:id/read", requireAuth, stubItem);
  r.patch("/read-all", requireAuth, stubAck);
  r.post("/send", requireAuth, requireRole("ADMIN", "SUPER_ADMIN"), stubCreate);
  return r;
})();

// 26. Analytics
export const analyticsRouter = (() => {
  const r = Router();
  r.use(requireAuth, requireRole("ADMIN", "SUPER_ADMIN", "PROGRAM_MANAGER", "FINANCE_MANAGER"));
  r.get("/overview", (_q, res) => ok(res, {}));
  r.get("/nominations", (_q, res) => ok(res, {}));
  r.get("/voting", (_q, res) => ok(res, {}));
  r.get("/finance", (_q, res) => ok(res, {}));
  r.get("/export", (req, res) => ok(res, { url: `https://placehold.co/report.${(req.query.format as string) || "csv"}` }));
  return r;
})();

// 27. Settings
export const settingsRouter = (() => {
  const r = Router();
  r.use(requireAuth, requireRole("ADMIN", "SUPER_ADMIN"));
  r.get("/", (_q, res) => ok(res, {}));
  r.patch("/", requireRole("SUPER_ADMIN"), (req, res) => ok(res, req.body));
  r.get("/voting", (_q, res) => ok(res, {}));
  r.patch("/voting", (req, res) => ok(res, req.body));
  r.get("/judging-rubrics", (_q, res) => ok(res, {}));
  r.patch("/judging-rubrics", (req, res) => ok(res, req.body));
  return r;
})();

// 28. Audit logs
export const auditLogsRouter = (() => {
  const r = Router();
  r.use(requireAuth, requireRole("ADMIN", "SUPER_ADMIN"));
  r.get("/", stubList);
  r.get("/:id", stubItem);
  return r;
})();
