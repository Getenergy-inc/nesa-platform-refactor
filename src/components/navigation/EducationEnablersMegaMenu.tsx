// Education Enablers mega menu — 4-column panel used inside NavigationMenuContent.
// Columns: Explore · Browse by REC · Browse by Sector · EdTech + Actions strip.

import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  RECS,
  FEATURED_SECTORS,
  EDTECH_SUBCATS,
  ENABLER_ACTIONS,
} from "@/config/enablersTaxonomy";
import { trackEvent } from "@/lib/analytics";

const EXPLORE: { label: string; href: string }[] = [
  { label: "Education Enablers Overview", href: "/education-enablers" },
  { label: "Browse All Education Enablers", href: "/education-enablers?view=all" },
  { label: "Featured Education Enablers", href: "/education-enablers?filter=featured" },
  { label: "Verified Education Enablers", href: "/education-enablers?filter=verified" },
  { label: "Recently Added", href: "/education-enablers?sort=recent" },
  { label: "Search the Directory", href: "/education-enablers?focus=search" },
];

function ColumnHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[11px] uppercase tracking-wider text-gold/80 font-semibold mb-2 px-2">
      {children}
    </h3>
  );
}

function MegaLink({
  href,
  label,
  parent,
}: {
  href: string;
  label: string;
  parent: string;
}) {
  return (
    <Link
      to={href}
      onClick={() =>
        trackEvent("mega_menu_click", { parent, label, href, section: "education-enablers" })
      }
      className={cn(
        "block px-2 py-1.5 rounded text-[13px] leading-snug text-white/85 hover:text-gold hover:bg-gold/10",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
      )}
    >
      {label}
    </Link>
  );
}

export function EducationEnablersMegaMenu() {
  return (
    <div className="w-[min(96vw,1040px)] bg-charcoal border border-gold/20 p-5">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div>
          <ColumnHeading>Explore</ColumnHeading>
          <div className="space-y-0.5">
            {EXPLORE.map((i) => (
              <MegaLink key={i.href} href={i.href} label={i.label} parent="Explore" />
            ))}
          </div>
        </div>

        <div>
          <ColumnHeading>Browse by African REC</ColumnHeading>
          <div className="space-y-0.5">
            {RECS.map((r) => (
              <MegaLink key={r.slug} href={r.href} label={r.label.split(" — ")[0]} parent="REC" />
            ))}
          </div>
        </div>

        <div>
          <ColumnHeading>Browse by Sector</ColumnHeading>
          <div className="space-y-0.5">
            {FEATURED_SECTORS.map((s) => (
              <MegaLink key={s.slug} href={s.href} label={s.label} parent="Sector" />
            ))}
            <Link
              to="/education-enablers/sectors"
              onClick={() =>
                trackEvent("mega_menu_click", {
                  parent: "Sector",
                  label: "View all 20 sectors",
                  href: "/education-enablers/sectors",
                  section: "education-enablers",
                })
              }
              className="inline-flex items-center gap-1 mt-1 px-2 py-1.5 text-[12px] font-semibold text-gold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded"
            >
              View all 20 sectors <ArrowRight className="h-3 w-3" aria-hidden />
            </Link>
          </div>
        </div>

        <div>
          <ColumnHeading>EdTech Education Enablers</ColumnHeading>
          <div className="space-y-0.5">
            {EDTECH_SUBCATS.map((e) => (
              <MegaLink key={e.slug} href={e.href} label={e.label} parent="EdTech" />
            ))}
            <MegaLink
              href="/education-enablers/edtech/regions"
              label="Browse EdTech by African Region"
              parent="EdTech"
            />
            <MegaLink
              href="/education-enablers/edtech/prospects"
              label="EdTech Sponsor & Partner Prospects"
              parent="EdTech"
            />
          </div>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-gold/15 flex flex-wrap gap-2">
        {ENABLER_ACTIONS.map((a) => (
          <Link
            key={a.slug}
            to={a.href}
            onClick={() =>
              trackEvent("mega_menu_action_click", {
                label: a.label,
                href: a.href,
                section: "education-enablers",
              })
            }
            className={cn(
              "px-3 py-1.5 rounded-md text-[12px] font-semibold border transition-colors",
              a.slug === "nominate"
                ? "bg-gold text-charcoal border-gold hover:bg-gold/90"
                : "border-gold/40 text-white/90 hover:text-gold hover:border-gold hover:bg-gold/10",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
            )}
          >
            {a.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default EducationEnablersMegaMenu;
