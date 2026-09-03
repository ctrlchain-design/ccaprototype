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

  function typeBadge(text) {
    return (
      '<cca-label-badge><div class="flex w-fit items-center gap-1 rounded-lg border ' +
      'border-transparent whitespace-nowrap px-1.5 py-0.5 text-cca-label-sm font-normal ' +
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
    /* A reefer only. `info-text` is the bundle's own info colour (#2a628f). */
    var temp = o.detail.cargo.temperatureRange
      ? '<div class="flex items-center gap-2">' +
        '<span class="text-neutral-caption">' + icon('temperature-3') + '</span>' +
        '<div><p class="text-2xs text-neutral-caption">Required: ' +
        '<span class="text-neutral-body">' + esc(o.detail.cargo.temperatureRange) + '</span></p>' +
        '<p class="text-2xs text-neutral-caption">Current: ' +
        '<span class="text-critical-text">Disconnected</span></p></div></div>'
      : '';
    return (
      '<cca-detail-header class="block">' +
      '<div class="flex flex-col justify-between gap-4">' +
      '<div class="flex items-center justify-between gap-4">' +
      '<header class="flex w-full flex-wrap items-center justify-between gap-2">' +
      '<div class="flex items-center gap-8">' +
      end('First Pickup', e.a) +
      '<cca-trip-indicator class="block">' +
      '<div class="relative flex flex-col items-center gap-1 pt-1">' +
      '<div class="flex w-40 items-center">' + dot +
      '<span class="flex h-1 w-full items-center justify-center surface-brand-light"></span>' +
      dot + '</div>' +
      '<span class="text-cca-base-sm font-medium info-text">' +
      esc(o.detail.route.distance) + '</span>' +
      '</div></cca-trip-indicator>' +
      end(o.domain === 'warehouse' ? 'Destination' : 'Last Delivery', e.b) +
      '</div>' + temp + '</header>' +
      '<button ccaButton hierarchy="tertiary" type="button" ' +
      'class="cca-btn cca-btn--tertiary cca-btn--icon-only ml-2" aria-label="Order actions">' +
      icon('ellipsis-vertical') + '</button>' +
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
      'class="cca-btn cca-btn--secondary shrink-0">Shipment updates</button>' +
      '</div></cca-status-overview>'
    );
  }

  /*
   * The map, and Map Overview floating on it. No map runtime in a static
   * prototype and the export ships no tiles, so the region is an honest empty
   * plate rather than a fake picture of a route — but the overlay panel is
   * where the app puts it, top-left and `w-75`, not a full-width row.
   */
  function mapRegion() {
    return (
      '<section class="relative h-100 w-full overflow-hidden rounded-xl surface-neutral-default">' +
      '<div class="grid h-full place-items-center">' +
      '<div class="flex max-w-100 flex-col items-center gap-2 text-center">' +
      '<span class="text-neutral-caption">' + icon('simple-map') + '</span>' +
      '<span class="text-cca-base-sm text-neutral-caption">No map in a static prototype</span>' +
      '<span class="text-2xs text-neutral-caption">The app renders cca-order-map here, ' +
      'with the route, via points and any traceable objects.</span>' +
      '</div></div>' +
      '<div class="page-container absolute top-3 left-3 flex h-min w-75 min-w-75 flex-col p-3" id="map-section">' +
      '<div class="flex flex-row items-center justify-between">' +
      '<h4>Map Overview (0)</h4>' +
      '<button ccaButton hierarchy="icon" type="button" class="cca-btn cca-btn--icon" ' +
      'data-toggle="map" aria-label="Toggle map overview">' +
      '<span id="map-chevron">' + icon('chevron-down') + '</span></button>' +
      '</div>' +
      '<div class="mt-3 hidden text-cca-base-sm text-neutral-caption" id="map-body">' +
      'Nothing traceable on this order.</div>' +
      '</div></section>'
    );
  }

  function financeSummary(o) {
    var rows = [
      ['Customer Invoice Status', o.customerInvoiceStatus || 'Not Invoiced',
       o.customerInvoiceStatus === 'Paid' ? 'primary' : 'neutral-caption'],
      ['Carrier Invoice Status', 'Not Invoiced', 'neutral-caption'],
      ['POD Status', o.podApproved ? 'Approved' : 'Not approved',
       o.podApproved ? 'primary' : 'neutral-caption'],
    ];
    return card('Finance Summary', '',
      '<div class="flex flex-col gap-3">' +
      rows.map(function (r) {
        return '<div class="flex items-center justify-between gap-4">' +
          '<span class="text-cca-base-sm text-neutral-caption">' + esc(r[0]) + '</span>' +
          dotValue(r[1], r[2]) + '</div>';
      }).join('') + '</div>');
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
    return card('Contacts', '',
      '<div class="flex flex-col gap-5">' +
      '<div>' +
      '<p class="text-2xs text-neutral-caption">Assigned Operator</p>' +
      '<div class="mt-2 flex items-center gap-3">' + avatar(c.operator.initials) +
      '<div><p class="text-cca-base-sm text-neutral-body">' + esc(o.assignedOperator) + '</p>' +
      '<p class="flex items-center gap-1 text-2xs text-neutral-caption">' +
      icon('building') + esc(o.salesOrganisation) + '</p></div></div></div>' +
      '<div>' +
      '<p class="text-2xs text-neutral-caption">Shipper</p>' +
      '<div class="mt-2 flex items-center gap-3">' + avatar(c.shipper.initials) +
      '<div><p class="text-cca-base-sm text-neutral-body">' + esc(c.shipper.name) + '</p>' +
      '<p class="text-2xs text-neutral-caption">' + esc(c.shipper.role) + '</p>' +
      '<p class="flex items-center gap-1 text-2xs text-neutral-caption">' +
      icon('building') + esc(o.shipperGroup) + '</p>' +
      '<p class="flex items-center gap-1 text-2xs text-neutral-caption">' +
      icon('users') + esc(o.shipperSubGroup) + '</p>' +
      '<a class="cursor-pointer text-2xs text-brand-default underline" href="mailto:' +
      esc(c.shipper.email) + '">' + esc(c.shipper.email) + '</a>' +
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
    var hours = o.detail.openingHours;
    var t = o.detail.totals;
    return (
      '<cca-stop-card class="block rounded-lg border border-neutral-default">' +
      '<div class="flex items-start gap-3 p-3">' +
      '<span class="grid h-6 w-6 min-w-6 place-content-center rounded-full surface-neutral-default text-cca-label-sm text-neutral-body">' +
      n + '</span>' +
      '<button type="button" class="flex flex-1 items-start gap-2 text-left" data-toggle="stop-' + n + '">' +
      '<div class="flex-1">' + typeBadge(kind) +
      /* An h3 on staging — the stop's address is the sub-heading of its card. */
      '<h3 class="mt-1 text-cca-base-sm text-neutral-body">' +
      esc([end.name, end.street, end.city, end.country].filter(Boolean).join(', ')) + '</h3></div>' +
      '<span class="text-neutral-caption" id="stop-' + n + '-chevron">' +
      icon(open ? 'chevron-up' : 'chevron-down') + '</span>' +
      '</button></div>' +
      '<div class="' + (open ? '' : 'hidden ') + 'border-t border-neutral-default p-3" id="stop-' + n + '-body">' +
      '<div class="grid grid-cols-2 gap-4">' +
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
      '<cca-show-more-less style="display:block">' +
      /* cca-show-more-less — official (isDesignSystem in manifest.json) but not
         imported by ds/index.css, so index.html links its stylesheet. The host
         tag and `.show-text` are both load-bearing. */
      '<cca-show-more-less><div role="button" tabindex="0" class="show-text mt-1" ' +
      'data-showmore="stop-' + n + '">' +
      '<span>Show More</span><cca-icon class="mb-0.5 ml-1">' + icon('chevron-down') +
      '</cca-icon></div></cca-show-more-less>' +
      '</div>' +
      '<div>' + field('Location Type', esc(o.detail.locationType)) +
      '<p class="mt-3 text-2xs text-neutral-caption">Instructions</p>' +
      '<p class="flex items-center gap-1 text-cca-base-sm text-neutral-caption">' +
      icon('file-warning') + 'No instructions available</p></div>' +
      '</div>' +
      '<div class="mt-3 flex flex-wrap gap-6 border-t border-neutral-default pt-3 text-2xs text-neutral-caption">' +
      '<span>Total Weight: <span class="text-neutral-body">' + esc(t.weight) + '</span></span>' +
      '<span>Total Items: <span class="text-neutral-body">' + esc(t.items) + '</span></span>' +
      '<span>Total Exchange Needed: <span class="text-neutral-body">' + esc(t.exchangeNeeded) + '</span></span>' +
      '<span>Total Actual Exchange: <span class="text-neutral-body">' + esc(t.actualExchange) + '</span></span>' +
      '</div></div></cca-stop-card>'
    );
  }

  function locationsInfo(o) {
    var e = ends(o);
    var trip = o.tripReference
      ? '<span class="shrink-0 text-cca-base-sm text-neutral-caption">Trip: ' +
        link(o.tripReference, 'trips.detail', { id: o.tripReference }) + '</span>'
      : '<span class="shrink-0 text-cca-base-sm text-neutral-caption">No trip raised</span>';
    if (o.detail.bookedFrom) {
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
    var rows = [
      { label: 'Stop #1', kind: o.domain === 'warehouse' ? 'Origin' : 'Pickup', end: e.a },
      { label: 'Stop #2', kind: o.domain === 'warehouse' ? 'Destination' : 'Delivery', end: e.b },
    ];
    return card('Date & Times', headerAction('Edit'),
      '<div class="overflow-x-auto"><table class="mat-mdc-table mdc-data-table__table" style="width:100%">' +
      '<thead><tr class="mat-mdc-header-row mdc-data-table__header-row" role="row">' +
      ['Location', 'Desired', 'Expected', 'Arrived', 'Cargo Load / Cargo Unload', 'Waiting Time']
        .map(function (h) {
          return '<th class="mat-mdc-header-cell mdc-data-table__header-cell" role="columnheader">' + h + '</th>';
        }).join('') +
      '</tr></thead><tbody class="mdc-data-table__content">' +
      rows.map(function (r) {
        var w = win(r.end.window);
        return '<tr class="mat-mdc-row mdc-data-table__row">' +
          '<td class="mat-mdc-cell mdc-data-table__cell"><span class="text-cca-base-sm text-neutral-body whitespace-nowrap">' +
          r.label + '<br />(' + r.kind + ')</span></td>' +
          '<td class="mat-mdc-cell mdc-data-table__cell">' + stamp('Between', r.end.date, w.from + ' – ' + w.to) + '</td>' +
          '<td class="mat-mdc-cell mdc-data-table__cell">' + stamp('At', r.end.date, w.from) + '</td>' +
          '<td class="mat-mdc-cell mdc-data-table__cell">' + stamp('At', r.end.date, w.from) + '</td>' +
          '<td class="mat-mdc-cell mdc-data-table__cell">' + stamp('At', r.end.date, w.to) + '</td>' +
          '<td class="mat-mdc-cell mdc-data-table__cell"><span class="text-2xs text-neutral-caption">0 minutes</span></td>' +
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

  /* ---------------------------------------------------------------- tabs */

  /* Seven tabs, as the app has them. Only Basic Info is built; the rest say so
     rather than pretending — a detail page with one tab misrepresents the
     information architecture, and someone reviewing this needs to see that
     Pricing and Documents are their own places. */
  var TABS = [
    { name: 'Basic Info', built: true },
    { name: 'Actions', built: false, badge: 1 },
    { name: 'Documents', built: false },
    { name: 'Route Planning', built: false },
    { name: 'Pricing', built: false },
    { name: 'Communication', built: false },
    { name: 'Event Log', built: false },
  ];
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
    bodyHost.innerHTML =
      /* One card: header, rule, status, map — cca-order-map on the app. */
      '<section class="page-container flex w-full flex-col gap-4">' +
      detailHeader(o) + mapRegion() + '</section>' +
      /* Two columns: the narrow one carries what the order IS, the wide one what
         happens to it. Stacks on a narrow viewport rather than scrolling. */
      '<div class="mt-4 flex flex-wrap items-start gap-4">' +
      '<div class="flex min-w-80 flex-1 flex-col gap-4">' +
      financeSummary(o) + contacts(o) + routeDetails(o) + loadSummary(o) +
      requestedVehicle(o) + carrierAndVehicle(o) +
      '</div>' +
      '<div class="flex min-w-80 flex-[2] flex-col gap-4">' +
      locationsInfo(o) + dateAndTimes(o) + references(o) + parkingRequirements() +
      instructions() + co2(o) +
      '</div></div>';
  }

  function renderTitle(o) {
    titleHost.innerHTML =
      '<h1 class="text-NC-blue-default">Order Details - ' + esc(o.id) + '</h1>' +
      /* Staging puts the order type in a cca-numerical-badge on `highlight`,
         not the label badge the list column uses. */
      (o.type
        ? '<cca-numerical-badge class="flex h-full items-center">' +
          '<span class="inline-flex min-w-3.75 items-center justify-center rounded-full ' +
          'align-middle font-medium highlight"><span class="flex h-4 min-w-4 items-center ' +
          'justify-center px-1 text-2xs">' + esc(o.type) + '</span></span></cca-numerical-badge>'
        : '');
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
