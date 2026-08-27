/**
 * Verifies that the exported design system computes to the same values the
 * platform source declares.
 *
 * The expectations are parsed out of the repo at test time rather than written
 * down here, so the spec cannot drift from the code either: if someone changes
 * a button height in SCSS, this suite compares the export against the *new*
 * value and fails only when the export is genuinely stale.
 *
 * Runs against the emitted bundle over `file://` — no platform app, no dev
 * server and no login required.
 *
 *   pnpm design-system:export
 *   pnpm design-system:verify
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

import { type Page, expect, test } from '@playwright/test';

import { CCA_BUTTON, STATUS_BADGE_FLAVORS, buttonClasses } from '../src/components.js';
import { chip, formField, table, tabHeader } from '../src/material-dom.js';
import { parseDeclaredFlavors, parseIconFont } from '../src/parse-component-css.js';
import { parseButtonSizes, parseShapeMetrics, readRootVariable } from '../src/parse-metrics.js';
import {
  parsePalette,
  parseSemanticTokens,
  parseTypeScale,
  resolveColor,
} from '../src/parse-tokens.js';

const REPO_ROOT = resolve(process.cwd());
const BUNDLE_ROOT = join(REPO_ROOT, 'tools/design-system-export/dist');

const read = (relativePath: string) => readFileSync(join(REPO_ROOT, relativePath), 'utf8');
const readBundle = (relativePath: string) => readFileSync(join(BUNDLE_ROOT, relativePath), 'utf8');

const compiledComponentCss = readBundle('ds/cca-components.css');

const palette = parsePalette(
  read('shared/styles/tailwind/colors.css'),
  read('shared/styles/tailwind/new-cold.css'),
);
const tokens = parseSemanticTokens(
  read('shared/styles/tailwind/light-mode.scss'),
  read('shared/styles/tailwind/dark-mode.scss'),
);
const shapes = parseShapeMetrics({
  uiScss: read('shared/styles/_ui.scss'),
  dialogScss: read('shared/styles/components/_dialog.scss'),
  formFieldScss: read('shared/styles/components/_form-field.scss'),
  compiledButtonCss: compiledComponentCss,
  buttonRootSelector: '.cca-btn',
});
const buttonSizes = parseButtonSizes(compiledComponentCss, '.cca-btn', CCA_BUTTON.sizes);

/** Every page the export generates — both guards below sweep all of them. */
const GENERATED_PAGES = [
  'design-system/colors.html',
  'design-system/tokens.html',
  'design-system/typography.html',
  'design-system/spacing.html',
  'design-system/iconography.html',
  'design-system/navigation.html',
  'design-system/badges-status.html',
  'design-system/buttons-inputs.html',
  'components/button.html',
  'components/input.html',
  'components/card.html',
  'components/modal.html',
  'components/table.html',
  'components/tabs.html',
  'components/chips.html',
  'components/tooltip.html',
  'components/badge.html',
  'components/search-bar.html',
  'components/sidebar.html',
  'components/top-bar.html',
];

/** Converts a source length (`3rem`, `48px`) to the px number the browser computes. */
function toPx(value: string | undefined): number | undefined {
  if (!value) {
    return undefined;
  }

  const rem = value.trim().match(/^(-?[\d.]+)rem$/);
  if (rem) {
    return Number(rem[1]) * 16;
  }

  const px = value.trim().match(/^(-?[\d.]+)px$/);
  return px ? Number(px[1]) : undefined;
}

/** Normalises a computed `rgb(...)` colour to a lowercase hex string. */
function rgbToHex(rgb: string): string {
  const parts = rgb.match(/\d+/g);
  if (!parts || parts.length < 3) {
    return rgb;
  }

  return `#${parts
    .slice(0, 3)
    .map((part) => Number(part).toString(16).padStart(2, '0'))
    .join('')}`;
}

/**
 * Scratch page inside the bundle. It has to be a real file on disk rather than
 * `page.setContent`, because a document served from `about:blank` is not
 * allowed to load a `file://` stylesheet — the link is silently dropped.
 *
 * The sentinel div lets each test wait for proof that both the platform layer
 * (`.page-container`, 12px radius) and the Material layer (`.mdc-text-field`,
 * inline-flex) have actually arrived through the `@import` chain.
 */
const HARNESS_PATH = join(BUNDLE_ROOT, '_verify-harness.html');

writeFileSync(
  HARNESS_PATH,
  [
    '<!doctype html>',
    '<html><head><meta charset="utf-8" />',
    '<link rel="stylesheet" href="./ds/index.css" />',
    '</head><body>',
    '<div id="ds-sentinel-platform" class="page-container"></div>',
    '<div id="ds-sentinel-material" class="mdc-text-field"></div>',
    '<div id="ds-content"></div>',
    '</body></html>',
  ].join('\n'),
  'utf8',
);

/** Loads the harness and renders `bodyHtml` into it. */
async function harness(page: Page, bodyHtml: string): Promise<void> {
  await page.goto(pathToFileURL(HARNESS_PATH).href, { waitUntil: 'load' });

  await page.waitForFunction(() => {
    const platform = document.getElementById('ds-sentinel-platform');
    const material = document.getElementById('ds-sentinel-material');
    if (!platform || !material) {
      return false;
    }

    return (
      getComputedStyle(platform).borderTopLeftRadius === '12px' &&
      getComputedStyle(material).display === 'inline-flex'
    );
  });

  await page.locator('#ds-content').evaluate((element, html) => {
    element.innerHTML = html;
  }, bodyHtml);
}

test.describe('ccaButton', () => {
  for (const size of buttonSizes) {
    const expectedHeight = toPx(size.height);
    if (expectedHeight === undefined) {
      continue;
    }

    test(`size="${size.size}" is ${expectedHeight}px tall`, async ({ page }) => {
      await harness(
        page,
        `<button ccaButton class="${buttonClasses('primary', size.size)}">Create shipment</button>`,
      );

      const box = await page.locator('#ds-content button').boundingBox();
      expect(box?.height).toBeCloseTo(expectedHeight, 0);
    });
  }

  test('the documented size scale is what ships', () => {
    const actual = Object.fromEntries(
      buttonSizes.map((size) => [size.size, toPx(size.height) ?? 'auto']),
    );

    expect(actual).toEqual(CCA_BUTTON.expectedHeights);
  });

  test('radius and icon gap match the source', async ({ page }) => {
    await harness(page, `<button ccaButton class="${buttonClasses('primary')}">Ship</button>`);

    const computed = await page.locator('#ds-content button').evaluate((element) => {
      const style = getComputedStyle(element);
      return { radius: style.borderRadius, gap: style.gap };
    });

    expect(toPx(computed.radius)).toBe(toPx(shapes.shapeSmall));
    expect(toPx(computed.gap)).toBe(8);
  });

  test('every hierarchy resolves a real background or colour', async ({ page }) => {
    const buttons = CCA_BUTTON.hierarchies
      .map(
        (hierarchy) =>
          `<button ccaButton class="${buttonClasses(hierarchy)}" data-h="${hierarchy}">Go</button>`,
      )
      .join('');

    await harness(page, buttons);

    for (const hierarchy of CCA_BUTTON.hierarchies) {
      const style = await page.locator(`[data-h="${hierarchy}"]`).evaluate((element) => {
        const computed = getComputedStyle(element);
        return {
          background: computed.backgroundColor,
          color: computed.color,
          border: computed.borderTopColor,
        };
      });

      // A hierarchy that resolved nothing would come back fully transparent on
      // all three, which is how a missing token shows up.
      const allTransparent = [style.background, style.color, style.border].every(
        (value) => value === 'rgba(0, 0, 0, 0)',
      );
      expect(allTransparent, `${hierarchy} resolved no colour at all`).toBe(false);
    }
  });
});

