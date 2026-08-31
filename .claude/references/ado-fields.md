# ADO fields, reads & writes

The single hub for working with Azure DevOps work items — which fields each type uses, how to read items, how to create/update them, and how to link the hierarchy. Field maps below were pulled from the **live ChainCargo schema** (`wit_work_item` → `action: "get_type"`), not guessed.

> 🔧 **This reference targets `@azure-devops/mcp` v2.9.0**, pinned in every PO's MCP config. v2.x **consolidated the tool surface**: where v1.3.1 had ~70 verb-named tools (`wit_get_work_item`, `wit_create_work_item`, …), v2.x has 40 noun-named tools that take an `action` parameter (`wit_work_item` with `action: "get"`, `wit_work_item_write` with `action: "create"`, …).
>
> **If a tool name here returns "tool not found", you are on v1.x** — see [`ado-mcp-setup.md`](ado-mcp-setup.md) to migrate. Migrated 2026-08-17.

For **states, severity rules, StackRank ordering, area paths, and PO emails**, see the companion reference [`ado-work-item-states.md`](ado-work-item-states.md). This file does not duplicate them.

> **Vault status ≠ ADO state.** The vault `status` (`draft → refining → ready → synced → archived`) tracks the PO's drafting lifecycle. The ADO `System.State` tracks engineering execution. See the states reference for the distinction.

## Standing values

| Thing | Value |
|---|---|
| Organization | `chaincode-development` |
| Project | `ChainCargo` |
| Default team | `Green Diamonds` |
| Area paths | See [`ado-work-item-states.md`](ado-work-item-states.md) § Known team area paths — **always ask, never default** |
| PO ADO emails | See [`ado-work-item-states.md`](ado-work-item-states.md) § PO ADO emails |

**Access:** reads run freely for all contributors with ADO access.

**How to tell a read from a write in v2.x — by suffix, not by verb.** The old `*_get_*` / `*_list_*` / `*_search_*` naming is gone. Now:

| | |
|---|---|
| **Reads** (allowed) | The bare noun tools — `wit_work_item`, `wit_backlog`, `wit_query`, `repo_file`, `pipelines_build`, `testplan`, `wiki`, `work`, … |
| **Writes** (gated) | Anything ending **`_write`**, plus the two that don't follow it: **`repo_create_branch`** and **`wiki_upsert_page`** |

⚠️ **The suffix rule has one trap in each direction.** `pipelines_run` is a **read** (it gets/lists runs — it does *not* queue one; queuing is `pipelines_write`). `wit_work_item_attachment` is a **read** (it downloads). Neither name suggests it. Don't classify by intuition — the full list is in [`settings.json`](../settings.json).

**Writes are gated in [`.claude/settings.json`](../settings.json) under `permissions.ask`** and require explicit user confirmation of the full payload in the current turn. **The line is: gate what changes the work, not what annotates it.**

12 of the 13 write tools are gated: `wit_work_item_write`, `wit_work_item_link_write`, `repo_create_branch`, `repo_pull_request_write`, `repo_pull_request_thread_write`, `pipelines_write`, `testplan_test_case_write`, `testplan_test_plan_write`, `testplan_test_suite_write`, `wiki_upsert_page`, `work_capacity_write`, `work_iteration_write`. **The thirteenth, `wit_work_item_comment_write`, is deliberately allowed** — see below.

> ### 🟠 The comment exception, and what it now costs
>
> The 2026-08-15 agreement allowed **adding** a comment without a prompt (`wit_add_work_item_comment`) while still gating **editing** one (`wit_update_work_item_comment`) — because adding is additive and editing can overwrite someone else's words.
>
> **v2.9.0 merges both into one tool**, `wit_work_item_comment_write`, separated only by `action: "add" | "update"`. Claude Code permission rules match on **tool name, not arguments**, so the two can no longer be given different permissions. The choice is all-or-nothing.
>
> The migration first set it to **gated** (the safe half), which reversed the 2026-08-15 decision — a refinement posting thirty comments asked thirty times. **Tomas reviewed the trade-off on 2026-08-17 and chose to un-gate it**, restoring the original decision. It now sits in `permissions.allow`.
>
> ⚠️ **The accepted cost, and the convention that replaces the lost guardrail.** Comment *editing* is now unprompted too, so overwriting a colleague's words has no confirmation step and is easy to miss. **Never call `action: "update"` on a comment you did not write yourself — add a new comment instead.** The permission layer can no longer enforce this; only the convention protects it.

