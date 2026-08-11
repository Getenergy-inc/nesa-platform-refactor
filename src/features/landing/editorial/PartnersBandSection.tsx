// Homepage partners band — endorsing organisations and supporting partners.
// Logos are the verified endorser marks already used on /about; no filler.

import { Link } from "react-router-dom";
import faweKenya from "@/assets/endorsements/fawe-kenya.jpeg";
import csacefa from "@/assets/endorsements/csacefa.jpeg";

const ENDORSERS = [
  {
    id: "fawe-kenya",
    name: "Forum for African Women Educationalists — Kenya Chapter",
    short: "FAWE Kenya",
    country: "Kenya",
    logo: faweKenya,
  },
  {
    id: "csacefa",
    name: "Civil Society Action Coalition on Education for All",
    short: "CSACEFA",
    country: "Nigeria",
    logo: csacefa,
  },
];

const PARTNERS = [
  "Santos Creations Educational Foundation",
  "GFA Wzip",
  "GetEnergy.ng",
  "PancoKrato Integrated Services",
];

export function PartnersBandSection() {
  return (
    <section className="ed-section" aria-labelledby="ed-partners-heading">
      <div className="ed-wrap">
        <div className="ed-section-head">
          <div className="ed-eyebrow">Endorsers &amp; Partners</div>
          <h2 id="ed-partners-heading" className="ed-section-title">
            Backed by Africa&apos;s Education Community
          </h2>
          <p className="ed-section-sub">
            Endorsed by continental education coalitions and supported by mission-aligned partners.
          </p>
        </div>

        <ul className="mb-8 flex flex-wrap items-stretch justify-center gap-4">
          {ENDORSERS.map((e) => (
            <li
              key={e.id}
              className="flex w-full max-w-sm items-center gap-4 rounded-2xl border border-gold/20 bg-white/[0.03] p-4 transition-colors hover:border-gold/50 sm:w-auto"
            >
              <img
                src={e.logo}
                alt={`${e.name} logo`}
                width={64}
                height={64}
                loading="lazy"
                decoding="async"
                className="h-16 w-16 shrink-0 rounded-full bg-white object-contain p-1"
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white">{e.short}</p>
                <p className="text-xs leading-snug text-white/60">{e.name}</p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-gold">
                  {e.country} · Endorser
                </p>
              </div>
            </li>
          ))}
        </ul>

        <ul className="flex flex-wrap items-center justify-center gap-2">
          {PARTNERS.map((p) => (
            <li
              key={p}
              className="rounded-full border border-white/15 px-4 py-1.5 text-xs font-medium text-white/70"
            >
              {p}
            </li>
          ))}
        </ul>

        <p className="ed-disclaimer mt-6">
          Endorsements and partnerships do not influence nominee approval or judging.{" "}
          <Link to="/partnerships">Become a partner →</Link>
        </p>
      </div>
    </section>
  );
}

export default PartnersBandSection;
