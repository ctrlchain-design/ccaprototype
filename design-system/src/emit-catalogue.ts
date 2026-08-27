/**
 * Emits the designer-facing half of the bundle: the token exports, one
 * stylesheet per component, a browsable index and a manifest.
 *
 * The documentation pages answer "what does this look like and how is it used".
 * These files answer a different question — "give me the values, or give me
 * just this one component's CSS" — which is what someone reaches for when
 * building a mock outside the app or wiring tokens into a design tool.
 */

import { type CompiledComponent } from './compile-css.js';
import { type DiscoveredComponent } from './discover-components.js';
import { type IconEntry } from './parse-component-css.js';
import {
  type PaletteGroup,
  type SemanticToken,
  type TokenUtility,
  type TypeStyle,
  resolveColor,
} from './parse-tokens.js';
import { escapeHtml } from './page-shell.js';

/** Everything the catalogue needs from the build. */
export interface CatalogueInput {
  readonly palette: readonly PaletteGroup[];
  readonly tokens: readonly SemanticToken[];
  readonly utilities: readonly TokenUtility[];
  readonly typeScale: readonly TypeStyle[];
  readonly icons: readonly IconEntry[];
  /** Discovery metadata paired with the compiled CSS, in emit order. */
  readonly components: readonly {
    readonly meta: DiscoveredComponent;
    readonly compiled: CompiledComponent;
  }[];
  /** Component stylesheets that were found but had nothing to emit. */
  readonly skipped: readonly { readonly scss: string; readonly reason: string }[];
  /** The documented pages, for the index's first section. */
  readonly documentedPages: readonly { readonly path: string; readonly title: string }[];
  /** Live previews rendered on the index, one per documented page. */
  readonly gallery: readonly {
    readonly path: string;
    readonly title: string;
    readonly note: string;
    readonly preview: string;
  }[];
}

/** A file to write into the bundle. */
export interface CatalogueFile {
  readonly path: string;
  readonly contents: string;
}

/** Components that make up the shared design system rather than one feature. */
const DESIGN_SYSTEM_OWNERS = new Set(['libs/ui/src', 'apps/platform']);

/**
 * Design tokens as JSON, with each value resolved to a literal colour
 * alongside the `var()` reference it is declared as. Design tools import the
 * literal; developers want the reference, because that is what re-themes.
 */
function tokensJson(input: CatalogueInput): string {
  const groups: Record<string, Record<string, unknown>> = {};

  for (const token of input.tokens) {
    const name = token.name.replace(/^--/, '');
    groups[token.group] ??= {};
    groups[token.group][name] = {
      light: { reference: token.light, value: resolveColor(token.light, input.palette) ?? null },
      dark: token.dark
        ? { reference: token.dark, value: resolveColor(token.dark, input.palette) ?? null }
        : null,
      utilities: input.utilities
        .filter((utility) => utility.token === token.name)
        .map((utility) => ({ class: utility.utility, property: utility.property })),
    };
  }

  return `${JSON.stringify(
    {
      $comment:
        'Generated from shared/styles/tailwind/{light,dark}-mode.scss. Do not hand-edit; run pnpm design-system:export.',
      tokenCount: input.tokens.length,
      groups,
    },
    null,
    2,
  )}\n`;
}

/** The raw colour ramps as JSON. */
function paletteJson(input: CatalogueInput): string {
  const ramps: Record<string, Record<string, string>> = {};

  for (const group of input.palette) {
    const name = group.group.replace(/^Colors - /, '');
    ramps[name] = {};
    for (const entry of group.entries) {
      ramps[name][entry.name.replace(/^--color-/, '')] = entry.value;
    }
  }

  return `${JSON.stringify(
    {
      $comment:
        'Raw ramps from shared/styles/tailwind/colors.css and new-cold.css. Use the semantic tokens in tokens.json for anything that ships.',
      ramps,
    },
    null,
    2,
  )}\n`;
}

