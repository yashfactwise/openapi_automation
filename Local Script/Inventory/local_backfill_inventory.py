"""
Factwise Bulk Inventory Backfill Script
- Reads xlsx/csv from same folder
- Lets user pick file + sheet
- Batches inventory entries at a time -> PATCH /api/inventory/bulk-update/
- Endpoint is synchronous (HTTP 207 multi-status) — no task polling
- Saves payload + response per batch, resumes from last saved state if interrupted

Mirrors syrma_prod_create_po.py. Differences:
- Target endpoint is the inventory ledger bulk endpoint (append-only history).
- Each sheet row -> one inventory entry (no PO grouping).
- Response is always sync 207 (the inventory endpoint has no async/task path).

Expected sheet columns (friendly headers, like the PO script):
    Creator Email          -> modified_by_user_email   (required)
    Item ERP Code          -> ERP_item_code            (exactly one of ERP / Factwise)
    Item Factwise Code     -> factwise_item_code
    Current Stock          -> current_stock            (at least one of current/required)
    Required Stock         -> required_stock
    Current Stock Date     -> current_stock_date        (optional; defaults to now server-side)
    Required Stock Date    -> required_stock_date        (optional)
    Shipping Address       -> shipping_address           (optional; address NICKNAME, resolved server-side)
"""

import os
import sys
import json
import glob
import signal
import requests
import pandas as pd
from datetime import datetime, date

# ─── CONFIG ───────────────────────────────────────────────────────────────────
# LOCAL TEST BUILD — hits a local backend, not AWS prod. Host + headers come
# from local_config.py one level up (set FW_LOCAL_HOST env var or edit that file).
import sys as _sys, os as _os
_sys.path.insert(0, _os.path.dirname(_os.path.dirname(_os.path.abspath(__file__))))
from local_config import BASE_URL, get_headers, banner
BATCH_SIZE  = 50

DRY_RUN     = False  # Set True to save payloads without hitting the API

STATE_FILE  = os.path.join(os.path.dirname(__file__), "inventory_upload_state.json")

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
        if " " in val:
            val = val.split(" ")[0]
        for fmt in ("%Y-%m-%d", "%d/%m/%Y", "%m/%d/%Y", "%d-%m-%Y", "%m-%d-%Y",
                    "%d/%m/%y", "%m/%d/%y", "%Y/%m/%d", "%d.%m.%Y", "%d.%m.%y"):
            try:
                return datetime.strptime(val, fmt).strftime("%Y-%m-%d")
            except ValueError:
                pass
        return val
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
        try:
            f = float(val)
            if f > 1000:
                return excel_date_to_str(f)
        except ValueError:
            pass
    return excel_date_to_str(val)

def safe_str(val):
    if val is None or (isinstance(val, float) and pd.isna(val)):
        return None
    s = str(val).strip()
    return s if s else None

def safe_float(val):
    if val is None or val == "" or (isinstance(val, float) and pd.isna(val)):
        return None
    try:
        return float('%.10g' % float(val))
    except Exception:
        return None

# ─── ROW TO ENTRY ─────────────────────────────────────────────────────────────

