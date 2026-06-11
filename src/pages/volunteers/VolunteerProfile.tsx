import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, MapPin, Trophy, Calendar, Globe, BadgeCheck, Award, Sparkles,
  Linkedin, Twitter, Instagram, Facebook, Youtube, Github, Mail, Link2, Crown,
  Users, Target, Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useVolunteerBySlug } from "@/hooks/useVolunteers";
import { VolunteerReferralBlock } from "@/components/volunteers/VolunteerReferralBlock";
import { TEAM_LABELS, tierFor, TIER_LABEL, TIER_COLOR } from "@/lib/volunteersData";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

const SOCIAL_ICONS = {
  linkedin: Linkedin, twitter: Twitter, instagram: Instagram,
  facebook: Facebook, youtube: Youtube, github: Github,
  website: Link2, email: Mail,
} as const;

function normalizeSocialUrl(key: string, value: string): string {
  if (key === "email") return `mailto:${value}`;
  if (value.startsWith("http")) return value;
  const map: Record<string, string> = {
    twitter: "https://twitter.com/",
    linkedin: "https://linkedin.com/in/",
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    youtube: "https://youtube.com/",
    github: "https://github.com/",
    tiktok: "https://tiktok.com/@",
  };
  return (map[key] ?? "https://") + value.replace(/^@/, "");
}

