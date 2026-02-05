import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

// Import actual judge photos
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
}

// Actual NESA-Africa judges from the official website
export const FEATURED_JUDGES: JudgeProfile[] = [
  {
    name: "Mr Benneth Osarieme Ogbeiwi",
    title: "Head at Adrenaline Entertainment, Former Host at MTN Project Fame",
    country: "Nigeria",
    expertise: "Music & Arts Education",
    photo: judge1,
    bio: "A highly motivated individual with over two decades of experience sharing knowledge in music & the arts. His doggedness makes it impossible for individuals to deviate from the cause.",
  },
  {
    name: "Damilola Omotosho",
    title: "HSEQ Implementation & ESG Consultant",
    country: "Nigeria",
    expertise: "Quality & Safety",
    photo: judge7,
    bio: "Sustainability advocate and Cambridge-certified professional influencing energy transition literacy and corporate ESG frameworks in Africa.",
  },
  {
    name: "Dr Juliet Ihiabe",
    title: "Executive Director, Family Bond Helping Foundation",
    country: "Nigeria",
    expertise: "Philanthropy & Social Impact",
    photo: judge8,
    bio: "Championing access to education through health interventions, especially for women and children in underserved areas.",
  },
  {
    name: "Paul Kayode Joash",
    title: "Chief Rainmaker at MyDoubleDouble International",
    country: "Nigeria",
    expertise: "Business & Coaching",
    photo: judge9,
    bio: "A prolific international inspirational Speaker, Sales/Marketing Guru and Personal & Business Transformation Coach. Host of MyDoubleDouble TV/Radio.",
  },
  {
    name: "Oluwadaisi Patricia Aderibigbe Santos",
    title: "Veteran Educationalist",
    country: "Nigeria",
    expertise: "Education",
    photo: judge10,
    bio: "A trailblazer in women-led educational reform and a pillar of early childhood learning advocacy across Nigeria.",
  },
  {
    name: "Dr. Aminah Danjumah",
    title: "Yeelen Education Project",
    country: "Nigeria",
    expertise: "Rural Education",
    photo: judge6,
    bio: "Dedication to improving rural education, particularly for girls. Created an innovative mobile library system and successful partnership with government.",
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

        {/* Judges Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
          Showing 6 of 27 jury members • Full panel accessible to approved judges
        </motion.p>
      </div>
    </section>
  );
}
