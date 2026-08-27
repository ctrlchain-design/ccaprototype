#!/usr/bin/env python3
"""Regenerate _shared/screens.js — the map of what a prototype can link to.

Nobody registers a prototype by hand. This walks the repo, finds every page, and
writes the registry that _shared/routes.js reads. Run it after creating,
renaming, moving or deleting a prototype:

    python3 .claude/skills/prototype/scripts/build-screens.py

A page names itself by putting `data-screen` on its <html> element:

    <html lang="en" class="light" data-screen="orders.detail">

That is the only thing a prototype has to do to become linkable, and the starter
template already carries it. A page without the attribute still gets a screen
name derived from its folder, so older prototypes are linkable too and nothing
has to be retrofitted.
"""
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parents[4]
OUT = ROOT / "_shared" / "screens.js"

# Folders that are not prototypes.
SKIP = {".git", ".claude", "_shared", "design-system", "node_modules"}

HTML_TAG = re.compile(r"<html\b[^>]*>", re.I)
DATA_SCREEN = re.compile(r'data-screen\s*=\s*["\']([^"\']+)["\']', re.I)
TITLE = re.compile(r"<title>([^<]*)</title>", re.I)


def screen_name_from_path(rel: pathlib.Path) -> str:
    """`orders-pinned-filters/index.html` → `orders-pinned-filters`.

    A nested page keeps its parent for context:
    `resource-availability/test-cases/index.html` → `resource-availability.test-cases`.
    """
    parts = list(rel.parts[:-1])  # drop index.html
    return ".".join(parts)


def main() -> int:
    if not (ROOT / "_shared").is_dir():
        sys.exit(f"no _shared/ at {ROOT}")

    found = {}
    for page in sorted(ROOT.glob("*/**/index.html")) + sorted(ROOT.glob("*/index.html")):
        rel = page.relative_to(ROOT)
        if rel.parts[0] in SKIP:
            continue

        text = page.read_text(errors="replace")
        tag = HTML_TAG.search(text)
        declared = DATA_SCREEN.search(tag.group(0)) if tag else None

        name = declared.group(1) if declared else screen_name_from_path(rel)
        title = TITLE.search(text)

        # An explicit data-screen wins over a path-derived duplicate.
        if name in found and not declared:
            continue

        found[name] = {
            "path": str(rel.parent) + "/",
            "title": (title.group(1).strip() if title else name),
            "declared": bool(declared),
        }

    # Screens that are designed but not built. Anything a prototype links to
    # that no page provides lands here automatically, so a dead link becomes a
    # visible "not prototyped yet" rather than a 404.
    linked = set()
    for page in ROOT.glob("*/**/*.html"):
        if page.relative_to(ROOT).parts[0] in SKIP:
            continue
        for m in re.finditer(r'data-screen\s*=\s*["\']([^"\']+)["\']', page.read_text(errors="replace")):
            name = m.group(1)
            # Skip template placeholders — a page that renders links from the
            # registry contains literal `data-screen="${name}"` in its source.
            if "${" in name or "{{" in name:
                continue
            linked.add(name)
    unbuilt = sorted(linked - set(found))

    lines = [
        "/*",
        " * GENERATED — do not edit.",
        " *",
        " * The map of every page a prototype can link to. Rebuild with:",
        " *   python3 .claude/skills/prototype/scripts/build-screens.py",
        " *",
        " * A page names itself with data-screen on <html>; anything without one gets a",
        " * name from its folder. Screens listed as null are linked to by some prototype",
        " * but not built yet — those links explain themselves instead of 404ing.",
        " */",
        "window.CCA_SCREENS = {",
    ]
    for name, meta in sorted(found.items()):
        flag = "" if meta["declared"] else "  // name derived from folder"
        lines.append(f'  {name!r}: {{ path: {meta["path"]!r}, title: {meta["title"]!r} }},{flag}')
    for name in unbuilt:
        lines.append(f"  {name!r}: null, // linked to, not built yet")
    lines.append("};")
    lines.append("")

    OUT.write_text("\n".join(lines).replace("'", '"'))
    print(f"wrote {OUT.relative_to(ROOT)} — {len(found)} built, {len(unbuilt)} not built yet")
    for name in unbuilt:
        print(f"  not built yet: {name}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
