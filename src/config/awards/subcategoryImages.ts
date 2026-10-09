// subcategoryImages.ts — deterministic image resolution for every subcategory
// and pathway card rendered on the 22 award category pages.
//
// Resolution order:
//   1. Explicit code/slug map (Icon + Influencer pathways, known category art)
//   2. Keyword match of the subcategory name against the editorial story pool
//   3. Parent-category hero image
//   4. Tier hero image
//   5. Deterministic pick from the story pool (stable per name)

import iconPhil from "@/assets/story/icon-phil.jpg";
import iconLit from "@/assets/story/icon-lit.jpg";
import iconTech from "@/assets/story/icon-tech.jpg";
import infSoc from "@/assets/story/inf-soc.jpg";
import infSpt from "@/assets/story/inf-spt.jpg";
import infMus from "@/assets/story/inf-mus.jpg";
import lib from "@/assets/story/best-tertiary-institution-library.jpg";
import rnd from "@/assets/story/research-development-education.jpg";
import chr from "@/assets/story/christian-education-impact.jpg";
import isl from "@/assets/story/islamic-education-impact.jpg";
import pol from "@/assets/story/political-leadership-education.jpg";
import intl from "@/assets/story/international-partnership-education.jpg";
import dia from "@/assets/story/diaspora-association-education.jpg";
import csrAfr from "@/assets/story/csr-education-africa.jpg";
import csrNg from "@/assets/story/csr-education-nigeria.jpg";
import edtech from "@/assets/story/edutech-organisation-africa.jpg";
import media from "@/assets/story/media-education-advocacy-nigeria.jpg";
import ngoNg from "@/assets/story/ngo-education-nigeria.jpg";
import ngoAfr from "@/assets/story/ngo-education-africa.jpg";
import stem from "@/assets/story/stem-education-africa.jpg";
import arts from "@/assets/story/creative-arts-education-nigeria.jpg";
import state from "@/assets/story/education-friendly-state-nigeria.jpg";

import { getStoryHeroImage } from "@/config/awards/subpageHeroImages";

const EXPLICIT: Record<string, string> = {
  "icon-phil": iconPhil,
  "icon-lit": iconLit,
  "icon-tech": iconTech,
  "inf-soc": infSoc,
  "inf-spt": infSpt,
  "inf-mus": infMus,
};

/** Keyword → image. First match wins (order matters — most specific first). */
const KEYWORDS: [RegExp, string][] = [
  [/librar|archive|reading room/i, lib],
  [/research|innovation lab|r&d|development institute/i, rnd],
  [/christian|church|mission|faith-based christian/i, chr],
  [/islam|muslim|madrasa|qur/i, isl],
  [/policy|minist|governor|political|state house|parliament/i, pol],
  [/bilateral|international|embassy|foreign|partnership|multilateral/i, intl],
  [/diaspora/i, dia],
  [/csr|corporate|bank|telecom|private sector/i, csrAfr],
  [/edtech|edu-?tech|digital|platform|e-?learning|ai /i, edtech],
  [/media|broadcast|journalis|radio|tv|advocacy/i, media],
  [/ngo|non-?profit|foundation|charity|civil society/i, ngoAfr],
  [/stem|science|technology|engineering|maths?|robotic|coding/i, stem],
  [/creative|arts|music|culture|drama|film/i, arts],
  [/sport|athlet|football/i, infSpt],
  [/influencer|social media|creator/i, infSoc],
  [/philanthrop|donor|scholarship|grant/i, iconPhil],
  [/curriculum|literary|author|book|publish/i, iconLit],
  [/technical|vocational|tvet|artisan|skills?/i, iconTech],
  [/school|teacher|pupil|learner|basic education/i, state],
  [/nigeria/i, csrNg],
  [/africa/i, ngoNg],
];

const POOL = [
  lib, rnd, chr, isl, pol, intl, dia, csrAfr, csrNg, edtech,
  media, ngoNg, ngoAfr, stem, arts, state, iconPhil, iconLit, iconTech,
  infSoc, infSpt, infMus,
];

function hash(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i += 1) h = (h * 31 + input.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function getSubcategoryImage(
  identifier: string,
  name: string,
  fallbackSlugs: (string | undefined)[] = [],
): string {
  const key = identifier.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  if (EXPLICIT[key]) return EXPLICIT[key];

  const direct = getStoryHeroImage(key);
  if (direct) return direct;

  for (const [re, img] of KEYWORDS) {
    if (re.test(name) || re.test(key)) return img;
  }

  for (const slug of fallbackSlugs) {
    if (!slug) continue;
    const img = getStoryHeroImage(slug);
    if (img) return img;
  }

  return POOL[hash(key + name) % POOL.length];
}
