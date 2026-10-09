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

  it("maps persisted + persist_errors meta into the response", async () => {
    invokeMock.mockResolvedValue({
      data: {
        ok: true,
        data: [{ record_id: "NESA2026-GBG-CSRNG-20260601-0001" }],
        meta: {
          total: 1,
          warnings: [],
          persisted: [
            {
              record_id: "NESA2026-GBG-CSRNG-20260601-0001",
              id: "11111111-1111-1111-1111-111111111111",
              duplicate_of: null,
              duplicate_status: "Unique",
            },
          ],
          persist_errors: [{ record_id: "X", message: "boom" }],
        },
      },
      error: null,
    });

    const res = await ingestRawRows({
      headers: ["a"],
      rows: [["b"]],
      context: {
        formType: "award",
        family: "gold-blue-garnet",
        categorySlug: "best-csr-for-education-nigeria",
        categoryName: "Best CSR for Education - Nigeria",
      },
    });

    expect(res.persisted).toHaveLength(1);
    expect(res.persisted[0].duplicate_status).toBe("Unique");
    expect(res.persisted[0].duplicate_of).toBeNull();
    expect(res.persistErrors).toEqual([{ record_id: "X", message: "boom" }]);
  });

  it("is idempotent: repeating the same call returns identical persisted state", async () => {
    const persisted = [
      {
        record_id: "NESA2026-GBG-CSRNG-20260601-0001",
        id: "11111111-1111-1111-1111-111111111111",
        duplicate_of: null,
        duplicate_status: "Unique",
      },
    ];
    const payload = {
      data: { ok: true, data: persisted, meta: { total: 1, warnings: [], persisted, persist_errors: [] } },
      error: null,
    };
    invokeMock.mockResolvedValue(payload);

    const req = {
      headers: ["a"],
      rows: [["b"]],
      context: {
        formType: "award" as const,
        family: "gold-blue-garnet" as const,
        categorySlug: "best-csr-for-education-nigeria",
        categoryName: "Best CSR for Education - Nigeria",
      },
    };

    const first = await ingestRawRows(req);
    const second = await ingestRawRows(req);
    const third = await ingestRawRows(req);

    expect(second.persisted).toEqual(first.persisted);
    expect(third.persisted).toEqual(first.persisted);
    expect(first.persistErrors).toEqual([]);
  });

  it("surfaces 'Potential Duplicate' rows pointing at a canonical record", async () => {
    invokeMock.mockResolvedValue({
      data: {
        ok: true,
        data: [
          { record_id: "NESA2026-GBG-CSRNG-20260601-0001" },
          { record_id: "NESA2026-GBG-CSRNG-20260601-0002" },
        ],
        meta: {
          total: 2,
          warnings: [],
          persisted: [
            {
              record_id: "NESA2026-GBG-CSRNG-20260601-0001",
              id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
              duplicate_of: null,
              duplicate_status: "Unique",
            },
            {
              record_id: "NESA2026-GBG-CSRNG-20260601-0002",
              id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
              duplicate_of: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
              duplicate_status: "Potential Duplicate",
            },
          ],
          persist_errors: [],
        },
      },
      error: null,
    });

    const res = await ingestRawRows({
      headers: ["a"],
      rows: [["b"], ["c"]],
      context: {
        formType: "award",
        family: "gold-blue-garnet",
        categorySlug: "best-csr-for-education-nigeria",
        categoryName: "Best CSR for Education - Nigeria",
      },
    });

    const dupes = res.persisted.filter((p) => p.duplicate_status === "Potential Duplicate");
    expect(dupes).toHaveLength(1);
    expect(dupes[0].duplicate_of).toBe("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa");
    expect(res.persisted.find((p) => p.duplicate_status === "Unique")?.duplicate_of).toBeNull();
  });

  it("returns empty persisted/persistErrors when meta omits them", async () => {
    invokeMock.mockResolvedValue({
      data: { ok: true, data: [], meta: { total: 0, warnings: [] } },
      error: null,
    });
    const res = await ingestRawRows({
      headers: ["a"],
      rows: [],
      context: { formType: "rmsa", regionSlug: "west-africa", regionName: "West Africa" },
    });
    expect(res.persisted).toEqual([]);
    expect(res.persistErrors).toEqual([]);
  });
});
