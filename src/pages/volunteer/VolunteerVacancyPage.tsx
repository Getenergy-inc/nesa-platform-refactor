import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams, Navigate } from "react-router-dom";
import { Calendar, Check, Copy, MapPin, Clock, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import {
  VOLUNTEER_VACANCIES_2026,
  getVolunteerVacancy,
} from "@/data/volunteerVacancies2026";

export default function VolunteerVacancyPage() {
  const { slug = "" } = useParams();
  const vacancy = getVolunteerVacancy(slug);
  const [selected, setSelected] = useState<string[]>([]);
  const [fns, setFns] = useState<string[]>([]);

  const note = useMemo(() => {
    if (!vacancy) return "";
    const slots = vacancy.slots.filter((s) => selected.includes(s.id));
    const lines = [
      `Application: ${vacancy.title} (${vacancy.code}) — NESA-Africa 2026`,
      slots.length
        ? `Preferred sessions:\n${slots
            .map((s, i) => `  ${i + 1}. ${s.label} — ${s.dateLabel} — ${s.title}`)
            .join("\n")}`
        : "Preferred sessions: (none selected yet)",
    ];
    if (vacancy.functions) {
      lines.push(
        fns.length
          ? `Production interest: ${fns.join(", ")}`
          : "Production interest: (none selected yet)",
      );
    }
    return lines.join("\n");
  }, [vacancy, selected, fns]);

  if (!vacancy) return <Navigate to="/vacancies" replace />;

  const toggle = (id: string) =>
    setSelected((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const toggleFn = (f: string) =>
    setFns((p) => (p.includes(f) ? p.filter((x) => x !== f) : [...p, f]));

  const copy = async () => {
    await navigator.clipboard.writeText(note);
    toast({
      title: "Application note copied",
      description: "Paste it into your volunteer application or message.",
    });
  };

  const others = VOLUNTEER_VACANCIES_2026.filter((v) => v.slug !== vacancy.slug);

  return (
    <div className="bg-charcoal text-white">
      <Helmet>
        <title>{`${vacancy.title} — Volunteer with NESA-Africa`}</title>
        <meta
          name="description"
          content={`${vacancy.role}. ${vacancy.location}. ${vacancy.commitment}. Volunteer with the NESA-Africa 2026 Education Enablers webinar and podcast series.`}
        />
      </Helmet>

      {/* Hero */}
      <section className="border-b border-gold/20 bg-gradient-to-b from-black to-charcoal py-14 px-4">
        <div className="container mx-auto max-w-4xl">
          <Link
            to="/vacancies"
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" /> All vacancies
          </Link>
          <Badge className="mt-6 bg-gold/15 text-gold border border-gold/30">
            Volunteer · {vacancy.code}
          </Badge>
          <h1 className="mt-4 font-playfair text-3xl md:text-5xl text-gold">
            {vacancy.title}
          </h1>
          <p className="mt-3 text-lg text-white/80">{vacancy.role}</p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-white/70">
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gold" /> {vacancy.location}
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4 text-gold" /> {vacancy.commitment}
            </span>
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-4xl px-4 py-12 space-y-12">
        {/* What you'll do */}
        <section>
          <h2 className="font-playfair text-2xl text-gold mb-3">What you'll do</h2>
          <p className="text-white/80">{vacancy.intro}</p>
          <ul className="mt-4 space-y-2">
            {vacancy.responsibilities.map((r) => (
              <li key={r} className="flex gap-3 text-white/75">
                <Check className="h-4 w-4 text-gold shrink-0 mt-1" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
          {vacancy.slug === "production" && (
            <p className="mt-4 rounded-lg border border-gold/20 bg-white/5 p-4 text-sm text-white/70">
              Session reports are published in the{" "}
              <Link to="/journal" className="text-gold underline">
                EduAid-Africa Journal
              </Link>{" "}
              under the Webinar Reports stream. There is no automated submission
              form yet — reports are handed to the editorial team during the
              production cycle.
            </p>
          )}
        </section>

        {/* Slot picker */}
        <section>
          <h2 className="font-playfair text-2xl text-gold mb-1">
            {vacancy.pickerHeading}
          </h2>
          <p className="text-sm text-white/60 mb-5">{vacancy.pickerNote}</p>

          <div className="space-y-2">
            {vacancy.slots.map((s) => {
              const on = selected.includes(s.id);
              return (
                <label
                  key={s.id}
                  className={`flex cursor-pointer gap-3 rounded-lg border p-4 transition ${
                    on
                      ? "border-gold bg-gold/10"
                      : "border-white/10 bg-white/5 hover:border-gold/40"
                  }`}
                >
                  <Checkbox
                    checked={on}
                    onCheckedChange={() => toggle(s.id)}
                    className="mt-1 border-gold/50 data-[state=checked]:bg-gold data-[state=checked]:text-charcoal"
                    aria-label={`Select ${s.label}`}
                  />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-gold">{s.label}</span>
                      {s.toBeConfirmed && (
                        <Badge
                          variant="outline"
                          className="border-white/30 text-white/70 text-[10px]"
                        >
                          TBC
                        </Badge>
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-white/60">
                      <Calendar className="h-3 w-3" /> {s.dateLabel}
                    </div>
                    <p className="mt-1 text-sm text-white/85">{s.title}</p>
                    {s.focus && (
                      <p className="mt-1 text-xs text-white/55">{s.focus}</p>
                    )}
                  </div>
                </label>
              );
            })}
          </div>

          {vacancy.functions && (
            <div className="mt-8">
              <h3 className="font-semibold text-gold mb-3">
                Which part of production interests you?
              </h3>
              <div className="grid gap-2 sm:grid-cols-3">
                {vacancy.functions.map((f) => {
                  const on = fns.includes(f);
                  return (
                    <label
                      key={f}
                      className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm transition ${
                        on
                          ? "border-gold bg-gold/10"
                          : "border-white/10 bg-white/5 hover:border-gold/40"
                      }`}
                    >
                      <Checkbox
                        checked={on}
                        onCheckedChange={() => toggleFn(f)}
                        className="mt-0.5 border-gold/50 data-[state=checked]:bg-gold data-[state=checked]:text-charcoal"
                        aria-label={`Select ${f}`}
                      />
                      <span className="text-white/80">{f}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {/* Looking for */}
        <section>
          <h2 className="font-playfair text-2xl text-gold mb-3">
            What we're looking for
          </h2>
          <ul className="space-y-2">
            {vacancy.lookingFor.map((l) => (
              <li key={l} className="flex gap-3 text-white/75">
                <Check className="h-4 w-4 text-gold shrink-0 mt-1" />
                <span>{l}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Apply */}
        <section className="rounded-xl border border-gold/25 bg-white/5 p-6">
          <h2 className="font-playfair text-2xl text-gold mb-3">How to apply</h2>
          <p className="text-white/75 text-sm">
            Apply through the NESA-Africa volunteer form and include the note
            below so we know which sessions you have chosen.
          </p>
          <pre className="mt-4 whitespace-pre-wrap rounded-lg bg-black/50 p-4 text-xs text-white/80 border border-white/10">
            {note}
          </pre>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button onClick={copy} variant="outline" className="border-gold/40 text-gold hover:bg-gold/10">
              <Copy className="mr-2 h-4 w-4" /> Copy application note
            </Button>
            <Button asChild className="bg-gold text-charcoal hover:bg-gold/90">
              <Link to="/volunteer">
                Go to volunteer form <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="ghost" className="text-white/80 hover:text-gold">
              <Link to="/contact">Contact the team</Link>
            </Button>
          </div>
        </section>

        {/* Other listings */}
        <section>
          <h2 className="font-playfair text-xl text-gold mb-4">Other volunteer listings</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {others.map((o) => (
              <Link
                key={o.slug}
                to={`/volunteer/${o.slug}`}
                className="rounded-lg border border-white/10 bg-white/5 p-4 hover:border-gold/50 transition"
              >
                <div className="font-semibold text-gold">{o.title}</div>
                <div className="mt-1 text-xs text-white/60">{o.commitment}</div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
