// One static announcement; no carousel or countdown.
import { NOMINATION_WINDOW_LABEL } from "@/config/nominationWindows2026";
import { PROGRAMME_END_LABEL } from "@/config/programme";
import { PUBLIC_ACTIONS_2026 } from "@/config/publicActions2026";

export interface Announcement {
  id: string;
  text: string;
  href?: string;
  analyticsId?: string;
}

export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: "nominations-and-online-gala",
    text: `Public Nominations Open ${NOMINATION_WINDOW_LABEL} · Online Awards Gala: ${PROGRAMME_END_LABEL}. Learn More`,
    href: PUBLIC_ACTIONS_2026.onlineGala.href,
    analyticsId: "announcement_programme",
  },
];

export const ANNOUNCEMENT_ROTATE_MS = 6000;
