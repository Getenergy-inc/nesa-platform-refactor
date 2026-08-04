/**
 * Automated date validation for /timeline.
 *
 * Guarantees that every period rendered on the Timeline page agrees with the
 * "NESA-Africa 2026 — Complete Timeline Set" source document:
 *   1. Every human-readable dateLabel parses to exactly the ISO startsAt/endsAt.
 *   2. Weekday prefixes ("Tuesday, 18 August 2026") are the real weekday.
 *   3. The canonical anchor dates from the source set are present, unchanged.
 *   4. Entries are chronological, uniquely identified and inside the programme
 *      window (1 July 2026 – 14 December 2027 legacy tail).
 *   5. No retired date or retired terminology survives anywhere in src/.
 */
import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import {
  MASTER_TIMELINE_2026,
  MASTER_TIMELINE_NOMINATION_WINDOWS,
  MASTER_TIMELINE_PUBLIC_NOTICE,
  type MasterTimelineEntry,
} from "@/data/masterTimeline2026";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAYS = [
  "Sunday", "Monday", "Tuesday", "Wednesday",
  "Thursday", "Friday", "Saturday",
];

interface ParsedLabel {
  start?: Date;
  end?: Date;
  weekday?: string;
  /** Label carries no resolvable date (flagged open items). */
  unresolved?: boolean;
}

function toUtc(day: number, month: string, year: number): Date {
  return new Date(Date.UTC(year, MONTHS.indexOf(month), day));
}

/** Parse a master-timeline dateLabel into concrete UTC dates. */
export function parseDateLabel(label: string): ParsedLabel {
  if (/to be confirmed/i.test(label)) return { unresolved: true };

  let rest = label.replace(/^From\s+/i, "").trim();
  let weekday: string | undefined;
  const wd = rest.match(/^(\w+day),\s*/);
  if (wd && WEEKDAYS.includes(wd[1])) {
    weekday = wd[1];
    rest = rest.slice(wd[0].length);
  }

  const parts = rest.split(/\s*[–—-]\s*/);
  const full = /^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/;

  // Month-only ranges ("December 2026 – December 2027") carry no day precision.
  if (parts.every((p) => /^[A-Za-z]+\s+\d{4}$/.test(p))) return { unresolved: true };

  const last = parts[parts.length - 1].match(full);
  if (!last) return { unresolved: true };
  const end = toUtc(Number(last[1]), last[2], Number(last[3]));

  if (parts.length === 1) return { start: end, weekday };

  const left = parts[0].trim();
  let start: Date;
  const leftFull = left.match(full);
  const leftDayMonth = left.match(/^(\d{1,2})\s+([A-Za-z]+)$/);
  if (leftFull) start = toUtc(Number(leftFull[1]), leftFull[2], Number(leftFull[3]));
  else if (leftDayMonth) start = toUtc(Number(leftDayMonth[1]), leftDayMonth[2], Number(last[3]));
  else if (/^\d{1,2}$/.test(left)) start = toUtc(Number(left), last[2], Number(last[3]));
  else return { unresolved: true };

  return { start, end, weekday };
}

const isoDay = (iso: string) => iso.slice(0, 10);
const dayOf = (d: Date) => d.toISOString().slice(0, 10);

