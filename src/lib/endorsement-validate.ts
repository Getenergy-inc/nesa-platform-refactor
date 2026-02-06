/**
 * Validation utilities for the Endorsement form wizard
 */
import { z } from "zod";

export const organizationInfoSchema = z.object({
  organizationName: z.string().min(2, "Organization name is required"),
  contactName: z.string().min(2, "Contact person name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(6, "Please enter a valid phone number"),
  country: z.string().min(1, "Please select a country"),
  website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
});

export const endorsementTypeSchema = z.object({
  endorsementType: z.enum(["free", "paid"], {
    required_error: "Please select an endorsement type",
  }),
  tier: z.string().optional(),
  paymentMethod: z.string().optional(),
});

export const uploadMediaSchema = z.object({
  logoUrl: z.string().optional(),
  videoUrl: z.string().optional(),
  videoLink: z.string().url("Please enter a valid YouTube or Vimeo link").optional().or(z.literal("")),
  headline: z.string().max(100, "Headline must be under 100 characters").optional(),
});

export const confirmationSchema = z.object({
  consentPublicDisplay: z.boolean().refine((val) => val === true, {
    message: "You must consent to public display of your endorsement",
  }),
  confirmAuthorization: z.boolean().refine((val) => val === true, {
    message: "You must confirm you are authorized to submit this endorsement",
  }),
  digitalSignature: z.string().min(2, "Please type your full name as digital signature"),
});

export type OrganizationInfoData = z.infer<typeof organizationInfoSchema>;
export type EndorsementTypeData = z.infer<typeof endorsementTypeSchema>;
export type UploadMediaData = z.infer<typeof uploadMediaSchema>;
export type ConfirmationData = z.infer<typeof confirmationSchema>;

export interface EndorsementFormData {
  organization: OrganizationInfoData;
  endorsementType: EndorsementTypeData;
  media: UploadMediaData;
  confirmation: ConfirmationData;
}
