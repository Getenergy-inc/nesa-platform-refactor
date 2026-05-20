import hostsOnStage from "@/assets/gallery/nesa-2025/hosts-on-stage.jpg";
import hostPortrait from "@/assets/gallery/nesa-2025/host-portrait.jpg";
import honoureesWithHost from "@/assets/gallery/nesa-2025/honourees-with-host.jpg";
import redCarpet from "@/assets/gallery/nesa-2025/red-carpet-moment.jpg";
import winnersTrio from "@/assets/gallery/nesa-2025/winners-trio.jpg";
import awardPresentation from "@/assets/gallery/nesa-2025/award-presentation.jpg";
import couplePurpleCarpet from "@/assets/gallery/nesa-2025/couple-purple-carpet.jpg";
import productionTeamGroup from "@/assets/gallery/nesa-2025/production-team-group.jpg";
import hostWithGuests from "@/assets/gallery/nesa-2025/host-with-guests.jpg";
import guestsCandidMoment from "@/assets/gallery/nesa-2025/guests-candid-moment.jpg";
import hostHandshake from "@/assets/gallery/nesa-2025/host-handshake.jpg";
import hostWithHonoureePink from "@/assets/gallery/nesa-2025/host-with-honouree-pink.jpg";
import guestsTrioSelfie from "@/assets/gallery/nesa-2025/guests-trio-selfie.jpg";
import hostWithHostPortrait from "@/assets/gallery/nesa-2025/host-with-host-portrait.jpg";

export type GalleryCategory =
  | "ceremony"
  | "honourees"
  | "speakers"
  | "leaders"
  | "gala"
  | "behind-the-scenes"
  | "nominees"
  | "youth"
  | "partnerships"
  | "csr"
  | "digital-voices"
  | "icons"
  | "regional"
  | "press";

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  title: string;
  caption?: string;
  category: GalleryCategory;
  collection: string;
  year: number;
  photographer?: string;
  featured?: boolean;
}

export interface GalleryCollection {
  slug: string;
  title: string;
  description: string;
  story: string;
  year: number;
  location?: string;
  cover: string;
  images: string[]; // image ids
}

export const GALLERY_CATEGORIES: { id: GalleryCategory; label: string }[] = [
  { id: "ceremony", label: "Award Ceremony Moments" },
  { id: "honourees", label: "Honourees & Winners" },
  { id: "speakers", label: "Speakers & Hosts" },
  { id: "leaders", label: "Education Leaders" },
  { id: "gala", label: "Gala & Red Carpet" },
  { id: "behind-the-scenes", label: "Behind the Scenes" },
  { id: "nominees", label: "Nominee Spotlights" },
  { id: "youth", label: "Youth & Community Impact" },
  { id: "partnerships", label: "International Partnerships" },
  { id: "csr", label: "CSR & NGO Impact" },
  { id: "digital-voices", label: "Digital Voices & Influencers" },
  { id: "icons", label: "Africa Education Icon Moments" },
  { id: "regional", label: "Regional Events" },
  { id: "press", label: "Press & Media Coverage" },
];

