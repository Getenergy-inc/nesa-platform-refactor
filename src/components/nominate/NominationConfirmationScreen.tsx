import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Users, Plus, BookOpen, Handshake } from "lucide-react";
import { IntegrityNotice } from "./IntegrityNotice";

export function NominationConfirmationScreen({
  count,
  onNominateAnother,
}: {
  count: number;
  onNominateAnother: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gold/40 bg-gradient-to-br from-gold/15 to-charcoal p-6 md:p-8 text-center space-y-4">
        <div className="mx-auto h-14 w-14 rounded-full bg-gold/20 border border-gold/40 grid place-items-center">
          <CheckCircle2 className="h-7 w-7 text-gold" />
        </div>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-white">
          Nomination Submitted Successfully
        </h2>
        <p className="text-sm md:text-base text-white/75 max-w-2xl mx-auto leading-relaxed">
          Thank you for nominating {count} education {count === 1 ? "changemaker" : "changemakers"}{" "}
          for NESA-Africa. Your nomination will go through a structured review process —
          completeness, category fit, evidence review, verification, shortlisting, and
          governance/integrity review.
        </p>
        <p className="text-xs text-white/55 max-w-xl mx-auto">
          Not all nominations become published nominees. Not all nominees become finalists. Not
          all finalists become winners.
        </p>
      </div>

      <IntegrityNotice />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Button
          asChild
          className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full gap-2 shadow-gold"
        >
          <Link to="/nominees">
            <Users className="h-4 w-4" /> Explore Nominees
          </Link>
        </Button>
        <Button
          onClick={onNominateAnother}
          variant="outline"
          className="rounded-full border-gold/40 text-gold hover:bg-gold/10 hover:text-gold gap-2"
        >
          <Plus className="h-4 w-4" /> Nominate Another
        </Button>
        <Button
          asChild
          variant="outline"
          className="rounded-full border-white/20 text-white hover:bg-white/10 gap-2"
        >
          <Link to="/nominate/guidelines">
            <BookOpen className="h-4 w-4" /> Read Guidelines
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="rounded-full border-white/20 text-white hover:bg-white/10 gap-2"
        >
          <Link to="/sponsor">
            <Handshake className="h-4 w-4" /> Become a Sponsor
          </Link>
        </Button>
      </div>
    </div>
  );
}
