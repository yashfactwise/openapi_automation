#!/usr/bin/env python3
"""
Factwise Bulk Contract Upload Script
- Reads xlsx/csv from same folder
- Lets user pick file + sheet
- Batches 30 contracts at a time -> async bulk create API
- Polls status URL until done, saves result per contract
- Resumes from last saved state if interrupted
"""

import os
import sys
import json
import time
import glob
import signal
import requests
import pandas as pd
from datetime import datetime, date, timedelta

# ─── CONFIG ───────────────────────────────────────────────────────────────────
# LOCAL TEST BUILD — hits a local backend, not AWS prod. Host + headers come
# from local_config.py one level up (set FW_LOCAL_HOST env var or edit that file).
import sys as _sys, os as _os
_sys.path.insert(0, _os.path.dirname(_os.path.dirname(_os.path.abspath(__file__))))
from local_config import BASE_URL, get_headers, banner
BATCH_SIZE  = 15
POLL_INTERVAL = 3    # seconds between status polls (fast for LOCAL testing)
POLL_TIMEOUT  = 300  # max seconds to wait for a batch (local jobs finish in seconds)

DRY_RUN     = False  # Set True to save payloads without hitting the API

STATE_FILE_BASE = "upload_state"
import glob as _glob_runsuffix
def _compute_run_suffix():
    """Auto-pick the next run number so files never overwrite a prior run.
    Looks for existing upload_results_run*.json in this script's folder and
    returns '_runN' for the next N (run1 if none exist)."""
    _here = os.path.dirname(__file__)
    _existing = _glob_runsuffix.glob(os.path.join(_here, "upload_results_run*.json"))
    _nums = []
    for _p in _existing:
        _b = os.path.basename(_p)
        try:
            _nums.append(int(_b.replace("upload_results_run", "").replace(".json", "")))
        except ValueError:
            pass
    _n = (max(_nums) + 1) if _nums else 1
    return f"_run{_n}", _n

RUN_SUFFIX, RUN_NUMBER = _compute_run_suffix()
STATE_FILE  = os.path.join(os.path.dirname(__file__), f"{STATE_FILE_BASE}{RUN_SUFFIX}.json")

# ─── HELPERS ──────────────────────────────────────────────────────────────────

# get_headers() is imported from local_config (local mode, no prod keys)

def excel_date_to_str(val):
    """Convert Excel serial date or string date to YYYY-MM-DD."""
    if val is None or val == "" or (isinstance(val, float) and pd.isna(val)):
        return None
    if isinstance(val, (datetime, date)):
        return val.strftime("%Y-%m-%d")
    if isinstance(val, str):
        val = val.strip()
        if not val:
            return None
        # Strip time component if present (e.g. "2022-01-01 00:00:00")
        if " " in val:
            val = val.split(" ")[0]
        for fmt in ("%Y-%m-%d", "%d/%m/%Y", "%m/%d/%Y", "%d-%m-%Y", "%m-%d-%Y",
                    "%d/%m/%y", "%m/%d/%y", "%Y/%m/%d", "%d.%m.%Y", "%d.%m.%y"):
            try:
                return datetime.strptime(val, fmt).strftime("%Y-%m-%d")
            except ValueError:
                pass
        return val  # pass through as-is if unrecognised
    if isinstance(val, (int, float)):
        try:
            from openpyxl.utils.datetime import from_excel
            return from_excel(int(val)).strftime("%Y-%m-%d")
        except Exception:
            base = datetime(1899, 12, 30)
            return (base + pd.Timedelta(days=int(val))).strftime("%Y-%m-%d")
    return str(val)

def normalise_date(val):
    """Wrapper that also handles pandas string-ified serials like '46054.0'."""
    if isinstance(val, str):
        val = val.strip()
        # pandas reads Excel serials as "46054.0" with dtype=str
        try:
            f = float(val)
            if f > 1000:  # looks like a serial, not a real number
                return excel_date_to_str(f)
        except ValueError:
            pass
    return excel_date_to_str(val)

def parse_json_field(val):
    """Parse a field that might be a JSON string, or return empty list."""
    if val is None or val == "" or (isinstance(val, float) and pd.isna(val)):
        return []
    if isinstance(val, list):
        return val
    try:
        parsed = json.loads(str(val))
        return parsed if isinstance(parsed, list) else [parsed]
    except Exception:
        return []

