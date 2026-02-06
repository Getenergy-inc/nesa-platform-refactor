/**
 * YouTube Utilities
 * Privacy-enhanced YouTube embed helpers
 */

// YouTube embed base URL (privacy-enhanced)
export const YOUTUBE_EMBED_BASE = "https://www.youtube-nocookie.com/embed";

// Channel information
export const YOUTUBE_CHANNEL = {
  id: "Nesa.africaTV",
  url: "https://www.youtube.com/@Nesa.africaTV",
  name: "NESA Africa TV",
};

export interface EmbedOptions {
  rel?: boolean;
  modestbranding?: boolean;
  autoplay?: boolean;
  controls?: boolean;
  loop?: boolean;
  mute?: boolean;
  start?: number;
}

/**
 * Get the privacy-enhanced embed URL for a YouTube video
 */
export function getEmbedUrl(videoId: string, options?: EmbedOptions): string {
  const params = new URLSearchParams();
  
  if (options?.rel === false) params.set('rel', '0');
  if (options?.modestbranding !== false) params.set('modestbranding', '1');
  if (options?.autoplay) params.set('autoplay', '1');
  if (options?.controls === false) params.set('controls', '0');
  if (options?.loop) params.set('loop', '1');
  if (options?.mute) params.set('mute', '1');
  if (options?.start) params.set('start', String(options.start));
  
  const queryString = params.toString();
  return `${YOUTUBE_EMBED_BASE}/${videoId}${queryString ? `?${queryString}` : ''}`;
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
  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
}

/**
 * Extract video ID from various YouTube URL formats
 */
export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  return null;
}

/**
 * Check if a string is a valid YouTube video ID
 */
export function isValidVideoId(id: string): boolean {
  return /^[a-zA-Z0-9_-]{11}$/.test(id);
}
