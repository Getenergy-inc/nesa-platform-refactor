import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  Award,
  FileBadge,
  Calendar,
  Building2,
  Tv,
  ArrowRight,
  Users,
  Image as ImageIcon,
  Video as VideoIcon,
  ImageOff,
  Globe2,
  Scale,
  GraduationCap,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { CategorySubcategoriesPanel } from "@/components/awards/CategorySubcategoriesPanel";

const CANONICAL =
  "https://nesa.africa/categories/best-research-development-nigeria";

const PRIMARY_NOMINATE_HREF =
  "/nominate?subcategory=e9307160-136a-49b6-b9af-6829ed652b5f";

// ─── Research domain tabs (fixed order — do not reorder/alphabetize/rank) ───
const DOMAINS = [
  "Agricultural & Food Research",
  "Pharmaceutical & Drug Research",
  "Environmental & Ecological Research",
] as const;
type Domain = (typeof DOMAINS)[number];

// ─── Sub-categories displayed as tiles (3 of 7 live UUIDs) ───
// NOTE: Tile 2 reuses the UUID previously labeled "Health & Medical Research".
// Tile 3 reuses the UUID previously labeled "Environmental & Climate Research".
// 4 additional UUIDs remain live but unlisted (engineering-technology, social-
// sciences-humanities, environmental-sustainability, medical-health) and are
// flagged for backend cleanup as likely duplicate/merge candidates.
const SUBCATEGORIES: {
  title: string;
  description: string;
  subcategoryId: string;
}[] = [
  {
    title: "Agricultural & Food Research",
    description:
      "Institutions advancing crop science, food security, and agricultural training in Nigeria.",
    subcategoryId: "e9307160-136a-49b6-b9af-6829ed652b5f",
  },
  {
    title: "Pharmaceutical & Drug Research",
    description:
      "Institutions and university units advancing pharmaceutical, drug-development, and medicines-regulation research and training.",
    subcategoryId: "e2f0c6a7-5776-43d3-a5a4-20df05a1c7e1",
  },
  {
    title: "Environmental & Ecological Research",
    description:
      "Institutions and university units advancing forestry, conservation, and ecological research and training.",
    subcategoryId: "69fef2d7-cb11-41ec-981a-ee49d6fda8b5",
  },
];

const WHO_QUALIFIES = [
  "Federal or independent agricultural, pharmaceutical, or environmental research institutes",
  "University departments, faculties, or centres with an active research and training mandate in these domains",
  "Major environmental NGOs with a verifiable research or data mandate",
  "Institutions or units with a documented education or research-training role, not purely commercial R&D",
];

const EDI_ROWS: { area: string; score: string; measured: string }[] = [
  {
    area: "Evidence Quality",
    score: "20",
    measured:
      "Official founding records, government gazette, verified institutional output",
  },
  {
    area: "Education Access",
    score: "15",
    measured:
      "Postgraduate training capacity, research fellowships, partnerships",
  },
  {
    area: "Learning Quality",
    score: "15",
    measured:
      "Peer-reviewed output, technology transfer, curriculum or training contribution",
  },
  {
    area: "Equity & Inclusion",
    score: "15",
    measured:
      "Regional reach, access for researchers outside major cities, gender representation in research roles",
  },
  {
    area: "Scale & Reach",
    score: "10",
    measured:
      "Number of researchers, institutions, or states served",
  },
  {
    area: "Sustainability",
    score: "10",
    measured:
      "Institutional continuity, governance structure, multi-decade operation",
  },
  {
    area: "Innovation",
    score: "10",
    measured:
      "New research infrastructure, novel partnerships, technology transfer mechanisms",
  },
  {
    area: "Story / Documentary Value",
    score: "5",
    measured: "Independently reported impact, notable research outputs",
  },
];

const THRESHOLDS = [
  "90–100 Platinum Recognition of Distinction",
  "80–89 Platinum Recognition",
  "70–79 Platinum Watchlist",
  "Below 70 Not Yet Published",
];

const TIMELINE_ROWS = [
  {
    step: "Nominations open",
    date: "Now – 31 March 2026",
    what: "Submit nominations and supporting evidence via the online portal",
  },
  {
    step: "EDI Verification",
    date: "April 2026",
    what: "SCEF panels score submissions against the EDI Matrix",
  },
  {
    step: "Platinum Recognition Show",
    date: "5 July 2026",
    what: "Certificates awarded; feature spotlight on NESA TV",
  },
];

type VerificationStatus = "documented" | "pending_verification";
type InstitutionType = "standalone" | "university_affiliated";
type MediaType = "photo" | "video" | "none";

interface RDNominee {
  name: string;
  location: string;
  domain: Domain;
  description: string;
  contact_email: string; // organisation-level only, never personal
  verification_status: VerificationStatus;
  institution_type: InstitutionType;
  edi_score: number | null;
  media_type: MediaType;
}

