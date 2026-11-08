import { Tv, Trophy, CalendarDays, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { NOMINATION_WINDOW_LABEL } from "@/config/nominationWindows2026";
import { PROGRAMME_END_LABEL } from "@/config/programme";
import countdownTvImg from "@/assets/cards/countdown-tv-show.jpg";
import countdownVotingImg from "@/assets/cards/countdown-voting.jpg";
import countdownGalaImg from "@/assets/cards/countdown-gala.jpg";

interface ProgrammeCardProps {
  icon: typeof Tv;
  title: string;
  image: string;
  children: React.ReactNode;
}

function ProgrammeCard({ icon: Icon, title, image, children }: ProgrammeCardProps) {
  return (
    <article className="space-y-4">
      <div className="relative h-40 w-full overflow-hidden rounded-xl">
        <img src={image} alt="" className="h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/60 to-transparent" />
        <div className="absolute bottom-3 left-4 flex items-center gap-2">
          <Icon className="h-5 w-5 text-gold" aria-hidden />
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
      </div>
      <div className="rounded-xl border border-gold/20 bg-charcoal-light p-5 text-sm leading-relaxed text-white/75">
        {children}
      </div>
    </article>
  );
}

/** Static 2026 programme summary; no countdowns or public voting windows. */
export function UpcomingEventsSection() {
  const { t } = useTranslation("pages");
  return (
    <section className="bg-charcoal py-16 md:py-20">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-display text-3xl font-bold text-white md:text-4xl">
            {t("landing.upcomingEvents.title", { defaultValue: "2026–2027 Programme" })}
          </h2>
          <p className="mx-auto max-w-2xl text-white/70">
            {t("landing.upcomingEvents.description", {
              defaultValue: "Nomination, verified recognition, media and online programme dates in one place.",
            })}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <ProgrammeCard icon={Tv} title={t("landing.upcomingEvents.tvShows", { defaultValue: "TV & Media" })} image={countdownTvImg}>
            <p>{t("landing.upcomingEvents.mediaDates", { defaultValue: "Show and broadcast dates" })}</p>
            <p className="mt-2 font-semibold text-gold">CONTENT REQUIRED</p>
            <Link to="/media/tv" className="mt-4 inline-flex items-center gap-1 font-semibold text-gold hover:underline">
              NESA-Africa TV <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </ProgrammeCard>

          <ProgrammeCard icon={CalendarDays} title={t("landing.upcomingEvents.recognitionWindow", { defaultValue: "Recognition Window" })} image={countdownVotingImg}>
            <p className="font-semibold text-white">{NOMINATION_WINDOW_LABEL}</p>
            <p className="mt-2">{t("landing.upcomingEvents.recognitionDescription", { defaultValue: "Nominations and continuous verified certificate downloads." })}</p>
            <Link to="/timeline" className="mt-4 inline-flex items-center gap-1 font-semibold text-gold hover:underline">
              2026–2027 Timeline <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </ProgrammeCard>

          <ProgrammeCard icon={Trophy} title={t("landing.upcomingEvents.galaEvents", { defaultValue: "Online Awards Gala" })} image={countdownGalaImg}>
            <p className="font-semibold text-white">{PROGRAMME_END_LABEL}</p>
            <p className="mt-2">{t("landing.upcomingEvents.onlineOnly", { defaultValue: "Online only · No physical attendance · No ticket sales" })}</p>
            <Link to="/programme-2026" className="mt-4 inline-flex items-center gap-1 font-semibold text-gold hover:underline">
              Explore the Online Awards Gala <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </ProgrammeCard>
        </div>
      </div>
    </section>
  );
}
