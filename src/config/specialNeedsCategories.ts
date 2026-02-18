// Rebuild My School Africa — Special Needs Category System
// 5 Tracks + 20 Subcategories (for nomination form)

import {
  Ear, Eye, Accessibility, Brain, Sparkles,
  School, Baby, Landmark, Hammer, BookOpen,
  HandHeart, Star, Globe, Users, Building2, Laptop,
  GraduationCap, Heart, Shield, type LucideIcon,
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
  subcategories: SpecialNeedsSubcategory[];
}

export const SPECIAL_NEEDS_TRACKS: SpecialNeedsTrack[] = [
  {
    id: "sensory-disabilities",
    name: "Sensory Disabilities",
    description: "Schools serving students with hearing, visual, or dual-sensory impairments",
    icon: Eye,
    subcategories: [
      { id: "deaf", name: "Schools for the Deaf", description: "Sign language instruction, hearing aid support, speech therapy", icon: Ear },
      { id: "blind", name: "Schools for the Blind & Visually Impaired", description: "Braille curriculum, mobility training, assistive technology", icon: Eye },
      { id: "deafblind", name: "Schools for Deafblind Students", description: "Specialized tactile communication and support services", icon: HandHeart },
      { id: "low-vision", name: "Low Vision Resource Centres", description: "Optical aids, magnification tools, and adaptive learning", icon: BookOpen },
    ],
  },
  {
    id: "physical-motor",
    name: "Physical & Motor Disabilities",
    description: "Schools with accessible infrastructure for physical mobility challenges",
    icon: Accessibility,
    subcategories: [
      { id: "physical", name: "Schools for Physical Disabilities", description: "Wheelchair-accessible facilities, physiotherapy rooms, adapted sports", icon: Accessibility },
      { id: "cerebral-palsy", name: "Cerebral Palsy Centres", description: "Occupational therapy, adaptive seating, and communication aids", icon: Heart },
      { id: "orthopaedic", name: "Orthopaedic & Mobility Schools", description: "Prosthetic support, mobility training, and rehabilitation", icon: Shield },
      { id: "vocational-physical", name: "Vocational Training (Physical)", description: "Trade skills adapted for learners with physical challenges", icon: Hammer },
    ],
  },
  {
    id: "intellectual-developmental",
    name: "Intellectual & Developmental",
    description: "Schools supporting learners with cognitive and developmental differences",
    icon: Brain,
    subcategories: [
      { id: "intellectual", name: "Schools for Intellectual Disabilities", description: "Life skills training, sensory rooms, individualized education programs", icon: Brain },
      { id: "autism", name: "Schools for Autism Spectrum", description: "Structured environments, sensory-friendly spaces, ABA therapy support", icon: Sparkles },
      { id: "down-syndrome", name: "Down Syndrome Learning Centres", description: "Early intervention, speech therapy, and inclusive classrooms", icon: Baby },
      { id: "early-intervention", name: "Early Intervention Centres", description: "Pre-school support for children with developmental delays (0–6 years)", icon: Baby },
    ],
  },
  {
    id: "community-inclusive",
    name: "Community & Inclusive Models",
    description: "Community-driven and grassroots special needs education initiatives",
    icon: Users,
    subcategories: [
      { id: "inclusive-mainstream", name: "Inclusive / Mainstream Schools", description: "Regular schools with integrated special education units and support staff", icon: School },
      { id: "cbr", name: "Community-Based Rehabilitation (CBR)", description: "Grassroots disability support and home-based learning programs", icon: HandHeart },
      { id: "faith-based", name: "Faith-Based Special Needs Schools", description: "Church/mosque-run schools offering care and education", icon: Star },
      { id: "ngo-run", name: "NGO-Run Learning Centres", description: "Non-profit operated programs for underserved disabled children", icon: Globe },
    ],
  },
  {
    id: "alternative-access",
    name: "Alternative & Access Models",
    description: "Non-traditional delivery models reaching underserved communities",
    icon: Laptop,
    subcategories: [
      { id: "mobile-outreach", name: "Mobile & Outreach Schools", description: "Traveling teachers reaching remote/nomadic communities", icon: Building2 },
      { id: "digital-elearning", name: "Digital & E-Learning Programmes", description: "Online/radio-based learning for disabled students in inaccessible areas", icon: Laptop },
      { id: "government-special", name: "Government Special Education Schools", description: "State-funded institutions for various disabilities", icon: Landmark },
      { id: "resource-centres", name: "Resource Centres for Special Needs", description: "Assessment, referral, and material support hubs", icon: GraduationCap },
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
