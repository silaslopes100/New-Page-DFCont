#!/usr/bin/env python3
"""Mantis summarize: bottom-up inventory of source directories for summary generation."""
import json
import os

ROOT = r"D:\New Page DFCont"
WORKSPACE = os.path.join(ROOT, "workspace")
EXCLUDE_DIRS = {
    ".git", "node_modules", "vendor", "__pycache__", "dist", ".venv", "venv",
    "workspace", "Midias", ".idea", ".vscode",
}
EXCLUDE_FILES = {
    "package-lock.json", "mantis-summary.md", ".mantis_state.json",
    "history_cache.json", "history_extract.py",
}

def count_lines(path):
    try:
        with open(path, "rb") as f:
            return sum(1 for _ in f)
    except OSError:
        return 0

def walk():
    dirs = {}
    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if d not in EXCLUDE_DIRS and not d.endswith(".egg-info")]
        rel = os.path.relpath(dirpath, ROOT)
        if rel == ".":
            continue
        files = []
        for fn in sorted(filenames):
            if fn in EXCLUDE_FILES:
                continue
            fp = os.path.join(dirpath, fn)
            if os.path.isfile(fp):
                files.append({"name": fn, "lines": count_lines(fp)})
        dirs[rel] = sorted(files, key=lambda x: x["name"])
    return dirs

def main():
    dirs = walk()
    learnings = []
    if os.path.exists(os.path.join(WORKSPACE, "historical_learnings.jsonl")):
        with open(os.path.join(WORKSPACE, "historical_learnings.jsonl"), encoding="utf-8") as f:
            for line in f:
                if line.strip():
                    learnings.append(json.loads(line))
    out = {"directories": dirs, "historical_learnings": learnings}
    with open(os.path.join(WORKSPACE, "summary_manifest.json"), "w", encoding="utf-8") as f:
        json.dump(out, f, indent=2, ensure_ascii=False)
    print("directories:", len(dirs))
    for d, files in sorted(dirs.items()):
        total = sum(f["lines"] for f in files)
        print(f"{d}: {len(files)} files, {total} lines -> {', '.join(f['name'] for f in files[:12])}")

if __name__ == "__main__":
    main()
