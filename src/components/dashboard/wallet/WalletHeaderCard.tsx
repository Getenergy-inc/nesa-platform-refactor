import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { GFAWalletIcon } from "@/components/ui/GFAWalletIcon";
import { useAuth } from "@/contexts/AuthContext";

interface WalletHeaderCardProps {
  loading?: boolean;
}

export function WalletHeaderCard({ loading }: WalletHeaderCardProps) {
  const { user } = useAuth();

  if (loading) {
    return (
      <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-primary/20">
        <CardContent className="flex items-center gap-4 p-6">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const initials = user?.email
    ? user.email.substring(0, 2).toUpperCase()
    : "U";

  return (
    <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-primary/20">
      <CardContent className="flex items-center gap-4 p-6">
        <Avatar className="h-16 w-16 border-2 border-primary/30">
          <AvatarImage src={undefined} alt="User avatar" />
          <AvatarFallback className="bg-primary/20 text-primary text-lg font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <GFAWalletIcon size={24} />
            <h2 className="font-display text-xl font-bold">GFA Wallet for NESA-Africa</h2>
          </div>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
      </CardContent>
    </Card>
  );
}
