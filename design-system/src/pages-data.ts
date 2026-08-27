/**
 * Generates the table, tabs, chips and tooltip pages.
 *
 * These are all Material components the platform re-skins heavily, so each page
 * documents the platform class that does the re-skinning — `.cca-tabs`,
 * `.cca-chip`, `.cca-tippy` — rather than the bare Material default, which
 * looks nothing like the app.
 */

import { chip, table, tabHeader } from './material-dom.js';
import { buildPage, callout, codeCard, escapeHtml, section } from './page-shell.js';

/** Shared table styling for the metric listings on these pages. */
const METRIC_STYLES = `
      .ds-table { width: 100%; border-collapse: collapse; font-size: 12px; }
      .ds-table th { text-align: left; padding: 6px 10px; font-weight: 600; }
      .ds-table thead tr { border-bottom: 1px solid var(--border-neutral-default); }
      .ds-table td { padding: 6px 10px; }
      .ds-table code { font-size: 11px; }
      .ds-scroll { overflow-x: auto; }
`;

/** A labelled row of demo items in the shell's variant-grid styling. */
function variantRow(label: string, items: string): string {
  return [
    '<div class="variant-row">',
    `  <div class="vr-label">${escapeHtml(label)}</div>`,
    `  <div class="vr-items">${items}</div>`,
    '</div>',
  ].join('\n');
}

/** Renders a metric table from label/value/source triples. */
function metricTable(rows: readonly (readonly [string, string, string])[]): string {
  const body = rows
    .map(
      ([part, value, source]) =>
        '<tr>' +
        `<td>${escapeHtml(part)}</td>` +
        `<td><code>${escapeHtml(value)}</code></td>` +
        `<td><code>${escapeHtml(source)}</code></td>` +
        '</tr>',
    )
    .join('\n');

  return [
    '<div class="ds-scroll"><table class="ds-table">',
    '<thead><tr><th>Part</th><th>Value</th><th>Source</th></tr></thead>',
    `<tbody>${body}</tbody></table></div>`,
  ].join('\n');
}

// ---------------------------------------------------------------------------
// Table
// ---------------------------------------------------------------------------

/** The data-table page. */
export function tablePage(): string {
  const demo = table({
    columns: ['Reference', 'Route', 'Carrier', 'Weight', 'Status'],
    rows: [
      ['CCA-4281', 'Rotterdam → Berlin', 'Van Dijk Logistics', '18,000 kg', 'In transit'],
      ['CCA-4282', 'Antwerp → Lyon', 'Moreau Transport', '12,400 kg', 'Assigned'],
      ['CCA-4283', 'Hamburg → Praha', 'Novak Freight', '9,850 kg', 'In planning'],
    ],
  });

  const usageSample = [
    '<table mat-table [dataSource]="rows()">',
    '  <ng-container matColumnDef="reference">',
    "    <th mat-header-cell *matHeaderCellDef>{{ t('order.reference') }}</th>",
    '    <td mat-cell *matCellDef="let row">{{ row.reference }}</td>',
    '  </ng-container>',
    '',
    '  <tr mat-header-row *matHeaderRowDef="columns"></tr>',
    '  <tr mat-row *matRowDef="let row; columns: columns"></tr>',
    '</table>',
    '',
    '<mat-paginator [pageSizeOptions]="[25, 50, 100]" />',
  ].join('\n');

  const body = [
    section(
      'Anatomy',
      '<p class="lede">Tables are <code>mat-table</code> with the platform&rsquo;s own cell padding and borders. Cell padding is 14px on every side — Material ships none vertically, so the platform adds it back.</p>',
      `<div class="preview-panel"><div class="pp-body" style="padding:0;display:block">${demo}</div><div class="pp-foot"><span>mat-table</span><span>shared/styles/components/_table.scss</span></div></div>`,
    ),
    section('Template', codeCard('template', usageSample)),
    section(
      'Metrics',
      metricTable([
        ['Cell padding', '0.875rem (14px)', '.mdc-data-table__cell'],
        ['Header cell', 'font-medium, text-neutral-body', '.mdc-data-table__header-cell'],
        ['Header underline', 'border-neutral-dark', '--mat-table-row-item-outline-color'],
        ['Row divider', 'border-neutral-default', '.mdc-data-table__cell'],
        ['Row height', 'auto — content decides', '.mdc-data-table__row'],
        ['Cell alignment', 'middle', 'table td'],
      ]),
      callout(
        'info',
        'Rows size to their content',
        '<p>Both header and body rows are <code>height: auto</code>, so a cell with two lines makes its row taller rather than clipping. Do not set a fixed row height to line tables up — use consistent cell content instead.</p>',
      ),
    ),
    section(
      'Paginator',
      '<p class="lede">The page-size select inside <code>mat-paginator</code> is the one place a form field shrinks to 32px, and the range label carries 48px of horizontal margin (16px with <code>.cca-paginator-compact</code>).</p>',
      callout(
        'warn',
        'Use the data-table generator for new tables',
        '<p>New list views should come from the repo&rsquo;s <code>cca-data-table</code> skill rather than hand-assembled markup — it wires typed columns, pagination and filters to a paginated backend endpoint for you.</p>',
      ),
    ),
  ].join('\n');

  return buildPage({
    path: 'components/table.html',
    group: 'Components',
    subtitle: '14px cells · auto row height · top-aligned',
    title: 'Table',
    intro:
      'Real mat-table DOM against the platform’s own table overrides — the padding, borders and alignment the app actually renders.',
    crumbs: ['Components', 'Table'],
    sources: ['shared/styles/components/_table.scss', 'shared/styles/components/_paginator.scss'],
    devSelectors: ['mat-table', 'mat-paginator'],
    styles: METRIC_STYLES,
    body,
  });
}

