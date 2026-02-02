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

  // Verify the application exists and is approved
  useEffect(() => {
    async function verifyApplication() {
      if (!email) {
        setError("No email provided. Please start from the application status page.");
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
          setError("No application found with this email. Please apply first.");
        } else if (data.status === "account_created" || data.status === "onboarded") {
          setError("An account has already been created for this application. Please sign in.");
        } else if (data.status !== "approved") {
          setError(`Your application status is "${data.status}". Only approved applications can create accounts.`);
        } else {
          setApplication(data as ApplicationData);
        }
      } catch (err: any) {
        console.error("Error verifying application:", err);
        setError("Failed to verify your application. Please try again.");
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

      toast.success("Account created successfully! Please check your email to verify.");
      
      // Redirect to login or dashboard
      navigate("/login?from=judge-signup");

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
    return (
      <>
        <Helmet>
          <title>Judge Account Setup | NESA-Africa</title>
        </Helmet>
        <div className="min-h-screen bg-charcoal flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-white/10 bg-charcoal-light">
            <CardContent className="py-8 text-center">
              <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Cannot Create Account</h3>
              <p className="text-white/60 mb-6">{error}</p>
              
              <div className="flex flex-col gap-2">
                {error.includes("sign in") ? (
                  <Button asChild className="bg-gold hover:bg-gold-dark text-charcoal">
                    <Link to="/login">
                      Sign In
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                ) : error.includes("apply") ? (
                  <Button asChild className="bg-gold hover:bg-gold-dark text-charcoal">
                    <Link to="/judge/apply">
                      Apply Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                ) : (
                  <Button asChild className="bg-gold hover:bg-gold-dark text-charcoal">
                    <Link to="/judge/status">
                      Check Application Status
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                )}
                
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
