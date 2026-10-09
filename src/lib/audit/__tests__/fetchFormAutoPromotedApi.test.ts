import { describe, it, expect, vi, beforeEach } from "vitest";

const invokeMock = vi.fn();

vi.mock("@/integrations/supabase/client", () => ({
  supabase: { functions: { invoke: (...args: unknown[]) => invokeMock(...args) } },
}));

import { fetchFormAutoPromotedApi } from "../fetchFormAutoPromotedApi";

describe("fetchFormAutoPromotedApi", () => {
  beforeEach(() => invokeMock.mockReset());

  it("calls the admin/audit-logs path with default action=form_auto_promoted", async () => {
    invokeMock.mockResolvedValue({
      data: { ok: true, data: [], meta: { page: 1, limit: 25, total: 0, total_pages: 1 } },
      error: null,
    });

    await fetchFormAutoPromotedApi();

    const [path, opts] = invokeMock.mock.calls[0];
    expect(path).toMatch(/^admin\/audit-logs\?/);
    expect(path).toContain("action=form_auto_promoted");
    expect(path).toContain("page=1");
    expect(path).toContain("limit=25");
    expect(opts).toEqual({ method: "GET" });
  });

  it("forwards form_kind and trimmed form_slug filters", async () => {
    invokeMock.mockResolvedValue({
      data: { ok: true, data: [], meta: {} },
      error: null,
    });

    await fetchFormAutoPromotedApi({
      formKind: "rmsa-region",
      formSlug: "  west-africa  ",
      page: 2,
      limit: 50,
    });

    const [path] = invokeMock.mock.calls[0];
    expect(path).toContain("form_kind=rmsa-region");
    expect(path).toContain("form_slug=west-africa");
    expect(path).toContain("page=2");
    expect(path).toContain("limit=50");
  });

  it("omits form_kind when 'all' and omits empty slug", async () => {
    invokeMock.mockResolvedValue({ data: { ok: true, data: [], meta: {} }, error: null });

    await fetchFormAutoPromotedApi({ formKind: "all", formSlug: "   " });

    const [path] = invokeMock.mock.calls[0];
    expect(path).not.toContain("form_kind=");
    expect(path).not.toContain("form_slug=");
  });

  it("clamps page and limit to safe bounds", async () => {
    invokeMock.mockResolvedValue({ data: { ok: true, data: [], meta: {} }, error: null });

    await fetchFormAutoPromotedApi({ page: -3, limit: 5000 });

    const [path] = invokeMock.mock.calls[0];
    expect(path).toContain("page=1");
    expect(path).toContain("limit=100");
  });

  it("returns mapped rows and meta from the response", async () => {
    invokeMock.mockResolvedValue({
      data: {
        ok: true,
        data: [
          {
            id: "1",
            action: "form_auto_promoted",
            actor_id: "actor-1",
            entity_type: "google_form",
            entity_id: null,
            form_kind: "rmsa-region",
            form_slug: "west-africa",
            raw_status: "link-pending",
            resolved_status: "active",
            created_at: "2026-06-06T12:00:00Z",
          },
        ],
        meta: { page: 1, limit: 25, total: 1, total_pages: 1 },
      },
      error: null,
    });

    const result = await fetchFormAutoPromotedApi();

    expect(result.total).toBe(1);
    expect(result.rows[0].actor_id).toBe("actor-1");
    expect(result.rows[0].form_slug).toBe("west-africa");
    expect(result.rows[0].raw_status).toBe("link-pending");
    expect(result.rows[0].resolved_status).toBe("active");
  });

  it("throws when supabase returns an error", async () => {
    invokeMock.mockResolvedValue({ data: null, error: new Error("boom") });
    await expect(fetchFormAutoPromotedApi()).rejects.toThrow("boom");
  });

  it("throws when response payload is not ok", async () => {
    invokeMock.mockResolvedValue({
      data: { ok: false, error: "Forbidden" },
      error: null,
    });
    await expect(fetchFormAutoPromotedApi()).rejects.toThrow("Forbidden");
  });
});
