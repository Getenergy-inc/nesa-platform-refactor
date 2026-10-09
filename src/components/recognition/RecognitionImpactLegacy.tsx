import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { RECOGNITION_LEGACY_STEPS, PLATFORM_POSITIONING } from "@/config/platformCopy";

/**
 * RecognitionImpactLegacy — the signature 7-step NESA-Africa chain.
 * Reusable across homepage, About, and Awards pages.
 */
export function RecognitionImpactLegacy({
  variant = "horizontal",
  showHeading = true,
}: {
  variant?: "horizontal" | "vertical";
  showHeading?: boolean;
}) {
  return (
    <section
      className="relative py-16 md:py-20 bg-charcoal"
      aria-labelledby="recognition-legacy-heading"
    >
      <div className="container">
        {showHeading && (
          <div className="max-w-3xl mx-auto text-center mb-10">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-semibold tracking-[0.18em] uppercase mb-4">
              Recognition → Impact → Legacy
            </span>
            <h2
              id="recognition-legacy-heading"
              className="font-display text-3xl md:text-4xl font-bold text-white mb-4"
            >
              Recognition is only the beginning.
            </h2>
            <p className="text-white/75 text-base md:text-lg">
              {PLATFORM_POSITIONING.signatureChain}
            </p>
          </div>
        )}

        <ol
          className={
            variant === "vertical"
              ? "flex flex-col gap-3 max-w-2xl mx-auto"
              : "flex flex-wrap items-center justify-center gap-2 md:gap-3 max-w-5xl mx-auto"
          }
        >
          {RECOGNITION_LEGACY_STEPS.map((step, i) => (
            <motion.li
              key={step.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="flex items-center gap-2 md:gap-3"
            >
              <span
                className={`px-3 md:px-4 py-2 rounded-full border text-sm md:text-base font-semibold whitespace-nowrap ${
                  i === RECOGNITION_LEGACY_STEPS.length - 1
                    ? "bg-gold text-charcoal border-gold"
                    : "border-gold/40 bg-charcoal/60 text-ivory"
                }`}
              >
                {step.label}
              </span>
              {i < RECOGNITION_LEGACY_STEPS.length - 1 && (
                <ArrowRight
                  className={
                    variant === "vertical"
                      ? "h-4 w-4 text-gold/60 rotate-90 mx-auto"
                      : "h-4 w-4 text-gold/60 hidden sm:block"
                  }
                />
              )}
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default RecognitionImpactLegacy;
