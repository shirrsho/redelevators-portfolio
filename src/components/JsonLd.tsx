/**
 * Renders a JSON-LD structured-data block. Server component — the script is
 * in the static HTML, so crawlers see it without running JS. `data` is trusted
 * (built in-repo from seo.ts / content.ts), never user input.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
