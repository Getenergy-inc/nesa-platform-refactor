// NESA Africa TV — Showcase Configuration
// Two flagship showcases, each pairing two recognition families.

export interface AwardTVShow {
  /** Primary identifier for the showcase. */
  awardId: string;
  /** Every award/recognition family covered by this showcase. */
  awardIds: string[];
  showName: string;
  /** Short label, e.g. "TV Showcase 1". */
  showcaseLabel: string;
  /** Human-readable pairing, e.g. "Platinum + Influencer Education Impact". */
  pairing: string;
  /** Segments inside the showcase (used for the tabulated dropdown view). */
  segments: { id: string; title: string; focus: string; episodes: number }[];
  description: string;
  videoType: "youtube" | "local";
  videoUrl: string;
  thumbnailUrl?: string;
  duration: string;
  episodes: number;
  features: string[];
  socialLinks: {
    youtube: string;
    linkedin: string;
    twitter: string;
    instagram: string;
    facebook: string;
  };
}

// Channel URL for linking (not embedding)
export const NESA_YOUTUBE_CHANNEL = "https://www.youtube.com/@Nesa.africaTV";

// Social links shared across all shows
const sharedSocialLinks = {
  youtube: NESA_YOUTUBE_CHANNEL,
  linkedin: "https://linkedin.com/company/nesa-africa",
  twitter: "https://twitter.com/nesaafrica",
  instagram: "https://instagram.com/nesaafrica",
  facebook: "https://facebook.com/nesaafrica",
};

export const awardTVShows: AwardTVShow[] = [
  {
    awardId: "showcase-1",
    awardIds: ["platinum", "influencer", "influencer-education-impact"],
    showcaseLabel: "TV Showcase 1",
    showName: "TV Showcase 1 — Platinum + Influencer Education Impact",
    pairing: "Platinum + Influencer Education Impact",
    description:
      "Platinum Recognition recipients and Influencer Education Impact enablers in one broadcast — NRC-verified profiles, impact stories and certificate presentations.",
    segments: [
      {
        id: "platinum",
        title: "Platinum Recognition",
        focus: "NRC-verified enabler profiles, impact evidence and certificate presentations.",
        episodes: 12,
      },
      {
        id: "influencer-education-impact",
        title: "Influencer Education Impact",
        focus: "Creators, broadcasters and advocates moving education outcomes across Africa.",
        episodes: 8,
      },
    ],
    videoType: "youtube",
    videoUrl: "https://www.youtube.com/embed/nQCXDX_X3rs",
    duration: "3 hours",
    episodes: 20,
    features: ["NRC-verified nominees", "Impact stories", "Certificate ceremonies"],
    socialLinks: sharedSocialLinks,
  },
  {
    awardId: "showcase-2",
    awardIds: ["icon", "gold", "blue-garnet", "gold-blue-garnet"],
    showcaseLabel: "TV Showcase 2",
    showName: "TV Showcase 2 — Icon + Gold-Blue Garnet",
    pairing: "Icon + Gold-Blue Garnet",
    description:
      "Africa Education Icon lifetime honours alongside the Gold-Blue Garnet competitive track — legacy documentaries, finalist profiles and Gala countdown.",
    segments: [
      {
        id: "icon",
        title: "Africa Education Icon",
        focus: "Lifetime achievement documentaries and legacy interviews.",
        episodes: 9,
      },
      {
        id: "gold-blue-garnet",
        title: "Gold-Blue Garnet",
        focus: "Regional spotlights, finalist profiles, jury insights and Gala countdown.",
        episodes: 21,
      },
    ],
    videoType: "youtube",
    videoUrl: "https://www.youtube.com/embed/Hdu_qlFLfrQ",
    duration: "3 hours",
    episodes: 30,
    features: ["Finalist profiles", "Legacy interviews", "Gala countdown"],
    socialLinks: sharedSocialLinks,
  },
];

// Helper to get the showcase covering a given award/recognition family
export const getTVShowByAward = (awardId: string): AwardTVShow | undefined => {
  return awardTVShows.find(
    (show) => show.awardId === awardId || show.awardIds.includes(awardId),
  );
};
