/**
 * Extracts Angular Material's structural CSS out of its shipped JS bundles.
 *
 * Material's component styles are compiled into `styles: ["..."]` string
 * literals inside the fesm bundles, not into any CSS file on disk, so a
 * standalone page has no way to link them. Reading them out of the bundles
 * keeps the design system on the exact Material version the app resolves —
 * `@angular/material/prebuilt-themes/*.css` would only give theme tokens, not
 * the `.mdc-*` structure that determines a control's real metrics.
 *
 * Each style string is emitted twice per component (once in the compiled `ɵcmp`
 * definition, once in the `setClassMetadata` call), so identical strings are
 * deduplicated — that alone halves the output.
 *
 * Also pulls in the plain-CSS bases of the third-party libraries the platform
 * overrides: ng-select and tippy (the app's real tooltip — `matTooltip` is
 * unused).
 */

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/** One extracted stylesheet plus where it came from. */
export interface ExtractedStyles {
  readonly source: string;
  readonly css: string;
}

/** A named output file's worth of base CSS. */
export interface MaterialBaseGroup {
  readonly name: string;
  readonly css: string;
  readonly sources: readonly string[];
}

/**
 * Groups the fesm bundles into output files, so no single emitted stylesheet
 * grows unwieldy and a reader can find a component's base CSS by name.
 * Bundle names are matched as prefixes against the file name.
 */
const BUNDLE_GROUPS: ReadonlyArray<{ name: string; bundles: readonly string[] }> = [
  {
    name: 'core',
    bundles: [
      'button',
      '_icon-button-chunk',
      'icon',
      'card',
      'divider',
      'grid-list',
      'progress-bar',
      'progress-spinner',
      '_ripple-chunk',
      '_structural-styles-chunk',
      'toolbar',
    ],
  },
  {
    name: 'forms',
    bundles: [
      '_form-field-chunk',
      '_internal-form-field-chunk',
      'input',
      'select',
      '_option-chunk',
      'autocomplete',
      'checkbox',
      '_pseudo-checkbox-chunk',
      'radio',
      'slide-toggle',
      'slider',
      'button-toggle',
      'datepicker',
      'timepicker',
    ],
  },
  {
    name: 'data',
    bundles: ['table', 'sort', 'paginator', 'list', 'tree', 'chips', 'badge'],
  },
  {
    name: 'nav',
    bundles: ['tabs', 'menu', 'sidenav', 'stepper', 'expansion'],
  },
  {
    name: 'overlay',
    bundles: ['dialog', 'snack-bar', 'bottom-sheet', '_tooltip-chunk'],
  },
];

/**
 * Third-party CSS files that ship as plain CSS and are used as-is.
 *
 * The CDK prebuilt sheets matter more than they look: overlays, dialog
 * backdrops and the visually-hidden helpers all live there rather than in
 * `@angular/material`, so without them a dialog preview has no scrim and reads
 * as content floating on the page.
 */
const VENDOR_CSS = [
  'node_modules/@angular/cdk/overlay-prebuilt.css',
  'node_modules/@angular/cdk/a11y-prebuilt.css',
  'node_modules/@angular/cdk/text-field-prebuilt.css',
  'node_modules/@ng-select/ng-select/themes/default.theme.css',
  'node_modules/tippy.js/dist/tippy.css',
  'node_modules/tippy.js/themes/light.css',
  'node_modules/tippy.js/animations/shift-away.css',
];

/**
 * Pulls every `styles: [...]` array out of one fesm bundle.
 *
 * The literals are JS-escaped, so each is parsed with `JSON.parse` rather than
 * unescaped by hand — a hand-rolled unescape silently corrupts the
 * `content: "\\e900"` declarations in icon-font rules.
 */
function extractStyleLiterals(source: string): string[] {
  const styles: string[] = [];
  const marker = /styles:\s*\[/g;
  let match: RegExpExecArray | null;

  while ((match = marker.exec(source)) !== null) {
    let index = match.index + match[0].length;

    while (index < source.length) {
      const char = source[index];
      if (char === ']') {
        break;
      }

      if (char === '"') {
        const start = index;
        index++;

        while (index < source.length) {
          if (source[index] === '\\') {
            index += 2;
            continue;
          }
          if (source[index] === '"') {
            break;
          }
          index++;
        }

        try {
          const parsed: unknown = JSON.parse(source.slice(start, index + 1));
          if (typeof parsed === 'string' && parsed.trim().length > 0) {
            styles.push(parsed);
          }
        } catch {
          // Not a valid JSON string literal, so not a style block.
        }
      }

      index++;
    }
  }

  return styles;
}

/** Which output group a bundle file belongs to. */
function groupFor(fileName: string): string {
  const base = fileName.replace(/\.mjs$/, '');

  for (const group of BUNDLE_GROUPS) {
    if (group.bundles.includes(base)) {
      return group.name;
    }
  }

  return 'core';
}

/**
 * Reads Material's structural CSS from every fesm bundle that carries styles,
 * grouped into output files. `seen` spans all groups so a style string shared
 * between bundles is emitted once.
 */
export function extractMaterialStyles(repoRoot: string): MaterialBaseGroup[] {
  const fesmDir = join(repoRoot, 'node_modules/@angular/material/fesm2022');

  if (!existsSync(fesmDir)) {
    throw new Error(`Angular Material fesm bundle not found at ${fesmDir}`);
  }

  const seen = new Set<string>();
  const grouped = new Map<string, { chunks: string[]; sources: string[] }>();

  for (const file of readdirSync(fesmDir).sort()) {
    if (!file.endsWith('.mjs')) {
      continue;
    }

    const unique = extractStyleLiterals(readFileSync(join(fesmDir, file), 'utf8')).filter(
      (style) => {
        const key = style.trim();
        if (seen.has(key)) {
          return false;
        }
        seen.add(key);
        return true;
      },
    );

    if (unique.length === 0) {
      continue;
    }

    const name = groupFor(file);
    const entry = grouped.get(name) ?? { chunks: [], sources: [] };
    entry.chunks.push(`/* ---- ${file} ---- */\n${unique.join('\n')}`);
    entry.sources.push(`@angular/material/fesm2022/${file}`);
    grouped.set(name, entry);
  }

  // Preserve the declared group order so the emitted @import list is stable.
  const order = BUNDLE_GROUPS.map((group) => group.name);

  return [...grouped]
    .sort(([a], [b]) => order.indexOf(a) - order.indexOf(b))
    .map(([name, entry]) => ({
      name,
      css: entry.chunks.join('\n\n'),
      sources: entry.sources,
    }));
}

/** Reads the plain-CSS bases of the third-party libraries the platform themes. */
export function extractVendorStyles(repoRoot: string): MaterialBaseGroup | undefined {
  const chunks: string[] = [];
  const sources: string[] = [];

  for (const relativePath of VENDOR_CSS) {
    const absolutePath = join(repoRoot, relativePath);
    if (!existsSync(absolutePath)) {
      continue;
    }

    chunks.push(`/* ---- ${relativePath} ---- */\n${readFileSync(absolutePath, 'utf8')}`);
    sources.push(relativePath);
  }

  if (chunks.length === 0) {
    return undefined;
  }

  return { name: 'vendor', css: chunks.join('\n\n'), sources };
}

/** Builds the full base layer: Material structure first, then vendor CSS. */
export function buildMaterialBaseLayer(repoRoot: string): MaterialBaseGroup[] {
  const material = extractMaterialStyles(repoRoot);
  const vendor = extractVendorStyles(repoRoot);

  return vendor ? [...material, vendor] : material;
}
