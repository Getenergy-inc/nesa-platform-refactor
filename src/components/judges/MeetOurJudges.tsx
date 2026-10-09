import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MapPin, Building, ChevronRight } from "lucide-react";
import { listPublicJudges, type PublicJudge } from "@/lib/api/judges.api";

// Local fallback judges (used when the public directory is empty or fails to load).
// These are the verified NESA-Africa 2026 panel members shipped with the app.
import judge1 from "@/assets/judges/judge1.png";
import judge6 from "@/assets/judges/judge6.png";
import judge7 from "@/assets/judges/judge7.png";
import judge8 from "@/assets/judges/judge8.png";
import judge9 from "@/assets/judges/judge9.png";
import judge10 from "@/assets/judges/judge10.png";

export interface JudgeProfile {
  name: string;
  title: string;
  country: string;
  expertise: string;
  photo: string;
  bio: string;
  organization?: string;
  slug?: string;
}

export const FEATURED_JUDGES: JudgeProfile[] = [
  {
    name: "Mr Benneth Osarieme Ogbeiwi",
    title: "Head at Adrenaline Entertainment, Former Host at MTN Project Fame",
    country: "Nigeria",
    expertise: "Music & Arts Education",
    photo: judge1,
    bio: "Two decades of experience sharing knowledge in music & the arts.",
    organization: "Adrenaline Entertainment",
  },
  {
    name: "Damilola Omotosho",
    title: "HSEQ Implementation & ESG Consultant",
    country: "Nigeria",
    expertise: "Quality & Safety",
    photo: judge7,
    bio: "Cambridge-certified sustainability advocate influencing energy transition literacy across Africa.",
    organization: "Independent",
  },
  {
    name: "Dr Juliet Ihiabe",
    title: "Executive Director, Family Bond Helping Foundation",
    country: "Nigeria",
    expertise: "Philanthropy & Social Impact",
    photo: judge8,
    bio: "Championing access to education through health interventions for women and children.",
    organization: "Family Bond Helping Foundation",
  },
  {
    name: "Paul Kayode Joash",
    title: "Chief Rainmaker at MyDoubleDouble International",
    country: "Nigeria",
    expertise: "Business & Coaching",
    photo: judge9,
    bio: "International speaker, sales/marketing guru and personal & business transformation coach.",
    organization: "MyDoubleDouble International",
  },
  {
    name: "Oluwadaisi Patricia Aderibigbe Santos",
    title: "Veteran Educationalist",
    country: "Nigeria",
    expertise: "Education",
    photo: judge10,
    bio: "Trailblazer in women-led educational reform and early childhood learning advocacy.",
    organization: "Independent",
  },
  {
    name: "Dr. Aminah Danjumah",
    title: "Yeelen Education Project",
    country: "Nigeria",
    expertise: "Rural Education",
    photo: judge6,
    bio: "Dedicated to improving rural education, particularly for girls, with mobile library innovations.",
    organization: "Yeelen Education Project",
  },
];

function mapPublicToProfile(j: PublicJudge): JudgeProfile {
  return {
    name: j.full_name,
    title: j.professional_title || j.organization || "Jury Member",
    country: j.country_residence || j.country_origin || j.region || "Africa",
    expertise: j.expertise_areas?.[0] || "Education",
    photo: j.photo_url || "",
    bio: j.bio || j.public_contribution_statement || "",
    organization: j.organization || undefined,
    slug: j.slug,
  };
}

interface JudgeCardProps {
  judge: JudgeProfile;
  index: number;
}

function JudgeCard({ judge, index }: JudgeCardProps) {
  const initials = judge.name
    .split(" ")
    .filter((n) => n.length > 2)
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  const Inner = (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-charcoal/80 to-charcoal border border-white/10 hover:border-gold/30 transition-all duration-300 h-full">
      <Badge className="absolute top-4 right-4 z-10 bg-gold text-charcoal font-semibold px-3 py-1 text-xs shadow-lg">
        {judge.expertise}
      </Badge>

      <div className="relative aspect-[4/5] overflow-hidden bg-charcoal-light">
        {judge.photo ? (
          <img
            src={judge.photo}
            alt={judge.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Avatar className="h-32 w-32 border-2 border-gold/40">
              <AvatarFallback className="bg-gradient-to-br from-gold/20 to-gold/5 text-gold text-3xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-white/10 to-transparent backdrop-blur-sm border-t border-white/10 rounded-b-2xl">
        <h4 className="font-display text-xl font-bold text-white mb-1 leading-tight">
          {judge.name}
        </h4>
        <p className="text-sm text-white/70 mb-2 line-clamp-2">{judge.title}</p>
        {judge.organization && (
          <div className="flex items-center gap-1.5 text-white/50 text-xs mb-1">
            <Building className="h-3 w-3" />
            <span className="truncate">{judge.organization}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5 text-gold/80">
          <MapPin className="h-3.5 w-3.5" />
          <span className="text-sm">{judge.country}</span>
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="group relative"
    >
      {judge.slug ? (
        <Link to={`/judges/directory/${judge.slug}`} className="block h-full">
          {Inner}
        </Link>
      ) : (
        Inner
      )}
    </motion.div>
  );
}

export function MeetOurJudgesSection() {
  const [judges, setJudges] = useState<JudgeProfile[]>(FEATURED_JUDGES);
  const [totalCount, setTotalCount] = useState<number>(FEATURED_JUDGES.length);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const featured = await listPublicJudges({ featuredOnly: true });
        const all = featured.length >= 6 ? featured : await listPublicJudges();
        if (cancelled) return;
        if (all && all.length > 0) {
          setJudges(all.slice(0, 6).map(mapPublicToProfile));
          setTotalCount(all.length);
        }
      } catch {
        // Keep local fallback list
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const showing = Math.min(judges.length, 6);

  return (
    <section className="bg-charcoal py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <Badge className="mb-4 bg-gold/20 text-gold border-gold/40">
            Our Expert Panel
          </Badge>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Meet Our <span className="text-gold">Distinguished Judges</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Our jury comprises eminent education leaders from across Africa, each
            bringing decades of expertise in their respective fields.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {judges.slice(0, 6).map((judge, index) => (
            <JudgeCard key={`${judge.name}-${index}`} judge={judge} index={index} />
          ))}
        </div>

        <div className="text-center mt-12 space-y-4">
          <p className="text-white/50 text-sm">
            {loading
              ? "Loading verified jury members…"
              : `Showing ${showing} of ${Math.max(totalCount, showing)} jury members`}
          </p>
          <Button
            asChild
            variant="outline"
            className="border-gold/40 text-gold hover:bg-gold/10 rounded-full"
          >
            <Link to="/judges/directory">
              View Full Jury Directory
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
