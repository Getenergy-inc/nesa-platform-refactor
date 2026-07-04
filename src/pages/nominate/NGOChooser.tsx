// NGO Nomination Chooser — routes NGO nominators to the correct pathway.
// Two options: Nigeria NGO or Africa Regional NGO.
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, HandHeart, Globe2, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";

const options = [
  {
    icon: Flag,
    title: "Nominate a Nigeria NGO Education Enabler",
    body: "For NGOs registered or operating primarily in Nigeria.",
    cta: "Continue to Nigeria NGO Nomination",
    href: "/nominate?award=ngo-education-nigeria",
    event: "ngo_chooser_nigeria_click",
  },
  {
    icon: Globe2,
    title: "Nominate an Africa Regional NGO Education Enabler",
    body: "For NGOs operating across African regions or outside Nigeria.",
    cta: "Continue to Africa Regional NGO Nomination",
    href: "/nominate?award=ngo-education-africa-regional",
    event: "ngo_chooser_africa_regional_click",
  },
];

export default function NGOChooser() {
  return (
    <section className="min-h-[70vh] bg-charcoal py-16">
      <Helmet>
        <title>NGO Education Enablers — Choose Your Pathway | NESA-Africa 2026</title>
        <meta
          name="description"
          content="Choose whether to nominate a Nigeria NGO or an Africa Regional NGO for the NESA-Africa 2026 NGO Education Enablers Award."
        />
      </Helmet>

      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold">
            <HandHeart className="h-3.5 w-3.5" /> NGO Education Enablers Award
          </div>
          <h1 className="mt-4 font-display text-3xl font-bold text-ivory sm:text-4xl">
            Choose Your NGO Nomination Pathway
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-ivory/75 sm:text-base">
            Recognising the Enablers of Education for All Across Africa. Select the pathway that fits the NGO you&apos;re nominating.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {options.map(({ icon: Icon, title, body, cta, href, event }) => (
            <article
              key={title}
              className="flex h-full flex-col rounded-2xl border border-gold/20 bg-gradient-to-br from-charcoal-light/70 via-charcoal/80 to-black p-6 transition-all hover:border-gold/50 hover:shadow-[0_18px_50px_-20px_rgba(201,162,39,0.4)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gold to-amber-500 text-charcoal shadow-lg">
                <Icon className="h-6 w-6" />
              </div>
              <h2 className="mt-4 font-display text-xl font-bold text-ivory">{title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-ivory/70">{body}</p>
              <div className="mt-auto pt-6">
                <Button
                  asChild
                  className="bg-gold font-bold text-charcoal shadow-md shadow-gold/20 hover:bg-gold/90"
                  onClick={() => trackEvent(event, { link_destination: href })}
                >
                  <Link to={href}>
                    {cta} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </article>
          ))}
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-ivory/60">
          Vote split for this category: 60% Jury / 40% Public AGC Voting Coin.
        </p>
      </div>
    </section>
  );
}
