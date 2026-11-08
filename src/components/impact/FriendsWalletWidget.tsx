import { HeartHandshake } from "lucide-react";
import { ScefFormRequired } from "@/components/nesa/ContentRequired";

/** Public support enquiry state; no wallet, checkout or public AGC UI. */
export default function FriendsWalletWidget() {
  return (
    <section className="bg-charcoal px-4 pb-12 text-white" aria-labelledby="friends-support">
      <div className="mx-auto max-w-6xl rounded-2xl border border-gold/25 bg-white/[0.03] p-6 md:p-8">
        <HeartHandshake className="mb-4 h-8 w-8 text-gold" aria-hidden />
        <h2 id="friends-support" className="font-playfair text-2xl font-bold text-gold">
          Support Friends of EduAid-Africa
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-white/65">
          Donation and sponsorship enquiries are handled through SCEF's approved Google Forms.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <ScefFormRequired kind="donation" />
          <ScefFormRequired kind="sponsorship" />
        </div>
        <p className="mt-4 text-xs text-white/45">
          Funding never influences NESA-Africa nomination, judging or recognition outcomes.
        </p>
      </div>
    </section>
  );
}
