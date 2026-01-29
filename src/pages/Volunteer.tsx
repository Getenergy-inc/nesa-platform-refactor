import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Users, 
  Calendar, 
  Globe, 
  Award,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Clock,
  MapPin,
  Laptop
} from "lucide-react";
import { Link } from "react-router-dom";

const volunteerRoles = [
  {
    title: "Nomination Reviewer",
    type: "Remote",
    commitment: "5-10 hrs/week",
    description: "Review and verify nomination submissions for completeness and eligibility",
    icon: Award,
    skills: ["Attention to detail", "Research skills", "Education background preferred"]
  },
  {
    title: "Social Media Ambassador",
    type: "Remote",
    commitment: "3-5 hrs/week",
    description: "Amplify NESA-Africa stories and engage with our community online",
    icon: Globe,
    skills: ["Social media savvy", "Content creation", "Community engagement"]
  },
  {
    title: "Event Volunteer",
    type: "On-site",
    commitment: "Event-based",
    description: "Support local and regional NESA events, ceremonies, and workshops",
    icon: Calendar,
    skills: ["Event coordination", "Customer service", "Flexibility"]
  },
  {
    title: "Translation Volunteer",
    type: "Remote",
    commitment: "Variable",
    description: "Help translate content into French, Arabic, Portuguese, or Swahili",
    icon: Laptop,
    skills: ["Bilingual proficiency", "Writing skills", "Cultural awareness"]
  },
  {
    title: "Outreach Coordinator",
    type: "Hybrid",
    commitment: "5-8 hrs/week",
    description: "Connect with schools, universities, and education organizations",
    icon: Users,
    skills: ["Networking", "Communication", "Local knowledge"]
  },
  {
    title: "Content Creator",
    type: "Remote",
    commitment: "5-10 hrs/week",
    description: "Create compelling stories about nominees and winners",
    icon: Sparkles,
    skills: ["Writing", "Storytelling", "Video editing a plus"]
  }
];

const volunteerBenefits = [
  {
    title: "Certificate of Recognition",
    description: "Receive official NESA-Africa volunteer certification"
  },
  {
    title: "Exclusive Access",
    description: "VIP access to NESA events and ceremonies"
  },
  {
    title: "Networking",
    description: "Connect with education leaders across Africa"
  },
  {
    title: "Skill Development",
    description: "Training and professional development opportunities"
  },
  {
    title: "Reference Letters",
    description: "Professional references for outstanding volunteers"
  },
  {
    title: "Community Impact",
    description: "Make a real difference in education recognition"
  }
];

const volunteerStats = [
  { value: "2,000+", label: "Active Volunteers" },
  { value: "30", label: "Countries" },
  { value: "50,000+", label: "Hours Contributed" },
  { value: "10,000+", label: "Nominations Processed" }
];

export default function Volunteer() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-nesa-gold/20 via-background to-nesa-gold/10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-nesa-gold/20 text-nesa-gold border-nesa-gold/30">
              Join Our Movement
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Volunteer with <span className="text-nesa-gold">NESA-Africa</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Be part of Africa's largest education recognition movement. 
              Your time and talent can help celebrate the educators transforming our continent.
            </p>
            <Button size="lg" className="bg-nesa-gold hover:bg-nesa-gold/90 text-black">
              <Heart className="w-5 h-5 mr-2" />
              Apply to Volunteer
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {volunteerStats.map((stat, index) => (
              <div key={index}>
                <p className="text-4xl font-bold text-nesa-gold">{stat.value}</p>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Volunteer Roles */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Volunteer Opportunities</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find the perfect role that matches your skills and availability
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {volunteerRoles.map((role, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 bg-nesa-gold/10 rounded-lg flex items-center justify-center">
                      <role.icon className="w-6 h-6 text-nesa-gold" />
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="text-xs">
                        <MapPin className="w-3 h-3 mr-1" />
                        {role.type}
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="text-lg mt-4">{role.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {role.commitment}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{role.description}</p>
                  <div className="space-y-2">
                    {role.skills.map((skill, skillIndex) => (
                      <Badge key={skillIndex} variant="outline" className="mr-2 text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    Apply for This Role
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Volunteer Benefits</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We value our volunteers and offer meaningful recognition and opportunities
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {volunteerBenefits.map((benefit, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <CheckCircle className="w-10 h-10 text-nesa-gold mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">How to Get Started</h2>
            <div className="space-y-6">
              {[
                { step: 1, title: "Submit Application", description: "Fill out our volunteer application form with your interests and availability" },
                { step: 2, title: "Interview", description: "Brief virtual interview to match you with the right opportunity" },
                { step: 3, title: "Onboarding", description: "Complete orientation and training for your volunteer role" },
                { step: 4, title: "Start Contributing", description: "Begin making an impact in Africa's education landscape" }
              ].map((item, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="w-10 h-10 bg-nesa-gold text-black rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-nesa-gold/20 to-amber-500/20">
        <div className="container mx-auto px-4 text-center">
          <Heart className="w-12 h-12 text-nesa-gold mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Join thousands of volunteers across Africa working to recognize and celebrate education excellence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-nesa-gold hover:bg-nesa-gold/90 text-black">
              Start Your Application
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Link to="/contact">
              <Button size="lg" variant="outline">
                Contact Volunteer Team
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