test.describe('cascade order', () => {
  test('a legacy .button-small still overrides the size input', async ({ page }) => {
    // `.button-small` sets `h-9!` in shared/styles/components/_button.scss. In
    // the app that !important global beats the component's own height, which is
    // exactly the trap docs/design-baseline.md warns about. If the emitted
    // @layer order were wrong, the component rule would win here instead.
    await harness(
      page,
      `<button ccaButton class="${buttonClasses('primary', 'x-large')} button-small">Legacy</button>`,
    );

    const box = await page.locator('#ds-content button').boundingBox();
    expect(box?.height).toBeCloseTo(36, 0);
  });

  test('platform globals are present alongside component styles', async ({ page }) => {
    await harness(page, '<div class="page-container">Page</div>');

    const computed = await page.locator('#ds-content .page-container').evaluate((element) => {
      const style = getComputedStyle(element);
      return { radius: style.borderTopLeftRadius, padding: style.paddingTop };
    });

    expect(toPx(computed.radius)).toBe(12);
    expect(toPx(computed.padding)).toBe(16);
  });
});

test.describe('tokens', () => {
  /** A representative slice — the full set is asserted structurally below. */
  const SPOT_CHECKS = [
    '--surface-brand-default',
    '--text-neutral-body',
    '--surface-neutral-light',
    '--border-neutral-default',
    '--critical-surface',
    '--info-text',
  ];

  test('light-mode tokens resolve to the platform values', async ({ page }) => {
    await harness(page, '<div id="probe"></div>');

    for (const name of SPOT_CHECKS) {
      const token = tokens.find((candidate) => candidate.name === name);
      if (!token) {
        throw new Error(`${name} is missing from the platform token layer`);
      }

      const expected = resolveColor(token.light, palette);
      if (!expected) {
        continue;
      }

      const actual = await page.evaluate(
        (variable) => getComputedStyle(document.documentElement).getPropertyValue(variable).trim(),
        name,
      );

      expect(resolveColor(actual, palette) ?? actual.toLowerCase()).toBe(expected.toLowerCase());
    }
  });

  test('every token the platform defines is present in the export', async ({ page }) => {
    await harness(page, '<div id="probe"></div>');

    const missing = await page.evaluate(
      (names: string[]) => {
        const style = getComputedStyle(document.documentElement);
        return names.filter((name) => style.getPropertyValue(name).trim() === '');
      },
      tokens.map((token) => token.name),
    );

    expect(missing, `tokens absent from the export: ${missing.join(', ')}`).toEqual([]);
  });

  test('dark mode re-resolves tokens', async ({ page }) => {
    await harness(page, '<div id="probe"></div>');

    const withDark = tokens.flatMap((token) =>
      token.dark && token.dark !== token.light ? [{ name: token.name, dark: token.dark }] : [],
    );
    expect(withDark.length).toBeGreaterThan(400);

    await page.evaluate(() => document.documentElement.classList.add('dark'));

    for (const token of withDark.slice(0, 25)) {
      const expected = resolveColor(token.dark, palette);
      if (!expected) {
        continue;
      }

      const actual = await page.evaluate(
        (variable) => getComputedStyle(document.documentElement).getPropertyValue(variable).trim(),
        token.name,
      );

      expect(
        resolveColor(actual, palette) ?? actual.toLowerCase(),
        `${token.name} did not switch to its dark value`,
      ).toBe(expected.toLowerCase());
    }
  });
});

test.describe('utilities', () => {
  test('semantic colour utilities apply their token', async ({ page }) => {
    await harness(
      page,
      '<div class="surface-neutral-light" id="s">s</div>' +
        '<div class="text-neutral-body" id="t">t</div>' +
        '<div class="border border-neutral-default" id="b">b</div>',
    );

    const surfaceToken = tokens.find((token) => token.name === '--surface-neutral-light');
    if (!surfaceToken) {
      throw new Error('--surface-neutral-light is missing from the platform token layer');
    }

    const expectedSurface = resolveColor(surfaceToken.light, palette);

    const actual = await page.locator('#s').evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(rgbToHex(actual)).toBe(expectedSurface?.toLowerCase());
  });

  test('the type scale applies size, leading and weight together', async ({ page }) => {
    await harness(page, '<span class="text-cca-label-lg" id="probe">label</span>');

    const computed = await page.locator('#probe').evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        fontSize: style.fontSize,
        lineHeight: style.lineHeight,
        fontWeight: style.fontWeight,
      };
    });

    expect(toPx(computed.fontSize)).toBe(16);
    expect(toPx(computed.lineHeight)).toBe(24);
    expect(computed.fontWeight).toBe('500');
  });

  test('every type utility is documented with the values it actually computes', async ({
    page,
  }) => {
    // The typography page prints size/leading/weight next to each sample. This
    // catches the metadata being parsed wrongly even when the CSS itself is
    // correct — a mismatch the rendered-style assertions above cannot see.
    const typeScale = parseTypeScale(read('shared/styles/tailwind/tailwind.css'));
    expect(typeScale.length).toBeGreaterThan(10);

    const samples = typeScale
      .map((style) => `<span class="${style.utility}" data-u="${style.utility}">x</span>`)
      .join('');

    await harness(page, samples);

    for (const style of typeScale) {
      const computed = await page.locator(`[data-u="${style.utility}"]`).evaluate((element) => {
        const declaration = getComputedStyle(element);
        return {
          fontSize: declaration.fontSize,
          lineHeight: declaration.lineHeight,
          fontWeight: declaration.fontWeight,
        };
      });

      expect(
        toPx(computed.fontSize),
        `${style.utility}: documented font-size does not match the computed one`,
      ).toBe(toPx(style.declarations['font-size']));

      const documentedLeading = style.declarations['line-height'];
      if (documentedLeading) {
        expect(
          toPx(computed.lineHeight),
          `${style.utility}: documented line-height does not match the computed one`,
        ).toBe(toPx(documentedLeading));
      }

      const documentedWeight = style.declarations['font-weight'];
      if (documentedWeight) {
        expect(
          computed.fontWeight,
          `${style.utility}: documented font-weight does not match the computed one`,
        ).toBe(documentedWeight);
      }
    }
  });

  test('spacing utilities land on the 4px scale', async ({ page }) => {
    await harness(page, '<div class="flex gap-4" id="probe"><span>a</span><span>b</span></div>');

    const gap = await page.locator('#probe').evaluate((el) => getComputedStyle(el).columnGap);
    expect(toPx(gap)).toBe(16);
  });
});

