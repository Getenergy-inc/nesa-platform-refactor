import { Award, Building2, ExternalLink, Globe2, Handshake, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { NESAStamp } from "./NESALogo";
import { trackEvent } from "@/lib/analytics";

// Import endorsement logos
import faweKenya from "@/assets/endorsements/fawe-kenya.jpeg";
import csacefa from "@/assets/endorsements/csacefa.jpeg";

// CMS-ready endorsement data structure
export interface Endorsement {
  id: string;
  name: string;
  logo: string;
  type: "organization" | "institution" | "government" | "ngo";
  country?: string;
  website?: string;
  endorsementDate?: string;
  isActive: boolean;
}

// Verified endorsements only — no placeholder filler
const endorsements: Endorsement[] = [
  {
    id: "fawe-kenya",
    name: "Forum for African Women Educationalists - Kenya Chapter",
    logo: faweKenya,
    type: "ngo",
    country: "Kenya",
    isActive: true,
  },
  {
    id: "csacefa",
    name: "Civil Society Action Coalition on Education for All",
    logo: csacefa,
    type: "ngo",
    country: "Nigeria",
    isActive: true,
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export function EndorsedBySection() {
  const { t } = useTranslation("pages");
  const activeEndorsements = endorsements.filter((e) => e.isActive);

  const handlePartnerClick = () => {
    trackEvent("endorsed_by_cta_click", {
      section: "endorsed_by",
      cta_label: "View All Partners",
      destination: "/partners",
      page: typeof window !== "undefined" ? window.location.pathname : "",
    });
  };

  const handleEndorseClick = () => {
    trackEvent("endorsed_by_cta_click", {
      section: "endorsed_by",
      cta_label: "Become an Endorser",
      destination: "/get-involved/endorse-nesa-africa",
      page: typeof window !== "undefined" ? window.location.pathname : "",
    });
  };

  return (
    <section className="bg-gradient-to-b from-charcoal via-charcoal-light/50 to-charcoal py-16 md:py-24 overflow-hidden">
      <div className="container">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 mb-6">
            <Award className="h-4 w-4 text-gold" />
            <span className="text-sm font-medium text-gold">Endorsed by</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Trusted Relationships Built Through Verification
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            NESA-Africa welcomes documented endorsements and institutional relationships with organisations committed to credible education recognition and impact. Only confirmed and authorised relationships are displayed.
          </p>
        </motion.div>

        {/* Endorsements Grid — verified logos only, no placeholders */}
        <motion.div
          className="relative max-w-3xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="absolute inset-0 border border-gold/20 rounded-2xl -m-4 pointer-events-none" />
          <div className="absolute inset-0 border border-gold/10 rounded-3xl -m-8 pointer-events-none" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {activeEndorsements.map((endorsement) => (
              <motion.div
                key={endorsement.id}
                variants={itemVariants}
                className="group relative bg-white/5 backdrop-blur-sm border border-gold/20 rounded-xl p-6 flex flex-col items-center justify-center aspect-square hover:bg-white/10 hover:border-gold/40 transition-all duration-300"
              >
                <div className="relative w-full h-full flex items-center justify-center p-2">
                  <img
                    src={endorsement.logo}
                    alt={endorsement.name}
                    className="max-h-full max-w-full object-contain rounded-lg"
                  />
                </div>
                <div className="absolute inset-0 bg-charcoal/90 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-3 text-center">
                  <span className="text-gold font-semibold text-xs leading-tight mb-1">
                    {endorsement.name}
                  </span>
                  {endorsement.country && (
                    <span className="text-white/60 text-[10px] flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      {endorsement.country}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Governance note */}
        <motion.div
          className="mt-8 flex items-center justify-center gap-2 text-white/40 text-xs"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <Shield className="h-3 w-3" />
          <span>All endorsements are verified and published under NESA-Africa governance standards</span>
        </motion.div>

        {/* CTAs */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              asChild
              variant="outline"
              className="border-gold/40 text-gold hover:bg-gold/10 gap-2"
            >
              <Link to="/partners" onClick={handlePartnerClick}>
                <NESAStamp size="xs" />
                View Partners and Endorsers
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              className="bg-gold text-charcoal hover:bg-gold-light gap-2"
            >
              <Link to="/get-involved/endorse-nesa-africa" onClick={handleEndorseClick}>
                Become an Endorser
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="text-white/80 hover:text-gold"
            >
              <Link to="/get-involved/endorse-nesa-africa#institutional" onClick={handleEndorseClick}>
                Express Institutional Interest
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default EndorsedBySection;
