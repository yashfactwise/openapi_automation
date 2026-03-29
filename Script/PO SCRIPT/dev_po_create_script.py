"""
Factwise Bulk Purchase Order Upload Script
- Reads xlsx/csv from same folder
- Lets user pick file + sheet
- Batches POs at a time -> bulk create API
- Polls status URL until done, saves result per PO
- Resumes from last saved state if interrupted
"""

import os
import sys
import json
import time
import glob
import requests
import pandas as pd
from datetime import datetime, date

# ─── CONFIG ───────────────────────────────────────────────────────────────────
BASE_URL    = "https://n29p4xri95.execute-api.us-east-1.amazonaws.com/dev/"
X_API_KEY   = "G620jT6lwx3IbKQKFtmlw9zNYvqVZLQQ5HHCexBj"
API_ID      = "h7kbdchbl2"
BATCH_SIZE  = 15
POLL_INTERVAL = 5   # seconds between status polls
POLL_TIMEOUT  = 300 # max seconds to wait for a batch

DRY_RUN     = False  # Set True to save payloads without hitting the API

STATE_FILE  = os.path.join(os.path.dirname(__file__), "upload_state.json")

# ─── HELPERS ──────────────────────────────────────────────────────────────────

def get_headers():
    return {
        "x-api-key": X_API_KEY,
        "api-id": API_ID,
        "Content-Type": "application/json"
    }

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

def parse_comma_list(val):
    """Parse a comma-separated string into a list of strings."""
    if val is None or val == "" or (isinstance(val, float) and pd.isna(val)):
        return []
    s = str(val).strip()
    if not s:
        return []
    return [x.strip() for x in s.split(",") if x.strip()]

# ─── DELIVERY SCHEDULE HELPERS ────────────────────────────────────────────────

def _parse_delivery_schedules(row, item_idx):
    """
    Collect delivery schedules from friendly column names:
      Delivery Date 1, Delivery Qty 1, Cost Centre 1, General Ledger 1, Project 1
      Delivery Date 2, Delivery Qty 2, ...  (up to 10)
    Falls back to item quantity if no delivery qty found.
    """
    schedules = []
    for s in range(1, 11):  # 1-based: Delivery Date 1, Delivery Date 2 ...
        suffix = str(s)
        date_val = row.get(f"Delivery Date {suffix}")
        qty_val  = row.get(f"Delivery Qty {suffix}")
        if not date_val and not qty_val:
            break
        schedules.append({
            "delivery_date": normalise_date(date_val),
            "quantity": safe_float(qty_val) or safe_float(row.get("Item Quantity")) or 0,
            "cost_centre_id": safe_str(row.get(f"Cost Centre {suffix}")),
            "general_ledger_id": safe_str(row.get(f"General Ledger {suffix}")),
            "project_id": safe_str(row.get(f"Project {suffix}")),
        })

    # Fallback: single schedule from item quantity
    if not schedules:
        schedules.append({
            "delivery_date": None,
            "quantity": safe_float(row.get("Item Quantity")) or 0,
            "cost_centre_id": None,
            "general_ledger_id": None,
            "project_id": None,
        })

    return schedules


# ─── ROW TO PO ───────────────────────────────────────────────────────────────

