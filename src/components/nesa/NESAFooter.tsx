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

const socialLinks = [
  { icon: Twitter, href: "https://twitter.com/nesaafrica", label: "Twitter" },
  { icon: Instagram, href: "https://instagram.com/nesaafrica", label: "Instagram" },
  { icon: Linkedin, href: "https://linkedin.com/company/nesa-africa", label: "LinkedIn" },
  { icon: Youtube, href: "https://www.youtube.com/@Nesa.africaTV", label: "YouTube" },
];

interface FooterSection {
  title: string;
  links: { label: string; href: string }[];
}

const SECTIONS: FooterSection[] = [
  {
    title: "Awards",
    links: [
      { label: "Africa Education Icon", href: "/awards/icon" },
      { label: "Blue Garnet Awards", href: "/awards/blue-garnet" },
      { label: "Platinum Recognition", href: "/awards/platinum" },
      { label: "Influencer Impact", href: "/awards/influencers" },
      { label: "All Categories", href: "/categories" },
    ],
  },
  {
    title: "Programs",
    links: [
      { label: "EduAid-Africa", href: "/eduaid" },
      { label: "Rebuild My School Africa", href: "/eduaid-africa/rebuild-my-school" },
      { label: "Scholarships", href: "/programs/scholarships" },
      { label: "Special Needs Education", href: "/programs/special-needs" },
      { label: "Afri-EduTourism", href: "/programs/edu-tourism" },
    ],
  },
  {
    title: "Get Involved",
    links: [
      { label: "Nominate 2026", href: "/nominate" },
      { label: "Learn About the AGC Voting Coin", href: "/earn-agc" },
      { label: "Become a Volunteer", href: "/volunteer" },
      { label: "Become a Judge", href: "/judges" },
      { label: "Become a Sponsor", href: "/sponsorship-packages" },
      { label: "Join a Local Chapter", href: "/join-local-chapter" },
      { label: "Buy Merchandise", href: "/shop" },
    ],
  },
];

export function NESAFooter() {
  const { t } = useTranslation("pages");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal border-t border-gold/20 pb-24 md:pb-8">
      {/* Site-wide "Explore Nominees" band */}
      <div className="border-b border-gold/15 bg-gradient-to-r from-gold/[0.04] via-gold/[0.08] to-gold/[0.04]">
        <div className="container mx-auto px-4 py-6 md:py-7 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">
          <div className="flex-1">
            <p className="text-[11px] uppercase tracking-[0.18em] text-gold/80 font-semibold">
              Africa&rsquo;s Education Hall of Fame
            </p>
            <h3 className="font-display text-lg md:text-xl text-ivory mt-1">
              Discover the heroes transforming Africa&rsquo;s classrooms
            </h3>
          </div>
          <Link
            to="/nominees"
            className="inline-flex items-center gap-2 rounded-full bg-gold px-5 h-11 text-sm font-semibold text-charcoal hover:bg-gold-dark hover:-translate-y-0.5 transition-all shadow-[0_6px_20px_-8px_hsl(var(--gold)/0.75)]"
          >
            <Sparkles className="h-4 w-4" />
            Explore Existing Nominees
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-10 md:pt-14">

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5 md:gap-10 mb-8">
          {/* Column 1 — Brand / Mission */}
          <div className="lg:col-span-1 text-center md:text-left">
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
                  "The African Blue-Garnet Awards for Education"
                </span>
              </div>
            </div>
            <p className="text-white/65 text-xs md:text-sm leading-relaxed mb-4">
              A continental education recognition and impact platform celebrating
              Africa's education changemakers through visibility, partnerships,
              and measurable social impact.
            </p>
            <div className="flex gap-2 justify-center md:justify-start">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center text-white/60 hover:text-gold hover:bg-gold/10 transition-all border border-white/10 hover:border-gold/30"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Columns 2-4 — accordion on mobile, columns on desktop */}
          {SECTIONS.map((section) => (
            <div key={section.title}>
              <details className="md:hidden border-t border-gold/10 group">
                <summary className="flex items-center justify-between py-4 cursor-pointer list-none text-white font-semibold">
                  {section.title}
                  <ChevronDown className="h-4 w-4 text-gold transition-transform group-open:rotate-180" />
                </summary>
                <nav className="flex flex-col gap-2.5 pb-4 text-left">
                  {section.links.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className="text-white/65 hover:text-gold transition-colors text-sm py-1"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </details>
              <div className="hidden md:block">
                <h4 className="text-white font-semibold mb-4 text-sm tracking-wide">
                  {section.title}
                </h4>
                <nav className="flex flex-col gap-2.5 text-sm">
                  {section.links.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className="text-white/60 hover:text-gold transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          ))}

          {/* Column 5 — Contact / Sophia */}
          <div>
            <details className="md:hidden border-t border-y border-gold/10 group">
              <summary className="flex items-center justify-between py-4 cursor-pointer list-none text-white font-semibold">
                Contact
                <ChevronDown className="h-4 w-4 text-gold transition-transform group-open:rotate-180" />
              </summary>
              <div className="pb-4 flex flex-col gap-3 text-left">
                <a
                  href="mailto:info@nesa.africa"
                  className="inline-flex items-center gap-2 text-white/70 hover:text-gold transition-colors text-sm"
                >
                  <Mail className="h-4 w-4" /> info@nesa.africa
                </a>
                <a
                  href="https://wa.me/2347077456855"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-white/70 hover:text-gold transition-colors text-sm"
                >
                  <MessageCircle className="h-4 w-4" /> +234 707 745 6855
                </a>
                <Link
                  to="/help"
                  className="inline-flex items-center gap-2 text-white/70 hover:text-gold transition-colors text-sm"
                >
                  <Sparkles className="h-4 w-4" /> Chat with Sophia AI
                </Link>
              </div>
            </details>
            <div className="hidden md:block">
              <h4 className="text-white font-semibold mb-4 text-sm tracking-wide">
                Contact
              </h4>
              <div className="flex flex-col gap-2.5 text-sm">
                <a
                  href="mailto:info@nesa.africa"
                  className="inline-flex items-center gap-2 text-white/65 hover:text-gold transition-colors"
                >
                  <Mail className="h-4 w-4" /> info@nesa.africa
                </a>
                <a
                  href="https://wa.me/2347077456855"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-white/65 hover:text-gold transition-colors"
                >
                  <MessageCircle className="h-4 w-4" /> +234 707 745 6855
                </a>
                <Link
                  to="/help"
                  className="inline-flex items-center gap-2 text-white/65 hover:text-gold transition-colors"
                >
                  <Sparkles className="h-4 w-4" /> Chat with Sophia AI
                </Link>
              </div>
              <div className="mt-4">
                <div className="inline-flex px-3 py-1.5 rounded-full bg-white/5 text-xs border border-white/10">
                  <span className="text-gold font-semibold">SCEF</span>
                  <span className="text-white/50 ml-2">Foundation</span>
                </div>
              </div>
            </div>
          </div>
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
