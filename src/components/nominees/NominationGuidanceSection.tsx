// ============================================================================
// NominationGuidanceSection — 9-step guided nomination journey.
// Referenced from Africa's Education Impact Directory (Section 5 of spec).
// ============================================================================
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

const STEPS = [
  { n: 1, title: "Select Award Tier", body: "Icon, Gold-Blue Garnet, Platinum or Influencer Education Impact." },
  { n: 2, title: "Select Award Category", body: "Choose from the 18 official NESA-Africa 2026 award categories." },
  { n: 3, title: "Select Subcategory", body: "Pick the most accurate subcategory family for the nominee." },
  { n: 4, title: "Read Eligibility & Evidence", body: "Confirm the nominee meets criteria and you can provide evidence." },
  { n: 5, title: "Complete Nomination Form", body: "Fill the subcategory-specific form. No account required to start." },
  { n: 6, title: "Add Nominator Details", body: "Sign in or sign up at submission with name, email, country and role." },
  { n: 7, title: "Nominee Verification", body: "NESA-Africa team validates evidence and contacts the nominee." },
  { n: 8, title: "Public Voting (where applicable)", body: "Gold-Blue Garnet enters the public + jury voting window." },
  { n: 9, title: "Recognition & Legacy", body: "Recognition is the beginning of measurable education impact." },
];

export function NominationGuidanceSection() {
  return (
    <div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        {STEPS.map((s) => (
          <div
            key={s.n}
            className="rounded-xl border border-gold/20 bg-charcoal-light/30 p-4 hover:border-gold/45 transition-all"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center text-gold text-sm font-bold">
                {s.n}
              </div>
              <h3 className="font-playfair text-base text-ivory">{s.title}</h3>
            </div>
            <p className="text-xs text-ivory/65 leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-3">
        <Button asChild size="lg" className="bg-gold hover:bg-gold/90 text-charcoal rounded-full font-semibold">
          <Link to="/nominate" onClick={() => trackEvent("directory_guidance_cta", { cta: "start_nomination" })}>
            <Sparkles className="h-4 w-4 mr-2" /> Start a Nomination
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="border-gold/40 text-ivory hover:bg-gold/10 rounded-full">
          <Link to="/about/governance" onClick={() => trackEvent("directory_guidance_cta", { cta: "governance" })}>
            Read Governance & Integrity <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default NominationGuidanceSection;
