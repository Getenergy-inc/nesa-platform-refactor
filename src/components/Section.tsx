import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  tone?: "charcoal" | "ivory";
}

/** Page section wrapper using existing NESA brand tokens only. */
const Section = forwardRef<HTMLElement, SectionProps>(
  ({ tone = "charcoal", className, children, ...props }, ref) => (
    <section
      ref={ref}
      className={cn(
        "py-16 md:py-24",
        tone === "charcoal" ? "bg-charcoal text-ivory" : "bg-ivory text-charcoal",
        className,
      )}
      {...props}
    >
      <div className="container mx-auto px-4">{children}</div>
    </section>
  ),
);
Section.displayName = "Section";

export default Section;
