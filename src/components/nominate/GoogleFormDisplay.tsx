import type { ReactNode } from "react";
import { ExternalLink, AlertCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FormStatus } from "@/config/nomination/types";

interface Props {
  title: string;
  status: FormStatus;
  formPublicUrl: string;
  formEmbedUrl: string;
  gmail?: string;
  /** Optional pre-fill hints rendered above the embed for users to copy into the form. */
  prefillHints?: Array<{ label: string; value: string }>;
  /**
   * Optional fallback rendered in place of the "form is being prepared"
   * notice when the Google Form is not yet Active. Use this to embed a
   * native per-category nomination form for "Link Pending" categories.
   */
  fallback?: ReactNode;
}

/**
 * Renders an embedded Google Form with status-aware fallbacks per brief §10.
 * - Active           → iframe embed + Open in New Tab
 * - Link Pending / Draft / Coming Soon → "form being prepared" notice
 * - Closed           → closed notice
 * - Replaced         → handled upstream (redirect)
 */
export function GoogleFormDisplay({
  title,
  status,
  formPublicUrl,
  formEmbedUrl,
  gmail,
  prefillHints,
  fallback,
}: Props) {
  const isActive =
    status === "Active" && Boolean(formEmbedUrl) && Boolean(formPublicUrl);

  if (status === "Closed") {
    return (
      <div className="rounded-2xl border border-gold/30 bg-charcoal-light/40 p-6 text-white/85">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-gold mt-0.5 shrink-0" />
          <div>
            <h3 className="font-display text-xl text-white">
              This nomination form is currently closed.
            </h3>
            <p className="mt-2 text-sm text-white/70">
              For questions, contact{" "}
              <a className="text-gold underline" href="mailto:nesa.africa@gmail.com">
                nesa.africa@gmail.com
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isActive) {
    return (
      <div className="rounded-2xl border border-gold/30 bg-charcoal-light/40 p-6 text-white/85">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-gold mt-0.5 shrink-0" />
          <div>
            <h3 className="font-display text-xl text-white">
              This nomination form is being prepared.
            </h3>
            <p className="mt-2 text-sm text-white/70">
              Please check back soon, or contact{" "}
              <a className="text-gold underline" href="mailto:nesa.africa@gmail.com">
                nesa.africa@gmail.com
              </a>
              {gmail ? (
                <>
                  {" "}
                  for inquiries related to{" "}
                  <span className="font-mono text-white/85">{gmail}</span>
                </>
              ) : null}
              .
            </p>
            <p className="mt-2 text-xs uppercase tracking-[0.18em] text-gold/80">
              Status: {status}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-gold/30 bg-charcoal-light/40 p-4">
        <div className="flex items-start gap-2 text-sm text-white/85">
          <ShieldCheck className="h-4 w-4 text-gold mt-0.5 shrink-0" />
          <span>
            Submit credible, evidence-based information only. All submissions are
            subject to eligibility, evidence and integrity review.
          </span>
        </div>
        <Button
          asChild
          variant="outline"
          className="rounded-full border-gold/40 text-gold hover:bg-gold/10 hover:text-gold gap-2 shrink-0"
        >
          <a href={formPublicUrl} target="_blank" rel="noopener noreferrer">
            Open Form in New Tab
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </div>

      {prefillHints && prefillHints.length > 0 ? (
        <div className="rounded-xl border border-gold/20 bg-charcoal-light/30 p-4 text-sm text-white/80">
          <p className="text-xs uppercase tracking-[0.18em] text-gold/80 font-semibold mb-2">
            Please confirm in the form
          </p>
          <ul className="space-y-1">
            {prefillHints.map((h) => (
              <li key={h.label}>
                <span className="text-white/60">{h.label}:</span>{" "}
                <span className="text-white font-medium">{h.value}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="rounded-2xl overflow-hidden border border-gold/20 bg-white">
        <iframe
          src={formEmbedUrl}
          title={title}
          width="100%"
          height={1600}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="w-full min-h-[1200px] md:min-h-[1600px]"
        >
          Loading…
        </iframe>
      </div>
    </div>
  );
}
