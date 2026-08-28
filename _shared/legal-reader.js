/*
 * Reader-facing legal pages
 * =========================
 *   <script src="../_shared/legal-reader.js"></script>
 *
 * The pages a customer lands on from the account menu — /privacy-policy/<id>
 * and /terms-of-service on the real app. Both are the same page with different
 * content, so they are the same code: a prototype that copied it twice would
 * drift the moment one of them changed.
 *
 * A page says which documents it shows and this renders them:
 *
 *   CCA_LEGAL_READER.render({ category: 'privacy-policy', tabs: true })
 *
 * What makes these READER pages, and not the admin's version manager:
 *
 *   · the LIVE version only — never a draft, never a superseded one. A reader
 *     accepting terms must see what is actually in force.
 *   · no version dropdown, no Edit, no Publish, no Delete.
 *   · no submenu. The shell is rail + header + banner + page and the content
 *     runs full width. Every other prototype here has a submenu, so this is the
 *     easy thing to get wrong.
 *
 * The body is rich text or a PDF depending on how that version was made — the
 * same fork the admin page has, with the controls stripped off.
 */
(function () {
  'use strict';

  var D = window.CCA_DATA;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  /*
   * The document body. Written versions are rich text; uploaded ones are a PDF
   * in the browser's own viewer, which brings its own zoom, print and download.
   *
   * A version with neither — a document that has never been published — is a
   * real case, not an error: a reader following a stale link deserves a sentence
   * rather than a blank page.
   */
  function bodyHtml(doc, version) {
    if (!version) {
      return (
        '<div class="grid h-full place-items-center py-12"><div class="flex flex-col gap-2 text-center">' +
        '<h3>Not published yet</h3>' +
        '<p class="text-cca-base text-neutral-subtitle">' +
        'This document has not been published, so there is nothing to show.</p>' +
        '</div></div>'
      );
    }

    if (version.file) {
      return (
        '<div class="proto-doc-frame mt-6 overflow-hidden rounded-lg border border-neutral-default">' +
        '<iframe class="proto-doc-viewer" src="' + window.CCA_LEGAL_STORE.displayUrl(version.file) + '" title="' + esc(version.file.name) + '"></iframe>' +
        '</div>'
      );
    }

    /*
     * The app renders these through cca-html-viewer with `whitespace-pre-line`,
     * which is how a pasted legal text keeps its paragraph breaks without every
     * line becoming a <p>. Copied, including that class.
     */
    return (
      '<cca-html-viewer class="proto-richtext block w-full py-6 whitespace-pre-line" style="display:block">' +
      D.legalBody(doc) +
      '</cca-html-viewer>'
    );
  }

  function updatedHtml(doc) {
    return (
      '<div class="pt-4">' +
      '<span class="pr-2 text-neutral-caption">Updated at:</span>' +
      '<span>' + esc(doc.updatedAt) + ' ' + esc(doc.updatedTime) + '</span>' +
      '</div>'
    );
  }

  function panelHtml(doc) {
    return updatedHtml(doc) + bodyHtml(doc, D.legalLiveVersion(doc));
  }

  /*
   * Material's tab strip, static. The active tab is the one carrying
   * mdc-tab--active and mdc-tab-indicator--active — there is no Angular here to
   * move it, so switching re-renders.
   *
   * Note the indicator needs `.mdc-tab { position: relative }`, which the export
   * is missing and _shared/prototype.css restores. Without it the underline
   * spans the whole strip instead of one tab.
   */
  function tabsHtml(docs, activeIndex) {
    var labels = docs
      .map(function (doc, i) {
        var active = i === activeIndex;
        return (
          '<div class="mat-mdc-tab mdc-tab mat-mdc-focus-indicator' + (active ? ' mdc-tab--active' : '') + '"' +
          ' role="tab" tabindex="0" aria-selected="' + active + '" data-legal-tab="' + i + '">' +
          '<span class="mdc-tab__ripple"></span>' +
          '<span class="mdc-tab__content"><span class="mdc-tab__text-label">' +
          esc(doc.region || doc.name) + '</span></span>' +
          '<span class="mdc-tab-indicator' + (active ? ' mdc-tab-indicator--active' : '') + '">' +
          '<span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span></span></div>'
        );
      })
      .join('');

    return (
      '<mat-tab-group class="mat-mdc-tab-group mat-primary mat-mdc-tab-group-stretch-tabs flex min-h-0 flex-1 flex-col" style="display:flex">' +
      '<mat-tab-header class="mat-mdc-tab-header"><div class="mat-mdc-tab-label-container">' +
      '<div class="mat-mdc-tab-list" role="tablist"><div class="mat-mdc-tab-labels">' + labels + '</div></div>' +
      '</div></mat-tab-header>' +
      '<div class="mat-mdc-tab-body-wrapper flex min-h-0 flex-1 flex-col">' +
      '<mat-tab-body class="mat-mdc-tab-body mat-mdc-tab-body-active flex min-h-0 flex-1 flex-col" style="display:flex">' +
      '<div class="mat-mdc-tab-body-content flex min-h-0 flex-1 flex-col">' +
      panelHtml(docs[activeIndex]) +
      '</div></mat-tab-body></div></mat-tab-group>'
    );
  }

  function render(options) {
    var host = document.getElementById('legal-reader');
    var docs = D.legalDocumentsIn(options.category);
    var index = 0;

    function draw() {
      host.innerHTML = options.tabs && docs.length > 1 ? tabsHtml(docs, index) : panelHtml(docs[index]);
    }

    // Re-query on every click: draw() replaces the strip, so a cached node is
    // detached and later clicks land on nothing.
    host.addEventListener('click', function (e) {
      var tab = e.target.closest('[data-legal-tab]');
      if (!tab) return;
      index = Number(tab.getAttribute('data-legal-tab'));
      draw();
    });

    draw();
  }

  window.CCA_LEGAL_READER = { render: render };
})();
