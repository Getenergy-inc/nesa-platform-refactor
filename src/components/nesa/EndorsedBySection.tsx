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
            <span className="text-sm font-medium text-gold">
              {t("landing.endorsedBy.trustedBy")}
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            {t("landing.endorsedBy.title")}
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            {t("landing.endorsedBy.description")}
          </p>
        </motion.div>

        {/* Endorsements Grid */}
        <motion.div
          className="relative max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Decorative frame */}
          <div className="absolute inset-0 border border-gold/20 rounded-2xl -m-4 pointer-events-none" />
          <div className="absolute inset-0 border border-gold/10 rounded-3xl -m-8 pointer-events-none" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {activeEndorsements.map((endorsement) => (
              <motion.div
                key={endorsement.id}
                variants={itemVariants}
                className="group relative bg-white/5 backdrop-blur-sm border border-gold/20 rounded-xl p-6 flex flex-col items-center justify-center aspect-square hover:bg-white/10 hover:border-gold/40 transition-all duration-300 hover:scale-105"
              >
                {/* Logo */}
                <div className="relative w-full h-full flex items-center justify-center p-2">
                  <img
                    src={endorsement.logo}
                    alt={endorsement.name}
                    className="max-h-full max-w-full object-contain rounded-lg"
                  />
                </div>

                {/* Hover overlay with name */}
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

            {/* Invitation slot — adds visual balance and drives conversion */}
            <motion.div
              variants={itemVariants}
              className="group relative border border-dashed border-gold/30 rounded-xl p-6 flex flex-col items-center justify-center aspect-square hover:border-gold/60 hover:bg-gold/5 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mb-3 group-hover:bg-gold/20 transition-colors">
                <Handshake className="h-5 w-5 text-gold" />
              </div>
              <span className="text-gold font-semibold text-sm text-center leading-tight">
                Your Organization
              </span>
              <span className="text-white/50 text-xs text-center mt-1">
                Join Africa&apos;s education trust network
              </span>
              <Link
                to="/get-involved/endorse-nesa-africa"
                onClick={handleEndorseClick}
                className="mt-3 text-[11px] text-gold/80 hover:text-gold underline underline-offset-2"
              >
                Apply to endorse
              </Link>
            </motion.div>

            {/* Second invitation slot */}
            <motion.div
              variants={itemVariants}
              className="group relative border border-dashed border-gold/20 rounded-xl p-6 flex flex-col items-center justify-center aspect-square hover:border-gold/50 hover:bg-gold/5 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mb-3 group-hover:bg-gold/20 transition-colors">
                <Globe2 className="h-5 w-5 text-gold" />
              </div>
              <span className="text-gold font-semibold text-sm text-center leading-tight">
                Institutional Partner
              </span>
              <span className="text-white/50 text-xs text-center mt-1">
                Governments, INGOs, universities
              </span>
              <Link
                to="/get-involved/endorse-nesa-africa"
                onClick={handleEndorseClick}
                className="mt-3 text-[11px] text-gold/80 hover:text-gold underline underline-offset-2"
              >
                Express interest
              </Link>
            </motion.div>
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

        {/* Stats & CTA */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <div className="inline-flex items-center gap-6 mb-8">
            <div className="text-center">
              <div className="text-3xl font-display font-bold text-gold">
                {activeEndorsements.length}+
              </div>
              <div className="text-white/60 text-sm">
                {t("landing.endorsedBy.stats.organizations")}
              </div>
            </div>
            <div className="h-8 w-px bg-gold/20" />
            <div className="text-center">
              <div className="text-3xl font-display font-bold text-gold">15+</div>
              <div className="text-white/60 text-sm">
                {t("landing.endorsedBy.stats.countries")}
              </div>
            </div>
            <div className="h-8 w-px bg-gold/20" />
            <div className="text-center">
              <div className="text-3xl font-display font-bold text-gold">1M+</div>
              <div className="text-white/60 text-sm">
                {t("landing.endorsedBy.stats.reach")}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              variant="outline"
              className="border-gold/40 text-gold hover:bg-gold/10 gap-2"
            >
              <Link to="/partners" onClick={handlePartnerClick}>
                <NESAStamp size="xs" />
                {t("landing.endorsedBy.viewAllPartners")}
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              className="bg-gold text-charcoal hover:bg-gold-light gap-2"
            >
              <Link to="/get-involved/endorse-nesa-africa" onClick={handleEndorseClick}>
                {t("landing.endorsedBy.becomeEndorser")}
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default EndorsedBySection;
