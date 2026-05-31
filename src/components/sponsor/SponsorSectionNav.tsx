// SponsorSectionNav — sticky anchor navigation for the Sponsor Hub page.

import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "packages", label: "Packages" },
  { id: "pillars", label: "Pillars" },
  { id: "legacy-fund", label: "Legacy Fund" },
  { id: "sponsor-slot-matrix", label: "Sponsor Limits" },
  { id: "payment-trust", label: "Payment Trust" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
];

export function SponsorSectionNav() {
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 320);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      aria-label="Sponsor page sections"
      className={`sticky top-16 z-20 hidden md:block border-y border-gold/10 bg-charcoal/90 backdrop-blur transition-opacity ${
        stuck ? "opacity-100" : "opacity-95"
      }`}
    >
      <div className="container mx-auto px-4">
        <ul className="flex flex-wrap gap-x-5 gap-y-1 py-2.5 text-[12px] uppercase tracking-[0.16em] text-ivory/70">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="hover:text-gold transition font-semibold"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default SponsorSectionNav;
