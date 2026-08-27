/**
 * Reads facts back out of the compiled component CSS and the icon font.
 *
 * Every badge in the platform declares its own subset of flavours in its own
 * stylesheet — `cca-attention-flag-badge` styles four, `cca-numerical-badge`
 * styles ten — so the badge page is generated from what each component actually
 * declares rather than from the union type. A flavour that exists in
 * `StatusBadgeFlavor` but has no CSS would otherwise be documented as a silent
 * no-op swatch.
 */

import postcss from 'postcss';

/** Flavour class names one component declares, in source order. */
export function parseDeclaredFlavors(
  compiledCss: string,
  rootSelector: string,
  known: readonly string[],
): string[] {
  const found = new Set<string>();
  const root = postcss.parse(compiledCss);

  root.walkRules((rule) => {
    for (const selector of rule.selectors) {
      // Match `cca-status-badge .primary` and `cca-text-badge .primary .dot`.
      const match = selector
        .trim()
        .match(new RegExp(`^${rootSelector}\\s+\\.([\\w-]+)(?:[\\s.:>].*)?$`));
      if (match && known.includes(match[1])) {
        found.add(match[1]);
      }
    }
  });

  // Report in the order the shared flavour list declares, so the page is stable.
  return known.filter((flavor) => found.has(flavor));
}

/** One icon in the CtrlChain icon font. */
export interface IconEntry {
  /** Class name without the `cca-icon-` prefix, e.g. `arrow-right`. */
  readonly name: string;
  /** The codepoint the font maps it to, e.g. `\e900`. */
  readonly codepoint: string;
}

/**
 * Parses the icon font's class list. Names are deduplicated: a few glyphs are
 * declared more than once in the source stylesheet.
 */
export function parseIconFont(iconCss: string): IconEntry[] {
  const icons = new Map<string, string>();
  const pattern = /\.cca-icon-([\w-]+):before\s*\{\s*content:\s*['"]([^'"]+)['"]/g;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(iconCss)) !== null) {
    if (!icons.has(match[1])) {
      icons.set(match[1], match[2]);
    }
  }

  return [...icons]
    .map(([name, codepoint]) => ({ name, codepoint }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
