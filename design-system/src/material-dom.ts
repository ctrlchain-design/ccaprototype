/**
 * Production DOM for the Angular Material controls the design system documents.
 *
 * These previews are static, so the classes Angular adds at runtime
 * (`mdc-text-field--focused`, `mdc-floating-label--float-above`,
 * `mdc-notched-outline--upgraded`) are written out explicitly per state. That is
 * deliberate: a static page that spells out each state documents the control
 * better than a live widget that only ever shows one of them, and it keeps the
 * markup honest about what Angular actually renders.
 *
 * The nesting is verified rather than assumed — every class below is exercised
 * by the verification suite against the exported Material CSS, so a structural
 * mistake shows up as a failed measurement, not a subtly wrong screenshot.
 */

import { escapeHtml } from './page-shell.js';

/** The visual state a documented control is frozen in. */
export type FieldState = 'empty' | 'filled' | 'focused' | 'error' | 'disabled';

/** Options for one documented form field. */
export interface FormFieldOptions {
  readonly label: string;
  readonly state?: FieldState;
  /** Input value. Any non-empty value floats the label. */
  readonly value?: string;
  readonly placeholder?: string;
  /** CtrlChain icon name for a leading icon. */
  readonly prefixIcon?: string;
  /** CtrlChain icon name for a trailing icon. */
  readonly suffixIcon?: string;
  readonly hint?: string;
  readonly error?: string;
  readonly required?: boolean;
  /** Renders a `textarea` instead of an `input`. */
  readonly multiline?: boolean;
}

/** Sequence used to give each field a unique id, as Angular's counter does. */
let fieldCounter = 0;

/** Resets the id counter so a rebuild produces identical output. */
export function resetFieldIds(): void {
  fieldCounter = 0;
}

/**
 * Notch widths measured in a real browser, keyed by label text.
 *
 * Angular sizes the notch at runtime from the drawn label. The build measures
 * the same thing once and seeds it here; until it does, the notch falls back to
 * `auto`, which is too wide rather than clipped.
 */
let measuredNotchWidths = new Map<string, number>();

/** Seeds the measured notch widths. See measure-labels.ts for why. */
export function setMeasuredNotchWidths(widths: Map<string, number>): void {
  measuredNotchWidths = widths;
}

/** Production DOM for `<cca-icon [icon]="name" />`, Material classes included. */
export function ccaIcon(name: string, extraClass = ''): string {
  return (
    `<cca-icon${extraClass ? ` class="${escapeHtml(extraClass)}"` : ''}>` +
    `<mat-icon class="mat-icon notranslate cca-icon cca-icon-${escapeHtml(name)} ` +
    'mat-ligature-font mat-icon-inline" aria-hidden="true"></mat-icon></cca-icon>'
  );
}

/**
 * Renders an outlined `mat-form-field`.
 *
 * The label floats whenever the field holds a value or is focused, which is
 * what drives the notch opening in the outline — so the `__notch` width and the
 * `--float-above` class always move together here, as they do at runtime.
 */
