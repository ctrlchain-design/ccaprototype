import { chromium } from '@playwright/test';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const dist = resolve(process.cwd(), 'tools/design-system-export/dist');
const pages: Array<[string, string]> = [
  ['catalogue', 'index.html'],
  ['button', 'components/button.html'],
  ['typography', 'design-system/typography.html'],
  ['spacing', 'design-system/spacing.html'],
  ['colors', 'design-system/colors.html'],
  ['input', 'components/input.html'],
  ['modal', 'components/modal.html'],
  ['card', 'components/card.html'],
  ['table', 'components/table.html'],
  ['tabs', 'components/tabs.html'],
  ['chips', 'components/chips.html'],
  ['badge', 'components/badge.html'],
  ['icons', 'design-system/iconography.html'],
  ['tooltip', 'components/tooltip.html'],
  ['searchbar', 'components/search-bar.html'],
  ['sidebar', 'components/sidebar.html'],
];

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1320, height: 1100 } });
  for (const [name, file] of pages) {
    await page.goto(pathToFileURL(join(dist, file)).href, { waitUntil: 'load' });
    await page.waitForTimeout(700);
    await page.screenshot({ path: join(dist, `_shot-${name}.png`) });
  }
  await browser.close();
  console.log('screenshots written');
}
main();
