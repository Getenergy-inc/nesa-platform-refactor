// Shared fallback rendered on canonical Category / Subcategory pages when
// no backing Google form exists yet in `awardCategoryForms`. Keeps the
// "form missing" experience consistent and unambiguous across the spine.

import { Link } from "react-router-dom";
import { Clock, Mail, ArrowRight, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Props {
  /** Display name of the category (or subcategory) shown to the user. */
  contextLabel: string;
  /** Tier short label, e.g. "Gold-Blue Garnet". */
  tierLabel: string;
  /** Fallback nomination intake URL — always required. */
  fallbackNominateHref: string;
  /** Tier landing page URL. */
  tierHref: string;
}

export function MissingFormFallback({
  contextLabel,
  tierLabel,
  fallbackNominateHref,
  tierHref,
}: Props) {
  return (
    <section
      id="nominate"
      aria-labelledby="missing-form-heading"
      className="py-12 md:py-16 bg-charcoal border-y border-gold/20"
    >
      <div className="container mx-auto max-w-3xl px-4">
        <div className="rounded-2xl border border-gold/30 bg-charcoal-light/40 p-6 md:p-8 text-center">
          <Badge
            variant="outline"
            className="border-gold/40 text-gold mb-4 inline-flex items-center gap-1.5"
          >
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            Nominations Opening Soon
          </Badge>

          <h2
            id="missing-form-heading"
            className="font-playfair text-2xl sm:text-3xl text-gold mb-3"
          >
            The dedicated form for {contextLabel} is being finalised
          </h2>

          <p className="text-ivory/75 text-sm sm:text-base max-w-2xl mx-auto mb-6">
            The {tierLabel} secretariat is publishing the official Google Form
            for this category ahead of the 2026 nomination window. In the
            meantime you can submit through the unified nomination intake —
            your entry will be routed to the correct jury once the dedicated
            form goes live.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild className="bg-gold text-charcoal hover:bg-gold/90">
              <Link to={fallbackNominateHref}>
                <ArrowRight className="mr-2 h-4 w-4" aria-hidden="true" />
                Submit via Unified Nomination
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-gold/40 text-gold hover:bg-gold/10"
            >
              <Link to={tierHref}>
                <Bell className="mr-2 h-4 w-4" aria-hidden="true" />
                Back to {tierLabel}
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="text-ivory/70 hover:text-gold"
            >
              <a href="mailto:nominations@nesa.africa?subject=Form%20availability%20enquiry">
                <Mail className="mr-2 h-4 w-4" aria-hidden="true" />
                Notify me when it&apos;s live
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MissingFormFallback;
