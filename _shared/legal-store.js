/*
 * Legal documents — persistence across pages
 * ==========================================
 *   <script src="../_shared/legal-store.js"></script>   (right after data.js)
 *
 * Why this exists: a prototype's fixture is rebuilt on every page load, so a
 * document uploaded on the admin screen vanishes the moment you navigate to the
 * reader page. That breaks the one journey this flow is for —
 *
 *   legal uploads a policy  →  publishes it  →  opens it from the account menu
 *
 * — because the second half runs in a different document context. Blob URLs
 * would not survive it either: a blob: URL is scoped to the page that made it
 * and is dead anywhere else.
 *
 * So an uploaded file is read as a DATA URL and kept in localStorage with the
 * version it belongs to. Data URLs work in an iframe, survive navigation, and
 * need no server — the whole point being that this repo has none.
 *
 * Only CHANGES are stored, keyed by document id. The fixture stays the source
 * of truth for everything untouched, so editing _shared/data.js still shows up.
 *
 * To wipe test state, in the console:  CCA_LEGAL_STORE.clear()
 */
(function () {
  'use strict';

  var KEY = 'cca.legal.v1';

  // localStorage is per-origin and about 5MB. Base64 inflates a file by a third,
  // so refuse anything that would not leave room for a second document.
  var MAX_FILE_BYTES = 1.5 * 1024 * 1024;

  function read() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || '{}');
    } catch (error) {
      return {};
    }
  }

  function write(state) {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
      return true;
    } catch (error) {
      // Quota, or private browsing. Say so rather than failing silently — a
      // tester whose upload disappears will blame the prototype, not the quota.
      return false;
    }
  }

  /*
   * Apply saved changes over the fixture. Runs on load, before any page script,
   * so every page — admin and reader alike — starts from the same state.
   */
  function hydrate() {
    var D = window.CCA_DATA;
    if (!D || !D.legalDocuments) return;
    var state = read();

    D.legalDocuments.forEach(function (doc) {
      var saved = state[doc.id];
      if (!saved) return;
      if (saved.versions) doc.versions = saved.versions;
      if (saved.status) doc.status = saved.status;
      if (saved.updatedBy) doc.updatedBy = saved.updatedBy;
      if (saved.updatedAt) doc.updatedAt = saved.updatedAt;
      if (saved.updatedTime) doc.updatedTime = saved.updatedTime;
    });
  }

  function save(doc) {
    var state = read();
    state[doc.id] = {
      versions: doc.versions,
      status: doc.status,
      updatedBy: doc.updatedBy,
      updatedAt: doc.updatedAt,
      updatedTime: doc.updatedTime,
    };
    return write(state);
  }

  // Read a File as a data URL, so it can be stored and shown on another page.
  function fileToDataUrl(file) {
    return new Promise(function (resolve, reject) {
      if (file.size > MAX_FILE_BYTES) {
        reject(new Error('too-large'));
        return;
      }
      var reader = new FileReader();
      reader.onload = function () { resolve(reader.result); };
      reader.onerror = function () { reject(new Error('unreadable')); };
      reader.readAsDataURL(file);
    });
  }

  /*
   * What to put in an iframe src.
   *
   * A stored file is a data: URL, which the browser's PDF viewer prints in full
   * across its title bar — a wall of base64 that reads as something having gone
   * wrong. Converting it back to a blob: URL for display gives a short opaque id
   * instead. The data URL stays the stored form, because only it survives a
   * navigation; the blob is made fresh per page and cached so a re-render does
   * not leak a new one each time.
   */
  var blobUrls = {};

  function displayUrl(file) {
    if (!file || !file.url) return '';
    if (file.url.indexOf('data:') !== 0) return file.url;
    if (blobUrls[file.url]) return blobUrls[file.url];

    try {
      var parts = file.url.split(',');
      var mime = (parts[0].match(/:(.*?);/) || [])[1] || 'application/pdf';
      var binary = atob(parts[1]);
      var bytes = new Uint8Array(binary.length);
      for (var i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      var url = URL.createObjectURL(new Blob([bytes], { type: mime }));
      blobUrls[file.url] = url;
      return url;
    } catch (error) {
      return file.url; // better a long URL than no document
    }
  }

  function clear() {
    localStorage.removeItem(KEY);
    return 'Cleared. Reload the page.';
  }

  window.CCA_LEGAL_STORE = {
    hydrate: hydrate,
    save: save,
    clear: clear,
    displayUrl: displayUrl,
    fileToDataUrl: fileToDataUrl,
    maxFileBytes: MAX_FILE_BYTES,
  };

  hydrate();
})();
