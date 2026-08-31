/*
 * One legal document — page script
 * ================================
 * Separate from index.html because this file builds markup from template
 * literals, and a page that does that must never have its structural tags
 * string-replaced. index.html holds exactly one closing body tag; this holds
 * none.
 */
(function () {
  'use strict';

  var D = window.CCA_DATA;

  /*
   * Which document. The list links with data-params '{"id":"…"}', which
   * routes.js turns into ?id=… — so this is the record the row rendered.
   * An unknown or missing id is a real case (someone shares a stale link), and
   * it gets a message rather than a broken page.
   */
  var id = window.CCA_ROUTES.param('id');
  var doc = id ? D.legalDocument(id) : null;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function icon(name) {
    return (
      '<cca-icon><mat-icon class="mat-icon notranslate cca-icon cca-icon-' + name +
      ' mat-icon-inline" aria-hidden="true"></mat-icon></cca-icon>'
    );
  }

  /*
   * What a version's body is.
   *
   * A version that was WRITTEN is rich text, and the platform renders it through
   * cca-html-viewer. A version that was UPLOADED is a file, and there is no
   * viewer component in the bundle for that — so this is the browser's own,
   * which is what a PDF in an iframe gets you: pages, scroll, zoom, print, all
   * free and all native.
   *
   * Only PDF and plain text can be shown that way. A .doc or .docx cannot be
   * rendered by any browser without a converter, so it says so and offers the
   * file rather than pretending — an empty grey frame reads as broken.
   */
  function versionBodyHtml(document_, version) {
    if (!version.file) {
      return (
        '<cca-html-viewer class="proto-richtext mt-6" style="display:block">' +
        D.legalBody(document_) +
        '</cca-html-viewer>'
      );
    }

    var file = version.file;

    /*
     * Just the document. There used to be a row above this carrying the
     * filename, the upload date and a Download button — all three were already
     * on screen: the name is in the viewer's own toolbar, the date is in the
     * "Updated at" line two rows up, and Download and Print are built into the
     * browser's PDF chrome. It was furniture, so it is gone.
     */
    var frame =
      '<div class="proto-doc-frame mt-6 overflow-hidden rounded-lg border border-neutral-default">' +
      '<iframe class="proto-doc-viewer" src="' + window.CCA_LEGAL_STORE.displayUrl(file) + '" title="' + esc(file.name) + '"></iframe>' +
      '</div>';

    if (file.type === 'application/pdf' || /\.pdf$/i.test(file.name)) return frame;
    if (/^text\//.test(file.type) || /\.txt$/i.test(file.name)) return frame;

    // Only reachable from a fixture, since uploads are PDF-only.
    return (
      '<div class="mt-6 flex flex-col items-center gap-3 rounded-lg border border-neutral-default surface-neutral-default px-3 py-8 text-center">' +
      icon('file-lines') +
      '<span class="text-cca-base text-neutral-title">' + esc(file.name) + '</span>' +
      '<span class="text-cca-base-sm text-neutral-subtitle">A browser cannot preview this format.</span>' +
      '<a class="cca-btn cca-btn--secondary" href="' + file.url + '" download="' + esc(file.name) + '">Download</a>' +
      '</div>'
    );
  }

  /*
   * Stamp the record as changed just now.
   *
   * A document that had no versions had no updated-at either, and leaving it
   * empty renders "Updated at:  at CEST" — the shape of a bug. This is the one
   * place a real clock is right: the change is happening now, not on a fixture
   * date.
   */
  function stampUpdated() {
    var now = new Date();
    doc.updatedBy = 'Robin admin';
    doc.updatedAt = now.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    doc.updatedTime =
      String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
  }

  /*
   * Uploading makes a version, which is the whole point of the flow — so the
   * file does not just vanish into a snackbar. The number bumps the minor of
   * whatever is newest, and it lands as a Draft: publishing is a separate act,
   * and inventing a Published version from an upload would overstate what the
   * button did.
   */
  /*
   * HOW A VERSION IS NUMBERED — legal's rule, not a convention picked here.
   *
   *   Edit               a point up.   2.2 → 2.3
   *   Create new version a whole up.   2.2 → 3.0
   *
   * The distinction carries meaning: a point release is the same document
   * corrected, a whole number is a new set of terms. Someone reading the version
   * list can tell which happened without opening anything.
   *
   * It also settles a question the prototype had open. An edit does NOT rewrite
   * the version it came from — 2.2 stays exactly as it was, and 2.3 appears
   * beside it. So what someone accepted under 2.2 can always be produced.
   */
  function nextVersionNumber(kind) {
    var newest = doc.versions[0];
    if (!newest) return '1.0';
    var parts = String(newest.v).split('.');
    var major = Number(parts[0]) || 0;
    var minor = Number(parts[1]) || 0;
    return kind === 'edit' ? major + '.' + (minor + 1) : major + 1 + '.0';
  }

  function addUploadedVersion(file, dataUrl, kind) {
    var next = nextVersionNumber(kind);

    doc.versions.unshift({
      v: next,
      status: 'Draft',
      /*
       * A DATA url, not a blob one. A blob: URL is scoped to the page that made
       * it, so the reader page — a separate document — could not open it. This
       * is what lets someone upload here and then see it from the account menu.
       */
      file: { name: file.name, type: file.type, url: dataUrl },
    });

    stampUpdated();
    current = 0;
    window.CCA_LEGAL_STORE.save(doc);
    return next;
  }

  /*
   * The draft case. The version keeps its number and its Draft status; only the
   * file and the updated-at change, which is what the running product does when
   * the version being edited has not been published.
   */
  function replaceFileOnVersion(file, dataUrl) {
    var version = doc.versions[current];

    version.file = { name: file.name, type: file.type, url: dataUrl };

    stampUpdated();
    window.CCA_LEGAL_STORE.save(doc);
    return version.v;
  }

  // ---------------------------------------------------------------- parts --

  /*
   * The meta row under the heading. Liability party is Shipper or Carrier and
   * comes from which tab the document sits on — the app shows it as a plain
   * label pair, not a badge.
   */
  var LIABILITY = {
    'shipper-tc': 'Shipper',
    'carrier-tc': 'Carrier',
    'terms-of-service': 'System user',
    'privacy-policy': 'Data subject',
    'invoicing-instruction': 'Shipper',
  };

  function metaHtml(document_) {
    var org = document_.salesOrg
      ? '<div class="flex items-center gap-2">' +
        '<span class="text-neutral-caption">Sales Organisation:</span>' +
        (document_.flag
          ? '<cca-country-flag class="max-h-4 max-w-4"><span class="h-6 w-6">' +
            '<img class="mr-3 rounded-full" src="../../_shared/assets/flags/' + esc(document_.flag) + '.svg" alt="" />' +
            '</span></cca-country-flag>'
          : '') +
        '<span>' + esc(document_.salesOrg) + '</span></div>'
      : '';

    return (
      '<cca-document-header style="display:block"><div class="mt-4 flex gap-8">' +
      '<div><span class="pr-2 text-neutral-caption">Liability Party:</span>' +
      '<span>' + esc(LIABILITY[document_.category] || 'Shipper') + '</span></div>' +
      org +
      '</div></cca-document-header>'
    );
  }

  /*
   * WHAT YOU CAN DO DEPENDS ON WHICH VERSION YOU ARE LOOKING AT. This is the
   * rule the Figma board encodes and the running app confirms:
   *
   *   Published (the live one)  Create new version · Edit current version
   *   Draft (not published yet) Delete · Edit · Publish
   *   Substituted (superseded)  nothing — an old version is read-only
   *
   * The Substituted case is the one that is easy to miss and the one that
   * matters most: without it the page offers to edit a version that has already
   * been replaced. Selecting an older version in the dropdown must take the
   * actions away.
   *
   * Delete is not a cca-btn at all in the app — it is bare text in the critical
   * colour, which is why it carries no button class here either.
   */
  function versionActionsHtml(version) {
    /*
     * There is no Preview action. The document is already on the page, in the
     * browser's own PDF viewer, which brings its own zoom, fit, page controls,
     * download and print. A button that opened the same document in a dialog was
     * offering what the reader already had.
     */
    if (version.status === 'Substituted') return '';

    if (version.status === 'Draft') {
      return (
        '<div class="ml-auto flex items-center gap-4">' +
        '<button type="button" class="font-bold critical-text-light" data-action="delete">Delete</button>' +
        '<button ccaButton type="button" class="cca-btn cca-btn--secondary" data-action="edit">Edit</button>' +
        '<button ccaButton type="button" class="cca-btn cca-btn--primary" data-action="publish">Publish</button>' +
        '</div>'
      );
    }

    return (
      '<div class="ml-auto flex items-center gap-4">' +
      '<button ccaButton type="button" class="cca-btn cca-btn--secondary" data-action="create">' +
      icon('plus') + 'Create new version</button>' +
      '<button ccaButton type="button" class="cca-btn cca-btn--secondary" data-action="edit">' +
      icon('pencil') + 'Edit current version</button>' +
      '</div>'
    );
  }

  /*
   * The version control row: a Material select on the left, the actions for that
   * version on the right. The select's trigger shows "v3.3 Published" while the
   * options read "3.3 Published" — the v is only on the trigger, which is the
   * app's own inconsistency, copied rather than tidied.
   */
  function versionRowHtml(document_, version) {
    /*
     * The version row carries WHO last touched this version and WHEN, in the
     * space between the select and the actions.
     *
     * It used to be a row of its own, which cost 36px of height on every screen
     * for two short strings — and the row above it was a thousand pixels of
     * empty space. Unlike the document title, this text cannot grow unbounded:
     * it is a name and a timestamp.
     *
     * The same shape holds for every status. Actions are pushed right with
     * ml-auto rather than justify-between, so a Substituted version — which has
     * no actions at all — does not leave the updated text stranded in the middle
     * of the row.
     */
    var updated = document_.updatedBy
      ? '<div class="flex gap-8 font-normal">' +
        '<div><span class="pr-2 text-neutral-caption">Updated by:</span><span>' + esc(document_.updatedBy) + '</span></div>' +
        '<div><span class="pr-2 text-neutral-caption">Updated at:</span><span>' +
        esc(document_.updatedAt) + ' at ' + esc(document_.updatedTime) + ' CEST</span></div>' +
        '</div>'
      : '';

    return (
      '<div class="flex items-center gap-8">' +
      '<mat-form-field class="mat-mdc-form-field mat-mdc-form-field-type-mat-select ' +
      'mat-mdc-form-field-label-always-float mat-form-field-appearance-outline mat-primary">' +
      '<div class="mat-mdc-text-field-wrapper mdc-text-field mdc-text-field--outlined">' +
      '<div class="mat-mdc-form-field-flex">' +
      '<div class="mdc-notched-outline mdc-notched-outline--notched mdc-notched-outline--upgraded">' +
      '<div class="mat-mdc-notch-piece mdc-notched-outline__leading"></div>' +
      '<div class="mat-mdc-notch-piece mdc-notched-outline__notch">' +
      '<label class="mdc-floating-label mdc-floating-label--float-above">Version</label></div>' +
      '<div class="mat-mdc-notch-piece mdc-notched-outline__trailing"></div></div>' +
      '<div class="mat-mdc-form-field-infix">' +
      '<mat-select class="mat-mdc-select" role="combobox" tabindex="0" id="version-select">' +
      '<div class="mat-mdc-select-trigger"><div class="mat-mdc-select-value">' +
      '<span class="mat-mdc-select-value-text"><span class="mat-mdc-select-min-line">' +
      'v' + esc(version.v) + ' ' + esc(version.status) + '</span></span></div>' +
      '<div class="mat-mdc-select-arrow-wrapper"><div class="mat-mdc-select-arrow">' +
      '<svg viewBox="0 0 24 24" focusable="false" aria-hidden="true"><path d="M7 10l5 5 5-5z"></path></svg>' +
      '</div></div></div></mat-select>' +
      '</div></div></div></mat-form-field>' +
      updated +
      versionActionsHtml(version) +
      '</div>'
    );
  }


  /*
   * The empty state, for a document with no versions at all. Illustration,
   * heading, one line of help and a single primary action — the app's shape
   * exactly. The image is the platform's own asset; the export omits it, so it
   * lives in _shared/assets/images/ alongside the flags.
   */
  function emptyHtml(document_) {
    var what = document_.category === 'privacy-policy' ? 'Privacy Policy' : 'Terms & Conditions';
    return (
      '<div class="grid h-full place-items-center">' +
      '<div class="flex flex-col gap-4 text-center">' +
      '<img class="mx-auto" src="../../_shared/assets/images/order-empty-state.svg" alt="" width="160" height="160" />' +
      '<h3>No ' + what + ' yet</h3>' +
      '<p class="text-cca-base text-neutral-subtitle">Please create a new version for this ' +
      what.toLowerCase() + '</p>' +
      '<div><button ccaButton type="button" class="cca-btn cca-btn--primary" data-action="create">Create New</button></div>' +
      '</div></div>'
    );
  }

  // --------------------------------------------------------------- render --

  var host = document.getElementById('document');
  var current = 0; // index into doc.versions

  function render() {
    if (!doc) {
      host.innerHTML =
        '<div class="grid h-full place-items-center"><div class="flex flex-col gap-4 text-center">' +
        '<h3>No such document</h3>' +
        '<p class="text-cca-base text-neutral-subtitle">' +
        (id ? 'Nothing here has the id “' + esc(id) + '”.' : 'This page needs an id — open it from the Legal list.') +
        '</p><div><button ccaButton type="button" class="cca-btn cca-btn--primary" data-screen="admin.legal">' +
        'Back to Legal</button></div></div></div>';
      window.CCA_ROUTES.resolve();
      return;
    }

    document.title = doc.name + ' · CtrlChain';

    /*
     * The heading carries NO class, deliberately. The platform styles a bare h2
     * globally — 20px/28px, medium — and that is what the app's document title
     * uses. Adding text-cca-label-lg here overrode it down to 16px, which is a
     * reminder that in this bundle an element tag can be the style: reach for a
     * type utility only when the tag does not already carry the right one.
     */
    var head = '<h2>' + esc(doc.name) + '</h2>' + metaHtml(doc);

    if (!doc.versions.length) {
      // hr and empty state, exactly as the app: the meta row still shows.
      host.innerHTML = head + '<hr class="my-4" />' + emptyHtml(doc);
      window.CCA_ROUTES.resolve();
      return;
    }

    host.innerHTML =
      head +
      '<hr class="my-4" />' +
      versionRowHtml(doc, doc.versions[current]) +
      versionBodyHtml(doc, doc.versions[current]);

    window.CCA_ROUTES.resolve();
  }

  // ------------------------------------------------------- version picker --

  var overlay = document.getElementById('version-overlay');
  var pane = document.getElementById('version-pane');
  var panel = document.getElementById('version-panel');

  function openVersions(trigger) {
    panel.innerHTML = doc.versions
      .map(function (v, i) {
        var on = i === current;
        return (
          '<mat-option class="mat-mdc-option mdc-list-item' +
          (on ? ' mdc-list-item--selected mat-mdc-option-active' : '') +
          '" role="option" tabindex="0" data-version="' + i + '" style="display:block">' +
          '<span class="mdc-list-item__primary-text">' + esc(v.v) + ' ' + esc(v.status) + '</span>' +
          '<div class="mat-ripple mat-mdc-option-ripple mat-focus-indicator"></div></mat-option>'
        );
      })
      .join('');

    var r = trigger.getBoundingClientRect();
    pane.style.left = r.left + 'px';
    pane.style.width = Math.max(r.width, 180) + 'px';
    overlay.hidden = false;
    // Above or below, whichever fits — the CDK's choice, made here by hand.
    var h = panel.offsetHeight;
    pane.style.top = (r.bottom + h > window.innerHeight ? Math.max(0, r.top - h) : r.bottom) + 'px';
  }

  function closeVersions() {
    overlay.hidden = true;
  }

  // ------------------------------------------------------ create dialog --

  /*
   * "Create new version" opens the app's action chooser rather than going
   * straight to an editor, because there are two ways to make a version and the
   * user picks first: upload a file, or write it here.
   *
   * Both starting states are invisible — the inner container at opacity 0, the
   * surface at scale(0.8) — and `mdc-dialog--open` is what releases them. The
   * offsetWidth read is what makes that animate: set the class in the same paint
   * and there is nothing to animate from. Never arm it in requestAnimationFrame,
   * which does not fire in a background tab.
   */
  var createOverlay = document.getElementById('create-overlay');
  var createDialog = document.getElementById('create-dialog');
  var createBackdrop = document.getElementById('create-backdrop');

  function setCreateDialog(open) {
    if (open) {
      createOverlay.hidden = false;
      void createBackdrop.offsetWidth; // commits the closed state
      createBackdrop.classList.add('cdk-overlay-backdrop-showing');
      createDialog.classList.add('mdc-dialog--open');
    } else {
      createBackdrop.classList.remove('cdk-overlay-backdrop-showing');
      createDialog.classList.remove('mdc-dialog--open');
      createOverlay.hidden = true;
    }
    document.documentElement.classList.toggle('cdk-global-scrollblock', open);
  }

  // ------------------------------------------------------ upload dialog --

  /*
   * Step two, if they chose Upload. Same overlay machinery as the chooser.
   *
   * The file input is a real one, hidden, wrapped in a label — so "browse" opens
   * the OS picker and drag-and-drop works, without a line of drag handling. The
   * file never leaves the browser; Upload just says the next step is not built.
   */
  var uploadOverlay = document.getElementById('upload-overlay');
  var uploadDialog = document.getElementById('upload-dialog');
  var uploadBackdrop = document.getElementById('upload-backdrop');
  var fileInput = document.getElementById('file-input');
  var chosenFile = document.getElementById('chosen-file');
  var uploadConfirm = document.getElementById('upload-confirm');
  var dropzone = document.getElementById('dropzone');

  /*
   * The upload dialog does three jobs, and which one decides what Confirm does.
   * There is nothing to edit inside a PDF, so every one of them is a file:
   *
   *   'create'   Create new version → a NEW version, a whole number up.
   *   'replace'  Edit, on a PUBLISHED PDF → a new version, a point up. The
   *              published one is in force and people have accepted it, so it
   *              is never overwritten — the correction lands beside it.
   *   'swap'     Edit, on a DRAFT PDF → the file on that version is replaced and
   *              the number does not move. Nothing was in force, so there is
   *              nothing to supersede and no reason to burn a version number.
   *
   * The split between the last two is the whole point: correcting a typo before
   * publishing should not look the same as amending terms people are held to.
   */
  var uploadMode = 'create';

  /*
   * The chosen file is held here, NOT read back off the input. A dropped file
   * never lands in input.files — only the picker fills that — so reading the
   * input loses the name of anything dragged in.
   */
  var selectedFile = null;

  function setUploadDialog(open, mode) {
    if (open) {
      uploadMode = mode || 'create';
      var version = doc.versions[current];
      var title = 'Upload a document';
      var subtitle = 'The file becomes v' + nextVersionNumber('create') + ' of these terms & conditions.';
      var confirm = 'Upload';

      if (uploadMode === 'replace') {
        title = 'Edit — upload a corrected document';
        subtitle =
          'A PDF cannot be edited here, so send a corrected file. It becomes v' +
          nextVersionNumber('edit') + '; v' + version.v + ' stays as it is.';
        confirm = 'Save as new point version';
      } else if (uploadMode === 'swap') {
        title = 'Edit — upload a corrected document';
        subtitle =
          'A PDF cannot be edited here, so send a corrected file. It replaces the file on v' +
          version.v + ', which is still a draft, so the version number does not change.';
        confirm = 'Replace the file';
      }

      document.getElementById('upload-title').textContent = title;
      document.getElementById('upload-subtitle').textContent = subtitle;
      document.getElementById('upload-confirm').textContent = confirm;
      uploadOverlay.hidden = false;
      void uploadBackdrop.offsetWidth; // commits the closed state so it animates
      uploadBackdrop.classList.add('cdk-overlay-backdrop-showing');
      uploadDialog.classList.add('mdc-dialog--open');
    } else {
      uploadBackdrop.classList.remove('cdk-overlay-backdrop-showing');
      uploadDialog.classList.remove('mdc-dialog--open');
      uploadOverlay.hidden = true;
      clearFile();
    }
    document.documentElement.classList.toggle('cdk-global-scrollblock', open);
  }

  /*
   * PDF only. Terms are read, printed and archived, so the format is not a
   * preference — a .docx cannot be previewed in the browser and would leave the
   * page showing a download link where the document should be.
   *
   * Checked by extension AND type because neither is reliable alone: some
   * systems hand over an empty type for a dragged file, and a file named .pdf
   * with the wrong type is still what the person meant to send.
   */
  function isPdf(file) {
    return file.type === 'application/pdf' || /\.pdf$/i.test(file.name);
  }

  /*
   * Refusal is shown where the file would have appeared, not in a snackbar that
   * slides away — the person needs to still be reading it when they try again.
   */
  function showRefusal(message) {
    selectedFile = null;
    fileInput.value = '';
    uploadConfirm.disabled = true;
    chosenFile.innerHTML =
      '<div class="flex items-start gap-3 rounded-lg border critical-border critical-surface-lighter p-3">' +
      '<cca-icon class="critical-text"><mat-icon class="mat-icon notranslate cca-icon cca-icon-circle-exclamation mat-icon-inline" aria-hidden="true"></mat-icon></cca-icon>' +
      '<span class="text-cca-base-sm critical-text">' + message + '</span></div>';
  }

  function clearFile() {
    selectedFile = null;
    fileInput.value = '';
    chosenFile.innerHTML = '';
    uploadConfirm.disabled = true;
  }

  function kb(bytes) {
    return bytes < 1024 * 1024
      ? Math.max(1, Math.round(bytes / 1024)) + ' KB'
      : (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  function showFile(file) {
    if (!file) return;
    selectedFile = file;
    chosenFile.innerHTML =
      '<div class="flex items-center gap-3 rounded-lg border border-neutral-default p-3">' +
      icon('file-lines') +
      '<div class="flex flex-col"><span class="text-cca-base text-neutral-title">' + esc(file.name) + '</span>' +
      '<span class="text-cca-label-sm text-neutral-caption">' + kb(file.size) + '</span></div>' +
      '<button ccaButton type="button" class="cca-btn cca-btn--tertiary cca-btn--icon-only ml-auto" ' +
      'aria-label="Remove file" data-remove-file>' + icon('xmark') + '</button></div>' +
      '<p class="mt-2 text-cca-label-sm text-neutral-caption">Only one document is kept — choosing another replaces this one.</p>';
    uploadConfirm.disabled = false;
  }

  fileInput.addEventListener('change', function () {
    var file = fileInput.files[0];
    if (!file) return;
    // `accept` can be switched off inside the picker, so check again.
    if (!isPdf(file)) {
      showRefusal('Only PDF files can be uploaded. “' + esc(file.name) + '” is not a PDF.');
      return;
    }
    showFile(file);
  });

  /*
   * Drag feedback. dragover must be cancelled or the browser navigates to the
   * file instead of handing it over.
   *
   * While dragging, the browser exposes each item's TYPE but not its name — so
   * the check here is on type alone, which is enough to turn the cursor into
   * "no drop" and paint the zone as refusing before anything is released. The
   * real check still happens on drop, where the filename is available.
   */
  function draggedFilesAreAcceptable(e) {
    var items = e.dataTransfer && e.dataTransfer.items;
    if (!items || !items.length) return true;
    var files = [].filter.call(items, function (i) { return i.kind === 'file'; });
    if (files.length > 1) return false;
    return files.every(function (i) { return !i.type || i.type === 'application/pdf'; });
  }

  function setDropState(state) {
    dropzone.classList.toggle('surface-neutral-light', state === 'ok');
    dropzone.classList.toggle('critical-border', state === 'blocked');
    dropzone.classList.toggle('critical-surface-lighter', state === 'blocked');
  }

  ['dragenter', 'dragover'].forEach(function (type) {
    dropzone.addEventListener(type, function (e) {
      e.preventDefault();
      var ok = draggedFilesAreAcceptable(e);
      // The cursor is the earliest feedback there is — use it.
      if (e.dataTransfer) e.dataTransfer.dropEffect = ok ? 'copy' : 'none';
      setDropState(ok ? 'ok' : 'blocked');
    });
  });
  ['dragleave', 'drop'].forEach(function (type) {
    dropzone.addEventListener(type, function () {
      setDropState(null);
    });
  });
  /*
   * One document, and only one.
   *
   * The picker enforces that on its own — the input has no `multiple`, which is
   * how the app has it too. A DROP does not go through the picker, so it is the
   * one way more than one file can arrive, and taking files[0] and discarding
   * the rest silently is the wrong answer: the person watching sees four of
   * their five files vanish with no explanation. Say so and take none.
   *
   * Dropping a single file when one is already chosen REPLACES it, which is what
   * a one-file slot should do — the panel below re-renders, so the swap is
   * visible.
   */
  dropzone.addEventListener('drop', function (e) {
    e.preventDefault();
    var files = e.dataTransfer && e.dataTransfer.files;
    if (!files || !files.length) return;
    if (files.length > 1) {
      showRefusal('Only one document can be uploaded. ' + files.length + ' files were dropped.');
      return;
    }
    if (!isPdf(files[0])) {
      showRefusal('Only PDF files can be uploaded. “' + esc(files[0].name) + '” is not a PDF.');
      return;
    }
    showFile(files[0]);
  });

  // ------------------------------------------------------ delete dialog --

  /*
   * Deleting a draft is destructive and irreversible, so it asks first — the
   * confirmation is on the Figma board and this is its copy. Only a Draft can be
   * deleted; the button does not exist on any other status.
   */
  var deleteOverlay = document.getElementById('delete-overlay');
  var deleteDialog = document.getElementById('delete-dialog');
  var deleteBackdrop = document.getElementById('delete-backdrop');

  function setDeleteDialog(open) {
    if (open) {
      deleteOverlay.hidden = false;
      void deleteBackdrop.offsetWidth;
      deleteBackdrop.classList.add('cdk-overlay-backdrop-showing');
      deleteDialog.classList.add('mdc-dialog--open');
    } else {
      deleteBackdrop.classList.remove('cdk-overlay-backdrop-showing');
      deleteDialog.classList.remove('mdc-dialog--open');
      deleteOverlay.hidden = true;
    }
    document.documentElement.classList.toggle('cdk-global-scrollblock', open);
  }

  /*
   * Removing the draft drops back to whatever is now newest. If it was the only
   * version — a document created and then emptied again — the page returns to
   * its empty state, which render() handles on its own.
   */
  function deleteDraft() {
    var removed = doc.versions[current];
    doc.versions.splice(current, 1);
    current = 0;
    window.CCA_LEGAL_STORE.save(doc);
    setDeleteDialog(false);
    render();
    window.CCA_ROUTES.notice('Draft v' + removed.v + ' deleted.');
  }

  // --------------------------------------------------------------- events --

  document.addEventListener('click', function (e) {
    if (e.target.closest('#version-select')) {
      openVersions(e.target.closest('#version-select'));
      return;
    }

    var option = e.target.closest('mat-option[data-version]');
    if (option) {
      current = Number(option.getAttribute('data-version'));
      closeVersions();
      render();
      return;
    }

    if (e.target.id === 'version-backdrop') {
      closeVersions();
      return;
    }

    // Close the chooser: the X, the scrim, or Escape.
    if (e.target.closest('[data-dialog-close]') || e.target === createBackdrop) {
      setCreateDialog(false);
      return;
    }

    // Upload dialog: close, clear, confirm.
    if (e.target.closest('[data-upload-close]') || e.target === uploadBackdrop) {
      setUploadDialog(false);
      return;
    }
    if (e.target.closest('[data-remove-file]')) {
      clearFile();
      return;
    }
    if (e.target.closest('#upload-confirm')) {
      if (!selectedFile) return;
      var file = selectedFile;
      /*
       * Reading the file is async, so the dialog stays open until it succeeds —
       * closing first would hide the error if it does not.
       */
      window.CCA_LEGAL_STORE.fileToDataUrl(file)
        .then(function (dataUrl) {
          var version, message;

          if (uploadMode === 'swap') {
            version = replaceFileOnVersion(file, dataUrl);
            message =
              '“' + file.name + '” replaces the file on v' + version +
              '. Publish it to make it the live version.';
          } else {
            version = addUploadedVersion(file, dataUrl, uploadMode === 'replace' ? 'edit' : 'create');
            message =
              '“' + file.name + '” saved as v' + version +
              '. Publish it to make it the live version.';
          }

          setUploadDialog(false);
          render();
          window.CCA_ROUTES.notice(message);
        })
        .catch(function (error) {
          showRefusal(
            error.message === 'too-large'
              ? 'That file is too large to keep in the browser. Use a PDF under 1.5 MB.'
              : 'That file could not be read. Try another PDF.',
          );
        });
      return;
    }

    /*
     * A choice. Upload opens step two. Writing goes to the editor, which is a
     * screen of its own and is not prototyped — say so rather than doing
     * nothing, because a dead card reads as a bug.
     */
    var choice = e.target.closest('[data-choice]');
    if (choice) {
      var isUpload = choice.getAttribute('data-choice') === 'upload';
      setCreateDialog(false);
      if (isUpload) {
        setUploadDialog(true);
      } else {
        window.CCA_ROUTES.notice('The version editor has not been prototyped yet.');
      }
      return;
    }

    // Delete confirmation.
    if (e.target.closest('[data-delete-close]') || e.target === deleteBackdrop) {
      setDeleteDialog(false);
      return;
    }
    if (e.target.closest('#delete-confirm')) {
      deleteDraft();
      return;
    }

    /*
     * The version actions. Which of these exist depends on the version's status
     * — see versionActionsHtml. Edit is the rich-text editor, a screen of its
     * own that is not prototyped; say so rather than doing nothing, because a
     * dead button reads as a bug.
     */
    var action = e.target.closest('[data-action]');
    if (!action) return;

    switch (action.getAttribute('data-action')) {
      case 'create':
        setCreateDialog(true);
        break;
      case 'edit':
        editCurrentVersion();
        break;
      case 'delete':
        setDeleteDialog(true);
        break;
      case 'publish':
        publishDraft();
        break;
      default:
        editCurrentVersion();
    }
  });

  /*
   * EDITING DEPENDS ON WHAT THE VERSION IS.
   *
   * A written version opens the rich-text editor. A version that is an uploaded
   * PDF has nothing to edit here — the document lives in the file — so editing
   * it means sending a replacement. Offering a text editor for a PDF would be a
   * dead end, and offering nothing would look broken.
   */
  function editCurrentVersion() {
    var version = doc.versions[current];
    if (version && version.file) {
      /*
       * Published means people are held to it, so the correction becomes its own
       * point version. A draft is not in force yet, so the file is simply swapped
       * on it. Substituted never gets here — it offers no actions at all.
       */
      setUploadDialog(true, version.status === 'Draft' ? 'swap' : 'replace');
      return;
    }
    window.CCA_ROUTES.notice(
      'The version editor has not been prototyped yet. It would save as v' +
        nextVersionNumber('edit') + '.',
    );
  }

  /*
   * Publishing a draft makes it the live version, and whatever was published
   * before becomes Substituted — which is what that word means in the version
   * list. The document's own status follows, so the row in the list agrees with
   * the page you just left.
   */
  function publishDraft() {
    doc.versions.forEach(function (v) {
      if (v.status === 'Published') v.status = 'Substituted';
    });
    doc.versions[current].status = 'Published';
    doc.status = 'Published';
    window.CCA_LEGAL_STORE.save(doc);
    render();
    window.CCA_ROUTES.notice('v' + doc.versions[current].v + ' published. The previous version is now substituted.');
  }

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    closeVersions();
    setCreateDialog(false);
    setUploadDialog(false);
    setDeleteDialog(false);
  });

  render();
})();
