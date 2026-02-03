import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface PageIntroProps {
  /** Page badge/label (e.g., "NESA 2025") */
  badge?: string;
  /** Badge icon component */
  BadgeIcon?: LucideIcon;
  /** H1 page title */
  title: string;
  /** Highlighted part of title (will be gold colored) */
  titleHighlight?: string;
  /** 2-3 sentence description */
  description: string;
  /** Additional className for container */
  className?: string;
  /** Center align (default) or left align */
  align?: "center" | "left";
  /** Children rendered below description */
  children?: React.ReactNode;
}

/**
 * PageIntro - Consistent page header with single H1 and intro
 * 
 * Used to ensure every page has exactly ONE H1 and a unique intro.
 */
export function PageIntro({
  badge,
  BadgeIcon,
  title,
  titleHighlight,
  description,
  className,
  align = "center",
  children,
}: PageIntroProps) {
  // If titleHighlight is provided, split the title around it
  const renderTitle = () => {
    if (!titleHighlight) {
      return <>{title}</>;
    }
    
    const parts = title.split(titleHighlight);
    if (parts.length === 1) {
      return <>{title}</>;
    }
    
    return (
      <>
        {parts[0]}
        <span className="text-gold">{titleHighlight}</span>
        {parts[1]}
      </>
    );
  };

  return (
    <div
      className={cn(
        "mb-8",
        align === "center" && "text-center",
        className
      )}
    >
      {badge && (
        <Badge
          className={cn(
            "mb-4 bg-primary/10 text-primary border-primary/20",
            BadgeIcon && "gap-1"
          )}
        >
          {BadgeIcon && <BadgeIcon className="h-3 w-3" />}
          {badge}
        </Badge>
      )}
      
      <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
        {renderTitle()}
      </h1>
      
      <p
        className={cn(
          "text-muted-foreground text-lg",
          align === "center" && "mx-auto max-w-2xl"
        )}
      >
        {description}
      </p>
      
      {children}
    </div>
  );
}

export default PageIntro;
