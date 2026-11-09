/** School intervention actions are independent of NESA award nomination. */
export const SCHOOL_SUPPORT_ACTIONS = {
  nominate: { href: "/impact/nominate-school", label: "Nominate a Special-Needs School in Africa", shortLabel: "Nominate a School" },
  support: { href: "/impact/special-needs-schools", label: "Support a Special-Needs School in Africa", shortLabel: "Support a Verified School" },
} as const;

/** Fail closed until the programme supplies explicit publication approval. */
export function canPublishSupportSchool(record: { verificationStatus?: string | null; publicationApproved?: boolean | null }): boolean {
  return record.verificationStatus === "verified" && record.publicationApproved === true;
}