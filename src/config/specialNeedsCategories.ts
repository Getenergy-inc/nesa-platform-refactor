// Rebuild My School Africa — Special Needs Category System
// 5 Intervention Tracks + 20 Subcategories (for nomination form, BOD review, voting, intervention, impact reporting)

import {
  Brain, Sparkles, Baby, BookOpen,
  Ear, Eye, MessageSquare, Volume2,
  Accessibility, Heart, Shield, Stethoscope,
  GraduationCap, School, Users, Star,
  Hammer, Laptop, Palette, type LucideIcon,
} from "lucide-react";

export interface SpecialNeedsSubcategory {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
}

export interface SpecialNeedsTrack {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  interventionExamples: string[];
  subcategories: SpecialNeedsSubcategory[];
}

export const SPECIAL_NEEDS_TRACKS: SpecialNeedsTrack[] = [
  {
    id: "neurodevelopment-cognitive",
    name: "Neurodevelopment & Cognitive Support",
    description: "For schools serving learners with cognitive or developmental conditions",
    icon: Brain,
    interventionExamples: ["Sensory rooms", "Therapy centers", "Behavioral intervention labs"],
    subcategories: [
      { id: "autism-spectrum", name: "Autism Spectrum Support Schools", description: "Structured environments, sensory-friendly spaces, ABA therapy support", icon: Sparkles },
      { id: "intellectual-disability", name: "Intellectual Disability Education Schools", description: "Life skills training, individualized education programs, sensory rooms", icon: Brain },
      { id: "down-syndrome", name: "Down Syndrome Support Schools", description: "Early intervention, speech therapy, inclusive classrooms", icon: Baby },
      { id: "adhd-behavioral", name: "ADHD & Behavioral Development Schools", description: "Behavioral intervention, focus training, structured learning environments", icon: Star },
      { id: "neurodevelopmental-therapy", name: "Neurodevelopmental Therapy-Based Schools", description: "Comprehensive therapy integration, multi-disciplinary support", icon: BookOpen },
    ],
  },
  {
    id: "sensory-communication",
    name: "Sensory & Communication Support",
    description: "For schools focused on sensory impairments",
    icon: Ear,
    interventionExamples: ["Braille labs", "Sign language training rooms", "Communication devices", "Audio enhancement systems"],
    subcategories: [
      { id: "hearing-impairment", name: "Hearing Impairment Schools", description: "Hearing aid support, auditory training, assistive listening devices", icon: Volume2 },
      { id: "deaf-education", name: "Deaf Education Schools", description: "Sign language instruction, speech therapy, deaf culture programs", icon: Ear },
      { id: "visual-impairment", name: "Visual Impairment / Blind Schools", description: "Braille curriculum, mobility training, assistive technology", icon: Eye },
      { id: "speech-language", name: "Speech & Language Disorder Schools", description: "Speech therapy, augmentative communication, language development", icon: MessageSquare },
    ],
  },
  {
    id: "physical-mobility",
    name: "Physical & Mobility Support",
    description: "For schools serving learners with physical disabilities",
    icon: Accessibility,
    interventionExamples: ["Accessible ramps", "Mobility equipment", "Therapy units", "Medical learning integration"],
    subcategories: [
      { id: "cerebral-palsy", name: "Cerebral Palsy Support Schools", description: "Occupational therapy, adaptive seating, communication aids", icon: Heart },
      { id: "mobility-physical", name: "Mobility & Physical Disability Schools", description: "Wheelchair-accessible facilities, physiotherapy, adapted sports", icon: Accessibility },
      { id: "severe-multiple", name: "Severe & Multiple Disabilities Schools", description: "Multi-disciplinary care, specialized nursing, holistic support", icon: Shield },
      { id: "medical-integrated", name: "Medical-Integrated Special Needs Schools", description: "On-site medical support, health monitoring, therapeutic learning", icon: Stethoscope },
    ],
  },
  {
    id: "learning-differences-inclusive",
    name: "Learning Differences & Inclusive Education",
    description: "For inclusive education models and learning disorders",
    icon: GraduationCap,
    interventionExamples: ["Assistive technology labs", "Teacher training", "Specialized learning materials", "Inclusive classroom upgrades"],
    subcategories: [
      { id: "dyslexia-learning", name: "Dyslexia & Learning Difference Schools", description: "Specialized reading programs, multisensory instruction, adaptive tools", icon: BookOpen },
      { id: "inclusive-mainstream", name: "Inclusive Mainstream Schools with Special Needs Units", description: "Integrated special education units, resource rooms, support staff", icon: School },
      { id: "early-intervention", name: "Early Intervention Centers (0–5 Years)", description: "Pre-school developmental support, family guidance, screening programs", icon: Baby },
      { id: "twice-exceptional", name: "Twice Exceptional (Gifted + Special Needs) Schools", description: "Dual-track programming for gifted learners with disabilities", icon: Users },
    ],
  },
  {
    id: "life-skills-vocational",
    name: "Life Skills & Vocational Empowerment",
    description: "For long-term independence training",
    icon: Hammer,
    interventionExamples: ["Skills labs", "Technology training", "Art & therapy spaces", "Entrepreneurship workshops"],
    subcategories: [
      { id: "vocational-special", name: "Vocational Special Needs Schools", description: "Trade skills, employment preparation, workplace readiness", icon: Hammer },
      { id: "assistive-technology", name: "Assistive Technology Education Schools", description: "Digital literacy, assistive devices training, tech-based learning", icon: Laptop },
      { id: "therapeutic-arts", name: "Therapeutic Arts-Based Special Education Centers", description: "Art therapy, music therapy, creative expression programs", icon: Palette },
    ],
  },
];

// Flat list of all subcategories (for form select)
export const ALL_SUBCATEGORIES = SPECIAL_NEEDS_TRACKS.flatMap((track) =>
  track.subcategories.map((sub) => ({
    ...sub,
    trackId: track.id,
    trackName: track.name,
  }))
);
