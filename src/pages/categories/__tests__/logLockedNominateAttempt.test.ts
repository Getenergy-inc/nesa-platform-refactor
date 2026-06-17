/**
 * QA gate: clicking the "Nominations opening soon" button on a locked
 * advocacy tile MUST emit a `nominate_locked_attempt` audit_events row, so
 * we can measure pent-up demand for backend listings that haven't shipped.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  logLockedNominateAttempt,
  LOCKED_NOMINATE_ACTION,
} from "../logLockedNominateAttempt";

const insertMock = vi.fn();
const getUserMock = vi.fn();

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: { getUser: (...args: unknown[]) => getUserMock(...args) },
    from: (table: string) => ({
      insert: (row: unknown) => insertMock(table, row),
    }),
  },
}));

describe("logLockedNominateAttempt — audit trail for locked tiles", () => {
  beforeEach(() => {
    insertMock.mockReset();
    getUserMock.mockReset();
  });

  it("writes a nominate_locked_attempt row to audit_events with the tile metadata", async () => {
    getUserMock.mockResolvedValue({ data: { user: null } });
    insertMock.mockResolvedValue({ error: null });

    const result = await logLockedNominateAttempt({
      faith: "christian",
      tabKey: "advocacy",
      slug: "christian-advocacy",
      tileTitle: "Best Advocacy for Educational Reforms & Awareness Campaigns",
      routePath: "/categories/christian-education-impact-africa",
    });

    expect(result.logged).toBe(true);
    expect(insertMock).toHaveBeenCalledTimes(1);
    const [table, row] = insertMock.mock.calls[0];
    expect(table).toBe("audit_events");
    expect(row).toMatchObject({
      action: LOCKED_NOMINATE_ACTION,
      entity_type: "subcategory",
      actor_id: null,
      actor_role: "anonymous",
      metadata: {
        faith: "christian",
        tab_key: "advocacy",
        slug: "christian-advocacy",
        route_path: "/categories/christian-education-impact-africa",
      },
    });
  });

  it("attaches the authenticated actor_id when a user is signed in", async () => {
    getUserMock.mockResolvedValue({
      data: { user: { id: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee" } },
    });
    insertMock.mockResolvedValue({ error: null });

    await logLockedNominateAttempt({
      faith: "christian",
      tabKey: "advocacy",
      slug: "christian-advocacy",
      tileTitle: "Best Advocacy for Educational Reforms & Awareness Campaigns",
      routePath: "/categories/christian-education-impact-africa",
    });

    const [, row] = insertMock.mock.calls[0];
    expect(row.actor_id).toBe("aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee");
    expect(row.actor_role).toBe("user");
  });

  it("returns logged:false when the audit insert is rejected (anonymous via RLS)", async () => {
    getUserMock.mockResolvedValue({ data: { user: null } });
    insertMock.mockResolvedValue({
      error: { message: "permission denied for table audit_events" },
    });

    const result = await logLockedNominateAttempt({
      faith: "christian",
      tabKey: "advocacy",
      slug: "christian-advocacy",
      tileTitle: "Best Advocacy for Educational Reforms & Awareness Campaigns",
      routePath: "/categories/christian-education-impact-africa",
    });

    expect(result.logged).toBe(false);
    expect(result.reason).toMatch(/permission denied/);
  });
});
