/**
 * Generates the button page.
 *
 * Every sample is real production markup — the `ccaButton` attribute plus the
 * exact host classes Angular applies — rendered against the component's own
 * exported stylesheet. What you see on the page is what the app renders, and
 * the markup pastes into a template unchanged.
 */

import { CCA_BUTTON, buttonClasses } from './components.js';
import { type ButtonSizeMetrics } from './parse-metrics.js';
import { buildPage, callout, codeCard, escapeHtml, section } from './page-shell.js';

/** Legacy global helpers that still override a `ccaButton`'s own size input. */
const LEGACY_CLASSES = [
  '.button-small',
  '.button-square',
  '.small-icon-button',
  '.icon-button-small',
  '.xsmall-icon-button',
  '.icon-button-rounded',
  '.icon-button-extra-small',
];

/** Production DOM for `<cca-icon [icon]="name" />`, Material classes included. */
function ccaIcon(name: string): string {
  return (
    '<cca-icon><mat-icon class="mat-icon notranslate cca-icon ' +
    `cca-icon-${name} mat-ligature-font mat-icon-inline" aria-hidden="true"></mat-icon></cca-icon>`
  );
}

/** One button, with the classes Angular would apply for these inputs. */
function button(
  hierarchy: string,
  options: {
    size?: string;
    iconOnly?: boolean;
    label?: string;
    icon?: string;
    disabled?: boolean;
  } = {},
): string {
  const { size = 'default', iconOnly = false, label, icon, disabled = false } = options;
  const classes = buttonClasses(hierarchy, size, iconOnly);
  const content = iconOnly
    ? ccaIcon(icon ?? 'pencil')
    : `${icon ? `${ccaIcon(icon)}` : ''}${escapeHtml(label ?? 'Create shipment')}`;
  const ariaLabel = iconOnly ? ' aria-label="Edit"' : '';

  return `<button ccaButton class="${classes}"${disabled ? ' disabled' : ''}${ariaLabel}>${content}</button>`;
}

/** A labelled row of demo items in the shell's variant-grid styling. */
function variantRow(label: string, items: string): string {
  return [
    '<div class="variant-row">',
    `  <div class="vr-label">${escapeHtml(label)}</div>`,
    `  <div class="vr-items">${items}</div>`,
    '</div>',
  ].join('\n');
}