⚠️ **Allowed does not mean unannounced.** Say what you are commenting and on which item. And when a run posts many comments, show the plan first.

---

## Read cookbook

Which tool answers which question. All take `project: "ChainCargo"`.

| You want… | Tool + action | Notes |
|---|---|---|
| One item by ID | `wit_work_item` · `get` | `expand: "All"` to include relations (parent/children). `expand: "Relations"` for links only. ⚠️ `expand` cannot be combined with `fields`. |
| Several items by ID | `wit_work_item` · `get_batch` | Pass `ids: [...]`. Optionally restrict `fields`. |
| Find items by text | `search_workitem` | Keyword search across the project. Unchanged in v2. |
| **An ad-hoc WIQL query** | `wit_query` · `wiql` | 🆕 **New in v2** — v1.3.1 had no WIQL tool, so this used to need a `curl` fallback. Pass the query in `wiql`; `top` defaults to 50. ⚠️ An unbounded `SELECT` over ChainCargo exceeds ADO's 20,000-item limit and returns an **error payload, not an empty result** — always filter by type/team/date. |
| A team's current sprint items | `wit_work_item` · `list_for_iteration` | Pair with `work` · `list_team_iterations` to get the iteration id. |
| The backlog | `wit_backlog` · `list_work_items` / `list` | Pass `backlogId`: `Microsoft.RequirementCategory` (stories + bugs), `Microsoft.FeatureCategory` (features), `Microsoft.EpicCategory` (epics). **The order returned by the Features backlog is the team's agreed epic → feature sequence** — use it, don't re-derive it. See [`ado-work-item-states.md`](ado-work-item-states.md) § Backlog ordering. ⚠️ Returns `{id}` stubs only — follow with `wit_work_item` · `get_batch` for titles/states. |
| Items assigned to me | `wit_work_item` · `my` | `type: "assignedtome" \| "myactivity"`. |
| A saved query's results | `wit_query` · `get` + `get_results` | |
| Comments / revisions | `wit_work_item` · `list_comments` / `list_revisions` | |
| An attachment (e.g. a bug screenshot) | `wit_work_item_attachment` | Read-only download despite the name. `savePath` must be **relative**. |
| The field schema for a type | `wit_work_item` · `get_type` | Large output — query with `jq` for `.fields[].referenceName`. This is how the maps below were built. |

**Reading children/parent:** `wit_work_item` · `get` with `expand: "All"` returns a `relations` array. `System.LinkTypes.Hierarchy-Reverse` = parent; `System.LinkTypes.Hierarchy-Forward` = children. The parent ID is also flattened into the `System.Parent` field.

---

## Reading code, PRs & builds

> **Scope-gated.** These tools only work for a PO whose PAT carries the matching read scope (Code / Build / Test Management). See the per-PO scope table in [`CLAUDE.md`](../../CLAUDE.md) § Azure DevOps integration. As of 2026-06-19 only **Tomas's** token has these. All are read-only.

**Code & repositories** (PAT scope: Code → Read)

