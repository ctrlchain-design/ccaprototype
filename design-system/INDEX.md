# CtrlChain design system — lookup index

Generated from `design-system/dist/`. Do not hand-edit — regenerate with:

    python3 .claude/skills/prototype/scripts/build-index.py

This is an index, not a substitute for the bundle. Find the name here, then
open the page it points at and copy the real markup out of it.

20 documented pages · 314 components with CSS · 492 tokens · 492 utilities · 13 type styles · 252 icons

## Documented pages

Element tags matter as much as classes: several components are a custom
element wrapping a utility-classed div, and the CSS targets the tag. Copy the
wrapper, not just the inner div.

| Page | Element tags | Classes |
| --- | --- | --- |
| **Colors** — `design-system/dist/design-system/colors.html` | — | utilities only |
| **Tokens** — `design-system/dist/design-system/tokens.html` | — | utilities only |
| **Typography** — `design-system/dist/design-system/typography.html` | — | utilities only |
| **Spacing & Radius** — `design-system/dist/design-system/spacing.html` | — | utilities only |
| **Iconography** — `design-system/dist/design-system/iconography.html` | — | `cca-icon` |
| **Buttons & Inputs** — `design-system/dist/design-system/buttons-inputs.html` | `<cca-search-field>`, `<mat-chip-option>`, `<mat-form-field>` | `cca-btn`, `cca-btn--primary`, `cca-chip`, `cca-icon`, `mat-icon`, `mat-icon-inline`, `mat-mdc-chip`, `mat-mdc-chip-action`, `mat-mdc-chip-action-label`, `mat-mdc-chip-focus-overlay`, `mat-mdc-chip-graphic`, `mat-mdc-chip-option`, `mat-mdc-form-field`, `mat-mdc-form-field-bottom-align`, `mat-mdc-form-field-flex`, `mat-mdc-form-field-has-icon-prefix`, `mat-mdc-form-field-icon-prefix`, `mat-mdc-form-field-infix`, `mat-mdc-form-field-subscript-wrapper`, `mat-mdc-form-field-type-mat-input`, `mat-mdc-input-element`, `mat-mdc-notch-piece`, `mat-mdc-standard-chip`, `mat-mdc-text-field-wrapper`, `mat-primary` |
| **Badges & Status** — `design-system/dist/design-system/badges-status.html` | `<cca-info-banner>`, `<cca-spinner>`, `<mat-progress-spinner>` | `cca-icon`, `mat-icon`, `mat-icon-inline`, `mat-mdc-progress-spinner` |
| **Navigation** — `design-system/dist/design-system/navigation.html` | — | `menu-bar` |
| **Button** — `design-system/dist/components/button.html` | — | `cca-btn`, `cca-btn--danger-primary`, `cca-btn--danger-secondary`, `cca-btn--danger-text`, `cca-btn--icon`, `cca-btn--icon-only`, `cca-btn--large`, `cca-btn--link`, `cca-btn--primary`, `cca-btn--secondary`, `cca-btn--small`, `cca-btn--subtle`, `cca-btn--tertiary`, `cca-btn--warning-primary`, `cca-btn--warning-secondary`, `cca-btn--x-large`, `cca-btn--x-small`, `cca-icon`, `mat-icon`, `mat-icon-inline` |
| **Input** — `design-system/dist/components/input.html` | `<mat-checkbox>`, `<mat-error>`, `<mat-form-field>`, `<mat-hint>`, `<mat-radio-button>`, `<mat-slide-toggle>` | `cca-icon`, `mat-icon`, `mat-icon-inline`, `mat-mdc-checkbox`, `mat-mdc-checkbox-checked`, `mat-mdc-checkbox-disabled`, `mat-mdc-floating-label`, `mat-mdc-form-field`, `mat-mdc-form-field-bottom-align`, `mat-mdc-form-field-error`, `mat-mdc-form-field-error-wrapper`, `mat-mdc-form-field-flex`, `mat-mdc-form-field-has-icon-prefix`, `mat-mdc-form-field-has-icon-suffix`, `mat-mdc-form-field-hint`, `mat-mdc-form-field-hint-wrapper`, `mat-mdc-form-field-icon-prefix`, `mat-mdc-form-field-icon-suffix`, `mat-mdc-form-field-infix`, `mat-mdc-form-field-subscript-wrapper`, `mat-mdc-form-field-textarea-control`, `mat-mdc-form-field-type-mat-input`, `mat-mdc-input-element`, `mat-mdc-notch-piece`, `mat-mdc-radio-button`, `mat-mdc-radio-checked`, `mat-mdc-radio-disabled`, `mat-mdc-slide-toggle`, `mat-mdc-slide-toggle-checked`, `mat-mdc-text-field-wrapper`, `mat-primary` |
| **Search Bar** — `design-system/dist/components/search-bar.html` | `<cca-search-field>`, `<mat-form-field>`, `<mat-progress-spinner>` | `cca-btn`, `cca-btn--icon`, `cca-btn--small`, `cca-icon`, `mat-icon`, `mat-icon-inline`, `mat-mdc-form-field`, `mat-mdc-form-field-bottom-align`, `mat-mdc-form-field-flex`, `mat-mdc-form-field-has-icon-prefix`, `mat-mdc-form-field-icon-prefix`, `mat-mdc-form-field-icon-suffix`, `mat-mdc-form-field-infix`, `mat-mdc-form-field-subscript-wrapper`, `mat-mdc-form-field-type-mat-input`, `mat-mdc-input-element`, `mat-mdc-notch-piece`, `mat-mdc-progress-spinner`, `mat-mdc-text-field-wrapper`, `mat-primary` |
| **Card** — `design-system/dist/components/card.html` | — | `page-container` |
| **Modal** — `design-system/dist/components/modal.html` | `<mat-form-field>`, `<mat-hint>` | `cca-btn`, `cca-btn--primary`, `cca-btn--subtle`, `cca-icon`, `mat-icon`, `mat-icon-inline`, `mat-mdc-dialog-surface`, `mat-mdc-floating-label`, `mat-mdc-form-field`, `mat-mdc-form-field-bottom-align`, `mat-mdc-form-field-flex`, `mat-mdc-form-field-hint`, `mat-mdc-form-field-hint-wrapper`, `mat-mdc-form-field-infix`, `mat-mdc-form-field-subscript-wrapper`, `mat-mdc-form-field-type-mat-input`, `mat-mdc-input-element`, `mat-mdc-notch-piece`, `mat-mdc-text-field-wrapper`, `mat-primary` |
| **Table** — `design-system/dist/components/table.html` | — | `mat-mdc-cell`, `mat-mdc-header-cell`, `mat-mdc-header-row`, `mat-mdc-row`, `mat-mdc-table` |
| **Tabs** — `design-system/dist/components/tabs.html` | `<mat-tab-group>`, `<mat-tab-header>` | `cca-tabs`, `mat-mdc-focus-indicator`, `mat-mdc-tab`, `mat-mdc-tab-disabled`, `mat-mdc-tab-group`, `mat-mdc-tab-header`, `mat-mdc-tab-label-container`, `mat-mdc-tab-labels`, `mat-mdc-tab-list`, `mat-primary`, `menu-bar` |
| **Chips** — `design-system/dist/components/chips.html` | `<mat-chip-option>` | `cca-chip`, `mat-mdc-chip`, `mat-mdc-chip-action`, `mat-mdc-chip-action-label`, `mat-mdc-chip-focus-overlay`, `mat-mdc-chip-graphic`, `mat-mdc-chip-option`, `mat-mdc-standard-chip`, `mat-primary` |
| **Badge** — `design-system/dist/components/badge.html` | `<cca-attention-flag-badge>`, `<cca-label-badge>`, `<cca-numerical-badge>`, `<cca-status-badge>`, `<cca-text-badge>` | `emphasis-outline` |
| **Tooltip** — `design-system/dist/components/tooltip.html` | — | `cca-popover-tippy`, `cca-tippy` |
| **Sidebar Menu** — `design-system/dist/components/sidebar.html` | `<cca-main>`, `<cca-side-menu>`, `<cca-side-menu-item>`, `<cca-side-submenu>` | `a-menu-item`, `cca-btn`, `cca-btn--primary`, `cca-icon`, `mat-icon`, `mat-icon-inline`, `menu-item`, `menu-item-title`, `menu-items`, `menu-wrapper`, `side-menu` |
| **Top Bar** — `design-system/dist/components/top-bar.html` | — | `cca-btn`, `cca-btn--icon`, `cca-btn--icon-only`, `cca-btn--tertiary`, `cca-icon`, `mat-icon`, `mat-icon-inline` |

## Type styles

Family: Roboto. Weights: 300, 400, 500, 700.

- `text-2xs` — font-size 0.625rem
- `text-cca-base-sm` — font-size 0.875rem, line-height 1.25rem, font-weight 400
- `text-cca-base` — font-size 1rem, line-height 1.5rem, font-weight 400
- `text-cca-label-2xs` — font-size 0.5rem, line-height 0.625rem, font-weight 400
- `text-cca-label-xs` — font-size 0.625rem, line-height 0.625rem, font-weight 400
- `text-cca-label-sm` — font-size 0.75rem, line-height 1rem, font-weight 400
- `text-cca-label-md` — font-size 0.875rem, line-height 1.25rem, font-weight 500
- `text-cca-label-lg` — font-size 1rem, line-height 1.5rem, font-weight 500
- `text-cca-label-lg-weak` — font-size 1rem, line-height 1.5rem, font-weight 400
- `text-cca-tab` — font-size 1rem, line-height 1.5rem, font-weight 500, text-transform uppercase
- `text-cca-link` — font-size 1rem, line-height 1.5rem, font-weight 500, text-decoration-line underline
- `text-cca-n-badge` — font-size 0.75rem, line-height 1rem, font-weight 500
- `text-cca-counter` — font-size 2rem, line-height 2.25rem, font-weight 700

## Tokens

Every token is a CSS custom property (`var(--name)`) and most also ship a
utility class. Prefer the utility class; use `var()` for inline styles.
Light and dark values both listed — dark applies automatically via
`prefers-color-scheme` unless the page sets `<html class="light">`.

### Ungrouped

| Token | Utility | Light | Dark |
| --- | --- | --- | --- |
| `--grayscale-mode-neutral` | `.grayscale-mode-neutral` | `#3e3e3e` | `#3e3e3e` |

### Neutral Colors

| Token | Utility | Light | Dark |
| --- | --- | --- | --- |
| `--surface-neutral-disabled` | `.surface-neutral-disabled` | `#b3b3b3` | `#8b8b8b` |
| `--surface-neutral-darkest` | `.surface-neutral-darkest` | `#3e3e3e` | `#ebebeb` |
| `--surface-neutral-darker` | `.surface-neutral-darker` | `#d9d9d9` | `#717171` |
| `--surface-neutral-dark` | `.surface-neutral-dark` | `#ebebeb` | `#565656` |
| `--surface-neutral-default` | `.surface-neutral-default` | `#fafafa` | `#333333` |
| `--surface-neutral-light` | `.surface-neutral-light` | `#ffffff` | `#3e3e3e` |
| `--border-neutral-light` | `.border-neutral-light` | `#d9d9d9` | `#d9d9d9` |
| `--border-neutral-disabled` | `.border-neutral-disabled` | `#b3b3b3` | `#565656` |
| `--border-neutral-invert` | `.border-neutral-invert` | `#ffffff` | `#333333` |
| `--border-neutral-darker` | `.border-neutral-darker` | `#3e3e3e` | `#ebebeb` |
| `--border-neutral-dark` | `.border-neutral-dark`, `.sidebar-border-focus`, `.sidebar-second-border-focus` | `#8b8b8b` | `#b3b3b3` |
| `--border-neutral-default` | `.border-neutral-default` | `#d9d9d9` | `#717171` |
| `--text-neutral-invert` | `.text-neutral-invert` | `#ffffff` | `#343630` |
| `--text-neutral-title` | `.text-neutral-title` | `#3e3e3e` | `#fafafa` |
| `--text-neutral-subtitle` | `.text-neutral-subtitle` | `#717171` | `#d9d9d9` |
| `--text-neutral-body` | `.text-neutral-body` | `#3e3e3e` | `#ebebeb` |
| `--text-neutral-caption` | `.text-neutral-caption` | `#8b8b8b` | `#b3b3b3` |
| `--text-neutral-disabled` | `.text-neutral-disabled` | `#b3b3b3` | `#565656` |

### CCA Brand Colors

| Token | Utility | Light | Dark |
| --- | --- | --- | --- |
| `--surface-brand-default` | `.surface-brand-default` | `#6f8f2f` | `#b7d47f` |
| `--surface-brand-dark` | `.surface-brand-dark` | `#638029` | `#d5eba9` |
| `--surface-brand-darker` | `.surface-brand-darker` | `#4b6615` | `#e3f2c4` |
| `--surface-brand-light` | `.surface-brand-light` | `#d5eba9` | `#638029` |
| `--surface-brand-lighter` | `.surface-brand-lighter` | `#e3f2c4` | `#4b6615` |
| `--surface-brand-lightest` | `.surface-brand-lightest` | `#f6fbe9` | `#3d5213` |
| `--border-brand-default` | `.border-brand-default` | `#6f8f2f` | `#b7d47f` |
| `--border-brand-light` | `.border-brand-light` | `#a7c46c` | `#638029` |
| `--border-brand-lightest` | `.border-brand-lightest` | `#d5eba9` | `#638029` |
| `--border-brand-darker` | `.border-brand-darker` | `#4b6615` | `#4b6615` |

### Recheck with Angelica

| Token | Utility | Light | Dark |
| --- | --- | --- | --- |
| `--outline-brand-default` | `.outline-brand-default` | `#6f8f2f` | `#b7d47f` |
| `--outline-brand-lightest` | `.outline-brand-lightest` | `#d5eba9` | `#638029` |
| `--text-brand-default` | `.text-brand-default` | `#6f8f2f` | `#b7d47f` |
| `--text-brand-dark` | `.text-brand-dark` | `#638029` | `#d5eba9` |
| `--text-brand-darker` | `.text-brand-darker` | `#4b6615` | `#e3f2c4` |
| `--text-brand-light` | `.text-brand-light` | `#a7c46c` | `#4b6615` |
| `--text-brand-lighter` | `.text-brand-lighter` | `#d5eba9` | `#3d5213` |

### NC - Secondary Colors

| Token | Utility | Light | Dark |
| --- | --- | --- | --- |
| `--surface-NC-blue-default` | `.surface-NC-blue-default` | `#10152e` | `#10152e` |
| `--surface-NC-blue-default-light` | `.surface-NC-blue-default-light` | `#404458` | `#404458` |
| `--surface-NC-blue-dark` | `.surface-NC-blue-dark` | `#0c1024` | `#0c1024` |
| `--surface-NC-blue-darker` | `.surface-NC-blue-darker` | `#090c19` | `#090c19` |
| `--surface-NC-blue-light` | `.surface-NC-blue-light` | `#9fa1ab` | `#9fa1ab` |
| `--surface-NC-blue-lighter` | `.surface-NC-blue-lighter` | `#cfd0d5` | `#cfd0d5` |
| `--surface-NC-blue-lightest` | `.surface-NC-blue-lightest` | `#e7e8ea` | `#e7e8ea` |
| `--border-NC-blue-default` | `.border-NC-blue-default` | `#10152e` | `#cfd0d5` |
| `--border-NC-blue-light` | `.border-NC-blue-light` | `#707382` | `#9fa1ab` |
| `--border-NC-blue-lighter` | `.border-NC-blue-lighter` | `#9fa1ab` | `#707382` |
| `--text-NC-blue-default` | `.text-NC-blue-default` | `#10152e` | `#e7e8ea` |
| `--text-NC-blue-light` | `.text-NC-blue-light` | `#404458` | `#cfd0d5` |
| `--text-NC-blue-lighter` | `.text-NC-blue-lighter` | `#707382` | `#9fa1ab` |
| `--text-NC-blue-lightest` | `.text-NC-blue-lightest` | `#e7e8ea` | `#707382` |
| `--text-NC-blue-dark` | `.text-NC-blue-dark` | `#0c1024` | `#ffffff` |

### Semantic Colors - Info

| Token | Utility | Light | Dark |
| --- | --- | --- | --- |
| `--info-surface` | `.info-surface` | `#2a628f` | `#4b82af` |
| `--info-surface-light` | `.info-surface-light` | `#a5c3d9` | `#17476d` |
| `--info-surface-lighter` | `.info-surface-lighter` | `#cbdae7` | `#0d3759` |
| `--info-surface-lightest` | `.info-surface-lightest` | `#e7eff7` | `#0a2a44` |
| `--info-surface-dark` | `.info-surface-dark` | `#1d5a8b` | `#759dbd` |
| `--info-surface-darker` | `.info-surface-darker` | `#17476d` | `#a5c3d9` |
| `--info-border` | `.info-border` | `#4b82af` | `#2a628f` |
| `--info-border-light` | `.info-border-light` | `#759dbd` | `#a5c3d9` |
| `--info-border-lighter` | `.info-border-lighter` | `#cbdae7` | `#0d3759` |
| `--info-border-dark` | `.info-border-dark` | `#1d5a8b` | `#759dbd` |
| `--info-border-darker` | `.info-border-darker` | `#0d3759` | `#cbdae7` |
| `--info-text` | `.info-text` | `#2a628f` | `#759dbd` |
| `--info-text-light` | `.info-text-light` | `#4b82af` | `#4b82af` |
| `--info-text-lighter` | `.info-text-lighter` | `#1d5a8b` | `#a5c3d9` |
| `--info-text-dark` | `.info-text-dark` | `#17476d` | `#a5c3d9` |
| `--info-text-darker` | `.info-text-darker` | `#0d3759` | `#cbdae7` |

### Semantic Colors - Success

| Token | Utility | Light | Dark |
| --- | --- | --- | --- |
| `--success-surface` | `.success-surface` | `#6f8f2f` | `#b7d47f` |
| `--success-surface-light` | `.success-surface-light` | `#d5eba9` | `#638029` |
| `--success-surface-lighter` | `.success-surface-lighter` | `#e3f2c4` | `#4b6615` |
| `--success-surface-lightest` | `.success-surface-lightest` | `#f6fbe9` | `#3d5213` |
| `--success-surface-dark` | `.success-surface-dark` | `#638029` | `#b7d47f` |
| `--success-surface-darker` | `.success-surface-darker` | `#4b6615` | `#d5eba9` |
| `--success-border` | `.success-border` | `#6f8f2f` | `#b7d47f` |
| `--success-border-light` | `.success-border-light` | `#a7c46c` | `#8dab51` |
| `--success-border-lighter` | `.success-border-lighter` | `#d5eba9` | `#638029` |
| `--success-border-dark` | `.success-border-dark` | `#638029` | `#d5eba9` |
| `--success-border-darker` | `.success-border-darker` | `#3d5213` | `#f6fbe9` |
| `--success-text` | `.success-text` | `#4b6615` | `#b7d47f` |
| `--success-text-dark` | `.success-text-dark` | `#3d5213` | `#e3f2c4` |