export default function VolunteerProfile() {
  const { slug } = useParams<{ slug: string }>();
  const { volunteer, loading } = useVolunteerBySlug(slug);

  if (loading) {
    return <div className="min-h-screen bg-charcoal flex items-center justify-center text-white/60">Loading…</div>;
  }
  if (!volunteer) {
    return (
      <div className="min-h-screen bg-charcoal pb-20 pt-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-playfair text-3xl text-gold mb-3">Volunteer not found</h1>
          <Button asChild variant="outline" className="border-gold/40 text-gold">
            <Link to="/volunteers"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Directory</Link>
          </Button>
        </div>
      </div>
    );
  }

  const v = volunteer;
  const tier = tierFor(v.contributionScore);
  const socials = Object.entries(v.socialLinks).filter(([, val]) => val);

  return (
    <div className="min-h-screen bg-charcoal pb-24">
      <Helmet>
        <title>{`${v.fullName} — NESA-Africa Volunteer`}</title>
        <meta name="description" content={v.bio ?? `${v.fullName} is a NESA-Africa volunteer contributing to ${v.teamSlug ? TEAM_LABELS[v.teamSlug] : "the movement"}.`} />
      </Helmet>

      {/* HERO */}
      <section className="relative border-b border-gold/20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-charcoal to-black" />
        <div className="absolute inset-0 opacity-20"
             style={{ backgroundImage: "radial-gradient(circle at 30% 20%, hsl(42 85% 52% / 0.4), transparent 50%)" }} />
        <div className="relative container mx-auto px-4 py-10 md:py-16">
          <Link to="/volunteers" className="inline-flex items-center gap-1 text-gold/80 hover:text-gold text-sm mb-6">
            <ArrowLeft className="h-4 w-4" /> Back to Directory
          </Link>
          <motion.div {...fadeUp} className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 md:gap-10 items-start">
            <div className="relative">
              <div className={`absolute -inset-1.5 rounded-full bg-gradient-to-br ${TIER_COLOR[tier]} opacity-60 blur-sm`} />
              <div className="relative h-32 w-32 md:h-44 md:w-44 rounded-full overflow-hidden border-4 border-gold/60 bg-gold/10">
                {v.photoUrl ? (
                  <img src={v.photoUrl} alt={v.fullName} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-gold/40">
                    <Users className="h-16 w-16" />
                  </div>
                )}
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge className={`bg-gradient-to-r ${TIER_COLOR[tier]} text-black border-0`}>
                  <Crown className="h-3 w-3 mr-1" /> {TIER_LABEL[tier]}
                </Badge>
                {v.badges.includes("verified") && (
                  <Badge className="bg-gold/20 text-gold border-gold/40"><BadgeCheck className="h-3 w-3 mr-1" /> Verified</Badge>
                )}
                {v.badges.includes("founding") && (
                  <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/40"><Sparkles className="h-3 w-3 mr-1" /> Founding</Badge>
                )}
                {v.badges.includes("lead") && (
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/40">Team Lead</Badge>
                )}
              </div>
              <h1 className="font-playfair text-3xl md:text-5xl text-gold font-bold leading-tight">{v.fullName}</h1>
              {v.headline && <p className="text-white/80 mt-2 text-base md:text-lg">{v.headline}</p>}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-sm text-white/60">
                {v.teamSlug && <span className="flex items-center gap-1"><Target className="h-3.5 w-3.5 text-gold" /> {TEAM_LABELS[v.teamSlug]}</span>}
                {v.country && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-gold" /> {v.country}</span>}
                {v.region && <span className="flex items-center gap-1"><Globe className="h-3.5 w-3.5 text-gold" /> {v.region}</span>}
                <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5 text-gold" /> Since {new Date(v.joinedAt).getFullYear()}</span>
              </div>

              <div className="flex flex-wrap gap-2 mt-5">
                {/* Certificate eligibility — based on contribution score */}
                {v.contributionScore >= 100 && (
                  <Badge className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 self-center">
                    <BadgeCheck className="h-3 w-3 mr-1" /> Certificate eligible
                  </Badge>
                )}
                <Button asChild size="sm" className="bg-gold text-black hover:bg-gold/90">
                  <a href={`/join?v=${encodeURIComponent(v.referralCode)}`}><Share2 className="mr-1 h-4 w-4" /> Join via {v.fullName.split(" ")[0]}</a>
                </Button>
                <Button asChild size="sm" variant="outline" className="border-gold/50 text-gold hover:bg-gold/10">
                  <Link to="/chapters">Join Their Chapter</Link>
                </Button>
                <Button asChild size="sm" variant="outline" className="border-gold/50 text-gold hover:bg-gold/10">
                  <Link to="/dashboard/volunteer">Volunteer Dashboard</Link>
                </Button>
                <Button asChild size="sm" variant="ghost" className="text-white/80 hover:text-gold">
                  <Link to="/volunteer">Become a Volunteer</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 mt-10 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        <div className="space-y-6">
          {/* CONTRIBUTION SUMMARY */}
          <Card className="border-gold/20 bg-gradient-to-br from-charcoal to-black p-6">
            <h3 className="font-playfair text-xl text-gold mb-4">Contribution Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Score", value: v.contributionScore, icon: Trophy },
                { label: "Tasks", value: v.tasksCompleted, icon: BadgeCheck },
                { label: "Referrals", value: v.referralCount, icon: Share2 },
                { label: "Years", value: new Date().getFullYear() - new Date(v.joinedAt).getFullYear() + 1, icon: Calendar },
              ].map((s) => (
                <div key={s.label} className="rounded-lg border border-gold/10 bg-black/30 p-3 text-center">
                  <s.icon className="h-4 w-4 text-gold mx-auto mb-1" />
                  <div className="text-xl font-bold text-gold">{s.value}</div>
                  <div className="text-[10px] uppercase tracking-wider text-white/50">{s.label}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* BIO */}
          {v.bio && (
            <Card className="border-gold/20 bg-gradient-to-br from-charcoal to-black p-6">
              <h3 className="font-playfair text-xl text-gold mb-3">About {v.fullName.split(" ")[0]}</h3>
              <p className="text-white/80 leading-relaxed whitespace-pre-wrap">{v.bio}</p>
            </Card>
          )}

          {/* BADGES */}
          {v.badges.length > 0 && (
            <Card className="border-gold/20 bg-gradient-to-br from-charcoal to-black p-6">
              <h3 className="font-playfair text-xl text-gold mb-3">Badges & Recognition</h3>
              <div className="flex flex-wrap gap-2">
                {v.badges.map((b) => (
                  <Badge key={b} variant="outline" className="border-gold/40 text-gold capitalize">
                    <Award className="h-3 w-3 mr-1" /> {b.replace(/_/g, " ")}
                  </Badge>
                ))}
              </div>
            </Card>
          )}

          {/* SOCIALS */}
          {socials.length > 0 && (
            <Card className="border-gold/20 bg-gradient-to-br from-charcoal to-black p-6">
              <h3 className="font-playfair text-xl text-gold mb-3">Connect</h3>
              <div className="flex flex-wrap gap-2">
                {socials.map(([k, val]) => {
                  const Icon = (SOCIAL_ICONS as Record<string, typeof Link2>)[k] ?? Link2;
                  return (
                    <a key={k} href={normalizeSocialUrl(k, val as string)} target="_blank" rel="noopener noreferrer"
                       className="flex items-center gap-1.5 rounded-md border border-gold/20 bg-black/30 px-3 py-1.5 text-xs text-white/80 hover:bg-gold/10 hover:border-gold/50 transition capitalize">
                      <Icon className="h-3.5 w-3.5" /> {k}
                    </a>
                  );
                })}
              </div>
            </Card>
          )}
        </div>

        {/* SIDEBAR */}
        <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <VolunteerReferralBlock referralCode={v.referralCode} volunteerName={v.fullName} />
        </div>
      </div>
    </div>
  );
}
