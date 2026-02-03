import * as React from "react";
import gfaWalletLogo from "@/assets/gfa-wallet-logo.jpg";

interface GFAWalletIconProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  size?: number;
}

const GFAWalletIcon = React.forwardRef<HTMLImageElement, GFAWalletIconProps>(
  ({ size = 24, className = "", ...props }, ref) => {
    return (
      <img
        ref={ref}
        src={gfaWalletLogo}
        alt="GFA Wallet"
        width={size}
        height={size}
        className={`rounded object-contain ${className}`}
        {...props}
      />
    );
  }
);
GFAWalletIcon.displayName = "GFAWalletIcon";

export { GFAWalletIcon };
export default GFAWalletIcon;
