// Program Videos Configuration
// Mix of uploaded videos and YouTube links

export interface ProgramVideo {
  programId: string;
  programName: string;
  videoType: "local" | "youtube";
  videoUrl: string;
  thumbnailUrl?: string;
}

export const programVideos: ProgramVideo[] = [
  {
    programId: "nesa-anthem-video",
    programName: "NESA Africa Anthem - Official Music Video",
    videoType: "local",
    videoUrl: "/videos/nesa-africa-anthem-video.mp4",
    thumbnailUrl: "/assets/nesa-africa-song-1.jpeg"
  },
  {
    programId: "education-for-all-video",
    programName: "Education For All - Official Music Video",
    videoType: "local",
    videoUrl: "/videos/education-for-all-video.mp4",
    thumbnailUrl: "/assets/nesa-africa-song-2.jpeg"
  },
  {
    programId: "nesa-africa",
    programName: "NESA-Africa",
    videoType: "youtube",
    videoUrl: "https://www.youtube.com/embed/nQCXDX_X3rs",
    thumbnailUrl: "/assets/nesa-africa-stage-thumbnail.jpg"
  },
  {
    programId: "eduaid-africa",
    programName: "EduAid-Africa",
    videoType: "youtube",
    videoUrl: "https://www.youtube.com/embed/aP0SskrfioI",
    thumbnailUrl: "/assets/eduaid-africa-logo.jpg"
  },
  {
    programId: "rebuild-my-school",
    programName: "Rebuild My School Africa",
    videoType: "local",
    videoUrl: "/videos/program-video-1.mp4"
  },
  {
    programId: "women-girls",
    programName: "Women & Girls Education",
    videoType: "youtube",
    videoUrl: "https://www.youtube.com/embed/DDREAU_bmRk"
  },
  {
    programId: "special-needs",
    programName: "Special Needs Education",
    videoType: "youtube",
    videoUrl: "https://www.youtube.com/embed/Hdu_qlFLfrQ"
  },
  {
    programId: "education-online",
    programName: "Education Online Africa",
    videoType: "local",
    videoUrl: "/videos/program-video-2.mp4"
  },
  {
    programId: "elibrary",
    programName: "eLibrary Nigeria",
    videoType: "youtube",
    videoUrl: "https://www.youtube.com/embed/MrErQY7qWRs"
  }
];

// Helper to get video by program ID
export const getVideoByProgram = (programId: string): ProgramVideo | undefined => {
  return programVideos.find(v => v.programId === programId);
};

// Helper to get YouTube embed URL from watch URL
export const getYouTubeEmbedUrl = (url: string): string => {
  // Already an embed URL
  if (url.includes("/embed/")) return url;
  
  // Convert watch URL to embed
  const videoId = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|live\/))([\w-]+)/)?.[1];
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
};
