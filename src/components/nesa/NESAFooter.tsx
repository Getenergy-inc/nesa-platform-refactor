import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { NESALogo } from "@/components/nesa/NESALogo";
import { Heart, Twitter, Instagram, Linkedin, Youtube, Mail } from "lucide-react";

const socialLinks = [
  { icon: Twitter, href: "https://twitter.com/nesaafrica", label: "Twitter" },
  { icon: Instagram, href: "https://instagram.com/nesaafrica", label: "Instagram" },
  { icon: Linkedin, href: "https://linkedin.com/company/nesa-africa", label: "LinkedIn" },
  { icon: Youtube, href: "https://www.youtube.com/@Nesa.africaTV", label: "YouTube" },
];

export function NESAFooter() {
  const { t } = useTranslation("pages");
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: t("footer.links.home"), href: "/" },
    { label: t("footer.links.programs"), href: "/programs" },
    { label: t("footer.links.categories"), href: "/categories" },
    { label: t("footer.links.nominate"), href: "/nominate" },
  ];

  return (
    <footer className="bg-charcoal border-t border-gold/20 pt-12 pb-6">
      <div className="container">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="text-center md:text-left">
            <div className="flex items-center gap-4 justify-center md:justify-start mb-4">
              <NESALogo variant="full" size="sm" />
            </div>
            <p className="text-white/60 text-sm mb-4">
              {t("footer.tagline")}
            </p>
            {/* Social Links */}
            <div className="flex gap-3 justify-center md:justify-start">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center text-white/60 hover:text-gold hover:bg-gold/10 transition-all border border-white/10 hover:border-gold/30"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h4 className="text-white font-semibold mb-4">{t("footer.quickLinks")}</h4>
            <nav className="flex flex-wrap justify-center gap-4">
              {quickLinks.map((link) => (
                <Link 
                  key={link.label}
                  to={link.href} 
                  className="text-white/60 hover:text-gold transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="text-center md:text-right">
            <h4 className="text-white font-semibold mb-4">{t("footer.getInTouch")}</h4>
            <a 
              href="mailto:info@nesa.africa" 
              className="inline-flex items-center gap-2 text-white/60 hover:text-gold transition-colors"
            >
              <Mail className="h-4 w-4" />
              info@nesa.africa
            </a>
            <div className="mt-4 flex justify-center md:justify-end">
              <div className="px-4 py-2 rounded-full bg-white/5 text-sm border border-white/10">
                <span className="text-gold font-semibold">SCEF</span>
                <span className="text-white/50 ml-2">Foundation</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gold/10 pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/50">
            <p className="flex items-center gap-1">
              {t("footer.madeWith")} <Heart className="h-3 w-3 text-red-500" /> {t("footer.forEducation")}
            </p>
            <p>
              © {currentYear} Santos Creations Educational Foundation
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