def row_to_entry(row):
    """Convert a DataFrame row (dict) to one inventory entry payload dict.

    Only includes keys that have a value, so omitted dates default to the
    request time server-side and an omitted stock is carried over from the
    item's previous entry.
    """
    def g(col):
        return row.get(col)

    erp_code      = safe_str(g("Item ERP Code"))
    factwise_code = safe_str(g("Item Factwise Code"))
    # Prefer factwise; never send both (the endpoint requires exactly one).
    if factwise_code:
        erp_code = None

    entry = {
        "modified_by_user_email": safe_str(g("Creator Email")),
    }
    if erp_code:
        entry["ERP_item_code"] = erp_code
    if factwise_code:
        entry["factwise_item_code"] = factwise_code

    current_stock  = safe_float(g("Current Stock"))
    required_stock = safe_float(g("Required Stock"))
    if current_stock is not None:
        entry["current_stock"] = current_stock
    if required_stock is not None:
        entry["required_stock"] = required_stock

    # Dates: only send alongside their own value (endpoint rejects a dangling
    # date). If the value is present but the date is missing, server defaults
    # the date to the request time.
    current_stock_date  = normalise_date(g("Current Stock Date"))
    required_stock_date = normalise_date(g("Required Stock Date"))
    if current_stock is not None and current_stock_date:
        entry["current_stock_date"] = current_stock_date
    if required_stock is not None and required_stock_date:
        entry["required_stock_date"] = required_stock_date

    shipping_address = safe_str(g("Shipping Address"))
    if shipping_address:
        entry["shipping_address"] = shipping_address

    return entry


def _entry_label(entry):
    """Human-readable id for logging / result tracking."""
    return entry.get("factwise_item_code") or entry.get("ERP_item_code") or "?"

# ─── STATE MANAGEMENT ────────────────────────────────────────────────────────

def load_state():
    if os.path.exists(STATE_FILE):
        with open(STATE_FILE, "r") as f:
            return json.load(f)
    return {"completed_sheets": [], "current_sheet": None, "last_batch_start": 0, "results": []}

def save_state(state):
    with open(STATE_FILE, "w") as f:
        json.dump(state, f, indent=2)

PAYLOADS_DIR   = os.path.join(os.path.dirname(__file__), "inventory_payloads")
RESPONSES_DIR  = os.path.join(os.path.dirname(__file__), "inventory_responses")

def save_payload(batch_num, sheet, entries):
    os.makedirs(PAYLOADS_DIR, exist_ok=True)
    safe_sheet = str(sheet).replace("/", "-").replace("\\", "-")
    filename = f"batch_{safe_sheet}_{batch_num:04d}.json"
    path = os.path.join(PAYLOADS_DIR, filename)
    with open(path, "w") as f:
        json.dump({"entries": entries}, f, indent=2, default=str)
    print(f"  Payload saved -> inventory_payloads/{filename}")

def save_response(batch_num, sheet, data):
    os.makedirs(RESPONSES_DIR, exist_ok=True)
    safe_sheet = str(sheet).replace("/", "-").replace("\\", "-")
    filename = f"response_{safe_sheet}_{batch_num:04d}.json"
    path = os.path.join(RESPONSES_DIR, filename)
    with open(path, "w") as f:
        json.dump(data, f, indent=2)
    print(f"  Response saved -> inventory_responses/{filename}")

def fire_batch(entries, batch_num=0, sheet=None):
    """Send a batch of inventory entries. Returns the sync result dict (207)."""
    save_payload(batch_num, sheet or "unknown", entries)
    if DRY_RUN:
        print(f"  [DRY RUN] Skipping API call - payload saved only")
        return {"successful_count": 0, "failed_count": 0, "successful": [], "failed": []}
    url = BASE_URL + "api/inventory/bulk-update/"
    headers = get_headers()
    payload = {"entries": entries}
    try:
        resp = requests.patch(url, json=payload, headers=headers, timeout=120)
    except requests.exceptions.RequestException as e:
        raise RuntimeError(f"Network error sending batch: {e}") from e

    if resp.status_code == 207:
        try:
            data = resp.json()
        except Exception:
            raise RuntimeError(f"207 response but non-JSON body: {resp.text[:300]}")
        print(f"  -> {data.get('successful_count',0)} ok, {data.get('failed_count',0)} failed")
        save_response(batch_num, sheet or "unknown", data)
        return data
    else:
        print(f"  X HTTP {resp.status_code}: {resp.text[:300]}")
        resp.raise_for_status()

def ask(prompt):
    return input(prompt).strip()