const NOMINEES: RDNominee[] = [
  // ─── Tab 1 — Agricultural & Food Research ───
  // Documented — standalone (3)
  {
    name: "International Institute of Tropical Agriculture (IITA)",
    location: "Ibadan",
    domain: "Agricultural & Food Research",
    description:
      "Founded 1967; a CGIAR research centre and Nigeria's leading agricultural research-for-development organization, working across crop genetics, food security, and natural resource management. IITA's institutional strategy has targeted lifting 11.5 million people out of poverty and revitalizing 7.5 million hectares of farmland.",
    contact_email: "info@iita.org",
    verification_status: "documented",
    institution_type: "standalone",
    edi_score: null,
    media_type: "none",
  },
  {
    name: "National Root Crops Research Institute (NRCRI)",
    location: "Umudike",
    domain: "Agricultural & Food Research",
    description:
      "Established 1923; Nigeria's lead institute for root and tuber crop research, having contributed to Nigeria's position as the world's largest cassava and yam producer and developed value-added products from cassava, cocoyam, and ginger. Maintains an active 2024 research partnership with the China Academy of Tropical Agricultural Sciences.",
    contact_email: "info@nrcri.gov.ng",
    verification_status: "documented",
    institution_type: "standalone",
    edi_score: null,
    media_type: "none",
  },
  {
    name: "Institute for Agricultural Research (IAR)",
    location: "Zaria",
    domain: "Agricultural & Food Research",
    description:
      "Founded 1922 as part of Ahmadu Bello University; one of Nigeria's oldest agricultural research institutes, having released over 200 improved crop varieties.",
    contact_email: "info@iar.gov.ng",
    verification_status: "documented",
    institution_type: "standalone",
    edi_score: null,
    media_type: "none",
  },
  // Pending — standalone (7)
  {
    name: "National Institute for Oil Palm Research (NIFOR)",
    location: "Benin",
    domain: "Agricultural & Food Research",
    description:
      "A federal research institute focused on oil palm, raphia, date palm, and coconut.",
    contact_email: "info@nifor.gov.ng",
    verification_status: "pending_verification",
    institution_type: "standalone",
    edi_score: null,
    media_type: "none",
  },
  {
    name: "National Cereals Research Institute (NCRI)",
    location: "Badeggi",
    domain: "Agricultural & Food Research",
    description:
      "A federal research institute focused on cereal and grain crop research.",
    contact_email: "info@ncri.gov.ng",
    verification_status: "pending_verification",
    institution_type: "standalone",
    edi_score: null,
    media_type: "none",
  },
  {
    name: "Cocoa Research Institute of Nigeria (CRIN)",
    location: "Ibadan",
    domain: "Agricultural & Food Research",
    description:
      "A federal research institute focused on cocoa and related tree crop research.",
    contact_email: "info@crin.gov.ng",
    verification_status: "pending_verification",
    institution_type: "standalone",
    edi_score: null,
    media_type: "none",
  },
  {
    name: "National Animal Production Research Institute (NAPRI)",
    location: "Zaria",
    domain: "Agricultural & Food Research",
    description:
      "A federal research institute focused on livestock and animal production research.",
    contact_email: "info@napri.gov.ng",
    verification_status: "pending_verification",
    institution_type: "standalone",
    edi_score: null,
    media_type: "none",
  },
  {
    name: "Rubber Research Institute of Nigeria (RRIN)",
    location: "Benin",
    domain: "Agricultural & Food Research",
    description:
      "A federal research institute focused on rubber and related crop research.",
    contact_email: "info@rrin.gov.ng",
    verification_status: "pending_verification",
    institution_type: "standalone",
    edi_score: null,
    media_type: "none",
  },
  {
    name: "Institute of Agricultural Research and Training (IAR&T)",
    location: "Ibadan",
    domain: "Agricultural & Food Research",
    description:
      "A federal research institute focused on agricultural research and training, affiliated with Obafemi Awolowo University.",
    contact_email: "info@iart.gov.ng",
    verification_status: "pending_verification",
    institution_type: "standalone",
    edi_score: null,
    media_type: "none",
  },
  {
    name: "National Horticultural Research Institute (NIHORT)",
    location: "Ibadan",
    domain: "Agricultural & Food Research",
    description:
      "A federal research institute focused on fruit, vegetable, and ornamental crop research.",
    contact_email: "info@nihort.gov.ng",
    verification_status: "pending_verification",
    institution_type: "standalone",
    edi_score: null,
    media_type: "none",
  },

  // ─── Tab 2 — Pharmaceutical & Drug Research ───
  // Documented — standalone (3)
  {
    name: "National Institute for Pharmaceutical Research and Development (NIPRD)",
    location: "Abuja",
    domain: "Pharmaceutical & Drug Research",
    description:
      "Established 1987 under the Federal Ministry of Health; develops drugs, biological products, and phytomedicines from Nigeria's natural resources, and attained ISO/IEC 17025 international laboratory accreditation in 2018. Currently chairs a 2025 Ministerial Committee on the Commercialization of Phytomedicines.",
    contact_email: "info@niprd.gov.ng",
    verification_status: "documented",
    institution_type: "standalone",
    edi_score: null,
    media_type: "none",
  },
  {
    name: "National Agency for Food and Drug Administration and Control (NAFDAC)",
    location: "Abuja",
    domain: "Pharmaceutical & Drug Research",
    description:
      "Established 1993 under the Federal Ministry of Health; regulates food, drugs, cosmetics, and medical devices nationally, and operates ISO 17025-accredited laboratories supported through international medicines-quality-testing capacity-building programmes.",
    contact_email: "info@nafdac.gov.ng",
    verification_status: "documented",
    institution_type: "standalone",
    edi_score: null,
    media_type: "none",
  },
  {
    name: "Nigerian Institute of Medical Research (NIMR)",
    location: "Yaba, Lagos",
    domain: "Pharmaceutical & Drug Research",
    description:
      "A federal medical research institute established by the Research Institute Establishment Act of 1977; conducts research across biochemistry, virology, immunology, and public health, training researchers and supporting Nigeria's medical research capacity.",
    contact_email: "info@nimr.gov.ng",
    verification_status: "documented",
    institution_type: "standalone",
    edi_score: null,
    media_type: "none",
  },
  // Pending — standalone (1)
  {
    name: "National Institute of Science Laboratory Technology (NISLT)",
    location: "Jos",
    domain: "Pharmaceutical & Drug Research",
    description:
      "A federal institute focused on the training, regulation, and professional development of science laboratory technologists in Nigeria.",
    contact_email: "info@nislt.gov.ng",
    verification_status: "pending_verification",
    institution_type: "standalone",
    edi_score: null,
    media_type: "none",
  },
  // Pending — university-affiliated (6)
  {
    name: "Faculty of Pharmacy, University of Ibadan",
    location: "Ibadan",
    domain: "Pharmaceutical & Drug Research",
    description:
      "A university pharmacy faculty engaged in drug discovery, phytochemistry, and pharmaceutical sciences training.",
    contact_email: "info@ui.edu.ng",
    verification_status: "pending_verification",
    institution_type: "university_affiliated",
    edi_score: null,
    media_type: "none",
  },
  {
    name: "Faculty of Pharmaceutical Sciences, University of Nigeria, Nsukka",
    location: "Nsukka",
    domain: "Pharmaceutical & Drug Research",
    description:
      "A university pharmacy faculty engaged in pharmaceutical sciences research and training.",
    contact_email: "info@unn.edu.ng",
    verification_status: "pending_verification",
    institution_type: "university_affiliated",
    edi_score: null,
    media_type: "none",
  },
  {
    name: "Faculty of Pharmaceutical Sciences, Ahmadu Bello University",
    location: "Zaria",
    domain: "Pharmaceutical & Drug Research",
    description:
      "A university pharmacy faculty engaged in pharmaceutics and pharmaceutical microbiology research and training.",
    contact_email: "info@abu.edu.ng",
    verification_status: "pending_verification",
    institution_type: "university_affiliated",
    edi_score: null,
    media_type: "none",
  },
  {
    name: "Department of Pharmacognosy, University of Lagos",
    location: "Lagos",
    domain: "Pharmaceutical & Drug Research",
    description:
      "A university department engaged in research on drugs derived from natural sources.",
    contact_email: "info@unilag.edu.ng",
    verification_status: "pending_verification",
    institution_type: "university_affiliated",
    edi_score: null,
    media_type: "none",
  },
  {
    name: "Faculty of Pharmacy, Obafemi Awolowo University",
    location: "Ile-Ife",
    domain: "Pharmaceutical & Drug Research",
    description:
      "A university pharmacy faculty engaged in pharmaceutical sciences research and training.",
    contact_email: "info@oauife.edu.ng",
    verification_status: "pending_verification",
    institution_type: "university_affiliated",
    edi_score: null,
    media_type: "none",
  },
  {
    name: "Department of Pharmacology, University of Jos",
    location: "Jos",
    domain: "Pharmaceutical & Drug Research",
    description:
      "A university department engaged in pharmacology research and training.",
    contact_email: "info@unijos.edu.ng",
    verification_status: "pending_verification",
    institution_type: "university_affiliated",
    edi_score: null,
    media_type: "none",
  },

  // ─── Tab 3 — Environmental & Ecological Research ───
  // Documented — standalone (2)
  {
    name: "Forestry Research Institute of Nigeria (FRIN)",
    location: "Ibadan",
    domain: "Environmental & Ecological Research",
    description:
      "Established 1954 as the Federal Department of Forestry Research; conducts research across sustainable forest management, biodiversity, and agro-forestry, and maintains the Forest Herbarium Ibadan (FHI), Nigeria's national herbarium with over 100,000 plant specimen collections.",
    contact_email: "info@frin.gov.ng",
    verification_status: "documented",
    institution_type: "standalone",
    edi_score: null,
    media_type: "none",
  },
  {
    name: "Nigerian Conservation Foundation (NCF)",
    location: "Lagos",
    domain: "Environmental & Ecological Research",
    description:
      "Founded 1980; Nigeria's leading conservation NGO, recognised on UNEP's Global 500 Roll of Honour in 1992. Manages the Lekki Conservation Centre and maintains a GBIF-indexed biodiversity database used in ecological research.",
    contact_email: "info@ncfnigeria.org",
    verification_status: "documented",
    institution_type: "standalone",
    edi_score: null,
    media_type: "none",
  },
  // Pending — standalone (1)
  {
    name: "Nigerian Environmental Study/Action Team (NEST)",
    location: "Ibadan",
    domain: "Environmental & Ecological Research",
    description:
      "A Nigerian environmental research and policy NGO engaged in climate change response and adaptation work.",
    contact_email: "info@nestinteractive.org",
    verification_status: "pending_verification",
    institution_type: "standalone",
    edi_score: null,
    media_type: "none",
  },
  // Pending — university-affiliated (7)
  {
    name: "Centre for Energy Research and Development (NCERD), University of Nigeria, Nsukka",
    location: "Nsukka",
    domain: "Environmental & Ecological Research",
    description:
      "A university centre engaged in renewable and non-renewable energy research and training.",
    contact_email: "info@unn.edu.ng",
    verification_status: "pending_verification",
    institution_type: "university_affiliated",
    edi_score: null,
    media_type: "none",
  },
  {
    name: "Centre for Environmental Studies and Sustainable Development (CESSD), Lagos State University",
    location: "Lagos",
    domain: "Environmental & Ecological Research",
    description:
      "A university centre engaged in environmental and sustainability research.",
    contact_email: "info@lasu.edu.ng",
    verification_status: "pending_verification",
    institution_type: "university_affiliated",
    edi_score: null,
    media_type: "none",
  },
  {
    name: "Institute of Ecology and Environmental Studies (IEES), Obafemi Awolowo University",
    location: "Ile-Ife",
    domain: "Environmental & Ecological Research",
    description:
      "A university institute engaged in ecological and environmental research.",
    contact_email: "info@oauife.edu.ng",
    verification_status: "pending_verification",
    institution_type: "university_affiliated",
    edi_score: null,
    media_type: "none",
  },
  {
    name: "Centre for Conflict, Forest and Resource Governance (CCFR), Nasarawa State University",
    location: "Keffi",
    domain: "Environmental & Ecological Research",
    description:
      "A university centre engaged in forest conservation and resource governance research.",
    contact_email: "info@nsuk.edu.ng",
    verification_status: "pending_verification",
    institution_type: "university_affiliated",
    edi_score: null,
    media_type: "none",
  },
  {
    name: "Centre for Energy, Environment and Climate Action (CEMAC), University of Nigeria, Nsukka",
    location: "Nsukka",
    domain: "Environmental & Ecological Research",
    description:
      "A university centre engaged in environmental policy and energy research.",
    contact_email: "info@unn.edu.ng",
    verification_status: "pending_verification",
    institution_type: "university_affiliated",
    edi_score: null,
    media_type: "none",
  },
  {
    name: "Environmental Laboratory, Federal University of Technology, Owerri",
    location: "Owerri",
    domain: "Environmental & Ecological Research",
    description:
      "A university laboratory engaged in environmental and materials engineering research.",
    contact_email: "info@futo.edu.ng",
    verification_status: "pending_verification",
    institution_type: "university_affiliated",
    edi_score: null,
    media_type: "none",
  },
  {
    name: "Institute for Environmental Research, University of Benin",
    location: "Benin",
    domain: "Environmental & Ecological Research",
    description:
      "A university institute engaged in environmental sciences research.",
    contact_email: "info@uniben.edu",
    verification_status: "pending_verification",
    institution_type: "university_affiliated",
    edi_score: null,
    media_type: "none",
  },
];