### Semantic Colors - Warning

| Token | Utility | Light | Dark |
| --- | --- | --- | --- |
| `--warning-surface` | `.warning-surface` | `#e08300` | `#f7c988` |
| `--warning-surface-light` | `.warning-surface-light` | `#fadfba` | `#b25900` |
| `--warning-surface-lighter` | `.warning-surface-lighter` | `#fcf0de` | `#804000` |
| `--warning-surface-dark` | `.warning-surface-dark` | `#b25900` | `#fadfba` |
| `--warning-surface-darker` | `.warning-surface-darker` | `#804000` | `#fcf0de` |
| `--warning-border` | `.warning-border` | `#e08300` | `#f7c988` |
| `--warning-border-light` | `.warning-border-light` | `#fadfba` | `#b25900` |
| `--warning-border-lighter` | `.warning-border-lighter` | `#f5b153` | `#f5b153` |
| `--warning-border-dark` | `.warning-border-dark` | `#b25900` | `#fadfba` |
| `--warning-border-darker` | `.warning-border-darker` | `#804000` | `#fcf0de` |
| `--warning-text` | `.warning-text` | `#e08300` | `#f7c988` |
| `--warning-text-light` | `.warning-text-light` | `#f5b153` | `#eb8900` |
| `--warning-text-lighter` | `.warning-text-lighter` | `#fadfba` | `#b25900` |
| `--warning-text-dark` | `.warning-text-dark` | `#b25900` | `#fadfba` |
| `--warning-text-darker` | `.warning-text-darker` | `#804000` | `#fcf0de` |

### Semantic Colors - Neutral

| Token | Utility | Light | Dark |
| --- | --- | --- | --- |
| `--neutral-surface` | `.neutral-surface` | `#b3b3b3` | `#8b8b8b` |
| `--neutral-surface-light` | `.neutral-surface-light` | `#ebebeb` | `#565656` |
| `--neutral-surface-lighter` | `.neutral-surface-lighter` | `#ffffff` | `#333333` |
| `--neutral-surface-dark` | `.neutral-surface-dark` | `#8b8b8b` | `#b3b3b3` |
| `--neutral-surface-darker` | `.neutral-surface-darker` | `#717171` | `#d9d9d9` |
| `--neutral-border` | `.neutral-border` | `#d9d9d9` | `#717171` |
| `--neutral-border-light` | `.neutral-border-light` | `#ebebeb` | `#565656` |
| `--neutral-border-lighter` | `.neutral-border-lighter` | `#fafafa` | `#3e3e3e` |
| `--neutral-border-dark` | `.neutral-border-dark` | `#8b8b8b` | `#b3b3b3` |
| `--neutral-border-darker` | `.neutral-border-darker` | `#565656` | `#ebebeb` |
| `--neutral-text` | `.neutral-text` | `#3e3e3e` | `#fafafa` |
| `--neutral-text-invert` | `.neutral-text-invert` | `#ffffff` | `#333333` |
| `--neutral-text-dark` | `.neutral-text-dark` | `#333333` | `#ffffff` |

### Semantic Colors - Critical

| Token | Utility | Light | Dark |
| --- | --- | --- | --- |
| `--critical-surface` | `.critical-surface` | `#861414` | `#ef9292` |
| `--critical-surface-light` | `.critical-surface-light` | `#f3adad` | `#721111` |
| `--critical-surface-lighter` | `.critical-surface-lighter` | `#f9e1e1` | `#610f0f` |
| `--critical-surface-dark` | `.critical-surface-dark` | `#721111` | `#f3adad` |
| `--critical-surface-darker` | `.critical-surface-darker` | `#610f0f` | `#f9e1e1` |
| `--critical-border` | `.critical-border` | `#b91c1c` | `#e23e3e` |
| `--critical-border-lightest` | `.critical-border-lightest` | `#f3adad` | `#721111` |
| `--critical-border-lighter` | `.critical-border-lighter` | `#e96e6e` | `#e96e6e` |
| `--critical-border-dark` | `.critical-border-dark` | `#9d1818` | `#e96e6e` |
| `--critical-border-darker` | `.critical-border-darker` | `#861414` | `#ef9292` |
| `--critical-text` | `.critical-text` | `#721111` | `#f3adad` |
| `--critical-text-light` | `.critical-text-light` | `#b91c1c` | `#e23e3e` |
| `--critical-text-lightest` | `.critical-text-lightest` | `#f9e1e1` | `#610f0f` |
| `--critical-text-darker` | `.critical-text-darker` | `#861414` | `#f3adad` |
| `--critical-text-darkest` | `.critical-text-darkest` | `#610f0f` | `#f9e1e1` |

### Alert

| Token | Utility | Light | Dark |
| --- | --- | --- | --- |
| `--alert-text-neutral` | `.alert-text-neutral` | `#333333` | `#3e3e3e` |
| `--alert-bg-success` | `.alert-bg-success` | `#e3f2c4` | `#e3f2c4` |
| `--alert-bg-warning` | `.alert-bg-warning` | `#fcf0de` | `#fcf0de` |
| `--alert-bg-error` | `.alert-bg-error` | `#f9e1e1` | `#f9e1e1` |
| `--alert-bg-info` | `.alert-bg-info` | `#e7eff7` | `#e7eff7` |

### Snackbar

| Token | Utility | Light | Dark |
| --- | --- | --- | --- |
| `--snackbar-text-success` | `.snackbar-text-success` | `#4b6615` | `#e3f2c4` |
| `--snackbar-text-critical` | `.snackbar-text-critical` | `#721111` | `#f3adad` |
| `--snackbar-text-info` | `.snackbar-text-info` | `#1d5a8b` | `#cbdae7` |
| `--snackbar-bg-success` | `.snackbar-bg-success` | `#f6fbe9` | `#4b6615` |
| `--snackbar-bg-critical` | `.snackbar-bg-critical` | `#f9e1e1` | `#721111` |
| `--snackbar-bg-info` | `.snackbar-bg-info` | `#e7eff7` | `#0d3759` |
| `--snackbar-border-success` | `.snackbar-border-success` | `#6f8f2f` | `#b7d47f` |
| `--snackbar-border-critical` | `.snackbar-border-critical` | `#b91c1c` | `#b91c1c` |
| `--snackbar-border-info` | `.snackbar-border-info` | `#4b82af` | `#759dbd` |

### Selection

| Token | Utility | Light | Dark |
| --- | --- | --- | --- |
| `--selection-bg-selected-hover` | `.selection-bg-selected-hover` | `#638029` | `#b7d47f` |
| `--selection-tick-default` | `.selection-tick-default` | `#ffffff` | `#333333` |
| `--selection-tick-disabled` | `.selection-tick-disabled` | `#ffffff` | `#333333` |
| `--selection-bg-selected-default` | `.selection-bg-selected-default` | `#6f8f2f` | `#b7d47f` |
| `--selection-stroke-default` | `.selection-stroke-default` | `#b3b3b3` | `#8b8b8b` |
| `--selection-stroke-selected` | `.selection-stroke-selected` | `#6f8f2f` | `#b7d47f` |
| `--selection-stroke-hover` | `.selection-stroke-hover` | `#638029` | `#a7c46c` |
| `--selection-stroke-disabled` | `.selection-stroke-disabled` | `#d9d9d9` | `#565656` |
| `--selection-state-hover` | `.selection-state-hover` | `#f6fbe9` | `#3d5213` |
| `--selection-switchOn-handle-white` | `.selection-switchOn-handle-white` | `#ffffff` | `#ffffff` |
| `--selection-switchOn-handle-disabled` | `.selection-switchOn-handle-disabled` | `#ffffff` | `#8b8b8b` |
| `--selection-switchOn-disabled` | `.selection-switchOn-disabled` | `#d9d9d9` | `#565656` |
| `--selection-switchOn-default` | `.selection-switchOn-default` | `#6f8f2f` | `#a7c46c` |
| `--selection-switchOn-press` | `.selection-switchOn-press` | `#4b6615` | `#638029` |
| `--selection-switchOn-hover` | `.selection-switchOn-hover` | `#638029` | `#8dab51` |
| `--selection-switchOn-focus` | `.selection-switchOn-focus` | `#3e3e3e` | `#8b8b8b` |
| `--selection-switchOn-state` | `.selection-switchOn-state` | `#d5eba9` | `#ffffff` |
| `--selection-switchOff-stroke` | `.selection-switchOff-stroke` | `#717171` | `#8b8b8b` |
| `--selection-switchOff-bg` | `.selection-switchOff-bg` | `#fafafa` | `#333333` |
| `--selection-switchOff-hover` | `.selection-switchOff-hover` | `#ebebeb` | `#3e3e3e` |
| `--selection-switchOff-press` | `.selection-switchOff-press` | `#d9d9d9` | `#565656` |
| `--selection-switchOff-focus` | `.selection-switchOff-focus` | `#3e3e3e` | `#8b8b8b` |
| `--selection-switchOff-handle-bg` | `.selection-switchOff-handle-bg` | `#717171` | `#d9d9d9` |
| `--selection-switchOff-state` | `.selection-switchOff-state` | `#ebebeb` | `#565656` |
| `--selection-switchOff-disabled` | `.selection-switchOff-disabled` | `#d9d9d9` | `#565656` |

### Accent Colors

| Token | Utility | Light | Dark |
| --- | --- | --- | --- |
| `--accent-blue-lighter` | `.accent-blue-lighter` | `#e7eff7` | `#e7eff7` |
| `--accent-blue-light` | `.accent-blue-light` | `#cbdae7` | `#cbdae7` |
| `--accent-blue-default` | `.accent-blue-default` | `#2a628f` | `#2a628f` |
| `--accent-blue-dark` | `.accent-blue-dark` | `#0d3759` | `#0d3759` |
| `--accent-blue-darker` | `.accent-blue-darker` | `#0a2a44` | `#0a2a44` |
| `--accent-blue-surface-dark` | `.accent-blue-surface-dark` | `#2a628f` | `#4b82af` |
| `--accent-blue-surface-light` | `.accent-blue-surface-light` | `#cbdae7` | `#0d3759` |
| `--accent-blue-surface-lighter` | `.accent-blue-surface-lighter` | `#e7eff7` | `#0a2a44` |
| `--accent-blue-text` | `.accent-blue-text` | `#0d3759` | `#cbdae7` |
| `--accent-blue-text-lighter` | `.accent-blue-text-lighter` | `#e7eff7` | `#0a2a44` |
| `--accent-red` | `.accent-red` | `#9d1818` | `#f3adad` |
| `--accent-red-light` | `.accent-red-light` | `#f9e1e1` | `#610f0f` |
| `--accent-orange` | `.accent-orange` | `#e08300` | `#f5b153` |
| `--accent-orange-light` | `.accent-orange-light` | `#fcf0de` | `#804000` |
| `--accent-orange-dark` | `.accent-orange-dark` | `#b25900` | `#fadfba` |
| `--accent-midnight` | `.accent-midnight` | `#0a2a44` | `#17476d` |
| `--accent-midnight-light` | `.accent-midnight-light` | `#e7eff7` | `#cbdae7` |
| `--accent-green` | `.accent-green` | `#8dab51` | `#a7c46c` |
| `--accent-green-light` | `.accent-green-light` | `#f6fbe9` | `#3d5213` |
| `--accent-green-dark` | `.accent-green-dark` | `#4b6615` | `#e3f2c4` |
| `--accent-blueGreen` | `.accent-blueGreen` | `#3bc497` | `#7fdbbd` |
| `--accent-blueGreen-light` | `.accent-blueGreen-light` | `#e3f8f1` | `#c4f2e3` |
| `--accent-blueGreen-dark` | `.accent-blueGreen-dark` | `#0b7d57` | `#c4f2e3` |
| `--accent-purple` | `.accent-purple` | `#53389e` | `#9984d3` |
| `--accent-purple-light` | `.accent-purple-light` | `#efecf8` | `#332261` |
| `--accent-purple-dark` | `.accent-purple-dark` | `#3c2872` | `#c6bae7` |

### Checkbox and Radio Colors

| Token | Utility | Light | Dark |
| --- | --- | --- | --- |
| `--selection-tick` | `.selection-tick` | `#ffffff` | `#ffffff` |
| `--selection-enabled` | `.selection-enabled` | `#6f8f2f` | `#6f8f2f` |
| `--selection-disabled` | `.selection-disabled` | `#d9d9d9` | `#d9d9d9` |
| `--selection-hover` | `.selection-hover` | `#638029` | `#638029` |
| `--selection-default` | `.selection-default` | `#b3b3b3` | `#b3b3b3` |
| `--selection-state` | `.selection-state` | `#f6fbe9` | `#f6fbe9` |

### Form

| Token | Utility | Light | Dark |
| --- | --- | --- | --- |
| `--form-value` | `.form-value` | `#3e3e3e` | `#ebebeb` |
| `--form-cursor` | `.form-cursor` | `#4b82af` | `#a5c3d9` |
| `--placeholder` | `.placeholder` | `#d9d9d9` | `#717171` |
| `--form-disabled` | `.form-disabled` | `#d9d9d9` | `#565656` |
| `--form-icon` | `.form-icon` | `#3e3e3e` | `#717171` |
| `--form-required` | `.form-required` | `#e96e6e` | `#ef9292` |
| `--form-critical` | `.form-critical` | `#9d1818` | `#e96e6e` |
| `--form-success` | `.form-success` | `#638029` | `#a7c46c` |
| `--form-bg` | `.form-bg` | `#ffffff` | `#3e3e3e` |
| `--form-bg-hover` | `.form-bg-hover` | `#fafafa` | `#565656` |
| `--form-bg-focus` | `.form-bg-focus` | `#ffffff` | `#333333` |
| `--form-border` | `.form-border` | `#b3b3b3` | `#8b8b8b` |
| `--form-border-disabled` | `.form-border-disabled` | `#d9d9d9` | `#717171` |
| `--form-border-focus` | `.form-border-focus` | `#8dab51` | `#d5eba9` |
| `--form-border-hover` | `.form-border-hover` | `#3e3e3e` | `#d9d9d9` |
| `--form-label-disabled` | `.form-label-disabled` | `#b3b3b3` | `#717171` |
| `--form-label-float` | `.form-label-float` | `#717171` | `#d9d9d9` |
| `--form-label-focus` | `.form-label-focus` | `#638029` | `#d5eba9` |
| `--form-label` | `.form-label` | `#565656` | `#b3b3b3` |

### Sidebar

| Token | Utility | Light | Dark |
| --- | --- | --- | --- |
| `--sidebar-main-bg-default` | `.sidebar-main-bg-default` | `#10152e` | `#10152e` |
| `--sidebar-main-icon-default` | `.sidebar-main-icon-default` | `#9fa1ab` | `#9fa1ab` |
| `--sidebar-main-text-default` | `.sidebar-main-text-default` | `#cfd0d5` | `#cfd0d5` |
| `--sidebar-main-bg-selected` | `.sidebar-main-bg-selected` | `#4b6615` | `#4b6615` |
| `--sidebar-main-icon-selected` | `.sidebar-main-icon-selected` | `#e3f2c4` | `#e3f2c4` |
| `--sidebar-main-text-selected` | `.sidebar-main-text-selected` | `#f6fbe9` | `#f6fbe9` |
| `--sidebar-main-bg-hover` | `.sidebar-main-bg-hover` | `#404458` | `#404458` |
| `--sidebar-main-icon-hover` | `.sidebar-main-icon-hover` | `#cfd0d5` | `#cfd0d5` |
| `--sidebar-main-text-hover` | `.sidebar-main-text-hover` | `#e7e8ea` | `#e7e8ea` |
| `--sidebar-second-bg` | `.sidebar-second-bg` | `#ffffff` | `#3e3e3e` |
| `--sidebar-second-icon-default` | `.sidebar-second-icon-default` | `#8b8b8b` | `#b3b3b3` |
| `--sidebar-second-text-default` | `.sidebar-second-text-default` | `#565656` | `#d9d9d9` |
| `--sidebar-second-bg-selected` | `.sidebar-second-bg-selected` | `#f6fbe9` | `#3d5213` |
| `--sidebar-second-icon-selected` | `.sidebar-second-icon-selected` | `#6f8f2f` | `#a7c46c` |
| `--sidebar-second-border-selected` | `.sidebar-second-border-selected` | `#6f8f2f` | `#b7d47f` |
| `--sidebar-second-border-focus` | — | `#4b82af` | `#cbdae7` |
| `--sidebar-second-text-selected` | `.sidebar-second-text-selected` | `#638029` | `#b7d47f` |
| `--sidebar-second-bg-hover` | `.sidebar-second-bg-hover` | `#e3f2c4` | `#638029` |
| `--sidebar-second-icon-hover` | `.sidebar-second-icon-hover` | `#8b8b8b` | `#b3b3b3` |
| `--sidebar-second-text-hover` | `.sidebar-second-text-hover` | `#565656` | `#d9d9d9` |
| `--sidebar-scroll-bg-default` | `.sidebar-scroll-bg-default` | `#10152e` | `#10152e` |
| `--sidebar-scroll-icon-default` | `.sidebar-scroll-icon-default` | `#9fa1ab` | `#9fa1ab` |
| `--sidebar-scroll-bg-selected` | `.sidebar-scroll-bg-selected` | `#404458` | `#404458` |
| `--sidebar-scroll-icon-selected` | `.sidebar-scroll-icon-selected` | `#cfd0d5` | `#cfd0d5` |
| `--sidebar-popover-bg` | `.sidebar-popover-bg` | `#fafafa` | `#333333` |
| `--sidebar-popover-text` | `.sidebar-popover-text` | `#717171` | `#d9d9d9` |

### Disabled Button Style

| Token | Utility | Light | Dark |
| --- | --- | --- | --- |
| `--button-disabled` | `.button-disabled` | `#b3b3b3` | `#717171` |

### Button Text Label Colors

| Token | Utility | Light | Dark |
| --- | --- | --- | --- |
| `--button-text-label` | `.button-text-label` | `#6f8f2f` | `#b7d47f` |
| `--button-text-label-hover` | `.button-text-label-hover` | `#638029` | `#d5eba9` |
| `--button-text-label-focused` | `.button-text-label-focused` | `#6f8f2f` | `#b7d47f` |
| `--button-text-label-pressed` | `.button-text-label-pressed` | `#4b6615` | `#e3f2c4` |
| `--button-text-label-warning` | `.button-text-label-warning` | `#b25900` | `#f7c988` |
| `--button-text-label-critical` | `.button-text-label-critical` | `#9d1818` | `#f3adad` |
| `--button-text-label-success` | `.button-text-label-success` | `#3d5213` | `#3d5213` |
| `--button-text-label-info` | `.button-text-label-info` | `#2a628f` | `#2a628f` |

### Button Text Surface

