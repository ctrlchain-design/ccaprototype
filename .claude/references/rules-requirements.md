# Requirements rules

Shared rules for epics, features, user stories, and bugs in this vault. The skills in `.claude/skills/create-*` enforce these on creation; this file is the source of truth when reviewing or refining existing entities.

## Status flow

All requirement entities (epic, feature, user story, bug) follow the same flow:

```
draft → refining → ready → synced → archived
```

- **draft** — captured but not yet shaped. May be missing fields, scope, or acceptance criteria.
- **refining** — actively being worked on by the PO and stakeholders. Open questions still being resolved.
- **ready** — fully specified, validated, ready to be created in ADO.
- **synced** — created in ADO and handed off. `ado-id` is set. The vault entry is the historical record; ADO owns execution from here.
- **archived** — abandoned or superseded. **Never delete files** — archive instead.

Note: vault status tracks the **PO's drafting lifecycle**, not the execution lifecycle in ADO. Once an entity is `synced`, its progress (in-progress, done, etc.) is tracked in ADO.

## INVEST checks (user stories)

Every user story should pass the INVEST heuristic before moving to `ready`:

- **Independent** — can be built / shipped without depending on another in-flight story. If two stories must ship together, consider merging or re-splitting.
- **Negotiable** — captures intent, not a fixed contract. Acceptance criteria are firm; implementation is open.
- **Valuable** — there is a clear "so that <value>" — to a user, an internal team, or the business. If you can't name who benefits, the story isn't valuable.
- **Estimable** — engineers have enough information to size it. Unknowns surface as `## Notes` or spike stories, not hidden in the body.
- **Small** — fits comfortably inside one sprint. If it doesn't, split it.
- **Testable** — every acceptance criterion is observable (Given/When/Then). "Works well" is not testable.

If a story fails one or more INVEST checks, flag it explicitly in `## History` or `## Notes` and either fix it or keep it in `refining`.

## Writing the description

Applies to epics, features, user stories, and bugs.

**1. Lead with the capability, not the edge case it prevents.** The `so that` clause names a benefit to someone. It is not the place for a problem the story avoids — that is one consequence of the rule, and putting it up front makes the story look narrower than it is.

> ❌ *"…whether it is shared with all carrier groups or only ones I select, **so that a newly created carrier group does not inherit fleet it should not see**."*
> ✅ *"…which carrier groups it is available for, all of them or one or more specific ones, **so that every carrier group works with its own fleet**."*

The avoided problem still gets tested — as an acceptance-criteria scenario, not as the story's reason for existing.

**2. A rule that governs every scenario goes in the description as a scope line, not in its own scenario.** "Trailers behave the same as vehicles" as a scenario is tested once. As a line under the description it applies to all of them:

> *Applies the same way to vehicles and trailers, everywhere one is created or edited: the Fleet screen and the add flows inside the assign actions on a trip.*

This is usually what shortens a long acceptance-criteria list without losing a single check.

**3. Context belongs in the description. Requirements belong in the acceptance criteria.** The scope line in point 2 is the *only* extra sentence that earns a place beside the `As a / I want / so that`. Everything a tester could pass or fail goes in a scenario.

**The test: could someone check this and say yes or no?** If yes, it is a requirement — move it.

> ❌ In the description: *"A person is offered when they hold at least one of the roles below. Internal: Sales, Customer Success, Finance…"*
> ✅ In the description: *"Today the list offers everyone who belongs to any group with access to the conversation."*
> ✅ In a scenario: the roles themselves, and the at-least-one rule.

These always belong in the criteria, never the description:
- any list of allowed or excluded values — roles, statuses, types, group kinds
- any rule about what the system does or does not do
- anything phrased as **only**, **never**, **always**, **at least one**, or **from the moment it is released**

Beyond the one-sentence story, a description may carry exactly two things: **what the situation is today**, so the reader knows what is changing, and a **scope line saying where the rule applies**. Both are orientation. Neither is a check.

