// Shared branded chrome for the NESA-Africa secure workspaces
// (Judges Arena, Icon Judges Portal and NRC Arena).
//
// This module ONLY provides visual identity — brand rail header, top status
// bar, KPI stat cards and the integrity footer — so every arena page reads
// like the approved interface mocks without altering page content or logic.

import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Bell, HelpCircle, ChevronDown, ShieldCheck, Trophy, Star } from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Brand rail header (seal + wordmark)                                  */
/* ------------------------------------------------------------------ */

export function ArenaSeal({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative grid place-items-center rounded-full border-2 border-gold/70 bg-arena-rail",
        "shadow-[0_0_18px_-4px_hsl(var(--gold)/0.55)]",
        className,
      )}
      aria-hidden
    >
      <span className="absolute inset-1 rounded-full border border-gold/30" />
      <span className="font-playfair text-gold text-[11px] font-bold tracking-[0.14em] leading-none">
        NESA
      </span>
    </span>
  );
}

interface ArenaBrandProps {
  /** e.g. "Judges Arena" or "NRC Arena" */
  workspace: string;
  to?: string;
  compact?: boolean;
  className?: string;
}

export function ArenaBrand({ workspace, to = "/", compact = false, className }: ArenaBrandProps) {
  const content = (
    <div className={cn("flex flex-col items-center text-center gap-2", className)}>
      <ArenaSeal className={compact ? "h-10 w-10" : "h-16 w-16"} />
      <div>
        <p
          className={cn(
            "font-playfair font-bold tracking-wide text-white leading-none",
            compact ? "text-sm" : "text-lg",
          )}
        >
          NESA-AFRICA
        </p>
        <p className="mt-1 text-[10px] uppercase tracking-[0.28em] text-gold">{workspace}</p>
        <span className="mt-2 block h-px w-16 mx-auto bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
      </div>
    </div>
  );
  return (
    <Link to={to} className="block px-4 py-5">
      {content}
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Rail footer award badge card                                         */
/* ------------------------------------------------------------------ */

export function ArenaRailBadge({
  lines = ["2026 AFRICA", "EDUCATION ICON", "JUDGES ARENA"],
}: {
  lines?: string[];
}) {
  return (
    <div className="mx-3 mb-4 rounded-xl border border-gold/30 bg-gradient-to-b from-gold/10 to-transparent px-4 py-4 text-center">
      <Trophy className="mx-auto mb-2 h-6 w-6 text-gold" aria-hidden />
      {lines.map((l) => (
        <p key={l} className="text-[11px] font-semibold uppercase tracking-wider text-gold/90 leading-tight">
          {l}
        </p>
      ))}
      <div className="mt-2 flex justify-center gap-0.5" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-3 w-3 fill-gold text-gold" />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Top status bar                                                       */
/* ------------------------------------------------------------------ */

interface ArenaTopBarProps {
  title: string;
  subtitle?: string;
  /** Left slot, e.g. mobile menu trigger or back button */
  leading?: ReactNode;
  statusLabel?: string;
  statusDetail?: string;
  statusTone?: "live" | "closed" | "restricted";
  identityName?: string;
  identityRole?: string;
  notifications?: number;
  actions?: ReactNode;
}

const STATUS_DOT: Record<NonNullable<ArenaTopBarProps["statusTone"]>, string> = {
  live: "bg-emerald-400",
  closed: "bg-white/40",
  restricted: "bg-gold",
};

export function ArenaTopBar({
  title,
  subtitle,
  leading,
  statusLabel,
  statusDetail,
  statusTone = "restricted",
  identityName,
  identityRole,
  notifications,
  actions,
}: ArenaTopBarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-arena-bg/95 backdrop-blur">
      <div className="flex min-h-16 flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
        {leading}
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-playfair text-lg font-bold text-white sm:text-2xl">{title}</h1>
          {subtitle && <p className="truncate text-xs text-arena-muted sm:text-sm">{subtitle}</p>}
        </div>

        <div className="ml-auto flex items-center gap-2">
          {statusLabel && (
            <div className="hidden items-center gap-2 rounded-xl border border-white/12 bg-arena-panel px-3 py-2 sm:flex">
              <span className={cn("h-2.5 w-2.5 rounded-full", STATUS_DOT[statusTone])} aria-hidden />
              <div className="leading-tight">
                <p className="text-xs font-semibold text-white">{statusLabel}</p>
                {statusDetail && <p className="text-[11px] text-arena-muted">{statusDetail}</p>}
              </div>
            </div>
          )}

          <button
            type="button"
            aria-label="Notifications"
            className="relative grid h-10 w-10 place-items-center rounded-xl border border-white/12 bg-arena-panel text-white/80 hover:text-gold"
          >
            <Bell className="h-4 w-4" />
            {notifications ? (
              <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                {notifications}
              </span>
            ) : null}
          </button>

          <Link
            to="/support"
            aria-label="Help"
            className="hidden h-10 w-10 place-items-center rounded-xl border border-white/12 bg-arena-panel text-white/80 hover:text-gold sm:grid"
          >
            <HelpCircle className="h-4 w-4" />
          </Link>

          {identityName && (
            <div className="hidden items-center gap-2 rounded-xl border border-white/12 bg-arena-panel px-2.5 py-1.5 md:flex">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-gold/20 text-xs font-bold text-gold">
                {identityName.slice(0, 2).toUpperCase()}
              </span>
              <div className="leading-tight">
                <p className="max-w-[140px] truncate text-xs font-semibold text-white">{identityName}</p>
                {identityRole && <p className="text-[11px] text-arena-muted">{identityRole}</p>}
              </div>
              <ChevronDown className="h-4 w-4 text-arena-muted" aria-hidden />
            </div>
          )}

          {actions}
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* KPI stat cards                                                       */
/* ------------------------------------------------------------------ */

export interface ArenaStat {
  icon?: React.ElementType;
  value: ReactNode;
  label: string;
  detail?: string;
}

export function ArenaStatStrip({ stats, className }: { stats: ArenaStat[]; className?: string }) {
  if (!stats.length) return null;
  return (
    <div
      className={cn(
        "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
        stats.length === 5 && "xl:grid-cols-5",
        className,
      )}
    >
      {stats.map((s) => {
        const Icon = s.icon ?? ShieldCheck;
        return (
          <div
            key={s.label}
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-arena-panel px-4 py-4"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold/30 bg-gold/10">
              <Icon className="h-5 w-5 text-gold" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="font-playfair text-2xl font-bold leading-none text-white">{s.value}</p>
              <p className="mt-1 truncate text-sm font-medium text-white/85">{s.label}</p>
              {s.detail && <p className="truncate text-[11px] text-arena-muted">{s.detail}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Integrity footer                                                     */
/* ------------------------------------------------------------------ */

export function ArenaFooter({ workspace = "Judges Arena" }: { workspace?: string }) {
  return (
    <footer className="mt-10 border-t border-white/10 px-4 py-5 text-[11px] text-arena-muted sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p>© 2026 NESA-Africa. All rights reserved.</p>
        <p className="flex items-center gap-2">
          <span>Integrity</span>
          <span aria-hidden>·</span>
          <span>Excellence</span>
          <span aria-hidden>·</span>
          <span>Impact</span>
        </p>
        <p className="flex items-center gap-1.5">
          NESA-Africa {workspace} is audited, secure and independently verified.
          <ShieldCheck className="h-3.5 w-3.5 text-gold" aria-hidden />
        </p>
      </div>
    </footer>
  );
}
