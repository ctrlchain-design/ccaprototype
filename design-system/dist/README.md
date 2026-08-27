# CtrlChain Design System — exported bundle

Generated from the platform source. **Do not hand-edit anything in here** — it is
overwritten on every export.

    pnpm design-system:export    # rebuild this folder
    pnpm design-system:verify    # assert it against the platform source

Open `index.html` to browse.

## What is in here

| Path | What it is |
| --- | --- |
| `index.html` | Browsable catalogue — start here |
| `design-system/*.html` | Foundations: colours, tokens, typography, spacing, icons |
| `components/*.html` | Component documentation, rendered with real markup |
| `ds/index.css` | The whole stylesheet, in cascade order. Link this. |
| `ds/components/*.css` | One stylesheet per component (314 of them) |
| `tokens/*.json` | Machine-readable tokens, palette, type scale, icons |
| `manifest.json` | Inventory of everything, including what was skipped |
| `shell/` | Documentation chrome — nav, header, theme toggle |
| `assets/icons/` | The CtrlChain icon font |
| `assets/images/` | Brand lockups |
| `fonts/fonts.css` | Roboto — the only family the platform loads |

## Using it

Link one stylesheet and write the app's own classes:

```html
<link rel="stylesheet" href="fonts/fonts.css" />
<link rel="stylesheet" href="ds/index.css" />

<button ccaButton class="cca-btn cca-btn--primary">Create shipment</button>
<div class="rounded-lg surface-neutral-light border border-neutral-default p-4">…</div>
```

`ds/index.css` imports the layers in the order the running app applies them:
Angular Material's structural CSS, then the platform globals (tokens, all
492 utilities, the Material overrides), then the CtrlChain
component styles.

It is deliberately **not** wrapped in `@layer`. A cascade layer outranks
specificity, and the platform CSS carries Tailwind's preflight — which resets
`border-width: 0` on `*`. Layered, that reset beat every Material border and
form-field outlines vanished.

## Two caveats

- **Static previews.** Angular adds classes at runtime for focus, hover and
  floating labels. The documentation pages write those out explicitly per state,
  which is why each control appears several times.
- **The chrome here is this bundle's own.** The published design project has its
  own, richer shell at the same `shell/` paths, so **never upload `shell/*` from
  this bundle to the project** — it would replace theirs. Everything else in here
  is safe to push.
