import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { CheckCircle2, MessageSquare, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useTranslation } from "react-i18next";
import { PUBLIC_CONTACT_TOPICS, CONTACT_ENQUIRY_TYPES, CONTACT_SUBJECT_PREFILLS, type ContactEnquiryType } from "@/config/contactEnquiries";
import { submitContactEnquiry } from "@/services/contactEnquiries";

export { CONTACT_SUBJECT_PREFILLS } from "@/config/contactEnquiries";

const INITIAL = {
  name: "", email: "", organisation: "", enquiry_type: "General enquiry" as ContactEnquiryType,
  country: "", phone: "", preferred_contact: "Email" as "Email" | "Phone" | "Either",
  subject: "", message: "", related_reference: "", consent: false, website: "",
};
const FAQ = [
  ["Is nomination free?", "Yes. NESA-Africa nomination is free. No payment, sponsorship or donation improves eligibility or recognition."],
  ["Can I send evidence through this form?", "Select Evidence submission and provide a short description. Do not upload or paste confidential evidence, identity documents, bank details, health records or children's personal data into this general form."],
  ["How do I correct a nominee profile?", "Select Correction or update, identify the profile and include its public link or reference if available. Corrections remain subject to verification."],
  ["How do I ask about merchandise?", "Select Merchandise. This records an enquiry only; it does not open a cart, checkout or payment flow. Merchandise purchases never influence nominations or results."],
  ["How do I ask about school support?", "Select School support. School nomination, verification and support are separate from NESA-Africa award recognition."],
  ["Will I receive a reference?", "Yes. A successfully saved enquiry displays a case reference. The reference confirms recording, not a response time, approval or outcome."],
];

const MESSAGE_C_FAQ = [
  ["Is it free?", "Yes."],
  ["Can I nominate myself?", "Organisations yes; individuals where the award allows."],
  ["How will I hear back?", "By email."],
  ["Is there public voting?", "Not for the 2026 awards."],
  ["Is the 2027 school vote open?", "Not yet; it opens in September 2027 after approval."],
  ["Where does my donation go?", "To approved school interventions through EduAid-Africa, never to individuals."],
];

