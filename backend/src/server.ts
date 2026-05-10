import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";
import swaggerUi from "swagger-ui-express";

import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/error.js";
import { generalLimiter } from "./middleware/rateLimit.js";
import { ok } from "./utils/http.js";

import authRouter from "./routes/auth.routes.js";
import {
  publicRouter, usersRouter, profilesRouter, awardSeasonsRouter, categoriesRouter,
  nominationsRouter, nomineesRouter, evidenceRouter, judgingRouter, votingRouter,
  voteIntegrityRouter, regionsRouter, countriesRouter, chaptersRouter, nrcRouter,
  partnersRouter, csrRouter, globalGrantsRouter, digitalVoicesRouter, mediaRouter,
  eventsRouter, ticketsRouter, paymentsRouter, walletRouter, ledgerRouter,
  certificatesRouter, grievancesRouter, notificationsRouter, analyticsRouter,
  settingsRouter, auditLogsRouter,
} from "./routes/stubs.routes.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN.length === 1 && env.CORS_ORIGIN[0] === "*" ? true : env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "5mb" }));
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(generalLimiter);

app.get("/health", (_q, res) => ok(res, { status: "ok", uptime: process.uptime() }));

const v1 = express.Router();
v1.use("/auth", authRouter);
v1.use("/public", publicRouter);
v1.use("/users", usersRouter);
v1.use("/profiles", profilesRouter);
v1.use("/award-seasons", awardSeasonsRouter);
v1.use("/categories", categoriesRouter);
v1.use("/nominations", nominationsRouter);
v1.use("/nominees", nomineesRouter);
v1.use("/evidence", evidenceRouter);
v1.use("/judging", judgingRouter);
v1.use("/voting", votingRouter);
v1.use("/vote-integrity", voteIntegrityRouter);
v1.use("/regions", regionsRouter);
v1.use("/countries", countriesRouter);
v1.use("/chapters", chaptersRouter);
v1.use("/nrc", nrcRouter);
v1.use("/partners", partnersRouter);
v1.use("/csr", csrRouter);
v1.use("/global-grants", globalGrantsRouter);
v1.use("/digital-voices", digitalVoicesRouter);
v1.use("/media", mediaRouter);
v1.use("/events", eventsRouter);
v1.use("/tickets", ticketsRouter);
v1.use("/payments", paymentsRouter);
v1.use("/wallet", walletRouter);
v1.use("/ledger", ledgerRouter);
v1.use("/certificates", certificatesRouter);
v1.use("/grievances", grievancesRouter);
v1.use("/notifications", notificationsRouter);
v1.use("/analytics", analyticsRouter);
v1.use("/settings", settingsRouter);
v1.use("/audit-logs", auditLogsRouter);

app.use("/api/v1", v1);

// Swagger UI from the shared OpenAPI spec
try {
  const specPath = path.resolve(process.cwd(), "../docs/openapi.yaml");
  if (fs.existsSync(specPath)) {
    const doc = YAML.parse(fs.readFileSync(specPath, "utf8"));
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(doc));
  }
} catch { /* ignore — docs optional */ }

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`NESA Africa API listening on http://localhost:${env.PORT}/api/v1`);
});
