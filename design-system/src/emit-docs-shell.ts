/**
 * Emits the documentation chrome the generated pages need to stand on their own.
 *
 * Every page links `shell/shell.css` and scripts `shell/shell-partials.js` and
 * `shell/shell.js`. Those files are hand-authored and live in the published
 * design project, so pages render correctly *there* — but the local bundle had
 * no copy, which left it with correct component samples inside unstyled pages.
 *
 * Rather than vendor the project's richer shell (and risk overwriting it on the
 * next upload), the exporter emits its own minimal equivalent: the page
 * primitives the generators actually use, and a nav built from the pages the
 * bundle really contains, so nothing links into a void.
 *
 * These files are for the bundle only — never upload `shell/*` to the design
 * project, which has its own.
 */

import { type EmittedFile } from './emit.js';

/** One entry in the emitted navigation. */
export interface ShellNavPage {
  readonly path: string;
  readonly title: string;
}

/**
 * The page primitives the page generators use, expressed against the real
 * design tokens so the chrome themes with everything else.
 */
function shellCss(): string {
  return `/*
 * Documentation chrome for the exported bundle — generated.
 *
 * The published design project has its own richer shell at this path; this file
 * exists so the local folder is self-contained. It styles only the page
 * primitives the generated pages use, and takes every colour from the platform
 * tokens so it follows dark mode with the rest of the export.
 */

body {
  margin: 0;
  background: var(--surface-neutral-default);
  color: var(--text-neutral-body);
  font-family: var(--font-ui);
}

/*
 * The platform paints a brand watermark on \`body::before\`. That is part of the
 * app's own page chrome, not of documentation *about* the app, and it competes
 * with the component samples — so the docs suppress it here rather than editing
 * the exported platform CSS, which stays exactly as the app ships it.
 */
body::before {
  display: none;
}

/* ---------- Layout ---------- */
.app {
  display: grid;
  grid-template-columns: 248px 1fr;
  min-height: 100vh;
}
.main {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.page {
  padding: 32px 48px 96px;
  max-width: 1120px;
  width: 100%;
}
.page.wide {
  max-width: 1280px;
}

/* ---------- Sidebar ---------- */
.sidebar {
  background: var(--surface-neutral-light);
  border-right: 1px solid var(--border-neutral-default);
  padding: 20px 12px 32px;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}
.sidebar .brand {
  padding: 4px 12px 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.sidebar .brand img {
  height: 20px;
  align-self: flex-start;
}
.sidebar .brand .tag {
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.04em;
  color: var(--text-neutral-subtitle);
}
.nav-group + .nav-group {
  margin-top: 10px;
}
.nav-group .nav-heading {
  padding: 8px 12px 4px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-neutral-caption);
}
.nav-sub a {
  display: block;
  padding: 6px 12px;
  font-size: 13px;
  color: var(--text-neutral-body);
  text-decoration: none;
  border-radius: 6px;
}
.nav-sub a:hover {
  background: var(--surface-neutral-default);
}
.nav-sub a.is-active {
  background: var(--surface-brand-lightest);
  color: var(--text-brand-darker);
  font-weight: 500;
}

/* ---------- Header and footer ---------- */
.header {
  height: 56px;
  background: var(--surface-neutral-light);
  border-bottom: 1px solid var(--border-neutral-default);
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 32px;
  position: sticky;
  top: 0;
  z-index: 10;
}
.header .spacer {
  flex: 1;
}
.header .theme-toggle {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  font-size: 12px;
  border-radius: 8px;
  border: 1px solid var(--border-neutral-default);
  background: var(--surface-neutral-light);
  color: var(--text-neutral-body);
  cursor: pointer;
}
.header .theme-toggle:hover {
  border-color: var(--border-brand-default);
}
.footer {
  border-top: 1px solid var(--border-neutral-default);
  background: var(--surface-neutral-light);
  padding: 24px 48px;
  margin-top: auto;
  font-size: 12px;
  color: var(--text-neutral-subtitle);
}

/* ---------- Page header ---------- */
.crumbs {
  font-size: 12px;
  color: var(--text-neutral-subtitle);
  display: flex;
  gap: 6px;
  align-items: center;
  margin-bottom: 8px;
}
.crumbs a {
  color: var(--text-neutral-subtitle);
  text-decoration: none;
}
.crumbs a:hover {
  color: var(--text-neutral-title);
}
.crumbs .sep {
  color: var(--text-neutral-caption);
}
.page-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border-neutral-default);
  margin-bottom: 32px;
}
.page-head h1 {
  margin: 0;
  font-size: 30px;
  font-weight: 700;
  letter-spacing: -0.015em;
  color: var(--text-neutral-title);
}
.page-head .meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  margin-top: 10px;
  font-size: 11px;
  color: var(--text-neutral-subtitle);
}
.page-head .meta-row .dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--text-neutral-caption);
}
.page-head .chip {
  padding: 3px 8px;
  border-radius: 4px;
  background: var(--surface-neutral-default);
  border: 1px solid var(--border-neutral-default);
  font-size: 11px;
  font-weight: 500;
  color: var(--text-neutral-subtitle);
}

/* ---------- Sections ---------- */
.sec {
  margin-bottom: 48px;
}
/*
 * Direct children only.
 *
 * These rules are prose styling for the documentation, but a descendant
 * selector like \`.sec p\` reaches *into* the component samples and outranks the
 * component's own class on specificity. That is how \`.sec p { color }\` beat
 * \`.alert-text-neutral\` and left the info-banner copy unreadable in dark mode —
 * the docs chrome silently restyling the thing it is meant to be documenting.
 */
.sec > h2 {
  margin: 0 0 12px;
  font-size: 21px;
  font-weight: 700;
  color: var(--text-neutral-title);
}
.sec > h3 {
  margin: 24px 0 10px;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-neutral-title);
}
.sec > p {
  margin: 0 0 12px;
  font-size: 14px;
  line-height: 1.55;
  color: var(--text-neutral-body);
}
p.lede {
  font-size: 15px;
  color: var(--text-neutral-subtitle);
  max-width: 720px;
}
.sec > ul {
  margin: 0 0 12px;
  padding-left: 20px;
}

/* ---------- Preview panels ---------- */
.preview-panel {
  border: 1px solid var(--border-neutral-default);
  border-radius: 10px;
  background: var(--surface-neutral-light);
  overflow: hidden;
  margin-bottom: 16px;
}
.preview-panel .pp-body {
  padding: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 140px;
}
.preview-panel .pp-foot {
  border-top: 1px solid var(--border-neutral-default);
  background: var(--surface-neutral-default);
  padding: 10px 16px;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  font-size: 11px;
  color: var(--text-neutral-subtitle);
}

/* ---------- Variant grid ---------- */
.variant-grid {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.variant-row .vr-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-neutral-subtitle);
  margin-bottom: 10px;
}
.variant-row .vr-items {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
  padding: 16px;
  background: var(--surface-neutral-default);
  border: 1px solid var(--border-neutral-default);
  border-radius: 8px;
}

/* ---------- Callouts ---------- */
.callout {
  border-radius: 10px;
  padding: 16px 18px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
  margin-bottom: 16px;
}
.callout h4 {
  margin: 0 0 6px;
  font-size: 13px;
  font-weight: 600;
}
.callout p {
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
}
.callout.info {
  background: var(--info-surface-lightest);
  color: var(--info-text-dark);
}
.callout.ok {
  background: var(--success-surface-lightest);
  color: var(--success-text);
}
.callout.warn {
  background: var(--warning-surface-lighter);
  color: var(--warning-text-dark);
}
.callout.bad {
  background: var(--critical-surface-lighter);
  color: var(--critical-text);
}

/* ---------- Code cards ---------- */
.code-card {
  background: var(--surface-neutral-light);
  border: 1px solid var(--border-neutral-default);
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 16px;
  font-size: 12px;
}
.code-card .cc-head {
  background: var(--surface-neutral-default);
  border-bottom: 1px solid var(--border-neutral-default);
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: var(--text-neutral-subtitle);
}
.code-card .cc-dots {
  display: flex;
  gap: 4px;
}
.code-card .cc-dots span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--border-neutral-dark);
}
.code-card .cc-body {
  padding: 14px 16px;
  white-space: pre;
  overflow-x: auto;
  line-height: 1.55;
  color: var(--text-neutral-body);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}

/* ---------- Utility ---------- */
.u-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}
.u-mute {
  color: var(--text-neutral-subtitle);
}
code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.9em;
}

@media (max-width: 900px) {
  .app {
    grid-template-columns: 1fr;
  }
  .sidebar {
    position: relative;
    height: auto;
    border-right: 0;
    border-bottom: 1px solid var(--border-neutral-default);
  }
  .page {
    padding: 20px 20px 64px;
  }
}
`;
}

