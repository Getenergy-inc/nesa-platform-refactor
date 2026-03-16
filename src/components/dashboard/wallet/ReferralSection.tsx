import { ReferralCard } from "@/components/dashboard/wallet";
import type { Referral } from "@/types/wallet";

interface ReferralSectionProps {
  referral: Referral | null;
  totalEarnings?: number;
  loading?: boolean;
}

export function ReferralSection({
  referral,
  totalEarnings = 0,
  loading,
}: ReferralSectionProps) {
  return (
    <ReferralCard
      referral={referral}
      totalEarnings={totalEarnings}
      loading={loading}
    />
  );
}
