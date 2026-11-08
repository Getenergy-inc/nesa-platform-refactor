import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ContentRequiredProps {
  title: string;
  children: ReactNode;
  className?: string;
}

/** Approved visible state for content or destinations SCEF has not supplied. */
export function ContentRequired({ title, children, className }: ContentRequiredProps) {
  return (
    <div role="note" className={cn("rounded-lg border border-dashed border-gold/50 bg-gold/5 p-4 text-left", className)}>
      <p className="text-xs font-semibold uppercase tracking-wider text-gold">CONTENT REQUIRED</p>
      <p className="mt-1 text-sm font-medium text-foreground">{title}</p>
      <div className="mt-1 text-sm text-muted-foreground">{children}</div>
    </div>
  );
}