def row_to_purchase_order(row):
    """Convert a DataFrame row (dict) to PO payload dict."""

    def g(col):
        return row.get(col)

    # Buyer details
    buyer_details = {
        "entity_name": safe_str(g("Buyer Entity Name")),
        "billing_address_id": safe_str(g("Buyer Billing Address")),
        "shipping_address_id": safe_str(g("Buyer Shipping Address")),
        "identifications": parse_comma_list(g("Buyer Identifications")),
        "contacts": parse_comma_list(g("Buyer Contacts")),
    }

    # Seller details
    seller_id_name  = safe_str(g("Vendor ID Type"))
    seller_id_value = safe_str(g("Vendor ID Value"))
    fw_vendor_code = safe_str(g("Vendor Factwise Code"))
    erp_vendor_code = safe_str(g("Vendor ERP Code"))
    if fw_vendor_code:
        erp_vendor_code = None  # prefer factwise, never send ERP when factwise is present
    elif erp_vendor_code:
        print(f"  ⚠ Row using ERP vendor code only — may fail if multiple vendors share this code")
    seller_details = {
        "ERP_vendor_code": erp_vendor_code,
        "factwise_vendor_code": fw_vendor_code,
        "seller_address_id": safe_str(g("Vendor Address ID")),
        "seller_full_address": safe_str(g("Vendor Address Text")) or "",
        "identifications": [{"identification_name": seller_id_name, "identification_value": seller_id_value or ""}] if seller_id_name else [],
        "contacts": parse_comma_list(g("Vendor Contacts")),
    }

    # PO details
    purchase_order_details = {
        "created_by_user_email": safe_str(g("Creator Email")),
        "ERP_po_id": safe_str(g("ERP PO ID")),
        "status": safe_str(g("Status")) or "ISSUED",
        "template_name": safe_str(g("Template Name")),
        "issued_date": normalise_date(g("Issued Date")),
        "accepted_date": normalise_date(g("Accepted Date")),
        "currency_code": safe_str(g("Currency")),
        "notes": safe_str(g("PO Notes")) or "",
        "event": safe_str(g("Event")),
        "terms_and_conditions": {
            "name": safe_str(g("TnC Name")),
            "data": safe_str(g("TnC Data"))
        },
        "incoterm": safe_str(g("Incoterm")) or "NA",
        "prepayment_percentage": safe_float(g("Prepayment %")) or 0,
        "payment_type": safe_str(g("Payment Type")),
        "payment_terms": parse_payment_terms(g("Payment Terms")),
        "lead_time": safe_float(g("Lead Time")),
        "lead_time_period": safe_str(g("Lead Time Period")),
        "additional_costs": [],
        "taxes": [],
        "discounts": [],
        "custom_sections": parse_json_field(g("PO Custom Sections")),
    }

    # PO item
    item = {
        "ERP_item_code": safe_str(g("Item ERP Code")),
        "factwise_item_code": safe_str(g("Item Factwise Code")),
        "item_additional_details": safe_str(g("Item Additional Details")) or "",
        "internal_notes": safe_str(g("Item Internal Notes")) or "",
        "external_notes": safe_str(g("Item External Notes")) or "",
        "price": safe_float(g("Item Price")) or 0,
        "quantity": safe_float(g("Item Quantity")) or 0,
        "measurement_unit": safe_str(g("Item Unit")),
        "incoterm": safe_str(g("Item Incoterm")) or "NA",
        "prepayment_percentage": safe_float(g("Item Prepayment %")) or 0,
        "lead_time": safe_str(g("Item Lead Time")),
        "lead_time_period": safe_str(g("Item Lead Time Period")),
        "payment_type": safe_str(g("Item Payment Type")) or "PER_INVOICE_ITEM",
        "payment_terms": parse_payment_terms(g("Item Payment Terms")),
        "deliverables_payment_terms": parse_json_field(g("Item Deliverables Pmt Terms")),
        "delivery_schedules": _parse_delivery_schedules(row, 0),
        "additional_costs": [],
        "taxes": [],
        "discounts": [],
        "custom_sections": parse_json_field(g("Item Custom Sections")),
        "attachments": [],
    }

    po = {
        "buyer_details": buyer_details,
        "seller_details": seller_details,
        "purchase_order_details": purchase_order_details,
        "purchase_order_items": [item],
        "attachments": [],
    }

    return po

# ─── STATE MANAGEMENT ────────────────────────────────────────────────────────

def load_state():
    if os.path.exists(STATE_FILE):
        with open(STATE_FILE, "r") as f:
            return json.load(f)
    return {"completed_sheets": [], "current_sheet": None, "last_batch_start": 0, "results": []}

def save_state(state):
    with open(STATE_FILE, "w") as f:
        json.dump(state, f, indent=2)

PAYLOADS_DIR   = os.path.join(os.path.dirname(__file__), "payloads")
RESPONSES_DIR  = os.path.join(os.path.dirname(__file__), "responses")

def save_payload(batch_num, sheet, purchase_orders):
    os.makedirs(PAYLOADS_DIR, exist_ok=True)
    safe_sheet = str(sheet).replace("/", "-").replace("\\", "-")
    filename = f"batch_{safe_sheet}_{batch_num:04d}.json"
    path = os.path.join(PAYLOADS_DIR, filename)
    with open(path, "w") as f:
        json.dump({"purchase_orders": purchase_orders}, f, indent=2, default=str)
    print(f"  Payload saved -> payloads/{filename}")

def save_response(batch_num, sheet, data):
    os.makedirs(RESPONSES_DIR, exist_ok=True)
    safe_sheet = str(sheet).replace("/", "-").replace("\\", "-")
    filename = f"response_{safe_sheet}_{batch_num:04d}.json"
    path = os.path.join(RESPONSES_DIR, filename)
    with open(path, "w") as f:
        json.dump(data, f, indent=2)
    print(f"  Response saved -> responses/{filename}")

def poll_task(task_id):
    """Poll task status until done. Returns final task response."""
    url = BASE_URL + f"api/tasks/{task_id}/"
    headers = get_headers()
    elapsed = 0
    while elapsed < POLL_TIMEOUT:
        time.sleep(POLL_INTERVAL)
        elapsed += POLL_INTERVAL
        resp = requests.get(url, headers=headers, timeout=30)
        if resp.status_code == 404:
            print(f"  Task {task_id} not found yet, retrying...")
            continue
        resp.raise_for_status()
        data = resp.json()
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