const FAQS: { q: string; a: string }[] = [
  {
    q: "What is the difference between Blue Garnet and Platinum?",
    a: "Blue Garnet is competitive and publicly voted. Platinum is honorary, EDI-scored, and documentation-based.",
  },
  {
    q: "What documents or evidence may be required?",
    a: "At least 3 of: institution page, government gazette/founding statute, peer-reviewed output, university partnership record, or media coverage.",
  },
  {
    q: "How are nominees verified?",
    a: "Through the EDI Matrix, validated by regional SCEF panels.",
  },
  {
    q: "Why are there only 3 sub-categories shown when 7 exist in the system?",
    a: "Several sub-categories overlapped in scope; NESA-Africa has consolidated the displayed tiles to three distinct research domains while the original entries remain in the system pending backend review.",
  },
  {
    q: "Why do some entries say \"University-affiliated\"?",
    a: "Some nominees are university departments or centres rather than standalone federal or independent research institutes. Both types are eligible, but they're labeled separately since they differ in governance structure and institutional continuity — factors considered under the EDI Matrix's Sustainability criterion.",
  },
];

const MEDIA_FILTERS: { key: "all" | MediaType; label: string; icon: React.ElementType }[] = [
  { key: "all", label: "All", icon: Globe2 },
  { key: "photo", label: "Has Photo", icon: ImageIcon },
  { key: "video", label: "Has Video", icon: VideoIcon },
  { key: "none", label: "No Media Yet", icon: ImageOff },
];

