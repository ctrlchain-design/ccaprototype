# CtrlChain prototypes

Design prototypes for the CtrlChain platform, built against the platform's **real
compiled CSS**. What a reviewer sees in the browser is what the product actually
looks like — not an approximation of it.

No build step, no framework, no install.

---

## Looking at them

Published from `main` via GitHub Pages at
**https://ctrlchain-design.github.io/ccaprototype/**, which is the root
[`index.html`](index.html) — send people there if you have no specific prototype
in mind.

| | |
| --- | --- |
| **[Playground](playground/)** | All the prototypes joined up as one product. Start on a screen and click through. |
| **[Prototype patterns](_shared/patterns.html)** | The shared building blocks, rendered. View source to copy. |
| `resource-availability/` | Landing page, the prototype, and its usability test cases |
| `orders-pinned-filters/` | Showing and hiding pinned filters above the Orders table |
| `taskboard-redesign/` | Concept exploration |
| `rate-configuration/` | Rate setup flow |

Locally:

```bash
python3 -m http.server 4321
```

Then `http://localhost:4321/`. Prefer the server over opening a file directly —
`file://` blocks some assets.

In Claude Code, the `prototypes` config in `.claude/launch.json` does the same and
opens a browser pane. It picks a free port if 4321 is taken.

---

## Making one

Ask Claude Code, in this repo:

> prototype the new rate breakdown screen

That runs the **`/prototype` skill**, which knows the whole workflow: look the
vocabulary up, copy real markup out of the design system, scaffold from the
template, audit every class and icon against the compiled CSS, wire the prototype
into the others, and screenshot it before handing it over. `CLAUDE.md` loads the
same rules into every session, so it applies to edits too.

The skill lives in the repo at `.claude/skills/prototype/`, so it is committed and
shared — everyone who clones gets the same one, and improving it improves it for
the team.

**Prototypes are built on a branch**, named after the folder — never on `main`,
because committing publishes and half-finished work would go live. One name for
the whole thing: the folder `orders-detail/` is the branch `orders-detail`, the
screen `orders.detail`, and the URL `/ccaprototype/orders-detail/`.

By hand it is a branch, a folder and a file:

```bash
git checkout main && git pull
git checkout -b my-prototype

mkdir -p my-prototype
cp .claude/skills/prototype/templates/index.html my-prototype/index.html
python3 .claude/skills/prototype/scripts/build-screens.py
```

The template is the platform shell — rail, submenu, top bar, scrolling page area —
already wired up, with working Dark and Collapse. Replace the page content.

---

## The three layers

A prototype sits on three things. Knowing which layer a problem belongs to saves
most of the time you would otherwise lose.

### 1. `design-system/dist/` — the platform, exported by FE

| Path | What it is |
| --- | --- |
| `dist/index.html` | Browsable catalogue — start here |
| `dist/components/*.html` | Per-component docs, rendered with the real markup |
| `dist/design-system/*.html` | Foundations: colours, tokens, typography, spacing, icons |
| `dist/ds/index.css` | The whole stylesheet, in cascade order. This is what prototypes link. |
| `dist/tokens/*.json` | Tokens, palette, type scale, icons as JSON |
| `dist/shell/` | Chrome for the catalogue pages — never push this to the design project |
| `design-system/INDEX.md` | Generated lookup table — grep it |

**Never edit anything inside `dist/`.** FE overwrites the whole folder on every
export.

`INDEX.md` answers "what is this called?" — every documented page with the classes
and element tags it renders with, all 492 tokens with light and dark values, 492
utility classes, 252 icon names, and the 40 design-system components. Too large to
read; grep it:

```bash
grep -n "cca-btn--" design-system/INDEX.md
grep -in "gear" design-system/INDEX.md      # -i matters: 11 glyphs are mixed-case
```

### 2. `_shared/` — this repo's thin layer over it

The handful of things a static prototype needs that the export does not provide.

