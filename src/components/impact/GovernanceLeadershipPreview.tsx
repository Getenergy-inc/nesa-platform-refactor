// Compact governance leadership preview for the Friends of EduAid-Africa page.
// Real, active SCEF office holders only. Vacant seats render honestly as
// "Position open". Avatars are initials-based — no cross-origin hotlinking of
// portraits from santoscreations.org.

import { Link } from "react-router-dom";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { personInitials } from "@/data/scefGovernance";

interface PreviewPerson {
  name: string;
  role: string;
  vacant?: boolean;
}

interface PreviewGroup {
  title: string;
  tierHref: string;
  members: PreviewPerson[];
}

const GROUPS: PreviewGroup[] = [
  {
    title: "Board of Trustees",
    tierHref: "/governance?tier=bot",
    members: [
      { name: "Prof. Alfred Akinbo Adegoke", role: "Chairman, Board of Trustees" },
      {
        name: "Engr. Jani Ibrahim FNSE, FAEng, FIoD, OON, mni",
        role: "National President, NACCIMA | Founder & Chairman, Lubcon Group",
      },
      { name: "Ms. Furo Hart", role: "Member, Board of Trustees" },
    ],
  },
  {
    title: "Management Team",
    tierHref: "/governance?tier=management",
    members: [
      { name: "Babashola Aderibigbe", role: "Chief Visionary Officer (CVO)" },
      { name: "Nwachukwu Ugochi Eugenia", role: "Organization Secretary" },
      { name: "Queen Onyebuchi-Akunne", role: "Director of Operations" },
    ],
  },
  {
    title: "Board of Directors",
    tierHref: "/governance?tier=bod",
    members: [
      { name: "Oluwadaise Aderibigbe", role: "Board of Directors, West Africa" },
      { name: "Mhe Rhoda Kunchela", role: "Regional Director, East Africa" },
      { name: "Position open", role: "Regional Director, Southern Africa", vacant: true },
      { name: "Position open", role: "Regional Director, North Africa", vacant: true },
      { name: "Position open", role: "Regional Director, Central Africa", vacant: true },
    ],
  },
];

function GovernanceProfileCard({ person }: { person: PreviewPerson }) {
  return (
    <li
      className={`flex items-start gap-3 rounded-xl border p-4 ${
        person.vacant
          ? "border-dashed border-white/15 bg-white/[0.02]"
          : "border-white/10 bg-white/[0.03]"
      }`}
    >
      <span
        aria-hidden
        className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-xs font-semibold ${
          person.vacant
            ? "border border-dashed border-white/25 text-white/40"
            : "bg-gold/15 text-gold"
        }`}
      >
        {person.vacant ? "—" : personInitials(person.name)}
      </span>
      <span className="min-w-0">
        <span
          className={`block text-sm font-semibold ${
            person.vacant ? "italic text-white/45" : "text-white"
          }`}
        >
          {person.name}
        </span>
        <span className="mt-0.5 block text-xs leading-relaxed text-white/60">{person.role}</span>
      </span>
    </li>
  );
}

export default function GovernanceLeadershipPreview() {
  return (
    <div className="mt-8">
      <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-gold/85">
        <ShieldCheck className="h-4 w-4" aria-hidden />
        Leadership &amp; Oversight
      </h3>
      <p className="mt-2 max-w-3xl text-sm text-white/65">
        Friends of EduAid-Africa operates under the governance of Santos Creations Educational
        Foundation. Only active, appointed office holders are listed; open seats are shown as open.
      </p>

      <div className="mt-6 space-y-7">
        {GROUPS.map((g) => (
          <div key={g.title}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-white/70">
                {g.title}
              </h4>
              <Link
                to={g.tierHref}
                className="inline-flex items-center gap-1 text-xs font-semibold text-gold hover:underline"
              >
                View full governance <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {g.members.map((m) => (
                <GovernanceProfileCard key={`${g.title}-${m.name}-${m.role}`} person={m} />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
