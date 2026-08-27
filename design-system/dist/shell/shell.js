/*
 * Generated — dark-mode toggle for the exported bundle.
 *
 * The platform switches theme with a `dark` class on the root element, so the
 * documentation does the same and the previews theme exactly as the app does.
 */
(function () {
  var KEY = 'cca-ds-theme';

  function apply(theme) {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }

  try {
    apply(localStorage.getItem(KEY) || 'light');
  } catch (error) {
    apply('light');
  }

  document.addEventListener('click', function (event) {
    var target = event.target;
    if (!target || !target.closest || !target.closest('[data-theme-toggle]')) {
      return;
    }

    var next = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
    apply(next);

    try {
      localStorage.setItem(KEY, next);
    } catch (error) {
      // Storage can be unavailable; the toggle still works for this page.
    }
  });
})();