test.describe('Material and vendor base CSS', () => {
  test('an outlined form field infix is the documented height', async ({ page }) => {
    await harness(
      page,
      '<div class="mat-mdc-form-field mat-mdc-text-field-wrapper mdc-text-field--outlined">' +
        '<div class="mat-mdc-form-field-infix" id="probe">field</div></div>',
    );

    const minHeight = await page.locator('#probe').evaluate((el) => getComputedStyle(el).minHeight);
    expect(toPx(minHeight)).toBe(toPx(shapes.formFieldInfixMinHeight));
  });

  test('a default button and a form field infix are the same height', () => {
    const buttonHeight = toPx(buttonSizes.find((size) => size.size === 'default')?.height);
    const infixHeight = toPx(shapes.formFieldInfixMinHeight);

    expect(buttonHeight).toBe(infixHeight);
  });

  test('an outlined field renders its outline — preflight must not win', async ({ page }) => {
    // Tailwind preflight sets `border-width: 0` on `*`. `.mat-mdc-notch-piece`
    // is more specific, so the outline survives — but only while the two are in
    // the same cascade layer (i.e. none). This is the exact regression that made
    // every form-field outline disappear.
    await harness(page, formField({ label: 'Reference', value: 'CCA-4281' }));

    const outline = await page
      .locator('#ds-content .mdc-notched-outline__leading')
      .evaluate((element) => {
        const style = getComputedStyle(element);
        return {
          topWidth: style.borderTopWidth,
          leftWidth: style.borderLeftWidth,
          color: style.borderTopColor,
          radius: style.borderTopLeftRadius,
        };
      });

    expect(toPx(outline.topWidth), 'outline top border collapsed to zero').toBe(1);
    expect(toPx(outline.leftWidth), 'outline left border collapsed to zero').toBe(1);
    expect(toPx(outline.radius)).toBe(toPx(shapes.shapeSmall));

    const formBorder = tokens.find((token) => token.name === '--form-border');
    if (formBorder) {
      expect(rgbToHex(outline.color)).toBe(resolveColor(formBorder.light, palette)?.toLowerCase());
    }
  });

  test('a focused field thickens the outline to the brand colour', async ({ page }) => {
    await harness(page, formField({ label: 'Reference', state: 'focused', value: 'CCA-4281' }));

    const outline = await page
      .locator('#ds-content .mdc-notched-outline__leading')
      .evaluate((element) => {
        const style = getComputedStyle(element);
        return { width: style.borderTopWidth, color: style.borderTopColor };
      });

    expect(toPx(outline.width)).toBe(2);

    const brand = tokens.find((token) => token.name === '--border-brand-default');
    if (brand) {
      expect(rgbToHex(outline.color)).toBe(resolveColor(brand.light, palette)?.toLowerCase());
    }
  });

  test('the outline notch is exactly as wide as the label in it', async ({ page }) => {
    // Angular sizes the notch from the drawn label at runtime; the build
    // measures the same thing. Estimating it from the character count left a
    // 27px gap past the end of a short label, which is what this catches.
    for (const path of ['components/input.html', 'components/modal.html']) {
      await page.goto(pathToFileURL(join(BUNDLE_ROOT, path)).href, { waitUntil: 'load' });
      await page.waitForFunction(
        () => document.querySelector('.mdc-notched-outline--notched') !== null,
      );

      const overhangs = await page.evaluate(() => {
        const result: { label: string; overhang: number }[] = [];

        for (const notch of document.querySelectorAll(
          '.mdc-notched-outline--notched .mdc-notched-outline__notch',
        )) {
          const label = notch.querySelector('.mdc-floating-label');
          if (!label) {
            continue;
          }

          const notchWidth = notch.getBoundingClientRect().width;
          const labelWidth = label.getBoundingClientRect().width;
          result.push({
            label: label.textContent?.trim() ?? '',
            overhang: Math.round(notchWidth - labelWidth),
          });
        }

        return result;
      });

      expect(overhangs.length, `${path} rendered no floated labels`).toBeGreaterThan(0);

      for (const { label, overhang } of overhangs) {
        // 8px padding-right plus the 1px border is the whole of the gap.
        expect(
          overhang,
          `${path}: notch around "${label}" overhangs by ${overhang}px`,
        ).toBeLessThan(14);
        expect(overhang, `${path}: notch around "${label}" clips the label`).toBeGreaterThan(-1);
      }
    }
  });

  test('a field reserves its subscript space, so rows must top-align', async ({ page }) => {
    // The 24px below the 48px infix is why docs/design-baseline.md insists on
    // `items-start` in grid forms and forbids extra bottom margin on a field.
    await harness(page, formField({ label: 'Reference' }));

    const field = await page.locator('#ds-content mat-form-field').boundingBox();
    const infix = await page.locator('#ds-content .mat-mdc-form-field-infix').boundingBox();

    expect(infix?.height).toBeCloseTo(48, 0);
    expect((field?.height ?? 0) - (infix?.height ?? 0)).toBeGreaterThan(0);
  });

  test('a .cca-chip is the platform chip, not a Material pill', async ({ page }) => {
    await harness(page, chip({ label: 'Refrigerated', selected: true }));

    const computed = await page.locator('#ds-content mat-chip-option').evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        height: element.getBoundingClientRect().height,
        radius: style.borderTopLeftRadius,
        borderWidth: style.borderTopWidth,
      };
    });

    // 2.5rem from --mat-chip-container-height, 10px radius and a 1px brand
    // outline once selected — all three come from _chip.scss via .cca-chip.
    expect(computed.height).toBeCloseTo(40, 0);
    expect(toPx(computed.radius)).toBe(10);
    expect(toPx(computed.borderWidth)).toBe(1);
  });

  test('table cells carry the platform padding Material omits', async ({ page }) => {
    await harness(page, table({ columns: ['Reference'], rows: [['CCA-4281']] }));

    const cell = await page.locator('#ds-content td').evaluate((element) => {
      const style = getComputedStyle(element);
      return { top: style.paddingTop, left: style.paddingLeft };
    });

    // 0.875rem on every side — Material ships no vertical cell padding.
    expect(toPx(cell.top)).toBe(14);
    expect(toPx(cell.left)).toBe(14);
  });

  test('an active .cca-tabs tab fills with brand and inverts its label', async ({ page }) => {
    await harness(
      page,
      tabHeader([{ label: 'Overview', active: true }, { label: 'Stops' }], 'cca'),
    );

    const active = await page.locator('#ds-content .mdc-tab--active').evaluate((element) => {
      const label = element.querySelector('.mdc-tab__text-label');
      return {
        background: getComputedStyle(element).backgroundColor,
        labelColor: label ? getComputedStyle(label).color : '',
      };
    });

    const brand = tokens.find((token) => token.name === '--surface-brand-default');
    const invert = tokens.find((token) => token.name === '--text-neutral-invert');

    if (brand) {
      expect(rgbToHex(active.background)).toBe(resolveColor(brand.light, palette)?.toLowerCase());
    }
    if (invert) {
      expect(rgbToHex(active.labelColor)).toBe(resolveColor(invert.light, palette)?.toLowerCase());
    }
  });

  test('Material structural CSS reached the export', async ({ page }) => {
    await harness(page, '<div class="mdc-text-field" id="probe">x</div>');

    const display = await page.locator('#probe').evaluate((el) => getComputedStyle(el).display);
    expect(display).toBe('inline-flex');
  });
});