> ### 🟠 To *read* code, prefer the local clones — but ADO can now read a file too
>
> **⚠️ Corrected 2026-08-17.** This section used to state that *"the ADO MCP has no tool that returns a file's contents"*. That was true of v1.3.1. **v2.9.0 added `repo_file` · `get_content`**, which returns the text of a file at a given branch, tag, or commit. The absolute claim is retired.
>
> **`Code/` is still the default**, for reasons that survive the correction:
> - **Breadth per call.** One `grep` sweeps 67 repos; `repo_file` reads one path at a time and you must already know the path.
> - **History.** `git log -S`, `git blame`, "when did this change" have no ADO equivalent.
> - **Cost & latency.** Local reads are free and instant; every `repo_file` call is an API round-trip.
> - **It feeds `Graph/`.** The knowledge graph is built from the clones — no clones, no impact answers.
> - **Scope.** `repo_file` needs PAT scope **Code → Read**, which today only Tomas has.
>
> **Where `repo_file` genuinely wins:** you know the exact repo + path, you need **one** file, and you need it **at a specific branch/tag/commit** without switching your clone — or you don't have clones at all.
>
> | Job | Use |
> |---|---|
> | Sweep for a symbol across many repos | **local clones** (`grep`) |
> | Read a function, an enum, an entity class | **local clones** — or `repo_file` · `get_content` for a one-off |
> | The same file **at a specific tag/commit** | `repo_file` · `get_content` (`versionType: "Tag" \| "Commit"`) |
> | "When did this change" / `git log -S` / blame | **local clones** — no ADO equivalent |
> | Keyword sweep across **all 92 repos incl. ones not cloned** | `search_code` |
> | PRs, review discussions, builds, work-item links | **ADO tools below** |
>
> **Which branch matters.** The flow is `development → staging (-rc.N) → master (tagged release)`. 61 repos default to `development`, 27 to `master`. Read `master` for anything about production behaviour, `development` for what's being built now. Releases ship every few days, so a stale clone goes wrong fast — `/sync-code` before you rely on it, and state the branch and clone date in any finding. **`repo_file` sidesteps staleness entirely** (it reads live), which is its other real advantage — but state the branch you passed.
>
> **25 repos are deliberately not cloned** — 17 dead (no commit in 6+ months), 8 stubs (1–2 files). Several sit next to a live namesake: `WarehouseManagement` (Nov 2022) vs `WarehouseIntegration` (active), `CarrierOrderManagement` (Mar 2025) vs `OrderManagement`. Dated list with reasons: [`.claude/scripts/sync-code.sh`](../scripts/sync-code.sh). Never cite one of these.

| You want… | Tool + action | Notes |
|---|---|---|
| List repos in the project | `repo_repository` · `list` | 92 repos; only 67 are alive. |
| Resolve a repo by name/id | `repo_repository` · `get` | Needed for the `repositoryId` most other repo tools take. |
| Browse a repo's file tree | `repo_file` · `list_directory` | `recursive: true` + `recursionDepth` for deeper listings. |
| **Read a file's contents** | `repo_file` · `get_content` | 🆕 **New in v2.** Pass `version` + `versionType` (`Branch` / `Tag` / `Commit`) — `versionType` defaults to `Commit`, so **pass `"Branch"` explicitly** when giving a branch name. |
| Find code by text | `search_code` | Snippets only. Has a `branch` filter — use it. Best for cross-repo discovery, then read the hit. |
| Branches | `repo_branch` · `list` / `get` / `list_mine` | |
| Commit history / search | `repo_search_commits` | Unchanged in v2. Local `git log` is richer and free. |

**Pull requests** (PAT scope: Code → Read)

| You want… | Tool + action | Notes |
|---|---|---|
| List PRs in a repo/project | `repo_pull_request` · `list` | Filter by `status` (Active/Completed/Abandoned/All), `created_by_me`, `i_am_reviewer`. |
| One PR by ID | `repo_pull_request` · `get` | `includeChangedFiles` / `includeWorkItemRefs` / `includeLabels`. |
| PR review threads & comments | `repo_pull_request_thread` · `list` / `list_comments` | |
| PRs touching given commits | `repo_pull_request` · `list_by_commits` | |
| **PRs linked to a work item** | `wit_work_item` · `get` with `expand: "All"` | PR links appear in the `relations` array as `ArtifactLink` entries (artifact type `PullRequestId`). This is how you answer "which PR fixes US-/BUG-/task X". |

**Builds & deploys** (PAT scope: Build → Read)

| You want… | Tool + action | Notes |
|---|---|---|
| Recent builds | `pipelines_build` · `list` | Filters: `definitions`, `branchName`, `minTime`/`maxTime`, `tagFilters`. |
| Build status | `pipelines_build` · `get_status` | Useful for release-radar on-track checks. |
| What changed in a build | `pipelines_build` · `get_changes` | Commits/work items included in a build. |
| Build logs | `pipelines_build_log` | |
| Pipeline runs | `pipelines_run` · `get` / `list` | ⚠️ **Read-only** — this does *not* queue a run. Queuing is `pipelines_write` · `run_pipeline`. |
| Pipeline definitions | `pipelines_definition` | |
| Build artifacts | `pipelines_artifact` · `list` / `download` | `destinationPath` is relative; omit it to get base64. |

