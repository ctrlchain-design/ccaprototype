---
name: create-user-story
description: Create a new user story in the CtrlChain prototypes repo, following the rules in .claude/references/rules-requirements.md and the user story template, with INVEST checks before writing. Writes into the epic-definitions folder of the prototype it belongs to.
---

# Create user story

Create a new user story file inside this repo, following the requirement conventions carried over from the PO vault.

## Where the file goes

Every prototype owns its requirements. The file goes in:

```
<prototype>/epic-definitions/<id>-<slug>.md
```

`<prototype>` is the top-level prototype folder — `rate-configuration/`, `taskboard-redesign/`, `orders-pinned-filters/`, and so on. Where a top-level folder groups several screens in subfolders (as `legal/` groups `admin/`, `admin-document/`, `privacy/` and `terms/`), the `epic-definitions/` folder sits at the **top level** — one set of definitions for the prototype, not one per screen. `_shared/` and `design-system/` are repo infrastructure, not prototypes; nothing is ever written into them.

**The folder is created on demand, never in advance.** Only the `epic-definitions/` folder for the prototype you are writing to gets created, and only at the moment the first file goes into it — do not pre-create empty ones for the other prototypes. A brand-new folder gets a one-paragraph `README.md` alongside that first file, saying it holds the epic and user-story definitions for that prototype, that they follow the PO vault's requirement conventions, and that ADO is the source of truth once synced.

**The story lives with the epic it hangs off.** Do not write it to the repo root, and do not write it back into the PO vault — this skill is the local copy on purpose.

## Preflight (run first, every time)

1. **Pull the latest changes** before proceeding:

   ```bash
   git pull --ff-only
   ```

   Report what was pulled (or "Already up to date."), then continue. This prevents ID collisions with work already committed.

2. **Check the branch.** This repo's rule is *never work on `main`* — committing there merges and publishes to GitHub Pages. Epic definitions are documentation rather than a published page, but the rule still holds: if `git branch --show-current` says `main`, tell the user and let them branch (named after the prototype) before you write. Do not create the branch yourself.

## Steps

1. **Read the template and rules first.** Open `.claude/templates/requirement-user-story.md` and `.claude/references/rules-requirements.md` before doing anything else. Pay particular attention to **INVEST**, **Writing the description**, and **Writing acceptance criteria** — the last two decide the *content* of what you write here, and the skill does not repeat them.

   Also open [`.claude/references/definition-of-ready.md`](../../references/definition-of-ready.md). It is the list of what has to be true before a story can go into a sprint. Do not keep a separate idea of "ready" in this skill. 🔴 Its rule that **no skill may set a status to `Ready for dev` on its own** applies here too — a newly written story is proposed as ready, never marked ready.

