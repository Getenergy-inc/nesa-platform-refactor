import { describe, it, expect, vi, beforeEach } from "vitest";

const invokeMock = vi.fn();
vi.mock("@/integrations/supabase/client", () => ({
  supabase: { functions: { invoke: (...a: unknown[]) => invokeMock(...a) } },
}));

import { ingestRawRows } from "../ingestRawRows";

describe("ingestRawRows", () => {
  beforeEach(() => invokeMock.mockReset());

  it("POSTs to admin/nominations/ingest with the request body", async () => {
    invokeMock.mockResolvedValue({
      data: { ok: true, data: [], meta: { total: 0, warnings: [] } },
      error: null,
    });

    await ingestRawRows({
      headers: ["Nominee Name"],
      rows: [["Jane"]],
      context: {
        formType: "award",
        family: "gold-blue-garnet",
        categorySlug: "best-csr-for-education-nigeria",
        categoryName: "Best CSR for Education - Nigeria",
      },
    });

    const [path, opts] = invokeMock.mock.calls[0];
    expect(path).toBe("admin/nominations/ingest");
    expect(opts.method).toBe("POST");
    expect(opts.body.context.formType).toBe("award");
  });

  it("returns cleaned rows + warnings from the response", async () => {
    invokeMock.mockResolvedValue({
      data: {
        ok: true,
        data: [{ record_id: "NESA2026-GBG-CSRNG-20260601-0001" }],
        meta: { total: 1, warnings: [{ rowNumber: 1, messages: ["x"] }] },
      },
      error: null,
    });

    const res = await ingestRawRows({
      headers: ["a"],
      rows: [["b"]],
      context: { formType: "rmsa", regionSlug: "west-africa", regionName: "West Africa" },
    });

    expect(res.total).toBe(1);
    expect(res.cleaned[0].record_id).toBe("NESA2026-GBG-CSRNG-20260601-0001");
    expect(res.warnings).toHaveLength(1);
  });

  it("throws when the function returns an error", async () => {
    invokeMock.mockResolvedValue({ data: null, error: new Error("nope") });
    await expect(
      ingestRawRows({
        headers: ["a"],
        rows: [],
        context: { formType: "rmsa", regionSlug: "west-africa", regionName: "West Africa" },
      }),
    ).rejects.toThrow("nope");
  });

  it("throws when payload is not ok", async () => {
    invokeMock.mockResolvedValue({ data: { ok: false, error: "Forbidden" }, error: null });
    await expect(
      ingestRawRows({
        headers: ["a"],
        rows: [],
        context: { formType: "rmsa", regionSlug: "west-africa", regionName: "West Africa" },
      }),
    ).rejects.toThrow("Forbidden");
  });
});
