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

## Building or changing a prototype

**Start on a branch, named after the prototype folder** — never build on `main`.
Branching is automatic and needs no one's permission; see "Branch, commit,
publish" below for why the three are kept apart.

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

## Branch, commit, publish — three separate things

GitHub Pages serves `main`, so only the last of these goes live. Keep them
distinct and never roll one into the next.

**Branch is automatic. Never ask, never skip it.** The moment prototype work
starts, if the repo is sitting on `main`, branch — named after the prototype
folder. Nobody should have to ask for this and nobody should have to be
reminded, because work committed on `main` is published work.

    git checkout main && git pull
    git checkout -b orders-detail

Already on a branch for this work? Stay on it.

**"Commit" means commit to the branch, and stop there.** Nothing is published.
Use the **`/prototype-commit` skill** for it — it carries the message style and
how to split work along the repo's layers. **Invoke the skill every time**,
rather than running `git` by hand from memory of what it said: its stop-and-ask
conditions are the whole point, and they are what gets skipped when the commands
are hand-rolled.

**"Publish" means merge to `main` and push**, which puts the prototype live at
`https://ctrlchain-design.github.io/ccaprototype/<folder>/`. Do that only when
someone asks for it in those words. Two things that are *not* permission to
publish:

- **An earlier "go ahead".** It covered the state of the work at that moment,
  not everything that follows. Mid-iteration, each change needs its own.
- **Fixing your own mistake.** A commit that only undoes an error you shipped
  needs the same go-ahead as any other change — arguably more, since the last
  one was wrong.

Stop and report rather than publishing when the merge would conflict, or when
nobody has looked at the prototype in a browser.

## Lookups

`design-system/INDEX.md` indexes every component, token, utility class, type
style and icon name in the bundle. Grep it — it is far too large to read. It is
generated; after FE ships a new export, run:

    python3 .claude/skills/prototype/scripts/build-index.py

## Local preview

    python3 -m http.server 4321

Or start the `prototypes` config from `.claude/launch.json`, which does the same
thing and opens a browser pane.