export const galleryImages: GalleryImage[] = [
  {
    id: "nesa25-hosts-on-stage",
    src: hostsOnStage,
    alt: "NESA Africa 2025 award ceremony hosts on stage with continental Africa backdrop",
    title: "Opening Address — NESA Africa 2025",
    caption:
      "The official hosts welcome the continent to the NESA Africa 2025 recognition ceremony.",
    category: "speakers",
    collection: "nesa-africa-2025-awards",
    year: 2025,
    featured: true,
  },
  {
    id: "nesa25-host-portrait",
    src: hostPortrait,
    alt: "Master of Ceremony at NESA Africa 2025 in tuxedo and green bowtie",
    title: "Master of Ceremony",
    caption: "Voice of the night — guiding the continent through the honours.",
    category: "speakers",
    collection: "nesa-africa-2025-awards",
    year: 2025,
  },
  {
    id: "nesa25-award-presentation",
    src: awardPresentation,
    alt: "Honouree receiving NESA Africa 2025 trophy on stage",
    title: "The Moment of Recognition",
    caption: "A NESA Africa 2025 honouree receives her trophy.",
    category: "honourees",
    collection: "nesa-africa-2025-awards",
    year: 2025,
    featured: true,
  },
  {
    id: "nesa25-winners-trio",
    src: winnersTrio,
    alt: "Three NESA Africa 2025 honourees in African attire on stage",
    title: "Daughters of the Movement",
    caption: "Three honourees stand together after the recognition ceremony.",
    category: "honourees",
    collection: "nesa-africa-2025-awards",
    year: 2025,
    featured: true,
  },
  {
    id: "nesa25-honourees-with-host",
    src: honoureesWithHost,
    alt: "NESA Africa 2025 honourees with host on the recognition stage",
    title: "Backstage Honours",
    caption: "Honourees share a moment with the host after the ceremony.",
    category: "behind-the-scenes",
    collection: "nesa-africa-2025-awards",
    year: 2025,
  },
  {
    id: "nesa25-red-carpet",
    src: redCarpet,
    alt: "NESA Africa 2025 red carpet moment with host and honouree",
    title: "Red Carpet Moment",
    caption: "A celebrated moment on the NESA Africa red carpet.",
    category: "gala",
    collection: "nesa-africa-2025-awards",
    year: 2025,
    featured: true,
  },
  {
    id: "nesa25-couple-purple-carpet",
    src: couplePurpleCarpet,
    alt: "Host and honouree on NESA Africa 2025 purple carpet in formal attire",
    title: "An Evening of Elegance",
    caption: "Guests arrive on the NESA Africa 2025 purple carpet in continental finery.",
    category: "gala",
    collection: "nesa-africa-2025-awards",
    year: 2025,
    featured: true,
  },
  {
    id: "nesa25-production-team-group",
    src: productionTeamGroup,
    alt: "NESA Africa 2025 production and crew team group photo on stage",
    title: "The Team Behind the Stage",
    caption: "Production crew, cast and hosts who powered the NESA Africa 2025 night.",
    category: "behind-the-scenes",
    collection: "nesa-africa-2025-awards",
    year: 2025,
  },
  {
    id: "nesa25-host-with-guests",
    src: hostWithGuests,
    alt: "NESA Africa 2025 host flanked by two honourees in front of the official backdrop",
    title: "Honoured Together",
    caption: "The host with two honourees of the New Education Standard Award Africa 2025.",
    category: "honourees",
    collection: "nesa-africa-2025-awards",
    year: 2025,
  },
  {
    id: "nesa25-guests-candid",
    src: guestsCandidMoment,
    alt: "Guests sharing a candid celebratory moment at NESA Africa 2025",
    title: "Off-Script Celebration",
    caption: "A candid moment of joy among guests after the formal ceremony.",
    category: "gala",
    collection: "nesa-africa-2025-awards",
    year: 2025,
  },
  {
    id: "nesa25-host-handshake",
    src: hostHandshake,
    alt: "NESA Africa 2025 host shaking hands with a member of the production team",
    title: "Respect in the Spotlight",
    caption: "A handshake exchanged with one of the crew members keeping the night alive.",
    category: "behind-the-scenes",
    collection: "nesa-africa-2025-awards",
    year: 2025,
  },
  {
    id: "nesa25-host-with-honouree-pink",
    src: hostWithHonoureePink,
    alt: "Host with female honouree in red and pink attire on the NESA Africa 2025 stage",
    title: "Standing With the Honourees",
    caption: "The host stands with an honouree on the NESA Africa 2025 stage.",
    category: "honourees",
    collection: "nesa-africa-2025-awards",
    year: 2025,
    featured: true,
  },
  {
    id: "nesa25-guests-trio-selfie",
    src: guestsTrioSelfie,
    alt: "Three NESA Africa 2025 guests posing close together for a selfie-style portrait",
    title: "Friends of the Movement",
    caption: "Guests of the night share a close-up frame after the ceremony.",
    category: "gala",
    collection: "nesa-africa-2025-awards",
    year: 2025,
  },
  {
    id: "nesa25-host-host-portrait",
    src: hostWithHostPortrait,
    alt: "NESA Africa 2025 host and co-host portrait in front of the official backdrop",
    title: "Voices of the Night",
    caption: "Hosting duo of the NESA Africa 2025 recognition ceremony.",
    category: "speakers",
    collection: "nesa-africa-2025-awards",
    year: 2025,
  },
];

export const galleryCollections: GalleryCollection[] = [
  {
    slug: "nesa-africa-2025-awards",
    title: "NESA Africa 2025 — The Recognition Ceremony",
    description:
      "Inside the continental stage where Africa's education leaders, institutions and changemakers were honoured.",
    story:
      "From the opening address to the final trophy lift, NESA Africa 2025 brought together honourees, education leaders, partners and storytellers from across the continent. These frames capture the people, the prestige and the purpose behind the New Education Standard Award Africa movement.",
    year: 2025,
    location: "Lagos, Nigeria",
    cover: hostsOnStage,
    images: [
      "nesa25-hosts-on-stage",
      "nesa25-award-presentation",
      "nesa25-winners-trio",
      "nesa25-couple-purple-carpet",
      "nesa25-host-with-honouree-pink",
      "nesa25-host-with-guests",
      "nesa25-host-host-portrait",
      "nesa25-host-portrait",
      "nesa25-honourees-with-host",
      "nesa25-red-carpet",
      "nesa25-guests-trio-selfie",
      "nesa25-guests-candid",
      "nesa25-host-handshake",
      "nesa25-production-team-group",
    ],
  },
];

export const getImageById = (id: string) =>
  galleryImages.find((i) => i.id === id);
export const getCollectionBySlug = (slug: string) =>
  galleryCollections.find((c) => c.slug === slug);
export const getImagesByCollection = (slug: string) =>
  galleryImages.filter((i) => i.collection === slug);
export const getFeaturedImages = () =>
  galleryImages.filter((i) => i.featured);