export function formField(options: FormFieldOptions): string {
  const {
    label,
    state = 'empty',
    value = '',
    placeholder,
    prefixIcon,
    suffixIcon,
    hint,
    error,
    required = false,
    multiline = false,
  } = options;

  const id = `cca-input-${++fieldCounter}`;
  const isFloating = state === 'focused' || value !== '' || Boolean(placeholder);
  const isDisabled = state === 'disabled';
  const isInvalid = state === 'error';

  const wrapperClasses = [
    'mat-mdc-text-field-wrapper',
    'mdc-text-field',
    'mdc-text-field--outlined',
    state === 'focused' ? 'mdc-text-field--focused' : '',
    isInvalid ? 'mdc-text-field--invalid' : '',
    isDisabled ? 'mdc-text-field--disabled' : '',
    isFloating ? 'mdc-text-field--label-floating' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const fieldClasses = [
    'mat-mdc-form-field',
    // `matInput` backs both input and textarea, so the type class is the same.
    'mat-mdc-form-field-type-mat-input',
    'mat-form-field-appearance-outline',
    'mat-primary',
    prefixIcon ? 'mat-mdc-form-field-has-icon-prefix' : '',
    suffixIcon ? 'mat-mdc-form-field-has-icon-suffix' : '',
    isInvalid ? 'mat-form-field-invalid' : '',
    isDisabled ? 'mat-form-field-disabled' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const labelClasses = [
    'mdc-floating-label',
    'mat-mdc-floating-label',
    isFloating ? 'mdc-floating-label--float-above' : '',
    required ? 'mdc-floating-label--required' : '',
  ]
    .filter(Boolean)
    .join(' ');

  // Angular measures the floated label at runtime and writes the notch width
  // inline. The build does the same measurement once (measure-labels.ts) so the
  // outline gap matches the label; `auto` is the fallback when it could not.
  const measuredWidth = measuredNotchWidths.get(label);
  const notchWidth = isFloating ? (measuredWidth ? `${measuredWidth}px` : 'auto') : undefined;
  const notchStyle = notchWidth
    ? ` style="width: ${notchWidth}; max-width: calc(100% - 60px)"`
    : '';

  const control = multiline
    ? `<textarea id="${id}" class="mat-mdc-input-element mat-mdc-form-field-textarea-control mdc-text-field__input" rows="3"${
        isDisabled ? ' disabled' : ''
      }${placeholder ? ` placeholder="${escapeHtml(placeholder)}"` : ''}>${escapeHtml(value)}</textarea>`
    : `<input id="${id}" type="text" class="mat-mdc-input-element mdc-text-field__input" value="${escapeHtml(value)}"${
        isDisabled ? ' disabled' : ''
      }${placeholder ? ` placeholder="${escapeHtml(placeholder)}"` : ''} />`;

  const prefix = prefixIcon
    ? `<div class="mat-mdc-form-field-icon-prefix">${ccaIcon(prefixIcon)}</div>`
    : '';
  const suffix = suffixIcon
    ? `<div class="mat-mdc-form-field-icon-suffix">${ccaIcon(suffixIcon)}</div>`
    : '';

  const subscript =
    isInvalid && error
      ? `<div class="mat-mdc-form-field-error-wrapper"><mat-error class="mat-mdc-form-field-error mat-mdc-form-field-bottom-align">${escapeHtml(error)}</mat-error></div>`
      : hint
        ? `<div class="mat-mdc-form-field-hint-wrapper"><mat-hint class="mat-mdc-form-field-hint">${escapeHtml(hint)}</mat-hint></div>`
        : '';

  return `<mat-form-field class="${fieldClasses}">
  <div class="${wrapperClasses}">
    <div class="mat-mdc-form-field-flex">
      <div class="mdc-notched-outline mdc-notched-outline--upgraded${isFloating ? ' mdc-notched-outline--notched' : ''}">
        <div class="mdc-notched-outline__leading mat-mdc-notch-piece"></div>
        <div class="mdc-notched-outline__notch mat-mdc-notch-piece"${notchStyle}>
          <label class="${labelClasses}" for="${id}">${escapeHtml(label)}</label>
        </div>
        <div class="mdc-notched-outline__trailing mat-mdc-notch-piece"></div>
      </div>
      ${prefix}<div class="mat-mdc-form-field-infix">${control}</div>${suffix}
    </div>
  </div>
  <div class="mat-mdc-form-field-subscript-wrapper mat-mdc-form-field-bottom-align">${subscript}</div>
</mat-form-field>`;
}

/**
 * Renders a `mat-progress-spinner`.
 *
 * The real component animates a clipped, rotating arc through several nested
 * elements. A static page cannot show an animation, so this draws the arc the
 * spinner sweeps — a stroked circle with a gap — using Material's own classes so
 * it still takes its size and colour from the theme. The shape is what a viewer
 * would see in any single frame.
 */
export function progressSpinner(diameter = 32): string {
  const radius = diameter / 2 - 2;
  const circumference = 2 * Math.PI * radius;

  return (
    `<mat-progress-spinner class="mat-mdc-progress-spinner mdc-circular-progress ` +
    `mdc-circular-progress--indeterminate" role="progressbar" aria-label="Loading" ` +
    `style="width:${diameter}px;height:${diameter}px;display:inline-block">` +
    `<svg viewBox="0 0 ${diameter} ${diameter}" class="mdc-circular-progress__indeterminate-circle-graphic" ` +
    `style="width:100%;height:100%">` +
    `<circle cx="${diameter / 2}" cy="${diameter / 2}" r="${radius}" fill="none" ` +
    `stroke="currentColor" stroke-width="3" stroke-linecap="round" ` +
    `stroke-dasharray="${(circumference * 0.75).toFixed(1)} ${circumference.toFixed(1)}" ` +
    `transform="rotate(-90 ${diameter / 2} ${diameter / 2})"></circle>` +
    `</svg></mat-progress-spinner>`
  );
}

/** Options for a documented search field. */
export interface SearchFieldOptions {
  readonly placeholder: string;
  readonly value?: string;
  /** Renders the clear button, which the component only shows when non-empty. */
  readonly clearable?: boolean;
  readonly loading?: boolean;
}

/**
 * Renders `cca-search-field`.
 *
 * It has no `mat-label` — the search text is a placeholder — so the notch stays
 * closed and no label ever floats. That is the visible difference from a normal
 * field, and the reason it reads as a search box rather than a form input.
 */
export function searchField(options: SearchFieldOptions): string {
  const { placeholder, value = '', clearable = false, loading = false } = options;
  const id = `cca-search-${++fieldCounter}`;

  const prefix = loading ? progressSpinner(18) : ccaIcon('search');

  const clear =
    clearable && value !== ''
      ? '<div class="mat-mdc-form-field-icon-suffix">' +
        '<button ccaButton class="cca-btn cca-btn--icon cca-btn--small" type="button" aria-label="Clear">' +
        `${ccaIcon('circle-xmark')}</button></div>`
      : '';

  return `<cca-search-field style="display:block">
  <mat-form-field class="mat-mdc-form-field mat-mdc-form-field-type-mat-input mat-form-field-appearance-outline mat-primary mat-mdc-form-field-has-icon-prefix w-full">
    <div class="mat-mdc-text-field-wrapper mdc-text-field mdc-text-field--outlined mdc-text-field--no-label">
      <div class="mat-mdc-form-field-flex">
        <div class="mdc-notched-outline">
          <div class="mdc-notched-outline__leading mat-mdc-notch-piece"></div>
          <div class="mdc-notched-outline__notch mat-mdc-notch-piece"></div>
          <div class="mdc-notched-outline__trailing mat-mdc-notch-piece"></div>
        </div>
        <div class="mat-mdc-form-field-icon-prefix">${prefix}</div>
        <div class="mat-mdc-form-field-infix">
          <input id="${id}" type="text" class="mat-mdc-input-element mdc-text-field__input"
            placeholder="${escapeHtml(placeholder)}" value="${escapeHtml(value)}" autocomplete="off" />
        </div>${clear}
      </div>
    </div>
    <div class="mat-mdc-form-field-subscript-wrapper mat-mdc-form-field-bottom-align"></div>
  </mat-form-field>
</cca-search-field>`;
}

/** Options for a documented chip. */
export interface ChipOptions {
  readonly label: string;
  readonly selected?: boolean;
  readonly disabled?: boolean;
  /** Renders the leading checkmark slot, as a selectable chip does. */
  readonly selectable?: boolean;
}

/**
 * Renders a `mat-chip-option` with the platform's `.cca-chip` class.
 *
 * `.cca-chip` is what `_chip.scss` styles — the 10px radius, the brand outline
 * and the tinted selected background all hang off it, so a bare `mat-chip`
 * looks nothing like a platform chip.
 */
export function chip(options: ChipOptions): string {
  const { label, selected = false, disabled = false, selectable = true } = options;

  const classes = [
    'mat-mdc-chip',
    'mat-mdc-standard-chip',
    'mat-mdc-chip-option',
    'mdc-evolution-chip',
    'mdc-evolution-chip--filter',
    'mdc-evolution-chip--selectable',
    'cca-chip',
    'mat-primary',
    selected ? 'mdc-evolution-chip--selected' : '',
    disabled ? 'mdc-evolution-chip--disabled' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const checkmark = selectable
    ? `<span class="mdc-evolution-chip__graphic mat-mdc-chip-graphic">
        <span class="mdc-evolution-chip__checkmark">
          <svg class="mdc-evolution-chip__checkmark-svg" viewBox="-2 -3 30 30" aria-hidden="true">
            <path class="mdc-evolution-chip__checkmark-path" fill="none" stroke="currentColor"
              d="M1.73,12.91 8.1,19.28 22.79,4.59"></path>
          </svg>
        </span>
      </span>`
    : '';

  return `<mat-chip-option class="${classes}"${disabled ? ' aria-disabled="true"' : ''}>
  <span class="mat-mdc-chip-focus-overlay"></span>
  <span class="mdc-evolution-chip__cell mdc-evolution-chip__cell--primary">
    <span class="mdc-evolution-chip__action mat-mdc-chip-action mdc-evolution-chip__action--primary" role="option" aria-selected="${selected}">
      ${checkmark}
      <span class="mdc-evolution-chip__text-label mat-mdc-chip-action-label">${escapeHtml(label)}</span>
    </span>
  </span>
</mat-chip-option>`;
}

/** One tab in a documented tab header. */
export interface TabOptions {
  readonly label: string;
  readonly active?: boolean;
  readonly disabled?: boolean;
}

/**
 * Renders a `mat-tab-group` header.
 *
 * `variant: 'cca'` adds the `.cca-tabs` class, which turns the header into the
 * bordered, brand-filled tab strip `_tabs.scss` defines. Without it you get
 * Material's default underline tabs, which the platform also uses in places.
 */
export function tabHeader(
  tabs: readonly TabOptions[],
  variant: 'material' | 'cca' = 'cca',
): string {
  const labels = tabs
    .map((tab) => {
      const classes = [
        'mat-mdc-tab',
        'mdc-tab',
        'mat-mdc-focus-indicator',
        tab.active ? 'mdc-tab--active' : '',
        tab.disabled ? 'mat-mdc-tab-disabled mdc-tab--disabled' : '',
      ]
        .filter(Boolean)
        .join(' ');

      return `<div class="${classes}" role="tab" aria-selected="${Boolean(tab.active)}"${
        tab.disabled ? ' aria-disabled="true"' : ''
      }>
        <span class="mdc-tab__ripple"></span>
        <span class="mdc-tab__content">
          <span class="mdc-tab__text-label">${escapeHtml(tab.label)}</span>
        </span>
        <span class="mdc-tab-indicator${tab.active ? ' mdc-tab-indicator--active' : ''}">
          <span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
        </span>
      </div>`;
    })
    .join('\n');

  return `<mat-tab-group class="mat-mdc-tab-group mat-primary${variant === 'cca' ? ' cca-tabs' : ''}">
  <mat-tab-header class="mat-mdc-tab-header">
    <div class="mat-mdc-tab-label-container">
      <div class="mat-mdc-tab-list" role="tablist">
        <div class="mat-mdc-tab-labels">
          ${labels}
        </div>
      </div>
    </div>
  </mat-tab-header>
</mat-tab-group>`;
}

/** A documented table: header labels plus row data. */
export interface TableOptions {
  readonly columns: readonly string[];
  readonly rows: readonly (readonly string[])[];
}

/**
 * Renders a `mat-table`. The platform styles the MDC data-table classes
 * directly (`.mdc-data-table__cell`, 0.875rem padding, top-aligned cells), so
 * the DOM has to carry both the `mat-mdc-*` and `mdc-data-table__*` names.
 */
export function table(options: TableOptions): string {
  const header = options.columns
    .map(
      (column) =>
        `<th class="mat-mdc-header-cell mdc-data-table__header-cell" role="columnheader">${escapeHtml(column)}</th>`,
    )
    .join('');

  const body = options.rows
    .map(
      (row) =>
        `<tr class="mat-mdc-row mdc-data-table__row">${row
          .map((cell) => `<td class="mat-mdc-cell mdc-data-table__cell">${escapeHtml(cell)}</td>`)
          .join('')}</tr>`,
    )
    .join('\n      ');

  return `<table class="mat-mdc-table mdc-data-table__table" style="width:100%">
  <thead>
    <tr class="mat-mdc-header-row mdc-data-table__header-row" role="row">${header}</tr>
  </thead>
  <tbody class="mdc-data-table__content">
      ${body}
  </tbody>
</table>`;
}

/** Options for a documented selection control. */
export interface SelectionOptions {
  readonly label: string;
  readonly checked?: boolean;
  readonly disabled?: boolean;
}

/** Renders a `mat-checkbox`. */
export function checkbox(options: SelectionOptions): string {
  const { label, checked = false, disabled = false } = options;
  const id = `cca-checkbox-${++fieldCounter}`;

  // The native input must come *before* the background: Material drives the
  // checked and disabled visuals through `:checked ~ .mdc-checkbox__background`
  // sibling selectors, which only match forwards.
  return `<mat-checkbox class="mat-mdc-checkbox mat-primary${checked ? ' mat-mdc-checkbox-checked' : ''}${
    disabled ? ' mat-mdc-checkbox-disabled' : ''
  }">
  <div class="mdc-form-field mat-internal-form-field">
    <div class="mdc-checkbox${checked ? ' mdc-checkbox--selected' : ''}">
      <input type="checkbox" class="mdc-checkbox__native-control" id="${id}"${checked ? ' checked' : ''}${
        disabled ? ' disabled' : ''
      } />
      <div class="mdc-checkbox__background">
        <svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24" aria-hidden="true">
          <path class="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59"></path>
        </svg>
        <div class="mdc-checkbox__mixedmark"></div>
      </div>
    </div>
    <label class="mdc-label" for="${id}">${escapeHtml(label)}</label>
  </div>
</mat-checkbox>`;
}

/** Renders a `mat-radio-button`. */
export function radio(options: SelectionOptions): string {
  const { label, checked = false, disabled = false } = options;
  const id = `cca-radio-${++fieldCounter}`;

  return `<mat-radio-button class="mat-mdc-radio-button mat-primary${
    checked ? ' mat-mdc-radio-checked' : ''
  }${disabled ? ' mat-mdc-radio-disabled' : ''}">
  <div class="mdc-form-field mat-internal-form-field">
    <div class="mdc-radio${disabled ? ' mdc-radio--disabled' : ''}">
      <input type="radio" class="mdc-radio__native-control" id="${id}"${checked ? ' checked' : ''}${
        disabled ? ' disabled' : ''
      } />
      <div class="mdc-radio__background">
        <div class="mdc-radio__outer-circle"></div>
        <div class="mdc-radio__inner-circle"></div>
      </div>
    </div>
    <label for="${id}">${escapeHtml(label)}</label>
  </div>
</mat-radio-button>`;
}

/**
 * Renders a `mat-slide-toggle` — the platform's switch.
 *
 * `.mdc-switch__icons` is not decoration: the platform sizes the handle through
 * `--mat-slide-toggle-with-icon-handle-size`, which Material only applies via
 * `.mdc-switch__handle:has(.mdc-switch__icons)`. Without it the handle falls
 * back to 20px and nearly fills the 24px track, instead of the 12px dot the app
 * shows when off. The icons themselves are hidden by `_switch.scss`.
 */
export function slideToggle(options: SelectionOptions): string {
  const { label, checked = false, disabled = false } = options;
  const id = `cca-toggle-${++fieldCounter}`;

  return `<mat-slide-toggle class="mat-mdc-slide-toggle mat-primary${
    checked ? ' mat-mdc-slide-toggle-checked' : ''
  }">
  <div class="mdc-form-field mat-internal-form-field">
    <button type="button" role="switch" aria-checked="${checked}" id="${id}" class="mdc-switch${
      checked ? ' mdc-switch--selected' : ' mdc-switch--unselected'
    }${disabled ? ' mdc-switch--disabled' : ''}"${disabled ? ' disabled' : ''}>
      <div class="mdc-switch__track"></div>
      <div class="mdc-switch__handle-track">
        <div class="mdc-switch__handle">
          <div class="mdc-switch__shadow"><div class="mdc-elevation-overlay"></div></div>
          <div class="mdc-switch__ripple"></div>
          <div class="mdc-switch__icons">
            <svg class="mdc-switch__icon mdc-switch__icon--on" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M19.69,5.23L8.96,15.96l-4.23-4.23L2.96,13.5l6,6L21.46,7L19.69,5.23z" />
            </svg>
            <svg class="mdc-switch__icon mdc-switch__icon--off" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20 13H4v-2h16v2z" />
            </svg>
          </div>
        </div>
      </div>
    </button>
    <label for="${id}">${escapeHtml(label)}</label>
  </div>
</mat-slide-toggle>`;
}
