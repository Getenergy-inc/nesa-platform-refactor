// "Back to NESA-Africa" affordance for the secure workspaces.
//
// The Judges Arena and NRC Arena deliberately use their own navy/gold visual
// system, but they are still part of one platform — so every arena shell keeps
// a persistent, immediately visible route back to the public site.

import { Link } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Compact pill used in the arena TOP BAR (always visible, never scrolled away).
 */
export function ArenaExitButton({ className }: { className?: string }) {
  return (
    <Link
      to="/"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-xl border border-gold/40 bg-gold/10 px-3 py-2",
        "text-xs font-semibold text-gold transition-colors hover:bg-gold/20",
        className,
      )}
    >
      <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
      <span className="hidden sm:inline">Back to NESA-Africa</span>
      <span className="sm:hidden">Exit</span>
    </Link>
  );
}

/**
 * Full-width banner used at the TOP of the arena sidebar rail, directly above
 * the brand seal, so the way out is the first thing visible on entry.
 */
export function ArenaExitRailLink({ className }: { className?: string }) {
  return (
    <Link
      to="/"
      className={cn(
        "flex items-center justify-between gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-3",
        "text-xs font-medium text-white/70 transition-colors hover:bg-gold/10 hover:text-gold",
        className,
      )}
    >
      <span className="flex items-center gap-2">
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
        Back to NESA-Africa
      </span>
      <ExternalLink className="h-3 w-3 opacity-60" aria-hidden />
    </Link>
  );
}

export default ArenaExitButton;
