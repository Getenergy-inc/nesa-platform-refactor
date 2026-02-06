import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, Trophy, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { awards } from "@/data/awards";
import { validateAwards, logValidationWarning } from "@/lib/validate";
import { AwardsList, AwardsSources } from "@/components/AwardsList";

// Validate data on load
logValidationWarning("Awards", validateAwards(awards));

export default function Awards() {
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

        {/* Awards Grid */}
        <section className="py-12 lg:py-16">
          <div className="container mx-auto px-4">
            <AwardsList awards={awards} />
          </div>
        </section>

        {/* Sources Section */}
        <section className="bg-charcoal py-12 lg:py-16 border-t border-white/10">
          <div className="container mx-auto px-4">
            <h2 className="mb-6 text-xl font-bold text-white flex items-center gap-2">
              <ExternalLink className="h-5 w-5 text-primary" />
              Sources & Citations
            </h2>
            <AwardsSources awards={awards} />
          </div>
        </section>
      </div>
    </>
  );
}
