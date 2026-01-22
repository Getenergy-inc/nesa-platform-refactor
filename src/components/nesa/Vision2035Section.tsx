import { useState } from "react";
import { VISION_2035_PILLARS, type VisionPillar } from "@/config/nesaSeasonConfig";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Globe, 
  Star, 
  Cpu, 
  Leaf, 
  ChevronDown, 
  ChevronUp, 
  Target, 
  Users,
  GraduationCap,
  Lightbulb,
  ArrowRight
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Globe,
  Star,
  Cpu,
  Leaf,
  Target,
  Users,
  GraduationCap,
  Lightbulb,
};

interface Vision2035SectionProps {
  variant?: "full" | "compact" | "card";
}

export function Vision2035Section({ variant = "full" }: Vision2035SectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activePillar, setActivePillar] = useState<string | null>(null);

  const getPillarIcon = (iconName: string) => {
    const Icon = iconMap[iconName] || Globe;
    return Icon;
  };

  if (variant === "card") {
    return (
      <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="font-display">Vision 2035</CardTitle>
              <CardDescription>Transforming African Education</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {VISION_2035_PILLARS.slice(0, 4).map((pillar) => {
              const Icon = getPillarIcon(pillar.icon);
              return (
                <div
                  key={pillar.id}
                  className="flex items-center gap-2 rounded-lg bg-muted/50 p-3 transition-colors hover:bg-muted"
                >
                  <Icon className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{pillar.name}</span>
                </div>
              );
            })}
          </div>
          <Button variant="link" className="mt-4 p-0 text-primary">
            Learn More <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (variant === "compact") {
    return (
      <div className="rounded-xl bg-gradient-to-r from-secondary to-secondary/80 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Target className="h-8 w-8 text-primary" />
            <div>
              <h3 className="font-display text-xl font-bold text-secondary-foreground">Vision 2035</h3>
              <p className="text-sm text-secondary-foreground/70">
                A decade-long roadmap to transform education across Africa
              </p>
            </div>
          </div>
          <Button variant="outline" className="border-primary/30 text-primary">
            Explore Vision
          </Button>
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <section className="py-20 bg-gradient-to-b from-secondary to-secondary/95">
      <div className="container px-6">
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
              <Target className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Strategic Vision</span>
            </div>
            <h2 className="mb-4 font-display text-4xl font-bold text-secondary-foreground md:text-5xl">
              Vision <span className="text-gradient-gold">2035</span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-secondary-foreground/70">
              A transformative decade-long roadmap to revolutionize education across Africa, 
              ensuring every child has access to world-class learning opportunities.
            </p>
          </div>

          {/* Pillars Grid */}
          <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {VISION_2035_PILLARS.map((pillar) => {
              const Icon = getPillarIcon(pillar.icon);
              const isActive = activePillar === pillar.id;
              
              return (
                <Card
                  key={pillar.id}
                  className={`cursor-pointer transition-all duration-300 ${
                    isActive 
                      ? "border-primary bg-primary/5 shadow-lg shadow-primary/20" 
                      : "border-border/50 bg-card/50 hover:border-primary/30 hover:bg-card"
                  }`}
                  onClick={() => setActivePillar(isActive ? null : pillar.id)}
                >
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-full ${
                        isActive ? "bg-primary" : "bg-primary/10"
                      }`}>
                        <Icon className={`h-6 w-6 ${isActive ? "text-primary-foreground" : "text-primary"}`} />
                      </div>
                      <ChevronDown 
                        className={`h-5 w-5 text-muted-foreground transition-transform ${
                          isActive ? "rotate-180" : ""
                        }`} 
                      />
                    </div>
                    <h3 className="mb-2 font-display text-lg font-bold">{pillar.name}</h3>
                    <p className="text-sm text-muted-foreground">{pillar.description}</p>
                    
                    {isActive && (
                      <div className="mt-4 space-y-2 border-t pt-4 animate-fade-in">
                        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Key Goals</p>
                        <ul className="space-y-1">
                          {pillar.goals.map((goal, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                              {goal}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Expandable Content */}
          <CollapsibleTrigger asChild>
            <Button
              variant="outline"
              className="mx-auto flex items-center gap-2 border-primary/30 text-secondary-foreground"
            >
              {isExpanded ? "Show Less" : "Explore Full Vision Document"}
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-8">
            <Card className="border-primary/20 bg-card/50">
              <CardContent className="p-8">
                <div className="prose prose-sm max-w-none text-muted-foreground dark:prose-invert">
                  <h3 className="font-display text-2xl font-bold text-foreground">Our Commitment</h3>
                  <p>
                    NESA Africa's Vision 2035 represents a bold commitment to transform education 
                    across the African continent. By recognizing and celebrating excellence, we 
                    aim to inspire a generation of educators, innovators, and leaders who will 
                    shape the future of learning.
                  </p>
                  
                  <h4 className="mt-6 font-display text-xl font-bold text-foreground">Strategic Objectives</h4>
                  <ul>
                    <li>Establish NESA chapters in all 54 African nations by 2030</li>
                    <li>Recognize 10,000+ educators and institutions by 2035</li>
                    <li>Create a continental network of education excellence</li>
                    <li>Partner with governments, NGOs, and private sector for systemic change</li>
                    <li>Launch the NESA Education Fund for underprivileged schools</li>
                  </ul>
                  
                  <h4 className="mt-6 font-display text-xl font-bold text-foreground">Milestones</h4>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-lg bg-muted p-4 text-center">
                      <p className="font-display text-3xl font-bold text-primary">2025</p>
                      <p className="text-sm">Pan-African Expansion</p>
                    </div>
                    <div className="rounded-lg bg-muted p-4 text-center">
                      <p className="font-display text-3xl font-bold text-primary">2030</p>
                      <p className="text-sm">Continental Coverage</p>
                    </div>
                    <div className="rounded-lg bg-muted p-4 text-center">
                      <p className="font-display text-3xl font-bold text-primary">2035</p>
                      <p className="text-sm">Vision Realized</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </section>
  );
}
