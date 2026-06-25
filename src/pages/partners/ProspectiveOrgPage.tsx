import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Building2, ExternalLink, Globe2, Info, Tag } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { getProspectBySlug } from "@/data/partnershipProspects";

export default function ProspectiveOrgPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const record = getProspectBySlug(slug);

  if (!record) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-16">
        <Breadcrumbs
          items={[
            { label: "Partners", href: "/partners" },
            { label: "Prospective Partners", href: "/partners#prospective-partners" },
            { label: "Not found" },
          ]}
        />
        <div className="mt-8 rounded-lg border border-border bg-card/50 p-8 text-center">
          <h1 className="font-display text-2xl font-bold mb-2">Organization not found</h1>
          <p className="text-muted-foreground mb-6">
            This prospect is not in the current outreach directory.
          </p>
          <Button asChild>
            <Link to="/partners#prospective-partners">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Directory
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const primary = record.groups[0];
  const searchQuery = encodeURIComponent(record.name);

  return (
    <div className="container mx-auto max-w-5xl px-4 py-10">
      <Helmet>
        <title>{`${record.name} · Prospective Partner · NESA-Africa 2026`}</title>
        <meta
          name="description"
          content={`${record.name} — NESA-Africa 2026 prospective partner under ${primary.code}. ${primary.title}.`}
        />
        <link rel="canonical" href={`https://nesaafrica.lovable.app/partners/prospects/${record.slug}`} />
      </Helmet>

      <Breadcrumbs
        items={[
          { label: "Partners", href: "/partners" },
          { label: "Prospective Partners", href: "/partners#prospective-partners" },
          { label: record.name },
        ]}
      />

      <header className="mt-6 mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline" className="border-gold/40 text-gold">
            <Globe2 className="h-3 w-3 mr-1" /> Prospective Partner
          </Badge>
          <Badge variant="secondary">
            {record.occurrences} listing{record.occurrences > 1 ? "s" : ""}
          </Badge>
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold leading-tight">
          {record.name}
        </h1>
        <p className="text-muted-foreground mt-3 max-w-3xl">
          NESA-Africa 2026 outreach prospect under the{" "}
          <strong className="text-foreground">{primary.title}</strong> sub-category.
          Inclusion indicates outreach intent and does not imply confirmed sponsorship
          or endorsement.
        </p>
      </header>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-gold" />
                Category &amp; Sub-Category
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {record.groups.map((g) => (
                <Link
                  key={`${g.id}-${g.position}`}
                  to={`/partners#prospective-partners`}
                  className="flex items-start gap-3 rounded-md border border-border bg-background/50 p-3 hover:border-gold/40 transition-colors"
                >
                  <Badge variant="outline" className="border-gold/40 text-gold shrink-0">
                    {g.code}
                  </Badge>
                  <div className="min-w-0">
                    <div className="font-medium">{g.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Listed as entry #{g.position} in this sub-category
                    </div>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-4 w-4 text-gold" />
                Source References
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2 text-sm text-foreground/90">
                {record.sources.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
                <li>
                  Cross-referenced in {record.groups.length} sub-categor
                  {record.groups.length > 1 ? "ies" : "y"}:{" "}
                  {record.groups.map((g) => g.code).join(", ")}
                </li>
              </ol>
              <p className="text-xs text-muted-foreground mt-4">
                Master source list maintained by the NESA-Africa Partnerships &amp;
                Endorsements Secretariat. Updates are versioned and tracked internally
                before being reflected in the public directory.
              </p>
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Building2 className="h-4 w-4 text-gold" /> Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full" variant="outline">
                <a
                  href={`https://www.google.com/search?q=${searchQuery}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Search the web <ExternalLink className="ml-2 h-3.5 w-3.5" />
                </a>
              </Button>
              <Button asChild className="w-full" variant="outline">
                <Link to="/partners#prospective-partners">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Directory
                </Link>
              </Button>
              <Button asChild className="w-full bg-gold text-charcoal hover:bg-gold/90">
                <Link to="/partners">Become a Partner</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Disclaimer</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              This page is part of NESA-Africa's transparent outreach directory.
              Organizations listed here are being engaged for partnership,
              endorsement, sponsorship or advisory roles toward the 2026 Awards
              Cycle. Listing does not constitute affiliation, endorsement, or
              confirmation of involvement.
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
