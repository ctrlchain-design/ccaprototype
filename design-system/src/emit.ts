/**
 * Writes the export bundle to disk and assembles the cascade entry point.
 *
 * Everything is imported **unlayered**, in the order material → platform → cca.
 *
 * Cascade layers were the obvious tool here and they are the wrong one. A layer
 * outranks specificity, and the platform layer carries Tailwind's preflight,
 * which resets `border-width: 0` on `*`. Putting Material in a lower layer let
 * that universal reset beat every Material border — a form field's outline
 * silently disappeared even though `.mat-mdc-notch-piece` is far more specific.
 *
 * Unlayered is also what the running app actually does: one global stylesheet
 * plus the component styles Angular injects, with specificity deciding and
 * document order breaking ties. So `*` loses to `.mat-mdc-notch-piece` on
 * specificity, exactly as it does in production.
 *
 * Order still matters for genuine ties, which is why the CtrlChain component
 * styles come last: in the app, view encapsulation gives them a specificity
 * boost (`.cca-btn[_nghost-x]`) that the de-Angularized selectors lose, and
 * being last recovers the same outcome. Globals that beat a component in the
 * app do so with `!important` — the legacy `.button-*` helpers — and those still
 * win from anywhere.
 */

import { copyFileSync, existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

import postcss from 'postcss';

/** Keeps each emitted stylesheet inspectable and well inside upload limits. */
const MAX_FILE_BYTES = 200 * 1024;

/** A file to write into the bundle. */
export interface EmittedFile {
  /** Path relative to the bundle root, matching its path in the project. */
  readonly path: string;
  readonly contents: string;
}

/** Writes one file, creating parent directories as needed. */
export function writeBundleFile(bundleRoot: string, file: EmittedFile): void {
  const absolutePath = join(bundleRoot, file.path);
  mkdirSync(dirname(absolutePath), { recursive: true });
  writeFileSync(absolutePath, file.contents, 'utf8');
}

/**
 * Brand lockups the shell templates reference, copied under the same
 * `assets/images/` path the app uses so the markup in the previews is the same
 * markup a developer would write.
 */
const BRAND_IMAGES = [
  'ctrlchain-logo-white.svg',
  'ctrlchain-logo-green.svg',
  'ctrlchain-text-green.svg',
  'ctrlchain-text-dark.svg',
  'CCA-logo-green.svg',
  'CCA-logo-text-green.svg',
  'CCA-logo-text-white.svg',
];

/**
 * Copies the icon font and the brand lockups into the bundle so the folder
 * renders offline. The emitted CSS already points at `../assets/icons/`, which
 * is where the published design project keeps the font too, so one path serves
 * both.
 */
export function copyBrandAssets(
  repoRoot: string,
  bundleRoot: string,
  referenced: readonly { from: string; to: string }[] = [],
): string[] {
  const copied: string[] = [];

  // Assets the compiled CSS points at — backgrounds, the icon font — whose URLs
  // the build has already redirected into the bundle.
  for (const asset of referenced) {
    const target = join(bundleRoot, asset.to);
    mkdirSync(dirname(target), { recursive: true });
    copyFileSync(asset.from, target);
    copied.push(asset.to);
  }

  const iconSource = join(repoRoot, 'shared/assets/icons');
  const iconTarget = join(bundleRoot, 'assets/icons');
  mkdirSync(iconTarget, { recursive: true });

  for (const name of readdirSync(iconSource)) {
    if (!/^CtrlChain\.(css|eot|svg|ttf|woff2?)$/.test(name)) {
      continue;
    }

    copyFileSync(join(iconSource, name), join(iconTarget, name));
    copied.push(`assets/icons/${name}`);
  }

  const imageSource = join(repoRoot, 'shared/assets/images');
  const imageTarget = join(bundleRoot, 'assets/images');
  mkdirSync(imageTarget, { recursive: true });

  for (const name of BRAND_IMAGES) {
    const from = join(imageSource, name);
    if (!existsSync(from)) {
      continue;
    }

    copyFileSync(from, join(imageTarget, name));
    copied.push(`assets/images/${name}`);
  }

  return copied;
}

/**
 * Splits a stylesheet into chunks below the size budget, cutting only between
 * top-level rules so no rule is ever broken across files. Returns a single
 * chunk when the input already fits.
 */
export function splitCss(css: string, maxBytes = MAX_FILE_BYTES): string[] {
  if (Buffer.byteLength(css, 'utf8') <= maxBytes) {
    return [css];
  }

  const root = postcss.parse(css);
  const chunks: string[] = [];
  let current = '';

  for (const node of root.nodes) {
    // Declarations and body-less at-rules (`@layer theme, base;`, `@charset`)
    // are statements: postcss drops their terminating semicolon on toString(),
    // and without it the next rule is swallowed into the at-rule's prelude.
    const isStatement =
      node.type === 'decl' || (node.type === 'atrule' && node.nodes === undefined);
    const serialized = `${node.toString()}${isStatement ? ';' : ''}\n`;

    if (current !== '' && Buffer.byteLength(current + serialized, 'utf8') > maxBytes) {
      chunks.push(current);
      current = '';
    }

    current += serialized;
  }

  if (current !== '') {
    chunks.push(current);
  }

  return chunks;
}

/**
 * One stylesheet group. `stage` fixes its position in the import order — and
 * only that: nothing is wrapped in a cascade layer, so specificity still decides
 * every real conflict.
 */
export interface LayerGroup {
  readonly stage: 'material' | 'platform' | 'cca';
  /** File-name stem, e.g. `material-forms`. */
  readonly stem: string;
  readonly css: string;
}

/** Import order: Material structure, then platform globals, then components. */
const STAGE_ORDER: ReadonlyArray<LayerGroup['stage']> = ['material', 'platform', 'cca'];

/** Result of emitting the stylesheet layers. */
export interface EmittedStyles {
  readonly files: readonly EmittedFile[];
  /** Paths in cascade order, for the entry point's `@import` list. */
  readonly importPaths: readonly string[];
}

/**
 * The documentation shell (`shell/shell.css`) reads its typography through
 * `--font-ui` / `--font-display` / `--font-large`, which used to be defined in
 * `colors_and_type.css`. Generated pages do not link that file — its token
 * layer is superseded — so the three variables are re-declared here from the
 * platform's real stack.
 *
 * All three map to the same family on purpose: the platform loads Roboto and
 * nothing else, so a shell that asks for a display face should still render
 * what the app renders.
 */
function shellFontAliases(bodyFontStack: string): string {
  return [
    '',
    '/*',
    ' * Unlayered on purpose: shell/shell.css consumes these, and nothing else',
    ' * defines them. The platform ships one family, so all three resolve to it.',
    ' */',
    ':root {',
    `  --font-ui: ${bodyFontStack};`,
    `  --font-display: ${bodyFontStack};`,
    `  --font-large: ${bodyFontStack};`,
    '}',
    '',
  ].join('\n');
}

/**
 * Emits every layer group under `ds/`, splitting oversized files, and builds
 * `ds/index.css` — the single stylesheet a preview page links.
 */
export function emitStyleLayers(
  groups: readonly LayerGroup[],
  bodyFontStack: string,
): EmittedStyles {
  const files: EmittedFile[] = [];
  const imports: string[] = [];

  const ordered = [...groups].sort(
    (a, b) => STAGE_ORDER.indexOf(a.stage) - STAGE_ORDER.indexOf(b.stage),
  );

  for (const group of ordered) {
    const chunks = splitCss(group.css);

    chunks.forEach((chunk, index) => {
      const suffix = chunks.length > 1 ? `-${String(index + 1).padStart(2, '0')}` : '';
      const path = `ds/${group.stem}${suffix}.css`;

      files.push({ path, contents: chunk });
      imports.push(`@import url('./${group.stem}${suffix}.css');`);
    });
  }

  const entry = [
    '/*',
    ' * CtrlChain design system — generated from the platform source.',
    ' *',
    ' * Do not edit by hand. Regenerate with:',
    ' *   pnpm design-system:export',
    ' *',
    ' * Import order mirrors the running app: Angular Material structural CSS,',
    ' * then the platform globals, then the CtrlChain component styles.',
    ' *',
    ' * Deliberately NOT wrapped in @layer. A cascade layer outranks specificity,',
    ' * and the platform CSS carries Tailwind preflight — which resets',
    ' * `border-width: 0` on `*`. Layered, that universal reset beat every',
    ' * Material border and form-field outlines vanished. Unlayered, `*` loses to',
    ' * `.mat-mdc-notch-piece` on specificity, exactly as it does in production.',
    ' */',
    '',
    ...imports,
    shellFontAliases(bodyFontStack),
  ].join('\n');

  files.push({ path: 'ds/index.css', contents: entry });
  imports.push('ds/index.css');

  return { files, importPaths: imports };
}

/**
 * The font stylesheet. The platform loads Roboto and nothing else
 * (apps/platform/src/index.html), so the two extra families the design project
 * used to load are dropped here rather than carried forward.
 */
export function buildFontsCss(): string {
  return [
    '/*',
    ' * Generated — mirrors the font loading in apps/platform/src/index.html.',
    ' *',
    ' * Roboto is the only family the platform loads. IBM Plex Sans and Inter',
    ' * are deliberately absent: no platform surface uses them.',
    ' */',
    '',
    "@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');",
    '',
  ].join('\n');
}
