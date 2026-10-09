// Real people section for /meet-the-team — DB volunteers + photo-backed static volunteers.
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NomineeImage } from "@/components/shared/NomineeImage";
import { useVolunteers } from "@/hooks/useVolunteers";
import type { Volunteer } from "@/lib/volunteersData";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
};

/** Loose name key so "Priscillia Madu" ≈ "Madu Chidinma Priscillia". */
function nameKey(name: string): string {
  const parts = name
    .toLowerCase()
    .replace(/[^a-z\s]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .sort();
  return parts.join(" ");
}

function overlaps(a: string, b: string): boolean {
  const sa = new Set(a.split(" "));
  const sb = new Set(b.split(" "));
  let hits = 0;
  sa.forEach((w) => { if (w.length > 2 && sb.has(w)) hits++; });
  return hits >= 2;
}

function dedupe(list: Volunteer[]): Volunteer[] {
  const out: Volunteer[] = [];
  for (const v of list) {
    const key = nameKey(v.fullName);
    const existing = out.findIndex((o) => {
      const ok = nameKey(o.fullName);
      return ok === key || overlaps(ok, key);
    });
    if (existing === -1) {
      out.push(v);
    } else if (!out[existing].photoUrl && v.photoUrl) {
      out[existing] = v; // prefer the entry with a real photo
    }
  }
  return out;
}

export function GlobalVolunteerTeamSection() {
  const { volunteers, loading } = useVolunteers();

  const people = dedupe(
    volunteers.filter(
      (v) =>
        v.source === "db" ||
        (v.source === "static" && v.role === "Volunteer" && !!v.photoUrl)
    )
  ).sort((a, b) => a.fullName.localeCompare(b.fullName));

  if (!loading && people.length === 0) return null;

  return (
    <section className="px-4 py-16">
      <div className="container mx-auto max-w-6xl">
        <motion.div {...fadeUp} className="text-center mb-10">
          <h2 className="font-playfair text-2xl md:text-3xl text-gold mb-3">
            Global Volunteer Team
          </h2>
          <p className="text-white/60 text-sm max-w-2xl mx-auto">
            The volunteers currently building NESA-Africa across communications, technology,
            media, partnerships and research.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-40 rounded-lg bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {people.map((v) => (
              <motion.div key={v.id} {...fadeUp}>
                <Card className="h-full border-gold/20 bg-white/5 p-5 text-center hover:border-gold/50 transition backdrop-blur">
                  <div className="flex justify-center mb-3">
                    <NomineeImage
                      src={v.photoUrl}
                      alt={v.fullName}
                      name={v.fullName}
                      type="photo"
                      size="xl"
                    />
                  </div>
                  <h3 className="font-playfair text-base text-gold leading-tight">
                    {v.fullName}
                  </h3>
                  {(v.headline || v.role) && (
                    <p className="text-white/70 text-xs mt-1.5 leading-relaxed">
                      {v.headline || v.role}
                    </p>
                  )}
                  {(v.country || v.region) && (
                    <span className="mt-3 inline-flex items-center gap-1 rounded-full border border-gold/30 px-2.5 py-0.5 text-[11px] text-gold/80">
                      <MapPin className="h-3 w-3" />
                      {v.country || v.region}
                    </span>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Button asChild variant="outline" className="border-gold/40 text-gold hover:bg-gold/10">
            <Link to="/volunteers">
              View the full volunteer directory <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default GlobalVolunteerTeamSection;
