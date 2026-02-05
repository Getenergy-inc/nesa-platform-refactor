import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ClaimMethodCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
  variant?: "default" | "gold";
  delay?: number;
}

export function ClaimMethodCard({ 
  icon, 
  title, 
  description, 
  children, 
  variant = "default",
  delay = 0 
}: ClaimMethodCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
    >
      <Card className={cn(
        "relative overflow-hidden transition-all duration-300 hover:shadow-xl",
        "border-2 hover:border-primary/30",
        variant === "gold" && "border-gold/30 bg-gradient-to-br from-gold/5 to-transparent"
      )}>
        {/* Decorative corner accent */}
        <div className={cn(
          "absolute top-0 right-0 w-24 h-24 -mr-12 -mt-12 rounded-full opacity-10",
          variant === "gold" ? "bg-gold" : "bg-primary"
        )} />
        
        <CardHeader className="relative">
          <div className="flex items-start gap-4">
            <motion.div 
              className={cn(
                "p-3 rounded-xl shadow-lg",
                variant === "gold" 
                  ? "bg-gradient-to-br from-gold to-gold-dark text-charcoal" 
                  : "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground"
              )}
              whileHover={{ scale: 1.05, rotate: 3 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              {icon}
            </motion.div>
            <div className="flex-1">
              <CardTitle className="text-lg font-display">{title}</CardTitle>
              <CardDescription className="mt-1">{description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative">
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
}
