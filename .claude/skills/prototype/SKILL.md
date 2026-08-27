---
name: prototype
description: Build or change a CtrlChain prototype using the real design system in design-system/dist. Use whenever someone asks for a prototype, mockup, screen, flow, page or UI in this repo — "prototype the new rate config screen", "add a filter panel to the taskboard prototype", "mock up the availability view", "make a click-through of X" — and whenever editing an existing prototype's HTML. Also use when asked which component, token, utility class or icon exists, or what something is called in the design system.
---

# CtrlChain prototypes

Prototypes here are single static HTML files that use the platform's own compiled
CSS. A designer opens one in a browser and it looks and behaves like the product,
because it is the product's CSS — not a lookalike.

`design-system/dist/` is that CSS plus documentation, exported from the frontend
repo by FE. It is generated: never edit anything inside `dist/`.

## The rule that matters

**Do not invent visual values.** No hex colours, no pixel sizes, no radii, no
shadows, no font sizes of your own. Every one of those already exists as a token,
a utility class, or a component class. If you cannot find the thing you need, say
so and ask — a prototype that quietly makes up its own values is worse than one
that is missing a piece, because it teaches everyone the wrong vocabulary.

Plausible-looking class names are the trap: the type scale has `text-cca-label-lg`
but no `text-cca-heading-sm`, and a made-up name fails silently — the text just
renders at the browser default. Before you hand anything over, audit every class
you wrote against the compiled CSS:

```bash
python3 - <<'EOF'
import re, glob
css = "\n".join(open(f).read() for f in glob.glob('design-system/dist/ds/*.css'))
used = {c for a in re.findall(r'class="([^"]*)"', open('PROTOTYPE/index.html').read())
          for c in a.split()}
missing = [c for c in sorted(used)
           if not re.search(r'[.\s,]' + re.escape(c) + r'(?![\w-])', css)]
print("not in the design system:", missing or "none")
EOF
```

Anything it lists is either your own inline-styled class — fine, if it sets
layout only — or an invented one that needs fixing.

Three kinds of false positive to expect, all of them safe:

- **Escaped dots.** Tailwind writes `px-1.5` into the CSS as `.px-1\.5`, so a
  plain substring search misses it. The script above handles this; a hand-rolled
  grep will not.
- **Marker classes.** `notranslate`, `mat-mdc-focus-indicator`,
  `mat-mdc-input-element`, `mdc-data-table__table` and friends are hooks Angular
  and Material add without styling them. If you copied them out of a doc page,
  keep them — grep the doc pages to confirm.
- **Classes built in JavaScript.** A class name assembled from a template
  literal never appears in a `class="..."` attribute, so the scan skips it
  silently. Icon names are the usual casualty. Audit those separately against
  the icon font, which is the authoritative list:

```bash
python3 - <<'EOF'
import json, re
icons = {i['name'] for i in json.load(open('design-system/dist/tokens/icons.json'))['icons']}
src = open('PROTOTYPE/index.html').read()
used = set(re.findall(r'cca-icon-([A-Za-z0-9-]+)', src)) | set(re.findall(r"icon\('([A-Za-z0-9-]+)'\)", src))
used.discard('inline')   # cca-icon-inline is a Material size class, not a glyph
print("not in the icon font:", sorted(n for n in used if n not in icons) or "none")
EOF
```

Invented icon names are the single easiest mistake to make, because they sound
right and fail invisibly — the glyph is simply absent. `inbox` does not exist;
it is `message-inbox`. `pin` does not exist; it is `pinned`, `pinned-yes` or
`pinned-no`. `download` does not exist; it is `export`.

**Search case-insensitively.** Eleven glyphs are mixed-case — `Gear-Settings`,
`Bold`, `Italic`, `Underline`, `alignLeft`, `alignCenter`, `alignRight`,
`alignJustify`, `orderedList`, `unorderedList`, `android-face-Icon`. A lowercase
grep for "gear" finds nothing and makes it look like the icon is missing when it
is not. Use `grep -i`, and match `[A-Za-z0-9-]+` when extracting names.

