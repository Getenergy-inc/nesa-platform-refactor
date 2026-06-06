import { describe, it, expect, vi, beforeEach } from "vitest";
import { queryFormAutoPromoted } from "../queryFormAutoPromoted";

const mockSelect = vi.fn();
const mockEq = vi.fn();
const mockIlike = vi.fn();
const mockOrder = vi.fn();
const mockRange = vi.fn();

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: () => ({
      select: mockSelect.mockReturnThis(),
      eq: mockEq.mockReturnThis(),
      ilike: mockIlike.mockReturnThis(),
      order: mockOrder.mockReturnThis(),
      range: mockRange,
    }),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("queryFormAutoPromoted", () => {
  it("applies default pagination (page 1, size 25)", async () => {
    mockRange.mockResolvedValue({ data: [], error: null, count: 0 });

    await queryFormAutoPromoted();

    expect(mockSelect).toHaveBeenCalledWith(
      "id, created_at, actor_id, metadata",
      { count: "exact" },
    );
    expect(mockEq).toHaveBeenCalledWith("action", "form_auto_promoted");
    expect(mockOrder).toHaveBeenCalledWith("created_at", { ascending: false });
    expect(mockRange).toHaveBeenCalledWith(0, 24);
  });

  it("filters by form kind when provided", async () => {
    mockRange.mockResolvedValue({ data: [], error: null, count: 0 });

    await queryFormAutoPromoted({ formKind: "rmsa-region" });

    expect(mockEq).toHaveBeenCalledWith("metadata->>form_kind", "rmsa-region");
  });

  it("does not filter by kind when kind is 'all'", async () => {
    mockRange.mockResolvedValue({ data: [], error: null, count: 0 });

    await queryFormAutoPromoted({ formKind: "all" });

    const kindCalls = mockEq.mock.calls.filter(
      (c) => c[0] === "metadata->>form_kind",
    );
    expect(kindCalls).toHaveLength(0);
  });

  it("applies slug ilike filter when slug is provided", async () => {
    mockRange.mockResolvedValue({ data: [], error: null, count: 0 });

    await queryFormAutoPromoted({ slug: "west-africa" });

    expect(mockIlike).toHaveBeenCalledWith(
      "metadata->>form_slug",
      "%west-africa%",
    );
  });

  it("trims slug before filtering", async () => {
    mockRange.mockResolvedValue({ data: [], error: null, count: 0 });

    await queryFormAutoPromoted({ slug: "  east  " });

    expect(mockIlike).toHaveBeenCalledWith("metadata->>form_slug", "%east%");
  });

  it("does not apply slug filter when slug is empty", async () => {
    mockRange.mockResolvedValue({ data: [], error: null, count: 0 });

    await queryFormAutoPromoted({ slug: "" });

    expect(mockIlike).not.toHaveBeenCalled();
  });

  it("computes correct range for page 3 with size 10", async () => {
    mockRange.mockResolvedValue({ data: [], error: null, count: 0 });

    await queryFormAutoPromoted({ page: 3, pageSize: 10 });

    expect(mockRange).toHaveBeenCalledWith(20, 29);
  });

  it("returns mapped events with metadata fields", async () => {
    mockRange.mockResolvedValue({
      data: [
        {
          id: "evt-1",
          created_at: "2026-06-06T12:00:00Z",
          actor_id: "actor-uuid",
          metadata: {
            form_kind: "rmsa-region",
            form_slug: "west-africa",
            raw_status: "Link Pending",
            resolved_status: "Active",
          },
        },
      ],
      error: null,
      count: 1,
    });

    const result = await queryFormAutoPromoted();

    expect(result.events).toHaveLength(1);
    expect(result.events[0]).toMatchObject({
      id: "evt-1",
      actor_id: "actor-uuid",
      form_kind: "rmsa-region",
      form_slug: "west-africa",
      raw_status: "Link Pending",
      resolved_status: "Active",
    });
    expect(result.total).toBe(1);
  });

  it("falls back to em-dash for missing metadata fields", async () => {
    mockRange.mockResolvedValue({
      data: [
        {
          id: "evt-2",
          created_at: "2026-06-06T12:00:00Z",
          actor_id: null,
          metadata: {},
        },
      ],
      error: null,
      count: 1,
    });

    const result = await queryFormAutoPromoted();

    expect(result.events[0]).toMatchObject({
      form_kind: "—",
      form_slug: "—",
      raw_status: "—",
      resolved_status: "—",
    });
  });

  it("caps pageSize at 100 and floors at 1", async () => {
    mockRange.mockResolvedValue({ data: [], error: null, count: 0 });

    await queryFormAutoPromoted({ pageSize: 500 });
    expect(mockRange).toHaveBeenCalledWith(0, 99);

    vi.clearAllMocks();
    mockRange.mockResolvedValue({ data: [], error: null, count: 0 });

    await queryFormAutoPromoted({ pageSize: 0 });
    expect(mockRange).toHaveBeenCalledWith(0, 0);
  });

  it("throws on Supabase error", async () => {
    mockRange.mockResolvedValue({
      data: null,
      error: { message: "DB timeout" },
      count: null,
    });

    await expect(queryFormAutoPromoted()).rejects.toEqual({
      message: "DB timeout",
    });
  });
});
