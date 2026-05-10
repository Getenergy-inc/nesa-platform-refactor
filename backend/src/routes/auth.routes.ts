import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { env } from "../config/env.js";
import type { UserRole } from "../config/roles.js";
import { ROLES } from "../config/roles.js";
import { loginLimiter } from "../middleware/rateLimit.js";
import { requireAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { ApiError, created, ok } from "../utils/http.js";

/**
 * Demo auth router — in-memory user store so the contract is exercisable
 * end-to-end without a database. Replace with Prisma queries against the
 * `User` model in production.
 */
const router = Router();

type DemoUser = { id: string; email: string; firstName: string; lastName: string; passwordHash: string; role: UserRole };
const users = new Map<string, DemoUser>();

const RegisterSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email().max(255),
  password: z.string().min(8).max(128),
  role: z.enum(ROLES).optional(),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

function signTokens(u: DemoUser) {
  const payload = { sub: u.id, email: u.email, role: u.role, roles: [u.role] };
  const accessToken = jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.ACCESS_TOKEN_EXPIRES_IN as any });
  const refreshToken = jwt.sign({ sub: u.id }, env.JWT_REFRESH_SECRET, { expiresIn: env.REFRESH_TOKEN_EXPIRES_IN as any });
  return { accessToken, refreshToken };
}

function publicUser(u: DemoUser) {
  const { passwordHash: _ph, ...rest } = u;
  return rest;
}

router.post("/register", validateBody(RegisterSchema), async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;
    if ([...users.values()].some((u) => u.email === email)) throw ApiError.conflict("Email already registered");
    const u: DemoUser = {
      id: `usr_${Date.now()}`,
      email,
      firstName,
      lastName,
      passwordHash: await bcrypt.hash(password, 10),
      role: role ?? "NOMINATOR",
    };
    users.set(u.id, u);
    return created(res, { user: publicUser(u), ...signTokens(u) }, "Registered");
  } catch (e) { next(e); }
});

router.post("/login", loginLimiter, validateBody(LoginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const u = [...users.values()].find((x) => x.email === email);
    if (!u || !(await bcrypt.compare(password, u.passwordHash))) throw ApiError.unauthorized("Invalid credentials");
    return ok(res, { user: publicUser(u), ...signTokens(u) }, "Logged in");
  } catch (e) { next(e); }
});

router.post("/refresh", (req, res, next) => {
  try {
    const { refreshToken } = req.body ?? {};
    if (!refreshToken) throw ApiError.badRequest("refreshToken required");
    const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as { sub: string };
    const u = users.get(decoded.sub);
    if (!u) throw ApiError.unauthorized();
    return ok(res, signTokens(u), "Refreshed");
  } catch (e) { next(e); }
});

router.post("/logout", requireAuth, (_req, res) => ok(res, null, "Logged out"));

router.get("/me", requireAuth, (req, res, next) => {
  const u = users.get(req.user!.sub);
  if (!u) return next(ApiError.notFound("User not found"));
  return ok(res, publicUser(u));
});

router.post("/forgot-password", (_req, res) => ok(res, null, "If the email exists, a reset link has been sent"));
router.post("/reset-password", (_req, res) => ok(res, null, "Password reset"));
router.post("/verify-email", (_req, res) => ok(res, null, "Email verified"));

export default router;
