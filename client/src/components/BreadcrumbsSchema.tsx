// @ts-nocheck
/**
 * Breadcrumbs Schema Component for SEO
 * Adds structured data for breadcrumb navigation
 */

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbsSchemaProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbsSchema({ items }: BreadcrumbsSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
