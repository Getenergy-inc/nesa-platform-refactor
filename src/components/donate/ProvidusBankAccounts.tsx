import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  Building2,
  CheckCircle,
  Copy,
  FileText,
  Landmark,
  MessageCircle,
  Receipt,
  Shield,
  Upload,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  BANK_NAME,
  PAYMENT_PURPOSES,
  PROVIDUS_ACCOUNT_GROUPS,
  type ProvidusAccountGroup,
} from "@/config/providusAccounts";

const GROUP_ICONS: Record<ProvidusAccountGroup["id"], JSX.Element> = {
  scef: <Building2 className="h-5 w-5" />,
  eduaid: <BadgeCheck className="h-5 w-5" />,
  nesa: <Landmark className="h-5 w-5" />,
  gfa: <Wallet className="h-5 w-5" />,
};

const TRANSPARENCY_POINTS = [
  "Verified payment channels",
  "Official receipts",
  "Donor confirmation",
  "Sponsorship documentation",
  "Impact reporting",
  "CSR utilization reports",
  "ESG-aligned reporting",
  "BOT & governance oversight",
];

function copy(value: string, label: string) {
  navigator.clipboard?.writeText(value).then(
    () => toast.success(`${label} copied`, { description: value }),
    () => toast.error("Copy failed"),
  );
}

