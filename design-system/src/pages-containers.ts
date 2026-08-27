/**
 * Generates the card and modal pages.
 *
 * Both are pure platform classes rather than Material components:
 * `.page-container` and `.dialog-container` are declared in the app's own global
 * stylesheet, so the samples below are the real classes and pick up the real
 * padding, radius and borders from the export.
 */

import { formField, resetFieldIds } from './material-dom.js';
import { buttonClasses } from './components.js';
import { type ShapeMetrics, remToPx } from './parse-metrics.js';
import { buildPage, callout, codeCard, escapeHtml, section } from './page-shell.js';

/** The card / page-container page. */
export function cardPage(metrics: ShapeMetrics): string {
  const radius = remToPx(metrics.dialogShape) ?? '12px';

  const pageContainer = `<div class="page-container" style="max-width:520px">
  <h3 style="margin:0 0 8px">Shipment CCA-4281</h3>
  <p class="text-cca-base text-neutral-subtitle" style="margin:0">
    Rotterdam → Berlin · 18,000 kg
  </p>
</div>`;

  const paddedCard = `<div class="rounded-lg border border-neutral-default surface-neutral-light p-4" style="max-width:520px">
  <div class="text-cca-label-lg text-neutral-title">Carrier</div>
  <div class="text-cca-base text-neutral-body">Van Dijk Logistics</div>
</div>`;

  const spaciousCard = `<div class="rounded-lg border border-neutral-default surface-neutral-light p-6" style="max-width:520px">
  <div class="text-cca-label-lg text-neutral-title">Totals</div>
  <div class="text-cca-counter text-neutral-title">4,281</div>
</div>`;

  const usageSample = [
    '<!-- Page-level container: 12px radius, 16px padding, 24px at >=1920px -->',
    '<div class="page-container">',
    '  <router-outlet />',
    '</div>',
    '',
    '<!-- Card / panel: 8px radius, p-4 default and p-6 when it needs room -->',
    '<div class="rounded-lg border border-neutral-default surface-neutral-light p-4">…</div>',
  ].join('\n');

  const body = [
    section(
      'Page container',
      `<p class="lede">Wrap a page in <code>.page-container</code> rather than hand-rolling it. It carries a ${escapeHtml(radius)} radius, a 1px neutral border, the light surface and 16px of padding — widening to 24px at 1920px and above.</p>`,
      `<div class="preview-panel"><div class="pp-body">${pageContainer}</div><div class="pp-foot"><span>.page-container</span><span>apps/platform/src/styles.scss</span></div></div>`,
      codeCard('template', usageSample),
    ),
    section(
      'Cards and panels',
      '<p class="lede">A card is a composed set of utilities, not a component — 8px radius on the surface, neutral border, and <code>p-4</code> unless the content genuinely needs room, in which case <code>p-6</code>.</p>',
      `<div class="preview-panel"><div class="pp-body" style="gap:16px;flex-wrap:wrap">${paddedCard}${spaciousCard}</div><div class="pp-foot"><span>p-4 (default) and p-6</span><span>template convention</span></div></div>`,
      callout(
        'info',
        'Do not reach for mat-card',
        '<p>Material&rsquo;s card is not part of the design system. Composing the surface, border and radius from utilities keeps a card themable and avoids inheriting Material&rsquo;s own elevation and padding scale.</p>',
      ),
    ),
    section(
      'Radius pairing',
      `<p class="lede">8px on controls and cards, ${escapeHtml(radius)} on dialogs and page-level containers. A card nested inside a page container therefore reads as slightly tighter than its parent, which is intentional.</p>`,
    ),
  ].join('\n');

  return buildPage({
    path: 'components/card.html',
    group: 'Components',
    subtitle: `.page-container ${radius} · cards 8px, p-4 / p-6`,
    title: 'Card',
    intro:
      'The container surfaces, built from the platform’s own global classes and utilities rather than a Material component.',
    crumbs: ['Components', 'Card'],
    sources: ['apps/platform/src/styles.scss', 'shared/styles/components/_card.scss'],
    body,
  });
}