| Token | Utility | Light | Dark |
| --- | --- | --- | --- |
| `--button-text-bg-hover` | `.button-text-bg-hover` | `#f6fbe9` | `#3d5213` |
| `--button-text-bg-pressed` | `.button-text-bg-pressed` | `#f6fbe9` | `#343630` |
| `--button-text-bg-focused` | — | `#e3f2c4` | `—` |

### Button Link

| Token | Utility | Light | Dark |
| --- | --- | --- | --- |
| `--button-link-default` | `.button-link-default` | `#6f8f2f` | `#b7d47f` |
| `--button-link-hovered` | `.button-link-hovered` | `#638029` | `#d5eba9` |
| `--button-link-focused` | `.button-link-focused` | `#a7c46c` | `#d5eba9` |
| `--button-link-pressed` | `.button-link-pressed` | `#4b6615` | `#e3f2c4` |

### Button Border

| Token | Utility | Light | Dark |
| --- | --- | --- | --- |
| `--button-subtle-border-default` | `.button-subtle-border-default` | `#d9d9d9` | `#565656` |
| `--button-subtle-border-hovered` | `.button-subtle-border-hovered` | `#8b8b8b` | `#8b8b8b` |
| `--button-subtle-border-focused` | `.button-subtle-border-focused` | `#565656` | `#b3b3b3` |
| `--button-subtle-border-pressed` | `.button-subtle-border-pressed` | `#d9d9d9` | `#565656` |

### Button Label

| Token | Utility | Light | Dark |
| --- | --- | --- | --- |
| `--button-subtle-label-default` | `.button-subtle-label-default` | `#3e3e3e` | `#b3b3b3` |
| `--button-subtle-label-hovered` | `.button-subtle-label-hovered` | `#717171` | `#d9d9d9` |
| `--button-subtle-label-focused` | `.button-subtle-label-focused` | `#3e3e3e` | `#b3b3b3` |
| `--button-subtle-label-pressed` | `.button-subtle-label-pressed` | `#717171` | `#b3b3b3` |
| `--button-primary-label` | `.button-primary-label` | `#ffffff` | `#333333` |
| `--button-primary-label-critical` | `.button-primary-label-critical` | `#f9e1e1` | `#610f0f` |

### Button Surface Subtle

| Token | Utility | Light | Dark |
| --- | --- | --- | --- |
| `--button-subtle-bg-pressed` | `.button-subtle-bg-pressed` | `#ebebeb` | `#282925` |
| `--button-subtle-focused` | `.button-subtle-bg-focused` | `#ebebeb` | `#565656` |

### Button Secondary Surface

| Token | Utility | Light | Dark |
| --- | --- | --- | --- |
| `--button-secondary-bg-hovered` | `.button-secondary-bg-hovered` | `#f6fbe9` | `#3d5213` |
| `--button-secondary-bg-focused` | `.button-secondary-bg-focused` | `#e3f2c4` | `#3d5213` |
| `--button-secondary-bg-pressed` | `.button-secondary-bg-pressed` | `#f6fbe9` | `#343630` |
| `--button-secondary-bg-warning-hovered` | `.button-secondary-bg-warning-hovered` | `#fcf0de` | `#b25900` |
| `--button-secondary-bg-warning-pressed` | `.button-secondary-bg-warning-pressed` | `#fadfba` | `#804000` |
| `--button-secondary-bg-critical-hovered` | `.button-secondary-bg-critical-hovered` | `#f9e1e1` | `#861414` |
| `--button-secondary-bg-critical-pressed` | `.button-secondary-bg-critical-pressed` | `#f3adad` | `#721111` |

### Button Secondary Label

| Token | Utility | Light | Dark |
| --- | --- | --- | --- |
| `--button-secondary-label` | `.button-secondary-label` | `#6f8f2f` | `#b7d47f` |

### Button Secondary Border

| Token | Utility | Light | Dark |
| --- | --- | --- | --- |
| `--button-secondary-border-default` | `.button-secondary-border-default` | `#6f8f2f` | `#b7d47f` |
| `--button-secondary-border-hovered` | `.button-secondary-border-hovered` | `#6f8f2f` | `#b7d47f` |
| `--button-secondary-border-focused` | `.button-secondary-border-focused` | `#a7c46c` | `#d5eba9` |
| `--button-secondary-border-pressed` | `.button-secondary-border-pressed` | `#6f8f2f` | `#b7d47f` |
| `--button-secondary-border-critical-focused` | `.button-secondary-border-critical-focused` | `#f3adad` | `#e96e6e` |
| `--button-secondary-border-critical` | `.button-secondary-border-critical` | `#861414` | `#f3adad` |
| `--button-secondary-border-warning` | `.button-secondary-border-warning` | `#e08300` | `#f5b153` |
| `--button-secondary-border-warning-focused` | `.button-secondary-border-warning-focused` | `#f7c988` | `#fadfba` |

### Button Border Primary

| Token | Utility | Light | Dark |
| --- | --- | --- | --- |
| `--button-primary-border-focused` | `.button-primary-border-focused` | `#a7c46c` | `#d5eba9` |

### Button Surface Primary

| Token | Utility | Light | Dark |
| --- | --- | --- | --- |
| `--button-primary-bg-default` | `.button-primary-bg-default` | `#6f8f2f` | `#b7d47f` |
| `--button-primary-bg-hovered` | `.button-primary-bg-hovered` | `#638029` | `#a7c46c` |
| `--button-primary-bg-focused` | `.button-primary-bg-focused` | `#638029` | `#a7c46c` |
| `--button-primary-bg-pressed` | `.button-primary-bg-pressed` | `#4b6615` | `#d5eba9` |
| `--button-primary-bg-warning` | `.button-primary-bg-warning` | `#e08300` | `#f5b153` |
| `--button-primary-bg-warning-hovered` | `.button-primary-bg-warning-hovered` | `#b25900` | `#f7c988` |
| `--button-primary-bg-warning-pressed` | `.button-primary-bg-warning-pressed` | `#804000` | `#fadfba` |
| `--button-primary-bg-critical` | `.button-primary-bg-critical` | `#9d1818` | `#f3adad` |
| `--button-primary-bg-critical-hovered` | `.button-primary-bg-critical-hovered` | `#861414` | `#ef9292` |
| `--button-primary-bg-critical-pressed` | `.button-primary-bg-critical-pressed` | `#721111` | `#ef9292` |

### Button Segmented

| Token | Utility | Light | Dark |
| --- | --- | --- | --- |
| `--segmented-label` | `.segmented-label` | `#3e3e3e` | `#ebebeb` |
| `--segmented-bg-hovered` | `.segmented-bg-hovered` | `#d5eba9` | `#638029` |
| `--segmented-bg-focused` | `.segmented-bg-focused` | `#e3f2c4` | `#4b6615` |
| `--segmented-bg-selected` | `.segmented-bg-selected` | `#f6fbe9` | `#3d5213` |
| `--segmented-disabled` | `.segmented-disabled` | `#b3b3b3` | `#8b8b8b` |
| `--segmented-border` | `.segmented-border` | `#d9d9d9` | `#717171` |
| `--segmented-border-hover` | `.segmented-border-hover` | `#8b8b8b` | `#8b8b8b` |
| `--segmented-border-focus` | `.segmented-border-focus` | `#8dab51` | `#8dab51` |
| `--segmented-border-selected` | `.segmented-border-selected` | `#8b8b8b` | `#8b8b8b` |

### Badge

| Token | Utility | Light | Dark |
| --- | --- | --- | --- |
| `--badge-stroke-white` | `.badge-stroke-white` | `#ffffff` | `#ffffff` |
| `--badge-text-white` | `.badge-text-white` | `#ffffff` | `#333333` |
| `--badge-text-black` | `.badge-text-black` | `#10152e` | `#e7e8ea` |
| `--badge-text-green` | `.badge-text-green` | `#4b6615` | `#f6fbe9` |
| `--badge-text-green-darker` | `.badge-text-green-darker` | `#4b6615` | `#e3f2c4` |
| `--badge-text-orange` | `.badge-text-orange` | `#804000` | `#fcf0de` |
| `--badge-text-orange-darkest` | `.badge-text-orange-darkest` | `#804000` | `#fcf0de` |
| `--badge-text-red` | `.badge-text-red` | `#861414` | `#f3adad` |
| `--badge-text-red-darker` | `.badge-text-red-darker` | `#861414` | `#f3adad` |
| `--badge-text-blue` | `.badge-text-blue` | `#0d3759` | `#cbdae7` |
| `--badge-text-NCBlue` | `.badge-text-NCBlue` | `#10152e` | `#e7e8ea` |
| `--badge-text-purple` | `.badge-text-purple` | `#473086` | `#c6bae7` |
| `--badge-text-purple-light` | `.badge-text-purple-light` | `#efecf8` | `#473086` |
| `--badge-text-grey` | `.badge-text-grey` | `#b3b3b3` | `#b3b3b3` |
| `--badge-text-grey-dark` | `.badge-text-grey-dark` | `#565656` | `#d9d9d9` |
| `--badge-bg-white` | `.badge-bg-white` | `#ffffff` | `#333333` |
| `--badge-bg-grey` | `.badge-bg-grey` | `#b3b3b3` | `#b3b3b3` |
| `--badge-bg-grey-light` | `.badge-bg-grey-light` | `#cfd0d5` | `#404458` |
| `--badge-bg-neutral-light` | `.badge-bg-neutral-light` | `#cfd0d5` | `#565656` |
| `--badge-bg-green` | `.badge-bg-green` | `#6f8f2f` | `#d5eba9` |
| `--badge-bg-green-light` | `.badge-bg-green-light` | `#e3f2c4` | `#3d5213` |
| `--badge-bg-green-dark` | `.badge-bg-green-dark` | `#6f8f2f` | `#4b6615` |
| `--badge-bg-orange` | `.badge-bg-orange` | `#eb8900` | `#f7c988` |
| `--badge-bg-orange-light` | `.badge-bg-orange-light` | `#fcf0de` | `#804000` |
| `--badge-bg-orange-dark` | `.badge-bg-orange-dark` | `#eb8900` | `#f5b153` |
| `--badge-bg-red` | `.badge-bg-red` | `#b91c1c` | `#f3adad` |
| `--badge-bg-red-light` | `.badge-bg-red-light` | `#f9e1e1` | `#610f0f` |
| `--badge-bg-red-dark` | `.badge-bg-red-dark` | `#b91c1c` | `#861414` |
| `--badge-bg-blue` | `.badge-bg-blue` | `#2a628f` | `#cbdae7` |
| `--badge-bg-NCblue` | `.badge-bg-NCblue` | `#cbdae7` | `#a5c3d9` |
| `--badge-bg-blue-light` | `.badge-bg-blue-light` | `#e7eff7` | `#0a2a44` |
| `--badge-bg-NCblue-light` | `.badge-bg-NCblue-light` | `#e7e8ea` | `#090c19` |
| `--badge-bg-purple` | `.badge-bg-purple` | `#53389e` | `#efecf8` |
| `--badge-bg-purple-light` | `.badge-bg-purple-light` | `#efecf8` | `#3c2872` |

### Chips

| Token | Utility | Light | Dark |
| --- | --- | --- | --- |
| `--chips-focus` | `.chips-focus` | `#565656` | `#717171` |
| `--chips-outline-neutral` | `.chips-outline-neutral` | `#d9d9d9` | `#717171` |
| `--chips-outline-brand` | `.chips-outline-brand` | `#6f8f2f` | `#b7d47f` |
| `--chips-text-neutral` | `.chips-text-neutral` | `#3e3e3e` | `#fafafa` |
| `--chips-text-brand-dark` | `.chips-text-brand-dark` | `#4b6615` | `#d5eba9` |
| `--chips-text-disabled` | `.chips-text-disabled` | `#b3b3b3` | `#8b8b8b` |
| `--chips-input-bg-default` | `.chips-input-bg-default` | `#ebebeb` | `#565656` |
| `--chips-bg-hover` | `.chips-bg-hover` | `#f6fbe9` | `#3d5213` |
| `--chips-bg-disabled` | `.chips-bg-disabled` | `#ebebeb` | `#565656` |
| `--chips-bg-press` | `.chips-bg-press` | `#e3f2c4` | `#4b6615` |
| `--chips-bg-selected` | `.chips-bg-selected` | `#f6fbe9` | `#3d5213` |

### Main Tab

| Token | Utility | Light | Dark |
| --- | --- | --- | --- |
| `--maintab-bg-default` | `.maintab-bg-default` | `#ffffff` | `#3e3e3e` |
| `--maintab-bg-selected` | `.maintab-bg-selected` | `#e3f2c4` | `#4b6615` |
| `--maintab-bg-hovered` | `.maintab-bg-hovered` | `#f6fbe9` | `#3d5213` |
| `--maintab-bg-pressed` | `.maintab-bg-pressed` | `#d5eba9` | `#638029` |
| `--maintab-bg-disabled` | `.maintab-bg-disabled` | `#d9d9d9` | `#565656` |
| `--maintab-text-selected` | `.maintab-text-selected` | `#10152e` | `#cfd0d5` |
| `--maintab-text-default` | `.maintab-text-default` | `#707382` | `#e7e8ea` |
| `--maintab-text-disabled` | `.maintab-text-disabled` | `#ffffff` | `#8b8b8b` |
| `--maintab-border-selected` | `.maintab-border-selected` | `#8dab51` | `#a7c46c` |
| `--maintab-border-default` | `.maintab-border-default` | `#d9d9d9` | `#717171` |

### Map

| Token | Utility | Light | Dark |
| --- | --- | --- | --- |
| `--pin-text-active` | `.pin-text-active` | `#333333` | `#333333` |
| `--pin-text-finished` | `.pin-text-finished` | `#ffffff` | `#ffffff` |
| `--pin-text-warning` | `.pin-text-warning` | `#e08300` | `#e08300` |
| `--pin-vector-outline-active` | `.pin-vector-outline-active` | `#6f8f2f` | `#a7c46c` |
| `--map-route` | `.map-route` | `#6f8f2f` | `#d5eba9` |
| `--pin-vector-outline-finished` | `.pin-vector-outline-finished` | `#6f8f2f` | `#a7c46c` |
| `--pin-vector-bg-active` | `.pin-vector-bg-active` | `#f6fbe9` | `#e3f2c4` |
| `--pin-active-hover` | `.pin-active-hover` | `#e3f2c4` | `#d5eba9` |
| `--pin-vector-bg-finished` | `.pin-vector-bg-finished` | `#3d5213` | `#3d5213` |
| `--pin-finished-hover` | `.pin-finished-hover` | `#4b6615` | `#4b6615` |
| `--pin-vector-bg-inactive` | `.pin-vector-bg-inactive` | `#e7eff7` | `#cbdae7` |
| `--pin-inactive-hover` | `.pin-inactive-hover` | `#cbdae7` | `#a5c3d9` |
| `--pin-vector-outline-inactive` | `.pin-vector-outline-inactive` | `#1d5a8b` | `#4b82af` |

### Stop pins

| Token | Utility | Light | Dark |
| --- | --- | --- | --- |
| `--pin-stop-content-default` | `.pin-stop-content-default` | `#020205` | `#e7e8ea` |
| `--pin-stop-bg-default` | `.pin-stop-bg-default` | `#cfd0d5` | `#404458` |
| `--pin-stop-content-selected` | `.pin-stop-content-selected` | `#e7e8ea` | `#020205` |
| `--pin-stop-bg-selected` | `.pin-stop-bg-selected` | `#020205` | `#e7e8ea` |
| `--pin-stop-content-completed` | `.pin-stop-content-completed` | `#020205` | `#e7e8ea` |
| `--pin-stop-bg-completed` | `.pin-stop-bg-completed` | `#cfd0d5` | `#404458` |
| `--pin-stop-outline` | `.pin-stop-outline` | `#ffffff` | `#333333` |
| `--pin-stop-pinline` | `.pin-stop-pinline` | `#020205` | `#e7e8ea` |

### Location pins

| Token | Utility | Light | Dark |
| --- | --- | --- | --- |
| `--pin-location-content-default` | `.pin-location-content-default` | `#638029` | `#d5eba9` |
| `--pin-location-bg-default` | `.pin-location-bg-default` | `#f6fbe9` | `#3d5213` |
| `--pin-location-content-selected` | `.pin-location-content-selected` | `#f6fbe9` | `#3d5213` |
| `--pin-location-bg-selected` | `.pin-location-bg-selected` | `#3d5213` | `#f6fbe9` |
| `--pin-location-content-completed` | `.pin-location-content-completed` | `#f6fbe9` | `#3d5213` |
| `--pin-location-bg-completed` | `.pin-location-bg-completed` | `#638029` | `#f6fbe9` |
| `--pin-location-outline` | `.pin-location-outline` | `#6f8f2f` | `#b7d47f` |

### Parking pins

| Token | Utility | Light | Dark |
| --- | --- | --- | --- |
| `--pin-parking-content-default` | `.pin-parking-content-default` | `#ffffff` | `#ffffff` |
| `--pin-parking-bg-default` | `.pin-parking-bg-default` | `#2a628f` | `#0d3759` |
| `--pin-parking-content-selected` | `.pin-parking-content-selected` | `#ffffff` | `#020205` |
| `--pin-parking-bg-selected` | `.pin-parking-bg-selected` | `#0a2a44` | `#cbdae7` |
| `--pin-parking-outline` | `.pin-parking-outline` | `#ffffff` | `#020205` |
| `--pin-parking-bg-chosen` | `.pin-parking-bg-chosen` | `#cbdae7` | `#4b82af` |
| `--pin-parking-content-chosen` | `.pin-parking-content-chosen` | `#0a2a44` | `#0a2a44` |

### Waypoint pins

| Token | Utility | Light | Dark |
| --- | --- | --- | --- |
| `--pin-waypoint-content-default` | `.pin-waypoint-content-default` | `#020205` | `#e7e8ea` |
| `--pin-waypoint-bg-default` | `.pin-waypoint-bg-default` | `#cfd0d5` | `#404458` |
| `--pin-waypoint-content-selected` | `.pin-waypoint-content-selected` | `#e7e8ea` | `#020205` |
| `--pin-waypoint-bg-selected` | `.pin-waypoint-bg-selected` | `#020205` | `#e7e8ea` |
| `--pin-waypoint-outline` | `.pin-waypoint-outline` | `#ffffff` | `#333333` |
| `--pin-waypoint-pinline` | `.pin-waypoint-pinline` | `#020205` | `#e7e8ea` |

### Info pins

| Token | Utility | Light | Dark |
| --- | --- | --- | --- |
| `--pin-info-content-default` | `.pin-info-content-default` | `#17476d` | `#a5c3d9` |
| `--pin-info-bg-default` | `.pin-info-bg-default` | `#e7eff7` | `#0a2a44` |
| `--pin-info-content-selected` | `.pin-info-content-selected` | `#e7eff7` | `#0a2a44` |
| `--pin-info-bg-hover` | `.pin-info-bg-hover` | `#0d3759` | `#cbdae7` |
| `--pin-info-content-chosen` | `.pin-info-content-chosen` | `#e7eff7` | `#0a2a44` |
| `--pin-info-bg-chosen` | `.pin-info-bg-chosen` | `#1d5a8b` | `#759dbd` |
| `--pin-info-outline` | `.pin-info-outline` | `#1d5a8b` | `#759dbd` |

