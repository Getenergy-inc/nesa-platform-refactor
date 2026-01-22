import { Globe, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function NESAHeader() {
  return (
    <header className="sticky top-0 z-50 w-full bg-secondary border-b border-primary/10">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="h-10 w-24 bg-white/90 rounded flex items-center justify-center text-secondary font-bold text-xs">
            SCEF LOGO
          </div>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 text-secondary-foreground/80 hover:text-secondary-foreground transition-colors">
            <Globe className="h-4 w-4" />
            <span className="text-sm font-medium">English</span>
          </button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-secondary-foreground/80 hover:text-secondary-foreground hover:bg-secondary/80">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-secondary border-primary/20 text-secondary-foreground">
              <nav className="flex flex-col gap-4 mt-8">
                <Link to="/" className="text-lg font-medium hover:text-primary transition-colors">Home</Link>
                <Link to="/programs" className="text-lg font-medium hover:text-primary transition-colors">Programs</Link>
                <Link to="/categories" className="text-lg font-medium hover:text-primary transition-colors">Categories</Link>
                <Link to="/nominate" className="text-lg font-medium hover:text-primary transition-colors">Nominate</Link>
                <Link to="/login" className="text-lg font-medium hover:text-primary transition-colors">Sign In</Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
