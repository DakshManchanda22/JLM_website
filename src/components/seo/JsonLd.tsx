/**
 * Renders a Schema.org JSON-LD block. Server component — safe to drop anywhere
 * in a page's markup. Google reads structured data from the body just fine.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Content is our own object, not user input — safe to serialize.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
