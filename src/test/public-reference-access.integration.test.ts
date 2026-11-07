import { describe, expect, it } from "vitest";
import { createClient } from "@supabase/supabase-js";

const client = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
});

describe("approved public reference access", () => {
  it("keeps approved role labels public and hides unapproved roles", async () => {
    const approved = await client.from("roles").select("code,is_public").eq("code", "USER");
    expect(approved.error).toBeNull();
    expect(approved.data).toEqual([{ code: "USER", is_public: true }]);
    const privateRows = await client.from("roles").select("code").eq("is_public", false);
    expect(privateRows.error).toBeNull();
    expect(privateRows.data).toEqual([]);
  });
  it("keeps approved badges public and hides an existing unapproved probe", async () => {
    const approved = await client.from("volunteer_badges").select("code,is_public").eq("code", "bronze");
    expect(approved.error).toBeNull();
    expect(approved.data).toEqual([{ code: "bronze", is_public: true }]);
    const probe = await client.from("volunteer_badges").select("code").eq("code", "security_private_probe_20261107");
    expect(probe.error).toBeNull();
    expect(probe.data).toEqual([]);
  });
  it("does not let visitors approve private badges", async () => {
    const result = await client.from("volunteer_badges").update({ is_public: true }).eq("code", "security_private_probe_20261107");
    expect(result.error?.code).toBe("42501");
  });
  it("does not let visitors approve role definitions", async () => {
    const result = await client.from("roles").update({ is_public: true }).eq("code", "USER");
    expect(result.error?.code).toBe("42501");
  });
});