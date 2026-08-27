/*
 * Screen registry — how prototypes link to each other
 * ---------------------------------------------------
 *   <script src="../_shared/routes.js"></script>
 *
 * The point: prototypes are one product, not a folder of unrelated screens. A
 * row in the orders list should open the order detail — even though the detail
 * prototype might not be built until next month.
 *
 * So links are written against a SCREEN NAME, never a folder path:
 *
 *   <a data-screen="orders.detail" data-params='{"id":"CCA2023-000270.1"}'>…</a>
 *
 * and this file decides what that resolves to. Three things fall out of that:
 *
 *   1. A screen that does not exist yet says so, politely, instead of 404ing.
 *      Write the link today; it starts working the day the screen is built.
 *   2. Renaming a prototype folder is a one-line change here, not a hunt through
 *      every other prototype.
 *   3. The registry doubles as the map of what exists.
 *
 * Nothing is registered by hand. A page names itself with data-screen on its
 * <html> element, and a generator walks the repo to build _shared/screens.js:
 *
 *   python3 .claude/skills/prototype/scripts/build-screens.py
 *
 * So building a prototype connects it. Links already pointing at that screen
 * come alive with no edits to the pages that make them.
 */
(function () {
  'use strict';

  /*
   * The registry is GENERATED — see _shared/screens.js and
   * .claude/skills/prototype/scripts/build-screens.py. Nobody registers a
   * prototype by hand: the generator walks the repo, reads `data-screen` off each
   * page's <html> (falling back to the folder name), and records anything that is
   * linked to but does not exist yet as null.
   *
   * If screens.js has not been generated, links still resolve by convention —
   * screen `orders.detail` → folder `orders-detail/` — so nothing hard-fails.
   */
  var SCREENS = window.CCA_SCREENS || {};

  /*
   * Prototypes sit one level down (`orders-pinned-filters/index.html`), so the
   * repo root is one level up. A prototype nested deeper — the
   * `resource-availability/prototype/` pattern — sets data-root on <html> to say
   * how far up it is.
   */
  function root() {
    return document.documentElement.getAttribute('data-root') || '../';
  }

  function url(screen, params) {
    if (!(screen in SCREENS)) return null; // linked to, never generated
    var entry = SCREENS[screen];
    if (!entry) return null;               // known, not built yet

    var href = root() + (typeof entry === 'string' ? entry : entry.path);
    var query = Object.keys(params || {})
      .map(function (k) { return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]); })
      .join('&');
    return query ? href + (href.indexOf('?') === -1 ? '?' : '&') + query : href;
  }

  /* ------------------------------------------------- not-built-yet notice */

  /*
   * A real snackbar from the design system — mat-mdc-snack-bar-container with
   * the info tokens. The app positions this through the CDK overlay; a static
   * page has no overlay runtime, so .proto-snackbar in _shared/prototype.css
   * places it.
   */
  function notice(message) {
    var existing = document.querySelector('.proto-snackbar');
    if (existing) existing.remove();

    var bar = document.createElement('div');
    bar.className = 'proto-snackbar mat-mdc-snack-bar-container';
    bar.setAttribute('role', 'status');
    bar.innerHTML =
      '<div class="mat-mdc-snackbar-surface">' +
      '<div class="mat-mdc-simple-snack-bar">' +
      '<div class="mat-mdc-snack-bar-label mdc-snackbar__label"></div>' +
      '</div></div>';
    bar.querySelector('.mat-mdc-snack-bar-label').textContent = message;
    document.body.appendChild(bar);

    setTimeout(function () { bar.remove(); }, 4000);
  }

  /* ------------------------------------------------------------- wiring */

  function params(el) {
    var raw = el.getAttribute('data-params');
    if (!raw) return {};
    try {
      return JSON.parse(raw);
    } catch (error) {
      return {};
    }
  }

  // Resolve every data-screen link on load, so real links look and behave like
  // links — hover, middle-click, open in new tab — and only the unbuilt ones are
  // intercepted.
  function isLink(el) {
    // <html data-screen> declares what this page IS, not somewhere to go.
    return el && el !== document.documentElement;
  }

  function resolveAll() {
    document.querySelectorAll('[data-screen]').forEach(function (el) {
      if (!isLink(el)) return;
      var href = url(el.getAttribute('data-screen'), params(el));
      if (href && el.tagName === 'A') el.setAttribute('href', href);
      if (!href) el.setAttribute('data-unbuilt', '');
    });
  }

  document.addEventListener('click', function (event) {
    var el = event.target.closest && event.target.closest('[data-screen]');
    if (!isLink(el)) return;

    var screen = el.getAttribute('data-screen');
    var href = url(screen, params(el));

    if (!href) {
      event.preventDefault();
      notice('“' + screen + '” has not been prototyped yet.');
      return;
    }
    // A non-anchor with data-screen still navigates, so table rows can be clickable.
    if (el.tagName !== 'A') {
      event.preventDefault();
      window.location.href = href;
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', resolveAll);
  } else {
    resolveAll();
  }

  window.CCA_ROUTES = {
    screens: SCREENS,
    url: url,
    notice: notice,
    // Re-resolve after something adds data-screen late — nav.js does.
    resolve: resolveAll,
    // Which screen is this page? From data-screen on <html>.
    current: document.documentElement.getAttribute('data-screen') || null,
    // Read a param the link carried, e.g. the id of the order to show.
    param: function (name) {
      return new URLSearchParams(window.location.search).get(name);
    },
  };
})();
