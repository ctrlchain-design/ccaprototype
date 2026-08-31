/*
 * The platform shell, defined once
 * ================================
 *   <script src="../_shared/shell-markup.js"></script>   (before routes.js/nav.js)
 *
 * The rail and the top bar's trailing cluster are the same in every screen of
 * the product, so they are the same in every prototype — and that only stays
 * true if there is ONE definition. Copying the markup into each index.html is
 * how two prototypes end up disagreeing about whether the rail has an Inbox
 * item, which is drift a reviewer sees before they see the design.
 *
 * So a prototype declares where the shell goes and this file fills it in:
 *
 *   <cca-side-menu data-rail="Admin"></cca-side-menu>
 *   <div data-top-bar-trailing></div>
 *
 * `data-rail` names the active domain. Add a rail item here and every prototype
 * gets it on next load; there is nothing to copy.
 *
 * Submenus are here too, one per domain — see SUBMENUS. There is no single
 * submenu to share (Admin's items are not Shipper TMS's), but a domain has more
 * than one screen, so each domain's list still gets exactly one definition:
 *
 *   <cca-side-submenu data-submenu="admin" data-submenu-active="Legal">
 *
 * Everything below was read off the running app, not designed here. The icon
 * names in particular are not guessable: Dashboard is `dashboardkpi`, Shipper
 * TMS is `boxes`, Release Notes is `no-more-task`, Admin is `Gear-Settings`.
 */