/**
 * The nav injector. Built from the pages the bundle actually contains, so no
 * entry links to a file that is not there — the project's own shell lists
 * pages this bundle does not generate.
 */
function shellPartialsJs(pages: readonly ShellNavPage[]): string {
  const groups = new Map<string, ShellNavPage[]>();
  for (const page of pages) {
    const group = page.path.startsWith('design-system/') ? 'Foundations' : 'Components';
    const list = groups.get(group) ?? [];
    list.push(page);
    groups.set(group, list);
  }

  const navData = [...groups].map(([label, entries]) => ({ label, entries }));

  return `/*
 * Generated — injects the bundle's navigation, header and footer.
 *
 * Pages set window.DS_BASE and window.DS_CURRENT before loading this. The nav
 * lists only pages this bundle contains.
 */
(function () {
  var BASE = window.DS_BASE || '';
  var CURRENT = window.DS_CURRENT || '';
  var NAV = ${JSON.stringify(navData, null, 2)};

  function link(page) {
    var active = page.path === CURRENT ? ' class="is-active"' : '';
    return '<a href="' + BASE + page.path + '"' + active + '>' + page.title + '</a>';
  }

  var sidebar = document.querySelector('[data-shell="sidebar"]');
  if (sidebar) {
    sidebar.innerHTML =
      '<div class="brand">' +
      '<img src="' + BASE + 'assets/images/ctrlchain-text-green.svg" alt="CtrlChain" />' +
      '<div class="tag">Design System</div>' +
      '</div>' +
      '<a class="nav-sub" style="display:block" href="' + BASE + 'index.html">' +
      '<a href="' + BASE + 'index.html">All components</a></a>' +
      NAV.map(function (group) {
        return (
          '<div class="nav-group"><div class="nav-heading">' + group.label + '</div>' +
          '<div class="nav-sub">' + group.entries.map(link).join('') + '</div></div>'
        );
      }).join('');
  }

  var header = document.querySelector('[data-shell="header"]');
  if (header) {
    header.innerHTML =
      '<div class="spacer"></div>' +
      '<button class="theme-toggle" data-theme-toggle>Toggle theme</button>';
  }

  var footer = document.querySelector('[data-shell="footer"]');
  if (footer) {
    footer.innerHTML =
      'Generated from the CtrlChain platform source — run <code>pnpm design-system:export</code> to refresh.';
  }
})();
`;
}

