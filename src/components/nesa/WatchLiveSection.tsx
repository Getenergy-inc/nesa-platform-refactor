import { Youtube, Facebook, Tv } from "lucide-react";
import { Button } from "@/components/ui/button";

export function WatchLiveSection() {
  return (
    <section className="bg-charcoal py-16 md:py-20">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Watch Live
          </h2>
          <p className="text-secondary-foreground/70 mb-8">
            NESA Africa TV broadcasts on social media, partner stations, and the CAST TV box/app.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button
              variant="outline"
              size="lg"
              className="border-primary/30 text-primary hover:bg-primary/10 rounded-full gap-2"
            >
              <Youtube className="h-5 w-5" />
              YouTube
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-primary/30 text-primary hover:bg-primary/10 rounded-full gap-2"
            >
              <Facebook className="h-5 w-5" />
              Facebook
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-primary/30 text-primary hover:bg-primary/10 rounded-full gap-2"
            >
              <Tv className="h-5 w-5" />
              CAST TV App
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
