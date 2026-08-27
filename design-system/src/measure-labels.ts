/**
 * Measures floated form-field labels in a real browser so the outline notch is
 * exactly as wide as the label sitting in it.
 *
 * Angular writes the notch width inline after measuring the label at runtime.
 * A static page has to get that number from somewhere, and every pure-CSS
 * substitute was wrong:
 *
 *  - estimating from the character count was 27px too wide for a short label
 *    and too narrow for a long one;
 *  - `width: auto` sizes the notch to the label's *unscaled* box, because the
 *    0.75 float scale is a transform and transforms do not affect layout;
 *  - swapping the transform for a real `font-size` fixes the width but drops
 *    the label 3px, since Material positions it with the scaled box in mind.
 *
 * So the label is measured the way the browser actually draws it — with the
 * scale transform in place — and the result is baked into the generated markup.
 * If the browser or the webfont is unavailable the caller falls back to `auto`,
 * which is wide rather than clipped.
 */

import { rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

// Type-only, so it is erased at compile time and the runtime import below
// stays lazy — the export still works where Playwright is not installed.
import type * as PlaywrightTest from '@playwright/test';

/** Padding and border the notch adds around the label, from Material's CSS. */
const NOTCH_CHROME_PX = 9;

/** Escapes text for use in HTML content. */
function escape(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Result of a measurement run. */
export interface LabelMeasurements {
  /** Label text to notch width in px. Empty when measurement was not possible. */
  readonly widths: Map<string, number>;
  /** Why measurement was skipped, if it was. */
  readonly skippedReason?: string;
}

/**
 * Renders each label inside the real notch markup and reads its drawn width.
 *
 * `bundleRoot` must already contain `ds/index.css` and `fonts/fonts.css`, so the
 * measurement happens against the same CSS the pages will link.
 */
export async function measureFloatedLabels(
  bundleRoot: string,
  labels: readonly string[],
): Promise<LabelMeasurements> {
  if (labels.length === 0) {
    return { widths: new Map() };
  }

  // Imported lazily so the export still runs where Playwright is unavailable.
  let playwright: typeof PlaywrightTest;
  try {
    playwright = await import('@playwright/test');
  } catch {
    return { widths: new Map(), skippedReason: 'Playwright is not installed' };
  }

  const probePath = join(bundleRoot, '_measure-labels.html');
  const samples = labels
    .map(
      (label, index) =>
        `<div class="mat-mdc-form-field mat-form-field-appearance-outline">
  <div class="mat-mdc-text-field-wrapper mdc-text-field mdc-text-field--outlined mdc-text-field--label-floating">
    <div class="mat-mdc-form-field-flex">
      <div class="mdc-notched-outline mdc-notched-outline--upgraded mdc-notched-outline--notched">
        <div class="mdc-notched-outline__leading mat-mdc-notch-piece"></div>
        <div class="mdc-notched-outline__notch mat-mdc-notch-piece">
          <label class="mdc-floating-label mat-mdc-floating-label mdc-floating-label--float-above"
            data-measure="${index}">${escape(label)}</label>
        </div>
        <div class="mdc-notched-outline__trailing mat-mdc-notch-piece"></div>
      </div>
      <div class="mat-mdc-form-field-infix"><input class="mat-mdc-input-element mdc-text-field__input" value="x" /></div>
    </div>
  </div>
</div>`,
    )
    .join('\n');

  writeFileSync(
    probePath,
    `<!doctype html><html><head><meta charset="utf-8" />
<link rel="stylesheet" href="./fonts/fonts.css" />
<link rel="stylesheet" href="./ds/index.css" />
</head><body>${samples}</body></html>`,
    'utf8',
  );

  const browser = await playwright.chromium.launch();

  try {
    const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
    await page.goto(pathToFileURL(probePath).href, { waitUntil: 'load' });

    // A fallback font would give confidently wrong numbers, so bail instead.
    const hasRoboto = await page.evaluate(async () => {
      await document.fonts.ready;
      return document.fonts.check('400 16px Roboto');
    });

    if (!hasRoboto) {
      return {
        widths: new Map(),
        skippedReason: 'Roboto did not load; measurements would be wrong',
      };
    }

    const measured = await page.evaluate(() => {
      const result: [number, number][] = [];

      for (const label of document.querySelectorAll('[data-measure]')) {
        const index = Number(label.getAttribute('data-measure'));
        result.push([index, label.getBoundingClientRect().width]);
      }

      return result;
    });

    const widths = new Map<string, number>();
    for (const [index, width] of measured) {
      const label = labels[index];
      if (label !== undefined) {
        widths.set(label, Math.ceil(width) + NOTCH_CHROME_PX);
      }
    }

    return { widths };
  } finally {
    await browser.close();
    rmSync(probePath, { force: true });
  }
}

/** Pulls every floated label out of already-generated page HTML. */
export function collectFloatedLabels(pages: readonly string[]): string[] {
  const labels = new Set<string>();

  for (const html of pages) {
    for (const match of html.matchAll(
      /<label class="mdc-floating-label[^"]*"[^>]*>([^<]*)<\/label>/g,
    )) {
      const text = match[1].trim();
      if (text !== '') {
        labels.add(text);
      }
    }
  }

  return [...labels];
}
