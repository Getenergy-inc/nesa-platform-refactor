import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Lock, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import nesaStamp from "@/assets/nesa-stamp.jpeg";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null);

  useEffect(() => {
    // Check for recovery type in URL hash
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const type = hashParams.get("type");
    
    if (type === "recovery") {
      setIsValidSession(true);
    } else {
      // Also check if user has an active session (already clicked the link)
      supabase.auth.getSession().then(({ data: { session } }) => {
        setIsValidSession(!!session);
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      setSuccess(true);
      toast.success("Password updated successfully!");
      
      setTimeout(() => navigate("/login"), 3000);
    } catch (error: any) {
      toast.error(error.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Reset Password | NESA-Africa</title>
      </Helmet>
      <div className="min-h-screen bg-charcoal flex flex-col items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Link to="/">
            <img src={nesaStamp} alt="NESA Africa" className="h-14 w-14 rounded-full object-contain" />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-md"
        >
          <Card className="border-white/10 bg-charcoal-light shadow-2xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="font-display text-2xl text-white">
                {success ? "Password Updated" : "Set New Password"}
              </CardTitle>
              <CardDescription className="text-white/60">
                {success
                  ? "Your password has been reset. Redirecting to sign in..."
                  : "Choose a strong password for your account."}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              {isValidSession === false ? (
                <div className="text-center space-y-4">
                  <div className="mx-auto h-16 w-16 rounded-full bg-destructive/20 flex items-center justify-center">
                    <AlertCircle className="h-8 w-8 text-destructive" />
                  </div>
                  <p className="text-white/70 text-sm">
                    This reset link is invalid or has expired. Please request a new one.
                  </p>
                  <Button asChild className="bg-gold hover:bg-gold-dark text-charcoal">
                    <Link to="/forgot-password">Request New Link</Link>
                  </Button>
                </div>
              ) : success ? (
                <div className="text-center space-y-4">
                  <div className="mx-auto h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-green-400" />
                  </div>
                  <p className="text-white/70 text-sm">
                    You'll be redirected to the login page in a few seconds.
                  </p>
                  <Button asChild variant="ghost" className="text-gold hover:text-gold-dark hover:bg-gold/10">
                    <Link to="/login">Go to Sign In</Link>
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white/80">New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="At least 8 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={8}
                        className="pl-10 bg-white/5 border-white/15 text-white placeholder:text-white/30 focus:border-gold/50"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-white/80">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Re-enter your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="pl-10 bg-white/5 border-white/15 text-white placeholder:text-white/30 focus:border-gold/50"
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gold hover:bg-gold-dark text-charcoal font-semibold h-11"
                    disabled={loading}
                  >
                    {loading ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...</>
                    ) : (
                      "Update Password"
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
}
