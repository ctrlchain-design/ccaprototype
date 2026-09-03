# CtrlChain prototypes

Designer-facing prototype repo. Each prototype is a static `index.html` served
from GitHub Pages, opened in a browser by whoever is reviewing it. No build step,
no framework.

    rate-configuration/       resource-availability/       taskboard-redesign/
    orders-pinned-filters/    legal/

A top-level folder is usually one prototype. Where several screens belong to one
capability, they nest inside a single folder instead of spreading across the repo
root — `legal/` holds four screens, `resource-availability/` three. A nested page
is registered exactly like a top-level one, by the `data-screen` on its own
`<html>` element.

## The design system is the source of truth

`design-system/dist/` holds the platform's real compiled CSS, component
documentation and machine-readable tokens, exported from the CtrlChain frontend
repo by FE. Prototypes link that CSS directly, so they inherit the product's
actual look rather than approximating it.

`design-system/dist/` is generated output — **never edit anything inside it**. FE
overwrites the whole folder on each export.

### Confirmed gaps in the current export

Found by building against it, so nobody rediscovers them and so there is
something concrete to hand FE. Re-check after each re-export — a gap closing is
the signal to delete whatever `_shared/` was compensating with.

| Gap | What it means in practice |
| --- | --- |
| `w-22` is not a class the bundle defines | It is on the type column in `orders-pinned-filters`, doing nothing. Nothing sets `.w-22`. |
| `--mat-option-selected-state-layer-color` is undefined | `.ng-option-selected`'s background computes to nothing, so a chosen dropdown row has no fill. |
| ng-select's core CSS is not exported | `.ng-dropdown-panel` never gets `position: absolute`, so a dropdown renders in the flow. Compensated in `prototype.css`. |
| `cca-attention-flag-badge` has no green tone | Only neutral, accent-blue, warning and danger — in the export AND in Figma. A green flag is unbuildable; passing `primary` renders unstyled grey. |
| `components/badge.html` documents only part of the badge size scale | Two of the status badge's sizes, one of the flag's. The 12px flag the Orders table uses has no example to copy. |
| The 40 documented components are not the whole story | ~274 more stylesheets sit under `ds/components/` unimported. `cca-date-cell`, `cca-filters-select` and the rest of the filter family are all in there. |

A component's stylesheet being unimported does **not** mean it is unofficial —
check `isDesignSystem` in `design-system/dist/manifest.json`:

    python3 -c "import json; print([c for c in json.load(open('design-system/dist/manifest.json'))['components'] if c['selector']=='cca-date-cell'])"

## Building or changing a prototype

**Start on a branch, named after the prototype folder** — never build on `main`,
because committing publishes and half-finished work would go live.

Use the **`/prototype` skill** — it has the workflow, the lookup recipes, the
starter template and the gotchas. Load it before writing prototype markup, not
after.

`_shared/` is the repo's thin layer over the design system: `prototype.css` (the
rules every static prototype needs), `patterns.html` (composed patterns to copy),
`filters.js` (the Orders filter mechanism — drawer, pinned chips, value popover
and the predicates behind them) and `assets/flags/`. Start there rather than
writing your own CSS, and put any new reusable fix there rather than in a single
prototype.

🔴 **A fix is not finished until the copies are fixed too.** Putting new work in
`_shared/` is only half the rule. When you find a bug — a wrong icon name, a
class that does not exist, a component used without its load-bearing element —
**grep the repo for the same mistake and fix every instance**, including
`_shared/patterns.html`, which is where the next person will copy it from.

On 2026-09-02 `icon('pinned')` turned out to be the UNPINNED glyph. It was
wrong in `oms/`, in `orders-pinned-filters/`, and in the `patterns.html` pattern
both had copied it from. Fixing only the page in front of me would have left the
pattern still teaching it. Nothing in these docs told me to look — hence this
paragraph.

    # before calling a fix done
    grep -rn "the-wrong-thing" --include='*.html' --include='*.js' . | grep -v design-system/

