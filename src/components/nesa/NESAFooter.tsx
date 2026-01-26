import { Link } from "react-router-dom";
import { NESALogo } from "@/components/nesa/NESALogo";
import { Heart, Twitter, Instagram, Linkedin, Youtube, Mail } from "lucide-react";

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter", emoji: "🐦" },
  { icon: Instagram, href: "#", label: "Instagram", emoji: "📸" },
  { icon: Linkedin, href: "#", label: "LinkedIn", emoji: "💼" },
  { icon: Youtube, href: "#", label: "YouTube", emoji: "🎬" },
];

const quickLinks = [
  { label: "Home", href: "/", emoji: "🏠" },
  { label: "Programs", href: "/programs", emoji: "📚" },
  { label: "Categories", href: "/categories", emoji: "🏆" },
  { label: "Nominate", href: "/nominate", emoji: "✨" },
];

export function NESAFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal border-t border-gold/30 pt-12 pb-6 relative overflow-hidden">
      {/* Fun gradient top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold via-purple-500 to-cyan-500 animate-gradient-shift" style={{ backgroundSize: '400% 400%' }} />
      
      <div className="container relative z-10">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="text-center md:text-left">
            <div className="flex items-center gap-4 justify-center md:justify-start mb-4">
              <NESALogo variant="full" size="sm" />
              <span className="text-2xl">✨</span>
            </div>
            <p className="text-white/60 text-sm mb-4">
              Celebrating Africa's Education Champions since 2010 🌍
            </p>
            {/* Social Links */}
            <div className="flex gap-3 justify-center md:justify-start">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="group h-10 w-10 rounded-xl glass-dark flex items-center justify-center text-white/60 hover:text-gold transition-all hover-pop hover:border-gold/50 border border-transparent"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4 group-hover:hidden" />
                  <span className="text-lg hidden group-hover:block">{social.emoji}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h4 className="text-white font-bold mb-4 flex items-center justify-center gap-2">
              Quick Links <span className="text-lg">🔗</span>
            </h4>
            <nav className="flex flex-wrap justify-center gap-4">
              {quickLinks.map((link) => (
                <Link 
                  key={link.label}
                  to={link.href} 
                  className="group text-white/60 hover:text-gold transition-colors flex items-center gap-1"
                >
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">{link.emoji}</span>
                  <span>{link.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="text-center md:text-right">
            <h4 className="text-white font-bold mb-4 flex items-center justify-center md:justify-end gap-2">
              Get in Touch <span className="text-lg">💬</span>
            </h4>
            <a 
              href="mailto:hello@nesa.africa" 
              className="inline-flex items-center gap-2 text-white/60 hover:text-gold transition-colors group"
            >
              <Mail className="h-4 w-4 group-hover:animate-wiggle" />
              hello@nesa.africa
            </a>
            <div className="mt-4 flex justify-center md:justify-end">
              <div className="px-4 py-2 rounded-full glass-dark text-sm">
                <span className="text-gold font-bold">SCEF</span>
                <span className="text-white/50 ml-2">Foundation</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gold/20 pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/50">
            <p className="flex items-center gap-1">
              Made with <Heart className="h-3 w-3 text-red-500 animate-pulse" /> for African Education
            </p>
            <p>
              © {currentYear} Santa Claus Educational Foundation ✨
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
