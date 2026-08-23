// ============================================================================
// Geographic Reach — interactive 8-region NESA-Africa map for /nominees#regions
//
// Recalled from the classic NESA-Africa region map and refactored for the
// Africa Education Impact Directory: hovering/focusing a region highlights it
// on the map, clicking filters the Recognition Catalogue by that region.
// Live counts come from the verified nominee register (never fabricated).
// ============================================================================

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Globe2, MapPin } from "lucide-react";

import { AFRICA_REGIONS } from "@/config/regions/africaRegions";
import { REGION_FRAMING } from "@/config/platformCopy";
import { trackEvent } from "@/lib/analytics";

// Simplified Africa map — one polygon per NESA-Africa region.
// (Recalled from the original NESA-Africa 8-region SVG map.)
const REGION_PATHS: Record<string, { path: string; labelX: number; labelY: number }> = {
  "north-africa": {
    path: "M 140,20 L 280,15 L 310,40 L 320,80 L 300,110 L 250,120 L 200,130 L 160,120 L 130,100 L 120,60 Z",
    labelX: 220, labelY: 70,
  },
  "west-africa": {
    path: "M 80,130 L 160,120 L 200,130 L 190,160 L 170,190 L 140,200 L 110,195 L 80,180 L 65,160 Z",
    labelX: 135, labelY: 165,
  },
  "sahel-region": {
    path: "M 160,110 L 250,115 L 260,130 L 250,145 L 200,150 L 165,140 L 155,125 Z",
    labelX: 205, labelY: 130,
  },
  "central-africa": {
    path: "M 170,190 L 200,150 L 250,145 L 270,160 L 275,200 L 260,230 L 220,240 L 190,225 L 175,205 Z",
    labelX: 225, labelY: 195,
  },
  "horn-of-africa": {
    path: "M 300,110 L 330,100 L 360,120 L 350,155 L 320,170 L 290,150 L 280,130 Z",
    labelX: 320, labelY: 135,
  },
  "east-africa": {
    path: "M 270,160 L 320,170 L 335,200 L 330,250 L 310,280 L 280,270 L 260,240 L 260,200 Z",
    labelX: 295, labelY: 220,
  },
  "southern-africa": {
    path: "M 200,280 L 260,270 L 310,280 L 310,320 L 290,360 L 260,380 L 230,375 L 200,350 L 190,310 Z",
    labelX: 255, labelY: 330,
  },
  "indian-ocean-islands": {
    path: "M 350,260 L 370,255 L 380,275 L 375,295 L 355,300 L 345,280 Z",
    labelX: 362, labelY: 278,
  },
};

// The two Global Communities sit beside the 8 continental regions.
// countKey matches the normalized region names produced by normalizeRegion().
const GLOBAL_COMMUNITIES = [
  {
    name: REGION_FRAMING.globalCommunities[0], // "Africans in the Diaspora"
    countKey: "African Diaspora",
    blurb: "Africans and people of African descent enabling education from outside the continent.",
  },
  {
    name: REGION_FRAMING.globalCommunities[1], // "Friends of Africa"
    countKey: "Friends of Africa",
    blurb: "Non-African allies and institutions supporting Africa's educational transformation.",
  },
];

const catalogueHref = (regionName: string) =>
  `/nominees/catalogue?region=${encodeURIComponent(regionName)}`;

interface GeographicReachMapProps {
  /** Canonical region display name -> live nominee count. */
  counts: Map<string, number>;
  loading?: boolean;
}