const SectionTitle = ({
  kicker,
  title,
  sub,
}: {
  kicker?: string;
  title: string;
  sub?: string;
}) => (
  <div className="text-center max-w-3xl mx-auto mb-10">
    {kicker && (
      <p className="text-[11px] uppercase tracking-[0.2em] text-gold/80 mb-2 font-semibold">
        {kicker}
      </p>
    )}
    <h2 className="font-display text-3xl md:text-4xl font-bold text-ivory">
      {title}
    </h2>
    {sub && (
      <p className="mt-3 text-ivory/65 text-base md:text-lg leading-relaxed">
        {sub}
      </p>
    )}
  </div>
);

// Sort: documented + standalone → documented + uni → pending + standalone →
// pending + uni; alphabetical by institution name within each group.
const sortNominees = (list: RDNominee[]) => {
  const groupRank = (n: RDNominee) => {
    const docRank = n.verification_status === "documented" ? 0 : 2;
    const typeRank = n.institution_type === "standalone" ? 0 : 1;
    return docRank + typeRank;
  };
  return [...list].sort((a, b) => {
    const gr = groupRank(a) - groupRank(b);
    if (gr !== 0) return gr;
    return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
  });
};

const NomineeCard = ({ n }: { n: RDNominee }) => (
  <Card className="bg-charcoal-light/50 border-gold/15 hover:border-gold/40 transition-all h-full">
    <CardContent className="p-5 space-y-3 h-full flex flex-col">
      <div>
        <h4 className="font-semibold text-ivory text-base leading-snug">
          {n.name}
        </h4>
        <p className="text-ivory/70 text-sm mt-1">{n.location}</p>
      </div>
      <p className="text-ivory/75 text-sm leading-relaxed flex-1">
        {n.description}
      </p>
      <div className="text-xs text-ivory/65 break-words">
        <span className="text-gold/80 font-semibold">Contact: </span>
        <a
          href={`mailto:${n.contact_email}`}
          className="hover:text-gold underline-offset-2 hover:underline"
        >
          {n.contact_email}
        </a>
      </div>
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gold/10">
        {n.verification_status === "documented" ? (
          <Badge className="bg-emerald-500/15 text-emerald-300 border border-emerald-400/30 hover:bg-emerald-500/15">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Documented
          </Badge>
        ) : (
          <Badge className="bg-amber-500/15 text-amber-300 border border-amber-400/30 hover:bg-amber-500/15">
            <ShieldCheck className="w-3 h-3 mr-1" /> Pending Verification
          </Badge>
        )}
        {n.institution_type === "university_affiliated" && (
          <Badge className="bg-charcoal-light/60 text-ivory/80 border border-gold/20 hover:bg-charcoal-light/60">
            <GraduationCap className="w-3 h-3 mr-1" /> University-affiliated
          </Badge>
        )}
      </div>
    </CardContent>
  </Card>
);

