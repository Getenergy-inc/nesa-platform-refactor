// SCEF governance roster — real, active records only.
//
// Source: SCEF's own governance_profiles table (active records). Vacant seats
// are represented explicitly as "Seat open" and must never be filled with a
// name. No photographs exist for this roster in this project, so surfaces must
// render initials-based avatars — never hotlink portraits from another domain.

export interface GovernancePerson {
  name: string;
  role?: string;
  /** True when the record is a structural seat with no appointed person. */
  vacant?: boolean;
}

export interface GovernanceBody {
  id: string;
  title: string;
  note?: string;
  members: GovernancePerson[];
  /** Rendered when `members` is empty. */
  emptyState?: string;
}

export const SCEF_GOVERNANCE_BODIES: GovernanceBody[] = [
  {
    id: "board-of-trustees",
    title: "Board of Trustees",
    members: [
      { name: "Prof. Alfred Akinbo Adegoke", role: "Chairman" },
      {
        name: "Engr. Jani Ibrahim FNSE FAEng FIoD OON mni",
        role: "National President, NACCIMA; Founder & Chairman, Lubcon Group",
      },
      { name: "Ms. Furo Hart", role: "Member" },
    ],
  },
  {
    id: "board-of-advisors",
    title: "Board of Advisors",
    members: [
      { name: "Prof. Jeleel Olasunkanmi Ojuade", role: "Vice-Chancellor, Ojaja University" },
      { name: "Prof. Mahfouz A. Adedimeji", role: "Vice-Chancellor, Ahman Pategi University" },
      { name: "Jephthah Ighodaro", role: "National Coordinator, CSACEFA Lagos" },
      { name: "Mrs. Folakemi Adesina", role: "Deputy National Coordinator, CSACEFA Lagos" },
      { name: "Dr. Martha Muhwezi", role: "Executive Director & Secretary, FAWE Africa Board" },
      { name: "Mr. Kossi Tsenou", role: "Senior Communication Officer, FAWE Africa" },
    ],
  },
  {
    id: "board-of-directors",
    title: "Board of Directors",
    note: "Regional director seats not yet filled are shown as open.",
    members: [
      { name: "Oluwadaise Aderibigbe", role: "West Africa" },
      { name: "Mhe Rhoda Kunchela", role: "Regional Director, East Africa" },
      { name: "Seat open", role: "Southern Africa", vacant: true },
      { name: "Seat open", role: "North Africa", vacant: true },
      { name: "Seat open", role: "Central Africa", vacant: true },
    ],
  },
  {
    id: "local-chapter-presidents",
    title: "Local Chapter Presidents",
    members: [],
    emptyState:
      "Chapter president profiles coming soon. Profile information will be added soon.",
  },
  {
    id: "management-team",
    title: "Management Team",
    members: [
      { name: "Babashola Aderibigbe", role: "Chief Visionary Officer" },
      { name: "Nwachukwu Ugochi Eugenia", role: "Organization Secretary" },
      { name: "Hawa Alimi", role: "Public Relations Officer" },
      { name: "Queen Onyebuchi-Akunne", role: "Director of Operations" },
      { name: "Amarachi Crystal Omereife", role: "Director of Technology" },
      { name: "Benneth Ogbeiwi", role: "Director of Media Business" },
      { name: "Ilesanmi Osanaiye", role: "Director of Chapter Services" },
      { name: "Emmanuel Faleti", role: "Director of Santos Media" },
    ],
  },
];

/** Initials for avatar placeholders (no photos exist for this roster). */
export function personInitials(name: string): string {
  const parts = name
    .replace(/\b(Prof\.|Dr\.|Mr\.|Mrs\.|Ms\.|Engr\.|Mhe)\b/gi, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return "—";
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
}
