# ADO work item states

This file documents the actual Azure DevOps states for work items in the **ChainCargo** project. These are distinct from vault statuses (`draft → refining → ready → synced → archived`), which track the PO's drafting lifecycle only. ADO states track execution.

> For **field maps, the read cookbook, the acceptance-criteria HTML format, and hierarchy linking**, see the companion hub [`ado-fields.md`](ado-fields.md). This file owns states, severity, StackRank, area paths, and PO emails.

## Shared state set (Bug and User Story)

Both `Bug` and `User Story` work item types share the same state set in ChainCargo.

| State | ADO category | Progress rank (1 = most progressed) |
|---|---|---|
| Ready For Deployment | Resolved | 1 |
| Stage test ready | Resolved | 2 |
| Dev Test Pass | Resolved | 3 |
| Dev test ready | Resolved | 4 |
| Prev test pass | Resolved | 5 |
| Prev test ready | Resolved | 6 |
| Blocked | InProgress | 7 |
| Active | InProgress | 8 |
| Ready for dev | Proposed | 9 |
| Refining | Proposed | 10 |
| New | Proposed | 11 |
| Closed | Completed | excluded from active backlog |
| Removed | Removed | excluded from active backlog |

**Active items** = all states except `Closed` and `Removed`.

## Severity (Bugs)

Field: `Microsoft.VSTS.Common.Severity`

| ADO value | Label |
|---|---|
| `1 - Critical` | Critical |
| `2 - High` | High |
| `3 - Medium` | Medium |
| `4 - Low` | Low |

Lower number = higher severity. Used as the primary sort key when sequencing bugs in the backlog.

### Severity rules

| Severity | Meaning | Allowed for Bug Found In |
|---|---|---|
| `1 - Critical` | Application not usable / live users affected and costing money | `Production` only |
| `2 - High` | A feature or major functionality (e.g. booking, lane/user creation) is broken | Any |
| `3 - Medium` | Everything else, or broken major functionality that has a workaround | Any |
| `4 - Low` | UI issues that affect look and feel only | Any |

**Critical is only allowed when Bug Found In = `Production`.** If the user selects `1 - Critical` for a bug found in `Development`, `Staging`, or `Preview`, block the selection and ask them to choose `2 - High` or lower.

Bugs can be marked as release blockers regardless of severity — that is a separate field and is the BA's final call.

## Backlog ordering

Field: `Microsoft.VSTS.Common.StackRank`

- Lower StackRank number = higher position in the backlog (appears first).
- To move bugs below all user stories, assign them StackRank values starting just above (numerically higher than) the last user story's StackRank.
- Use increments of 10 between bugs to leave room for manual adjustments.

### 🧭 The feature backlog IS the story order

**A team's Features backlog already encodes the agreed epic → feature sequence, grouped by epic.** It is what the PO sees on their Features board. So the ordering of user stories is not something to invent:

```
wit_backlog(action: "list_work_items", team, backlogId: "Microsoft.FeatureCategory")
```

Walk that returned order, and emit each feature's children as a contiguous block. **Never re-derive the order from epic IDs, feature titles, or StackRank arithmetic** — those disagree with the board and produce an order the team doesn't recognise.

> Verified 2026-08-17 on Pathfinders: the order returned by the Features backlog matched the PO's Features board exactly, epic grouping included.

**Within a feature, sort by state progress** (the rank column above — Ready For Deployment = 1 … New = 11), most progressed on top, tie-broken by existing StackRank. Each feature then reads top-to-bottom as *done → in test → building → next*.

**Stories that can't be placed by feature** — no `System.Parent`, or a parent feature that isn't on this team's Features backlog — go in one group below all the feature groups. Surface that group to the PO; an unparented story is a data-quality problem, not something to absorb quietly.

**Bugs go below every story**, sorted by severity then progress (see `/sequence-backlog`).

### Clean renumbering ranges

When re-sequencing a whole backlog, renumber rather than patching gaps:

| Block | Range |
|---|---|
| User stories | `10000`, `+1000` per item |
| Bugs | `100000`, `+1000` per item |

The `1000` gaps leave room for manual drag-and-drop. The jump to `100000` keeps a visible gulf between the last story and the first bug, so a rank-less item or a stray drag stands out immediately. Ranks do **not** need to be unique across teams — each backlog view is filtered by area path.

Use `op: "Add"` (not `Replace`) when writing StackRank in a batch — `Add` works whether or not the field already has a value, and rank-less items are precisely the ones that need it.

### 🔴 Always set StackRank when creating an item

**`wit_work_item_write` · `create` does not assign a StackRank.** The field simply stays empty, and ADO sorts every rank-less item to the **very bottom of the backlog — below the bugs**, no matter what it is or which feature it belongs to. There is no error and the create looks completely successful; the item is just nowhere near its siblings, which is exactly where nobody scrolls.