(function () {
  'use strict';

  // A prototype one level down reaches the repo root with '../'; a nested one
  // says so with data-root on <html>, the same convention routes.js uses.
  function root() {
    return document.documentElement.getAttribute('data-root') || '../';
  }

  function icon(name) {
    return (
      '<cca-icon><mat-icon class="mat-icon notranslate cca-icon cca-icon-' + name +
      ' mat-icon-inline" aria-hidden="true"></mat-icon></cca-icon>'
    );
  }

  /*
   * The rail, in the app's own order. `null` is a divider — the app groups the
   * domains with three of them and the grouping is meaningful, so keep them
   * where they are rather than tidying them away.
   *
   * `badge` renders the .new-feature label badge over the tile. Inbox is the
   * only item carrying one today.
   */
  var RAIL = [
    { label: 'Booking', icon: 'booking' },
    null,
    { label: 'Home', icon: 'home' },
    { label: 'Dashboard', icon: 'dashboardkpi' },
    { label: 'Inbox', icon: 'message-inbox', badge: 'New' },
    { label: 'Taskboard', icon: 'taskboard' },
    null,
    { label: 'Shipper TMS', icon: 'boxes' },
    { label: 'Carrier TMS', icon: 'truck' },
    null,
    { label: 'Enterprise', icon: 'group' },
    { label: 'Finance', icon: 'invoice-euro' },
    { label: 'Integrations', icon: 'swap' },
    { label: 'Release Notes', icon: 'no-more-task' },
    { label: 'Addressbook', icon: 'phonebook' },
    { label: 'Admin', icon: 'Gear-Settings' },
  ];

  function railItem(item, active) {
    var badge = item.badge
      ? '<cca-label-badge class="absolute top-0 right-0 z-10" style="display:block">' +
        '<div class="flex w-fit items-center gap-1 rounded-lg px-1.5 py-0.5 text-cca-label-sm whitespace-nowrap new-feature">' +
        item.badge + '</div></cca-label-badge>'
      : '';
    return (
      '<cca-side-menu-item style="display: block; width: 100%">' +
      '<a class="a-menu-item' + (item.label === active ? ' active' : '') + '" href="#"><div class="menu-item">' +
      badge + icon(item.icon) +
      '<span class="menu-item-title">' + item.label + '</span>' +
      '</div></a></cca-side-menu-item>'
    );
  }

  function railHtml(active) {
    var items = RAIL.map(function (item) {
      return item === null
        ? '<hr class="my-2 w-full border-NC-blue-lighter opacity-50" />'
        : railItem(item, active);
    }).join('');

    /*
     * Dark and Collapse sit at the bottom and are wired by _shared/shell.js
     * through data-theme-toggle / data-submenu-toggle. Both use the platform's
     * own mechanisms — a `dark` class on the root element, and `smallSideNav`
     * on cca-main. Note smallSideNav is the EXPANDED state, despite the name.
     */
    var footer =
      '<div class="mt-auto flex flex-col gap-2">' +
      '<hr class="my-2 w-full border-NC-blue-lighter opacity-30" />' +
      '<div class="menu-item" role="button" tabindex="0" data-theme-toggle>' +
      icon('moon') + '<span class="menu-item-title">Dark</span></div>' +
      '<div class="menu-item submenu-toggle" role="button" tabindex="0" data-submenu-toggle>' +
      icon('chevrons-left') + '<span class="menu-item-title">Collapse</span></div>' +
      '</div>';

    return (
      '<div class="menu-wrapper">' +
      '<div class="logo-wrapper cursor-pointer">' +
      '<img class="w-8" src="' + root() + 'design-system/dist/assets/images/ctrlchain-logo-white.svg" alt="CtrlChain" />' +
      '</div>' +
      '<div class="side-menu"><div class="menu-items">' + items + footer + '</div></div>' +
      '</div>'
    );
  }

  /*
   * Submenus, one per domain.
   *
   * Unlike the rail, there is no single submenu to share — Admin's items are not
   * Shipper TMS's. But there is one per DOMAIN, and a domain has more than one
   * screen, so the copy still has to be avoided: legal/admin and the legal
   * document page would otherwise carry two copies of the Admin list.
   *
   * A page names the domain and which item is current:
   *
   *   <cca-side-submenu data-submenu="admin" data-submenu-active="Legal">
   *
   * `action` is the domain's primary button, if it has one. Admin has none.
   * Icon names are read off the running app, not guessed.
   */
  var SUBMENUS = {
    admin: {
      title: 'Admin',
      items: [
        { label: 'Translations', icon: 'translation' },
        { label: 'Glossary', icon: 'file-image' },
        { label: 'Legal', icon: 'file-certificate' },
        { label: 'Logging', icon: 'receipt' },
        { label: 'Projection', icon: 'eye' },
        { label: 'Migrations', icon: 'exchange' },
        { label: 'Surcharge Keys', icon: 'key' },
      ],
    },
    'shipper-tms': {
      title: 'Shipper TMS',
      action: 'New Request',
      items: [
        { label: 'Spot Quotes', icon: 'request' },
        { label: 'Orders', icon: 'list' },
        { label: 'RFP', icon: 'messages-euro' },
        { label: 'Contracted Lanes', icon: 'route' },
      ],
    },
  };

  function submenuHtml(key, active) {
    var menu = SUBMENUS[key];
    if (!menu) return '';

    var action = menu.action
      ? '<div class="flex w-full flex-col gap-4 border-b border-neutral-default p-4">' +
        '<button ccaButton type="button" class="cca-btn cca-btn--primary icon-button-rounded w-full shadow">' +
        icon('plus') + menu.action + '</button></div>'
      : '';

    var items = menu.items
      .map(function (item) {
        return (
          '<a class="sub-item' + (item.label === active ? ' active' : '') + '" href="#">' +
          icon(item.icon) +
          '<span class="text-cca-base font-normal wrap-break-word">' + item.label + '</span></a>'
        );
      })
      .join('');

    return (
      '<div class="submenu-container">' +
      '<div class="min-h-15 w-full content-center border-b border-neutral-default">' +
      '<img class="mr-auto max-w-32 px-4 py-3" src="' + root() + 'design-system/dist/assets/images/ctrlchain-text-green.svg" alt="CtrlChain" />' +
      '</div>' +
      action +
      '<div class="flex w-full flex-col gap-4">' +
      '<span class="mt-4 pl-4 font-medium text-neutral-caption">' + menu.title + '</span>' +
      items +
      '</div></div>'
    );
  }

  /*
   * The top bar's trailing cluster: Contact Support, the notification bell with
   * its count, the language switch and the avatar.
   *
   * STAGING IS NOT A RELIABLE REFERENCE for this cluster. Staging shows neither
   * Contact Support nor the flag; production has both. Check production, or
   * ask, before "correcting" this against a staging screenshot.
   */
  function topBarTrailingHtml(options) {
    var opts = options || {};
    var initials = opts.initials || 'AF';
    var count = opts.notifications == null ? 17 : opts.notifications;

    return (
      '<div class="mr-5 ml-auto flex h-full items-center">' +
      '<button ccaButton type="button" class="cca-btn cca-btn--tertiary">Contact Support</button>' +
      '<span class="mr-2 ml-2 block h-6 border-l border-neutral-default"></span>' +
      /*
       * The badge classes stay on the BUTTON, where the app puts them. What they
       * needed was the right overlap: Material's -12px lands the badge on the
       * button's corner, and the button pads the icon by 12px, so the count
       * ended up a padding's width clear of the bell. proto-badge-on-icon pulls
       * it in by that padding so it sits on the glyph instead.
       */
      '<button ccaButton type="button" aria-label="Notifications" class="cca-btn cca-btn--icon mat-badge ' +
      'mat-badge-overlap mat-badge-above mat-badge-after mat-badge-small proto-badge-on-icon">' +
      '<cca-icon class="text-neutral-subtitle">' +
      '<mat-icon class="mat-icon notranslate cca-icon cca-icon-bell mat-icon-inline" aria-hidden="true"></mat-icon></cca-icon>' +
      /*
       * Two classes, both load-bearing:
       *
       *   mat-badge-small      The platform's own size step — 16px rather than the
       *                        medium 22px. A size modifier, not a hand-picked
       *                        number.
       *   mat-badge-active     Material parks the badge at `transform: scale(0.6)`
       *                        and only releases it with
       *                        `.mat-badge-content.mat-badge-active { transform: none }`,
       *                        which Angular adds once the badge renders. A static
       *                        page has to add it, or the badge sits at 60% — 13px
       *                        where it should be 22px, which reads as "slightly
       *                        wrong" rather than as a missing class.
       *   proto-badge-critical Red instead of the platform's default green. See
       *                        _shared/prototype.css for why no utility can do it.
       */
      '<span class="mat-badge-content mat-badge-active proto-badge-critical">' + count + '</span></button>' +
      '<span class="mr-4 ml-2 block h-6 border-l border-neutral-default"></span>' +
      '<cca-language-switch style="display: block">' +
      '<button ccaButton type="button" class="cca-btn cca-btn--tertiary flex">' +
      '<span class="font-medium text-neutral-subtitle"><span class="flex items-center">' +
      '<img class="mr-3 h-6 w-6 rounded-sm" src="' + root() + '_shared/assets/flags/en.svg" alt="" />' +
      '<span class="text-cca-base">English</span></span></span></button>' +
      '</cca-language-switch>' +
      '<span class="mx-4 block h-6 border-l border-neutral-default"></span>' +
      '<cca-header-menu class="header-menu" style="display: block">' +
      '<cca-avatar-group style="display: block">' +
      '<button type="button" class="flex h-10 w-10 items-center justify-center rounded-full avatar-bg-color ' +
      'text-cca-label-md avatar-initials-white" aria-label="Account menu" data-user-menu>' +
      initials + '</button></cca-avatar-group></cca-header-menu>' +
      '</div>'
    );
  }

  /*
   * The account menu, behind the avatar.
   *
   * Two of these are the platform's links to its own legal documents — the ones
   * a reader follows to READ the terms, which open a modal showing the live
   * version's text or PDF. They are not the admin's version manager. See the
   * note at the top of legal/admin-document, and the pattern in patterns.html.
   *
   * They are written as data-screen links, so they explain themselves today and
   * start working the day that modal is built, with no edit here. Logout is not
   * a screen, so it says what it would do instead.
   */
  var USER_MENU = [
    { label: 'Profile', screen: 'profile' },
    { label: 'Privacy policy', screen: 'legal.privacy' },
    { label: 'Cookie preferences', screen: 'legal.cookies' },
    { label: 'Terms of Use & Terms of Service', screen: 'legal.terms' },
    { divider: true },
    { label: 'Logout' },
  ];

  function userMenuHtml() {
    var items = USER_MENU.map(function (item) {
      if (item.divider) return '<mat-divider class="mat-divider" style="display:block"></mat-divider>';
      return (
        '<button ccaButton type="button" class="mat-mdc-menu-item" role="menuitem"' +
        (item.screen ? ' data-screen="' + item.screen + '"' : ' data-user-menu-action="' + item.label + '"') +
        '><span class="mat-mdc-menu-item-text">' + item.label + '</span></button>'
      );
    }).join('');

    return (
      '<div class="cdk-overlay-container" id="proto-user-menu-overlay" hidden>' +
      '<div class="cdk-overlay-backdrop cdk-overlay-transparent-backdrop" data-user-menu-close></div>' +
      '<div class="cdk-overlay-pane proto-menu-pane" id="proto-user-menu-pane">' +
      '<div class="mat-mdc-menu-panel surface-neutral-light" role="menu">' +
      '<div class="mat-mdc-menu-content">' + items + '</div>' +
      '</div></div></div>'
    );
  }

  function wireUserMenu() {
    if (document.getElementById('proto-user-menu-overlay')) return;
    document.body.insertAdjacentHTML('beforeend', userMenuHtml());

    var overlay = document.getElementById('proto-user-menu-overlay');
    var pane = document.getElementById('proto-user-menu-pane');

    function close() {
      overlay.hidden = true;
    }

    document.addEventListener('click', function (e) {
      var trigger = e.target.closest('[data-user-menu]');
      if (trigger) {
        var r = trigger.getBoundingClientRect();
        overlay.hidden = false;
        // Right-aligned under the avatar, the way a header menu hangs.
        pane.style.top = r.bottom + 4 + 'px';
        pane.style.left = Math.max(8, r.right - pane.offsetWidth) + 'px';
        return;
      }
      if (e.target.closest('[data-user-menu-close]')) return close();

      var action = e.target.closest('[data-user-menu-action]');
      if (action) {
        close();
        if (window.CCA_ROUTES) {
          window.CCA_ROUTES.notice('“' + action.getAttribute('data-user-menu-action') + '” is not part of this prototype.');
        }
        return;
      }
      // A data-screen item: routes.js handles it, this only closes the menu.
      if (e.target.closest('#proto-user-menu-overlay [data-screen]')) close();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  }

  /*
   * Fill the placeholders. Only ever writes into an element that is EMPTY, so a
   * prototype that has a reason to hand-write its shell keeps it — and so this
   * cannot clobber anything on a second call.
   */
  function render() {
    document.querySelectorAll('cca-side-menu[data-rail]').forEach(function (el) {
      if (el.children.length) return;
      el.innerHTML = railHtml(el.getAttribute('data-rail'));
    });

    document.querySelectorAll('cca-side-submenu[data-submenu]').forEach(function (el) {
      if (el.children.length) return;
      el.innerHTML = submenuHtml(el.getAttribute('data-submenu'), el.getAttribute('data-submenu-active'));
    });

    document.querySelectorAll('[data-top-bar-trailing]').forEach(function (el) {
      if (!el.children.length) wireUserMenu();
      if (el.children.length) return;
      el.outerHTML = topBarTrailingHtml({
        initials: el.getAttribute('data-initials') || undefined,
        notifications: el.getAttribute('data-notifications') || undefined,
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }

  window.CCA_SHELL = { rail: RAIL, railHtml: railHtml, submenus: SUBMENUS, submenuHtml: submenuHtml, userMenu: USER_MENU, topBarTrailingHtml: topBarTrailingHtml, render: render };
})();
