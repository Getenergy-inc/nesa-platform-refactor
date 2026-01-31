import gfaWalletLogo from "@/assets/gfa-wallet-logo.jpg";

interface GFAWalletIconProps {
  size?: number;
  className?: string;
}

export function GFAWalletIcon({ size = 24, className = "" }: GFAWalletIconProps) {
  return (
    <img
      src={gfaWalletLogo}
      alt="GFA Wallet"
      width={size}
      height={size}
      className={`rounded object-contain ${className}`}
    />
  );
}

export default GFAWalletIcon;
