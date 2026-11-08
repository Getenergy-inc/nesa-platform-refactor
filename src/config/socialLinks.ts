export const SOCIAL_PLATFORMS = ["facebook", "instagram", "linkedin", "twitter", "youtube"] as const;
export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];

/**
 * Canonical NESA Follow destinations, matching the existing global footer.
 * Social-share and nominee-owned profile URLs intentionally live elsewhere.
 */
export const SOCIAL_PROFILE_URLS: Record<SocialPlatform, string> = {
  facebook: "https://facebook.com/nesaafrica",
  instagram: "https://instagram.com/nesaafrica",
  linkedin: "https://linkedin.com/company/nesa-africa",
  twitter: "https://twitter.com/nesaafrica",
  youtube: "https://www.youtube.com/@Nesa.africaTV",
};

export const SOCIAL_LINKS: ReadonlyArray<{ platform: SocialPlatform; label: string; href: string }> = [
  { platform: "facebook", label: "Facebook", href: SOCIAL_PROFILE_URLS.facebook },
  { platform: "instagram", label: "Instagram", href: SOCIAL_PROFILE_URLS.instagram },
  { platform: "linkedin", label: "LinkedIn", href: SOCIAL_PROFILE_URLS.linkedin },
  { platform: "twitter", label: "X (Twitter)", href: SOCIAL_PROFILE_URLS.twitter },
  { platform: "youtube", label: "YouTube", href: SOCIAL_PROFILE_URLS.youtube },
];
