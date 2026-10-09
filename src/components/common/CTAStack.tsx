// CTAStack — enforces the §9 CTA hierarchy: exactly one primary, at most one
// secondary, at most one tertiary text link. Prevents pages from shipping
// with five equally-weighted buttons.

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface CTAAction {
  label: string;
  href: string;
  /** Optional analytics event name; caller wires the handler. */
  onClick?: () => void;
  /** Open in new tab (external references). */
  external?: boolean;
}

export interface CTAStackProps {
  primary: CTAAction;
  secondary?: CTAAction;
  tertiary?: CTAAction;
  align?: "start" | "center";
  className?: string;
}

export function CTAStack({ primary, secondary, tertiary, align = "start", className }: CTAStackProps) {
  const wrap = align === "center" ? "items-center justify-center text-center" : "items-start";
  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4", wrap, className)}>
      <Button
        asChild
        size="lg"
        className="bg-gold text-charcoal hover:bg-gold/90 min-h-11 font-semibold"
      >
        <Link to={primary.href} onClick={primary.onClick} {...(primary.external ? { target: "_blank", rel: "noreferrer" } : {})}>
          {primary.label}
        </Link>
      </Button>
      {secondary ? (
        <Button
          asChild
          size="lg"
          variant="outline"
          className="border-gold/40 text-gold hover:bg-gold/10 min-h-11"
        >
          <Link to={secondary.href} onClick={secondary.onClick} {...(secondary.external ? { target: "_blank", rel: "noreferrer" } : {})}>
            {secondary.label}
          </Link>
        </Button>
      ) : null}
      {tertiary ? (
        <Link
          to={tertiary.href}
          onClick={tertiary.onClick}
          className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          {...(tertiary.external ? { target: "_blank", rel: "noreferrer" } : {})}
        >
          {tertiary.label}
        </Link>
      ) : null}
    </div>
  );
}

export default CTAStack;
