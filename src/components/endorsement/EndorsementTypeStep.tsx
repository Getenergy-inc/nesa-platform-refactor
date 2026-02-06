import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { endorsementTypeSchema, type EndorsementTypeData } from "@/lib/endorsement-validate";
import endorsementData from "@/data/endorsements.json";
import { cn } from "@/lib/utils";

interface EndorsementTypeStepProps {
  data: Partial<EndorsementTypeData>;
  onNext: (data: EndorsementTypeData) => void;
  onBack: () => void;
}

export function EndorsementTypeStep({ data, onNext, onBack }: EndorsementTypeStepProps) {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EndorsementTypeData>({
    resolver: zodResolver(endorsementTypeSchema),
    defaultValues: {
      endorsementType: data.endorsementType || undefined,
      tier: data.tier || "",
      paymentMethod: data.paymentMethod || "",
    },
  });

  const endorsementType = watch("endorsementType");
  const selectedTier = watch("tier");

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div className="space-y-2">
        <h2 className="font-display text-2xl font-bold text-foreground">
          Endorsement Type & Contribution
        </h2>
        <p className="text-muted-foreground">
          Choose how you would like to support NESA-Africa.
        </p>
      </div>

      {/* Endorsement Type Selection */}
      <div className="space-y-4">
        <Label>
          Select Endorsement Type <span className="text-destructive">*</span>
        </Label>
        <Controller
          control={control}
          name="endorsementType"
          render={({ field }) => (
            <RadioGroup
              value={field.value}
              onValueChange={field.onChange}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {endorsementData.types.map((type) => (
                <label
                  key={type.id}
                  className={cn(
                    "relative flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all",
                    field.value === type.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <RadioGroupItem value={type.id} id={type.id} className="mt-1" />
                  <div className="flex-1">
                    <span className="font-semibold text-foreground">{type.title}</span>
                    <p className="text-sm text-muted-foreground mt-1">{type.description}</p>
                  </div>
                </label>
              ))}
            </RadioGroup>
          )}
        />
        {errors.endorsementType && (
          <p className="text-xs text-destructive">{errors.endorsementType.message}</p>
        )}
      </div>

      {/* Paid Endorsement Options */}
      {endorsementType === "paid" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
          {/* Tier Selection */}
          <div className="space-y-3">
            <Label>
              Select Endorsement Tier <span className="text-destructive">*</span>
            </Label>
            <Select
              value={selectedTier}
              onValueChange={(value) => setValue("tier", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {endorsementData.tiers.map((tier) => (
                  <SelectItem key={tier.id} value={tier.id}>
                    {tier.name} - ${tier.priceUsd}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tier Benefits Preview */}
          {selectedTier && (
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <h4 className="font-semibold text-foreground mb-2">
                {endorsementData.tiers.find((t) => t.id === selectedTier)?.name} Benefits:
              </h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {endorsementData.tiers
                  .find((t) => t.id === selectedTier)
                  ?.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {benefit}
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {/* Payment Method */}
          <div className="space-y-3">
            <Label>
              Payment Method <span className="text-destructive">*</span>
            </Label>
            <Controller
              control={control}
              name="paymentMethod"
              render={({ field }) => (
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="grid grid-cols-2 gap-3"
                >
                  {endorsementData.paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                        field.value === method.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <RadioGroupItem value={method.id} id={method.id} />
                      <span className="text-sm font-medium">{method.name}</span>
                    </label>
                  ))}
                </RadioGroup>
              )}
            />
          </div>
        </div>
      )}

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
          Next
        </Button>
      </div>
    </form>
  );
}
