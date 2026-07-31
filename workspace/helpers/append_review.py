# MANTIS_HELPER_VERSION = 2
#!/usr/bin/env python3
"""Appends reviewer verdict fields to a finding JSON (idempotent per pass+snapshot)."""
import json
import os
import sys

WORKSPACE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FINDINGS = os.path.join(WORKSPACE, "findings")

def main():
    fid, status, reasoning, ts, pass_number = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4], int(sys.argv[5])
    snapshot = sys.argv[6] if len(sys.argv) > 6 else ""
    repro_hints = None
    checklist = None
    code_paths = None
    for i, a in enumerate(sys.argv):
        if a == "--repro_hints":
            repro_hints = json.loads(sys.argv[i + 1])
        elif a == "--checklist":
            checklist = json.loads(sys.argv[i + 1])
        elif a == "--code_paths":
            code_paths = json.loads(sys.argv[i + 1])

    path = os.path.join(FINDINGS, fid + ".json")
    if not os.path.exists(path):
        print(f"missing {fid}")
        sys.exit(1)
    with open(path, encoding="utf-8") as f:
        doc = json.load(f)

    for h in doc.get("history", []):
        if h.get("stage") == "reviewer" and h.get("pass_number") == pass_number and h.get("snapshot", "") == snapshot:
            print(f"skip {fid}: already reviewed")
            return

    doc["status"] = status
    doc["reasoning"] = reasoning
    if repro_hints is not None:
        doc["repro_hints"] = repro_hints
    if checklist is not None:
        doc["triage_checklist"] = checklist
    if code_paths is not None:
        doc["code_paths"] = code_paths
    doc.setdefault("history", []).append({
        "stage": "reviewer",
        "action": "reviewed",
        "details": f"Determined status as {status}: {reasoning[:300]}",
        "pass_number": pass_number,
        "snapshot": snapshot,
        "timestamp": ts,
    })
    with open(path, "w", encoding="utf-8") as f:
        json.dump(doc, f, indent=2, ensure_ascii=False)
    print(f"updated {fid} -> {status}")

if __name__ == "__main__":
    main()
