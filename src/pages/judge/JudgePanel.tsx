import { Helmet } from "react-helmet-async";
import { JudgesArenaLayout } from "@/components/judge/JudgesArenaLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, MapPin, Building, GraduationCap } from "lucide-react";

// Mock data for the 27 judges panel
const JUDGES_PANEL = [
  { name: "Prof. Amina Okonkwo", country: "Nigeria", org: "University of Lagos", expertise: "Higher Education", avatar: null },
  { name: "Dr. Kwame Asante", country: "Ghana", org: "Ghana Education Service", expertise: "Policy & Governance", avatar: null },
  { name: "Dr. Fatou Diallo", country: "Senegal", org: "UNESCO BREDA", expertise: "International Education", avatar: null },
  { name: "Prof. John Mwangi", country: "Kenya", org: "Kenya Institute of Curriculum", expertise: "Curriculum Development", avatar: null },
  { name: "Dr. Thandiwe Ndlovu", country: "South Africa", org: "WITS University", expertise: "Teacher Training", avatar: null },
  { name: "Prof. Ahmed Hassan", country: "Egypt", org: "Cairo University", expertise: "STEM Education", avatar: null },
  { name: "Dr. Grace Mbeki", country: "Tanzania", org: "Dar es Salaam University", expertise: "Primary Education", avatar: null },
  { name: "Prof. Chidi Eze", country: "Nigeria", org: "NERDC", expertise: "Research & Development", avatar: null },
  { name: "Dr. Mariama Bah", country: "Gambia", org: "Ministry of Education", expertise: "Education Finance", avatar: null },
  { name: "Prof. Samuel Owusu", country: "Ghana", org: "Ashesi University", expertise: "EdTech Innovation", avatar: null },
  { name: "Dr. Aisha Mohammed", country: "Morocco", org: "Mohammed V University", expertise: "Islamic Education", avatar: null },
  { name: "Prof. Peter Oyelaran", country: "Nigeria", org: "Covenant University", expertise: "Private Education", avatar: null },
  { name: "Dr. Florence Nakamura", country: "Uganda", org: "Makerere University", expertise: "Special Needs Education", avatar: null },
  { name: "Prof. Jacques Mbemba", country: "DRC", org: "University of Kinshasa", expertise: "Francophone Education", avatar: null },
  { name: "Dr. Esther Akinola", country: "Nigeria", org: "Lagos Business School", expertise: "Executive Education", avatar: null },
  { name: "Prof. Omar Sy", country: "Côte d'Ivoire", org: "Félix Houphouët-Boigny University", expertise: "Vocational Training", avatar: null },
  { name: "Dr. Ruth Mensah", country: "Ghana", org: "African Development Bank", expertise: "Education Funding", avatar: null },
  { name: "Prof. Ibrahim Traore", country: "Mali", org: "University of Bamako", expertise: "Rural Education", avatar: null },
  { name: "Dr. Ngozi Obi", country: "Nigeria", org: "TechQuest STEM Academy", expertise: "STEM for Girls", avatar: null },
  { name: "Prof. David Achebe", country: "Nigeria", org: "NTI", expertise: "Distance Learning", avatar: null },
  { name: "Dr. Amara Kamara", country: "Sierra Leone", org: "Fourah Bay College", expertise: "Post-Conflict Education", avatar: null },
  { name: "Prof. Elizabeth Banda", country: "Zambia", org: "University of Zambia", expertise: "Agricultural Education", avatar: null },
  { name: "Dr. Moussa Keita", country: "Guinea", org: "Ministry of Education", expertise: "Literacy Programs", avatar: null },
  { name: "Prof. Olumide Fashola", country: "Nigeria", org: "UI", expertise: "Medical Education", avatar: null },
  { name: "Dr. Patricia Oduya", country: "Kenya", org: "Strathmore University", expertise: "Business Education", avatar: null },
  { name: "Prof. Abdullahi Shehu", country: "Nigeria", org: "ABU Zaria", expertise: "Engineering Education", avatar: null },
  { name: "Dr. Cynthia Okafor", country: "Nigeria", org: "British Council Nigeria", expertise: "International Partnerships", avatar: null },
];

const EXPERTISE_COLORS: Record<string, string> = {
  "Higher Education": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "Policy & Governance": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "International Education": "bg-green-500/20 text-green-400 border-green-500/30",
  "Curriculum Development": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  "Teacher Training": "bg-pink-500/20 text-pink-400 border-pink-500/30",
  "STEM Education": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  "Primary Education": "bg-orange-500/20 text-orange-400 border-orange-500/30",
  "EdTech Innovation": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  default: "bg-white/20 text-white/70 border-white/30",
};

export default function JudgePanel() {
  // Group by region/country
  const nigeriaJudges = JUDGES_PANEL.filter(j => j.country === "Nigeria");
  const otherJudges = JUDGES_PANEL.filter(j => j.country !== "Nigeria");

  return (
    <>
      <Helmet>
        <title>Jury Panel | Judges Arena</title>
      </Helmet>

      <JudgesArenaLayout title="Fellow Judges" description="The 27-member Blue Garnet Jury Panel">
        <div className="p-6">
          {/* Stats Header */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="border-gold/20 bg-gold/5">
              <CardContent className="p-4 text-center">
                <Users className="h-6 w-6 text-gold mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">27</p>
                <p className="text-xs text-white/60">Total Judges</p>
              </CardContent>
            </Card>
            <Card className="border-white/10 bg-white/5">
              <CardContent className="p-4 text-center">
                <MapPin className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">12</p>
                <p className="text-xs text-white/60">Countries</p>
              </CardContent>
            </Card>
            <Card className="border-white/10 bg-white/5">
              <CardContent className="p-4 text-center">
                <Building className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">25+</p>
                <p className="text-xs text-white/60">Institutions</p>
              </CardContent>
            </Card>
            <Card className="border-white/10 bg-white/5">
              <CardContent className="p-4 text-center">
                <GraduationCap className="h-6 w-6 text-green-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">15+</p>
                <p className="text-xs text-white/60">Expertise Areas</p>
              </CardContent>
            </Card>
          </div>

          {/* Nigeria Judges */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-500" />
              Nigeria ({nigeriaJudges.length} Judges)
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {nigeriaJudges.map((judge, index) => (
                <JudgeCard key={index} judge={judge} />
              ))}
            </div>
          </div>

          {/* Other Africa Judges */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-400" />
              Pan-African Panel ({otherJudges.length} Judges)
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {otherJudges.map((judge, index) => (
                <JudgeCard key={index} judge={judge} />
              ))}
            </div>
          </div>
        </div>
      </JudgesArenaLayout>
    </>
  );
}

function JudgeCard({ judge }: { judge: typeof JUDGES_PANEL[0] }) {
  const initials = judge.name
    .split(" ")
    .filter(n => n.length > 2)
    .map(n => n[0])
    .join("")
    .slice(0, 2);

  const expertiseClass = EXPERTISE_COLORS[judge.expertise] || EXPERTISE_COLORS.default;

  return (
    <Card className="border-white/10 bg-white/5 hover:border-gold/30 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12 border-2 border-gold/20">
            <AvatarImage src={judge.avatar || undefined} />
            <AvatarFallback className="bg-gold/10 text-gold text-sm font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-white text-sm truncate">{judge.name}</h4>
            <p className="text-xs text-white/50 truncate">{judge.org}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-white/20 text-white/60">
                {judge.country}
              </Badge>
            </div>
          </div>
        </div>
        <Badge className={`mt-3 text-[10px] ${expertiseClass}`}>
          {judge.expertise}
        </Badge>
      </CardContent>
    </Card>
  );
}
