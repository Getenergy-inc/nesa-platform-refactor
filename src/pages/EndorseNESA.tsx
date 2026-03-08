import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight, Users, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import {
  EndorsementStepIndicator,
  OrganizationInfoStep,
  EndorsementTypeStep,
  UploadMediaStep,
  ConfirmationStep,
} from "@/components/endorsement";
import type {
  OrganizationInfoData,
  EndorsementTypeData,
  UploadMediaData,
  ConfirmationData,
  EndorsementFormData,
} from "@/lib/endorsement-validate";
import endorsementData from "@/data/endorsements.json";
import { toast } from "sonner";

const steps = [
  { id: 1, title: "Organization Info" },
  { id: 2, title: "Type & Contribution" },
  { id: 3, title: "Upload Media" },
  { id: 4, title: "Review & Submit" },
];

export default function EndorseNESA() {
  const [showForm, setShowForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState<Partial<EndorsementFormData>>({
    organization: undefined,
    endorsementType: undefined,
    media: undefined,
    confirmation: undefined,
  });

  const nomineeDeadline = new Date(endorsementData.deadlines.nomineeEndorsement);
  const institutionalDeadline = new Date(endorsementData.deadlines.institutionalEndorsement);

  const handleOrganizationSubmit = (data: OrganizationInfoData) => {
    setFormData((prev) => ({ ...prev, organization: data }));
    setCurrentStep(2);
  };

  const handleEndorsementTypeSubmit = (data: EndorsementTypeData) => {
    setFormData((prev) => ({ ...prev, endorsementType: data }));
    setCurrentStep(3);
  };

  const handleMediaSubmit = (data: UploadMediaData) => {
    setFormData((prev) => ({ ...prev, media: data }));
    setCurrentStep(4);
  };

  const handleFinalSubmit = async (data: ConfirmationData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call - in production this would submit to backend
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      setFormData((prev) => ({ ...prev, confirmation: data }));
      setIsSubmitted(true);
      toast.success("Endorsement submitted successfully!", {
        description: "Thank you for supporting NESA-Africa!",
      });
    } catch (error) {
      toast.error("Submission failed", {
        description: "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  // Success State
  if (isSubmitted) {
    return (
      <>
        <Helmet>
          <title>Endorsement Submitted | NESA-Africa</title>
        </Helmet>
        <div className="min-h-screen bg-charcoal flex items-center justify-center p-4">
          <Card className="max-w-lg w-full text-center border-gold/10 bg-charcoal-light">
            <CardContent className="pt-8 pb-6 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-gold/10 flex items-center justify-center">
                <Users className="h-8 w-8 text-gold" />
              </div>
              <h1 className="font-display text-2xl font-bold text-white">
                Thank You for Your Endorsement!
              </h1>
              <p className="text-white/60">
                Your endorsement of NESA-Africa has been received. We will review your submission
                and get back to you shortly.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <Button asChild variant="outline" className="border-gold/50 text-gold hover:bg-gold/10">
                  <Link to="/">Return Home</Link>
                </Button>
                <Button asChild className="bg-gold hover:bg-gold/90 text-charcoal">
                  <Link to="/partners">View All Endorsers</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  // Landing / Hero State
  if (!showForm) {
    return (
      <>
        <Helmet>
          <title>Endorse NESA-Africa | Support Education Excellence</title>
          <meta
            name="description"
            content="Endorse NESA-Africa and support the continental movement for education transformation across Africa."
          />
        </Helmet>

        <div className="min-h-screen bg-charcoal">
          {/* Hero Section */}
          <section className="relative py-20 md:py-32 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
            <div className="container relative z-10">
              <div className="max-w-3xl mx-auto text-center space-y-6">
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Endorse <span className="text-gold">NESA-Africa</span>
                </h1>
                <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
                  Join leading organizations and institutions in endorsing NESA-Africa's mission to
                  celebrate and elevate education excellence across African countries.
                </p>

                {/* Deadline Badges */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/30">
                    <Calendar className="h-4 w-4 text-gold" />
                    <span className="text-sm text-gold">
                      Nominee Endorsement: {format(nomineeDeadline, "MMM d, yyyy")}
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/20">
                    <Calendar className="h-4 w-4 text-white/70" />
                    <span className="text-sm text-white/70">
                      Institutional Endorsement: {format(institutionalDeadline, "MMM d, yyyy")}
                    </span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
                  <Button
                    size="lg"
                    className="bg-gold hover:bg-gold/90 text-charcoal font-semibold gap-2"
                    onClick={() => setShowForm(true)}
                  >
                    <ArrowRight className="h-5 w-5" />
                    Endorse
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-gold/40 text-gold hover:bg-gold/10"
                  >
                    <Link to="/partners">View All Endorsers</Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <Link to="/partners#sponsor">Become a Sponsor</Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* What Does It Mean Section */}
          <section className="py-16 md:py-24 bg-background">
            <div className="container">
              <div className="max-w-3xl mx-auto text-center space-y-6">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                  What Does It Mean to Endorse NESA-Africa?
                </h2>
                <p className="text-lg text-muted-foreground">
                  Endorsing NESA-Africa means supporting a continental movement for education
                  transformation. It means standing behind 6,000+ nominees, 5,000 change-makers,
                  and a roadmap for scholarship access, education equity, and EdTech innovation.
                </p>
                <p className="text-lg font-semibold text-primary">
                  You're not just endorsing an award — you're backing a blueprint for Africa's
                  education future.
                </p>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
                <Card className="border-border/50 hover:border-primary/30 transition-colors">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">6,000+ Nominees</h3>
                    <p className="text-sm text-muted-foreground">
                      Support thousands of education champions across Africa
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border/50 hover:border-primary/30 transition-colors">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">54 Countries</h3>
                    <p className="text-sm text-muted-foreground">
                      Pan-African reach across the entire continent
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border/50 hover:border-primary/30 transition-colors">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">Annual Gala</h3>
                    <p className="text-sm text-muted-foreground">
                      Premier education awards ceremony
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Final CTA */}
              <div className="text-center mt-12">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                  onClick={() => setShowForm(true)}
                >
                  <ArrowRight className="h-5 w-5" />
                  Start Your Endorsement
                </Button>
              </div>
            </div>
          </section>
        </div>
      </>
    );
  }

  // Form State
  return (
    <>
      <Helmet>
        <title>Submit Endorsement | NESA-Africa</title>
      </Helmet>

      <div className="min-h-screen bg-background py-8 md:py-12">
        <div className="container max-w-3xl">
          {/* Back to Landing */}
          <Button
            variant="ghost"
            className="mb-6 text-muted-foreground hover:text-foreground"
            onClick={() => {
              setShowForm(false);
              setCurrentStep(1);
            }}
          >
            ← Back to Overview
          </Button>

          {/* Step Indicator */}
          <EndorsementStepIndicator steps={steps} currentStep={currentStep} />

          {/* Form Card */}
          <Card className="border-border/50 shadow-lg">
            <CardContent className="p-6 md:p-8">
              {currentStep === 1 && (
                <OrganizationInfoStep
                  data={formData.organization || {}}
                  onNext={handleOrganizationSubmit}
                />
              )}

              {currentStep === 2 && (
                <EndorsementTypeStep
                  data={formData.endorsementType || {}}
                  onNext={handleEndorsementTypeSubmit}
                  onBack={handleBack}
                />
              )}

              {currentStep === 3 && (
                <UploadMediaStep
                  data={formData.media || {}}
                  onNext={handleMediaSubmit}
                  onBack={handleBack}
                />
              )}

              {currentStep === 4 && (
                <ConfirmationStep
                  data={formData.confirmation || {}}
                  formSummary={{
                    organizationName: formData.organization?.organizationName || "",
                    endorsementType: formData.endorsementType?.endorsementType || "free",
                    tier: formData.endorsementType?.tier,
                    headline: formData.media?.headline,
                  }}
                  onSubmit={handleFinalSubmit}
                  onBack={handleBack}
                  isSubmitting={isSubmitting}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
