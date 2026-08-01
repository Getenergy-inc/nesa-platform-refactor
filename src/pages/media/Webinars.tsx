import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  ExternalLink,
  Mic,
  ShieldCheck,
  Users,
} from "lucide-react";
import eduaidLogo from "@/assets/partners/eduaid-africa-logo.jpeg";
import {
  WebinarRegistrationDialog,
  type WebinarInfo,
} from "@/components/webinars/WebinarRegistrationDialog";
import { trackEvent } from "@/lib/analytics";
import {
  EDUAID_WEBINAR_SERIES_2026,
  EDUAID_SERIES_META,
  EDUAID_CONTENT_BOUNDARY,
  EDUAID_INTEGRITY_RULE,
  EDUAID_PRODUCTION_MODEL,
  EDUAID_STANDARD_CTAS,
  EDUAID_CROSS_REFERENCE,
  EDUAID_SERIES_CONTEXT,
  type EduAidWebinarEpisode,
} from "@/data/eduaidWebinarSeries2026";

// EduAid-Africa brand colors
const eduaidColors = {
  green: "#4a7c23",
  brown: "#8b6914",
  lightGreen: "#6ba32d",
};

export default function Webinars() {
  const [selected, setSelected] = useState<WebinarInfo | null>(null);
  const [open, setOpen] = useState(false);

  const openRegistration = (ep: EduAidWebinarEpisode) => {
    trackEvent("webinar_register_open", { webinar_id: ep.id, title: ep.title });
    setSelected({
      id: ep.episode,
      title: `Episode ${ep.episode} · ${ep.title}`,
      date: ep.dateLabel,
      time: "15:00 WAT",
      durationMinutes: 90,
      category: ep.tiers,
    });
    setOpen(true);
  };

  return (
    <>
      <Helmet>
        <title>EduAid-Africa Webinar Series Timetable | NESA-Africa 2026</title>
        <meta
          name="description"
          content="Full timetable for the EduAid-Africa Webinar Series 2026 — 7 bi-weekly episodes from 20 August to 12 November 2026, with linked NESA-Africa recognition tiers and integrity rules."
        />
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        {/* Hero */}
        <section
          className="relative overflow-hidden py-16 lg:py-24"
          style={{
            background: `linear-gradient(135deg, ${eduaidColors.green}15 0%, ${eduaidColors.brown}10 50%, transparent 100%)`,
          }}
        >
          <div className="container relative z-10 mx-auto px-4">
            <Link
              to="/media"
              className="mb-6 inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Media Hub
            </Link>

            <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-12">
              <div className="flex-shrink-0">
                <div className="rounded-2xl bg-white p-5 shadow-2xl">
                  <img src={eduaidLogo} alt="EduAid-Africa" className="h-auto w-40 object-contain" />
                </div>
              </div>

              <div className="flex-1 text-center lg:text-left">
                <div className="mb-4 flex items-center justify-center gap-2 lg:justify-start">
                  <div className="rounded-lg p-2" style={{ backgroundColor: `${eduaidColors.green}20` }}>
                    <Mic className="h-5 w-5" style={{ color: eduaidColors.green }} />
                  </div>
                  <span
                    className="text-sm font-medium uppercase tracking-wider"
                    style={{ color: eduaidColors.green }}
                  >
                    ...funding through partnerships
                  </span>
                </div>

                <h1 className="mb-3 font-display text-3xl font-bold text-white md:text-5xl">
                  <span style={{ color: eduaidColors.green }}>EduAid-Africa</span>{" "}
                  <span className="text-white">Webinar Series</span>
                </h1>
                <p className="mb-6 max-w-2xl text-lg text-white/70">
                  {EDUAID_SERIES_META.strapline}
                </p>

                <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
                  <Button
                    size="lg"
                    className="border-0 text-white shadow-lg"
                    style={{ backgroundColor: eduaidColors.green }}
                    onClick={() => openRegistration(EDUAID_WEBINAR_SERIES_2026[0])}
                  >
                    <CalendarDays className="mr-2 h-5 w-5" />
                    Register for Episode 1
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="text-white hover:bg-white/10"
                    style={{ borderColor: eduaidColors.brown }}
                  >
                    <a href={EDUAID_CROSS_REFERENCE.href} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Visit EduAid-Africa
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div
            className="absolute bottom-0 left-0 right-0 h-1"
            style={{
              background: `linear-gradient(90deg, transparent, ${eduaidColors.green}, ${eduaidColors.brown}, transparent)`,
            }}
          />
        </section>

        {/* Cross-reference line — platform firewall */}
        <section className="border-y border-white/10 bg-white/5 py-5">
          <div className="container mx-auto px-4">
            <p className="text-center text-sm text-white/75">
              {EDUAID_CROSS_REFERENCE.text}{" "}
              <a
                href={EDUAID_CROSS_REFERENCE.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline"
                style={{ color: eduaidColors.lightGreen }}
              >
                {EDUAID_CROSS_REFERENCE.linkLabel}
              </a>
            </p>
          </div>
        </section>

        {/* Full timetable */}
        <section className="py-14 lg:py-20">
          <div className="container mx-auto px-4">
            <h2 className="mb-2 font-display text-2xl font-bold text-white md:text-3xl">
              Full Timetable — 7 Episodes
            </h2>
            <p className="mb-8 text-white/60">
              Bi-weekly · {EDUAID_SERIES_META.seriesStartLabel} – {EDUAID_SERIES_META.seriesEndLabel}
            </p>

            {/* Desktop table */}
            <div className="hidden overflow-x-auto rounded-xl border border-white/10 lg:block">
              <table className="w-full text-left text-sm">
                <caption className="sr-only">
                  EduAid-Africa Webinar Series 2026 timetable — episode, date, topic, linked tiers and competitive status
                </caption>
                <thead className="bg-white/5 text-white/70">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-semibold">Ep</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Date</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Topic</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Linked NESA-Africa Tier(s)</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Competitive Status</th>
                    <th scope="col" className="px-4 py-3 font-semibold sr-only">Register</th>
                  </tr>
                </thead>
                <tbody>
                  {EDUAID_WEBINAR_SERIES_2026.map((ep) => (
                    <tr key={ep.id} className="border-t border-white/10 align-top">
                      <td className="px-4 py-4 font-semibold" style={{ color: eduaidColors.lightGreen }}>
                        {ep.episode}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-white/80">{ep.dateLabel}</td>
                      <td className="px-4 py-4">
                        <span className="font-medium text-white">{ep.title}</span>
                        <span className="block text-white/60">{ep.summary}</span>
                        {ep.pilot && (
                          <Badge className="mt-2" style={{ backgroundColor: `${eduaidColors.brown}30`, color: "#f0d9a0" }}>
                            Pilot episode
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-4 text-white/70">{ep.tiers}</td>
                      <td className="px-4 py-4">
                        <Badge
                          variant="outline"
                          className={
                            ep.competitiveStatus === "icon-boundary"
                              ? "border-amber-400/40 text-amber-200"
                              : "border-white/20 text-white/70"
                          }
                        >
                          {ep.competitiveLabel}
                        </Badge>
                      </td>
                      <td className="px-4 py-4">
                        <Button
                          size="sm"
                          className="text-white"
                          style={{ backgroundColor: eduaidColors.green }}
                          onClick={() => openRegistration(ep)}
                        >
                          Register
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="grid gap-4 lg:hidden">
              {EDUAID_WEBINAR_SERIES_2026.map((ep) => (
                <Card
                  key={ep.id}
                  className="overflow-hidden border bg-white/5"
                  style={{ borderColor: `${eduaidColors.green}20` }}
                >
                  <div
                    className="h-1 w-full"
                    style={{ background: `linear-gradient(90deg, ${eduaidColors.green}, ${eduaidColors.brown})` }}
                  />
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-2">
                      <Badge style={{ backgroundColor: `${eduaidColors.green}20`, color: eduaidColors.lightGreen }}>
                        Episode {ep.episode}
                      </Badge>
                      <span className="text-sm text-white/70">{ep.dateLabel}</span>
                    </div>
                    <CardTitle className="mt-2 text-lg text-white">{ep.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-white/60">{ep.summary}</p>
                    <p className="text-sm text-white/70">
                      <span className="text-white/50">Linked tier(s): </span>
                      {ep.tiers}
                    </p>
                    <Badge
                      variant="outline"
                      className={
                        ep.competitiveStatus === "icon-boundary"
                          ? "border-amber-400/40 text-amber-200"
                          : "border-white/20 text-white/70"
                      }
                    >
                      {ep.competitiveLabel}
                    </Badge>
                    <Button
                      className="w-full text-white"
                      style={{ backgroundColor: eduaidColors.green }}
                      onClick={() => openRegistration(ep)}
                    >
                      Register
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Standing rules */}
        <section className="bg-charcoal/95 py-14">
          <div className="container mx-auto grid gap-6 px-4 lg:grid-cols-2">
            <div className="rounded-xl border border-amber-400/25 bg-amber-400/5 p-6">
              <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-bold text-amber-200">
                <ShieldCheck className="h-5 w-5" />
                {EDUAID_CONTENT_BOUNDARY.heading}
              </h3>
              <p className="text-sm text-white/75">{EDUAID_CONTENT_BOUNDARY.body}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <h3 className="mb-3 font-display text-lg font-bold text-white">
                Core integrity rule — every episode
              </h3>
              <blockquote className="border-l-2 pl-4 text-sm italic text-white/75" style={{ borderColor: eduaidColors.green }}>
                “{EDUAID_INTEGRITY_RULE}”
              </blockquote>
            </div>
          </div>
        </section>

        {/* Production model */}
        <section className="py-14">
          <div className="container mx-auto px-4">
            <h2 className="mb-2 flex items-center gap-2 font-display text-2xl font-bold text-white">
              <Users className="h-6 w-6" style={{ color: eduaidColors.lightGreen }} />
              {EDUAID_PRODUCTION_MODEL.heading}
            </h2>
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <ul className="space-y-3">
                {EDUAID_PRODUCTION_MODEL.notes.map((note) => (
                  <li key={note} className="flex gap-3 text-sm text-white/75">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ backgroundColor: eduaidColors.green }} />
                    {note}
                  </li>
                ))}
              </ul>
              <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                <p className="mb-3 text-sm font-semibold text-white">
                  {EDUAID_PRODUCTION_MODEL.seats}-seat FGD · 4 breakout rooms per episode
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {EDUAID_PRODUCTION_MODEL.breakoutRooms.map((room) => (
                    <div
                      key={room}
                      className="rounded-lg border px-3 py-2 text-sm text-white/80"
                      style={{ borderColor: `${eduaidColors.green}30` }}
                    >
                      {room}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Standard CTAs */}
        <section
          className="py-14"
          style={{ background: `linear-gradient(135deg, ${eduaidColors.green}10 0%, transparent 60%, ${eduaidColors.brown}10 100%)` }}
        >
          <div className="container mx-auto px-4">
            <h2 className="mb-6 font-display text-2xl font-bold text-white">
              Standard Call-to-Action — every episode
            </h2>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {EDUAID_STANDARD_CTAS.map((cta) => (
                <Link
                  key={cta.label}
                  to={cta.href}
                  className="group flex items-center justify-between gap-3 rounded-xl border bg-white/5 px-4 py-4 text-sm text-white/85 transition-colors hover:bg-white/10"
                  style={{ borderColor: `${eduaidColors.green}25` }}
                >
                  {cta.label}
                  <ArrowRight className="h-4 w-4 flex-shrink-0 transition-transform group-hover:translate-x-1" style={{ color: eduaidColors.lightGreen }} />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Where this sits in the master timetable */}
        <section className="border-t border-white/10 py-12">
          <div className="container mx-auto px-4">
            <h2 className="mb-3 font-display text-xl font-bold text-white">
              Where this sits in the master timetable
            </h2>
            <p className="max-w-3xl text-sm text-white/70">{EDUAID_SERIES_CONTEXT}</p>
            <Button asChild variant="outline" className="mt-5 text-white hover:bg-white/10" style={{ borderColor: `${eduaidColors.green}40` }}>
              <Link to="/about/timeline">
                View the full 2026 cycle calendar
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </div>

      <WebinarRegistrationDialog open={open} onOpenChange={setOpen} webinar={selected} />
    </>
  );
}