2. **Identify the creating contributor.** Determine who is invoking this — ask if you are not sure. Prefixes are the same ones the PO vault uses, because a story drafted here may end up in ADO alongside the vault's:
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
   - **Parent epic** — required. Must be an existing `EPIC-*` definition in the same `epic-definitions/` folder. If there isn't one yet, stop and run `/create-epic` first.
   - **Story body** in `As a / I want / So that` form. Before drafting the "As a …" persona, ask the user which user group is targeted and whether a specific role applies:
     - **Internal user** — roles:
       - *Tender Ops* — create lane tenders from a lane request
       - *Legal Team* — create Terms and Conditions / Terms of Use, read user acceptance on documents
       - *Exception Manager* — read event logs, accept transport orders on behalf of carrier, deactivate/activate carrier groups, accept offers on behalf of customer, delete lanes/enterprises/users, change lane request owners
       - *Analyst* — obtain exports, read orders, requests, dashboards, and groups
       - *Internal Group Manager* — manage roles of users within the same group
       - *Translator* — manage release notes, update UI texts via translation menu
       - *Carrier Management* — reoffer quotations to shipper, create and manage carrier tenders
       - *CtrlChain Manager* — full read-only visibility across the platform; no create, update, or delete
       - *Customer Success* — view and manage orders
       - *Sales* — create shipper prospect groups, manage address books
       - *Admin* — (no description provided)
       - *Finance* — access invoicing functions
     - **Carrier user** — roles:
       - *Driver* — app login and assignment as a driver to an order
       - *Transport Planner* — create vehicles in the fleet, order visibility, trip planner functionality
       - *Transport Manager* — view transport orders, update transport steps, manage fleet and drivers
       - *Group Manager* — manage roles of users within the same group
       - *Bidder* — receive tender opportunities for bidding
       - *Enterprise Manager* — manage users across all groups of an organization (also available for internal users)
       - *Guest* — no permissions, cannot perform any actions
     - **Shipper user** — roles:
       - *Operator* — access inbound and outbound shipment data from locations associated with the related group
       - *Booker* — make and view bookings
       - *Shipper Manager* — book and view shipments for entire group, manage users
       - *Group Manager* — manage roles of users within the same group
       - *Shipper Viewer* — overview all order details (read-only)
       - *Enterprise Manager* — manage users across all groups of an organization (also available for internal users)
       - *Guest* — no permissions, cannot perform any actions

     Use group-level ("As a carrier user") when the functionality applies to all or most roles in that group. Use a specific role ("As a Transport Planner") only when the functionality is targeted at one or a small subset of roles. If unsure, ask.

     **⚠️ This list drifts — verify against the code when a story hinges on a specific role.** The role names above are curated PO language; the system's actual roles live in the code, and they have already diverged. The authoritative sources are in the PO vault's local clones, which are **not** in this repo:
     - **Internal roles** — `/Users/angelica.fernando/product-owners/Code/UserManagement/Libraries/UserManagement.Types/InternalRoleType.cs` (an int enum)
     - **Carrier / shipper roles** — `/Users/angelica.fernando/product-owners/Code/UserManagement/Libraries/UserManagement.Invokes/UserManagementConstants.cs` (GUID constants, e.g. `TransportPlannerId`, `BookerRoleId`)

     If that `Code/` folder is absent, the clones haven't been set up — run `/sync-code` from the PO vault, or **say plainly in the report that the role names were not verified against code**.

     **Internal roles verified complete 2026-08-04** against `RolesInternalSeed.cs` — the seed that actually creates the roles, which is more authoritative than the enum. All 12 internal roles above match the 12 seeded roles exactly, by name.
     - ✅ The list previously said *Marketing*, which is not a role. The seed creates **Translator**, doing exactly what this list described. Renamed.
     - ✅ `InternalRoleType` also contains `Manager` (7), but **no role is ever seeded with it** — it's an unused enum value, not something a user can hold. Correctly absent from this list; don't "helpfully" add it.
     - ℹ️ Shipper **Operator** appears in code as `SiteOperatorRoleId` — same role, different name.

     **Re-verify with:**

     ```bash
     grep -n 'Name = \|InternalRoleType = ' \
       /Users/angelica.fernando/product-owners/Code/UserManagement/Data/DataSeed/RolesSeed/RolesInternalSeed.cs
     ```

     If a story's behaviour depends on the exact role, read the code first. The *descriptions* here (what each role can do) are **not** in the code, so this list stays the source of truth for meaning — just not for names.
   - **Acceptance Criteria** — one or more scenarios, each with a descriptive title. Format **must** be:
     ```
     Scenario: <descriptive title>
     Given <precondition>,
     When <action>,
     Then <outcome>.
     ```
     Never write Given/When/Then without a `Scenario:` title line. Multiple scenarios are allowed.

     **Before writing them, apply § Writing acceptance criteria from the rules.** The format above is the easy half; the content is where stories go wrong. The four checks that catch the most:
     - **Group by user flow** (adding / editing / adding-from-elsewhere), not one scenario per rule.
     - **The repetition test** — two scenarios that differ only in where you stand to look are one scenario.
     - **Givens against data, not the user's position** — "a trip that is assigned to carrier group X", never "a trip within carrier group X".
     - **If a setting has modes, cover every mode**, not just the restrictive one.

     More than about six scenarios means you are almost certainly restating something. Say so and propose the merge rather than writing them all out.
   - Optionally: priority.
   - Optionally: **Tags** — suggest relevant tags based on context (e.g. `Poland`). Confirm with user.

