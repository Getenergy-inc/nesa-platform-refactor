import { WALLET_SHORT_DISCLAIMER } from "@/config/walletBranding";

/** Wallet payment-only notice. Rendered wherever the wallet is described. */
export function AGCDisclaimer() {
  return (
    <div className="bg-warning/10 border border-warning/30 rounded-lg p-3 text-center">
      <p className="text-sm text-warning font-medium">⚠️ {WALLET_SHORT_DISCLAIMER}</p>
    </div>
  );
}
