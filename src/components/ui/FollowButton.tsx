import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWatchlist, type WatchlistItem } from "@/hooks/useWatchlist";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FollowButtonProps {
  item: Omit<WatchlistItem, "addedAt">;
  variant?: "default" | "icon" | "outline";
  size?: "sm" | "default" | "lg";
  className?: string;
}

/**
 * FollowButton - Add/remove items from watchlist
 * 
 * Reusable button component for following nominees, awards, or categories.
 */
export function FollowButton({ item, variant = "outline", size = "default", className }: FollowButtonProps) {
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const isFollowing = isInWatchlist(item.id, item.type);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const nowFollowing = toggleWatchlist(item);
    
    if (nowFollowing) {
      toast.success(`Following ${item.name}`, {
        description: "You'll see updates in your watchlist",
      });
    } else {
      toast.info(`Unfollowed ${item.name}`);
    }
  };

  if (variant === "icon") {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={handleClick}
        className={cn(
          "transition-all",
          isFollowing 
            ? "text-red-400 hover:text-red-300" 
            : "text-white/40 hover:text-red-400",
          className
        )}
        aria-label={isFollowing ? `Unfollow ${item.name}` : `Follow ${item.name}`}
      >
        <Heart className={cn("h-5 w-5", isFollowing && "fill-current")} />
      </Button>
    );
  }

  return (
    <Button
      variant={variant === "default" ? "default" : "outline"}
      size={size}
      onClick={handleClick}
      className={cn(
        "gap-2",
        isFollowing
          ? "bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30"
          : "border-gold/30 text-gold hover:bg-gold/10",
        className
      )}
    >
      <Heart className={cn("h-4 w-4", isFollowing && "fill-current")} />
      {isFollowing ? "Following" : "Follow"}
    </Button>
  );
}

export default FollowButton;
