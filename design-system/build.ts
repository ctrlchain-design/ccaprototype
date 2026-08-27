/**
 * Builds the CtrlChain design-system export bundle.
 *
 * Produces a directory that mirrors the layout of the Claude Design project, so
 * uploading it is a straight file copy:
 *
 *   ds/index.css              entry point — imports the three stages in order
 *   ds/material-*.css         Angular Material + vendor structural CSS
 *   ds/platform-*.css         compiled tokens, utilities, Material overrides, globals
 *   ds/cca-components.css     de-Angularized CtrlChain component styles
 *   fonts/fonts.css           Roboto, matching apps/platform/src/index.html
 *   design-system/*.html      foundation pages
 *   components/*.html         component pages
 *
 * Run with: pnpm design-system:export
 */

import { readFileSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';

import {
  CCA_BUTTON,
  PILOT_COMPONENTS,
  STATUS_BADGE_FLAVORS,
  SWEEP_COMPONENTS,
} from './src/components.js';
import { compileComponentLayer, compileGlobalLayer, rewriteAssetUrls } from './src/compile-css.js';
import { buildCatalogue } from './src/emit-catalogue.js';
import { buildDocsShell } from './src/emit-docs-shell.js';
import { buildGallery } from './src/gallery.js';
import { resetFieldIds, setMeasuredNotchWidths } from './src/material-dom.js';
import { collectFloatedLabels, measureFloatedLabels } from './src/measure-labels.js';
import { discoverComponents } from './src/discover-components.js';
import { buildMaterialBaseLayer } from './src/extract-material.js';
import {
  buildFontsCss,
  copyBrandAssets,
  emitStyleLayers,
  writeBundleFile,
  type EmittedFile,
  type LayerGroup,
} from './src/emit.js';
import { parseBodyFontStack, parseButtonSizes, parseShapeMetrics } from './src/parse-metrics.js';
import {
  parsePalette,
  parseSemanticTokens,
  parseTokenUtilities,
  parseTypeScale,
} from './src/parse-tokens.js';
import { parseDeclaredFlavors, parseIconFont } from './src/parse-component-css.js';
import { badgePage, iconographyPage } from './src/pages-badges.js';
import { buttonPage } from './src/pages-button.js';
import { cardPage, modalPage } from './src/pages-containers.js';
import {
  badgesStatusPage,
  buttonsInputsPage,
  navigationPage,
  searchBarPage,
  sidebarPage,
  topBarPage,
} from './src/pages-chrome.js';
import { chipsPage, tablePage, tabsPage, tooltipPage } from './src/pages-data.js';
import { colorsPage, tokensPage, typographyPage, type PageData } from './src/pages-foundations.js';
import { inputPage } from './src/pages-forms.js';
import { spacingPage } from './src/pages-spacing.js';

// Run from the repo root, matching the other tools/ scripts.
const REPO_ROOT = resolve(process.cwd());
const BUNDLE_ROOT = join(REPO_ROOT, 'tools/design-system-export/dist');

/** The documented pages, in reading order, for the catalogue index. */
const DOCUMENTED_PAGES = [
  { path: 'design-system/colors.html', title: 'Colors' },
  { path: 'design-system/tokens.html', title: 'Tokens' },
  { path: 'design-system/typography.html', title: 'Typography' },
  { path: 'design-system/spacing.html', title: 'Spacing & Radius' },
  { path: 'design-system/iconography.html', title: 'Iconography' },
  { path: 'design-system/buttons-inputs.html', title: 'Buttons & Inputs' },
  { path: 'design-system/badges-status.html', title: 'Badges & Status' },
  { path: 'design-system/navigation.html', title: 'Navigation' },
  { path: 'components/button.html', title: 'Button' },
  { path: 'components/input.html', title: 'Input' },
  { path: 'components/search-bar.html', title: 'Search Bar' },
  { path: 'components/card.html', title: 'Card' },
  { path: 'components/modal.html', title: 'Modal' },
  { path: 'components/table.html', title: 'Table' },
  { path: 'components/tabs.html', title: 'Tabs' },
  { path: 'components/chips.html', title: 'Chips' },
  { path: 'components/badge.html', title: 'Badge' },
  { path: 'components/tooltip.html', title: 'Tooltip' },
  { path: 'components/sidebar.html', title: 'Sidebar Menu' },
  { path: 'components/top-bar.html', title: 'Top Bar' },
];

/** Reads a repo file as text. */
function read(relativePath: string): string {
  return readFileSync(join(REPO_ROOT, relativePath), 'utf8');
}

/** Formats a byte count for the build log. */
function kb(text: string): string {
  return `${(Buffer.byteLength(text, 'utf8') / 1024).toFixed(0)} KB`;
}

async function main(): Promise<void> {
  console.log('Building design-system export bundle\n');

  rmSync(BUNDLE_ROOT, { recursive: true, force: true });

  // --- Layer 1: Material + vendor structural CSS -------------------------
  const materialGroups = buildMaterialBaseLayer(REPO_ROOT);
  console.log('Material base layer:');
  for (const group of materialGroups) {
    console.log(
      `  ${group.name.padEnd(10)} ${kb(group.css).padStart(8)}  ${group.sources.length} sources`,
    );
  }

  // --- Layer 3: platform globals (tokens, utilities, overrides) ----------
  const globalCssRaw = await compileGlobalLayer(REPO_ROOT);
  const rewritten = rewriteAssetUrls(globalCssRaw, REPO_ROOT);
  const globalCss = rewritten.css;
  console.log(`\nPlatform global layer: ${kb(globalCss)}`);
  console.log(`  ${rewritten.assets.length} referenced assets redirected into the bundle`);
  for (const url of rewritten.unresolved) {
    console.warn(`  ! unresolved asset url: ${url}`);
  }

  // --- Layer 2: CtrlChain component styles ------------------------------
  const components = await compileComponentLayer(REPO_ROOT, [
    ...PILOT_COMPONENTS,
    ...SWEEP_COMPONENTS,
  ]);
  console.log('\nComponent layer:');
  for (const component of components) {
    console.log(`  ${component.label.padEnd(42)} ${kb(component.css).padStart(8)}`);
    for (const warning of component.warnings) {
      console.warn(`    ! unresolved selector: ${warning.selector}`);
    }
  }

  const componentCss = components
    .map(
      (component) => `/* ---- ${component.label}\n     ${component.scss} ---- */\n${component.css}`,
    )
    .join('\n\n');

  // --- Stylesheets -------------------------------------------------------
  const layers: LayerGroup[] = [
    ...materialGroups.map((group): LayerGroup => ({
      stage: 'material',
      stem: `material-${group.name}`,
      css: group.css,
    })),
    { stage: 'platform', stem: 'platform', css: globalCss },
    { stage: 'cca', stem: 'cca-components', css: componentCss },
  ];

  const bodyFontStack = parseBodyFontStack(read('shared/styles/tailwind/tailwind.css'));
  const styles = emitStyleLayers(layers, bodyFontStack);
  const files: EmittedFile[] = [
    ...styles.files,
    { path: 'fonts/fonts.css', contents: buildFontsCss() },
  ];

  // --- Pages -------------------------------------------------------------
  const pageData: PageData = {
    palette: parsePalette(
      read('shared/styles/tailwind/colors.css'),
      read('shared/styles/tailwind/new-cold.css'),
    ),
    tokens: parseSemanticTokens(
      read('shared/styles/tailwind/light-mode.scss'),
      read('shared/styles/tailwind/dark-mode.scss'),
    ),
    utilities: parseTokenUtilities(read('shared/styles/tailwind/tailwind.css')),
    typeScale: parseTypeScale(read('shared/styles/tailwind/tailwind.css')),
  };

  const buttonComponentCss =
    components.find((entry) => entry.scss.includes('button/button.component.scss'))?.css ?? '';
  const buttonSizes = parseButtonSizes(buttonComponentCss, '.cca-btn', CCA_BUTTON.sizes);
  const shapeMetrics = parseShapeMetrics({
    uiScss: read('shared/styles/_ui.scss'),
    dialogScss: read('shared/styles/components/_dialog.scss'),
    formFieldScss: read('shared/styles/components/_form-field.scss'),
    sidenavScss: read('shared/styles/components/_sidenav.scss'),
    drawerScss: read('shared/styles/components/_drawer.scss'),
    compiledButtonCss: buttonComponentCss,
    buttonRootSelector: '.cca-btn',
  });

  // Flavour support differs per badge, so each list is read from that
  // component's own compiled CSS rather than from the shared union type.
  const flavorsFor = (rootSelector: string) =>
    parseDeclaredFlavors(componentCss, rootSelector, [...STATUS_BADGE_FLAVORS]);

  const badgeFlavors = {
    status: flavorsFor('cca-status-badge'),
    label: flavorsFor('cca-label-badge'),
    text: flavorsFor('cca-text-badge'),
    numerical: flavorsFor('cca-numerical-badge'),
    attentionFlag: flavorsFor('cca-attention-flag-badge'),
  };

  const icons = parseIconFont(read('shared/assets/icons/CtrlChain.css'));

  /**
   * The page generators are pure, so they can be run twice: once to discover
   * which form-field labels exist, and again with the measured notch widths
   * seeded. `resetFieldIds` keeps the two passes byte-identical apart from the
   * widths themselves.
   */
  const generatePages = (): EmittedFile[] => {
    resetFieldIds();

    return [
      { path: 'design-system/colors.html', contents: colorsPage(pageData) },
      { path: 'design-system/tokens.html', contents: tokensPage(pageData) },
      { path: 'design-system/typography.html', contents: typographyPage(pageData) },
      { path: 'design-system/spacing.html', contents: spacingPage(shapeMetrics) },
      { path: 'components/button.html', contents: buttonPage(buttonSizes) },
      { path: 'components/input.html', contents: inputPage(shapeMetrics) },
      { path: 'components/card.html', contents: cardPage(shapeMetrics) },
      { path: 'components/modal.html', contents: modalPage(shapeMetrics) },
      { path: 'components/table.html', contents: tablePage() },
      { path: 'components/tabs.html', contents: tabsPage() },
      { path: 'components/chips.html', contents: chipsPage() },
      { path: 'components/tooltip.html', contents: tooltipPage() },
      { path: 'components/badge.html', contents: badgePage(badgeFlavors) },
      { path: 'design-system/iconography.html', contents: iconographyPage(icons) },
      { path: 'components/search-bar.html', contents: searchBarPage() },
      { path: 'components/sidebar.html', contents: sidebarPage() },
      { path: 'components/top-bar.html', contents: topBarPage() },
      { path: 'design-system/navigation.html', contents: navigationPage() },
      { path: 'design-system/badges-status.html', contents: badgesStatusPage() },
      { path: 'design-system/buttons-inputs.html', contents: buttonsInputsPage() },
    ];
  };

  // The measuring page links the emitted CSS, so write the stylesheets first.
  for (const file of files) {
    writeBundleFile(BUNDLE_ROOT, file);
  }

  // The bundle's own documentation chrome. The published project has its own
  // richer shell at these paths, so shell/* is never uploaded there.
  files.push(...buildDocsShell(DOCUMENTED_PAGES));

  const firstPass = generatePages();
  const labels = collectFloatedLabels(firstPass.map((file) => file.contents));
  const { widths, skippedReason } = await measureFloatedLabels(BUNDLE_ROOT, labels);

  if (skippedReason) {
    console.warn(`\n! Notch widths not measured (${skippedReason}); falling back to auto.`);
  } else {
    console.log(`\nMeasured ${widths.size} form-field labels for the outline notch`);
  }

  setMeasuredNotchWidths(widths);
  files.push(...generatePages());

  // --- Catalogue: every component's CSS, the token exports, the index -----
  const discovery = discoverComponents(REPO_ROOT);
  console.log(
    `\nDiscovered ${discovery.components.length} components with rules (${discovery.skipped.length} have none)`,
  );

  const allComponents = await compileComponentLayer(REPO_ROOT, discovery.components);
  const paired = discovery.components
    .map((meta, index) => ({ meta, compiled: allComponents[index] }))
    .filter((entry) => entry.compiled !== undefined && entry.compiled.css.trim() !== '');

  const catalogueWarnings = paired.flatMap((entry) =>
    entry.compiled.warnings.map((warning) => `${entry.meta.slug}: ${warning.selector}`),
  );
  if (catalogueWarnings.length > 0) {
    console.warn(`  ! ${catalogueWarnings.length} unresolved selectors:`);
    for (const warning of catalogueWarnings.slice(0, 10)) {
      console.warn(`    ${warning}`);
    }
  }

  files.push(
    ...buildCatalogue({
      palette: pageData.palette,
      tokens: pageData.tokens,
      utilities: pageData.utilities,
      typeScale: pageData.typeScale,
      icons,
      components: paired,
      skipped: discovery.skipped,
      documentedPages: DOCUMENTED_PAGES,
      gallery: buildGallery({
        palette: pageData.palette,
        tokens: pageData.tokens,
        typeScale: pageData.typeScale,
        icons,
      }),
    }),
  );

  for (const file of files) {
    writeBundleFile(BUNDLE_ROOT, file);
  }

  const assets = copyBrandAssets(REPO_ROOT, BUNDLE_ROOT, rewritten.assets);

  console.log('\nButton sizes read from the compiled component CSS:');
  for (const size of buttonSizes) {
    console.log(
      `  ${size.size.padEnd(9)} height ${(size.height ?? '—').padEnd(8)} padding ${(size.padding ?? '—').padEnd(12)} iconOnly padding ${size.iconOnlyPadding ?? '—'}`,
    );
  }

  const componentCssFiles = files.filter((file) => file.path.startsWith('ds/components/'));
  const totalBytes = files.reduce((sum, file) => sum + Buffer.byteLength(file.contents, 'utf8'), 0);

  console.log(`\nWrote ${files.length} files + ${assets.length} font assets to ${BUNDLE_ROOT}`);
  for (const file of files) {
    if (file.path.startsWith('ds/components/')) {
      continue;
    }
    console.log(`  ${file.path.padEnd(38)} ${kb(file.contents).padStart(8)}`);
  }
  console.log(
    `  ${`ds/components/*.css (${componentCssFiles.length} files)`.padEnd(38)} ${kb(componentCssFiles.map((f) => f.contents).join('')).padStart(8)}`,
  );
  console.log(`\nBundle total: ${(totalBytes / 1024 / 1024).toFixed(1)} MB`);
  console.log('Open index.html to browse.');
}

main().catch((error: unknown) => {
  console.error('\nExport failed:', error);
  process.exitCode = 1;
});
