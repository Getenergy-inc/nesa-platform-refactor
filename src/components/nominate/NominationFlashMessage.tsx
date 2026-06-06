import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen } from "lucide-react";
import { IntegrityNotice } from "./IntegrityNotice";

export function NominationFlashMessage({ onStart }: { onStart: () => void }) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.2em] text-gold/80 font-semibold">
          Start here
        </p>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-white">
          How NESA-Africa Nominations Work
        </h1>
      </div>

      <div className="space-y-4 text-sm md:text-base text-white/80 leading-relaxed">
        <p>
          NESA-Africa nominations help the public identify education changemakers across Africa,
          the diaspora, and friends of Africa.
        </p>
        <p>
          You can nominate educators, institutions, NGOs, advocates, creators, media voices, CSR
          contributors, policymakers, special needs schools, and other education impact leaders
          depending on the eligible category.
        </p>
        <p>
          You may fill in nominee details first. At the final submission stage, you will be asked
          to provide your name, email address, phone number, country of residence, and country of
          origin before account creation or email verification. This helps NESA-Africa prevent
          fake, duplicate, or unverifiable nominations.
        </p>
        <p>
          Nominations are reviewed based on category fit, evidence, regional relevance, education
          impact, eligibility, verification status, and the award pathway selected. Shortlisted
          nominees may move into screening, public visibility, Nominate &amp; Earn AGC Voting Coin
          participation where applicable, expert judging, sponsor-independent review, and final
          governance approval.
        </p>
      </div>

      <IntegrityNotice />

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button
          size="lg"
          onClick={onStart}
          className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full px-8 gap-2 shadow-gold"
        >
          Start Nomination
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="rounded-full border-gold/40 text-gold hover:bg-gold/10 hover:text-gold gap-2"
        >
          <Link to="/nominate/guidelines">
            <BookOpen className="h-4 w-4" />
            Read Nomination Guidelines
          </Link>
        </Button>
      </div>
    </div>
  );
}
