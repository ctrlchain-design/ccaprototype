/**
 * Live previews for the catalogue index.
 *
 * The index used to be a list of filenames, which is not something a designer
 * can pick from — you had to open a page to find out what was on it. Each entry
 * now renders a real sample, built from the same DOM helpers the documentation
 * pages use, so the front door shows the system rather than describing it.
 */

import { buttonClasses } from './components.js';
import {
  ccaIcon,
  checkbox,
  chip,
  formField,
  progressSpinner,
  searchField,
  slideToggle,
  table,
  tabHeader,
} from './material-dom.js';
import { type IconEntry } from './parse-component-css.js';
import { type SemanticToken, type TypeStyle, resolveColor } from './parse-tokens.js';
import { type PaletteGroup } from './parse-tokens.js';

/** One catalogue card: a live sample plus where to read more. */
export interface GalleryEntry {
  readonly path: string;
  readonly title: string;
  /** Rendered markup for the card's preview area. */
  readonly preview: string;
  /** One-line note under the title. */
  readonly note: string;
}

/** What the gallery needs from the build to render its samples. */
export interface GalleryInput {
  readonly palette: readonly PaletteGroup[];
  readonly tokens: readonly SemanticToken[];
  readonly typeScale: readonly TypeStyle[];
  readonly icons: readonly IconEntry[];
}

/** A row of swatches for a handful of named tokens. */
function swatchRow(input: GalleryInput, names: readonly string[]): string {
  const swatches = names
    .map((name) => {
      const token = input.tokens.find((candidate) => candidate.name === name);
      const value = token ? resolveColor(token.light, input.palette) : undefined;
      if (!value) {
        return '';
      }

      return `<span style="width:34px;height:34px;border-radius:8px;border:1px solid var(--border-neutral-default);background:${value}"></span>`;
    })
    .join('');

  return `<div style="display:flex;gap:8px;flex-wrap:wrap">${swatches}</div>`;
}