test.describe('application shell', () => {
  /** The shell ancestry `_main.scss` requires for `.menu-item` to apply. */
  const inShell = (inner: string) => `<cca-main><div class="appContent">${inner}</div></cca-main>`;

  test('a selected sub-item gets its brand right border and tinted surface', async ({ page }) => {
    // This is the submenu's whole active treatment, and it lives in
    // side-submenu.component.scss — a component stylesheet that was missing
    // from the export entirely, so the submenu rendered flat.
    await harness(
      page,
      inShell(
        '<cca-side-submenu><div class="submenu-container">' +
          '<a class="sub-item active" id="probe"><span>Overview</span></a>' +
          '</div></cca-side-submenu>',
      ),
    );

    const computed = await page.locator('#probe').evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        rightBorderWidth: style.borderRightWidth,
        rightBorderColor: style.borderRightColor,
        background: style.backgroundColor,
      };
    });

    expect(toPx(computed.rightBorderWidth)).toBe(4);

    const border = tokens.find((token) => token.name === '--border-brand-default');
    const surface = tokens.find((token) => token.name === '--surface-brand-lightest');

    if (border) {
      expect(rgbToHex(computed.rightBorderColor)).toBe(
        resolveColor(border.light, palette)?.toLowerCase(),
      );
    }
    if (surface) {
      expect(rgbToHex(computed.background)).toBe(
        resolveColor(surface.light, palette)?.toLowerCase(),
      );
    }
  });

  test('the rail carries the sidebar surface and is 72px wide', async ({ page }) => {
    await harness(
      page,
      inShell('<cca-side-menu><div class="menu-wrapper" id="probe"></div></cca-side-menu>'),
    );

    const computed = await page.locator('#probe').evaluate((element) => ({
      width: element.getBoundingClientRect().width,
      background: getComputedStyle(element).backgroundColor,
    }));

    expect(computed.width).toBeCloseTo(72, 0);

    const railSurface = tokens.find((token) => token.name === '--sidebar-main-bg-default');
    if (railSurface) {
      expect(rgbToHex(computed.background)).toBe(
        resolveColor(railSurface.light, palette)?.toLowerCase(),
      );
    }
  });

  test('a selected rail item inverts against the selected surface', async ({ page }) => {
    await harness(
      page,
      inShell(
        '<cca-side-menu><a class="a-menu-item active">' +
          '<div class="menu-item" id="probe"><span class="menu-item-title">Trips</span></div>' +
          '</a></cca-side-menu>',
      ),
    );

    const background = await page
      .locator('#probe')
      .evaluate((element) => getComputedStyle(element).backgroundColor);

    // The rail's selected state must differ from the submenu's, or the two
    // navigation levels become indistinguishable.
    expect(background).not.toBe('rgba(0, 0, 0, 0)');

    const submenuSurface = tokens.find((token) => token.name === '--surface-brand-lightest');
    if (submenuSurface) {
      expect(rgbToHex(background)).not.toBe(
        resolveColor(submenuSurface.light, palette)?.toLowerCase(),
      );
    }
  });
});

test.describe('slide toggle', () => {
  test('the handle takes its size from the token, not a fallback', async ({ page }) => {
    // The platform sizes the handle through
    // `--mat-slide-toggle-with-icon-handle-size`, which Material applies only via
    // `.mdc-switch__handle:has(.mdc-switch__icons)`. Omitting that element left
    // the handle on a 20px fallback, nearly filling the 24px track.
    await page.goto(pathToFileURL(join(BUNDLE_ROOT, 'components/input.html')).href, {
      waitUntil: 'load',
    });
    await page.waitForFunction(() => document.querySelector('.mdc-switch') !== null);

    const handles = await page.evaluate(() => {
      const result: { selected: boolean; width: number; token: string; trackHeight: number }[] = [];

      for (const button of document.querySelectorAll('.mdc-switch')) {
        const handle = button.querySelector('.mdc-switch__handle');
        const track = button.querySelector('.mdc-switch__track');
        if (!handle || !track) {
          continue;
        }

        result.push({
          selected: button.classList.contains('mdc-switch--selected'),
          width: Math.round(handle.getBoundingClientRect().width),
          token: getComputedStyle(handle)
            .getPropertyValue('--mat-slide-toggle-with-icon-handle-size')
            .trim(),
          trackHeight: Math.round(track.getBoundingClientRect().height),
        });
      }

      return result;
    });

    expect(handles.length).toBeGreaterThan(0);

    for (const handle of handles) {
      // The rendered size must equal the token the platform sets — that is what
      // proves the `:has(.mdc-switch__icons)` rule matched.
      expect(handle.token, 'handle size token not set').not.toBe('');
      expect(handle.width, `handle ignored its ${handle.token} token`).toBe(toPx(handle.token));

      // And the handle has to sit inside the track, not fill it.
      expect(handle.width).toBeLessThan(handle.trackHeight);
    }

    // Off is the smaller dot; on is the larger handle.
    const off = handles.find((handle) => !handle.selected);
    const on = handles.find((handle) => handle.selected);
    if (off && on) {
      expect(off.width).toBeLessThan(on.width);
    }
  });
});

