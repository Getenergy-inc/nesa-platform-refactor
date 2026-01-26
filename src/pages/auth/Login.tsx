import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Award, Mail, Lock, Home, Trophy, Users, Play } from "lucide-react";
import { NESALogo } from "@/components/nesa/NESALogo";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signIn(email, password);
      toast.success("Welcome back to NESA Africa!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-hero pattern-african">
      {/* Navigation Header */}
      <header className="absolute top-0 left-0 right-0 z-50 px-4 py-4">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-white/90 hover:text-gold transition-colors">
            <NESALogo variant="icon" size="sm" />
            <span className="font-display text-lg hidden sm:inline">NESA-Africa</span>
          </Link>
          <nav className="flex items-center gap-1 sm:gap-2">
            <Button variant="ghost" size="sm" asChild className="text-white/70 hover:text-gold hover:bg-white/10">
              <Link to="/" className="flex items-center gap-1.5">
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline text-sm">Home</span>
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild className="text-white/70 hover:text-gold hover:bg-white/10">
              <Link to="/categories" className="flex items-center gap-1.5">
                <Trophy className="h-4 w-4" />
                <span className="hidden sm:inline text-sm">Categories</span>
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild className="text-white/70 hover:text-gold hover:bg-white/10">
              <Link to="/nominees" className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline text-sm">Nominees</span>
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild className="text-white/70 hover:text-gold hover:bg-white/10">
              <Link to="/media/tv" className="flex items-center gap-1.5">
                <Play className="h-4 w-4" />
                <span className="hidden sm:inline text-sm">Watch</span>
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <div className="flex min-h-screen items-center justify-center px-4 py-20">
        <Card className="w-full max-w-md border-0 shadow-2xl">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-gold shadow-gold">
            <Award className="h-8 w-8 text-secondary" />
          </div>
          <CardTitle className="font-display text-2xl">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to continue celebrating African excellence
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full bg-gradient-gold text-secondary font-semibold hover:opacity-90 shadow-gold"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/register" className="font-medium text-primary hover:underline">
                Create one
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 px-4 py-4">
        <div className="mx-auto max-w-7xl flex items-center justify-center gap-4 text-white/50 text-xs">
          <Link to="/about" className="hover:text-gold transition-colors">About</Link>
          <span>•</span>
          <Link to="/contact" className="hover:text-gold transition-colors">Contact</Link>
          <span>•</span>
          <Link to="/policies" className="hover:text-gold transition-colors">Policies</Link>
        </div>
      </footer>
    </div>
  );
}
