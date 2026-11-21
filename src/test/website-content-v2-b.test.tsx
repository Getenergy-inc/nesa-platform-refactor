import { render, screen } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import { beforeAll, describe, expect, it, vi } from "vitest";
import Contact from "@/pages/Contact";
import { NominationGuide2026 } from "@/components/nominate/NominationGuide2026";
import { PUBLIC_ACTIONS_2026 } from "@/config/publicActions2026";

beforeAll(() => {
  vi.stubGlobal("ResizeObserver", class {
    observe() {}
    unobserve() {}
    disconnect() {}
  });
});

describe("Website Content v2 Message B actions", () => {
  it("opens the canonical nomination form in a new tab from the nomination guide", () => {
    render(<MemoryRouter><NominationGuide2026 /></MemoryRouter>);
    const action = screen.getByRole("link", { name: "Open the nomination form" });
    expect(action).toHaveAttribute("href", PUBLIC_ACTIONS_2026.nominate.href);
    expect(action).toHaveAttribute("target", "_blank");
    expect(action).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });

  it("preselects the Correction or update enquiry type from the profile correction destination", () => {
    render(
      <HelmetProvider>
        <MemoryRouter initialEntries={["/contact?topic=correction"]}><Contact /></MemoryRouter>
      </HelmetProvider>,
    );
    expect(screen.getByLabelText("Enquiry type *")).toHaveValue("Correction or update");
  });
});
