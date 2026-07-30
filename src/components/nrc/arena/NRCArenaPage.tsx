// Reusable page shell for NRC Arena sub-routes so every screen has the
// same header identity chip, breadcrumb and integrity footer visible in
// the approved dashboard mocks.

import { ReactNode } from "react";
import { ArenaSeo } from "@/components/arena/ArenaSeo";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { NRCArenaLayout } from "./NRCArenaLayout";

export interface NRCArenaPageProps {
  title: string;
  eyebrow?: string;
  description?: string;
  status?: "live" | "closed" | "restricted";
  breadcrumb?: { label: string; href?: string }[];
  actions?: ReactNode;
  children: ReactNode;
}

const STATUS_STYLE: Record<NonNullable<NRCArenaPageProps["status"]>, string> = {
  live: "border-emerald-400/40 text-emerald-300 bg-emerald-400/10",
  closed: "border-white/20 text-white/60 bg-white/5",
  restricted: "border-gold/40 text-gold bg-gold/10",
};

export function NRCArenaPage({
  title,
  eyebrow = "NRC Arena",
  description,
  status = "restricted",
  breadcrumb,
  actions,
  children,
}: NRCArenaPageProps) {
  return (
    <NRCArenaLayout>
      <ArenaSeo workspace="NRC Arena" title={title} description={description} />

      {breadcrumb && breadcrumb.length > 0 && (
        <nav aria-label="Breadcrumb" className="mb-3 flex items-center gap-1.5 text-xs text-white/50">
          <Link to="/nrc/dashboard" className="hover:text-gold">Dashboard</Link>
          {breadcrumb.map((b, i) => (
            <span key={i} className="inline-flex items-center gap-1.5">
              <ChevronRight className="h-3 w-3" aria-hidden />
              {b.href ? (
                <Link to={b.href} className="hover:text-gold">{b.label}</Link>
              ) : (
                <span className="text-white/70">{b.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}

      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.18em] text-gold/80">{eyebrow}</p>
          <h1 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-white">{title}</h1>
          {description && (
            <p className="mt-2 max-w-2xl text-sm text-white/65">{description}</p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={STATUS_STYLE[status]}>
              {status === "live" ? "● Verification Live" : status === "closed" ? "○ Stage Closed" : "🔒 Restricted"}
            </Badge>
            <Badge variant="outline" className="border-white/20 text-white/60">Audit Enabled</Badge>
            <Badge variant="outline" className="border-white/20 text-white/60">2026 Cycle</Badge>
          </div>
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </header>

      <div className="pb-16">{children}</div>

    </NRCArenaLayout>
  );
}

export default NRCArenaPage;
