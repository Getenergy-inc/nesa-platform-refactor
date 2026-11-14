// One static announcement; no carousel or countdown.

export interface Announcement {
  id: string;
  text: string;
  href?: string;
  analyticsId?: string;
}

export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: "nominations-and-online-programme",
    text: "Public Nominations Open 9 November 2026 – 31 March 2027 · Online Recognition Programme: Sunday 13 December 2026. Learn More",
    href: "/programme/2026",
    analyticsId: "announcement_programme",
  },
];

export const ANNOUNCEMENT_ROTATE_MS = 6000;