> Failure this prevents (2026-08-11, ADO #45835): the entire allowed-role list and the multi-role rule were written as description prose, leaving a scenario that tested "the allowed list" without ever saying what was on it. A tester reading only the criteria could not have run it. A long list feels like context because it is long — it is still a requirement.

**4. Everything else goes in a comment, not the description.** Rule 3 says what to take *out*; this says where it goes. Rationale, history, who asked for it, alternatives rejected, why the approach was chosen, consequences for other teams — all of it is real and worth keeping, and none of it belongs in the description. It goes in an **ADO comment** (and `## Notes` in the vault twin), so the description stays the thing you can read in ten seconds before starting work.

**The ceiling: the `As a / I want / so that` sentence plus at most one short paragraph.** If the description has three paragraphs, or a bullet list, or a table, it is already wrong — stop and move the surplus to a comment before writing anything else.

Label the comments so a reader can pick the one they need, and **keep at most one topic per comment**:

| Comment | Holds |
|---|---|
| `📋 Refinement context` / `📋 Background` | why the story exists, what was decided and by whom, alternatives rejected, deliberate consequences, estimate reasoning |
| `🔧 Technical note` | what was checked on (branch, clone date, confidence), where it sits, the diagnosis and direction in plain words — kept separate so the story body stays plain-language for testers. See § Writing a technical note. |
| `📊 … at a glance` | an optional summary table restating criteria for convenience. **Must say the criteria are the source of truth**, or it becomes a second, drifting spec |

> Failure this prevents (2026-08-13, ADO #45878): the description of a permissions story was written as five paragraphs of rationale plus the full role matrix. The matrix also duplicated the acceptance criteria, so the story shipped with two copies of its own rule and a reader had no way to know which one was authoritative. **A table in a description is the clearest single symptom of this mistake** — a table is either a list of allowed values (criteria) or a convenience restatement (comment), and it is never orientation.

## Writing a technical note

Governs the `🔧 Technical note` comment (see the table above), on both user stories and bugs. Settled with Samruddhi Patel and the Green Diamonds team, 2026-08-19, after feedback that #46124's note went too deep to be useful for refinement and pokering.

**Fixed structure — same order every time, same icon on the same section every time, so a dev recognises the shape before reading a word.** Settled with Samruddhi Patel, 2026-08-19:

- A `<hr>` divider between the plain-language recap and the technical note, so the two zones are visually obvious, not just labelled.
- `🔧 **Technical note**` as the block's own heading.
- Each part below is `<icon> **Label:**` (colon, not period — matches bold-label style everywhere else in the vault).

1. 🕐 **Checked on:** — one line, always first: which version of the code this is based on (branch, clone date) and how much to trust it (confidence — never `high`, since the code was read, not executed).
2. 📍 **Where it sits:** — the component(s)/file(s)/method(s) involved.
3. 💡 **What's happening:** — the diagnosis, in plain words.
4. ➡️ **Direction:** — what needs to change, also in plain words.
5. ⚠️ **Open question:** *(optional)* — anything that could change the size of the work, e.g. one guard/component reused at entry points that don't behave identically.
6. 🚫 **Out of scope:** *(optional)* — bullets, one item each.

These six icons are fixed and never reused for anything else in a technical note — that's what makes them recognisable at a skim instead of decorative. Settled with Samruddhi Patel, 2026-08-19 (icons/divider, then "Checked on" replacing "Provenance" after she flagged the word as jargon).

🔴 **"Provenance" is a banned word — never use it in a technical note, a comment, a description, or anywhere else a developer or stakeholder reads.** The label is **`🕐 Checked on:`**. This has now gone wrong twice: flagged by Samruddhi on 2026-08-19, and written again on #45332 on 2026-08-24 by a session working from a remembered version of this structure instead of reading this section. **Write the note from this section, every time — never from memory.** The same test applies to any label you are tempted to invent: if it is not a word someone would say out loud in standup, it does not go in a heading. This is a non-native-speaking team.

**The depth rule:** *"This method currently does X. It needs to also do Y."*

- ✅ Name the file and method — that identifies exactly where to look.
- ✅ Describe the current behaviour and the needed behaviour, in plain words.
- ❌ Variable names, code snippets, or a walk-through of the logic.
- ❌ **A precedent or existing implementation to copy.** Its calling context can differ from where the fix actually lands (a component event handler is not a route guard, for instance) and citing one invites copying the wrong shape. Plain words about what needs to change sidesteps that risk entirely — this was the specific mistake #46124 made.

**The test:** a reader gets a decent idea of how much work this is from the note alone, without opening the codebase to verify it.

**Content differs by what's being diagnosed:**

- **Bugs, and stories that are mostly a technical fix** — the component(s)/file(s)/method(s) involved, the diagnosis, and the direction.
- **Regular user stories** — the component(s) involved, what the frontend currently gets from the backend versus what it would additionally need, and whether an existing shared component can be reused.

## Writing acceptance criteria

Applies to user stories and bugs. The `Scenario:` + Given/When/Then **format** is mandatory (see the skills); this section is about deciding **what a scenario should be**.

**Group by user flow, not by rule.** Adding, editing, adding-from-somewhere-else. One scenario per flow, with several `And` bullets inside it, beats one scenario per rule scattered across flows. This is the single biggest lever on a long list.

**The repetition test — the fastest way to cut a list.** If two scenarios differ only in *where you stand to look* (the database, the screen, one customer shape), they are **one** scenario. If they differ in *what the system does*, keep both.

> A migration story had four scenarios: "everything is set to all", "no individual selections exist", "nothing changes for users", "single-group enterprise is set to all". The first, second and fourth are one fact seen from three angles. Two scenarios survived: the data landed right, and nothing changed for users.

**Don't write a scenario for a case that is derivable from other rules.** If a migration sets everything to "all" and the choice is hidden for single-group customers, then "a single-group customer sees everything" tests nothing new. Worse, a scenario per customer shape *invites* the bug: it suggests per-customer branching in a migration that must have none. Put the reasoning in `## Notes` so nobody re-adds it at the next refinement.

**Prefer a negative scenario over a tautological one.** "A driver from another carrier group cannot be picked" tests the point of the story. "A single-group customer sees every driver" does not.

**Combine and split deliberately:**
- **Combine** when it is one rule applied to two objects or two levels — same Then, so one scenario with a broader Given.
- **Split** when one scenario carries two opposite outcomes. Two short scenarios read as a pair; one scenario with a "…and the other one doesn't" tail does not.
- Rule of thumb: **one outcome per scenario**, but several `And` bullets are fine within a single user flow.

**Soft ceiling of about six scenarios.** Past that, assume restatement and go looking before adding more.

**⚠️ Write Givens against data, not the user's position.** This is the one that changes the code.

> ❌ *"Given I am assigning a vehicle to a trip **within carrier group X**"*
> ❌ *"…show only resources available for **the carrier group I am working in**"*
> ✅ *"Given a trip **that is assigned to** carrier group X"*

The rejected phrasings describe where the *user* is standing, which invites filtering by the logged-in user's group. The accepted one points at a field on the record, which is what the query can actually filter on. Same sentence length, completely different implementation.

**If a setting has modes, say what happens for every mode.** A story that consumes a setting must cover each of its values, not just the restrictive one. A scoping story listed the resources explicitly selected for a group and silently omitted the ones set to "available for all" — which after migration is the *majority* of production data.

**Define what "all" means.** For any "all of a set that grows", state whether it is a stored mode or an enumerated list, and what happens to members created later. "All" implemented as "every current member ticked" silently misses everything added afterwards, and the resulting bug looks like correct behaviour.

## Refining an existing requirement

Reworking a `synced` item is not the same as writing a new one. The rules above apply to the content; these apply to the blast radius.

> **When the rework comes out of a meeting, use [`/refinement`](../skills/refinement/SKILL.md).** It runs these rules as a flow — separate what was decided from what was floated, sweep by concept for every affected item, apply to the vault and ADO, and close with the [Definition of Ready](definition-of-ready.md) check. This section stays the source for *what* the rules are; the skill is *how* to execute them across a whole family at once.

**Sweep the family before you finish.** A scope or wording decision rarely lives in one file. Grep the whole family — parent epic, parent feature, sibling stories — for the phrase you just changed, not just for IDs.

> "Order level is out of scope" touched four files: the story, its feature, its epic, and a sibling story. Two were found by reading, two only by grepping.

**Check the ADO children.** Vault files know nothing about ADO child tasks, so a renamed story leaves its tasks describing the old design — which is worse than a vague title, because a developer reads it as current. `/sync-ado` covers this on the ADO side.

**Record why a scenario was dropped**, in `## Notes`. A deleted scenario with no note gets re-added by whoever misses the reasoning next refinement.

**Re-flag the estimate** whenever scope changes in either direction, and note it in `## Notes` for the next refinement rather than silently editing story points.

**Tell the assignee** when an item already in an ADO dev-ready state changes shape. They may have read the old version.

## Pillar challenge

**Every epic must reference at least one pillar.** Pillars are in `Goals/Pillars/`.

If an epic doesn't fit any existing pillar, that is a signal — not a reason to skip the field. Push back on scope, talk to the other POs, and either:

1. Reshape the epic so it fits an existing pillar, or
2. Make the case for a new pillar (rare — pillars are long-term).

Skipping the pillar link silently is not an option. The `create-epic` skill will refuse to write an epic without a pillar.

## Validation rules

| Rule | Applies to | Enforcement |
|---|---|---|
| Every epic has a `pillar` | epics | Required field. No silent override — see Pillar challenge above. |
| `parent-epic` mirrors ADO | features | Leave `[]` if no parent exists in ADO. No override note required. |
| `parent-feature` mirrors ADO | user stories, bugs | Leave `[]` if no parent exists in ADO. No override note required. |
| `id` matches filename | all | Filename = `<id>.md`. |
| `author` is set on creation, never changed | all | Edits by other POs go in `## History`. |
| ID prefix matches creating contributor | all | Use the contributor's prefix from CLAUDE.md (AF / BO / EP / LF / NS / RN / TT) — tags the author only. A stand-in covering someone else's team still uses **their own** prefix. |
| ID number is globally unique per entity type | all | `.claude/scripts/vault-query.py next-id <TYPE> --prefix <initials>` scans **all** prefixes in one call. (Fallback: grep `id: <TYPE>-` across all prefixes.) The number is shared across all contributors. See [`CLAUDE.md` § ID assignment](../../CLAUDE.md#id-assignment). |
| Wikilink targets resolve to a real file | all | `.claude/scripts/vault-query.py resolve <id>` prints the wikilink and **exits non-zero if the id is missing or claimed twice** — so a broken link fails before it is written, rather than after. Applies to `parent-epic`, `parent-feature`, and every `related-*` field. |

## Body sections

Body sections mirror Azure DevOps fields so content can be copied directly into ADO. Vault-only sections (Pillar Alignment, Linked features/stories, Notes, History) are appended after ADO fields.

| Section | Epic | Feature | User Story | Bug | ADO field? |
|---|---|---|---|---|---|
| `## Description` | ✓ | ✓ | ✓ | ✓ | Yes |
| `## Success Metrics` | ✓ | ✓ | | | Yes |
| `## Acceptance Criteria` | | | ✓ | ✓ | Yes |
| `## Repro Steps` | | | | ✓ | Yes |
| `## Actual Result` | | | | ✓ | Yes |
| `## Pillar Alignment` | ✓ | ✓ | | | Vault only |
| `## Linked features/stories` | ✓ | ✓ | | | Vault only (Dataview) |
| `## Notes` | | | ✓ | ✓ | Vault only |
| `## History` | ✓ | ✓ | ✓ | ✓ | Vault only |

## ADO sync

- ADO is the source of truth for **features** and **user stories** once they reach `synced`. Epics may also live in ADO depending on team practice.
- The vault entity is created first (drafting and refinement happen here). The ADO work item is created after.
- The `ado-id` field is set on the vault file **after** the ADO work item exists, and status is updated to `synced`.
- ADO writes happen through a contributor whose own PAT has work-item write. **Check the PAT-scope table in `## Azure DevOps integration` in the root [`CLAUDE.md`](../../CLAUDE.md) rather than assuming a name** — who holds write access changes, and this line has already gone stale once. As of 2026-08-17: Tomas, Nuno and Liam have it; Brian's and Angelica's setup has not been checked.
- Contributors without write access should draft and refine in the vault, then hand off for the ADO sync.

## Cross-reference hygiene

When renaming or renumbering an entity, grep the entire vault for the old ID/slug and update all references **before** committing. Stale wikilinks silently break dataview tables and create confusion later.

**This applies to scope and wording changes too, not just IDs.** A decision like "order level is out of scope" or a reworded key phrase lives in the parent epic, the parent feature, and sibling stories as prose — where no wikilink breaks to warn you. Grep for the **phrase**, not the ID, and check the ADO children as well. See [Refining an existing requirement](#refining-an-existing-requirement).