| Path | What it is |
| --- | --- |
| `prototype.css` | Link after `ds/index.css`. Every recurring fix, each with a comment on what breaks without it. |
| [`patterns.html`](_shared/patterns.html) | Composed patterns, rendered: top bar, saved-view tabs, filter chips, badges, a working drawer. |
| `data.js` | The fixture records every prototype renders, so screens share one set of orders. |
| `routes.js` | Resolves `data-screen` links; shows a "not prototyped yet" notice for screens that do not exist. |
| `screens.js` | **Generated** by `build-screens.py`. The map of every page. |
| `shell.js` | Makes the rail's Dark and Collapse work. |
| `assets/flags/` | The platform's flag SVGs, which the export omits. |

Work something out that the next prototype will need? **Put it in `_shared/`.** If
FE later ships a real token or component for it, **delete it from `_shared/`** and
use the real thing — this is a holding pen for gaps in the export, not a second
design system.

### 3. The prototype itself

Ideally just markup and a little state. If you are writing much CSS, it probably
belongs in layer 2.

```html
<link rel="stylesheet" href="../design-system/dist/fonts/fonts.css" />
<link rel="stylesheet" href="../design-system/dist/ds/index.css" />
<link rel="stylesheet" href="../_shared/prototype.css" />
...
<script src="../_shared/data.js"></script>
<script src="../_shared/screens.js"></script>
<script src="../_shared/routes.js"></script>
<script src="../_shared/shell.js"></script>
<script>/* the page's own script goes after these */</script>
```

---

## Prototypes link to each other

The repo behaves like one product, not a folder of unrelated screens. Clicking an
order in a list opens the order detail — including when the detail gets prototyped
months after the list.

**Render from `_shared/data.js`**, never an inline array. One set of records, each
with a stable `id`, so the row you click is the record the next screen opens.

**Link by screen name, never a folder path:**

```html
<a data-screen="orders.detail" data-params='{"id":"CCA2023-000270.1"}'>CCA2023-000270.1</a>
```

A screen that does not exist yet **says so instead of 404ing**, and starts working
the day someone builds it — with no edit to the page that links to it. So write
links to screens you have not built. That is the point, not a mistake.

**Connecting is automatic.** A page names itself with `data-screen` on its
`<html>`, and the registry is regenerated by walking the repo:

```bash
python3 .claude/skills/prototype/scripts/build-screens.py
```

Nobody maintains a list by hand. A page without the attribute still gets a name
from its folder, so nothing has to be retrofitted.

---

## Conventions

- **One folder per prototype at the repo root**, named for the thing. The folder
  name is the public URL, so it is the name reviewers see.
- **Multi-page prototypes nest one level** behind a landing `index.html`.
  `resource-availability/` is the pattern — landing page, `prototype/`,
  `test-cases/`, and an `internal/` view left unlinked on purpose. Nesting means
  stylesheet paths need another `../`.
- **Add a card to the root `index.html`** and run `build-screens.py`.
- **Put reusable fixes in `_shared/`,** not in one prototype's `<style>` block.

### House rules

These hold for every prototype, whoever or whatever writes it.

- **Never invent a visual value.** No hex colours, pixel sizes, radii, shadows or
  font sizes of your own. They exist as tokens, utilities or component classes.
  Find the name in `INDEX.md`; if it genuinely isn't there, ask FE.
- **Copy markup from `design-system/dist/components/*.html`.** The element tags
  matter as much as the classes — much of the CSS targets `cca-side-menu`,
  `cca-status-badge`, `cca-main .appContent` and friends.
- **`<html lang="en" class="light">`.** The tokens flip to dark under
  `prefers-color-scheme` otherwise, so the prototype renders dark for any reviewer
  whose Mac is in dark mode.
- **Wrap the page in `cca-root`.** The platform ships an absolutely-positioned
  `body::before` overlay that swallows clicks on anything not inside a positioned
  ancestor. Skip it and the prototype renders perfectly and responds to nothing.
- **Don't guess an icon or class name — look it up.** Both fail silently: a wrong
  icon renders as nothing, a wrong class as unstyled text.
- **Look at it in a browser before sharing — and click things.** A screenshot
  cannot tell you a page is dead.

---

## Committing

Ask Claude Code to commit and the **`/prototype-commit` skill** takes over: it reads the
actual diff, splits the work along the repo's layers — the design-system export,
`_shared/`, each prototype, then docs — and writes messages in the style this
history already uses. Generated files are committed with whatever regenerated
them, never on their own.

