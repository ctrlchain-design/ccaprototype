# Definition of Ready

What has to be true before a user story or bug can be pulled into a sprint. One definition, checked from two places: [`/create-user-story`](../skills/create-user-story/SKILL.md) when an item is written, and [`/refinement`](../skills/refinement/SKILL.md) when a meeting changes one.

**Why it lives in its own file.** Both skills used to carry their own idea of "ready", which meant a story could pass one and fail the other. A single list is the only way the two agree.

**This is a checklist, not a gate a skill may close on its own.** See [The status flip is never automatic](#the-status-flip-is-never-automatic).

## The checklist

Applies to **user stories** and **bugs**. Features and epics are not sprint items and do not have a Definition of Ready.

| # | Check | Where it comes from |
|---|---|---|
| 1 | **ADO state is `Ready for dev`** — or the item is genuinely further along (`Active`, `Dev test ready`, …). Anything in `New` or `Refining` is not ready. | [`ado-work-item-states.md`](ado-work-item-states.md) |
| 2 | **Story points are set**, and the number reflects the item's *current* scope. An estimate that predates the last scope change is worse than no estimate, because it looks decided. | [`rules-requirements.md`](rules-requirements.md) § Refining an existing requirement |
| 3 | **The description is the `As a / I want / so that` sentence**, plus at most one short paragraph of orientation. A third paragraph, a bullet list, or **a table** means it is already wrong. | `rules-requirements.md` § Writing the description |
| 4 | **Acceptance criteria exist**, and every scenario starts with a `Scenario: <title>` line before its Given / When / Then. | `rules-requirements.md` § Writing acceptance criteria |
| 5 | **Every criterion is observable.** A tester reading only the criteria could run them without asking a question. "Works well" and "is user-friendly" fail. | INVEST — Testable |
| 6 | **Givens are written against data, not the user's position.** *"Given a trip that is assigned to carrier group X"*, never *"Given I am working in carrier group X"*. | `rules-requirements.md` — the one that changes the code |
| 7 | **A parent feature is linked** in ADO (`System.Parent`) and mirrored in the vault file's `parent-feature`. | `rules-requirements.md` § Validation rules |
| 8 | **StackRank is set**, so the item sits with its siblings rather than below the bugs. | `ado-work-item-states.md` § Backlog ordering |
| 9 | **No unresolved blocking question** on the item — no `⚠️ Raise at refinement`, no `TBD`, no scenario marked as a strawman. Open questions that do **not** block the build may stay, but they have to be marked as non-blocking. | this file |
| 10 | **Area path is set** to the team that will build it. | `ado-work-item-states.md` § Known team area paths |
| 11 | **The vault twin matches ADO** — same title, same criteria, `ado-id` set, `status: synced`. Drift in either direction means one of the two is lying. | `rules-requirements.md` § Cross-reference hygiene |
| 12 | **Bugs only:** `Repro Steps`, `Actual Result`, `Severity`, `Bug Found In` and `Raised By` are all filled in. | `ado-work-item-states.md` § Bug required fields |

## The status flip is never automatic

🔴 **No skill may set a story to `Ready for dev` on its own.** It proposes; the PO confirms.

The reason is that a refinement can legitimately leave a story **less** ready than it went in. New questions surface, scope grows, a design or a re-estimate turns out to be needed. That is a good outcome for a refinement and a bad outcome to paper over.

> **Failure this prevents (2026-08-14, ADO #45710).** The story came out of a meeting *bigger* than it went in — the driver migration had to start writing real per-group role grants instead of setting one flag. Its story points were untouched. Flipping it to `Ready for dev` on the strength of "we discussed it today" would have put a known-wrong estimate into a sprint, and it would have looked deliberate.

So the report always has three outcomes, not two:

| Verdict | Meaning |
|---|---|
| ✅ **Ready** | Every check passes. Propose the flip to `Ready for dev` if it is not there already. |
| ⚠️ **Refined but NOT ready, because X** | The item improved, and something still blocks it. Name the specific check that fails. Never propose the flip. |
| ➖ **Excluded** | Archived, removed, or otherwise out of this refinement. Not assessed. |

**"Refined but not ready" is a success, not a failure.** Report it plainly and without apology — it is the whole reason the check exists.

### ⚠️ But do not over-call it

**A stale note in a file is not evidence that a check fails.** It is evidence that nobody cleared the note.

> **Failure this prevents (2026-08-15).** Four stories were reported as "refined but not ready". Three of the four were wrong, all for the same reason: the file carried an old `⚠️ Re-estimate` or `⚠️ Raise at refinement` line, and that was read as a live blocker. In fact two of the estimates had been correct for weeks — the reasons that pushed them up had since been removed again — and the third was a release-ordering dependency that had never been a readiness question at all. The PO cleared all three in one line.

So before calling an item not ready:

- **Check whether the flag's *reason* still holds**, not just whether the flag is still there. "Re-estimate, the form is now a two-level control with a mode field" is dead the moment neither exists.
- **Separate a dependency from a gap.** "Cannot ship before X" is release ordering and belongs in the release note. It only blocks readiness if the story genuinely cannot be *built* or *tested* yet.
- **An open question blocks only if the build would stop on it.** If the criteria are complete and the question is about something downstream, say it as a note, not a verdict.
- **When it comes down to a judgement about scope or an estimate, ask rather than infer.** One line — *"#45310 and #45311 still carry a re-estimate flag from 23 July; does 5 and 3 still hold?"* — is faster than a wrong verdict and it is the PO's call, not the skill's.

The bar for ⚠️ is: **name the check, and say why it still fails today.** If that sentence cannot be written, the verdict is ✅.

## Reporting the check

Report as a table, one row per user story or bug the work touched, in **backlog order** (StackRank ascending), so it reads the way the PO sees the backlog rather than the order the tool happened to process things.

Columns: **ID** · **Title** · **State** · **Points** · **Verdict** · **What's missing**.

Rules for the report:
- **Exclude items archived or removed** during the same piece of work — they are listed once as excluded and not assessed.
- **Exclude features and epics.** They have no Definition of Ready.
- **Name the failing check, not a vague concern.** *"No story points"* beats *"needs more refinement"*.
- **One line per item.** If something needs a paragraph, it belongs in a comment on the item, not in this table.
- **Say the total plainly** at the end: how many are ready, how many are refined-but-not-ready, how many were excluded.

## Not part of this definition

Kept out on purpose, so the list stays checkable:

- **Design attached.** Many stories need one and some genuinely do not. Treat a missing design as a blocking open question (check 9) when the story cannot be built without it, rather than as a check of its own.
- **Test cases written.** They follow the criteria; requiring them here would invert the order.
- **Priority.** A vault-only PO triage field, not synced to ADO — see [`ado-fields.md`](ado-fields.md).
- **Assignee and iteration.** Those are sprint-planning decisions, made after an item is ready, not conditions of readiness.