### Alert pins

| Token | Utility | Light | Dark |
| --- | --- | --- | --- |
| `--pin-alert-content-default` | `.pin-alert-content-default` | `#9d1818` | `#ef9292` |
| `--pin-alert-bg-default` | `.pin-alert-bg-default` | `#f9e1e1` | `#610f0f` |
| `--pin-alert-content-selected` | `.pin-alert-content-selected` | `#f9e1e1` | `#610f0f` |
| `--pin-alert-bg-hover` | `.pin-alert-bg-hover` | `#721111` | `#f3adad` |
| `--pin-alert-outline` | `.pin-alert-outline` | `#b91c1c` | `#e23e3e` |

### Offline pins

| Token | Utility | Light | Dark |
| --- | --- | --- | --- |
| `--pin-offline-content` | `.pin-offline-content` | `#565656` | `#ebebeb` |
| `--pin-offline-bg` | `.pin-offline-bg` | `#ffffff` | `#333333` |
| `--pin-offline-content-selected` | `.pin-offline-content-selected` | `#ffffff` | `#333333` |
| `--pin-offline-bg-selected` | `.pin-offline-bg-selected` | `#3e3e3e` | `#fafafa` |
| `--pin-offline-outline` | `.pin-offline-outline` | `#717171` | `#d9d9d9` |

### Idle pins

| Token | Utility | Light | Dark |
| --- | --- | --- | --- |
| `--pin-idle-content-default` | `.pin-idle-content-default` | `#e08300` | `#fadfba` |
| `--pin-idle-bg-default` | `.pin-idle-bg-default` | `#fcf0de` | `#b25900` |
| `--pin-idle-content-selected` | `.pin-idle-content-selected` | `#fcf0de` | `#b25900` |
| `--pin-idle-bg-selected` | `.pin-idle-bg-selected` | `#b25900` | `#fcf0de` |
| `--pin-idle-outline` | `.pin-idle-outline` | `#eb8900` | `#f7c988` |

### Avatar

| Token | Utility | Light | Dark |
| --- | --- | --- | --- |
| `--avatar-bg-color` | `.avatar-bg-color` | `#4b6615` | `#b7d47f` |
| `--avatar-bg-color-neutral` | `.avatar-bg-color-neutral` | `#e7e8ea` | `#9fa1ab` |
| `--avatar-bg-color-selected` | `.avatar-bg-color-selected` | `#6f8f2f` | `#6f8f2f` |
| `--avatar-border-color` | `.avatar-border-color` | `#6f8f2f` | `#6f8f2f` |
| `--avatar-initials-color` | `.avatar-initials-color` | `#10152e` | `#0c1024` |
| `--avatar-initials-white` | `.avatar-initials-white` | `#ffffff` | `#10152e` |

### Calendar

| Token | Utility | Light | Dark |
| --- | --- | --- | --- |
| `--calendar-pickup-fill` | `.calendar-pickup-fill` | `#6f8f2f` | `#b7d47f` |
| `--calendar-pickup-bg` | `.calendar-pickup-bg` | `#f6fbe9` | `#3d5213` |
| `--calendar-pickup-text` | `.calendar-pickup-text` | `#3e3e3e` | `#fafafa` |
| `--calendar-pickup-border` | `.calendar-pickup-border` | `#6f8f2f` | `#b7d47f` |
| `--calendar-delivery-fill` | `.calendar-delivery-fill` | `#2a628f` | `#4b82af` |
| `--calendar-delivery-bg` | `.calendar-delivery-bg` | `#e7eff7` | `#0a2a44` |
| `--calendar-delivery-text` | `.calendar-delivery-text` | `#3e3e3e` | `#fafafa` |
| `--calendar-delivery-border` | `.calendar-delivery-border` | `#2a628f` | `#2a628f` |
| `--calendar-holiday-fill` | `.calendar-holiday-fill` | `#b3b3b3` | `#8b8b8b` |
| `--calendar-holiday-bg` | `.calendar-holiday-bg` | `#ebebeb` | `#3e3e3e` |
| `--calendar-holiday-text` | `.calendar-holiday-text` | `#3e3e3e` | `#fafafa` |
| `--calendar-holiday-border` | `.calendar-holiday-border` | `#b3b3b3` | `#8b8b8b` |
| `--calendar-drop-fill` | `.calendar-drop-fill` | `#53389e` | `#775bc5` |
| `--calendar-drop-bg` | `.calendar-drop-bg` | `#efecf8` | `#2b1d53` |
| `--calendar-drop-text` | `.calendar-drop-text` | `#3e3e3e` | `#fafafa` |
| `--calendar-drop-border` | `.calendar-drop-border` | `#53389e` | `#775bc5` |
| `--calendar-stop-fill` | `.calendar-stop-fill` | `#f5930b` | `#f4a12d` |
| `--calendar-stop-bg` | `.calendar-stop-bg` | `#fcf0de` | `#804000` |
| `--calendar-stop-text` | `.calendar-stop-text` | `#3e3e3e` | `#fafafa` |
| `--calendar-stop-border` | `.calendar-stop-border` | `#f5930b` | `#f4a12d` |
| `--calendar-today-fill` | `.calendar-today-fill` | `#b91c1c` | `#b91c1c` |
| `--calendar-today-bg` | `.calendar-today-bg` | `#b91c1c` | `#b91c1c` |

### Iconography

| Token | Utility | Light | Dark |
| --- | --- | --- | --- |
| `--icon-neutral` | `.icon-neutral` | `#717171` | `#b3b3b3` |
| `--icon-neutral-darker` | `.icon-neutral-darker` | `#3e3e3e` | `#fafafa` |
| `--icon-neutral-lighter` | `.icon-neutral-lighter` | `#b3b3b3` | `#8b8b8b` |
| `--icon-white` | `.icon-white` | `#ffffff` | `#ffffff` |
| `--icon-brand` | `.icon-brand` | `#6f8f2f` | `#b7d47f` |
| `--icon-blue` | `.icon-blue` | `#1d5a8b` | `#a5c3d9` |
| `--icon-danger` | `.icon-danger` | `#b91c1c` | `#ef9292` |
| `--icon-danger-darker` | `.icon-danger-darker` | `#861414` | `#ef9292` |
| `--icon-warning` | `.icon-warning` | `#eb8900` | `#f4a12d` |
| `--icon-warning-darkest` | `.icon-warning-darkest` | `#804000` | `#f7c988` |
| `--icon-disabled` | `.icon-disabled` | `#d9d9d9` | `#b3b3b3` |

### Card border

| Token | Utility | Light | Dark |
| --- | --- | --- | --- |
| `--scheduler-card-border-inplanning` | `.scheduler-card-border-inplanning` | `#717171` | `#b3b3b3` |
| `--scheduler-card-border-partiallyassigned` | `.scheduler-card-border-partiallyassigned` | `#b25900` | `#fadfba` |
| `--scheduler-card-border-assigned` | `.scheduler-card-border-assigned` | `#332261` | `#c6bae7` |
| `--scheduler-card-border-intransit` | `.scheduler-card-border-intransit` | `#0d3759` | `#cbdae7` |
| `--scheduler-card-border-completed` | `.scheduler-card-border-completed` | `#4b6615` | `#e3f2c4` |
| `--scheduler-card-border-missingpod` | `.scheduler-card-border-missingpod` | `#721111` | `#f3adad` |

### Card background

| Token | Utility | Light | Dark |
| --- | --- | --- | --- |
| `--scheduler-card-bg-inplanning` | `.scheduler-card-bg-inplanning` | `#ebebeb` | `#565656` |
| `--scheduler-card-bg-partiallyassigned` | `.scheduler-card-bg-partiallyassigned` | `#fcf0de` | `#804000` |
| `--scheduler-card-bg-assigned` | `.scheduler-card-bg-assigned` | `#efecf8` | `#2b1d53` |
| `--scheduler-card-bg-intransit` | `.scheduler-card-bg-intransit` | `#e7eff7` | `#0a2a44` |
| `--scheduler-card-bg-completed` | `.scheduler-card-bg-completed` | `#f6fbe9` | `#3d5213` |
| `--scheduler-card-bg-missingpod` | `.scheduler-card-bg-missingpod` | `#f9e1e1` | `#610f0f` |

### Status bar background

| Token | Utility | Light | Dark |
| --- | --- | --- | --- |
| `--scheduler-statusbar-bg-inplanning` | `.scheduler-statusbar-bg-inplanning` | `#3e3e3e` | `#fafafa` |
| `--scheduler-statusbar-bg-partiallyassigned` | `.scheduler-statusbar-bg-partiallyassigned` | `#b25900` | `#fadfba` |
| `--scheduler-statusbar-bg-assigned` | `.scheduler-statusbar-bg-assigned` | `#332261` | `#c6bae7` |
| `--scheduler-statusbar-bg-intransit` | `.scheduler-statusbar-bg-intransit` | `#0d3759` | `#cbdae7` |
| `--scheduler-statusbar-bg-completed` | `.scheduler-statusbar-bg-completed` | `#4b6615` | `#e3f2c4` |
| `--scheduler-statusbar-bg-missingpod` | `.scheduler-statusbar-bg-missingpod` | `#721111` | `#f3adad` |

### Stop badge background

| Token | Utility | Light | Dark |
| --- | --- | --- | --- |
| `--scheduler-badge-bg-inplanning` | `.scheduler-badge-bg-inplanning` | `#d9d9d9` | `#717171` |
| `--scheduler-badge-bg-partiallyassigned` | `.scheduler-badge-bg-partiallyassigned` | `#fadfba` | `#b25900` |
| `--scheduler-badge-bg-assigned` | `.scheduler-badge-bg-assigned` | `#c6bae7` | `#332261` |
| `--scheduler-badge-bg-intransit` | `.scheduler-badge-bg-intransit` | `#cbdae7` | `#0d3759` |
| `--scheduler-badge-bg-completed` | `.scheduler-badge-bg-completed` | `#e3f2c4` | `#4b6615` |
| `--scheduler-badge-bg-missingpod` | `.scheduler-badge-bg-missingpod` | `#f3adad` | `#721111` |

### Stop badge text

| Token | Utility | Light | Dark |
| --- | --- | --- | --- |
| `--scheduler-badge-text-inplanning` | `.scheduler-badge-text-inplanning` | `#3e3e3e` | `#fafafa` |
| `--scheduler-badge-text-partiallyassigned` | `.scheduler-badge-text-partiallyassigned` | `#b25900` | `#fadfba` |
| `--scheduler-badge-text-assigned` | `.scheduler-badge-text-assigned` | `#332261` | `#c6bae7` |
| `--scheduler-badge-text-intransit` | `.scheduler-badge-text-intransit` | `#0d3759` | `#cbdae7` |
| `--scheduler-badge-text-completed` | `.scheduler-badge-text-completed` | `#4b6615` | `#e3f2c4` |
| `--scheduler-badge-text-missingpod` | `.scheduler-badge-text-missingpod` | `#721111` | `#f3adad` |

### Overlay scrims

| Token | Utility | Light | Dark |
| --- | --- | --- | --- |
| `--scrim-dialog` | — | `rgba(0, 0, 0, 0.32)` | `rgba(0, 0, 0, 0.32)` |
| `--scrim-drawer` | — | `rgba(0, 0, 0, 0.6)` | `rgba(0, 0, 0, 0.6)` |

## Utility classes