**Tests** (PAT scope: Test Management → Read)

| You want… | Tool + action | Notes |
|---|---|---|
| Test plans / suites / cases | `testplan` · `list_plans` / `list_suites` / `list_cases` | Paginated — pass back `continuationToken` until it is null. |
| Test results for a build | `testplan_show_test_results_from_build_id` | Unchanged in v2. |

> **Write tools in these areas exist** (`repo_pull_request_write`, `repo_pull_request_thread_write`, `repo_create_branch`, `pipelines_write`, `testplan_test_*_write`, `wiki_upsert_page`) but our PATs do **not** carry write scope for Code/Build/Test, and they're gated in [`settings.json`](../settings.json) regardless. Reading only.

---

## Field maps

Legend: **R** = required by ADO (create will be rejected without it). Default values in the "Default / notes" column are what to send when the user doesn't specify.

### Common to all four types

| Field | Reference name | R | Default / notes |
|---|---|---|---|
| Title | `System.Title` | ✅ | From user |
| Work item type | `System.WorkItemType` | ✅ | `Epic` / `Feature` / `User Story` / `Bug` |
| State | `System.State` | ✅ | `New` for newly created items |
| Area path | `System.AreaPath` | ✅ (AreaId) | **Always ask** — e.g. `ChainCargo\GreenDiamonds`. See states reference. |
| Iteration path | `System.IterationPath` | ✅ (IterationId) | Defaults to `ChainCargo` (project root / backlog) if no sprint chosen |
| Value Area | `Microsoft.VSTS.Common.ValueArea` | ✅ | **`Business`** (the default — set it explicitly; it is required on every type) |
| Description | `System.Description` | | HTML |
| Assigned To | `System.AssignedTo` | | ADO email; omit to leave unassigned |
| Priority | `Microsoft.VSTS.Common.Priority` | | **POs do not set this.** It auto-defaults to `2` on every type in ChainCargo and is not surfaced on the work-item forms — leave it alone. The vault's `priority` is a separate PO-only field (see below). |
| Tags | `System.Tags` | | Semicolon-separated for multiple. **Strip the leading entity-type tag** (`epic`/`feature`/`user-story`/`bug`) — it duplicates `System.WorkItemType` in ADO. |
| Parent | `System.Parent` | | Parent work item's **numeric ID**. ⚠️ **Do NOT send this in the `wit_work_item_write` · `create` fields array — it is silently ignored** (no error, item created orphaned). Set the parent as a relation link *after* create — see Linking below. |

> **`Value Area` = `Business` must be sent on every create.** It is required on all four types and is the field most easily forgotten.

> **Vault `priority` does not sync.** The vault's `priority` (`low`/`medium`/`high`) is a PO-only triage field — there is **no** mapping to ADO `Priority`, which the team never sets (it stays at its `2` default). Do not send `Priority` from a vault file. Verified live: Epic, Feature, and Bug items all sit at `Priority = 2` with nobody touching it.

### Epic

