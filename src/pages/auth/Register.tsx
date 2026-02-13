import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Award } from "lucide-react";
import { toast } from "sonner";
import {
  StepIndicator,
  AccountTypeStep,
  PurposeSelectionStep,
  OrganizationInfoStep,
  PersonalInfoStep,
  EmailVerificationStep,
  CompleteStep,
  type AccountType,
  type OrganizationData,
  type PersonalInfoData,
} from "@/components/auth";

// Define the steps - dynamic based on account type
const getSteps = (accountType: AccountType | null, needsOrgInfo: boolean) => {
  const steps = [
    { number: 1, label: "Account Type" },
    { number: 2, label: "Purpose" },
  ];
  
  if (needsOrgInfo) {
    steps.push({ number: 3, label: "Organization" });
    steps.push({ number: 4, label: "Details" });
    steps.push({ number: 5, label: "Verification" });
    steps.push({ number: 6, label: "Complete" });
  } else {
    steps.push({ number: 3, label: "Details" });
    steps.push({ number: 4, label: "Verification" });
    steps.push({ number: 5, label: "Complete" });
  }
  
  return steps;
};

export default function Register() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signUp } = useAuth();

  // Registration state
  const [currentStep, setCurrentStep] = useState(1);
  const [accountType, setAccountType] = useState<AccountType | null>(null);
  const [selectedPurposes, setSelectedPurposes] = useState<string[]>([]);
  const [organizationData, setOrganizationData] = useState<OrganizationData>({
    organizationName: "",
    registrationNumber: "",
    organizationType: "",
    sector: "",
    selectedFunctions: [],
  });
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoData>({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    country: "",
    organization: "",
    chapterId: "",
    referralCode: searchParams.get("ref") || "",
  });
  
  // Verification state
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationError, setVerificationError] = useState<string>();

  // Determine if org info step is needed
  const needsOrgInfo = accountType === "organization" || accountType === "sponsor";
  const steps = getSteps(accountType, needsOrgInfo);

  // Handle account type from URL (e.g., /register?type=judge)
  useEffect(() => {
    const typeParam = searchParams.get("type") as AccountType | null;
    if (typeParam && ["individual", "organization", "judge", "chapter", "sponsor", "volunteer"].includes(typeParam)) {
      setAccountType(typeParam);
      setCurrentStep(2);
    }
  }, [searchParams]);

  const handlePurposeToggle = (purposeId: string) => {
    setSelectedPurposes(prev => 
      prev.includes(purposeId) 
        ? prev.filter(p => p !== purposeId)
        : [...prev, purposeId]
    );
  };

  const handleOrganizationChange = (data: Partial<OrganizationData>) => {
    setOrganizationData(prev => ({ ...prev, ...data }));
  };

  const handlePersonalInfoChange = (data: Partial<PersonalInfoData>) => {
    setPersonalInfo(prev => ({ ...prev, ...data }));
  };

  const handleSignUp = async () => {
    setIsVerifying(true);
    setVerificationError(undefined);
    
    try {
      // For judges, redirect to judge application flow
      if (accountType === "judge") {
        navigate("/judgeapply");
        return;
      }

      await signUp(
        personalInfo.email, 
        personalInfo.password, 
        personalInfo.fullName, 
        personalInfo.referralCode || undefined
      );
      
      // Build chapter-aware welcome message
      const chapterLabel = personalInfo.chapterId ? "Your Local Chapter content is ready." : "";
      toast.success("Welcome to Santos Creations Educational Foundation!", {
        description: `Your account is active. ${chapterLabel} Please check your email for verification.`,
      });

      // Move to verification step
      goToStep(needsOrgInfo ? 5 : 4);
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
      setVerificationError(error.message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = () => {
    toast.info("New verification code sent to your email");
    setVerificationError(undefined);
  };

  const handleVerify = (code: string) => {
    setIsVerifying(true);
    setVerificationError(undefined);
    
    // Simulate verification
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
      toast.success("Email verified! Your dashboard is ready.");
    }, 1500);
  };

  const handleComplete = () => {
    // Move to complete step
    goToStep(steps.length);
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= steps.length) {
      setCurrentStep(step);
    }
  };

  const getStepNumber = (stepName: string): number => {
    const step = steps.find(s => s.label === stepName);
    return step?.number || 1;
  };

  const renderStep = () => {
    // Map current step to component based on flow
    const stepLabel = steps[currentStep - 1]?.label;

    switch (stepLabel) {
      case "Account Type":
        return (
          <AccountTypeStep
            selectedType={accountType}
            onSelect={setAccountType}
            onNext={() => goToStep(2)}
          />
        );
      
      case "Purpose":
        return (
          <PurposeSelectionStep
            selectedPurposes={selectedPurposes}
            onToggle={handlePurposeToggle}
            onNext={() => goToStep(3)}
            onBack={() => goToStep(1)}
          />
        );
      
      case "Organization":
        return (
          <OrganizationInfoStep
            data={organizationData}
            onChange={handleOrganizationChange}
            onNext={() => goToStep(4)}
            onBack={() => goToStep(2)}
          />
        );
      
      case "Details":
        return (
          <PersonalInfoStep
            accountType={accountType!}
            data={personalInfo}
            onChange={handlePersonalInfoChange}
            onNext={handleSignUp}
            onBack={() => goToStep(needsOrgInfo ? 3 : 2)}
          />
        );
      
      case "Verification":
        return (
          <EmailVerificationStep
            email={personalInfo.email}
            isVerifying={isVerifying}
            isVerified={isVerified}
            error={verificationError}
            onResendCode={handleResendCode}
            onVerify={handleVerify}
            onNext={handleComplete}
            onBack={() => goToStep(needsOrgInfo ? 4 : 3)}
          />
        );
      
      case "Complete":
        return (
          <CompleteStep
            accountType={accountType!}
            fullName={personalInfo.fullName}
            chapterId={personalInfo.chapterId}
            country={personalInfo.country}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero pattern-african py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="h-12 w-12 rounded-full bg-gradient-gold shadow-gold flex items-center justify-center">
              <Award className="h-6 w-6 text-secondary" />
            </div>
            <span className="font-display text-xl font-bold text-white">NESA Africa</span>
          </Link>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">
            Create Your Account
          </h1>
          <p className="text-white/70">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>

        {/* Progress Indicator */}
        <Card className="mb-8 border-0 shadow-xl">
          <CardContent className="py-8">
            <StepIndicator steps={steps} currentStep={currentStep} />
          </CardContent>
        </Card>

        {/* Step Content */}
        <Card className="border-0 shadow-2xl">
          <CardContent className="py-10 px-6 md:px-10">
            {renderStep()}
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-white/60 text-sm mt-6">
          By creating an account, you agree to our{" "}
          <Link to="/policies" className="text-primary hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/policies" className="text-primary hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
