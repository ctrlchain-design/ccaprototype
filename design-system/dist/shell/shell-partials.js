/*
 * Generated — injects the bundle's navigation, header and footer.
 *
 * Pages set window.DS_BASE and window.DS_CURRENT before loading this. The nav
 * lists only pages this bundle contains.
 */
(function () {
  var BASE = window.DS_BASE || '';
  var CURRENT = window.DS_CURRENT || '';
  var NAV = [
  {
    "label": "Foundations",
    "entries": [
      {
        "path": "design-system/colors.html",
        "title": "Colors"
      },
      {
        "path": "design-system/tokens.html",
        "title": "Tokens"
      },
      {
        "path": "design-system/typography.html",
        "title": "Typography"
      },
      {
        "path": "design-system/spacing.html",
        "title": "Spacing & Radius"
      },
      {
        "path": "design-system/iconography.html",
        "title": "Iconography"
      },
      {
        "path": "design-system/buttons-inputs.html",
        "title": "Buttons & Inputs"
      },
      {
        "path": "design-system/badges-status.html",
        "title": "Badges & Status"
      },
      {
        "path": "design-system/navigation.html",
        "title": "Navigation"
      }
    ]
  },
  {
    "label": "Components",
    "entries": [
      {
        "path": "components/button.html",
        "title": "Button"
      },
      {
        "path": "components/input.html",
        "title": "Input"
      },
      {
        "path": "components/search-bar.html",
        "title": "Search Bar"
      },
      {
        "path": "components/card.html",
        "title": "Card"
      },
      {
        "path": "components/modal.html",
        "title": "Modal"
      },
      {
        "path": "components/table.html",
        "title": "Table"
      },
      {
        "path": "components/tabs.html",
        "title": "Tabs"
      },
      {
        "path": "components/chips.html",
        "title": "Chips"
      },
      {
        "path": "components/badge.html",
        "title": "Badge"
      },
      {
        "path": "components/tooltip.html",
        "title": "Tooltip"
      },
      {
        "path": "components/sidebar.html",
        "title": "Sidebar Menu"
      },
      {
        "path": "components/top-bar.html",
        "title": "Top Bar"
      }
    ]
  }
];

  function link(page) {
    var active = page.path === CURRENT ? ' class="is-active"' : '';
    return '<a href="' + BASE + page.path + '"' + active + '>' + page.title + '</a>';
  }

  var sidebar = document.querySelector('[data-shell="sidebar"]');
  if (sidebar) {
    sidebar.innerHTML =
      '<div class="brand">' +
      '<img src="' + BASE + 'assets/images/ctrlchain-text-green.svg" alt="CtrlChain" />' +
      '<div class="tag">Design System</div>' +
      '</div>' +
      '<a class="nav-sub" style="display:block" href="' + BASE + 'index.html">' +
      '<a href="' + BASE + 'index.html">All components</a></a>' +
      NAV.map(function (group) {
        return (
          '<div class="nav-group"><div class="nav-heading">' + group.label + '</div>' +
          '<div class="nav-sub">' + group.entries.map(link).join('') + '</div></div>'
        );
      }).join('');
  }

  var header = document.querySelector('[data-shell="header"]');
  if (header) {
    header.innerHTML =
      '<div class="spacer"></div>' +
      '<button class="theme-toggle" data-theme-toggle>Toggle theme</button>';
  }

  var footer = document.querySelector('[data-shell="footer"]');
  if (footer) {
    footer.innerHTML =
      'Generated from the CtrlChain platform source — run <code>pnpm design-system:export</code> to refresh.';
  }
})();
