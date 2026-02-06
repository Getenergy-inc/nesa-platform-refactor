import { getYouTubeEmbedUrl } from "@/lib/youtube";

type Video = {
  title: string;
  videoId: string;
  date?: string;
  group?: string;
};

export function VideoGallery({ videos }: { videos: Video[] }) {
  const grouped = videos.reduce<Record<string, Video[]>>((acc, v) => {
    const key = v.group ?? "Videos";
    acc[key] = acc[key] || [];
    acc[key].push(v);
    return acc;
  }, {});

  return (
    <section className="space-y-8">
      {Object.entries(grouped).map(([group, items]) => (
        <div key={group} className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">{group}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((v) => (
              <article 
                key={v.videoId} 
                className="p-3 border border-white/10 bg-secondary/5 rounded-xl shadow-card hover:shadow-lg hover:border-primary/30 transition-all"
              >
                <h3 className="text-base font-semibold text-white mb-2">{v.title}</h3>
                {v.date && (
                  <p className="text-xs text-white/50 mb-2">{v.date}</p>
                )}
                <div className="relative pt-[56.25%]">
                  <iframe
                    src={getYouTubeEmbedUrl(v.videoId)}
                    title={v.title}
                    className="absolute inset-0 w-full h-full border-0 rounded-lg"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
