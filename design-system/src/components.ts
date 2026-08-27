/**
 * The CtrlChain components whose own stylesheets are exported to the design
 * system, and the selector each one's `:host` resolves to.
 *
 * Most `libs/ui` components (badges, card, chip, icon, text, …) carry no SCSS
 * at all — they are styled entirely with the Tailwind utilities that already
 * ship in the global layer, so they are deliberately absent here.
 *
 * `rootSelector` is what Angular actually puts on the host element: the `class`
 * from the component's `host` block when it has one, otherwise its element
 * selector.
 */

/** A component stylesheet to compile and de-Angularize. */
export interface ComponentStyleSource {
  /** Repo-relative path to the component's SCSS. */
  readonly scss: string;
  /** Plain CSS selector that `:host` resolves to. */
  readonly rootSelector: string;
  /** Section label used in the emitted CSS comment banner. */
  readonly label: string;
}

/**
 * Components exported in the first pilot phase. Extended as component pages
 * are converted, so the emitted CSS never carries rules nothing references.
 */
export const PILOT_COMPONENTS: readonly ComponentStyleSource[] = [
  {
    scss: 'libs/ui/src/lib/button/button.component.scss',
    // `host: { class: 'cca-btn' }` in button.component.ts
    rootSelector: '.cca-btn',
    label: 'ccaButton — button[ccaButton], a[ccaButton]',
  },
];

/**
 * Remaining components, wired up as their preview pages are converted.
 * Each has an element selector and no host class, so `:host` is the tag.
 */
export const SWEEP_COMPONENTS: readonly ComponentStyleSource[] = [
  {
    scss: 'libs/ui/src/lib/search-field/search-field.component.scss',
    rootSelector: 'cca-search-field',
    label: 'cca-search-field',
  },
  {
    scss: 'libs/ui/src/lib/info-banner/info-banner.component.scss',
    rootSelector: 'cca-info-banner',
    label: 'cca-info-banner',
  },
  {
    scss: 'libs/ui/src/lib/avatar/avatar.component.scss',
    rootSelector: 'cca-avatar',
    label: 'cca-avatar',
  },
  {
    scss: 'libs/ui/src/lib/accordion/accordion.component.scss',
    rootSelector: 'cca-accordion',
    label: 'cca-accordion',
  },
  {
    scss: 'libs/ui/src/lib/spinner/spinner.component.scss',
    rootSelector: 'cca-spinner',
    label: 'cca-spinner',
  },
  {
    scss: 'libs/ui/src/lib/tree-view/tree-view.component.scss',
    rootSelector: 'cca-tree-view',
    label: 'cca-tree-view',
  },
  {
    scss: 'libs/ui/src/lib/no-data/no-data.component.scss',
    rootSelector: 'cca-no-data',
    label: 'cca-no-data',
  },

  // The application shell. These live in apps/platform rather than libs/, and
  // without them the rail has no navy surface or logo header and the submenu
  // loses its active brand border entirely — `.submenu-container` and
  // `.sub-item` are component-scoped, not global.
  {
    scss: 'apps/platform/src/app/core/side-menu/side-menu.component.scss',
    rootSelector: 'cca-side-menu',
    label: 'cca-side-menu',
  },
  {
    scss: 'apps/platform/src/app/core/side-menu-item/side-menu-item.component.scss',
    rootSelector: 'cca-side-menu-item',
    label: 'cca-side-menu-item',
  },
  {
    scss: 'apps/platform/src/app/core/side-submenu/side-submenu.component.scss',
    rootSelector: 'cca-side-submenu',
    label: 'cca-side-submenu',
  },

  // The badge family carries its flavour palette in component SCSS — the
  // `.primary` / `.warning` / `.danger` classes the templates apply are defined
  // there, not globally, so the badges page needs these to render at all.
  {
    scss: 'libs/ui/src/lib/badges/status-badge/status-badge.component.scss',
    rootSelector: 'cca-status-badge',
    label: 'cca-status-badge',
  },
  {
    scss: 'libs/ui/src/lib/badges/label-badge/label-badge.component.scss',
    rootSelector: 'cca-label-badge',
    label: 'cca-label-badge',
  },
  {
    scss: 'libs/ui/src/lib/badges/text-badge/text-badge.component.scss',
    rootSelector: 'cca-text-badge',
    label: 'cca-text-badge',
  },
  {
    scss: 'libs/ui/src/lib/badges/numerical-badge/numerical-badge.component.scss',
    rootSelector: 'cca-numerical-badge',
    label: 'cca-numerical-badge',
  },
  {
    scss: 'libs/ui/src/lib/badges/attention-flag/attention-flag-badge.component.scss',
    rootSelector: 'cca-attention-flag-badge',
    label: 'cca-attention-flag-badge',
  },
];

/**
 * The badge flavours, taken from `StatusBadgeFlavor` in
 * libs/ui/src/lib/status-badge-flavor.ts. Not every badge supports every
 * flavour — each component's SCSS defines the subset it styles — so the badge
 * page renders what each one actually declares.
 */
export const STATUS_BADGE_FLAVORS = [
  'primary',
  'success',
  'warning',
  'danger',
  'highlight',
  'match',
  'neutral',
  'neutral-caption',
  'thirdparty',
  'accent-blue',
  'new-feature',
  'outline',
  'inverted',
] as const;

/**
 * The button's host-class contract, read straight from the `host` block in
 * button.component.ts. Drives both the emitted preview markup and the
 * verification spec, so neither can drift from the component.
 */
export const CCA_BUTTON = {
  rootClass: 'cca-btn',
  hierarchies: [
    'primary',
    'secondary',
    'subtle',
    'tertiary',
    'link',
    'danger-primary',
    'danger-secondary',
    'danger-text',
    'warning-primary',
    'warning-secondary',
    'icon',
  ],
  /**
   * `size="default"` intentionally adds no class — the base `:host` rule is the
   * 48px default, so only the other four sizes get a modifier.
   */
  sizes: ['x-small', 'small', 'default', 'large', 'x-large'],
  /** Expected computed height per size, from button.component.scss. */
  expectedHeights: {
    'x-small': 32,
    small: 36,
    default: 48,
    large: 56,
    'x-large': 64,
  },
} as const;

/**
 * Builds the class list Angular would put on a `ccaButton` host element for a
 * given hierarchy/size/iconOnly combination.
 */
export function buttonClasses(hierarchy: string, size = 'default', iconOnly = false): string {
  const classes = [CCA_BUTTON.rootClass, `cca-btn--${hierarchy}`];

  if (size !== 'default') {
    classes.push(`cca-btn--${size}`);
  }

  if (iconOnly) {
    classes.push('cca-btn--icon-only');
  }

  return classes.join(' ');
}