def fire_batch(purchase_orders, batch_num=0, sheet=None):
    """Send a batch of POs. Returns (task_id, results_if_sync)."""
    save_payload(batch_num, sheet or "unknown", purchase_orders)
    if DRY_RUN:
        print(f"  [DRY RUN] Skipping API call - payload saved only")
        return None, {"successful_count": 0, "failed_count": 0, "successful": [], "failed": []}
    url = BASE_URL + "api/purchase_order/bulk-create/"
    headers = get_headers()
    payload = {"purchase_orders": purchase_orders}
    resp = requests.post(url, json=payload, headers=headers, timeout=60)

    if resp.status_code == 202:
        data = resp.json()
        task_id = data.get("task_id")
        print(f"  -> Async task_id: {task_id}")
        return task_id, None
    elif resp.status_code == 207:
        data = resp.json()
        print(f"  -> Sync response: {data.get('successful_count',0)} ok, {data.get('failed_count',0)} failed")
        save_response(batch_num, sheet or "unknown", data)
        return None, data
    else:
        print(f"  X HTTP {resp.status_code}: {resp.text[:300]}")
        resp.raise_for_status()

def ask(prompt):
    return input(prompt).strip()

def retry_failed(state):
    """Retry all failed entries in state that have a saved _payload."""
    failed_entries = [r for r in state["results"] if r.get("status") in ("failed", "send_error") and r.get("_payload")]
    if not failed_entries:
        print("  No retryable failed POs found.")
        return

    print(f"\n  Retrying {len(failed_entries)} failed PO(s)...")
    purchase_orders = [e["_payload"] for e in failed_entries]

    # Remove old failed entries so we replace them with retry results
    state["results"] = [r for r in state["results"] if not (r.get("status") in ("failed", "send_error") and r.get("_payload"))]

    batch_num = 9000  # retry batches use high numbers to avoid collision
    for i in range(0, len(purchase_orders), BATCH_SIZE):
        chunk = purchase_orders[i:i + BATCH_SIZE]
        batch_num += 1
        print(f"\n  Retry batch {batch_num - 9000}: {len(chunk)} PO(s)")
        try:
            task_id, sync_result = fire_batch(chunk, batch_num=batch_num, sheet="retry")
        except Exception as e:
            print(f"  X Retry batch fire error: {e}")
            for po in chunk:
                state["results"].append({
                    "row": "retry",
                    "sheet": "retry",
                    "status": "send_error",
                    "error": str(e),
                    "erp_po_id": po.get("purchase_order_details", {}).get("ERP_po_id", ""),
                    "_payload": po,
                })
            continue

        if task_id:
            try:
                result = poll_task_and_save(task_id, batch_num, "retry")
            except TimeoutError as e:
                print(f"  X {e}")
                result = {"status": "timeout", "successful": [], "failed": []}
        else:
            result = sync_result

        successful = result.get("successful") or result.get("success") or []
        failed     = result.get("failed") or []

        for s in successful:
            ri = s.get("index", 0)
            state["results"].append({
                "row": "retry",
                "sheet": "retry",
                "status": "success",
                "purchase_order_code": s.get("purchase_order_code"),
                "purchase_order_id": s.get("purchase_order_id"),
                "erp_purchase_order_code": s.get("erp_purchase_order_code"),
                "erp_po_id": chunk[ri].get("purchase_order_details", {}).get("ERP_po_id", "") if ri < len(chunk) else "",
            })
        for f in failed:
            ri = f.get("index", 0)
            state["results"].append({
                "row": "retry",
                "sheet": "retry",
                "status": "failed",
                "error": f.get("error", ""),
                "erp_purchase_order_code": f.get("erp_purchase_order_code"),
                "erp_po_id": chunk[ri].get("purchase_order_details", {}).get("ERP_po_id", "") if ri < len(chunk) else "",
                "_payload": chunk[ri] if ri < len(chunk) else None,
            })
        print(f"  Retry done - {len(successful)} success, {len(failed)} failed")
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

# ─── MAIN ─────────────────────────────────────────────────────────────────────

