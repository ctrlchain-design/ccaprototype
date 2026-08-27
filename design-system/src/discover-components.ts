/**
 * Finds every Angular component in the repo that ships its own stylesheet, and
 * works out the selector its `:host` resolves to.
 *
 * The curated registry in components.ts covers the components the documentation
 * pages render. This walk covers everything else, so the exported bundle can
 * offer a designer the complete set rather than a hand-picked subset.
 *
 * A component's root selector comes from, in order of preference:
 *  1. the `class` in its `host` block — what Angular actually puts on the element
 *  2. its element selector (`cca-avatar`)
 *  3. its attribute selector (`button[ccaButton]` -> `[ccaButton]`)
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { basename, dirname, join, relative } from 'node:path';

import { type ComponentStyleSource } from './components.js';

/** Directories never worth walking into. */
const SKIP_DIRECTORIES = new Set(['node_modules', 'dist', '.git', '.nx', 'coverage', '.angular']);

/** A discovered component, with everything the compiler and the index need. */
export interface DiscoveredComponent extends ComponentStyleSource {
  /** Angular selector string, verbatim from the decorator. */
  readonly selector: string;
  /** Library or app the component belongs to, e.g. `libs/ui`. */
  readonly owner: string;
  /** Component directory name, used as the emitted file name. */
  readonly slug: string;
}

/** Recursively collects files matching `suffix` under `root`. */
function walk(root: string, suffix: string, found: string[] = []): string[] {
  let entries: string[];
  try {
    entries = readdirSync(root);
  } catch {
    return found;
  }

  for (const entry of entries) {
    if (SKIP_DIRECTORIES.has(entry)) {
      continue;
    }

    const path = join(root, entry);
    // `throwIfNoEntry: false` returns undefined for a broken symlink or a file
    // that vanished mid-walk, which is cheaper than a try/catch per entry.
    const stats = statSync(path, { throwIfNoEntry: false });
    if (!stats) {
      continue;
    }

    if (stats.isDirectory()) {
      walk(path, suffix, found);
    } else if (entry.endsWith(suffix)) {
      found.push(path);
    }
  }

  return found;
}

/** Extracts the `selector` string from a component decorator. */
function readSelector(source: string): string | undefined {
  return source.match(/selector:\s*['"`]([^'"`]+)['"`]/)?.[1];
}

/**
 * Extracts the `class` from a component's `host` block. Only a plain string
 * literal is read — a computed host class cannot be resolved statically, and
 * guessing would produce selectors that match nothing.
 */
function readHostClass(source: string): string | undefined {
  const host = source.match(/host:\s*\{([\s\S]*?)\n\s*\}/)?.[1];
  const hostClass = host?.match(/(?:^|[\s,{])class:\s*['"`]([^'"`]+)['"`]/)?.[1];

  // A multi-class host string resolves to the first class, which is the one
  // Angular's own styles key off.
  return hostClass?.trim().split(/\s+/)[0];
}

/** Turns an Angular selector into the plain CSS selector `:host` becomes. */
export function rootSelectorFor(selector: string, hostClass?: string): string | undefined {
  if (hostClass) {
    return `.${hostClass}`;
  }

  // Take the first alternative: `button[ccaButton], a[ccaButton]`.
  const first = selector.split(',')[0].trim();

  // A bare element selector is the common case.
  if (/^[a-z][\w-]*$/i.test(first)) {
    return first;
  }

  // `button[ccaButton]` -> `[ccaButton]`, so both host tags match.
  const attribute = first.match(/\[([\w-]+)\]/);
  if (attribute) {
    return `[${attribute[1]}]`;
  }

  if (first.startsWith('.')) {
    return first;
  }

  return undefined;
}

/** Which library or app a path belongs to, for grouping in the index. */
function ownerOf(repoRelativePath: string): string {
  const parts = repoRelativePath.split('/');

  if (parts[0] === 'libs') {
    return parts.slice(0, 3).join('/');
  }
  if (parts[0] === 'apps') {
    return parts.slice(0, 2).join('/');
  }

  return parts[0];
}

/** A component whose stylesheet could not be attributed to a selector. */
export interface DiscoverySkip {
  readonly scss: string;
  readonly reason: string;
}

/** Result of the discovery walk. */
export interface DiscoveryResult {
  readonly components: DiscoveredComponent[];
  readonly skipped: DiscoverySkip[];
}

/**
 * Walks `libs/` and `apps/` for component stylesheets. Empty stylesheets and
 * ones whose selector cannot be resolved are reported rather than dropped, so
 * the bundle's coverage is always an explicit number.
 */
export function discoverComponents(repoRoot: string): DiscoveryResult {
  const components: DiscoveredComponent[] = [];
  const skipped: DiscoverySkip[] = [];
  const seenSlugs = new Map<string, number>();

  const stylesheets = [
    ...walk(join(repoRoot, 'libs'), '.component.scss'),
    ...walk(join(repoRoot, 'apps'), '.component.scss'),
  ];

  for (const absolutePath of stylesheets) {
    const scss = relative(repoRoot, absolutePath).replace(/\\/g, '/');
    const contents = readFileSync(absolutePath, 'utf8');

    // `@reference` alone produces no rules, so the file has nothing to offer.
    const hasRules = contents.replace(/@reference[^;]*;/g, '').trim().length > 0;
    if (!hasRules) {
      skipped.push({ scss, reason: 'stylesheet has no rules' });
      continue;
    }

    const tsPath = absolutePath.replace(/\.scss$/, '.ts');
    let componentSource: string;
    try {
      componentSource = readFileSync(tsPath, 'utf8');
    } catch {
      skipped.push({ scss, reason: 'no sibling component.ts' });
      continue;
    }

    const selector = readSelector(componentSource);
    if (!selector) {
      skipped.push({ scss, reason: 'no selector in the decorator' });
      continue;
    }

    const rootSelector = rootSelectorFor(selector, readHostClass(componentSource));
    if (!rootSelector) {
      skipped.push({ scss, reason: `unsupported selector: ${selector}` });
      continue;
    }

    // Name the emitted file after the component directory, disambiguating the
    // handful of repeated names across libraries.
    const base = basename(dirname(absolutePath));
    const count = seenSlugs.get(base) ?? 0;
    seenSlugs.set(base, count + 1);
    const slug = count === 0 ? base : `${base}-${count + 1}`;

    components.push({
      scss,
      rootSelector,
      label: selector,
      selector,
      owner: ownerOf(scss),
      slug,
    });
  }

  components.sort((a, b) => a.slug.localeCompare(b.slug));

  return { components, skipped };
}
