import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Sparkles, ArrowLeft } from "lucide-react";
import { NESAHeader } from "@/components/nesa/NESAHeader";
import { NESAFooter } from "@/components/nesa/NESAFooter";
import { InfluencerHallOfFameSection } from "@/components/awards/InfluencerHallOfFameSection";
import { Button } from "@/components/ui/button";

export default function InfluencerNomineesDirectoryPage() {
  return (
    <>
      <Helmet>
        <title>Influencer Education Impact Directory · NESA-Africa 2026</title>
        <meta
          name="description"
          content="Explore nominated Education Enablers across Social Media, Sports, and Music throughout Africa and the African Diaspora."
        />
      </Helmet>

      <NESAHeader />

      {/* Page header */}
      <section className="relative overflow-hidden border-b border-gold/15 bg-gradient-to-b from-charcoal via-black to-charcoal pt-24 pb-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,hsl(var(--gold)/0.10),transparent_70%)]" />
        <div className="container relative z-10 mx-auto max-w-5xl px-4 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
            <Sparkles className="h-3 w-3" /> Existing Nominees
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold text-white md:text-5xl">
            Influencer Education Impact{" "}
            <span className="text-gold">Directory</span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-white/70 md:text-base">
            Explore nominated Education Enablers across Social Media, Sports, and
            Music throughout Africa and the African Diaspora.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="bg-gold font-semibold text-charcoal hover:bg-gold/90"
            >
              <Link to="/awards/influencer-education-impact#influencer-nomination-form">
                Nominate an Education Enabler
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-gold/40 text-gold hover:bg-gold/10"
            >
              <Link to="/awards/influencer-education-impact">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Award Page
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="border-b border-gold/15 bg-gold/5 py-3">
        <div className="container mx-auto max-w-5xl px-4 text-center text-xs text-charcoal/80 md:text-sm">
          <strong>There is no public voting for the Influencer Education Impact Award.</strong>{" "}
          Recognition is based on verified impact and governance approval.
        </div>
      </div>

      <InfluencerHallOfFameSection />

      <NESAFooter />
    </>
  );
}