/** The modal / dialog page. */
export function modalPage(metrics: ShapeMetrics): string {
  resetFieldIds();

  const radius = remToPx(metrics.dialogShape) ?? '12px';

  // The real surface class rather than a hand-rolled panel: it carries the
  // platform's dialog radius and background, and whatever elevation the app
  // actually sets — which is none, because separation comes from the CDK
  // backdrop rather than a shadow.
  //
  // `mdc-dialog--open` is the state class MatDialogContainer carries once the
  // dialog is shown, and it is what sets `transform: none` on the surface.
  // Without it Material keeps its enter-animation `scale(0.8)`, so the whole
  // dialog rendered at 80% — which is why this preview looked undersized.
  //
  // The surface then sizes itself: `.dialog-container main` has
  // `min-width: 30rem` and border-box sizing, so that 480px already includes
  // the p-6 gutters and `fit-content` picks it up.
  // z-index 1000 matches `.cdk-overlay-pane`. The backdrop carries the same
  // value, so without it the scrim painted *over* the dialog — which in light
  // mode turned a white panel grey and hid it against the scrim entirely.
  const dialog = `<div class="mdc-dialog--open" style="position:relative;z-index:1000">
  <div class="mat-mdc-dialog-surface mdc-dialog__surface" style="width:fit-content;max-width:80vw;position:relative">
  <div class="dialog-container" style="height:auto">
    <header>
      <div class="title-wrapper">
        <h2>Assign carrier</h2>
        <p>Shipment CCA-4281 · Rotterdam → Berlin</p>
      </div>
      <button class="dialog-close-button" aria-label="Close">
        <cca-icon><mat-icon class="mat-icon notranslate cca-icon cca-icon-xmark mat-ligature-font mat-icon-inline" aria-hidden="true"></mat-icon></cca-icon>
      </button>
    </header>
    <!-- Only max-height is relaxed: a static preview should not scroll. The
         30rem min-width is the platform's, and overriding it was what made this
         dialog render narrower than the real thing. -->
    <main style="max-height:none">
      <div class="flex flex-col gap-4">
        ${formField({ label: 'Carrier', value: 'Van Dijk Logistics' })}
        ${formField({ label: 'Agreed rate', value: '1,240.00', hint: 'EUR, excluding VAT' })}
      </div>
    </main>
    <footer>
      <button ccaButton class="${buttonClasses('subtle')}">Cancel</button>
      <button ccaButton class="${buttonClasses('primary')}">Assign carrier</button>
    </footer>
  </div>
  </div>
</div>`;

  const usageSample = [
    '<!-- The dialog body is always this three-part structure. -->',
    '<div class="dialog-container">',
    '  <header>',
    '    <div class="title-wrapper">',
    "      <h2>{{ t('assign.title') }}</h2>",
    '      <p>{{ shipment().reference }}</p>',
    '    </div>',
    '    <button class="dialog-close-button" (click)="close()" [attr.aria-label]="t(\'common.close\')">',
    '      <cca-icon icon="xmark" />',
    '    </button>',
    '  </header>',
    '',
    '  <main>',
    '    <form class="flex flex-col gap-4">…</form>',
    '  </main>',
    '',
    '  <footer>',
    '    <button ccaButton hierarchy="subtle" (click)="close()">{{ t(\'common.cancel\') }}</button>',
    '    <button ccaButton (click)="submit()">{{ t(\'assign.confirm\') }}</button>',
    '  </footer>',
    '</div>',
  ].join('\n');

  const metricRows = [
    ['Container radius', metrics.dialogShape ?? '0.75rem', '--mat-dialog-container-shape'],
    ['Container max width', '80vw', '--mat-dialog-container-max-width'],
    ['Header', 'px-6 py-4 + bottom border', '.dialog-container header'],
    ['Body', 'p-6, max-height 65vh, min-width 30rem', '.dialog-container main'],
    ['Footer', 'p-6, gap-4, centered, top border', '.dialog-container footer'],
  ]
    .map(
      ([part, value, source]) =>
        '<tr>' +
        `<td>${escapeHtml(part)}</td>` +
        `<td><code>${escapeHtml(value)}</code></td>` +
        `<td><code>${escapeHtml(source)}</code></td>` +
        '</tr>',
    )
    .join('\n');

  const body = [
    section(
      'Structure',
      `<p class="lede">Every dialog is a <code>header</code> / <code>main</code> / <code>footer</code> inside <code>.dialog-container</code>. The class supplies the padding, the dividing borders and the ${escapeHtml(radius)} radius, so a dialog never needs its own layout CSS.</p>`,
      // On the real CDK backdrop, because the dialog surface is
      // `surface-neutral-light` — the same colour as the preview panel — so
      // without a scrim the panel edge disappears entirely in dark mode.
      // Three layers, in the order the app stacks them: the page surface, the
      // CDK scrim over it, then the dialog. The page surface matters — the
      // dialog is `surface-neutral-light`, the same token as the preview panel,
      // so without it the panel edge and its 12px radius do not read at all.
      `<div class="preview-panel"><div class="pp-body" style="padding:0">` +
        '<div class="surface-neutral-default" style="position:relative;width:100%;padding:48px 40px;display:flex;justify-content:center">' +
        '<div class="cdk-overlay-backdrop cdk-overlay-dark-backdrop cdk-overlay-backdrop-showing"></div>' +
        `${dialog}</div></div>` +
        '<div class="pp-foot"><span>.dialog-container on the CDK backdrop</span><span>shared/styles/components/_dialog.scss</span></div></div>',
    ),
    section('Template', codeCard('template', usageSample)),
    section(
      'Metrics',
      '<div class="ds-scroll"><table class="ds-table">',
      '<thead><tr><th>Part</th><th>Value</th><th>Source</th></tr></thead>',
      `<tbody>${metricRows}</tbody></table></div>`,
      callout(
        'info',
        'The body scrolls, the dialog does not',
        '<p><code>main</code> caps at 65vh and scrolls internally, so the header and footer stay put. A dialog that needs more room than that usually wants to be a page.</p>',
      ),
    ),
    section(
      'Scrims',
      '<p class="lede">The platform has three overlay treatments and they are not interchangeable. Two of them now have a named token; the third is deliberately transparent.</p>',
      '<div class="ds-scroll"><table class="ds-table">',
      '<thead><tr><th>Overlay</th><th>Scrim</th><th>Token</th><th>Applied by</th></tr></thead>',
      '<tbody>' +
        '<tr><td>Dialog</td><td><code>rgba(0, 0, 0, 0.32)</code></td>' +
        '<td><code>--scrim-dialog</code></td>' +
        '<td><code>.cdk-overlay-dark-backdrop</code></td></tr>' +
        `<tr><td>Drawer / sidenav</td><td><code>${escapeHtml(metrics.sidenavScrim ?? 'var(--scrim-drawer, rgba(0, 0, 0, 0.6))')}</code></td>` +
        '<td><code>--scrim-drawer</code></td>' +
        '<td><code>--mat-sidenav-scrim-color</code></td></tr>' +
        '<tr><td>Side panel</td><td><code>transparent — no scrim</code></td>' +
        '<td>—</td>' +
        '<td><code>cdk-overlay-transparent-backdrop</code></td></tr>' +
        '</tbody></table></div>',
      callout(
        'info',
        'Both scrim tokens hold the same value in light and dark',
        '<p>A scrim darkens whatever sits behind it, so it is the one colour that must <em>not</em> follow the theme. <code>--scrim-dialog</code> and <code>--scrim-drawer</code> are declared with identical literal values in <code>light-mode.scss</code> and <code>dark-mode.scss</code> — reach for either instead of building a scrim out of a surface token.</p>',
      ),
      callout(
        'warn',
        'Never derive a scrim from a surface token',
        '<p>The earlier Figma spec asked for <code>surface-neutral-darkest</code> at 50%. That reads fine in light mode, where the token is Neutrals.800 — but in dark mode it resolves to <strong>Neutrals.200</strong>, so the overlay would come out <em>lighter</em> than the page behind it. Every neutral surface token inverts; the scrim tokens exist precisely so nothing has to.</p>',
      ),
      callout(
        'info',
        'The dialog token records the value, it does not set it',
        '<p><code>--scrim-drawer</code> is what <code>--mat-sidenav-scrim-color</code> reads, so changing it changes the drawer. <code>--scrim-dialog</code> only mirrors the number: the CDK hard-codes <code>rgba(0, 0, 0, 0.32)</code> on <code>.cdk-overlay-dark-backdrop</code> rather than reading a custom property, so a dialog scrim override still needs a rule that outranks it.</p>',
      ),
    ),
    section(
      'Drawer widths',
      '<p class="lede">A drawer is sized by the viewport, not by a fixed panel width. <code>cca-drawer-display-container</code> sets no width of its own — it is <code>flex h-full flex-col</code> and nothing more — so these three custom properties in <code>_drawer.scss</code> are the whole story.</p>',
      '<div class="ds-scroll"><table class="ds-table">',
      '<thead><tr><th>Token</th><th>Value</th><th>Applies to</th></tr></thead>',
      '<tbody>' +
        `<tr><td><code>--drawer-panel-min-width</code></td><td><code>${escapeHtml(metrics.drawerPanelMinWidth ?? '40%')}</code></td>` +
        '<td>Every drawer except the notifications panel</td></tr>' +
        `<tr><td><code>--drawer-panel-max-width</code></td><td><code>${escapeHtml(metrics.drawerPanelMaxWidth ?? '50%')}</code></td>` +
        '<td>Every drawer except the notifications panel</td></tr>' +
        `<tr><td><code>--drawer-panel-notifications-width</code></td><td><code>${escapeHtml(metrics.drawerPanelNotificationsWidth ?? '26.5rem')}</code></td>` +
        '<td><code>cca-notifications-panel</code> — the one fixed width</td></tr>' +
        '</tbody></table></div>',
      callout(
        'warn',
        'There is no fixed-pixel drawer width',
        '<p>Figma references a <code>512px</code> <code>drawer-panel-min-width</code>. No such value exists in the code — but note that 512 is exactly 50% of 1024, so it looks like a drawer measured at <em>max</em>-width on a 1024px-wide frame. The real drawer is percentage-based: it spans 576–720px on a 1440px viewport and 410–512px on a 1024px one. Pinning it to one pixel value would be a behaviour change, not a token rename.</p>',
      ),
      callout(
        'info',
        'Two drawers set their own z-index',
        '<p><code>cca-filters-drawer</code> raises the drawer to <code>1000</code> so it clears the CDK overlay container, and a container holding <code>cca-dialog-addresses</code> drops to <code>950</code> so an address dialog opened from a drawer still lands on top. Neither is a design decision to reproduce — they are stacking fixes.</p>',
      ),
    ),
    section(
      'Buttons in the footer',
      callout(
        'warn',
        'Confirm on the right, and only one primary',
        '<p>The footer centres its actions with a 16px gap. The confirming action is the single <code>primary</code>; everything alongside it is <code>subtle</code> or <code>tertiary</code>. A destructive confirm uses <code>danger-primary</code> instead.</p>',
      ),
    ),
  ].join('\n');

  return buildPage({
    path: 'components/modal.html',
    group: 'Components',
    subtitle: `header / main / footer · ${radius} radius · 65vh body`,
    title: 'Modal',
    intro:
      'The dialog shell as the platform defines it, rendered with the real .dialog-container class and real form fields inside it.',
    crumbs: ['Components', 'Modal'],
    sources: [
      'shared/styles/components/_dialog.scss',
      'libs/ui/src/lib/button/button.component.scss',
    ],
    devSelectors: ['MatDialog'],
    styles: `
      .ds-table { width: 100%; border-collapse: collapse; font-size: 12px; }
      .ds-table th { text-align: left; padding: 6px 10px; font-weight: 600; }
      .ds-table thead tr { border-bottom: 1px solid var(--border-neutral-default); }
      .ds-table td { padding: 6px 10px; }
      .ds-table code { font-size: 11px; }
      .ds-scroll { overflow-x: auto; }
`,
    body,
  });
}