**Committing publishes.** The skill commits on your prototype branch, merges to
`main`, pushes and deletes the merged branch, and
GitHub Pages serves it a minute or two later — no confirmation step, because
that was the slow part. It stops and asks only if the merge would conflict, or
if the prototype has not been checked in a browser.

Say "just commit" or "don't publish yet" to keep something on a branch.

## Publishing

Push to `main`. GitHub Pages serves the repository root, so a folder committed at
`my-prototype/` is live at
`https://ctrlchain-design.github.io/ccaprototype/my-prototype/` within a minute or
two. `.nojekyll` keeps Pages from processing anything — files are served exactly as
committed.

Pushing publishes. Nothing else does.

---

## When FE ships a new export

The bundle arrives as a folder in Downloads:

```bash
rm -rf design-system/dist
cp -R ~/Downloads/design-system/dist design-system/dist   # or the folder FE sent
xattr -cr design-system/dist
chmod -R u+rwX,go+rX design-system/dist
python3 .claude/skills/prototype/scripts/build-index.py
```

**Do not skip `xattr` and `chmod`.** macOS quarantines everything from Downloads,
and the folder inherits Downloads' `700` permissions. A quarantined bundle makes
prototypes render **completely unstyled** over `file://`, and `700` hides it from
anything that is not your own user account. Both look like "the CSS is broken" and
neither is obvious.

Then open one prototype and one catalogue page and look at them.

### Notes on the current bundle

- **Never upload `shell/*` to the published design project.** That chrome is this
  bundle's own; the design project has a richer one at the same paths. Everything
  else in the bundle is safe to push.
- **The clickability trap is live.** `body::before` is an absolutely-positioned
  full-page overlay, so content outside `cca-root` is unclickable.
- **Eleven icons are mixed-case** — `Gear-Settings`, `Bold`, `alignLeft` and
  friends. A lowercase grep misses them and makes an icon look missing when it is
  not.
- **Rail and nav icon names are not guessable.** Booking is `booking`, Dashboard
  `dashboardkpi`, Shipper TMS `boxes`, Enterprise `group`, Finance `invoice-euro`,
  Integrations `swap`, Release Notes `no-more-task`, Addressbook `phonebook`,
  Admin `Gear-Settings`.

Fixed in the exports so far, all reported from this repo: the missing `shell/`
folder; the `background.svg` path that resolved outside the bundle; a Scrims table
documenting which overlay gets which scrim; `--scrim-dialog` and `--scrim-drawer`
tokens that hold the same value in light and dark; and a search filter on the
iconography page.

---

## Layout

```
CLAUDE.md                    Rules Claude loads in every session here
README.md                    This file
index.html                   Front door — lists every prototype
.nojekyll                    Tells GitHub Pages to serve files as-is

_shared/                     This repo's layer over the design system
  prototype.css              The CSS every prototype needs
  patterns.html              Composed patterns, rendered — view source to copy
  data.js                    Fixture records shared across prototypes
  routes.js                  Screen-name link resolution
  screens.js                 GENERATED — the map of every page
  shell.js                   Dark mode and submenu collapse
  assets/flags/              Flags the export omits

design-system/
  INDEX.md                   GENERATED lookup table — grep it
  dist/                      FE's export. Generated; never edit.
  src/ build.ts verify/      FE's exporter source, for reference

playground/                  All the prototypes joined up
<prototype>/index.html       One folder per prototype

.gitignore                   Keeps .DS_Store and local settings out of commits

.claude/
  launch.json                The `prototypes` local preview server
  skills/prototype-commit/   The /prototype-commit skill
  skills/prototype/          The /prototype skill
    templates/index.html     Starter prototype
    scripts/build-index.py   Regenerates design-system/INDEX.md after an export
    scripts/build-screens.py Regenerates _shared/screens.js after adding a page
```

Older prototypes vary in how they were built — `rate-configuration/` is a Claude
Design canvas export, and some predate the full design-system bundle. Leave them
as they are unless you are deliberately migrating one.
