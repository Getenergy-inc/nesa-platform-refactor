import { Helmet } from "react-helmet-async";

interface Crumb {
  name: string;
  path: string;
}

interface Props {
  crumbs: Crumb[];
  baseUrl?: string;
}

/**
 * Emits BreadcrumbList JSON-LD for SEO. No visual rendering.
 */
export function BreadcrumbJsonLd({
  crumbs,
  baseUrl = "https://nesaafrica.lovable.app",
}: Props) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${baseUrl}${c.path}`,
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(data)}</script>
    </Helmet>
  );
}

export default BreadcrumbJsonLd;