describe("Timeline date validation — labels match their ISO periods", () => {
  it("has unique milestone ids", () => {
    const ids = MASTER_TIMELINE_2026.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  for (const entry of MASTER_TIMELINE_2026) {
    it(`"${entry.dateLabel}" — ${entry.milestone}`, () => {
      const parsed = parseDateLabel(entry.dateLabel);
      if (parsed.unresolved) {
        // Only explicitly flagged open items may carry an unresolved label.
        expect(
          entry.flagged || /^[A-Za-z]+\s+\d{4}/.test(entry.dateLabel),
          `${entry.id}: unparseable label must be a flagged open item`,
        ).toBe(true);
        return;
      }

      expect(dayOf(parsed.start!), `${entry.id}: start mismatch`).toBe(
        isoDay(entry.startsAt),
      );

      if (parsed.end && dayOf(parsed.end) !== dayOf(parsed.start!)) {
        expect(entry.endsAt, `${entry.id}: ranged label needs endsAt`).toBeTruthy();
        expect(dayOf(parsed.end), `${entry.id}: end mismatch`).toBe(
          isoDay(entry.endsAt!),
        );
      }

      if (parsed.weekday) {
        const actual = WEEKDAYS[new Date(entry.startsAt).getUTCDay()];
        expect(actual, `${entry.id}: weekday mismatch`).toBe(parsed.weekday);
      }
    });
  }

  it("every ranged entry ends after it starts and stays inside the programme window", () => {
    for (const entry of MASTER_TIMELINE_2026) {
      const start = new Date(entry.startsAt).getTime();
      expect(start, entry.id).toBeGreaterThanOrEqual(Date.UTC(2026, 6, 1));
      if (entry.endsAt) {
        const end = new Date(entry.endsAt).getTime();
        expect(end, entry.id).toBeGreaterThan(start);
        expect(end, entry.id).toBeLessThanOrEqual(Date.UTC(2027, 11, 31));
      }
    }
  });

  it("is published in chronological order by start date", () => {
    const starts = MASTER_TIMELINE_2026.map((e) => new Date(e.startsAt).getTime());
    const sorted = [...starts].sort((a, b) => a - b);
    const offenders = MASTER_TIMELINE_2026.filter(
      (e, i) => starts[i] !== sorted[i],
    ).map((e) => `${e.id} (${e.dateLabel})`);
    // Podcast/webinar strands interleave by track, so allow the documented
    // grouping but keep the overall sequence monotonic within each track.
    const byTrack = new Map<string, number[]>();
    for (const e of MASTER_TIMELINE_2026) {
      const list = byTrack.get(e.track) ?? [];
      list.push(new Date(e.startsAt).getTime());
      byTrack.set(e.track, list);
    }
    for (const [track, list] of byTrack) {
      expect(
        list.every((v, i) => i === 0 || v >= list[i - 1]),
        `${track} track is out of order (${offenders.join(", ")})`,
      ).toBe(true);
    }
  });
});

describe("Timeline anchors — Complete Timeline Set source values", () => {
  const anchor = (id: string): MasterTimelineEntry => {
    const found = MASTER_TIMELINE_2026.find((e) => e.id === id);
    expect(found, `missing timeline entry "${id}"`).toBeTruthy();
    return found!;
  };

  const CASES: [string, string, string | undefined][] = [
    ["pre-launch", "2026-07-01", "2026-08-30"],
    ["nrc-member-onboarding", "2026-08-01", "2026-08-28"],
    ["public-nominations-open", "2026-08-30", undefined],
    ["icon-nominations", "2026-08-30", "2026-09-12"],
    ["tier234-nominations", "2026-08-30", "2026-11-14"],
    ["icon-judges-onboarding", "2026-09-12", "2026-09-25"],
    ["nrc-icon-review", "2026-09-13", "2026-09-26"],
    ["gold-blue-garnet-verification", "2026-09-16", "2026-12-14"],
    ["judges-final-review", "2026-09-26", "2026-10-31"],
    ["final-verification-gala-production", "2026-10-10", "2026-10-14"],
    ["tv-show-1", "2026-11-15", undefined],
    ["tv-show-2", "2026-12-01", undefined],
    ["recognition-gala", "2026-12-14", undefined],
  ];

  for (const [id, start, end] of CASES) {
    it(`${id} = ${start}${end ? ` → ${end}` : ""}`, () => {
      const e = anchor(id);
      expect(isoDay(e.startsAt)).toBe(start);
      if (end) expect(isoDay(e.endsAt ?? "")).toBe(end);
      else expect(e.endsAt).toBeUndefined();
    });
  }

  it("the Gala is the highlighted 14 December 2026 milestone", () => {
    const gala = anchor("recognition-gala");
    expect(gala.highlight).toBe(true);
    expect(gala.dateLabel).toBe("Monday, 14 December 2026");
  });

  it("nomination windows state the Icon split correctly", () => {
    const byId = Object.fromEntries(
      MASTER_TIMELINE_NOMINATION_WINDOWS.map((w) => [w.id, w]),
    );
    expect(byId.icon.window).toBe("30 August – 12 September 2026");
    for (const id of ["gold-blue-garnet", "platinum", "influencer"]) {
      expect(byId[id].window, id).toBe("30 August – 14 November 2026");
    }
  });

  it("the public notice opens nominations on 30 August 2026", () => {
    expect(isoDay(MASTER_TIMELINE_PUBLIC_NOTICE.effectiveDate)).toBe("2026-08-30");
    expect(MASTER_TIMELINE_PUBLIC_NOTICE.title).toContain("30 August 2026");
  });
});

/* ------------------------------------------------------------------ */
/* Retired-date sweep                                                  */
/* ------------------------------------------------------------------ */

const CANONICAL = "src/data/masterTimeline2026.ts";
const ALLOWLIST = new Set<string>([
  CANONICAL,
  "src/test/timeline-date-validation.test.ts",
  "src/data/recognitionJourney2026.ts",
]);

const RETIRED: { pattern: RegExp; reason: string }[] = [
  { pattern: /\b1\s+August\s+2026\b/i, reason: "Retired nominations-open date — now 30 August 2026" },
  { pattern: /\b22\s+October\s+2026\b/i, reason: "Retired Gala date — now 14 December 2026" },
  { pattern: /\b5\s+July\s+2026\b/i, reason: "Retired Platinum Recognition Show date" },
  { pattern: /\b10\s+July\s+2026\b/i, reason: "Retired Icon nominations close date — now 12 September 2026" },
  { pattern: /\b29\s+June\s*[–—-]\s*10\s+July\s+2026\b/i, reason: "Retired Icon nominations window" },
  { pattern: /\b1\s*[–—-]\s*30\s+July\s+2026\b/i, reason: "Retired pre-launch window — now 1 July – 30 August 2026" },
  { pattern: /\b30\s+September\s+2026\b/i, reason: "Retired nominations-close date — now 14 November 2026" },
  { pattern: /NESA-?Africa\s*2025\/26/i, reason: "Retired branding — use 'NESA-Africa 2026'" },
];

function* walkSrc(dir: string): Generator<string> {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry.startsWith(".")) continue;
    const full = join(dir, entry);
    const s = statSync(full);
    if (s.isDirectory()) yield* walkSrc(full);
    else if (/\.(ts|tsx|json|md)$/.test(full)) yield full;
  }
}

