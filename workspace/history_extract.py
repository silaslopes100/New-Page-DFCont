#!/usr/bin/env python3
"""Mantis history extractor: extracts security-relevant VCS history into
workspace/historical_learnings.jsonl (rebuilt from cache each run)."""
import json
import os
import re
import subprocess
import sys
import time
from datetime import datetime, timezone

WORKSPACE = os.path.dirname(os.path.abspath(__file__))
STATE_FILE = os.path.join(WORKSPACE, ".mantis_state.json")
CACHE_FILE = os.path.join(WORKSPACE, "history_cache.json")
OUTPUT_FILE = os.path.join(WORKSPACE, "historical_learnings.jsonl")
STATUS_FILE = os.path.join(WORKSPACE, "history_status.json")

REPO_ROOT = os.path.dirname(WORKSPACE)  # live repo root (VCS metadata lives here)

# Production paths in scope (everything else is media/tests/docs/vendor)
PROD_INCLUDE = ("backend/app/", "frontend/src/")
EXCLUDE_FRAG = ("__pycache__", ".pyc", "node_modules", "/dist/", "package-lock.json")
MAX_DIFF_LINES = 8000

KEYWORDS = [
    "security", "secure", "vuln", "cve", "injection", "sqli", "xss", "csrf",
    "auth", "password", "secret", "token", "session", "leak", "expos", "fix",
    "sanitize", "validate", "escape", "cors", "rate limit", "sql", "cache",
    "cache invalidation", "permission", "bypass", "overflow", "path traversal",
    "redirect", "header", "cookie", "hash", "encrypt", "unsafe", "race",
    "deadlock", "transaction", "improper", "missing", "exception", "error",
    "plan", "lead", "contact", "calculator", "import", "adjust",
]

def run_git(args, cwd=REPO_ROOT):
    r = subprocess.run(["git"] + args, cwd=cwd, capture_output=True, text=True, encoding="utf-8", errors="replace")
    if r.returncode != 0:
        raise RuntimeError(f"git {' '.join(args)} failed: {r.stderr[:500]}")
    return r.stdout

def now_iso():
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%fZ")

def load_state():
    if os.path.exists(STATE_FILE):
        with open(STATE_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"pass_number": 1}

def load_cache():
    if os.path.exists(CACHE_FILE):
        with open(CACHE_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}

def save_cache(cache):
    tmp = CACHE_FILE + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(cache, f, indent=2, ensure_ascii=False)
    os.replace(tmp, CACHE_FILE)

def repo_identity():
    remote = ""
    try:
        remote = run_git(["remote", "get-url", "origin"]).strip()
    except RuntimeError:
        remote = "no-remote"
    try:
        is_shallow = run_git(["rev-parse", "--is-shallow-repository"]).strip() == "true"
    except RuntimeError:
        is_shallow = False
    return {"vcs_type": "git", "remote_url": remote}, is_shallow

def head_reachable(cache):
    h = cache.get("_analyzed_head")
    if not h:
        return True
    try:
        subprocess.run(["git", "cat-file", "-e", h], cwd=REPO_ROOT, capture_output=True, check=True)
        subprocess.run(["git", "merge-base", "--is-ancestor", h, "HEAD"], cwd=REPO_ROOT, capture_output=True, check=True)
        return True
    except subprocess.CalledProcessError:
        return False

def in_scope_prod(f):
    if f == "D" or f.startswith("D"):
        return False
    path = f[2:] if f[:2] in ("A\t", "M\t", "D\t", "R\t", "C\t") else f
    path = path.split("\t")[-1]
    if path.endswith("/"):
        return False
    if not (path.startswith(PROD_INCLUDE[0]) or path.startswith(PROD_INCLUDE[1])):
        return False
    if any(x in path for x in EXCLUDE_FRAG):
        return False
    return True

def get_commit_diffs(rev):
    """Return (prod_files, prod_diff_text) for a commit."""
    files = run_git(["diff-tree", "--root", "--no-commit-id", "--name-status", "-r", "-M", rev]).splitlines()
    prod = [f for f in files if in_scope_prod(f)]
    if not prod:
        return [], ""
    diff = run_git(["diff-tree", "--root", "-p", "-M", rev, "--", "backend/app", "frontend/src"])
    lines = diff.splitlines()
    if len(lines) > MAX_DIFF_LINES:
        diff = "\n".join(lines[: MAX_DIFF_LINES]) + f"\n...[truncated {len(lines) - MAX_DIFF_LINES} lines]"
    return prod, diff

def analyze_and_extract(rebuild_only=False):
    state = load_state()
    pass_number = state.get("pass_number", 1)

    cache = load_cache()
    ident, is_shallow = repo_identity()
    status = {"vcs_type": ident["vcs_type"], "remote_url": ident["remote_url"],
              "shallow": is_shallow}

    if cache.get("_vcs_type") != ident["vcs_type"] or cache.get("_repo_id") != ident["remote_url"]:
        cache = {"_vcs_type": ident["vcs_type"], "_repo_id": ident["remote_url"],
                 "_analyzed_head": None, "commits": {}}
    if not head_reachable(cache):
        cache = {"_vcs_type": ident["vcs_type"], "_repo_id": ident["remote_url"],
                 "_analyzed_head": None, "commits": {}}

    if is_shallow:
        status["history_status"] = "PARTIAL_SHALLOW"
    else:
        status["history_status"] = "COMPLETE"

    if not rebuild_only:
        log = run_git(["log", "--reverse", "--pretty=%H%x00%s%x00%ci", "HEAD"]).splitlines()
        new_revs = [l for l in log if l.split("\x00")[0] not in cache.get("commits", {})]
        for line in new_revs:
            parts = line.split("\x00")
            rev, subject, cdate = parts[0], parts[1], parts[2]
            is_initial = rev == run_git(["rev-list", "--max-parents=0", "HEAD"]).splitlines()[0] if False else (len(run_git(["rev-list", "--parents", "-n", "1", rev]).strip().split()) == 1)
            body = run_git(["log", "-1", "--format=%b", rev]).strip()
            prod_files, diff = get_commit_diffs(rev)
            record = {
                "revision_id": rev,
                "subject": subject,
                "body": body[:2000],
                "commit_date": cdate,
                "is_initial": is_initial,
                "prod_files": prod_files,
                "prod_diff": diff,
                "analysis": [],
                "filtered": (not prod_files),
                "filter_reason": "no production files" if not prod_files else "",
                "analyzed_at": now_iso(),
            }
            cache["commits"][rev] = record
            print(f"cached {rev[:8]} {subject[:60]} files={len(prod_files)} diff_lines={len(diff.splitlines())}")
        cache["_analyzed_head"] = run_git(["rev-parse", "HEAD"]).strip()
        save_cache(cache)

    # Rebuild output from cache (analysis records only)
    entries = []
    for rev, rec in cache.get("commits", {}).items():
        for a in rec.get("analysis", []):
            e = dict(a)
            e["revision_id"] = rev
            e.setdefault("history", [])
            entries.append(e)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        for e in entries:
            f.write(json.dumps(e, ensure_ascii=False) + "\n")
    with open(STATUS_FILE, "w", encoding="utf-8") as f:
        json.dump(status, f, indent=2)
    print(f"wrote {len(entries)} entries -> {OUTPUT_FILE}")

if __name__ == "__main__":
    analyze_and_extract(rebuild_only="--rebuild" in sys.argv)
