// Tier-specific nominee showcase used on each dedicated tier page.
// Presentation only: maps existing published records to tiers by category; never alters eligibility.
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ICON_NOMINEES } from "@/data/iconAward";
import { useNominees } from "@/hooks/useNominees";
import { getInitials } from "@/components/influencer-impact/InitialsAvatar";

export type TierNumber = 1 | 2 | 3 | 4;

/** DB category slugs → tier (presentation only). */
export const TIER_DB_CATEGORIES: Record<2 | 3 | 4, string[]> = {
  2: ["africa-social-media-influencer-education", "africa-music-influencer-education", "africa-sports-influencer-education"],
  3: ["international-bilateral-education", "political-leaders-education-nigeria", "islamic-education-impact-africa", "christian-education-impact-africa", "diaspora-education-impact", "best-research-development-nigeria", "best-tertiary-institution-library"],
  4: ["best-csr-education-africa", "best-csr-education-nigeria", "best-ngo-education-africa", "best-ngo-education-nigeria", "best-edutech-organisation-africa", "best-stem-education-africa", "creative-arts-education-nigeria", "best-media-educational-advocacy-nigeria", "best-education-policy-state-nigeria"],
};

export const TIER_HREF: Record<TierNumber, string> = {
  1: "/awards/africa-education-icon",
  2: "/awards/influencer-education-impact",
  3: "/awards/platinum-recognition",
  4: "/awards/gold-blue-garnet",
};

export type TierPerson = { id: string; name: string; photo: string | null; href: string; group: string | null; country: string | null };

const realPhoto = (u?: string | null) => (u && u.startsWith("http") && !/placeholder/i.test(u) ? u : null);

/** All published nominees for one tier, photos first. */
export function useTierNominees(tier: TierNumber): { loading: boolean; people: TierPerson[] } {
  const { data: live = [], isLoading } = useNominees();
  const people = useMemo(() => {
    let list: TierPerson[];
    if (tier === 1) {
      list = ICON_NOMINEES.map((n) => ({
        id: n.id, name: n.name, photo: realPhoto(n.image_url) ?? (n.image_url?.startsWith("/") ? n.image_url : null),
        href: `/nominees/africa-education-icon-award/${n.award_subcategory_slug}/${n.classification_slug}/${n.slug}`,
        group: n.award_subcategory_slug.replace(/-/g, " "), country: n.country,
      }));
    } else {
      const set = new Set(TIER_DB_CATEGORIES[tier]);
      list = live.filter((n) => n.categorySlug && set.has(n.categorySlug)).map((n) => ({
        id: n.id, name: n.name, photo: realPhoto(n.photoUrl), href: `/nominees/${n.slug}`,
        group: n.categoryName ?? null, country: n.country ?? null,
      }));
    }
    return [...list.filter((p) => p.photo), ...list.filter((p) => !p.photo)];
  }, [tier, live]);
  return { loading: tier !== 1 && isLoading, people };
}

export function TierAvatar({ person, size = "h-16 w-16" }: { person: TierPerson; size?: string }) {
  const [broken, setBroken] = useState(false);
  return person.photo && !broken ? (
    <img src={person.photo} alt={person.name} loading="lazy" decoding="async" onError={() => setBroken(true)} className={`${size} shrink-0 rounded-full border border-gold/30 bg-white object-cover`} />
  ) : (
    <span role="img" aria-label={person.name} className={`${size} flex shrink-0 items-center justify-center rounded-full border border-gold/30 bg-white/5 text-sm font-semibold text-gold`}>{getInitials(person.name)}</span>
  );
}

const PAGE = 48;

/** Full tier-specific nominee list with search; honest empty state. */
export function TierNomineeDirectory({ tier, title }: { tier: TierNumber; title: string }) {
  const { t } = useTranslation("pages");
  const { loading, people } = useTierNominees(tier);
  const [q, setQ] = useState("");
  const [shown, setShown] = useState(PAGE);
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? people.filter((p) => `${p.name} ${p.group ?? ""} ${p.country ?? ""}`.toLowerCase().includes(s)) : people;
  }, [people, q]);

  return (
    <section id="tier-nominees" aria-labelledby={`tier-${tier}-nominees`} className="bg-charcoal py-14">
      <div className="container mx-auto max-w-6xl px-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gold">{t("tierPage.eyebrow", "Tier")} {tier}</p>
        <h2 id={`tier-${tier}-nominees`} className="mt-1 font-serif text-2xl text-white md:text-3xl">{title}</h2>
        {!loading && people.length > 0 && (
          <p className="mt-2 text-sm text-white/70">{people.length} {t("tierPage.published", "published nominees in this tier")}</p>
        )}
        {loading ? (
          <p className="mt-6 text-sm text-white/60">{t("tierPage.loading", "Loading nominees…")}</p>
        ) : people.length === 0 ? (
          <p className="mt-6 text-sm text-white/70">{t("tierPage.empty", "Published nominee profiles for this tier will appear here.")}</p>
        ) : (
          <>
            <label className="mt-6 block max-w-md">
              <span className="sr-only">{t("tierPage.search", "Search nominees")}</span>
              <input type="search" value={q} onChange={(e) => { setQ(e.target.value); setShown(PAGE); }} placeholder={t("tierPage.search", "Search nominees")}
                className="w-full rounded-full border border-gold/30 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-gold" />
            </label>
            <ul className="mt-6 grid list-none grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {filtered.slice(0, shown).map((p) => (
                <li key={p.id} className="min-w-0">
                  <Link to={p.href} className="flex h-full flex-col items-center gap-2 rounded-xl border border-gold/15 bg-white/[0.03] p-3 text-center hover:border-gold/50">
                    <TierAvatar person={p} />
                    <span className="line-clamp-2 text-xs font-semibold text-white">{p.name}</span>
                    {p.group && <span className="line-clamp-2 text-[10px] capitalize text-white/60">{p.group}</span>}
                  </Link>
                </li>
              ))}
            </ul>
            {filtered.length === 0 && <p className="mt-4 text-sm text-white/60">{t("tierPage.noMatch", "No nominees match your search.")}</p>}
            {shown < filtered.length && (
              <button type="button" onClick={() => setShown((s) => s + PAGE)} className="mt-6 rounded-full border border-gold/40 px-5 py-2 text-sm font-semibold text-gold hover:bg-gold/10">
                {t("tierPage.more", "Show more")} ({filtered.length - shown})
              </button>
            )}
          </>
        )}
        <Link to="/impact/special-needs-schools" className="mt-10 block rounded-xl border border-gold/25 bg-gold/5 p-4 text-sm text-white/85 hover:border-gold/60">
          {t("tierPage.school", "After the awards: Support a Special-Needs School Across Africa through EduAid-Africa →")}
        </Link>
      </div>
    </section>
  );
}
