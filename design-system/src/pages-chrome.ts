/**
 * Generates the search bar, sidebar, top bar and the three overview pages.
 *
 * The app chrome is styled through deeply nested global selectors
 * (`cca-main .appContent cca-side-menu .menu-item`), so these previews
 * reproduce the real shell nesting. Drop a `.menu-item` outside that ancestry
 * and none of its styling applies — which is exactly the trap this page exists
 * to prevent.
 */

import { buttonClasses } from './components.js';
import { ccaIcon, chip, progressSpinner, searchField } from './material-dom.js';
import { buildPage, callout, codeCard, escapeHtml, section } from './page-shell.js';

const CHROME_STYLES = `
      /* Mirrors the .appContent grid: rail, submenu, page.
         The submenu column is the 13.5rem the shell collapses to at >=1280px. */
      .ds-shell {
        display: grid; grid-template-columns: 4.5rem 13.5rem 1fr;
        border: 1px solid var(--border-neutral-default);
        border-radius: 12px; overflow: hidden; min-height: 420px;
      }
      .ds-shell.rail-only { grid-template-columns: 4.5rem 1fr; }
      .ds-shell > * { min-width: 0; }
      .ds-page { padding: 16px; background: var(--surface-neutral-default); }
      .ds-row { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; }
      .ds-links { font-size: 13px; line-height: 1.8; }
      .ds-links a { color: var(--text-brand-default); text-decoration: none; }
      .ds-links a:hover { text-decoration: underline; }
`;

/**
 * One rail item, in the nesting both the global and the component styles need:
 * `cca-side-menu-item` supplies `.a-menu-item`, and `_main.scss` supplies
 * `.menu-item` — but only under `cca-main .appContent cca-side-menu`.
 */
function menuItem(icon: string, label: string, active = false): string {
  return (
    '<cca-side-menu-item style="display:block;width:100%">' +
    `<a class="a-menu-item${active ? ' active' : ''}" href="#">` +
    `<div class="menu-item">${ccaIcon(icon)}` +
    `<span class="menu-item-title">${escapeHtml(label)}</span></div></a>` +
    '</cca-side-menu-item>'
  );
}

/** A divider between rail groups. */
function railDivider(opacity: '50' | '30'): string {
  return `<hr class="my-2 w-full border-NC-blue-lighter opacity-${opacity}" />`;
}

/** The full icon rail, including the logo header and the bottom cluster. */
function railMarkup(base: string): string {
  return `<cca-side-menu style="display:block;height:100%">
  <div class="menu-wrapper">
    <div class="logo-wrapper cursor-pointer">
      <!-- The app's template adds crossorigin because it serves assets from a
           CDN. Omitted here: it has no effect on appearance and it stops the
           image loading at all when the bundle is opened over file://. -->
      <img class="w-8" src="${base}assets/images/ctrlchain-logo-white.svg" alt="CtrlChain" />
    </div>
    <div class="side-menu">
      <div class="menu-items">
        ${menuItem('truck', 'Trips', true)}
        ${menuItem('box', 'Orders')}
        ${menuItem('invoice', 'Invoices')}
        ${railDivider('50')}
        ${menuItem('users', 'Carriers')}
        ${menuItem('bar-chart', 'Reports')}
        <div class="mt-auto flex flex-col gap-2">
          ${railDivider('30')}
          <div class="menu-item" role="menuitem" tabindex="0">
            ${ccaIcon('moon')}<span class="menu-item-title">Dark mode</span>
          </div>
          <div class="menu-item submenu-toggle" role="button" tabindex="0">
            ${ccaIcon('chevrons-left')}<span class="menu-item-title">Collapse</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</cca-side-menu>`;
}

/** One submenu link. */
function subItem(icon: string, label: string, active = false): string {
  return (
    `<a class="sub-item${active ? ' active' : ''}" href="#">${ccaIcon(icon)}` +
    `<span class="text-cca-base font-normal wrap-break-word">${escapeHtml(label)}</span></a>`
  );
}

