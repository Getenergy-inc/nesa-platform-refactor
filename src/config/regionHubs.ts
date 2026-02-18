// Region Hub Page Configuration
// Maps each region to its slug, countries, cultural description, and hero image

import type { AfricanRegion } from "@/lib/regions";

export interface RegionHubConfig {
  slug: string;
  name: AfricanRegion;
  shortName: string;
  tagline: string;
  description: string;
  countries: string[];
  culturalHighlights: string[];
  eduTourismFacts: string[];
  heroImage: string;
  mapColor: string;
}

export const REGION_HUBS: RegionHubConfig[] = [
  {
    slug: "north-africa",
    name: "North Africa",
    shortName: "North",
    tagline: "Where Ancient Civilizations Meet Modern Education",
    description: "From the pyramids of Egypt to the medinas of Morocco, North Africa is a cradle of learning that has shaped human knowledge for millennia. Experience the rich tapestry of Berber, Arab, and Mediterranean cultures through vibrant festivals, intricate textiles, and timeless traditions.",
    countries: ["Algeria", "Egypt", "Libya", "Morocco", "Tunisia", "Sudan", "Western Sahara"],
    culturalHighlights: ["Moroccan Gnawa music festivals", "Egyptian folk dance (Raqs Sharqi)", "Tunisian Stambali ceremonies", "Berber Ahidous dance traditions"],
    eduTourismFacts: ["Home to Al-Qarawiyyin, the world's oldest university (859 AD)", "Egypt's ancient library of Alexandria inspired modern education", "Morocco's madrasa system influenced global Islamic scholarship"],
    heroImage: "north-africa-culture",
    mapColor: "hsl(35, 80%, 55%)",
  },
  {
    slug: "west-africa",
    name: "West Africa",
    shortName: "West",
    tagline: "The Heartbeat of African Culture & Innovation",
    description: "West Africa pulses with energy — from Nigeria's Nollywood to Ghana's kente-weaving traditions. This region is home to some of Africa's most vibrant cultural expressions, where centuries-old griots share wisdom through song and dance.",
    countries: ["Benin", "Burkina Faso", "Cape Verde", "Côte d'Ivoire", "Gambia", "Ghana", "Guinea", "Guinea-Bissau", "Liberia", "Mali", "Mauritania", "Niger", "Nigeria", "Senegal", "Sierra Leone", "Togo"],
    culturalHighlights: ["Nigerian Durbar festival", "Ghanaian Adowa dance", "Senegalese Sabar drumming", "Malian Dogon mask ceremonies"],
    eduTourismFacts: ["Timbuktu's Sankore University was a medieval center of learning", "Nigeria has the largest education system in Sub-Saharan Africa", "Ghana's first university (1948) pioneered Pan-African education"],
    heroImage: "west-africa-culture",
    mapColor: "hsl(120, 60%, 40%)",
  },
  {
    slug: "central-africa",
    name: "Central Africa",
    shortName: "Central",
    tagline: "The Green Heart of the Continent",
    description: "Central Africa's lush rainforests and mighty rivers have nurtured unique cultures where music, dance, and community are inseparable. From the rhythmic rumba of Congo to Cameroon's diverse ethnic tapestry, this region celebrates life through movement and song.",
    countries: ["Cameroon", "Central African Republic", "Chad", "Congo", "Democratic Republic of Congo", "Equatorial Guinea", "Gabon", "São Tomé and Príncipe"],
    culturalHighlights: ["Congolese Rumba and Soukous dance", "Cameroonian Bikutsi rhythm", "Gabonese Bwiti ceremonies", "Pygmy polyphonic singing (UNESCO heritage)"],
    eduTourismFacts: ["DRC's Lubumbashi University is a regional research hub", "Cameroon is bilingual (French/English), bridging educational traditions", "The Congo Basin is the world's second-largest rainforest classroom"],
    heroImage: "central-africa-culture",
    mapColor: "hsl(150, 55%, 35%)",
  },
  {
    slug: "east-africa",
    name: "East Africa",
    shortName: "East",
    tagline: "Where the Savanna Meets the Stars",
    description: "East Africa's breathtaking landscapes — from Kilimanjaro to the Serengeti — are matched by its cultural richness. The Maasai, Kikuyu, and dozens of ethnic groups celebrate heritage through beadwork, dance, and storytelling under open skies.",
    countries: ["Burundi", "Kenya", "Malawi", "Mozambique", "Rwanda", "South Sudan", "Tanzania", "Uganda", "Zambia", "Zimbabwe"],
    culturalHighlights: ["Maasai Adumu jumping dance", "Rwandan Intore warrior dance", "Tanzanian Ngoma drumming", "Kenyan Isukuti celebration dance"],
    eduTourismFacts: ["Kenya's M-Pesa revolutionized financial inclusion through tech education", "Rwanda's education transformation is Africa's fastest", "Uganda hosts more refugees in schools than any other African nation"],
    heroImage: "east-africa-culture",
    mapColor: "hsl(45, 75%, 50%)",
  },
  {
    slug: "southern-africa",
    name: "Southern Africa",
    shortName: "Southern",
    tagline: "Rainbow Nations, Boundless Potential",
    description: "From South Africa's vibrant townships to Botswana's Okavango Delta, Southern Africa is a region of dramatic beauty and cultural resilience. The Zulu, Ndebele, San, and many more peoples keep ancient traditions alive through spectacular dance, beadwork, and ceremony.",
    countries: ["Angola", "Botswana", "Eswatini", "Lesotho", "Namibia", "South Africa"],
    culturalHighlights: ["Zulu Indlamu warrior dance", "Ndebele geometric body painting", "San Bushmen healing trance dance", "Swazi Reed Dance (Umhlanga)"],
    eduTourismFacts: ["South Africa has the most universities on the continent", "Botswana invests the highest % of GDP in education in Africa", "Namibia's community conservancies are models for environmental education"],
    heroImage: "southern-africa-culture",
    mapColor: "hsl(200, 65%, 45%)",
  },
  {
    slug: "sahel",
    name: "Sahel Region",
    shortName: "Sahel",
    tagline: "The Gateway Between Desert and Savanna",
    description: "The Sahel stretches across Africa's waist — a transition zone of extraordinary resilience. Tuareg nomads, Fulani herders, and Bambara farmers share a landscape where education and survival are deeply intertwined, and oral traditions carry centuries of knowledge.",
    countries: ["Mali", "Niger", "Burkina Faso", "Chad", "Mauritania", "Senegal"],
    culturalHighlights: ["Tuareg Imzad violin music", "Fulani Gerewol beauty contest", "Bambara Tyi Wara antelope dance", "Wodaabe nomadic festivals"],
    eduTourismFacts: ["The Sahel is home to some of the world's oldest Islamic learning centers", "Mobile schools serve nomadic communities across the region", "Traditional Koranic schools (daaras) blend faith and education"],
    heroImage: "sahel-culture",
    mapColor: "hsl(30, 70%, 55%)",
  },
  {
    slug: "horn-of-africa",
    name: "Horn of Africa",
    shortName: "Horn",
    tagline: "Ancient Crossroads of Africa, Arabia & Asia",
    description: "The Horn of Africa is where the continent reaches toward the Arabian Peninsula. Ethiopia's ancient Christian heritage, Somalia's coastal trading culture, and Eritrea's architectural wonders create a mosaic of traditions found nowhere else on Earth.",
    countries: ["Djibouti", "Eritrea", "Ethiopia", "Somalia"],
    culturalHighlights: ["Ethiopian Eskista shoulder dance", "Somali Dhaanto celebration dance", "Eritrean Guayla wedding dance", "Djiboutian Afar Jenile dance"],
    eduTourismFacts: ["Ethiopia's Lalibela churches are a UNESCO World Heritage education site", "Somalia's oral poetry tradition is among the world's richest", "Djibouti is a trilingual education hub (French, Arabic, Somali)"],
    heroImage: "horn-africa-culture",
    mapColor: "hsl(15, 65%, 50%)",
  },
  {
    slug: "indian-ocean-islands",
    name: "Indian Ocean Islands",
    shortName: "Islands",
    tagline: "Paradise Islands with African Soul",
    description: "Madagascar, Mauritius, Seychelles, and Comoros — these island gems blend African, Asian, and European influences into unique Creole cultures. From the sega dance to Malagasy lamba weavings, island life celebrates diversity through rhythm and color.",
    countries: ["Comoros", "Madagascar", "Mauritius", "Seychelles"],
    culturalHighlights: ["Mauritian Sega dance", "Malagasy Salegy music", "Comorian traditional Twarab", "Seychellois Moutya drum dance"],
    eduTourismFacts: ["Mauritius has the highest literacy rate in Africa (91%)", "Madagascar's biodiversity makes it a living science classroom", "Seychelles' environmental curriculum is globally recognized"],
    heroImage: "indian-ocean-culture",
    mapColor: "hsl(190, 70%, 50%)",
  },
  {
    slug: "diaspora",
    name: "Diaspora / Global Africa",
    shortName: "Diaspora",
    tagline: "Africa Beyond Borders",
    description: "The African Diaspora carries the continent's spirit across the globe. From Afrobeats in London to jazz in New Orleans, from carnival in Rio to Notting Hill, Africans abroad preserve and reinvent their heritage while championing education as the bridge to empowerment.",
    countries: ["Global — USA, UK, Caribbean, Brazil, France, Canada & worldwide"],
    culturalHighlights: ["Afrobeats global dance movement", "Caribbean Carnival traditions", "African American step dancing", "Brazilian Capoeira (African roots)"],
    eduTourismFacts: ["Diaspora remittances fund millions of school places in Africa", "African scholars lead global universities worldwide", "Diaspora-founded ed-tech companies serve millions across Africa"],
    heroImage: "diaspora-culture",
    mapColor: "hsl(270, 55%, 50%)",
  },
  {
    slug: "friends-of-africa",
    name: "Friends of Africa",
    shortName: "Friends",
    tagline: "Global Allies Championing Africa's Future",
    description: "Friends of Africa represents the growing community of non-African individuals, organizations, and institutions who are committed to Africa's educational transformation. This category celebrates solidarity, partnership, and shared vision for a better-educated continent.",
    countries: ["Global partners from all continents"],
    culturalHighlights: ["International education summits", "Cross-cultural exchange programs", "Global volunteer movements", "Bilateral education partnerships"],
    eduTourismFacts: ["International partnerships fund 30% of Africa's education infrastructure", "Global education foundations operate in 50+ African countries", "Exchange programs connect 100,000+ students annually"],
    heroImage: "friends-africa-culture",
    mapColor: "hsl(50, 65%, 55%)",
  },
];

export function getRegionHubBySlug(slug: string): RegionHubConfig | undefined {
  return REGION_HUBS.find(r => r.slug === slug);
}

export function getRegionHubByName(name: AfricanRegion): RegionHubConfig | undefined {
  return REGION_HUBS.find(r => r.name === name);
}
