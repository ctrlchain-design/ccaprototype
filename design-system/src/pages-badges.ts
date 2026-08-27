/**
 * Generates the badge and iconography pages.
 *
 * Which flavours each badge supports is read out of the compiled component CSS
 * rather than from the `StatusBadgeFlavor` union, because the union is wider
 * than any single component implements — `cca-attention-flag-badge` styles four
 * of the thirteen. Documenting the union would put swatches on the page that
 * render as unstyled text in the app.
 */

import { type IconEntry } from './parse-component-css.js';
import { buildPage, callout, codeCard, escapeHtml, section } from './page-shell.js';

/** Flavour lists per badge component, as declared in their stylesheets. */
export interface BadgeFlavors {
  readonly status: readonly string[];
  readonly label: readonly string[];
  readonly text: readonly string[];
  readonly numerical: readonly string[];
  readonly attentionFlag: readonly string[];
}

const BADGE_STYLES = `
      .ds-row { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
      .ds-flavor { display: flex; flex-direction: column; gap: 4px; align-items: flex-start; }
      .ds-flavor code { font-size: 10px; color: var(--text-neutral-caption); }
      .ds-icons {
        display: grid; gap: 8px;
        grid-template-columns: repeat(auto-fill, minmax(132px, 1fr));
      }
      .ds-icon {
        display: flex; flex-direction: column; align-items: center; gap: 6px;
        padding: 12px 8px; border-radius: 8px;
        border: 1px solid var(--border-neutral-default);
        background: var(--surface-neutral-light);
      }
      .ds-icon .glyph { font-size: 24px; color: var(--text-neutral-body); }
      .ds-icon .name {
        font-size: 10px; color: var(--text-neutral-subtitle);
        text-align: center; word-break: break-word; line-height: 1.3;
      }
      .ds-icon-filter { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
      .ds-icon-filter input {
        flex: 1 1 auto; min-width: 0; height: 40px; padding: 0 12px;
        border-radius: 8px; border: 1px solid var(--border-neutral-default);
        background: var(--surface-neutral-light); color: var(--text-neutral-body);
        font: inherit; font-size: 13px;
      }
      .ds-icon-filter input:focus-visible { outline: 2px solid var(--border-brand-default); outline-offset: -1px; }
      .ds-icon-filter .count { font-size: 11px; color: var(--text-neutral-caption); white-space: nowrap; }
      .ds-icon-empty { font-size: 12px; color: var(--text-neutral-subtitle); padding: 12px 0; }
      .ds-icon[hidden] { display: none; }
`;

/**
 * Filters the icon grid by substring, case-insensitively — the point is that
 * `Gear-Settings` is reachable by typing `gear`, since eleven of the glyph names
 * are not lowercase-kebab and an exact-case search misses them.
 */
const ICON_FILTER_SCRIPT = `<script>
      (function () {
        var input = document.getElementById('iconFilter');
        var grid = document.getElementById('iconGrid');
        var count = document.getElementById('iconFilterCount');
        var empty = document.getElementById('iconFilterEmpty');
        if (!input || !grid || !count || !empty) return;

        var cells = Array.prototype.slice.call(grid.querySelectorAll('.ds-icon'));

        function apply() {
          var query = input.value.trim().toLowerCase();
          var shown = 0;
          for (var i = 0; i < cells.length; i++) {
            var match = query === '' || (cells[i].dataset.name || '').indexOf(query) !== -1;
            cells[i].hidden = !match;
            if (match) shown++;
          }
          count.textContent = shown + ' of ' + cells.length;
          empty.hidden = shown !== 0;
        }

        input.addEventListener('input', apply);
        apply();
      })();
    </script>`;

/** A labelled row of demo items in the shell's variant-grid styling. */
function variantRow(label: string, items: string): string {
  return [
    '<div class="variant-row">',
    `  <div class="vr-label">${escapeHtml(label)}</div>`,
    `  <div class="vr-items">${items}</div>`,
    '</div>',
  ].join('\n');
}

/** Wraps a rendered badge with the flavour name beneath it. */
function labelled(flavor: string, markup: string): string {
  return `<div class="ds-flavor">${markup}<code>${escapeHtml(flavor)}</code></div>`;
}

/** `cca-status-badge` — a pill with a label. */
function statusBadge(flavor: string, label: string, small = false): string {
  const classes = [
    'flex w-fit items-center justify-center rounded-full py-1 whitespace-nowrap font-medium',
    small ? 'px-2 text-cca-label-sm' : 'px-2.5 text-cca-base-sm',
    flavor,
  ].join(' ');

  return `<cca-status-badge><div class="${classes}">${escapeHtml(label)}</div></cca-status-badge>`;
}

