import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Globe2, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useGlobalTeamStats } from "@/hooks/useGlobalTeamStats";
import { STATIC_VOLUNTEERS } from "@/lib/volunteersData";


type V = {
  id: string;
  slug: string | null;
  full_name: string;
  photo_url: string | null;
  country: string | null;
  role: string | null;
  team_slug: string | null;
};

export function PoweredByVolunteersSection() {
  const [vols, setVols] = useState<V[]>([]);
  const teamStats = useGlobalTeamStats();
  const stats = { count: teamStats.people, countries: teamStats.countries };

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("volunteers")
        .select("id, slug, full_name, photo_url, country, role, team_slug")
        .eq("visibility_status", "public")
        .eq("verification_status", "approved")
        .order("contribution_score", { ascending: false })
        .limit(12);
      const rows = (data || []) as V[];
      setVols(
        rows.length
          ? rows
          : STATIC_VOLUNTEERS.filter((v) => v.visibility === "public")
              .slice(0, 12)
              .map((v) => ({
                id: v.id,
                slug: v.slug,
                full_name: v.fullName,
                photo_url: v.photoUrl ?? null,
                country: v.country ?? null,
                role: v.role ?? null,
                team_slug: v.teamSlug ?? null,
              }))
      );
    })();
  }, []);


  return (
    <section className="relative py-20 px-4 bg-gradient-to-b from-charcoal via-charcoal to-black overflow-hidden">
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute -top-1/3 left-1/4 h-96 w-96 rounded-full bg-gold blur-3xl" />
      </div>

      <div className="container mx-auto max-w-6xl relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs uppercase tracking-widest mb-4">
            <Sparkles className="h-3 w-3" /> The People Behind the Movement
          </div>
          <h2 className="font-playfair text-3xl md:text-5xl text-gold mb-4">
            Powered by People Across Continents
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            NESA-Africa is supported by volunteers, technologists, researchers, communicators, chapter teams, ambassadors and programme contributors across Africa and the Diaspora.
          </p>

        </motion.div>

        {/* Verified stats only — hide the row entirely when we have no verified counts */}
        {(stats.count > 0 || vols.length > 0) && (
          <div className="grid grid-cols-2 gap-3 md:gap-6 mb-12 max-w-2xl mx-auto">
            {[
              { icon: Users, label: "Verified Volunteers", value: stats.count || vols.length },
              { icon: Globe2, label: "Countries", value: stats.countries },
            ]
              .filter((s) => Number(s.value) > 0)
              .map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-xl border border-gold/20 bg-white/5 p-4 md:p-6 text-center backdrop-blur"
                >
                  <s.icon className="h-5 w-5 text-gold mx-auto mb-2" />
                  <div className="font-playfair text-2xl md:text-3xl text-gold">{s.value}</div>
                  <div className="text-xs text-white/60 uppercase tracking-wider mt-1">{s.label}</div>
                </motion.div>
              ))}
          </div>
        )}

        {/* Volunteer portrait grid */}
        {vols.length > 0 && (
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2 md:gap-3 mb-12">
            {vols.map((v, i) => (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
              >
                <Link
                  to={v.slug ? `/volunteers/${v.slug}` : "/volunteers"}
                  className="block aspect-square rounded-full overflow-hidden border-2 border-gold/30 hover:border-gold transition relative group"
                  title={`${v.full_name}${v.country ? " • " + v.country : ""}`}
                >
                  {v.photo_url ? (
                    <img
                      src={v.photo_url}
                      alt={v.full_name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition"
                    />
                  ) : (
                    <div className="w-full h-full bg-gold/10 flex items-center justify-center text-gold font-bold text-xs">
                      {v.full_name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </div>
                  )}
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" className="bg-gold text-charcoal hover:bg-gold/90">
            <Link to="/volunteers">
              Meet Our Volunteers <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-gold/40 text-gold hover:bg-gold/10">
            <Link to="/volunteer">Become a Volunteer</Link>
          </Button>
          <Button asChild size="lg" variant="ghost" className="text-white/80 hover:text-gold">
            <Link to="/join-local-chapter">Join a Local Chapter</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
