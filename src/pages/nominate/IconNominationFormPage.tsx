// Dedicated /nominate/africa-education-icon surface.
// Wraps the 9-step Icon wizard in the same page chrome as the other 17
// nomination forms so the deferred-account flow is identical everywhere:
// nominate first → create or confirm account at submission → confirmation
// with reference → track progress.

import { Helmet } from "react-helmet-async";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BadgeCheck, ShieldCheck } from "lucide-react";
import { IconNominationWizard } from "@/components/awards/IconNominationWizard";

export default function IconNominationFormPage() {
  return (
    <div className="min-h-screen bg-charcoal text-foreground">
      <Helmet>
        <title>Africa Education Icon Award — Nominate | NESA-Africa 2026</title>
        <meta
          name="description"
          content="Nominate an enabler of Education for All across Africa for the Africa Education Icon Award. No account is required to begin."
        />
      </Helmet>

      <section className="border-b border-gold/15 bg-gradient-to-b from-black/70 to-charcoal">
        <div className="container mx-auto max-w-5xl px-4 py-10 md:py-16">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="border-gold/40 text-gold">
              <BadgeCheck className="mr-1 h-3 w-3" />
              Africa Education Icon
            </Badge>
            <Badge variant="secondary">Judged tier</Badge>
          </div>
          <h1 className="font-playfair text-3xl md:text-5xl text-gold">
            Nominate for the Africa Education Icon Award
          </h1>
          <p className="mt-4 max-w-3xl text-sm md:text-base text-foreground/75">
            Recognising lifetime enablers of Education for All across Africa. Start your
            nomination now — no account is required to begin.
          </p>
        </div>
      </section>

      <section id="nominate" className="py-12 md:py-16">
        <div className="container mx-auto max-w-4xl px-4">
          <Card className="border-gold/25 bg-[#15181f]">
            <CardContent className="p-5 md:p-8">
              <IconNominationWizard />
            </CardContent>
          </Card>
          <p className="mt-4 flex items-start gap-2 text-xs text-foreground/60">
            <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" aria-hidden />
            Every nomination is verified by the Nominee Research Corps before it reaches the
            jury. Sponsors have no influence over outcomes.
          </p>
        </div>
      </section>
    </div>
  );
}
