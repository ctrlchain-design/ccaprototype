/*
 * Order detail — the Basic Info tab
 * ---------------------------------
 * Structure read off development.ctrlchain.com/shipper-tms/order/detail/{ref}/info
 * on 2026-09-03. Content is entirely from _shared/data.js: that page carries
 * live customer data behind an ISO 27001 notice, and this repo publishes.
 *
 * Kept out of index.html deliberately — see the note at the top of that file.
 */
(function () {
  'use strict';

  var D = window.CCA_DATA;
  var id = window.CCA_ROUTES.param('id');
  var order = id ? D.orderDetail(id) : null;

  var titleHost = document.getElementById('page-title');
  var tabsHost = document.getElementById('tabs');
  var bodyHost = document.getElementById('tab-body');

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function icon(name) {
    return (
      '<cca-icon><mat-icon class="mat-icon notranslate cca-icon cca-icon-' + name +
      ' mat-ligature-font mat-icon-inline" aria-hidden="true"></mat-icon></cca-icon>'
    );
  }

  /* ------------------------------------------------------------- fragments */

  /*
   * A label over a value — the page's most-repeated shape, and the one the app
   * calls cca-detail-item. That element has NO CSS in the export, which is why
   * this composes it: the styling is entirely utilities on the children.
   * `text-2xs` on the label is the platform's smallest step and is what staging
   * uses here.
   */
  function field(label, value) {
    return (
      '<div class="overflow-hidden">' +
      '<p class="text-2xs text-neutral-caption">' + esc(label) + '</p>' +
      '<p class="text-cca-base-sm text-neutral-body">' + (value || '-') + '</p>' +
      '</div>'
    );
  }

  /* Two columns of fields, as every information block on the page is laid out. */
  function fieldGrid(pairs) {
    return (
      '<div class="grid grid-cols-2 gap-x-4 gap-y-3">' +
      pairs.map(function (p) { return field(p[0], p[1]); }).join('') +
      '</div>'
    );
  }

  /*
   * A card. Section headings are a CLASSLESS <h2> — the platform styles h1/h2/h3
   * globally and the app relies on it, so adding a text-cca-* utility here would
   * silently shrink the heading. Confirmed against staging, whose markup is
   * literally `<h2>Finance Summary</h2>`.
   */
  function card(heading, action, body) {
    return (
      /* `page-container` IS the card — radius-xl, 1px border-neutral-default,
         surface-neutral-light, and padding that steps 4 → 6 at a breakpoint.
         This hand-rolled `rounded-lg … p-4`, which is the wrong radius and
         loses the responsive padding. The <h2> is classless: the platform
         styles headings globally. */
      '<section class="page-container">' +
      '<div class="flex items-start justify-between gap-4">' +
      '<h2>' + esc(heading) + '</h2>' +
      (action || '') +
      '</div>' +
      '<div class="mt-4">' + body + '</div>' +
      '</section>'
    );
  }

  /* A sub-block within a card: the same header row, no border of its own. */
  function block(heading, action, body) {
    return (
      '<div class="mt-5">' +
      '<div class="flex items-start justify-between gap-4">' +
      '<h4 class="text-neutral-title">' + esc(heading) + '</h4>' +
      (action || '') +
      '</div>' +
      '<div class="mt-3">' + body + '</div>' +
      '</div>'
    );
  }

  /*
   * A card-header action — Edit, Translate, Cargo Planner. These were anchors
   * on `.proto-header-link`, a class this repo DELETED on purpose: see the note
   * at the top of _shared/prototype.css. So they were rendering unstyled, and
   * an action that changes the order was marked up as a link to nowhere.
   *
   * The app's is a real button on the button component:
   *   <button ccaButton hierarchy="tertiary" size="small"
   *           class="cca-btn cca-btn--small cca-btn--tertiary">Edit</button>
   *
   * cca-btn--tertiary is already undecorated and brand-coloured, and carries
   * the hover, focus and active states the workaround never had.
   */
  function headerAction(text, glyph) {
    return (
      '<button ccaButton hierarchy="tertiary" size="small" type="button" ' +
      'class="cca-btn cca-btn--small cca-btn--tertiary shrink-0">' +
      (glyph ? '<cca-icon>' + icon(glyph) + '</cca-icon>' : '') + esc(text) + '</button>'
    );
  }

  /*
   * A reference that navigates. `text-cca-link` is the bundle's own link type
   * style, paired with text-brand-default as the app pairs it.
   *
   * Cross-prototype links go through the SCREEN REGISTRY, never a folder path
   * or href="#" — see _shared/routes.js. Neither the trip nor the contracted
   * lane screen is built yet, and that is fine: routes.js shows its
   * not-built-yet snackbar, and the link starts working the day someone
   * registers the screen, with no edit here.
   */
  function link(text, screen, params) {
    return (
      '<a class="cursor-pointer text-cca-link text-brand-default" href="#"' +
      (screen ? ' data-screen="' + esc(screen) + '"' : '') +
      (params ? " data-params='" + JSON.stringify(params) + "'" : '') +
      '>' + esc(text) + '</a>'
    );
  }

  function statusBadge(text, flavor) {
    /* px-2.5/text-cca-base-sm — the DEFAULT size. A detail page is roomy; the
       Compact one belongs in a dense table. Staging uses this here. */
    return (
      '<cca-status-badge><div class="flex w-fit items-center justify-center rounded-full ' +
      'px-2.5 py-1 whitespace-nowrap font-medium text-cca-base-sm ' + flavor + '">' +
      esc(text) + '</div></cca-status-badge>'
    );
  }

  /*
   * THE ORDERS TABLE'S TYPE BADGE, character for character — oms/index.html's
   * smallLabelBadge on the `neutral` flavour. One order type should not read
   * differently depending on which screen you are looking at.
   *
   * No `border` utility: `emphasis-outline` already supplies border-width 1px
   * and border-color, and `cca-label-badge .neutral.emphasis-outline` outranks
   * a one-class utility anyway — the `border border-transparent` this used to
   * carry was inert.
   */
  function typeBadge(text) {
    return (
      '<cca-label-badge><div class="flex w-fit items-center gap-1 rounded-lg ' +
      'whitespace-nowrap px-1.5 py-0.5 text-cca-label-sm leading-4 font-normal ' +
      'neutral emphasis-outline">' + esc(text) + '</div></cca-label-badge>'
    );
  }

  /* A dot and a label — cca-text-badge, which is how Finance Summary reads. */
  function dotValue(text, flavor) {
    return (
      '<cca-text-badge><span class="flex items-center gap-2 ' + flavor + '">' +
      '<span class="dot inline-block h-2 w-2 rounded-full"></span>' +
      '<span class="text-cca-base-sm">' + esc(text) + '</span></span></cca-text-badge>'
    );
  }

  /* A timestamp, through the design system's own date cell. */
  function stamp(label, date, time) {
    return (
      '<cca-date-cell class="flex-col gap-1">' +
      (label ? '<span class="text-2xs text-neutral-caption">' + esc(label) + '</span>' : '') +
      '<span class="flex items-center gap-1.5 whitespace-nowrap">' +
      '<span class="text-neutral-caption">' + icon('clock') + '</span>' +
      '<span class="text-cca-base-sm text-neutral-body">' + esc(date) + '</span>' +
      '<span class="text-cca-base-sm text-neutral-body">' + esc(time) + '</span>' +
      '</span></cca-date-cell>'
    );
  }

  /* --------------------------------------------------------- the two ends */

  /* Transport and invoice orders carry pickup/delivery; warehouse ones carry
     origin/destination. Same branch as the list — on warehouse, not transport,
     because invoice records use the transport shape. */
  function ends(o) {
    return o.domain === 'warehouse'
      ? { a: o.origin, b: o.destination }
      : { a: o.pickup, b: o.delivery };
  }

  var win = function (w) {
    if (!w) return { from: '', to: '' };
    return typeof w === 'string' ? { from: w, to: w } : { from: w.from, to: w.to || w.from };
  };

  /* ------------------------------------------------------------- sections */

  /*
   * THE TOP OF THE PAGE IS ONE CARD, NOT THREE. This had the route bar, the
   * status row and Map Overview as three stacked cards; on the app they are a
   * single `page-container` — cca-order-map — holding cca-detail-header, a
   * rule, cca-status-overview and then the map, with Map Overview floating on
   * the map as an absolute panel rather than spanning the width.
   *
   * The trip indicator was the other tell: staging fixes it at `w-40` so the
   * two ends and the line read as one cluster on the left. This stretched the
   * connector with `flex-1`, which pushed the ends to opposite edges and drew
   * the long rule that did not look like the app.
   */
  function detailHeader(o) {
    var e = ends(o);
    var end = function (label, x) {
      return (
        '<div class="flex flex-col">' +
        '<span class="text-cca-label-sm text-neutral-caption">' + esc(label) + '</span>' +
        '<h1>' + esc(x.city) + '</h1>' +
        '<div class="text-cca-base-sm font-medium text-neutral-subtitle">' + esc(x.date) + '</div>' +
        '</div>'
      );
    };
    var dot = '<span class="flex h-4 w-4 shrink-0 rounded-full border-2 border-solid ' +
              'border-brand-default surface-neutral-light"></span>';
    /*
     * A REEFER'S, NOT A WAREHOUSE ORDER'S. temperatureRange comes from the
     * shared ORDER_DETAIL block, so it rendered on every order — a warehouse
     * order was showing a required range and a disconnected sensor it has no
     * claim to. Gated on the transport domain rather than on the field being
     * present.
     */
    var temp = o.domain !== 'warehouse' && o.detail.cargo.temperatureRange
      ? '<div class="flex items-center gap-2">' +
        '<span class="text-neutral-caption">' + icon('temperature-3') + '</span>' +
        '<div><p class="text-2xs text-neutral-caption">Required: ' +
        '<span class="text-neutral-body">' + esc(o.detail.cargo.temperatureRange) + '</span></p>' +
        '<p class="text-2xs text-neutral-caption">Current: ' +
        '<span class="critical-text">Disconnected</span></p></div></div>'
      : '';
    return (
      '<cca-detail-header class="block">' +
      '<div class="flex flex-col justify-between gap-4">' +
      '<div class="flex items-center justify-between gap-4">' +
      '<header class="flex w-full flex-wrap items-center justify-between gap-2">' +
      '<div class="flex items-center gap-8">' +
      end(o.domain === 'warehouse' ? 'Origin' : 'First Pickup', e.a) +
      '<cca-trip-indicator class="block">' +
      '<div class="relative flex flex-col items-center gap-1 pt-1">' +
      '<div class="flex w-40 items-center">' + dot +
      '<span class="flex h-1 w-full items-center justify-center surface-brand-light"></span>' +
      dot + '</div>' +
      /* A warehouse order has no road distance of its own — that belongs to the
         transport leg. Better a bare connector than a borrowed number. */
      (o.domain === 'warehouse' ? '' :
        '<span class="text-cca-base-sm font-medium info-text">' +
        esc(o.detail.route.distance) + '</span>') +
      '</div></cca-trip-indicator>' +
      end(o.domain === 'warehouse' ? 'Destination' : 'Last Delivery', e.b) +
      '</div>' + temp + '</header>' +
      /*
       * The header's right-hand cluster. The button and the kebab are wrapped
       * together rather than left as siblings of <header>, because the row is
       * `justify-between` — as siblings the three children would space out
       * across the full width instead of the actions sitting together.
       */
      '<div class="flex shrink-0 items-center gap-2">' +
      /*
       * NEW NCR — a non-conformance report, raised against a warehouse order
       * when what arrived or shipped does not match what was expected. Primary
       * because it is the one thing this page invites you to do; transport
       * orders do not raise NCRs, so they do not get it.
       */
      (o.domain === 'warehouse'
        ? '<button ccaButton hierarchy="primary" type="button" ' +
          'class="cca-btn cca-btn--primary">New NCR</button>'
        : '') +
      /*
       * `subtle`, not `tertiary`. cca-btn--tertiary sets `border: none`, so the
       * kebab had no outline at all; cca-btn--subtle recolours the base rule's
       * `1px solid transparent` to button-subtle-border-default (#d9d9d9).
       * It is also the hierarchy the app uses on this exact button.
       */
      '<button ccaButton hierarchy="subtle" type="button" ' +
      'class="cca-btn cca-btn--subtle cca-btn--icon-only" aria-label="Order actions">' +
      icon('ellipsis-vertical') + '</button>' +
      '</div>' +
      '</div>' +
      '<hr />' +
      statusOverview(o) +
      '</div></cca-detail-header>'
    );
  }

  function statusLine(o) {
    var e = ends(o);
    var a = win(e.a.window);
    var b = win(e.b.window);
    var raised = 'Order raised on ' + esc(o.createdAt) + ' • ' + esc(o.createdTime);
    switch (o.status) {
      case 'Completed':
      case 'Delivered':
        return 'Cargo unloaded at ' + esc(e.b.date) + ' • ' + esc(b.to);
      case 'Departed':
      case 'In Transit':
        return 'In transit since ' + esc(e.a.date) + ' • ' + esc(a.from);
      case 'Loaded':
        return 'Cargo loaded at ' + esc(e.a.date) + ' • ' + esc(a.to);
      case 'Truck Arrived':
        return 'Truck arrived at ' + esc(e.a.date) + ' • ' + esc(a.from);
      case 'Searching for Carrier':
        return 'Awaiting carrier assignment';
      case 'Carrier Informed':
        return 'Carrier informed — awaiting pickup on ' + esc(e.a.date);
      case 'Missing POD':
        return 'Delivered ' + esc(e.b.date) + ' — proof of delivery outstanding';
      case 'Cancelled':
        return 'Cancelled';
      default:
        return raised;
    }
  }

  function statusOverview(o) {
    return (
      '<cca-status-overview class="block">' +
      '<div class="flex items-center justify-between gap-4">' +
      '<div class="flex items-center gap-4">' + statusBadge(o.status, o.statusFlavor) +
      '<p class="text-cca-base font-medium text-neutral-body">' + statusLine(o) + '</p>' +
      '</div>' +
      '<button ccaButton hierarchy="secondary" type="button" ' +
      'class="cca-btn cca-btn--secondary shrink-0" data-open-timeline>Shipment updates</button>' +
      '</div></cca-status-overview>'
    );
  }

  /*
   * The map, and Map Overview floating on it. No map runtime in a static
   * prototype and the export ships no tiles, so the region is an honest empty
   * plate rather than a fake picture of a route — but the overlay panel is
   * where the app puts it, top-left and `w-75`, not a full-width row.
   */
  /*
   * The map. There is no map runtime in a static prototype and the export
   * ships no tiles, so this is a SCHEMATIC of the route rather than either a
   * blank plate or a fake photograph of one — it reads as a map at a glance,
   * says out loud that it is not live, and invents no colours: the roads are
   * border-neutral-default, the route is border-brand-default, and the stops
   * are the real cca-marker-pin.
   *
   * marker-pin.css is a FEATURE component (isDesignSystem: false in
   * manifest.json) rather than an official one, but it is still FE's own
   * exported CSS, so its pins beat any I would draw. `.tail.location` has no
   * width on purpose — its 1px left and right borders ARE the 2px stalk under
   * the circle, which is why it must stay a bare span in a centred flex
   * column.
   */
  function mapRegion(o) {
    var e = ends(o);
    var pin = function (n, x, y, label) {
      return (
        /* translate(-50%,-100%) puts the stalk's tip on the coordinate —
           the same inline transform staging uses on its own gmp markers. The
           bundle ships no translate-x-1/2 or -translate-y-full utility. */
        '<div class="absolute" style="left:' + x + '%;top:' + y + '%;' +
        'transform:translate(-50%,-100%)">' +
        '<cca-marker-pin title="' + esc(label) + '">' +
        '<div class="pin-container"><div class="flex flex-col items-center">' +
        '<span class="pin-content location"><span class="pin-label">' + n + '</span></span>' +
        '<span class="tail location"></span>' +
        '</div></div></cca-marker-pin></div>'
      );
    };
    /* Roads and the route, drawn once at 800x400 and scaled. The stroke keeps
       its width under the scale via vector-effect. */
    var art =
      '<svg class="absolute inset-0 h-full w-full" viewBox="0 0 800 400" ' +
      'preserveAspectRatio="none" aria-hidden="true" focusable="false">' +
      '<g fill="none" stroke="var(--border-neutral-default)" stroke-width="1" ' +
      'vector-effect="non-scaling-stroke">' +
      '<path d="M-20 96 H820 M-20 214 H820 M-20 322 H820" />' +
      '<path d="M132 -20 V420 M330 -20 V420 M548 -20 V420 M700 -20 V420" />' +
      '<path d="M-20 40 L240 160 L470 120 L820 250" />' +
      '<path d="M60 420 L210 250 L430 300 L620 200 L820 60" />' +
      '</g>' +
      /* The route itself, over the roads. */
      '<path d="M110 275 C 250 205, 330 330, 470 190 S 600 90, 675 120" fill="none" ' +
      'stroke="var(--border-brand-default)" stroke-width="3" stroke-linecap="round" ' +
      'vector-effect="non-scaling-stroke" />' +
      '</svg>';
    return (
      '<section class="relative h-100 w-full overflow-hidden rounded-xl surface-neutral-default">' +
      art +
      pin(1, 13.75, 68.75, e.a.city) +
      pin(2, 84.375, 30, e.b.city) +
      /* Says what it is, quietly, so nobody reviews this thinking the route is
         real geography. */
      '<div class="absolute bottom-4 left-0 flex w-full justify-center">' +
      '<p class="rounded-lg surface-neutral-light px-3 py-1 text-2xs text-neutral-caption">' +
      'Schematic — the app renders cca-order-map here, with the real route, ' +
      'via points and traceable objects.</p></div>' +
      /* Map Overview floats on the map, top-left, as cca-map-overview. Its own
         stylesheet is what shrinks the collapse button to 1.25rem. */
      '<cca-map-overview class="absolute top-3 left-3 block">' +
      '<div class="page-container flex h-min w-75 min-w-75 flex-col p-3" id="map-section">' +
      '<div class="flex flex-row items-center justify-between">' +
      '<h4>Map Overview (0)</h4>' +
      '<button ccaButton hierarchy="icon" type="button" class="cca-btn cca-btn--icon" ' +
      'data-toggle="map" aria-label="Toggle map overview">' +
      '<cca-icon><span id="map-chevron">' + icon('chevron-down') + '</span></cca-icon></button>' +
      '</div>' +
      '<div class="mt-3 hidden text-cca-base-sm text-neutral-caption" id="map-body">' +
      'Nothing traceable on this order.</div>' +
      '</div></cca-map-overview>' +
      '</section>'
    );
  }

  function financeSummary(o) {
    var rows = [
      ['Customer Invoice Status', o.customerInvoiceStatus || 'Not Invoiced',
       o.customerInvoiceStatus === 'Paid' ? 'primary' : 'neutral-caption'],
      /* No carrier on a warehouse order, so no carrier invoice to have a
         status. The row was reading "Not Invoiced" as though one were pending. */
      /* Warehouse orders now DO carry a haulier, but CtrlChain does not invoice
         it — so this row stays gated on the domain rather than on carrierGroup,
         which would have quietly brought it back. */
      o.domain === 'warehouse' ? null
        : (o.carrierGroup ? ['Carrier Invoice Status', 'Not Invoiced', 'neutral-caption'] : null),
      /* A warehouse order carries the three-state podStatus; transport still
         has only the podApproved boolean. */
      o.podStatus
        ? ['POD Status', o.podStatus, o.podStatus === 'Approved' ? 'primary' : 'neutral-caption']
        : ['POD Status', o.podApproved ? 'Approved' : 'Not approved',
           o.podApproved ? 'primary' : 'neutral-caption'],
    ];
    /*
     * Under the rows, not in the header: it acts on POD Status, which is the
     * last row, so it reads as following from the statuses rather than being an
     * action on the card as a whole. Secondary rather than the tertiary the
     * other card headers carry — a real deliverable, not an inline edit.
     *
     * WAREHOUSE ONLY. This was on both domains at first, on the reasoning that
     * Finance Summary shows POD Status either way. That was a call nobody asked
     * for, and it put a new button on the transport page after that page was
     * signed off. Transport can have it when someone asks for it there.
     */
    /*
     * ONLY WHEN A POD HAS ACTUALLY BEEN UPLOADED. Offering a download on an
     * order whose POD has not been sent is a button that cannot work.
     *
     * Read literally: it shows on `Uploaded` and not on `Approved`. Flagged
     * rather than assumed — an approved POD is by definition an uploaded one,
     * so if Approved should also offer the download, this is the line to
     * widen.
     */
    var downloadPod = (o.domain !== 'warehouse' || o.podStatus !== 'Uploaded') ? '' :
      '<div class="mt-4 border-t border-neutral-default pt-4">' +
      '<button ccaButton hierarchy="secondary" type="button" ' +
      'class="cca-btn cca-btn--secondary w-full" data-download-pod>' +
      icon('export') + 'Download POD</button></div>';
    return card('Finance Summary', '',
      '<div class="flex flex-col gap-3">' +
      rows.filter(Boolean).map(function (r) {
        return '<div class="flex items-center justify-between gap-4">' +
          '<span class="text-cca-base-sm text-neutral-caption">' + esc(r[0]) + '</span>' +
          dotValue(r[1], r[2]) + '</div>';
      }).join('') + '</div>' + downloadPod);
  }

  function avatar(initials) {
    return (
      '<cca-avatar-group style="display:block"><span class="grid h-8 w-8 min-w-8 ' +
      'place-content-center rounded-full surface-neutral-default text-cca-label-sm ' +
      'text-neutral-body">' + esc(initials) + '</span></cca-avatar-group>'
    );
  }

  function contacts(o) {
    var c = o.detail.contacts;
    /*
     * A WAREHOUSE ORDER HAS NO ASSIGNED OPERATOR BLOCK. Removed on request:
     * the operator is CtrlChain's own person, and on a warehouse order the
     * contact that matters is the client whose goods are being handled.
     *
     * Its shipper is also its own, not ORDER_DETAIL's. That shared record is
     * the transport fixture's Booker; a warehouse order's counterpart is the
     * client, with `role: 'Client'`, so each warehouse order carries a
     * shipperContact and this prefers it.
     */
    var wh = o.domain === 'warehouse';
    var shipper = (wh && o.shipperContact) || c.shipper;

    var operator = wh ? '' :
      '<div>' +
      '<p class="text-2xs text-neutral-caption">Assigned Operator</p>' +
      '<div class="mt-2 flex items-center gap-3">' + avatar(c.operator.initials) +
      '<div><p class="text-cca-base-sm text-neutral-body">' + esc(o.assignedOperator) + '</p>' +
      '<p class="flex items-center gap-1 text-2xs text-neutral-caption">' +
      icon('building') + esc(o.salesOrganisation) + '</p></div></div></div>';

    return card('Contacts', '',
      '<div class="flex flex-col gap-5">' + operator +
      '<div>' +
      '<p class="text-2xs text-neutral-caption">Shipper</p>' +
      '<div class="mt-2 flex items-center gap-3">' + avatar(shipper.initials) +
      '<div><p class="text-cca-base-sm text-neutral-body">' + esc(shipper.name) + '</p>' +
      '<p class="text-2xs text-neutral-caption">' + esc(shipper.role) + '</p>' +
      '<p class="flex items-center gap-1 text-2xs text-neutral-caption">' +
      icon('building') + esc(o.shipperGroup) + '</p>' +
      '<p class="flex items-center gap-1 text-2xs text-neutral-caption">' +
      icon('users') + esc(o.shipperSubGroup) + '</p>' +
      '<a class="cursor-pointer text-2xs text-brand-default underline" href="mailto:' +
      esc(shipper.email) + '">' + esc(shipper.email) + '</a>' +
      '</div></div></div></div>');
  }

  /*
   * Route Details. The planner's figures for the drawn route, and the one card
   * on this page staging heads with an h3 rather than an h2 — so it is built
   * by hand instead of through card().
   */
  function routeDetails(o) {
    var r = o.detail.route;
    return (
      '<section class="page-container">' +
      '<h3 class="flex items-center justify-between gap-4 text-neutral-body">Route Details' +
      headerAction('Edit') + '</h3>' +
      '<div class="mt-4">' + field('Avoid', esc(r.avoid)) + '</div>' +
      '<div class="mt-4 flex flex-wrap gap-6">' +
      [['Duration', r.duration], ['Total Distance', r.distance],
       ['Road Taxes', r.roadTaxes], ['CO2', r.co2]].map(function (f) {
        return field(f[0], esc(f[1]));
      }).join('') +
      '</div></section>'
    );
  }

  /*
   * Requested Vehicle(s) — what the shipper asked for, which is a different
   * thing from what turned up in Carrier & Vehicle Details. The app puts a
   * rendered vehicle image beside it; the export ships no vehicle artwork, so
   * this leads with the truck glyph rather than a missing-image box.
   */
  function requestedVehicle(o) {
    var v = o.detail.requestedVehicle;
    var dim = function (label, value) {
      return '<span class="flex gap-1"><span class="text-neutral-caption">' + label +
        ': </span><span>' + esc(value) + '</span></span>';
    };
    return card('Requested Vehicle(s)', '',
      '<div class="flex flex-wrap items-start gap-4">' +
      '<div class="grid h-20 w-32 place-items-center rounded-lg surface-neutral-default">' +
      '<span class="text-neutral-caption text-2xl">' + icon('truck') + '</span></div>' +
      '<div class="flex flex-1 flex-col gap-2 text-cca-base-sm text-neutral-body">' +
      '<div class="flex flex-wrap items-center gap-2"><h4>' + esc(v.kind) + '</h4>' +
      /* `match` — the flavor the app gives a body type that satisfies the
         request. Real on cca-label-badge; checked in cca-components.css. */
      '<cca-label-badge><div class="flex w-fit items-center gap-1 rounded-lg ' +
      'whitespace-nowrap px-1.5 py-1 text-cca-base-sm leading-5 font-normal match">' +
      esc(v.bodyType) + '</div></cca-label-badge></div>' +
      dim('Tail-Lift', v.tailLift) +
      '<div class="flex gap-3">' + dim('L', v.length) + dim('W', v.width) +
      dim('H', v.height) + '</div>' +
      dim('Max. weight', v.maxWeight) +
      '</div></div>');
  }

  /* An empty state, drawn the way cca-no-data draws one. */
  function noData(heading, note) {
    return (
      '<div class="flex w-full flex-col items-center justify-center gap-4 rounded-xl ' +
      'surface-neutral-default p-5 text-center text-neutral-body">' +
      '<span class="text-2xl text-neutral-disabled">' + icon('no-more-task') + '</span>' +
      '<div class="flex flex-col gap-1"><h4>' + esc(heading) + '</h4>' +
      (note ? '<p class="text-cca-base-sm text-neutral-caption">' + esc(note) + '</p>' : '') +
      '</div></div>'
    );
  }

  function parkingRequirements() {
    return card('Parking Requirements', '',
      noData('No parking requirements added yet', ''));
  }

  function loadSummary(o) {
    var g = o.detail.cargo;
    return card('Load Summary', headerAction('Edit'),
      '<h3 class="flex items-center gap-2 text-neutral-title">Cargo' + typeBadge(g.kind) + '</h3>' +
      '<h4 class="mt-4 text-neutral-title">General Information</h4>' +
      '<div class="mt-3">' + fieldGrid([
        ['Estimated Total Weight', esc(g.estimatedTotalWeight)],
        ['Estimated Value', esc(g.estimatedValue)],
        ['Temperature Sensitive',
         '<span class="flex items-center gap-1">' + icon('temperature-3') + esc(g.temperatureRange) + '</span>'],
        ['Food or Perishable', esc(g.foodOrPerishable)],
        ['Hazardous?', esc(g.hazardous)],
        ['Goods Palletised', esc(g.goodsPalletised)],
        ['Loading Method', esc(g.loadingMethod)],
        ['Maximum Number of Pallets', esc(g.maxPallets)],
        ['Maximum Pallet Height', esc(g.maxPalletHeight)],
        ['Description', esc(g.description)],
      ]) + '</div>' +
      palletInfo(o));
  }

  /*
   * Pallet Info is a BLOCK INSIDE Load Summary on staging, not a card of its
   * own — its only h2/h3 there is "Cargo Pallet", and Pallet Info is a plain
   * sub-label like General Information. It had its own card here, which read as
   * one section too many.
   */
  function palletInfo(o) {
    var p = o.detail.pallet;
    var e = ends(o);
    return block('Pallet Info', headerAction('Cargo Planner'),
      /* The pallet's name sits on its own tinted row, as staging draws it. */
      '<div class="rounded-lg surface-neutral-default px-3 py-2 text-cca-base-sm text-neutral-body">' +
      esc(p.name) + '</div>' +
      '<div class="mt-3">' + fieldGrid([
        ['Quantity', esc(p.quantity)],
        ['Description', esc(p.description)],
        ['Weight', esc(p.weight)],
        ['Requested Exchange', esc(p.requestedExchange)],
        ['Loading at', 'Stop 1 - ' + esc(e.a.city)],
        ['Unloading at', 'Stop 2 - ' + esc(e.b.city)],
        ['Actual Exchanged - Loading', esc(p.actualLoading)],
        ['Actual Exchanged - Unloading', esc(p.actualUnloading)],
      ]) + '</div>');
  }

  function carrierAndVehicle(o) {
    var v = o.detail.vehicle;
    var c = o.detail.contacts.carrierContact;
    /* Warehouse and invoice orders have no carrier — it belongs to the
       transport leg — so the card says so rather than showing empty fields. */
    /*
     * A WAREHOUSE ORDER'S CARRIER IS THE TRUCK AT THE DOCK, so it gets the
     * card without the shipment accordion transport wraps around it — that
     * accordion exists because one transport order can carry several legs,
     * each with its own carrier. A warehouse order is a single handling event.
     */
    if (o.domain === 'warehouse') {
      var wv = o.warehouseVehicle || {};
      return card('Carrier & Vehicle Details', '',
        '<p class="text-cca-label-md text-neutral-title">Carrier Company</p>' +
        '<p class="mt-2 flex items-center gap-1 text-cca-base-sm text-neutral-body">' +
        icon('building') + esc(o.carrierGroup) + '</p>' +
        '<p class="flex items-center gap-1 text-cca-base-sm text-neutral-body">' +
        icon('users') + esc(o.carrierSubGroup) + '</p>' +
        '<hr class="my-4 border-neutral-default" />' +
        '<p class="text-cca-label-md text-neutral-title">Vehicle</p>' +
        '<div class="mt-3">' + fieldGrid([
          ['Licence Plate Number', esc(wv.plate)],
          ['Dock', esc(o.warehouse && o.warehouse.dock)],
        ]) + '</div>' +
        '<hr class="my-4 border-neutral-default" />' +
        '<p class="text-cca-label-md text-neutral-title">Driver</p>' +
        '<div class="mt-3">' + fieldGrid([
          ['Name', esc(wv.driver)],
          ['Phone', esc(wv.phone)],
        ]) + '</div>');
    }
    if (!o.carrierGroup) {
      return card('Carrier & Vehicle Details', '',
        '<p class="text-cca-base-sm text-neutral-caption">' +
        (o.domain === 'warehouse'
          ? 'The carrier is on the linked transport order.'
          : 'An invoice order has no carrier.') + '</p>');
    }
    return card('Carrier & Vehicle Details', '', shipmentPanel(o,
      '<p class="text-cca-label-md text-neutral-title">Carrier Company</p>' +
      '<p class="mt-2 flex items-center gap-1 text-cca-base-sm text-neutral-body">' +
      icon('building') + esc(o.carrierGroup) + '</p>' +
      '<p class="flex items-center gap-1 text-cca-base-sm text-neutral-body">' +
      icon('users') + esc(o.carrierSubGroup) + '</p>' +
      '<p class="mt-3 text-2xs text-neutral-caption">Contact person</p>' +
      '<div class="flex flex-wrap gap-6">' +
      '<a class="flex items-center gap-1 text-cca-base-sm text-brand-default underline" ' +
      'href="tel:' + esc(c.phone.replace(/\s/g, '')) + '">' + icon('phone') + esc(c.phone) + '</a>' +
      '<a class="flex items-center gap-1 text-cca-base-sm text-brand-default underline" ' +
      'href="mailto:' + esc(c.email) + '">' + icon('mail') + esc(c.email) + '</a></div>' +
      '<hr class="my-4 border-neutral-default" />' +
      '<p class="text-cca-label-md text-neutral-title">Motor Vehicle</p>' +
      '<div class="mt-3">' + fieldGrid([
        ['Vehicle', esc(v.motor.vehicle)],
        ['Licence Plate Number', esc(v.motor.plate)],
        ['Truck Number', esc(v.motor.truckNumber)],
        ['Owner', esc(o.carrierSubGroup)],
      ]) + '</div>' +
      '<hr class="my-4 border-neutral-default" />' +
      '<p class="text-cca-label-md text-neutral-title">Trailer</p>' +
      '<div class="mt-3">' + fieldGrid([
        ['Vehicle Type',
         '<span class="flex items-center gap-2">' + esc(v.trailer.type) + typeBadge(v.trailer.bodyType) + '</span>'],
        ['Licence Plate Number', esc(v.trailer.plate)],
        ['Trailer Number', esc(v.trailer.trailerNumber)],
        ['Owner', esc(o.carrierSubGroup)],
      ]) + '</div>' +
      '<hr class="my-4 border-neutral-default" />' +
      '<p class="text-cca-label-md text-neutral-title">Driver</p>' +
      '<div class="mt-3">' + fieldGrid([
        ['Name', esc(v.driver.name)],
        ['Phone', esc(v.driver.phone)],
      ]) + '</div>'));
  }

  /*
   * THE CARRIER BLOCK IS PER SHIPMENT, NOT PER ORDER. Staging heads it with the
   * shipment's own reference — the order id plus a leg number — and the leg's
   * route, inside a collapsible, because one order can carry several shipments
   * and each gets its own carrier, vehicle and driver. Flattening it to a
   * single carrier, which is what this did, loses that: it reads as though an
   * order can only ever have one.
   */
  function shipmentPanel(o, body) {
    var e = ends(o);
    var where = function (x) {
      return esc(x.city) + ', ' + esc(x.country);
    };
    return (
      /* mat-expansion-panel brings its own white card: a border, a 10px radius
         and a Material elevation shadow. Nested inside this card it read as a
         card within a card. `mat-elevation-z` is what zeroes the shadow, and
         staging pairs it with a mat-accordion host — both load-bearing. */
      '<mat-accordion class="mat-accordion flex-1">' +
      '<mat-expansion-panel class="mat-expansion-panel mat-elevation-z mat-expanded ' +
      'border-0! bg-transparent! shadow-none!">' +
      '<div class="flex flex-col">' +
      '<span class="text-cca-label-sm uppercase text-neutral-subtitle">' +
      esc(o.id) + '.1</span>' +
      '<h3 class="text-neutral-body">' + where(e.a) + ' → ' + where(e.b) + '</h3>' +
      '</div>' +
      '<div class="mt-4">' + body + '</div>' +
      '</mat-expansion-panel></mat-accordion>'
    );
  }

  /*
   * A stop. Numbered, collapsible, with a Pickup/Delivery badge, the full
   * address, opening hours behind a Show More after five days, the location
   * type, instructions, and a totals footer.
   */
  function stopCard(n, kind, end, o, open) {
    var wh = o.domain === 'warehouse';
    var hours = o.detail.openingHours;
    /*
     * ORDER_DETAIL.totals is the transport fixture's — 3,500 kg over 10 items.
     * A warehouse order carries its own weight and pallet count, and showing
     * the shared numbers would have contradicted the order's own data on the
     * same screen. Exchange is not modelled for warehouse, so it says so.
     */
    var t = wh
      ? { weight: o.weightKg.toLocaleString('en-GB') + ' kg',
          items: String(o.pallets), exchangeNeeded: 'n/a', actualExchange: 'n/a' }
      : o.detail.totals;

    /*
     * OPENING HOURS AND THE TOTALS STRIP ARE TRANSPORT-ONLY.
     *
     * Both were reading off the shared ORDER_DETAIL fixture — one week of
     * 06:00-18:00 repeated on every stop of every order, including a customer
     * address where it is a guess. A warehouse order's stop card is down to
     * what it actually knows: the location's type and its instructions.
     *
     * The totals go with them. They belong to a transport stop, where what is
     * picked up and dropped off at each end is the point; on a warehouse order
     * the load is the order, not a per-stop split, so repeating the same
     * weight under both stops said nothing.
     */
    var openingHours =
      '<div><p class="text-2xs text-neutral-caption">Opening Hours</p>' +
      '<table class="mt-1 text-cca-base-sm text-neutral-body"><tbody>' +
      hours.slice(0, 5).map(function (h) {
        return '<tr><td class="pr-6 text-neutral-caption">' + esc(h.day) + '</td>' +
          '<td>' + esc(h.hours) + '</td></tr>';
      }).join('') +
      hours.slice(5).map(function (h) {
        return '<tr class="hidden" data-more="stop-' + n + '">' +
          '<td class="pr-6 text-neutral-caption">' + esc(h.day) + '</td>' +
          '<td>' + esc(h.hours) + '</td></tr>';
      }).join('') +
      '</tbody></table>' +
      /* cca-show-more-less — official (isDesignSystem in manifest.json) but not
         imported by ds/index.css, so index.html links its stylesheet. The host
         tag and the show-text class are both load-bearing. */
      '<cca-show-more-less><div role="button" tabindex="0" class="show-text mt-1" ' +
      'data-showmore="stop-' + n + '">' +
      '<span>Show More</span><cca-icon class="mb-0.5 ml-1">' + icon('chevron-down') +
      '</cca-icon></div></cca-show-more-less>' +
      '</div>';

    var totalsStrip =
      '<div class="mt-3 flex flex-wrap gap-6 border-t border-neutral-default pt-3 text-2xs text-neutral-caption">' +
      '<span>Total Weight: <span class="text-neutral-body">' + esc(t.weight) + '</span></span>' +
      '<span>Total Items: <span class="text-neutral-body">' + esc(t.items) + '</span></span>' +
      '<span>Total Exchange Needed: <span class="text-neutral-body">' + esc(t.exchangeNeeded) + '</span></span>' +
      '<span>Total Actual Exchange: <span class="text-neutral-body">' + esc(t.actualExchange) + '</span></span>' +
      '</div>';

    var facts =
      '<div>' + field('Location Type', esc(o.detail.locationType)) +
      '<p class="mt-3 text-2xs text-neutral-caption">Instructions</p>' +
      '<p class="flex items-center gap-1 text-cca-base-sm text-neutral-caption">' +
      icon('file-warning') + 'No instructions available</p></div>';

    return (
      '<cca-stop-card class="block rounded-lg border border-neutral-default">' +
      '<div class="flex items-start gap-3 p-3">' +
      '<span class="grid h-6 w-6 min-w-6 place-content-center rounded-full surface-neutral-default text-cca-label-sm text-neutral-body">' +
      n + '</span>' +
      (wh ? '<div class="flex flex-1 items-start gap-2">' :
            '<button type="button" class="flex flex-1 items-start gap-2 text-left" data-toggle="stop-' + n + '">') +
      '<div class="flex-1">' + typeBadge(kind) +
      /* An h3 on staging — the stop's address is the sub-heading of its card. */
      '<h3 class="mt-1 text-cca-base-sm text-neutral-body">' +
      esc([end.name, end.street, end.city, end.country].filter(Boolean).join(', ')) + '</h3></div>' +
      (wh ? '' :
        '<span class="text-neutral-caption" id="stop-' + n + '-chevron">' +
        icon(open ? 'chevron-up' : 'chevron-down') + '</span>') +
      (wh ? '</div>' : '</button>') + '</div>' +
      /*
       * A WAREHOUSE STOP IS ITS ADDRESS AND NOTHING ELSE. Location Type and
       * Instructions have gone the same way as Opening Hours and the totals:
       * all four came from the shared ORDER_DETAIL fixture and said the same
       * thing on every stop of every order.
       *
       * With no body there is nothing to expand, so the chevron and the toggle
       * go too — a disclosure control that opens an empty panel is worse than
       * no control.
       */
      (wh ? '' :
        '<div class="' + (open ? '' : 'hidden ') + 'border-t border-neutral-default p-3" id="stop-' + n + '-body">' +
        '<div class="grid grid-cols-2 gap-4">' + openingHours + facts + '</div>' + totalsStrip +
        '</div>') +
      '</cca-stop-card>'
    );
  }

  function locationsInfo(o) {
    var e = ends(o);
    /*
     * A WAREHOUSE ORDER'S REFERENCES ARE THREE TRIP NUMBERS, not a trip and a
     * contracted lane. Same format as the transport card's header — a caption
     * label, then the value, in a wrapping row — so the two read as the same
     * card with different references rather than two different designs.
     *
     * N/A is a real state: a warehouse order with no transport leg linked yet
     * genuinely has no transport trip number, and saying N/A is more honest
     * than hiding the row and leaving a reviewer to wonder if it exists.
     */
    if (o.domain === 'warehouse') {
      var t = o.tripNumbers || {};
      var num = function (label, value, screen) {
        return '<span class="shrink-0 text-cca-base-sm text-neutral-caption">' +
          esc(label) + ': ' +
          (value
            ? (screen ? link(value, screen, { id: value })
                      : '<span class="text-neutral-body">' + esc(value) + '</span>')
            : '<span class="text-neutral-body">N/A</span>') +
          '</span>';
      };
      return card('Locations Info',
        '<div class="flex flex-wrap items-center gap-3">' +
        num('Warehouse Trip Number', t.warehouse, 'trips.detail') +
        num('Transport Trip Number', t.transport, 'trips.detail') +
        num('Customer Trip Number', t.customer, null) +
        '</div>',
        '<div class="flex flex-col gap-3">' +
        /* Loading and Delivery, which is what a warehouse order calls its two
           ends — Origin/Destination is the list column's vocabulary. */
        stopCard(1, 'Loading', e.a, o, true) +
        stopCard(2, 'Delivery', e.b, o, false) +
        '</div>');
    }
    var trip = o.tripReference
      ? '<span class="shrink-0 text-cca-base-sm text-neutral-caption">Trip: ' +
        link(o.tripReference, 'trips.detail', { id: o.tripReference }) + '</span>'
      : '<span class="shrink-0 text-cca-base-sm text-neutral-caption">No trip raised</span>';
    /* A contracted lane is a road-freight agreement; a warehouse order is not
       booked from one, so it does not claim to be. */
    if (o.domain !== 'warehouse' && o.detail.bookedFrom) {
      trip += '<span class="shrink-0 text-cca-base-sm text-neutral-caption">Booked from: ' +
        link(o.detail.bookedFrom, 'contracts.detail', { id: o.detail.bookedFrom }) + '</span>';
    }
    return card('Locations Info', '<div class="flex flex-wrap gap-3">' + trip + '</div>',
      '<div class="flex flex-col gap-3">' +
      stopCard(1, o.domain === 'warehouse' ? 'Origin' : 'Pickup', e.a, o, true) +
      stopCard(2, o.domain === 'warehouse' ? 'Destination' : 'Delivery', e.b, o, false) +
      '</div>');
  }

  /*
   * Date & Times. A real table on the app: Location, Desired, Expected,
   * Arrived, Cargo Load / Cargo Unload, Waiting Time — with the same
   * Between/At-labelled timestamps the list uses.
   */
  function dateAndTimes(o) {
    var e = ends(o);
    var wh = o.domain === 'warehouse';
    /*
     * The stop names follow Locations Info. A warehouse order calls its ends
     * Loading and Delivery there, so the same two stops must not be Origin and
     * Destination here — one page, two names for one thing.
     */
    var rows = [
      { label: 'Stop #1', kind: wh ? 'Loading' : 'Pickup', end: e.a },
      { label: 'Stop #2', kind: wh ? 'Delivery' : 'Delivery', end: e.b },
    ];

    /*
     * A WAREHOUSE ORDER SHOWS THREE TIME COLUMNS, not five.
     *
     * Expected and Waiting Time are carrier telemetry — a transport leg
     * reports an ETA and how long the driver waited at the gate. A warehouse
     * order has neither, and Arrived collapses into Actual: what was desired,
     * what actually happened, and when the cargo moved.
     */
    var cols = wh
      ? ['Location', 'Desired', 'Actual', 'Cargo Load/Unload']
      : ['Location', 'Desired', 'Expected', 'Arrived', 'Cargo Load / Cargo Unload', 'Waiting Time'];

    var cell = function (inner) {
      return '<td class="mat-mdc-cell mdc-data-table__cell">' + inner + '</td>';
    };

    return card('Date & Times', headerAction('Edit'),
      '<div class="overflow-x-auto"><table class="mat-mdc-table mdc-data-table__table" style="width:100%">' +
      '<thead><tr class="mat-mdc-header-row mdc-data-table__header-row" role="row">' +
      cols.map(function (h) {
        return '<th class="mat-mdc-header-cell mdc-data-table__header-cell" role="columnheader">' + h + '</th>';
      }).join('') +
      '</tr></thead><tbody class="mdc-data-table__content">' +
      rows.map(function (r) {
        var w = win(r.end.window);
        var location = cell(
          '<span class="text-cca-base-sm text-neutral-body whitespace-nowrap">' +
          r.label + '<br />(' + r.kind + ')</span>');
        var desired = cell(stamp('Between', r.end.date, w.from + ' – ' + w.to));
        var cargo = cell(stamp('At', r.end.date, w.to));
        return '<tr class="mat-mdc-row mdc-data-table__row">' +
          location + desired +
          (wh
            ? cell(stamp('At', r.end.date, w.from)) + cargo
            : cell(stamp('At', r.end.date, w.from)) +
              cell(stamp('At', r.end.date, w.from)) + cargo +
              cell('<span class="text-2xs text-neutral-caption">0 minutes</span>')) +
          '</tr>';
      }).join('') +
      '</tbody></table></div>');
  }

  function references(o) {
    return card('References', headerAction('Edit'),
      '<div class="flex flex-col gap-3">' +
      field('Shipper Reference', esc(o.shipperReference)) +
      fieldGrid([
        ['Stop #1(' + (o.domain === 'warehouse' ? 'Origin' : 'Pickup') + ') Reference', '-'],
        ['Stop #2(' + (o.domain === 'warehouse' ? 'Destination' : 'Delivery') + ') Reference', '-'],
      ]) + '</div>');
  }

  /* Two instruction blocks, each an h4 with its own Edit — the operator's and
     the shipper's. They were small field labels here, a step too quiet for
     what staging gives them. */
  function instructions() {
    var one = function (heading) {
      return (
        '<div class="flex flex-col gap-2">' +
        '<div class="flex items-center justify-between gap-2">' +
        '<h4>' + esc(heading) + '</h4>' + headerAction('Edit') + '</div>' +
        '<span class="text-cca-base-sm text-neutral-subtitle">-</span>' +
        '</div>'
      );
    };
    return card('Instructions', headerAction('Translate', 'translation'),
      '<div class="flex flex-col gap-4">' +
      one('Operator Instruction') + one('Shipper Instruction') + '</div>');
  }

  function co2(o) {
    var c = o.detail.co2;
    /*
     * The four impact figures, each a cca-detail-item: a brand-tinted circle
     * with a glyph, then the label over the value. Icon names checked against
     * tokens/icons.json — `droplet`, `hand-holding-seedling` and `tree` are
     * real; `water` and `leaf` are not.
     */
    var item = function (glyph, label, value) {
      return (
        '<cca-detail-item class="block"><div class="flex gap-2">' +
        '<div class="grid h-8 w-8 min-w-8 place-content-center rounded-full border ' +
        'border-brand-lightest surface-brand-lightest">' +
        '<span class="text-brand-default text-cca-base">' + icon(glyph) + '</span></div>' +
        '<div class="overflow-hidden">' +
        '<p class="text-2xs text-neutral-caption">' + esc(label) + '</p>' +
        '<p class="font-medium text-cca-label-sm text-neutral-body">' + esc(value) + '</p>' +
        '</div></div></cca-detail-item>'
      );
    };
    return card('Overview of CO₂ offset for this order', '',
      '<p class="text-cca-base-sm text-neutral-caption">' +
      'Contribute to a sustainable future by offsetting CO2 emissions for your shipments.</p>' +
      '<hr class="my-4 border-neutral-default" />' +
      '<div class="flex flex-col gap-2 text-cca-base-sm font-medium">' +
      '<div class="flex items-center justify-between gap-4">' +
      '<span class="text-neutral-caption">Shipper Contribution</span>' +
      '<span class="font-bold text-neutral-title">' + esc(c.contribution) + '</span></div>' +
      '<div class="flex items-center justify-between gap-4">' +
      '<span class="text-neutral-caption">CO2 Offset:</span>' +
      '<span class="font-bold text-neutral-title">' + esc(c.offset) + '</span></div></div>' +
      '<hr class="my-4 border-neutral-default" />' +
      '<div class="grid grid-cols-2 gap-4">' +
      item('droplet', 'Save Water', c.water) +
      item('users', 'Impact Lives', c.lives) +
      item('hand-holding-seedling', 'Land Greened', c.land) +
      item('tree', 'Trees Brought Back', c.trees) +
      '</div>' +
      '<div class="mt-4 flex justify-center">' +
      '<a ccaButton hierarchy="link" class="cca-btn cca-btn--link" target="_blank" ' +
      'rel="noopener noreferrer" href="https://www.ctrlchain.com/en/green-logistics">' +
      'Learn more</a></div>');
  }

  /* ------------------------------------------- order items and shortages */

  /*
   * The two tables below Locations Info on a warehouse order, from Figma
   * 29Ixi12L8wlQPTh3oVg0ao node 103:52832.
   *
   * Both share a card shell the rest of this page does not use: a COLLAPSIBLE
   * heading, a UoM select and a fullscreen toggle in the header, and a
   * paginator in the footer. card() renders a plain h2 with one action slot,
   * so this is built alongside it rather than bent out of it.
   *
   * The UoM select is CCA_FILTERS.labelledField — the same labelled outlined
   * field the filter drawer uses, exported for this. Its notch width has to be
   * stated because Angular measures the label at runtime and a static page
   * cannot.
   */
  var tableOpen = { 'order-items': true, shortages: true };

  function tableCard(key, heading, uom, body, count) {
    var open = tableOpen[key] !== false;
    return (
      '<section class="page-container">' +
      '<div class="flex flex-wrap items-center justify-between gap-4">' +
      '<div role="button" tabindex="0" class="flex cursor-pointer items-center gap-2" ' +
      'data-table-toggle="' + key + '">' +
      /* Expanded points DOWN, collapsed points UP. The inverse of the Material
         default and of what the Figma frame shows, but it is what was asked
         for — the arrow reads as the direction the panel will move. Both this
         card and the item rows below follow it, so the page is consistent. */
      '<span class="text-neutral-body">' + icon(open ? 'chevron-down' : 'chevron-up') + '</span>' +
      '<h2>' + esc(heading) + '</h2>' +
      '</div>' +
      '<div class="flex shrink-0 items-center gap-3">' +
      '<div class="w-40">' +
      window.CCA_FILTERS.labelledField(key + '-uom', 'UoM', uom, null, '') +
      '</div>' +
      '<button ccaButton hierarchy="subtle" type="button" ' +
      'class="cca-btn cca-btn--subtle cca-btn--icon-only" aria-label="Expand ' + esc(heading) + '">' +
      icon('fullscreen') + '</button>' +
      '</div></div>' +
      (open ? '<div class="mt-4">' + body + paginator(count) + '</div>' : '') +
      '</section>'
    );
  }

  /* The repo's paginator, as oms/ and orders-pinned-filters/ render it. */
  function paginator(count) {
    var arrow = function (label, glyph, disabled) {
      return '<button ccaButton type="button" class="cca-btn cca-btn--tertiary cca-btn--icon-only"' +
        (disabled ? ' disabled' : '') + ' aria-label="' + label + '">' + icon(glyph) + '</button>';
    };
    return (
      '<div class="mt-4 flex flex-wrap items-center justify-end gap-3">' +
      '<span class="text-cca-label-sm text-neutral-caption">Rows per page</span>' +
      '<span class="flex items-center gap-2 rounded-lg border border-neutral-default px-3 py-1 text-cca-base-sm text-neutral-body">' +
      '25' + icon('chevron-down') + '</span>' +
      '<span class="text-cca-label-sm text-neutral-caption">1-' + count + ' of ' + count + '</span>' +
      arrow('First page', 'chevrons-left', true) + arrow('Previous page', 'chevron-left', true) +
      arrow('Next page', 'chevron-right', true) + arrow('Last page', 'chevrons-right', true) +
      '</div>'
    );
  }

  function th(label) {
    return '<th class="mat-mdc-header-cell mdc-data-table__header-cell whitespace-nowrap" ' +
      'role="columnheader">' + esc(label) + '</th>';
  }
  function td(inner, extra) {
    return '<td class="mat-mdc-cell mdc-data-table__cell ' + (extra || '') + '">' + inner + '</td>';
  }
  function txt(v) {
    return '<span class="text-cca-base-sm whitespace-nowrap text-neutral-body">' + esc(v) + '</span>';
  }

  /*
   * The nested SSCC table an item row opens into. Tinted and inset, as the
   * Figma draws it, so it reads as belonging to the row above rather than as a
   * second table of its own.
   */
  function palletRows(item) {
    if (!item.pallets.length) return '';
    var cols = ['SSCC', 'LOT/Batch', 'Best Before Date', 'Ordered Quantity',
                'Shipped Quantity', 'UoM', 'UoM Type', 'Quality',
                'Temperature', 'Profile Check'];
    return (
      '<tr class="mat-mdc-row mdc-data-table__row" data-pallets="' + item.line + '">' +
      '<td class="mat-mdc-cell mdc-data-table__cell surface-neutral-default p-4" colspan="14">' +
      '<div class="overflow-x-auto rounded-lg border border-neutral-default surface-neutral-light">' +
      '<table class="mat-mdc-table mdc-data-table__table" style="width:100%">' +
      '<thead><tr class="mat-mdc-header-row mdc-data-table__header-row" role="row">' +
      cols.map(th).join('') + '</tr></thead>' +
      '<tbody class="mdc-data-table__content">' +
      item.pallets.map(function (p) {
        return '<tr class="mat-mdc-row mdc-data-table__row">' +
          td(txt(p.sscc)) + td(txt(p.lot)) +
          td(stamp('At', p.bestBefore, '')) +
          td(txt(p.ordered)) + td(txt(p.shipped)) + td(txt(p.uom)) + td(txt(p.uomType)) +
          td(txt(p.quality)) + td(txt(p.temperature)) + td(txt(p.profileCheck)) +
          '</tr>';
      }).join('') +
      '</tbody></table></div></td></tr>'
    );
  }

  var itemOpen = { '0010': true };

  function orderItems() {
    var items = D.orderItems();
    var cols = ['', 'Line', 'Product Code', 'Product Description', 'Best Before Date',
                'LOT/Batch', 'Quality', 'Ordered Quantity', 'Shipped Quantity', 'UOM',
                'UOM Type', 'Shortage', 'Pallets Ordered', 'Pallets Shipped', 'Temp Class'];
    /*
     * GENERAL INFORMATION, above the table.
     *
     * Lines and Pallets are DERIVED from the items rather than stored — two
     * lines and 7 + 3 pallets, which is exactly what the Figma frame shows, so
     * the totals cannot drift from the rows underneath them the way the stop
     * card's borrowed totals did.
     *
     * Total Weight comes from the order's own weightKg for the same reason.
     * The Figma says 18,340 kg; using it would have put a number on the page
     * that contradicts the record every other section reads from.
     */
    var general =
      '<h4>General Information</h4>' +
      '<div class="mt-3">' + fieldGrid([
        ['Lines', String(items.length)],
        ['Pallets', String(items.reduce(function (n, it) {
          return n + (parseInt(it.palletsOrdered, 10) || 0);
        }, 0))],
        ['Total Weight', esc(order.weightKg.toLocaleString('en-GB')) + ' kg'],
        ['Temperature Profile code',
         '<span class="flex items-center gap-1">' + icon('temperature-3') +
         esc(order.temperatureProfile) + '</span>'],
      ]) + '</div>';

    var body =
      general +
      '<div class="mt-5 overflow-x-auto"><table class="mat-mdc-table mdc-data-table__table" style="width:100%">' +
      '<thead><tr class="mat-mdc-header-row mdc-data-table__header-row" role="row">' +
      cols.map(th).join('') + '</tr></thead>' +
      '<tbody class="mdc-data-table__content">' +
      items.map(function (it) {
        var open = !!itemOpen[it.line] && it.pallets.length;
        return '<tr class="mat-mdc-row mdc-data-table__row">' +
          td(it.pallets.length
            ? '<span role="button" tabindex="0" class="cursor-pointer text-neutral-body" ' +
              'data-item-toggle="' + it.line + '">' + icon(open ? 'chevron-down' : 'chevron-up') + '</span>'
            : '', 'w-8') +
          td(txt(it.line)) + td(txt(it.code)) + td(txt(it.description)) +
          td(stamp('At', it.bestBefore, '')) +
          td(txt(it.lot)) + td(txt(it.quality)) + td(txt(it.ordered)) + td(txt(it.shipped)) +
          td(txt(it.uom)) + td(txt(it.uomType)) + td(txt(it.shortage)) +
          td(txt(it.palletsOrdered)) + td(txt(it.palletsShipped)) + td(txt(it.tempClass)) +
          '</tr>' + (open ? palletRows(it) : '');
      }).join('') +
      '</tbody></table></div>';
    return tableCard('order-items', 'Order Items', 'Default', body, items.length);
  }

  function shortages() {
    var rows = D.shortages();
    var cols = ['Line', 'Product Code', 'Product Description', 'Shortage Quantity'];
    var body =
      '<div class="overflow-x-auto"><table class="mat-mdc-table mdc-data-table__table" style="width:100%">' +
      '<thead><tr class="mat-mdc-header-row mdc-data-table__header-row" role="row">' +
      cols.map(th).join('') + '</tr></thead>' +
      '<tbody class="mdc-data-table__content">' +
      rows.map(function (r) {
        return '<tr class="mat-mdc-row mdc-data-table__row">' +
          td(txt(r.line)) + td(txt(r.code)) + td(txt(r.description)) + td(txt(r.quantity)) +
          '</tr>';
      }).join('') +
      '</tbody></table></div>';
    return tableCard('shortages', 'Shortages', 'Default', body, rows.length);
  }

  /* -------------------------------------------------- shipment timeline */

  /*
   * THE SHIPMENT UPDATES DRAWER, read off staging's own
   * cca-shipment-updates > cca-timeline-table > cca-drawer-display-container.
   *
   * None of those four elements is in the export — checked `isDesignSystem` in
   * manifest.json and they are not there at all, so there is no stylesheet to
   * link and the whole look comes from utility classes, which is why this can
   * be rebuilt faithfully from the DOM alone.
   *
   * THREE OF STAGING'S CLASSES DO NOT EXIST IN OUR BUNDLE, because the app
   * compiles Tailwind at build time and we get a precompiled export:
   *
   *   pl-[17px]              an arbitrary value. Staging uses it to nudge the
   *                          unhighlighted cards so their content lines up with
   *                          the highlighted one, which carries a 2px border
   *                          against everyone else's 1px.
   *   border-brand-default!  the `!` important variant is not compiled either.
   *   h-2.5 / w-2.5          the 10px dot. The scale here stops at whole steps.
   *
   * So: every card gets `border-2` and only the colour changes, which removes
   * the need for staging's 1px nudge entirely — a better answer than porting
   * the hack. The dot is `h-2 w-2`, the same 8px dot the route bar uses. The
   * brand border needs no `!` because nothing competes with it here.
   */
  function statusCard(ev, latest) {
    return (
      '<cca-status-card class="block">' +
      '<div class="flex gap-6 border-2 border-solid px-4 ' +
      (latest ? 'border-brand-default' : 'border-neutral-default') + '">' +
      /* when + where */
      '<div class="flex w-1/5 flex-col py-4 text-right text-cca-base-sm font-medium text-neutral-caption">' +
      '<h4>' + esc(ev.time) + '</h4>' +
      '<span class="text-cca-label-sm font-normal">' + esc(ev.place) + '</span>' +
      '</div>' +
      /* the rail: a hairline with the event's dot on it */
      '<div class="relative flex w-4 justify-center">' +
      '<span class="h-full w-px surface-neutral-darker"></span>' +
      '<span class="absolute top-4 flex h-5 w-5 items-center justify-center rounded-full' +
      (latest ? ' info-surface-light' : '') + '">' +
      '<span class="h-2 w-2 rounded-full border border-solid border-neutral-default ' +
      (latest ? 'border-neutral-invert info-surface' : 'surface-neutral-darkest') + '"></span>' +
      '</span></div>' +
      /* what happened */
      '<div class="flex w-4/5 flex-col gap-1 py-4">' +
      '<h4 class="flex items-center gap-2 text-neutral-body' + (latest ? ' font-bold' : '') + '">' +
      esc(ev.label) + '</h4>' +
      '<p class="text-cca-base-sm text-neutral-caption">' + esc(ev.note) + '</p>' +
      '<span class="mt-3 text-cca-label-sm font-medium text-neutral-caption">By: ' +
      esc(ev.by) + '</span>' +
      '</div></div></cca-status-card>'
    );
  }

  var timelineOpen = {}; /* which day groups are expanded */

  function timelineBody(o) {
    var groups = D.timeline(o);
    var first = true;
    return (
      '<ul class="flex flex-col gap-2 p-4">' +
      groups.map(function (g, gi) {
        var open = timelineOpen[g.day] !== false;
        var cards = g.events.map(function (ev) {
          var latest = first;
          first = false;
          return statusCard(ev, latest);
        }).join('');
        return (
          '<li class="relative flex flex-col gap-2">' +
          /* The day header is a role=button div on staging, not a <button> —
             a button would inherit .cca-btn-less Material resets it does not
             want, and this one is a full-width bar. */
          '<div role="button" tabindex="0" data-day="' + esc(g.day) + '" ' +
          'class="flex cursor-pointer items-center gap-2 border-b border-solid ' +
          'border-neutral-default surface-neutral-light p-2 font-normal">' +
          '<span class="flex h-5 w-6 items-center justify-center">' +
          '<cca-icon class="text-cca-base text-neutral-body">' +
          icon(open ? 'chevron-up' : 'chevron-down') + '</cca-icon></span>' +
          '<h5 class="leading-5">' + esc(g.day) + '</h5>' +
          '</div>' +
          '<div' + (open ? '' : ' hidden') + '>' + cards + '</div>' +
          '</li>'
        );
      }).join('') +
      '</ul>'
    );
  }

  function renderTimeline(o) {
    document.getElementById('timeline-drawer').innerHTML =
      /* Header: title, a refresh beside it, and the close on the far right —
         staging's exact clustering, so the refresh belongs to the heading
         rather than floating between the two. */
      '<section class="flex shrink-0 items-center justify-between gap-2 ' +
      'border-b border-neutral-default p-6">' +
      '<div class="flex items-center gap-2">' +
      '<h2>Shipment Timeline</h2>' +
      '<button ccaButton hierarchy="subtle" size="small" type="button" ' +
      'class="cca-btn cca-btn--small cca-btn--icon-only cca-btn--subtle" aria-label="Refresh">' +
      icon('refresh') + '</button>' +
      '</div>' +
      '<button ccaButton hierarchy="icon" type="button" ' +
      'class="cca-btn mr-2 cca-btn--icon-only cca-btn--icon" aria-label="Close" ' +
      'data-close-timeline>' + icon('xmark') + '</button>' +
      '</section>' +
      '<section class="proto-drawer-body">' + timelineBody(o) + '</section>';
  }

  function openTimeline(open) {
    var box = document.getElementById('timeline-overlay');
    var scrim = document.getElementById('timeline-scrim');
    if (open) {
      renderTimeline(order);
      box.hidden = false;
      /* A layout read commits opacity 0 before the class starts the fade.
         Never requestAnimationFrame — it does not fire in a background tab,
         and the scrim would stay invisible. */
      void scrim.offsetWidth;
      scrim.classList.add('cdk-overlay-backdrop-showing');
      document.documentElement.classList.add('cdk-global-scrollblock');
    } else {
      scrim.classList.remove('cdk-overlay-backdrop-showing');
      box.hidden = true;
      document.documentElement.classList.remove('cdk-global-scrollblock');
    }
  }

  /* ---------------------------------------------------------------- tabs */

  /* Seven tabs, as the app has them. Only Basic Info is built; the rest say so
     rather than pretending — a detail page with one tab misrepresents the
     information architecture, and someone reviewing this needs to see that
     Pricing and Documents are their own places. */
  /*
   * TAB SETS DIFFER BY DOMAIN. A transport order has seven; a warehouse order
   * has four — no Actions, Route Planning or Pricing, because none of those are
   * things a warehouse order carries. Showing the transport set on a warehouse
   * order would claim capabilities it does not have, which is the same mistake
   * as an empty section pretending to hold data.
   *
   * Only Basic Info is built on either. The rest are listed rather than hidden
   * because a detail page showing one tab misrepresents the information
   * architecture — someone reviewing this needs to see that Documents and
   * Event Log are their own places.
   */
  var TRANSPORT_TABS = [
    { name: 'Basic Info', built: true },
    { name: 'Actions', built: false, badge: 1 },
    { name: 'Documents', built: false },
    { name: 'Route Planning', built: false },
    { name: 'Pricing', built: false },
    { name: 'Communication', built: false },
    { name: 'Event Log', built: false },
  ];

  var WAREHOUSE_TABS = [
    { name: 'Basic Info', built: true },
    { name: 'Communication', built: false },
    { name: 'Documents', built: false },
    { name: 'Event Log', built: false },
  ];

  /* Invoice orders are still on the transport set — nobody has said what an
     invoice order's tabs are, and guessing is worse than being obviously
     unfinished. */
  function tabsFor(o) {
    return o && o.domain === 'warehouse' ? WAREHOUSE_TABS : TRANSPORT_TABS;
  }

  var TABS = tabsFor(order);

  var activeTab = 'Basic Info';

  /*
   * THE TABS ARE THE `.menu-bar` COMPONENT — ds/platform-02.css. Not utilities,
   * not mat-tab-group, and not the maintab tokens applied by hand, which is
   * what this had before. The component already carries all of it:
   *
   *   .menu-bar         flex, shrink-0, overflow hidden
   *   .menu-bar a       48px tall, flex-centred, 1px maintab-border-default,
   *                     maintab-bg-default, 16/24 weight 500 UPPERCASE,
   *                     maintab-text-default, 16px inline padding
   *   .menu-bar a.active
   *                     radius-xl pill, maintab-border-selected,
   *                     maintab-bg-selected, maintab-text-selected, z-index 10
   *   first/last child  rounded on the outer edge only
   *
   * The clever part is the overlap: an active tab pulls in by -0.438rem on
   * each side it has a neighbour, and sits above them on z-index 10, so the
   * selected pill reads as lifted out of the bar rather than filling a slot.
   * `.menu-bar a.active + a` then drops the next tab's left border so there is
   * no double line. Rebuilding that with utilities is how you end up with a
   * flat segmented control that is almost right.
   *
   * THE CHILDREN MUST BE ANCHORS. Every declaration is scoped to
   * `.menu-bar a`, so a <button> gets none of it — which is exactly the
   * "element tags are load-bearing" trap, hit again.
   */
  function renderTabs() {
    tabsHost.innerHTML = TABS.map(function (t) {
      var on = t.name === activeTab;
      return (
        '<a href="#" class="' + (on ? 'active' : '') + '" data-tab="' + esc(t.name) + '" ' +
        'role="tab" aria-selected="' + on + '">' + esc(t.name) +
        (t.badge
          /* Staging's tab badge is small and lifted off the label's cap line —
             relative -top-3 left-1, and a 16px pill, not the 24px one. */
          ? '<cca-numerical-badge class="relative -top-3 left-1"><span class="rounded-full ' +
            'font-medium primary inline-flex items-center justify-center align-middle min-w-3.75">' +
            '<span class="flex h-4 min-w-4 items-center justify-center px-1 text-2xs">' +
            t.badge + '</span></span></cca-numerical-badge>'
          : '') +
        '</a>'
      );
    }).join('');
  }

  function renderBody(o) {
    var tab = TABS.filter(function (t) { return t.name === activeTab; })[0];
    if (!tab.built) {
      bodyHost.innerHTML =
        '<section class="page-container grid place-items-center py-16">' +
        '<div class="flex max-w-100 flex-col items-center gap-2 text-center">' +
        '<span class="text-neutral-caption">' + icon('no-more-task') + '</span>' +
        '<h2 class="text-neutral-title">' + esc(tab.name) + ' is not prototyped yet</h2>' +
        '<p class="text-cca-base-sm text-neutral-caption">' +
        'It is a tab on the real order page and it is listed here so the structure is honest. ' +
        'Basic Info is the one that is built.</p></div></section>';
      return;
    }
    /*
     * One card: header, rule, status, and — for a transport order — the map.
     *
     * A WAREHOUSE ORDER HAS NO MAP. It is handling at a site, not a movement
     * being tracked across one, so a route schematic between two points was
     * answering a question nobody asks of it. The Map Overview panel goes with
     * it, since that panel only ever floated on the map.
     */
    var top =
      '<section class="page-container flex w-full flex-col gap-4">' +
      detailHeader(o) +
      (o.domain === 'warehouse' ? '' : mapRegion(o)) +
      '</section>';

    /*
     * A WAREHOUSE ORDER STOPS AT THE MAP, for now. Its Basic Info is being
     * built section by section rather than inherited from the transport page —
     * the transport layout below the map (Route Details, Requested Vehicle(s),
     * Parking Requirements, the CO2 offset) is about moving goods by road, and
     * the rest needs deciding on its own terms rather than adapted by guesswork.
     *
     * So nothing is rendered below the map until it has been specified. That is
     * deliberate: an empty area is honest, whereas transport cards full of
     * dashes would read as a warehouse order missing its data.
     */
    if (o.domain === 'warehouse') {
      /* Built up one section at a time. Same two-column split as transport —
         the narrow column carries what the order IS, the wide one what happens
         to it — so the two domains stay recognisably the same page. */
      bodyHost.innerHTML =
        top +
        '<div class="mt-4 flex flex-wrap items-start gap-4">' +
        '<div class="flex min-w-80 flex-1 flex-col gap-4">' +
        financeSummary(o) + contacts(o) + carrierAndVehicle(o) +
        '</div>' +
        '<div class="flex min-w-80 flex-2 flex-col gap-4">' +
        /* Order Items sits directly under Locations Info, as asked. It is
           fifteen columns in a two-thirds column, so its own overflow-x-auto
           wrapper does the work — the table scrolls inside the card rather
           than widening the page. */
        locationsInfo(o) + orderItems() + shortages() + dateAndTimes(o) +
        '</div></div>';
      return;
    }

    bodyHost.innerHTML =
      top +
      /* Two columns: the narrow one carries what the order IS, the wide one what
         happens to it. Stacks on a narrow viewport rather than scrolling. */
      '<div class="mt-4 flex flex-wrap items-start gap-4">' +
      '<div class="flex min-w-80 flex-1 flex-col gap-4">' +
      financeSummary(o) + contacts(o) + routeDetails(o) + loadSummary(o) +
      requestedVehicle(o) + carrierAndVehicle(o) +
      '</div>' +
      '<div class="flex min-w-80 flex-2 flex-col gap-4">' +
      locationsInfo(o) + dateAndTimes(o) + references(o) + parkingRequirements() +
      instructions() + co2(o) +
      '</div></div>';
  }

  function renderTitle(o) {
    titleHost.innerHTML =
      '<h1 class="text-NC-blue-default">Order Details - ' + esc(o.id) + '</h1>' +
      /* The same badge the Orders table gives the type column. Staging puts a
         cca-numerical-badge on `highlight` here, but a reviewer moving from
         the list to the detail should see one type badge, not two designs of
         it — and the list is the one people read all day. */
      (o.type ? typeBadge(o.type) : '');
  }

  /* The not-found state. Links outlive fixtures, and a blank page reads as a
     bug rather than an empty result. */
  function renderMissing() {
    titleHost.innerHTML = '<h1 class="text-NC-blue-default">Order Details</h1>';
    tabsHost.innerHTML = '';
    bodyHost.innerHTML =
      '<section class="page-container grid place-items-center py-16">' +
      '<div class="flex flex-col items-center gap-4 text-center">' +
      '<h2 class="text-neutral-title">No such order</h2>' +
      '<p class="text-cca-base text-neutral-subtitle">' +
      (id ? 'Nothing here has the id “' + esc(id) + '”.' : 'This page needs an id — open it from the Orders list.') +
      '</p><div><button ccaButton type="button" class="cca-btn cca-btn--primary" data-screen="oms.orders">' +
      'Back to Orders</button></div></div></section>';
  }

  /* ------------------------------------------------------------ behaviour */

  document.addEventListener('click', function (ev) {
    /* --------------------------------- order items / shortages collapse */
    var tt = ev.target.closest('[data-table-toggle]');
    if (tt) {
      var key = tt.getAttribute('data-table-toggle');
      tableOpen[key] = tableOpen[key] === false;
      renderBody(order);
      return;
    }
    var it = ev.target.closest('[data-item-toggle]');
    if (it) {
      var line = it.getAttribute('data-item-toggle');
      itemOpen[line] = !itemOpen[line];
      renderBody(order);
      return;
    }

    /* ------------------------------------------- shipment timeline drawer */
    if (ev.target.closest('[data-open-timeline]')) { openTimeline(true); return; }
    if (ev.target.closest('[data-close-timeline]')) { openTimeline(false); return; }
    if (ev.target.id === 'timeline-scrim') { openTimeline(false); return; }
    var day = ev.target.closest('[data-day]');
    if (day) {
      var name = day.getAttribute('data-day');
      timelineOpen[name] = timelineOpen[name] === false;
      renderTimeline(order);
      return;
    }

    var tab = ev.target.closest('[data-tab]');
    if (tab) {
      ev.preventDefault();          // they are anchors, as the component requires
      activeTab = tab.getAttribute('data-tab');
      renderTabs();
      renderBody(order);
      window.CCA_ROUTES.resolve();
      return;
    }
    /* Collapsibles: the map panel and each stop card. */
    var toggle = ev.target.closest('[data-toggle]');
    if (toggle) {
      var key = toggle.getAttribute('data-toggle');
      var body = document.getElementById(key === 'map' ? 'map-body' : key + '-body');
      var chev = document.getElementById(key === 'map' ? 'map-chevron' : key + '-chevron');
      if (body) {
        var nowOpen = body.classList.toggle('hidden') === false;
        if (chev) chev.innerHTML = icon(nowOpen ? 'chevron-up' : 'chevron-down');
      }
      return;
    }
    /* Show More on a stop's opening hours — the app hides days past the fifth. */
    var more = ev.target.closest('[data-showmore]');
    if (more) {
      var scope = more.getAttribute('data-showmore');
      var hiddenRows = document.querySelectorAll('[data-more="' + scope + '"]');
      var opening = hiddenRows.length && hiddenRows[0].classList.contains('hidden');
      hiddenRows.forEach(function (r) { r.classList.toggle('hidden', !opening); });
      more.innerHTML = '<span>' + (opening ? 'Show Less' : 'Show More') + '</span>' +
        '<cca-icon class="mb-0.5 ml-1">' + icon(opening ? 'chevron-up' : 'chevron-down') + '</cca-icon>';
    }
  });

  if (order) {
    document.title = 'Order Details - ' + order.id + ' · CtrlChain';
    renderTitle(order);
    renderTabs();
    renderBody(order);
  } else {
    renderMissing();
  }

  window.CCA_ROUTES.resolve();
})();
