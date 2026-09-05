/**
 * Nominee Media Resolution Layer
 * ------------------------------
 * ONE place that decides which visual a nominee card, gallery, spotlight or
 * profile shows. Every nominee surface consumes this instead of reaching into
 * `photo_url` / `logo_url` directly.
 *
 * Strict priority:
 *   A. manually approved / uploaded nominee image (reviewed + approved)
 *   B. verified official organisation logo or individual portrait
 *   C. verified permitted public-source asset
 *   D. existing valid image already stored on the nominee record
 *   E. branded initials fallback (never a stock photo, never a guess)
 *
 * Media verification is deliberately independent of nomination approval and
 * NRC verification: an NRC-verified nominee can still be on a fallback image,
 * and an approved image never changes a recognition status.
 */

export type NomineeMediaStatus =
  | "missing"
  | "candidate_found"
  | "verification_required"
  | "verified"
  | "rejected"
  | "manually_approved"
  | "fallback";

export type NomineeMediaKind = "logo" | "portrait" | "fallback";

export type NomineeEntityType = "individual" | "organization" | "unknown";

/** Row shape of `public.nominee_media_sourcing`. */
export interface NomineeMediaSourcingRecord {
  nominee_id: string;
  nominee_slug: string | null;
  nominee_name: string;
  entity_type: string;
  media_kind: NomineeMediaKind;
  media_status: NomineeMediaStatus;
  candidate_image_url: string | null;
  approved_asset_url: string | null;
  storage_path: string | null;
  source_url: string | null;
  source_domain: string | null;
  source_type: string | null;
  attribution: string | null;
  confidence: number | null;
  date_checked: string | null;
  verification_note: string | null;
  approved_for_public: boolean;
  submitted_by_nominee: boolean;
}

/** Minimum a caller must supply from any nominee-shaped row. */
export interface NomineeMediaInput {
  id: string;
  name: string;
  slug?: string | null;
  organization?: string | null;
  photo_url?: string | null;
  logo_url?: string | null;
  entity_type?: NomineeEntityType;
}

export interface ResolvedNomineeMedia {
  /** Image to render, or null when the branded fallback must be used. */
  url: string | null;
  mediaKind: NomineeMediaKind;
  entityType: NomineeEntityType;
  /** Where the pixels came from: upload, official_site, public_source, existing_record… */
  sourceType: string | null;
  sourceUrl: string | null;
  status: NomineeMediaStatus;
  attribution: string | null;
  /** True only for reviewed + approved media. */
  approvedForPublic: boolean;
  verified: boolean;
  /** Logos must not be cropped; portraits should fill the frame. */
  fit: "cover" | "contain";
  alt: string;
}

const PLACEHOLDER_HINTS = ["placeholder", "default-avatar", "no-image", "dummy", "unsplash.com/photo-1"];

export function isPlaceholderUrl(url?: string | null): boolean {
  if (!url) return true;
  const lower = url.toLowerCase();
  return PLACEHOLDER_HINTS.some((hint) => lower.includes(hint));
}

/** Person vs organisation, using the record hint first then a light name test. */
export function inferEntityType(input: NomineeMediaInput): NomineeEntityType {
  if (input.entity_type && input.entity_type !== "unknown") return input.entity_type;
  if (input.logo_url && !input.photo_url) return "organization";
  const name = input.name?.toLowerCase() ?? "";
  const orgHints = [
    "foundation", "trust", "ngo", "initiative", "institute", "school", "academy",
    "university", "college", "college", "centre", "center", "network", "association",
    "council", "ministry", "limited", " ltd", "inc", "plc", "group", "company",
    "organisation", "organization", "society", "alliance", "project", "programme",
    "education", "africa ", "int'l", "international",
  ];
  if (orgHints.some((hint) => name.includes(hint))) return "organization";
  return "unknown";
}