def _record_results(state, sheet, entries, row_indices, result):
    """Fold a 207 result back into state, keyed by per-record index."""
    successful = result.get("successful") or []
    failed     = result.get("failed") or []

    for s in successful:
        ri = s.get("index")
        # The inventory endpoint's `successful` entries don't carry an index;
        # match positionally when absent isn't possible, so log by code.
        state["results"].append({
            "row": (row_indices[ri] + 2) if (ri is not None and ri < len(row_indices)) else "?",
            "sheet": sheet,
            "status": "success",
            "factwise_item_code": s.get("factwise_item_code"),
            "ERP_item_code": s.get("ERP_item_code"),
            "inventory_entry_id": s.get("inventory_entry_id"),
        })

    for f in failed:
        ri = f.get("index")
        state["results"].append({
            "row": (row_indices[ri] + 2) if (ri is not None and ri < len(row_indices)) else "?",
            "sheet": sheet,
            "status": "failed",
            "error": f.get("error", ""),
            "factwise_item_code": f.get("factwise_item_code"),
            "ERP_item_code": f.get("ERP_item_code"),
            "_payload": entries[ri] if (ri is not None and ri < len(entries)) else None,
        })

    return len(successful), len(failed)

def retry_failed(state):
    """Retry all failed entries in state that have a saved _payload."""
    failed_entries = [r for r in state["results"]
                      if r.get("status") in ("failed", "send_error") and r.get("_payload")]
    if not failed_entries:
        print("  No retryable failed entries found.")
        return

    print(f"\n  Retrying {len(failed_entries)} failed entr(ies)...")
    entries = [e["_payload"] for e in failed_entries]

    # Drop the old failed rows; replace with retry results.
    state["results"] = [r for r in state["results"]
                        if not (r.get("status") in ("failed", "send_error") and r.get("_payload"))]

    batch_num = 9000
    for i in range(0, len(entries), BATCH_SIZE):
        chunk = entries[i:i + BATCH_SIZE]
        row_indices = list(range(len(chunk)))  # synthetic; rows unknown on retry
        batch_num += 1
        print(f"\n  Retry batch {batch_num - 9000}: {len(chunk)} entr(ies)")
        try:
            result = fire_batch(chunk, batch_num=batch_num, sheet="retry")
        except Exception as e:
            print(f"  X Retry batch fire error: {e}")
            for entry in chunk:
                state["results"].append({
                    "row": "retry", "sheet": "retry", "status": "send_error",
                    "error": str(e), "factwise_item_code": entry.get("factwise_item_code"),
                    "ERP_item_code": entry.get("ERP_item_code"), "_payload": entry,
                })
            continue
        s_count, f_count = _record_results(state, "retry", chunk, row_indices, result)
        print(f"  Retry done - {s_count} success, {f_count} failed")
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
        return [None]
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
    print("  Factwise Bulk Inventory Backfill")
    print("  " + banner())
    print("=" * 60)

    filepath = pick_file(folder)
    sheets   = pick_sheets(filepath)

    global _current_state
    state = load_state()
    _current_state = state
    if state.get("results") or state.get("last_batch_start", 0) > 0:
        last_sheet = state.get("current_sheet", "?")
        last_row   = state.get("last_batch_start", 0)
        done       = len(state.get("results", []))
        resume = ask(f"\nResume state found - {done} results saved, last at sheet='{last_sheet}' row={last_row}. Resume? (y/n): ")
        if resume.lower() != "y":
            state = {"completed_sheets": [], "current_sheet": None, "last_batch_start": 0, "results": []}
            save_state(state)
        else:
            prev_failed = [r for r in state.get("results", [])
                           if r.get("status") in ("failed", "send_error") and r.get("_payload")]
            if prev_failed:
                do_retry = ask(f"  {len(prev_failed)} entr(ies) failed in previous run. Retry those before continuing? (y/n): ")
                if do_retry.lower() == "y":
                    retry_failed(state)

    completed_sheets = state.get("completed_sheets", [])

    for sheet in sheets:
        if sheet in completed_sheets:
            print(f"\nSkipping sheet '{sheet}' (already completed)")
            continue

        print(f"\n{'='*60}")
        print(f"Processing sheet: {sheet or 'CSV'}")
        print(f"{'='*60}")

        if filepath.endswith(".csv"):
            df = pd.read_csv(filepath, dtype=str, keep_default_na=False, skiprows=[1])
        else:
            df = pd.read_excel(filepath, sheet_name=sheet, dtype=str,
                               keep_default_na=False, engine="openpyxl", skiprows=[1])

        df = df[df.iloc[:, 0].str.strip() != ""].reset_index(drop=True)
        total_rows = len(df)
        print(f"Total rows: {total_rows}")

        # One entry per row (no grouping).
        all_entries = []
        all_row_idx = []
        for idx, row_data in df.iterrows():
            all_entries.append(row_to_entry(row_data.to_dict()))
            all_row_idx.append(idx)
        total_entries = len(all_entries)
        print(f"Total entries: {total_entries}")

        if state.get("current_sheet") == sheet:
            start = state.get("last_batch_start", 0)
        else:
            start = 0
            state["current_sheet"] = sheet
            state["last_batch_start"] = 0
            state["total_entries"] = total_entries
            save_state(state)

        if start > 0:
            print(f"Resuming from entry index {start}...")

        batch_num = start // BATCH_SIZE
        i = start
        while i < total_entries:
            batch_end = min(i + BATCH_SIZE, total_entries)
            entries      = all_entries[i:batch_end]
            row_indices  = all_row_idx[i:batch_end]
            batch_num += 1

            print(f"\nBatch {batch_num}: entries {i+1}-{batch_end} ({batch_end - i})")

            try:
                result = fire_batch(entries, batch_num=batch_num, sheet=sheet)
            except Exception as e:
                print(f"  X Batch fire error: {e}")
                for ri, entry in enumerate(entries):
                    state["results"].append({
                        "row": row_indices[ri] + 2,
                        "sheet": sheet,
                        "status": "send_error",
                        "error": str(e),
                        "factwise_item_code": entry.get("factwise_item_code"),
                        "ERP_item_code": entry.get("ERP_item_code"),
                        "_payload": entry,
                    })
                i = batch_end
                state["last_batch_start"] = i
                state["current_entry_index"] = f"{i}/{total_entries}"
                save_state(state)
                continue

            s_count, f_count = _record_results(state, sheet, entries, row_indices, result)
            print(f"  Done - {s_count} success, {f_count} failed")

            i = batch_end
            state["current_sheet"] = sheet
            state["last_batch_start"] = i
            state["current_entry_index"] = f"{i}/{total_entries}"
            save_state(state)

        if sheet not in completed_sheets:
            completed_sheets.append(sheet)
        state["completed_sheets"] = completed_sheets
        state["last_batch_start"] = 0
        state["current_sheet"] = None
        save_state(state)
        print(f"\nSheet '{sheet}' complete")

    # Retry failed at end of run
    end_failed = [r for r in state["results"]
                  if r.get("status") in ("failed", "send_error") and r.get("_payload")]
    if end_failed:
        do_retry = ask(f"\n{len(end_failed)} entr(ies) failed. Retry them now? (y/n): ")
        if do_retry.lower() == "y":
            retry_failed(state)

    results = state["results"]
    total   = len(results)
    ok      = sum(1 for r in results if r["status"] == "success")
    fail    = total - ok

    print(f"\n{'='*60}")
    print(f"  DONE - {ok}/{total} entries successful, {fail} failed/errored")
    print(f"  Full results saved to: {STATE_FILE}")
    print(f"{'='*60}\n")

    summary_file = os.path.join(folder, "inventory_upload_results.json")
    with open(summary_file, "w") as f:
        json.dump(results, f, indent=2)
    print(f"Results also saved to: {summary_file}")

if __name__ == "__main__":
    main()