/** The expanded submenu column, with its branding header and action button. */
function submenuMarkup(base: string): string {
  return `<cca-side-submenu style="display:block;height:100%">
  <div class="submenu-container">
    <div class="min-h-15 w-full content-center border-b border-neutral-default">
      <img class="mr-auto max-w-32 px-4 py-3" src="${base}assets/images/ctrlchain-text-green.svg"
        alt="CtrlChain" />
    </div>

    <div class="flex w-full flex-col gap-4 border-b border-neutral-default p-4">
      <button ccaButton class="${buttonClasses('primary')} icon-button-rounded w-full shadow">
        ${ccaIcon('plus')}New trip
      </button>
    </div>

    <div class="flex w-full flex-col gap-4">
      <span class="mt-4 pl-4 font-medium text-neutral-caption">Trips</span>
      ${subItem('list', 'Overview', true)}
      ${subItem('calendar', 'Planning')}
      ${subItem('map-location-dot', 'Live map')}
      ${subItem('file-lines', 'Documents')}
    </div>
  </div>
</cca-side-submenu>`;
}

/** Wraps chrome markup in the `cca-main` / `.appContent` ancestry it needs. */
function shell(inner: string): string {
  return `<cca-main style="display:block;height:100%"><div class="appContent" style="display:block;height:100%">${inner}</div></cca-main>`;
}

// ---------------------------------------------------------------------------
// Search bar
// ---------------------------------------------------------------------------

/** The search-bar page. */
export function searchBarPage(): string {
  const usageSample = [
    '<cca-search-field',
    '  [searchLabel]="t(\'common.searchPlaceholder\')"',
    '  [(search)]="query"',
    '  [loading]="isSearching()"',
    '  (enter)="runSearch($event)"',
    '/>',
    '',
    '<!-- Compact variant for toolbars and dense headers -->',
    '<cca-search-field [useCompactLayout]="true" [searchLabel]="t(\'common.search\')" />',
  ].join('\n');

  const samples = [
    ['Empty', searchField({ placeholder: 'Search shipments' })],
    [
      'With a query and clear button',
      searchField({ placeholder: 'Search shipments', value: 'Rotterdam', clearable: true }),
    ],
    [
      'Loading',
      searchField({ placeholder: 'Search shipments', value: 'Rotterdam', loading: true }),
    ],
  ]
    .map(
      ([label, markup]) =>
        '<div class="variant-row">' +
        `<div class="vr-label">${escapeHtml(label)}</div>` +
        `<div class="vr-items" style="display:block"><div style="max-width:420px">${markup}</div></div>` +
        '</div>',
    )
    .join('\n');

  const body = [
    section(
      'States',
      '<p class="lede">The search field is a <code>mat-form-field</code> with a leading search icon and <strong>no label</strong> — the search text is a placeholder, so nothing ever floats into the outline notch. That is what makes it read as a search box rather than a form input.</p>',
      `<div class="variant-grid">${samples}</div>`,
    ),
    section('Template', codeCard('template', usageSample)),
    section(
      'Details worth knowing',
      callout(
        'info',
        'The clear button is a ccaButton, not a Material icon button',
        '<p>It is <code>hierarchy="icon" size="small"</code>, and the component zeroes the button&rsquo;s own padding so it does not stack with the padding the global form-field rules already apply to suffix icons. Without that the button grows taller than the field.</p>',
      ),
      callout(
        'info',
        'Loading swaps the icon for a spinner',
        '<p>An 18px <code>mat-progress-spinner</code> replaces the search icon in place, so the field does not reflow. The spinner is driven from <code>currentColor</code> because the Material active-indicator token is not set in this theme.</p>',
      ),
    ),
  ].join('\n');

  return buildPage({
    path: 'components/search-bar.html',
    group: 'Components',
    subtitle: 'Placeholder-only field · icon prefix · clear button',
    title: 'Search Bar',
    intro:
      'The cca-search-field component rendered against its own exported stylesheet and the platform’s form-field overrides.',
    crumbs: ['Components', 'Search Bar'],
    sources: ['libs/ui/src/lib/search-field/', 'shared/styles/components/_form-field.scss'],
    devSelectors: ['cca-search-field'],
    styles: CHROME_STYLES,
    body,
  });
}

