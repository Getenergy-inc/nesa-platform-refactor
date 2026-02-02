// Award TV Shows Configuration
// Maps each award tier to its dedicated TV show

export interface AwardTVShow {
  awardId: string;
  showName: string;
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
    awardId: "platinum",
    showName: "The Platinum Show",
    description: "Celebrating Platinum Certificate recipients and their contributions to education across Africa. Deep-dive profiles, impact stories, and certificate ceremonies.",
    videoType: "youtube",
    videoUrl: "https://www.youtube.com/embed/nQCXDX_X3rs",
    thumbnailUrl: "/assets/platinum-show-thumbnail.jpg",
    duration: "3 hours",
    episodes: 12,
    features: ["NRC-verified nominees", "Impact stories", "Certificate ceremonies"],
    socialLinks: sharedSocialLinks,
  },
  {
    awardId: "gold",
    showName: "The Gold Show",
    description: "Public voting updates, regional competitions, and Gold Certificate winner announcements. Live coverage from all 5 African regions.",
    videoType: "youtube",
    videoUrl: "https://www.youtube.com/embed/aP0SskrfioI",
    thumbnailUrl: "/assets/gold-show-thumbnail.jpg",
    duration: "3 hours",
    episodes: 15,
    features: ["Live voting updates", "Regional spotlights", "Winner announcements"],
    socialLinks: sharedSocialLinks,
  },
  {
    awardId: "blue-garnet",
    showName: "The Blue Garnet Show",
    description: "Behind the scenes of the highest honour — jury deliberations, finalist profiles, and Gala previews. Exclusive access to Africa's pinnacle education award.",
    videoType: "youtube",
    videoUrl: "https://www.youtube.com/embed/DDREAU_bmRk",
    thumbnailUrl: "/assets/blue-garnet-show-thumbnail.jpg",
    duration: "3 hours",
    episodes: 6,
    features: ["Finalist profiles", "Jury insights", "Gala countdown"],
    socialLinks: sharedSocialLinks,
  },
  {
    awardId: "icon",
    showName: "The Icon Show",
    description: "Profiles of Africa Education Icons — lifetime achievers who shaped the continent's education landscape. Documentary-style segments and legacy interviews.",
    videoType: "youtube",
    videoUrl: "https://www.youtube.com/embed/Hdu_qlFLfrQ",
    thumbnailUrl: "/assets/icon-show-thumbnail.jpg",
    duration: "3 hours",
    episodes: 9,
    features: ["Lifetime achievements", "Legacy interviews", "Documentary segments"],
    socialLinks: sharedSocialLinks,
  },
];

// Helper to get TV show by award ID
export const getTVShowByAward = (awardId: string): AwardTVShow | undefined => {
  return awardTVShows.find((show) => show.awardId === awardId);
};
