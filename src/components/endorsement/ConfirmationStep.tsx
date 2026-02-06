import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { confirmationSchema, type ConfirmationData } from "@/lib/endorsement-validate";
import endorsementData from "@/data/endorsements.json";

interface ConfirmationStepProps {
  data: Partial<ConfirmationData>;
  formSummary: {
    organizationName: string;
    endorsementType: string;
    tier?: string;
    headline?: string;
  };
  onSubmit: (data: ConfirmationData) => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export function ConfirmationStep({
  data,
  formSummary,
  onSubmit,
  onBack,
  isSubmitting,
}: ConfirmationStepProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ConfirmationData>({
    resolver: zodResolver(confirmationSchema),
    defaultValues: {
      consentPublicDisplay: data.consentPublicDisplay || false,
      confirmAuthorization: data.confirmAuthorization || false,
      digitalSignature: data.digitalSignature || "",
    },
  });

  const tierInfo = endorsementData.tiers.find((t) => t.id === formSummary.tier);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <h2 className="font-display text-2xl font-bold text-foreground">
          Review & Submit
        </h2>
        <p className="text-muted-foreground">
          Please review your endorsement details and confirm submission.
        </p>
      </div>

      {/* Summary Card */}
      <div className="p-4 rounded-xl bg-muted/50 border border-border space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Organization:</span>
          <span className="font-medium text-foreground">{formSummary.organizationName}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Type:</span>
          <span className="font-medium text-foreground capitalize">
            {formSummary.endorsementType} Endorsement
            {tierInfo && ` (${tierInfo.name})`}
          </span>
        </div>
        {formSummary.headline && (
          <div className="flex justify-between items-start text-sm">
            <span className="text-muted-foreground">Headline:</span>
            <span className="font-medium text-foreground text-right max-w-xs">
              {formSummary.headline}
            </span>
          </div>
        )}
      </div>

      {/* Consent Checkboxes */}
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <Controller
            control={control}
            name="consentPublicDisplay"
            render={({ field }) => (
              <Checkbox
                id="consentPublicDisplay"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <div className="space-y-1">
            <Label htmlFor="consentPublicDisplay" className="cursor-pointer leading-relaxed">
              <span className="text-destructive">*</span> I consent to the public display of my
              endorsement on the NESA-Africa website, social media, and promotional materials.
            </Label>
            {errors.consentPublicDisplay && (
              <p className="text-xs text-destructive">{errors.consentPublicDisplay.message}</p>
            )}
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Controller
            control={control}
            name="confirmAuthorization"
            render={({ field }) => (
              <Checkbox
                id="confirmAuthorization"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <div className="space-y-1">
            <Label htmlFor="confirmAuthorization" className="cursor-pointer leading-relaxed">
              <span className="text-destructive">*</span> I confirm that I am authorized to submit
              this endorsement on behalf of my organization.
            </Label>
            {errors.confirmAuthorization && (
              <p className="text-xs text-destructive">{errors.confirmAuthorization.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Digital Signature */}
      <div className="space-y-2">
        <Label htmlFor="digitalSignature">
          Digital Signature <span className="text-destructive">*</span>
        </Label>
        <Input
          id="digitalSignature"
          placeholder="Type your full name as digital signature"
          {...register("digitalSignature")}
          className={errors.digitalSignature ? "border-destructive" : ""}
        />
        {errors.digitalSignature && (
          <p className="text-xs text-destructive">{errors.digitalSignature.message}</p>
        )}
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack} disabled={isSubmitting}>
          Back
        </Button>
        <Button
          type="submit"
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Endorsement"}
        </Button>
      </div>
    </form>
  );
}