def safe_str(val):
    if val is None or (isinstance(val, float) and pd.isna(val)):
        return None
    s = str(val).strip()
    return s if s else None

def safe_float(val):
    if val is None or val == "" or (isinstance(val, float) and pd.isna(val)):
        return None
    try:
        # %.10g gives the shortest representation that round-trips correctly,
        # stripping Excel float noise (e.g. 9.091000000000001 → 9.091)
        return float('%.10g' % float(val))
    except Exception:
        return None

def safe_int(val):
    f = safe_float(val)
    return int(f) if f is not None else None


def parse_payment_terms(val):
    """Returns {"term": int, "period": str, "applied_from": str} or None."""
    if val is None or val == "" or (isinstance(val, float) and pd.isna(val)):
        return None
    if isinstance(val, dict):
        return val
    try:
        parsed = json.loads(str(val))
        if isinstance(parsed, dict):
            return parsed
    except Exception:
        pass
    return None

def _coerce_contract_dates(start, end):
    """Keep the sheet's dates, but ensure end is STRICTLY AFTER start (backend
    requirement). Rules:
      - end > start (and not a 9999 sentinel)  -> keep both as-is
      - end <= start, OR end year >= 9999      -> end = start + 1 day
    Inputs/outputs are 'YYYY-MM-DD' strings (or None). Unparseable start is
    passed through unchanged."""
    if not start:
        return start, end
    try:
        s = datetime.strptime(start, "%Y-%m-%d").date()
    except Exception:
        return start, end  # can't parse start -> leave as-is

    e = None
    if end:
        try:
            e = datetime.strptime(end, "%Y-%m-%d").date()
        except Exception:
            e = None

    # 9999 (or any >2100) end is an SAP "open-ended" sentinel -> treat as invalid
    if e is not None and e.year >= 2100:
        e = None

    if e is None or e <= s:
        e = s + timedelta(days=1)

    return s.strftime("%Y-%m-%d"), e.strftime("%Y-%m-%d")


def parse_vendor_identifications(val):
    """Returns list of {"identification_name": str, "identification_value": str}."""
    if val is None or val == "" or (isinstance(val, float) and pd.isna(val)):
        return []
    if isinstance(val, list):
        return val
    try:
        parsed = json.loads(str(val))
        if isinstance(parsed, list):
            return parsed
        if isinstance(parsed, dict):
            return [parsed]
    except Exception:
        pass
    return []

