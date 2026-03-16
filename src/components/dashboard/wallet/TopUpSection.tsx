import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Plus, Zap, Shield, Coins } from "lucide-react";

interface TopUpSectionProps {
  onTopUp: () => void;
}

export function TopUpSection({ onTopUp }: TopUpSectionProps) {
  return (
    <Card className="relative overflow-hidden border border-amber-500/20 bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#141414] shadow-lg shadow-amber-900/20 backdrop-blur-sm">
      {/* Gold ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.25),transparent_60%)]" />

      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 2px 2px, rgba(255,215,0,0.4) 1px, transparent 0)",
          backgroundSize: "26px 26px",
        }}
      />

      <CardHeader className="relative pb-2">
        <CardTitle className="flex items-center gap-3 text-amber-300">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-md shadow-amber-500/40">
            <Zap className="h-4 w-4 text-black" />
          </div>

          <span className="text-lg font-semibold tracking-wide">
            Top Up Your Wallet
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="relative space-y-6">
        {/* Description */}
        <div className="bg-black/40 rounded-lg p-4 border border-white/5">
          <p className="text-sm text-amber-200/90 leading-relaxed">
            Add funds to your wallet and receive AGC coins instantly. Use AGC
            for nominations, voting, and other platform activities.
          </p>
        </div>

        {/* Main CTA */}
        <Button
          onClick={onTopUp}
          size="lg"
          className="w-full h-14 text-base font-semibold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black shadow-lg shadow-amber-500/30 rounded-xl transition-all duration-300 hover:scale-[1.02]"
        >
          <Plus className="h-5 w-5 mr-2" />
          Top Up Wallet
        </Button>

        {/* Benefits */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="flex items-start gap-3 bg-black/40 rounded-lg p-4 border border-white/5">
            <div className="h-9 w-9 rounded-full bg-emerald-500/15 flex items-center justify-center border border-emerald-500/20">
              <Zap className="h-4 w-4 text-emerald-400" />
            </div>

            <div>
              <p className="text-sm font-medium text-white">Instant</p>
              <p className="text-xs text-white/50">Coins delivered instantly</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-black/40 rounded-lg p-4 border border-white/5">
            <div className="h-9 w-9 rounded-full bg-amber-500/15 flex items-center justify-center border border-amber-500/20">
              <Shield className="h-4 w-4 text-amber-400" />
            </div>

            <div>
              <p className="text-sm font-medium text-white">Secure</p>
              <p className="text-xs text-white/50">
                Bank-grade transaction security
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-black/40 rounded-lg p-4 border border-white/5">
            <div className="h-9 w-9 rounded-full bg-blue-500/15 flex items-center justify-center border border-blue-500/20">
              <CreditCard className="h-4 w-4 text-blue-400" />
            </div>

            <div>
              <p className="text-sm font-medium text-white">Flexible</p>
              <p className="text-xs text-white/50">Multiple payment methods</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-black/40 rounded-lg p-4 border border-white/5">
            <div className="h-9 w-9 rounded-full bg-purple-500/15 flex items-center justify-center border border-purple-500/20">
              <Coins className="h-4 w-4 text-purple-400" />
            </div>

            <div>
              <p className="text-sm font-medium text-white">No Hidden Fees</p>
              <p className="text-xs text-white/50">Transparent pricing</p>
            </div>
          </div>
        </div>

        {/* Bonus */}
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-center">
          <p className="text-xs text-amber-300">
            🎉 <span className="font-semibold">New user?</span> Receive a{" "}
            <span className="font-semibold">10% AGC bonus</span> on your first
            top-up.
          </p>
        </div>

        {/* Footer */}
        <p className="text-[11px] text-center text-white/40 pt-2 border-t border-white/5">
          Multiple payment methods • Instant delivery • Secure transactions
        </p>
      </CardContent>
    </Card>
  );
}
