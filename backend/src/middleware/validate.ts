import type { RequestHandler } from "express";
import type { ZodSchema } from "zod";

/** Validate `req.body` against a Zod schema and replace it with parsed value. */
export const validateBody = <T>(schema: ZodSchema<T>): RequestHandler =>
  (req, _res, next) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return next(parsed.error);
    req.body = parsed.data as any;
    next();
  };

export const validateQuery = <T>(schema: ZodSchema<T>): RequestHandler =>
  (req, _res, next) => {
    const parsed = schema.safeParse(req.query);
    if (!parsed.success) return next(parsed.error);
    req.query = parsed.data as any;
    next();
  };
