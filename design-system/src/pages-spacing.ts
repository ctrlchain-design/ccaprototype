/**
 * Generates the spacing, radius and container-padding page.
 *
 * The gap guidance mirrors docs/design-baseline.md, which derived it by
 * counting real template usage; the radii and container metrics are read out of
 * the style sources at build time.
 */

import { type ShapeMetrics, remToPx } from './parse-metrics.js';
import { buildPage, callout, codeCard, escapeHtml, section } from './page-shell.js';

/** One row of the spacing scale. */
interface SpacingStep {
  readonly utility: string;
  readonly px: number;
  readonly use: string;
}

/**
 * The four steps to standardise on. `gap-3` is roughly as common as `gap-6` in
 * the codebase and is not wrong, but keeping converted screens to these four
 * is what makes them look consistent.
 */
const SPACING_STEPS: readonly SpacingStep[] = [
  { utility: 'gap-1', px: 4, use: 'Inline micro-spacing — icon to label, value to unit' },
  { utility: 'gap-2', px: 8, use: 'Tightly related items — chips, button groups, key/value pairs' },
  {
    utility: 'gap-4',
    px: 16,
    use: 'Default. Between form inputs and sibling layout blocks',
  },
  { utility: 'gap-6', px: 24, use: 'Separation between sections and content groups' },
];

/** Renders a to-scale bar for one spacing step. */
function spacingRow(step: SpacingStep): string {
  const isDefault = step.utility === 'gap-4';

  return [
    '<div style="display:flex;align-items:center;gap:20px;padding:12px 0;border-bottom:1px solid var(--border-neutral-default)">',
    `  <code style="flex:0 0 80px;font-size:12px">${escapeHtml(step.utility)}</code>`,
    `  <span class="u-mono" style="flex:0 0 48px;font-size:11px;color:var(--text-neutral-caption)">${step.px}px</span>`,
    `  <div style="flex:0 0 140px"><div style="height:12px;width:${step.px * 2}px;border-radius:3px;background:var(--surface-brand-default)"></div></div>`,
    `  <span style="font-size:13px">${escapeHtml(step.use)}${isDefault ? ' <strong>(default)</strong>' : ''}</span>`,
    '</div>',
  ].join('\n');
}

/** Renders a live radius sample. */
function radiusSample(label: string, value: string, applies: string): string {
  return [
    '<div style="flex:1 1 150px;min-width:150px">',
    `  <div style="height:72px;border-radius:${escapeHtml(value)};border:1px solid var(--border-neutral-default);background:var(--surface-neutral-default)"></div>`,
    `  <div style="margin-top:8px;font-size:12px;font-weight:500">${escapeHtml(label)}</div>`,
    `  <div class="u-mono" style="font-size:10px;color:var(--text-neutral-caption)">${escapeHtml(value)}${remToPx(value) ? ` · ${remToPx(value)}` : ''}</div>`,
    `  <div style="font-size:11px;color:var(--text-neutral-subtitle);margin-top:2px">${escapeHtml(applies)}</div>`,
    '</div>',
  ].join('\n');
}