**Do not guess a rail or nav icon — read it off the running app.** The names are
not what you would predict: Booking is `booking`, Dashboard is `dashboardkpi`,
Taskboard is `taskboard`, Shipper TMS is `boxes`, Enterprise is `group`, Finance
is `invoice-euro`, Integrations is `swap`, Release Notes is `no-more-task`,
Addressbook is `phonebook`, Admin is `Gear-Settings`.

## Start from the shared layer, not from scratch

`_shared/` holds everything we have already worked out. Use it before writing any
CSS of your own — most of what a prototype needs is solved in there, and each rule
carries a comment explaining what breaks without it.

- **`_shared/prototype.css`** — link it after `ds/index.css`. Covers the `cca-root`
  rule that makes a page clickable at all, drawer and overlay geometry, the
  scrim choice, the Material subscript fix, header links, page hugging, pin
  buttons and switch rows.
- **`_shared/patterns.html`** — open it in a browser. Composed patterns the bundle
  does not document: the real top-bar trailing cluster, saved-view tabs, pinned
  filter chips, badge flavours, a working drawer. View source and copy.
- **`_shared/shell.js`** — include once at the end of `<body>`. Wires the rail's
  Dark and Collapse items from `data-theme-toggle` / `data-submenu-toggle`, using
  the platform's own mechanisms: a `dark` class on the root element for theming,
  and `smallSideNav` on `cca-main` plus `hidden` on `cca-side-submenu` for the
  collapse. It no-ops when the markup is absent, so it is safe on a page with no
  rail. **`smallSideNav` is the EXPANDED state**, despite the name.
- **`_shared/data.js`** — the fixture records every prototype renders. One set of
  orders, so the row clicked in a list is the record a detail page opens.
- **`_shared/routes.js`** — the screen registry. Prototypes link to each other by
  screen name, never by folder path.
- **`_shared/assets/flags/`** — the platform's flag SVGs, which the export omits.

Two rules for `_shared/`:

1. **If you solve something new, put it there** rather than leaving it in one
   prototype. The next person should not have to rediscover it.
2. **If FE later ships a real token or component for something in `_shared/`,
   delete it from `_shared/` and use the real thing.** This folder is a holding
   pen for gaps in the export, not a second design system.

The starter template already links the shared stylesheet and includes the correct
shell, top bar and tabs, so a new prototype begins in the right state.

## Prototypes link to each other

These are not standalone screens. The repo is one product: a row in the orders
list opens the order detail, even when the detail was prototyped months later.
Two rules make that work.

**Render from `_shared/data.js`, never from an inline array.** The list and the
detail must read the same record, and every record has a stable `id` that links
carry between prototypes.

```js
const ORDERS = window.CCA_DATA.orders;          // list
const order  = window.CCA_DATA.order(id);       // detail
```

**Link by screen name, never by folder path.**

```html
<a data-screen="orders.detail" data-params='{"id":"CCA2023-000270.1"}'>CCA2023-000270.1</a>
```

`_shared/routes.js` resolves that against its registry. A screen mapped to `null`
is designed but not built: the link says so in a snackbar instead of 404ing, and
**comes alive the day someone registers it** — no edits to the pages that link to
it. Renaming a folder is one line in the registry rather than a hunt through
every prototype.

**Nothing is registered by hand.** A page names itself with `data-screen` on its
`<html>`, and a generator walks the repo to build `_shared/screens.js`:

```bash
python3 .claude/skills/prototype/scripts/build-screens.py
```

Run it after creating, renaming, moving or deleting a prototype — it is part of
building one, not a separate chore the designer has to remember. A page with no
`data-screen` still gets a name from its folder, so nothing has to be
retrofitted, and anything linked to but not built is recorded as `null`
automatically.

Then write links to screens that do not exist yet — that is the point, not a
mistake.

Read the id on the receiving end with `new URLSearchParams(location.search)`.

Shared scripts load in this order, before any page script:

```html
<script src="../_shared/data.js"></script>
<script src="../_shared/routes.js"></script>
<script src="../_shared/shell.js"></script>
```