| Class | Sets |
| --- | --- |
| `.accent-blue-dark` | `background-color: var(--accent-blue-dark)` |
| `.accent-blue-darker` | `background-color: var(--accent-blue-darker)` |
| `.accent-blue-default` | `background-color: var(--accent-blue-default)` |
| `.accent-blue-light` | `background-color: var(--accent-blue-light)` |
| `.accent-blue-lighter` | `background-color: var(--accent-blue-lighter)` |
| `.accent-blue-surface-dark` | `background-color: var(--accent-blue-surface-dark)` |
| `.accent-blue-surface-light` | `background-color: var(--accent-blue-surface-light)` |
| `.accent-blue-surface-lighter` | `background-color: var(--accent-blue-surface-lighter)` |
| `.accent-blue-text` | `color: var(--accent-blue-text)` |
| `.accent-blue-text-lighter` | `color: var(--accent-blue-text-lighter)` |
| `.accent-blueGreen` | `background-color: var(--accent-blueGreen)` |
| `.accent-blueGreen-dark` | `background-color: var(--accent-blueGreen-dark)` |
| `.accent-blueGreen-light` | `background-color: var(--accent-blueGreen-light)` |
| `.accent-green` | `background-color: var(--accent-green)` |
| `.accent-green-dark` | `background-color: var(--accent-green-dark)` |
| `.accent-green-light` | `background-color: var(--accent-green-light)` |
| `.accent-midnight` | `background-color: var(--accent-midnight)` |
| `.accent-midnight-light` | `background-color: var(--accent-midnight-light)` |
| `.accent-orange` | `background-color: var(--accent-orange)` |
| `.accent-orange-dark` | `background-color: var(--accent-orange-dark)` |
| `.accent-orange-light` | `background-color: var(--accent-orange-light)` |
| `.accent-purple` | `background-color: var(--accent-purple)` |
| `.accent-purple-dark` | `background-color: var(--accent-purple-dark)` |
| `.accent-purple-light` | `background-color: var(--accent-purple-light)` |
| `.accent-red` | `background-color: var(--accent-red)` |
| `.accent-red-light` | `background-color: var(--accent-red-light)` |
| `.alert-bg-error` | `background-color: var(--alert-bg-error)` |
| `.alert-bg-info` | `background-color: var(--alert-bg-info)` |
| `.alert-bg-success` | `background-color: var(--alert-bg-success)` |
| `.alert-bg-warning` | `background-color: var(--alert-bg-warning)` |
| `.alert-text-neutral` | `color: var(--alert-text-neutral)` |
| `.avatar-bg-color` | `background-color: var(--avatar-bg-color)` |
| `.avatar-bg-color-neutral` | `background-color: var(--avatar-bg-color-neutral)` |
| `.avatar-bg-color-selected` | `background-color: var(--avatar-bg-color-selected)` |
| `.avatar-border-color` | `border-color: var(--avatar-border-color)` |
| `.avatar-initials-color` | `color: var(--avatar-initials-color)` |
| `.avatar-initials-white` | `color: var(--avatar-initials-white)` |
| `.badge-bg-NCblue` | `background-color: var(--badge-bg-NCblue)` |
| `.badge-bg-NCblue-light` | `background-color: var(--badge-bg-NCblue-light)` |
| `.badge-bg-blue` | `background-color: var(--badge-bg-blue)` |
| `.badge-bg-blue-light` | `background-color: var(--badge-bg-blue-light)` |
| `.badge-bg-green` | `background-color: var(--badge-bg-green)` |
| `.badge-bg-green-dark` | `background-color: var(--badge-bg-green-dark)` |
| `.badge-bg-green-light` | `background-color: var(--badge-bg-green-light)` |
| `.badge-bg-grey` | `background-color: var(--badge-bg-grey)` |
| `.badge-bg-grey-light` | `background-color: var(--badge-bg-grey-light)` |
| `.badge-bg-neutral-light` | `background-color: var(--badge-bg-neutral-light)` |
| `.badge-bg-orange` | `background-color: var(--badge-bg-orange)` |
| `.badge-bg-orange-dark` | `background-color: var(--badge-bg-orange-dark)` |
| `.badge-bg-orange-light` | `background-color: var(--badge-bg-orange-light)` |
| `.badge-bg-purple` | `background-color: var(--badge-bg-purple)` |
| `.badge-bg-purple-light` | `background-color: var(--badge-bg-purple-light)` |
| `.badge-bg-red` | `background-color: var(--badge-bg-red)` |
| `.badge-bg-red-dark` | `background-color: var(--badge-bg-red-dark)` |
| `.badge-bg-red-light` | `background-color: var(--badge-bg-red-light)` |
| `.badge-bg-white` | `background-color: var(--badge-bg-white)` |
| `.badge-stroke-white` | `border-color: var(--badge-stroke-white)` |
| `.badge-text-NCBlue` | `color: var(--badge-text-NCBlue)` |
| `.badge-text-black` | `color: var(--badge-text-black)` |
| `.badge-text-blue` | `color: var(--badge-text-blue)` |
| `.badge-text-green` | `color: var(--badge-text-green)` |
| `.badge-text-green-darker` | `color: var(--badge-text-green-darker)` |
| `.badge-text-grey` | `color: var(--badge-text-grey)` |
| `.badge-text-grey-dark` | `color: var(--badge-text-grey-dark)` |
| `.badge-text-orange` | `color: var(--badge-text-orange)` |
| `.badge-text-orange-darkest` | `color: var(--badge-text-orange-darkest)` |
| `.badge-text-purple` | `color: var(--badge-text-purple)` |
| `.badge-text-purple-light` | `color: var(--badge-text-purple-light)` |
| `.badge-text-red` | `color: var(--badge-text-red)` |
| `.badge-text-red-darker` | `color: var(--badge-text-red-darker)` |
| `.badge-text-white` | `color: var(--badge-text-white)` |
| `.border-NC-blue-default` | `border-color: var(--border-NC-blue-default)` |
| `.border-NC-blue-light` | `border-color: var(--border-NC-blue-light)` |
| `.border-NC-blue-lighter` | `border-color: var(--border-NC-blue-lighter)` |
| `.border-brand-darker` | `border-color: var(--border-brand-darker)` |
| `.border-brand-default` | `border-color: var(--border-brand-default)` |
| `.border-brand-light` | `border-color: var(--border-brand-light)` |
| `.border-brand-lightest` | `border-color: var(--border-brand-lightest)` |
| `.border-neutral-dark` | `border-color: var(--border-neutral-dark)` |
| `.border-neutral-darker` | `border-color: var(--border-neutral-darker)` |
| `.border-neutral-default` | `border-color: var(--border-neutral-default)` |
| `.border-neutral-disabled` | `border-color: var(--border-neutral-disabled)` |
| `.border-neutral-invert` | `border-color: var(--border-neutral-invert)` |
| `.border-neutral-light` | `border-color: var(--border-neutral-light)` |
| `.button-disabled` | `background-color: var(--button-disabled)` |
| `.button-link-default` | `color: var(--button-link-default)` |
| `.button-link-focused` | `color: var(--button-link-focused)` |
| `.button-link-hovered` | `color: var(--button-link-hovered)` |
| `.button-link-pressed` | `color: var(--button-link-pressed)` |
| `.button-primary-bg-critical` | `background-color: var(--button-primary-bg-critical)` |
| `.button-primary-bg-critical-hovered` | `background-color: var(--button-primary-bg-critical-hovered)` |
| `.button-primary-bg-critical-pressed` | `background-color: var(--button-primary-bg-critical-pressed)` |
| `.button-primary-bg-default` | `background-color: var(--button-primary-bg-default)` |
| `.button-primary-bg-focused` | `background-color: var(--button-primary-bg-focused)` |
| `.button-primary-bg-hovered` | `background-color: var(--button-primary-bg-hovered)` |
| `.button-primary-bg-pressed` | `background-color: var(--button-primary-bg-pressed)` |
| `.button-primary-bg-warning` | `background-color: var(--button-primary-bg-warning)` |
| `.button-primary-bg-warning-hovered` | `background-color: var(--button-primary-bg-warning-hovered)` |
| `.button-primary-bg-warning-pressed` | `background-color: var(--button-primary-bg-warning-pressed)` |
| `.button-primary-border-focused` | `border-color: var(--button-primary-border-focused)` |
| `.button-primary-label` | `color: var(--button-primary-label)` |
| `.button-primary-label-critical` | `color: var(--button-primary-label-critical)` |
| `.button-secondary-bg-critical-hovered` | `background-color: var(--button-secondary-bg-critical-hovered)` |
| `.button-secondary-bg-critical-pressed` | `background-color: var(--button-secondary-bg-critical-pressed)` |
| `.button-secondary-bg-focused` | `background-color: var(--button-secondary-bg-focused)` |
| `.button-secondary-bg-hovered` | `background-color: var(--button-secondary-bg-hovered)` |
| `.button-secondary-bg-pressed` | `background-color: var(--button-secondary-bg-pressed)` |
| `.button-secondary-bg-warning-hovered` | `background-color: var(--button-secondary-bg-warning-hovered)` |
| `.button-secondary-bg-warning-pressed` | `background-color: var(--button-secondary-bg-warning-pressed)` |
| `.button-secondary-border-critical` | `border-color: var(--button-secondary-border-critical)` |
| `.button-secondary-border-critical-focused` | `border-color: var(--button-secondary-border-critical-focused)` |
| `.button-secondary-border-default` | `border-color: var(--button-secondary-border-default)` |
| `.button-secondary-border-focused` | `border-color: var(--button-secondary-border-focused)` |
| `.button-secondary-border-hovered` | `border-color: var(--button-secondary-border-hovered)` |
| `.button-secondary-border-pressed` | `border-color: var(--button-secondary-border-pressed)` |
| `.button-secondary-border-warning` | `border-color: var(--button-secondary-border-warning)` |
| `.button-secondary-border-warning-focused` | `border-color: var(--button-secondary-border-warning-focused)` |
| `.button-secondary-label` | `color: var(--button-secondary-label)` |
| `.button-subtle-bg-focused` | `background-color: var(--button-subtle-focused)` |
| `.button-subtle-bg-pressed` | `background-color: var(--button-subtle-bg-pressed)` |
| `.button-subtle-border-default` | `border-color: var(--button-subtle-border-default)` |
| `.button-subtle-border-focused` | `border-color: var(--button-subtle-border-focused)` |
| `.button-subtle-border-hovered` | `border-color: var(--button-subtle-border-hovered)` |
| `.button-subtle-border-pressed` | `border-color: var(--button-subtle-border-pressed)` |
| `.button-subtle-label-default` | `color: var(--button-subtle-label-default)` |
| `.button-subtle-label-focused` | `color: var(--button-subtle-label-focused)` |
| `.button-subtle-label-hovered` | `color: var(--button-subtle-label-hovered)` |
| `.button-subtle-label-pressed` | `color: var(--button-subtle-label-pressed)` |
| `.button-text-bg-hover` | `background-color: var(--button-text-bg-hover)` |
| `.button-text-bg-pressed` | `background-color: var(--button-text-bg-pressed)` |
| `.button-text-label` | `color: var(--button-text-label)` |
| `.button-text-label-critical` | `color: var(--button-text-label-critical)` |
| `.button-text-label-focused` | `color: var(--button-text-label-focused)` |
| `.button-text-label-hover` | `color: var(--button-text-label-hover)` |
| `.button-text-label-info` | `color: var(--button-text-label-info)` |
| `.button-text-label-pressed` | `color: var(--button-text-label-pressed)` |
| `.button-text-label-success` | `color: var(--button-text-label-success)` |
| `.button-text-label-warning` | `color: var(--button-text-label-warning)` |
| `.calendar-delivery-bg` | `color: var(--calendar-delivery-bg)` |
| `.calendar-delivery-border` | `border-color: var(--calendar-delivery-border)` |
| `.calendar-delivery-fill` | `background-color: var(--calendar-delivery-fill)` |
| `.calendar-delivery-text` | `color: var(--calendar-delivery-text)` |
| `.calendar-drop-bg` | `color: var(--calendar-drop-bg)` |
| `.calendar-drop-border` | `border-color: var(--calendar-drop-border)` |
| `.calendar-drop-fill` | `background-color: var(--calendar-drop-fill)` |
| `.calendar-drop-text` | `color: var(--calendar-drop-text)` |
| `.calendar-holiday-bg` | `color: var(--calendar-holiday-bg)` |
| `.calendar-holiday-border` | `border-color: var(--calendar-holiday-border)` |
| `.calendar-holiday-fill` | `background-color: var(--calendar-holiday-fill)` |
| `.calendar-holiday-text` | `color: var(--calendar-holiday-text)` |
| `.calendar-pickup-bg` | `color: var(--calendar-pickup-bg)` |
| `.calendar-pickup-border` | `border-color: var(--calendar-pickup-border)` |
| `.calendar-pickup-fill` | `background-color: var(--calendar-pickup-fill)` |
| `.calendar-pickup-text` | `color: var(--calendar-pickup-text)` |
| `.calendar-stop-bg` | `color: var(--calendar-stop-bg)` |
| `.calendar-stop-border` | `border-color: var(--calendar-stop-border)` |
| `.calendar-stop-fill` | `background-color: var(--calendar-stop-fill)` |
| `.calendar-stop-text` | `color: var(--calendar-stop-text)` |
| `.calendar-today-bg` | `color: var(--calendar-today-bg)` |
| `.calendar-today-fill` | `background-color: var(--calendar-today-fill)` |
| `.chips-bg-disabled` | `background-color: var(--chips-bg-disabled)` |
| `.chips-bg-hover` | `background-color: var(--chips-bg-hover)` |
| `.chips-bg-press` | `background-color: var(--chips-bg-press)` |
| `.chips-bg-selected` | `background-color: var(--chips-bg-selected)` |
| `.chips-focus` | `color: var(--chips-focus)` |
| `.chips-input-bg-default` | `background-color: var(--chips-input-bg-default)` |
| `.chips-outline-brand` | `border-color: var(--chips-outline-brand)` |
| `.chips-outline-neutral` | `border-color: var(--chips-outline-neutral)` |
| `.chips-text-brand-dark` | `color: var(--chips-text-brand-dark)` |
| `.chips-text-disabled` | `color: var(--chips-text-disabled)` |
| `.chips-text-neutral` | `color: var(--chips-text-neutral)` |
| `.critical-border` | `border-color: var(--critical-border)` |
| `.critical-border-dark` | `border-color: var(--critical-border-dark)` |
| `.critical-border-darker` | `border-color: var(--critical-border-darker)` |
| `.critical-border-lighter` | `border-color: var(--critical-border-lighter)` |
| `.critical-border-lightest` | `border-color: var(--critical-border-lightest)` |
| `.critical-surface` | `background-color: var(--critical-surface)` |
| `.critical-surface-dark` | `background-color: var(--critical-surface-dark)` |
| `.critical-surface-darker` | `background-color: var(--critical-surface-darker)` |
| `.critical-surface-light` | `background-color: var(--critical-surface-light)` |
| `.critical-surface-lighter` | `background-color: var(--critical-surface-lighter)` |
| `.critical-text` | `color: var(--critical-text)` |
| `.critical-text-darker` | `color: var(--critical-text-darker)` |
| `.critical-text-darkest` | `color: var(--critical-text-darkest)` |
| `.critical-text-light` | `color: var(--critical-text-light)` |
| `.critical-text-lightest` | `color: var(--critical-text-lightest)` |
| `.form-bg` | `background-color: var(--form-bg)` |
| `.form-bg-focus` | `background-color: var(--form-bg-focus)` |
| `.form-bg-hover` | `background-color: var(--form-bg-hover)` |
| `.form-border` | `border-color: var(--form-border)` |
| `.form-border-disabled` | `border-color: var(--form-border-disabled)` |
| `.form-border-focus` | `border-color: var(--form-border-focus)` |
| `.form-border-hover` | `border-color: var(--form-border-hover)` |
| `.form-critical` | `color: var(--form-critical)` |
| `.form-cursor` | `color: var(--form-cursor)` |
| `.form-disabled` | `color: var(--form-disabled)` |
| `.form-icon` | `color: var(--form-icon)` |
| `.form-label` | `color: var(--form-label)` |
| `.form-label-disabled` | `color: var(--form-label-disabled)` |
| `.form-label-float` | `color: var(--form-label-float)` |
| `.form-label-focus` | `color: var(--form-label-focus)` |
| `.form-required` | `color: var(--form-required)` |
| `.form-success` | `color: var(--form-success)` |
| `.form-value` | `color: var(--form-value)` |
| `.grayscale-mode-neutral` | `color: var(--grayscale-mode-neutral)` |
| `.icon-blue` | `color: var(--icon-blue)` |
| `.icon-brand` | `color: var(--icon-brand)` |
| `.icon-danger` | `color: var(--icon-danger)` |
| `.icon-danger-darker` | `color: var(--icon-danger-darker)` |
| `.icon-disabled` | `color: var(--icon-disabled)` |
| `.icon-neutral` | `color: var(--icon-neutral)` |
| `.icon-neutral-darker` | `color: var(--icon-neutral-darker)` |
| `.icon-neutral-lighter` | `color: var(--icon-neutral-lighter)` |
| `.icon-warning` | `color: var(--icon-warning)` |
| `.icon-warning-darkest` | `color: var(--icon-warning-darkest)` |
| `.icon-white` | `color: var(--icon-white)` |
| `.info-border` | `border-color: var(--info-border)` |
| `.info-border-dark` | `border-color: var(--info-border-dark)` |
| `.info-border-darker` | `border-color: var(--info-border-darker)` |
| `.info-border-light` | `border-color: var(--info-border-light)` |
| `.info-border-lighter` | `border-color: var(--info-border-lighter)` |
| `.info-surface` | `background-color: var(--info-surface)` |
| `.info-surface-dark` | `background-color: var(--info-surface-dark)` |
| `.info-surface-darker` | `background-color: var(--info-surface-darker)` |
| `.info-surface-light` | `background-color: var(--info-surface-light)` |
| `.info-surface-lighter` | `background-color: var(--info-surface-lighter)` |
| `.info-surface-lightest` | `background-color: var(--info-surface-lightest)` |
| `.info-text` | `color: var(--info-text)` |
| `.info-text-dark` | `color: var(--info-text-dark)` |
| `.info-text-darker` | `color: var(--info-text-darker)` |
| `.info-text-light` | `color: var(--info-text-light)` |
| `.info-text-lighter` | `color: var(--info-text-lighter)` |
| `.maintab-bg-default` | `background-color: var(--maintab-bg-default)` |
| `.maintab-bg-disabled` | `background-color: var(--maintab-bg-disabled)` |
| `.maintab-bg-hovered` | `background-color: var(--maintab-bg-hovered)` |
| `.maintab-bg-pressed` | `background-color: var(--maintab-bg-pressed)` |
| `.maintab-bg-selected` | `background-color: var(--maintab-bg-selected)` |
| `.maintab-border-default` | `border-color: var(--maintab-border-default)` |
| `.maintab-border-selected` | `border-color: var(--maintab-border-selected)` |
| `.maintab-text-default` | `color: var(--maintab-text-default)` |
| `.maintab-text-disabled` | `color: var(--maintab-text-disabled)` |
| `.maintab-text-selected` | `color: var(--maintab-text-selected)` |
| `.map-route` | `color: var(--map-route)` |
| `.neutral-border` | `border-color: var(--neutral-border)` |
| `.neutral-border-dark` | `border-color: var(--neutral-border-dark)` |
| `.neutral-border-darker` | `border-color: var(--neutral-border-darker)` |
| `.neutral-border-light` | `border-color: var(--neutral-border-light)` |
| `.neutral-border-lighter` | `border-color: var(--neutral-border-lighter)` |
| `.neutral-surface` | `background-color: var(--neutral-surface)` |
| `.neutral-surface-dark` | `background-color: var(--neutral-surface-dark)` |
| `.neutral-surface-darker` | `background-color: var(--neutral-surface-darker)` |
| `.neutral-surface-light` | `background-color: var(--neutral-surface-light)` |
| `.neutral-surface-lighter` | `background-color: var(--neutral-surface-lighter)` |
| `.neutral-text` | `color: var(--neutral-text)` |
| `.neutral-text-dark` | `color: var(--neutral-text-dark)` |
| `.neutral-text-invert` | `color: var(--neutral-text-invert)` |
| `.outline-brand-default` | `outline-color: var(--outline-brand-default)` |
| `.outline-brand-lightest` | `outline-color: var(--outline-brand-lightest)` |
| `.pin-active-hover` | `background-color: var(--pin-active-hover)` |
| `.pin-alert-bg-default` | `background-color: var(--pin-alert-bg-default)` |
| `.pin-alert-bg-hover` | `background-color: var(--pin-alert-bg-hover)` |
| `.pin-alert-content-default` | `color: var(--pin-alert-content-default)` |
| `.pin-alert-content-selected` | `color: var(--pin-alert-content-selected)` |
| `.pin-alert-outline` | `border-color: var(--pin-alert-outline)` |
| `.pin-finished-hover` | `background-color: var(--pin-finished-hover)` |
| `.pin-idle-bg-default` | `background-color: var(--pin-idle-bg-default)` |
| `.pin-idle-bg-selected` | `background-color: var(--pin-idle-bg-selected)` |
| `.pin-idle-content-default` | `color: var(--pin-idle-content-default)` |
| `.pin-idle-content-selected` | `color: var(--pin-idle-content-selected)` |
| `.pin-idle-outline` | `border-color: var(--pin-idle-outline)` |
| `.pin-inactive-hover` | `background-color: var(--pin-inactive-hover)` |
| `.pin-info-bg-chosen` | `background-color: var(--pin-info-bg-chosen)` |
| `.pin-info-bg-default` | `background-color: var(--pin-info-bg-default)` |
| `.pin-info-bg-hover` | `background-color: var(--pin-info-bg-hover)` |
| `.pin-info-content-chosen` | `color: var(--pin-info-content-chosen)` |
| `.pin-info-content-default` | `color: var(--pin-info-content-default)` |
| `.pin-info-content-selected` | `color: var(--pin-info-content-selected)` |
| `.pin-info-outline` | `border-color: var(--pin-info-outline)` |
| `.pin-location-bg-completed` | `background-color: var(--pin-location-bg-completed)` |
| `.pin-location-bg-default` | `background-color: var(--pin-location-bg-default)` |
| `.pin-location-bg-selected` | `background-color: var(--pin-location-bg-selected)` |
| `.pin-location-content-completed` | `color: var(--pin-location-content-completed)` |
| `.pin-location-content-default` | `color: var(--pin-location-content-default)` |
| `.pin-location-content-selected` | `color: var(--pin-location-content-selected)` |
| `.pin-location-outline` | `border-color: var(--pin-location-outline)` |
| `.pin-offline-bg` | `background-color: var(--pin-offline-bg)` |
| `.pin-offline-bg-selected` | `background-color: var(--pin-offline-bg-selected)` |
| `.pin-offline-content` | `color: var(--pin-offline-content)` |
| `.pin-offline-content-selected` | `color: var(--pin-offline-content-selected)` |
| `.pin-offline-outline` | `border-color: var(--pin-offline-outline)` |
| `.pin-parking-bg-chosen` | `background-color: var(--pin-parking-bg-chosen)` |
| `.pin-parking-bg-default` | `background-color: var(--pin-parking-bg-default)` |
| `.pin-parking-bg-selected` | `background-color: var(--pin-parking-bg-selected)` |
| `.pin-parking-content-chosen` | `color: var(--pin-parking-content-chosen)` |
| `.pin-parking-content-default` | `color: var(--pin-parking-content-default)` |
| `.pin-parking-content-selected` | `color: var(--pin-parking-content-selected)` |
| `.pin-parking-outline` | `border-color: var(--pin-parking-outline)` |
| `.pin-stop-bg-completed` | `background-color: var(--pin-stop-bg-completed)` |
| `.pin-stop-bg-default` | `background-color: var(--pin-stop-bg-default)` |
| `.pin-stop-bg-selected` | `background-color: var(--pin-stop-bg-selected)` |
| `.pin-stop-content-completed` | `color: var(--pin-stop-content-completed)` |
| `.pin-stop-content-default` | `color: var(--pin-stop-content-default)` |
| `.pin-stop-content-selected` | `color: var(--pin-stop-content-selected)` |
| `.pin-stop-outline` | `border-color: var(--pin-stop-outline)` |
| `.pin-stop-pinline` | `border-color: var(--pin-stop-pinline)` |
| `.pin-text-active` | `color: var(--pin-text-active)` |
| `.pin-text-finished` | `color: var(--pin-text-finished)` |
| `.pin-text-warning` | `color: var(--pin-text-warning)` |
| `.pin-vector-bg-active` | `background-color: var(--pin-vector-bg-active)` |
| `.pin-vector-bg-finished` | `background-color: var(--pin-vector-bg-finished)` |
| `.pin-vector-bg-inactive` | `background-color: var(--pin-vector-bg-inactive)` |
| `.pin-vector-outline-active` | `border-color: var(--pin-vector-outline-active)` |
| `.pin-vector-outline-finished` | `border-color: var(--pin-vector-outline-finished)` |
| `.pin-vector-outline-inactive` | `border-color: var(--pin-vector-outline-inactive)` |
| `.pin-waypoint-bg-default` | `background-color: var(--pin-waypoint-bg-default)` |
| `.pin-waypoint-bg-selected` | `background-color: var(--pin-waypoint-bg-selected)` |
| `.pin-waypoint-content-default` | `color: var(--pin-waypoint-content-default)` |
| `.pin-waypoint-content-selected` | `color: var(--pin-waypoint-content-selected)` |
| `.pin-waypoint-outline` | `border-color: var(--pin-waypoint-outline)` |
| `.pin-waypoint-pinline` | `border-color: var(--pin-waypoint-pinline)` |
| `.placeholder` | `color: var(--placeholder)` |
| `.scheduler-badge-bg-assigned` | `background-color: var(--scheduler-badge-bg-assigned)` |
| `.scheduler-badge-bg-completed` | `background-color: var(--scheduler-badge-bg-completed)` |
| `.scheduler-badge-bg-inplanning` | `background-color: var(--scheduler-badge-bg-inplanning)` |
| `.scheduler-badge-bg-intransit` | `background-color: var(--scheduler-badge-bg-intransit)` |
| `.scheduler-badge-bg-missingpod` | `background-color: var(--scheduler-badge-bg-missingpod)` |
| `.scheduler-badge-bg-partiallyassigned` | `background-color: var(--scheduler-badge-bg-partiallyassigned)` |
| `.scheduler-badge-text-assigned` | `color: var(--scheduler-badge-text-assigned)` |
| `.scheduler-badge-text-completed` | `color: var(--scheduler-badge-text-completed)` |
| `.scheduler-badge-text-inplanning` | `color: var(--scheduler-badge-text-inplanning)` |
| `.scheduler-badge-text-intransit` | `color: var(--scheduler-badge-text-intransit)` |
| `.scheduler-badge-text-missingpod` | `color: var(--scheduler-badge-text-missingpod)` |
| `.scheduler-badge-text-partiallyassigned` | `color: var(--scheduler-badge-text-partiallyassigned)` |
| `.scheduler-card-bg-assigned` | `background-color: var(--scheduler-card-bg-assigned)` |
| `.scheduler-card-bg-completed` | `background-color: var(--scheduler-card-bg-completed)` |
| `.scheduler-card-bg-inplanning` | `background-color: var(--scheduler-card-bg-inplanning)` |
| `.scheduler-card-bg-intransit` | `background-color: var(--scheduler-card-bg-intransit)` |
| `.scheduler-card-bg-missingpod` | `background-color: var(--scheduler-card-bg-missingpod)` |
| `.scheduler-card-bg-partiallyassigned` | `background-color: var(--scheduler-card-bg-partiallyassigned)` |
| `.scheduler-card-border-assigned` | `border-color: var(--scheduler-card-border-assigned)` |
| `.scheduler-card-border-completed` | `border-color: var(--scheduler-card-border-completed)` |
| `.scheduler-card-border-inplanning` | `border-color: var(--scheduler-card-border-inplanning)` |
| `.scheduler-card-border-intransit` | `border-color: var(--scheduler-card-border-intransit)` |
| `.scheduler-card-border-missingpod` | `border-color: var(--scheduler-card-border-missingpod)` |
| `.scheduler-card-border-partiallyassigned` | `border-color: var(--scheduler-card-border-partiallyassigned)` |
| `.scheduler-statusbar-bg-assigned` | `background-color: var(--scheduler-statusbar-bg-assigned)` |
| `.scheduler-statusbar-bg-completed` | `background-color: var(--scheduler-statusbar-bg-completed)` |
| `.scheduler-statusbar-bg-inplanning` | `background-color: var(--scheduler-statusbar-bg-inplanning)` |
| `.scheduler-statusbar-bg-intransit` | `background-color: var(--scheduler-statusbar-bg-intransit)` |
| `.scheduler-statusbar-bg-missingpod` | `background-color: var(--scheduler-statusbar-bg-missingpod)` |
| `.scheduler-statusbar-bg-partiallyassigned` | `background-color: var(--scheduler-statusbar-bg-partiallyassigned)` |
| `.segmented-bg-focused` | `background-color: var(--segmented-bg-focused)` |
| `.segmented-bg-hovered` | `background-color: var(--segmented-bg-hovered)` |
| `.segmented-bg-selected` | `background-color: var(--segmented-bg-selected)` |
| `.segmented-border` | `border-color: var(--segmented-border)` |
| `.segmented-border-focus` | `border-color: var(--segmented-border-focus)` |
| `.segmented-border-hover` | `border-color: var(--segmented-border-hover)` |
| `.segmented-border-selected` | `border-color: var(--segmented-border-selected)` |
| `.segmented-disabled` | `background-color: var(--segmented-disabled)` |
| `.segmented-label` | `color: var(--segmented-label)` |
| `.selection-bg-selected-default` | `background-color: var(--selection-bg-selected-default)` |
| `.selection-bg-selected-hover` | `background-color: var(--selection-bg-selected-hover)` |
| `.selection-default` | `background-color: var(--selection-default)` |
| `.selection-disabled` | `background-color: var(--selection-disabled)` |
| `.selection-enabled` | `background-color: var(--selection-enabled)` |
| `.selection-hover` | `background-color: var(--selection-hover)` |
| `.selection-state` | `background-color: var(--selection-state)` |
| `.selection-state-hover` | `background-color: var(--selection-state-hover)` |
| `.selection-stroke-default` | `border-color: var(--selection-stroke-default)` |
| `.selection-stroke-disabled` | `border-color: var(--selection-stroke-disabled)` |
| `.selection-stroke-hover` | `border-color: var(--selection-stroke-hover)` |
| `.selection-stroke-selected` | `border-color: var(--selection-stroke-selected)` |
| `.selection-switchOff-bg` | `background-color: var(--selection-switchOff-bg)` |
| `.selection-switchOff-disabled` | `background-color: var(--selection-switchOff-disabled)` |
| `.selection-switchOff-focus` | `border-color: var(--selection-switchOff-focus)` |
| `.selection-switchOff-handle-bg` | `background-color: var(--selection-switchOff-handle-bg)` |
| `.selection-switchOff-hover` | `background-color: var(--selection-switchOff-hover)` |
| `.selection-switchOff-press` | `background-color: var(--selection-switchOff-press)` |
| `.selection-switchOff-state` | `background-color: var(--selection-switchOff-state)` |
| `.selection-switchOff-stroke` | `border-color: var(--selection-switchOff-stroke)` |
| `.selection-switchOn-default` | `background-color: var(--selection-switchOn-default)` |
| `.selection-switchOn-disabled` | `background-color: var(--selection-switchOn-disabled)` |
| `.selection-switchOn-focus` | `border-color: var(--selection-switchOn-focus)` |
| `.selection-switchOn-handle-disabled` | `background-color: var(--selection-switchOn-handle-disabled)` |
| `.selection-switchOn-handle-white` | `background-color: var(--selection-switchOn-handle-white)` |
| `.selection-switchOn-hover` | `background-color: var(--selection-switchOn-hover)` |
| `.selection-switchOn-press` | `background-color: var(--selection-switchOn-press)` |
| `.selection-switchOn-state` | `background-color: var(--selection-switchOn-state)` |
| `.selection-tick` | `background-color: var(--selection-tick)` |
| `.selection-tick-default` | `color: var(--selection-tick-default)` |
| `.selection-tick-disabled` | `color: var(--selection-tick-disabled)` |
| `.sidebar-border-focus` | `outline-color: var(--border-neutral-dark)` |
| `.sidebar-main-bg-default` | `background-color: var(--sidebar-main-bg-default)` |
| `.sidebar-main-bg-hover` | `background-color: var(--sidebar-main-bg-hover)` |
| `.sidebar-main-bg-selected` | `background-color: var(--sidebar-main-bg-selected)` |
| `.sidebar-main-icon-default` | `color: var(--sidebar-main-icon-default)` |
| `.sidebar-main-icon-hover` | `color: var(--sidebar-main-icon-hover)` |
| `.sidebar-main-icon-selected` | `color: var(--sidebar-main-icon-selected)` |
| `.sidebar-main-text-default` | `color: var(--sidebar-main-text-default)` |
| `.sidebar-main-text-hover` | `color: var(--sidebar-main-text-hover)` |
| `.sidebar-main-text-selected` | `color: var(--sidebar-main-text-selected)` |
| `.sidebar-popover-bg` | `background-color: var(--sidebar-popover-bg)` |
| `.sidebar-popover-text` | `color: var(--sidebar-popover-text)` |
| `.sidebar-scroll-bg-default` | `background-color: var(--sidebar-scroll-bg-default)` |
| `.sidebar-scroll-bg-selected` | `background-color: var(--sidebar-scroll-bg-selected)` |
| `.sidebar-scroll-icon-default` | `color: var(--sidebar-scroll-icon-default)` |
| `.sidebar-scroll-icon-selected` | `color: var(--sidebar-scroll-icon-selected)` |
| `.sidebar-second-bg` | `background-color: var(--sidebar-second-bg)` |
| `.sidebar-second-bg-hover` | `background-color: var(--sidebar-second-bg-hover)` |
| `.sidebar-second-bg-selected` | `background-color: var(--sidebar-second-bg-selected)` |
| `.sidebar-second-border-focus` | `outline-color: var(--border-neutral-dark)` |
| `.sidebar-second-border-selected` | `border-color: var(--sidebar-second-border-selected)` |
| `.sidebar-second-icon-default` | `color: var(--sidebar-second-icon-default)` |
| `.sidebar-second-icon-hover` | `color: var(--sidebar-second-icon-hover)` |
| `.sidebar-second-icon-selected` | `color: var(--sidebar-second-icon-selected)` |
| `.sidebar-second-text-default` | `color: var(--sidebar-second-text-default)` |
| `.sidebar-second-text-hover` | `color: var(--sidebar-second-text-hover)` |
| `.sidebar-second-text-selected` | `color: var(--sidebar-second-text-selected)` |
| `.snackbar-bg-critical` | `background-color: var(--snackbar-bg-critical)` |
| `.snackbar-bg-info` | `background-color: var(--snackbar-bg-info)` |
| `.snackbar-bg-success` | `background-color: var(--snackbar-bg-success)` |
| `.snackbar-border-critical` | `border-color: var(--snackbar-border-critical)` |
| `.snackbar-border-info` | `border-color: var(--snackbar-border-info)` |
| `.snackbar-border-success` | `border-color: var(--snackbar-border-success)` |
| `.snackbar-text-critical` | `color: var(--snackbar-text-critical)` |
| `.snackbar-text-info` | `color: var(--snackbar-text-info)` |
| `.snackbar-text-success` | `color: var(--snackbar-text-success)` |
| `.success-border` | `border-color: var(--success-border)` |
| `.success-border-dark` | `border-color: var(--success-border-dark)` |
| `.success-border-darker` | `border-color: var(--success-border-darker)` |
| `.success-border-light` | `border-color: var(--success-border-light)` |
| `.success-border-lighter` | `border-color: var(--success-border-lighter)` |
| `.success-surface` | `background-color: var(--success-surface)` |
| `.success-surface-dark` | `background-color: var(--success-surface-dark)` |
| `.success-surface-darker` | `background-color: var(--success-surface-darker)` |
| `.success-surface-light` | `background-color: var(--success-surface-light)` |
| `.success-surface-lighter` | `background-color: var(--success-surface-lighter)` |
| `.success-surface-lightest` | `background-color: var(--success-surface-lightest)` |
| `.success-text` | `color: var(--success-text)` |
| `.success-text-dark` | `color: var(--success-text-dark)` |
| `.surface-NC-blue-dark` | `background-color: var(--surface-NC-blue-dark)` |
| `.surface-NC-blue-darker` | `background-color: var(--surface-NC-blue-darker)` |
| `.surface-NC-blue-default` | `background-color: var(--surface-NC-blue-default)` |
| `.surface-NC-blue-default-light` | `background-color: var(--surface-NC-blue-default-light)` |
| `.surface-NC-blue-light` | `background-color: var(--surface-NC-blue-light)` |
| `.surface-NC-blue-lighter` | `background-color: var(--surface-NC-blue-lighter)` |
| `.surface-NC-blue-lightest` | `background-color: var(--surface-NC-blue-lightest)` |
| `.surface-brand-dark` | `background-color: var(--surface-brand-dark)` |
| `.surface-brand-darker` | `background-color: var(--surface-brand-darker)` |
| `.surface-brand-default` | `background-color: var(--surface-brand-default)` |
| `.surface-brand-light` | `background-color: var(--surface-brand-light)` |
| `.surface-brand-lighter` | `background-color: var(--surface-brand-lighter)` |
| `.surface-brand-lightest` | `background-color: var(--surface-brand-lightest)` |
| `.surface-neutral-dark` | `background-color: var(--surface-neutral-dark)` |
| `.surface-neutral-darker` | `background-color: var(--surface-neutral-darker)` |
| `.surface-neutral-darkest` | `background-color: var(--surface-neutral-darkest)` |
| `.surface-neutral-default` | `background-color: var(--surface-neutral-default)` |
| `.surface-neutral-disabled` | `background-color: var(--surface-neutral-disabled)` |
| `.surface-neutral-light` | `background-color: var(--surface-neutral-light)` |
| `.text-NC-blue-dark` | `color: var(--text-NC-blue-dark)` |
| `.text-NC-blue-default` | `color: var(--text-NC-blue-default)` |
| `.text-NC-blue-light` | `color: var(--text-NC-blue-light)` |
| `.text-NC-blue-lighter` | `color: var(--text-NC-blue-lighter)` |
| `.text-NC-blue-lightest` | `color: var(--text-NC-blue-lightest)` |
| `.text-brand-dark` | `color: var(--text-brand-dark)` |
| `.text-brand-darker` | `color: var(--text-brand-darker)` |
| `.text-brand-default` | `color: var(--text-brand-default)` |
| `.text-brand-light` | `color: var(--text-brand-light)` |
| `.text-brand-lighter` | `color: var(--text-brand-lighter)` |
| `.text-neutral-body` | `color: var(--text-neutral-body)` |
| `.text-neutral-caption` | `color: var(--text-neutral-caption)` |
| `.text-neutral-disabled` | `color: var(--text-neutral-disabled)` |
| `.text-neutral-invert` | `color: var(--text-neutral-invert)` |
| `.text-neutral-subtitle` | `color: var(--text-neutral-subtitle)` |
| `.text-neutral-title` | `color: var(--text-neutral-title)` |
| `.warning-border` | `border-color: var(--warning-border)` |
| `.warning-border-dark` | `border-color: var(--warning-border-dark)` |
| `.warning-border-darker` | `border-color: var(--warning-border-darker)` |
| `.warning-border-light` | `border-color: var(--warning-border-light)` |
| `.warning-border-lighter` | `border-color: var(--warning-border-lighter)` |
| `.warning-surface` | `background-color: var(--warning-surface)` |
| `.warning-surface-dark` | `background-color: var(--warning-surface-dark)` |
| `.warning-surface-darker` | `background-color: var(--warning-surface-darker)` |
| `.warning-surface-light` | `background-color: var(--warning-surface-light)` |
| `.warning-surface-lighter` | `background-color: var(--warning-surface-lighter)` |
| `.warning-text` | `color: var(--warning-text)` |
| `.warning-text-dark` | `color: var(--warning-text-dark)` |
| `.warning-text-darker` | `color: var(--warning-text-darker)` |
| `.warning-text-light` | `color: var(--warning-text-light)` |
| `.warning-text-lighter` | `color: var(--warning-text-lighter)` |

