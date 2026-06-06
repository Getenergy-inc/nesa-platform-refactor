// Config-driven status resolver for Google Forms nomination intake.
//
// Rule: if a form record is declared `Link Pending` but BOTH a non-empty
// `formPublicUrl` and `formEmbedUrl` have been pasted in, the form is
// auto-promoted to `Active`. All other declared statuses
// (Active, Draft, Coming Soon, Closed, Replaced) are passed through unchanged.
//
// This means the data team only needs to paste the two URLs into
// awardCategoryForms.ts / rmsaRegionalForms.ts — no second edit to flip status.
//
// Used by the resolved exports in those config files; raw arrays remain
// available for the admin / mapping register.

import type { FormStatus } from "./types";

export interface FormUrlPair {
  status: FormStatus;
  formPublicUrl: string;
  formEmbedUrl: string;
}

export function hasUsableFormUrls(form: FormUrlPair): boolean {
  return (
    typeof form.formPublicUrl === "string" &&
    form.formPublicUrl.trim().length > 0 &&
    typeof form.formEmbedUrl === "string" &&
    form.formEmbedUrl.trim().length > 0
  );
}

/**
 * Returns the effective status for display.
 * Promotes `Link Pending` → `Active` when both URLs are present.
 * Leaves every other status untouched.
 */
export function resolveFormStatus(form: FormUrlPair): FormStatus {
  if (form.status === "Link Pending" && hasUsableFormUrls(form)) {
    return "Active";
  }
  return form.status;
}

/** Apply the resolver to a record, returning a new object with the resolved status. */
export function withResolvedStatus<T extends FormUrlPair>(form: T): T {
  const resolved = resolveFormStatus(form);
  return resolved === form.status ? form : { ...form, status: resolved };
}

/** Map across an array of records, resolving each one. */
export function withResolvedStatuses<T extends FormUrlPair>(forms: T[]): T[] {
  return forms.map(withResolvedStatus);
}

/**
 * Returns true when a form was auto-promoted by the resolver:
 * raw status is "Link Pending" but the resolved status is "Active".
 * Only possible when both form URLs are present.
 */
export function isAutoPromoted(raw: FormUrlPair, resolved: FormUrlPair): boolean {
  return raw.status === "Link Pending" && resolved.status === "Active";
}
