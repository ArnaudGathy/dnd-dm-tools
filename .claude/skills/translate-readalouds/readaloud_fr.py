#!/usr/bin/env python3
"""Duplicate insetReadaloud blocks of a 5etools adventure chapter with French copies.

Usage:
  readaloud_fr.py chapters <adventure.json>
  readaloud_fr.py extract  <adventure.json> <chapter-query> [-o pending.json]
  readaloud_fr.py insert   <adventure.json> <chapter-query> <translations.json>

`extract` lists every insetReadaloud in the chapter that does not yet have a
French sibling, as JSON: [{"key": ..., "entries": [...]}, ...].
`insert` reads a mapping {key: translatedEntries} and inserts a copy of each
original right after it, with `id` set to "<key>-fr" (the idempotency marker).
"""

import argparse
import copy
import json
import re
import sys


def is_french_copy(node):
    return (
        isinstance(node, dict)
        and node.get("type") == "insetReadaloud"
        and str(node.get("id", "")).endswith("-fr")
    )


def iter_readalouds(node):
    """Yield (parent_list, index, entry) for every original (non-copy)
    insetReadaloud, in document order."""
    if isinstance(node, dict):
        for value in node.values():
            yield from iter_readalouds(value)
    elif isinstance(node, list):
        for i, item in enumerate(node):
            if (
                isinstance(item, dict)
                and item.get("type") == "insetReadaloud"
                and not is_french_copy(item)
            ):
                yield node, i, item
            yield from iter_readalouds(item)


def collect(chapter):
    """Return [(key, parent_list, index, entry)] with stable keys."""
    out = []
    noid = 0
    for parent, i, entry in iter_readalouds(chapter):
        if "id" in entry:
            key = str(entry["id"])
        else:
            key = f"noid-{noid}"
            noid += 1
        out.append((key, parent, i, entry))
    return out


def find_chapter(data, query):
    q = query.lower()
    matches = [ch for ch in data if q in ch.get("name", "").lower()]
    if len(matches) != 1:
        names = [ch.get("name", "?") for ch in (matches or data)]
        kind = "Ambiguous" if matches else "No"
        sys.exit(f"{kind} chapter match for {query!r}. Candidates:\n  " + "\n  ".join(names))
    return matches[0]


def has_french_sibling(parent, i):
    return i + 1 < len(parent) and is_french_copy(parent[i + 1])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("command", choices=["chapters", "extract", "insert"])
    ap.add_argument("adventure", help="path to adventure-<id>.json")
    ap.add_argument("chapter", nargs="?", help="chapter name substring (case-insensitive)")
    ap.add_argument("translations", nargs="?", help="insert: path to {key: entries} JSON")
    ap.add_argument("-o", "--out", help="extract: write pending entries here instead of stdout")
    args = ap.parse_args()

    with open(args.adventure) as f:
        doc = json.load(f)
    data = doc["data"]

    if args.command == "chapters":
        for ch in data:
            print(ch.get("name", "?"))
        return

    if not args.chapter:
        sys.exit("chapter query is required")
    chapter = find_chapter(data, args.chapter)
    items = collect(chapter)

    if args.command == "extract":
        pending = [
            {"key": key, "entries": entry["entries"]}
            for key, parent, i, entry in items
            if not has_french_sibling(parent, i)
        ]
        text = json.dumps(pending, indent=2, ensure_ascii=False)
        if args.out:
            with open(args.out, "w") as f:
                f.write(text + "\n")
            print(f"{len(pending)} pending readaloud(s) written to {args.out}")
        else:
            print(text)
        return

    # insert
    if not args.translations:
        sys.exit("translations JSON path is required")
    with open(args.translations) as f:
        translations = json.load(f)

    known = {key for key, *_ in items}
    unknown = set(translations) - known
    if unknown:
        sys.exit(f"Unknown keys in translations: {sorted(unknown)}")

    inserted = skipped = 0
    missing = []
    # Reverse document order so insertions don't shift pending indices.
    for key, parent, i, entry in reversed(items):
        if has_french_sibling(parent, i):
            skipped += 1
            continue
        if key not in translations:
            missing.append(key)
            continue
        clone = copy.deepcopy(entry)
        clone["entries"] = translations[key]
        clone["id"] = f"{key}-fr"
        parent.insert(i + 1, clone)
        inserted += 1

    # 5etools repo style: tab indent, trailing newline, chars <= U+00FF kept
    # raw, anything above escaped as \uXXXX (surrogate pairs past U+FFFF).
    def escape(match):
        cp = ord(match.group())
        if cp > 0xFFFF:
            cp -= 0x10000
            return "\\u%04x\\u%04x" % (0xD800 + (cp >> 10), 0xDC00 + (cp & 0x3FF))
        return "\\u%04x" % cp

    text = json.dumps(doc, indent="\t", ensure_ascii=False)
    text = re.sub("[^\x00-\xff]", escape, text)
    with open(args.adventure, "w") as f:
        f.write(text + "\n")

    print(f"Inserted {inserted}, already translated {skipped}.")
    if missing:
        print(f"WARNING: no translation provided for: {missing}")


if __name__ == "__main__":
    main()
