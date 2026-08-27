# CtrlChain prototypes

Designer-facing prototype repo. Each top-level folder is one prototype — a static
`index.html` served from GitHub Pages, opened in a browser by whoever is
reviewing it. No build step, no framework.

    rate-configuration/       resource-availability/       taskboard-redesign/

## The design system is the source of truth

`design-system/dist/` holds the platform's real compiled CSS, component
documentation and machine-readable tokens, exported from the CtrlChain frontend
repo by FE. Prototypes link that CSS directly, so they inherit the product's
actual look rather than approximating it.

`design-system/dist/` is generated output — **never edit anything inside it**. FE
overwrites the whole folder on each export.

## Building or changing a prototype

Use the **`/prototype` skill** — it has the workflow, the lookup recipes, the
starter template and the gotchas. Load it before writing prototype markup, not
after.

`_shared/` is the repo's thin layer over the design system: `prototype.css` (the
rules every static prototype needs), `patterns.html` (composed patterns to copy)
and `assets/flags/`. Start there rather than writing your own CSS, and put any new
reusable fix there rather than in a single prototype.

Prototypes are one product, not separate screens: render records from
`_shared/data.js` and link between prototypes by screen name
(`data-screen="orders.detail"`), which `_shared/routes.js` resolves. Links to
screens that do not exist yet are expected — they explain themselves and start
working when the screen is registered.

The short version, which applies to every change in this repo:

- **Never invent a visual value.** No hex colours, pixel sizes, radii, shadows or
  font sizes of your own. They all exist already as tokens, utility classes or
  component classes. Grep `design-system/INDEX.md` to find the name; if it truly
  isn't there, ask rather than making one up.
- **Copy markup out of `design-system/dist/components/*.html`** instead of
  writing your own. The element tags matter as much as the classes.
- **`<html lang="en" class="light">`.** The tokens flip to dark under
  `prefers-color-scheme` without it, so the prototype would render dark for any
  reviewer whose OS is in dark mode.
- **Link exactly two stylesheets, in order**: `fonts/fonts.css`, then
  `ds/index.css`. Don't wrap them in `@layer`.
- **Look at it before handing it over.** Start the `prototypes` preview server
  and screenshot the page.

## Committing

Use the **`/prototype-commit` skill**. It has the message style, how to split work along the
repo's layers, and the rule that matters most: **pushing to `main` publishes to
GitHub Pages**, so confirm before pushing — always.

## Lookups

`design-system/INDEX.md` indexes every component, token, utility class, type
style and icon name in the bundle. Grep it — it is far too large to read. It is
generated; after FE ships a new export, run:

    python3 .claude/skills/prototype/scripts/build-index.py

## Local preview

    python3 -m http.server 4321

Or start the `prototypes` config from `.claude/launch.json`, which does the same
thing and opens a browser pane.
