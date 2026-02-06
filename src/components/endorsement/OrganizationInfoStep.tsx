import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { organizationInfoSchema, type OrganizationInfoData } from "@/lib/endorsement-validate";
import endorsementData from "@/data/endorsements.json";

interface OrganizationInfoStepProps {
  data: Partial<OrganizationInfoData>;
  onNext: (data: OrganizationInfoData) => void;
}

export function OrganizationInfoStep({ data, onNext }: OrganizationInfoStepProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<OrganizationInfoData>({
    resolver: zodResolver(organizationInfoSchema),
    defaultValues: {
      organizationName: data.organizationName || "",
      contactName: data.contactName || "",
      email: data.email || "",
      phone: data.phone || "",
      country: data.country || "",
      website: data.website || "",
    },
  });

  const selectedCountry = watch("country");

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div className="space-y-2">
        <h2 className="font-display text-2xl font-bold text-foreground">
          Organization Information
        </h2>
        <p className="text-muted-foreground">
          Tell us about your organization and provide contact details.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Organization Name */}
        <div className="space-y-2">
          <Label htmlFor="organizationName">
            Organization/Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="organizationName"
            placeholder="Enter organization name"
            {...register("organizationName")}
            className={errors.organizationName ? "border-destructive" : ""}
          />
          {errors.organizationName && (
            <p className="text-xs text-destructive">{errors.organizationName.message}</p>
          )}
        </div>

        {/* Contact Person Name */}
        <div className="space-y-2">
          <Label htmlFor="contactName">
            Contact Person Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="contactName"
            placeholder="Enter contact person name"
            {...register("contactName")}
            className={errors.contactName ? "border-destructive" : ""}
          />
          {errors.contactName && (
            <p className="text-xs text-destructive">{errors.contactName.message}</p>
          )}
        </div>

        {/* Email Address */}
        <div className="space-y-2">
          <Label htmlFor="email">
            Email Address <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter email address"
            {...register("email")}
            className={errors.email ? "border-destructive" : ""}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <Label htmlFor="phone">
            Phone Number <span className="text-destructive">*</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="Enter phone number"
            {...register("phone")}
            className={errors.phone ? "border-destructive" : ""}
          />
          {errors.phone && (
            <p className="text-xs text-destructive">{errors.phone.message}</p>
          )}
        </div>

        {/* Country */}
        <div className="space-y-2">
          <Label htmlFor="country">
            Country <span className="text-destructive">*</span>
          </Label>
          <Select
            value={selectedCountry}
            onValueChange={(value) => setValue("country", value)}
          >
            <SelectTrigger className={errors.country ? "border-destructive" : ""}>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {endorsementData.countries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.country && (
            <p className="text-xs text-destructive">{errors.country.message}</p>
          )}
        </div>

        {/* Website/Social Media */}
        <div className="space-y-2">
          <Label htmlFor="website">Website/Social Media</Label>
          <Input
            id="website"
            type="url"
            placeholder="Enter website or social media URL"
            {...register("website")}
            className={errors.website ? "border-destructive" : ""}
          />
          {errors.website && (
            <p className="text-xs text-destructive">{errors.website.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
          Next
        </Button>
      </div>
    </form>
  );
}