def row_to_contract(row):
    """Convert a DataFrame row (dict) to contract payload dict."""

    def g(col):
        return row.get(col)

    # Pricing tier
    tier = {
        "rate": safe_float(g("contract_items[0].pricing_tiers[0].rate")),
        "min_quantity": safe_float(g("contract_items[0].pricing_tiers[0].min_quantity")) or 0,
        "max_quantity": safe_float(g("contract_items[0].pricing_tiers[0].max_quantity")) or 0,
        "additional_costs": parse_json_field(g("contract_items[0].pricing_tiers[0].additional_costs")),
        "taxes": parse_json_field(g("contract_items[0].pricing_tiers[0].taxes")),
        "discounts": parse_json_field(g("contract_items[0].pricing_tiers[0].discounts")),
    }
    if tier["rate"] is None:
        tier["rate"] = 0.0

    # Item
    item_incoterm = safe_str(g("contract_items[0].incoterm")) or "NA"
    item = {
        "ERP_item_code": safe_str(g("contract_items[0].ERP_item_code")),
        "factwise_item_code": safe_str(g("contract_items[0].factwise_item_code")),
        "currency_code_id": safe_str(g("contract_items[0].currency_code_id")),
        "measurement_unit_id": safe_str(g("contract_items[0].measurement_unit_id")),
        "attributes": parse_json_field(g("contract_items[0].attributes")),
        "prepayment_percentage": safe_float(g("contract_items[0].prepayment_percentage")) or 0,
        "payment_type": safe_str(g("contract_items[0].payment_type")),
        "payment_terms": parse_payment_terms(g("contract_items[0].payment_terms")),
        "deliverables_payment_terms": parse_json_field(g("contract_items[0].deliverables_payment_terms")),
        "incoterm": item_incoterm,
        "lead_time": safe_float(g("contract_items[0].lead_time")),
        "lead_time_period": safe_str(g("contract_items[0].lead_time_period")),
        "pricing_tiers": [tier],
        "attachments": parse_json_field(g("contract_items[0].attachments")),
        "custom_sections": parse_json_field(g("contract_items[0].custom_sections")),
    }

    # vendor_address: always an object (address_id + full_address), never omitted
    raw_addr = safe_str(g("vendor_address"))
    if raw_addr:
        try:
            vendor_address = json.loads(raw_addr)
            if not isinstance(vendor_address, dict):
                vendor_address = {"address_id": None, "full_address": raw_addr}
        except Exception:
            vendor_address = {"address_id": None, "full_address": raw_addr}
    else:
        vendor_address = {"address_id": None, "full_address": None}

    contract_incoterm = safe_str(g("incoterm")) or "NA"

    # Dates: backend requires end STRICTLY AFTER start. Many sheet rows have
    # end == start (or end < start), so when that happens we bump the end date
    # to start + 1 year (a sensible default contract term).
    _start, _end = _coerce_contract_dates(normalise_date(g("contract_start_date")),
                                          normalise_date(g("contract_end_date")))

    # Contract
    contract = {
        "created_by_user_email": safe_str(g("created_by_user_email")),
        "contract_name": safe_str(g("contract_name")),
        "ERP_contract_id": safe_str(g("ERP_contract_id")),
        "contract_start_date": _start,
        "contract_end_date": _end,
        "entity_name": safe_str(g("entity_name")),
        "status": safe_str(g("status")),
        "template_name": safe_str(g("template_name")),
        "buyer_identifications": parse_json_field(g("buyer_identifications")),
        "buyer_address": safe_str(g("buyer_address")),
        "buyer_contact": safe_str(g("buyer_contact")),
        "factwise_vendor_code": safe_str(g("factwise_vendor_code")),
        "ERP_vendor_code": safe_str(g("ERP_vendor_code")),
        "vendor_identifications": parse_vendor_identifications(g("vendor_identifications")),
        "vendor_contact": safe_str(g("vendor_contact")) or "abc@gmail.com",
        "vendor_address": vendor_address,
        "project": safe_str(g("project")),
        "additional_costs": [],
        "taxes": [],
        "discounts": [],
        "prepayment_percentage": safe_float(g("prepayment_percentage")) or 0,
        "payment_type": safe_str(g("payment_type")),
        "payment_terms": parse_payment_terms(g("payment_terms")),
        "deliverables_payment_terms": parse_json_field(g("deliverables_payment_terms")),
        "incoterm": contract_incoterm,
        "lead_time": safe_float(g("lead_time")),
        "lead_time_period": safe_str(g("lead_time_period")),
        "custom_sections": parse_json_field(g("custom_sections")),
        "attachments": parse_json_field(g("attachments")),
        "terms_and_conditions": None,
        "contract_items": [item],
    }

    return contract

def load_state():
    if os.path.exists(STATE_FILE):
        with open(STATE_FILE, "r") as f:
            return json.load(f)
    return {"completed_batches": [], "results": [], "last_batch_start": 0}

def save_state(state):
    with open(STATE_FILE, "w") as f:
        json.dump(state, f, indent=2)

