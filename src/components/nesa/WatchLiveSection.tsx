import { Youtube, Facebook, Tv } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export function WatchLiveSection() {
  const { t } = useTranslation("pages");

  return (
    <section className="bg-charcoal py-16 md:py-20">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            {t("landing.watchLive.title")}
          </h2>
          <p className="text-white/70 mb-8">
            {t("landing.watchLive.description")}
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button
              variant="outline"
              size="lg"
              className="border-gold/40 text-gold hover:bg-gold/10 rounded-full gap-2"
            >
              <Youtube className="h-5 w-5" />
              YouTube
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-gold/40 text-gold hover:bg-gold/10 rounded-full gap-2"
            >
              <Facebook className="h-5 w-5" />
              Facebook
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-gold/40 text-gold hover:bg-gold/10 rounded-full gap-2"
            >
              <Tv className="h-5 w-5" />
              {t("landing.watchLive.castTV")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