/**
 * The theme toggle. The export's dark mode is driven by `.dark` on the root,
 * matching the platform, so the toggle just flips that class and remembers it.
 */
function shellJs(): string {
  return `/*
 * Generated — dark-mode toggle for the exported bundle.
 *
 * The platform switches theme with a \`dark\` class on the root element, so the
 * documentation does the same and the previews theme exactly as the app does.
 */
(function () {
  var KEY = 'cca-ds-theme';

  function apply(theme) {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }

  try {
    apply(localStorage.getItem(KEY) || 'light');
  } catch (error) {
    apply('light');
  }

  document.addEventListener('click', function (event) {
    var target = event.target;
    if (!target || !target.closest || !target.closest('[data-theme-toggle]')) {
      return;
    }

    var next = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
    apply(next);

    try {
      localStorage.setItem(KEY, next);
    } catch (error) {
      // Storage can be unavailable; the toggle still works for this page.
    }
  });
})();
`;
}

/** Builds the bundle's own documentation chrome. */
export function buildDocsShell(pages: readonly ShellNavPage[]): EmittedFile[] {
  return [
    { path: 'shell/shell.css', contents: shellCss() },
    { path: 'shell/shell-partials.js', contents: shellPartialsJs(pages) },
    { path: 'shell/shell.js', contents: shellJs() },
  ];
}
