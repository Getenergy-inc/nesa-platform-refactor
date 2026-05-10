import "dotenv/config";

const required = (name: string, fallback?: string): string => {
  const v = process.env[name] ?? fallback;
  if (v === undefined) throw new Error(`Missing env var: ${name}`);
  return v;
};

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: Number(process.env.PORT ?? 4000),
  CORS_ORIGIN: (process.env.CORS_ORIGIN ?? "*").split(",").map((s) => s.trim()),
  DATABASE_URL: required("DATABASE_URL", "postgresql://localhost/nesa"),
  JWT_SECRET: required("JWT_SECRET", "dev_secret_change_me"),
  JWT_REFRESH_SECRET: required("JWT_REFRESH_SECRET", "dev_refresh_change_me"),
  ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN ?? "15m",
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN ?? "7d",
  UPLOAD_MAX_SIZE_MB: Number(process.env.UPLOAD_MAX_SIZE_MB ?? 20),
};
