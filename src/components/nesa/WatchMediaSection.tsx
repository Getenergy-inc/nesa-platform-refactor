import { Play, Video } from "lucide-react";
import { Button } from "@/components/ui/button";

export function WatchMediaSection() {
  return (
    <section id="watch" className="bg-nesa-navy-dark py-16 md:py-20">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Watch: NESA-Africa
          </h2>
          <p className="text-nesa-text-muted max-w-2xl mx-auto">
            Watch the vision behind NESA Africa, past award highlights, and exclusive interviews
            with African educators shaping the future of education.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="aspect-video bg-nesa-navy rounded-2xl border border-nesa-gold/20 flex items-center justify-center mb-6">
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-nesa-gold/20 flex items-center justify-center mx-auto mb-4">
                <Play className="h-8 w-8 text-nesa-gold" />
              </div>
              <p className="text-nesa-text-muted">NESA-Africa Video</p>
            </div>
          </div>

          <div className="flex justify-center">
            <Button variant="outline" className="border-nesa-gold text-nesa-gold hover:bg-nesa-gold/10 rounded-full gap-2">
              <Video className="h-4 w-4" />
              View Media Hub
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
