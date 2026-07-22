import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";
import { PORTAL_AREAS } from "@/config/judgeapply/portalRegistry";
import { cn } from "@/lib/utils";

/**
 * PortalHeader — dropdown navigation for the /judgeapply portal.
 * Public navigation only; does not grant judge or NRC permissions.
 */
export function PortalHeader() {
  const [openArea, setOpenArea] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isActiveArea = (path: string) => location.pathname.startsWith(path);

  return (
    <header className="sticky top-0 z-40 border-b border-gold/20 bg-charcoal/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link to="/judgeapply" className="flex items-center gap-3 group">
          <img
            src="/images/logo.svg"
            alt="NESA-Africa"
            className="h-9 w-9"
            loading="eager"
          />
          <div className="leading-tight">
            <div className="font-display text-white text-sm tracking-wide">NESA-AFRICA</div>
            <div className="text-[11px] text-gold font-semibold uppercase tracking-wider">
              Judges & NRC Portal
            </div>
          </div>
        </Link>

        {/* Desktop dropdowns */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Portal areas">
          {PORTAL_AREAS.map((area) => {
            const open = openArea === area.id;
            return (
              <div
                key={area.id}
                className="relative"
                onMouseEnter={() => setOpenArea(area.id)}
                onMouseLeave={() => setOpenArea((cur) => (cur === area.id ? null : cur))}
              >
                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={open}
                  onClick={() => setOpenArea(open ? null : area.id)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActiveArea(area.path)
                      ? "text-gold"
                      : "text-white/80 hover:text-white",
                  )}
                >
                  {area.label}
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform",
                      open && "rotate-180",
                    )}
                  />
                </button>

                {open && (
                  <div
                    role="menu"
                    className="absolute left-0 top-full pt-2 w-80"
                  >
                    <div className="rounded-xl border border-gold/25 bg-charcoal-light shadow-2xl p-2">
                      <Link
                        to={area.path}
                        className="block rounded-lg px-3 py-2 hover:bg-gold/10"
                        role="menuitem"
                        onClick={() => setOpenArea(null)}
                      >
                        <div className="text-sm font-semibold text-gold">
                          {area.label} — overview
                        </div>
                        <div className="text-xs text-white/60 mt-0.5">{area.tagline}</div>
                      </Link>
                      <div className="my-1 h-px bg-gold/15" />
                      {area.pages.map((p) => (
                        <Link
                          key={p.slug}
                          to={`${area.path}/${p.slug}`}
                          role="menuitem"
                          onClick={() => setOpenArea(null)}
                          className="flex items-start gap-3 rounded-lg px-3 py-2 hover:bg-gold/10"
                        >
                          <p.icon className="h-4 w-4 mt-0.5 text-gold flex-shrink-0" />
                          <div>
                            <div className="text-sm font-medium text-white">{p.title}</div>
                            <div className="text-xs text-white/55 leading-snug">{p.short}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="hidden md:block">
          <Link
            to="/judge"
            className="rounded-full bg-gold px-5 py-2 text-sm font-semibold text-charcoal hover:bg-gold-dark transition-colors"
          >
            Sign In
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="md:hidden text-white p-2"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((o) => !o)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile accordion */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gold/15 bg-charcoal">
          <div className="container py-3 space-y-2">
            {PORTAL_AREAS.map((area) => (
              <details key={area.id} className="group rounded-lg border border-gold/15">
                <summary className="flex cursor-pointer items-center justify-between px-3 py-3 text-sm font-semibold text-white">
                  {area.label}
                  <ChevronDown className="h-4 w-4 text-gold group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-3 pb-3 space-y-1">
                  <NavLink
                    to={area.path}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded px-2 py-1.5 text-sm text-gold hover:bg-gold/10"
                  >
                    {area.label} — overview
                  </NavLink>
                  {area.pages.map((p) => (
                    <NavLink
                      key={p.slug}
                      to={`${area.path}/${p.slug}`}
                      onClick={() => setMobileOpen(false)}
                      className="block rounded px-2 py-1.5 text-sm text-white/80 hover:bg-gold/10 hover:text-white"
                    >
                      {p.title}
                    </NavLink>
                  ))}
                </div>
              </details>
            ))}
            <Link
              to="/judge"
              onClick={() => setMobileOpen(false)}
              className="block text-center rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-charcoal"
            >
              Sign In
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default PortalHeader;
