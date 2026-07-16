import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trans, useTranslation } from "react-i18next";
import { ArrowLeft, MailCheck, UserPlus, LogIn, ShieldCheck } from "lucide-react";
import { LaunchingAfterVerificationBanner } from "./ComingSoonBanner";
import { useAuth } from "@/contexts/AuthContext";
import type { SubmitterIdentity, NomineeEntry } from "./types";

export function SignupAtSubmissionStep({
  submitter,
  entries,
  onBack,
  onSubmit,
}: {
  submitter: SubmitterIdentity;
  entries: NomineeEntry[];
  onBack: () => void;
  onSubmit: (mode: "create" | "signin" | "verify") => void;
}) {
  const { t } = useTranslation("nomination");
  const { user } = useAuth();
  const isAuthed = Boolean(user);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-gold/80 font-semibold">
          {t("flow.auth.eyebrow")}
        </p>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-white">
          {isAuthed ? t("flow.auth.titleAuthed") : t("flow.auth.titleGuest")}
        </h2>
        <p className="text-sm text-white/65 max-w-2xl">
          <Trans
            i18nKey="flow.auth.summary"
            ns="nomination"
            count={entries.length}
            values={{ count: entries.length, name: submitter.fullName, email: submitter.email }}
            components={[
              <span className="text-gold font-semibold" />,
              <span className="text-white" />,
            ]}
          />
        </p>
      </div>

      {isAuthed ? (
        <Card className="bg-charcoal/60 border-gold/30 p-5">
          <div className="flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-gold shrink-0 mt-0.5" />
            <div className="space-y-3">
              <p className="text-sm text-white/80">{t("flow.auth.signedInNote")}</p>
              <Button
                onClick={() => onSubmit("signin")}
                className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full px-6 shadow-gold"
              >
                {t("flow.auth.submitNominations")}
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <>
          <Card className="bg-charcoal/60 border-gold/40 p-5">
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-gold shrink-0 mt-0.5" />
              <div className="space-y-3">
                <div>
                  <h3 className="font-display text-lg font-semibold text-white">
                    Submit without an account
                  </h3>
                  <p className="text-xs text-white/65 mt-1 max-w-xl">
                    Your nomination is recorded immediately. You can create a
                    free account on the next screen to track its status — it's
                    optional and never required for review.
                  </p>
                </div>
                <Button
                  onClick={() => onSubmit("verify")}
                  className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full px-6 shadow-gold"
                >
                  Submit nomination
                </Button>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <OptionCard
              icon={UserPlus}
              title={t("flow.auth.create.title")}
              description={t("flow.auth.create.desc")}
              cta={t("flow.auth.create.cta")}
              onClick={() => onSubmit("create")}
            />
            <OptionCard
              icon={LogIn}
              title={t("flow.auth.signin.title")}
              description={t("flow.auth.signin.desc")}
              cta={t("flow.auth.signin.cta")}
              onClick={() => onSubmit("signin")}
            />
          </div>
        </>
      )}


      <LaunchingAfterVerificationBanner />

      <Button
        type="button"
        variant="outline"
        onClick={onBack}
        className="rounded-full border-white/20 text-white hover:bg-white/10 gap-2"
      >
        <ArrowLeft className="h-4 w-4" /> {t("flow.auth.editDetails")}
      </Button>
    </div>
  );
}

function OptionCard({
  icon: Icon,
  title,
  description,
  cta,
  onClick,
  primary,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  cta: string;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <Card
      className={`p-4 bg-charcoal/60 border ${primary ? "border-gold/50" : "border-white/10"} space-y-3`}
    >
      <div className="flex items-center gap-2">
        <div className="h-9 w-9 rounded-full bg-gold/10 border border-gold/30 grid place-items-center">
          <Icon className="h-4 w-4 text-gold" />
        </div>
        <h3 className="font-display text-base font-semibold text-white">{title}</h3>
      </div>
      <p className="text-xs text-white/65 leading-relaxed">{description}</p>
      <Button
        onClick={onClick}
        size="sm"
        className={
          primary
            ? "w-full bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full"
            : "w-full bg-white/10 hover:bg-white/15 text-white rounded-full border border-white/15"
        }
      >
        {cta}
      </Button>
    </Card>
  );
}

export function EmailVerificationNotice({ email }: { email: string }) {
  return (
    <Card className="bg-charcoal/60 border-gold/30 p-4 text-sm text-white/80">
      <div className="flex items-start gap-3">
        <MailCheck className="h-5 w-5 text-gold shrink-0 mt-0.5" />
        <p>
          We will send a verification link to <span className="text-gold">{email}</span> as soon as
          backend verification activates.
        </p>
      </div>
    </Card>
  );
}
