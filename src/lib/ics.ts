/**
 * Minimal RFC 5545 .ics generator for calendar exports.
 * All fields are escaped for text safety.
 */

export interface IcsEvent {
  uid: string;
  title: string;
  description?: string;
  location?: string;
  url?: string;
  /** Local start Date */
  start: Date;
  /** Local end Date; defaults to start + 90 min */
  end?: Date;
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function toUtcStamp(d: Date): string {
  return (
    d.getUTCFullYear().toString() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    "T" +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    "Z"
  );
}

function escapeText(s: string): string {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

export function buildIcs(event: IcsEvent): string {
  const end = event.end ?? new Date(event.start.getTime() + 90 * 60 * 1000);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//NESA-Africa//Webinars//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.uid}@nesa.africa`,
    `DTSTAMP:${toUtcStamp(new Date())}`,
    `DTSTART:${toUtcStamp(event.start)}`,
    `DTEND:${toUtcStamp(end)}`,
    `SUMMARY:${escapeText(event.title)}`,
    event.description ? `DESCRIPTION:${escapeText(event.description)}` : "",
    event.location ? `LOCATION:${escapeText(event.location)}` : "",
    event.url ? `URL:${event.url}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);
  return lines.join("\r\n");
}

export function downloadIcs(filename: string, event: IcsEvent) {
  const blob = new Blob([buildIcs(event)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".ics") ? filename : `${filename}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
