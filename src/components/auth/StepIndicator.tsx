import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface Step {
  number: number;
  label: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  const progressPercentage = (currentStep / steps.length) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      {/* Progress Bar */}
      <Progress value={progressPercentage} className="h-2 mb-8" />

      {/* Step Circles */}
      <div className="flex justify-between items-start">
        {steps.map((step) => {
          const isCompleted = step.number < currentStep;
          const isCurrent = step.number === currentStep;
          const isPending = step.number > currentStep;

          return (
            <div key={step.number} className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold transition-all",
                  isCompleted && "bg-primary text-primary-foreground",
                  isCurrent && "bg-primary text-primary-foreground shadow-lg scale-110",
                  isPending && "bg-muted text-muted-foreground border-2 border-border"
                )}
              >
                {isCompleted ? (
                  <Check className="h-6 w-6" />
                ) : (
                  step.number
                )}
              </div>
              <span
                className={cn(
                  "text-sm font-medium text-center",
                  isCurrent && "text-primary",
                  isPending && "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Step Counter */}
      <div className="text-center mt-6">
        <p className="text-lg font-semibold">Step {currentStep} of {steps.length}</p>
        <p className="text-sm text-muted-foreground">{progressPercentage.toFixed(0)}% Complete</p>
      </div>
    </div>
  );
}
