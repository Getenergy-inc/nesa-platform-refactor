import { Link } from "react-router-dom";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { TRUST_STATEMENT } from "@/config/platformCopy";

export function TrustStripSection() {
  return (
    <section
      className="relative py-10 md:py-12 bg-charcoal border-y border-gold/20"
      aria-labelledby="trust-strip-heading"
    >
      <div className="container">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
          <div className="flex items-center gap-3 shrink-0">
            <div className="h-10 w-10 rounded-full bg-gold/10 border border-gold/40 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-gold" />
            </div>
            <h2
              id="trust-strip-heading"
              className="font-display text-base md:text-lg font-bold text-gold tracking-wide uppercase"
            >
              Integrity Firewall
            </h2>
          </div>
          <p className="text-white/85 text-sm md:text-base leading-relaxed flex-1">
            Independent NRC verification · EDI Matrix evaluation · Icon judging · Governance
            approval. Sponsorship, donations, and endorsements do not influence recognition.
          </p>

          <Link
            to="/about#governance"
            className="inline-flex items-center gap-1 text-gold font-semibold text-sm whitespace-nowrap hover:underline"
          >
            How governance works <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default TrustStripSection;
