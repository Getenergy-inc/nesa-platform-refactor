import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ExternalLink, 
  Calendar, 
  MapPin, 
  ArrowLeft,
  Heart,
  Users,
  Target,
  Zap,
  Building,
  Globe,
} from "lucide-react";
import { impactItems, getImpactByType, validateImpactItems, type ImpactItem } from "@/data/impact";

// Validate data on load
if (!validateImpactItems()) {
  console.warn("Impact data validation failed - some items may have missing required fields");
}

const typeLabels: Record<ImpactItem['type'], string> = {
  program: "Program",
  milestone: "Milestone",
  partnership: "Partnership",
  initiative: "Initiative",
  campaign: "Campaign",
};

const typeIcons: Record<ImpactItem['type'], typeof Heart> = {
  program: Users,
  milestone: Target,
  partnership: Building,
  initiative: Zap,
  campaign: Globe,
};

const typeColors: Record<ImpactItem['type'], string> = {
  program: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  milestone: "bg-green-500/20 text-green-400 border-green-500/30",
  partnership: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  initiative: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  campaign: "bg-rose-500/20 text-rose-400 border-rose-500/30",
};

export default function SocialImpact() {
  const programs = getImpactByType('program');
  const initiatives = getImpactByType('initiative');
  const partnerships = getImpactByType('partnership');
  const milestones = getImpactByType('milestone');
  const campaigns = getImpactByType('campaign');

  return (
    <>
      <Helmet>
        <title>Social Impact | Education For All | NESA Africa</title>
        <meta
          name="description"
          content="Explore the social impact of Education For All initiatives across Africa - programs, milestones, partnerships, and campaigns advancing quality education."
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
                <Heart className="h-8 w-8 text-primary" />
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  Education For All
                </Badge>
              </div>
              <h1 className="mb-4 font-display text-4xl font-bold text-white md:text-5xl">
                Social <span className="text-primary">Impact</span>
              </h1>
              <p className="text-lg text-white/70">
                Transforming education across Africa through impactful programs, strategic partnerships, 
                and milestone achievements. Together, we're building a brighter future for all learners.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Overview */}
        <section className="py-8 border-b border-white/10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <StatCard label="Programs" value={programs.length} icon={Users} />
              <StatCard label="Initiatives" value={initiatives.length} icon={Zap} />
              <StatCard label="Partnerships" value={partnerships.length} icon={Building} />
              <StatCard label="Milestones" value={milestones.length} icon={Target} />
              <StatCard label="Campaigns" value={campaigns.length} icon={Globe} />
            </div>
          </div>
        </section>

        {/* Programs */}
        {programs.length > 0 && (
          <section className="py-12 lg:py-16">
            <div className="container mx-auto px-4">
              <div className="mb-8 flex items-center gap-3">
                <Users className="h-6 w-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">Programs</h2>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                {programs.map((item) => (
                  <ImpactCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Initiatives */}
        {initiatives.length > 0 && (
          <section className="bg-charcoal/80 py-12 lg:py-16">
            <div className="container mx-auto px-4">
              <div className="mb-8 flex items-center gap-3">
                <Zap className="h-6 w-6 text-amber-400" />
                <h2 className="text-2xl font-bold text-white">Initiatives</h2>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                {initiatives.map((item) => (
                  <ImpactCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Partnerships */}
        {partnerships.length > 0 && (
          <section className="py-12 lg:py-16">
            <div className="container mx-auto px-4">
              <div className="mb-8 flex items-center gap-3">
                <Building className="h-6 w-6 text-purple-400" />
                <h2 className="text-2xl font-bold text-white">Partnerships</h2>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                {partnerships.map((item) => (
                  <ImpactCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Milestones */}
        {milestones.length > 0 && (
          <section className="bg-charcoal/80 py-12 lg:py-16">
            <div className="container mx-auto px-4">
              <div className="mb-8 flex items-center gap-3">
                <Target className="h-6 w-6 text-green-400" />
                <h2 className="text-2xl font-bold text-white">Milestones</h2>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                {milestones.map((item) => (
                  <ImpactCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Campaigns */}
        {campaigns.length > 0 && (
          <section className="py-12 lg:py-16">
            <div className="container mx-auto px-4">
              <div className="mb-8 flex items-center gap-3">
                <Globe className="h-6 w-6 text-rose-400" />
                <h2 className="text-2xl font-bold text-white">Campaigns</h2>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                {campaigns.map((item) => (
                  <ImpactCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Sources Section */}
        <section className="bg-charcoal py-12 lg:py-16 border-t border-white/10">
          <div className="container mx-auto px-4">
            <h2 className="mb-6 text-xl font-bold text-white flex items-center gap-2">
              <ExternalLink className="h-5 w-5 text-primary" />
              Sources & Citations
            </h2>
            <div className="bg-white/5 rounded-lg p-6">
              <ul className="space-y-3">
                {impactItems.map((item) => (
                  <li key={item.id} className="flex items-start gap-3">
                    <span className="text-white/40">•</span>
                    <div>
                      <span className="text-white/80">{item.title}</span>
                      <span className="text-white/40 mx-2">—</span>
                      <a
                        href={item.sourceUrl}
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

function StatCard({ label, value, icon: Icon }: { label: string; value: number; icon: typeof Heart }) {
  return (
    <div className="bg-white/5 rounded-lg p-4 text-center border border-white/10">
      <Icon className="h-5 w-5 text-primary mx-auto mb-2" />
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-white/60">{label}</div>
    </div>
  );
}

function ImpactCard({ item }: { item: ImpactItem }) {
  const Icon = typeIcons[item.type];
  
  return (
    <Card className="h-full border-white/10 bg-white/5 hover:border-primary/30 hover:bg-white/10 transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <Badge 
            variant="outline" 
            className={typeColors[item.type]}
          >
            <Icon className="h-3 w-3 mr-1" />
            {typeLabels[item.type]}
          </Badge>
          <span className="text-sm text-white/50">{item.year}</span>
        </div>
        <CardTitle className="text-lg text-white mt-2">{item.title}</CardTitle>
        <p className="text-sm text-white/50">{item.organization}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-white/60">{item.description}</p>
        
        {/* Metrics */}
        {item.metrics && item.metrics.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {item.metrics.map((metric, idx) => (
              <div 
                key={idx}
                className="bg-white/5 rounded px-2 py-1 text-xs"
              >
                <span className="text-white/50">{metric.label}:</span>{" "}
                <span className="text-primary font-medium">{metric.value}</span>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex flex-wrap gap-3 text-xs text-white/50">
          {item.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {item.location}
            </span>
          )}
          {item.date && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {item.date}
            </span>
          )}
        </div>
        
        <a
          href={item.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
        >
          Learn More
          <ExternalLink className="h-3 w-3" />
        </a>
      </CardContent>
    </Card>
  );
}