function AccountGroupCard({ group }: { group: ProvidusAccountGroup }) {
  return (
    <Card id={`pay-${group.id}`} className="border-gold/20 bg-white/[0.03] scroll-mt-24">
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="rounded-md bg-gold/10 p-2 text-gold">{GROUP_ICONS[group.id]}</span>
            <div>
              <CardTitle className="text-white text-lg">
                {group.shortName} · {BANK_NAME}
              </CardTitle>
              <p className="text-sm text-gold/90 mt-0.5">{group.legalName}</p>
            </div>
          </div>
          <Badge className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            <Shield className="h-3 w-3 mr-1" /> Verified Account
          </Badge>
        </div>
        <p className="text-sm text-white/70 mt-2">{group.description}</p>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Desktop table */}
        <div className="hidden md:block overflow-hidden rounded-lg border border-white/10">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-white/60">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Bank</th>
                <th className="px-3 py-2 text-left font-medium">Currency</th>
                <th className="px-3 py-2 text-left font-medium">Account Number</th>
                <th className="px-3 py-2 text-left font-medium">Purpose</th>
                <th className="px-3 py-2 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {group.accounts.map((a) => (
                <tr key={a.accountNumber} className="border-t border-white/10 text-white/85">
                  <td className="px-3 py-2">{BANK_NAME}</td>
                  <td className="px-3 py-2">{a.currencyLabel}</td>
                  <td className="px-3 py-2 font-mono tracking-wider">{a.accountNumber}</td>
                  <td className="px-3 py-2 text-white/70">{a.purpose}</td>
                  <td className="px-3 py-2 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gold/40 text-gold hover:bg-gold/10"
                      onClick={() => copy(a.accountNumber, `${group.shortName} ${a.currency}`)}
                    >
                      <Copy className="h-3.5 w-3.5 mr-1" /> Copy
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-2">
          {group.accounts.map((a) => (
            <div
              key={a.accountNumber}
              className="rounded-lg border border-white/10 bg-white/[0.02] p-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/60">{BANK_NAME}</span>
                <Badge variant="outline" className="border-gold/40 text-gold">
                  {a.currency}
                </Badge>
              </div>
              <p className="font-mono text-base text-white tracking-wider mt-1">
                {a.accountNumber}
              </p>
              <p className="text-xs text-white/60 mt-0.5">{a.purpose}</p>
              <Button
                size="sm"
                variant="outline"
                className="mt-2 w-full border-gold/40 text-gold hover:bg-gold/10"
                onClick={() => copy(a.accountNumber, `${group.shortName} ${a.currency}`)}
              >
                <Copy className="h-3.5 w-3.5 mr-1" /> Copy Account Number
              </Button>
            </div>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-white/[0.03] border border-white/10 p-4">
            <p className="text-sm font-semibold text-white mb-2">Recommended Use</p>
            <ul className="space-y-1.5">
              {group.recommendedUse.map((u) => (
                <li key={u} className="flex items-start gap-2 text-sm text-white/75">
                  <CheckCircle className="h-3.5 w-3.5 mt-0.5 shrink-0 text-gold" />
                  {u}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg bg-white/[0.03] border border-white/10 p-4">
            <p className="text-sm font-semibold text-white mb-2">Quick Actions</p>
            <div className="flex flex-wrap gap-2">
              {group.quickActions.map((q) =>
                q.to ? (
                  <Button
                    key={q.label}
                    asChild
                    size="sm"
                    variant="outline"
                    className="border-gold/30 text-gold hover:bg-gold/10"
                  >
                    <Link to={q.to}>{q.label}</Link>
                  </Button>
                ) : (
                  <Button
                    key={q.label}
                    size="sm"
                    variant="outline"
                    className="border-gold/30 text-gold hover:bg-gold/10"
                  >
                    {q.label}
                  </Button>
                ),
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PurposeRouter({
  onSelect,
}: {
  onSelect: (groupId: ProvidusAccountGroup["id"]) => void;
}) {
  const [purpose, setPurpose] = useState<string>("");

  const matchedGroup = useMemo(
    () => PAYMENT_PURPOSES.find((p) => p.value === purpose)?.groupId,
    [purpose],
  );

  return (
    <Card className="border-gold/20 bg-white/[0.03]">
      <CardHeader>
        <CardTitle className="text-white text-lg">What Are You Paying For?</CardTitle>
        <p className="text-sm text-white/70">
          Select a purpose and we'll guide you to the correct account group.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <Select
            value={purpose}
            onValueChange={(v) => {
              setPurpose(v);
              const g = PAYMENT_PURPOSES.find((p) => p.value === v)?.groupId;
              if (g) onSelect(g);
            }}
          >
            <SelectTrigger className="border-white/15 bg-white/5 text-white">
              <SelectValue placeholder="Select payment purpose…" />
            </SelectTrigger>
            <SelectContent>
              {PAYMENT_PURPOSES.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            disabled={!matchedGroup}
            className="bg-gold text-charcoal hover:bg-gold/90"
            onClick={() => matchedGroup && onSelect(matchedGroup)}
          >
            Go to Account
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PROVIDUS_ACCOUNT_GROUPS.map((g) => (
            <button
              key={g.id}
              onClick={() => onSelect(g.id)}
              className="text-left rounded-lg border border-white/10 bg-white/[0.02] p-3 hover:border-gold/40 hover:bg-gold/5 transition-colors"
            >
              <div className="flex items-center gap-2 text-gold">
                {GROUP_ICONS[g.id]}
                <span className="text-sm font-semibold text-white">{g.shortName}</span>
              </div>
              <p className="text-xs text-white/60 mt-1.5 line-clamp-3">{g.description}</p>
              <span className="mt-2 inline-block text-xs text-gold">{g.primaryCta.label} →</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function TransparencyPanel() {
  return (
    <Card className="border-gold/20 bg-white/[0.03]">
      <CardHeader>
        <CardTitle className="text-white text-lg">Transparency & Accountability</CardTitle>
        <p className="text-sm text-white/70">
          SCEF is committed to transparent donor communication, responsible fund management,
          ESG-aligned governance, and impact reporting. Donors, members, partners, and sponsors
          may request payment confirmation, receipts, sponsorship documentation, CSR reports, or
          impact updates.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {TRANSPARENCY_POINTS.map((p) => (
            <div
              key={p}
              className="flex items-start gap-2 rounded-md border border-white/10 bg-white/[0.02] p-2.5 text-sm text-white/80"
            >
              <CheckCircle className="h-4 w-4 mt-0.5 shrink-0 text-gold" />
              {p}
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="border-gold/40 text-gold hover:bg-gold/10">
            <Receipt className="h-4 w-4 mr-1.5" /> Request Payment Confirmation
          </Button>
          <Button variant="outline" className="border-gold/40 text-gold hover:bg-gold/10">
            <FileText className="h-4 w-4 mr-1.5" /> Request Sponsorship Documentation
          </Button>
          <Button variant="outline" className="border-gold/40 text-gold hover:bg-gold/10">
            <FileText className="h-4 w-4 mr-1.5" /> Request Impact Report
          </Button>
          <Button variant="outline" className="border-gold/40 text-gold hover:bg-gold/10">
            <MessageCircle className="h-4 w-4 mr-1.5" /> Chat with Sophia
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function PaymentConfirmationForm() {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Payment confirmation submitted", {
        description: "Our team will follow up with your receipt or documentation.",
      });
      (e.target as HTMLFormElement).reset();
    }, 600);
  };

  return (
    <Card className="border-gold/20 bg-white/[0.03]">
      <CardHeader>
        <CardTitle className="text-white text-lg">I Have Paid — Confirm Your Payment</CardTitle>
        <p className="text-sm text-white/70">
          Submit your details and upload your receipt so our team can issue confirmation,
          receipts, or sponsorship documentation.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <div>
            <Label className="text-white/80">Full Name</Label>
            <Input required maxLength={120} name="full_name" className="mt-1 bg-white/5 border-white/15 text-white" />
          </div>
          <div>
            <Label className="text-white/80">Email</Label>
            <Input required type="email" maxLength={200} name="email" className="mt-1 bg-white/5 border-white/15 text-white" />
          </div>
          <div>
            <Label className="text-white/80">Phone / WhatsApp</Label>
            <Input maxLength={40} name="phone" className="mt-1 bg-white/5 border-white/15 text-white" />
          </div>
          <div>
            <Label className="text-white/80">Payment Method</Label>
            <Select name="method">
              <SelectTrigger className="mt-1 bg-white/5 border-white/15 text-white">
                <SelectValue placeholder="Select…" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="providus">Providus Bank Direct Transfer</SelectItem>
                <SelectItem value="gfa-wallet">GFA Wallet</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-white/80">Payment Purpose</Label>
            <Select name="purpose">
              <SelectTrigger className="mt-1 bg-white/5 border-white/15 text-white">
                <SelectValue placeholder="Select…" />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_PURPOSES.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-white/80">Service Paid For</Label>
            <Select name="service">
              <SelectTrigger className="mt-1 bg-white/5 border-white/15 text-white">
                <SelectValue placeholder="Select…" />
              </SelectTrigger>
              <SelectContent>
                {PROVIDUS_ACCOUNT_GROUPS.map((g) => (
                  <SelectItem key={g.id} value={g.id}>
                    {g.shortName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-white/80">Amount Paid</Label>
            <Input required type="number" min="0" step="0.01" name="amount" className="mt-1 bg-white/5 border-white/15 text-white" />
          </div>
          <div>
            <Label className="text-white/80">Currency</Label>
            <Select name="currency">
              <SelectTrigger className="mt-1 bg-white/5 border-white/15 text-white">
                <SelectValue placeholder="Select…" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NGN">NGN</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-white/80">Account / Wallet Reference (last 4 digits or ref)</Label>
            <Input maxLength={60} name="reference" className="mt-1 bg-white/5 border-white/15 text-white" />
          </div>
          <div>
            <Label className="text-white/80">Bank Used / Wallet Used</Label>
            <Input maxLength={100} name="bank_used" className="mt-1 bg-white/5 border-white/15 text-white" />
          </div>
          <div>
            <Label className="text-white/80">Date of Payment</Label>
            <Input required type="date" name="date" className="mt-1 bg-white/5 border-white/15 text-white" />
          </div>
          <div>
            <Label className="text-white/80">Upload Payment Receipt (optional, max 5MB)</Label>
            <Input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              name="receipt"
              className="mt-1 bg-white/5 border-white/15 text-white file:text-gold"
            />
          </div>
          <div className="md:col-span-2">
            <Label className="text-white/80">Additional Notes</Label>
            <Textarea
              name="notes"
              maxLength={1000}
              rows={3}
              className="mt-1 bg-white/5 border-white/15 text-white"
            />
          </div>
          <div className="md:col-span-2 flex flex-wrap gap-2">
            <Button
              type="submit"
              disabled={submitting}
              className="bg-gold text-charcoal hover:bg-gold/90"
            >
              <Upload className="h-4 w-4 mr-1.5" />
              {submitting ? "Submitting…" : "Submit Payment Confirmation"}
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-gold/40 text-gold hover:bg-gold/10"
            >
              <a href="https://wa.me/" target="_blank" rel="noreferrer">
                <MessageCircle className="h-4 w-4 mr-1.5" /> WhatsApp Support
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-gold/40 text-gold hover:bg-gold/10"
            >
              <a href="mailto:support@nesa.africa">
                <FileText className="h-4 w-4 mr-1.5" /> Email Support
              </a>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export function ProvidusBankAccounts() {
  const scrollTo = (groupId: ProvidusAccountGroup["id"]) => {
    const el = document.getElementById(`pay-${groupId}`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="py-12 lg:py-16 border-t border-white/10">
      <div className="container mx-auto px-4 max-w-5xl space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto"
        >
          <Badge className="bg-gold/15 text-gold border border-gold/30 mb-3">
            <Landmark className="h-3 w-3 mr-1" /> Manual Bank Transfer Option
          </Badge>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white">
            Official Bank Transfer Details
          </h2>
          <p className="text-sm text-white/70 mt-2">
            GFA Wallet is the recommended payment option for faster tracking, receipts, and
            program reporting. Manual bank transfer remains available through verified{" "}
            <span className="text-gold font-medium">Providus Bank</span> accounts. Payments
            should only be made through the verified accounts shown on this page.
          </p>
        </motion.div>

        <PurposeRouter onSelect={scrollTo} />

        <div className="space-y-5">
          {PROVIDUS_ACCOUNT_GROUPS.map((g) => (
            <AccountGroupCard key={g.id} group={g} />
          ))}
        </div>

        <TransparencyPanel />
        <PaymentConfirmationForm />
      </div>
    </section>
  );
}