def main():
    folder = os.path.dirname(os.path.abspath(__file__))

    print("=" * 60)
    print("  Factwise Bulk Purchase Order Upload")
    print("=" * 60)

    filepath = pick_file(folder)
    sheets   = pick_sheets(filepath)

    state = load_state()
    if state.get("results") or state.get("last_batch_start", 0) > 0:
        last_sheet = state.get("current_sheet", "?")
        last_row   = state.get("last_batch_start", 0)
        done       = len(state.get("results", []))
        resume = ask(f"\nResume state found - {done} results saved, last at sheet='{last_sheet}' row={last_row}. Resume? (y/n): ")
        if resume.lower() != "y":
            state = {"completed_sheets": [], "current_sheet": None, "last_batch_start": 0, "results": []}
            save_state(state)
        else:
            prev_failed = [r for r in state.get("results", []) if r.get("status") in ("failed", "send_error") and r.get("_payload")]
            if prev_failed:
                do_retry = ask(f"  {len(prev_failed)} PO(s) failed in previous run. Retry those before continuing? (y/n): ")
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

            print(f"\nBatch {batch_num}: rows {i+1}-{batch_end} ({batch_end - i} POs)")

            purchase_orders = []
            row_indices = []
            for idx, row_data in batch_rows.iterrows():
                try:
                    po = row_to_purchase_order(row_data.to_dict())
                    purchase_orders.append(po)
                    row_indices.append(i + len(purchase_orders) - 1)
                except Exception as e:
                    print(f"  X Row {idx+2} parse error: {e}")
                    state["results"].append({
                        "row": idx + 2,
                        "sheet": sheet,
                        "status": "parse_error",
                        "error": str(e),
                        "erp_po_id": row_data.get("ERP PO ID", ""),
                    })

            if not purchase_orders:
                i = batch_end
                state["current_sheet"] = sheet
                state["last_batch_start"] = i
                save_state(state)
                continue

            try:
                task_id, sync_result = fire_batch(purchase_orders, batch_num=batch_num, sheet=sheet)
            except Exception as e:
                print(f"  X Batch fire error: {e}")
                for ri, po in enumerate(purchase_orders):
                    state["results"].append({
                        "row": row_indices[ri] + 2,
                        "sheet": sheet,
                        "status": "send_error",
                        "error": str(e),
                        "erp_po_id": po.get("purchase_order_details", {}).get("ERP_po_id", ""),
                    })
                i = batch_end
                state["last_batch_start"] = i
                save_state(state)
                continue

            if task_id:
                try:
                    result = poll_task_and_save(task_id, batch_num, sheet)
                except TimeoutError as e:
                    print(f"  X {e}")
                    result = {"status": "timeout", "successful": [], "failed": []}
            else:
                result = sync_result

            successful = result.get("successful") or result.get("success") or []
            failed     = result.get("failed") or []

            for s in successful:
                ri = s.get("index", 0)
                state["results"].append({
                    "row": row_indices[ri] + 2 if ri < len(row_indices) else "?",
                    "sheet": sheet,
                    "status": "success",
                    "purchase_order_code": s.get("purchase_order_code"),
                    "purchase_order_id": s.get("purchase_order_id"),
                    "erp_purchase_order_code": s.get("erp_purchase_order_code"),
                    "erp_po_id": purchase_orders[ri].get("purchase_order_details", {}).get("ERP_po_id", "") if ri < len(purchase_orders) else "",
                })

            for f in failed:
                ri = f.get("index", 0)
                state["results"].append({
                    "row": row_indices[ri] + 2 if ri < len(row_indices) else "?",
                    "sheet": sheet,
                    "status": "failed",
                    "error": f.get("error", ""),
                    "erp_purchase_order_code": f.get("erp_purchase_order_code"),
                    "erp_po_id": purchase_orders[ri].get("purchase_order_details", {}).get("ERP_po_id", "") if ri < len(purchase_orders) else "",
                    "_payload": purchase_orders[ri] if ri < len(purchase_orders) else None,
                })

            s_count = len(successful)
            f_count = len(failed)
            print(f"  Done - {s_count} success, {f_count} failed")

            i = batch_end
            state["current_sheet"] = sheet
            state["last_batch_start"] = i
            save_state(state)

        if sheet not in completed_sheets:
            completed_sheets.append(sheet)
        state["completed_sheets"] = completed_sheets
        state["last_batch_start"] = 0
        state["current_sheet"] = None
        save_state(state)
        print(f"\nSheet '{sheet}' complete")

    # Retry failed at end of run
    end_failed = [r for r in state["results"] if r.get("status") in ("failed", "send_error") and r.get("_payload")]
    if end_failed:
        do_retry = ask(f"\n{len(end_failed)} PO(s) failed. Retry them now? (y/n): ")
        if do_retry.lower() == "y":
            retry_failed(state)

    results = state["results"]
    total   = len(results)
    ok      = sum(1 for r in results if r["status"] == "success")
    fail    = total - ok

    print(f"\n{'='*60}")
    print(f"  DONE - {ok}/{total} POs successful, {fail} failed/errored")
    print(f"  Full results saved to: {STATE_FILE}")
    print(f"{'='*60}\n")

    summary_file = os.path.join(folder, "upload_results.json")
    with open(summary_file, "w") as f:
        json.dump(results, f, indent=2)
    print(f"Results also saved to: {summary_file}")

if __name__ == "__main__":
    main()
