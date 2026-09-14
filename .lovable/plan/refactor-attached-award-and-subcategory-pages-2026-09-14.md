# Refactor attached award and subcategory pages

## Scope
Update the existing award ecosystem for the nine attached research documents without changing established category routes, tier assignments, StageGate rules, NRC workflow, or Icon/Influencer separation.

## Page and taxonomy updates
- Map each document to its existing canonical award category: CSR Africa, EduTech Africa, STEM Africa, Islamic Education, Christian Education, International Partnership, NGO Africa, Foundation/Icon pathways, and the three Influencer pathways.
- Replace generic subcategory copy with the document-backed structures and descriptions.
- Treat STEM as a two-layer model: four official nomination pathways, with the three thematic research lenses shown as supporting filters/context.
- Present the ten documented geographic groupings consistently: West, East, Central, Southern, North, Horn, Sahel, Indian Ocean Islands, African Diaspora/continental where applicable, and Friends of Africa.
- Give each subcategory a real, linkable detail view with its scope, evidence standard, eligible nominee types, nomination link, and matching nominee gallery.
- Update category introductions, evidence notes, totals, and FAQs from confirmed document facts only. Clearly label research leads and avoid presenting them as verified winners or finalists.

## Candidate import
- Parse specifically named people, organisations, institutions, programmes, and partnerships from all nine PDFs.
- Exclude generic placeholders such as “other organisations,” unnamed sector groups, and broad programme types that are not identifiable nominees.
- Deduplicate exact normalized names inside the same category/subcategory while preserving legitimate cross-category appearances.
- Preserve document evidence grade, region, country, period, impact summary, and source-document provenance.
- Stage all imported candidates for NRC review; do not mark C/D research leads as verified or editorially featured.
- Keep individual portraits as branded awaiting-confirmation fallbacks and organisation logos under the existing verified-media rules.

## Implementation details
- Extend the canonical 18-category registry and shared detailed-page content rather than creating parallel award pages.
- Add a document-backed research configuration for category/subcategory definitions, thematic lenses, region labels, and source notes.
- Refactor the shared category and subcategory templates to render the new structure, counts, filters, and nominee links.
- Import candidates into the existing nominee/research-review pipeline using current slugs and acceptance/NRC states; no new public verification claims.
- Keep Influencer Social Media, Music, and Sports as three separate pathways and galleries.

## Validation
- Verify category and subcategory routes, nomination links, `#existing-nominees`, gallery/profile links, branded media fallbacks, and mobile layout.
- Check imported totals by source, category, subcategory, evidence grade, region, and publication/review state.
- Run focused taxonomy, navigation, nominee-image, and page tests, then browser-check representative desktop and mobile pages.
- Report imported versus skipped rows, duplicate handling, and any document rows that cannot be safely mapped.
