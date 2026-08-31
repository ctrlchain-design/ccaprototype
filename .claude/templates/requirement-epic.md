---
id: EPIC-<prefix>-<NNN>
title: <Short epic title>
author: <Firstname Lastname of the person who created this file>
status: <draft | refining | ready | synced | archived>
priority: <low | medium | high>
pillar: ["[[PILLAR-<slug>|<Pillar title>]]"]
related-goals: []
related-features: []
ado-id: <Azure DevOps work item ID, set after creation in ADO>
ado-title: <Title as it appears in ADO, set after sync>
ado-link: <Direct URL to the ADO work item, set after sync>
timeline-start: <YYYY-MM-DD or empty>
timeline-end: <YYYY-MM-DD or empty>
tags: [epic]
created: <YYYY-MM-DD>
---

## Description
<The capability being delivered. Per rules-requirements.md § Writing the description, an epic description states what the epic delivers, not the problem it prevents. Include in-scope and out-of-scope statements.>

## Success Metrics
<How we will know this epic is done and successful. Observable, measurable outcomes.>

## Pillar Alignment
<How this epic maps to the strategic pillars it is linked to. One line per pillar — or "n/a" if genuinely not applicable.>

## Linked stories
<!-- Stories in this same epic-definitions folder that name this epic as their parent. List them as `- [[US-<prefix>-<NNN>-<slug>]] — <title>` and keep the list current; there is no Dataview index here. -->

## History
<!-- Append entries when someone else edits this file. Format: YYYY-MM-DD — Firstname Lastname — short summary of change -->

---

## Rules

- **ID format:** `EPIC-<prefix>-<NNN>` — e.g. `EPIC-AF-003`. NNN is zero-padded. See the skill's § Assigning the ID for how the number is picked and why it is checked against the PO vault.
- **Filename:** `<id>-<slug>.md` — e.g. `EPIC-AF-003-my-epic-title.md`. The slug is the title in kebab-case.
- **`author`** is set on creation and never changed; subsequent edits go under `## History`.
- **`pillar`** is required. Every epic must reference at least one pillar — if it fits none, push back on scope. Pillars live in the PO vault at `Goals/Pillars/`.
- **`ado-id`, `ado-title`, `ado-link`** are set after the epic is created in ADO (status becomes `synced`).
- **`timeline-start` / `timeline-end`** are optional — set when a rough delivery window is known.
- **Status flow:** `draft → refining → ready → synced → archived`. `synced` means the epic exists in ADO and this entry is the historical record.
- **Never delete.** Set `status: archived` instead.
- See [`../references/rules-requirements.md`](../references/rules-requirements.md) for full validation rules.
