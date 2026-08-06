import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, Ticket, Radio } from "lucide-react";
import { UpcomingEventsSection } from "@/components/nesa/UpcomingEventsSection";
import { MasterTimelineTable } from "@/components/timeline/MasterTimelineTable";

const QUICK_LINKS = [
  {
    label: "Buy Gala Tickets",
    href: "/tickets",
    description: "Reserve seats for the 13 December 2026 Recognition Gala.",
    icon: Ticket,
  },
  {
    label: "Watch Live & On-Demand",
    href: "/media",
    description: "TV shows, webinars, podcasts and press briefings.",
    icon: Radio,
  },
  {
    label: "Full Master Timeline",
    href: "/about#timeline",
    description: "All 13 phases from 1 July 2026 through the Gala.",
    icon: CalendarDays,
  },
];

export default function EventsPage() {
  return (
    <>
      <Helmet>
        <title>Events & Gala Calendar | NESA-Africa 2026</title>
        <meta
          name="description"
          content="Consolidated calendar for NESA-Africa 2026 — TV shows, public activations, webinars, the Recognition Gala on 13 December 2026, and the EduAid-Africa launch."
        />
        <link rel="canonical" href="https://nesaafrica.lovable.app/events" />
      </Helmet>

      <div className="bg-charcoal min-h-screen text-white">
        <header className="border-b border-white/10 bg-gradient-to-b from-black/60 to-transparent">
          <div className="container py-12 md:py-16">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold">
              Enablers of Education for All Across Africa
            </p>
            <h1 className="mt-3 font-serif text-3xl md:text-5xl">
              Events & Gala Calendar
            </h1>
            <p className="mt-4 max-w-2xl text-white/70">
              One canonical calendar for every NESA-Africa 2026 milestone —
              nominations, public activations, TV shows, and the Gold–Blue
              Garnet Recognition Gala on 13 December 2026 in Lagos.
            </p>
          </div>
        </header>

        <section className="container py-10 md:py-14">
          <div className="grid gap-4 md:grid-cols-3">
            {QUICK_LINKS.map(({ label, href, description, icon: Icon }) => (
              <Link
                key={href}
                to={href}
                className="group rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-gold/60 hover:bg-white/10"
              >
                <Icon className="h-6 w-6 text-gold" />
                <h2 className="mt-3 font-serif text-lg text-white">{label}</h2>
                <p className="mt-1 text-sm text-white/65">{description}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-gold">
                  Open <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="container pb-12">
          <UpcomingEventsSection />
        </section>

        <section className="container pb-16">
          <MasterTimelineTable hideNotice hideOpenItems />
        </section>
      </div>
    </>
  );
}
