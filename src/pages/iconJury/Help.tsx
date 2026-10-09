export default function IconJuryHelp() {
  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-6">
      <div>
        <p className="text-[11px] uppercase tracking-widest text-gold/80">Icon Jury</p>
        <h1 className="text-2xl font-semibold">Help & Support</h1>
      </div>
      <div className="rounded-xl border border-gold/20 bg-black/40 p-5 text-sm text-white/70 space-y-3 leading-relaxed">
        <p>For access issues, missing assignments, or to reopen a locked review, contact the Icon Jury Moderation Desk:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Email: <a className="text-gold hover:underline" href="mailto:icon-jury@nesa.africa">icon-jury@nesa.africa</a></li>
          <li>Response SLA: 24 hours (business days)</li>
          <li>Emergencies (integrity concerns): use the Report tool inside your assigned nominee view</li>
        </ul>
        <p className="text-white/50 text-xs pt-3 border-t border-white/10">
          All communication is logged. Do not share nominee information outside sanctioned channels.
        </p>
      </div>
    </div>
  );
}