## Icons

252 glyphs in the `CtrlChainIcons` font, loaded by `ds/index.css`.
In a prototype, render one as:

    <cca-icon><mat-icon class="mat-icon notranslate cca-icon cca-icon-NAME mat-ligature-font mat-icon-inline" aria-hidden="true"></mat-icon></cca-icon>

| Name | Class |
| --- | --- |
| `about-us` | `cca-icon-about-us` |
| `additional-requirements` | `cca-icon-additional-requirements` |
| `address-card` | `cca-icon-address-card` |
| `alarm-clock` | `cca-icon-alarm-clock` |
| `alignCenter` | `cca-icon-alignCenter` |
| `alignJustify` | `cca-icon-alignJustify` |
| `alignLeft` | `cca-icon-alignLeft` |
| `alignRight` | `cca-icon-alignRight` |
| `android-face-Icon` | `cca-icon-android-face-Icon` |
| `android-fingerprint` | `cca-icon-android-fingerprint` |
| `arrow-curve-down-right` | `cca-icon-arrow-curve-down-right` |
| `arrow-down` | `cca-icon-arrow-down` |
| `arrow-down-left` | `cca-icon-arrow-down-left` |
| `arrow-down-right` | `cca-icon-arrow-down-right` |
| `arrow-left` | `cca-icon-arrow-left` |
| `arrow-right` | `cca-icon-arrow-right` |
| `arrow-rotate-left` | `cca-icon-arrow-rotate-left` |
| `arrow-rotate-right` | `cca-icon-arrow-rotate-right` |
| `arrow-up` | `cca-icon-arrow-up` |
| `arrow-up-left` | `cca-icon-arrow-up-left` |
| `balance` | `cca-icon-balance` |
| `ban` | `cca-icon-ban` |
| `bar-chart` | `cca-icon-bar-chart` |
| `barcode` | `cca-icon-barcode` |
| `bell` | `cca-icon-bell` |
| `bell-off` | `cca-icon-bell-off` |
| `Bold` | `cca-icon-Bold` |
| `book` | `cca-icon-book` |
| `booking` | `cca-icon-booking` |
| `bookmark` | `cca-icon-bookmark` |
| `box` | `cca-icon-box` |
| `box-check` | `cca-icon-box-check` |
| `box-taped` | `cca-icon-box-taped` |
| `boxes` | `cca-icon-boxes` |
| `briefcase` | `cca-icon-briefcase` |
| `brush` | `cca-icon-brush` |
| `building` | `cca-icon-building` |
| `calendar` | `cca-icon-calendar` |
| `calendar-1` | `cca-icon-calendar-1` |
| `calendar-check` | `cca-icon-calendar-check` |
| `car` | `cca-icon-car` |
| `caret-down` | `cca-icon-caret-down` |
| `caret-down-1` | `cca-icon-caret-down-1` |
| `caret-left` | `cca-icon-caret-left` |
| `caret-right` | `cca-icon-caret-right` |
| `caret-up` | `cca-icon-caret-up` |
| `caret-up-1` | `cca-icon-caret-up-1` |
| `check` | `cca-icon-check` |
| `check-circle` | `cca-icon-check-circle` |
| `check-double` | `cca-icon-check-double` |
| `chevron-down` | `cca-icon-chevron-down` |
| `chevron-left` | `cca-icon-chevron-left` |
| `chevron-right` | `cca-icon-chevron-right` |
| `chevron-up` | `cca-icon-chevron-up` |
| `chevrons-down` | `cca-icon-chevrons-down` |
| `chevrons-left` | `cca-icon-chevrons-left` |
| `chevrons-right` | `cca-icon-chevrons-right` |
| `chevrons-up` | `cca-icon-chevrons-up` |
| `child` | `cca-icon-child` |
| `circle-arrow-left` | `cca-icon-circle-arrow-left` |
| `circle-arrow-right` | `cca-icon-circle-arrow-right` |
| `circle-exclamation` | `cca-icon-circle-exclamation` |
| `circle-info` | `cca-icon-circle-info` |
| `circle-notch` | `cca-icon-circle-notch` |
| `circle-small` | `cca-icon-circle-small` |
| `circle-xmark` | `cca-icon-circle-xmark` |
| `clear` | `cca-icon-clear` |
| `clock` | `cca-icon-clock` |
| `cloud-arrow-up` | `cca-icon-cloud-arrow-up` |
| `coachmark` | `cca-icon-coachmark` |
| `code-commit` | `cca-icon-code-commit` |
| `columns` | `cca-icon-columns` |
| `columns-2` | `cca-icon-columns-2` |
| `columns-applied` | `cca-icon-columns-applied` |
| `comment-dollar` | `cca-icon-comment-dollar` |
| `comment-euro` | `cca-icon-comment-euro` |
| `comment-question` | `cca-icon-comment-question` |
| `comments-question` | `cca-icon-comments-question` |
| `container-storage` | `cca-icon-container-storage` |
| `copy` | `cca-icon-copy` |
| `crop-and-rotate` | `cca-icon-crop-and-rotate` |
| `cross-dock` | `cca-icon-cross-dock` |
| `cube` | `cca-icon-cube` |
| `current-location` | `cca-icon-current-location` |
| `dashboardkpi` | `cca-icon-dashboardkpi` |
| `date-time-picker` | `cca-icon-date-time-picker` |
| `direction` | `cca-icon-direction` |
| `dollar-sign` | `cca-icon-dollar-sign` |
| `dolly-flatbed-empty` | `cca-icon-dolly-flatbed-empty` |
| `dot-circle` | `cca-icon-dot-circle` |
| `droplet` | `cca-icon-droplet` |
| `duplicate` | `cca-icon-duplicate` |
| `ellipsis-vertical` | `cca-icon-ellipsis-vertical` |
| `enterprise` | `cca-icon-enterprise` |
| `envelope-open-euro` | `cca-icon-envelope-open-euro` |
| `euro-sign` | `cca-icon-euro-sign` |
| `exchange` | `cca-icon-exchange` |
| `exchange2` | `cca-icon-exchange2` |
| `exclamation` | `cca-icon-exclamation` |
| `expand` | `cca-icon-expand` |
| `export` | `cca-icon-export` |
| `external-link` | `cca-icon-external-link` |
| `eye` | `cca-icon-eye` |
| `eye-slash` | `cca-icon-eye-slash` |
| `file-certificate` | `cca-icon-file-certificate` |
| `file-check` | `cca-icon-file-check` |
| `file-exclamation` | `cca-icon-file-exclamation` |
| `file-image` | `cca-icon-file-image` |
| `file-image-1` | `cca-icon-file-image-1` |
| `file-invoice` | `cca-icon-file-invoice` |
| `file-invoice-dollar` | `cca-icon-file-invoice-dollar` |
| `file-lines` | `cca-icon-file-lines` |
| `file-warning` | `cca-icon-file-warning` |
| `file-xmark` | `cca-icon-file-xmark` |
| `files` | `cca-icon-files` |
| `filter` | `cca-icon-filter` |
| `filter-circle-applied` | `cca-icon-filter-circle-applied` |
| `filter-circle-xmark` | `cca-icon-filter-circle-xmark` |
| `first-page` | `cca-icon-first-page` |
| `flash-on` | `cca-icon-flash-on` |
| `floppy-disk` | `cca-icon-floppy-disk` |
| `folder` | `cca-icon-folder` |
| `folder-open` | `cca-icon-folder-open` |
| `forklift` | `cca-icon-forklift` |
| `fullscreen` | `cca-icon-fullscreen` |
| `gas-pump` | `cca-icon-gas-pump` |
| `gauge-low` | `cca-icon-gauge-low` |
| `Gear-Settings` | `cca-icon-Gear-Settings` |
| `grid-view` | `cca-icon-grid-view` |
| `group` | `cca-icon-group` |
| `hand-holding-seedling` | `cca-icon-hand-holding-seedling` |
| `hashtag` | `cca-icon-hashtag` |
| `help-circle` | `cca-icon-help-circle` |
| `high-value` | `cca-icon-high-value` |
| `history` | `cca-icon-history` |
| `home` | `cca-icon-home` |
| `hourglass` | `cca-icon-hourglass` |
| `info` | `cca-icon-info` |
| `internal` | `cca-icon-internal` |
| `invoice` | `cca-icon-invoice` |
| `invoice-euro` | `cca-icon-invoice-euro` |
| `ios-face-id` | `cca-icon-ios-face-id` |
| `ios-touch-id` | `cca-icon-ios-touch-id` |
| `Italic` | `cca-icon-Italic` |
| `key` | `cca-icon-key` |
| `keyboard` | `cca-icon-keyboard` |
| `last-page` | `cca-icon-last-page` |
| `leaf` | `cca-icon-leaf` |
| `link` | `cca-icon-link` |
| `list` | `cca-icon-list` |
| `list-view` | `cca-icon-list-view` |
| `loading` | `cca-icon-loading` |
| `location-dot` | `cca-icon-location-dot` |
| `location-xmark` | `cca-icon-location-xmark` |
| `lock` | `cca-icon-lock` |
| `mail` | `cca-icon-mail` |
| `mail-add-circle` | `cca-icon-mail-add-circle` |
| `map-location-dot` | `cca-icon-map-location-dot` |
| `memo` | `cca-icon-memo` |
| `memo-circle-check` | `cca-icon-memo-circle-check` |
| `menu` | `cca-icon-menu` |
| `message-inbox` | `cca-icon-message-inbox` |
| `messages` | `cca-icon-messages` |
| `messages-dollar` | `cca-icon-messages-dollar` |
| `messages-euro` | `cca-icon-messages-euro` |
| `microchip-ai` | `cca-icon-microchip-ai` |
| `minus` | `cca-icon-minus` |
| `mobile` | `cca-icon-mobile` |
| `mobile-off` | `cca-icon-mobile-off` |
| `mobile-on` | `cca-icon-mobile-on` |
| `money-bill` | `cca-icon-money-bill` |
| `moon` | `cca-icon-moon` |
| `no-more-task` | `cca-icon-no-more-task` |
| `octagon-xmark` | `cca-icon-octagon-xmark` |
| `orderedList` | `cca-icon-orderedList` |
| `pallet-box` | `cca-icon-pallet-box` |
| `paper-plane` | `cca-icon-paper-plane` |
| `parking` | `cca-icon-parking` |
| `pause` | `cca-icon-pause` |
| `pen-to-square` | `cca-icon-pen-to-square` |
| `pencil` | `cca-icon-pencil` |
| `percent` | `cca-icon-percent` |
| `person-carry` | `cca-icon-person-carry` |
| `person-dolly-empty` | `cca-icon-person-dolly-empty` |
| `phone` | `cca-icon-phone` |
| `phonebook` | `cca-icon-phonebook` |
| `pinned` | `cca-icon-pinned` |
| `pinned-no` | `cca-icon-pinned-no` |
| `pinned-yes` | `cca-icon-pinned-yes` |
| `placeholder` | `cca-icon-placeholder` |
| `plus` | `cca-icon-plus` |
| `polygon` | `cca-icon-polygon` |
| `pound-sign` | `cca-icon-pound-sign` |
| `power` | `cca-icon-power` |
| `receipt` | `cca-icon-receipt` |
| `refresh` | `cca-icon-refresh` |
| `request` | `cca-icon-request` |
| `road` | `cca-icon-road` |
| `rotate` | `cca-icon-rotate` |
| `rotate-camera` | `cca-icon-rotate-camera` |
| `route` | `cca-icon-route` |
| `scale-balanced` | `cca-icon-scale-balanced` |
| `search` | `cca-icon-search` |
| `security` | `cca-icon-security` |
| `share` | `cca-icon-share` |
| `simple-map` | `cca-icon-simple-map` |
| `smog` | `cca-icon-smog` |
| `sort` | `cca-icon-sort` |
| `steering-wheel` | `cca-icon-steering-wheel` |
| `stopwatch` | `cca-icon-stopwatch` |
| `story` | `cca-icon-story` |
| `sun` | `cca-icon-sun` |
| `support` | `cca-icon-support` |
| `swap` | `cca-icon-swap` |
| `tags` | `cca-icon-tags` |
| `tail-lift` | `cca-icon-tail-lift` |
| `task-warning` | `cca-icon-task-warning` |
| `taskboard` | `cca-icon-taskboard` |
| `temperature-3` | `cca-icon-temperature-3` |
| `trailer` | `cca-icon-trailer` |
| `trailer-clock` | `cca-icon-trailer-clock` |
| `trailer-off` | `cca-icon-trailer-off` |
| `trailer-on` | `cca-icon-trailer-on` |
| `train` | `cca-icon-train` |
| `translation` | `cca-icon-translation` |
| `trash-can` | `cca-icon-trash-can` |
| `tree` | `cca-icon-tree` |
| `truck` | `cca-icon-truck` |
| `truck-check` | `cca-icon-truck-check` |
| `truck-clock` | `cca-icon-truck-clock` |
| `truck-fast` | `cca-icon-truck-fast` |
| `truck-pickup` | `cca-icon-truck-pickup` |
| `truck-ramp` | `cca-icon-truck-ramp` |
| `truck-ramp-box` | `cca-icon-truck-ramp-box` |
| `truck-xmark` | `cca-icon-truck-xmark` |
| `two-switch-horizontal-config` | `cca-icon-two-switch-horizontal-config` |
| `Underline` | `cca-icon-Underline` |
| `unorderedList` | `cca-icon-unorderedList` |
| `upload` | `cca-icon-upload` |
| `user` | `cca-icon-user` |
| `user-check` | `cca-icon-user-check` |
| `user-minus` | `cca-icon-user-minus` |
| `user-pen` | `cca-icon-user-pen` |
| `user-plus` | `cca-icon-user-plus` |
| `user-slash` | `cca-icon-user-slash` |
| `user-xmark` | `cca-icon-user-xmark` |
| `users` | `cca-icon-users` |
| `users-slash` | `cca-icon-users-slash` |
| `vessel` | `cca-icon-vessel` |
| `warning` | `cca-icon-warning` |
| `weight-hanging` | `cca-icon-weight-hanging` |
| `xmark` | `cca-icon-xmark` |

