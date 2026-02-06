/**
 * YouTube Utilities
 * Privacy-enhanced YouTube embed helpers
 */

// Channel information
export const YOUTUBE_CHANNEL = {
  id: "Nesa.africaTV",
  url: "https://www.youtube.com/@Nesa.africaTV",
  name: "NESA Africa TV",
};

/**
 * Get the privacy-enhanced embed URL for a YouTube video
 * Uses nocookie to reduce tracking and avoid embedding full youtube pages
 */
export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}`;
}

/**
 * Get YouTube thumbnail URL
 */
export function getThumbnailUrl(videoId: string, quality: 'default' | 'medium' | 'high' | 'maxres' = 'high'): string {
  const qualityMap = {
    default: 'default',
    medium: 'mqdefault',
    high: 'hqdefault',
    maxres: 'maxresdefault',
  };
  return `https://img.youtube.com/vi/${encodeURIComponent(videoId)}/${qualityMap[quality]}.jpg`;
}

/**
 * Check if a string is a valid YouTube video ID
 */
export function isValidVideoId(id: string): boolean {
  return /^[a-zA-Z0-9_-]{11}$/.test(id);
}
