import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { 
  Gavel, 
  CheckCircle, 
  Mail, 
  User, 
  Building, 
  Globe, 
  FileText,
  Briefcase,
  Clock,
  ArrowRight,
  Loader2
} from "lucide-react";

const EXPERTISE_AREAS = [
  "Higher Education",
  "Primary & Secondary Education",
  "Technical & Vocational Training",
  "Educational Technology",
  "Policy & Governance",
  "Research & Innovation",
  "Special Needs Education",
  "Teacher Development",
  "Curriculum Development",
  "Educational Leadership",
];

const AFRICAN_COUNTRIES = [
  "Nigeria", "South Africa", "Kenya", "Ghana", "Egypt", "Ethiopia", "Tanzania",
  "Uganda", "Morocco", "Algeria", "Rwanda", "Cameroon", "Côte d'Ivoire", "Senegal",
  "Zimbabwe", "Zambia", "Botswana", "Namibia", "Mozambique", "Angola", "Tunisia",
  "Other African Country", "Diaspora"
];

const formSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  country: z.string().min(1, "Please select your country"),
  organization: z.string().min(2, "Organization name is required"),
  title: z.string().min(2, "Your title/position is required"),
  bio: z.string().min(100, "Please provide at least 100 characters about your background"),
  linkedinUrl: z.string().url("Please enter a valid LinkedIn URL").optional().or(z.literal("")),
  yearsExperience: z.string().min(1, "Please select your years of experience"),
  expertiseAreas: z.array(z.string()).min(1, "Please select at least one area of expertise"),
  agreeTerms: z.boolean().refine(val => val === true, "You must agree to the terms"),
  agreeCOI: z.boolean().refine(val => val === true, "You must agree to COI disclosure"),
});

type FormData = z.infer<typeof formSchema>;

