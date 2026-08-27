---
name: prototype-commit
description: Commit and publish prototypes in the CtrlChain prototype repo, with messages a reviewer can navigate six months later. Use when asked to commit, stage, save or check in prototype work, to write a commit message, to cut a dated version for a review session, or to push and publish to GitHub Pages.
---

# Committing prototypes

This is not a code repo. Nobody reads this history to debug a regression — they
read it to find **the version we showed in the workshop on the 25th**, or to work
out why a prototype stopped matching the Figma. Write for that reader.

## Publishing is a push to `main`

`main` is served by GitHub Pages at
`https://ctrlchain-design.github.io/ccaprototype/`. Pushing puts prototypes in
front of anyone with the link, within a minute or two.

- Committing is safe. **Pushing to `main` publishes** — confirm with the user
  first, every single time, even when they asked you to commit.
- Check `git branch --show-current` before doing anything.
- Never push a prototype the user has not looked at in a browser.
- The `/prototype` skill's verification step comes *before* this one: screenshot
  it, click things, run the class and icon audits. Publishing an unstyled or
  unclickable prototype wastes a reviewer's session.

## The versioned-replacement pattern

A third of this repo's history is one shape:

```
Replace internal page with 25Aug version
Replace prototype page with UT-24Aug version
Replace internal page with 12AugNew version
```

That is a designer cutting a build for a specific review session. When the user
is replacing a prototype ahead of a session, follow it — the date in the subject
is how they find it again. Keep their date format rather than normalising it.

Add a body saying what a reviewer will notice as different:

```
Replace Orders page with 27Aug version

Pinned filters now hide when nothing is pinned, and the filter count reflects
applied values rather than pinned ones — both came out of the 26 Aug review.
```

## One commit per layer

The repo has clean seams. Splitting along them means a bad prototype can be
reverted without taking the design system or the shared layer with it.

| Layer | Real example |
| --- | --- |
| FE's export | `Update design system export to 26 Aug bundle` |
| `_shared/` | `Add drawer, scrim and hug rules to shared prototype.css` |
| One prototype | `Add Orders pinned-filters prototype` |
| `playground/` and root `index.html` | usually go with the prototype they list |
| Docs, skills, tooling | `Document the screen registry in the README` |

Never bundle a design-system import with prototype work. They change for
different reasons and get reverted separately.

**Generated files travel with whatever regenerated them:**

- `design-system/INDEX.md` → with the export that produced it
- `_shared/screens.js` → with the page whose `data-screen` changed

A generated file committed on its own reads as a mystery diff.

## Never commit

- **`.DS_Store`** — `.gitignore` covers it; if one slips through, remove it.
- **Real customer data** in a fixture, a screenshot or a page title. This repo is
  published. `_shared/data.js` is deliberately fake.
- **A real person's avatar or photo.** Prototypes use initials.
- **A design-system export the user has not asked you to install.**
- **`design-system/dist/` edits.** It is generated; FE overwrites it wholesale. If
  a diff shows changes inside `dist/` that did not come from an export, something
  is wrong — say so rather than committing it.

## Message style

Match the existing history: **imperative, sentence case, no `feat:`/`fix:`
prefixes, no full stop.**

```
Add Orders pinned-filters prototype
Update design system export to 26 Aug bundle
Move all resource availability files into resource-availability/ folder
```

Add a body when the subject does not carry it — in this repo that usually means:

- **Where the design came from.** Name the Figma node or flow, so the next person
  can open it.
- **A decision that contradicts a source.** "The frame draws a fixed 512px; the
  platform sizes drawers fluidly, so this uses the platform variables." Without
  this, the next designer 'fixes' it back.
- **Something that will look like a bug later.** "The tab row renders from state
  because saved views only exist once a user creates one."
- **What a `_shared/` change unblocks**, so the next prototype finds it.

Few lines, wrapped at 72. What and why — the diff already shows how.

## Workflow

1. `git status` and `git diff`, including untracked files. Read what actually
   changed; do not commit from memory of what you did.
2. Group into layers. A change spanning layers is usually two commits.
3. Stage explicitly by path. **Never `git add -A`** — it sweeps up scratch files
   and half-finished prototypes.
4. Commit each group.
5. Show `git log --oneline` for what you created, then stop. Ask before pushing.

### A large batch of untracked work

Order the commits so the history reads as a build-up, and so any single commit
can be checked out and still make sense:

1. **The design-system export** — everything else sits on it.
2. **`_shared/`** — prototypes depend on it.
3. **Each prototype**, with its card in the root `index.html`.
4. **Docs, skills and tooling** last.

## Trailer

```
Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
```

matching the existing history.
