import { z } from "zod";

export const researchCandidateSchema = z.object({
  name: z.string().min(3).max(350),
  source_file: z.string().endsWith(".pdf"),
  source_page: z.number().int().positive(),
  source_row: z.number().int().positive(),
  source_section: z.string(),
  source_region: z.string(),
  category_slug: z.string().min(1),
  pathway_slug: z.string().min(1),
  dedupe_key: z.string().regex(/^[a-f0-9]{64}$/),
  raw_text: z.array(z.string()),
  nomination_status: z.literal("under_review"),
  publication_status: z.literal("unpublished"),
  nrc_verified: z.literal(false),
  nomination_source: z.literal("Research compilation — attached award PDFs"),
  mapping_status: z.literal("requires_nrc_mapping"),
  evidence_status: z.literal("source_claim_unverified"),
}).passthrough();
export const researchManifestSchema = z.array(researchCandidateSchema).max(5000);
export type ResearchCandidate = z.infer<typeof researchCandidateSchema>;
export function normalizeResearchName(name: string) {
  return name.normalize("NFKC").toLocaleLowerCase("en").replace(/[^\p{L}\p{N}_]+/gu, " ").trim();
}
export function dedupeResearchCandidates(entries: ResearchCandidate[]) {
  const seen = new Set<string>();
  return entries.filter((entry) => {
    const key = `${entry.category_slug}|${entry.pathway_slug}|${normalizeResearchName(entry.name)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}