## Workflow

### 1. Find the vocabulary

`design-system/INDEX.md` is a generated lookup table. It is far too large to
read — grep it:

```bash
# is there a class / token / icon by this name?
grep -n "cca-btn--" design-system/INDEX.md
grep -n "surface-neutral" design-system/INDEX.md
grep -n "cca-icon-truck" design-system/INDEX.md

# browse icons by keyword when you don't know the name
grep -A400 "^## Icons" design-system/INDEX.md | grep -i map
```

It indexes: every documented page and the classes and element tags it renders
with, all 13 type styles, all 490 tokens with light and dark values, all 492
utility classes and what they set, all 252 icon names, the raw palette, and the
40 design-system components.

### 2. Copy the real markup

The index gives you names. The markup comes from the documentation pages in
`design-system/dist/components/*.html` and `design-system/dist/design-system/*.html`.
Open the page for the component you need and copy its rendered static markup.

Two things about that markup are easy to get wrong:

- **Element tags are load-bearing.** Much of the CSS targets `cca-side-menu`,
  `cca-status-badge`, `cca-main .appContent` and friends. A badge is a
  `<cca-status-badge>` wrapping a utility-classed `<div>` — copying only the div
  loses the styling. Custom elements have no default display, so keep the
  `style="display:block"` the doc pages put on them.
- **The pages are static.** Angular adds hover, focus and floating-label classes
  at runtime, which is why each control appears several times — once per state.
  Take the state you want.

### 3. Scaffold or edit

New prototype — one folder per prototype at the repo root, `index.html` inside:

```bash
mkdir -p my-prototype
cp .claude/skills/prototype/templates/index.html my-prototype/index.html
```

The template is the platform shell: rail, submenu, top bar, scrolling page area.
Replace the page content and the nav labels; leave the shell structure and the
two stylesheet links alone. Its comments explain why each part is shaped the way
it is.

Editing an existing prototype — match what is already there. Some older
prototypes predate this bundle and use inline styles against a partial token
file; do not rewrite them wholesale unless asked. Add new work in the design
system's vocabulary.

### 3b. Follow this repo's conventions

**One folder per prototype at the repo root**, named for the thing, `index.html`
inside. That folder name becomes the public URL, so it is the name reviewers see:
`taskboard-redesign/` → `.../ccaprototype/taskboard-redesign/`.

**Multi-page prototypes nest one level**, with a landing `index.html` that links
the parts. `resource-availability/` is the pattern to copy:

    resource-availability/
      index.html          landing page — links the parts
      prototype/          the clickable prototype itself
      test-cases/         usability test cases
      internal/           internal-only view, deliberately unlinked from the landing page

Nesting a level means the stylesheet paths need `../../design-system/dist/…`.

**Add it to the root `index.html`** — the repo's front door lists every prototype
as a card with a status badge. A new prototype that isn't listed there is
invisible. Copy an existing card and change the href, name, description and badge
flavor (`primary`, `highlight`, `neutral`, `warning`, `danger`, `match`).

**Publishing is a push to `main`.** GitHub Pages serves the repo root, so the
folder is live at `https://ctrlchain-design.github.io/ccaprototype/<folder>/`
within a minute or two. Nothing to build. Never commit a prototype to `main`
without being asked to — that publishes it.

### 4. Verify it renders

Never hand over a prototype you have not looked at. The repo has a preview
server configured:

```bash
python3 -m http.server 4321
```

Then use `preview_start` with the `prototypes` config and screenshot the page.
Check: light mode, real fonts, icons rendering as glyphs rather than boxes,
active nav states, no unstyled fallback text.

**A screenshot does not prove the prototype works.** Because of the `body::before`
trap above, a page can render pixel-perfect and be entirely unclickable. Hit-test
every interactive element before handing it over:

