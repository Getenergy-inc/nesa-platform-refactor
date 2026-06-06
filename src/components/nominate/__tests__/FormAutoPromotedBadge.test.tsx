import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { FormAutoPromotedBadge } from "../FormAutoPromotedBadge";

const mockHasRole = vi.fn();

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({ hasRole: mockHasRole }),
}));

describe("FormAutoPromotedBadge", () => {
  beforeEach(() => {
    mockHasRole.mockReset();
  });

  it("renders nothing for non-admin users", () => {
    mockHasRole.mockReturnValue(false);
    const { container } = render(
      <FormAutoPromotedBadge rawStatus="Link Pending" resolvedStatus="Active" />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders nothing when form was not auto-promoted", () => {
    mockHasRole.mockReturnValue(true);
    const { container } = render(
      <FormAutoPromotedBadge rawStatus="Active" resolvedStatus="Active" />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("shows the auto-promoted badge for admins when promoted", () => {
    mockHasRole.mockReturnValue(true);
    render(<FormAutoPromotedBadge rawStatus="Link Pending" resolvedStatus="Active" />);
    expect(screen.getByText("Auto-promoted")).toBeInTheDocument();
  });

  it("has a title attribute explaining the promotion", () => {
    mockHasRole.mockReturnValue(true);
    render(<FormAutoPromotedBadge rawStatus="Link Pending" resolvedStatus="Active" />);
    expect(screen.getByTitle(/Auto-promoted by resolver/)).toBeInTheDocument();
  });
});