Required: Title, State, Value Area. (`Priority` auto-defaults to `2` — POs don't set it.)

**PO sets:** Description + Success Metrics. Everything below those is auto-defaulted or optional team metadata.

| Field | Reference name | R | Notes |
|---|---|---|---|
| Description | `System.Description` | | HTML — the problem, scope, success criteria. (On real epics, success metrics are often written inside the Description as well.) |
| Success Metrics | `Custom.SuccessMetrics` | | HTML — custom field |
| Business Value | `Microsoft.VSTS.Common.BusinessValue` | | Optional; team metadata |
| Effort | `Microsoft.VSTS.Scheduling.Effort` | | Optional; team metadata |
| Start / Target Date | `Microsoft.VSTS.Scheduling.StartDate` / `.TargetDate` | | Optional |

### Feature

Required: Title, State, Value Area. (`Priority` auto-defaults to `2` — POs don't set it.)

**PO sets:** Description + Success Metrics. The WSJF/sizing fields below are filled by the BA/team during refinement — set them only if the user explicitly provides values.

| Field | Reference name | R | Notes |
|---|---|---|---|
| Description | `System.Description` | | HTML — **PO** |
| Success Metrics | `Custom.SuccessMetrics` | | HTML — **PO** |
| Business Value | `Microsoft.VSTS.Common.BusinessValue` | | WSJF input — team-filled (verified populated on live features) |
| Time Criticality | `Microsoft.VSTS.Common.TimeCriticality` | | WSJF input — team-filled |
| Risk Reduction / Opp. Enablement | `Custom.RiskReductionOpportunityEnablement` | | WSJF input — team-filled |
| Business Value Score | `Custom.BusinessValueScore` | | WSJF input — team-filled |
| WSJF Score | `Custom.WSJFScore` | | Computed/entered — team-filled |
| Effort | `Microsoft.VSTS.Scheduling.Effort` | | Team-filled |
| Per-discipline day estimates | `Custom.BADays`, `Custom.BEDays`, `Custom.FEDays`, `Custom.QADays`, `Custom.DataDays`, `Custom.DesignDays`, `Custom.MobileDays` | | Sizing block — team-filled, rarely all populated |
| Final Requirements / Scope | `Custom.FinalRequirements`, `Custom.Scope` | | HTML — team-filled |

### User Story

Required: Title, State, Value Area. (Acceptance Criteria and Description are **not** ADO-required, but a story without them isn't `ready` — see [`rules-requirements.md`](rules-requirements.md).)

| Field | Reference name | R | Notes |
|---|---|---|---|
| Description | `System.Description` | | HTML — `As a / I want / so that` |
| Acceptance Criteria | `Microsoft.VSTS.Common.AcceptanceCriteria` | | HTML — see format below |
| Story Points | `Microsoft.VSTS.Scheduling.StoryPoints` | | |
| Design Link | `Custom.DesignLink` | | Custom |
| Risks | `Custom.Risks` | | Custom |

### Bug

Required (ADO rejects without these): Title, State, Value Area, Severity, Acceptance Criteria, Actual Result, Repro Steps, Bug Found In, Raised By, **Blocks next release**. (`Original Estimate` and `Remaining Work` are marked required in the schema but **ADO populates them automatically on create — do not send them**.)

| Field | Reference name | R | Notes |
|---|---|---|---|
| Severity | `Microsoft.VSTS.Common.Severity` | ✅ | `1 - Critical` / `2 - High` / `3 - Medium` / `4 - Low`. Critical only when Bug Found In = Production — see states reference. |
| Acceptance Criteria | `Microsoft.VSTS.Common.AcceptanceCriteria` | ✅ | HTML — Given/When/Then for correct behaviour |
| Actual Result | `Custom.ActualResult` | ✅ | HTML — the broken behaviour |
| Repro Steps | `Microsoft.VSTS.TCM.ReproSteps` | ✅ | HTML — numbered `<ol>` |
| Bug Found In | `Custom.BugFoundIn` | ✅ | `Development` / `Staging` / `Preview` / `Production` — **always ask** |
| Raised By | `Custom.RaisedBy` | ✅ | Identity — pass the person's ADO email |
| Blocks next release | `Custom.Blocksnextrelease` | ✅ | Boolean — `false` default. The release-blocker call is the BA's; ask if unsure. |
| Original Estimate | `Microsoft.VSTS.Scheduling.OriginalEstimate` | (auto) | Required in schema, but **ADO fills it on create — do not send.** |
| Remaining Work | `Microsoft.VSTS.Scheduling.RemainingWork` | (auto) | Required in schema, but **ADO fills it on create — do not send.** |
| Story Points | `Microsoft.VSTS.Scheduling.StoryPoints` | | **Default `2`** by team convention — always set it on a new bug unless the user specifies otherwise. |
| Description | `System.Description` | | HTML — what is broken + impact |
| System Info | `Microsoft.VSTS.TCM.SystemInfo` | | HTML |
| Root Cause Analysis | `Custom.RootCauseAnalysis` | | HTML |
| Design Link | `Custom.DesignLink` | | Custom |
| Teams Message Link | `Custom.TeamsMessageLinka` | | The field on the Bug form (verified live). ⚠️ A duplicate `Custom.TeamsmessageLink` also exists but is **defunct/unused** — never write to it. |

---

## Vault file → ADO field mapping

When syncing a vault draft, this is where each piece of the file goes. Markdown body sections are converted to HTML (see formats below). Anything marked **vault-only** is never sent to ADO.

### All types

| Vault frontmatter / body | ADO field |
|---|---|
| `title` | `System.Title` |
| `priority` (`low`/`medium`/`high`) | **vault-only — not synced.** PO triage field; ADO `Priority` is left at its `2` default on all types. |
| `tags` (minus the leading entity-type tag) | `System.Tags` |
| `parent-epic` / `parent-feature` wikilink | `System.Parent` — resolve the wikilinked vault file to its `ado-id` (its numeric ADO ID) |
| `## Description` | `System.Description` (HTML) |
| `## History`, `## Notes`, `## Pillar Alignment` | **vault-only** — never synced |
| `status`, `author`, `id`, `created` | **vault-only** — not ADO fields (`status: synced` is stamped back after the write) |

### Epic / Feature extras

| Vault body | ADO field |
|---|---|
| `## Success Metrics` | `Custom.SuccessMetrics` (HTML) |

### User Story extras

| Vault body | ADO field |
|---|---|
| `## Description` (`As a / I want / so that`) | `System.Description` — single-sentence HTML, see format below |
| `## Acceptance Criteria` (Scenario + Given/When/Then) | `Microsoft.VSTS.Common.AcceptanceCriteria` — HTML, see format below |

### Bug extras

| Vault frontmatter / body | ADO field |
|---|---|
| `severity` | `Microsoft.VSTS.Common.Severity` (`1 - Critical` only when `bug-found-in: Production`) |
| `bug-found-in` | `Custom.BugFoundIn` |
| `raised-by` (PO full name) | `Custom.RaisedBy` — resolve the name to its ADO email via the PO table in [`ado-work-item-states.md`](ado-work-item-states.md) |
| `blocks-next-release` | `Custom.Blocksnextrelease` |
| `story-points` (default `2`) | `Microsoft.VSTS.Scheduling.StoryPoints` |
| `## Repro Steps` | `Microsoft.VSTS.TCM.ReproSteps` (HTML, numbered `<ol>`) |
| `## Actual Result` | `Custom.ActualResult` (HTML) |
| `## Acceptance Criteria` (Scenario + Given/When/Then) | `Microsoft.VSTS.Common.AcceptanceCriteria` — HTML, see format below |

> Bug AC uses the **same** `<b>Scenario: …</b>` + `<ul><li>` format as User Story AC — the bug template's `## Acceptance Criteria` therefore carries a `Scenario:` title just like a story does.

---

## Acceptance-criteria HTML format (User Story & Bug)

**Mandatory, no exceptions.** Each scenario: a bold `Scenario:` title immediately followed by a `<ul>` whose every Given/When/Then/And line is a `<li>`.

```html
<b>Scenario: <title></b>
<ul>
  <li>Given <precondition>,</li>
  <li>When <action>,</li>
  <li>Then <outcome>.</li>
</ul>
```

- Every Given/When/Then line **must** be a `<li>` inside the `<ul>` — never plain text or `<br>`-separated lines.
- `And` continuations are also `<li>` items in the same `<ul>`.
- Multiple scenarios sit one after another with no extra wrapper element between them.

**❌ Wrong (renders as a flat paragraph):** `<p><strong>Scenario:</strong> Title<br><strong>Given</strong> …<br>…</p>`

The story `Description` is a single sentence: `<p><strong>As a</strong> …, <strong>I want</strong> …, <strong>so that</strong> …</p>`.

---

## Linking the hierarchy (Epic → Feature → Story/Bug)

Parent-child links use the **hierarchy** relationship, set as a **relation link — never as a field on create.**

> ⚠️ **`System.Parent` in a `wit_work_item_write` · `create` fields array is silently ignored.** ADO accepts the payload without error, returns the new item, and leaves it **orphaned — no error is raised**, so the create *looks* successful. Patching `/fields/System.Parent` via `wit_work_item_write` · `update` fails the same silent way. **Always treat "create with a parent" as two steps: (1) create, (2) set the parent with a relation call, (3) verify.**

**Set the parent after create** (prefer method A):

**A. `wit_work_item_link_write` · `link` (pure MCP — preferred).** Creates the `System.LinkTypes.Hierarchy-Reverse` relation:
```
wit_work_item_link_write(
  action="link",
  project="ChainCargo",
  updates=[{"id": CHILD_ID, "linkToId": PARENT_ID, "type": "parent"}]
)
```
Batches multiple children in one call — pass one `{id, linkToId, type:"parent"}` entry per child. The `updates` shape is unchanged from v1's `wit_work_items_link`; only the tool name and the `action` wrapper are new.

**B. `wit_work_item_write` · `add_child`** — creates *new* children under a parent in one call (use only when the children don't exist yet). Takes `parentId`, `workItemType`, and an `items` array of `{title, description}`.

**C. REST PATCH (fallback if MCP link tools are unavailable):**
```bash
PAT=$(cat ~/.claude.json | python3 -c "import json,sys; d=json.load(sys.stdin); print(d['mcpServers']['azure-devops']['env']['ADO_MCP_AUTH_TOKEN'])")
curl -s -u ":$PAT" -X PATCH -H "Content-Type: application/json-patch+json" \
  "https://dev.azure.com/chaincode-development/ChainCargo/_apis/wit/workItems/{CHILD_ID}?api-version=7.0" \
  -d '[{"op":"add","path":"/relations/-","value":{"rel":"System.LinkTypes.Hierarchy-Reverse","url":"https://dev.azure.com/chaincode-development/a0d72e16-f1fd-4211-9f84-9efa487e3cd3/_apis/wit/workItems/{PARENT_ID}","attributes":{"comment":""}}}]'
```

**Verify — mandatory.** Because a create with `System.Parent` looks successful even when the link never happened, confirm the parent stuck: the link-call response (or a follow-up `wit_work_item` · `get` with `expand: "All"`) must show a `relations` entry with `rel: System.LinkTypes.Hierarchy-Reverse` and/or the flattened `System.Parent`. Do not report success until confirmed.

When creating a batch from scratch, **create top-down**: Epic first, then Features (link to the epic ID), then Stories/Bugs (link to the feature ID). You need the parent's returned ID before linking its children.

---

## Create & update

All four work-item mutations are actions on **one** tool, `wit_work_item_write`:

| Job | Call | Payload shape |
|---|---|---|
| **Create** | `wit_work_item_write` · `create` | `workItemType` + `fields: [{name, value, format?}]`. Supply every required field for the type (see maps). **Do not include `System.Parent`** — silently ignored on create; link it afterwards and verify. |
| **Update one** | `wit_work_item_write` · `update` | `id` + `updates: [{op, path, value}]`, e.g. `path: "/fields/System.State"`. |
| **Update many** | `wit_work_item_write` · `update_batch` | `batchUpdates: [{id, path, value, op?}]` — note each entry carries its own `id`. |
| **Create children** | `wit_work_item_write` · `add_child` | `parentId` + `workItemType` + `items: [{title, description}]`. |

⚠️ **`fields` (create) and `updates` (update) are different shapes** — `{name, value}` vs `{op, path, value}`. The update path is the full field reference prefixed with `/fields/`.

Common updates: change `System.State` (valid transitions in the states reference), set `System.AssignedTo`, set `Microsoft.VSTS.Scheduling.StoryPoints`, move `System.IterationPath` to a sprint.

- **Comments:** `wit_work_item_comment_write` · `add` (or `update` to edit an existing one — **`update` only on a comment you wrote yourself**, see the note above). A comment is distinct from `System.History`. Text defaults to Markdown; pass `format: "Html"` for HTML.
- **Links:** `wit_work_item_link_write` · `link` / `unlink` / `link_to_pull_request` / `add_artifact_link`.

**Every write is gated except comments.** Show the user the complete payload (all fields, the target item, the area/iteration) and wait for explicit confirmation before calling any write tool. Confirmation for one write does not carry to the next. Comments run without a prompt — but still **say what you are commenting and on which item**, and when a run posts many, show the plan first.

---

## See also

- [`ado-mcp-setup.md`](ado-mcp-setup.md) — **how to connect the ADO MCP server**, the pinned version, PAT scopes per PO, and the v1 → v2 migration steps
- [`ado-work-item-states.md`](ado-work-item-states.md) — states, severity rules, StackRank, area paths, PO emails
- [`rules-requirements.md`](rules-requirements.md) — vault status flow, INVEST, ADO sync lifecycle
- The `/sync-ado` skill — pushes vault drafts (or conversation items) into ADO with correct fields and hierarchy
