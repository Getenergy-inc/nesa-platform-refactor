import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { FormAutoPromotedBadge } from "../FormAutoPromotedBadge";

const mockHasRole = vi.fn();
const mockUser = { id: "user-1" };
const mockLog = vi.fn().mockResolvedValue({ logged: true });

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({ hasRole: mockHasRole, user: mockUser }),
}));

vi.mock("@/lib/audit/logFormAutoPromotion", () => ({
  logFormAutoPromotion: (input: unknown) => mockLog(input),
}));

describe("FormAutoPromotedBadge", () => {
  beforeEach(() => {
    mockHasRole.mockReset();
    mockLog.mockClear();
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

  it("logs an audit event when an admin sees a promoted form with a slug", () => {
    mockHasRole.mockReturnValue(true);
    render(
      <FormAutoPromotedBadge
        rawStatus="Link Pending"
        resolvedStatus="Active"
        formSlug="west-africa"
        formKind="rmsa-region"
      />,
    );
    expect(mockLog).toHaveBeenCalledWith({
      formKind: "rmsa-region",
      formSlug: "west-africa",
      actorId: "user-1",
      rawStatus: "Link Pending",
      resolvedStatus: "Active",
    });
  });

  it("does not log when the form was not promoted", () => {
    mockHasRole.mockReturnValue(true);
    render(
      <FormAutoPromotedBadge
        rawStatus="Active"
        resolvedStatus="Active"
        formSlug="west-africa"
      />,
    );
    expect(mockLog).not.toHaveBeenCalled();
  });

  it("does not log for non-admins even when promoted", () => {
    mockHasRole.mockReturnValue(false);
    render(
      <FormAutoPromotedBadge
        rawStatus="Link Pending"
        resolvedStatus="Active"
        formSlug="west-africa"
      />,
    );
    expect(mockLog).not.toHaveBeenCalled();
  });
});
