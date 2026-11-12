// NESA-Africa 2026 footer — Programme · About · Media · Get Involved · Legal.
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import nesaStamp from "@/assets/nesa-stamp.jpeg";
import { trackNav } from "@/lib/analytics";
import { FollowLinks } from "@/components/nesa/FollowLinks";
import { SCHOOL_SUPPORT_ACTIONS } from "@/config/schoolSupport";

interface FooterLink {
  label: string;
  href?: string;
  contentRequired?: boolean;
}

interface FooterSection {
  id: string;
  title: string;
  links: FooterLink[];
}

const SECTIONS: FooterSection[] = [
  {
    id: "programme",
    title: "Programme",
    links: [
      { label: "Awards", href: "/awards" },
      { label: "Nominate", href: "/nominate" },
      { label: "2026 Awards Gala", href: "/programme-2026" },
    ],
  },
  {
    id: "about",
    title: "About",
    links: [
      { label: "About", href: "/about" },
      { label: "Governance", href: "/governance" },
      { label: "Impact", href: "/impact" },
    ],
  },
  {
    id: "media",
    title: "Media",
    links: [
      { label: "NESA-Africa TV", href: "/media/tv" },
      { label: "Podcast", href: "/media/podcast" },
      { label: "Webinars", href: "/media/webinars" },
      { label: "e-Journal", href: "/journal" },
    ],
  },
  {
    id: "involved",
    title: "Get Involved",
    links: [
      { label: "Donate", href: "/donate" },
      { label: SCHOOL_SUPPORT_ACTIONS.nominate.shortLabel, href: SCHOOL_SUPPORT_ACTIONS.nominate.href },
      { label: SCHOOL_SUPPORT_ACTIONS.support.shortLabel, href: SCHOOL_SUPPORT_ACTIONS.support.href },
      { label: "Sponsor", href: "/sponsors" },
      { label: "Partner", href: "/partners" },
      { label: "Join the NRC", href: "/nrc/apply" },
      { label: "Receive Programme Updates", contentRequired: true },
      { label: "Volunteer", href: "/volunteer" },
    ],
  },
  {
    id: "legal",
    title: "Legal",
    links: [
      { label: "Privacy", href: "/policies#privacy" },
      { label: "Terms", href: "/policies#terms" },
      { label: "Accessibility", href: "/policies#accessibility" },
      { label: "Safeguarding", href: "/policies#safeguarding" },
      { label: "Complaints", href: "/policies#complaints" },
    ],
  },
];

function trackFooter(section: string, label: string, href: string) {
  trackNav("footer_click", { section, label, href });
}

export function NESAFooter() {
  return (
    <footer className="bg-charcoal border-t border-gold/20 pb-24 lg:pb-8" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Site footer</h2>
      <div className="container mx-auto px-4 pt-10 md:pt-14">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7 md:gap-10 mb-8">
          <div className="lg:col-span-2 text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start mb-3">
              <img src={nesaStamp} alt="NESA-Africa" width={44} height={44} loading="lazy" decoding="async" className="h-11 w-11 rounded-full object-contain" />
              <div className="flex flex-col leading-tight text-left">
                <span className="text-base font-display font-bold text-gold">NESA-Africa 2026</span>
                <span className="text-[10px] text-white/60 italic">The African Blue-Garnet Awards for Education</span>
              </div>
            </div>
            <p className="text-white/65 text-xs md:text-sm leading-relaxed mb-4 max-w-sm">
              Recognising the Enablers of Education for All Across Africa. Hosted by Santos Creations Educational Foundation (SCEF).
            </p>
            <FollowLinks className="justify-center md:justify-start" />
          </div>

          {SECTIONS.map((section) => (
            <div key={section.id}>
              <details className="md:hidden border-t border-gold/10 group">
                <summary className="flex items-center justify-between py-4 cursor-pointer list-none text-white font-semibold" onClick={() => trackFooter(section.id, "toggle", "")}>
                  {section.title}
                  <ChevronDown className="h-4 w-4 text-gold transition-transform group-open:rotate-180" />
                </summary>
                <nav aria-label={section.title} className="flex flex-col gap-2.5 pb-4 text-left">
                  {section.links.map((link) => (
                    <Link key={link.label} to={link.href} onClick={() => trackFooter(section.id, link.label, link.href)} className="text-white/65 hover:text-gold transition-colors text-sm py-1">
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </details>
              <div className="hidden md:block">
                <h3 className="text-white font-semibold mb-4 text-sm tracking-wide">{section.title}</h3>
                <nav aria-label={section.title} className="flex flex-col gap-2.5 text-sm">
                  {section.links.map((link) => (
                    <Link key={link.label} to={link.href} onClick={() => trackFooter(section.id, link.label, link.href)} className="text-white/60 hover:text-gold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded">
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-gold/10 pt-5 text-center text-xs sm:text-sm text-white/55">
          <p>© 2026 Santos Creations Educational Foundation · Evidence Before Recognition · Merit Before Award</p>
        </div>
      </div>
    </footer>
  );
}

export default NESAFooter;
