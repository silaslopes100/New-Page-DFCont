# MANTIS_HELPER_VERSION = 2
"""Mantis calibrate helper: append calibration fields + history entry to a finding.

Usage: python append_calibrate.py <finding_id> <params.json>

params.json keys (all optional except the score fields):
  impact_score, likelihood_score, availability_tier, inferred_exposure,
  attacker_position, mantis_risk_score, priority, sanity_triage_applied,
  calibration_checklist, outrage_commentary, executive_summary,
  history_details (str), pass_number (int)
MODE-OFF runs omit the snapshot key from the history entry.
"""
import json
import sys
import datetime

FINDINGS_DIR = r"D:\New Page DFCont\workspace\findings"

def main():
    fid, params_path = sys.argv[1], sys.argv[2]
    with open(params_path, encoding="utf-8") as f:
        p = json.load(f)
    path = FINDINGS_DIR + "\\" + fid + ".json"
    with open(path, encoding="utf-8") as f:
        fnd = json.load(f)
    for key in ("impact_score", "likelihood_score", "availability_tier",
                "inferred_exposure", "attacker_position", "mantis_risk_score",
                "priority", "sanity_triage_applied", "calibration_checklist",
                "outrage_commentary", "executive_summary"):
        if key in p:
            fnd[key] = p[key]
    entry = {
        "stage": "calibrate",
        "action": "calibrated",
        "details": p.get("history_details",
                         "Calculated risk score as %s and priority as %s."
                         % (p.get("mantis_risk_score"), p.get("priority"))),
        "pass_number": p.get("pass_number", 1),
        "timestamp": datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
    }
    fnd.setdefault("history", []).append(entry)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(fnd, f, indent=2, ensure_ascii=False)
    print("calibrated:", fid, p.get("mantis_risk_score"), p.get("priority"))

if __name__ == "__main__":
    main()
