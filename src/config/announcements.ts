// Announcement bar messages — max 3 rotate. Update copy here, no code changes.

export interface Announcement {
  id: string;
  text: string;
  href?: string;
  analyticsId?: string;
}

export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: "nominations-open",
    text: "NESA-Africa 2026 Nominations Are Open — nominate an Education Enabler",
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
    text: "NESA-Africa 2026 Gala · 22 October 2026 · Lagos, Nigeria",
    href: "/gala",
    analyticsId: "announcement_gala",
  },
];

export const ANNOUNCEMENT_ROTATE_MS = 6000;
