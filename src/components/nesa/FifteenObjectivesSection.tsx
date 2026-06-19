// 15 Strategic Objectives — NESA-Africa institutional framework.
// Charcoal/Gold tokens, no custom CSS, no inline styles.
import {
  Award, Users, Globe2, Building2, GraduationCap, HandHeart,
  Megaphone, Shield, Coins, BookOpen, Plane, School,
  Sparkles, Network, LineChart,
} from "lucide-react";

const OBJECTIVES = [
  { icon: Award,        title: "Recognise Excellence",          body: "Honour outstanding individuals, institutions and initiatives advancing education across Africa." },
  { icon: Users,        title: "Mobilise Public Participation", body: "Engage citizens, diaspora and stakeholders in transparent nomination, endorsement and voting." },
  { icon: Globe2,       title: "Strengthen Continental Identity", body: "Position African education leadership within a unified Pan-African recognition framework." },
  { icon: Building2,    title: "Empower Institutions",          body: "Elevate schools, NGOs, faith bodies and companies driving systemic education reform." },
  { icon: GraduationCap,title: "Champion Learners",             body: "Centre children, youth and adult learners as the ultimate beneficiaries of every award cycle." },
  { icon: HandHeart,    title: "Catalyse Philanthropy",         body: "Convert recognition into structured donations, sponsorships and CSR investment in education." },
  { icon: Megaphone,    title: "Amplify Advocacy",              body: "Use media, storytelling and ambassadors to advance Education For All across all 10 regions." },
  { icon: Shield,       title: "Uphold Integrity",              body: "Operate an auditable governance, judging and EDI framework that the public can trust." },
  { icon: Coins,        title: "Build the AGC Economy",         body: "Operate the Afri-Gold Coin (AGC) Voting Coin system as a transparent participation currency." },
  { icon: BookOpen,     title: "Advance Research & Knowledge",  body: "Recognise and document innovation, research and best practice in African education." },
  { icon: Plane,        title: "Grow Afri-EduTourism",          body: "Connect global partners to African education through learning visits, conferences and commissioning." },
  { icon: School,       title: "Rebuild Schools",               body: "Channel award legacy into the Rebuild My School Africa (RMSA) intervention pipeline." },
  { icon: Sparkles,     title: "Develop Talent & Volunteers",   body: "Cultivate regional ambassadors, volunteers, judges and Local Chapter Coordinators." },
  { icon: Network,      title: "Forge Strategic Partnerships",  body: "Build alliances with governments, AU, SDG bodies, media, sponsors and education ecosystems." },
  { icon: LineChart,    title: "Drive Measurable Impact",       body: "Track, report and publish education outcomes attributable to NESA-Africa recognition cycles." },
];

export function FifteenObjectivesSection() {
  return (
    <section id="objectives" className="bg-charcoal py-16 md:py-20">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="text-center mb-10 md:mb-14">
          <p className="text-gold text-sm font-medium mb-2 uppercase tracking-wide">
            Strategic Framework
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Our 15 Strategic Objectives
          </h2>
          <p className="text-white/70 max-w-3xl mx-auto leading-relaxed">
            Fifteen interconnected commitments that turn recognition into systemic
            education transformation across Africa.
          </p>
        </div>

        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {OBJECTIVES.map((o, i) => {
            const Icon = o.icon;
            return (
              <li
                key={o.title}
                className="rounded-2xl border border-gold/20 bg-charcoal-light p-5 hover:border-gold/50 transition-colors"
              >
                <div className="flex items-start gap-3 mb-2">
                  <span className="inline-flex items-center justify-center h-9 w-9 shrink-0 rounded-full bg-gold/15 text-gold font-bold text-sm">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex items-center gap-2 min-w-0">
                    <Icon className="h-4 w-4 text-gold shrink-0" />
                    <h3 className="font-display text-base md:text-lg font-bold text-white leading-tight">
                      {o.title}
                    </h3>
                  </div>
                </div>
                <p className="text-white/70 text-sm leading-relaxed pl-12">
                  {o.body}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
