/**
 * Centralized Validation Utilities
 * Runtime validation for data integrity with strict type checking
 */

type AnyRecord = Record<string, unknown>;

export function requireString(v: unknown, field: string): string {
  if (typeof v !== "string" || !v.trim()) throw new Error(`Invalid "${field}"`);
  return v;
}

export function requireNumber(v: unknown, field: string): number {
  if (typeof v !== "number" || Number.isNaN(v)) throw new Error(`Invalid "${field}"`);
  return v;
}

export function requireUrl(v: unknown, field: string): string {
  const s = requireString(v, field);
  try {
    new URL(s);
    return s;
  } catch {
    throw new Error(`Invalid URL in "${field}"`);
  }
}

export function validateAwards(data: unknown) {
  if (!Array.isArray(data)) throw new Error("awards must be an array");
  return data.map((x, i) => {
    const r = x as AnyRecord;
    return {
      title: requireString(r.title, `awards[${i}].title`),
      organization: requireString(r.organization, `awards[${i}].organization`),
      year: requireNumber(r.year, `awards[${i}].year`),
      description: requireString(r.description, `awards[${i}].description`),
      location: typeof r.location === "string" ? r.location : undefined,
      sourceUrl: requireUrl(r.sourceUrl, `awards[${i}].sourceUrl`)
    };
  });
}

export function validateImpact(data: unknown) {
  if (!Array.isArray(data)) throw new Error("impact must be an array");
  return data.map((x, i) => {
    const r = x as AnyRecord;
    return {
      title: requireString(r.title, `impact[${i}].title`),
      date: requireString(r.date, `impact[${i}].date`),
      description: requireString(r.description, `impact[${i}].description`),
      location: typeof r.location === "string" ? r.location : undefined,
      sourceUrl: requireUrl(r.sourceUrl, `impact[${i}].sourceUrl`)
    };
  });
}

export function validateVideos(data: unknown) {
  if (!Array.isArray(data)) throw new Error("videos must be an array");
  return data.map((x, i) => {
    const r = x as AnyRecord;
    return {
      title: requireString(r.title, `videos[${i}].title`),
      videoId: requireString(r.videoId, `videos[${i}].videoId`),
      date: typeof r.date === "string" ? r.date : undefined,
      group: typeof r.group === "string" ? r.group : undefined
    };
  });
}

/**
 * Log validation warnings in development
 */
export function logValidationWarning(dataType: string, isValid: boolean): void {
  if (!isValid && process.env.NODE_ENV === 'development') {
    console.warn(`${dataType} data validation failed - some items may have missing required fields`);
  }
}
