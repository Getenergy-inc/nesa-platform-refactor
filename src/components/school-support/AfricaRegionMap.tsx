import { useEffect, useMemo, useState } from "react";
import { geoMercator, geoPath, geoCentroid } from "d3-geo";
import { feature } from "topojson-client";
import type { FeatureCollection, Feature, Geometry } from "geojson";
import { COUNTRY_MAP_APPROVED, REGION_TARGET_USD, SNS_COUNTRIES, SNS_CTAS, SNS_ISLAND_DOTS, SNS_MAP_DRAFT_NOTE, SNS_REGIONS, SNS_REGIONS_NOTE, SNS_UNASSIGNED, VOTING_PENDING_LABEL, regionByKey, type RegionKey } from "@/config/schoolSupport";
import { useSupportPage } from "./SupportPageContext";
import { chip, pillOutline, pillPrimary } from "./ui";

const W = 640, H = 680;
const byId = new Map(SNS_COUNTRIES.map((c) => [c.id, c]));
const counts = SNS_REGIONS.map((r) => ({ ...r, n: SNS_COUNTRIES.filter((c) => c.region === r.key).length }));

function ApprovedAfricaRegionMap() {
  const { goDonate, goSponsor, goAnchor } = useSupportPage();
  const [features, setFeatures] = useState<Feature<Geometry, { name?: string }>[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [focus, setFocus] = useState<RegionKey | null>(null);

  useEffect(() => {
    let live = true;
    import("world-atlas/countries-50m.json").then((m) => {
      const topo = (m as { default: unknown }).default as never;
      const fc = feature(topo, (topo as { objects: { countries: never } }).objects.countries) as unknown as FeatureCollection<Geometry, { name?: string }>;
      const keep = fc.features.filter((f) => byId.has(String(f.id)) || String(f.id) === SNS_UNASSIGNED.id);
      if (live) setFeatures(keep);
    }).catch(() => live && setFailed(true));
    return () => { live = false; };
  }, []);

  const path = useMemo(() => {
    const proj = geoMercator().fitExtent([[8, 8], [W - 8, H - 8]], { type: "MultiPoint", coordinates: [[-25.5, -35.2], [57.8, -35.2], [57.8, 37.6], [-25.5, 37.6]] } as never).clipExtent([[0, 0], [W, H]]);
    return { gen: geoPath(proj), proj };
  }, []);

  const country = selected ? byId.get(selected) : null;
  const region = country ? regionByKey(country.region) : null;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
      <div>
        <div className="mb-3 flex flex-wrap gap-2" role="group" aria-label="Focus a region">
          <button type="button" className={chip(focus === null)} aria-pressed={focus === null} onClick={() => setFocus(null)}>All regions</button>
          {counts.map((r) => (
            <button key={r.key} type="button" aria-pressed={focus === r.key} onClick={() => setFocus(focus === r.key ? null : r.key)} className={chip(focus === r.key)}>
              <span className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full align-middle" style={{ background: r.color }} aria-hidden />{r.name} ({r.n})
            </button>
          ))}
        </div>
        <div className="rounded-2xl border border-ea-line bg-ea-sand p-2">
          {failed ? <p className="p-8 text-sm">The map could not load. Use the country list instead.</p> : !features ? (
            <div className="flex aspect-[640/680] items-center justify-center text-sm text-ea-muted">Loading map…</div>
          ) : (
            <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Map of Africa coloured by the eight programme regions" className="h-auto w-full">
              {features.map((f) => {
                const id = String(f.id); const c = byId.get(id);
                const col = c ? regionByKey(c.region)!.color : SNS_UNASSIGNED.color;
                const dim = focus && (!c || c.region !== focus);
                const d = path.gen(f) || "";
                return (
                  <path key={id} d={d} fill={col} stroke="white" strokeWidth={selected === id ? 2.2 : 0.7}
                    opacity={dim ? 0.18 : 1} className={c ? "cursor-pointer" : ""} tabIndex={c ? -1 : undefined}
                    onClick={() => c && setSelected(id)}>
                    <title>{c ? `${c.name} · ${regionByKey(c.region)!.name}` : `${SNS_UNASSIGNED.name} · ${SNS_UNASSIGNED.note}`}</title>
                  </path>
                );
              })}
              {features.filter((f) => (SNS_ISLAND_DOTS as readonly string[]).includes(String(f.id))).map((f) => {
                const c = byId.get(String(f.id))!; const [x, y] = path.proj(geoCentroid(f)) || [0, 0];
                return <circle key={`dot-${f.id}`} cx={x} cy={y} r={7} fill={regionByKey(c.region)!.color} stroke="white" strokeWidth={1.5} opacity={focus && c.region !== focus ? 0.18 : 1} className="cursor-pointer" onClick={() => setSelected(String(f.id))}><title>{`${c.name} · ${regionByKey(c.region)!.name}`}</title></circle>;
              })}
            </svg>
          )}
        </div>
        <p className="mt-2 text-xs text-ea-muted">{!COUNTRY_MAP_APPROVED && `${SNS_MAP_DRAFT_NOTE}. `}{SNS_REGIONS_NOTE} Western Sahara: {SNS_UNASSIGNED.note}.</p>
      </div>
      <div className="space-y-4">
        <label className="block text-sm font-semibold">Choose a country
          <select className="mt-1 w-full min-h-11 rounded-xl border border-ea-line bg-ea-cream px-3 font-normal" value={selected ?? ""} onChange={(e) => setSelected(e.target.value || null)}>
            <option value="">Select one of 54 countries…</option>
            {[...SNS_COUNTRIES].sort((a, b) => a.name.localeCompare(b.name)).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </label>
        <div className="rounded-2xl border border-ea-line bg-ea-cream p-5" aria-live="polite">
          {country && region ? (
            <>
              <h3 className="text-2xl">{country.name}</h3>
              <span className="mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold text-ea-cream" style={{ background: region.color }}>{region.name}</span>
              <p className="mt-3 text-sm leading-relaxed">Regional target US${REGION_TARGET_USD.toLocaleString("en")} · one approved school for {region.name} · EduTourism 2027 visit Oct–Nov 2027 · ceremony date and host city TBA</p>
              <p className="mt-2 text-sm">Regional desk: <a className="font-semibold text-ea-green underline" href={`mailto:${region.desk}`}>{region.desk}</a></p>
              <div className="mt-4 flex flex-wrap gap-2">
                <a className={pillPrimary} href={SNS_CTAS.nominate.href}>Nominate</a>
                <button type="button" className={pillOutline} title={VOTING_PENDING_LABEL} onClick={() => goAnchor("vote")}>Vote</button>
                <button type="button" className={pillOutline} onClick={() => goDonate(region.key)}>Donate</button>
                <button type="button" className={pillOutline} onClick={() => goSponsor("sponsor", region.key)}>Sponsor</button>
                <button type="button" className={pillOutline} onClick={() => goAnchor("edutourism")}>Attend</button>
              </div>
            </>
          ) : <p className="text-sm text-ea-muted">Select a country on the map or from the list to see its region, target and regional desk.</p>}
        </div>
      </div>
    </div>
  );
}

export function AfricaRegionMap() {
  if (!COUNTRY_MAP_APPROVED) {
    return <p role="note" className="rounded-2xl border border-dashed border-ea-green bg-ea-green/5 p-5 text-sm font-semibold text-ea-green">{SNS_MAP_DRAFT_NOTE}</p>;
  }
  return <ApprovedAfricaRegionMap />;
}
