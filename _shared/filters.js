/*
 * Shared filter drawer, pinned chips and value popover
 * ----------------------------------------------------
 *   <script src="../_shared/filters.js"></script>   (after routes.js)
 *
 * The Orders filter mechanism, once, for any prototype showing a record list.
 * Built from the running app at development.ctrlchain.com/shipper-tms/order
 * rather than from a Figma frame, because the app has moved on from the board —
 * see NOTES at the foot of this file for the differences.
 *
 * HOW FILTERS WORK IN THIS PRODUCT. Worth reading before changing any of it,
 * because it is one mechanism wearing three faces:
 *
 *   · Filters belong to the ACTIVE SAVED VIEW. The drawer is headed by the
 *     view's name, not by the word "Filters", and its count badge counts the
 *     filters carrying values in that view.
 *   · Each drawer row is a pin, the name, a count badge once values are
 *     applied, and a chevron. Pinned rows sort to the top and open expanded;
 *     the rest sit below, collapsed, alphabetical.
 *   · PINNING IS A LAYOUT CHOICE, NOT A FILTERING ONE. It surfaces the filter
 *     above the table and applies nothing. The "Show pinned filters above the
 *     table" switch hides that row wholesale.
 *   · A PINNED CHIP IS CLICKABLE and opens its values inline, so the common
 *     case never needs the drawer.
 *   · THE SAME FILTER RENDERS TWO WAYS depending on where you meet it: chips
 *     in the drawer, a checkbox list in the chip's popover. That is the app's
 *     behaviour, not a slip.
 *   · There is no Apply step. Picking a value filters immediately; the only
 *     footer action is Save Changes, which saves the view.
 *
 * USAGE
 *
 *     const filters = CCA_FILTERS.orders();          // the 31-filter preset
 *     const ui = CCA_FILTERS.mount({
 *       filters: filters,
 *       records: CCA_DATA.allOrders(),
 *       viewName: 'All orders',
 *       onChange: renderRows,                        // called after every change
 *     });
 *     ui.visible();      // the records surviving the applied filters
 *
 * mount() expects three things already in the page: a `[data-filters-button]`,
 * a `[data-pinned-filters]` row, and nothing else — it appends its own overlay
 * containers to <body>. See oms/index.html for the markup it needs.
 *
 * A FILTER
 *
 *     { name, kind, pinned, values?, field?, match?, derive? }
 *
 *   kind    chips | select | text | date | switch — which control renders
 *   field   a record property to filter on, and to derive values from
 *   derive  a function(records) returning the value list, when `field` will not
 *   match   a function(record, applied) for anything the above cannot express
 *
 * A filter with no `field`, `derive` or `match` is INERT: its control renders
 * and does nothing, and the drawer says so. That is deliberate — the app has
 * filters this repo's fixtures cannot exercise (License plate, DIFOT codes),
 * and a control that silently does nothing is worse than one admitting it.
 */
