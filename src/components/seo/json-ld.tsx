// Renders a JSON-LD graph as an ld+json script tag (PRD §15).
//
// The payload is stringified here rather than in each page, so escaping lives
// in exactly one place. `<` is escaped as \u003c so no verse text, translation,
// or editorial description can terminate the script element early (the classic
// JSON-in-HTML breakout), and the two Unicode line terminators are escaped
// because they are illegal inside a JavaScript string literal even though
// JSON.stringify leaves them in place.

import type { JsonLdNode } from "@/lib/seo/json-ld";

interface JsonLdProps {
  /** One or more nodes, each already carrying its own @context. */
  nodes: JsonLdNode[];
}

export function JsonLd({ nodes }: JsonLdProps) {
  if (nodes.length === 0) return null;

  const json = JSON.stringify(nodes)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");

  return (
    <script
      type="application/ld+json"
      // Escaped above: the string cannot contain a closing tag.
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
