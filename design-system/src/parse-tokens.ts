/**
 * Reads the design tokens, the type scale and the utility map straight out of
 * the platform's own style files, so the generated foundation pages cannot
 * describe values the code does not have.
 *
 * Sources, all under `shared/styles/`:
 *  - `tailwind/colors.css` + `tailwind/new-cold.css` — the raw palette
 *  - `tailwind/light-mode.scss` — semantic tokens (`:root`)
 *  - `tailwind/dark-mode.scss`  — the same tokens inside `@mixin dark-theme`
 *  - `tailwind/tailwind.css`    — the `@utility` layer and the type scale
 */

/** One step of a raw colour ramp, e.g. `--color-green-600: #6f8f2f`. */
export interface PaletteEntry {
  readonly name: string;
  readonly value: string;
  /** Trailing source comment, e.g. `White`. */
  readonly note?: string;
}

/** A named ramp from the palette files. */
export interface PaletteGroup {
  readonly group: string;
  readonly entries: readonly PaletteEntry[];
}

/** A semantic token and the palette step it points at, per theme. */
export interface SemanticToken {
  readonly name: string;
  readonly light: string;
  readonly dark?: string;
  readonly group: string;
}

/** One `text-*` utility from the type scale. */
export interface TypeStyle {
  readonly utility: string;
  readonly declarations: Readonly<Record<string, string>>;
}

/** A token-backed utility, e.g. `surface-brand-default` → `background-color`. */
export interface TokenUtility {
  readonly utility: string;
  readonly property: string;
  readonly token: string;
  readonly group: string;
}

const GROUP_COMMENT = /\/\*\s*(?:-+\s*)?([^*/]+?)(?:\s*-+)?\s*\*\//;
const CUSTOM_PROPERTY = /^\s*(--[\w-]+)\s*:\s*([^;]+);\s*(?:\/\*\s*(.*?)\s*\*\/)?/;

/** Splits a declaration block's lines, tracking the most recent group comment. */
function* walkDeclarations(
  css: string,
): Generator<{ group: string; name: string; value: string; note?: string }> {
  let group = 'Ungrouped';

  for (const line of css.split('\n')) {
    const groupMatch = line.trim().match(/^\/\*[^*]*\*\/$/) ? line.match(GROUP_COMMENT) : null;
    if (groupMatch) {
      group = groupMatch[1].trim();
      continue;
    }

    const declaration = line.match(CUSTOM_PROPERTY);
    if (!declaration) {
      continue;
    }

    yield {
      group,
      name: declaration[1],
      value: declaration[2].trim(),
      note: declaration[3],
    };
  }
}

/** Parses the raw palette out of `colors.css` / `new-cold.css`. */
export function parsePalette(...sources: string[]): PaletteGroup[] {
  const groups = new Map<string, PaletteEntry[]>();

  for (const source of sources) {
    for (const { group, name, value, note } of walkDeclarations(source)) {
      if (!name.startsWith('--color-')) {
        continue;
      }

      const entries = groups.get(group) ?? [];
      entries.push({ name, value, note });
      groups.set(group, entries);
    }
  }

  return [...groups].map(([group, entries]) => ({ group, entries }));
}

/**
 * Parses the semantic token layer, pairing each light-mode token with its
 * dark-mode counterpart. `dark-mode.scss` wraps them in `@mixin dark-theme`,
 * which the line-based walk handles without needing a Sass parse.
 */
export function parseSemanticTokens(lightScss: string, darkScss: string): SemanticToken[] {
  const dark = new Map<string, string>();
  for (const { name, value } of walkDeclarations(darkScss)) {
    dark.set(name, value);
  }

  const tokens: SemanticToken[] = [];
  for (const { group, name, value } of walkDeclarations(lightScss)) {
    if (name.startsWith('--color-')) {
      continue;
    }

    tokens.push({ name, light: value, dark: dark.get(name), group });
  }

  return tokens;
}

/** Pulls every `@utility` block out of `tailwind.css`, with its group heading. */
function* walkUtilities(
  tailwindCss: string,
): Generator<{ group: string; utility: string; body: string }> {
  const pattern = /(?:\/\*\s*-+\s*([^*]+?)\s*-+\s*\*\/)|@utility\s+([\w-]+)\s*\{([^}]*)\}/g;
  let group = 'Utilities';
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(tailwindCss)) !== null) {
    if (match[1]) {
      group = match[1].trim();
      continue;
    }

    yield { group, utility: match[2], body: match[3] };
  }
}

/** Parses the `text-*` type scale — the sizes, line heights and weights. */
export function parseTypeScale(tailwindCss: string): TypeStyle[] {
  const styles: TypeStyle[] = [];

  for (const { utility, body } of walkUtilities(tailwindCss)) {
    if (!utility.startsWith('text-')) {
      continue;
    }

    // Comments have to go before the split, not after: the source annotates
    // each value on the far side of its semicolon (`font-size: 0.875rem; /* 14px */`),
    // so splitting first leaves the comment glued to the *next* property name
    // and that declaration is then silently dropped.
    const declarations: Record<string, string> = {};
    for (const line of body.replace(/\/\*[\s\S]*?\*\//g, '').split(';')) {
      const [property, ...rest] = line.split(':');
      if (rest.length === 0) {
        continue;
      }

      const name = property.trim();
      const value = rest.join(':').trim();
      if (name && value) {
        declarations[name] = value;
      }
    }

    // A token-backed colour utility is not a type style.
    if (!('font-size' in declarations)) {
      continue;
    }

    styles.push({ utility, declarations });
  }

  return styles;
}

/** Parses the token-backed utilities: which class sets which property. */
export function parseTokenUtilities(tailwindCss: string): TokenUtility[] {
  const utilities: TokenUtility[] = [];

  for (const { group, utility, body } of walkUtilities(tailwindCss)) {
    const match = body.match(/([\w-]+)\s*:\s*var\((--[\w-]+)\)/);
    if (!match) {
      continue;
    }

    utilities.push({ utility, property: match[1], token: match[2], group });
  }

  return utilities;
}

/**
 * Resolves a token to a literal colour by following `var()` references through
 * the palette, so a page can show the actual hex a token renders as.
 */
export function resolveColor(
  value: string,
  palette: readonly PaletteGroup[],
  depth = 0,
): string | undefined {
  if (depth > 8) {
    return undefined;
  }

  const literal = value.trim();
  if (/^(#|rgb|hsl|oklch|transparent$|currentColor$)/i.test(literal)) {
    return literal;
  }

  const reference = literal.match(/^var\((--[\w-]+)\)$/);
  if (!reference) {
    return undefined;
  }

  for (const group of palette) {
    for (const entry of group.entries) {
      if (entry.name === reference[1]) {
        return resolveColor(entry.value, palette, depth + 1);
      }
    }
  }

  return undefined;
}
