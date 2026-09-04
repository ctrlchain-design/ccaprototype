/*
 * Cross-prototype navigation
 * --------------------------
 *   <script src="../_shared/nav.js"></script>   (after routes.js)
 *
 * Makes the sidebar real. From the Orders list you can click Finance → Rates and
 * land in the rate-configuration prototype, because the nav items point at
 * screens rather than at "#".
 *
 * WHY IT MATCHES ON LABEL TEXT
 * The prototypes were built at different times and their sidebars have nothing
 * in common structurally — orders-pinned-filters uses the platform's
 * cca-side-menu, rate-configuration uses an inline-styled <aside> of divs,
 * taskboard-redesign uses .navitem divs. Rewriting all of them to share markup
 * would be a bigger change than the connection is worth, and would mean editing
 * prototypes that are finished.
 *
 * So this walks whatever nav markup a page has, finds items by the label a
 * designer actually sees, and attaches data-screen to them. routes.js takes it
 * from there: real hrefs for screens that exist, a "not prototyped yet" notice
 * for the ones that do not.
 *
 * WHERE THE MAP CAME FROM
 * The rail and submenu structure is the running app's, read off staging — not
 * guessed. Rates really does live under Finance, not Carrier TMS.
 */
(function () {
  'use strict';

  /*
   * Label → screen name. A label with no screen is left alone: nav that goes
   * nowhere should look like nav, and clicking it explains itself.
   *
   * Add a line here when a prototype covers a new part of the product.
   */
  var NAV = {
    // ---- Rail: a domain points at the prototype that lives under it -------
    // Going from Orders to rate management means clicking Finance in the rail,
    // so the rail has to navigate, not just the submenu. Where a domain has
    // exactly one prototype, the domain goes straight there.
    /*
     * Two prototypes are the Orders screen: orders-pinned-filters, which
     * demonstrates the pinned-filter flow, and oms, the combined
     * transport + warehouse + invoice table. The COMBINED one is where Orders
     * goes — it is the fuller screen, it is what the order detail links back
     * to, and landing on the narrower flow demo from an order you were just
     * reading is disorienting.
     *
     * orders-pinned-filters is still reachable from the repo's front door,
     * which is where a reviewer picks between two takes on one screen.
     */
    'Shipper TMS': 'oms.orders',
    Shipper: 'oms.orders', // older prototypes use the short label
    Finance: 'rate-configuration', // staging: /finance/rates
    Enterprise: 'resource-availability', // Enterprise → Fleet
    Taskboard: 'taskboard-redesign',
    Admin: 'admin.legal', // staging: /admin/legal

    // ---- Submenu items ----------------------------------------------------
    Orders: 'oms.orders',
    Rates: 'rate-configuration',
    Rate: 'rate-configuration', // rate-configuration's own submenu label
    Fleet: 'resource-availability',
    'Resource Availability': 'resource-availability',
    Legal: 'admin.legal',
  };

  /*
   * Only look inside things that are actually navigation. Matching on label text
   * across the whole page would wire up table cells and headings that happen to
   * say "Orders".
   */
  var NAV_ROOTS = 'cca-side-menu, cca-side-submenu, aside, [data-nav]';

  var CLICKABLE = 'a, button, [role="button"], .menu-item, .navitem, cca-side-menu-item, .sub-item';

  /*
   * The clickable thing for a label is rarely the element holding the text, so
   * walk up to the nearest link-shaped ancestor. When there is none — some
   * prototypes render a sidebar with plain divs — fall back to the parent.
   *
   * That fallback needs a guard. A submenu section HEADING is a bare span whose
   * text can match a NAV label ("Admin" heads the Admin submenu as well as
   * naming the rail item), and its parent is the column holding every item in
   * the section. Wiring that would turn the whole column into one link.
   *
   * So refuse the fallback when the parent already contains link-shaped
   * children: that makes it a list of nav items, not one nav item, and the
   * label is a heading over them rather than a label for them.
   */
  function clickableFor(el, root) {
    var linkish = el.closest(CLICKABLE);
    if (linkish) return linkish;

    var parent = el.parentElement;
    if (!parent || parent === root) return el;
    if (parent.querySelector(CLICKABLE)) return null;
    return parent;
  }

  function wire() {
    var roots = document.querySelectorAll(NAV_ROOTS);
    if (!roots.length) return;

    roots.forEach(function (root) {
      root.querySelectorAll('*').forEach(function (el) {
        /*
         * The label lives in different places depending on who built the page:
         * a <span> of its own in the platform markup, but a bare text node
         * sitting next to an <svg> in taskboard-redesign's .navitem divs. So
         * check the element's OWN text — its direct text nodes only — which
         * covers both without matching a whole container.
         */
        var ownText = '';
        for (var i = 0; i < el.childNodes.length; i++) {
          if (el.childNodes[i].nodeType === 3) ownText += el.childNodes[i].nodeValue;
        }
        var label = ownText.trim();
        if (!label || !Object.prototype.hasOwnProperty.call(NAV, label)) return;

        var screen = NAV[label];
        var target = clickableFor(el, root);
        if (!target || target.hasAttribute('data-screen')) return;

        // Never turn the page you are already on into a link to itself.
        if (window.CCA_ROUTES && window.CCA_ROUTES.current === screen) {
          target.setAttribute('data-current-screen', '');
          return;
        }

        target.setAttribute('data-screen', screen);
        target.style.cursor = 'pointer';
      });
    });

    // routes.js resolved links on its own load; anything wired here needs a
    // second pass to pick up real hrefs.
    if (window.CCA_ROUTES && window.CCA_ROUTES.resolve) window.CCA_ROUTES.resolve();
  }

  /*
   * Some prototypes render their sidebar with JavaScript — rate-configuration is
   * a Claude Design export running React, so the markup this wires is replaced a
   * moment after the page loads, taking the attributes with it.
   *
   * So wire on load, then keep watching. wire() is idempotent (it skips anything
   * already carrying data-screen), and the observer listens for childList only —
   * watching attributes as well would retrigger on wire()'s own writes and spin.
   */
  function schedule() {
    if (schedule.queued) return;
    schedule.queued = true;
    setTimeout(function () {
      schedule.queued = false;
      wire();
    }, 50);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wire);
  } else {
    wire();
  }

  if (window.MutationObserver) {
    new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
  }

  window.CCA_NAV = { map: NAV, wire: wire };
})();