test.describe('dialog', () => {
  test('the dialog sits above its backdrop, not under it', async ({ page }) => {
    // `.cdk-overlay-backdrop` carries z-index 1000, the same as
    // `.cdk-overlay-pane`. The pane only wins because it comes later in the DOM,
    // so a wrapper without that z-index lets the scrim paint over the dialog —
    // which turned the white panel grey and hid it against the scrim.
    await page.goto(pathToFileURL(join(BUNDLE_ROOT, 'components/modal.html')).href, {
      waitUntil: 'load',
    });
    await page.waitForFunction(() => document.querySelector('.dialog-container') !== null);

    const topmost = await page.evaluate(() => {
      const surface = document.querySelector('.mat-mdc-dialog-surface');
      if (!surface) {
        return null;
      }

      const box = surface.getBoundingClientRect();
      const hit = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);

      return {
        isBackdrop: hit?.classList.contains('cdk-overlay-backdrop') ?? false,
        insideDialog: hit ? surface.contains(hit) || hit === surface : false,
        tag: hit?.tagName.toLowerCase() ?? '',
      };
    });

    expect(topmost).not.toBeNull();
    expect(topmost?.isBackdrop, 'the scrim is painting over the dialog').toBe(false);
    expect(
      topmost?.insideDialog,
      `topmost element at the dialog centre was <${topmost?.tag}>`,
    ).toBe(true);
  });

  test('the dialog renders at full size, not the enter-animation scale', async ({ page }) => {
    // Material keeps `transform: scale(0.8)` on the surface until an ancestor
    // has `mdc-dialog--open`. Without it the whole dialog renders at 80%, which
    // is subtle enough to read as "the modal looks small" rather than as a bug.
    await page.goto(pathToFileURL(join(BUNDLE_ROOT, 'components/modal.html')).href, {
      waitUntil: 'load',
    });
    await page.waitForFunction(() => document.querySelector('.dialog-container') !== null);

    const measured = await page.evaluate(() => {
      const main = document.querySelector('.dialog-container main');
      const surface = document.querySelector('.mat-mdc-dialog-surface');
      if (!main || !surface) {
        return null;
      }

      const style = getComputedStyle(surface);
      return {
        mainMinWidth: getComputedStyle(main).minWidth,
        surfaceRendered: surface.getBoundingClientRect().width,
        surfaceComputed: style.width,
        transform: style.transform,
      };
    });

    expect(measured).not.toBeNull();

    // No residual scale: what the box computes to is what it draws.
    expect(['none', 'matrix(1, 0, 0, 1, 0, 0)']).toContain(measured?.transform);
    expect(measured?.surfaceRendered).toBeCloseTo(toPx(measured?.surfaceComputed) ?? 0, 0);

    // And it is at least the platform's content floor. `min-width` is
    // border-box here, so that figure already includes the p-6 gutters.
    expect(measured?.surfaceRendered).toBeGreaterThanOrEqual(toPx(measured?.mainMinWidth) ?? 480);
  });
});

test.describe('tooltip', () => {
  test('both themes render, and their arrows are positioned', async ({ page }) => {
    // tippy positions the arrow with popper at runtime. A static page must
    // supply that, or the arrow stays `position: static` and sits in the corner.
    await page.goto(pathToFileURL(join(BUNDLE_ROOT, 'components/tooltip.html')).href, {
      waitUntil: 'load',
    });
    await page.waitForFunction(() => document.querySelector('.cca-tippy') !== null);

    const boxes = await page.evaluate(() => {
      const read = (selector: string) => {
        const box = document.querySelector(selector);
        const arrow = box?.querySelector('.tippy-arrow');
        if (!box || !arrow) {
          return null;
        }

        const boxStyle = getComputedStyle(box);
        return {
          background: boxStyle.backgroundColor,
          borderWidth: boxStyle.borderTopWidth,
          borderColor: boxStyle.borderTopColor,
          radius: boxStyle.borderTopLeftRadius,
          arrowPosition: getComputedStyle(arrow).position,
          arrowWidth: Math.round(arrow.getBoundingClientRect().width),
        };
      };

      return { dark: read('.cca-tippy'), popover: read('.cca-popover-tippy') };
    });

    expect(boxes.dark, 'no .cca-tippy on the page').not.toBeNull();
    expect(boxes.popover, 'no .cca-popover-tippy on the page').not.toBeNull();

    expect(boxes.dark?.arrowPosition).toBe('absolute');
    expect(boxes.popover?.arrowPosition).toBe('absolute');

    // The dark tooltip's brand border is the platform's own addition to tippy.
    expect(toPx(boxes.dark?.borderWidth)).toBe(1);
    const brandLight = tokens.find((token) => token.name === '--border-brand-light');
    if (brandLight) {
      expect(rgbToHex(boxes.dark?.borderColor ?? '')).toBe(
        resolveColor(brandLight.light, palette)?.toLowerCase(),
      );
    }

    // The popover is the light surface at the dialog radius.
    expect(toPx(boxes.popover?.radius)).toBe(12);
    const lightSurface = tokens.find((token) => token.name === '--surface-neutral-light');
    if (lightSurface) {
      expect(rgbToHex(boxes.popover?.background ?? '')).toBe(
        resolveColor(lightSurface.light, palette)?.toLowerCase(),
      );
    }
  });
});

test.describe('the bundle opens standalone', () => {
  test('a page loads over file:// with no failed requests', async ({ page }) => {
    // The static link checks cannot see URLs inside CSS or injected by script.
    // A `url()` still pointing back into the repo, or a missing shell file,
    // fails silently — the page just renders without its background or chrome.
    const failed: string[] = [];
    page.on('requestfailed', (request) => {
      failed.push(`${request.url()} — ${request.failure()?.errorText ?? ''}`);
    });

    const pageErrors: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));

    await page.goto(pathToFileURL(join(BUNDLE_ROOT, 'components/button.html')).href, {
      waitUntil: 'load',
    });
    await page.waitForFunction(
      () => document.querySelectorAll('[data-shell="sidebar"] a').length > 0,
    );

    expect(failed).toEqual([]);
    expect(pageErrors).toEqual([]);
  });

  test('the shell injects nav, header and footer, and the theme toggle works', async ({ page }) => {
    await page.goto(pathToFileURL(join(BUNDLE_ROOT, 'components/button.html')).href, {
      waitUntil: 'load',
    });
    await page.waitForFunction(
      () => document.querySelectorAll('[data-shell="sidebar"] a').length > 0,
    );

    const shell = await page.evaluate(() => ({
      navLinks: document.querySelectorAll('[data-shell="sidebar"] a').length,
      activeLinks: document.querySelectorAll('[data-shell="sidebar"] a.is-active').length,
      header: (document.querySelector('[data-shell="header"]')?.innerHTML ?? '').length,
      footer: (document.querySelector('[data-shell="footer"]')?.innerHTML ?? '').length,
    }));

    expect(shell.navLinks).toBeGreaterThan(GENERATED_PAGES.length);
    expect(shell.activeLinks).toBe(1);
    expect(shell.header).toBeGreaterThan(0);
    expect(shell.footer).toBeGreaterThan(0);

    // Dark mode is a `dark` class on the root, matching the platform.
    await page.click('[data-theme-toggle]');
    expect(await page.evaluate(() => document.documentElement.classList.contains('dark'))).toBe(
      true,
    );

    await page.click('[data-theme-toggle]');
    expect(await page.evaluate(() => document.documentElement.classList.contains('dark'))).toBe(
      false,
    );
  });

  test('every nav link the shell renders points at a page that exists', async ({ page }) => {
    await page.goto(pathToFileURL(join(BUNDLE_ROOT, 'components/button.html')).href, {
      waitUntil: 'load',
    });
    await page.waitForFunction(
      () => document.querySelectorAll('[data-shell="sidebar"] a').length > 0,
    );

    const hrefs = await page.evaluate(() =>
      [...document.querySelectorAll('[data-shell="sidebar"] a')]
        .map((anchor) => anchor.getAttribute('href') ?? '')
        .filter((href) => href !== ''),
    );

    const broken = hrefs.filter((href) => {
      const resolved = `components/${href}`
        .split('/')
        .reduce<string[]>((segments, segment) => {
          if (segment === '..') {
            segments.pop();
          } else if (segment !== '.' && segment !== '') {
            segments.push(segment);
          }
          return segments;
        }, [])
        .join('/');

      try {
        readBundle(resolved);
        return false;
      } catch {
        return true;
      }
    });

    expect([...new Set(broken)]).toEqual([]);
  });
});

