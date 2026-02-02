import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Youtube, 
  Linkedin, 
  Twitter, 
  Instagram, 
  Play, 
  ChevronRight,
  Users,
  Award
} from "lucide-react";
import { NESALogo } from "@/components/nesa/NESALogo";
import { 
  getAwards, 
  getAllNominees, 
  getImageUrl,
  handleImageError,
  type Nominee
} from "@/lib/nesaData";

// Social media links for NESA Africa TV
const socialLinks = [
  { icon: Youtube, href: "https://youtube.com/@nesaafricatv", label: "YouTube", color: "hover:text-red-500" },
  { icon: Linkedin, href: "https://linkedin.com/company/nesa-africa", label: "LinkedIn", color: "hover:text-blue-500" },
  { icon: Twitter, href: "https://twitter.com/nesaafrica", label: "Twitter", color: "hover:text-sky-400" },
  { icon: Instagram, href: "https://instagram.com/nesaafrica", label: "Instagram", color: "hover:text-pink-500" },
];

export function NomineesShowcaseSection() {
  const [selectedAward, setSelectedAward] = useState<string>("all");

  // Get all nominees from CSV data
  const allNominees = useMemo(() => getAllNominees(), []);
  const awards = useMemo(() => getAwards(), []);

  // Filter nominees by selected award
  const filteredNominees = useMemo(() => {
    if (selectedAward === "all") return allNominees.slice(0, 50); // Limit for display
    return allNominees.filter((n) => n.awardSlug === selectedAward).slice(0, 50);
  }, [allNominees, selectedAward]);

  // Group nominees by subcategory
  const groupedNominees = useMemo(() => {
    const groups: Record<string, { 
      subcategoryTitle: string; 
      subcategorySlug: string;
      awardTitle: string;
      nominees: typeof allNominees 
    }> = {};
    
    filteredNominees.forEach((nominee) => {
      const key = `${nominee.awardSlug}-${nominee.subcategorySlug}`;
      if (!groups[key]) {
        groups[key] = { 
          subcategoryTitle: nominee.subcategoryTitle, 
          subcategorySlug: nominee.subcategorySlug,
          awardTitle: nominee.awardTitle,
          nominees: [] 
        };
      }
      groups[key].nominees.push(nominee);
    });
    
    return Object.values(groups).slice(0, 10); // Limit groups for display
  }, [filteredNominees]);

  return (
    <section className="bg-charcoal py-16 md:py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold via-gold/50 to-gold" />
      </div>

      <div className="container relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Badge className="mb-4 bg-gold/10 text-gold border-gold/30">
            <Users className="w-3 h-3 mr-1" />
            Digital Nominees Board
          </Badge>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Meet Our <span className="text-gold">Changemakers</span>
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto mb-6">
            Celebrating Africa's education champions making extraordinary impact across the continent.
          </p>

          {/* Social Media Links */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="text-white/50 text-sm">Watch on NESA Africa TV:</span>
            <div className="flex gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center text-white/60 ${social.color} transition-all border border-white/10 hover:border-gold/30 hover:bg-gold/10`}
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Award Filter Tabs */}
        {awards.length > 0 && (
          <div className="mb-8 overflow-x-auto scrollbar-hide">
            <Tabs value={selectedAward} onValueChange={setSelectedAward} className="w-full">
              <TabsList className="inline-flex h-auto p-1 bg-white/5 rounded-full mx-auto">
                <TabsTrigger 
                  value="all" 
                  className="rounded-full px-4 py-2 text-sm data-[state=active]:bg-gold data-[state=active]:text-charcoal"
                >
                  All Awards
                </TabsTrigger>
                {awards.slice(0, 6).map((award) => (
                  <TabsTrigger 
                    key={award.slug} 
                    value={award.slug}
                    className="rounded-full px-4 py-2 text-sm whitespace-nowrap data-[state=active]:bg-gold data-[state=active]:text-charcoal"
                  >
                    {award.title.length > 25 ? award.title.substring(0, 25) + "..." : award.title}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        )}

        {/* Nominees Grid */}
        {filteredNominees.length === 0 ? (
          <div className="text-center py-16 bg-white/5 rounded-2xl border border-gold/20">
            <Award className="h-16 w-16 text-gold/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Nominees Yet</h3>
            <p className="text-white/60 mb-6 max-w-md mx-auto">
              Be the first to nominate a changemaker and help recognize Africa's education heroes!
            </p>
            <Button asChild size="lg" className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full px-8">
              <Link to="/nominate">
                Be the First to Nominate
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedAward}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {groupedNominees.length > 0 ? (
                <div className="space-y-10">
                  {groupedNominees.map((group) => (
                    <div key={`${group.awardTitle}-${group.subcategorySlug}`}>
                      {/* Subcategory Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-8 w-1 bg-gold rounded-full" />
                        <div>
                          <h3 className="text-lg font-semibold text-white">{group.subcategoryTitle}</h3>
                          <p className="text-sm text-gold/70">{group.awardTitle}</p>
                        </div>
                        <Badge variant="outline" className="ml-auto text-white/60 border-white/20">
                          {group.nominees.length} Nominees
                        </Badge>
                      </div>

                      {/* Nominees Row */}
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {group.nominees.slice(0, 10).map((nominee, index) => (
                          <NomineeShowcaseCard key={`${nominee.id}-${index}`} nominee={nominee} index={index} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {filteredNominees.slice(0, 20).map((nominee, index) => (
                    <NomineeShowcaseCard key={`${nominee.id}-${index}`} nominee={nominee} index={index} />
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {/* View All Button */}
        {filteredNominees.length > 0 && (
          <motion.div 
            className="text-center mt-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Button asChild variant="outline" size="lg" className="border-gold text-gold hover:bg-gold/10 rounded-full">
              <Link to="/nominees">
                View All Nominees
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}

// Individual Nominee Card for Showcase
function NomineeShowcaseCard({ 
  nominee, 
  index 
}: { 
  nominee: Nominee & { awardTitle: string; subcategoryTitle: string; regionName?: string }; 
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      viewport={{ once: true }}
    >
      <Link
        to={`/nominees/${encodeURIComponent(nominee.slug)}`}
        className="group block bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-gold/40 transition-all duration-300 hover:bg-white/10 relative"
      >
        {/* NESA Badge */}
        <div className="absolute top-2 left-2 z-10">
          <NESALogo variant="icon" size="sm" className="h-6 w-6 opacity-70" />
        </div>

        {/* Photo */}
        <div className="relative mb-3">
          <div className="w-16 h-16 mx-auto rounded-full overflow-hidden bg-gold/10 border-2 border-gold/30 group-hover:border-gold transition-colors">
            {nominee.imageUrl ? (
              <img 
                src={nominee.imageUrl} 
                alt={nominee.name}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gold text-xl font-bold">
                {nominee.name.charAt(0)}
              </div>
            )}
          </div>
          
          {/* Play Icon for video link */}
          <a
            href="https://youtube.com/@nesaafricatv"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute -bottom-1 right-1/2 translate-x-1/2 h-6 w-6 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
            onClick={(e) => e.stopPropagation()}
          >
            <Play className="h-3 w-3 text-white fill-white" />
          </a>
        </div>

        {/* Name */}
        <h4 className="text-sm font-semibold text-white text-center truncate group-hover:text-gold transition-colors">
          {nominee.name}
        </h4>

        {/* Achievement */}
        {nominee.achievement && (
          <p className="text-xs text-white/40 text-center line-clamp-2 mt-2">
            {nominee.achievement.substring(0, 80)}{nominee.achievement.length > 80 ? "..." : ""}
          </p>
        )}

        {/* Country Badge */}
        {nominee.country && (
          <div className="mt-3 flex justify-center">
            <Badge variant="outline" className="text-[10px] text-white/50 border-white/20">
              {nominee.country}
            </Badge>
          </div>
        )}

        {/* Region Badge */}
        {nominee.regionName && !nominee.country && (
          <div className="mt-3 flex justify-center">
            <Badge variant="outline" className="text-[10px] text-gold/60 border-gold/20">
              {nominee.regionName}
            </Badge>
          </div>
        )}
      </Link>
    </motion.div>
  );
}

export default NomineesShowcaseSection;