/** Builds every catalogue entry, in reading order. */
export function buildGallery(input: GalleryInput): GalleryEntry[] {
  const firstIcons = input.icons.slice(0, 6);
  const iconRow = firstIcons
    .map(
      (icon) =>
        `<span class="cca-icon cca-icon-${icon.name}" style="font-size:22px;color:var(--text-neutral-body)"></span>`,
    )
    .join('');

  const miniTable = table({
    columns: ['Reference', 'Status'],
    rows: [
      ['CCA-4281', 'In transit'],
      ['CCA-4282', 'Assigned'],
    ],
  });

  // Sits on the real CDK backdrop: the dialog surface is the same colour as the
  // card behind it, so without a scrim the panel has no visible edge.
  const miniDialog = `<div class="surface-neutral-default" style="position:relative;width:100%;padding:14px;display:flex;justify-content:center">
  <div class="cdk-overlay-backdrop cdk-overlay-dark-backdrop cdk-overlay-backdrop-showing"></div>
  <div class="mdc-dialog--open" style="width:100%;position:relative;z-index:1000">
  <div class="mat-mdc-dialog-surface mdc-dialog__surface" style="position:relative;width:100%">
    <div class="dialog-container" style="height:auto">
      <header><div class="title-wrapper"><h2 style="font-size:15px">Assign carrier</h2></div></header>
      <footer style="padding:12px">
        <button ccaButton class="${buttonClasses('subtle', 'small')}">Cancel</button>
        <button ccaButton class="${buttonClasses('primary', 'small')}">Assign</button>
      </footer>
    </div>
  </div>
  </div>
</div>`;

  const miniRail = `<cca-main style="display:block"><div class="appContent" style="display:block">
  <cca-side-menu style="display:block">
    <div class="menu-wrapper" style="height:auto;justify-content:flex-start">
      <div class="side-menu" style="padding:8px 8px 4px">
        <div class="menu-items">
          <cca-side-menu-item style="display:block;width:100%">
            <a class="a-menu-item active" href="#"><div class="menu-item">${ccaIcon('truck')}
              <span class="menu-item-title">Trips</span></div></a>
          </cca-side-menu-item>
          <cca-side-menu-item style="display:block;width:100%">
            <a class="a-menu-item" href="#"><div class="menu-item">${ccaIcon('box')}
              <span class="menu-item-title">Orders</span></div></a>
          </cca-side-menu-item>
        </div>
      </div>
    </div>
  </cca-side-menu>
</div></cca-main>`;

  const miniTopBar = `<div class="flex h-15 w-full items-center gap-2 border border-neutral-default surface-neutral-light px-3" style="border-radius:8px">
  <button ccaButton class="${buttonClasses('tertiary', 'small', true)}" aria-label="Back">${ccaIcon('arrow-left')}</button>
  <span class="text-cca-label-lg text-neutral-title">Trip CCA-4281</span>
  <span style="flex:1"></span>
  <button ccaButton class="${buttonClasses('icon', 'small', true)}" aria-label="Notifications">${ccaIcon('bell')}</button>
</div>`;

  const statusBadge = (flavor: string, label: string) =>
    `<cca-status-badge><div class="${flavor} flex w-fit items-center justify-center rounded-full px-2.5 py-1 text-cca-base-sm font-medium whitespace-nowrap">${label}</div></cca-status-badge>`;

  // `alert-text-neutral` is the token the real template uses. `text-neutral-body`
  // inverts in dark mode while the alert surface stays light, which left the
  // copy invisible.
  const banner = `<cca-info-banner style="display:block;width:100%"><div class="primary flex w-full items-center gap-2 rounded-lg px-4 py-3 alert-text-neutral">
  ${ccaIcon('info')}<p class="text-cca-base alert-text-neutral" style="margin:0">Shipment confirmed</p>
</div></cca-info-banner>`;

  const typeSamples = ['text-cca-label-lg', 'text-cca-base', 'text-cca-label-sm']
    .filter((utility) => input.typeScale.some((style) => style.utility === utility))
    .map(
      (utility) =>
        `<div class="${utility} text-neutral-body">${utility.replace('text-cca-', '')}</div>`,
    )
    .join('');

  const spacingBars = [4, 8, 16, 24]
    .map(
      (size) =>
        `<div style="display:flex;align-items:center;gap:8px">
          <div style="width:${size * 2}px;height:10px;border-radius:3px;background:var(--surface-brand-default)"></div>
          <span class="u-mono" style="font-size:10px;color:var(--text-neutral-caption)">${size}</span>
        </div>`,
    )
    .join('');

  return [
    {
      path: 'components/button.html',
      title: 'Button',
      note: '11 hierarchies · 5 sizes',
      preview: [
        `<button ccaButton class="${buttonClasses('primary', 'small')}">Create</button>`,
        `<button ccaButton class="${buttonClasses('secondary', 'small')}">Cancel</button>`,
        `<button ccaButton class="${buttonClasses('icon', 'small', true)}" aria-label="Edit">${ccaIcon('pencil')}</button>`,
      ].join(''),
    },
    {
      path: 'components/input.html',
      title: 'Input',
      note: 'Outlined · 48px infix',
      preview: `<div style="width:100%">${formField({ label: 'Reference', value: 'CCA-4281' })}</div>`,
    },
    {
      path: 'components/search-bar.html',
      title: 'Search Bar',
      note: 'Placeholder-only field',
      preview: `<div style="width:100%">${searchField({ placeholder: 'Search shipments' })}</div>`,
    },
    {
      path: 'components/card.html',
      title: 'Card',
      note: '.page-container and panels',
      preview: `<div class="page-container" style="width:100%">
        <div class="text-cca-label-lg text-neutral-title">Shipment</div>
        <div class="text-cca-base-sm text-neutral-subtitle">Rotterdam → Berlin</div>
      </div>`,
    },
    {
      path: 'components/modal.html',
      title: 'Modal',
      note: 'header / main / footer',
      preview: miniDialog,
    },
    { path: 'components/table.html', title: 'Table', note: '14px cells', preview: miniTable },
    {
      path: 'components/tabs.html',
      title: 'Tabs',
      note: '.cca-tabs · .menu-bar',
      preview: tabHeader([{ label: 'Overview', active: true }, { label: 'Stops' }], 'cca'),
    },
    {
      path: 'components/chips.html',
      title: 'Chips',
      note: '40px · selectable',
      preview: [chip({ label: 'ADR', selected: true }), chip({ label: 'Tail lift' })].join(''),
    },
    {
      path: 'components/badge.html',
      title: 'Badge',
      note: '5 components',
      preview: [
        statusBadge('primary', 'In transit'),
        statusBadge('warning', 'Delayed'),
        statusBadge('danger', 'Failed'),
      ].join(''),
    },
    {
      path: 'components/tooltip.html',
      title: 'Tooltip',
      note: 'tippy.js · 2 themes',
      preview: `<div class="tippy-box cca-tippy" data-placement="top" style="position:relative;max-width:200px">
        <div class="tippy-content" style="padding:5px 9px">Arrives 14:20</div>
        <div class="tippy-arrow" style="position:absolute;left:calc(50% - 8px)"></div>
      </div>`,
    },
    {
      path: 'components/sidebar.html',
      title: 'Sidebar Menu',
      note: '72px rail · 216px submenu',
      preview: `<div style="width:100%;display:flex;justify-content:center">${miniRail}</div>`,
    },
    {
      path: 'components/top-bar.html',
      title: 'Top Bar',
      note: '60px · sticky',
      preview: `<div style="width:100%">${miniTopBar}</div>`,
    },
    {
      path: 'design-system/colors.html',
      title: 'Colors',
      note: 'Raw ramps',
      preview: swatchRow(input, [
        '--surface-brand-default',
        '--info-surface',
        '--warning-surface',
        '--critical-surface',
        '--surface-neutral-darkest',
      ]),
    },
    {
      path: 'design-system/tokens.html',
      title: 'Tokens',
      note: `${input.tokens.length} semantic tokens`,
      preview: swatchRow(input, [
        '--surface-brand-lightest',
        '--surface-brand-light',
        '--surface-brand-default',
        '--surface-brand-dark',
        '--surface-brand-darker',
      ]),
    },
    {
      path: 'design-system/typography.html',
      title: 'Typography',
      note: 'Roboto only',
      preview: `<div style="width:100%">${typeSamples}</div>`,
    },
    {
      path: 'design-system/spacing.html',
      title: 'Spacing & Radius',
      note: '4px scale · 8/12px radii',
      preview: `<div style="display:flex;flex-direction:column;gap:6px">${spacingBars}</div>`,
    },
    {
      path: 'design-system/iconography.html',
      title: 'Iconography',
      note: `${input.icons.length} glyphs`,
      preview: `<div style="display:flex;gap:12px;flex-wrap:wrap">${iconRow}</div>`,
    },
    {
      path: 'design-system/buttons-inputs.html',
      title: 'Buttons & Inputs',
      note: 'Controls align at 48px',
      preview: [
        checkbox({ label: 'Checked', checked: true }),
        slideToggle({ label: 'On', checked: true }),
      ].join(''),
    },
    {
      path: 'design-system/badges-status.html',
      title: 'Badges & Status',
      note: 'Alerts and progress',
      preview: `<div style="width:100%;display:flex;flex-direction:column;gap:10px;align-items:center">${banner}<span style="color:var(--text-brand-default)">${progressSpinner(24)}</span></div>`,
    },
    {
      path: 'design-system/navigation.html',
      title: 'Navigation',
      note: 'Rail, tab bar, tabs',
      preview: `<div class="menu-bar" style="width:100%"><a class="active">Trips</a><a>Orders</a></div>`,
    },
  ];
}