**`_shared/filters.js` is where filtering lives.** Any prototype showing a list
of records gets the whole mechanism by calling it, rather than rebuilding a
drawer:

    const filters = CCA_FILTERS.orders();       // the 31-filter Orders preset
    const FX = CCA_FILTERS.mount({ filters, records, viewName, onChange });
    FX.visible()                                // records surviving the filters

It carries the parts that are easy to get wrong, all read off the running app
rather than a Figma frame: pinning is layout and never filters, a pinned chip
opens its values inline, the same filter renders as chips in the drawer and as
checkboxes in that popover, and Category interlocks with Order Type so no one
can filter to a combination no order can have. Its header documents the rest.

`CCA_FILTERS.actions(filters)` renders the **Clear Filters / Save View** pair,
and `CCA_FILTERS.clearAll(filters)` backs the first — both module-level, so a
prototype that borrows the preset without mounting still gets them. They key off
what is APPLIED, not what is pinned: a filter can be applied straight from the
drawer, so a row that only appears for pinned chips hides them exactly when they
are wanted.

⚠ **`applied` has two shapes.** `mount()` and `oms/` treat `f.applied` as an
**array of values**; `orders-pinned-filters/` predates this file and treats it as
a **count** (`applied: 3`). Read it through `CCA_FILTERS.appliedCountOf(f)` in
anything shared — assuming `.length` is what made Clear Filters silently never
appear on that page, since `(3).length` is `undefined`.

Add a filter by adding to the preset, not by editing a prototype. A filter with
no `field`, `derive` or `match` renders its control and says out loud that it
does not narrow anything — which is honest for the ones this repo's fixtures
cannot exercise, and better than a control that silently does nothing.

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

## Epic and story definitions

Requirements can be drafted here or in the PO vault at
`/Users/angelica.fernando/product-owners` — it is the designer's call. Drafting next
to the prototype is often the faster loop, because the screen and its criteria are
being worked out together. Moving them to the vault afterwards is a copy, not a
rewrite, and only the vault-only bits change: the `## Linked …` lists become Dataview
blocks, and a user story drops `parent-epic` for `parent-feature`.

Use the **`/create-epic`** and **`/create-user-story`** skills here — they carry the PO
team's requirement rules (INVEST, acceptance-criteria structure, the CtrlChain role
list, Definition of Ready) from `.claude/references/`. The vault has its own
`/create-epic`, `/create-feature`, `/create-user-story` and `/sync-ado` for when the
work belongs there from the start.

🔴 **Check the ID registry before assigning a number, every time — not once.**
`EPIC-`, `FEAT-` and `US-` numbers are global across the whole PO team, and the vault
is the registry. Scan **both places** immediately before you write:

    { grep -rho 'id: US-[A-Z][A-Z]-[0-9]\{3\}' . --include='*.md'; \
      grep -rho 'id: US-[A-Z][A-Z]-[0-9]\{3\}' \
        /Users/angelica.fernando/product-owners/Requirements/AllRequirements/; } \
      | grep -o '[0-9]\{3\}$' | sort -n | tail -1

This collided twice on 2026-08-31. The vault gains committed work and switches
branches while you are drafting, so a number that was free an hour ago is not free
now — `US-AF-315`–`317` were taken by the column-naming stories mid-session and the
legal ones had to be renumbered to `328`–`330`. Re-scan just before writing, and
again before syncing to ADO.

**ADO is the source of truth once an item is synced** — these files are the drafting
and refinement layer.

## Committing

Use the **`/prototype-commit` skill**. It has the message style and how to split
work along the repo's layers. Committing here **merges to `main` and publishes**
by default — that is deliberate, so don't ask each time. Stop only for a merge
conflict, or a prototype nobody has looked at in a browser.

## Lookups

`design-system/INDEX.md` indexes every component, token, utility class, type
style and icon name in the bundle. Grep it — it is far too large to read. It is
generated; after FE ships a new export, run:

    python3 .claude/skills/prototype/scripts/build-index.py

## Local preview

    python3 -m http.server 4321

Or start the `prototypes` config from `.claude/launch.json`, which does the same
thing and opens a browser pane.