export default function ResearchDevelopmentNigeriaPage() {
  const [mediaFilter, setMediaFilter] = useState<"all" | MediaType>("all");

  const filteredByDomain = useMemo(() => {
    const out = {} as Record<Domain, RDNominee[]>;
    for (const d of DOMAINS) {
      const list = NOMINEES.filter((n) => n.domain === d);
      const filtered =
        mediaFilter === "all"
          ? list
          : list.filter((n) => n.media_type === mediaFilter);
      out[d] = sortNominees(filtered);
    }
    return out;
  }, [mediaFilter]);

  const mediaCounts = useMemo(() => {
    let photo = 0,
      video = 0,
      none = 0;
    for (const n of NOMINEES) {
      if (n.media_type === "photo") photo++;
      else if (n.media_type === "video") video++;
      else none++;
    }
    return { all: photo + video + none, photo, video, none };
  }, []);

  return (
    <div className="bg-charcoal text-ivory">
      <Helmet>
        <title>
          Excellence in Research & Development for Education (Nigeria) 2026 |
          NESA-Africa
        </title>
        <meta
          name="description"
          content="Platinum recognition for Nigerian research institutions and university research units advancing education through agricultural, pharmaceutical, and environmental research. 2026 nominations open."
        />
        <link rel="canonical" href={CANONICAL} />
      </Helmet>
      <BreadcrumbJsonLd
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Categories", path: "/categories" },
          {
            name: "Best Research & Development for Education (Nigeria)",
            path: "/categories/best-research-development-nigeria",
          },
        ]}
      />

      {/* ════════════ 1 — HERO ════════════ */}
      <section className="relative overflow-hidden border-b border-gold/10 px-4 py-16 md:py-24">
        <div className="absolute -top-32 -right-20 h-72 w-72 rounded-full bg-gold/15 blur-3xl" aria-hidden />
        <div className="absolute -bottom-24 -left-10 h-64 w-64 rounded-full bg-gold/10 blur-3xl" aria-hidden />
        <div className="relative max-w-5xl mx-auto text-center">
          <Badge className="bg-emerald-500/15 text-emerald-300 border border-emerald-400/40 hover:bg-emerald-500/15 mb-5">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> 2026 Nominations Open
          </Badge>
          <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight">
            Excellence in Research &{" "}
            <span className="text-gold">Development for Education</span>{" "}
            (Nigeria)
          </h1>
          <p className="mt-5 text-ivory/70 text-base md:text-xl leading-relaxed max-w-3xl mx-auto">
            Honoring research institutions advancing education in Nigeria.
          </p>
          <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="bg-gold text-charcoal hover:bg-gold-dark">
              <Link to={PRIMARY_NOMINATE_HREF}>
                <Award className="mr-2 h-4 w-4" /> Nominate Now
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-gold/40 text-ivory hover:bg-gold/10"
            >
              <Link to="/nominees?category=best-research-development-nigeria">
                Explore Nominees <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-gold/40 text-ivory hover:bg-gold/10"
            >
              <Link to="/categories">View All Categories</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ════════════ 2 — OVERVIEW ════════════ */}
      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-5">
          <SectionTitle
            kicker="Overview"
            title="Research institutions that strengthen Nigerian education from within"
          />
          <p className="text-ivory/75 leading-relaxed">
            Nigeria's research institutions — from century-old agricultural
            stations to pharmaceutical, medical, and environmental research
            bodies, alongside university departments doing parallel work —
            generate the knowledge, technologies, and trained researchers that
            strengthen the country's education system from within.
          </p>
          <p className="text-ivory/75 leading-relaxed">
            Excellence in Research & Development for Education (Nigeria)
            recognises institutions and university research units whose
            sustained agricultural, pharmaceutical, or environmental research
            contributes to educational capacity: training postgraduate
            researchers, supporting partnerships, and producing knowledge that
            feeds back into Nigeria's classrooms and laboratories. Institutional
            recognition is evaluated under governance and leadership criteria,
            aligned with SDG 4, SDG 3 (Good Health and Well-being), SDG 13
            (Climate Action), and Africa Agenda 2063 Goal 1.
          </p>
          <p className="text-ivory/75 leading-relaxed">
            This recognition is evidence-based and does not imply ranking,
            endorsement, or competition between institutions of different
            scale, type, or mandate.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {["SDG 4", "SDG 3", "SDG 13", "Agenda 2063 Goal 1"].map((p) => (
              <Badge
                key={p}
                className="bg-charcoal-light/60 text-ivory/80 border border-gold/20 hover:bg-charcoal-light/60"
              >
                {p}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ 3 — WHO QUALIFIES + EDI ════════════ */}
      <section className="px-4 py-16 border-y border-gold/10 bg-charcoal-light/20">
        <SectionTitle
          kicker="Eligibility"
          title="Who qualifies & how nominees are scored"
        />
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-6">
          <Card className="bg-charcoal-light/50 border-gold/15">
            <CardContent className="p-6">
              <h3 className="font-display text-lg text-ivory font-semibold mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-gold" /> Who qualifies
              </h3>
              <ul className="space-y-2 text-sm text-ivory/75">
                {WHO_QUALIFIES.map((q) => (
                  <li key={q} className="flex gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-gold shrink-0 mt-1" />
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-charcoal-light/50 border-gold/15">
            <CardContent className="p-6">
              <h3 className="font-display text-lg text-ivory font-semibold mb-4 flex items-center gap-2">
                <Scale className="h-5 w-5 text-gold" /> EDI Matrix scoring
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gold/80 border-b border-gold/20">
                      <th className="py-2 pr-2 font-semibold">EDI Area</th>
                      <th className="py-2 pr-2 font-semibold">Score</th>
                      <th className="py-2 font-semibold">What's measured</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold/10">
                    {EDI_ROWS.map((r) => (
                      <tr key={r.area}>
                        <td className="py-2 pr-2 text-ivory/90 font-medium align-top">
                          {r.area}
                        </td>
                        <td className="py-2 pr-2 text-gold align-top">
                          {r.score}
                        </td>
                        <td className="py-2 text-ivory/70">{r.measured}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-6xl mx-auto mt-6 flex flex-wrap gap-2 justify-center">
          {THRESHOLDS.map((t) => (
            <Badge
              key={t}
              className="bg-charcoal-light/60 text-ivory/80 border border-gold/20 hover:bg-charcoal-light/60"
            >
              {t}
            </Badge>
          ))}
        </div>
        <p className="max-w-3xl mx-auto text-center text-ivory/65 italic text-sm mt-6">
          "Recognition is evidence-based and does not imply ranking,
          endorsement, or public voting."
        </p>
      </section>

      {/* ════════════ 4 — SUB-CATEGORIES ════════════ */}
      <section className="px-4 py-16">
        <SectionTitle
          kicker="Tracks"
          title="Sub-categories"
          sub="Three nomination intake tracks across the research domains where institutional contribution to Nigerian education is most clearly documented."
        />
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SUBCATEGORIES.map((c, i) => (
            <Card
              key={c.subcategoryId}
              className="bg-charcoal-light/50 border-gold/15 hover:border-gold/40 transition-all h-full"
            >
              <CardContent className="p-5 h-full flex flex-col">
                <Badge className="bg-gold/15 text-gold border border-gold/30 hover:bg-gold/15 self-start mb-2">
                  Track {i + 1}
                </Badge>
                <h3 className="font-display text-lg text-ivory font-semibold mb-2">
                  {c.title}
                </h3>
                <p className="text-ivory/70 text-sm mb-4 flex-1">
                  {c.description}
                </p>
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="border-gold/30 text-gold hover:bg-gold/10 self-start"
                >
                  <Link to={`/nominate?subcategory=${c.subcategoryId}`}>
                    Nominate <ArrowRight className="ml-1.5 h-3 w-3" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ════════════ 5 — NOMINATE CTA ════════════ */}
      <section className="px-4 py-12">
        <Card className="max-w-5xl mx-auto bg-gradient-to-br from-gold/10 via-charcoal-light to-charcoal border-gold/30">
          <CardContent className="p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-2xl md:text-3xl text-ivory font-bold">
                Know a research institution advancing education in Nigeria?
              </h3>
              <p className="text-ivory/70 mt-2">
                Nominate an agricultural, pharmaceutical, or environmental
                research institution or university research unit for Platinum
                recognition. 2026 nominations are open.
              </p>
            </div>
            <div className="shrink-0">
              <Button
                asChild
                size="lg"
                className="bg-gold text-charcoal hover:bg-gold-dark"
              >
                <Link to={PRIMARY_NOMINATE_HREF}>
                  <Award className="mr-2 h-4 w-4" /> Nominate Now
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ════════════ 6 — TIMELINE ════════════ */}
      <section className="px-4 py-16 border-y border-gold/10 bg-charcoal-light/20">
        <SectionTitle kicker="2026 Season" title="Platinum recognition timeline" />
        <div className="max-w-4xl mx-auto">
          <Card className="bg-charcoal-light/50 border-gold/15 overflow-hidden">
            <CardContent className="p-0">
              <div className="divide-y divide-gold/10">
                {TIMELINE_ROWS.map((r) => (
                  <div
                    key={r.step}
                    className="grid grid-cols-1 md:grid-cols-3 gap-2 p-4"
                  >
                    <div className="text-gold font-semibold text-sm flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5" /> {r.step}
                    </div>
                    <div className="text-ivory/90 text-sm">{r.date}</div>
                    <div className="text-ivory/70 text-sm">{r.what}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <p className="text-center text-ivory/65 italic text-sm mt-4">
            Platinum recipients may later qualify for competitive Blue Garnet
            recognition.{" "}
            <Link to="/timeline" className="text-gold hover:underline">
              See the full 2026 season calendar →
            </Link>
          </p>
        </div>
      </section>

      {/* ════════════ 7 — NOMINEES ════════════ */}
      <section className="px-4 py-16">
        <SectionTitle kicker="Nominees" title="2026 nominees" />
        <div className="max-w-5xl mx-auto text-center mb-6 space-y-4">
          <p className="text-ivory/70 leading-relaxed">
            Nominees are organised by research domain. Entries marked{" "}
            <span className="text-emerald-300">Documented</span> have at least
            one independently verifiable source confirming the institution's
            history and core activity. Entries marked{" "}
            <span className="text-amber-300">Pending Verification</span> are
            real, named institutions or university research units whose specific
            achievement claims have not yet been independently confirmed —
            descriptions for these are intentionally limited to general mandate
            only. Entries tagged{" "}
            <span className="text-ivory">University-affiliated</span> are
            university departments, faculties, or centres rather than
            standalone institutes. Only organisational contact channels are
            published.{" "}
            <Link
              to="/nominees?category=best-research-development-nigeria"
              className="text-gold hover:underline"
            >
              View all nominees →
            </Link>
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Media filter bar */}
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {MEDIA_FILTERS.map((f) => {
              const active = mediaFilter === f.key;
              const count =
                f.key === "all"
                  ? mediaCounts.all
                  : f.key === "photo"
                    ? mediaCounts.photo
                    : f.key === "video"
                      ? mediaCounts.video
                      : mediaCounts.none;
              return (
                <Button
                  key={f.key}
                  size="sm"
                  variant={active ? "default" : "outline"}
                  onClick={() => setMediaFilter(f.key)}
                  className={
                    active
                      ? "bg-gold text-charcoal hover:bg-gold-dark"
                      : "border-gold/30 text-ivory/80 hover:bg-gold/10"
                  }
                >
                  <f.icon className="h-3.5 w-3.5 mr-1.5" /> {f.label}
                  <Badge
                    className={`ml-2 ${active ? "bg-charcoal/20 text-charcoal" : "bg-gold/15 text-gold border-gold/30"} hover:bg-transparent`}
                  >
                    {count}
                  </Badge>
                </Button>
              );
            })}
          </div>

          <Tabs defaultValue={DOMAINS[0]} className="w-full">
            <TabsList className="flex flex-wrap h-auto bg-charcoal-light/60 border border-gold/20 p-1 mb-8 gap-1">
              {DOMAINS.map((d) => (
                <TabsTrigger
                  key={d}
                  value={d}
                  className="data-[state=active]:bg-gold data-[state=active]:text-charcoal text-ivory/70 text-xs md:text-sm"
                >
                  {d}
                </TabsTrigger>
              ))}
            </TabsList>

            {DOMAINS.map((d) => {
              const list = filteredByDomain[d];
              const totalForDomain = NOMINEES.filter(
                (n) => n.domain === d,
              ).length;
              return (
                <TabsContent key={d} value={d}>
                  {totalForDomain === 0 ? (
                    <Card className="bg-charcoal-light/40 border-gold/20">
                      <CardContent className="p-8 text-center space-y-3">
                        <p className="text-ivory/75">
                          No nominees published yet in this domain.
                        </p>
                        <Button
                          asChild
                          className="bg-gold text-charcoal hover:bg-gold-dark"
                        >
                          <Link to={PRIMARY_NOMINATE_HREF}>
                            Nominate an institution →
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ) : list.length === 0 ? (
                    <Card className="bg-charcoal-light/40 border-gold/20">
                      <CardContent className="p-8 text-center space-y-3">
                        <p className="text-ivory/75">
                          No{" "}
                          {mediaFilter === "video"
                            ? "video"
                            : mediaFilter === "photo"
                              ? "photo"
                              : "media"}{" "}
                          submissions yet in this domain.
                        </p>
                        <Button
                          variant="outline"
                          className="border-gold/40 text-ivory hover:bg-gold/10"
                          onClick={() => setMediaFilter("all")}
                        >
                          Switch to All →
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {list.map((n, i) => (
                        <NomineeCard key={`${d}-${i}`} n={n} />
                      ))}
                    </div>
                  )}
                </TabsContent>
              );
            })}
          </Tabs>

          {/* Evidence submission note */}
          <p className="max-w-4xl mx-auto text-ivory/65 italic text-sm mt-8 text-center leading-relaxed">
            To move a nominee from Pending Verification to Documented, submit at
            least 3 of: an official institution page, government gazette or
            founding statute, peer-reviewed research output, a university or
            training partnership record, or independent media coverage. Only
            organisational contact details are published — individual staff
            contacts are never made public without separate written consent.
          </p>
        </div>
      </section>

      {/* ════════════ 8 — RECOGNITION PACKAGE ════════════ */}
      <section className="px-4 py-16 border-y border-gold/10 bg-charcoal-light/20">
        <SectionTitle kicker="Recognition" title="What recipients receive" />
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              i: FileBadge,
              t: "Platinum Digital Certificate",
              d: "Issued via GFA Wallet.",
            },
            {
              i: Award,
              t: "Letter of Recognition",
              d: "From SCEF / NESA-Africa.",
            },
            { i: Tv, t: "Feature spotlight", d: "On NESA TV." },
            {
              i: Building2,
              t: "Database listing",
              d: "Research & Development for Education database under SCEF.",
            },
          ].map((r) => (
            <Card
              key={r.t}
              className="bg-charcoal-light/50 border-gold/15 hover:border-gold/40 transition-all"
            >
              <CardContent className="p-5">
                <div className="h-10 w-10 rounded-lg bg-gold/15 text-gold flex items-center justify-center mb-3">
                  <r.i className="h-5 w-5" />
                </div>
                <h4 className="font-display text-ivory font-semibold mb-1">
                  {r.t}
                </h4>
                <p className="text-ivory/65 text-sm">{r.d}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ════════════ 9 — TRUST & ACCOUNTABILITY ════════════ */}
      <section className="px-4 py-16">
        <SectionTitle kicker="Trust" title="Trust & Accountability" />
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-4">
          {[
            {
              t: "Independent Governance",
              d: "Awards Council governs all stages.",
              href: "/governance",
              icon: ShieldCheck,
            },
            {
              t: "Sponsors Do Not Influence Results",
              d: "Commercial relationships are firewalled.",
              icon: Award,
            },
            {
              t: "Public Reporting",
              d: "All outcomes published transparently.",
              href: "/impact",
              icon: FileBadge,
            },
          ].map((c) => (
            <Card key={c.t} className="bg-charcoal-light/50 border-gold/15">
              <CardContent className="p-5">
                <c.icon className="h-6 w-6 text-gold mb-3" />
                <h4 className="font-display text-ivory font-semibold mb-1">
                  {c.t}
                </h4>
                <p className="text-ivory/65 text-sm mb-3">{c.d}</p>
                {c.href && (
                  <Link to={c.href} className="text-gold text-sm hover:underline">
                    Learn more →
                  </Link>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ════════════ 10 — FAQ ════════════ */}
      <section className="px-4 py-16 border-y border-gold/10 bg-charcoal-light/20">
        <SectionTitle kicker="FAQ" title="Frequently asked questions" />
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-2">
            {FAQS.map((f, i) => (
              <AccordionItem
                key={i}
                value={`f-${i}`}
                className="border border-gold/15 rounded-lg bg-charcoal-light/40 px-4"
              >
                <AccordionTrigger className="text-ivory hover:text-gold text-left">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-ivory/70 leading-relaxed">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <p className="text-center text-ivory/65 italic text-sm mt-6">
            These relate to the overall NESA-Africa award structure rather than
            this category specifically.{" "}
            <Link to="/faq" className="text-gold hover:underline">
              See the full FAQ →
            </Link>
          </p>
        </div>
      </section>

      <CategorySubcategoriesPanel
        formSlug="excellence-in-research-development-for-education-nigeria"
        categoryTitle="Research & Development for Education (Nigeria)"
      />
    </div>
  );
}