## Raw palette

Ramps behind the tokens. Do not use these directly in a prototype — reach for
the semantic token above so the prototype tracks theme changes.

- **Neutrals**: `neutrals-50` #ffffff, `neutrals-100` #fafafa, `neutrals-200` #ebebeb, `neutrals-300` #d9d9d9, `neutrals-400` #b3b3b3, `neutrals-500` #8b8b8b, `neutrals-600` #717171, `neutrals-700` #565656, `neutrals-800` #3e3e3e, `neutrals-900` #333333
- **Green**: `green-50` #f6fbe9, `green-100` #e3f2c4, `green-200` #d5eba9, `green-300` #b7d47f, `green-400` #a7c46c, `green-500` #8dab51, `green-600` #6f8f2f, `green-700` #638029, `green-800` #4b6615, `green-900` #3d5213, `green-950` #343630, `green-1000` #282925
- **Purple**: `purple-50` #efecf8, `purple-100` #c6bae7, `purple-200` #b3a3de, `purple-300` #9984d3, `purple-400` #775bc5, `purple-500` #53389e, `purple-600` #473086, `purple-700` #3c2872, `purple-800` #332261, `purple-900` #2b1d53
- **Orange**: `orange-50` #fcf0de, `orange-100` #fadfba, `orange-200` #f7c988, `orange-300` #f5b153, `orange-400` #f4a12d, `orange-500` #f5930b, `orange-600` #eb8900, `orange-700` #e08300, `orange-800` #b25900, `orange-900` #804000
- **Red**: `red-50` #f9e1e1, `red-100` #f3adad, `red-200` #ef9292, `red-300` #e96e6e, `red-400` #e23e3e, `red-500` #b91c1c, `red-600` #9d1818, `red-700` #861414, `red-800` #721111, `red-900` #610f0f
- **Bluegreen**: `bluegreen-50` #e3f8f1, `bluegreen-100` #c4f2e3, `bluegreen-200` #a0e8d0, `bluegreen-300` #7fdbbd, `bluegreen-400` #52d1a7, `bluegreen-500` #3bc497, `bluegreen-600` #2db286, `bluegreen-700` #1b966d, `bluegreen-800` #0b7d57, `bluegreen-900` #0d6648
- **Blue**: `blue-50` #e7eff7, `blue-100` #cbdae7, `blue-200` #a5c3d9, `blue-300` #759dbd, `blue-400` #4b82af, `blue-500` #2a628f, `blue-600` #1d5a8b, `blue-700` #17476d, `blue-800` #0d3759, `blue-900` #0a2a44
- **NewCold Official**: `newCold-50` #e7e8ea, `newCold-100` #cfd0d5, `newCold-200` #9fa1ab, `newCold-300` #707382, `newCold-400` #404458, `newCold-500` #10152e, `newCold-600` #0c1024, `newCold-700` #090c19, `newCold-800` #05070f, `newCold-900` #020205
- **Newcold-1**: `newcold-1-50` #f8faff, `newcold-1-100` #e4edff, `newcold-1-200` #c1d6ff, `newcold-1-300` #9dc0fa, `newcold-1-400` #085bff, `newcold-1-500` #003aae, `newcold-1-600` #001847, `newcold-1-700` #000b20, `newcold-1-800` #000308, `newcold-1-900` #000000
- **Newcold-2**: `newcold-2-50` #fafdff, `newcold-2-100` #ecf6ff, `newcold-2-200` #d4ecff, `newcold-2-300` #b3ddff, `newcold-2-400` #53b2ff, `newcold-2-500` #1596ff, `newcold-2-600` #0070cc, `newcold-2-700` #004177, `newcold-2-800` #002544, `newcold-2-900` #001c33

## Design-system components

The 40 components FE flags as design system. `ds/index.css` already carries
their CSS — no extra stylesheet needed.

| Selector | Owner |
| --- | --- |
| `cca-action-header` | `libs/ui/src` |
| `cca-address-text` | `libs/ui/src` |
| `cca-root` | `apps/platform` |
| `cca-attention-flag-badge` | `libs/ui/src` |
| `cca-avatar-group` | `libs/ui/src` |
| `cca-booking-popover-orders-overview` | `libs/ui/src` |
| `cca-booking-popover-stops-overview` | `libs/ui/src` |
| `button[ccaButton], a[ccaButton]` | `libs/ui/src` |
| `cca-carriers-per-modality-column` | `libs/ui/src` |
| `cca-contact` | `libs/ui/src` |
| `cca-date-cell` | `libs/ui/src` |
| `cca-dialog-image-cropper` | `libs/ui/src` |
| `cca-header` | `apps/platform` |
| `cca-info-banner` | `libs/ui/src` |
| `cca-instruction-drawer` | `libs/ui/src` |
| `cca-label-badge` | `libs/ui/src` |
| `cca-main` | `apps/platform` |
| `cca-message-banner` | `apps/platform` |
| `cca-multi-stop-list` | `libs/ui/src` |
| `cca-multimodal-date-time-detail` | `libs/ui/src` |
| `cca-next-previous-scrollbar` | `libs/ui/src` |
| `cca-numerical-badge` | `libs/ui/src` |
| `cca-panel-resize-divider` | `libs/ui/src` |
| `cca-phone-button` | `libs/ui/src` |
| `cca-rich-text-viewer` | `libs/ui/src` |
| `cca-search-field` | `libs/ui/src` |
| `cca-section-header` | `libs/ui/src` |
| `cca-select-sub-group` | `libs/ui/src` |
| `cca-show-more-less` | `libs/ui/src` |
| `cca-side-menu` | `apps/platform` |
| `cca-side-menu-item` | `apps/platform` |
| `cca-side-submenu` | `apps/platform` |
| `cca-spinner` | `libs/ui/src` |
| `cca-status-badge` | `libs/ui/src` |
| `cca-statuses-count` | `libs/ui/src` |
| `cca-submenu-action-dialog` | `apps/platform` |
| `cca-text-badge` | `libs/ui/src` |
| `cca-tree-view` | `libs/ui/src` |
| `cca-vertical-action-card` | `libs/ui/src` |
| `cca-yes-no-radio` | `libs/ui/src` |

## App components with exported CSS

Not design system — product-specific components whose stylesheet was exported
anyway. `ds/index.css` does NOT include these. If a prototype genuinely needs
one, link its stylesheet after `ds/index.css`, and flag it: reaching this deep
usually means the prototype is copying a screen rather than composing one.

