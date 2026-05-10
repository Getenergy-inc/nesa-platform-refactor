const REQUIRED_PUBLIC_ENV_VARS = [
  "VITE_SUPABASE_URL",
  "VITE_SUPABASE_PUBLISHABLE_KEY",
] as const;

export type RequiredPublicEnvVar = (typeof REQUIRED_PUBLIC_ENV_VARS)[number];

export function getMissingPublicEnvVars(): RequiredPublicEnvVar[] {
  const env = import.meta.env as Record<string, string | undefined>;

  return REQUIRED_PUBLIC_ENV_VARS.filter((key) => {
    const value = env[key];
    return typeof value !== "string" || value.trim().length === 0;
  });
}
