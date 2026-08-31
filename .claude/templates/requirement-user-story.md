---
id: US-<prefix>-<NNN>
title: <Short user story title>
author: <Firstname Lastname of the person who created this file>
status: <draft | refining | ready | synced | archived>
priority: <low | medium | high>
parent-epic: ["[[EPIC-<prefix>-<NNN>-<epic-slug>|EPIC-<prefix>-<NNN>]]"]
parent-feature: <ADO feature id, or empty if the parent is the epic above>
ado-id: <Azure DevOps work item ID, set after creation in ADO>
ado-title: <Title as it appears in ADO, set after sync>
ado-link: <Direct URL to the ADO work item, set after sync>
related-research: []
related-knowledge: []
tags: [user-story]
created: <YYYY-MM-DD>
---

## Description
**As a** <persona / role>, **I want** <capability or action>, **so that** <value or outcome>

## Acceptance Criteria

**Scenario: <scenario title>**
- **Given** <initial context>
- **When** <action / event>
- **Then** <observable result>

**Scenario: <scenario title>**
- **Given** <...>
- **When** <...>
- **Then** <...>

## Notes
<!-- Local only. INVEST failures, implementation hints, edge cases, technical notes, links to designs or research. Not synced to ADO as description text — refinement context goes to ADO as a labelled comment. -->

## History
<!-- Append entries when someone else edits this file. Format: YYYY-MM-DD — Firstname Lastname — short summary of change -->

---

## Rules

- **ID format:** `US-<prefix>-<NNN>` — e.g. `US-AF-007`. NNN is zero-padded. See the skill's § Assigning the ID.
- **Filename:** `<id>-<slug>.md`.
- **`author`** is set on creation and never changed; subsequent edits go under `## History`.
- **`parent-epic`** is required — the epic definition in the same folder this story hangs off. Use `parent-feature` as well when the story's real ADO parent is a feature rather than the epic.
- **`ado-id`, `ado-title`, `ado-link`** are set after the story is created in ADO (status becomes `synced`).
- **Status flow:** `draft → refining → ready → synced → archived`.
- **INVEST:** every user story should pass Independent, Negotiable, Valuable, Estimable, Small, Testable. See [`../references/rules-requirements.md`](../references/rules-requirements.md).
- **Never delete.** Set `status: archived` instead.
