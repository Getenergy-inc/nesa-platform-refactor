import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Building, Linkedin, ExternalLink } from "lucide-react";

export interface JudgeProfile {
  name: string;
  title: string;
  country: string;
  organization: string;
  expertise: string;
  photo: string | null;
  linkedin?: string;
}

// Featured judges with profile photos
export const FEATURED_JUDGES: JudgeProfile[] = [
  {
    name: "Prof. Amina Okonkwo",
    title: "Vice-Chancellor",
    country: "Nigeria",
    organization: "University of Lagos",
    expertise: "Higher Education",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face",
    linkedin: "#",
  },
  {
    name: "Dr. Kwame Asante",
    title: "Director General",
    country: "Ghana",
    organization: "Ghana Education Service",
    expertise: "Policy & Governance",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    linkedin: "#",
  },
  {
    name: "Dr. Fatou Diallo",
    title: "Regional Advisor",
    country: "Senegal",
    organization: "UNESCO BREDA",
    expertise: "International Education",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face",
    linkedin: "#",
  },
  {
    name: "Prof. John Mwangi",
    title: "Director",
    country: "Kenya",
    organization: "Kenya Institute of Curriculum",
    expertise: "Curriculum Development",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    linkedin: "#",
  },
  {
    name: "Dr. Thandiwe Ndlovu",
    title: "Professor of Education",
    country: "South Africa",
    organization: "WITS University",
    expertise: "Teacher Training",
    photo: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&h=200&fit=crop&crop=face",
    linkedin: "#",
  },
  {
    name: "Prof. Ahmed Hassan",
    title: "Dean of Education",
    country: "Egypt",
    organization: "Cairo University",
    expertise: "STEM Education",
    photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face",
    linkedin: "#",
  },
  {
    name: "Dr. Grace Mbeki",
    title: "Senior Lecturer",
    country: "Tanzania",
    organization: "Dar es Salaam University",
    expertise: "Primary Education",
    photo: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=200&h=200&fit=crop&crop=face",
    linkedin: "#",
  },
  {
    name: "Prof. Samuel Owusu",
    title: "Provost",
    country: "Ghana",
    organization: "Ashesi University",
    expertise: "EdTech Innovation",
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face",
    linkedin: "#",
  },
];

const EXPERTISE_COLORS: Record<string, string> = {
  "Higher Education": "bg-blue-500/20 text-blue-300 border-blue-500/30",
  "Policy & Governance": "bg-purple-500/20 text-purple-300 border-purple-500/30",
  "International Education": "bg-green-500/20 text-green-300 border-green-500/30",
  "Curriculum Development": "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  "Teacher Training": "bg-pink-500/20 text-pink-300 border-pink-500/30",
  "STEM Education": "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  "Primary Education": "bg-orange-500/20 text-orange-300 border-orange-500/30",
  "EdTech Innovation": "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  default: "bg-gold/20 text-gold border-gold/30",
};

interface JudgeProfileCardProps {
  judge: JudgeProfile;
  index: number;
}

export function JudgeProfileCard({ judge, index }: JudgeProfileCardProps) {
  const initials = judge.name
    .split(" ")
    .filter((n) => n.length > 2)
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  const expertiseClass = EXPERTISE_COLORS[judge.expertise] || EXPERTISE_COLORS.default;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <Card className="group relative overflow-hidden border-white/10 bg-white/5 hover:border-gold/40 hover:bg-white/10 transition-all duration-300">
        {/* Decorative gold accent */}
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-gold via-gold/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <CardContent className="p-5">
          <div className="flex flex-col items-center text-center">
            {/* Photo */}
            <div className="relative mb-4">
              <div className="absolute -inset-1 bg-gradient-to-br from-gold/50 to-gold/0 rounded-full opacity-0 group-hover:opacity-100 blur transition-opacity" />
              <Avatar className="h-24 w-24 border-3 border-gold/30 shadow-xl relative">
                <AvatarImage 
                  src={judge.photo || undefined} 
                  alt={judge.name}
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-gold/20 to-gold/5 text-gold text-xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Name & Title */}
            <h4 className="font-display text-lg font-semibold text-white mb-1 group-hover:text-gold transition-colors">
              {judge.name}
            </h4>
            <p className="text-sm text-white/60 mb-2">{judge.title}</p>

            {/* Organization */}
            <div className="flex items-center gap-1.5 text-xs text-white/50 mb-3">
              <Building className="h-3.5 w-3.5" />
              <span className="truncate max-w-[180px]">{judge.organization}</span>
            </div>

            {/* Country Badge */}
            <div className="flex items-center gap-1.5 mb-3">
              <Badge variant="outline" className="text-xs border-white/20 text-white/70">
                <MapPin className="h-3 w-3 mr-1" />
                {judge.country}
              </Badge>
            </div>

            {/* Expertise Badge */}
            <Badge className={`text-xs ${expertiseClass}`}>
              {judge.expertise}
            </Badge>

            {/* LinkedIn (optional) */}
            {judge.linkedin && (
              <a
                href={judge.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center gap-1 text-xs text-white/40 hover:text-gold transition-colors"
              >
                <Linkedin className="h-3.5 w-3.5" />
                <span>View Profile</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function MeetOurJudgesSection() {
  return (
    <section className="bg-charcoal py-20 lg:py-28">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-gold/20 text-gold border-gold/40">
            Our Expert Panel
          </Badge>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Meet Our <span className="text-gold">Distinguished Judges</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Our jury comprises 27 eminent education leaders from across Africa, 
            each bringing decades of expertise in their respective fields.
          </p>
        </motion.div>

        {/* Judges Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_JUDGES.map((judge, index) => (
            <JudgeProfileCard key={judge.name} judge={judge} index={index} />
          ))}
        </div>

        {/* View All Indicator */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-10 text-white/50 text-sm"
        >
          Showing 8 of 27 jury members • Full panel accessible to approved judges
        </motion.p>
      </div>
    </section>
  );
}
