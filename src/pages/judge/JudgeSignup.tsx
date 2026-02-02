import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { 
  Gavel, 
  UserPlus, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  Lock,
  Mail,
  Eye,
  EyeOff
} from "lucide-react";

const formSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof formSchema>;

interface ApplicationData {
  id: string;
  full_name: string;
  email: string;
  status: string;
}

export default function JudgeSignup() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get("email");
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [application, setApplication] = useState<ApplicationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Verify the application exists and is approved (or email_verified)
  useEffect(() => {
    async function verifyApplication() {
      if (!email) {
        setError("no_email");
        setIsLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from("judge_applications")
          .select("id, full_name, email, status")
          .eq("email", email.toLowerCase())
          .maybeSingle();

        if (fetchError) throw fetchError;

        if (!data) {
          setError("no_application");
        } else if (data.status === "account_created" || data.status === "onboarded") {
          setError("already_created");
        } else if (data.status === "submitted") {
          setError("not_verified");
        } else if (data.status === "rejected") {
          setError("rejected");
        } else if (data.status === "email_verified" || data.status === "approved" || data.status === "under_review") {
          // Allow account creation for verified applications (admin may skip approval step)
          setApplication(data as ApplicationData);
        } else {
          setError(`unknown_status:${data.status}`);
        }
      } catch (err: any) {
        console.error("Error verifying application:", err);
        setError("fetch_error");
      } finally {
        setIsLoading(false);
      }
    }

    verifyApplication();
  }, [email]);

  const onSubmit = async (data: FormData) => {
    if (!application) return;

    setIsSubmitting(true);

    try {
      // Create the user account
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: application.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/judge/dashboard`,
          data: {
            full_name: application.full_name,
          },
        },
      });

      if (signUpError) throw signUpError;

      if (!authData.user) {
        throw new Error("Failed to create account");
      }

      // Update the application status and link the user
      const { error: updateError } = await supabase
        .from("judge_applications")
        .update({
          status: "account_created",
          user_id: authData.user.id,
        })
        .eq("id", application.id);

      if (updateError) {
        console.error("Failed to update application:", updateError);
        // Don't throw - account was created successfully
      }

      // Add the jury role
      const { error: roleError } = await supabase
        .from("user_roles")
        .insert({
          user_id: authData.user.id,
          role: "jury",
        });

      if (roleError) {
        console.error("Failed to add jury role:", roleError);
        // Don't throw - we can fix this manually
      }

      toast.success("Account created successfully! Please check your email to verify, then sign in.");
      
      // Redirect to login with next pointing to judge status
      navigate("/login?next=/judge/status");

    } catch (error: any) {
      console.error("Error creating account:", error);
      toast.error(error.message || "Failed to create account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-gold animate-spin mx-auto mb-4" />
          <p className="text-white/70">Verifying your application...</p>
        </div>
      </div>
    );
  }

  if (error) {
    const errorConfig: Record<string, { title: string; message: string; action: { label: string; href: string } }> = {
      no_email: {
        title: "Missing Email",
        message: "You must verify your judge application first before creating an account.",
        action: { label: "Apply to be a Judge", href: "/judgeapply" },
      },
      no_application: {
        title: "No Application Found",
        message: "We couldn't find an application with this email. Please apply first.",
        action: { label: "Apply Now", href: "/judgeapply" },
      },
      already_created: {
        title: "Account Already Exists",
        message: "An account has already been created for this application. Please sign in.",
        action: { label: "Sign In", href: "/login?next=/judge/dashboard" },
      },
      not_verified: {
        title: "Email Not Verified",
        message: "Please verify your email first. Check your inbox for the verification link.",
        action: { label: "Check Application Status", href: "/judge/status" },
      },
      rejected: {
        title: "Application Not Approved",
        message: "Unfortunately, your application was not approved at this time.",
        action: { label: "Contact Support", href: "/contact" },
      },
      fetch_error: {
        title: "Something Went Wrong",
        message: "Failed to verify your application. Please try again.",
        action: { label: "Try Again", href: "/judge/status" },
      },
    };

    const errorKey = error.startsWith("unknown_status") ? "fetch_error" : error;
    const config = errorConfig[errorKey] || errorConfig.fetch_error;

    return (
      <>
        <Helmet>
          <title>Judge Account Setup | NESA-Africa</title>
        </Helmet>
        <div className="min-h-screen bg-charcoal flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-white/10 bg-charcoal-light">
            <CardContent className="py-8 text-center">
              <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">{config.title}</h3>
              <p className="text-white/60 mb-6">{config.message}</p>
              
              <div className="flex flex-col gap-2">
                <Button asChild className="bg-gold hover:bg-gold-dark text-charcoal">
                  <Link to={config.action.href}>
                    {config.action.label}
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
        <title>Create Judge Account | NESA-Africa</title>
      </Helmet>

      <div className="min-h-screen bg-charcoal flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-gold/20 bg-charcoal-light">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gold/20 flex items-center justify-center">
              <Gavel className="h-8 w-8 text-gold" />
            </div>
            <CardTitle className="text-2xl text-white">Judge Account Setup</CardTitle>
            <CardDescription className="text-white/70">
              Create your account to access the Judges Arena
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Application Info */}
            <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-4">
              <div className="flex items-center gap-2 text-green-400 mb-2">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Application Approved</span>
              </div>
              <div className="text-sm text-white/70 space-y-1">
                <p><strong>Name:</strong> {application?.full_name}</p>
                <p><strong>Email:</strong> {application?.email}</p>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Email (readonly) */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Email Address</label>
                  <div className="relative">
                    <Input 
                      type="email"
                      value={application?.email || ""}
                      readOnly
                      className="bg-white/5 border-white/10 text-white/60 pl-10"
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                  </div>
                  <p className="text-xs text-white/50">This email is linked to your approved application</p>
                </div>

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Create Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter a secure password" 
                            className="bg-white/5 border-white/10 text-white pl-10 pr-10"
                            {...field} 
                          />
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password" 
                            className="bg-white/5 border-white/10 text-white pl-10 pr-10"
                            {...field} 
                          />
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full bg-gold hover:bg-gold-dark text-charcoal font-semibold"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-5 w-5" />
                      Create Account
                    </>
                  )}
                </Button>
              </form>
            </Form>

            <p className="text-center text-sm text-white/50">
              Already have an account?{" "}
              <Link to="/login" className="text-gold hover:underline">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
