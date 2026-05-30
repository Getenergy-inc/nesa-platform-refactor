import { Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { getSlotGroupForCategory } from "@/config/sponsorSlotLimits";

interface Props {
  slug?: string;
}

/**
 * Inline panel surfacing the sponsor-slot rule for a specific
 * sponsorship lane. Falls back to a general rule + link to the matrix.
 */
export function SponsorSlotBadge({ slug }: Props) {
  const group = getSlotGroupForCategory(slug);

  return (
    <aside className="rounded-2xl border border-gold/30 bg-charcoal/60 p-5 md:p-6">
      <div className="flex items-start gap-3">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15 border border-gold/30 text-gold shrink-0">
          <Lock className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <div className="text-[11px] uppercase tracking-[0.22em] text-gold font-semibold mb-1.5">
            Sponsor Slot Limit
          </div>

          {group ? (
            <>
              <h3 className="font-display text-base md:text-lg font-semibold text-ivory mb-1.5">
                {group.title}
              </h3>
              <p className="text-ivory/65 text-sm mb-3">{group.summary}</p>
              <ul className="space-y-1.5 mb-3">
                {group.rows.map((r) => (
                  <li key={r.area} className="text-ivory/85 text-sm flex flex-wrap gap-x-2">
                    <span className="text-ivory/85">{r.area}</span>
                    <span className="text-gold/90 font-semibold">— {r.mainSlots}</span>
                    {r.mainAmount && (
                      <span className="text-ivory/55 text-xs self-center">({r.mainAmount})</span>
                    )}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-ivory/75 text-sm mb-3">
              To protect sponsor value and award integrity, each major award
              category has only one main sponsor. Selected supporting partners
              may be allowed for media, storytelling, hospitality, visibility or
              legacy impact. Sub-category pages carry a maximum of three
              sponsors per page.
            </p>
          )}

          <Link
            to="/sponsor#sponsor-slot-matrix"
            className="inline-flex items-center gap-1 text-xs font-semibold text-gold hover:text-gold-dark"
          >
            See the full sponsor slot matrix →
          </Link>
        </div>
      </div>
    </aside>
  );
}
