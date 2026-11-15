// Shared presentation copy for the lean 2026 pages. Counts mirror the approved framework (4/22/90).
export const PROGRAMME_FACTS = [
  "Four recognition tiers", "22 main awards", "90 subcategories", "Nine Icon NRRC members",
  "Nine independent Icon judges", "Up to nine Africa Education Icons", "Nomination is free",
  "No public or AGC voting in 2026",
];

export interface TierCard {
  number: number; name: string; href: string; description: string;
  awards: string[]; selection: string;
}

export const TIER_CARDS: TierCard[] = [
  { number: 1, name: "Africa Education Icon", href: "/recognition/africa-education-icon",
    description: "Each award spans Africans in Africa, the Diaspora and Friends of Africa (up to nine Icons).",
    awards: ["Education Philanthropy Icon", "Literary and New Curriculum Advocate Icon", "Technical Educator Icon"],
    selection: "NRRC research, then nine independent Icon judges" },
  { number: 2, name: "Influencers Education Impact", href: "/recognition/influencers",
    description: "Public figures using their platforms to support education.",
    awards: ["Social Media Influencers", "Sports Icons", "Music Icons Supporting Education"],
    selection: "NRRC research and approved review pathway" },
  { number: 3, name: "Platinum Certificate", href: "/recognition/platinum",
    description: "Institutional and leadership contributions to education.",
    awards: ["Tertiary-Institution Library", "Research and Development", "Christian Education", "Islamic Education", "Political Leadership", "International Education Partnership", "Diaspora Educational Impact"],
    selection: "NRRC research and approved review pathway" },
  { number: 4, name: "Gold–Blue Garnet", href: "/recognition/gold-blue-garnet",
    description: "Organisations, programmes and innovations advancing education.",
    awards: ["CSR for Education in Africa", "CSR for Education in Nigeria", "EduTech Innovation", "Media for Education Advocacy", "NGO for Education in Nigeria", "NGO for Education in Africa", "STEM Education Programmes", "Creative Arts", "Education Policy and Implementation"],
    selection: "NRRC research and approved review pathway" },
];

export type MediaKind = "NESA-Africa TV" | "Webinars" | "Podcast" | "Documentaries" | "Interviews" | "News" | "E-Journal";
export const MEDIA_FILTERS = ["All", "NESA-Africa TV", "Webinars", "Podcast", "Documentaries", "Interviews", "News", "E-Journal"] as const;

export interface MediaCard { kind: MediaKind; title: string; body: string; cta: string; href: string; id?: string }
/** Contextual CTAs only; never "Join" for a completed or unavailable programme. */
export const MEDIA_CARDS: MediaCard[] = [
  { kind: "NESA-Africa TV", title: "NESA-Africa TV", body: "Interviews, documentaries, education news and programme coverage.", cta: "Watch", href: "/media/tv" },
  { kind: "Webinars", title: "Webinars", body: "Structured discussions with approved speakers and institutions.", cta: "Register / Receive Updates", href: "/media/webinars" },
  { kind: "Podcast", title: "Africa Education Enablers Podcast", body: "Education journeys, contributions, challenges and solutions.", cta: "Listen", href: "/media/podcast" },
  { kind: "Documentaries", title: "Documentaries", body: "Authorised films about enablers and verified programmes.", cta: "Coming After Approval", href: "", id: "documentaries" },
  { kind: "Interviews", title: "Interviews", body: "Authorised stories about education enablers.", cta: "Watch Recording", href: "/media/tv", id: "interviews" },
  { kind: "News", title: "News and press", body: "Approved announcements, releases and media resources.", cta: "Coming After Approval", href: "", id: "news" },
  { kind: "E-Journal", title: "EduAid-Africa E-Journal", body: "Documented learning, interventions and impact stories.", cta: "Read", href: "/journal" },
];
