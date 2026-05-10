import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many login attempts", error: { code: "RATE_LIMITED" } },
});

export const voteLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { success: false, message: "Too many votes from this IP", error: { code: "RATE_LIMITED" } },
});

export const uploadLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
});

export const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
});
