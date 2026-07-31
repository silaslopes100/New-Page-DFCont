# MANTIS_HELPER_VERSION = 2
#!/usr/bin/env python3
"""Deterministic merge helper for mantis-dedupe. Merges duplicate findings in
workspace/findings/ into primaries, trashes duplicates, logs transactions.

Only pairs listed in workspace/merge_plan.json are processed (written by the
dedupe stage). Refuses to merge findings with differing discovery_commit.
"""
import json
import os
import uuid
from datetime import datetime, timezone

WORKSPACE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FINDINGS = os.path.join(WORKSPACE, "findings")
TRASH = os.path.join(FINDINGS, ".trash")
TXLOG = os.path.join(WORKSPACE, ".tx_log.jsonl")
PLAN = os.path.join(WORKSPACE, "merge_plan.json")

PRIV_PRIORITY = {"NONE": 0, "LOW": 1, "HIGH": 2}
POS_PRIORITY = {
    "EXTERNAL": 0, "INTERNAL_NETWORK": 1, "IN_CLUSTER": 2, "LOCAL": 3,
    "HOST_SYSTEM": 4, "SUPPLY_CHAIN": 5, "PHYSICAL_TEMPORARY": 6,
    "PHYSICAL_LONG_TERM": 7,
}
UI_PRIORITY = {"NONE": 0, "REQUIRED": 1}
SEV_PRIORITY = {"CRITICAL": 0, "HIGH": 1, "MEDIUM": 2, "LOW": 3}

def log_tx(record):
    with open(TXLOG, "a", encoding="utf-8") as f:
        f.write(json.dumps(record) + "\n")

def merge(primary, dups):
    if primary.get("discovery_commit") != dups[0].get("discovery_commit"):
        return None
    sev = min([p.get("severity", "LOW") for p in [primary] + dups],
              key=lambda s: SEV_PRIORITY.get(s, 99))
    priv = min([p.get("privileges_required", "HIGH") for p in [primary] + dups],
               key=lambda s: PRIV_PRIORITY.get(s, 99))
    pos = min([p.get("attacker_position", "EXTERNAL") for p in [primary] + dups],
              key=lambda s: POS_PRIORITY.get(s, 99))
    ui = min([p.get("user_interaction", "REQUIRED") for p in [primary] + dups],
             key=lambda s: UI_PRIORITY.get(s, 99))
    paths = []
    for p in [primary] + dups:
        for c in p.get("code_paths", []):
            if c not in paths:
                paths.append(c)
    desc = " ".join(p.get("description", "") for p in [primary] + dups if p.get("description"))
    mitig = " ".join(p.get("mitigation", "") for p in [primary] + dups if p.get("mitigation"))
    impact = " ".join(p.get("impact", "") for p in [primary] + dups if p.get("impact"))
    history = []
    for p in [primary] + dups:
        history.extend(p.get("history", []))
    history.append({
        "stage": "dedupe", "action": "merge",
        "details": "Merged duplicate findings: " + ", ".join(d.get("id", "") for d in dups),
        "pass_number": 1,
        "timestamp": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%fZ"),
    })
    merged = dict(primary)
    merged["severity"] = sev
    merged["privileges_required"] = priv
    merged["attacker_position"] = pos
    merged["user_interaction"] = ui
    merged["code_paths"] = paths
    merged["description"] = desc
    merged["mitigation"] = mitig
    merged["impact"] = impact
    merged["history"] = history
    return merged

def main():
    os.makedirs(TRASH, exist_ok=True)
    if not os.path.exists(PLAN):
        print("no merge_plan.json; nothing to merge")
        return
    with open(PLAN, encoding="utf-8") as f:
        plan = json.load(f)
    if not plan.get("groups"):
        print("no merge groups")
        return
    for group in plan["groups"]:
        primary_id = group["primary"]
        dup_ids = group["duplicates"]
        try:
            with open(os.path.join(FINDINGS, primary_id + ".json"), encoding="utf-8") as f:
                primary = json.load(f)
        except OSError:
            print(f"skip group: missing primary {primary_id}")
            continue
        dups = []
        for did in dup_ids:
            try:
                with open(os.path.join(FINDINGS, did + ".json"), encoding="utf-8") as f:
                    dups.append(json.load(f))
            except OSError:
                print(f"skip group: missing duplicate {did}")
                break
        else:
            merged = merge(primary, dups)
            if merged is None:
                print(f"REFUSED merge (discovery_commit differs): {primary_id} + {dup_ids}")
                continue
            with open(os.path.join(FINDINGS, primary_id + ".json"), "w", encoding="utf-8") as f:
                json.dump(merged, f, indent=2, ensure_ascii=False)
            for d in dups:
                d["status"] = "DUPLICATE"
                d["duplicate_of"] = primary_id
                d.pop("possible_duplicate_of", None)
                if "lineage_id" not in d and primary.get("lineage_id"):
                    d["lineage_id"] = primary["lineage_id"]
                with open(os.path.join(FINDINGS, d["id"] + ".json"), "w", encoding="utf-8") as f:
                    json.dump(d, f, indent=2, ensure_ascii=False)
                os.replace(os.path.join(FINDINGS, d["id"] + ".json"),
                           os.path.join(TRASH, d["id"] + ".json"))
                log_tx({
                    "timestamp": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
                    "action": "dedupe_merge",
                    "primary_uuid": primary_id,
                    "moved_uuid": d["id"],
                })
                print(f"merged {d['id']} -> {primary_id}")

if __name__ == "__main__":
    main()