```javascript
// javascript_tool — lists anything the mouse cannot actually reach
[...document.querySelectorAll('a, button, [role="button"], input, select')]
  .map(el => {
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return null;
    const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    return (top && (el.contains(top) || top === el))
      ? null
      : (el.tagName + ' "' + el.textContent.trim().slice(0, 30) + '" blocked by ' + (top && top.tagName));
  })
  .filter(Boolean);
```

An empty array means every control is reachable. `blocked by BODY` is this exact
bug. Two readings that are *not* bugs:

- **A modal blocks the page behind it on purpose.** With a drawer or dialog open,
  everything underneath reports blocked by the scrim. Check the blocker's id
  before believing the report — a scrim is correct, `BODY` is not.
- **Re-query between clicks.** If clicking re-renders a list, a cached
  `querySelectorAll` goes stale and later clicks land on detached nodes, which
  looks exactly like a broken handler. Re-query inside the loop.

Then click one link for real and confirm the URL changed. Note that a scripted
click can navigate while the screenshot still shows the old page, so check
`location.pathname` rather than trusting the image.

## Gotchas that will bite

**Everything must live inside `cca-root`, or nothing is clickable.** This is the
worst trap in the bundle, because the page looks perfect and simply does not
respond to the mouse.

The platform ships a full-page overlay:

```css
body::before {
  content: "";
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background-image: url("../../../shared/assets/images/background.svg");
  opacity: 0.1;
}
```

Being absolutely positioned, it paints above every static in-flow box and eats
their clicks. The running app never notices because app content sits inside
`cca-root`, which the design system defines as `position: relative`. A prototype
that puts content straight in `<body>` gets a page where some controls work and
others are stone dead — whichever ones happen to have a positioned ancestor.

So wrap the content, and give the custom element a display:

```css
cca-root { display: block; height: 100%; }  /* height: auto for a document-flow page */
```

The template already does this. If you build a page from scratch, do it too.

**Badge flavour names lie.** On `cca-numerical-badge`, `.primary` is
`--badge-bg-red` — not green, not the brand colour. Green is `.success`, and
white-on-green is `.inverted`. The flavour set also differs per badge component:
`cca-label-badge` has `.outline`, `.emphasis-outline` and `.new-feature` that the
numerical badge does not. Read the component's own stylesheet in
`design-system/dist/ds/components/` before picking a flavour from its name — and
if the Figma names a token like `badge.background.green`, grep for that token to
find which flavour actually sets it.

Badge **sizes** are not modifiers either: they come from the type and padding
utilities on the inner div. There is no `--small` class.

**`cca-btn--link` always underlines.** It hard-codes
`text-decoration: underline`, which is right for a link in prose and wrong for a
header action. Use `.proto-header-link` from `_shared/prototype.css`.

**Dark mode.** The tokens flip under `@media (prefers-color-scheme: dark)` unless
the root has `class="light"`. Without `<html lang="en" class="light">`, the
prototype renders dark for any reviewer whose Mac is in dark mode. The template
has it.

**Stylesheet order.** Link `fonts/fonts.css` then `ds/index.css`, in that order,
and nothing else. `ds/index.css` pulls in Material, the platform globals and the
CtrlChain component CSS in the same cascade order the app uses, and it also wires
up the icon font by a relative path. It is deliberately not wrapped in `@layer` —
do not wrap it, or Tailwind's preflight will beat Material's borders and every
form-field outline disappears.

**Relative paths.** A prototype one level down references
`../design-system/dist/…`. Deeper nesting needs more `../`. Check the network tab
if styles do not land.

**The shell grid.** `cca-main > .appContent` is a named-area CSS grid:
`sidenav submenu header / sidenav submenu topbar / sidenav submenu page`.
Children claim an area by being `cca-side-menu`, `cca-side-submenu`, `cca-header`,
`cca-message-banner` or `.page`. Flatten that ancestry and the rail loses its
sizing and active states.

**`.page`'s only child.** `.page > *` is `height: inherit`, so give `.page` a
single wrapper element and put the content inside that.

**Deep app components.** `ds/index.css` covers the 40 design-system components.
The other ~274 stylesheets under `ds/components/` are product-specific and are
not imported. If a prototype needs one, link it after `ds/index.css` — and
mention it, because needing one usually means the prototype is copying a screen
rather than composing one.

