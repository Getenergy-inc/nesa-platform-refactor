// Minimal frame for admin tools that render without any site header or
// dashboard shell. Its only job is to guarantee a visible, client-side route
// back to the public NESA-Africa homepage (same affordance as the arenas).

import type { ReactNode } from "react";
import { ArenaExitButton } from "@/components/arena/ArenaExitLink";

export function AdminBareShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-40 border-b border-gold/20 bg-charcoal/95 backdrop-blur">
        <div className="container flex h-12 items-center justify-between gap-3">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-white/60">
            NESA-Africa Admin Tool
          </span>
          <ArenaExitButton />
        </div>
      </div>
      {children}
    </div>
  );
}

export default AdminBareShell;
