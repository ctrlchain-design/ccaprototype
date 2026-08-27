/**
 * Reads layout metrics — control heights, radii, container padding — out of the
 * platform stylesheets so the documentation pages state the shipped numbers.
 *
 * Button sizes are read from the *compiled* component CSS rather than the SCSS
 * source, so what a page claims and what the exported stylesheet actually
 * applies cannot disagree.
 */

import postcss from 'postcss';

/** One `ccaButton` size, as the compiled stylesheet defines it. */
export interface ButtonSizeMetrics {
  readonly size: string;
  readonly height?: string;
  readonly padding?: string;
  readonly fontSize?: string;
  /** Padding when `iconOnly` is set — the square variants drop the height. */
  readonly iconOnlyPadding?: string;
}

/** Reads a custom property from a `:root` block in a stylesheet. */
export function readRootVariable(css: string, name: string): string | undefined {
  const pattern = new RegExp(`${name.replace(/[-]/g, '-')}\\s*:\\s*([^;]+);`);
  return css.match(pattern)?.[1]?.trim();
}

/** Reads one declaration from the first rule whose selector matches exactly. */
export function readDeclaration(
  css: string,
  selector: string,
  property: string,
): string | undefined {
  const root = postcss.parse(css);
  let found: string | undefined;

  root.walkRules((rule) => {
    if (found !== undefined) {
      return;
    }
    if (!rule.selectors.some((candidate) => candidate.trim() === selector)) {
      return;
    }

    rule.walkDecls(property, (decl) => {
      found = decl.value.trim();
    });
  });

  return found;
}

/**
 * Collects the height/padding/font-size of every `ccaButton` size from the
 * compiled component CSS. `default` has no modifier class — the base rule is
 * the 48px default — so it is read from the root selector.
 */
export function parseButtonSizes(
  compiledCss: string,
  rootSelector: string,
  sizes: readonly string[],
): ButtonSizeMetrics[] {
  return sizes.map((size) => {
    const selector = size === 'default' ? rootSelector : `${rootSelector}.cca-btn--${size}`;
    const iconOnlySelector =
      size === 'default'
        ? `${rootSelector}.cca-btn--icon-only`
        : `${rootSelector}.cca-btn--${size}.cca-btn--icon-only`;

    return {
      size,
      height: readDeclaration(compiledCss, selector, 'height'),
      padding: readDeclaration(compiledCss, selector, 'padding'),
      fontSize:
        readDeclaration(compiledCss, selector, 'font-size') ??
        readDeclaration(compiledCss, rootSelector, 'font-size'),
      iconOnlyPadding: readDeclaration(compiledCss, iconOnlySelector, 'padding'),
    };
  });
}

/** The radii and container padding the spacing page documents. */
export interface ShapeMetrics {
  readonly shapeSmall?: string;
  readonly shapeMedium?: string;
  readonly dialogShape?: string;
  readonly buttonRadius?: string;
  readonly formFieldInfixMinHeight?: string;
  readonly formFieldInfixPadding?: string;
  readonly paginatorInfixMinHeight?: string;
  /** `min-width` on `.dialog-container main` — the dialog's content floor. */
  readonly dialogBodyMinWidth?: string;
  /** `--mat-sidenav-scrim-color`, the drawer's scrim. */
  readonly sidenavScrim?: string;
  /** `--drawer-panel-min-width` — viewport-relative, not a fixed panel width. */
  readonly drawerPanelMinWidth?: string;
  /** `--drawer-panel-max-width`. */
  readonly drawerPanelMaxWidth?: string;
  /** `--drawer-panel-notifications-width` — the one drawer with a fixed width. */
  readonly drawerPanelNotificationsWidth?: string;
}

/** Reads the shape and control metrics from the platform style sources. */
export function parseShapeMetrics(sources: {
  uiScss: string;
  dialogScss: string;
  formFieldScss: string;
  compiledButtonCss: string;
  buttonRootSelector: string;
  /** shared/styles/components/_sidenav.scss — optional. */
  sidenavScss?: string;
  /** shared/styles/components/_drawer.scss — optional. */
  drawerScss?: string;
}): ShapeMetrics {
  const infixRule = sources.formFieldScss.match(
    /\.mat-mdc-text-field-wrapper\.mdc-text-field--outlined\s+\.mat-mdc-form-field-infix\s*\{([^}]*)\}/,
  )?.[1];
  const paginatorRule = sources.formFieldScss.match(
    /\.mat-mdc-paginator[^{]*\.mat-mdc-form-field-infix\s*\{([^}]*)\}/,
  )?.[1];

  return {
    shapeSmall: readRootVariable(sources.uiScss, '--mat-shape-small'),
    shapeMedium: readRootVariable(sources.uiScss, '--mat-shape-medium'),
    dialogShape: readRootVariable(sources.dialogScss, '--mat-dialog-container-shape'),
    buttonRadius: readDeclaration(
      sources.compiledButtonCss,
      sources.buttonRootSelector,
      'border-radius',
    ),
    formFieldInfixMinHeight: infixRule?.match(/min-height:\s*([^;]+);/)?.[1]?.trim(),
    formFieldInfixPadding: infixRule?.match(/padding:\s*([^;]+);/)?.[1]?.trim(),
    paginatorInfixMinHeight: paginatorRule?.match(/min-height:\s*([^;]+);/)?.[1]?.trim(),
    dialogBodyMinWidth: sources.dialogScss
      .match(/main\s*\{[^}]*?min-width:\s*([^;]+);/)?.[1]
      ?.trim(),
    sidenavScrim: sources.sidenavScss
      ? readRootVariable(sources.sidenavScss, '--mat-sidenav-scrim-color')
      : undefined,
    drawerPanelMinWidth: sources.drawerScss
      ? readRootVariable(sources.drawerScss, '--drawer-panel-min-width')
      : undefined,
    drawerPanelMaxWidth: sources.drawerScss
      ? readRootVariable(sources.drawerScss, '--drawer-panel-max-width')
      : undefined,
    drawerPanelNotificationsWidth: sources.drawerScss
      ? readRootVariable(sources.drawerScss, '--drawer-panel-notifications-width')
      : undefined,
  };
}

/**
 * Reads the font stack the platform sets on `body`/`html`, so the export does
 * not hard-code a family list that could drift from `tailwind.css`.
 */
export function parseBodyFontStack(tailwindCss: string): string {
  const match = tailwindCss.match(/body,\s*html\s*\{[^}]*?font-family:\s*([^;]+);/);
  return match?.[1]?.trim() ?? "Roboto, 'Helvetica Neue', sans-serif";
}

/** Converts a `rem` length to `px` for display alongside the source value. */
export function remToPx(value: string | undefined, rootFontSize = 16): string | undefined {
  if (!value) {
    return undefined;
  }

  const rem = value.trim().match(/^(-?[\d.]+)rem$/);
  if (rem) {
    return `${Number(rem[1]) * rootFontSize}px`;
  }

  return value.trim().endsWith('px') ? value.trim() : undefined;
}
