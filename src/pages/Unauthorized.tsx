import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldX, Home } from "lucide-react";

export default function Unauthorized() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-hero px-4">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
          <ShieldX className="h-10 w-10 text-destructive" />
        </div>
        <h1 className="mb-2 font-display text-3xl font-bold text-secondary-foreground">
          Access Denied
        </h1>
        <p className="mb-8 text-muted-foreground">
          You don't have permission to access this page.
        </p>
        <Button asChild className="bg-gradient-gold text-secondary">
          <Link to="/">
            <Home className="mr-2 h-4 w-4" />
            Return Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
