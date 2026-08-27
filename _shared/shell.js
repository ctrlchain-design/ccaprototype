/*
 * Shared shell behaviour: dark mode and the submenu collapse.
 * -----------------------------------------------------------
 * Include once, at the end of <body>:
 *
 *   <script src="../_shared/shell.js"></script>
 *
 * It wires whatever it finds, by data attribute, and does nothing if the markup
 * is absent — so it is safe to include on a prototype that has no rail.
 *
 *   [data-theme-toggle]      the Dark item in the rail
 *   [data-submenu-toggle]    the Collapse item in the rail
 *
 * Both mechanisms are the platform's own, not invented for prototypes:
 *
 *   Dark      the platform themes off a `dark` class on the root element.
 *             `:root.dark` in platform-02.css redefines all 492 tokens. The
 *             exported bundle's own theme toggle (dist/shell/shell.js) does
 *             exactly this, so a prototype themes the same way the docs do.
 *             `light` is removed at the same time: the automatic dark path is
 *             `@media (prefers-color-scheme: dark) { :root:not(.light) }`, so
 *             leaving `light` on would fight the OS setting.
 *
 *   Collapse  toggles `smallSideNav` on cca-main, which the platform uses to
 *             switch `.appContent`'s grid from `4.5rem auto 1fr` to
 *             `4.5rem 13.5rem 1fr`, plus `hidden` on cca-side-submenu. Despite
 *             the name, smallSideNav is the EXPANDED state — the submenu column
 *             is 0 without it.
 */
(function () {
  'use strict';

  var root = document.documentElement;

  /* ---------------------------------------------------------------- theme */

  function setTheme(dark) {
    root.classList.toggle('dark', dark);
    root.classList.toggle('light', !dark);

    document.querySelectorAll('[data-theme-toggle]').forEach(function (el) {
      var label = el.querySelector('.menu-item-title');
      var icon = el.querySelector('mat-icon');
      if (label) label.textContent = dark ? 'Light' : 'Dark';
      if (icon) {
        icon.classList.toggle('cca-icon-moon', !dark);
        icon.classList.toggle('cca-icon-sun', dark);
      }
      el.setAttribute('aria-pressed', String(dark));
    });
  }

  /* -------------------------------------------------------------- submenu */

  function setSubmenu(expanded) {
    var main = document.querySelector('cca-main');
    var submenu = document.querySelector('cca-side-submenu');
    if (main) main.classList.toggle('smallSideNav', expanded);
    if (submenu) submenu.classList.toggle('hidden', !expanded);

    document.querySelectorAll('[data-submenu-toggle]').forEach(function (el) {
      var label = el.querySelector('.menu-item-title');
      var icon = el.querySelector('mat-icon');
      if (label) label.textContent = expanded ? 'Collapse' : 'Expand';
      if (icon) {
        icon.classList.toggle('cca-icon-chevrons-left', expanded);
        icon.classList.toggle('cca-icon-chevrons-right', !expanded);
      }
      el.setAttribute('aria-expanded', String(expanded));
    });
  }

  /* ---------------------------------------------------------------- wiring */

  document.addEventListener('click', function (event) {
    var themeEl = event.target.closest && event.target.closest('[data-theme-toggle]');
    if (themeEl) {
      setTheme(!root.classList.contains('dark'));
      return;
    }
    var subEl = event.target.closest && event.target.closest('[data-submenu-toggle]');
    if (subEl) {
      var main = document.querySelector('cca-main');
      setSubmenu(!(main && main.classList.contains('smallSideNav')));
    }
  });

  // Keyboard parity: these rail items are divs with role="button".
  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    var el = event.target.closest && event.target.closest('[data-theme-toggle],[data-submenu-toggle]');
    if (!el) return;
    event.preventDefault();
    el.click();
  });

  // A prototype starts light with the submenu open — the state a reviewer expects.
  setTheme(false);
  if (document.querySelector('cca-side-submenu')) setSubmenu(true);
})();