5. **Validate the parent epic exists.** Grep the target `epic-definitions/` folder for `id: <epic-id>`. If not found, stop and surface the gap — create the epic first via `/create-epic`, or capture an explicit override note for `## History`.

6. **Run INVEST checks before writing.** For each of the six, give a one-line verdict (pass / fail / unclear) based on the title, story, and criteria the user provided:
   - **Independent** — does shipping this depend on another story being delivered first?
   - **Negotiable** — does the body lock in an implementation, or describe intent?
   - **Valuable** — is the "so that" clause concrete? Who benefits?
   - **Estimable** — could an engineer size this from what's written? Are unknowns surfaced as Notes rather than hidden?
   - **Small** — does this fit in a single sprint? If unsure, ask.
   - **Testable** — is every acceptance criterion observable (Given/When/Then)?

   **Optional but useful for Estimable and Small: check the code.** The ChainCargo clones are not in this repo, but if the PO vault's `Code/` exists a quick grep shows how many services the story actually touches — the real driver of size, and something the story text usually hides. One service is probably Small; a field that appears in five is probably not.

   ```bash
   grep -rl "ShipmentReference" /Users/angelica.fernando/product-owners/Code/ --include='*.cs' \
     | sed 's|.*/product-owners/Code/||' | cut -d/ -f1 | sort -u
   ```
   (Quote the `--include` pattern — unquoted, zsh expands it and grep fails.) If `Code/` is absent, skip this and say the size verdict was made without a code check.

   Also worth checking: **does this already exist?** A story that's half-built changes the estimate completely. Keep this to a couple of commands — it informs the verdict, it isn't a design review.

   **And: has someone already written this story?** Two places can hold a duplicate: the other `epic-definitions/` folders in this repo, and the ~300 requirement files in the PO vault. No two authors phrase the same capability the same way, so a keyword search reliably misses it. If `semtools` is installed, search by meaning before writing:

   ```bash
   semtools search "<the story's capability, in plain language>" \
     */epic-definitions/*.md \
     /Users/angelica.fernando/product-owners/Requirements/AllRequirements/*.md --top-k 5 -n 2
   ```

   A close hit is not automatically a duplicate — it may be the sibling this story should link to, or the one it overlaps and should be split against. Show the user what you found and let them decide. If `semtools` isn't installed, `Grep` a couple of likely phrasings and say that the check was keyword-only.

   **If the code check surfaces something worth a developer knowing, write it up as a technical note.** Where the behaviour lives today, what's missing, or what direction the story needs — follow [`.claude/references/rules-requirements.md`](../../references/rules-requirements.md) § Writing a technical note for the structure and the depth rule (file/method names are fine, "what's happening" and "direction" stay in plain words, never cite a precedent to copy). Not every story needs one — only write it when the investigation actually turned up something. It becomes part of step 10's `## Notes`, and optionally a labelled `🔧 Technical note` ADO comment (see below).

   **If any check fails or is unclear, flag it to the user.** Ask whether to fix the story before writing, or to proceed and capture the failure in `## Notes` so the story can stay in `refining` until resolved. Never silently write a story that fails INVEST.

7. **Assign the ID.** `US-<prefix>-<NNN>`, zero-padded to three digits.

   ⚠️ **Story numbers are shared with the PO vault**, which is the global registry — a number picked here without checking will collide the moment the story is synced. Take the highest number in **both** places and add one:

   ```bash
   { grep -rho 'id: US-[A-Z][A-Z]-[0-9]\{3\}' . --include='*.md' 2>/dev/null; \
     grep -rho 'id: US-[A-Z][A-Z]-[0-9]\{3\}' \
       /Users/angelica.fernando/product-owners/Requirements/AllRequirements/ 2>/dev/null; } \
     | grep -o '[0-9]\{3\}$' | sort -n | tail -1
   ```

   If the PO vault isn't on this machine the second grep returns nothing and the scan is repo-local only — **say so in the final report**, because the ID is then provisional and must be re-checked before ADO sync. Start at `001` if nothing exists anywhere.