**Bundle quirks worth knowing.**

- **`shell/` is the catalogue's own chrome.** It ships now, so the documentation
  pages render properly. Never upload `shell/*` to the published design project —
  it has a richer shell at the same paths and this would overwrite it.
- **No gear, cog or settings glyph exists** in the icon font, though the running
  app shows one for Admin. Substitute and say so; do not invent a name.
- **Use the CDK overlay classes for anything modal** — dialogs, drawers, side
  panels. `ds/material-vendor.css` carries them, so do not hand-roll a scrim. The
  working version is in `_shared/patterns.html`; copy that rather than rebuilding:

      <div class="cdk-overlay-container">              <!-- fixed, inset 0, z 1000 -->
        <div class="cdk-overlay-backdrop cdk-overlay-dark-backdrop"></div>
        <div class="cdk-overlay-pane">…</div>
      </div>

  The backdrop starts at `opacity: 0` with a 400ms transition, so add
  `cdk-overlay-backdrop-showing` on the *next frame* — set it in the same paint
  and there is nothing to animate. Put `cdk-global-scrollblock` on `<html>` while
  it is open to freeze the page. `components/modal.html` shows the pattern.

  All the CDK leaves to you is where the pane lands: the app computes that from a
  position strategy at runtime, so a static prototype states the end position.

- **Pick the right scrim — there are three and they are not interchangeable.**
  `components/modal.html` documents them:

  | Overlay | Scrim | Source |
  | --- | --- | --- |
  | Dialog | `rgba(0, 0, 0, 0.32)` | `cdk-overlay-dark-backdrop` (CDK default, never overridden) |
  | Drawer / sidenav | `rgba(0, 0, 0, 0.6)` | `--mat-sidenav-scrim-color` |
  | Side panel | transparent | `cdk-overlay-transparent-backdrop` |

  A drawer wearing the dialog class is visibly too light. Reach for
  `cdk-overlay-dark-backdrop` only for actual dialogs.

  **A scrim cannot be a semantic token.** If a Figma frame specifies one as
  `surface-neutral-darkest` at 50%, it is unbuildable: that token resolves to
  Neutrals.200 in dark mode, so the overlay would come out lighter than the page
  behind it. Say so rather than implementing it.

- **Never gate correctness on `requestAnimationFrame`.** rAF does not fire in a
  background or non-rendering tab, so a fade armed that way silently never starts
  and the scrim sits at `opacity: 0` — invisible. Force the starting state with a
  layout read instead:

      container.hidden = false;
      void backdrop.offsetWidth;    // commits opacity 0
      backdrop.classList.add('cdk-overlay-backdrop-showing');

  Related when verifying: CSS transitions do not advance in a hidden tab either,
  so `getComputedStyle(el).opacity` can read the start value forever. Check
  `document.visibilityState` before believing an animation is broken, and confirm
  with a screenshot, which forces a paint.

## After FE re-exports

A new bundle arrives as a folder in Downloads. Install it like this — the two
`xattr`/`chmod` lines are not optional housekeeping:

```bash
rm -rf design-system/dist
cp -R ~/Downloads/design-system design-system/dist

# macOS flags anything from Downloads as quarantined, and the folder inherits
# Downloads' 700 permissions. Quarantined files are refused by browsers when a
# prototype is opened over file://, and 700 hides the bundle from any process
# that is not you — including a static server or GitHub Pages.
xattr -cr design-system/dist
chmod -R u+rwX,go+rX design-system/dist

python3 .claude/skills/prototype/scripts/build-index.py
```

Then check the install actually took:

```bash
# both should print 0
find design-system/dist -type f -exec sh -c 'xattr "$1" | grep -q quarantine && echo x' _ {} \; | wc -l
find design-system/dist -type d ! -perm -go+rx | wc -l
```

Finally re-screenshot one existing prototype and one catalogue page, and re-run
the class and icon audits against the new bundle — a re-export can rename or drop
a utility, which fails silently.
