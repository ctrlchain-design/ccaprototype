/**
 * Generates the foundation pages — colours, tokens, typography, spacing — from
 * the platform source.
 *
 * Every value rendered here is read out of the repo at build time, so a page
 * cannot describe a metric the app does not have. Demo markup uses the real
 * utility classes, which makes each example copy-pasteable into a template.
 */

import {
  type PaletteGroup,
  type SemanticToken,
  type TokenUtility,
  type TypeStyle,
  resolveColor,
} from './parse-tokens.js';
import { TABLE_STYLES, buildPage, callout, codeCard, escapeHtml, section } from './page-shell.js';

/** Everything the generators read, parsed once by the build. */
export interface PageData {
  readonly palette: readonly PaletteGroup[];
  readonly tokens: readonly SemanticToken[];
  readonly utilities: readonly TokenUtility[];
  readonly typeScale: readonly TypeStyle[];
}

/** A small inline swatch for a resolved colour. */
function swatch(hex?: string): string {
  if (!hex) {
    return '<span class="ds-none">not themed</span>';
  }

  return (
    `<span class="ds-sw" style="background:${escapeHtml(hex)}"></span> ` +
    `<code>${escapeHtml(hex)}</code>`
  );
}

// ---------------------------------------------------------------------------
// Colors
// ---------------------------------------------------------------------------

/** The raw palette, one ramp per group, with the literal hex each step holds. */
export function colorsPage(data: PageData): string {
  const ramps = data.palette
    .map((group) => {
      const swatches = group.entries
        .map((entry) => {
          const step = entry.name.replace(/^--color-/, '');

          return [
            '<div>',
            `  <div class="chip" style="background:${escapeHtml(entry.value)}"></div>`,
            `  <div class="name u-mono">${escapeHtml(step)}</div>`,
            `  <div class="hex u-mono">${escapeHtml(entry.value)}</div>`,
            '</div>',
          ].join('\n');
        })
        .join('\n');

      return [
        `<h3>${escapeHtml(group.group.replace(/^Colors - /, ''))}</h3>`,
        `<div class="ds-ramp">${swatches}</div>`,
      ].join('\n');
    })
    .join('\n');

  const totalSteps = data.palette.reduce((count, group) => count + group.entries.length, 0);

  const body = [
    section(
      'Raw palette',
      '<p class="lede">The literal colour ramps. Reach for these only when documenting the palette itself — screens use the semantic tokens on the Tokens page, so they re-theme without edits.</p>',
      ramps,
    ),
    section(
      'Rule',
      callout(
        'bad',
        'Never put a raw palette value in a screen',
        '<p>A hard-coded <code>#6f8f2f</code>, or a <code>bg-cca-green-600</code> utility, does not follow dark mode and will not re-theme. Use the semantic token — <code>surface-brand-default</code> — instead. The repo&rsquo;s <code>audit-tailwind-tokens</code> skill flags violations.</p>',
      ),
    ),
  ].join('\n');

  return buildPage({
    path: 'design-system/colors.html',
    group: 'Foundations',
    subtitle: `${totalSteps} palette steps across ${data.palette.length} ramps`,
    title: 'Colors',
    intro:
      'The raw colour ramps behind every semantic token, read straight from the platform palette files.',
    crumbs: ['Foundations', 'Colors'],
    sources: ['shared/styles/tailwind/colors.css', 'shared/styles/tailwind/new-cold.css'],
    styles: TABLE_STYLES,
    body,
  });
}

// ---------------------------------------------------------------------------
// Tokens
// ---------------------------------------------------------------------------

/**
 * Every semantic token with its light value, dark value and the utility class
 * that applies it — the page a developer and a designer can both work from.
 */