8. **Read `currentDate` from the system-reminder** for the `created` field.

9. **Derive the slug** from the title: lowercase, kebab-case. The filename is `<id>-<slug>.md`.

10. **Resolve the parent epic's filename** — you need the full filename for the `parent-epic` wikilink:

    ```bash
    grep -rl 'id: <epic-id>' <the epic-definitions folder> | xargs -n1 basename | sed 's/\.md$//'
    ```

    If that returns nothing, or more than one file, stop — a broken wikilink should fail loudly rather than be written.

11. **Draft the file** using the template. Fill in:
    - `id` and matching filename (`<id>-<slug>.md`)
    - `title`, `author` (full name of the creating contributor), `status: draft` (or `refining` if INVEST flagged issues), `priority`
    - `parent-epic` as wikilink array using the epic's full filename: `["[[<epic-filename-without-ext>|<epic-id>]]"]`
    - `parent-feature` — the ADO feature id if the story's real ADO parent is a feature rather than the epic; otherwise leave empty
    - `ado-id`, `ado-title`, `ado-link` left empty (set after ADO sync)
    - `related-research: []`, `related-knowledge: []`
    - `tags: [user-story]`
    - `created` from `currentDate`, `completed` empty
    - Body sections per the template:
      - `## Description` — filled with `As a / I want / So that`
      - `## Acceptance Criteria` — filled with named scenarios in the format: bold `**Scenario: <title>**` header, followed by Given / When / Then / And as individual bullet points (matching the ADO format for easy copy-paste)
      - `## Notes` — include any INVEST failures and a copy of any technical note written in step 6; otherwise empty comment
      - `## History` — empty comment

12. **Create the `epic-definitions/` folder only if it does not exist yet**, then write the file into it. Create only the one folder for this prototype — never pre-create them for the other prototypes. If the folder is new, add the short `README.md` described in § Where the file goes.

13. **Add the story to its epic's `## Linked stories` list.** There is no Dataview here, so the link is maintained by hand — append `- [[<id>-<slug>]] — <title>` to the parent epic file.

---

### Optional: Create in Azure DevOps

If the user wants the story created directly in ADO (ADO-only or alongside the local file), ask upfront. If ADO-only, the local file steps (7–13) may be skipped.

**Assemble the payload from [`.claude/references/ado-fields.md`](../../references/ado-fields.md) — do not re-list fields here.** That hub is the single source of truth and prevents drift. Specifically:

- **§ User Story** — the field map (`System.Title`, `System.WorkItemType` = `User Story`, `System.State` = `New`, `System.AreaPath` (**ask — never default**), `System.IterationPath`, **`Microsoft.VSTS.Common.ValueArea` = `Business` (required, easy to miss)**, `System.Description`, `Microsoft.VSTS.Common.AcceptanceCriteria`, `System.Tags`).
- **§ Vault file → ADO field mapping** — how the `## Description`, `## Acceptance Criteria`, and `tags` you collected map across (strip the leading `user-story` tag). Note: `priority` is **local-only and not synced** — don't send `Priority`; ADO defaults it to `2`. Story Points are set by the team, not at creation.
- **§ Acceptance-criteria HTML format** — the mandatory `<b>Scenario: …</b>` + `<ul><li>` structure for each scenario, and the single-sentence `<p><strong>As a</strong> …</p>` Description shape.

**Show the full payload and wait for explicit confirmation before calling `mcp__azure-devops__wit_work_item_write` with `action: "create"`.**

**Set the parent — as a relation link, NEVER a field on create.** ⚠️ `System.Parent` in the `wit_work_item_write` · `create` fields array is **silently ignored** — ADO returns the item with no error but leaves it orphaned. So this is always two steps:
1. Create the story.
2. Link it to the parent's numeric ADO ID: `wit_work_item_link_write(action="link", project="ChainCargo", updates=[{"id": STORY_ID, "linkToId": PARENT_ADO_ID, "type": "parent"}])`.
3. **Verify** the response shows a `relations` entry with `rel: System.LinkTypes.Hierarchy-Reverse` (and/or the flattened `System.Parent`). Do not report success until confirmed.