/** The button page. */
export function buttonPage(sizes: readonly ButtonSizeMetrics[]): string {
  const hierarchyRows = CCA_BUTTON.hierarchies
    .map((hierarchy) => {
      const label = hierarchy
        .split('-')
        .map((part) => part[0].toUpperCase() + part.slice(1))
        .join(' ');

      const samples = [
        button(hierarchy, { label: 'Create shipment' }),
        button(hierarchy, { label: 'With icon', icon: 'plus' }),
        button(hierarchy, { label: 'Disabled', disabled: true }),
      ].join('\n    ');

      return variantRow(`hierarchy="${hierarchy}" — ${label}`, samples);
    })
    .join('\n');

  const sizeRows = sizes
    .map((metrics) => {
      const detail = [
        metrics.height && metrics.height !== 'auto' ? `height ${metrics.height}` : undefined,
        metrics.padding ? `padding ${metrics.padding}` : undefined,
        metrics.fontSize ? `font-size ${metrics.fontSize}` : undefined,
      ]
        .filter(Boolean)
        .join(' · ');

      const samples = [
        button('primary', { size: metrics.size, label: 'Create shipment' }),
        button('secondary', { size: metrics.size, label: 'Cancel' }),
        button('primary', { size: metrics.size, iconOnly: true }),
      ].join('\n    ');

      const isDefault = metrics.size === 'default';

      return variantRow(
        `size="${metrics.size}"${isDefault ? ' (default)' : ''} — ${detail}`,
        samples,
      );
    })
    .join('\n');

  const iconOnlyRows = sizes
    .map((metrics) =>
      variantRow(
        `iconOnly · size="${metrics.size}" — padding ${metrics.iconOnlyPadding ?? '—'}`,
        [
          button('primary', { size: metrics.size, iconOnly: true }),
          button('secondary', { size: metrics.size, iconOnly: true }),
          button('tertiary', { size: metrics.size, iconOnly: true }),
          button('icon', { size: metrics.size, iconOnly: true }),
        ].join('\n    '),
      ),
    )
    .join('\n');

  const heights = sizes
    .filter((metrics) => metrics.height && metrics.height !== 'auto')
    .map((metrics) => `${metrics.size} ${metrics.height}`)
    .join(', ');

  const usageSample = [
    '<!-- default: 48px tall, hierarchy="primary" -->',
    '<button ccaButton>Create shipment</button>',
    '',
    '<!-- explicit hierarchy and size -->',
    '<button ccaButton hierarchy="secondary" size="small">Cancel</button>',
    '',
    '<!-- icon-only needs an accessible name -->',
    '<button ccaButton hierarchy="icon" [iconOnly]="true" aria-label="Edit">',
    '  <cca-icon icon="pencil" />',
    '</button>',
    '',
    '<!-- a link that looks like a button -->',
    '<a ccaButton hierarchy="primary" [routerLink]="[\'/trips\']">View trips</a>',
  ].join('\n');

  const legacyList = LEGACY_CLASSES.map((name) => `<code>${escapeHtml(name)}</code>`).join(', ');

  const body = [
    section(
      'Usage',
      '<p class="lede">Every button in the platform is the <code>ccaButton</code> attribute component, applied to a native <code>&lt;button&gt;</code> or <code>&lt;a&gt;</code>. Material button directives are not part of the design system.</p>',
      codeCard('template', usageSample),
    ),
    section(
      'Hierarchy',
      `<p class="lede">${CCA_BUTTON.hierarchies.length} hierarchies. Only one primary per view — if a screen seems to need two, one of them is a secondary.</p>`,
      `<div class="variant-grid">${hierarchyRows}</div>`,
    ),
    section(
      'Size',
      `<p class="lede">Five sizes: ${escapeHtml(heights)}. <code>size="default"</code> adds no class — the base rule <em>is</em> the 48px default, which is why it matches a form field exactly.</p>`,
      `<div class="variant-grid">${sizeRows}</div>`,
    ),
    section(
      'Icon only',
      '<p class="lede">The square variants drop the fixed height and derive their size from padding plus icon instead. Bordered hierarchies land 2px larger; <code>tertiary</code> and <code>danger-text</code> have no border, so they hit the exact numbers.</p>',
      `<div class="variant-grid">${iconOnlyRows}</div>`,
      callout(
        'warn',
        'An icon-only button still needs a name',
        '<p>There is no visible label for a screen reader to read, so every icon-only button needs an <code>aria-label</code>.</p>',
      ),
    ),
    section(
      'Legacy classes — do not use',
      callout(
        'bad',
        'These global helpers silently override the size input',
        `<p>${legacyList} are Material-era global classes that still live in <code>shared/styles/components/_button.scss</code>. They set sizing with <code>!important</code>, so anywhere one is still layered onto a <code>ccaButton</code> it wins over that button&rsquo;s own <code>size</code>. Use <code>size</code> and <code>iconOnly</code> instead.</p>`,
      ),
    ),
  ].join('\n');

  return buildPage({
    path: 'components/button.html',
    group: 'Components',
    subtitle: `${CCA_BUTTON.hierarchies.length} hierarchies × ${sizes.length} sizes · real component CSS`,
    title: 'Button',
    intro:
      'Rendered with the component’s own exported stylesheet and the exact host classes Angular applies, so every sample below is pixel-identical to the running app.',
    crumbs: ['Components', 'Button'],
    sources: [
      'libs/ui/src/lib/button/button.component.ts',
      'libs/ui/src/lib/button/button.component.scss',
      'shared/styles/components/_button.scss',
    ],
    devSelectors: ['button[ccaButton]', 'a[ccaButton]'],
    body,
  });
}