// ---------------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------------

/** The tabs page — both the Material tabs and the platform's main tab bar. */
export function tabsPage(): string {
  const ccaTabs = tabHeader(
    [
      { label: 'Overview', active: true },
      { label: 'Stops' },
      { label: 'Documents' },
      { label: 'Disabled', disabled: true },
    ],
    'cca',
  );

  const materialTabs = tabHeader(
    [{ label: 'Details', active: true }, { label: 'History' }, { label: 'Costs' }],
    'material',
  );

  const menuBar = `<div class="menu-bar">
  <a class="active">Trips</a>
  <a>Orders</a>
  <a>Invoices</a>
</div>`;

  const usageSample = [
    '<!-- Bordered, brand-filled tabs: add the cca-tabs class -->',
    '<mat-tab-group class="cca-tabs">',
    '  <mat-tab [label]="t(\'trip.overview\')">…</mat-tab>',
    '  <mat-tab [label]="t(\'trip.stops\')">…</mat-tab>',
    '</mat-tab-group>',
    '',
    '<!-- Page-level navigation between sibling routes -->',
    '<div class="menu-bar">',
    '  <a routerLink="trips" routerLinkActive="active">{{ t(\'nav.trips\') }}</a>',
    '  <a routerLink="orders" routerLinkActive="active">{{ t(\'nav.orders\') }}</a>',
    '</div>',
  ].join('\n');

  const body = [
    section(
      'Tabs inside a page',
      '<p class="lede">Add <code>.cca-tabs</code> to a <code>mat-tab-group</code> to get the platform&rsquo;s bordered strip: each tab is a bordered surface, the active one fills with brand and inverts its label, and the outer corners round to 10px.</p>',
      `<div class="preview-panel"><div class="pp-body" style="display:block;padding:24px">${ccaTabs}</div><div class="pp-foot"><span>.cca-tabs</span><span>shared/styles/components/_tabs.scss</span></div></div>`,
    ),
    section(
      'Material tabs',
      '<p class="lede">Without <code>.cca-tabs</code> you get the underline variant — brand indicator, brand active label, caption-grey inactive labels. Both are in use; the bordered strip is for switching content within a detail page, the underline for lighter sub-navigation.</p>',
      `<div class="preview-panel"><div class="pp-body" style="display:block;padding:24px">${materialTabs}</div><div class="pp-foot"><span>mat-tab-group</span><span>_tabs.scss token overrides</span></div></div>`,
    ),
    section(
      'Main tab bar',
      '<p class="lede">Page-level navigation uses <code>.menu-bar</code>, not tabs at all — 48px tall, uppercase labels, and the active item lifts above its neighbours with a 12px radius and negative margins.</p>',
      `<div class="preview-panel"><div class="pp-body" style="display:block;padding:24px">${menuBar}</div><div class="pp-foot"><span>.menu-bar</span><span>shared/styles/_main.scss</span></div></div>`,
    ),
    section('Template', codeCard('template', usageSample)),
    section(
      'Metrics',
      metricTable([
        ['Label size', '1rem / 500', '--mat-tab-label-text-size'],
        ['Active label', 'text-brand-default', '--mat-tab-active-label-text-color'],
        ['Inactive label', 'text-neutral-caption', '--mat-tab-inactive-label-text-color'],
        ['Active indicator', 'border-brand-default', '--mat-tab-active-indicator-color'],
        ['.cca-tabs corners', '0.625rem (10px) outer only', '.cca-tabs .mat-mdc-tab'],
        ['.menu-bar height', '3rem (48px)', '.menu-bar a'],
      ]),
    ),
  ].join('\n');

  return buildPage({
    path: 'components/tabs.html',
    group: 'Components',
    subtitle: '.cca-tabs strip · Material underline · .menu-bar',
    title: 'Tabs',
    intro:
      'The three tab treatments the platform actually uses, rendered against the real tab overrides.',
    crumbs: ['Components', 'Tabs'],
    sources: ['shared/styles/components/_tabs.scss', 'shared/styles/_main.scss'],
    devSelectors: ['mat-tab-group'],
    styles: METRIC_STYLES,
    body,
  });
}

