import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, Quote } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useVolunteers } from "@/hooks/useVolunteers";
import { TEAM_LABELS } from "@/lib/volunteersData";

const STORY_QUOTES = [
  "I volunteer because every African child deserves a chance at world-class education.",
  "Building NESA-Africa taught me that recognition is one of the most powerful tools for change.",
  "My chapter became a family — we're not just volunteers, we're a movement.",
  "Through NESA, I've seen storytelling change how the world sees African education.",
  "Volunteering here gave me skills, friends, and a continent-sized purpose.",
  "Every nomination we verify is someone's life work being honored — that matters.",
];

export default function VolunteerStories() {
  const { volunteers } = useVolunteers();
  const featured = volunteers.filter((v) => v.bio).slice(0, 6);

  return (
    <div className="min-h-screen bg-charcoal pb-24">
      <Helmet><title>Volunteer Stories — Why We Volunteer · NESA-Africa</title></Helmet>
      <section className="container mx-auto px-4 pt-12">
        <Link to="/volunteers" className="inline-flex items-center gap-1 text-gold/80 hover:text-gold text-sm mb-4">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <h1 className="font-playfair text-4xl md:text-5xl text-gold font-bold">Why We Volunteer</h1>
        <p className="text-white/70 mt-2 max-w-2xl">Voices from across the movement — Africa and the diaspora.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
          {STORY_QUOTES.map((q, i) => {
            const v = featured[i % Math.max(featured.length, 1)];
            return (
              <Card key={i} className="border-gold/20 bg-gradient-to-br from-charcoal to-black p-6">
                <Quote className="h-6 w-6 text-gold/60 mb-3" />
                <p className="text-white/90 italic leading-relaxed">"{q}"</p>
                {v && (
                  <Link to={`/volunteers/${v.slug}`} className="flex items-center gap-3 mt-5 pt-4 border-t border-gold/10 hover:opacity-80">
                    <div className="h-10 w-10 rounded-full bg-gold/20 overflow-hidden">
                      {v.photoUrl ? <img src={v.photoUrl} alt="" className="h-full w-full object-cover" /> :
                        <div className="h-full w-full flex items-center justify-center text-gold/60 text-xs">{v.fullName.charAt(0)}</div>}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm text-white truncate">{v.fullName}</div>
                      <div className="text-[10px] text-gold/70 uppercase tracking-wider truncate">
                        {v.teamSlug ? TEAM_LABELS[v.teamSlug] : v.role}
                      </div>
                    </div>
                  </Link>
                )}
              </Card>
            );
          })}
        </div>

        <Card className="mt-10 border-gold/30 bg-gradient-to-br from-gold/10 to-black p-8 text-center">
          <h2 className="font-playfair text-2xl text-gold mb-2">Share your story</h2>
          <p className="text-white/70 mb-4">Are you a NESA-Africa volunteer? We want to feature your voice.</p>
          <Button asChild className="bg-gold text-black hover:bg-gold/90">
            <Link to="/volunteer">Become a Volunteer</Link>
          </Button>
        </Card>
      </section>
    </div>
  );
}