(function () {
  'use strict';

  var CATEGORY = { transport: 'Transport', warehouse: 'Warehouse', invoice: 'Invoice' };

  /*
   * Which order types belong to which category. Order Type is not a flat list:
   * an invoice order has no type at all, and no order is both a transport
   * movement and a warehouse one — so the two filters interlock.
   */
  var TYPE_DOMAIN = {
    Brokerage: 'transport',
    'Managed transportation': 'transport',
    'Own Fleet': 'transport',
    SAAS: 'transport',
    Inbound: 'warehouse',
    Outbound: 'warehouse',
  };

  function icon(name) {
    return (
      '<cca-icon><mat-icon class="mat-icon notranslate cca-icon cca-icon-' + name +
      ' mat-ligature-font mat-icon-inline" aria-hidden="true"></mat-icon></cca-icon>'
    );
  }

  function uniq(list) {
    var seen = {}, out = [];
    list.forEach(function (v) {
      if (v === undefined || v === null || v === '') return;
      if (!seen[v]) { seen[v] = 1; out.push(v); }
    });
    return out.sort();
  }

  /* ------------------------------------------------ the Orders filter preset */

  /*
   * The app's real 31, read off staging, plus Category — which the combined
   * OMS table adds because with three domains the type word can no longer
   * carry the domain. Order matters: the app lists pinned first, then the rest
   * alphabetically, and mount() re-sorts anyway.
   */
  function orders() {
    var byField = function (f) { return function (r) { return r[f]; }; };
    return [
      { name: 'Category', kind: 'chips', pinned: true,
        values: ['Transport', 'Warehouse', 'Invoice'],
        match: function (r, on) { return on.indexOf(CATEGORY[r.domain]) !== -1; } },

      { name: 'Order Type', kind: 'chips', pinned: true,
        /* The app spells MT out in the filter while the badge abbreviates it.
           Warehouse types are appended — the app's list is transport-only. */
        values: ['Brokerage', 'Managed transportation', 'Own Fleet', 'SAAS', 'Inbound', 'Outbound'],
        match: function (r, on) {
          var t = r.type === 'MT' ? 'Managed transportation' : r.type;
          return on.indexOf(t) !== -1;
        } },

      { name: 'Order Status', kind: 'chips', pinned: true,
        values: ['Cancelled', 'Carrier Informed', 'Completed', 'Delivery Attempt Failed',
                 'In Transit', 'Missing POD', 'New', 'Searching for Carrier',
                 'Registered', 'Ready to Ship', 'Truck Arrived', 'Loaded', 'Departed', 'Delivered'],
        field: 'status' },

      { name: 'Account Manager', kind: 'select', pinned: false, field: 'accountManager' },
      { name: 'Addresses', kind: 'text', pinned: false,
        /* Free text across both ends, which is what the app's Addresses does. */
        match: function (r, on) {
          var q = String(on[0] || '').toLowerCase();
          var ends = r.domain === 'warehouse' ? [r.origin, r.destination] : [r.pickup, r.delivery];
          return ends.some(function (e) {
            return e && [e.name, e.street, e.city, e.country].join(' ').toLowerCase().indexOf(q) !== -1;
          });
        } },
      { name: 'Assigned Operator', kind: 'select', pinned: false, field: 'assignedOperator' },
      { name: 'Booked with Contracted Lane', kind: 'select', pinned: false },
      { name: 'Carrier Assignment Status', kind: 'select', pinned: false },
      { name: 'Carrier Enterprise', kind: 'select', pinned: false },
      { name: 'Carrier Group', kind: 'select', pinned: false, field: 'carrierGroup' },
      { name: 'Carrier Invoice Status', kind: 'select', pinned: false },
      { name: 'Customer Invoice Status', kind: 'select', pinned: false, field: 'customerInvoiceStatus' },
      { name: 'Desired Delivery Date', kind: 'date', pinned: false },
      { name: 'Desired Pickup Date', kind: 'date', pinned: false },
      { name: 'Desired Pickup or Delivery Date', kind: 'date', pinned: false },
      { name: 'Destination Location', kind: 'select', pinned: false,
        derive: function (rs) {
          return uniq(rs.map(function (r) {
            var e = r.domain === 'warehouse' ? r.destination : r.delivery;
            return e && e.city;
          }));
        },
        match: function (r, on) {
          var e = r.domain === 'warehouse' ? r.destination : r.delivery;
          return e && on.indexOf(e.city) !== -1;
        } },
      { name: 'Expected Delivery Date', kind: 'date', pinned: false },
      { name: 'Expected Pickup Date', kind: 'date', pinned: false },
      { name: 'Expected Pickup or Delivery Date', kind: 'date', pinned: false },
      { name: 'First Cargo Loaded Date', kind: 'date', pinned: false },
      { name: 'Has DIFOT Reason code', kind: 'switch', pinned: false },
      { name: 'Last Cargo Unloaded Date', kind: 'date', pinned: false },
      { name: 'License plate', kind: 'text', pinned: false },
      { name: 'Negative margin', kind: 'switch', pinned: false },
      { name: 'Order created', kind: 'date', pinned: false, field: 'createdAt' },
      { name: 'Origin Location', kind: 'select', pinned: false,
        derive: function (rs) {
          return uniq(rs.map(function (r) {
            var e = r.domain === 'warehouse' ? r.origin : r.pickup;
            return e && e.city;
          }));
        },
        match: function (r, on) {
          var e = r.domain === 'warehouse' ? r.origin : r.pickup;
          return e && on.indexOf(e.city) !== -1;
        } },
      { name: 'POD Status', kind: 'select', pinned: false,
        derive: function () { return ['Approved', 'Not approved']; },
        match: function (r, on) {
          if (r.podApproved === undefined || r.podApproved === null) return false;
          return on.indexOf(r.podApproved ? 'Approved' : 'Not approved') !== -1;
        } },
      { name: 'Sales Organisation', kind: 'select', pinned: false, field: 'salesOrganisation' },
      { name: 'Service Type', kind: 'select', pinned: false },
      { name: 'Shipper Enterprise', kind: 'select', pinned: false },
      { name: 'Shipper Group', kind: 'select', pinned: false, field: 'shipperGroup' },
      /* The app's answer to hidden invoice orders. A combined table that shows
         them by Category does not need it to do the work, but it exists. */
      { name: 'Show Invoice Orders Only', kind: 'switch', pinned: false,
        match: function (r) { return r.domain === 'invoice'; } },
      { name: 'Trip Reference', kind: 'text', pinned: false,
        match: function (r, on) {
          return String(r.tripReference || '').toLowerCase()
            .indexOf(String(on[0] || '').toLowerCase()) !== -1;
        } },
    ];
  }


  var __MOUNT_FN__;

  /* ------------------------------------------------------------- controls */

  /*
   * Every kind reduces to a control the bundle documents. There is NO select
   * and NO datepicker in design-system/dist — checked, not assumed — so:
   *
   *   chips   cca-chip set                     components/chips.html
   *   select  checkbox list                    components/input.html
   *   text    mat-form-field input             components/input.html
   *   date    two inputs, From and To          components/input.html
   *   switch  mat-slide-toggle                 components/input.html
   *
   * A `select` being a checkbox list is not a compromise: staging's Assigned
   * Operator dropdown is a multi-select, and the pinned chip's popover renders
   * exactly this. Same control, two placements.
   */

  /*
   * A LABELLED field, which is how dev renders text and select filters — the
   * filter's name sits in the notch above the control, so the row reads as a
   * form field rather than a bare box, and the control is visible whether or
   * not it holds anything.
   *
   * Markup copied from the "Filled" variant on components/input.html:
   * `mdc-text-field--label-floating` on the wrapper (NOT `--no-label`),
   * `mdc-notched-outline--upgraded --notched` on the outline, and
   * `mdc-floating-label--float-above` on the label.
   *
   * THE NOTCH NEEDS AN EXPLICIT WIDTH. Angular measures the label and sets it
   * at runtime; the doc page shows `style="width: 63px"` baked in. A static
   * page has to state it, so it is estimated from the label length here —
   * layout only, and the reason a very long filter name may notch slightly
   * wide or narrow.
   */
  function labelledField(id, label, value, suffix, placeholder) {
    var notch = Math.round(label.length * 6.2 + 12);
    return (
      '<mat-form-field class="mat-mdc-form-field mat-mdc-form-field-type-mat-input ' +
      'mat-form-field-appearance-outline mat-primary w-full' +
      (suffix ? ' mat-mdc-form-field-has-icon-suffix' : '') + '">' +
      '<div class="mat-mdc-text-field-wrapper mdc-text-field mdc-text-field--outlined ' +
      'mdc-text-field--label-floating">' +
      '<div class="mat-mdc-form-field-flex">' +
      '<div class="mdc-notched-outline mdc-notched-outline--upgraded mdc-notched-outline--notched">' +
      '<div class="mdc-notched-outline__leading mat-mdc-notch-piece"></div>' +
      '<div class="mdc-notched-outline__notch mat-mdc-notch-piece" ' +
      'style="width: ' + notch + 'px; max-width: calc(100% - 60px)">' +
      '<label class="mdc-floating-label mat-mdc-floating-label mdc-floating-label--float-above" ' +
      'for="' + id + '">' + label + '</label></div>' +
      '<div class="mdc-notched-outline__trailing mat-mdc-notch-piece"></div></div>' +
      '<div class="mat-mdc-form-field-infix">' +
      '<input type="text" class="mat-mdc-input-element mdc-text-field__input" ' +
      'data-filter-input="' + id + '" placeholder="' + (placeholder || '') + '" value="' +
      (value || '') + '" autocomplete="off" /></div>' +
      (suffix ? '<div class="mat-mdc-form-field-icon-suffix">' + icon(suffix) + '</div>' : '') +
      '</div></div>' +
      '<div class="mat-mdc-form-field-subscript-wrapper mat-mdc-form-field-bottom-align"></div>' +
      '</mat-form-field>'
    );
  }

  function textField(id, placeholder, value, suffix) {
    return (
      '<mat-form-field class="mat-mdc-form-field mat-mdc-form-field-type-mat-input ' +
      'mat-form-field-appearance-outline mat-primary w-full' +
      (suffix ? ' mat-mdc-form-field-has-icon-suffix' : '') + '">' +
      '<div class="mat-mdc-text-field-wrapper mdc-text-field mdc-text-field--outlined mdc-text-field--no-label">' +
      '<div class="mat-mdc-form-field-flex"><div class="mdc-notched-outline">' +
      '<div class="mdc-notched-outline__leading mat-mdc-notch-piece"></div>' +
      '<div class="mdc-notched-outline__notch mat-mdc-notch-piece"></div>' +
      '<div class="mdc-notched-outline__trailing mat-mdc-notch-piece"></div></div>' +
      '<div class="mat-mdc-form-field-infix">' +
      '<input type="text" class="mat-mdc-input-element mdc-text-field__input" ' +
      'data-filter-input="' + id + '" placeholder="' + placeholder + '" value="' +
      (value || '') + '" autocomplete="off" /></div>' +
      (suffix ? '<div class="mat-mdc-form-field-icon-suffix">' + icon(suffix) + '</div>' : '') +
      '</div></div>' +
      '<div class="mat-mdc-form-field-subscript-wrapper mat-mdc-form-field-bottom-align"></div>' +
      '</mat-form-field>'
    );
  }

  function checkboxRow(name, value, checked, disabled, why, labelText) {
    var id = 'f-' + name.replace(/[^a-z0-9]/gi, '') + '-' + value.replace(/[^a-z0-9]/gi, '');
    return (
      '<div class="flex items-center px-3 py-1' + (checked ? ' surface-brand-lighter' : '') +
      (disabled ? ' opacity-50' : '') + '" data-menu-value="' + value + '"' +
      (disabled ? ' aria-disabled="true" title="' + why + '"' : '') + '>' +
      '<mat-checkbox class="mat-mdc-checkbox mat-primary' + (disabled ? ' mat-mdc-checkbox-disabled' : '') + '">' +
      '<div class="mdc-form-field mat-internal-form-field"><div class="mdc-checkbox">' +
      '<input type="checkbox" class="mdc-checkbox__native-control" id="' + id + '"' +
      (checked ? ' checked' : '') + (disabled ? ' disabled' : '') + ' />' +
      '<div class="mdc-checkbox__background">' +
      '<svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24" aria-hidden="true">' +
      '<path class="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59"></path>' +
      '</svg><div class="mdc-checkbox__mixedmark"></div></div></div>' +
      (labelText === '' ? ''
        : '<label class="mdc-label" for="' + id + '">' + (labelText || value) + '</label>') +
      '</div></mat-checkbox></div>'
    );
  }

  function switchRow(name, on) {
    return (
      '<div class="proto-switch-row flex items-center rounded-lg surface-neutral-default px-4 py-2">' +
      '<mat-slide-toggle class="mat-mdc-slide-toggle mat-primary">' +
      '<div class="mdc-form-field mat-internal-form-field">' +
      '<button type="button" role="switch" aria-checked="' + (on ? 'true' : 'false') +
      '" data-filter-switch="' + name + '" class="mdc-switch ' +
      (on ? 'mdc-switch--selected' : 'mdc-switch--unselected') + '">' +
      '<div class="mdc-switch__track"></div><div class="mdc-switch__handle-track">' +
      '<div class="mdc-switch__handle"><div class="mdc-switch__shadow">' +
      '<div class="mdc-elevation-overlay"></div></div><div class="mdc-switch__ripple"></div>' +
      '<div class="mdc-switch__icons">' +
      '<svg class="mdc-switch__icon mdc-switch__icon--on" viewBox="0 0 24 24" aria-hidden="true">' +
      '<path d="M19.69,5.23L8.96,15.96l-4.23-4.23L2.96,13.5l6,6L21.46,7L19.69,5.23z" /></svg>' +
      '<svg class="mdc-switch__icon mdc-switch__icon--off" viewBox="0 0 24 24" aria-hidden="true">' +
      '<path d="M20 13H4v-2h16v2z" /></svg></div></div></div></button>' +
      '<label>' + name + '</label></div></mat-slide-toggle></div>'
    );
  }

  /* Dates arrive as "Mon, 17 Aug 2026". Strip the weekday so Date.parse copes. */
  function asTime(v) {
    if (!v) return NaN;
    return Date.parse(String(v).replace(/^[A-Za-z]{3},\s*/, ''));
  }

  __MOUNT_FN__ = function (opts) {
    var filters = opts.filters;
    var records = opts.records || [];
    var viewName = opts.viewName || 'All';
    var onChange = opts.onChange || function () {};
    var showPinned = opts.showPinned !== false;
    var query = '';
    var openChip = null;
    var openList = {};   // which select filters have their list open
    var listQuery = {}; // search text inside each select's panel

    filters.forEach(function (f) { if (!f.applied) f.applied = []; });

    var by = function (n) { return filters.filter(function (f) { return f.name === n; })[0]; };
    var appliedOf = function (n) { var f = by(n); return (f && f.applied) || []; };
    var count = function (f) { return f.applied.length; };
    var totalApplied = function () { return filters.filter(count).length; };
    var isInert = function (f) { return !f.field && !f.match && !f.derive; };

    /* Values a select offers: derived from the records, or from `derive`. */
    function valuesOf(f) {
      if (f.values) return f.values;
      if (f.derive) return f.derive(records);
      if (f.field) return uniq(records.map(function (r) { return r[f.field]; }));
      return [];
    }

    /*
     * Category and Order Type interlock: no order is both a transport movement
     * and a warehouse one, and an invoice order has no type at all. Offering
     * the combination invites a filter to an empty table.
     */
    function typeDisabled(v) {
      var cats = appliedOf('Category');
      if (!cats.length) return false;
      return cats.indexOf(CATEGORY[TYPE_DOMAIN[v]]) === -1;
    }
    function disabledIn(f, v) { return f.name === 'Order Type' && typeDisabled(v); }
    function disabledWhy() {
      return 'Not available with Category: ' + appliedOf('Category').join(', ');
    }
    /* A selection that still filters but can no longer be seen or unset is the
       worst of both, so narrowing Category drops what it made unreachable. */
    function prune() {
      var t = by('Order Type');
      if (t) t.applied = t.applied.filter(function (v) { return !typeDisabled(v); });
    }

    /* --------------------------------------------------------- filtering */
    function visible() {
      return records.filter(function (r) {
        return filters.every(function (f) {
          if (!f.applied.length) return true;         // no values = no filter
          if (f.match) return !!f.match(r, f.applied);
          if (f.kind === 'date' && f.field) {
            var t = asTime(r[f.field]);
            var from = asTime(f.applied[0]), to = asTime(f.applied[1]);
            if (!isNaN(from) && !(t >= from)) return false;
            if (!isNaN(to) && !(t <= to)) return false;
            return true;
          }
          if (f.field) return f.applied.indexOf(r[f.field]) !== -1;
          return true;                                 // inert: renders, filters nothing
        });
      });
    }

    /*
     * THE DROPDOWN PANEL — one builder, used in both places.
     *
     * The drawer's select and a pinned chip's popover are the SAME ng-select
     * panel: the interaction shows the identical thing opening from a chip
     * above the table. So it is built once here.
     *
     * The header is one row — a select-all checkbox beside a search field with
     * the search icon as a suffix and "Type to search" as its placeholder.
     * filters-select.css told me both elements live in the header; the
     * interaction told me they sit side by side.
     *
     * Hover comes free: `.ng-option-marked` is the platform's green
     * (surface-brand-lighter), and selection is `.ng-option-selected`.
     */
    function panelFor(f) {
      var vals = valuesOf(f);
      var q = (listQuery[f.name] || '').toLowerCase();
      var shown = q
        ? vals.filter(function (v) { return String(v).toLowerCase().indexOf(q) !== -1; })
        : vals;
      var allOn = vals.length > 0 && f.applied.length === vals.length;

      return (
        '<div class="ng-dropdown-panel ng-select-custom ng-select-bottom">' +
        '<div class="ng-dropdown-header flex items-center gap-2">' +
        checkboxRow(f.name, '__all__', allOn, false, '', '') +
        '<div class="proto-no-subscript flex-1">' +
        textField(f.name + '|listsearch', 'Type to search', listQuery[f.name], 'search') +
        '</div></div>' +
        '<div class="ng-dropdown-panel-items"><div class="scrollable-content">' +
        (shown.length
          ? shown.map(function (v) {
              var on = f.applied.indexOf(v) !== -1;
              return '<div class="ng-option' + (on ? ' ng-option-selected' : '') +
                '" data-menu-value="' + v + '">' +
                checkboxRow(f.name, String(v), on, false, '') + '</div>';
            }).join('')
          : '<div class="ng-option loading-notfound-text">No results</div>') +
        '</div></div></div>'
      );
    }

    /* ------------------------------------------------------------ markup */
    function control(f) {
      if (f.kind === 'chips' || f.kind === 'select') {
        var vals = valuesOf(f);
        /*
         * Only a CHIP SET with no values has nothing to draw. A select still
         * renders its field — that is the whole point of it being a field
         * rather than an inline list, and returning early here was the bug
         * that made 17 filters look dead when expanded.
         */
        if (!vals.length && f.kind === 'chips') {
          return '<div class="mt-2 text-cca-base-sm text-neutral-caption">' +
                 'No values in this data set</div>';
        }
        if (f.kind === 'chips') {
          /*
           * "All" on its own row above the values, as dev has it. It is not a
           * value — it clears the filter, and reads as selected when nothing
           * else is.
           */
          var all = '<div class="mt-3"><mat-chip-option class="mat-mdc-chip ' +
            'mat-mdc-standard-chip mat-mdc-chip-option mdc-evolution-chip ' +
            'mdc-evolution-chip--filter mdc-evolution-chip--selectable ' +
            'mdc-evolution-chip--with-primary-graphic cca-chip mat-primary' +
            (f.applied.length ? '' : ' mdc-evolution-chip--selected') +
            '" data-filter="' + f.name + '" data-value-all="1">' +
            '<span class="mat-mdc-chip-focus-overlay"></span>' +
            '<span class="mdc-evolution-chip__cell mdc-evolution-chip__cell--primary">' +
            '<span class="mdc-evolution-chip__action mat-mdc-chip-action ' +
            'mdc-evolution-chip__action--primary" role="option" aria-selected="' +
            (f.applied.length ? 'false' : 'true') + '">' +
            '<span class="mdc-evolution-chip__graphic mat-mdc-chip-graphic">' +
            '<span class="mdc-evolution-chip__checkmark">' +
            '<svg class="mdc-evolution-chip__checkmark-svg" viewBox="-2 -3 30 30" aria-hidden="true">' +
            '<path class="mdc-evolution-chip__checkmark-path" fill="none" stroke="currentColor" ' +
            'd="M1.73,12.91 8.1,19.28 22.79,4.59"></path></svg></span></span>' +
            '<span class="mdc-evolution-chip__text-label mat-mdc-chip-action-label">All</span>' +
            '</span></span></mat-chip-option></div>';
          return all + '<div class="mt-2 flex flex-wrap items-center gap-2">' + vals.map(function (v) {
            var on = f.applied.indexOf(v) !== -1, off = disabledIn(f, v);
            return '<mat-chip-option class="mat-mdc-chip mat-mdc-standard-chip mat-mdc-chip-option ' +
              'mdc-evolution-chip mdc-evolution-chip--filter mdc-evolution-chip--selectable ' +
              'mdc-evolution-chip--with-primary-graphic cca-chip mat-primary' +
              (on ? ' mdc-evolution-chip--selected' : '') +
              (off ? ' mdc-evolution-chip--disabled' : '') + '"' +
              (off ? ' aria-disabled="true" title="' + disabledWhy() + '"' : '') +
              ' data-filter="' + f.name + '" data-value="' + v + '">' +
              '<span class="mat-mdc-chip-focus-overlay"></span>' +
              '<span class="mdc-evolution-chip__cell mdc-evolution-chip__cell--primary">' +
              '<span class="mdc-evolution-chip__action mat-mdc-chip-action ' +
              'mdc-evolution-chip__action--primary" role="option" aria-selected="' + on + '">' +
              '<span class="mdc-evolution-chip__graphic mat-mdc-chip-graphic">' +
              '<span class="mdc-evolution-chip__checkmark">' +
              '<svg class="mdc-evolution-chip__checkmark-svg" viewBox="-2 -3 30 30" aria-hidden="true">' +
              '<path class="mdc-evolution-chip__checkmark-path" fill="none" stroke="currentColor" ' +
              'd="M1.73,12.91 8.1,19.28 22.79,4.59"></path></svg></span></span>' +
              '<span class="mdc-evolution-chip__text-label mat-mdc-chip-action-label">' + v + '</span>' +
              '</span></span></mat-chip-option>';
          }).join('') + '</div>';
        }
        /*
         * A SELECT IS AN ng-select, and its dropdown is the platform's own
         * panel — not a list I invent.
         *
         *   ds/material-vendor.css        ng-select's base
         *   ds/platform-02.css            .ng-dropdown-panel.ng-select-custom —
         *                                 background, radius, per-side shadow,
         *                                 3em options, marked and selected
         *                                 states, header and footer
         *   ds/components/filters-select.css
         *                                 the drawer's overrides: 296px max
         *                                 height, 316px max width, 8px
         *                                 padding-block, 30px options
         *
         * The first two are imported by ds/index.css; the third a page links.
         *
         * This replaced an inline `max-h-44 overflow-y-auto` list I had
         * invented, which CLIPPED ROWS MID-HEIGHT — its height was not a
         * multiple of the row height and it had no padding. The real panel caps
         * at 296px with 8px padding-block and whole 3em rows, so no row is ever
         * half-shown.
         *
         * The field still renders whether or not there are options, because a
         * filter that draws nothing looks broken — 17 of these have no backing
         * field in this repo's fixtures.
         */
        var summary = f.applied.length ? f.applied.join(', ') : '';
        var placeholder = vals.length ? 'Select ' + f.name.toLowerCase()
                                      : 'No options in this data set';
        /*
         * <cca-filters-select> IS LOAD-BEARING, not decoration. Every rule in
         * ds/components/filters-select.css is scoped to
         * `cca-filters-select .ng-dropdown-panel …`, so without the element the
         * panel gets no max-height, no max-width and no padding-block — it just
         * grows to fit and never scrolls. Measured: maxHeight computed to
         * `none` until this wrapper existed.
         */
        return '<cca-filters-select class="proto-ng-select mt-2" data-filter="' +
          f.name + '">' +
          labelledField(f.name, f.name, summary, 'chevron-down', placeholder) +
          (vals.length && openList[f.name] ? panelFor(f) : '') +
          '</cca-filters-select>';
      }
      if (f.kind === 'text') {
        return '<div class="mt-2" data-filter="' + f.name + '">' +
          labelledField(f.name, f.name, f.applied[0], null,
                        'Search ' + f.name.toLowerCase()) + '</div>';
      }
      if (f.kind === 'date') {
        // No datepicker in the bundle, so a range is two text inputs.
        return '<div class="mt-2 flex gap-2" data-filter="' + f.name + '">' +
          '<div class="flex-1">' + textField(f.name + '|from', 'From', f.applied[0]) + '</div>' +
          '<div class="flex-1">' + textField(f.name + '|to', 'To', f.applied[1]) + '</div></div>';
      }
      if (f.kind === 'switch') {
        return '<div class="mt-2" data-filter="' + f.name + '">' +
          switchRow(f.name, !!f.applied.length) + '</div>';
      }
      return '';
    }

    function row(f, expanded) {
      var n = count(f);
      return '<div data-filter-row="' + f.name + '">' +
        '<div class="flex cursor-pointer items-center gap-2" data-toggle-row="' + f.name + '">' +
        '<button ccaButton class="cca-btn cca-btn--icon cca-btn--icon-only cca-btn--x-small" ' +
        'aria-label="' + (f.pinned ? 'Unpin ' : 'Pin ') + f.name + '" data-pin="' + f.name + '">' +
        icon(f.pinned ? 'pinned-yes' : 'pinned') + '</button>' +
        '<span class="text-cca-label-md text-neutral-title">' + f.name + '</span>' +
        (n ? '<cca-numerical-badge class="ml-auto"><span class="rounded-full font-medium success ' +
             'inline-flex items-center justify-center align-middle min-w-3.75">' +
             '<span class="flex items-center justify-center min-w-6 px-2 py-1 text-cca-label-sm">' +
             n + '</span></span></cca-numerical-badge>'
           : '<span class="ml-auto"></span>') +
        icon(expanded ? 'chevron-up' : 'chevron-down') + '</div>' +
        (expanded
          ? control(f) + (isInert(f)
              ? '<div class="mt-1 text-cca-label-sm text-neutral-caption">' +
                'Not backed by this prototype\u2019s data \u2014 the control works, ' +
                'the list will not change</div>'
              : '')
          : '') +
        '</div>';
    }

    var expanded = {};
    filters.forEach(function (f) { if (f.pinned) expanded[f.name] = true; });

    return { visible: visible, filters: filters, valuesOf: valuesOf,
             appliedCount: count,
             openList: openList,
             listQuery: listQuery,
             panelFor: panelFor,
             typeDisabled: typeDisabled, prune: prune, isInert: isInert,
             expanded: expanded, appliedOf: appliedOf, totalApplied: totalApplied,
             control: control, row: row, checkboxRow: checkboxRow,
             state: function () { return { showPinned: showPinned, query: query, openChip: openChip,
                                           viewName: viewName, onChange: onChange }; },
             set: function (k, v) {
               if (k === 'showPinned') showPinned = v;
               if (k === 'query') query = v;
               if (k === 'openChip') openChip = v;
             } };
  };

  window.CCA_FILTERS = {
    orders: orders,
    CATEGORY: CATEGORY,
    TYPE_DOMAIN: TYPE_DOMAIN,
    uniq: uniq,
    icon: icon,
    mount: __MOUNT_FN__,
  };
})();