def write_failure_report(folder, results):
    """Write a Markdown report of every contract that did NOT succeed (failed /
    send_error / parse_error / timeout / skipped), grouped by reason with counts.
    Saved as upload_failures_runN.md next to the script. Returns the path, or
    None if everything succeeded."""
    from collections import OrderedDict, Counter
    failed = [r for r in results if r.get("status") != "success"]
    if not failed:
        return None

    groups = OrderedDict()
    for r in failed:
        key = (r.get("status", "failed"), (r.get("error") or "").strip() or "(no error message returned)")
        groups.setdefault(key, []).append(r)

    total = len(results)
    ok = sum(1 for r in results if r.get("status") == "success")
    status_counts = Counter(r.get("status", "failed") for r in failed)

    lines = []
    lines.append(f"# Contract Upload — Failure Report (RUN #{RUN_NUMBER})")
    lines.append("")
    lines.append(f"- Total contracts processed: **{total}**")
    lines.append(f"- Succeeded: **{ok}**")
    lines.append(f"- Did NOT succeed: **{len(failed)}**")
    lines.append("")
    lines.append("## Breakdown by status")
    lines.append("")
    lines.append("| status | count |")
    lines.append("|---|---|")
    for st, cnt in status_counts.most_common():
        lines.append(f"| {st} | {cnt} |")
    lines.append("")
    lines.append("## Failures grouped by reason")
    lines.append("")
    for (st, err), rows in sorted(groups.items(), key=lambda kv: -len(kv[1])):
        lines.append(f"### [{st}] {err}  ({len(rows)} contract(s))")
        lines.append("")
        lines.append("| contract name | ERP vendor code | sheet row |")
        lines.append("|---|---|---|")
        for r in rows[:200]:  # cap per-group rows to keep the file readable
            lines.append(f"| {r.get('contract_name') or '-'} | {r.get('erp_vendor_code') or '-'} | {r.get('row','-')} |")
        if len(rows) > 200:
            lines.append(f"| ...and {len(rows)-200} more | | |")
        lines.append("")

    path = os.path.join(folder, f"upload_failures{RUN_SUFFIX}.md")
    with open(path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    return path

def poll_task(task_id):
    """Poll task status until done. Returns final task response."""
    url = BASE_URL + f"api/tasks/{task_id}/"
    headers = get_headers()
    elapsed = 0
    while elapsed < POLL_TIMEOUT:
        time.sleep(POLL_INTERVAL)
        elapsed += POLL_INTERVAL
        try:
            resp = requests.get(url, headers=headers, timeout=30)
        except requests.exceptions.RequestException as e:
            print(f"  Network error polling task, retrying... ({e})")
            continue
        if resp.status_code == 404:
            print(f"  ⚠ Task {task_id} not found yet, retrying...")
            continue
        if resp.status_code in (502, 503, 504):
            print(f"  HTTP {resp.status_code} on poll, retrying...")
            continue
        resp.raise_for_status()
        try:
            data = resp.json()
        except Exception:
            print(f"  Non-JSON poll response, retrying... ({resp.text[:100]})")
            continue
        status = data.get("status", "")
        processed = data.get("processed", 0)
        total = data.get("total", 0)
        print(f"  Polling... status={status} processed={processed}/{total}", end="\r")
        if status in ("success", "failed", "completed"):
            print()
            return data
    raise TimeoutError(f"Task {task_id} did not complete within {POLL_TIMEOUT}s")

def poll_task_and_save(task_id, batch_num, sheet):
    data = poll_task(task_id)
    save_response(batch_num, sheet, data)
    return data

PAYLOADS_DIR   = os.path.join(os.path.dirname(__file__), "payloads")
RESPONSES_DIR  = os.path.join(os.path.dirname(__file__), "responses")

def save_payload(batch_num, sheet, contracts):
    """Save batch payload as pretty JSON for debugging."""
    os.makedirs(PAYLOADS_DIR, exist_ok=True)
    safe_sheet = str(sheet).replace("/", "-").replace("\\", "-")
    filename = f"batch_{safe_sheet}_{batch_num:04d}{RUN_SUFFIX}.json"
    path = os.path.join(PAYLOADS_DIR, filename)
    with open(path, "w") as f:
        json.dump({"contracts": contracts}, f, indent=2, default=str)
    print(f"  Payload saved → payloads/{filename}")

def save_response(batch_num, sheet, data):
    """Save raw API response exactly as received."""
    os.makedirs(RESPONSES_DIR, exist_ok=True)
    safe_sheet = str(sheet).replace("/", "-").replace("\\", "-")
    filename = f"response_{safe_sheet}_{batch_num:04d}{RUN_SUFFIX}.json"
    path = os.path.join(RESPONSES_DIR, filename)
    with open(path, "w") as f:
        json.dump(data, f, indent=2)
    print(f"  Response saved → responses/{filename}")

def fire_batch(contracts, batch_num=0, sheet=None):
    """Send a batch of contracts. Returns (task_id, results_if_sync)."""
    save_payload(batch_num, sheet or "unknown", contracts)
    if DRY_RUN:
        print(f"  [DRY RUN] Skipping API call — payload saved only")
        return None, {"successful_count": 0, "failed_count": 0, "success": [], "failed": []}
    url = BASE_URL + "api/contract/bulk-create/"
    headers = get_headers()
    payload = {"contracts": contracts}
    try:
        resp = requests.post(url, json=payload, headers=headers, timeout=120)
    except requests.exceptions.RequestException as e:
        raise RuntimeError(f"Network error sending batch: {e}") from e

    if resp.status_code == 202:
        # Async
        try:
            data = resp.json()
        except Exception:
            raise RuntimeError(f"202 response but non-JSON body: {resp.text[:300]}")
        task_id = data.get("task_id")
        print(f"  → Async task_id: {task_id}")
        return task_id, None
    elif resp.status_code == 207:
        # Sync (< 30 contracts)
        try:
            data = resp.json()
        except Exception:
            raise RuntimeError(f"207 response but non-JSON body: {resp.text[:300]}")
        print(f"  → Sync response: {data.get('successful_count',0)} ok, {data.get('failed_count',0)} failed")
        save_response(batch_num, sheet or "unknown", data)
        return None, data
    else:
        print(f"  ✗ HTTP {resp.status_code}: {resp.text[:300]}")
        resp.raise_for_status()

def ask(prompt):
    return input(prompt).strip()

def retry_failed(state):
    """Retry all failed entries in state that have a saved _payload."""
    failed_entries = [r for r in state["results"] if r.get("status") in ("failed", "send_error") and r.get("_payload")]
    if not failed_entries:
        print("  No retryable failed contracts found.")
        return

    print(f"\n  Retrying {len(failed_entries)} failed contract(s)...")
    contracts = [e["_payload"] for e in failed_entries]

    # Remove old failed entries so we replace them with retry results
    state["results"] = [r for r in state["results"] if not (r.get("status") in ("failed", "send_error") and r.get("_payload"))]

    batch_num = 9000  # retry batches use high numbers to avoid collision
    for i in range(0, len(contracts), BATCH_SIZE):
        chunk = contracts[i:i + BATCH_SIZE]
        batch_num += 1
        print(f"\n  Retry batch {batch_num - 9000}: {len(chunk)} contract(s)")
        try:
            task_id, sync_result = fire_batch(chunk, batch_num=batch_num, sheet="retry")
        except Exception as e:
            print(f"  ✗ Retry batch fire error: {e}")
            for c in chunk:
                state["results"].append({
                    "row": "retry",
                    "sheet": "retry",
                    "status": "send_error",
                    "error": str(e),
                    "contract_name": c.get("contract_name", ""),
                    "_payload": c,
                })
            continue

        if task_id:
            try:
                result = poll_task_and_save(task_id, batch_num, "retry")
            except TimeoutError as e:
                print(f"  ✗ {e}")
                result = {"status": "timeout", "success": [], "failed": []}
        else:
            result = sync_result

        successful = result.get("success") or result.get("successful") or []
        failed     = result.get("failed") or []

        for s in successful:
            ri = s.get("index", 0)
            state["results"].append({
                "row": "retry",
                "sheet": "retry",
                "status": "success",
                "contract_code": s.get("contract_code") or s.get("custom_contract_id"),
                "contract_id": s.get("contract_id"),
                "erp_contract_code": s.get("erp_contract_code"),
                "contract_name": chunk[ri].get("contract_name", "") if ri < len(chunk) else "",
            })
        for f in failed:
            ri = f.get("index", 0)
            state["results"].append({
                "row": "retry",
                "sheet": "retry",
                "status": "failed",
                "error": f.get("error", ""),
                "erp_contract_code": f.get("erp_contract_code"),
                "contract_name": chunk[ri].get("contract_name", "") if ri < len(chunk) else "",
                "_payload": chunk[ri] if ri < len(chunk) else None,
            })
        print(f"  Retry done — {len(successful)} success, {len(failed)} failed")
    save_state(state)

def pick_file(folder):
    files = glob.glob(os.path.join(folder, "*.xlsx")) + glob.glob(os.path.join(folder, "*.csv"))
    if not files:
        print("No xlsx/csv files found in", folder)
        sys.exit(1)
    if len(files) == 1:
        print(f"Using file: {os.path.basename(files[0])}")
        return files[0]
    print("\nFiles found:")
    for i, f in enumerate(files, 1):
        print(f"  {i}. {os.path.basename(f)}")
    choice = ask("Pick file number: ")
    return files[int(choice) - 1]

def pick_sheets(filepath):
    if filepath.endswith(".csv"):
        return [None]  # CSV has no sheets
    xl = pd.ExcelFile(filepath, engine="openpyxl")
    sheets = xl.sheet_names
    if len(sheets) == 1:
        print(f"Using sheet: {sheets[0]}")
        return sheets
    print("\nSheets available:")
    for i, s in enumerate(sheets, 1):
        print(f"  {i}. {s}")
    raw = ask("Enter sheet numbers to process (comma separated, e.g. 1,2,3): ")
    indices = [int(x.strip()) - 1 for x in raw.split(",")]
    selected = [sheets[i] for i in indices]
    print(f"Selected: {selected}")
    return selected

# ─── CTRL+C HANDLER ──────────────────────────────────────────────────────────

_current_state = None

def _handle_sigint(sig, frame):
    print("\n\n  Interrupted! Saving state before exit...")
    if _current_state is not None:
        save_state(_current_state)
        print(f"  State saved to {STATE_FILE} — you can resume next run.")
    sys.exit(0)

signal.signal(signal.SIGINT, _handle_sigint)

# ─── MAIN ─────────────────────────────────────────────────────────────────────

def main():
    folder = os.path.dirname(os.path.abspath(__file__))

    print("=" * 60)
    print("  Factwise Bulk Contract Upload")
    print("  " + banner())
    print(f"  RUN #{RUN_NUMBER}  (outputs suffixed {RUN_SUFFIX})")
    print("=" * 60)

    # File + sheet
    filepath = pick_file(folder)
    sheets   = pick_sheets(filepath)

    # Load resume state
    global _current_state
    state = load_state()
    _current_state = state
    if state.get("results") or state.get("last_batch_start", 0) > 0:
        last_sheet = state.get("current_sheet", "?")
        last_row   = state.get("last_batch_start", 0)
        done       = len(state.get("results", []))
        resume = ask(f"\nResume state found — {done} results saved, last at sheet='{last_sheet}' row={last_row}. Resume? (y/n): ")
        if resume.lower() != "y":
            state = {"completed_sheets": [], "current_sheet": None, "last_batch_start": 0, "results": []}
            save_state(state)
            _current_state = state
        else:
            prev_failed = [r for r in state.get("results", []) if r.get("status") in ("failed", "send_error") and r.get("_payload")]
            if prev_failed:
                do_retry = ask(f"  {len(prev_failed)} contract(s) failed in previous run. Retry those before continuing? (y/n): ")
                if do_retry.lower() == "y":
                    retry_failed(state)

    completed_sheets = state.get("completed_sheets", [])

    # Process each sheet
    for sheet in sheets:
        if sheet in completed_sheets:
            print(f"\nSkipping sheet '{sheet}' (already completed)")
            continue

        print(f"\n{'='*60}")
        print(f"Processing sheet: {sheet or 'CSV'}")
        print(f"{'='*60}")

        if filepath.endswith(".csv"):
            df = pd.read_csv(filepath, dtype=str, keep_default_na=False)
        else:
            df = pd.read_excel(filepath, sheet_name=sheet, dtype=str,
                               keep_default_na=False, engine="openpyxl")

        # Drop fully empty rows (key off contract_name / column 0).
        df = df[df.iloc[:, 0].str.strip() != ""].reset_index(drop=True)
        total_rows = len(df)
        print(f"Total rows: {total_rows}")

        # Resume within this sheet if it matches saved state
        if state.get("current_sheet") == sheet:
            start = state.get("last_batch_start", 0)
        else:
            start = 0
            state["current_sheet"] = sheet
            state["last_batch_start"] = 0
            save_state(state)

        if start > 0:
            print(f"Resuming from row {start}...")

        batch_num = start // BATCH_SIZE
        i = start
        while i < total_rows:
            batch_end = min(i + BATCH_SIZE, total_rows)
            batch_rows = df.iloc[i:batch_end]
            batch_num += 1

            print(f"\nBatch {batch_num}: rows {i+1}–{batch_end} ({batch_end - i} contracts)")

            contracts = []
            row_indices = []
            for idx, row in batch_rows.iterrows():
                rd = row.to_dict()
                try:
                    c = row_to_contract(rd)
                    contracts.append(c)
                    row_indices.append(i + len(contracts) - 1)
                except Exception as e:
                    print(f"  ✗ Row {idx+2} parse error: {e}")
                    state["results"].append({
                        "row": idx + 2,
                        "sheet": sheet,
                        "status": "parse_error",
                        "error": str(e),
                        "contract_name": row.get("contract_name", ""),
                    })

            if not contracts:
                i = batch_end
                state["current_sheet"] = sheet
                state["last_batch_start"] = i
                save_state(state)
                continue

            # Fire batch
            try:
                task_id, sync_result = fire_batch(contracts, batch_num=batch_num, sheet=sheet)
            except Exception as e:
                print(f"  ✗ Batch fire error: {e}")
                # Save all as failed so we can retry
                for ri, c in enumerate(contracts):
                    state["results"].append({
                        "row": row_indices[ri] + 2,
                        "sheet": sheet,
                        "status": "send_error",
                        "error": str(e),
                        "contract_name": c.get("contract_name", ""),
                        "_payload": c,
                    })
                i = batch_end
                state["last_batch_start"] = i
                save_state(state)
                continue

            # Handle async (task_id) or sync (sync_result)
            if task_id:
                try:
                    result = poll_task_and_save(task_id, batch_num, sheet)
                except TimeoutError as e:
                    print(f"  ✗ {e}")
                    result = {"status": "timeout", "success": [], "failed": []}
            else:
                result = sync_result

            # Record results
            successful = result.get("success") or result.get("successful") or []
            failed     = result.get("failed") or []

            for s in successful:
                ri = s.get("index", 0)
                state["results"].append({
                    "row": row_indices[ri] + 2 if ri < len(row_indices) else "?",
                    "sheet": sheet,
                    "status": "success",
                    "contract_code": s.get("contract_code") or s.get("custom_contract_id"),
                    "contract_id": s.get("contract_id"),
                    "erp_contract_code": s.get("erp_contract_code"),
                    "contract_name": contracts[ri].get("contract_name", "") if ri < len(contracts) else "",
                })

            for f in failed:
                ri = f.get("index", 0)
                state["results"].append({
                    "row": row_indices[ri] + 2 if ri < len(row_indices) else "?",
                    "sheet": sheet,
                    "status": "failed",
                    "error": f.get("error", ""),
                    "erp_contract_code": f.get("erp_contract_code"),
                    "contract_name": contracts[ri].get("contract_name", "") if ri < len(contracts) else "",
                    "_payload": contracts[ri] if ri < len(contracts) else None,
                })

            s_count = len(successful)
            f_count = len(failed)
            print(f"  ✓ Batch done — {s_count} success, {f_count} failed")

            i = batch_end
            state["current_sheet"] = sheet
            state["last_batch_start"] = i
            save_state(state)

        # Mark sheet fully done so resume skips it
        if sheet not in completed_sheets:
            completed_sheets.append(sheet)
        state["completed_sheets"] = completed_sheets
        state["last_batch_start"] = 0
        state["current_sheet"] = None
        save_state(state)
        print(f"\n✓ Sheet '{sheet}' complete")

    # Retry failed at end of run
    end_failed = [r for r in state["results"] if r.get("status") in ("failed", "send_error") and r.get("_payload")]
    if end_failed:
        do_retry = ask(f"\n{len(end_failed)} contract(s) failed. Retry them now? (y/n): ")
        if do_retry.lower() == "y":
            retry_failed(state)

    # Final summary
    results = state["results"]
    total   = len(results)
    ok      = sum(1 for r in results if r["status"] == "success")
    fail    = total - ok

    print(f"\n{'='*60}")
    print(f"  DONE — {ok}/{total} contracts successful, {fail} failed/errored")
    print(f"  Full results saved to: {STATE_FILE}")
    print(f"{'='*60}\n")

    # Also save a clean CSV summary
    summary_file = os.path.join(folder, f"upload_results{RUN_SUFFIX}.json")
    with open(summary_file, "w") as f:
        json.dump(results, f, indent=2)
    print(f"Results also saved to: {summary_file}")

    # Markdown failure report (grouped by reason) for quick review
    report = write_failure_report(folder, results)
    if report:
        print(f"Failure report: {report}")

if __name__ == "__main__":
    main()
