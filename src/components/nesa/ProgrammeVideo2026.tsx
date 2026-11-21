import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getYouTubeEmbedUrl } from "@/lib/youtube";

export function ProgrammeVideo2026({ videoId, title }: { videoId: string; title: string }) {
  const [playing, setPlaying] = useState(false);
  const { t } = useTranslation("pages");
  return <figure><div className="relative aspect-video overflow-hidden rounded-lg border border-gold/20 bg-charcoal">
    {playing ? <iframe src={`${getYouTubeEmbedUrl(videoId)}?autoplay=1`} title={title} className="absolute inset-0 h-full w-full" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen /> : <Button type="button" variant="outline" className="absolute inset-0 h-full w-full border-0" onClick={() => setPlaying(true)} aria-label={t("programme2026.play", { defaultValue: "Play {{title}}", title })}><Play className="mr-2 h-8 w-8" />{t("programme2026.playButton", "Play video")}</Button>}
  </div><figcaption className="mt-3 text-sm">{title}</figcaption></figure>;
}