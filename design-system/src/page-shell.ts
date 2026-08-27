/**
 * Builds the HTML wrapper every generated page shares.
 *
 * The structure is fixed by the design project's own shell: `shell-partials.js`
 * injects the sidebar, header and footer into `[data-shell="…"]` hooks and
 * places the dev-handoff card after `.page-head`, and `shell.css` styles the
 * `.app / .sidebar / .main / .page` skeleton documented in `shell/shell.html`.
 * Generated pages therefore have to match that markup exactly or they render
 * without navigation.
 *
 * `shell.css` is linked last and deliberately left unlayered, so the
 * documentation chrome always wins over the platform CSS the page is
 * demonstrating — a preview of a component can never restyle the site around it.
 */

/** Everything a generated page needs besides its body content. */
export interface PageOptions {
  /** Project-relative path, e.g. `design-system/colors.html`. */
  readonly path: string;
  /** Design System pane grouping, written into the `@dsCard` marker. */
  readonly group: string;
  /** Card subtitle in the Design System pane. */
  readonly subtitle: string;
  /** Page `<h1>`. */
  readonly title: string;
  /** Short paragraph under the title. */
  readonly intro: string;
  /** Breadcrumb trail, excluding Home. */
  readonly crumbs: readonly string[];
  /** Repo files the page was generated from, listed in the page footer. */
  readonly sources: readonly string[];
  /** Dev-handoff selectors, e.g. `['button[ccaButton]']`. */
  readonly devSelectors?: readonly string[];
  /**
   * Page-specific CSS. Use this for anything a page repeats — a table cell, a
   * swatch — rather than inline `style` attributes, which balloon the file.
   */
  readonly styles?: string;
  /** Page body: everything inside `<main class="page">` after the header. */
  readonly body: string;
}

/**
 * Shared documentation-table and swatch styling, used by the pages that render
 * long token and palette listings.
 */
export const TABLE_STYLES = `
      .ds-table { width: 100%; border-collapse: collapse; font-size: 12px; }
      .ds-table th { text-align: left; padding: 6px 10px; font-weight: 600; }
      .ds-table thead tr { border-bottom: 1px solid var(--border-neutral-default); }
      .ds-table td { padding: 6px 10px; vertical-align: middle; }
      .ds-table td.nw { white-space: nowrap; }
      .ds-table code { font-size: 11px; }
      .ds-scroll { overflow-x: auto; }
      .ds-sw {
        display: inline-block; width: 16px; height: 16px; border-radius: 4px;
        border: 1px solid var(--border-neutral-default); vertical-align: middle;
      }
      .ds-none { font-size: 11px; color: var(--text-neutral-caption); }
      .ds-ramp { display: flex; gap: 8px; flex-wrap: wrap; }
      .ds-ramp > div { flex: 1 1 84px; min-width: 84px; }
      .ds-ramp .chip {
        height: 56px; border-radius: 8px;
        border: 1px solid var(--border-neutral-default);
      }
      .ds-ramp .name { margin-top: 6px; font-size: 11px; }
      .ds-ramp .hex { font-size: 10px; color: var(--text-neutral-caption); }
      .ds-count { font-weight: 400; font-size: 12px; color: var(--text-neutral-subtitle); }
`;

/** Escapes text for interpolation into HTML content or an attribute. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** `../` for a page in a subdirectory, `` for a root page. */
function baseFor(path: string): string {
  const depth = path.split('/').length - 1;
  return '../'.repeat(depth);
}

/** Renders a code sample in the shell's code-card styling. */
export function codeCard(label: string, code: string): string {
  return [
    '<div class="code-card">',
    `  <div class="cc-head"><div class="cc-dots"><span></span><span></span><span></span></div>${escapeHtml(label)}</div>`,
    `  <div class="cc-body">${escapeHtml(code)}</div>`,
    '</div>',
  ].join('\n');
}

/** Renders a titled section. */
export function section(heading: string, ...blocks: string[]): string {
  return [
    `<section class="sec">`,
    `  <h2>${escapeHtml(heading)}</h2>`,
    ...blocks,
    '</section>',
  ].join('\n');
}

/** Renders a callout box. `tone` maps to the shell's callout variants. */
export function callout(
  tone: 'info' | 'ok' | 'warn' | 'bad',
  heading: string,
  bodyHtml: string,
): string {
  return [
    `<div class="callout ${tone}">`,
    '  <div>',
    `    <h4>${escapeHtml(heading)}</h4>`,
    `    ${bodyHtml}`,
    '  </div>',
    '</div>',
  ].join('\n');
}

/**
 * Wraps generated content in the project's page shell. The `@dsCard` comment
 * has to stay on line one — the Design System pane only scans the first line
 * when it rebuilds its card index.
 */
export function buildPage(options: PageOptions): string {
  const base = baseFor(options.path);
  const crumbs = [
    `<a href="${base}index.html">Home</a>`,
    ...options.crumbs.map((crumb) => `<span class="sep">/</span><span>${escapeHtml(crumb)}</span>`),
  ].join('');

  const sourceList = options.sources
    .map((source) => `<li><code>${escapeHtml(source)}</code></li>`)
    .join('');

  const devSelectorScript = options.devSelectors?.length
    ? `window.DS_DEV_SELECTOR = ${JSON.stringify([...options.devSelectors])};`
    : '';

  return `<!-- @dsCard group="${escapeHtml(options.group)}" subtitle="${escapeHtml(options.subtitle)}" -->
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(options.title)} · CtrlChain Design System</title>

    <!--
      Generated by tools/design-system-export in the CtrlChain frontend repo.
      Do not hand-edit: regenerate with \`pnpm design-system:export\`.

      ds/index.css is the platform's real compiled CSS — the same tokens,
      utilities and component rules the running app uses.
    -->
    <link rel="stylesheet" href="${base}fonts/fonts.css" />
    <link rel="stylesheet" href="${base}ds/index.css" />
    <link rel="stylesheet" href="${base}shell/shell.css" />${
      options.styles ? `\n    <style>${options.styles}    </style>` : ''
    }
  </head>
  <body>
    <div class="app">
      <aside class="sidebar" data-shell="sidebar"></aside>
      <div class="main">
        <header class="header" data-shell="header"></header>
        <main class="page">
          <div class="crumbs">${crumbs}</div>

          <div class="page-head">
            <div>
              <h1>${escapeHtml(options.title)}</h1>
              <div class="meta-row">
                <span class="chip">Generated from code</span>
                <span class="dot"></span>
                <span class="version">${escapeHtml(options.subtitle)}</span>
              </div>
            </div>
          </div>

          <p class="lede">${escapeHtml(options.intro)}</p>

${options.body}

          <section class="sec">
            <h2>Where this comes from</h2>
            <p class="lede">
              Every value on this page was read out of the platform source at build
              time, so it cannot drift from the app. Regenerate with
              <code>pnpm design-system:export</code>.
            </p>
            <ul class="u-mono">${sourceList}</ul>
          </section>
        </main>
        <footer class="footer" data-shell="footer"></footer>
      </div>
    </div>

    <script>
      window.DS_BASE = '${base}';
      window.DS_CURRENT = '${options.path}';
      ${devSelectorScript}
    </script>
    <script src="${base}shell/shell-partials.js"></script>
    <script src="${base}shell/shell.js"></script>
  </body>
</html>
`;
}