export function tokensPage(data: PageData): string {
  const utilitiesByToken = new Map<string, TokenUtility[]>();
  for (const utility of data.utilities) {
    const list = utilitiesByToken.get(utility.token) ?? [];
    list.push(utility);
    utilitiesByToken.set(utility.token, list);
  }

  const groups = new Map<string, SemanticToken[]>();
  for (const token of data.tokens) {
    const list = groups.get(token.group) ?? [];
    list.push(token);
    groups.set(token.group, list);
  }

  const tables = [...groups]
    .map(([group, tokens]) => {
      const rows = tokens
        .map((token) => {
          const lightHex = resolveColor(token.light, data.palette);
          const darkHex = token.dark ? resolveColor(token.dark, data.palette) : undefined;
          const utilities = utilitiesByToken.get(token.name) ?? [];
          const utilityCells = utilities.length
            ? utilities.map((utility) => `<code>${escapeHtml(utility.utility)}</code>`).join(' ')
            : '<span class="ds-none">no utility</span>';

          return (
            '<tr>' +
            `<td><code>${escapeHtml(token.name)}</code></td>` +
            `<td class="nw">${swatch(lightHex)}</td>` +
            `<td class="nw">${swatch(darkHex)}</td>` +
            `<td>${utilityCells}</td>` +
            '</tr>'
          );
        })
        .join('\n');

      return [
        `<h3>${escapeHtml(group)} <span class="ds-count">(${tokens.length})</span></h3>`,
        '<div class="ds-scroll"><table class="ds-table">',
        '  <thead><tr><th>Token</th><th>Light</th><th>Dark</th><th>Utility class</th></tr></thead>',
        `  <tbody>${rows}</tbody>`,
        '</table></div>',
      ].join('\n');
    })
    .join('\n');

  const withDark = data.tokens.filter((token) => token.dark).length;

  // The two counter-examples are assembled rather than written out, so the
  // repo's Tailwind class linter does not read them as real class usage.
  const arbitraryValue = `bg-[var(${'--surface-neutral-light'})]`;
  const rawPalette = `bg-${'cca-neutrals-50'}`;

  const usageSample = [
    '<!-- correct: greppable, follows dark mode -->',
    '<div class="surface-neutral-light border border-neutral-default text-neutral-body">…</div>',
    '',
    '<!-- wrong: not greppable, no dark-mode story -->',
    `<div class="${arbitraryValue}">…</div>`,
    '',
    '<!-- wrong: raw palette, will not re-theme -->',
    `<div class="${rawPalette}">…</div>`,
  ].join('\n');

  const body = [
    section(
      'How to use a token',
      '<p class="lede">Each CSS variable is exposed as a utility class of the same name, minus the leading dashes. Use the class rather than a <code>var()</code> in an arbitrary value, so it stays greppable and dark mode follows automatically.</p>',
      codeCard('template', usageSample),
    ),
    section(
      'Tokens',
      `<p class="lede">${data.tokens.length} semantic tokens, ${withDark} of which carry a dark-mode value. Grouping follows the platform token file.</p>`,
      tables,
    ),
  ].join('\n');

  return buildPage({
    path: 'design-system/tokens.html',
    group: 'Foundations',
    subtitle: `${data.tokens.length} semantic tokens, light + dark`,
    title: 'Tokens',
    intro:
      'The semantic layer: every token the platform defines, what it resolves to in each theme, and the utility class that applies it.',
    crumbs: ['Foundations', 'Tokens'],
    sources: [
      'shared/styles/tailwind/light-mode.scss',
      'shared/styles/tailwind/dark-mode.scss',
      'shared/styles/tailwind/tailwind.css',
    ],
    styles: TABLE_STYLES,
    body,
  });
}

// ---------------------------------------------------------------------------
// Typography
// ---------------------------------------------------------------------------

/** The type scale, rendered with the real utility class applied to each sample. */
export function typographyPage(data: PageData): string {
  const rows = data.typeScale
    .map((style) => {
      const size = style.declarations['font-size'] ?? '';
      const lineHeight = style.declarations['line-height'] ?? 'inherit';
      const weight = style.declarations['font-weight'] ?? '400';
      const extras = Object.entries(style.declarations)
        .filter(([property]) => !['font-size', 'line-height', 'font-weight'].includes(property))
        .map(([property, value]) => `${property}: ${value}`)
        .join('; ');

      const meta = `${size} / ${lineHeight} · ${weight}${extras ? ` · ${extras}` : ''}`;

      return [
        '<div style="display:flex;gap:24px;align-items:baseline;padding:14px 0;border-bottom:1px solid var(--border-neutral-default)">',
        '  <div style="flex:0 0 210px">',
        `    <code style="font-size:11px">${escapeHtml(style.utility)}</code>`,
        `    <div class="u-mono" style="font-size:10px;color:var(--text-neutral-caption);margin-top:2px">${escapeHtml(meta)}</div>`,
        '  </div>',
        `  <div class="${escapeHtml(style.utility)} text-neutral-body">The quick brown fox jumps over the lazy dog</div>`,
        '</div>',
      ].join('\n');
    })
    .join('\n');

  const headings = ['h1', 'h2', 'h3', 'h4']
    .map(
      (tag) =>
        '<div style="padding:10px 0;border-bottom:1px solid var(--border-neutral-default)">' +
        `<code style="font-size:11px">&lt;${tag}&gt;</code>` +
        `<${tag} style="margin:6px 0 0">Shipment overview</${tag}></div>`,
    )
    .join('\n');

  const body = [
    section(
      'Family',
      callout(
        'info',
        'Roboto, and only Roboto',
        '<p>The platform loads a single family — Roboto at 300/400/500/700 — and nothing else. There is no display face and no secondary family, so a mock that pairs two typefaces cannot be built as drawn.</p>',
      ),
    ),
    section(
      'Scale',
      '<p class="lede">Use these utilities rather than raw sizes like <code>text-sm</code> or <code>text-lg</code>. Each sets size, line height and weight together, so a label cannot end up with the wrong leading.</p>',
      rows,
    ),
    section(
      'Headings',
      '<p class="lede">Heading tags are styled globally, so semantic markup already carries the right type. Reach for a utility only when the element is not a heading.</p>',
      headings,
    ),
  ].join('\n');

  return buildPage({
    path: 'design-system/typography.html',
    group: 'Foundations',
    subtitle: `${data.typeScale.length} type utilities · Roboto only`,
    title: 'Typography',
    intro:
      'The type scale as the platform defines it — every sample below is rendered with the same utility class you would write in a template.',
    crumbs: ['Foundations', 'Typography'],
    sources: ['shared/styles/tailwind/tailwind.css', 'apps/platform/src/styles.scss'],
    body,
  });
}
