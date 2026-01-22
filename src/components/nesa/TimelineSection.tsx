interface TimelineItem {
  number: number;
  title: string;
  date: string;
  description: string;
}

const timeline: TimelineItem[] = [
  {
    number: 1,
    title: "EduAid-Africa Webinars",
    date: "14 Oct 2025 – Jun 2026",
    description: "Public education series on SDG 4, CSR, STEM, inclusion, and NESA standards",
  },
  {
    number: 2,
    title: "Platinum Recognition Show",
    date: "28 February 2026",
    description: "3-hour TV Show — Non-competitive baseline recognition of service",
  },
  {
    number: 3,
    title: "Africa Education Icon Show",
    date: "28 March 2026",
    description: "3-hour TV Show — Lifetime impact recognition (9 Icons, 2005–2025)",
  },
  {
    number: 4,
    title: "Icon Nominations Close",
    date: "30 April 2026",
    description: "Final deadline for Africa Education Icon nominations",
  },
  {
    number: 5,
    title: "Gold Public Voting",
    date: "10 Apr – 16 May 2026",
    description: "Mass participation voting across 135 sub-categories",
  },
  {
    number: 6,
    title: "Gold Certificate Winners Show",
    date: "17 May 2026",
    description: "3-hour TV Show — 135 Gold winners announced",
  },
  {
    number: 7,
    title: "Blue Garnet Voting",
    date: "18 May – 17 Jun 2026",
    description: "40% public vote + 60% independent jury review",
  },
  {
    number: 8,
    title: "Blue Garnet Awards Gala",
    date: "27 June 2026",
    description: "Grand ceremony in Lagos + live broadcast — 9 Blue Garnet winners",
  },
  {
    number: 9,
    title: "Rebuild My School Africa",
    date: "Jun 2026 – Jun 2027",
    description: "Legacy phase: 5 Special Needs facilities across Africa's regions",
  },
];

export function TimelineSection() {
  return (
    <section className="bg-charcoal py-16 md:py-20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Programme Timeline
          </h2>
          <p className="text-secondary-foreground/70 max-w-2xl mx-auto">
            Complete schedule from public education phase through legacy implementation.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-primary/20 hidden md:block" />

            <div className="space-y-4">
              {timeline.map((item) => (
                <div key={item.number} className="flex gap-4 md:gap-6">
                  {/* Number circle */}
                  <div className="relative flex-shrink-0">
                    <div className="h-12 w-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                      <span className="text-primary font-bold">{item.number}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 bg-secondary rounded-xl p-4 border border-primary/10">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                      <h3 className="font-semibold text-white">{item.title}</h3>
                      <span className="text-primary text-sm">{item.date}</span>
                    </div>
                    <p className="text-secondary-foreground/70 text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
