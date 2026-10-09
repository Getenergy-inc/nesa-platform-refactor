import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getYouTubeEmbedUrl } from "@/lib/youtube";

interface CategoryVideoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  videoId: string;
  videoTitle: string;
  categoryName: string;
  categoryDescription: string;
  categorySlug: string;
}

export function CategoryVideoModal({
  open,
  onOpenChange,
  videoId,
  videoTitle,
  categoryName,
  categoryDescription,
  categorySlug,
}: CategoryVideoModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-charcoal border-white/10 p-0 overflow-hidden">
        <div className="aspect-video w-full bg-black">
          {open && (
            <iframe
              key={videoId}
              src={`${getYouTubeEmbedUrl(videoId)}?autoplay=1&rel=0`}
              title={videoTitle}
              className="w-full h-full"
              allow="accelerated-2d-canvas; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          )}
        </div>
        <div className="p-5">
          <DialogHeader>
            <DialogTitle className="text-white text-lg">{categoryName}</DialogTitle>
            <DialogDescription className="text-white/60 text-sm">
              {categoryDescription}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex justify-end">
            <Link to={`/categories/${categorySlug}`} onClick={() => onOpenChange(false)}>
              <Button size="sm" className="bg-gold text-charcoal hover:bg-gold/90 rounded-full">
                Explore Category
                <ArrowRight className="ml-2 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
