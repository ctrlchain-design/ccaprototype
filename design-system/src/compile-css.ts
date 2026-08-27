/**
 * Compiles the platform's real stylesheets to static CSS.
 *
 * Two jobs:
 *  - the global layer: `apps/platform/src/styles.scss` through Sass and then
 *    Tailwind, which yields the design tokens, every `@utility`, the Material
 *    overrides in `shared/styles/components/` and the global element styles in
 *    one file — exactly what the browser gets in production.
 *  - the component layer: each in-scope `*.component.scss`, compiled and then
 *    de-Angularized.
 *
 * Compiling the app's own entry point rather than re-listing its imports is
 * deliberate: a stylesheet added to `styles.scss` shows up in the design system
 * automatically instead of silently going missing.
 */

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';

import postcss from 'postcss';
import tailwind from '@tailwindcss/postcss';
import * as sass from 'sass';

import { deAngularize, type DeAngularizeWarning } from './de-angularize.js';
import { type ComponentStyleSource } from './components.js';

/** Sass deprecations that come from dependencies and are not actionable here. */
const SILENCED_DEPRECATIONS = ['import', 'global-builtin', 'legacy-js-api'] as const;

/** Compiles one SCSS entry point to CSS, without running Tailwind. */
function compileScss(absolutePath: string, repoRoot: string): string {
  const result = sass.compile(absolutePath, {
    loadPaths: [join(repoRoot, 'node_modules'), repoRoot, dirname(absolutePath)],
    quietDeps: true,
    silenceDeprecations: [...SILENCED_DEPRECATIONS],
  });

  return result.css;
}

/**
 * Compiles the platform's global stylesheet. Tailwind runs second so that
 * `@apply` and `@utility` in the SCSS are resolved against the real theme.
 */
export async function compileGlobalLayer(repoRoot: string): Promise<string> {
  const entry = join(repoRoot, 'apps/platform/src/styles.scss');
  const compiled = compileScss(entry, repoRoot);

  const processed = await postcss([tailwind()]).process(compiled, {
    from: entry,
    to: undefined,
  });

  return processed.css;
}

/** One component's compiled, de-Angularized CSS. */
export interface CompiledComponent {
  readonly label: string;
  readonly scss: string;
  readonly css: string;
  readonly warnings: readonly DeAngularizeWarning[];
}

/**
 * Compiles and de-Angularizes each component stylesheet.
 *
 * Several component stylesheets use `@apply`, which needs the platform theme in
 * scope to resolve. That is what `@reference` is for: it makes the theme's
 * utilities and variables available without emitting a single byte of it.
 *
 * `@import 'tailwindcss'` would also resolve `@apply`, but it emits preflight,
 * the theme and every utility alongside the component rules — a 220 KB
 * component layer that duplicates the global one and, worse, re-applies
 * preflight after it.
 */
export async function compileComponentLayer(
  repoRoot: string,
  components: readonly ComponentStyleSource[],
): Promise<CompiledComponent[]> {
  const themePath = join(repoRoot, 'shared/styles/tailwind/tailwind.css').replace(/\\/g, '/');
  const compiled: CompiledComponent[] = [];

  for (const component of components) {
    const absolutePath = join(repoRoot, component.scss);
    const plainCss = compileScss(absolutePath, repoRoot);
    const { css, warnings } = deAngularize(plainCss, component.rootSelector);

    const needsTheme = /@apply|@variant|theme\(/.test(css);
    let resolved = css;

    if (needsTheme) {
      // Several component stylesheets already reference the theme themselves
      // (`@reference '#tailwind-config.css'`), so only supply one when missing.
      const source = css.includes('@reference') ? css : `@reference '${themePath}';\n${css}`;

      const processed = await postcss([tailwind()]).process(source, {
        from: absolutePath,
        to: undefined,
      });
      resolved = processed.css;
    }

    compiled.push({
      label: component.label,
      scss: component.scss,
      css: resolved.trim(),
      warnings,
    });
  }

  return compiled;
}

/**
 * Whether a path exists with exactly this spelling.
 *
 * `existsSync` is case-insensitive on Windows and macOS, which matched
 * `shared/assets/images/CTRLCHAIN.svg` — an unrelated logo — when looking for
 * the icon font's `CtrlChain.svg`. That would have shipped the wrong file, and
 * only shown up on a case-sensitive filesystem.
 */
function existsWithExactCase(path: string): boolean {
  if (!existsSync(path)) {
    return false;
  }

  try {
    return readdirSync(dirname(path)).includes(basename(path));
  } catch {
    return false;
  }
}

/** An asset the compiled CSS refers to, and where it belongs in the bundle. */
export interface ReferencedAsset {
  /** Absolute path in the repo. */
  readonly from: string;
  /** Bundle-relative destination, e.g. `assets/images/background.svg`. */
  readonly to: string;
}

/** Result of rewriting the asset URLs in a stylesheet. */
export interface RewrittenAssets {
  readonly css: string;
  readonly assets: readonly ReferencedAsset[];
  /** URLs that could not be resolved to a file in the repo. */
  readonly unresolved: readonly string[];
}

/**
 * Rewrites every local `url()` in the compiled CSS to a path inside the bundle,
 * and reports the files that have to be copied alongside it.
 *
 * The compiled CSS keeps whatever relative paths the SCSS partials wrote, which
 * point back into the repo (`../../../shared/assets/...`). Those resolve to
 * nothing once the stylesheet is served from `ds/`, and a missing background or
 * font fails silently — so each one is redirected at build time and the file is
 * copied in.
 *
 * Font files go to `assets/icons/` because that is where the published design
 * project already keeps them; everything else goes to `assets/images/`.
 */
export function rewriteAssetUrls(css: string, repoRoot: string): RewrittenAssets {
  const assets = new Map<string, ReferencedAsset>();
  const unresolved = new Set<string>();

  // The global layer is compiled from apps/platform/src/styles.scss, so that is
  // what its relative URLs are relative to.
  const cssOrigin = join(repoRoot, 'apps/platform/src');

  const rewritten = css.replace(
    /url\((['"]?)([^'")]+)\1\)/g,
    (match, quote: string, rawUrl: string) => {
      if (/^(data:|https?:|\/\/)/i.test(rawUrl)) {
        return match;
      }

      // Keep the whole query *and* fragment — the SVG font needs `#ChainCargo`,
      // and splitting with a limit silently dropped it.
      const parts = /^([^?#]*)([?#].*)?$/.exec(rawUrl);
      if (!parts) {
        return match;
      }

      const pathPart = parts[1];
      const suffix = parts[2] ?? '';
      const fileName = basename(pathPart);

      const candidates = [
        resolve(cssOrigin, pathPart),
        join(repoRoot, 'shared/assets/icons', fileName),
        join(repoRoot, 'shared/assets/images', fileName),
      ];
      const source = candidates.find(existsWithExactCase);

      if (!source) {
        unresolved.add(rawUrl);
        return match;
      }

      // Mirror the repo's own split, so the icon font keeps the
      // `assets/icons/` path the published design project already uses.
      const directory = source.replace(/\\/g, '/').includes('/shared/assets/icons/')
        ? 'assets/icons'
        : 'assets/images';
      const destination = `${directory}/${fileName}`;
      assets.set(destination, { from: source, to: destination });

      return `url(${quote}../${destination}${suffix}${quote})`;
    },
  );

  return { css: rewritten, assets: [...assets.values()], unresolved: [...unresolved] };
}

/** Reads a repo file as UTF-8 text. */
export function readRepoFile(repoRoot: string, relativePath: string): string {
  return readFileSync(join(repoRoot, relativePath), 'utf8');
}