// ---------------------------------------------------------------------------
// Chips
// ---------------------------------------------------------------------------

/** The chips page. */
export function chipsPage(): string {
  const states = [
    variantRow(
      'Unselected',
      [chip({ label: 'Refrigerated' }), chip({ label: 'ADR' }), chip({ label: 'Tail lift' })].join(
        '\n    ',
      ),
    ),
    variantRow(
      'Selected — brand outline, tinted fill, checkmark',
      [
        chip({ label: 'Refrigerated', selected: true }),
        chip({ label: 'ADR', selected: true }),
      ].join('\n    '),
    ),
    variantRow(
      'Disabled',
      [
        chip({ label: 'Tail lift', disabled: true }),
        chip({ label: 'ADR', selected: true, disabled: true }),
      ].join('\n    '),
    ),
  ].join('\n');

  const usageSample = [
    '<!-- .cca-chip is what carries the platform styling -->',
    '<mat-chip-listbox>',
    '  @for (option of options(); track option.id) {',
    '    <mat-chip-option class="cca-chip" [selected]="option.selected">',
    '      {{ option.label }}',
    '    </mat-chip-option>',
    '  }',
    '</mat-chip-listbox>',
  ].join('\n');

  const body = [
    section(
      'States',
      '<p class="lede">Chips are selectable filters. The <code>.cca-chip</code> class supplies the platform look — a 10px radius, a neutral outline unselected, and a brand outline with tinted fill and a checkmark once selected.</p>',
      `<div class="variant-grid">${states}</div>`,
    ),
    section('Template', codeCard('template', usageSample)),
    section(
      'Metrics',
      metricTable([
        ['Height', '2.5rem (40px)', '--mat-chip-container-height'],
        ['Radius (selected)', '0.625rem (10px)', '.cca-chip.mdc-evolution-chip--selected'],
        ['Outline, unselected', 'chips-outline-neutral', '--mat-chip-outline-color'],
        ['Outline, selected', 'chips-outline-brand', '.cca-chip.mdc-evolution-chip--selected'],
        ['Fill, selected', 'chips-bg-selected', '.cca-chip.mdc-evolution-chip--selected'],
        ['Label, selected', 'success-text, weight 400', '.mdc-evolution-chip__text-label'],
      ]),
      callout(
        'bad',
        'A bare mat-chip is not a platform chip',
        '<p>Without <code>.cca-chip</code> you get Material&rsquo;s pill: a fully rounded, grey-filled chip with none of the outline or selected treatment. The class is not optional.</p>',
      ),
    ),
  ].join('\n');

  return buildPage({
    path: 'components/chips.html',
    group: 'Components',
    subtitle: '40px · 10px radius · selectable filter chips',
    title: 'Chips',
    intro:
      'Selectable filter chips with the .cca-chip class the platform styles, rendered against the real chip overrides.',
    crumbs: ['Components', 'Chips'],
    sources: ['shared/styles/components/_chip.scss'],
    devSelectors: ['mat-chip-option', 'mat-chip-listbox'],
    styles: METRIC_STYLES,
    body,
  });
}

// ---------------------------------------------------------------------------
// Tooltip
// ---------------------------------------------------------------------------

