import { useState } from "react";
import { Play } from "lucide-react";

export function ClickToLoadVideo({ id, title, caption }: { id: string; title: string; caption?: string }) {
  const [on, setOn] = useState(false);
  return (
    <figure>
      <div className="relative aspect-video overflow-hidden rounded-2xl bg-ea-deep">
        {on ? (
          <iframe className="absolute inset-0 h-full w-full" src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`} title={title} loading="lazy" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
        ) : (
          <button type="button" onClick={() => setOn(true)} className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-ea-cream" aria-label={`Play video: ${title}`}>
            <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-50" />
            <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-ea-green"><Play className="h-7 w-7" aria-hidden /></span>
            <span className="relative text-sm font-semibold">{title} · loads from YouTube on click</span>
          </button>
        )}
      </div>
      {caption && <figcaption className="mt-2 text-xs text-ea-muted">{caption}</figcaption>}
    </figure>
  );
}
