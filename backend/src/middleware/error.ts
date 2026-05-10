import type { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";
import { ApiError } from "../utils/http.js";

export const notFoundHandler: RequestHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    error: { code: "NOT_FOUND" },
  });
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    return res.status(422).json({
      success: false,
      message: "Validation failed",
      error: {
        code: "VALIDATION_ERROR",
        details: err.errors.map((e) => ({ field: e.path.join("."), message: e.message })),
      },
    });
  }
  if (err instanceof ApiError) {
    return res.status(err.status).json({
      success: false,
      message: err.message,
      error: { code: err.code, details: err.details },
    });
  }
  // eslint-disable-next-line no-console
  console.error("[unhandled]", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: { code: "INTERNAL" },
  });
};
