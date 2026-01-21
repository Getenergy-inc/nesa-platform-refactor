import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Users, Vote, Trophy, ArrowRight, Star, Globe, Calendar } from "lucide-react";

export default function Index() {
  const stats = [
    { label: "Countries", value: "54", icon: Globe },
    { label: "Categories", value: "10+", icon: Award },
    { label: "Nominees", value: "500+", icon: Users },
    { label: "Years", value: "9", icon: Calendar },
  ];

  const categories = [
    { name: "Music", icon: "🎵" },
    { name: "Film & TV", icon: "🎬" },
    { name: "Sports", icon: "⚽" },
    { name: "Business", icon: "💼" },
    { name: "Technology", icon: "💻" },
    { name: "Arts & Culture", icon: "🎨" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-gold">
              <Award className="h-5 w-5 text-secondary" />
            </div>
            <span className="font-display text-xl font-bold">NESA Africa</span>
          </Link>
          <div className="hidden items-center gap-6 md:flex">
            <Link to="/categories" className="text-sm font-medium text-muted-foreground hover:text-foreground">Categories</Link>
            <Link to="/nominees" className="text-sm font-medium text-muted-foreground hover:text-foreground">Nominees</Link>
            <Link to="/vote" className="text-sm font-medium text-muted-foreground hover:text-foreground">Vote</Link>
            <Link to="/media" className="text-sm font-medium text-muted-foreground hover:text-foreground">Media</Link>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild><Link to="/login">Sign In</Link></Button>
            <Button className="bg-gradient-gold text-secondary font-semibold" asChild>
              <Link to="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen bg-secondary pt-16 overflow-hidden">
        <div className="absolute inset-0 pattern-african opacity-30" />
        <div className="container relative z-10 flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-20 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2">
            <Star className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Nominations Now Open for 2025</span>
          </div>
          <h1 className="mb-6 max-w-4xl font-display text-5xl font-bold leading-tight text-secondary-foreground md:text-7xl">
            Celebrating
            <span className="text-gradient-gold"> African Excellence</span>
          </h1>
          <p className="mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl">
            The premier platform recognizing outstanding achievements across Africa. 
            Nominate, vote, and celebrate the extraordinary individuals shaping our continent.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button size="lg" className="bg-gradient-gold text-secondary font-semibold shadow-gold hover:opacity-90" asChild>
              <Link to="/nominate">
                Nominate Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-border bg-transparent text-secondary-foreground hover:bg-muted" asChild>
              <Link to="/categories">Explore Categories</Link>
            </Button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.label} className="border-0 bg-muted/50 text-center">
                <CardContent className="pt-6">
                  <stat.icon className="mx-auto mb-3 h-8 w-8 text-primary" />
                  <div className="font-display text-3xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-display text-3xl font-bold md:text-4xl">Award Categories</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Excellence recognized across diverse fields that drive Africa's growth and global influence.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {categories.map((cat) => (
              <Card key={cat.name} className="group cursor-pointer border-border/50 transition-all hover:border-primary hover:shadow-lg">
                <CardContent className="flex flex-col items-center py-8 text-center">
                  <span className="mb-3 text-4xl">{cat.icon}</span>
                  <span className="font-medium text-foreground group-hover:text-primary">{cat.name}</span>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button variant="outline" asChild>
              <Link to="/categories">View All Categories <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-secondary">
        <div className="container text-center">
          <div className="mx-auto max-w-2xl">
            <Trophy className="mx-auto mb-6 h-16 w-16 text-primary" />
            <h2 className="mb-4 font-display text-3xl font-bold text-secondary-foreground md:text-4xl">
              Ready to Celebrate Excellence?
            </h2>
            <p className="mb-8 text-muted-foreground">
              Join thousands of Africans in recognizing the remarkable achievements that shape our continent's future.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" className="bg-gradient-gold text-secondary font-semibold" asChild>
                <Link to="/register">Create Account</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-border text-secondary-foreground" asChild>
                <Link to="/nominate">Submit Nomination</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background py-12">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-gold">
                <Award className="h-4 w-4 text-secondary" />
              </div>
              <span className="font-display font-bold">NESA Africa</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 NESA Africa. Celebrating African Excellence.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
