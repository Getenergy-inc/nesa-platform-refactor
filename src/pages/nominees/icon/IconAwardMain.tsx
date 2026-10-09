import { Helmet } from "react-helmet-async";
import {
  ICON_AWARD,
  ICON_NOMINEES,
  ICON_SUBCATEGORIES,
  ICON_CLASSIFICATIONS,
  bySubcategory,
  byClassification,
} from "@/data/iconAward";
import {
  FinalCTA,
  IconBreadcrumbs,
  IconHero,
  SubcategoryCard,
} from "@/components/iconAward/shared";

const PAGE_URL = "https://nesaafrica.lovable.app/nominees/africa-education-icon-award";

export default function IconAwardMain() {
  const total = ICON_NOMINEES.length;
  return (
    <>
      <Helmet>
        <title>Africa Education Icon Award Nominees | NESA Africa 2006–2026</title>
        <meta
          name="description"
          content={ICON_AWARD.subtitle}
        />
        <link rel="canonical" href={PAGE_URL} />
        <meta property="og:title" content="Africa Education Icon Award Nominees | NESA Africa 2006–2026" />
        <meta property="og:description" content={ICON_AWARD.subtitle} />
        <meta property="og:url" content={PAGE_URL} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://nesaafrica.lovable.app/" },
            { "@type": "ListItem", position: 2, name: "Nominees", item: "https://nesaafrica.lovable.app/nominees" },
            { "@type": "ListItem", position: 3, name: "Africa Education Icon Award", item: PAGE_URL },
          ],
        })}</script>
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        <div className="container mx-auto px-4 pt-6">
          <IconBreadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Nominees", href: "/nominees" },
              { label: "Africa Education Icon Award" },
            ]}
          />
        </div>

        <IconHero
          eyebrow={`Lifetime Achievement · ${ICON_AWARD.yearRange}`}
          title="Africa Education Icon Award — Lifetime Achievement (2006–2026)"
          subtitle={ICON_AWARD.subtitle}
          meta={[
            { label: "Verified Nominees", value: total },
            { label: "Subcategories", value: ICON_SUBCATEGORIES.length },
            { label: "Classifications", value: ICON_CLASSIFICATIONS.length },
            { label: "Final Laureates", value: 9 },
          ]}
          primary={{ label: "Explore the Hall of Fame", href: "#subcategories" }}
          secondary={{
            label: "Nominate an Education Icon",
            href: "/nominate?category=africa-education-icon-award",
          }}
        />

        {/* Classifications strip */}
        <section className="border-y border-gold/10 bg-black/40 py-10">
          <div className="container mx-auto px-4 grid gap-6 sm:grid-cols-3">
            {ICON_CLASSIFICATIONS.map((c) => {
              const count = ICON_SUBCATEGORIES.reduce(
                (n, s) => n + byClassification(s.slug, c.slug).length,
                0,
              );
              return (
                <div key={c.slug} className="rounded-xl border border-gold/15 bg-charcoal-light p-5">
                  <div className="text-3xl font-display font-bold text-gold">{count}</div>
                  <div className="mt-1 font-display text-white">{c.title}</div>
                  <p className="mt-2 text-sm text-white/65">{c.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section id="subcategories" className="bg-charcoal py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mb-10">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-white">
                Three Pathways to Icon Status
              </h2>
              <p className="mt-3 text-white/65">
                Each subcategory honours leaders across three classifications:
                Africans in Africa, Diaspora Africans, and Friends of Africa.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {ICON_SUBCATEGORIES.map((s) => (
                <SubcategoryCard key={s.slug} sub={s} count={bySubcategory(s.slug).length} />
              ))}
            </div>
          </div>
        </section>

        <FinalCTA />
      </div>
    </>
  );
}
