#!/usr/bin/env python3
"""Regenerate design-system/INDEX.md from the exported bundle.

The bundle in design-system/dist/ is overwritten wholesale every time FE runs
`pnpm design-system:export`, so nothing here is hand-maintained. Run this after
each new export:

    python3 .claude/skills/prototype/scripts/build-index.py
"""
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parents[4]
DIST = ROOT / "design-system" / "dist"
OUT = ROOT / "design-system" / "INDEX.md"

if not DIST.is_dir():
    sys.exit(f"no bundle at {DIST}")

manifest = json.loads((DIST / "manifest.json").read_text())
tokens = json.loads((DIST / "tokens" / "tokens.json").read_text())
icons = json.loads((DIST / "tokens" / "icons.json").read_text())
typography = json.loads((DIST / "tokens" / "typography.json").read_text())
palette = json.loads((DIST / "tokens" / "palette.json").read_text())

# --- classes each documented page actually renders with -----------------------
# Prototypes copy markup out of these pages, so the class list per page is the
# vocabulary that matters. Icon glyph classes are indexed separately.
CLASS_RE = re.compile(r'class="([^"]*)"')
TAG_RE = re.compile(r"<(cca-[a-z0-9-]+|mat-[a-z0-9-]+)[\s>/]")
KEEP = re.compile(r"^(cca-|badge-|mat-mdc-|mat-icon|mat-primary|menu-|a-menu|side-menu|page-container|emphasis-)")
page_classes = {}
page_tags = {}
for page in manifest["documentedPages"]:
    path = DIST / page["path"]
    if not path.is_file():
        continue
    text = path.read_text()
    found = set()
    for attr in CLASS_RE.findall(text):
        for cls in attr.split():
            if KEEP.match(cls) and not cls.startswith("cca-icon-"):
                found.add(cls)
    page_classes[page["path"]] = sorted(found)
    page_tags[page["path"]] = sorted(
        t for t in set(TAG_RE.findall(text)) if t not in {"cca-icon", "mat-icon"}
    )

# --- utilities, keyed off the token they set ----------------------------------
utilities = {}
for group, entries in tokens["groups"].items():
    for name, spec in entries.items():
        for util in spec.get("utilities", []):
            utilities[util["class"]] = (util["property"], name)

lines = []
w = lines.append
w("# CtrlChain design system — lookup index")
w("")
w("Generated from `design-system/dist/`. Do not hand-edit — regenerate with:")
w("")
w("    python3 .claude/skills/prototype/scripts/build-index.py")
w("")
w("This is an index, not a substitute for the bundle. Find the name here, then")
w("open the page it points at and copy the real markup out of it.")
w("")
c = manifest["counts"]
w(f"{c['documentedPages']} documented pages · {c['componentsWithCss']} components with CSS · "
  f"{c['tokens']} tokens · {c['utilities']} utilities · {c['typeStyles']} type styles · {c['icons']} icons")
w("")

w("## Documented pages")
w("")
w("Element tags matter as much as classes: several components are a custom")
w("element wrapping a utility-classed div, and the CSS targets the tag. Copy the")
w("wrapper, not just the inner div.")
w("")
w("| Page | Element tags | Classes |")
w("| --- | --- | --- |")
for page in manifest["documentedPages"]:
    classes = page_classes.get(page["path"], [])
    tags = page_tags.get(page["path"], [])
    shown = ", ".join(f"`{c}`" for c in classes) if classes else "utilities only"
    tagged = ", ".join(f"`<{t}>`" for t in tags) if tags else "—"
    w(f"| **{page['title']}** — `design-system/dist/{page['path']}` | {tagged} | {shown} |")
w("")

w("## Type styles")
w("")
w(f"Family: {typography['fontFamily']}. Weights: {', '.join(str(x) for x in typography['weights'])}.")
w("")
for style in typography["styles"]:
    bits = [f"{k} {v}" for k, v in style.items() if k != "class"]
    w(f"- `{style['class']}` — {', '.join(bits)}")
w("")

w("## Tokens")
w("")
w("Every token is a CSS custom property (`var(--name)`) and most also ship a")
w("utility class. Prefer the utility class; use `var()` for inline styles.")
w("Light and dark values both listed — dark applies automatically via")
w("`prefers-color-scheme` unless the page sets `<html class=\"light\">`.")
w("")
for group, entries in tokens["groups"].items():
    w(f"### {group}")
    w("")
    w("| Token | Utility | Light | Dark |")
    w("| --- | --- | --- | --- |")
    for name, spec in entries.items():
        utils = ", ".join(f"`.{u['class']}`" for u in spec.get("utilities", [])) or "—"
        light = (spec.get("light") or {}).get("value", "—")
        dark = (spec.get("dark") or {}).get("value", "—")
        w(f"| `--{name}` | {utils} | `{light}` | `{dark}` |")
    w("")

w("## Utility classes")
w("")
w("| Class | Sets |")
w("| --- | --- |")
for cls in sorted(utilities):
    prop, token = utilities[cls]
    w(f"| `.{cls}` | `{prop}: var(--{token})` |")
w("")

w("## Icons")
w("")
w(f"{icons['count']} glyphs in the `{icons['fontFamily']}` font, loaded by `ds/index.css`.")
w("In a prototype, render one as:")
w("")
w('    <cca-icon><mat-icon class="mat-icon notranslate cca-icon cca-icon-NAME '
  'mat-ligature-font mat-icon-inline" aria-hidden="true"></mat-icon></cca-icon>')
w("")
w("| Name | Class |")
w("| --- | --- |")
for icon in icons["icons"]:
    w(f"| `{icon['name']}` | `{icon['class']}` |")
w("")

w("## Raw palette")
w("")
w("Ramps behind the tokens. Do not use these directly in a prototype — reach for")
w("the semantic token above so the prototype tracks theme changes.")
w("")
for ramp, stops in palette["ramps"].items():
    w(f"- **{ramp}**: " + ", ".join(f"`{k}` {v}" for k, v in stops.items()))
w("")

w("## Design-system components")
w("")
w("The 40 components FE flags as design system. `ds/index.css` already carries")
w("their CSS — no extra stylesheet needed.")
w("")
w("| Selector | Owner |")
w("| --- | --- |")
for comp in manifest["components"]:
    if comp.get("isDesignSystem"):
        w(f"| `{comp['selector']}` | `{comp['owner']}` |")
w("")

w("## App components with exported CSS")
w("")
w("Not design system — product-specific components whose stylesheet was exported")
w("anyway. `ds/index.css` does NOT include these. If a prototype genuinely needs")
w("one, link its stylesheet after `ds/index.css`, and flag it: reaching this deep")
w("usually means the prototype is copying a screen rather than composing one.")
w("")
w("| Selector | Stylesheet |")
w("| --- | --- |")
for comp in manifest["components"]:
    if comp.get("css") and not comp.get("isDesignSystem"):
        w(f"| `{comp['selector']}` | `{comp['css']}` |")
w("")

OUT.write_text("\n".join(lines))
print(f"wrote {OUT.relative_to(ROOT)} — {len(lines)} lines, {OUT.stat().st_size / 1024:.0f} KB")