/** The spacing, radius and container page. */
export function spacingPage(metrics: ShapeMetrics): string {
  const shapeSmall = metrics.shapeSmall ?? '0.5rem';
  const dialogShape = metrics.dialogShape ?? '0.75rem';

  const radii = [
    radiusSample('rounded-lg', shapeSmall, 'Buttons, form fields, cards, dropdowns'),
    radiusSample('rounded-xl', dialogShape, 'Dialogs and page containers'),
    radiusSample('rounded', '0.25rem', 'Small inner elements — scrollbar thumbs, minor accents'),
    radiusSample('rounded-full', '9999px', 'Pills, badges, avatars'),
  ].join('\n');

  const formSample = [
    '<!-- Two-column form. items-start matters: mat-form-field reserves its own',
    '     subscript space for hints and errors, so rows must top-align. -->',
    '<form class="grid grid-cols-2 items-start gap-4">…</form>',
    '',
    '<!-- Single-column form -->',
    '<form class="flex flex-col gap-4">…</form>',
  ].join('\n');

  const containerRows = [
    ['Page container', '.page-container', 'p-4 (16px), 24px at ≥1920px', 'rounded-xl'],
    ['Card / panel', '—', 'p-4 default, p-6 for spacious surfaces', 'rounded-lg'],
    ['Dialog header', '.dialog-container header', 'px-6 py-4, bottom border', '—'],
    [
      'Dialog body',
      '.dialog-container main',
      'p-6, max-height 65vh, min-width 30rem',
      'rounded-xl (container)',
    ],
    ['Dialog footer', '.dialog-container footer', 'p-6, gap-4, centered, top border', '—'],
  ]
    .map(
      ([container, selector, padding, radius]) =>
        '<tr>' +
        `<td style="padding:6px 10px">${escapeHtml(container)}</td>` +
        `<td style="padding:6px 10px"><code style="font-size:11px">${escapeHtml(selector)}</code></td>` +
        `<td style="padding:6px 10px">${escapeHtml(padding)}</td>` +
        `<td style="padding:6px 10px">${escapeHtml(radius)}</td>` +
        '</tr>',
    )
    .join('\n');

  const controlRows = [
    ['ccaButton, size="default"', metrics.buttonRadius ?? shapeSmall, '48px'],
    [
      'mat-form-field infix (outlined)',
      shapeSmall,
      `${metrics.formFieldInfixMinHeight ?? '3rem'} · padding ${metrics.formFieldInfixPadding ?? '0.75rem 0'}`,
    ],
    [
      'mat-form-field inside a paginator',
      shapeSmall,
      `${metrics.paginatorInfixMinHeight ?? '2rem'} (the compact exception)`,
    ],
  ]
    .map(
      ([control, radius, height]) =>
        '<tr>' +
        `<td style="padding:6px 10px"><code style="font-size:11px">${escapeHtml(control)}</code></td>` +
        `<td style="padding:6px 10px">${escapeHtml(radius)}</td>` +
        `<td style="padding:6px 10px">${escapeHtml(height)}</td>` +
        '</tr>',
    )
    .join('\n');

  const body = [
    section(
      'Base unit',
      '<p class="lede">Spacing follows the 4px scale, where <code>1</code> is 0.25rem. Every value in a converted screen has to land on that scale — no arbitrary <code>p-[13px]</code>.</p>',
    ),
    section(
      'Spacing between elements',
      '<p class="lede">Four steps cover almost everything. <code>gap-4</code> dominates real usage and is the right default when you are unsure.</p>',
      SPACING_STEPS.map(spacingRow).join('\n'),
    ),
    section(
      'Form layouts',
      codeCard('template', formSample),
      callout(
        'warn',
        'Never add bottom margin to a form field',
        '<p>A <code>mat-form-field</code> already reserves subscript space below the input for hints and errors. Adding margin double-spaces the row, and the drift shows up as soon as one field in a row has an error and the others do not.</p>',
      ),
    ),
    section(
      'Corner radius',
      `<p class="lede">Two radii carry almost every surface: <strong>${remToPx(shapeSmall) ?? shapeSmall} on controls and cards</strong>, <strong>${remToPx(dialogShape) ?? dialogShape} on dialogs and page-level containers</strong>.</p>`,
      `<div style="display:flex;gap:16px;flex-wrap:wrap">${radii}</div>`,
      `<p style="margin-top:16px">Buttons pick up ${remToPx(shapeSmall) ?? shapeSmall} because <code>ccaButton</code> reads <code>var(--mat-shape-small)</code> directly. <code>--mat-shape-medium</code> (${metrics.shapeMedium ?? '1.25rem'}) is declared but has no consumers.</p>`,
    ),
    section(
      'Container padding',
      '<p class="lede">Use the existing global classes rather than hand-rolling the padding.</p>',
      '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:12px">',
      '<thead><tr style="text-align:left;border-bottom:1px solid var(--border-neutral-default)">',
      '<th style="padding:6px 10px">Container</th><th style="padding:6px 10px">Class</th>',
      '<th style="padding:6px 10px">Padding</th><th style="padding:6px 10px">Radius</th>',
      `</tr></thead><tbody>${containerRows}</tbody></table></div>`,
    ),
    section(
      'Control heights',
      '<p class="lede">A default button and a form field are both 48px tall, so they line up when placed side by side without any alignment work.</p>',
      '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:12px">',
      '<thead><tr style="text-align:left;border-bottom:1px solid var(--border-neutral-default)">',
      '<th style="padding:6px 10px">Control</th><th style="padding:6px 10px">Radius</th>',
      '<th style="padding:6px 10px">Height</th>',
      `</tr></thead><tbody>${controlRows}</tbody></table></div>`,
    ),
  ].join('\n');

  return buildPage({
    path: 'design-system/spacing.html',
    group: 'Foundations',
    subtitle: '4px scale · 8px and 12px radii · container padding',
    title: 'Spacing & Radius',
    intro:
      'The layout metrics to follow when turning a prototype into platform code: which gaps to use, which radius belongs on what, and how much padding each container already provides.',
    crumbs: ['Foundations', 'Spacing & Radius'],
    sources: [
      'shared/styles/_ui.scss',
      'shared/styles/components/_dialog.scss',
      'shared/styles/components/_form-field.scss',
      'apps/platform/src/styles.scss',
      'libs/ui/src/lib/button/button.component.scss',
      'docs/design-baseline.md',
    ],
    body,
  });
}