export function GeographicReachMap({ counts, loading }: GeographicReachMapProps) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  // Canonical 8 regions in display order, each with its SVG geometry.
  const regions = useMemo(
    () =>
      AFRICA_REGIONS.slice()
        .sort((a, b) => a.order - b.order)
        .map((r) => ({ ...r, geo: REGION_PATHS[r.slug] }))
        .filter((r) => Boolean(r.geo)),
    [],
  );

  const activeRegion = activeSlug ? regions.find((r) => r.slug === activeSlug) : undefined;

  const countFor = (name: string) => (loading ? "…" : (counts.get(name) ?? 0).toLocaleString());

  const trackRegionClick = (region: string) =>
    trackEvent("directory_region_click", { region, surface: "nominees_hub_map" });

  return (
    <div className="ed-dir-geo">
      {/* ——— Interactive map ——— */}
      <div className="ed-geo-map">
        <svg
          viewBox="40 0 380 420"
          role="img"
          aria-label="Map of Africa showing the eight NESA-Africa regions. Select a region to filter the nominee register."
        >
          {regions.map((r) => {
            const isActive = activeSlug === r.slug;
            return (
              <Link
                key={r.slug}
                to={catalogueHref(r.name)}
                aria-label={`Filter the register by ${r.name} — ${countFor(r.name)} nominees`}
                onClick={() => trackRegionClick(r.name)}
              >
                <g
                  className={`ed-geo-shape${isActive ? " is-active" : ""}`}
                  onMouseEnter={() => setActiveSlug(r.slug)}
                  onMouseLeave={() => setActiveSlug(null)}
                  onFocus={() => setActiveSlug(r.slug)}
                  onBlur={() => setActiveSlug(null)}
                >
                  <path d={r.geo!.path} />
                  <text x={r.geo!.labelX} y={r.geo!.labelY} textAnchor="middle" className="ed-geo-label">
                    {r.name.replace(" Region", "").replace("Indian Ocean Islands", "Islands")}
                  </text>
                </g>
              </Link>
            );
          })}
        </svg>

        {/* Detail panel for the hovered / focused region */}
        <div className="ed-geo-detail" aria-live="polite">
          {activeRegion ? (
            <>
              <div className="ed-geo-detail-head">
                <MapPin className="ed-geo-detail-icon" aria-hidden />
                <strong>{activeRegion.name}</strong>
                <span className="ed-geo-count">{countFor(activeRegion.name)} nominees</span>
              </div>
              <p className="ed-geo-detail-countries">
                {activeRegion.countries.slice(0, 6).join(" · ")}
                {activeRegion.countries.length > 6 && ` · +${activeRegion.countries.length - 6} more`}
              </p>
              <Link
                to={catalogueHref(activeRegion.name)}
                className="ed-geo-detail-link"
                onClick={() => trackRegionClick(activeRegion.name)}
              >
                Browse {activeRegion.name} nominees <ArrowUpRight aria-hidden />
              </Link>
            </>
          ) : (
            <>
              <div className="ed-geo-detail-head">
                <MapPin className="ed-geo-detail-icon" aria-hidden />
                <strong>Eight Africa Regions</strong>
              </div>
              <p className="ed-geo-detail-countries">
                Hover or tap a region to preview it — select one to filter the register.
              </p>
            </>
          )}
        </div>
      </div>

      {/* ——— Region + Global Community index ——— */}
      <div>
        <div className="ed-geo-list" role="list">
          {regions.map((r) => (
            <Link
              key={r.slug}
              role="listitem"
              to={catalogueHref(r.name)}
              className={`ed-geo-row${activeSlug === r.slug ? " is-active" : ""}`}
              onMouseEnter={() => setActiveSlug(r.slug)}
              onMouseLeave={() => setActiveSlug(null)}
              onFocus={() => setActiveSlug(r.slug)}
              onBlur={() => setActiveSlug(null)}
              onClick={() => trackRegionClick(r.name)}
            >
              <span>{r.name}</span>
              <span className="ed-geo-count">{countFor(r.name)}</span>
            </Link>
          ))}
        </div>

        <p className="ed-geo-subhead">Global Communities</p>
        <div className="ed-geo-list">
          {GLOBAL_COMMUNITIES.map((c) => (
            <Link
              key={c.name}
              to={catalogueHref(c.name)}
              className="ed-geo-row ed-geo-row-global"
              title={c.blurb}
              onClick={() => trackRegionClick(c.name)}
            >
              <span className="ed-geo-row-name">
                <Globe2 className="ed-geo-globe" aria-hidden />
                {c.name}
              </span>
              <span className="ed-geo-count">{countFor(c.countKey)}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GeographicReachMap;
