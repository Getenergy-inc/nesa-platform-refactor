// Visitor Pathway — "Who Are You Nominating?"
// Placed early on the landing page so visitors self-select before scanning all award cards.
// Uses the existing charcoal + gold card tokens — no new design.
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Building2, Globe2, Megaphone, ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

const pathways = [
  {
    icon: User,
    title: "An Individual Education Enabler",
    body:
      "For philanthropists, authors, curriculum advocates, technical-education leaders, political leaders, researchers and lifetime education contributors.",
    cta: "Explore Individual Recognition",
    href: "/awards/africa-education-icon",
    tag: "Individual",
  },
  {
    icon: Building2,
    title: "An Organisation, Institution or Programme",
    body:
      "For companies, NGOs, libraries, universities, research institutions, faith-based organisations, government bodies and international partners.",
    cta: "Explore Institutional Recognition",
    href: "/awards/platinum-recognition",
    tag: "Institutional",
  },
  {
    icon: Globe2,
    title: "A Diaspora African or Friend of Africa",
    body:
      "For individuals, associations, foundations and partners supporting African education through funding, mentorship, knowledge transfer, advocacy and community investment.",
    cta: "Explore Diaspora Recognition",
    href: "/awards/platinum-recognition/diaspora",
    tag: "Diaspora & Friends",
  },
  {
    icon: Megaphone,
    title: "A Social-Media, Sports or Music Influencer",
    body:
      "For public figures whose verified education contributions support scholarships, schools, literacy, mentorship, advocacy and youth development.",
    cta: "Explore Influencer Recognition",
    href: "/awards/influencers-education-impact",
    tag: "Influencer",
  },
];

export function VisitorPathwaySection() {
  const onClick = (href: string, label: string) =>
    trackEvent("visitor_pathway_click", { link_destination: href, link_name: label });

  return (
    <section
      id="visitor-subcategory"
      aria-labelledby="visitor-subcategory-heading"
      className="relative overflow-hidden bg-charcoal py-14 md:py-20"
    >
      <div className="container relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold/85">
            Find the Right Recognition Route
          </p>
          <h2
            id="visitor-subcategory-heading"
            className="mt-3 font-display text-2xl font-bold text-ivory sm:text-3xl md:text-4xl"
          >
            Who Are You Nominating?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-ivory/75 sm:text-base">
            Choose the profile that best describes the nominee. We will guide you to the correct recognition tier, category and nomination form.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {pathways.map(({ icon: Icon, title, body, cta, href, tag }, i) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: 0.05 * i }}
              className="group flex h-full flex-col rounded-2xl border border-gold/20 bg-gradient-to-br from-charcoal-light/70 via-charcoal/80 to-black p-6 transition-all hover:border-gold/50 hover:shadow-[0_18px_50px_-20px_rgba(201,162,39,0.4)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gold to-amber-500 text-charcoal shadow-lg">
                <Icon className="h-6 w-6" />
              </div>
              <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-gold/80">{tag}</p>
              <h3 className="mt-1 font-display text-lg font-bold text-ivory sm:text-xl">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ivory/70">{body}</p>
              <div className="mt-auto pt-6">
                <Link
                  to={href}
                  onClick={() => onClick(href, cta)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-transparent px-3.5 py-2 text-sm font-semibold text-gold transition-colors hover:bg-gold/10"
                >
                  {cta}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default VisitorPathwaySection;
