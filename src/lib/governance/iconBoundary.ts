/**
 * Icon Content Boundary Guard
 * ---------------------------
 * Episodes 4 and 7 of the EduAid-Africa Webinar Series air during (or
 * immediately adjacent to) the Africa Education Icon judging window
 * (1 September – 12 October 2026). Standing rule:
 *
 *   No naming, promoting, comparing, or commenting on any specific Icon
 *   nominee under active review.
 *
 * This module provides a pure, reusable checker so the rule can be enforced
 * automatically — in unit tests / CI over authored copy, and at runtime over
 * any user- or editor-supplied episode content.
 */
import { ICON_NOMINEES } from "@/data/iconAward";

export type IconBoundaryViolationKind = "nominee-name" | "language";

export interface IconBoundaryViolation {
  kind: IconBoundaryViolationKind;
  /** The nominee name or banned phrase that matched. */
  match: string;
  /** Surrounding text for reviewer context. */
  excerpt: string;
  reason: string;
}

/** Phrases that name-adjacent copy uses to promote, compare, or comment. */
export const ICON_BOUNDARY_BANNED_PATTERNS: { pattern: RegExp; reason: string }[] = [
  { pattern: /\bvote(s|d|ing)?\s+for\b/i, reason: "Promoting a nominee (vote-for language)" },
  { pattern: /\b(should|will|deserves?\s+to|going\s+to)\s+win\b/i, reason: "Predicting or endorsing an outcome" },
  { pattern: /\b(likely|probable|expected)\s+(winner|laureate)\b/i, reason: "Predicting an outcome" },
  { pattern: /\bfront[-\s]?runner\b/i, reason: "Comparative ranking of nominees" },
  { pattern: /\btop\s+contender\b/i, reason: "Comparative ranking of nominees" },
  { pattern: /\bfavou?rite\s+(to\s+win|for\s+the\s+(icon|award))\b/i, reason: "Comparative ranking of nominees" },
  { pattern: /\b(best|strongest|weakest|worst)\s+(nominee|candidate|entry|contender)\b/i, reason: "Comparing nominees" },
  { pattern: /\b(better|stronger|weaker)\s+than\s+(the\s+)?(other\s+)?(nominee|candidate|contender)/i, reason: "Comparing nominees" },
  { pattern: /\bcompared?\s+(to|with)\s+(the\s+)?other\s+(icon\s+)?(nominees?|candidates?)\b/i, reason: "Comparing nominees" },
  { pattern: /\bwe\s+(endorse|back|support)\s+(this|the)\s+(nominee|candidate)\b/i, reason: "Endorsing a nominee" },
  { pattern: /\bour\s+pick\s+for\s+(the\s+)?icon\b/i, reason: "Endorsing a nominee" },
  { pattern: /\bshortlist(ed)?\s+leader\b/i, reason: "Commenting on nominees under review" },
  { pattern: /\bnominee\s+under\s+review\s+(is|was|has)\b/i, reason: "Commenting on a nominee under review" },
];

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Full names of every Icon nominee in the roster. Single-token names are
 * excluded — they cause false positives against ordinary prose.
 */
export function iconNomineeNames(): string[] {
  const names = new Set<string>();
  for (const n of ICON_NOMINEES) {
    const name = (n.name ?? "").trim();
    if (name.split(/\s+/).filter(Boolean).length >= 2) names.add(name);
  }
  return [...names];
}

function excerptAround(text: string, index: number, length: number): string {
  const start = Math.max(0, index - 40);
  const end = Math.min(text.length, index + length + 40);
  return `${start > 0 ? "…" : ""}${text.slice(start, end).replace(/\s+/g, " ").trim()}${end < text.length ? "…" : ""}`;
}

/** Scan a block of text for Icon-boundary violations. */
export function checkIconBoundary(text: string): IconBoundaryViolation[] {
  const violations: IconBoundaryViolation[] = [];
  if (!text) return violations;

  for (const name of iconNomineeNames()) {
    const re = new RegExp(`\\b${escapeRegExp(name)}\\b`, "i");
    const m = re.exec(text);
    if (m) {
      violations.push({
        kind: "nominee-name",
        match: name,
        excerpt: excerptAround(text, m.index, m[0].length),
        reason: "Names a specific Africa Education Icon nominee under active review",
      });
    }
  }

  for (const { pattern, reason } of ICON_BOUNDARY_BANNED_PATTERNS) {
    const m = pattern.exec(text);
    if (m) {
      violations.push({
        kind: "language",
        match: m[0],
        excerpt: excerptAround(text, m.index, m[0].length),
        reason,
      });
    }
  }

  return violations;
}

/** Convenience boolean wrapper for runtime guards. */
export const isIconBoundarySafe = (text: string): boolean => checkIconBoundary(text).length === 0;

/** Human-readable report used by tests and editorial tooling. */
export function formatIconBoundaryViolations(
  label: string,
  violations: IconBoundaryViolation[],
): string {
  if (!violations.length) return "";
  return [
    `Icon content boundary violated in ${label}:`,
    ...violations.map((v) => `  • [${v.kind}] "${v.match}" — ${v.reason}\n      ${v.excerpt}`),
  ].join("\n");
}
