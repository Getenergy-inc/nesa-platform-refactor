import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  FileText,
  Code,
  Users,
  Shield,
  Megaphone,
  DollarSign,
  Scale,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface OrganizationData {
  organizationName: string;
  registrationNumber: string;
  organizationType: string;
  sector: string;
  selectedFunctions: string[];
}

interface FunctionOption {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const organizationTypes = [
  "Non-Profit Organization",
  "Educational Institution",
  "Government Agency",
  "Corporate Entity",
  "Foundation",
  "Social Enterprise",
  "Media Organization",
  "Other",
];

const sectorOptions = [
  {
    id: "education",
    icon: <Users className="h-5 w-5" />,
    title: "Education & Training",
    description: "Schools, universities, and training institutions",
  },
  {
    id: "ngo",
    icon: <Building2 className="h-5 w-5" />,
    title: "NGO / Civil Society",
    description: "Non-profit and civil society organizations",
  },
  {
    id: "government",
    icon: <Shield className="h-5 w-5" />,
    title: "Government / Public Sector",
    description: "Government agencies and public institutions",
  },
  {
    id: "corporate",
    icon: <Building2 className="h-5 w-5" />,
    title: "Corporate / Private Sector",
    description: "Private companies and corporations",
  },
  {
    id: "tech",
    icon: <Code className="h-5 w-5" />,
    title: "Technology & Digital Services",
    description:
      "Technology development, digital platforms, and technical support",
  },
  {
    id: "chapter",
    icon: <Users className="h-5 w-5" />,
    title: "Local Chapter Services",
    description:
      "Local chapter management, community engagement, and regional coordination",
  },
];

const functionOptions: FunctionOption[] = [
  {
    id: "admin",
    icon: <Shield className="h-5 w-5" />,
    title: "Admin / Governance",
    description:
      "Administrative tasks, governance, and organizational management",
  },
  {
    id: "media",
    icon: <Megaphone className="h-5 w-5" />,
    title: "Media / Content",
    description:
      "Content creation, social media management, and communications",
  },
  {
    id: "fundraising",
    icon: <DollarSign className="h-5 w-5" />,
    title: "Fundraising / Sponsorship",
    description:
      "Fundraising activities, sponsor relations, and financial partnerships",
  },
  {
    id: "tech",
    icon: <Code className="h-5 w-5" />,
    title: "Tech / Web / Dev",
    description:
      "Software development, web development, and technical implementation",
  },
  {
    id: "legal",
    icon: <Scale className="h-5 w-5" />,
    title: "Legal / Compliance",
    description: "Legal affairs, compliance, and regulatory matters",
  },
  {
    id: "events",
    icon: <Calendar className="h-5 w-5" />,
    title: "Event / Chapter Growth",
    description: "Event planning, chapter expansion, and community growth",
  },
];

interface OrganizationInfoStepProps {
  data: OrganizationData;
  onChange: (data: Partial<OrganizationData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function OrganizationInfoStep({
  data,
  onChange,
  onNext,
  onBack,
}: OrganizationInfoStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggleFunction = (functionId: string) => {
    const current = data.selectedFunctions || [];
    const updated = current.includes(functionId)
      ? current.filter((f) => f !== functionId)
      : [...current, functionId];
    onChange({ selectedFunctions: updated });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!data.organizationName?.trim()) {
      newErrors.organizationName = "Organization name is required";
    }
    if (!data.organizationType) {
      newErrors.organizationType = "Organization type is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validate()) {
      onNext();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-display font-bold">
          Organization Information
        </h2>
        <p className="text-muted-foreground mt-2">
          Please provide your organization details to create your account.
        </p>
      </div>

      {/* Organization Details Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Organization Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Organization Name */}
          <div className="space-y-2">
            <Label htmlFor="orgName">
              Organization Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="orgName"
              placeholder="Enter your organization name"
              value={data.organizationName}
              onChange={(e) => onChange({ organizationName: e.target.value })}
            />
            {errors.organizationName && (
              <p className="text-xs text-destructive">
                {errors.organizationName}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Registration Number */}
            <div className="space-y-2">
              <Label htmlFor="regNumber">
                Registration Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="regNumber"
                placeholder="Enter registration number"
                value={data.registrationNumber}
                onChange={(e) =>
                  onChange({ registrationNumber: e.target.value })
                }
              />
            </div>

            {/* Organization Type */}
            <div className="space-y-2">
              <Label>
                Organization Type <span className="text-destructive">*</span>
              </Label>
              <Select
                value={data.organizationType}
                onValueChange={(val) => onChange({ organizationType: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select organization type" />
                </SelectTrigger>
                <SelectContent>
                  {organizationTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.organizationType && (
                <p className="text-xs text-destructive">
                  {errors.organizationType}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sector Selection */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3">
          Sector{" "}
          <span className="text-muted-foreground text-sm font-normal">
            (Select one)
          </span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {sectorOptions.map((sector) => {
            const isSelected = data.sector === sector.id;
            return (
              <Card
                key={sector.id}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md hover:border-primary/50",
                  isSelected && "border-2 border-primary bg-primary/5",
                )}
                onClick={() => onChange({ sector: sector.id })}
              >
                <CardContent className="p-4 flex items-start gap-3">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {sector.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{sector.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {sector.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Functions Selection */}
      <div className="mb-8">
        <h3 className="font-semibold mb-3">
          Functions{" "}
          <span className="text-muted-foreground text-sm font-normal">
            (Optional - Select all that apply)
          </span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {functionOptions.map((func) => {
            const isSelected = (data.selectedFunctions || []).includes(func.id);
            return (
              <Card
                key={func.id}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md hover:border-primary/50",
                  isSelected && "border-2 border-primary bg-primary/5",
                )}
                onClick={() => toggleFunction(func.id)}
              >
                <CardContent className="p-4 flex items-start gap-3">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {func.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{func.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {func.description}
                    </p>
                  </div>
                  <Checkbox
                    checked={isSelected}
                    className="h-5 w-5 rounded-full shrink-0"
                  />
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="flex gap-4 justify-center">
        <Button variant="outline" size="lg" onClick={onBack}>
          Back
        </Button>
        <Button
          size="lg"
          onClick={handleContinue}
          className="min-w-[200px] bg-gradient-gold text-secondary font-semibold hover:opacity-90"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
