import { CheckCircle, LayoutDashboard, Share2, Vote, Heart, Users } from "lucide-react";

export function AcceptanceNextSteps() {
  const mandatorySteps = [
    {
      icon: CheckCircle,
      title: "Accept Your Nomination",
      description: "Click the button below to confirm your participation.",
    },
    {
      icon: LayoutDashboard,
      title: "Activate Your Nominee Dashboard",
      description: "Update your profile, work history, and contributions to education.",
    },
  ];

  const optionalOpportunities = [
    {
      icon: Share2,
      title: "Share Your Referral Link",
      description: "Mobilize support and track votes in real-time.",
    },
    {
      icon: Heart,
      title: "Donate or Sponsor",
      description: "Support scholarships and NESA's mission.",
    },
    {
      icon: Users,
      title: "Nominate Others",
      description: "Recognize deserving individuals in other categories.",
    },
    {
      icon: Vote,
      title: "Engage Your Community",
      description: "Encourage votes via your unique nominee link.",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Mandatory Steps */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded">
            Required
          </span>
          Next Steps (Mandatory to Proceed):
        </h3>
        
        <div className="space-y-2">
          {mandatorySteps.map((step, index) => (
            <div 
              key={index}
              className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg border border-primary/20"
            >
              <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <step.icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">{step.title}</p>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Optional Opportunities */}
      <div className="space-y-3">
        <h3 className="font-semibold text-muted-foreground text-sm">
          Optional Opportunities:
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {optionalOpportunities.map((item, index) => (
            <div 
              key={index}
              className="flex items-start gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <item.icon className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