See `ado-fields.md` § Linking the hierarchy for the full rationale and the REST fallback. (Resolve the parent's ADO ID from the epic file's `ado-id`, or ask if it only exists in ADO.)

**Set the StackRank — a third mandatory step, and the one nobody remembers.** ⚠️ `wit_work_item_write` · `create` leaves `Microsoft.VSTS.Common.StackRank` empty, and ADO sorts every rank-less item to the **bottom of the backlog, below the bugs**, however correct its parent link is. Read the sibling stories under the same parent (`fields: ["System.Id", "System.Title", "Microsoft.VSTS.Common.StackRank"]`), then:
- Sitting next to related work → use the **midpoint** between the neighbour above and the neighbour below (spacing is typically 250, so there is room).
- Fresh with no natural neighbour → highest active user story StackRank **+ 100**, which puts it below the stories but above the bugs.

Patch it with `{"op": "add", "path": "/fields/Microsoft.VSTS.Common.StackRank", "value": "<number>"}` and verify it came back populated. Full rule: `ado-work-item-states.md` § Backlog ordering.

After creation, record the returned ADO ID, title, and URL, and write them into the local file (`ado-id`, `ado-title`, `ado-link`) with `status: synced` if a file was also created.

**If a technical note was written in step 6, post it as a comment** once the story exists (and after the parent link). Use `wit_work_item_comment_write` · `add`. **Show the comment text and say what you posted regardless**, since not every story carries one. Follow the structure and depth rule in [`.claude/references/rules-requirements.md`](../../references/rules-requirements.md) § Writing a technical note: plain-language recap first, `Technical note` bold and cordoned off second, never interleaved.

---

14. **Report what was created** — id, path (or "ADO only"), ADO ID and URL (if created), prototype, parent epic, status, the INVEST verdict summary (one line per check), and whether the ID was checked against the PO vault or only locally.

## Do not

- Do not commit the file.
- Do not write a story without running and reporting INVEST checks.
- Do not write a story without a parent epic unless the user explicitly chooses the override path with a `## History` note.
- Do not add an `owner` field — it is not in the user story template.
- Do not invent an `ado-id`.
- Do not write the file into the PO vault. If the story belongs in the shared vault rather than here, say so and point at `/create-user-story` in `/Users/angelica.fernando/product-owners` instead of writing across repos.
- Do not write Given/When/Then without a `Scenario: <title>` line — in local files and in ADO acceptance criteria HTML.
- Do not write Given/When/Then as plain text or `<br>`-separated lines in ADO — every line must be a `<li>` inside a `<ul>`.
- Do not phrase a Given as where the **user** is standing ("within carrier group X", "the group I am working in"). Phrase it against data on the record ("a trip that is assigned to carrier group X") — the first invites filtering by the logged-in user instead of a field, so it changes what gets built.
- Do not put requirements in the description. Any list of allowed or excluded values, any rule about what the system does, and anything a tester could pass or fail belongs in the acceptance criteria. The description may carry the `As a / I want / so that`, what the situation is today, and a scope line saying where the rule applies — nothing else. See `rules-requirements.md` § Writing the description, point 3.
- Do not let rationale pile up in the description either. **The ceiling is the story sentence plus at most one short paragraph** — three paragraphs, a bullet list, or a table means it is already too long. Why the story exists, what was decided and by whom, alternatives rejected and consequences go in `## Notes` and in a labelled ADO comment (`📋 Refinement context`, `🔧 Technical note`, `📊 … at a glance`), never in the description. See `rules-requirements.md` § Writing the description, point 4.
- Do not make the `so that` clause a problem the story prevents. It names a benefit; the avoided problem becomes a scenario.
- Do not write one scenario per rule when the rules share a user flow, and do not restate the same behaviour from a second angle (the database, the screen, a different customer shape) as a new scenario.
- Do not write a scenario for a case that follows from rules already covered elsewhere — note in `## Notes` why it was left out instead.
- Do not write a technical note in code syntax or variable names, or cite a precedent/existing implementation as something to copy — plain words only, per `rules-requirements.md` § Writing a technical note.
