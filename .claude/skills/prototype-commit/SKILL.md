---
name: prototype-commit
description: Commit and publish prototypes in the CtrlChain prototype repo, with messages a reviewer can navigate six months later. Use when asked to commit, stage, save or check in prototype work, to write a commit message, to cut a dated version for a review session, or to push and publish to GitHub Pages.
---

# Committing prototypes

This is not a code repo. Nobody reads this history to debug a regression — they
read it to find **the version we showed in the workshop on the 25th**, or to work
out why a prototype stopped matching the Figma. Write for that reader.

## Commit, merge and publish — in one go

**The default is to publish.** Committing means: commit on the current branch,
merge it into `main`, push, and let GitHub Pages serve it at
`https://ctrlchain-design.github.io/ccaprototype/` within a minute or two.

Do not ask for confirmation each time. The team has authorised this standing —
asking every commit is the thing this policy exists to remove.

    git add <paths>            # explicit paths, never -A
    git commit                 # one commit per layer, see below
    git checkout main
    git merge <prototype-branch>
    git push
    git branch -d <prototype-branch>   # merged, so it is done

### Stop and ask only when

- **The merge would conflict.** Never resolve a publish-path conflict silently —
  show the user which files clash and let them decide. `git merge --abort` and
  report rather than guessing at intent.
- **The prototype has not been verified.** The `/prototype` skill's checks are
  the gate that replaced the confirmation prompt: screenshot it, click things,
  run the class and icon audits. An unstyled or unclickable prototype going live
  wastes a reviewer's session. If it has not been looked at in a browser, say so
  and stop.
- **The user says otherwise** — "just commit", "don't publish yet", "keep it on
  the branch". Then commit and stop.

### One branch per prototype

Prototypes are built on their own branch, named after the folder — see the
`/prototype` skill. So a normal publish is: commit on `orders-detail`, merge it
into `main`, push, and the branch has served its purpose.

Delete it once merged, so the branch list stays a list of work in progress
rather than a graveyard:

    git branch -d orders-detail
    git push origin --delete orders-detail   # only if it was pushed

Never delete a branch that has not been merged. If `git branch -d` refuses, that
is the signal — report it rather than forcing with `-D`.

### Check before merging

    git fetch origin
    git merge-base --is-ancestor main HEAD   # clean fast-forward?

If `main` has moved on since the branch started, the merge may conflict. Check
before touching `main`, not after.

After pushing, tell the user the live URL of what changed — that is the thing
they are about to send someone.

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
5. Merge to `main` and push — that publishes. Only stop if one of the
   conditions above applies.
6. Show `git log --oneline` and the live URL of what changed.

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