/** The type scale and the icon inventory as JSON. */
function typographyJson(input: CatalogueInput): string {
  return `${JSON.stringify(
    {
      $comment:
        'Type utilities from shared/styles/tailwind/tailwind.css. Roboto is the only family.',
      fontFamily: 'Roboto',
      weights: [300, 400, 500, 700],
      styles: input.typeScale.map((style) => ({
        class: style.utility,
        ...style.declarations,
      })),
    },
    null,
    2,
  )}\n`;
}

/** The icon inventory as JSON. */
function iconsJson(input: CatalogueInput): string {
  return `${JSON.stringify(
    {
      $comment: 'CtrlChain icon font. Use <cca-icon icon="name" /> in the app.',
      fontFamily: 'CtrlChainIcons',
      count: input.icons.length,
      icons: input.icons.map((icon) => ({
        name: icon.name,
        class: `cca-icon-${icon.name}`,
        codepoint: icon.codepoint,
      })),
    },
    null,
    2,
  )}\n`;
}

/** Machine-readable inventory of the whole bundle. */
function manifestJson(input: CatalogueInput): string {
  return `${JSON.stringify(
    {
      $comment: 'Inventory of this bundle. Regenerate with pnpm design-system:export.',
      counts: {
        documentedPages: input.documentedPages.length,
        componentsWithCss: input.components.length,
        componentsWithoutCss: input.skipped.length,
        tokens: input.tokens.length,
        utilities: input.utilities.length,
        typeStyles: input.typeScale.length,
        icons: input.icons.length,
      },
      documentedPages: input.documentedPages,
      components: input.components.map(({ meta, compiled }) => ({
        slug: meta.slug,
        selector: meta.selector,
        rootSelector: meta.rootSelector,
        owner: meta.owner,
        source: meta.scss,
        css: `ds/components/${meta.slug}.css`,
        bytes: Buffer.byteLength(compiled.css, 'utf8'),
        isDesignSystem: DESIGN_SYSTEM_OWNERS.has(meta.owner),
      })),
      componentsWithoutCss: input.skipped,
    },
    null,
    2,
  )}\n`;
}

/** One stylesheet per component, each usable on its own. */
function componentFiles(input: CatalogueInput): CatalogueFile[] {
  return input.components.map(({ meta, compiled }) => ({
    path: `ds/components/${meta.slug}.css`,
    contents: [
      '/*',
      ` * ${meta.selector}`,
      ` * Source:  ${meta.scss}`,
      ` * :host resolves to:  ${meta.rootSelector}`,
      ' *',
      ' * Generated — de-Angularized from the component stylesheet. Needs the',
      ' * token layer to resolve its var() references: link ds/index.css, or at',
      ' * minimum the ds/platform-*.css files, before this file.',
      ' */',
      '',
      compiled.css,
      '',
    ].join('\n'),
  }));
}

/** Renders the index's component table for one owner group. */
function ownerSection(
  owner: string,
  entries: readonly CatalogueInput['components'][number][],
): string {
  const rows = entries
    .map(
      ({ meta, compiled }) =>
        '<tr>' +
        `<td><code>${escapeHtml(meta.selector)}</code></td>` +
        `<td><code>${escapeHtml(meta.rootSelector)}</code></td>` +
        `<td><a href="ds/components/${escapeHtml(meta.slug)}.css">${escapeHtml(meta.slug)}.css</a></td>` +
        `<td class="num">${(Buffer.byteLength(compiled.css, 'utf8') / 1024).toFixed(1)} KB</td>` +
        `<td><code class="src">${escapeHtml(meta.scss)}</code></td>` +
        '</tr>',
    )
    .join('\n');

  return [
    `<details${DESIGN_SYSTEM_OWNERS.has(owner) ? ' open' : ''}>`,
    `<summary><strong>${escapeHtml(owner)}</strong> <span class="count">${entries.length}</span></summary>`,
    '<div class="scroll"><table>',
    '<thead><tr><th>Selector</th><th>Root</th><th>Stylesheet</th><th class="num">Size</th><th>Source</th></tr></thead>',
    `<tbody>${rows}</tbody></table></div>`,
    '</details>',
  ].join('\n');
}

