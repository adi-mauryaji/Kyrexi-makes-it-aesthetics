#!/usr/bin/env python3
"""Taste and structure memory for the design skill (Python 3 standard library only).

Keeps what the person kept or rejected (directions, palettes, type, motion, page structures)
in a JSON-lines file, shows it at the start of the next project, and flags a page structure
that repeats recent builds.

Usage:
  python3 memory.py add --kind KIND --value TEXT --verdict kept|rejected|pending [--project NAME] [--note TEXT] [--file PATH | --global]
  python3 memory.py show [--kind KIND] [--file PATH | --global]
  python3 memory.py check-structure --value "hero-split > story-pin > menu-grid > steps > map" [--recent 5] [--file PATH | --global]

KIND: direction | palette | type | motion | structure | imagery | copy | other
Files: design/taste-memory.jsonl in the current project by default; --global uses
~/.kyrexi/taste-memory.jsonl, shared by every project on this computer.
check-structure exits 1 when the structure repeats a recent build exactly or opens with the
same first three sections; read it as a prompt to vary the page shape, not as a ban.
Manual path: keep the same lines by hand in the file; one JSON object per line.
"""
import argparse
import datetime
import json
import os
import pathlib
import sys

KINDS = ["direction", "palette", "type", "motion", "structure", "imagery", "copy", "other"]


def path_for(a):
    if a.glob:
        return pathlib.Path.home() / ".kyrexi" / "taste-memory.jsonl"
    return pathlib.Path(a.file or os.path.join("design", "taste-memory.jsonl"))


def load(p):
    if not p.exists():
        return []
    rows = []
    for line in p.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if line:
            try:
                rows.append(json.loads(line))
            except json.JSONDecodeError:
                pass
    return rows


def norm(structure):
    return [s.strip().lower() for s in structure.split(">") if s.strip()]


def main(argv):
    ap = argparse.ArgumentParser(description="Taste and structure memory")
    sub = ap.add_subparsers(dest="cmd", required=True)
    for name in ("add", "show", "check-structure"):
        sp = sub.add_parser(name)
        sp.add_argument("--file")
        sp.add_argument("--global", dest="glob", action="store_true")
        if name == "add":
            sp.add_argument("--kind", choices=KINDS, required=True)
            sp.add_argument("--value", required=True)
            sp.add_argument("--verdict", choices=["kept", "rejected", "pending"], required=True)
            sp.add_argument("--project", default=os.path.basename(os.getcwd()))
            sp.add_argument("--note", default="")
        if name == "show":
            sp.add_argument("--kind", choices=KINDS)
        if name == "check-structure":
            sp.add_argument("--value", required=True)
            sp.add_argument("--recent", type=int, default=5)
    a = ap.parse_args(argv)
    p = path_for(a)

    if a.cmd == "add":
        p.parent.mkdir(parents=True, exist_ok=True)
        row = {"at": datetime.date.today().isoformat(), "project": a.project, "kind": a.kind,
               "value": a.value, "verdict": a.verdict, "note": a.note}
        with p.open("a", encoding="utf-8") as f:
            f.write(json.dumps(row, ensure_ascii=False) + "\n")
        print(f"saved to {p}: {a.kind} {a.verdict}: {a.value}")
        return 0

    rows = load(p)
    if a.cmd == "show":
        rows = [r for r in rows if not a.kind or r.get("kind") == a.kind]
        if not rows:
            print(f"no memory in {p}")
            return 0
        for verdict in ("kept", "rejected", "pending"):
            sel = [r for r in rows if r.get("verdict") == verdict]
            if sel:
                print(f"{verdict.upper()} ({len(sel)})")
                for r in sel[-12:]:
                    note = f" — {r['note']}" if r.get("note") else ""
                    print(f"  {r.get('at', '')} {r.get('project', '')} · {r.get('kind')}: {r.get('value')}{note}")
        return 0

    # check-structure
    new = norm(a.value)
    past = [r for r in rows if r.get("kind") == "structure" and r.get("verdict") != "rejected"][-a.recent:]
    hits = []
    for r in past:
        old = norm(r.get("value", ""))
        if old == new:
            hits.append(f"same structure as {r.get('project', '?')} ({r.get('at', '')}): {r.get('value')}")
        elif len(new) >= 3 and old[:3] == new[:3]:
            hits.append(f"same opening (first three sections) as {r.get('project', '?')} ({r.get('at', '')}): {' > '.join(old[:3])}")
    if hits:
        for h in hits:
            print("repeat:", h)
        print("vary the page shape (a different hero type, order or section composition), or note why the repeat is right")
        return 1
    print(f"structure differs from the last {len(past)} recorded build(s)")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
