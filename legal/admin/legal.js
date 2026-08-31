/*
 * Legal Management — page script
 * ==============================
 * Kept out of index.html on purpose. This file builds table markup from
 * template literals, and a page that does that must never have its structural
 * tags string-replaced (see the /prototype skill). Separating the two means
 * index.html contains exactly one </body> and this file contains none.
 *
 * Everything rendered here comes from _shared/data.js, so the row a reviewer
 * clicks is the same record any future detail prototype will open.
 */
(function () {
  'use strict';

  var D = window.CCA_DATA;

  // --------------------------------------------------------------- cells --
  //
  // One function per column type. Each returns the INNER html of a <td>; the
  // cell classes are added by the renderer, because Material's table wants
  // cdk-column-<key> / mat-column-<key> on every cell and the app relies on
  // those for column-specific padding.

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function icon(name, cls) {
    return (
      '<cca-icon' + (cls ? ' class="' + cls + '"' : '') + '>' +
      '<mat-icon class="mat-icon notranslate cca-icon cca-icon-' + name + ' mat-icon-inline" aria-hidden="true"></mat-icon>' +
      '</cca-icon>'
    );
  }

  /*
   * Status badge. The flavours are the app's: Published is `primary`, and both
   * Draft and New are `neutral` — the same grey. Do not "fix" that by giving
   * New its own colour; on this screen the app really does render them alike,
   * and a redesign inventing a third flavour should be a deliberate decision
   * rather than something the prototype quietly did first.
   */
  function statusCell(status) {
    var flavour = status === 'Published' ? 'primary' : 'neutral';
    return (
      '<cca-status-badge style="display:block">' +
      '<div class="flex w-fit items-center justify-center rounded-full px-2.5 py-1 text-cca-base-sm font-medium whitespace-nowrap ' + flavour + '">' +
      esc(status) +
      '</div></cca-status-badge>'
    );
  }

  /*
   * A sales organisation is a flag plus a name. The flag is a 12px circle —
   * span.h-3.w-3 around the SVG, exactly as the app does it.
   */
  function orgCell(name, flag) {
    if (!name) return '';
    var img = flag
      ? '<span class="h-3 w-3"><img class="rounded-sm" src="../../_shared/assets/flags/' + esc(flag) + '.svg" alt="" /></span>'
      : '';
    return '<span class="flex items-center gap-2">' + img + esc(name) + '</span>';
  }

  /*
   * cca-time-window: a small "At" caption over a clock icon and the moment on
   * two lines. When there is no date the caption is empty and the value reads
   * "To be confirmed" — that is the app's empty state, not a placeholder.
   */
  function timeCell(date, time) {
    var value = date
      ? esc(date) + '<br />' + esc(time)
      : '<span class="text-neutral-body">To be confirmed</span>';
    return (
      '<cca-time-window style="display:block">' +
      '<div class="flex flex-col gap-1 whitespace-nowrap">' +
      '<p class="ml-6 text-cca-label-sm text-neutral-caption">' + (date ? 'At' : '') + '</p>' +
      '<div class="flex shrink-0 gap-2 text-neutral-body">' +
      icon('clock', 'w-4 shrink-0 self-start text-neutral-body') +
      '<span class="shrink-0"><span>' + value + '</span></span>' +
      '</div></div></cca-time-window>'
    );
  }

  // A document name is the only link in the row, and it is brand-coloured.
  function nameCell(row) {
    return (
      '<a href="#" data-screen="admin.legal.document" data-params=' +
      "'" + JSON.stringify({ id: row.id }) + "'" +
      '>' + esc(row.name) + '</a>'
    );
  }

  /*
   * The signing-history Group cell is two rows in a 16px/rest grid: the shipper
   * group with a building icon, the sub-group with a people icon beneath. A
   * record whose user was deleted keeps the row but loses both names.
   */
  function groupCell(row) {
    var out = '<div class="grid w-48 grid-cols-[1rem_minmax(0,1fr)] gap-x-2">';
    out += icon('building');
    out += '<span class="pb-2 whitespace-normal wrap-break-word">' + esc(row.group) + '</span>';
    if (row.subGroup) {
      out += icon('group', 'text-cca-base');
      out += '<span class="flex items-center whitespace-normal wrap-break-word">' + esc(row.subGroup) + '</span>';
    }
    return out + '</div>';
  }

  // ---------------------------------------------------------------- views --
  //
  // A view is one table: its columns, where its rows come from, and how many
  // there are in total. The five CTRLCHAIN tabs are five views over the same
  // document set, which is exactly how the app models them.

  var DOC_COLUMNS = [
    { key: 'name', label: 'Name', cell: nameCell, cellClass: 'text-brand-default' },
    { key: 'status', label: 'Status', cell: function (r) { return statusCell(r.status); } },
    { key: 'salesOrg', label: 'Sales Organisation', cell: function (r) { return orgCell(r.salesOrg, r.flag); }, cellClass: 'px-6' },
    { key: 'updatedAt', label: 'Last Updated at', cell: function (r) { return timeCell(r.updatedAt, r.updatedTime); } },
  ];

  function docView(category) {
    return {
      columns: DOC_COLUMNS,
      rows: function () { return D.legalDocumentsIn(category); },
    };
  }

  var VIEWS = {
    'shipper-tc': docView('shipper-tc'),
    'carrier-tc': docView('carrier-tc'),

    /*
     * Terms of Service is NOT a docView: it drops the Sales Organisation
     * column entirely, because the document is CtrlChain's own and belongs to
     * no sales entity. Privacy Policies keeps the column and leaves it blank.
     * Two different answers to the same problem, both copied as found.
     */
    'terms-of-service': {
      columns: [DOC_COLUMNS[0], DOC_COLUMNS[1], DOC_COLUMNS[3]],
      rows: function () { return D.legalDocumentsIn('terms-of-service'); },
    },
    'privacy-policy': docView('privacy-policy'),
    'invoicing-instruction': docView('invoicing-instruction'),

    'signing-history': {
      columns: [
        { key: 'userGroupName', label: 'Group', cell: groupCell },
        { key: 'userName', label: 'User', cell: function (r) { return esc(r.user); } },
        { key: 'signedOn', label: 'Signed on', cell: function (r) { return esc(r.signedOn); } },
        { key: 'version', label: 'Version', cell: function (r) { return esc(r.version); } },
        { key: 'salesOrganisation', label: 'Document Provided by', cell: function (r) { return orgCell(r.providedBy, r.flag); }, cellClass: 'px-6' },
        { key: 'signedAt', label: 'Signed At', cell: function (r) { return timeCell(r.signedAt, r.signedTime); }, sortable: true },
      ],
      toolbar: 'signing',
      /*
       * The real table holds 175,520 signings and the paginator says so. The
       * fixture holds 15. Rather than show nine empty pages, deeper pages
       * repeat the fixture with the clock wound back one minute per row — the
       * shape and the magnitude are both true even though the rows are not
       * 175,520 distinct records. `legalSigningsTotal` is what the paginator
       * counts, so the range label matches the app.
       */
      rows: function () { return D.legalSignings; },
      total: function () { return D.legalSigningsTotal; },
      rowAt: function (index) {
        var base = D.legalSignings;
        var src = base[index % base.length];
        if (index < base.length) return src;
        var minutes = 16 * 60 + 43 - index;
        var day = Math.floor(minutes < 0 ? (-minutes / 1440) + 1 : 0);
        var m = ((minutes % 1440) + 1440) % 1440;
        var clone = {};
        for (var k in src) clone[k] = src[k];
        clone.id = src.id + '-' + index;
        clone.signedTime = pad(Math.floor(m / 60)) + ':' + pad(m % 60);
        clone.signedAt = dayLabel(day);
        return clone;
      },
    },

    shippers: {
      columns: [
        { key: 'name', label: 'Name', cell: nameCell, cellClass: 'text-brand-default' },
        { key: 'status', label: 'Status', cell: function (r) { return statusCell(r.status); } },
        { key: 'providedBy', label: 'Provided by', cell: function (r) { return esc(r.providedBy); } },
        { key: 'updatedAt', label: 'Last Updated at', cell: function (r) { return timeCell(r.updatedAt, r.updatedTime); } },
      ],
      toolbar: 'columns',
      rows: function () { return D.legalShipperTerms; },
    },
  };

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  // Only ever counts backwards from the fixture's newest day.
  var DAYS = ['Thu, 27 Aug 2026', 'Wed, 26 Aug 2026', 'Tue, 25 Aug 2026', 'Mon, 24 Aug 2026', 'Sun, 23 Aug 2026'];
  function dayLabel(offset) { return DAYS[Math.min(offset, DAYS.length - 1)]; }

  var TABS = [
    { id: 'shipper-tc', label: 'Shipper T&C' },
    { id: 'carrier-tc', label: 'Carrier T&C' },
    { id: 'terms-of-service', label: 'Terms of Service' },
    { id: 'privacy-policy', label: 'Privacy Policies' },
    { id: 'invoicing-instruction', label: 'Invoicing Instruction' },
  ];

  var SEGMENTS = ['ctrlchain', 'signing-history', 'shippers'];

  // ---------------------------------------------------------------- state --

  var state = {
    segment: 'ctrlchain',
    tab: 'shipper-tc',
    page: {},        // view id → page index
    pageSize: {},    // view id → rows per page
    hidden: {},      // view id → { columnKey: true }
    sortAsc: false,  // signing history only, descending in the app
  };

  function viewId() {
    return state.segment === 'ctrlchain' ? state.tab : state.segment;
  }
  function view() { return VIEWS[viewId()]; }
  function page() { return state.page[viewId()] || 0; }
  function pageSize() { return state.pageSize[viewId()] || 10; }
  function hidden() { return state.hidden[viewId()] || (state.hidden[viewId()] = {}); }

  function total() {
    var v = view();
    return v.total ? v.total() : v.rows().length;
  }

  function pageRows() {
    var v = view();
    var start = page() * pageSize();
    var end = Math.min(start + pageSize(), total());
    var out = [];
    for (var i = start; i < end; i++) out.push(v.rowAt ? v.rowAt(i) : v.rows()[i]);
    if (v === VIEWS['signing-history'] && state.sortAsc) out.reverse();
    return out;
  }

  function columns() {
    var h = hidden();
    return view().columns.filter(function (c) { return !h[c.key]; });
  }

  // -------------------------------------------------------------- markup --

  function tableHtml() {
    var cols = columns();
    var rows = pageRows();

    var head = cols.map(function (c) {
      var sorted = c.sortable;
      var container =
        'mat-sort-header-container mat-focus-indicator' +
        (sorted ? ' mat-sort-header-sorted mat-sort-header-' + (state.sortAsc ? 'ascending' : 'descending') : ' mat-sort-header-descending');
      var arrow = sorted
        ? '<div class="mat-sort-header-arrow"><svg viewBox="0 -960 960 960" focusable="false" aria-hidden="true">' +
          '<path d="M440-240v-368L296-464l-56-56 240-240 240 240-56 56-144-144v368h-80Z"></path></svg></div>'
        : '';
      return (
        '<th class="mat-sort-header mat-mdc-header-cell mdc-data-table__header-cell cdk-header-cell cdk-column-' + c.key +
        ' mat-column-' + c.key + (sorted ? '' : ' mat-sort-header-disabled') +
        ' mat-mdc-table-sticky mat-mdc-table-sticky-border-elem-top" role="columnheader"' +
        (sorted ? ' data-sort="1" tabindex="0"' : '') + '>' +
        '<div class="' + container + '"><div class="mat-sort-header-content">' + esc(c.label) + '</div>' + arrow + '</div></th>'
      );
    }).join('');

    var body = rows.map(function (r) {
      return (
        '<tr class="mat-mdc-row mdc-data-table__row">' +
        cols.map(function (c) {
          return (
            '<td class="mat-mdc-cell mdc-data-table__cell cdk-cell cdk-column-' + c.key + ' mat-column-' + c.key +
            (c.cellClass ? ' ' + c.cellClass : '') + '">' + c.cell(r) + '</td>'
          );
        }).join('') +
        '</tr>'
      );
    }).join('');

    return (
      '<table class="mat-mdc-table mdc-data-table__table cdk-table w-full min-w-max whitespace-nowrap!">' +
      '<thead><tr class="mat-mdc-header-row mdc-data-table__header-row cdk-header-row" role="row">' + head + '</tr></thead>' +
      '<tbody class="mdc-data-table__content">' + body + '</tbody></table>'
    );
  }

  var PAGE_ICONS = {
    first: 'M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z',
    previous: 'M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z',
    next: 'M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z',
    last: 'M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z',
  };

  function pagerButton(kind, disabled) {
    return (
      '<button type="button" data-page="' + kind + '"' + (disabled ? ' disabled' : '') +
      ' class="mdc-icon-button mat-mdc-icon-button mat-mdc-button-base mat-mdc-paginator-navigation-' + kind +
      (disabled ? ' mat-mdc-button-disabled-interactive' : '') + ' mat-unthemed" aria-label="' + kind + ' page">' +
      '<span class="mat-mdc-button-persistent-ripple mdc-icon-button__ripple"></span>' +
      '<svg class="mat-mdc-paginator-icon" viewBox="0 0 24 24" focusable="false"><path d="' + PAGE_ICONS[kind] + '"></path></svg>' +
      '<span class="mat-focus-indicator"></span><span class="mat-mdc-button-touch-target"></span></button>'
    );
  }

  function paginatorHtml() {
    var n = total();
    var start = n === 0 ? 0 : page() * pageSize() + 1;
    var end = Math.min((page() + 1) * pageSize(), n);
    var last = Math.max(0, Math.ceil(n / pageSize()) - 1);

    return (
      '<mat-paginator class="mat-mdc-paginator" style="display:block">' +
      '<div class="mat-mdc-paginator-outer-container"><div class="mat-mdc-paginator-container">' +
      '<div class="mat-mdc-paginator-page-size">' +
      '<div class="mat-mdc-paginator-page-size-label">Items per page</div>' +
      '<mat-form-field class="mat-mdc-form-field mat-mdc-paginator-page-size-select mat-mdc-form-field-type-mat-select ' +
      'mat-mdc-form-field-label-always-float mat-form-field-appearance-outline mat-primary">' +
      '<div class="mat-mdc-text-field-wrapper mdc-text-field mdc-text-field--outlined mdc-text-field--no-label">' +
      '<div class="mat-mdc-form-field-flex">' +
      '<div class="mdc-notched-outline mdc-notched-outline--no-label">' +
      '<div class="mat-mdc-notch-piece mdc-notched-outline__leading"></div>' +
      '<div class="mat-mdc-notch-piece mdc-notched-outline__notch"></div>' +
      '<div class="mat-mdc-notch-piece mdc-notched-outline__trailing"></div></div>' +
      '<div class="mat-mdc-form-field-infix">' +
      '<mat-select class="mat-mdc-select" role="combobox" tabindex="0" id="page-size-select">' +
      '<div class="mat-mdc-select-trigger"><div class="mat-mdc-select-value">' +
      '<span class="mat-mdc-select-value-text"><span class="mat-mdc-select-min-line">' + pageSize() + '</span></span></div>' +
      '<div class="mat-mdc-select-arrow-wrapper"><div class="mat-mdc-select-arrow">' +
      '<svg viewBox="0 0 24 24" focusable="false" aria-hidden="true"><path d="M7 10l5 5 5-5z"></path></svg>' +
      '</div></div></div></mat-select>' +
      '</div></div></div></mat-form-field></div>' +
      '<div class="mat-mdc-paginator-range-actions">' +
      '<div class="mat-mdc-paginator-range-label">' + start + ' - ' + end + ' of ' + n + '</div>' +
      pagerButton('first', page() === 0) +
      pagerButton('previous', page() === 0) +
      pagerButton('next', page() >= last) +
      pagerButton('last', page() >= last) +
      '</div></div></div></mat-paginator>'
    );
  }

  function squareButton(iconName, label, attr) {
    return (
      '<button ccaButton type="button" class="cca-btn cca-btn--secondary button-square" aria-label="' + label + '"' +
      (attr || '') + '>' + icon(iconName) + '</button>'
    );
  }

  function toolbarHtml() {
    var kind = view().toolbar;
    var left = kind === 'signing'
      ? '<button ccaButton type="button" class="cca-btn cca-btn--subtle">' + icon('filter') + 'Filters</button>'
      : '';
    var right = '';
    if (kind === 'signing') right += squareButton('export', 'Export');
    right += squareButton('columns-applied', 'Column options', ' data-open-columns');
    if (kind === 'signing') right += squareButton('refresh', 'Refresh');

    return (
      '<div class="flex flex-col gap-4 pb-5"><div class="cca-data-table-buttons">' +
      '<div class="cca-data-table-left">' + left + '</div>' +
      '<div class="cca-data-table-right">' + right + '</div>' +
      '</div></div>'
    );
  }

  /*
   * The table card. cca-data-table is the app's own wrapper element and the
   * reason data-table.css is linked — .cca-data-table-buttons and its two
   * halves come from there, and the element itself carries the min-height.
   */
  function cardHtml() {
    return (
      '<cca-data-table class="surface-neutral-light proto-table-card" style="display:block">' +
      '<div class="cca-data-table-wrapper proto-table-card flex flex-col">' +
      toolbarHtml() +
      '<div class="table-container proto-table-scroll">' + tableHtml() + '</div>' +
      '<div class="footer flex flex-row-reverse justify-between px-3">' +
      '<div class="cca-data-table-footer pt-5">' + paginatorHtml() + '</div>' +
      '</div></div></cca-data-table>'
    );
  }

  /*
   * The five document tabs. Material's tab group is markup plus state — there
   * is no runtime here, so the active tab is the one carrying mdc-tab--active
   * and mdc-tab-indicator--active, which is what the doc page shows too.
   */
  function tabsHtml() {
    var labels = TABS.map(function (t) {
      var active = t.id === state.tab;
      return (
        '<div class="mat-mdc-tab mdc-tab mat-mdc-focus-indicator' + (active ? ' mdc-tab--active' : '') + '"' +
        ' role="tab" tabindex="0" aria-selected="' + active + '" data-tab="' + t.id + '">' +
        '<span class="mdc-tab__ripple"></span>' +
        '<span class="mdc-tab__content"><span class="mdc-tab__text-label">' + t.label + '</span></span>' +
        '<span class="mdc-tab-indicator' + (active ? ' mdc-tab-indicator--active' : '') + '">' +
        '<span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span></span></div>'
      );
    }).join('');

    return (
      '<mat-tab-group class="mat-mdc-tab-group mat-primary mat-mdc-tab-group-stretch-tabs flex min-h-0 flex-1 flex-col" style="display:flex">' +
      '<mat-tab-header class="mat-mdc-tab-header"><div class="mat-mdc-tab-label-container">' +
      '<div class="mat-mdc-tab-list" role="tablist"><div class="mat-mdc-tab-labels">' + labels + '</div></div>' +
      '</div></mat-tab-header>' +
      '<div class="mat-mdc-tab-body-wrapper flex min-h-0 flex-1 flex-col">' +
      '<mat-tab-body class="mat-mdc-tab-body mat-mdc-tab-body-active flex min-h-0 flex-1 flex-col" style="display:flex">' +
      '<div class="mat-mdc-tab-body-content flex min-h-0 flex-1 flex-col">' + cardHtml() + '</div>' +
      '</mat-tab-body></div></mat-tab-group>'
    );
  }

  // --------------------------------------------------------------- render --

  var body = document.getElementById('segment-body');

  function render() {
    body.innerHTML = state.segment === 'ctrlchain' ? tabsHtml() : cardHtml();

    document.querySelectorAll('nav.menu-bar a').forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('data-segment') === state.segment);
    });

    /*
     * routes.js resolves every data-screen link once on load and handles clicks
     * by delegation, so freshly rendered rows are already clickable. What they
     * are missing is the href and the data-unbuilt mark, which is what
     * resolve() adds — call it after every render.
     */
    if (window.CCA_ROUTES) window.CCA_ROUTES.resolve();
  }

  // ---------------------------------------------------------------- hash --
  //
  // Segment and tab live in the hash so a reviewer can send someone a link to
  // one tab rather than "click through to Invoicing Instruction".

  function readHash() {
    var parts = (location.hash || '').replace(/^#\/?/, '').split('/');
    if (SEGMENTS.indexOf(parts[0]) > -1) state.segment = parts[0];
    if (state.segment === 'ctrlchain' && VIEWS[parts[1]]) state.tab = parts[1];
  }

  function writeHash() {
    var h = '#/' + state.segment + (state.segment === 'ctrlchain' ? '/' + state.tab : '');
    if (location.hash !== h) history.replaceState(null, '', h);
  }

  // ------------------------------------------------------------ overlays --

  var overlay = document.getElementById('overlay-container');
  var backdrop = document.getElementById('drawer-backdrop');
  var columnList = document.getElementById('column-list');

  function setDrawer(open) {
    if (open) {
      columnList.innerHTML = view().columns.map(function (c, i) {
        var checked = !hidden()[c.key];
        return (
          '<mat-checkbox class="mat-mdc-checkbox mat-primary' + (checked ? ' mat-mdc-checkbox-checked' : '') + '" style="display:block">' +
          '<div class="mdc-form-field mat-internal-form-field">' +
          '<div class="mdc-checkbox' + (checked ? ' mdc-checkbox--selected' : '') + '">' +
          '<input type="checkbox" class="mdc-checkbox__native-control" id="col-' + i + '" data-col="' + c.key + '"' + (checked ? ' checked' : '') + ' />' +
          '<div class="mdc-checkbox__background">' +
          '<svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24" aria-hidden="true">' +
          '<path class="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59"></path></svg>' +
          '<div class="mdc-checkbox__mixedmark"></div></div></div>' +
          '<label class="mdc-label" for="col-' + i + '">' + esc(c.label) + '</label>' +
          '</div></mat-checkbox>'
        );
      }).join('');
      overlay.hidden = false;
      // Commits opacity 0 so the fade has somewhere to start. Never rAF: it does
      // not fire in a background tab, and the scrim would stay invisible.
      void backdrop.offsetWidth;
      backdrop.classList.add('cdk-overlay-backdrop-showing');
    } else {
      backdrop.classList.remove('cdk-overlay-backdrop-showing');
      overlay.hidden = true;
    }
    document.documentElement.classList.toggle('cdk-global-scrollblock', open);
  }

  var selectOverlay = document.getElementById('select-overlay');
  var selectPane = document.getElementById('select-pane');
  var selectPanel = document.getElementById('select-panel');
  var PAGE_SIZES = [10, 20, 50, 100];

  function openSizeSelect(trigger) {
    selectPanel.innerHTML = PAGE_SIZES.map(function (n) {
      var on = n === pageSize();
      return (
        '<mat-option class="mat-mdc-option mdc-list-item' + (on ? ' mdc-list-item--selected mat-mdc-option-active' : '') +
        '" role="option" tabindex="0" data-size="' + n + '" style="display:block">' +
        '<span class="mdc-list-item__primary-text">' + n + '</span>' +
        '<div class="mat-ripple mat-mdc-option-ripple mat-focus-indicator"></div></mat-option>'
      );
    }).join('');

    var r = trigger.getBoundingClientRect();
    selectPane.style.left = r.left + 'px';
    selectPane.style.width = Math.max(r.width, 80) + 'px';
    selectOverlay.hidden = false;
    // Above or below, whichever fits — the CDK's own choice, made here by hand.
    var h = selectPanel.offsetHeight;
    selectPane.style.top = (r.bottom + h > window.innerHeight ? r.top - h : r.bottom) + 'px';
  }

  function closeSizeSelect() { selectOverlay.hidden = true; }

  // --------------------------------------------------------------- events --

  document.addEventListener('click', function (e) {
    var seg = e.target.closest('nav.menu-bar a[data-segment]');
    if (seg) {
      e.preventDefault();
      state.segment = seg.getAttribute('data-segment');
      writeHash();
      render();
      return;
    }

    var tab = e.target.closest('[data-tab]');
    if (tab) {
      state.tab = tab.getAttribute('data-tab');
      writeHash();
      render();
      return;
    }

    if (e.target.closest('[data-open-columns]')) { setDrawer(true); return; }

    var sort = e.target.closest('th[data-sort]');
    if (sort) {
      state.sortAsc = !state.sortAsc;
      render();
      return;
    }

    var pager = e.target.closest('button[data-page]');
    if (pager && !pager.disabled) {
      var last = Math.max(0, Math.ceil(total() / pageSize()) - 1);
      var kind = pager.getAttribute('data-page');
      var next = { first: 0, previous: page() - 1, next: page() + 1, last: last }[kind];
      state.page[viewId()] = Math.min(Math.max(next, 0), last);
      render();
      return;
    }

    if (e.target.closest('#page-size-select')) {
      openSizeSelect(e.target.closest('#page-size-select'));
      return;
    }

    var option = e.target.closest('mat-option[data-size]');
    if (option) {
      state.pageSize[viewId()] = Number(option.getAttribute('data-size'));
      state.page[viewId()] = 0;   // the app returns to the first page on resize
      closeSizeSelect();
      render();
      return;
    }

    if (e.target.id === 'select-backdrop') { closeSizeSelect(); return; }
    if (e.target === backdrop) { setDrawer(false); return; }

    if (e.target.closest('#columns-confirm')) {
      var h = {};
      columnList.querySelectorAll('input[data-col]').forEach(function (input) {
        if (!input.checked) h[input.getAttribute('data-col')] = true;
      });
      state.hidden[viewId()] = h;
      setDrawer(false);
      render();
    }
  });

  // The checkbox is a real input, so let it toggle and mirror Material's classes.
  columnList.addEventListener('change', function (e) {
    var input = e.target.closest('input[data-col]');
    if (!input) return;
    input.closest('mat-checkbox').classList.toggle('mat-mdc-checkbox-checked', input.checked);
    input.closest('.mdc-checkbox').classList.toggle('mdc-checkbox--selected', input.checked);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    setDrawer(false);
    closeSizeSelect();
  });

  window.addEventListener('hashchange', function () { readHash(); render(); });

  readHash();
  writeHash();
  render();
})();