/**
 * The bundle's front door.
 *
 * Standalone on purpose: it links `ds/index.css` for its own styling like any
 * other page, but it does not depend on the documentation shell, so the folder
 * still opens cleanly when it has been copied or zipped somewhere else.
 */
function indexHtml(input: CatalogueInput): string {
  const byOwner = new Map<string, CatalogueInput['components'][number][]>();
  for (const entry of input.components) {
    const list = byOwner.get(entry.meta.owner) ?? [];
    list.push(entry);
    byOwner.set(entry.meta.owner, list);
  }

  // Design-system owners first, then the rest by size.
  const owners = [...byOwner].sort((a, b) => {
    const aDs = DESIGN_SYSTEM_OWNERS.has(a[0]) ? 0 : 1;
    const bDs = DESIGN_SYSTEM_OWNERS.has(b[0]) ? 0 : 1;
    return aDs - bDs || b[1].length - a[1].length;
  });

  // Each card renders the component itself. A list of filenames is not
  // something anyone can pick from without opening every page first.
  //
  // The card is a div and only the label is a link: several samples (the rail,
  // the tab bar) contain their own anchors, and nesting an <a> inside an <a> is
  // invalid — the browser closes the outer one early and eats the card.
  const pages = input.gallery
    .map(
      (entry) =>
        '<div class="gcard">' +
        `<div class="gcard-preview">${entry.preview}</div>` +
        `<a class="gcard-meta" href="${escapeHtml(entry.path)}">` +
        `<strong>${escapeHtml(entry.title)}</strong>` +
        `<span>${escapeHtml(entry.note)}</span></a></div>`,
    )
    .join('');

  const dataFiles = [
    [
      'tokens/tokens.json',
      `${input.tokens.length} semantic tokens, light and dark, with their utility classes`,
    ],
    [
      'tokens/palette.json',
      `${input.palette.reduce((n, g) => n + g.entries.length, 0)} raw colour steps`,
    ],
    ['tokens/typography.json', `${input.typeScale.length} type styles — Roboto only`],
    ['tokens/icons.json', `${input.icons.length} icon names and codepoints`],
    ['manifest.json', 'Inventory of every file in this bundle'],
  ]
    .map(
      ([path, description]) =>
        `<a class="card" href="${escapeHtml(path)}"><strong>${escapeHtml(path)}</strong>` +
        `<span>${escapeHtml(description)}</span></a>`,
    )
    .join('');

  const designSystemCount = input.components.filter((entry) =>
    DESIGN_SYSTEM_OWNERS.has(entry.meta.owner),
  ).length;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>CtrlChain Design System</title>
    <link rel="stylesheet" href="fonts/fonts.css" />
    <link rel="stylesheet" href="ds/index.css" />
    <style>
      body {
        margin: 0;
        background: var(--surface-neutral-default);
        color: var(--text-neutral-body);
        font-family: Roboto, 'Helvetica Neue', sans-serif;
      }
      /* The platform's brand watermark lives on body::before. It belongs to the
         app's chrome, not to this catalogue, where it sits behind the samples. */
      body::before { display: none; }
      .wrap { max-width: 1180px; margin: 0 auto; padding: 48px 32px 96px; }
      h1 { margin: 0 0 8px; }
      h2 { margin: 48px 0 8px; }
      p.lede { color: var(--text-neutral-subtitle); margin: 0 0 24px; max-width: 720px; }
      .cards { display: grid; gap: 12px; grid-template-columns: repeat(auto-fill, minmax(232px, 1fr)); }
      .card {
        display: flex; flex-direction: column; gap: 4px;
        padding: 14px 16px; border-radius: 8px; text-decoration: none;
        border: 1px solid var(--border-neutral-default);
        background: var(--surface-neutral-light);
        color: var(--text-neutral-body);
      }
      .card:hover { border-color: var(--border-brand-default); }
      .card span { font-size: 12px; color: var(--text-neutral-subtitle); }

      /* Gallery cards: the live sample on top, the label underneath. */
      .gallery {
        display: grid; gap: 16px;
        grid-template-columns: repeat(auto-fill, minmax(268px, 1fr));
      }
      .gcard {
        display: flex; flex-direction: column; overflow: hidden;
        border: 1px solid var(--border-neutral-default); border-radius: 10px;
        background: var(--surface-neutral-light);
        text-decoration: none; color: var(--text-neutral-body);
      }
      .gcard:hover { border-color: var(--border-brand-default); }
      .gcard-preview {
        display: flex; align-items: center; justify-content: center;
        flex-wrap: wrap; gap: 8px;
        padding: 20px; min-height: 132px;
        background: var(--surface-neutral-default);
        /* Absorbs the row's extra height so every card's label lines up. */
        flex: 1;
        /* Samples are real components at real sizes; keep an oversized one from
           stretching its card rather than scaling the whole grid to fit. */
        overflow: hidden;
      }
      .gcard-meta {
        display: flex; flex-direction: column; gap: 2px;
        padding: 12px 14px;
        border-top: 1px solid var(--border-neutral-default);
        text-decoration: none; color: var(--text-neutral-body);
      }
      .gcard-meta:hover { background: var(--surface-neutral-default); }
      .gcard-meta span { font-size: 12px; color: var(--text-neutral-subtitle); }
      details {
        border: 1px solid var(--border-neutral-default); border-radius: 8px;
        background: var(--surface-neutral-light); margin-bottom: 10px;
      }
      summary { cursor: pointer; padding: 12px 16px; }
      .count {
        display: inline-block; margin-left: 6px; padding: 1px 7px; border-radius: 999px;
        font-size: 11px; background: var(--surface-neutral-default);
        color: var(--text-neutral-subtitle);
      }
      .scroll { overflow-x: auto; border-top: 1px solid var(--border-neutral-default); }
      table { width: 100%; border-collapse: collapse; font-size: 12px; }
      th, td { text-align: left; padding: 7px 16px; }
      thead tr { border-bottom: 1px solid var(--border-neutral-default); }
      tbody tr + tr { border-top: 1px solid var(--border-neutral-default); }
      td.num, th.num { text-align: right; white-space: nowrap; }
      code { font-size: 11px; }
      code.src { color: var(--text-neutral-caption); }
      a { color: var(--text-brand-default); }
      .stats { display: flex; gap: 28px; flex-wrap: wrap; margin: 24px 0 0; }
      .stat strong { display: block; font-size: 26px; }
      .stat span { font-size: 12px; color: var(--text-neutral-subtitle); }
      .note {
        margin-top: 32px; padding: 14px 16px; border-radius: 8px; font-size: 13px;
        background: var(--info-surface-lightest); color: var(--info-text-dark);
      }
    </style>
  </head>
  <body>
    <div class="wrap">
      <h1>CtrlChain Design System</h1>
      <p class="lede">
        Generated from the platform source. Every stylesheet here is the CSS the app
        actually ships, and every token value is read out of the code at build time —
        so nothing on these pages can describe something the app does not do.
      </p>

      <div class="stats">
        <div class="stat"><strong>${input.tokens.length}</strong><span>design tokens</span></div>
        <div class="stat"><strong>${input.utilities.length}</strong><span>utility classes</span></div>
        <div class="stat"><strong>${input.typeScale.length}</strong><span>type styles</span></div>
        <div class="stat"><strong>${input.icons.length}</strong><span>icons</span></div>
        <div class="stat"><strong>${designSystemCount}</strong><span>shared components</span></div>
        <div class="stat"><strong>${input.components.length}</strong><span>components with CSS</span></div>
      </div>

      <h2>Components</h2>
      <p class="lede">
        Every sample below is the real component, rendered against the real CSS —
        not a picture of one. Click through for all states, the metrics and the
        markup to copy.
      </p>
      <div class="gallery">${pages}</div>

      <h2>Tokens and data</h2>
      <p class="lede">
        Machine-readable exports. <code>tokens.json</code> gives every token its light
        and dark value plus the utility class that applies it, which is what a design
        tool needs to import the palette.
      </p>
      <div class="cards">${dataFiles}</div>

      <h2>Component stylesheets</h2>
      <p class="lede">
        One file per component, de-Angularized so it works outside the app. The shared
        design system is open below; feature libraries are collapsed. Each file needs
        the token layer — link <code>ds/index.css</code> first.
      </p>
      ${owners.map(([owner, entries]) => ownerSection(owner, entries)).join('\n')}

      <div class="note">
        <strong>${input.skipped.length}</strong> further component stylesheets exist but hold no
        rules — they only <code>@reference</code> the Tailwind theme so the component can use
        <code>@apply</code> in its template classes. There is nothing to export for those;
        they are listed in <code>manifest.json</code>.
      </div>
    </div>
  </body>
</html>
`;
}

/** The bundle README. */
function readme(input: CatalogueInput): string {
  return `# CtrlChain Design System — exported bundle

Generated from the platform source. **Do not hand-edit anything in here** — it is
overwritten on every export.

    pnpm design-system:export    # rebuild this folder
    pnpm design-system:verify    # assert it against the platform source

Open \`index.html\` to browse.

## What is in here

| Path | What it is |
| --- | --- |
| \`index.html\` | Browsable catalogue — start here |
| \`design-system/*.html\` | Foundations: colours, tokens, typography, spacing, icons |
| \`components/*.html\` | Component documentation, rendered with real markup |
| \`ds/index.css\` | The whole stylesheet, in cascade order. Link this. |
| \`ds/components/*.css\` | One stylesheet per component (${input.components.length} of them) |
| \`tokens/*.json\` | Machine-readable tokens, palette, type scale, icons |
| \`manifest.json\` | Inventory of everything, including what was skipped |
| \`shell/\` | Documentation chrome — nav, header, theme toggle |
| \`assets/icons/\` | The CtrlChain icon font |
| \`assets/images/\` | Brand lockups |
| \`fonts/fonts.css\` | Roboto — the only family the platform loads |

## Using it

Link one stylesheet and write the app's own classes:

\`\`\`html
<link rel="stylesheet" href="fonts/fonts.css" />
<link rel="stylesheet" href="ds/index.css" />

<button ccaButton class="cca-btn cca-btn--primary">Create shipment</button>
<div class="rounded-lg surface-neutral-light border border-neutral-default p-4">…</div>
\`\`\`

\`ds/index.css\` imports the layers in the order the running app applies them:
Angular Material's structural CSS, then the platform globals (tokens, all
${input.utilities.length} utilities, the Material overrides), then the CtrlChain
component styles.

It is deliberately **not** wrapped in \`@layer\`. A cascade layer outranks
specificity, and the platform CSS carries Tailwind's preflight — which resets
\`border-width: 0\` on \`*\`. Layered, that reset beat every Material border and
form-field outlines vanished.

## Two caveats

- **Static previews.** Angular adds classes at runtime for focus, hover and
  floating labels. The documentation pages write those out explicitly per state,
  which is why each control appears several times.
- **The chrome here is this bundle's own.** The published design project has its
  own, richer shell at the same \`shell/\` paths, so **never upload \`shell/*\` from
  this bundle to the project** — it would replace theirs. Everything else in here
  is safe to push.
`;
}

/** Builds every catalogue file. */
export function buildCatalogue(input: CatalogueInput): CatalogueFile[] {
  return [
    ...componentFiles(input),
    { path: 'tokens/tokens.json', contents: tokensJson(input) },
    { path: 'tokens/palette.json', contents: paletteJson(input) },
    { path: 'tokens/typography.json', contents: typographyJson(input) },
    { path: 'tokens/icons.json', contents: iconsJson(input) },
    { path: 'manifest.json', contents: manifestJson(input) },
    { path: 'index.html', contents: indexHtml(input) },
    { path: 'README.md', contents: readme(input) },
  ];
}
