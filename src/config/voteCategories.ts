/**
 * NESA-Africa Vote Categories Configuration
 * Single source of truth for the 9 voting categories
 * 
 * These categories represent the criteria by which nominees are evaluated
 * during both Gold Garnet and Blue Garnet voting.
 */

export interface VoteCategory {
  id: string;
  label: string;
  description: string;
  icon?: string; // lucide icon name
}

export const VOTE_CATEGORIES: VoteCategory[] = [
  {
    id: "innovation",
    label: "Innovation & Creativity",
    description: "Pioneering new approaches to education challenges",
    icon: "Lightbulb",
  },
  {
    id: "impact",
    label: "Community Impact",
    description: "Measurable positive change in communities",
    icon: "Users",
  },
  {
    id: "sustainability",
    label: "Sustainability",
    description: "Long-term viability and scalability of initiatives",
    icon: "Leaf",
  },
  {
    id: "inclusion",
    label: "Inclusion & Equity",
    description: "Promoting access for underserved populations",
    icon: "Heart",
  },
  {
    id: "leadership",
    label: "Leadership Excellence",
    description: "Inspiring and guiding others in education",
    icon: "Crown",
  },
  {
    id: "collaboration",
    label: "Partnership & Collaboration",
    description: "Building effective alliances for education",
    icon: "Handshake",
  },
  {
    id: "technology",
    label: "Technology Integration",
    description: "Effective use of technology in education",
    icon: "Monitor",
  },
  {
    id: "research",
    label: "Research & Evidence",
    description: "Data-driven approaches and academic rigor",
    icon: "BookOpen",
  },
  {
    id: "advocacy",
    label: "Advocacy & Policy",
    description: "Championing education policy reforms",
    icon: "Megaphone",
  },
];

export type VoteCategoryId = typeof VOTE_CATEGORIES[number]["id"];

export type VoteType = "gold_garnet" | "blue_garnet";

export const VOTE_TYPES: { id: VoteType; label: string; description: string; color: string }[] = [
  {
    id: "gold_garnet",
    label: "Gold Garnet",
    description: "100% public vote for approved nominees",
    color: "gold",
  },
  {
    id: "blue_garnet",
    label: "Blue Garnet",
    description: "40% public + 60% jury evaluation",
    color: "blue",
  },
];

/**
 * Get a vote category by ID
 */
export function getVoteCategory(id: string): VoteCategory | undefined {
  return VOTE_CATEGORIES.find((cat) => cat.id === id);
}

/**
 * Validate that a category ID is valid
 */
export function isValidVoteCategory(id: string): boolean {
  return VOTE_CATEGORIES.some((cat) => cat.id === id);
}

/**
 * Validate that a vote type is valid
 */
export function isValidVoteType(type: string): type is VoteType {
  return type === "gold_garnet" || type === "blue_garnet";
}