/** The tooltip page. */
export function tooltipPage(): string {
  // tippy positions the arrow with popper at runtime — `position` and `left` are
  // inline styles on the arrow element, so a static page has to supply them or
  // the arrow stays `position: static` and lands in the corner of the box.
  //
  // The vertical offset is deliberately left to tippy's own
  // `[data-placement^=top] > .tippy-arrow { bottom: 0 }`. Overriding it pushed
  // the popover's rotated square right out of the box, where it read as a
  // detached diamond instead of the small pointer the app shows.
  const darkTooltip = `<div class="tippy-box cca-tippy" data-placement="top" style="max-width:320px;position:relative">
  <div class="tippy-content" style="padding:5px 9px">Estimated arrival 14:20 local time</div>
  <div class="tippy-arrow" style="position:absolute;left:calc(50% - 8px)"></div>
</div>`;

  const popover = `<div class="tippy-box cca-popover-tippy" data-placement="top" style="max-width:320px;position:relative">
  <div class="tippy-content">
    <div class="p-4">
      <div class="text-cca-label-lg text-neutral-title">Van Dijk Logistics</div>
      <div class="text-cca-base-sm text-neutral-subtitle">4 active trips · Rotterdam</div>
    </div>
  </div>
  <div class="tippy-arrow" style="position:absolute;left:calc(50% - 12px)"></div>
</div>`;

  const usageSample = [
    '<!-- Short text tooltip -->',
    '<span [ngxTippy]="t(\'trip.etaHint\')" [tippyProps]="{ theme: \'cca\' }">',
    '  14:20',
    '</span>',
    '',
    '<!-- Rich popover: content is a template, not a string -->',
    '<span',
    '  [ngxTippy]="carrierCard"',
    "  [tippyProps]=\"{ theme: 'cca-popover', interactive: true, appendTo: 'parent' }\"",
    '>{{ carrier().name }}</span>',
    '',
    '<ng-template #carrierCard>…</ng-template>',
  ].join('\n');

  const body = [
    section(
      'Two treatments',
      '<p class="lede">Tooltips are <a href="https://atomiks.github.io/tippyjs/">tippy.js</a> through <code>ngx-tippy-wrapper</code> — <strong>not</strong> <code>matTooltip</code>. Two themes: a dark tooltip for short text, and a light popover for rich content.</p>',
      // Explicit flex here rather than relying on .pp-body, so the two boxes sit
      // side by side even when this page is opened outside the documentation shell.
      `<div class="preview-panel"><div class="pp-body" style="padding:48px 40px"><div style="display:flex;gap:48px;flex-wrap:wrap;align-items:flex-start">${darkTooltip}${popover}</div></div><div class="pp-foot"><span>.cca-tippy and .cca-popover-tippy</span><span>shared/styles/libs/_tippy.scss</span></div></div>`,
    ),
    section('Template', codeCard('template', usageSample)),
    section(
      'Metrics',
      metricTable([
        ['Tooltip surface', 'surface-neutral-darkest', '.cca-tippy'],
        ['Tooltip border', '1px border-brand-light', '.cca-tippy'],
        ['Tooltip text', 'text-neutral-invert', '.tippy-box'],
        ['Popover surface', 'surface-neutral-light, 12px radius', '.cca-popover-tippy'],
        ['Popover shadow', '0 10px 40px rgba(0,0,0,0.15)', '.cca-popover-tippy'],
        [
          'Popover padding',
          '0 — the content supplies its own',
          '.cca-popover-tippy .tippy-content',
        ],
      ]),
      callout(
        'warn',
        'matTooltip is not the platform tooltip',
        '<p>Material&rsquo;s tooltip is unstyled here and will not match. One exception exists in <code>cca-text-badge</code>, which still uses <code>matTooltip</code> for its info icon — treat that as legacy, not a pattern.</p>',
      ),
    ),
  ].join('\n');

  return buildPage({
    path: 'components/tooltip.html',
    group: 'Components',
    subtitle: 'tippy.js · dark tooltip and light popover',
    title: 'Tooltip',
    intro:
      'The platform’s real tooltip stack — tippy.js with two themes, rendered against the exported tippy CSS.',
    crumbs: ['Components', 'Tooltip'],
    sources: ['shared/styles/libs/_tippy.scss'],
    devSelectors: ['ngxTippy'],
    styles: METRIC_STYLES,
    body,
  });
}