**So a create is two steps, like the parent link: create, then position.** Never leave StackRank unset.

**How to pick the value:**

1. **Read the siblings first.** Batch-read the other children of the same parent feature (and the neighbouring features in the epic) with `fields: ["System.Id", "System.Title", "Microsoft.VSTS.Common.StackRank"]`. That gives you the real ordering, which is rarely the ID order.
2. **Place it where it belongs, using the midpoint.** Take the StackRank of the item it should sit *after* and the one it should sit *before*, and use the number halfway between. The gaps are wide on purpose — 250 is the usual spacing here, so there is almost always room.
   > Example: to slot a story between `1983745750` and `1983746000`, use `1983745875`.
3. **No natural neighbour?** Put it at the **bottom of the user stories but above the bugs**: take the highest StackRank among the active user stories and add ~100. Never leave it empty to achieve this — an empty rank goes below the bugs, not above them.
4. **Verify.** Re-read the item and confirm `Microsoft.VSTS.Common.StackRank` came back populated.

**While you are in there, check the siblings make sense.** Two failure modes show up repeatedly and both are invisible from the item itself:
- **Rank-less strays** — other items in the same family with no StackRank, all sitting at the bottom together.
- **Orphans** — an item whose rank is millions away from its siblings, usually a drag-and-drop accident. It reads as deliberately prioritised when it is not.

> Failure this prevents (2026-08-13, ADO #45878): a story created straight into ADO with a correct parent link landed at row 94 of the backlog, below every bug, because StackRank was never sent. The same sweep found #45873 and #45874 rank-less next to it, and #45275 sitting ~19.8 million below its own feature's siblings.

## Bug required fields (ChainCargo project)

When creating a `Bug` work item via the ADO API, these fields are required in addition to `System.Title` and `System.AreaPath`. Missing any of them causes a validation error.

| ADO field reference | Display name | Type | Notes |
|---|---|---|---|
| `System.State` | State | Picklist | Use `New` for newly created bugs |
| `System.Description` | Description | HTML | What is broken and the business/user impact |
| `Microsoft.VSTS.TCM.ReproSteps` | Repro Steps | HTML | Numbered steps to reproduce |
| `Custom.ActualResult` | Actual Result | HTML | The broken behaviour the user currently sees |
| `Microsoft.VSTS.Common.AcceptanceCriteria` | Acceptance Criteria | HTML | Given/When/Then for the correct behaviour |
| `Custom.RaisedBy` | Raised By | Identity | Pass the person's ADO email (e.g. `Tomas.Terhaag@ctrlchain.com`) |
| `Custom.BugFoundIn` | Bug Found In | Picklist | **Always ask the user — never default.** Allowed values: `Development`, `Staging`, `Preview`, `Production` |
| `Microsoft.VSTS.Common.Severity` | Severity | Picklist | `1 - Critical`, `2 - High`, `3 - Medium`, `4 - Low`. See severity rules below. |

### PO ADO emails

| PO | ADO email |
|---|---|
| Angelica (temporary, from 2026-08-17) | Angelica.Fernando@ctrlchain.com |
| Brian (temporary, from 2026-08-17) | brian.denouden@ctrlchain.com |
| Ellis | Ellis.Preetham@ctrlchain.com |
| Liam | Liam.Flynn@ctrlchain.com |
| Nuno | Nuno.Santos@ctrlchain.com |
| Rita (departed 2026-08-05) | Rita.Neves@ctrlchain.com |
| Tomas | Tomas.Terhaag@ctrlchain.com |

⚠️ **Brian's address does not follow the `Firstname.Lastname` pattern** — it is `brian.denouden@ctrlchain.com`, with the surname as one lowercase word. Do not "correct" it to `Brian.denOuden`. Confirmed by Tomas on 2026-08-17, along with Angelica's.

### Known team area paths

| Team | `System.AreaPath` value |
|---|---|
| Green Diamonds | `ChainCargo\GreenDiamonds` |
| Stakeholders | `ChainCargo\Stakeholders` |
| Sheepers | `ChainCargo\Sheepers` |
| Legends | `ChainCargo\Legends` |
| Pathfinders | `ChainCargo\Pathfinders` |

> Add more area paths here as they are discovered.

## Key distinction

| | Vault status | ADO state |
|---|---|---|
| **What it tracks** | PO drafting lifecycle | Engineering execution lifecycle |
| **Who updates it** | PO in Claude Code | Dev team in Azure DevOps |
| **Values** | draft → refining → ready → synced → archived | New → … → Ready For Deployment → Closed |
| **Used by** | Vault skills, create-* skills | sequence-backlog skill, sprint checkins, ADO queries |
