// Announcement bar messages — max 3 rotate. Update copy here, no code changes.
// Dates are imported from the canonical config — never retyped.
import { NOMINATIONS_OPEN_LABEL } from "@/config/nominationWindows2026";
import { PROGRAMME_END_LABEL } from "@/config/programme";

export interface Announcement {
  id: string;
  text: string;
  href?: string;
  analyticsId?: string;
}

export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: "nominations-open",
    text: `Public Nominations Open ${NOMINATIONS_OPEN_LABEL} · NESA-Africa 2026`,
    href: "/nominate",
    analyticsId: "announcement_nominate",
  },
  {
    id: "explore-enablers",
    text: "Explore Education Enablers Across Africa",
    href: "/education-enablers",
    analyticsId: "announcement_enablers",
  },
  {
    id: "gala-2026",
    text: "NESA-Africa 2026 Recognition Gala · 13 December 2026 · Lagos, Nigeria",
    href: "/gala",
    analyticsId: "announcement_gala",
  },
];

export const ANNOUNCEMENT_ROTATE_MS = 6000;
