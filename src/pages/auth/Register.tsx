import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Award } from "lucide-react";
import { toast } from "sonner";
import {
  StepIndicator,
  AccountTypeStep,
  PurposeStep,
  VerificationStep,
  CompleteStep,
  type AccountType,
  type RegistrationFormData,
} from "@/components/auth";

const STEPS = [
  { number: 1, label: "Account Type" },
  { number: 2, label: "Purpose" },
  { number: 3, label: "Verification" },
  { number: 4, label: "Complete" },
];

export default function Register() {
  const { t } = useTranslation("pages");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [accountType, setAccountType] = useState<AccountType | null>(null);
  const [formData, setFormData] = useState<RegistrationFormData>({
    email: "",
    password: "",
    fullName: "",
    phone: "",
    organization: "",
    country: "",
    chapterId: "",
    referralCode: searchParams.get("ref") || "",
  });
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Handle account type from URL (e.g., /register?type=judge)
  useEffect(() => {
    const typeParam = searchParams.get("type") as AccountType | null;
    if (typeParam && ["individual", "organization", "judge", "chapter", "sponsor", "volunteer"].includes(typeParam)) {
      setAccountType(typeParam);
      setCurrentStep(2);
    }
  }, [searchParams]);

  const handleFormChange = (data: Partial<RegistrationFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleSignUp = async () => {
    setIsVerifying(true);
    try {
      // For judges, redirect to judge application flow
      if (accountType === "judge") {
        navigate("/judgeapply");
        return;
      }

      await signUp(formData.email, formData.password, formData.fullName, formData.referralCode || undefined);
      
      // In a real app, we'd send verification email and wait
      // For now, we simulate verification success
      toast.success("Account created! Please check your email for verification.");
      setIsVerified(true);
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = () => {
    toast.info("Verification code resent to your email");
  };

  const handleVerify = (code: string) => {
    setIsVerifying(true);
    // Simulate verification
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
      toast.success("Email verified successfully!");
    }, 1500);
  };

  const handleComplete = () => {
    setIsComplete(true);
    setCurrentStep(4);
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= 4) {
      setCurrentStep(step);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <AccountTypeStep
            selectedType={accountType}
            onSelect={setAccountType}
            onNext={() => goToStep(2)}
          />
        );
      case 2:
        return (
          <PurposeStep
            accountType={accountType!}
            formData={formData}
            onChange={handleFormChange}
            onNext={handleSignUp}
            onBack={() => goToStep(1)}
          />
        );
      case 3:
        return (
          <VerificationStep
            email={formData.email}
            isVerifying={isVerifying}
            isVerified={isVerified}
            onResendCode={handleResendCode}
            onVerify={handleVerify}
            onNext={handleComplete}
            onBack={() => goToStep(2)}
          />
        );
      case 4:
        return (
          <CompleteStep
            accountType={accountType!}
            fullName={formData.fullName}
          />
        );
      default:
        return null;
    }
  };

  // Move to verification step after signup
  useEffect(() => {
    if (isVerifying === false && formData.email && currentStep === 2 && !isVerified) {
      // Don't auto-advance, let the signup handler control this
    }
  }, [isVerifying, formData.email, currentStep, isVerified]);

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
            <StepIndicator steps={STEPS} currentStep={currentStep} />
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
