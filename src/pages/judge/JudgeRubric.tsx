import { Helmet } from "react-helmet-async";
import { JudgesArenaLayout } from "@/components/judge/JudgesArenaLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Star, CheckCircle, AlertTriangle, Info } from "lucide-react";

const RUBRIC_CRITERIA = [
  {
    name: "Impact & Reach",
    weight: 25,
    description: "Measurable positive impact on education outcomes and the breadth of influence",
    levels: [
      { score: "0-20", label: "Limited", desc: "Minimal demonstrable impact" },
      { score: "21-40", label: "Moderate", desc: "Some evidence of positive outcomes" },
      { score: "41-60", label: "Significant", desc: "Clear, documented impact on education" },
      { score: "61-80", label: "Substantial", desc: "Wide-reaching influence with strong metrics" },
      { score: "81-100", label: "Exceptional", desc: "Transformative impact at scale" },
    ],
  },
  {
    name: "Innovation & Creativity",
    weight: 20,
    description: "Novel approaches, creative solutions, and pioneering methodologies",
    levels: [
      { score: "0-20", label: "Conventional", desc: "Standard approaches only" },
      { score: "21-40", label: "Adaptive", desc: "Some modifications to existing methods" },
      { score: "41-60", label: "Innovative", desc: "New approaches with clear benefits" },
      { score: "61-80", label: "Pioneering", desc: "Industry-leading innovations" },
      { score: "81-100", label: "Revolutionary", desc: "Paradigm-shifting contributions" },
    ],
  },
  {
    name: "Sustainability & Scalability",
    weight: 20,
    description: "Long-term viability and potential for expansion or replication",
    levels: [
      { score: "0-20", label: "Short-term", desc: "Limited sustainability outlook" },
      { score: "21-40", label: "Developing", desc: "Plans for sustainability in progress" },
      { score: "41-60", label: "Established", desc: "Proven sustainable model" },
      { score: "61-80", label: "Scalable", desc: "Ready for expansion with clear path" },
      { score: "81-100", label: "Replicable", desc: "Model successfully adopted elsewhere" },
    ],
  },
  {
    name: "Leadership & Advocacy",
    weight: 20,
    description: "Demonstrated leadership qualities and advocacy for education excellence",
    levels: [
      { score: "0-20", label: "Emerging", desc: "Beginning leadership journey" },
      { score: "21-40", label: "Developing", desc: "Growing influence in their space" },
      { score: "41-60", label: "Established", desc: "Recognized leader in their field" },
      { score: "61-80", label: "Influential", desc: "Shapes policy and practice" },
      { score: "81-100", label: "Visionary", desc: "Defines the future of education" },
    ],
  },
  {
    name: "Evidence & Documentation",
    weight: 15,
    description: "Quality and completeness of supporting documentation and evidence",
    levels: [
      { score: "0-20", label: "Minimal", desc: "Limited supporting evidence" },
      { score: "21-40", label: "Basic", desc: "Some documentation provided" },
      { score: "41-60", label: "Adequate", desc: "Sufficient evidence for claims" },
      { score: "61-80", label: "Comprehensive", desc: "Detailed, verified documentation" },
      { score: "81-100", label: "Exemplary", desc: "Outstanding evidence portfolio" },
    ],
  },
];

export default function JudgeRubric() {
  return (
    <>
      <Helmet>
        <title>Scoring Rubric | Judges Arena</title>
      </Helmet>

      <JudgesArenaLayout title="Scoring Rubric" description="Blue Garnet evaluation criteria">
        <div className="p-6 max-w-5xl mx-auto">
          {/* Introduction */}
          <Card className="border-gold/20 bg-gold/5 mb-8">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                  <Star className="h-6 w-6 text-gold" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">Blue Garnet Scoring Guidelines</h2>
                  <p className="text-white/70 mb-4">
                    As a member of the NESA-Africa Jury Panel, your evaluations directly determine 
                    the Blue Garnet Award recipients. Each finalist is scored on a 0-100 scale across 
                    five weighted criteria.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                      60% Jury Weight
                    </Badge>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      40% Public Vote
                    </Badge>
                    <Badge className="bg-gold/20 text-gold border-gold/30">
                      5 Criteria
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Criteria Cards */}
          <div className="space-y-6">
            {RUBRIC_CRITERIA.map((criteria, index) => (
              <Card key={criteria.name} className="border-white/10 bg-white/5">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg">{criteria.name}</CardTitle>
                        <p className="text-sm text-white/60 mt-1">{criteria.description}</p>
                      </div>
                    </div>
                    <Badge className="bg-white/10 text-white border-white/20">
                      {criteria.weight}% Weight
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-white/40 mb-1">
                      <span>0</span>
                      <span>100</span>
                    </div>
                    <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                      {criteria.levels.map((level, i) => (
                        <div
                          key={level.score}
                          className={`absolute h-full ${
                            i === 0 ? "bg-red-500/50" :
                            i === 1 ? "bg-orange-500/50" :
                            i === 2 ? "bg-yellow-500/50" :
                            i === 3 ? "bg-green-500/50" :
                            "bg-emerald-500/50"
                          }`}
                          style={{
                            left: `${i * 20}%`,
                            width: "20%",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {criteria.levels.map((level, i) => (
                      <div
                        key={level.score}
                        className={`text-center p-2 rounded-lg ${
                          i === 0 ? "bg-red-500/10" :
                          i === 1 ? "bg-orange-500/10" :
                          i === 2 ? "bg-yellow-500/10" :
                          i === 3 ? "bg-green-500/10" :
                          "bg-emerald-500/10"
                        }`}
                      >
                        <p className="text-xs font-bold text-white mb-0.5">{level.score}</p>
                        <p className={`text-[10px] font-medium ${
                          i === 0 ? "text-red-400" :
                          i === 1 ? "text-orange-400" :
                          i === 2 ? "text-yellow-400" :
                          i === 3 ? "text-green-400" :
                          "text-emerald-400"
                        }`}>
                          {level.label}
                        </p>
                        <p className="text-[10px] text-white/50 mt-1 leading-tight">{level.desc}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Important Notes */}
          <Card className="border-yellow-500/20 bg-yellow-500/5 mt-8">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-white mb-2">Important Reminders</h3>
                  <ul className="space-y-2 text-sm text-white/70">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      Scores are final once submitted and cannot be modified
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      Declare any Conflict of Interest before scoring
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      Review all evidence dossiers thoroughly before scoring
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      All scores are confidential and audit-logged
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </JudgesArenaLayout>
    </>
  );
}
