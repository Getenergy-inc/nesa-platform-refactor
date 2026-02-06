/**
 * Videos Data
 * All video content for NESA Africa TV and media hub
 * Uses youtube-nocookie.com for privacy-enhanced embeds
 */

export interface Video {
  id: string;
  videoId: string; // YouTube video ID
  title: string;
  description?: string;
  duration?: string;
  views?: string;
  date: string;
  playlist?: string;
  featured?: boolean;
}

export interface VideoPlaylist {
  id: string;
  name: string;
  description?: string;
}

// YouTube embed base URL (privacy-enhanced)
export const YOUTUBE_EMBED_BASE = "https://www.youtube-nocookie.com/embed";

// Channel information
export const YOUTUBE_CHANNEL = {
  id: "Nesa.africaTV",
  url: "https://www.youtube.com/@Nesa.africaTV",
  name: "NESA Africa TV",
};

// Video playlists
export const playlists: VideoPlaylist[] = [
  { id: "featured", name: "Featured", description: "Top featured content" },
  { id: "shows", name: "Shows", description: "Regular programming and shows" },
  { id: "events", name: "Events", description: "Award ceremonies and summits" },
  { id: "documentaries", name: "Documentaries", description: "Educational documentaries" },
];

// All videos
export const videos: Video[] = [
  {
    id: "platinum-show-special",
    videoId: "MrErQY7qWRs",
    title: "The Platinum Show - Special Edition",
    description: "Exclusive interview with education champions across Africa",
    duration: "1:45:00",
    views: "2.5K views",
    date: "Feb 2025",
    playlist: "shows",
    featured: true,
  },
  {
    id: "education-summit-2025",
    videoId: "Hdu_qlFLfrQ",
    title: "Education for All Summit 2025",
    description: "Highlights from the continental education summit",
    duration: "2:30:00",
    views: "3.8K views",
    date: "Jan 2025",
    playlist: "events",
    featured: true,
  },
  {
    id: "nominations-2025",
    videoId: "VDVRZrPwNRA",
    title: "NESA Africa 2025 Nominations Announcement",
    description: "Official announcement of the 2025 award season nominees",
    duration: "45:00",
    views: "5.2K views",
    date: "Jan 2025",
    playlist: "events",
    featured: true,
  },
  {
    id: "meet-judges-2025",
    videoId: "aP0SskrfioI",
    title: "Meet the Judges - Season 2025",
    description: "Introduction to the distinguished NESA Africa 2025 judging panel",
    duration: "1:00:00",
    views: "4.1K views",
    date: "Jan 2025",
    playlist: "shows",
    featured: true,
  },
  {
    id: "rebuild-my-school",
    videoId: "DDREAU_bmRk",
    title: "Rebuild My School Africa Documentary",
    description: "Documentary showcasing school infrastructure initiatives across Africa",
    duration: "35:00",
    views: "8.7K views",
    date: "Dec 2024",
    playlist: "documentaries",
    featured: true,
  },
  {
    id: "gala-highlights-2025",
    videoId: "nQCXDX_X3rs",
    title: "NESA Africa Awards 2025 Gala Highlights",
    description: "Best moments from the NESA Africa 2025 Awards Gala ceremony",
    duration: "1:20:00",
    views: "15K views",
    date: "Nov 2024",
    playlist: "events",
    featured: true,
  },
];

/**
 * Get the embed URL for a video
 */
export function getEmbedUrl(videoId: string, options?: { 
  rel?: boolean; 
  modestbranding?: boolean;
  autoplay?: boolean;
}): string {
  const params = new URLSearchParams();
  if (options?.rel === false) params.set('rel', '0');
  if (options?.modestbranding !== false) params.set('modestbranding', '1');
  if (options?.autoplay) params.set('autoplay', '1');
  
  const queryString = params.toString();
  return `${YOUTUBE_EMBED_BASE}/${videoId}${queryString ? `?${queryString}` : ''}`;
}

/**
 * Validate videos data at runtime
 */
export function validateVideos(): boolean {
  return videos.every(video => 
    video.id && 
    video.videoId && 
    video.videoId.length === 11 && // YouTube video IDs are 11 characters
    video.title && 
    video.date
  );
}

/**
 * Get videos by playlist
 */
export function getVideosByPlaylist(playlistId: string): Video[] {
  return videos.filter(video => video.playlist === playlistId);
}

/**
 * Get featured videos
 */
export function getFeaturedVideos(): Video[] {
  return videos.filter(video => video.featured);
}

/**
 * Get the main featured video
 */
export function getMainFeaturedVideo(): Video | undefined {
  return videos.find(video => video.featured);
}
