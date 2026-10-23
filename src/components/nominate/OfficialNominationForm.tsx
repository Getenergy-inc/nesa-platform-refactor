import type { ReactNode } from "react";
import { useState } from "react";
import { ChevronDown, ExternalLink, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoogleFormDisplay } from "@/components/nominate/GoogleFormDisplay";
import {
  OFFICIAL_NOMINATION_FORM_EMBED_URL,
  OFFICIAL_NOMINATION_FORM_URL,
} from "@/config/nomination/officialGoogleForm";

interface Props {
  /** Award or category the visitor came from — shown so they pick it in the form. */
  awardName?: string;
  subcategory?: string;
  heading?: string;
  /** Existing on-site form, kept available behind a toggle. */
  onSiteForm?: ReactNode;
  id?: string;
}

/** The official Google nomination form, used by every nomination page. */
export function OfficialNominationForm({ awardName, subcategory, heading, onSiteForm, id = "official-nomination-form" }: Props) {
  const [showOnSite, setShowOnSite] = useState(false);
  const hints = [
    awardName ? { label: "Award", value: awardName } : null,
    subcategory ? { label: "Subcategory", value: subcategory } : null,
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  return (
    <div id={id} className="scroll-mt-24 space-y-5">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-3 py-1 text-xs text-gold">
          <FileCheck className="h-3.5 w-3.5" aria-hidden />
          Official nomination form
        </div>
        <h2 className="mt-3 font-playfair text-2xl text-gold sm:text-3xl">
          {heading ?? (awardName ? `Nominate for ${awardName}` : "Nominate an Education Enabler")}
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-foreground/75">
          Complete the official NESA-Africa 2026 nomination form below. Nomination is free and every
          submission is checked by the Nomination Review Committee (NRC).
        </p>
      </div>

      <GoogleFormDisplay
        title="NESA-Africa 2026 Official Nomination Form"
        status="Active"
        formPublicUrl={OFFICIAL_NOMINATION_FORM_URL}
        formEmbedUrl={OFFICIAL_NOMINATION_FORM_EMBED_URL}
        prefillHints={hints}
      />

      <Button asChild variant="outline" className="border-gold/40 text-gold hover:bg-gold/10">
        <a href={OFFICIAL_NOMINATION_FORM_URL} target="_blank" rel="noopener noreferrer">
          <ExternalLink className="mr-2 h-4 w-4" aria-hidden />
          Open the nomination form in a new tab
        </a>
      </Button>

      {onSiteForm && (
        <div className="rounded-xl border border-gold/15">
          <button
            type="button"
            aria-expanded={showOnSite}
            onClick={() => setShowOnSite((v) => !v)}
            className="flex w-full items-center justify-between gap-3 p-4 text-left text-sm font-medium text-foreground/85"
          >
            Prefer to submit on this website instead?
            <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${showOnSite ? "rotate-180" : ""}`} aria-hidden />
          </button>
          {showOnSite && <div className="border-t border-gold/15 p-4 md:p-6">{onSiteForm}</div>}
        </div>
      )}
    </div>
  );
}

/** Puts the official form at the top of an older nomination page. */
export function WithOfficialNominationForm({ children }: { children: ReactNode }) {
  return (
    <>
      <section className="border-b border-gold/15 bg-charcoal py-10 md:py-14">
        <div className="container mx-auto max-w-5xl px-4">
          <OfficialNominationForm />
        </div>
      </section>
      {children}
    </>
  );
}

export default OfficialNominationForm;