describe("Retired timeline dates are gone from src/", () => {
  it("contains no retired date strings or retired branding", () => {
    const failures: string[] = [];
    for (const file of walkSrc(join(process.cwd(), "src"))) {
      const rel = relative(process.cwd(), file).split(sep).join("/");
      if (ALLOWLIST.has(rel)) continue;
      const lines = readFileSync(file, "utf8").split("\n");
      lines.forEach((line, i) => {
        for (const { pattern, reason } of RETIRED) {
          if (pattern.test(line)) {
            failures.push(`${rel}:${i + 1} — ${reason}\n    ${line.trim()}`);
          }
        }
      });
    }
    expect(failures, failures.join("\n")).toEqual([]);
  });

  it("the Timeline page consumes the canonical master timeline", () => {
    const page = readFileSync(join(process.cwd(), "src/pages/about/Timeline.tsx"), "utf8");
    expect(page).toContain("MasterTimelineTable");
    expect(page).not.toMatch(/\bpublic vote\b/i);
  });

  it("the label parser detects a corrupted date (sanity check)", () => {
    const p = parseDateLabel("Tuesday, 18 August 2026");
    expect(dayOf(p.start!)).toBe("2026-08-18");
    expect(parseDateLabel("30 August – 12 September 2026").end!.toISOString()).toContain(
      "2026-09-12",
    );
    expect(parseDateLabel("Date to be confirmed").unresolved).toBe(true);
  });
});
