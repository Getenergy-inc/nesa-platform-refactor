import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/contexts/AuthContext";
import { lovable } from "@/integrations/lovable";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import nesaStamp from "@/assets/nesa-stamp.jpeg";
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
  const [googleLoading, setGoogleLoading] = useState(false);

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
  
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationError, setVerificationError] = useState<string>();

  const needsOrgInfo = accountType === "organization" || accountType === "sponsor";
  const steps = getSteps(accountType, needsOrgInfo);

  useEffect(() => {
    const typeParam = searchParams.get("type") as AccountType | null;
    if (typeParam && ["individual", "organization", "judge", "chapter", "sponsor", "volunteer"].includes(typeParam)) {
      setAccountType(typeParam);
      setCurrentStep(2);
    }
  }, [searchParams]);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || "Google sign-in failed");
      setGoogleLoading(false);
    }
  };

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
      
      const chapterLabel = personalInfo.chapterId ? "Your Local Chapter content is ready." : "";
      toast.success("Welcome to Santos Creations Educational Foundation!", {
        description: `Your account is active. ${chapterLabel} Please check your email for verification.`,
      });

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
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
      toast.success("Email verified! Your dashboard is ready.");
    }, 1500);
  };

  const handleComplete = () => {
    goToStep(steps.length);
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= steps.length) {
      setCurrentStep(step);
    }
  };

  const renderStep = () => {
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
    <>
      <Helmet>
        <title>Create Account | NESA-Africa</title>
      </Helmet>
      <div className="min-h-screen bg-charcoal py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <Link to="/" className="inline-flex items-center gap-3 mb-4">
              <img src={nesaStamp} alt="NESA Africa" className="h-12 w-12 rounded-full object-contain" />
              <span className="font-display text-xl font-bold text-white">NESA Africa</span>
            </Link>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">
              Create Your Account
            </h1>
            <p className="text-white/60">
              Already have an account?{" "}
              <Link to="/login" className="text-gold hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </motion.div>

          {/* Quick Google Sign-Up (only on step 1) */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="max-w-md mx-auto mb-6"
            >
              <Card className="border-white/10 bg-charcoal-light">
                <CardContent className="py-5 space-y-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white gap-3 h-11"
                    onClick={handleGoogleSignIn}
                    disabled={googleLoading}
                  >
                    {googleLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <svg className="h-5 w-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                    )}
                    Sign up with Google
                  </Button>
                  <div className="relative">
                    <Separator className="bg-white/10" />
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-charcoal-light px-3 text-xs text-white/40">
                      or continue with email
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Progress Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            <Card className="mb-8 border-white/10 bg-charcoal-light shadow-xl">
              <CardContent className="py-8">
                <StepIndicator steps={steps} currentStep={currentStep} />
              </CardContent>
            </Card>
          </motion.div>

          {/* Step Content */}
          <Card className="border-white/10 bg-charcoal-light shadow-2xl">
            <CardContent className="py-10 px-6 md:px-10">
              {renderStep()}
            </CardContent>
          </Card>

          {/* Footer */}
          <p className="text-center text-white/40 text-sm mt-6">
            By creating an account, you agree to our{" "}
            <Link to="/policies" className="text-gold hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/policies" className="text-gold hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
