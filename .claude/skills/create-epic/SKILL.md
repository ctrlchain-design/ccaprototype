---
name: create-epic
description: Create a new epic definition in the CtrlChain prototypes repo, following the rules in .claude/references/rules-requirements.md and the epic template. Writes into the epic-definitions folder of the prototype it belongs to.
---

# Create epic

Create a new epic definition file inside this repo, following the requirement conventions carried over from the PO vault.

## Where the file goes

Every prototype owns its requirements. The file goes in:

```
<prototype>/epic-definitions/<id>-<slug>.md
```

`<prototype>` is the top-level prototype folder — `rate-configuration/`, `taskboard-redesign/`, `orders-pinned-filters/`, and so on. Where a top-level folder groups several screens in subfolders (as `legal/` groups `admin/`, `admin-document/`, `privacy/` and `terms/`), the `epic-definitions/` folder sits at the **top level** — one set of definitions for the prototype, not one per screen. `_shared/` and `design-system/` are repo infrastructure, not prototypes; nothing is ever written into them.

**The folder is created on demand, never in advance.** Only the `epic-definitions/` folder for the prototype you are writing to gets created, and only at the moment the first file goes into it — do not pre-create empty ones for the other prototypes. A brand-new folder gets a one-paragraph `README.md` alongside that first file, saying it holds the epic and user-story definitions for that prototype, that they follow the PO vault's requirement conventions, and that ADO is the source of truth once synced.

**The epic lives with the work it describes.** Do not write it to the repo root, and do not write it back into the PO vault — this skill is the local copy on purpose, so the definition sits next to the prototype it belongs to.

## Preflight (run first, every time)

1. **Pull the latest changes** before proceeding:

   ```bash
   git pull --ff-only
   ```

   Report what was pulled (or "Already up to date."), then continue. This prevents ID collisions with work already committed.

2. **Check the branch.** This repo's rule is *never work on `main`* — committing there merges and publishes to GitHub Pages. Epic definitions are documentation rather than a published page, but the rule still holds: if `git branch --show-current` says `main`, tell the user and let them branch (named after the prototype) before you write. Do not create the branch yourself.

## Steps

1. **Read the template and rules first.** Open `.claude/templates/requirement-epic.md` and `.claude/references/rules-requirements.md` before doing anything else. Do not improvise the structure. Apply **§ Writing the description** — an epic description states the capability being delivered, not the problem it prevents.

2. **Identify the creating contributor.** Determine who is invoking this — ask if you are not sure. Prefixes are the same ones the PO vault uses, because an epic drafted here may end up in ADO alongside the vault's:
   - Angelica → `AF`
   - Brian → `BO`
   - Ellis → `EP`
   - Liam → `LF`
   - Nuno → `NS`
   - Tomas → `TT`

   **Use your own prefix**, never the prefix of someone you are covering — the prefix records who wrote the item, not which team it belongs to.

3. **Establish the prototype.** Which prototype is this for? Infer it from the current branch name or from what the user has been working on, and confirm — do not guess silently. If the prototype folder does not exist yet, stop: the prototype comes first, the epic definition second. The answer decides the output folder, so settle it before writing anything.

4. **Ask the user for:**
   - **Title** — short, descriptive.
   - **Pillar** — which strategic pillar this epic rolls up to. Pillars live in the PO vault at `Goals/Pillars/`; list them with

     ```bash
     ls /Users/angelica.fernando/product-owners/Goals/Pillars/
     ```

     If the user can't name one, surface the Pillar challenge from the rules: either reshape the epic, or make the case for a new pillar. Do NOT proceed without a pillar.
   - Optionally: priority, related goals, timeline-start, timeline-end.

5. **Assign the ID.** `EPIC-<prefix>-<NNN>`, zero-padded to three digits.

   ⚠️ **Epic numbers are shared with the PO vault**, which is the global registry — a number picked here without checking will collide the moment the epic is synced. Take the highest number in **both** places and add one:

   ```bash
   { grep -rho 'id: EPIC-[A-Z][A-Z]-[0-9]\{3\}' . --include='*.md' 2>/dev/null; \
     grep -rho 'id: EPIC-[A-Z][A-Z]-[0-9]\{3\}' \
       /Users/angelica.fernando/product-owners/Requirements/AllRequirements/ 2>/dev/null; } \
     | grep -o '[0-9]\{3\}$' | sort -n | tail -1
   ```

   If the PO vault isn't on this machine the second grep returns nothing and the scan is repo-local only — **say so in the final report**, because the ID is then provisional and must be re-checked before ADO sync. Start at `001` if nothing exists anywhere.

6. **Read `currentDate` from the system-reminder** for the `created` field. Do not guess or use a remembered date.

7. **Derive the slug** from the title: lowercase, kebab-case (e.g. `My Epic Title` → `my-epic-title`). The filename is `<id>-<slug>.md`.

8. **Draft the file** using the template. Fill in:
   - `id` and matching filename (`<id>-<slug>.md`)
   - `title`, `author` (full name of the creating contributor), `status: draft`, `priority`
   - `pillar` as wikilink array: `["[[PILLAR-<slug>|<Pillar title>]]"]`
   - `related-goals` if provided, otherwise `[]`
   - `related-features: []`
   - `ado-id`, `ado-title`, `ado-link` left empty (set after ADO sync)
   - `timeline-start` and `timeline-end` if provided, otherwise empty
   - `tags: [epic]`
   - `created` from `currentDate`, `completed` empty
   - Body sections per the template:
     - `## Description` — what the user has provided, or a placeholder
     - `## Success Metrics` — placeholder
     - `## Pillar Alignment` — one line per pillar describing the connection
     - `## Linked stories` — a plain list, kept current by hand. There is no Dataview index in this repo, so do not paste a dataview block here.
     - `## History` — empty comment

9. **Create the `epic-definitions/` folder only if it does not exist yet**, then write the file into it. Create only the one folder for this prototype — never pre-create them for the other prototypes. If the folder is new, add the short `README.md` described in § Where the file goes, so the next person knows what it is for.

10. **Report what was created** — id, path, prototype, pillar, status, and whether the ID was checked against the PO vault or only locally. Remind the user the epic starts in `draft` and needs to move through `refining → ready` before stories hang off it.

## Optional: create it in Azure DevOps

Only if the user asks. Assemble the payload from [`.claude/references/ado-fields.md`](../../references/ado-fields.md) § Epic — do not re-list fields here — and **show the full payload and wait for explicit confirmation** before calling `mcp__azure-devops__wit_work_item_write` with `action: "create"`. `priority` is local-only and is not sent; ADO defaults `Priority` to `2`. Afterwards write the returned ADO id, title and URL back into the local file and set `status: synced`.

## Do not

- Do not commit the file. The user reviews and commits.
- Do not write a pillar field with a placeholder if the user couldn't name one — stop and discuss instead.
- Do not add an `owner` field — it is not in the epic template.
- Do not invent an `ado-id`.
- Do not write the file into the PO vault. If the epic belongs in the shared vault rather than here, say so and point at `/create-epic` in `/Users/angelica.fernando/product-owners` instead of writing across repos.
- Do not put a Dataview query in the file — this repo has no Dataview.
