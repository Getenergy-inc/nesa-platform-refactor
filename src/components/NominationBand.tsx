import { OFFICIAL_NOMINATION_FORM_URL } from "@/config/nomination/officialGoogleForm";
import Section from "@/components/Section";

/** Call-to-action band linking to the official Google nomination form. */
const NominationBand = () => (
  <Section tone="charcoal" className="border-y border-gold/30 text-center">
    <h2 className="font-display text-3xl md:text-4xl text-gold">Nominate for NESA-Africa 2026</h2>
    <p className="mt-3 text-ivory/80">Nominations are open 9 November 2026 – 31 March 2027.</p>
    <a
      href={OFFICIAL_NOMINATION_FORM_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-6 inline-flex rounded-md bg-gold px-6 py-3 font-semibold text-charcoal transition-colors duration-200 hover:bg-gold-light motion-reduce:transition-none"
    >
      Nominate Now
    </a>
  </Section>
);

export default NominationBand;
