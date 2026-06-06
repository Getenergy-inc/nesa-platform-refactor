import { describe, it, expect, vi, beforeEach } from "vitest";

const insertMock = vi.fn();

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: () => ({ insert: (row: unknown) => insertMock(row) }),
  },
}));

import { logFormAutoPromotion } from "../logFormAutoPromotion";

describe("logFormAutoPromotion", () => {
  beforeEach(() => {
    insertMock.mockReset();
    insertMock.mockResolvedValue({ error: null });
    window.sessionStorage.clear();
  });

  const base = {
    formKind: "rmsa-region" as const,
    formSlug: "west-africa",
    actorId: "admin-1",
    rawStatus: "Link Pending",
    resolvedStatus: "Active",
  };

  it("inserts an audit_events row when a form was auto-promoted", async () => {
    const res = await logFormAutoPromotion(base);
    expect(res.logged).toBe(true);
    expect(insertMock).toHaveBeenCalledTimes(1);
    const row = insertMock.mock.calls[0][0];
    expect(row.action).toBe("form_auto_promoted");
    expect(row.entity_type).toBe("google_form");
    expect(row.actor_id).toBe("admin-1");
    expect(row.actor_role).toBe("admin");
    expect(row.metadata.form_slug).toBe("west-africa");
    expect(row.metadata.form_kind).toBe("rmsa-region");
    expect(row.metadata.raw_status).toBe("Link Pending");
    expect(row.metadata.resolved_status).toBe("Active");
  });

  it("does not insert when raw/resolved statuses are not a promotion", async () => {
    const res = await logFormAutoPromotion({ ...base, rawStatus: "Active" });
    expect(res.logged).toBe(false);
    expect(insertMock).not.toHaveBeenCalled();
  });

  it("dedupes repeat calls in the same session", async () => {
    await logFormAutoPromotion(base);
    const res = await logFormAutoPromotion(base);
    expect(res.logged).toBe(false);
    expect(insertMock).toHaveBeenCalledTimes(1);
  });

  it("logs separately per form slug", async () => {
    await logFormAutoPromotion(base);
    await logFormAutoPromotion({ ...base, formSlug: "east-africa" });
    expect(insertMock).toHaveBeenCalledTimes(2);
  });

  it("does not mark as logged when the insert errors", async () => {
    insertMock.mockResolvedValueOnce({ error: { message: "boom" } });
    const first = await logFormAutoPromotion(base);
    expect(first.logged).toBe(false);
    expect(first.error).toBeTruthy();
    insertMock.mockResolvedValueOnce({ error: null });
    const second = await logFormAutoPromotion(base);
    expect(second.logged).toBe(true);
    expect(insertMock).toHaveBeenCalledTimes(2);
  });
});
