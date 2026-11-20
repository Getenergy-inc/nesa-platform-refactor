import { PROGRAMME_END } from "@/config/programme";

const icsDate = (date: Date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
const escapeIcs = (value: string) => value.replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\n/g, "\\n");

/** Downloadable calendar event for the canonical online-only programme. */
export function createProgrammeIcs(now = new Date()): string {
  const end = new Date(PROGRAMME_END.getTime() + 2 * 60 * 60 * 1000);
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//SCEF//NESA-Africa 2026//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    "UID:nesa-africa-online-programme-2026@scef",
    `DTSTAMP:${icsDate(now)}`,
    `DTSTART:${icsDate(PROGRAMME_END)}`,
    `DTEND:${icsDate(end)}`,
    `SUMMARY:${escapeIcs("NESA-Africa 2026 Online Recognition Programme")}`,
    `LOCATION:${escapeIcs("Online only")}`,
    `DESCRIPTION:${escapeIcs("Online Recognition Programme · Monday 28 December 2026 · Online only")}`,
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}

export function downloadProgrammeCalendar() {
  const blob = new Blob([createProgrammeIcs()], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "nesa-africa-online-programme-2026.ics";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