export function normaliseOrganisationName(name?: string | null): string {
  return (name ?? "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\b(the|ltd|limited|inc|plc|llc|foundation|trust|org|organisation|organization)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function fallbackResult(
  input: NomineeMediaInput,
  entityType: NomineeEntityType,
  status: NomineeMediaStatus,
): ResolvedNomineeMedia {
  return {
    url: null,
    mediaKind: "fallback",
    entityType,
    sourceType: null,
    sourceUrl: null,
    status,
    attribution: null,
    approvedForPublic: true,
    verified: false,
    fit: "cover",
    alt: `${input.name} — branded NESA-Africa placeholder, no verified image on file`,
  };
}

export interface ResolverOptions {
  /** Approved / verified rows from `nominee_media_sourcing`, keyed by nominee id. */
  sourcing?: Record<string, NomineeMediaSourcingRecord>;
  /** Legacy verified `nominee_media` assets keyed by nominee slug. */
  legacyBySlug?: Record<string, { image_url?: string | null; logo_url?: string | null; source_url?: string | null; attribution?: string | null; kind?: string | null }>;
  /**
   * Verified assets keyed by normalised organisation name so one organisation
   * shows the same approved logo across every category it is nominated in.
   */
  sharedByOrganisation?: Record<string, { url: string; sourceType: string | null; sourceUrl: string | null; attribution: string | null }>;
  /** URLs seen so often in one collection they are clearly shared dummies. */
  suppressedUrls?: Set<string>;
}

/** Resolve one nominee's public visual. Pure — safe on the server or client. */
export function resolveNomineeMedia(
  input: NomineeMediaInput,
  options: ResolverOptions = {},
): ResolvedNomineeMedia {
  const entityType = inferEntityType(input);
  const record = options.sourcing?.[input.id];
  const suppressed = options.suppressedUrls;

  const usable = (url?: string | null) =>
    Boolean(url) && !isPlaceholderUrl(url) && !(suppressed?.has(url as string));

  // A + B + C — reviewed rows in the sourcing register.
  if (record && record.media_status !== "rejected" && record.approved_for_public) {
    const url = record.approved_asset_url ?? record.storage_path ?? null;
    if (usable(url)) {
      const kind: NomineeMediaKind =
        record.media_kind !== "fallback"
          ? record.media_kind
          : entityType === "organization"
            ? "logo"
            : "portrait";
      return {
        url,
        mediaKind: kind,
        entityType,
        sourceType: record.source_type,
        sourceUrl: record.source_url,
        status: record.media_status,
        attribution: record.attribution,
        approvedForPublic: true,
        verified: record.media_status === "verified" || record.media_status === "manually_approved",
        fit: kind === "logo" ? "contain" : "cover",
        alt:
          kind === "logo"
            ? `${input.name} official logo`
            : `${input.name} portrait`,
      };
    }
  }

  // C (legacy licensed library) — verified `nominee_media` rows keyed by slug.
  const legacy = input.slug ? options.legacyBySlug?.[input.slug] : undefined;
  if (legacy) {
    const url = legacy.image_url ?? legacy.logo_url ?? null;
    if (usable(url)) {
      const kind: NomineeMediaKind = legacy.kind === "organization" ? "logo" : "portrait";
      return {
        url: url as string,
        mediaKind: kind,
        entityType,
        sourceType: "licensed_library",
        sourceUrl: legacy.source_url ?? null,
        status: "verified",
        attribution: legacy.attribution ?? null,
        approvedForPublic: true,
        verified: true,
        fit: kind === "logo" ? "contain" : "cover",
        alt: kind === "logo" ? `${input.name} official logo` : `${input.name} portrait`,
      };
    }
  }

  // Shared organisation asset — same organisation, multiple nominations.
  if (entityType === "organization") {
    const key = normaliseOrganisationName(input.organization || input.name);
    const shared = key ? options.sharedByOrganisation?.[key] : undefined;
    if (shared && usable(shared.url)) {
      return {
        url: shared.url,
        mediaKind: "logo",
        entityType,
        sourceType: shared.sourceType,
        sourceUrl: shared.sourceUrl,
        status: "verified",
        attribution: shared.attribution,
        approvedForPublic: true,
        verified: true,
        fit: "contain",
        alt: `${input.name} official logo`,
      };
    }
  }

  // D — an existing valid image already stored on the nominee row.
  const stored = entityType === "organization"
    ? input.logo_url || input.photo_url
    : input.photo_url || input.logo_url;
  if (usable(stored)) {
    const kind: NomineeMediaKind = input.logo_url === stored ? "logo" : "portrait";
    return {
      url: stored as string,
      mediaKind: kind,
      entityType,
      sourceType: "existing_record",
      sourceUrl: null,
      status: record?.media_status ?? "verification_required",
      attribution: null,
      approvedForPublic: true,
      verified: record?.media_status === "verified",
      fit: kind === "logo" ? "contain" : "cover",
      alt: kind === "logo" ? `${input.name} logo` : `${input.name} portrait`,
    };
  }

  // E — branded fallback.
  return fallbackResult(input, entityType, record?.media_status ?? "missing");
}

/**
 * Collections often carry one shared dummy image repeated across dozens of
 * records. Anything repeating beyond the limit is treated as a fallback.
 */
export function buildSuppressedUrlSet(
  rows: Array<{ photo_url?: string | null; logo_url?: string | null }>,
  limit = 5,
): Set<string> {
  const counts = new Map<string, number>();
  for (const row of rows) {
    for (const url of [row.photo_url, row.logo_url]) {
      if (!url) continue;
      counts.set(url, (counts.get(url) ?? 0) + 1);
    }
  }
  const suppressed = new Set<string>();
  for (const [url, count] of counts) if (count > limit) suppressed.add(url);
  return suppressed;
}

/** Build the organisation-level shared-asset index from approved sourcing rows. */
export function buildSharedOrganisationIndex(
  records: NomineeMediaSourcingRecord[],
): Record<string, { url: string; sourceType: string | null; sourceUrl: string | null; attribution: string | null }> {
  const index: Record<string, { url: string; sourceType: string | null; sourceUrl: string | null; attribution: string | null }> = {};
  for (const rec of records) {
    if (!rec.approved_for_public) continue;
    if (rec.media_status !== "verified" && rec.media_status !== "manually_approved") continue;
    const url = rec.approved_asset_url ?? rec.storage_path;
    if (!url || isPlaceholderUrl(url)) continue;
    const key = normaliseOrganisationName(rec.nominee_name);
    if (!key || index[key]) continue;
    index[key] = {
      url,
      sourceType: rec.source_type,
      sourceUrl: rec.source_url,
      attribution: rec.attribution,
    };
  }
  return index;
}

export const MEDIA_STATUS_LABEL: Record<NomineeMediaStatus, string> = {
  missing: "Missing",
  candidate_found: "Candidate found",
  verification_required: "Verification required",
  verified: "Verified",
  rejected: "Rejected",
  manually_approved: "Manually approved",
  fallback: "Branded fallback",
};
