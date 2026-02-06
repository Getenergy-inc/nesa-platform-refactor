/**
 * Videos Data
 * All video content for NESA Africa TV and media hub
 * Uses youtube-nocookie.com for privacy-enhanced embeds
 */

export interface Video {
  title: string;
  videoId: string;
  date: string;
  group?: string;
}

export const videos: Video[] = [
  {
    title: "The Platinum Show - Special Edition",
    videoId: "MrErQY7qWRs",
    date: "2025-02-01",
    group: "Shows",
  },
  {
    title: "Education for All Summit 2025",
    videoId: "Hdu_qlFLfrQ",
    date: "2025-01-15",
    group: "Events",
  },
  {
    title: "NESA Africa 2025 Nominations Announcement",
    videoId: "VDVRZrPwNRA",
    date: "2025-01-10",
    group: "Events",
  },
  {
    title: "Meet the Judges - Season 2025",
    videoId: "aP0SskrfioI",
    date: "2025-01-05",
    group: "Shows",
  },
  {
    title: "Rebuild My School Africa Documentary",
    videoId: "DDREAU_bmRk",
    date: "2024-12-15",
    group: "Documentaries",
  },
  {
    title: "NESA Africa Awards 2025 Gala Highlights",
    videoId: "nQCXDX_X3rs",
    date: "2024-11-20",
    group: "Events",
  },
];

/**
 * Get unique video groups
 */
export function getVideoGroups(): string[] {
  const groups = new Set(videos.map(v => v.group).filter(Boolean) as string[]);
  return Array.from(groups);
}

/**
 * Get videos by group
 */
export function getVideosByGroup(group: string): Video[] {
  return videos.filter(video => video.group === group);
}

/**
 * Validate videos data at runtime
 */
export function validateVideos(): boolean {
  return videos.every(video => 
    video.title && 
    video.videoId && 
    video.videoId.length === 11 &&
    video.date
  );
}
