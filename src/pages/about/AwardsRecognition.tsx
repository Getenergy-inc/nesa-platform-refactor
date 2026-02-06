import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Award, 
  ExternalLink, 
  Calendar, 
  MapPin, 
  ArrowLeft,
  Trophy,
  Globe,
  Building,
} from "lucide-react";
import { awards, getAwardsByCategory, validateAwards, type Award as AwardType } from "@/data/awards";

// Validate data on load
if (!validateAwards()) {
  console.warn("Awards data validation failed - some items may have missing required fields");
}

const categoryLabels: Record<AwardType['category'], string> = {
  international: "International",
  continental: "Continental",
  regional: "Regional",
  national: "National",
  partner: "Partner",
};

const categoryColors: Record<AwardType['category'], string> = {
  international: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  continental: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  regional: "bg-green-500/20 text-green-400 border-green-500/30",
  national: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  partner: "bg-rose-500/20 text-rose-400 border-rose-500/30",
};

export default function AwardsRecognition() {
  const internationalAwards = getAwardsByCategory('international');
  const continentalAwards = getAwardsByCategory('continental');

  return (
    <>
      <Helmet>
        <title>Awards & Recognition | Education For All | NESA Africa</title>
        <meta
          name="description"
          content="Discover awards and recognitions celebrating Education For All initiatives across Africa - UNESCO prizes, African Union awards, and global education excellence."
        />
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-charcoal to-charcoal/95 py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <Link
              to="/about"
              className="mb-6 inline-flex items-center gap-2 text-sm text-white/60 hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to About
            </Link>
            
            <div className="max-w-3xl">
              <div className="mb-4 flex items-center gap-3">
                <Trophy className="h-8 w-8 text-primary" />
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  Education For All
                </Badge>
              </div>
              <h1 className="mb-4 font-display text-4xl font-bold text-white md:text-5xl">
                Awards & <span className="text-primary">Recognition</span>
              </h1>
              <p className="text-lg text-white/70">
                Celebrating excellence in education across Africa. These prestigious awards and recognitions 
                honor outstanding contributions to advancing quality education for all.
              </p>
            </div>
          </div>
        </section>

        {/* International Awards */}
        <section className="py-12 lg:py-16">
          <div className="container mx-auto px-4">
            <div className="mb-8 flex items-center gap-3">
              <Globe className="h-6 w-6 text-blue-400" />
              <h2 className="text-2xl font-bold text-white">International Recognition</h2>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {internationalAwards.map((award) => (
                <AwardCard key={award.id} award={award} />
              ))}
            </div>
          </div>
        </section>

        {/* Continental Awards */}
        <section className="bg-charcoal/80 py-12 lg:py-16">
          <div className="container mx-auto px-4">
            <div className="mb-8 flex items-center gap-3">
              <Building className="h-6 w-6 text-amber-400" />
              <h2 className="text-2xl font-bold text-white">Continental Awards</h2>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {continentalAwards.map((award) => (
                <AwardCard key={award.id} award={award} />
              ))}
            </div>
          </div>
        </section>

        {/* Sources Section */}
        <section className="bg-charcoal py-12 lg:py-16 border-t border-white/10">
          <div className="container mx-auto px-4">
            <h2 className="mb-6 text-xl font-bold text-white flex items-center gap-2">
              <ExternalLink className="h-5 w-5 text-primary" />
              Sources & Citations
            </h2>
            <div className="bg-white/5 rounded-lg p-6">
              <ul className="space-y-3">
                {awards.map((award) => (
                  <li key={award.id} className="flex items-start gap-3">
                    <span className="text-white/40">•</span>
                    <div>
                      <span className="text-white/80">{award.title}</span>
                      <span className="text-white/40 mx-2">—</span>
                      <a
                        href={award.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline inline-flex items-center gap-1"
                      >
                        View Source
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

function AwardCard({ award }: { award: AwardType }) {
  return (
    <Card className="h-full border-white/10 bg-white/5 hover:border-primary/30 hover:bg-white/10 transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <Badge 
            variant="outline" 
            className={categoryColors[award.category]}
          >
            {categoryLabels[award.category]}
          </Badge>
          <span className="text-sm text-white/50">{award.year}</span>
        </div>
        <CardTitle className="text-lg text-white mt-2">{award.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-white/60">{award.description}</p>
        
        <div className="flex flex-wrap gap-3 text-xs text-white/50">
          <span className="flex items-center gap-1">
            <Award className="h-3 w-3" />
            {award.organization}
          </span>
          {award.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {award.location}
            </span>
          )}
          {award.date && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {award.date}
            </span>
          )}
        </div>
        
        <a
          href={award.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"
        >
          Learn More
          <ExternalLink className="h-3 w-3" />
        </a>
      </CardContent>
    </Card>
  );
}
