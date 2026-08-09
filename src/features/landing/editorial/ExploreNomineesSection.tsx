// Homepage §11 Section 5 — "Explore Existing Nominees".
// Search-first entry into the Impact Directory: no taxonomy knowledge required.

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Search } from "lucide-react";
import { RECOGNITION_FAMILIES } from "@/config/brandHierarchy";

export function ExploreNomineesSection() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  return (
    <section className="ed-section" aria-labelledby="ed-explore-heading">
      <div className="ed-wrap">
        <div className="ed-section-head">
          <div className="ed-eyebrow">Africa&apos;s Education Impact Directory</div>
          <h2 id="ed-explore-heading" className="ed-section-title">
            Explore Existing Nominees
          </h2>
          <p className="ed-section-sub">
            Meet the people and organisations helping advance Education for All across Africa.
          </p>
        </div>

        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            navigate(q.trim() ? `/nominees?q=${encodeURIComponent(q.trim())}` : "/nominees");
          }}
          className="mx-auto flex max-w-xl items-center gap-2"
        >
          <label htmlFor="ed-explore-q" className="sr-only">
            Search Education Enablers
          </label>
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gold/70"
              aria-hidden="true"
            />
            <input
              id="ed-explore-q"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search a name, organisation or country"
              className="h-12 w-full rounded-md border border-gold/25 bg-white/5 pl-10 pr-3 text-sm text-white placeholder:text-white/40 focus:border-gold focus:outline-none"
            />
          </div>
          <button type="submit" className="ed-btn-small h-12 px-6">
            Search
          </button>
        </form>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {RECOGNITION_FAMILIES.map((f) => (
            <Link key={f.slug} to={`/nominees?family=${f.slug}`} className="ed-stat-pill">
              {f.name}
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link to="/nominees" className="ed-btn-ghost">
            Open the full directory →
          </Link>
        </div>
      </div>
    </section>
  );
}

export default ExploreNomineesSection;
