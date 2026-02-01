import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface NotifyMeFormProps {
  title?: string;
  description?: string;
  eventType?: "voting" | "nominations" | "results";
}

export function NotifyMeForm({ 
  title = "Get Notified",
  description = "Enter your email to be notified when this opens.",
  eventType = "voting"
}: NotifyMeFormProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    
    // Mock API call - in production, this would call a backend endpoint
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    toast.success("You'll be notified when voting opens!");
  };

  if (isSubmitted) {
    return (
      <Card className="border-success/30 bg-success/5">
        <CardContent className="flex flex-col items-center py-6">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-success/10 mb-3">
            <Check className="h-6 w-6 text-success" />
          </div>
          <p className="font-medium text-success">You're on the list!</p>
          <p className="text-sm text-muted-foreground mt-1">
            We'll email you when {eventType} opens.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/30">
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Bell className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
            disabled={isSubmitting}
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Bell className="mr-2 h-4 w-4" />
                Notify Me
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