| Selector | Stylesheet |
| --- | --- |
| `cca-actions` | `ds/components/action.css` |
| `cca-action-confirm-cargo-loaded` | `ds/components/action-confirm-cargo-loaded.css` |
| `cca-action-header` | `ds/components/action-header.css` |
| `cca-action-resend-transport-data` | `ds/components/action-resend-transport-data.css` |
| `cca-action-shipment-issues` | `ds/components/action-shipment-issues.css` |
| `cca-activation` | `ds/components/activation.css` |
| `cca-add-article-dialog` | `ds/components/add-article-dialog.css` |
| `cca-add-new-contact-dialog` | `ds/components/add-edit-contact-dialog.css` |
| `cca-add-lane` | `ds/components/add-lane.css` |
| `cca-add-lane-side-summary` | `ds/components/add-lane-side-summary.css` |
| `cca-edit-price-details-dialog` | `ds/components/add-price-details-dialog.css` |
| `cca-additional-requirements` | `ds/components/additional-requirements.css` |
| `cca-address-autocomplete` | `ds/components/address-autocomplete.css` |
| `cca-address` | `ds/components/address-create.css` |
| `cca-address-field` | `ds/components/address-field.css` |
| `cca-address-map-dialog` | `ds/components/address-map-dialog.css` |
| `cca-adr-product-form-dialog` | `ds/components/adr-product-form-dialog.css` |
| `cca-allowed-tolerance` | `ds/components/allowed-tolerance.css` |
| `cca-article-import-dialog` | `ds/components/article-import-dialog.css` |
| `cca-article-overview` | `ds/components/article-overview.css` |
| `cca-assign-carrier-dialog` | `ds/components/assign-carrier-dialog.css` |
| `cca-assigned-carrier-card` | `ds/components/assigned-carrier-card.css` |
| `cca-assigned-carrier-card` | `ds/components/assigned-carrier-card-2.css` |
| `cca-auto-complete-field` | `ds/components/auto-complete-field.css` |
| `cca-base-filters-chip` | `ds/components/base-filters-chip.css` |
| `cca-additional-info-form` | `ds/components/booking-additional-info-form.css` |
| `cca-booking-agent-widget` | `ds/components/booking-agent-widget.css` |
| `cca-booking-calendar` | `ds/components/booking-calendar.css` |
| `cca-booking-container-fcl` | `ds/components/booking-container-fcl.css` |
| `cca-booking-detail-assignees` | `ds/components/booking-detail-assignees.css` |
| `cca-booking-detail-comments` | `ds/components/booking-detail-comments.css` |
| `cca-booking-detail-edit-instruction` | `ds/components/booking-detail-edit-instruction.css` |
| `cca-booking-ltl-additional-services` | `ds/components/booking-ltl-additional-services.css` |
| `cca-booking-ltl-cargo-data` | `ds/components/booking-ltl-cargo-data.css` |
| `cca-booking-ltl-carriers` | `ds/components/booking-ltl-carriers.css` |
| `cca-select-ltl-locations` | `ds/components/booking-ltl-locations.css` |
| `cca-booking-references-detail-edit` | `ds/components/booking-references-detail-edit.css` |
| `cca-booking-select-carrier` | `ds/components/booking-select-carrier.css` |
| `cca-booking-side-summary` | `ds/components/booking-side-summary.css` |
| `cca-booking-terms` | `ds/components/booking-terms.css` |
| `cca-bookkeeping-dialog` | `ds/components/bookkeeping-dialog.css` |
| `cca-calculate-rate-step` | `ds/components/calculate-rate-step.css` |
| `cca-calendar` | `ds/components/calendar.css` |
| `cca-carrier` | `ds/components/carrier.css` |
| `cca-carrier-corridor-manage-detail` | `ds/components/carrier-corridor-manage-detail.css` |
| `cca-carrier-corridor-search` | `ds/components/carrier-corridor-search.css` |
| `cca-carrier-corridor-search-table` | `ds/components/carrier-corridor-search-table.css` |
| `cca-carrier-input` | `ds/components/carrier-input.css` |
| `cca-carrier-lanes-action-table` | `ds/components/carrier-lanes-action-table.css` |
| `cca-carrier-selection` | `ds/components/carrier-selection.css` |
| `cca-co3-table` | `ds/components/co3-table.css` |
| `cca-conversation` | `ds/components/communication-conversation.css` |
| `cca-confirmation-step` | `ds/components/confirmation-step.css` |
| `cca-contacts-notifications-table` | `ds/components/contacts-notifications-table.css` |
| `cca-container-detail` | `ds/components/container-detail.css` |
| `cca-container-shipment-form` | `ds/components/container-shipment-form.css` |
| `cca-container-transport-table` | `ds/components/container-transport-table.css` |
| `cca-conversation-inbox` | `ds/components/conversation-inbox.css` |
| `cca-conversation-item` | `ds/components/conversation-item.css` |
| `cca-conversation-thread` | `ds/components/conversation-thread.css` |
| `cca-conversation-thread-pane` | `ds/components/conversation-thread-2.css` |
| `cca-create-personalized-action-dialog` | `ds/components/create-personalized-action-dialog.css` |
| `cca-custom-calendar-overlay` | `ds/components/custom-calendar-overlay.css` |
| `cca-data-table` | `ds/components/data-table.css` |
| `cca-date-time-detail` | `ds/components/date-time-detail.css` |
| `cca-sequence-dev-tool` | `ds/components/dev-tool.css` |
| `cca-dialog-add-shipment-ftl` | `ds/components/dialog-add-shipment-ftl.css` |
| `cca-dialog-review-pod` | `ds/components/dialog-review-pod.css` |
| `cca-document-editor` | `ds/components/document-editor.css` |
| `cca-documents-list` | `ds/components/documents-list.css` |
| `cca-documents-upload` | `ds/components/documents-upload.css` |
| `cca-enterprise-table` | `ds/components/enterprise-table.css` |
| `cca-enterprise-table` | `ds/components/enterprise-table-2.css` |
| `cca-entity-conversation` | `ds/components/entity-conversation.css` |
| `cca-expandable-multistop-table` | `ds/components/expandable-multistop-table.css` |
| `cca-expanded-tooltip-view` | `ds/components/expanded-tooltip-view.css` |
| `cca-filter-preset-tabs` | `ds/components/filter-preset-tabs.css` |
| `cca-filter-values-chip` | `ds/components/filter-values-chip.css` |
| `cca-filter-values-chip-set` | `ds/components/filter-values-chip-set.css` |
| `cca-filters-button` | `ds/components/filters-button.css` |
| `cca-filters-drawer` | `ds/components/filters-drawer.css` |
| `cca-filters-select` | `ds/components/filters-select.css` |
| `cca-filters-wrapper` | `ds/components/filters-wrapper.css` |
| `cca-finalize-details-step` | `ds/components/finalize-details-step.css` |
| `cca-finance-summary` | `ds/components/finance-summary.css` |
| `cca-fleet-overview` | `ds/components/fleet-overview.css` |
| `cca-fleet-tracking-sidepanel` | `ds/components/fleet-tracking-sidepanel.css` |
| `cca-form-group-co2` | `ds/components/form-group-co2.css` |
| `cca-form-group-licenses` | `ds/components/form-group-licenses.css` |
| `cca-form-group-overview` | `ds/components/form-group-overview.css` |
| `cca-form-parent-select` | `ds/components/form-parent-select.css` |
| `cca-form-prospective-user-details` | `ds/components/form-prospective-user-details.css` |
| `cca-day-selector` | `ds/components/forms.css` |
| `cca-frequency-and-volume` | `ds/components/frequency-and-volume.css` |
| `cca-fuel-surcharge-rates-table` | `ds/components/fuel-surcharge-rates-table.css` |
| `cca-google-predictions-panel` | `ds/components/google-predictions-panel.css` |
| `cca-grid` | `ds/components/grid.css` |
| `cca-grid-static-header` | `ds/components/grid-static-header.css` |
| `cca-grid-tabs-header` | `ds/components/grid-tabs-header.css` |
| `cca-group-detail-members` | `ds/components/group-detail-members.css` |
| `cca-group-detail-relations` | `ds/components/group-detail-relations.css` |
| `cca-group-details` | `ds/components/group-details.css` |
| `cca-group-fuel-surcharge-rates-table` | `ds/components/group-fuel-surcharge-rates-table.css` |
| `cca-group-invite-dialog` | `ds/components/group-invite-dialog.css` |
| `cca-group-relations-overview-with-tabs` | `ds/components/group-relations-overview-with-tabs.css` |
| `cca-group-select` | `ds/components/group-select.css` |
| `cca-user-sub-groups` | `ds/components/group-sub-groups.css` |
| `cca-group-table` | `ds/components/group-table.css` |
| `cca-home` | `ds/components/home.css` |
| `cca-ltl-cargo-info-dialog` | `ds/components/info-dialog.css` |
| `cca-invoice-details-item` | `ds/components/invoice-details-item.css` |
| `cca-invoice-validation-actions` | `ds/components/invoice-validation-actions.css` |
| `cca-invoice-validation-table` | `ds/components/invoice-validation-table.css` |
| `cca-invoicing-create-form` | `ds/components/invoicing-create-form.css` |
| `cca-invoicing-group-table` | `ds/components/invoicing-group-table.css` |
| `cca-invoicing-sets-table` | `ds/components/invoicing-sets-table.css` |
| `cca-kpi-tile-widget` | `ds/components/kpi-tile-widget.css` |
| `cca-kpi-widget` | `ds/components/kpi-widget.css` |
| `cca-kpi-widget-config-drawer` | `ds/components/kpi-widget-config-drawer.css` |
| `cca-lane-carrier-rate-table` | `ds/components/lane-carrier-rate-table.css` |
| `cca-lane-instructions-dialog` | `ds/components/lane-instructions-dialog.css` |
| `cca-lane-request-data-level` | `ds/components/lane-request-data-level.css` |
| `cca-lane-request-detail` | `ds/components/lane-request-detail.css` |
| `cca-lane-request-detail-request` | `ds/components/lane-request-detail-request.css` |
| `cca-lane-request-offers-table` | `ds/components/lane-request-offers-table.css` |
| `cca-lane-request-overview` | `ds/components/lane-request-overview.css` |
| `cca-lane-request-quotes-carrier-lane` | `ds/components/lane-request-quotes-carrier-lane.css` |
| `cca-lane-request-quotes-lanes-table` | `ds/components/lane-request-quotes-lanes-table.css` |
| `cca-lane-request-quotes-tabs` | `ds/components/lane-request-quotes-tabs.css` |
| `cca-lane-request-summary-overview` | `ds/components/lane-request-summary-overview.css` |
| `cca-lane-shipper-rate-table` | `ds/components/lane-shipper-rate-table.css` |
| `cca-lane-side-summary` | `ds/components/lane-side-summary.css` |
| `cca-lane-tender-carriers` | `ds/components/lane-tender-carriers.css` |
| `cca-language-switch` | `ds/components/language-switch.css` |
| `cca-latest-features` | `ds/components/latest-features.css` |
| `cca-legacy-conversation` | `ds/components/legacy-conversation.css` |
| `cca-authenticate` | `ds/components/lib.css` |
| `cca-map` | `ds/components/lib-2.css` |
| `cca-order` | `ds/components/lib-3.css` |
| `cca-list-box` | `ds/components/list-box.css` |
| `cca-load-details` | `ds/components/load-details.css` |
| `cca-load-details-products-sidepanel` | `ds/components/load-details-products-sidepanel.css` |
| `cca-load-details-sidepanel` | `ds/components/load-details-sidepanel.css` |
| `cca-location-card` | `ds/components/location-card.css` |
| `cca-logging-table` | `ds/components/logging-table.css` |
| `cca-ltl-date-time-detail` | `ds/components/ltl-date-time-detail.css` |
| `cca-map-legend` | `ds/components/map-legend.css` |
| `cca-map-location-overview-card` | `ds/components/map-location-overview-card.css` |
| `cca-map-marker-trackable-object` | `ds/components/map-marker-trackable-object.css` |
| `cca-map-overview` | `ds/components/map-overview.css` |
| `cca-map-overview-card` | `ds/components/map-overview-card.css` |
| `cca-map-secure-parking-details` | `ds/components/map-secure-parking-details.css` |
| `cca-marker-pin` | `ds/components/marker-pin.css` |
| `cca-migrations-page` | `ds/components/migrations-page.css` |
| `cca-multimodal-edit-references` | `ds/components/multimodal-edit-references.css` |
| `cca-notification` | `ds/components/notification.css` |
| `cca-notification-tile` | `ds/components/notification-tile.css` |
| `cca-notifications-panel` | `ds/components/notifications-panel.css` |
| `cca-order-assigned-carrier` | `ds/components/order-assigned-carrier.css` |
| `cca-order-detail` | `ds/components/order-detail.css` |
| `cca-order-detail-info` | `ds/components/order-detail-info.css` |
| `cca-order-mml-detail-info` | `ds/components/order-detail-info-2.css` |
| `cca-order-detail-pricing` | `ds/components/order-detail-pricing.css` |
| `cca-order-detail-reset-2` | `ds/components/order-detail-reset.css` |
| `cca-order-detail-mml-reset` | `ds/components/order-detail-reset-2.css` |
| `cca-order-table` | `ds/components/order-table.css` |
| `cca-orders-multistop` | `ds/components/orders-multistop.css` |
| `cca-overview` | `ds/components/overview.css` |
| `cca-overview-additional-requirements` | `ds/components/overview-additional-requirements.css` |
| `cca-overview-vehicle-and-volume` | `ds/components/overview-vehicle-and-volume.css` |
| `cca-public-pallet-landing` | `ds/components/pallet-landing-page.css` |
| `cca-parking-requirements` | `ds/components/parking-requirements.css` |
| `cca-phonenumber-field` | `ds/components/phonenumber-field.css` |
| `cca-pinned-filters` | `ds/components/pinned-filters.css` |
| `cca-planning-unit-card` | `ds/components/planning-unit-card.css` |
| `cca-platform-overview` | `ds/components/platform-overview.css` |
| `cca-possible-group-relations-selection-list` | `ds/components/possible-group-relations-selection-list.css` |
| `cca-price-details-overview-edit-table` | `ds/components/price-details-overview-edit-table.css` |
| `cca-price-details-overview-table` | `ds/components/price-details-overview-table.css` |
| `cca-price-prediction-feedback-dialog` | `ds/components/price-prediction-feedback-dialog.css` |
| `cca-pricing-detail` | `ds/components/pricing-detail.css` |
| `cca-privacy-policy` | `ds/components/privacy-policy.css` |
| `cca-product-form-dialog` | `ds/components/product-form-dialog.css` |
| `cca-tender-unauthorized` | `ds/components/public-accept-trip.css` |
| `cca-public-page-layout` | `ds/components/public-page-layout.css` |
| `cca-publish-tender-dialog` | `ds/components/publish-tender-dialog.css` |
| `cca-rate-overview-table` | `ds/components/rate-overview-table.css` |
| `cca-rate-reset-dialog` | `ds/components/rate-reset-dialog.css` |
| `cca-rates-history-dialog` | `ds/components/rates-history-dialog.css` |
| `cca-relations-table` | `ds/components/relations-table.css` |
| `cca-rename-view-dialog` | `ds/components/rename-view-dialog.css` |
| `cca-request-detail-info` | `ds/components/request-detail-info.css` |
| `cca-resource-detail-popover` | `ds/components/resource-detail-popover.css` |
| `cca-review-quote-step` | `ds/components/review-quote-step.css` |
| `cca-rich-text-editor` | `ds/components/rich-text-editor.css` |
| `cca-route-planning-map-dialog` | `ds/components/route-planning-map-dialog.css` |
| `cca-route-planning-stops` | `ds/components/route-planning-stops.css` |
| `cca-run-migration-dialog` | `ds/components/run-migration-dialog.css` |
| `cca-select-address-enterprise` | `ds/components/select-address-enterprise.css` |
| `cca-select-sub-group` | `ds/components/select-address-sub-group.css` |
| `cca-select-address-type-dialog` | `ds/components/select-address-type-dialog.css` |
| `cca-select-cargo-data` | `ds/components/select-cargo-data.css` |
| `cca-select-fcl-container` | `ds/components/select-fcl-container.css` |
| `cca-select-frequency-and-volume` | `ds/components/select-frequency-and-volume.css` |
| `cca-booking-instructions` | `ds/components/select-instructions.css` |
| `cca-select-lane` | `ds/components/select-lane.css` |
| `cca-select-location` | `ds/components/select-location.css` |
| `cca-select-locations` | `ds/components/select-locations.css` |
| `cca-sequence-notifications` | `ds/components/select-notifications.css` |
| `cca-select-operator` | `ds/components/select-operator.css` |
| `cca-select-shipper-enterprise` | `ds/components/select-shipper-enterprise.css` |
| `cca-select-summary` | `ds/components/select-summary.css` |
| `cca-sequence` | `ds/components/sequence.css` |
| `cca-service-card` | `ds/components/service-card.css` |
| `cca-set-overview-table` | `ds/components/set-overview-table.css` |
| `cca-set-stop-time-dialog` | `ds/components/set-stop-time-dialog.css` |
| `cca-shipment-issue-list` | `ds/components/shipment-issue-list.css` |
| `cca-quotes-shipment-list` | `ds/components/shipment-list.css` |
| `cca-stop-card` | `ds/components/stop-card.css` |
| `cca-stops-modalities-column` | `ds/components/stops-modalities-column.css` |
| `cca-suggested-location` | `ds/components/suggested-location.css` |
| `cca-surcharge-alias-table` | `ds/components/surcharge-alias-table.css` |
| `cca-surcharge-key-list` | `ds/components/surcharge-key-list.css` |
| `cca-task-details` | `ds/components/task-details.css` |
| `cca-taskboard` | `ds/components/taskboard.css` |
| `cca-tender-add-carriers-dialog` | `ds/components/tender-add-carriers-dialog.css` |
| `cca-tender-card` | `ds/components/tender-card.css` |
| `cca-tender-carriers` | `ds/components/tender-carriers.css` |
| `cca-tender-create` | `ds/components/tender-create.css` |
| `cca-tender-detail-info` | `ds/components/tender-detail-info.css` |
| `cca-tender-general` | `ds/components/tender-general.css` |
| `cca-tender-lane-create` | `ds/components/tender-lane-create.css` |
| `cca-tender-lane-detail-request-info` | `ds/components/tender-lane-detail-request-info.css` |
| `cca-tender-lane-overview` | `ds/components/tender-lane-overview.css` |
| `cca-tender-lane-row-carrier-unauthorized` | `ds/components/tender-lane-row-carrier-unauthorized.css` |
| `cca-tender-overview` | `ds/components/tender-overview.css` |
| `cca-tender-shipment-bids` | `ds/components/tender-shipment-bids.css` |
| `cca-tender-table` | `ds/components/tender-table.css` |
| `cca-terms` | `ds/components/terms.css` |
| `cca-terms-and-conditions` | `ds/components/terms-and-conditions.css` |
| `cca-terms-dialog` | `ds/components/terms-dialog.css` |
| `cca-tile-template` | `ds/components/tile-template.css` |
| `cca-track-trace` | `ds/components/track-trace.css` |
| `cca-tracking-overview` | `ds/components/tracking-overview.css` |
| `cca-tracking-simulation` | `ds/components/tracking-simulation.css` |
| `cca-transport-request-detail` | `ds/components/transport-request-detail.css` |
| `cca-select-transport-type` | `ds/components/transport-type-dialog.css` |
| `cca-tree-view-body` | `ds/components/tree-view-body.css` |
| `cca-trip-builder` | `ds/components/trip-builder.css` |
| `cca-trip-builder-order-item-skeleton` | `ds/components/trip-builder-order-item-skeleton.css` |
| `cca-trip-builder-order-list` | `ds/components/trip-builder-order-list.css` |
| `cca-trip-create-drawer` | `ds/components/trip-create-drawer.css` |
| `cca-trip-details-drawer-stops` | `ds/components/trip-details-drawer-stops.css` |
| `cca-trip-details-overlay` | `ds/components/trip-details-overlay.css` |
| `cca-trip-documents` | `ds/components/trip-documents.css` |
| `cca-trip-edit-drawer` | `ds/components/trip-edit-drawer.css` |
| `cca-trip-info` | `ds/components/trip-info.css` |
| `cca-trip-list-row-skeleton` | `ds/components/trip-list.css` |
| `cca-trip-list-row` | `ds/components/trip-list-2.css` |
| `cca-trip-list-table` | `ds/components/trip-list-3.css` |
| `cca-trip-location-card` | `ds/components/trip-location-card.css` |
| `cca-trip-optimization-settings-side-panel` | `ds/components/trip-optimization-settings.css` |
| `cca-trip-planner` | `ds/components/trip-planner.css` |
| `cca-trip-planner-stop` | `ds/components/trip-planner-stop.css` |
| `cca-trip-planner-trip-context-menu` | `ds/components/trip-planner-trip-context-menu.css` |
| `cca-trip-pricing` | `ds/components/trip-pricing.css` |
| `cca-trip-stop-card` | `ds/components/trip-stop.css` |
| `cca-trip-stop-date-input` | `ds/components/trip-stop-date-input.css` |
| `cca-trip-stop-time-input` | `ds/components/trip-stop-time-input.css` |
| `cca-trip-stop-time-window` | `ds/components/trip-stop-time-window.css` |
| `cca-user-details` | `ds/components/user-details.css` |
| `cca-user-detail-overview` | `ds/components/user-overview.css` |
| `cca-view-terms-dialog` | `ds/components/view-terms-dialog.css` |
| `cca-weekly-shipments` | `ds/components/weekly-shipments.css` |
