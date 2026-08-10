// NESA-Africa footer — 4-column canonical structure per the 2026 nav refactor.
// Groups: Platform · Participate · Trust & Support · Legal.
// Does NOT duplicate mega-menu contents (no sector or region dumps).

import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Heart,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Mail,
  MessageCircle,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import nesaStamp from "@/assets/nesa-stamp.jpeg";
import { trackNav } from "@/lib/analytics";

const socialLinks = [
  { icon: Twitter, href: "https://twitter.com/nesaafrica", label: "Twitter" },
  { icon: Instagram, href: "https://instagram.com/nesaafrica", label: "Instagram" },
  { icon: Linkedin, href: "https://linkedin.com/company/nesa-africa", label: "LinkedIn" },
  { icon: Youtube, href: "https://www.youtube.com/@Nesa.africaTV", label: "YouTube" },
];

interface FooterSection {
  id: string;
  title: string;
  links: { label: string; href: string }[];
}

const SECTIONS: FooterSection[] = [
  {
    id: "about",
    title: "About",
    links: [
      { label: "About NESA-Africa", href: "/about" },
      { label: "Governance", href: "/governance" },
      { label: "Nominee Research Corps (NRC)", href: "/about/nrc" },
      { label: "SCEF", href: "/about/scef" },
      { label: "Leadership", href: "/about#leadership" },
    ],
  },
  {
    id: "recognition",
    title: "Recognition",
    links: [
      { label: "Africa Education Icon", href: "/awards/africa-education-icon" },
      { label: "Blue Garnet Award", href: "/awards/gold-blue-garnet" },
      { label: "Platinum Award", href: "/awards/platinum" },
      { label: "Influencer Education Impact", href: "/awards/influencer-education-impact" },
      { label: "Africa Education Impact Directory", href: "/nominees" },
    ],
  },
  {
    id: "impact",
    title: "Education Impact",
    links: [
      { label: "Education Social Impact Overview", href: "/impact" },
      { label: "Rebuild My School Africa", href: "/eduaid-africa/rebuild-my-school" },
      { label: "Support a Special-Needs School", href: "/impact/special-needs-schools" },
      { label: "Regional School Interventions", href: "/impact/regional" },
      { label: "Afri-EduTourism 2027", href: "/afri-edutourism" },
      { label: "EduAid-Africa Journal", href: "/journal" },
      { label: "Impact Stories & Media", href: "/impact/stories" },
      { label: "EduAid-Africa (programme infrastructure)", href: "/eduaid-africa" },
    ],
  },
  {
    id: "participate",
    title: "Participate",
    links: [
      { label: "Nominate", href: "/nominate" },
      { label: "Community", href: "/community" },
      { label: "Local Chapters", href: "/chapters" },
      { label: "Volunteer", href: "/volunteer" },
      { label: "Partners & Sponsors", href: "/partners-sponsors" },
    ],
  },
  {
    id: "support",
    title: "Support",
    links: [
      { label: "Resources", href: "/resources" },
      { label: "FAQs", href: "/faqs" },
      { label: "Contact", href: "/contact" },
      { label: "Policies", href: "/policies" },
    ],
  },
];


function trackFooter(section: string, label: string, href: string) {
  trackNav("footer_click", { section, label, href });
}

export function NESAFooter() {
  const { t } = useTranslation("pages");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal border-t border-gold/20 pb-44 lg:pb-8" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Site footer</h2>

      <div className="container mx-auto px-4 pt-10 md:pt-14">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7 md:gap-10 mb-8">
          {/* Brand / Mission — spans 2 cols on desktop */}
          <div className="lg:col-span-2 text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start mb-3">
              <img
                src={nesaStamp}
                alt="NESA-Africa"
                width={44}
                height={44}
                loading="lazy"
                decoding="async"
                className="h-11 w-11 rounded-full object-contain"
              />
              <div className="flex flex-col leading-tight text-left">
                <span className="text-[10px] text-gold/70 font-medium tracking-wider uppercase">
                  New Education Standard Award Africa
                </span>
                <span className="text-base font-display font-bold text-gold">
                  NESA-Africa 2026
                </span>
                <span className="text-[10px] text-white/60 italic">
                  Africa's Education Recognition &amp; Impact Platform
                </span>
              </div>
            </div>
            <p className="text-white/65 text-xs md:text-sm leading-relaxed mb-4 max-w-sm">
              Enablers of Education for All across Africa — by Africans in
              Africa, Diaspora Africans, and Friends of Africa (individuals,
              companies, or organisations)
            </p>
            <div className="flex gap-2 justify-center md:justify-start mb-4">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  onClick={() => trackFooter("social", s.label, s.href)}
                  className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center text-white/60 hover:text-gold hover:bg-gold/10 transition-all border border-white/10 hover:border-gold/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
            <div className="flex flex-col gap-2 text-sm text-white/60 items-center md:items-start">
              <a
                href="mailto:info@nesa.africa"
                className="inline-flex items-center gap-2 hover:text-gold transition-colors"
                onClick={() => trackFooter("contact", "email", "mailto:info@nesa.africa")}
              >
                <Mail className="h-4 w-4" /> info@nesa.africa
              </a>
              <a
                href="https://wa.me/2348056677770"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-gold transition-colors"
                onClick={() => trackFooter("contact", "whatsapp", "wa.me")}
              >
                <MessageCircle className="h-4 w-4" /> +234 805 667 7770
              </a>
              <Link
                to="/help"
                className="inline-flex items-center gap-2 hover:text-gold transition-colors"
                onClick={() => trackFooter("contact", "Sophia AI", "/help")}
              >
                <Sparkles className="h-4 w-4" /> Chat with Sophia AI
              </Link>
            </div>
          </div>

          {/* 4 canonical footer columns */}
          {SECTIONS.map((section) => (
            <div key={section.id}>
              <details className="md:hidden border-t border-gold/10 group">
                <summary
                  className="flex items-center justify-between py-4 cursor-pointer list-none text-white font-semibold"
                  onClick={() => trackFooter(section.id, "toggle", "")}
                >
                  {section.title}
                  <ChevronDown className="h-4 w-4 text-gold transition-transform group-open:rotate-180" />
                </summary>
                <nav aria-label={section.title} className="flex flex-col gap-2.5 pb-4 text-left">
                  {section.links.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => trackFooter(section.id, link.label, link.href)}
                      className="text-white/65 hover:text-gold transition-colors text-sm py-1"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </details>
              <div className="hidden md:block">
                <h3 className="text-white font-semibold mb-4 text-sm tracking-wide">
                  {section.title}
                </h3>
                <nav aria-label={section.title} className="flex flex-col gap-2.5 text-sm">
                  {section.links.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => trackFooter(section.id, link.label, link.href)}
                      className="text-white/60 hover:text-gold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gold/10 pt-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-white/55 text-center">
            <p className="inline-flex items-center gap-1.5">
              {t("footer.madeWith", "Made with")}{" "}
              <Heart className="h-3 w-3 text-red-500" />{" "}
              {t("footer.forEducation", "for African education")}
            </p>
            <p>
              © {currentYear} NESA-Africa. All Rights Reserved. ·{" "}
              <span className="text-white/45">
                An initiative of Santos Creations Educational Foundation (SCEF).
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default NESAFooter;
