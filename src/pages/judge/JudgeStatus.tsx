import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Gavel, 
  Search, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Mail,
  UserPlus,
  Loader2,
  ArrowRight,
  AlertCircle,
  RefreshCw
} from "lucide-react";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type FormData = z.infer<typeof formSchema>;

interface ApplicationStatus {
  id: string;
  full_name: string;
  email: string;
  status: string;
  created_at: string;
  verified_at: string | null;
  approved_at: string | null;
  rejected_at: string | null;
  rejection_reason: string | null;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ComponentType<any>; description: string }> = {
  submitted: {
    label: "Submitted",
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    icon: Mail,
    description: "Your application has been received. Please check your email and verify your email address to proceed.",
  },
  email_verified: {
    label: "Email Verified",
    color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    icon: CheckCircle,
    description: "Your email has been verified. You can now create your judge account to proceed.",
  },
  under_review: {
    label: "Under Review",
    color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    icon: Clock,
    description: "Our review committee is currently evaluating your application. This typically takes 5-7 business days.",
  },
  approved: {
    label: "Approved",
    color: "bg-green-500/20 text-green-400 border-green-500/30",
    icon: CheckCircle,
    description: "Congratulations! Your application has been approved. You can now create your judge account.",
  },
  account_created: {
    label: "Account Created",
    color: "bg-green-500/20 text-green-400 border-green-500/30",
    icon: UserPlus,
    description: "Your judge account has been created. You can now sign in to access the Judges Arena.",
  },
  onboarded: {
    label: "Onboarded",
    color: "bg-gold/20 text-gold border-gold/30",
    icon: Gavel,
    description: "You are a fully onboarded NESA-Africa Judge. Access your dashboard to begin scoring.",
  },
  rejected: {
    label: "Not Selected",
    color: "bg-red-500/20 text-red-400 border-red-500/30",
    icon: XCircle,
    description: "Unfortunately, we were unable to approve your application at this time.",
  },
};

export default function JudgeStatus() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isSearching, setIsSearching] = useState(false);
  const [application, setApplication] = useState<ApplicationStatus | null>(null);
  const [notFound, setNotFound] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: searchParams.get("email") || "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSearching(true);
    setApplication(null);
    setNotFound(false);

    try {
      const { data: app, error } = await supabase
        .from("judge_applications")
        .select("id, full_name, email, status, created_at, verified_at, approved_at, rejected_at, rejection_reason")
        .eq("email", data.email.toLowerCase())
        .maybeSingle();

      if (error) throw error;

      if (!app) {
        setNotFound(true);
      } else {
        setApplication(app as ApplicationStatus);
      }
    } catch (error: any) {
      console.error("Error fetching application:", error);
      toast.error("Failed to check application status");
    } finally {
      setIsSearching(false);
    }
  };

  const statusInfo = application ? STATUS_CONFIG[application.status] || STATUS_CONFIG.submitted : null;
  const StatusIcon = statusInfo?.icon || Clock;

  return (
    <>
      <Helmet>
        <title>Check Application Status | NESA-Africa Judges</title>
      </Helmet>

      <div className="min-h-screen bg-charcoal py-12">
        <div className="container max-w-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 mb-4">
              <Gavel className="h-4 w-4 text-gold" />
              <span className="text-sm font-medium text-gold">Application Status</span>
            </div>
            <h1 className="font-display text-3xl font-bold text-white mb-3">
              Check Your <span className="text-gold">Status</span>
            </h1>
            <p className="text-white/70">
              Enter your email address to check the status of your judge application.
            </p>
          </div>

          {/* Search Form */}
          <Card className="border-white/10 bg-white/5 mb-6">
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Email Address</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type="email"
                              placeholder="Enter the email you applied with" 
                              className="bg-white/5 border-white/10 text-white pr-12"
                              {...field} 
                            />
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    disabled={isSearching}
                    className="w-full bg-gold hover:bg-gold-dark text-charcoal font-semibold"
                  >
                    {isSearching ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Checking...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Check Status
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Not Found */}
          {notFound && (
            <Card className="border-white/10 bg-white/5">
              <CardContent className="py-8 text-center">
                <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No Application Found</h3>
                <p className="text-white/60 mb-4">
                  We couldn't find an application with that email address.
                </p>
                  <Button asChild className="bg-gold hover:bg-gold-dark text-charcoal">
                  <Link to="/judgeapply">
                    Apply Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Application Status */}
          {application && statusInfo && (
            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">{application.full_name}</CardTitle>
                    <CardDescription className="text-white/60">{application.email}</CardDescription>
                  </div>
                  <Badge className={`${statusInfo.color} border`}>
                    <StatusIcon className="mr-1 h-3 w-3" />
                    {statusInfo.label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-white/5 border border-white/10 p-4">
                  <StatusIcon className="h-8 w-8 text-gold mb-3" />
                  <p className="text-white/80">{statusInfo.description}</p>
                  
                  {application.status === "rejected" && application.rejection_reason && (
                    <div className="mt-3 p-3 rounded bg-red-500/10 border border-red-500/20">
                      <p className="text-sm text-red-400">
                        <strong>Reason:</strong> {application.rejection_reason}
                      </p>
                    </div>
                  )}
                </div>

                {/* Timeline */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-white/60">
                    <Clock className="h-4 w-4" />
                    Applied: {new Date(application.created_at).toLocaleDateString()}
                  </div>
                  {application.verified_at && (
                    <div className="flex items-center gap-2 text-white/60">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Verified: {new Date(application.verified_at).toLocaleDateString()}
                    </div>
                  )}
                  {application.approved_at && (
                    <div className="flex items-center gap-2 text-white/60">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Approved: {new Date(application.approved_at).toLocaleDateString()}
                    </div>
                  )}
                </div>

                {/* CTAs based on status */}
                <div className="pt-4 space-y-2">
                  {application.status === "submitted" && (
                    <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <p className="text-sm text-blue-400">
                        <strong>Action needed:</strong> Check your email for the verification link. 
                        If you didn't receive it, check your spam folder.
                      </p>
                    </div>
                  )}

                  {(application.status === "approved" || application.status === "email_verified") && (
                    <Button 
                      asChild 
                      className="w-full bg-gold hover:bg-gold-dark text-charcoal font-semibold"
                    >
                      <Link to={`/judge-signup?email=${encodeURIComponent(application.email)}`}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Create Your Judge Account
                      </Link>
                    </Button>
                  )}

                  {(application.status === "account_created" || application.status === "onboarded") && (
                    <Button 
                      asChild 
                      className="w-full bg-gold hover:bg-gold-dark text-charcoal font-semibold"
                    >
                      <Link to="/login?next=/judge/dashboard">
                        Sign In to Judges Arena
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  )}

                  <Button 
                    variant="outline" 
                    className="w-full border-white/20 text-white hover:bg-white/10"
                    onClick={() => {
                      setApplication(null);
                      form.reset();
                    }}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Check Another Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Help text */}
          <div className="mt-6 text-center text-sm text-white/50">
            <p>
              Need help? Contact us at{" "}
              <a href="mailto:judges@nesa.africa" className="text-gold hover:underline">
                judges@nesa.africa
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