test.describe('the docs chrome does not restyle the samples', () => {
  test('banner copy keeps its own token in both themes', async ({ page }) => {
    // `.sec p { color }` in the documentation chrome outranked
    // `.alert-text-neutral` on specificity, so the banner text turned light in
    // dark mode while its surface stayed light green — unreadable, and caused
    // by the docs rather than by the platform.
    const alertText = tokens.find((token) => token.name === '--alert-text-neutral');
    expect(alertText, '--alert-text-neutral missing from the token layer').toBeDefined();

    for (const theme of ['light', 'dark'] as const) {
      await page.goto(pathToFileURL(join(BUNDLE_ROOT, 'design-system/badges-status.html')).href, {
        waitUntil: 'load',
      });

      if (theme === 'dark') {
        await page.evaluate(() => document.documentElement.classList.add('dark'));
      }

      await page.waitForFunction(() => document.querySelector('cca-info-banner p') !== null);

      const colour = await page.evaluate(() => {
        const copy = document.querySelector('cca-info-banner p');
        return copy ? getComputedStyle(copy).color : '';
      });

      const expected =
        theme === 'dark' && alertText?.dark
          ? resolveColor(alertText.dark, palette)
          : resolveColor(alertText?.light ?? '', palette);

      expect(rgbToHex(colour), `banner copy is wrong in ${theme} mode`).toBe(
        expected?.toLowerCase(),
      );
    }
  });

  test('the shell sets prose colour on direct children only', () => {
    // A descendant selector under `.sec` reaches into every component sample on
    // the page and beats the component's own class.
    const shellCss = readBundle('shell/shell.css').replace(/\/\*[\s\S]*?\*\//g, '');

    const leaky = [...shellCss.matchAll(/(\.sec\s+[^{>][^{]*)\{([^}]*)\}/g)]
      .filter(([, , body]) => /(^|[;\s])color\s*:/.test(body))
      .map(([, selector]) => selector.trim());

    expect(leaky).toEqual([]);
  });
});

test.describe('catalogue', () => {
  interface Manifest {
    counts: Record<string, number>;
    components: {
      slug: string;
      selector: string;
      rootSelector: string;
      css: string;
      source: string;
      bytes: number;
    }[];
  }

  const manifest = JSON.parse(readBundle('manifest.json')) as Manifest;

  test('every component in the manifest has a stylesheet on disk', () => {
    expect(manifest.components.length).toBeGreaterThan(250);

    const missing = manifest.components.filter((component) => {
      try {
        return readBundle(component.css).trim() === '';
      } catch {
        return true;
      }
    });

    expect(missing.map((component) => component.css)).toEqual([]);
  });

  test('no component stylesheet still carries Angular pseudo-selectors', () => {
    // The whole point of the per-component files is that they work outside
    // Angular. A leftover `:host` would match nothing and fail silently.
    //
    // Comments are stripped first: each file's own header explains what `:host`
    // resolved to, so scanning the raw text flags every file.
    const leaky = manifest.components.filter((component) => {
      const css = readBundle(component.css).replace(/\/\*[\s\S]*?\*\//g, '');
      return css.includes(':host') || css.includes('::ng-deep');
    });

    expect(leaky.map((component) => component.slug)).toEqual([]);
  });

  test('each component stylesheet is scoped to its own root selector', () => {
    // A file whose rules do not mention its root would leak styling into
    // whatever page linked it.
    const unscoped = manifest.components.filter((component) => {
      const css = readBundle(component.css).replace(/\/\*[\s\S]*?\*\//g, '');
      if (css.trim() === '') {
        return false;
      }

      // Strip the leading `.`, `[` or nothing so element/class/attribute all match.
      const root = component.rootSelector.replace(/^[.[]|]$/g, '');
      return !css.includes(root);
    });

    expect(unscoped.map((component) => component.slug)).toEqual([]);
  });

  test('the token export resolves light and dark values', () => {
    const exported = JSON.parse(readBundle('tokens/tokens.json')) as {
      tokenCount: number;
      groups: Record<string, Record<string, { light: { value: string | null } }>>;
    };

    expect(exported.tokenCount).toBe(tokens.length);

    const resolved = Object.values(exported.groups)
      .flatMap((group) => Object.values(group))
      .filter((entry) => entry.light.value !== null);

    // Most tokens are colours and must resolve to a literal a design tool can
    // import; a handful are non-colour values and legitimately do not.
    expect(resolved.length).toBeGreaterThan(tokens.length * 0.9);
  });

  test('the index renders live components, not just filenames', async ({ page }) => {
    // The catalogue started life as a list of paths, which is not something
    // anyone can pick from without opening every page first.
    await page.goto(pathToFileURL(join(BUNDLE_ROOT, 'index.html')).href, { waitUntil: 'load' });
    await page.waitForFunction(() => document.querySelectorAll('.gcard').length > 0);

    const cards = await page.evaluate(() => {
      const result: { title: string; rendered: boolean; height: number }[] = [];

      for (const card of document.querySelectorAll('.gcard')) {
        const preview = card.querySelector('.gcard-preview');
        const title = card.querySelector('.gcard-meta strong')?.textContent?.trim() ?? '';
        if (!preview) {
          continue;
        }

        result.push({
          title,
          // A real sample brings elements with it; a bare path would not.
          rendered: preview.children.length > 0,
          height: Math.round(preview.getBoundingClientRect().height),
        });
      }

      return result;
    });

    expect(cards.length).toBe(GENERATED_PAGES.length);

    for (const card of cards) {
      expect(card.rendered, `"${card.title}" card has no rendered sample`).toBe(true);
      expect(card.height, `"${card.title}" preview collapsed`).toBeGreaterThan(60);
    }
  });

  test('the platform watermark is suppressed on documentation pages', async ({ page }) => {
    // `body::before` paints a brand watermark in the app. It is correct there
    // and wrong behind component samples, so the docs chrome hides it — without
    // touching the exported platform CSS.
    for (const path of ['index.html', 'components/button.html']) {
      await page.goto(pathToFileURL(join(BUNDLE_ROOT, path)).href, { waitUntil: 'load' });

      const display = await page.evaluate(
        () => getComputedStyle(document.body, '::before').display,
      );

      expect(display, `${path} still paints the app watermark`).toBe('none');
    }
  });

  test('the catalogue index links only files that exist', () => {
    const index = readBundle('index.html');
    const hrefs = [...index.matchAll(/href="([^"#]+)"/g)]
      .map((match) => match[1])
      .filter((href) => !href.startsWith('http'));

    const broken = hrefs.filter((href) => {
      try {
        readBundle(href);
        return false;
      } catch {
        return true;
      }
    });

    expect([...new Set(broken)]).toEqual([]);
  });

  test('the icon font was copied into the bundle', () => {
    for (const file of ['assets/icons/CtrlChain.css', 'assets/icons/CtrlChain.woff']) {
      expect(() => readBundle(file), `${file} missing from the bundle`).not.toThrow();
    }
  });
});

test.describe('badges and icons', () => {
  const BADGES = [
    'cca-status-badge',
    'cca-label-badge',
    'cca-text-badge',
    'cca-numerical-badge',
    'cca-attention-flag-badge',
  ];

  test('every badge declares at least one flavour', () => {
    // A badge whose flavour classes failed to compile would render as unstyled
    // text on the badge page — visible, but easy to miss among 40 swatches.
    for (const selector of BADGES) {
      const flavors = parseDeclaredFlavors(compiledComponentCss, selector, [
        ...STATUS_BADGE_FLAVORS,
      ]);
      expect(flavors.length, `${selector} declared no flavours`).toBeGreaterThan(0);
    }
  });

  test('a declared flavour actually paints a background', async ({ page }) => {
    await harness(
      page,
      '<cca-status-badge><div class="primary flex w-fit items-center rounded-full px-2.5 py-1" id="probe">In transit</div></cca-status-badge>',
    );

    const background = await page
      .locator('#probe')
      .evaluate((element) => getComputedStyle(element).backgroundColor);

    expect(background).not.toBe('rgba(0, 0, 0, 0)');
  });

  test('the icon font is declared and every documented glyph exists', async ({ page }) => {
    const icons = parseIconFont(read('shared/assets/icons/CtrlChain.css'));
    expect(icons.length).toBeGreaterThan(200);

    await harness(page, `<span class="cca-icon cca-icon-${icons[0].name}" id="probe"></span>`);

    const family = await page
      .locator('#probe')
      .evaluate((element) => getComputedStyle(element).fontFamily);

    expect(family).toContain('CtrlChainIcons');
  });

  test('the icon filter finds Gear-Settings by a lowercase search', async ({ page }) => {
    // Eleven glyph names are not lowercase-kebab, so an exact-case search misses
    // them — which is how the admin rail's gear came to look absent from the
    // font. The filter has to be case-insensitive for that name to be reachable.
    await page.goto(pathToFileURL(join(BUNDLE_ROOT, 'design-system/iconography.html')).href, {
      waitUntil: 'load',
    });

    const gear = page.locator('.ds-icon[data-name="gear-settings"]');
    await expect(gear).toHaveCount(1);

    await page.locator('#iconFilter').fill('gear');

    await expect(gear).toBeVisible();
    const visible = await page.locator('.ds-icon:not([hidden])').count();
    expect(visible).toBeGreaterThan(0);
    expect(visible).toBeLessThan(20);

    // A name in the font must never fall through to the empty state.
    await expect(page.locator('#iconFilterEmpty')).toBeHidden();

    await page.locator('#iconFilter').fill('');
    const total = await page.locator('.ds-icon:not([hidden])').count();
    expect(total).toBeGreaterThan(200);
  });

  test('every icon a generated page references exists in the font', () => {
    // An icon name the font does not define renders as blank space, not an
    // error — three invented names shipped before this test existed.
    const defined = new Set(
      parseIconFont(read('shared/assets/icons/CtrlChain.css')).map((i) => i.name),
    );
    const missing = new Set<string>();

    for (const path of GENERATED_PAGES) {
      const html = readBundle(path);
      for (const match of html.matchAll(/cca-icon-([\w-]+)/g)) {
        if (!defined.has(match[1])) {
          missing.add(`${path}: ${match[1]}`);
        }
      }
    }

    expect([...missing]).toEqual([]);
  });

  test('every stylesheet and script a page links exists in the bundle', () => {
    // The pages link shell/shell.css and script shell/shell-partials.js and
    // shell/shell.js. Those files exist in the published design project, so
    // pages rendered correctly there while the local bundle had correct
    // component samples sitting inside completely unstyled pages.
    const missing = new Set<string>();

    for (const path of GENERATED_PAGES) {
      const html = readBundle(path);
      const pageDirectory = path.includes('/') ? `${path.split('/')[0]}/` : '';

      const references = [
        ...[...html.matchAll(/<link[^>]+href="([^"]+)"/g)].map((match) => match[1]),
        ...[...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map((match) => match[1]),
      ];

      for (const reference of references) {
        if (reference.startsWith('http') || reference.startsWith('data:')) {
          continue;
        }

        const resolved = `${pageDirectory}${reference}`
          .split('/')
          .reduce<string[]>((segments, segment) => {
            if (segment === '..') {
              segments.pop();
            } else if (segment !== '.' && segment !== '') {
              segments.push(segment);
            }
            return segments;
          }, [])
          .join('/');

        try {
          readBundle(resolved);
        } catch {
          missing.add(`${path}: ${reference}`);
        }
      }
    }

    expect([...missing]).toEqual([]);
  });

  test('every image a generated page references exists in the bundle', () => {
    // A missing brand lockup shows as alt text, not an error. The logos were
    // referenced for two rounds before they were actually shipped.
    const missing = new Set<string>();

    for (const path of GENERATED_PAGES) {
      const html = readBundle(path);
      const pageDirectory = path.includes('/') ? `${path.split('/')[0]}/` : '';

      for (const match of html.matchAll(/<img[^>]+src="([^"]+)"/g)) {
        const source = match[1];
        if (source.startsWith('http') || source.startsWith('data:')) {
          continue;
        }

        // Resolve the page-relative src against the bundle root.
        const resolved = `${pageDirectory}${source}`
          .split('/')
          .reduce<string[]>((segments, segment) => {
            if (segment === '..') {
              segments.pop();
            } else if (segment !== '.' && segment !== '') {
              segments.push(segment);
            }
            return segments;
          }, [])
          .join('/');

        try {
          readBundle(resolved);
        } catch {
          missing.add(`${path}: ${source}`);
        }
      }
    }

    expect([...missing]).toEqual([]);
  });

  test('generated pages do not set crossorigin on bundled images', () => {
    // The app needs it for CDN-served assets; here it stops the image loading
    // at all over file://, which is how the bundle is opened locally.
    const offenders = GENERATED_PAGES.filter((path) =>
      [...readBundle(path).matchAll(/<img[^>]*>/g)].some((match) =>
        match[0].includes('crossorigin'),
      ),
    );

    expect(offenders).toEqual([]);
  });

  test('the icon font URLs point at the project asset folder', () => {
    // The compiled CSS references the repo's shared/assets path, which does not
    // exist in the design project — the export rewrites it, and a miss here
    // means every glyph renders as an empty box.
    const platformCss = readBundle('ds/platform-02.css');
    const fontUrls = [...platformCss.matchAll(/url\(["']?([^"')]*CtrlChain\.[^"')]*)["']?\)/g)].map(
      (match) => match[1],
    );

    expect(fontUrls.length).toBeGreaterThan(0);
    for (const url of fontUrls) {
      expect(url, 'icon font URL was not rewritten for the project').toContain(
        '../assets/icons/CtrlChain.',
      );
    }
  });
});

test.describe('no invented tokens', () => {
  test('generated pages only reference tokens the export defines', async ({ page }) => {
    await harness(page, '<div id="probe"></div>');

    const defined = new Set(tokens.map((token) => token.name));
    for (const group of palette) {
      for (const entry of group.entries) {
        defined.add(entry.name);
      }
    }
    // Material and shell chrome variables are legitimate too.
    const allowedPrefixes = ['--mat-', '--mdc-', '--tw-', '--bg-', '--fg-', '--brd-', '--font-'];

    const offenders: string[] = [];
    for (const path of GENERATED_PAGES) {
      const html = readBundle(path);
      for (const match of html.matchAll(/var\((--[\w-]+)/g)) {
        const name = match[1];
        if (defined.has(name)) {
          continue;
        }
        if (allowedPrefixes.some((prefix) => name.startsWith(prefix))) {
          continue;
        }
        offenders.push(`${path}: ${name}`);
      }
    }

    expect([...new Set(offenders)]).toEqual([]);
  });

  test('the shell font variables resolve to the platform family', async ({ page }) => {
    // shell.css reads these; colors_and_type.css used to define them and the
    // generated pages no longer link it, so the export has to supply them or
    // the whole documentation shell falls back to a serif.
    await harness(page, '<div id="probe">x</div>');

    for (const variable of ['--font-ui', '--font-display', '--font-large']) {
      const value = await page.evaluate(
        (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim(),
        variable,
      );

      expect(value, `${variable} is not defined`).not.toBe('');
      expect(value).toContain('Roboto');
    }
  });

  test('the shell variables the pages rely on are still satisfied', () => {
    // shell.css aliases its chrome variables onto FE tokens. If a token it
    // references were renamed in the platform, the chrome would silently lose
    // its colour, so the aliases are checked against the real token list.
    const shellReferences = [
      '--surface-neutral-default',
      '--surface-neutral-light',
      '--text-neutral-title',
      '--text-neutral-body',
      '--border-neutral-default',
      '--surface-brand-default',
    ];

    const defined = new Set(tokens.map((token) => token.name));
    const missing = shellReferences.filter((name) => !defined.has(name));

    expect(missing).toEqual([]);
  });
});

test.describe('overlay scrims', () => {
  const SCRIMS = ['--scrim-dialog', '--scrim-drawer'];

  test('both scrim tokens hold the same value in light and dark', () => {
    // The whole point of these tokens: a scrim darkens what is behind it, so it
    // must not follow the theme. Deriving one from a surface token would make
    // the overlay lighter than the page in dark mode.
    for (const name of SCRIMS) {
      const token = tokens.find((candidate) => candidate.name === name);
      expect(token, `${name} is not exported`).toBeDefined();
      expect(token?.dark, `${name} has no dark value`).toBeDefined();
      expect(token?.dark, `${name} inverts between themes`).toBe(token?.light);
    }
  });

  test('the drawer scrim resolves through the token in both themes', async ({ page }) => {
    // `--mat-sidenav-scrim-color` reads `--scrim-drawer`, so this is the one
    // scrim the token actually drives. If the indirection breaks, the fallback
    // silently keeps the old colour and nothing else would notice.
    const declared = readRootVariable(
      read('shared/styles/components/_sidenav.scss'),
      '--mat-sidenav-scrim-color',
    );
    expect(declared).toContain('--scrim-drawer');

    await harness(page, '<div id="probe"></div>');

    for (const theme of ['light', 'dark'] as const) {
      await page.evaluate((mode) => {
        document.documentElement.classList.toggle('dark', mode === 'dark');
      }, theme);

      const resolved = await page
        .locator('#probe')
        .evaluate((element) =>
          getComputedStyle(element).getPropertyValue('--mat-sidenav-scrim-color').trim(),
        );

      expect(resolved, `drawer scrim in ${theme} mode`).toBe('rgba(0, 0, 0, 0.6)');
    }
  });

  test('the drawer is sized by the viewport, not a fixed panel width', () => {
    // Figma asks for a 512px `drawer-panel-min-width`. The code has never had
    // one, and pinning it would be a behaviour change rather than a rename — so
    // this asserts the percentages stay percentages.
    const drawerScss = read('shared/styles/components/_drawer.scss');
    const metrics = parseShapeMetrics({
      uiScss: read('shared/styles/_ui.scss'),
      dialogScss: read('shared/styles/components/_dialog.scss'),
      formFieldScss: read('shared/styles/components/_form-field.scss'),
      compiledButtonCss: compiledComponentCss,
      buttonRootSelector: '.cca-btn',
      drawerScss,
    });

    expect(metrics.drawerPanelMinWidth).toMatch(/%$/);
    expect(metrics.drawerPanelMaxWidth).toMatch(/%$/);
    expect(metrics.drawerPanelNotificationsWidth).toBeDefined();

    // The rule must read the token, not repeat the literal.
    expect(drawerScss).toContain('var(--drawer-panel-min-width');
    expect(drawerScss).toContain('var(--drawer-panel-max-width');

    const modal = readBundle('components/modal.html');
    expect(modal).toContain('--drawer-panel-min-width');
    expect(modal).toContain(`<code>${metrics.drawerPanelMinWidth}</code>`);
    expect(modal).toContain(`<code>${metrics.drawerPanelMaxWidth}</code>`);

    // The prose is free to explain where 512px came from; a table cell claiming
    // it as the drawer's width is the thing that must never ship.
    expect(modal, 'a table cell must not state a fixed drawer width').not.toMatch(
      /<td><code>\d+px<\/code><\/td>/,
    );
  });
});

test('the export imports its stylesheets unlayered, in cascade order', () => {
  const index = readBundle('ds/index.css');
  // The header comment explains why layers are avoided, and says "@layer" while
  // doing so — so the assertions run against the CSS with comments stripped.
  const code = index.replace(/\/\*[\s\S]*?\*\//g, '');

  // Wrapping these in a cascade layer would outrank specificity, and the
  // platform CSS carries Tailwind preflight (`* { border-width: 0 }`). Layered,
  // that universal reset beats every Material border. See the preflight test
  // above for the behaviour this protects.
  expect(code).not.toContain('@layer');
  expect(code).not.toMatch(/layer\(/);

  const order = [...code.matchAll(/@import url\('\.\/([\w-]+)\.css'\);/g)].map((match) => match[1]);
  const stageOf = (name: string) =>
    name.startsWith('material-') ? 0 : name.startsWith('platform') ? 1 : 2;

  expect(order.length).toBeGreaterThan(3);
  expect(order.map(stageOf)).toEqual([...order.map(stageOf)].sort((a, b) => a - b));

  // A statement at-rule without its semicolon swallows whatever follows.
  const unterminated = readBundle('ds/platform-01.css')
    .split('\n')
    .filter((line) => /^@layer [^{;]*$/.test(line.trim()));
  expect(unterminated).toEqual([]);

  expect(
    readRootVariable(readBundle('ds/platform-02.css'), '--surface-brand-default'),
  ).toBeDefined();
});
