import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { ROLE_HIERARCHY, type UserRole } from "../config/roles.js";
import { ApiError } from "../utils/http.js";

export type JwtPayload = { sub: string; email: string; role: UserRole; roles?: UserRole[] };

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request { user?: JwtPayload }
  }
}

export const requireAuth: RequestHandler = (req, _res, next) => {
  const header = req.header("authorization");
  if (!header?.startsWith("Bearer ")) return next(ApiError.unauthorized());
  try {
    const token = header.slice(7);
    req.user = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    next();
  } catch {
    next(ApiError.unauthorized("Invalid or expired token"));
  }
};

export const optionalAuth: RequestHandler = (req, _res, next) => {
  const header = req.header("authorization");
  if (header?.startsWith("Bearer ")) {
    try { req.user = jwt.verify(header.slice(7), env.JWT_SECRET) as JwtPayload; } catch { /* ignore */ }
  }
  next();
};

/** Require ANY of the listed roles, OR a hierarchy level >= the lowest one. */
export const requireRole = (...allowed: UserRole[]): RequestHandler => (req, _res, next) => {
  if (!req.user) return next(ApiError.unauthorized());
  const userRoles = req.user.roles ?? [req.user.role];
  if (userRoles.some((r) => allowed.includes(r))) return next();
  const minLevel = Math.min(...allowed.map((r) => ROLE_HIERARCHY[r]));
  if (userRoles.some((r) => ROLE_HIERARCHY[r] >= minLevel)) return next();
  next(ApiError.forbidden());
};