export default function Contact() {
  const { t } = useTranslation("pages");
  const tr = (key: string, text: string) => t(`contactMessageC.${key}`, { defaultValue: text });
  const [searchParams] = useSearchParams();
  const subjectParam = searchParams.get("subject") ?? searchParams.get("topic") ?? "";
  const [form, setForm] = useState(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");

  useEffect(() => {
    const prefill = CONTACT_SUBJECT_PREFILLS[subjectParam];
    if (!prefill) return;
    setForm((current) => ({
      ...current,
      enquiry_type: prefill,
      subject: current.subject || (subjectParam === "merchandise" ? "Merchandise enquiry" : subjectParam === "afri-edutourism" ? "Afri-EduTourism mission enquiry" : `${prefill} enquiry`),
    }));
    setReference("");
    setError("");
  }, [subjectParam]);

  const update = <K extends keyof typeof INITIAL>(key: K, value: (typeof INITIAL)[K]) => setForm((current) => ({ ...current, [key]: value }));
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (submitting) return;
    setError("");
    setSubmitting(true);
    try {
      const savedReference = await submitContactEnquiry(form);
      setReference(savedReference);
      setForm({ ...INITIAL, enquiry_type: form.enquiry_type });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "We could not save your enquiry. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-charcoal">
      <Helmet>
        <title>Contact and Help | NESA-Africa</title>
        <meta name="description" content="Send NESA-Africa a general, nomination, evidence, media, partnership, merchandise or school-support enquiry and receive a private case reference." />
        <link rel="canonical" href="https://nesa.africa/contact" />
        <meta property="og:title" content="Contact and Help | NESA-Africa" />
        <meta property="og:description" content="Record an enquiry with NESA-Africa and receive a case reference." />
        <meta property="og:url" content="https://nesa.africa/contact" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <section className="relative bg-gradient-to-br from-gold/5 via-charcoal to-gold/5 py-20">
        <div className="container mx-auto px-4"><div className="mx-auto max-w-4xl text-center">
          <MessageSquare className="mx-auto mb-4 h-8 w-8 text-gold" aria-hidden />
          <h1 className="font-display text-4xl font-bold text-foreground md:text-5xl">{tr("heading", "Contact and Help")}</h1>
          <p className="mt-6 text-xl text-muted-foreground">{tr("text14", 'Select the subject that best matches your enquiry so it can be recorded and routed appropriately.')}</p>
          <p className="mx-auto mt-4 max-w-3xl rounded-xl border border-gold/25 bg-gold/5 p-4 text-sm text-white/75">{tr("text15", "Do not send passports, bank details, card information, PINs, OTPs, confidential evidence, health records or children's personal data through this general contact form.")}</p>
        </div></div>
      </section>

      <section className="py-12 md:py-16" aria-labelledby="contact-form-heading">
        <div className="container mx-auto max-w-4xl px-4">
          {reference && <div role="status" className="mb-6 rounded-2xl border border-gold/40 bg-gold/10 p-6 text-center"><CheckCircle2 className="mx-auto h-10 w-10 text-gold" aria-hidden /><h2 className="mt-3 font-display text-2xl text-gold">{tr("thanks", "Thank you. We’ll reply by email.")}</h2><p className="mt-2 text-white/75">Your case reference is <strong className="font-mono text-gold">{reference}</strong>. Keep it for future correspondence.</p><p className="mt-2 text-sm text-white/60">{tr("text16", 'This confirms recording only. It does not confirm delivery of an email, a response time, approval or an outcome.')}</p></div>}
          <Card>
            <CardHeader><CardTitle id="contact-form-heading" className="font-display text-2xl text-gold">{tr("text10", 'Send an enquiry')}</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={submit} className="space-y-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2"><Label htmlFor="contact-name">{tr("text0", 'Full name *')}</Label><Input id="contact-name" autoComplete="name" value={form.name} onChange={(event) => update("name", event.target.value)} required maxLength={160} /></div>
                  <div className="space-y-2"><Label htmlFor="contact-email">{tr("text1", 'Email address *')}</Label><Input id="contact-email" type="email" autoComplete="email" value={form.email} onChange={(event) => update("email", event.target.value)} required maxLength={320} /></div>
                  <div className="space-y-2"><Label htmlFor="contact-organisation">{tr("text2", 'Organisation (optional)')}</Label><Input id="contact-organisation" autoComplete="organization" value={form.organisation} onChange={(event) => update("organisation", event.target.value)} maxLength={200} /></div>
                  <div className="space-y-2"><Label htmlFor="contact-country">{tr("text3", 'Country *')}</Label><Input id="contact-country" autoComplete="country-name" value={form.country} onChange={(event) => update("country", event.target.value)} required maxLength={120} /></div>
                  <div className="space-y-2"><Label htmlFor="contact-type">{tr("text4", 'Enquiry type *')}</Label><select id="contact-type" className="min-h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={form.enquiry_type} onChange={(event) => update("enquiry_type", event.target.value as ContactEnquiryType)} required>{PUBLIC_CONTACT_TOPICS.map(topic => <option key={topic.value} value={topic.value}>{tr(`topics.${topic.value}`, topic.label)}</option>)}{!PUBLIC_CONTACT_TOPICS.some(topic => topic.value === form.enquiry_type) && <option value={form.enquiry_type}>{tr(`legacyTopics.${form.enquiry_type}`, form.enquiry_type)}</option>}</select></div>
                  <div className="space-y-2"><Label htmlFor="contact-phone">{tr("text5", 'Phone (optional)')}</Label><Input id="contact-phone" type="tel" autoComplete="tel" value={form.phone} onChange={(event) => update("phone", event.target.value)} maxLength={60} /></div>
                  <div className="space-y-2"><Label htmlFor="contact-preferred">{tr("text6", 'Preferred contact method *')}</Label><select id="contact-preferred" className="min-h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={form.preferred_contact} onChange={(event) => update("preferred_contact", event.target.value as "Email" | "Phone" | "Either")}><option>Email</option><option>Phone</option><option>Either</option></select></div>
                  <div className="space-y-2"><Label htmlFor="contact-reference">{tr("text7", 'Related reference (optional)')}</Label><Input id="contact-reference" value={form.related_reference} onChange={(event) => update("related_reference", event.target.value)} maxLength={100} placeholder="Nomination, profile or case reference" /></div>
                </div>
                <div className="space-y-2"><Label htmlFor="contact-subject">{tr("text8", 'Subject *')}</Label><Input id="contact-subject" value={form.subject} onChange={(event) => update("subject", event.target.value)} required minLength={3} maxLength={240} /></div>
                <div className="space-y-2"><Label htmlFor="contact-message">{tr("text9", 'Message *')}</Label><Textarea id="contact-message" rows={7} value={form.message} onChange={(event) => update("message", event.target.value)} required minLength={20} maxLength={5000} placeholder="Explain what you need without including sensitive documents or financial details." /><p className="text-xs text-muted-foreground">{form.message.length}/5,000 characters</p></div>
                <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true"><label htmlFor="contact-website">Leave this field empty</label><input id="contact-website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(event) => update("website", event.target.value)} /></div>
                <div className="flex items-start gap-3 rounded-xl border border-gold/20 p-4"><Checkbox id="contact-consent" checked={form.consent} onCheckedChange={(checked) => update("consent", checked === true)} required /><Label htmlFor="contact-consent" className="text-sm font-normal leading-relaxed">{tr("text17", "I consent to NESA-Africa recording and reviewing this enquiry and using the supplied contact details to respond. I have not included sensitive documents, payment credentials or children's personal data. *")}</Label></div>
                {error && <p role="alert" className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm">{error}</p>}
                <Button type="submit" size="lg" disabled={submitting || !form.consent} className="bg-gold text-charcoal hover:bg-gold/90">{submitting ? tr("saving", "Saving enquiry…") : tr("submit", "Submit enquiry")}</Button>
              </form>
            </CardContent>
          </Card>
          <div className="mt-6 flex flex-wrap gap-4 text-sm"><Link to="/help" className="text-gold underline">{tr("text12", 'Visit the Help Centre')}</Link><Link to="/policies#privacy" className="text-gold underline">{tr("text13", 'Read the privacy policy')}</Link></div>
        </div>
      </section>

      <section className="container mx-auto max-w-4xl px-4 pb-10"><h2 className="font-display text-2xl">{tr("emailHeading", "Contact by email")}</h2><p className="mt-4">{tr("nominationEmail", "Nominations")}: <a className="break-all text-gold underline" href="mailto:nominate.nesa2026@gmail.com">nominate.nesa2026@gmail.com</a></p><p className="mt-2">{tr("schoolEmail", "School support")}: <a className="break-all text-gold underline" href="mailto:eduaidafrica.santos@gmail.com">eduaidafrica.santos@gmail.com</a></p></section>
      <section id="faq" className="scroll-mt-28 border-t border-gold/15 bg-charcoal-light/20 py-16" aria-labelledby="contact-faq"><div className="container mx-auto max-w-3xl px-4"><h2 id="contact-faq" className="font-display text-3xl text-gold">{tr("text11", 'Frequently asked questions')}</h2><Accordion type="single" collapsible className="mt-6">{MESSAGE_C_FAQ.map(([question, answer], index) => <AccordionItem key={question} value={`contact-${index}`}><AccordionTrigger className="text-left">{tr(`faq.${index}.question`, question)}</AccordionTrigger><AccordionContent className="leading-relaxed text-white/70">{tr(`faq.${index}.answer`, answer)}</AccordionContent></AccordionItem>)}</Accordion><div className="mt-8 flex items-start gap-3 rounded-xl border border-gold/25 p-4"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-gold" /><p className="text-sm text-white/70">{tr("text18", 'Contact submissions carry zero weight in nomination, eligibility, judging or recognition. No destination email is configured; enquiries are recorded for authorised administrator review.')}</p></div></div></section>
    </div>
  );
}
