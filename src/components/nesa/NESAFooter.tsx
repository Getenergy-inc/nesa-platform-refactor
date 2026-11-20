// NESA-Africa 2026 footer — Awards · Impact · Organisation · Follow.
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import nesaStamp from "@/assets/nesa-stamp.jpeg";
import scefLogo from "@/assets/school-support/scef-logo.png.asset.json";
import eduAidLogo from "@/assets/school-support/eduaid-africa-logo.webp.asset.json";
import friendsLogo from "@/assets/school-support/friends-of-eduaid-africa-logo.jpg.asset.json";
import { trackNav } from "@/lib/analytics";
import { FollowLinks } from "@/components/nesa/FollowLinks";
import { SOCIAL_PROFILE_URLS } from "@/config/socialLinks";

interface FooterLink { id: string; label: string; href: string }
interface FooterSection { id: string; title: string; links: FooterLink[] }

const SECTIONS: FooterSection[] = [
  { id: "awards", title: "Awards", links: [
    { id: "fourTiers", label: "Four tiers", href: "/awards#architecture" },
    { id: "how", label: "How recognition works", href: "/awards#how" },
    { id: "timeline", label: "Timeline", href: "/awards#timeline" },
    { id: "nominees", label: "Nominees", href: "/nominees" },
    { id: "verify", label: "Verify a certificate", href: "/certificates/verify" },
  ] },
  { id: "impact", title: "Impact", links: [
    { id: "school", label: "Support a Special-Needs School", href: "/impact/special-needs-schools" },
    { id: "scholarships", label: "Scholarships and school fees", href: "/impact/special-needs-schools#donate" },
    { id: "eduaid", label: "EduAid-Africa", href: "https://eduaid.africa" },
    { id: "academy", label: "EduAid-Africa Academy", href: "/get-involved#academy" },
  ] },
  { id: "organisation", title: "Organisation", links: [
    { id: "scef", label: "About SCEF", href: "/about#scef" },
    { id: "governance", label: "Governance", href: "/about#governance" },
    { id: "advisors", label: "Board of Advisors", href: "/about#advisors" },
    { id: "partners", label: "Partners", href: "/about#partners" },
    { id: "chapters", label: "Friends of EduAid-Africa chapters", href: "/get-involved#chapters" },
    { id: "contact", label: "Contact & FAQ", href: "/contact#faq" },
  ] },
  { id: "follow", title: "Follow", links: [
    { id: "tv", label: "NESA AFRICA TV (YouTube)", href: SOCIAL_PROFILE_URLS.youtube },
    { id: "updates", label: "Receive programme updates", href: "/contact?subject=media" },
  ] },
];

const LOGOS = [
  { id: "scef", name: "SCEF", src: scefLogo.url },
  { id: "nesa", name: "NESA-Africa", src: nesaStamp },
  { id: "eduaid", name: "EduAid-Africa", src: eduAidLogo.url },
  { id: "friends", name: "Friends of EduAid-Africa", src: friendsLogo.url },
] as const;

function trackFooter(section: string, label: string, href: string) {
  trackNav("footer_click", { section, label, href });
}

function FooterNavLink({ section, link }: { section: string; link: FooterLink }) {
  const { t } = useTranslation("pages");
  const label = t(`footer.links.${link.id}`, link.label);
  const className = "text-white/60 hover:text-gold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded";
  if (/^https?:\/\//.test(link.href)) {
    return <a href={link.href} target="_blank" rel="noopener noreferrer" onClick={() => trackFooter(section, link.label, link.href)} className={className}>{label}</a>;
  }
  return <Link to={link.href} onClick={() => trackFooter(section, link.label, link.href)} className={className}>{label}</Link>;
}

export function NESAFooter() {
  const { t } = useTranslation("pages");
  return (
    <footer className="bg-charcoal border-t border-gold/20 pb-24 lg:pb-8" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">{t("footer.heading", "Site footer")}</h2>
      <div className="container mx-auto px-4 pt-10 md:pt-14">
        <ul className="mb-10 grid list-none grid-cols-2 items-center gap-3 sm:grid-cols-3 lg:grid-cols-5" aria-label={t("footer.organisations", "SCEF programmes and organisations")}>
          {LOGOS.map((logo) => (
            <li key={logo.id} className="flex h-20 items-center justify-center gap-2 rounded-xl border border-gold/10 bg-white/[0.03] p-3">
              <img src={logo.src} alt={t(`footer.logos.${logo.id}`, logo.name)} width={52} height={52} loading="lazy" decoding="async" className="max-h-12 max-w-full object-contain" />
              {logo.id === "nesa" && <span className="font-display text-sm font-semibold text-gold">{t("footer.logos.nesa", "NESA-Africa")}</span>}
            </li>
          ))}
          <li className="flex h-20 items-center justify-center rounded-xl border border-gold/10 bg-white/[0.03] p-3 text-center font-display text-sm font-semibold text-gold">
            {t("footer.logos.academy", "EduAid-Africa Academy")}
          </li>
        </ul>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 md:gap-10 mb-8">
          {SECTIONS.map((section) => (
            <div key={section.id}>
              <details className="md:hidden border-t border-gold/10 group">
                <summary className="flex items-center justify-between py-4 cursor-pointer list-none text-white font-semibold" onClick={() => trackFooter(section.id, "toggle", "")}>
                  {t(`footer.sections.${section.id}`, section.title)}
                  <ChevronDown className="h-4 w-4 text-gold transition-transform group-open:rotate-180" />
                </summary>
                <nav aria-label={t(`footer.sections.${section.id}`, section.title)} className="flex flex-col gap-2.5 pb-4 text-left">
                  {section.links.map((link) => <FooterNavLink key={link.id} section={section.id} link={link} />)}
                  {section.id === "follow" && <FollowLinks className="mt-2" />}
                </nav>
              </details>
              <div className="hidden md:block">
                <h3 className="text-white font-semibold mb-4 text-sm tracking-wide">{t(`footer.sections.${section.id}`, section.title)}</h3>
                <nav aria-label={t(`footer.sections.${section.id}`, section.title)} className="flex flex-col gap-2.5 text-sm">
                  {section.links.map((link) => <FooterNavLink key={link.id} section={section.id} link={link} />)}
                  {section.id === "follow" && <FollowLinks className="mt-2" />}
                </nav>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-gold/10 pt-5 text-center text-xs sm:text-sm text-white/55">
          <p>{t("footer.bottom", "NESA-Africa is a programme of Santos Creations Educational Foundation (SCEF). © 2026 SCEF.")}</p>
          <nav aria-label={t("footer.policies", "Policies")} className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-2">
            <Link to="/policies#privacy" className="hover:text-gold">{t("footer.privacy", "Privacy")}</Link>
            <Link to="/policies#terms" className="hover:text-gold">{t("footer.terms", "Terms")}</Link>
            <Link to="/policies#data-protection" className="hover:text-gold">{t("footer.dataProtection", "Data protection (Nigeria Data Protection Act 2023)")}</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

export default NESAFooter;
