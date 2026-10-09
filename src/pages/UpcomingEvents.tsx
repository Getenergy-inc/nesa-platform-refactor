import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { UpcomingEventsSection } from "@/components/nesa/UpcomingEventsSection";

export default function UpcomingEventsPage() {
  return (
    <>
      <Helmet>
        <title>Upcoming TV Shows, Voting & Events | NESA Africa 2026</title>
        <meta
          name="description"
          content="Live countdown to NESA-Africa 2026's major milestones — TV shows, public voting windows, the Blue Garnet Awards Gala, and the Rebuild My School Africa launch."
        />
        <link rel="canonical" href="https://nesa.africa/upcoming-events" />
      </Helmet>

      <div className="bg-charcoal min-h-screen">
        <div className="container pt-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-gold transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <UpcomingEventsSection />
      </div>
    </>
  );
}
