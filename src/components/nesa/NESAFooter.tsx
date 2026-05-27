import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Heart, Twitter, Instagram, Linkedin, Youtube, Mail, ChevronDown } from "lucide-react";
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

export function NESAFooter() {
  const { t } = useTranslation("pages");
  const currentYear = new Date().getFullYear();

  const sections: FooterSection[] = [
    {
      title: t("footer.quickLinks", "Quick Links"),
      links: [
        { label: t("footer.links.home", "Home"), href: "/" },
        { label: t("footer.links.programs", "Programs"), href: "/programs" },
        { label: t("footer.links.categories", "Categories"), href: "/categories" },
        { label: t("footer.links.nominate", "Nominate"), href: "/nominate" },
      ],
    },
    {
      title: "Community",
      links: [
        { label: "Become a Volunteer", href: "/volunteer" },
        { label: "Meet Our Volunteers", href: "/volunteers" },
        { label: "Join a Local Chapter", href: "/join-local-chapter" },
        { label: "Apply as Ambassador", href: "/ambassadors" },
      ],
    },
  ];

  return (
    <footer className="bg-charcoal border-t border-gold/20 pt-10 md:pt-12 pb-24 md:pb-6">
      <div className="container px-4">
        {/* Brand — always visible */}
        <div className="text-center md:text-left mb-6 md:mb-0 md:grid md:grid-cols-4 md:gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 justify-center md:justify-start mb-3">
              <img
                src={nesaStamp}
                alt="New Education Standard Award Africa (NESA-Africa)"
                width={40}
                height={40}
                loading="lazy"
                decoding="async"
                className="h-10 w-10 rounded-full object-contain"
              />
              <div className="flex flex-col leading-tight text-left">
                <span className="text-[10px] text-gold/70 font-medium tracking-wider uppercase">
                  New Education Standard Award Africa
                </span>
                <span className="text-base font-display font-bold text-gold">
                  (NESA-Africa) 2026
                </span>
                <span className="text-[10px] text-white/60 italic">
                  "The African Blue-Garnet Awards for Education"
                </span>
              </div>
            </div>
            <p className="hidden md:block text-white/60 text-sm mb-4">
              A continental education recognition and impact platform celebrating
              Africa's education changemakers through recognition, visibility,
              partnerships, and measurable social impact.
            </p>
            <div className="flex gap-2 justify-center md:justify-start mt-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-11 w-11 rounded-lg bg-white/5 flex items-center justify-center text-white/60 hover:text-gold hover:bg-gold/10 transition-all border border-white/10 hover:border-gold/30"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Sections — accordion on mobile, columns on desktop */}
          {sections.map((section) => (
            <div key={section.title} className="md:block">
              {/* Mobile accordion */}
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
              {/* Desktop column */}
              <div className="hidden md:block text-center">
                <h4 className="text-white font-semibold mb-4">{section.title}</h4>
                <nav className="flex flex-col gap-2 text-sm">
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

          {/* Contact */}
          <div>
            <details className="md:hidden border-t border-y border-gold/10 group">
              <summary className="flex items-center justify-between py-4 cursor-pointer list-none text-white font-semibold">
                {t("footer.getInTouch", "Get in Touch")}
                <ChevronDown className="h-4 w-4 text-gold transition-transform group-open:rotate-180" />
              </summary>
              <div className="pb-4 flex flex-col gap-3">
                <a
                  href="mailto:info@nesa.africa"
                  className="inline-flex items-center gap-2 text-white/65 hover:text-gold transition-colors text-sm"
                >
                  <Mail className="h-4 w-4" /> info@nesa.africa
                </a>
                <div className="px-3 py-1.5 rounded-full bg-white/5 text-xs border border-white/10 w-fit">
                  <span className="text-gold font-semibold">SCEF</span>
                  <span className="text-white/50 ml-2">Foundation</span>
                </div>
              </div>
            </details>
            <div className="hidden md:block text-center md:text-right">
              <h4 className="text-white font-semibold mb-4">
                {t("footer.getInTouch", "Get in Touch")}
              </h4>
              <a
                href="mailto:info@nesa.africa"
                className="inline-flex items-center gap-2 text-white/60 hover:text-gold transition-colors"
              >
                <Mail className="h-4 w-4" /> info@nesa.africa
              </a>
              <div className="mt-4 flex justify-center md:justify-end">
                <div className="px-4 py-2 rounded-full bg-white/5 text-sm border border-white/10">
                  <span className="text-gold font-semibold">SCEF</span>
                  <span className="text-white/50 ml-2">Foundation</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gold/10 pt-5 mt-2 md:mt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-white/50 text-center">
            <p className="inline-flex items-center gap-1">
              {t("footer.madeWith", "Made with")}{" "}
              <Heart className="h-3 w-3 text-red-500" />{" "}
              {t("footer.forEducation", "for African education")}
            </p>
            <p>© {currentYear} Santos Creations Educational Foundation</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
