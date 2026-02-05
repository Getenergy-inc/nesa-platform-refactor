import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

export interface JudgeProfile {
  name: string;
  title: string;
  country: string;
  expertise: string;
  photo: string;
}

// Featured judges data - based on actual platform judges
// Photos are representative placeholders until actual photos are uploaded
export const FEATURED_JUDGES: JudgeProfile[] = [
  {
    name: "Oluwadaisi Patricia Aderibigbe Santos",
    title: "Educationalist",
    country: "Nigeria",
    expertise: "Education",
    photo: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=400&h=500&fit=crop&crop=face",
  },
  {
    name: "Damilola O.",
    title: "QHSSE Manager",
    country: "Nigeria",
    expertise: "Quality & Safety",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop&crop=face",
  },
  {
    name: "Benneth Osarieme Ogbeiwi",
    title: "Head at Adrenaline Entertainment, Former Host at MTN Project Fame",
    country: "Nigeria",
    expertise: "Philanthropy & Social Impact",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face",
  },
  {
    name: "Dr Juliet Ihiabe",
    title: "Executive Director of Family Bond Helping Foundation",
    country: "Nigeria",
    expertise: "Philanthropy & Social Impact",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop&crop=face",
  },
  {
    name: "Paul-Kayode Joash",
    title: "Chief Rainmaker at MyDoubleDou International",
    country: "Nigeria",
    expertise: "Business",
    photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=500&fit=crop&crop=face",
  },
  {
    name: "Dr. Grace Mbeki",
    title: "Senior Lecturer, Dar es Salaam University",
    country: "Tanzania",
    expertise: "Primary Education",
    photo: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=500&fit=crop&crop=face",
  },
  {
    name: "Prof. Samuel Owusu",
    title: "Provost, Ashesi University",
    country: "Ghana",
    expertise: "EdTech Innovation",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&crop=face",
  },
  {
    name: "Dr. Fatou Diallo",
    title: "Regional Advisor, UNESCO BREDA",
    country: "Senegal",
    expertise: "International Education",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop&crop=face",
  },
];

interface JudgeCardProps {
  judge: JudgeProfile;
  index: number;
}

function JudgeCard({ judge, index }: JudgeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group relative"
    >
      {/* Card Container */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-charcoal/80 to-charcoal border border-white/10 hover:border-gold/30 transition-all duration-300">
        {/* Expertise Badge - Floating top right */}
        <Badge 
          className="absolute top-4 right-4 z-10 bg-gold text-charcoal font-semibold px-3 py-1 text-xs shadow-lg"
        >
          {judge.expertise}
        </Badge>
        
        {/* Photo Container */}
        <div className="relative aspect-[4/5] overflow-hidden">
          <img
            src={judge.photo}
            alt={judge.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent" />
        </div>
        
        {/* Info Panel - Overlaid at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-white/10 to-transparent backdrop-blur-sm border-t border-white/10 rounded-b-2xl">
          <h4 className="font-display text-xl font-bold text-white mb-1 leading-tight">
            {judge.name}
          </h4>
          <p className="text-sm text-white/70 mb-2 whitespace-pre-line line-clamp-2">
            {judge.title}
          </p>
          <div className="flex items-center gap-1.5 text-gold/80">
            <MapPin className="h-3.5 w-3.5" />
            <span className="text-sm">{judge.country}</span>
          </div>
        </div>
        
        {/* Decorative corner accent */}
        <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
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
          className="text-center mb-14"
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

        {/* Judges Grid - Matching screenshot layout */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {FEATURED_JUDGES.map((judge, index) => (
            <JudgeCard key={judge.name} judge={judge} index={index} />
          ))}
        </div>

        {/* View All Indicator */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12 text-white/50 text-sm"
        >
          Showing 8 of 27 jury members • Full panel accessible to approved judges
        </motion.p>
      </div>
    </section>
  );
}
