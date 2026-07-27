// Influencer Education Impact — non-structural discovery tags.
//
// GOVERNANCE (see docs/refactor/governance-clarifications.md §2)
//   - Influencer has 3 pathways (Social Media / Sports / Music).
//   - Each pathway has 2 STRUCTURAL subcategories (6 total). Those are the
//     units the EDI Matrix and the recognition schema operate against.
//   - The lists below are DISCOVERY / FILTER TAGS surfaced on the nominee
//     profile and directory. They do NOT feed site_stats.subcategories,
//     do NOT have their own EDI Matrix, and are NOT selectable as the
//     nomination's `subcategory_id`.
//   - The Influencer nomination form binds this second dropdown to a
//     `impact_area_tags text[]` column, not to `subcategory_id`.

export type InfluencerPathwaySlug = "social-media" | "sports" | "music";

export interface InfluencerImpactAreaTag {
  slug: string;
  label: string;
}

export const INFLUENCER_IMPACT_AREA_TAGS: Record<
  InfluencerPathwaySlug,
  InfluencerImpactAreaTag[]
> = {
  "social-media": [
    { slug: "educational-content-creation", label: "Educational Content Creation" },
    { slug: "literacy-reading-advocacy", label: "Literacy and Reading Advocacy" },
    { slug: "digital-learning-advocacy", label: "Digital Learning Advocacy" },
    { slug: "stem-promotion", label: "STEM Promotion" },
    { slug: "girls-education-advocacy", label: "Girls' Education Advocacy" },
    { slug: "teacher-recognition", label: "Teacher Recognition and Support" },
    { slug: "youth-mentorship", label: "Youth Mentorship" },
    { slug: "african-history-culture", label: "African History and Cultural Education" },
    { slug: "policy-awareness", label: "Education Policy Awareness" },
    { slug: "scholarship-signposting", label: "Scholarship and Opportunity Signposting" },
  ],
  sports: [
    { slug: "athlete-scholar-programs", label: "Athlete-Scholar Programs" },
    { slug: "school-sports-development", label: "School Sports Development" },
    { slug: "youth-coaching-academies", label: "Youth Coaching Academies" },
    { slug: "girls-in-sport", label: "Girls in Sport" },
    { slug: "para-sport-inclusion", label: "Para-Sport & Inclusion" },
    { slug: "grassroots-facility-support", label: "Grassroots Facility Support" },
    { slug: "life-skills-through-sport", label: "Life Skills through Sport" },
    { slug: "anti-doping-integrity", label: "Anti-Doping & Integrity Education" },
    { slug: "post-career-education", label: "Post-Career Education Pathways" },
    { slug: "community-tournaments", label: "Community Tournaments for School Support" },
  ],
  music: [
    { slug: "music-education-programs", label: "Music Education Programs" },
    { slug: "school-instrument-drives", label: "School Instrument Drives" },
    { slug: "songs-for-social-change", label: "Songs for Social Change" },
    { slug: "cultural-heritage-preservation", label: "Cultural Heritage Preservation" },
    { slug: "youth-choir-band-development", label: "Youth Choir & Band Development" },
    { slug: "scholarship-benefit-concerts", label: "Scholarship Benefit Concerts" },
    { slug: "mental-health-through-music", label: "Mental Health Through Music" },
    { slug: "language-learning-through-song", label: "Language Learning Through Song" },
    { slug: "girls-in-music-education", label: "Girls in Music Education" },
    { slug: "diaspora-african-music-education", label: "Diaspora–African Music Education Bridges" },
  ],
};

export function getInfluencerImpactAreaTags(
  pathway: InfluencerPathwaySlug,
): InfluencerImpactAreaTag[] {
  return INFLUENCER_IMPACT_AREA_TAGS[pathway] ?? [];
}