// ---------------------------------------------------------------------------
// Sidebar
// ---------------------------------------------------------------------------

/** The sidebar page — the rail, the expanded submenu, and the collapsed state. */
export function sidebarPage(): string {
  // sidebar.html lives in components/, so assets are one level up.
  const BASE = '../';
  const page =
    '<div class="ds-page"><div class="text-cca-base text-neutral-subtitle">Page content</div></div>';

  const expanded = `<div class="ds-shell">${shell(railMarkup(BASE))}${shell(submenuMarkup(BASE))}${page}</div>`;
  const collapsed = `<div class="ds-shell rail-only">${shell(railMarkup(BASE))}${page}</div>`;

  const usageSample = [
    '<!-- The shell is app chrome; features never render it themselves. -->',
    '<cca-main>',
    '  <div class="appContent">',
    '    <cca-side-menu />',
    '    <cca-side-submenu />',
    '    <cca-header />',
    '    <div class="page"><router-outlet /></div>',
    '  </div>',
    '</cca-main>',
  ].join('\n');

  const metricRows = [
    ['Rail width', 'w-18 (4.5rem / 72px)', '.menu-wrapper'],
    ['Rail surface', 'sidebar-main-bg-default', '.menu-wrapper'],
    ['Logo header', 'h-15, border-b border-NC-blue-lighter', '.logo-wrapper'],
    ['Rail item gap', 'gap-2 (8px)', '.menu-items'],
    ['Submenu width', '13.5rem (216px) at ≥1280px', '.appContent'],
    ['Submenu surface', 'surface-neutral-light, border-r', '.submenu-container'],
    ['Sub-item', 'gap-4, px-4 py-2, 4px transparent right border', '.sub-item'],
    ['Sub-item active', 'border-brand-default + surface-brand-lightest', '.sub-item.active'],
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
      'Rail and submenu',
      '<p class="lede">Navigation is two columns. The 72px rail switches domain; the 216px submenu lists the routes within it, headed by the branding lockup and — where the domain has a primary action — a full-width rounded button.</p>',
      `<div class="preview-panel"><div class="pp-body" style="padding:0;display:block">${expanded}</div><div class="pp-foot"><span>cca-side-menu + cca-side-submenu</span><span>apps/platform/src/app/core/</span></div></div>`,
    ),
    section(
      'Collapsed',
      '<p class="lede">The submenu toggle at the bottom of the rail collapses the second column away. The rail keeps its selected state, so the current domain stays legible with no submenu on screen.</p>',
      `<div class="preview-panel"><div class="pp-body" style="padding:0;display:block">${collapsed}</div><div class="pp-foot"><span>submenu collapsed</span><span>.submenu-toggle</span></div></div>`,
    ),
    section(
      'The active states differ on purpose',
      '<p class="lede">A selected rail item fills with the selected sidebar surface and inverts its icon and label. A selected sub-item does something different: a <strong>4px brand right border</strong> plus the lightest brand surface, with icon and label in brand dark. Two levels, two treatments, so it is always clear which one is being read.</p>',
      callout(
        'warn',
        'These classes only work inside the shell',
        '<p><code>.menu-item</code> is declared as <code>cca-main .appContent cca-side-menu .menu-item</code>, and <code>.sub-item</code> is component-scoped to <code>cca-side-submenu</code>. Rendered anywhere else, neither picks up any styling — build a rail-like control in a feature from utilities instead of borrowing these.</p>',
      ),
    ),
    section('Template', codeCard('template', usageSample)),
    section(
      'Metrics',
      '<div class="ds-scroll"><table class="ds-table">',
      '<thead><tr><th>Part</th><th>Value</th><th>Source</th></tr></thead>',
      `<tbody>${metricRows}</tbody></table></div>`,
    ),
    section(
      'Page padding',
      '<p class="lede">The <code>.page</code> area carries <code>p-4</code> by default and drops to <code>p-0</code> when it contains a <code>cca-grid</code> or <code>cca-sequence</code>, both of which manage their own edges. That is the single source of truth — do not add compensating negative margins in a feature.</p>',
    ),
  ].join('\n');

  return buildPage({
    path: 'components/sidebar.html',
    group: 'Components',
    subtitle: '72px rail + 216px submenu · both active states',
    title: 'Sidebar Menu',
    intro:
      'The rail and the submenu together, rendered with their own component stylesheets and the shell ancestry the global styles depend on.',
    crumbs: ['Components', 'Sidebar Menu'],
    sources: [
      'apps/platform/src/app/core/side-menu/',
      'apps/platform/src/app/core/side-menu-item/',
      'apps/platform/src/app/core/side-submenu/',
      'shared/styles/_main.scss',
    ],
    devSelectors: ['cca-side-menu', 'cca-side-submenu'],
    styles: `${CHROME_STYLES}
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

// ---------------------------------------------------------------------------
// Top bar
// ---------------------------------------------------------------------------

/** The top-bar page. */
export function topBarPage(): string {
  const header = `<div class="sticky z-10 flex h-15 w-auto max-w-full items-center border-b border-neutral-default surface-neutral-light">
  <div class="pl-6">
    <button ccaButton class="${buttonClasses('tertiary', 'default', true)}" aria-label="Back">${ccaIcon('arrow-left')}</button>
  </div>
  <div class="flex flex-row items-center gap-2 pl-1">
    <h1 class="text-cca-label-lg text-neutral-title">Trip CCA-4281</h1>
  </div>
  <div class="ml-auto flex items-center gap-2 pr-6">
    <button ccaButton class="${buttonClasses('icon', 'default', true)}" aria-label="Notifications">${ccaIcon('bell')}</button>
    <button ccaButton class="${buttonClasses('icon', 'default', true)}" aria-label="Help">${ccaIcon('info')}</button>
  </div>
</div>`;

  const body = [
    section(
      'Anatomy',
      '<p class="lede">The top bar is 60px tall (<code>h-15</code>), sits on the light neutral surface with a bottom border, and sticks to the top of the page area. It is composed from utilities rather than a component of its own.</p>',
      `<div class="preview-panel"><div class="pp-body" style="padding:0;display:block">${header}</div><div class="pp-foot"><span>cca-header</span><span>apps/platform/src/app/core/header/</span></div></div>`,
    ),
    section(
      'Contents',
      '<p class="lede">Left to right: a tertiary icon-only back button, the page title, then the trailing action cluster. Every action in the bar is an icon-only <code>ccaButton</code> with an <code>aria-label</code> — there are no bare icon elements.</p>',
      callout(
        'info',
        'The page title comes from a service, not markup',
        '<p>Use the repo&rsquo;s <code>pageTitle()</code> helper in a route component&rsquo;s constructor. It keeps the title in sync across route and language changes; hard-coding a heading in the bar will not translate.</p>',
      ),
    ),
  ].join('\n');

  return buildPage({
    path: 'components/top-bar.html',
    group: 'Components',
    subtitle: '60px · sticky · icon-only actions',
    title: 'Top Bar',
    intro: 'The page header bar, composed from the same utilities the app uses.',
    crumbs: ['Components', 'Top Bar'],
    sources: ['apps/platform/src/app/core/header/', 'shared/styles/_main.scss'],
    devSelectors: ['cca-header'],
    styles: CHROME_STYLES,
    body,
  });
}

// ---------------------------------------------------------------------------
// Overview pages
// ---------------------------------------------------------------------------

/** A link list to the authoritative component pages. */
function links(base: string, entries: readonly (readonly [string, string])[]): string {
  return (
    '<div class="ds-links">' +
    entries
      .map(([href, label]) => `<div><a href="${base}${href}">${escapeHtml(label)}</a></div>`)
      .join('') +
    '</div>'
  );
}

/**
 * The navigation overview. Deliberately an index rather than a copy: the tab and
 * rail detail lives on its own page, and duplicating it here is how the two
 * would drift apart.
 */
export function navigationPage(): string {
  const menuBar = `<div class="menu-bar">
  <a class="active">Trips</a>
  <a>Orders</a>
  <a>Invoices</a>
</div>`;

  const body = [
    section(
      'Three levels of navigation',
      '<p class="lede">The platform navigates at three levels, and they are not interchangeable.</p>',
      '<ul style="font-size:13px;line-height:1.8;color:var(--text-neutral-body)">' +
        '<li><strong>Icon rail</strong> — moves between domains: trips, orders, invoices.</li>' +
        '<li><strong>Main tab bar</strong> (<code>.menu-bar</code>) — moves between sibling routes inside a domain.</li>' +
        '<li><strong>Tabs</strong> (<code>.cca-tabs</code>) — switch content within one record, without navigating.</li>' +
        '</ul>',
      `<div class="preview-panel"><div class="pp-body" style="display:block;padding:24px">${menuBar}</div><div class="pp-foot"><span>.menu-bar</span><span>shared/styles/_main.scss</span></div></div>`,
    ),
    section(
      'The detail lives here',
      links('../', [
        ['components/sidebar.html', 'Sidebar Menu — the icon rail and the shell grid'],
        ['components/tabs.html', 'Tabs — .cca-tabs, Material tabs and .menu-bar'],
        ['components/top-bar.html', 'Top Bar — the page header'],
      ]),
      callout(
        'info',
        'Why this page is an index',
        '<p>Each pattern is documented once, on its own page, generated from the source that styles it. Restating the metrics here would give two places to update and one of them would go stale.</p>',
      ),
    ),
  ].join('\n');

  return buildPage({
    path: 'design-system/navigation.html',
    group: 'Foundations',
    subtitle: 'Rail, main tab bar and in-page tabs',
    title: 'Navigation',
    intro: 'How the three navigation levels divide up, and where each one is documented.',
    crumbs: ['Foundations', 'Navigation'],
    sources: ['shared/styles/_main.scss', 'shared/styles/components/_tabs.scss'],
    styles: CHROME_STYLES,
    body,
  });
}

/** The badges-and-status overview: alerts and progress, plus links to badges. */
export function badgesStatusPage(): string {
  // The real template's classes, not hand-picked ones. Text is
  // `alert-text-neutral` — a token designed to sit on the light alert surfaces
  // in both themes. Using `text-neutral-body` instead made the copy invisible
  // in dark mode, because that token inverts while the alert surface does not.
  const alerts = (['default', 'primary', 'warning', 'danger', 'highlight'] as const)
    .map(
      (flavor) =>
        `<cca-info-banner style="display:block"><div class="${flavor} flex w-full items-center gap-2 rounded-lg px-4 py-3 alert-text-neutral">` +
        `<cca-icon class="text-2xl leading-6">${ccaIcon('info')}</cca-icon>` +
        `<p class="text-cca-base alert-text-neutral" style="margin:0">` +
        `The <code>${escapeHtml(flavor)}</code> flavour</p></div></cca-info-banner>`,
    )
    .join('');

  const spinner = `<cca-spinner style="display:inline-block;color:var(--text-brand-default)">${progressSpinner(32)}</cca-spinner>`;

  const body = [
    section(
      'Alerts',
      '<p class="lede"><code>cca-info-banner</code> carries in-page messages. Its flavour maps to the <code>alert-bg-*</code> tokens, so the surface follows dark mode without any per-banner work.</p>',
      `<div class="preview-panel"><div class="pp-body" style="display:block;padding:24px"><div class="flex flex-col gap-4">${alerts}</div></div><div class="pp-foot"><span>cca-info-banner</span><span>libs/ui/src/lib/info-banner/</span></div></div>`,
    ),
    section(
      'Progress',
      '<p class="lede">Indeterminate work uses <code>cca-spinner</code>. There is no platform progress bar — long operations show a spinner with surrounding copy that says what is happening.</p>',
      `<div class="preview-panel"><div class="pp-body">${spinner}</div><div class="pp-foot"><span>cca-spinner</span><span>libs/ui/src/lib/spinner/</span></div></div>`,
    ),
    section(
      'Status badges',
      links('../', [
        ['components/badge.html', 'Badge — all five components and their real flavours'],
      ]),
      callout(
        'bad',
        'Colour never carries meaning alone',
        '<p>Every status indicator pairs its colour with a label or an icon. A colour-only dot fails for anyone who cannot distinguish the hues, and reads as decoration to everyone else.</p>',
      ),
    ),
  ].join('\n');

  return buildPage({
    path: 'design-system/badges-status.html',
    group: 'Foundations',
    subtitle: 'Alerts, progress and where badges live',
    title: 'Badges & Status',
    intro: 'How the platform communicates state: banners, progress, and the badge family.',
    crumbs: ['Foundations', 'Badges & Status'],
    sources: ['libs/ui/src/lib/info-banner/', 'libs/ui/src/lib/spinner/'],
    devSelectors: ['cca-info-banner', 'cca-spinner'],
    styles: CHROME_STYLES,
    body,
  });
}

/** The buttons-and-inputs overview: a compact side-by-side plus links. */
export function buttonsInputsPage(): string {
  const alignment = `<div class="flex items-start gap-4">
  <div style="flex:1;max-width:280px">${searchField({ placeholder: 'Search shipments' })}</div>
  <button ccaButton class="${buttonClasses('primary')}">Create shipment</button>
</div>`;

  const chips = [chip({ label: 'Refrigerated', selected: true }), chip({ label: 'ADR' })].join('');

  const body = [
    section(
      'Controls line up at 48px',
      '<p class="lede">A <code>size="default"</code> button and a form field are both 48px tall, so they sit on the same baseline in a toolbar without any alignment work. This is the single most useful metric in the system.</p>',
      `<div class="preview-panel"><div class="pp-body" style="display:block;padding:24px">${alignment}</div><div class="pp-foot"><span>48px button and 48px field infix</span><span>button.component.scss and _form-field.scss</span></div></div>`,
      callout(
        'warn',
        'Use items-start, not items-center',
        '<p>A field reserves 24px below itself for hints and errors. Centring a row makes the button drift upward relative to the input, and the drift changes the moment a validation message appears.</p>',
      ),
    ),
    section(
      'Filters',
      `<div class="preview-panel"><div class="pp-body">${chips}</div><div class="pp-foot"><span>.cca-chip</span><span>shared/styles/components/_chip.scss</span></div></div>`,
    ),
    section(
      'The detail lives here',
      links('../', [
        ['components/button.html', 'Button — 11 hierarchies, 5 sizes, iconOnly'],
        ['components/input.html', 'Input — states, affixes and selection controls'],
        ['components/search-bar.html', 'Search Bar — the placeholder-only field'],
        ['components/chips.html', 'Chips — selectable filter chips'],
      ]),
    ),
  ].join('\n');

  return buildPage({
    path: 'design-system/buttons-inputs.html',
    group: 'Foundations',
    subtitle: 'How controls align · links to the detail pages',
    title: 'Buttons & Inputs',
    intro:
      'The alignment contract between buttons and fields, and where each control is documented.',
    crumbs: ['Foundations', 'Buttons & Inputs'],
    sources: [
      'libs/ui/src/lib/button/button.component.scss',
      'shared/styles/components/_form-field.scss',
    ],
    styles: CHROME_STYLES,
    body,
  });
}
