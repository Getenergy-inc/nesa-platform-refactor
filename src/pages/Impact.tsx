import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, Heart, Users, Building2, Rocket, Target, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { impactItems, getImpactByType } from "@/data/impact";
import { validateImpactItems, logValidationWarning } from "@/lib/validate";
import { ImpactList, ImpactSources } from "@/components/ImpactList";

// Validate data on load
logValidationWarning("Impact", validateImpactItems(impactItems));

export default function Impact() {
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
          content="Explore the social impact of Education For All initiatives - programs, partnerships, milestones, and campaigns advancing education across Africa."
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
                Transformative programs, partnerships, and initiatives driving education access 
                and quality across Africa. Our collective impact creates lasting change.
              </p>
            </div>
          </div>
        </section>

        {/* Programs */}
        {programs.length > 0 && (
          <section className="py-12 lg:py-16">
            <div className="container mx-auto px-4">
              <div className="mb-8 flex items-center gap-3">
                <Target className="h-6 w-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">Programs</h2>
              </div>
              <ImpactList items={programs} />
            </div>
          </section>
        )}

        {/* Initiatives */}
        {initiatives.length > 0 && (
          <section className="bg-charcoal/80 py-12 lg:py-16">
            <div className="container mx-auto px-4">
              <div className="mb-8 flex items-center gap-3">
                <Rocket className="h-6 w-6 text-purple-400" />
                <h2 className="text-2xl font-bold text-white">Initiatives</h2>
              </div>
              <ImpactList items={initiatives} />
            </div>
          </section>
        )}

        {/* Partnerships */}
        {partnerships.length > 0 && (
          <section className="py-12 lg:py-16">
            <div className="container mx-auto px-4">
              <div className="mb-8 flex items-center gap-3">
                <Users className="h-6 w-6 text-green-400" />
                <h2 className="text-2xl font-bold text-white">Partnerships</h2>
              </div>
              <ImpactList items={partnerships} />
            </div>
          </section>
        )}

        {/* Milestones & Campaigns */}
        {(milestones.length > 0 || campaigns.length > 0) && (
          <section className="bg-charcoal/80 py-12 lg:py-16">
            <div className="container mx-auto px-4">
              <div className="mb-8 flex items-center gap-3">
                <Building2 className="h-6 w-6 text-amber-400" />
                <h2 className="text-2xl font-bold text-white">Milestones & Campaigns</h2>
              </div>
              <ImpactList items={[...milestones, ...campaigns]} />
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
            <ImpactSources items={impactItems} />
          </div>
        </section>
      </div>
    </>
  );
}