/** `cca-label-badge` — a squarer tag, optionally outlined. */
function labelBadge(flavor: string, label: string, emphasis: 'fill' | 'outline' = 'fill'): string {
  const classes = [
    'flex w-fit items-center gap-1 rounded-lg whitespace-nowrap',
    'px-1.5 py-1 text-cca-base-sm leading-5 font-normal',
    flavor,
    emphasis === 'outline' ? 'emphasis-outline' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return `<cca-label-badge><div class="${classes}">${escapeHtml(label)}</div></cca-label-badge>`;
}

/** `cca-text-badge` — a coloured label with an optional status dot. */
function textBadge(flavor: string, label: string, withDot = true): string {
  const dot = withDot ? '<div class="dot h-1.5 w-1.5 rounded-full"></div>' : '';

  return `<cca-text-badge><div class="items-center flex gap-1 font-medium ${escapeHtml(flavor)}">${dot}<span>${escapeHtml(label)}</span></div></cca-text-badge>`;
}

/** `cca-numerical-badge` — a count pill or a bare dot. */
function numericalBadge(flavor: string, value?: string): string {
  const inner = value
    ? `<span class="flex items-center justify-center min-w-6 px-2 py-1 text-cca-label-sm">${escapeHtml(value)}</span>`
    : '<span class="block h-2 w-2"></span>';

  return (
    '<cca-numerical-badge><span class="rounded-full font-medium ' +
    `${escapeHtml(flavor)} inline-flex items-center justify-center align-middle${value ? ' min-w-3.75' : ''}">` +
    `${inner}</span></cca-numerical-badge>`
  );
}

/** `cca-attention-flag-badge` — a bordered flag, icon plus label. */
function attentionFlag(flavor: string, label: string): string {
  return (
    '<cca-attention-flag-badge><div class="font-medium flex w-fit items-center justify-center ' +
    `rounded-full whitespace-nowrap border gap-1 px-2 py-0.5 text-cca-base-sm ${escapeHtml(flavor)}">` +
    `<span>${escapeHtml(label)}</span></div></cca-attention-flag-badge>`
  );
}

/** The badge page. */
export function badgePage(flavors: BadgeFlavors): string {
  const usageSample = [
    '<cca-status-badge flavor="primary">{{ t(\'trip.inTransit\') }}</cca-status-badge>',
    '',
    '<cca-label-badge flavor="warning" [labelName]="t(\'order.delayed\')" />',
    '',
    '<cca-text-badge flavor="danger" [text]="t(\'order.failed\')" [showDot]="true" />',
    '',
    '<cca-numerical-badge flavor="danger" [number]="unreadCount()" />',
    '',
    '<cca-attention-flag-badge flavor="warning" icon="warning" [label]="t(\'stop.late\')" />',
  ].join('\n');

  const sections = [
    [
      'Status badge',
      'cca-status-badge',
      flavors.status,
      (f: string) => statusBadge(f, 'In transit'),
    ],
    [
      'Label badge',
      'cca-label-badge',
      flavors.label.filter((f) => f !== 'emphasis-outline'),
      (f: string) => labelBadge(f, 'Refrigerated'),
    ],
    ['Text badge', 'cca-text-badge', flavors.text, (f: string) => textBadge(f, 'Assigned')],
    [
      'Numerical badge',
      'cca-numerical-badge',
      flavors.numerical,
      (f: string) => numericalBadge(f, '12'),
    ],
    [
      'Attention flag',
      'cca-attention-flag-badge',
      flavors.attentionFlag,
      (f: string) => attentionFlag(f, 'Late'),
    ],
  ] as const;

  const rendered = sections
    .map(([title, selector, list, render]) =>
      section(
        title,
        `<p class="lede"><code>${escapeHtml(selector)}</code> — ${list.length} flavours declared in its stylesheet.</p>`,
        `<div class="vr-items">${list.map((flavor) => labelled(flavor, render(flavor))).join('')}</div>`,
      ),
    )
    .join('\n');

  const extras = [
    variantRow(
      'Label badge — outline emphasis',
      flavors.label
        .filter((flavor) => flavor !== 'emphasis-outline')
        .slice(0, 5)
        .map((flavor) => labelBadge(flavor, 'Outlined', 'outline'))
        .join(''),
    ),
    variantRow(
      'Numerical badge — dot form',
      flavors.numerical
        .slice(0, 6)
        .map((flavor) => numericalBadge(flavor))
        .join(''),
    ),
    variantRow(
      'Status badge — small',
      flavors.status.map((flavor) => statusBadge(flavor, 'Small', true)).join(''),
    ),
  ].join('\n');

  const body = [
    section(
      'Which badge to use',
      '<p class="lede">Five badge components, each with its own purpose. They are not interchangeable, and each declares its own subset of flavours — a flavour a component does not style renders as unstyled text.</p>',
      '<ul style="font-size:13px;line-height:1.7;color:var(--text-neutral-body)">' +
        '<li><strong>Status badge</strong> — the state of a thing: a trip, an order, a booking.</li>' +
        '<li><strong>Label badge</strong> — a property or attribute: equipment, modality, a tag.</li>' +
        '<li><strong>Text badge</strong> — inline status inside dense content, usually with a dot.</li>' +
        '<li><strong>Numerical badge</strong> — a count, or a bare dot when there is nothing to count.</li>' +
        '<li><strong>Attention flag</strong> — something needs action; always paired with an icon.</li>' +
        '</ul>',
      codeCard('template', usageSample),
    ),
    rendered,
    section('Variants', `<div class="variant-grid">${extras}</div>`),
    section(
      'Rule',
      callout(
        'bad',
        'Never let colour carry the meaning alone',
        '<p>Every badge pairs its colour with a label. A bare coloured dot is only acceptable as a count-free notification marker on an element that already has an accessible name — never as the sole indicator of state.</p>',
      ),
    ),
  ].join('\n');

  return buildPage({
    path: 'components/badge.html',
    group: 'Components',
    subtitle: '5 components · flavours read from their own stylesheets',
    title: 'Badge',
    intro:
      'The five badge components and the flavours each one actually declares, rendered against their own exported CSS.',
    crumbs: ['Components', 'Badge'],
    sources: [
      'libs/ui/src/lib/badges/',
      'libs/ui/src/lib/status-badge-flavor.ts',
      'shared/styles/components/_badge.scss',
    ],
    devSelectors: [
      'cca-status-badge',
      'cca-label-badge',
      'cca-text-badge',
      'cca-numerical-badge',
      'cca-attention-flag-badge',
    ],
    styles: BADGE_STYLES,
    body,
  });
}

/** The iconography page. */
export function iconographyPage(icons: readonly IconEntry[]): string {
  const grid = icons
    .map(
      (icon) =>
        // The lowercased name is duplicated onto the element so the filter can
        // match case-insensitively without touching the rendered label.
        `<div class="ds-icon" data-name="${escapeHtml(icon.name.toLowerCase())}">` +
        `<span class="glyph cca-icon cca-icon-${escapeHtml(icon.name)}"></span>` +
        `<span class="name">${escapeHtml(icon.name)}</span>` +
        '</div>',
    )
    .join('\n');

  // Names that break the lowercase-kebab convention the rest follow. A designer
  // searching "gear" or "settings" finds nothing without the filter below.
  const offConvention = icons.filter((icon) => /[A-Z]/.test(icon.name)).map((icon) => icon.name);

  const usageSample = [
    '<cca-icon icon="arrow-right" />',
    '',
    '<!-- Size comes from font-size, so a type utility sets it -->',
    '<cca-icon icon="warning" class="text-xl" />',
    '',
    '<!-- Inside a button the size follows the button size input -->',
    '<button ccaButton size="small">',
    '  <cca-icon icon="plus" />',
    '  Add stop',
    '</button>',
  ].join('\n');

  const body = [
    section(
      'Usage',
      `<p class="lede">Icons come from the CtrlChain icon font — ${icons.length} glyphs — through <code>cca-icon</code>. The <code>icon</code> input is typed, so an unknown name is a compile error rather than an empty square.</p>`,
      codeCard('template', usageSample),
      callout(
        'info',
        'Icons are text, not images',
        '<p>Size is <code>font-size</code> and colour is <code>color</code>, which is why an icon inherits from its container and why <code>ccaButton</code> can resize its icon per size input without any per-icon markup.</p>',
      ),
    ),
    section(
      'All icons',
      '<div class="ds-icon-filter">' +
        '<input id="iconFilter" type="search" autocomplete="off" spellcheck="false" ' +
        `placeholder="Filter ${icons.length} icons — try gear, truck, chevron" ` +
        'aria-label="Filter icons by name" />' +
        '<span id="iconFilterCount" class="count" role="status"></span>' +
        '</div>',
      `<div class="ds-icons" id="iconGrid">${grid}</div>`,
      '<p class="ds-icon-empty" id="iconFilterEmpty" hidden>No glyph matches that name.</p>',
      ICON_FILTER_SCRIPT,
      callout(
        'warn',
        `${offConvention.length} names are not lowercase-kebab`,
        `<p>Most glyph names look like <code>arrow-right</code>, but ${offConvention.length} do not: ${offConvention
          .map((name) => `<code>${escapeHtml(name)}</code>`)
          .join(
            ', ',
          )}. The <code>icon</code> input is case-sensitive, so the admin rail item is <code>icon="Gear-Settings"</code> — <code>gear-settings</code> is a compile error. The filter above is case-insensitive, so searching <em>gear</em> still finds it.</p>`,
      ),
    ),
  ].join('\n');

  return buildPage({
    path: 'design-system/iconography.html',
    group: 'Foundations',
    subtitle: `${icons.length} glyphs in the CtrlChain icon font`,
    title: 'Iconography',
    intro:
      'Every glyph in the platform icon font, rendered from the font itself — so the page cannot list an icon that does not exist.',
    crumbs: ['Foundations', 'Iconography'],
    sources: ['shared/assets/icons/CtrlChain.css', 'libs/ui/src/lib/icon/'],
    devSelectors: ['cca-icon'],
    styles: BADGE_STYLES,
    body,
  });
}