export default function JudgeApply() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      country: "",
      organization: "",
      title: "",
      bio: "",
      linkedinUrl: "",
      yearsExperience: "",
      expertiseAreas: [],
      agreeTerms: false,
      agreeCOI: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      // Generate verification token
      const verificationToken = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 48); // 48 hour expiry

      const { error } = await supabase
        .from("judge_applications")
        .insert({
          full_name: data.fullName,
          email: data.email.toLowerCase(),
          phone: data.phone || null,
          country: data.country,
          organization: data.organization,
          title: data.title,
          bio: data.bio,
          linkedin_url: data.linkedinUrl || null,
          years_experience: parseInt(data.yearsExperience),
          expertise_areas: data.expertiseAreas,
          verification_token: verificationToken,
          verification_token_expires_at: expiresAt.toISOString(),
          status: "submitted",
        });

      if (error) {
        if (error.code === "23505") {
          toast.error("An application with this email already exists. Check your application status.");
          return;
        }
        throw error;
      }

      setIsSuccess(true);
      toast.success("Application submitted successfully!");
    } catch (error: any) {
      console.error("Error submitting application:", error);
      toast.error(error.message || "Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <>
        <Helmet>
          <title>Application Submitted | NESA-Africa Judges</title>
        </Helmet>
        <div className="min-h-screen bg-charcoal flex items-center justify-center p-4">
          <Card className="max-w-lg w-full border-gold/20 bg-charcoal-light">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <CardTitle className="text-2xl text-white">Application Submitted!</CardTitle>
              <CardDescription className="text-white/70">
                Thank you for applying to become a NESA-Africa Judge
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <div className="rounded-lg bg-gold/10 border border-gold/20 p-4">
                <Mail className="h-6 w-6 text-gold mx-auto mb-2" />
                <p className="text-white/80 text-sm">
                  We've sent a verification email to <strong className="text-gold">{form.getValues("email")}</strong>. 
                  Please verify your email to proceed.
                </p>
              </div>
              
              <div className="text-white/60 text-sm space-y-2">
                <p><strong>What happens next?</strong></p>
                <ol className="text-left list-decimal list-inside space-y-1">
                  <li>Check your email and click the verification link</li>
                  <li>Our review committee will evaluate your application</li>
                  <li>Once approved, you'll receive a link to create your account</li>
                  <li>Complete onboarding and access the Judges Arena</li>
                </ol>
              </div>

              <div className="flex flex-col gap-2 pt-4">
                <Button asChild className="bg-gold text-charcoal hover:bg-gold-dark">
                  <Link to="/judge/status">
                    Check Application Status
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  <Link to="/">Return to Home</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Apply to be a Judge | NESA-Africa</title>
        <meta name="description" content="Join the NESA-Africa expert jury panel. Apply now to help select Blue Garnet Award winners." />
      </Helmet>

      <div className="min-h-screen bg-charcoal py-12">
        <div className="container max-w-3xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 mb-4">
              <Gavel className="h-4 w-4 text-gold" />
              <span className="text-sm font-medium text-gold">Judge Application</span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">
              Apply to be a <span className="text-gold">Judge</span>
            </h1>
            <p className="text-white/70 max-w-xl mx-auto">
              Join our distinguished panel of education experts who evaluate and select Blue Garnet Award winners.
            </p>
          </div>

          {/* Already applied? */}
          <div className="mb-6 p-4 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
            <span className="text-white/70 text-sm">Already submitted an application?</span>
            <Button asChild variant="link" className="text-gold p-0 h-auto">
              <Link to="/judge/status">Check your status →</Link>
            </Button>
          </div>

          {/* Application Form */}
          <Card className="border-white/10 bg-white/5">
            <CardHeader>
              <CardTitle className="text-white">Application Form</CardTitle>
              <CardDescription className="text-white/60">
                All fields marked with * are required
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <User className="h-5 w-5 text-gold" />
                      Personal Information
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Full Name *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Dr. Jane Doe" 
                                className="bg-white/5 border-white/10 text-white"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Email Address *</FormLabel>
                            <FormControl>
                              <Input 
                                type="email"
                                placeholder="jane.doe@university.edu" 
                                className="bg-white/5 border-white/10 text-white"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Phone Number</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="+234 XXX XXX XXXX" 
                                className="bg-white/5 border-white/10 text-white"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Country *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                  <SelectValue placeholder="Select your country" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {AFRICAN_COUNTRIES.map(country => (
                                  <SelectItem key={country} value={country}>{country}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Professional Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Building className="h-5 w-5 text-gold" />
                      Professional Information
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="organization"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Organization *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="University of Lagos" 
                                className="bg-white/5 border-white/10 text-white"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Title / Position *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Professor of Education" 
                                className="bg-white/5 border-white/10 text-white"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="yearsExperience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Years of Experience *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                  <SelectValue placeholder="Select experience level" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="10">10-14 years</SelectItem>
                                <SelectItem value="15">15-19 years</SelectItem>
                                <SelectItem value="20">20-24 years</SelectItem>
                                <SelectItem value="25">25-29 years</SelectItem>
                                <SelectItem value="30">30+ years</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="linkedinUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">LinkedIn Profile</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="https://linkedin.com/in/janedoe" 
                                className="bg-white/5 border-white/10 text-white"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Professional Bio *</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Tell us about your background, achievements, and why you want to be a NESA-Africa judge..."
                              className="bg-white/5 border-white/10 text-white min-h-[120px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription className="text-white/50">
                            Minimum 100 characters. Include your key achievements and contributions to education.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Expertise Areas */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-gold" />
                      Areas of Expertise *
                    </h3>
                    
                    <FormField
                      control={form.control}
                      name="expertiseAreas"
                      render={() => (
                        <FormItem>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {EXPERTISE_AREAS.map((area) => (
                              <FormField
                                key={area}
                                control={form.control}
                                name="expertiseAreas"
                                render={({ field }) => (
                                  <FormItem
                                    key={area}
                                    className="flex items-center space-x-2 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(area)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, area])
                                            : field.onChange(field.value?.filter((v) => v !== area));
                                        }}
                                        className="border-white/30 data-[state=checked]:bg-gold data-[state=checked]:border-gold"
                                      />
                                    </FormControl>
                                    <FormLabel className="text-sm text-white/80 font-normal cursor-pointer">
                                      {area}
                                    </FormLabel>
                                  </FormItem>
                                )}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Agreements */}
                  <div className="space-y-4 border-t border-white/10 pt-6">
                    <FormField
                      control={form.control}
                      name="agreeTerms"
                      render={({ field }) => (
                        <FormItem className="flex items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="border-white/30 data-[state=checked]:bg-gold data-[state=checked]:border-gold mt-1"
                            />
                          </FormControl>
                          <div className="space-y-1">
                            <FormLabel className="text-white/80 font-normal">
                              I agree to the <Link to="/policies/terms" className="text-gold hover:underline">Terms of Service</Link> and <Link to="/policies/privacy" className="text-gold hover:underline">Privacy Policy</Link> *
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="agreeCOI"
                      render={({ field }) => (
                        <FormItem className="flex items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="border-white/30 data-[state=checked]:bg-gold data-[state=checked]:border-gold mt-1"
                            />
                          </FormControl>
                          <div className="space-y-1">
                            <FormLabel className="text-white/80 font-normal">
                              I agree to disclose any Conflicts of Interest and abide by the <Link to="/policies/coi" className="text-gold hover:underline">COI Policy</Link> *
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full bg-gold hover:bg-gold-dark text-charcoal font-semibold"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <FileText className="mr-2 h-5 w-5" />
                        Submit Application
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
