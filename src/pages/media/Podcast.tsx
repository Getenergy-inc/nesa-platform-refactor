// Education Enablers Podcast — public "Join Podcast" surface.
// Episode data is derived from the canonical master timeline (track: "podcast")
// so this page can never drift from /timeline.
import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  CalendarDays,
  Headphones,
  Mic,
  Radio,
  ShieldCheck,
  Users,
} from "lucide-react";
import {
  WebinarRegistrationDialog,
  type WebinarInfo,
} from "@/components/webinars/WebinarRegistrationDialog";
import { trackEvent } from "@/lib/analytics";
import {
  MASTER_TIMELINE_2026,
  type MasterTimelineEntry,
} from "@/data/masterTimeline2026";

const HOW_TO_JOIN = [
  {
    icon: Users,
    title: "Register once",
    body: "One registration covers the full Education Enablers Podcast season — you receive each episode link by email.",
  },
  {
    icon: Radio,
    title: "Join live or listen later",
    body: "Episodes are recorded live with guests, then published on NESA-Africa TV and partner audio networks.",
  },
  {
    icon: Mic,
    title: "Contribute as a guest",
    body: "Volunteer contributors, chapter leads and verified Enablers can request a speaking slot when registering.",
  },
];

export default function Podcast() {
  const [selected, setSelected] = useState<WebinarInfo | null>(null);
  const [open, setOpen] = useState(false);

  const episodes = useMemo(
    () => MASTER_TIMELINE_2026.filter((e) => e.track === "podcast"),
    [],
  );

  const openRegistration = (ep: MasterTimelineEntry) => {
    trackEvent("podcast_register_open", { podcast_id: ep.id, title: ep.milestone });
    setSelected({
      id: ep.id,
      title: ep.milestone,
      date: ep.dateLabel,
      time: "17:00 WAT",
      durationMinutes: 60,
      category: "Education Enablers Podcast",
    });
    setOpen(true);
  };

  return (
    <>
      <Helmet>
        <title>Join the Education Enablers Podcast | NESA-Africa 2026</title>
        <meta
          name="description"
          content="Register for the Education Enablers Podcast — bi-weekly conversations with Africa's education enablers across the NESA-Africa 2026 recognition season."
        />
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        {/* Hero */}
        <section className="border-b border-gold/20 bg-gradient-to-b from-charcoal to-charcoal/95 py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <div className="mb-4 flex items-center gap-2">
                <Headphones className="h-6 w-6 text-primary" />
                <span className="text-sm font-medium uppercase tracking-wider text-primary">
                  NESA-Africa 2026 Audio Programme
                </span>
              </div>
              <h1 className="mb-5 font-display text-4xl font-bold text-white md:text-5xl">
                Education Enablers <span className="text-primary">Podcast</span>
              </h1>
              <p className="mb-8 text-lg text-white/70">
                Conversations with the people rebuilding education across Africa — enablers,
                volunteers, chapter leads, partners and institutions. Free to join, open to
                everyone, recorded through the 2026 recognition season.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground"
                  onClick={() => episodes[0] && openRegistration(episodes[0])}
                >
                  <Mic className="mr-2 h-5 w-5" />
                  Join the Podcast
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Link to="/media/webinars">
                    EduAid-Africa Webinars
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* How to join */}
        <section className="bg-charcoal/95 py-14">
          <div className="container mx-auto px-4">
            <div className="grid gap-6 md:grid-cols-3">
              {HOW_TO_JOIN.map((item) => (
                <Card key={item.title} className="border-white/10 bg-white/5">
                  <CardHeader>
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-white">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-white/65">{item.body}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Episodes */}
        <section className="bg-charcoal py-16">
          <div className="container mx-auto px-4">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="font-display text-3xl font-bold text-white">
                  Episode schedule
                </h2>
                <p className="mt-2 text-sm text-white/60">
                  {episodes.length} scheduled episodes. Unconfirmed dates are published
                  honestly as “to be confirmed” rather than estimated.
                </p>
              </div>
              <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Link to="/timeline">View full season timeline</Link>
              </Button>
            </div>

            <div className="grid gap-4">
              {episodes.map((ep) => (
                <div
                  key={ep.id}
                  className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white/5 p-5 md:flex-row md:items-center md:justify-between"
                >
                  <div className="min-w-0">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <Badge className="bg-primary/15 text-primary hover:bg-primary/15">
                        <CalendarDays className="mr-1 h-3 w-3" />
                        {ep.dateLabel}
                      </Badge>
                      {ep.toBeConfirmed && (
                        <Badge variant="outline" className="border-white/25 text-white/70">
                          To be confirmed
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-medium text-white">{ep.milestone}</h3>
                    <p className="mt-1 text-sm text-white/60">{ep.activity}</p>
                    <p className="mt-1 text-xs uppercase tracking-wide text-white/40">
                      {ep.outcome}
                    </p>
                  </div>
                  <div className="shrink-0">
                    <Button
                      onClick={() => openRegistration(ep)}
                      disabled={ep.toBeConfirmed}
                      className="bg-primary text-primary-foreground disabled:opacity-40"
                    >
                      {ep.toBeConfirmed ? "Dates pending" : "Join this episode"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Integrity note */}
        <section className="bg-charcoal/95 py-12">
          <div className="container mx-auto px-4">
            <div className="mx-auto flex max-w-3xl gap-4 rounded-xl border border-gold/25 bg-gold/5 p-6">
              <ShieldCheck className="h-6 w-6 shrink-0 text-primary" />
              <p className="text-sm text-white/70">
                The podcast is a public awareness and education programme. It carries no
                judging, scoring or voting function, and no episode names Africa Education
                Icon nominees or discusses deliberations. Recognition outcomes are decided
                only through the NRC verification and Judges Arena processes.
              </p>
            </div>
          </div>
        </section>
      </div>

      <WebinarRegistrationDialog open={open} onOpenChange={setOpen} webinar={selected} />
    </>
  );
}
