// GFAwzip Wallet widget for Friends of EduAid-Africa.
//
// Uses the existing real payment flow (initPayment + paymentProgram), the same
// one /donate uses. Programme is pre-set to "friends-of-eduaid-africa".
// Purchase reuses the existing shop/ticket surfaces — no fabricated checkout.

import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { ArrowRight, HeartHandshake, Loader2, ShoppingBag, Handshake } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { initPayment } from "@/api/payments";
import { paymentProgram, WALLET_NAME } from "@/config/walletBranding";
import { AGCDisclaimer } from "@/components/gfawzip/AGCDisclaimer";

const PROGRAMME_SLUG = "friends_of_eduaid_africa";

const DONATE_AMOUNTS = [10, 25, 50, 100];
const SPONSOR_AMOUNTS = [250, 500, 1000, 2500];

function AmountPad({
  amounts,
  value,
  onChange,
}: {
  amounts: number[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {amounts.map((a) => (
        <button
          key={a}
          type="button"
          onClick={() => onChange(String(a))}
          className={`rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${
            value === String(a)
              ? "border-gold bg-gold text-charcoal"
              : "border-white/15 text-white/75 hover:border-gold/50"
          }`}
        >
          ${a}
        </button>
      ))}
    </div>
  );
}

export default function FriendsWalletWidget() {
  const [donateAmount, setDonateAmount] = useState("25");
  const [sponsorAmount, setSponsorAmount] = useState("500");
  const [custom, setCustom] = useState("");
  const [pending, setPending] = useState<string | null>(null);

  const start = async (intent: "donation" | "sponsorship", amount: number) => {
    if (!amount || amount < 1) {
      toast.error("Enter an amount of at least $1.");
      return;
    }
    setPending(intent);
    try {
      const { data, error } = await initPayment(
        amount,
        paymentProgram("eduaid", PROGRAMME_SLUG),
        "USD",
        {
          destination: "eduaid",
          programme: "friends-of-eduaid-africa",
          intent,
          wallet: WALLET_NAME,
        },
      );

      if (error || !data?.success) {
        toast.error(error || "We could not start that payment. Please try again.");
        return;
      }
      if (data.payment_url) {
        window.location.href = data.payment_url;
        return;
      }
      toast.success(
        data.message || "Recorded. A receipt will be sent once payment is confirmed.",
      );
    } catch (e) {
      console.error("Friends payment init failed", e);
      toast.error("We could not start that payment. Please try again.");
    } finally {
      setPending(null);
    }
  };

  return (
    <section className="bg-charcoal text-white px-4 pb-12" aria-labelledby="friends-wallet">
      <div className="max-w-6xl mx-auto rounded-2xl border border-gold/25 bg-white/[0.03] p-6 md:p-8">
        <h2 id="friends-wallet" className="font-playfair text-2xl font-bold text-gold">
          Support through the {WALLET_NAME}
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-white/65">
          Every contribution made here is received by EduAid-Africa under Santos Creations
          Educational Foundation, against the programme code{" "}
          <span className="text-gold/80">friends-of-eduaid-africa</span>. A receipt is issued for
          every successful transaction.
        </p>

        <Tabs defaultValue="donate" className="mt-6">
          <TabsList className="bg-white/5">
            <TabsTrigger value="donate">Donate</TabsTrigger>
            <TabsTrigger value="sponsor">Sponsor</TabsTrigger>
            <TabsTrigger value="purchase">Purchase</TabsTrigger>
          </TabsList>

          <TabsContent value="donate" className="mt-5">
            <AmountPad amounts={DONATE_AMOUNTS} value={custom ? "" : donateAmount} onChange={(v) => { setCustom(""); setDonateAmount(v); }} />
            <input
              type="number"
              min={1}
              inputMode="decimal"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              placeholder="Other amount (USD)"
              aria-label="Custom donation amount in US dollars"
              className="mt-3 w-full rounded-lg border border-white/15 bg-transparent px-4 py-2.5 text-sm text-white placeholder:text-white/35 focus:border-gold focus:outline-none"
            />
            <button
              type="button"
              disabled={pending === "donation"}
              onClick={() => start("donation", Number(custom || donateAmount))}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-charcoal hover:bg-gold/90 disabled:opacity-60"
            >
              {pending === "donation" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <HeartHandshake className="h-4 w-4" />
              )}
              Donate now
            </button>
          </TabsContent>

          <TabsContent value="sponsor" className="mt-5">
            <p className="mb-3 text-sm text-white/60">
              Organisational and individual sponsorship of verified education interventions.
            </p>
            <AmountPad amounts={SPONSOR_AMOUNTS} value={custom ? "" : sponsorAmount} onChange={(v) => { setCustom(""); setSponsorAmount(v); }} />
            <input
              type="number"
              min={1}
              inputMode="decimal"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              placeholder="Other amount (USD)"
              aria-label="Custom sponsorship amount in US dollars"
              className="mt-3 w-full rounded-lg border border-white/15 bg-transparent px-4 py-2.5 text-sm text-white placeholder:text-white/35 focus:border-gold focus:outline-none"
            />
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                disabled={pending === "sponsorship"}
                onClick={() => start("sponsorship", Number(custom || sponsorAmount))}
                className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-charcoal hover:bg-gold/90 disabled:opacity-60"
              >
                {pending === "sponsorship" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Handshake className="h-4 w-4" />
                )}
                Sponsor now
              </button>
              <Link
                to="/sponsorship-packages"
                className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-6 py-3 text-sm font-semibold text-gold hover:bg-gold/10"
              >
                View sponsorship packages <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="purchase" className="mt-5">
            <p className="mb-4 text-sm text-white/60">
              Purchases run through the existing NESA-Africa store and gala ticketing checkout.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-charcoal hover:bg-gold/90"
              >
                <ShoppingBag className="h-4 w-4" /> Visit the store
              </Link>
              <Link
                to="/tickets"
                className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-6 py-3 text-sm font-semibold text-gold hover:bg-gold/10"
              >
                Gala tickets <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <AGCDisclaimer />
        </div>
        <p className="mt-3 text-xs text-white/45">
          Funding never influences NESA-Africa nomination, judging or recognition outcomes.
        </p>
      </div>
    </section>
  );
}
