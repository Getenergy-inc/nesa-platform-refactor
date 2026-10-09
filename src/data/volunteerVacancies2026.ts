// Volunteer vacancy listings for the 2026 Webinar & Podcast services team.
// Slot data is DERIVED from the canonical schedule configs — never retyped:
//   • Webinar weeks  → @/data/eduaidWebinarSeries2026
//   • Podcast episodes → @/data/masterTimeline2026 (track: "podcast")
// Episodes 8 & 9 stay honestly TBC (no invented topic).

import { EDUAID_WEBINAR_SERIES_2026 } from "@/data/eduaidWebinarSeries2026";
import { MASTER_TIMELINE_2026 } from "@/data/masterTimeline2026";

export interface VolunteerSlot {
  id: string;
  /** "Week 1 (pilot)" / "Episode 8 & 9" */
  label: string;
  dateLabel: string;
  title: string;
  focus?: string;
  toBeConfirmed?: boolean;
}

export const WEBINAR_HOST_SLOTS: VolunteerSlot[] = EDUAID_WEBINAR_SERIES_2026.map(
  (e, i, arr) => ({
    id: e.id,
    label: `Week ${e.episode}${e.pilot ? " (pilot)" : i === arr.length - 1 ? " (closing)" : ""}`,
    dateLabel: e.dateLabel,
    title: e.title,
    focus: e.subtitle,
  }),
);

export const PODCAST_HOST_SLOTS: VolunteerSlot[] = MASTER_TIMELINE_2026.filter(
  (m) => m.track === "podcast",
)
  .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
  .map((m) => ({
    id: m.id,
    label: m.milestone.replace("Education Enablers Podcast — ", ""),
    dateLabel: m.toBeConfirmed
      ? "To be confirmed (~mid-October 2026)"
      : m.dateLabel,
    title: m.toBeConfirmed ? "Topic not yet confirmed" : m.activity,
    toBeConfirmed: m.toBeConfirmed,
  }));

/** Combined production-team slots across both tracks. */
export const PRODUCTION_SLOTS: VolunteerSlot[] = [
  ...WEBINAR_HOST_SLOTS.map((s) => ({ ...s, id: `prod-${s.id}`, label: `Webinar · ${s.label}` })),
  ...PODCAST_HOST_SLOTS.map((s) => ({ ...s, id: `prod-${s.id}`, label: `Podcast · ${s.label}` })),
];

export const PRODUCTION_FUNCTIONS = [
  "Live streaming / broadcast operations",
  "Video & audio editing",
  "Session report writing for the EduAid-Africa Journal",
] as const;

export interface VolunteerVacancy {
  slug: string;
  code: string;
  title: string;
  role: string;
  location: string;
  commitment: string;
  intro: string;
  responsibilities: string[];
  lookingFor: string[];
  pickerHeading: string;
  pickerNote: string;
  slots: VolunteerSlot[];
  /** Optional second picker (production functions) */
  functions?: readonly string[];
}

export const VOLUNTEER_VACANCIES_2026: VolunteerVacancy[] = [
  {
    slug: "webinar-host",
    code: "V-01",
    title: "Volunteer Webinar Host",
    role: "Webinar Host — Africa’s Education Enablers Series",
    location: "Remote",
    commitment: "One or more single sessions, ~2–3 hours each",
    intro:
      "Host a live episode in the seven-week webinar series — welcoming guests, guiding the conversation, keeping time, and connecting the discussion back to that week's featured award categories.",
    responsibilities: [
      "Welcome guests and open the live session",
      "Guide the conversation and keep the panel to time",
      "Connect the discussion back to that week's featured award categories",
      "Join a short prep call before your session",
    ],
    lookingFor: [
      "Comfortable on camera and leading live sessions",
      "Genuine interest in African education",
      "Reliable internet connection",
      "Available for a short prep call",
    ],
    pickerHeading: "Choose your slot",
    pickerNote:
      "Select your first and second choice weeks. Your selection is included in the note you send with your application.",
    slots: WEBINAR_HOST_SLOTS,
  },
  {
    slug: "podcast-host",
    code: "V-02",
    title: "Volunteer Podcast Host",
    role: "Podcast Host — Africa’s Education Enablers Series",
    location: "Remote",
    commitment: "One or more single episodes, ~1–2 hours each",
    intro:
      "Host a standalone podcast episode — shorter and more conversational than the webinars, usually built around one theme or one guest story rather than a full panel.",
    responsibilities: [
      "Host a standalone episode, solo narration or guest interview",
      "Prepare around a single theme or guest story",
      "Work with production support on recording and delivery",
    ],
    lookingFor: [
      "Clear, engaging speaking voice",
      "Comfortable interviewing or narrating solo",
      "Recording-device familiarity a plus, not required — production support is available",
    ],
    pickerHeading: "Choose your episode",
    pickerNote:
      "Select the episode(s) you would like to host. Episodes 8 & 9 remain unscheduled — you can register interest and we will confirm dates and topics later.",
    slots: PODCAST_HOST_SLOTS,
  },
  {
    slug: "production",
    code: "V-03",
    title: "Volunteer Webinar & Podcast Production",
    role: "Production Volunteer — Webinar & Podcast Services Team",
    location: "Remote",
    commitment: "Flexible — a single session or the full series",
    intro:
      "Run the live stream and recording, handle basic audio/video editing, turn each session into a publishable report for the EduAid-Africa Journal, and help keep the weekly production schedule on track.",
    responsibilities: [
      "Run the live stream / session recording",
      "Basic audio and video editing",
      "Turn each session into a publishable report for the EduAid-Africa Journal (Webinar Reports stream)",
      "Help keep the weekly production schedule on track",
    ],
    lookingFor: [
      "Live streaming, video/audio editing, OR content-writing experience — any one is enough",
      "Reliable and organised",
    ],
    pickerHeading: "Choose your involvement",
    pickerNote:
      "Pick any number of sessions across both tracks, plus the part of production that interests you.",
    slots: PRODUCTION_SLOTS,
    functions: PRODUCTION_FUNCTIONS,
  },
];

export function getVolunteerVacancy(slug: string) {
  return VOLUNTEER_VACANCIES_2026.find((v) => v.slug === slug);
}
