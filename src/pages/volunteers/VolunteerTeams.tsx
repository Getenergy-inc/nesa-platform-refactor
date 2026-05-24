import { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, ArrowRight, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useVolunteers } from "@/hooks/useVolunteers";
import { TEAM_LABELS, type TeamSlug } from "@/lib/volunteersData";

const TEAM_COLOR: Record<TeamSlug, string> = {
  technology: "from-blue-500/30 to-indigo-500/20",
  design: "from-pink-500/30 to-rose-500/20",
  media: "from-amber-500/30 to-orange-500/20",
  data: "from-emerald-500/30 to-green-500/20",
  content: "from-violet-500/30 to-purple-500/20",
  gala: "from-yellow-500/30 to-amber-500/20",
  ambassadors: "from-red-500/30 to-rose-500/20",
  chapters: "from-cyan-500/30 to-sky-500/20",
  partnerships: "from-lime-500/30 to-green-500/20",
  support: "from-orange-500/30 to-amber-500/20",
};

export default function VolunteerTeams() {
  const { volunteers, loading } = useVolunteers();
  const groups = useMemo(() => {
    const by = new Map<TeamSlug, typeof volunteers>();
    for (const v of volunteers) {
      const k = v.teamSlug ?? "support";
      if (!by.has(k)) by.set(k, []);
      by.get(k)!.push(v);
    }
    return Array.from(by.entries())
      .map(([slug, members]) => ({ slug, members, count: members.length }))
      .sort((a, b) => b.count - a.count);
  }, [volunteers]);

  return (
    <div className="min-h-screen bg-charcoal pb-24">
      <Helmet><title>Volunteer Teams — NESA-Africa</title></Helmet>
      <section className="container mx-auto px-4 pt-12 md:pt-16">
        <Link to="/volunteers" className="inline-flex items-center gap-1 text-gold/80 hover:text-gold text-sm mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to Directory
        </Link>
        <h1 className="font-playfair text-4xl md:text-5xl text-gold font-bold">Volunteer Teams</h1>
        <p className="text-white/70 mt-2 max-w-2xl">
          Every team powers a different facet of NESA-Africa — from engineering and design to storytelling, data,
          partnerships, and chapter coordination.
        </p>
      </section>

      <section className="container mx-auto px-4 mt-10">
        {loading ? (
          <div className="text-white/60 text-center py-10">Loading teams…</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map(({ slug, members, count }) => (
              <motion.div key={slug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }} transition={{ duration: 0.5 }}>
                <Card className={`border-gold/20 bg-gradient-to-br ${TEAM_COLOR[slug]} p-6 hover:border-gold/60 transition h-full`}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-playfair text-xl text-gold">{TEAM_LABELS[slug]}</h3>
                    <span className="text-2xl font-bold text-gold">{count}</span>
                  </div>
                  <div className="flex -space-x-2 mb-4">
                    {members.slice(0, 6).map((m) => (
                      <Link key={m.id} to={`/volunteers/${m.slug}`} title={m.fullName}
                            className="h-9 w-9 rounded-full border-2 border-charcoal bg-gold/20 overflow-hidden hover:scale-110 transition">
                        {m.photoUrl ? (
                          <img src={m.photoUrl} alt={m.fullName} className="h-full w-full object-cover" loading="lazy" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-gold/60 text-xs">
                            {m.fullName.charAt(0)}
                          </div>
                        )}
                      </Link>
                    ))}
                    {count > 6 && (
                      <div className="h-9 w-9 rounded-full border-2 border-charcoal bg-black/60 flex items-center justify-center text-[10px] text-gold">
                        +{count - 6}
                      </div>
                    )}
                  </div>
                  <Button asChild variant="ghost" size="sm" className="text-gold w-full justify-between hover:bg-gold/10">
                    <Link to={`/volunteers?team=${slug}`}>
                      View Team <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        <Card className="mt-10 border-gold/30 bg-gradient-to-br from-gold/10 to-black p-8 text-center">
          <Users className="h-8 w-8 text-gold mx-auto mb-3" />
          <h2 className="font-playfair text-2xl text-gold mb-2">Find your team</h2>
          <p className="text-white/70 mb-4">Tell us where you can contribute — we'll match you with the right team.</p>
          <Button asChild className="bg-gold text-black hover:bg-gold/90">
            <Link to="/volunteer">Become a Volunteer</Link>
          </Button>
        </Card>
      </section>
    </div>
  );
}
