/**
 * Integration QA gate: clicking the locked Christian Advocacy & Awareness
 * tile must trigger `logLockedNominateAttempt` so an audit row is written.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import { FaithCategoryPage } from "../FaithCategoryPage";
import { christianEducationConfig } from "../christianEducationData";

vi.mock("@/hooks/useFaithSubcategoryUuids", () => ({
  useFaithSubcategoryUuids: () => ({ uuidBySlug: {}, loading: false }),
}));

const logSpy = vi.fn();
vi.mock("../logLockedNominateAttempt", () => ({
  logLockedNominateAttempt: (attempt: unknown) => {
    logSpy(attempt);
    return Promise.resolve({ logged: true });
  },
  LOCKED_NOMINATE_ACTION: "nominate_locked_attempt",
}));

vi.mock("@/hooks/use-toast", () => ({ toast: vi.fn() }));

describe("Locked advocacy tile — emits audit log on click", () => {
  beforeEach(() => {
    logSpy.mockReset();
  });

  it("calls logLockedNominateAttempt with the christian-advocacy tile metadata", () => {
    render(
      <HelmetProvider>
        <MemoryRouter>
          <FaithCategoryPage config={christianEducationConfig} />
        </MemoryRouter>
      </HelmetProvider>,
    );

    const heading = screen.getByText(
      "Best Advocacy for Educational Reforms & Awareness Campaigns",
    );
    const tile = heading.parentElement as HTMLElement;
    const btn = within(tile).getByRole("button", {
      name: /Nominations opening soon/i,
    });
    fireEvent.click(btn);

    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        faith: "christian",
        tabKey: "advocacy",
        slug: "christian-advocacy",
        routePath: "/categories/christian-education-impact-africa",
      }),
    );
  });
});
