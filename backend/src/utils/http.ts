/** Standard envelope helpers per the NESA API contract. */
import type { Response } from "express";

export type ApiMeta = { page?: number; limit?: number; total?: number; totalPages?: number };

export function ok<T>(res: Response, data: T, message = "OK", meta?: ApiMeta) {
  return res.json({ success: true, message, data, ...(meta ? { meta } : {}) });
}

export function created<T>(res: Response, data: T, message = "Created") {
  return res.status(201).json({ success: true, message, data });
}

export function noContent(res: Response, message = "OK") {
  return res.json({ success: true, message, data: null });
}

export class ApiError extends Error {
  status: number;
  code: string;
  details?: Array<{ field?: string; message: string }>;
  constructor(status: number, message: string, code = "ERROR", details?: ApiError["details"]) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
  static badRequest(msg: string, details?: ApiError["details"]) { return new ApiError(400, msg, "BAD_REQUEST", details); }
  static unauthorized(msg = "Unauthorized") { return new ApiError(401, msg, "UNAUTHORIZED"); }
  static forbidden(msg = "Forbidden") { return new ApiError(403, msg, "FORBIDDEN"); }
  static notFound(msg = "Not found") { return new ApiError(404, msg, "NOT_FOUND"); }
  static conflict(msg: string) { return new ApiError(409, msg, "CONFLICT"); }
  static validation(details: NonNullable<ApiError["details"]>) { return new ApiError(422, "Validation failed", "VALIDATION_ERROR", details); }
  static tooMany(msg = "Too many requests") { return new ApiError(429, msg, "RATE_LIMITED"); }
}
