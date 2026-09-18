"""
Factwise Bulk Purchase Order Upload Script — v2 (SAP-layout aware)
=================================================================
Everything v1 does (batching, async polling with retries, resume,
failed-retry, Ctrl+C state-save), PLUS handling for SAP-style sheets:

  * Empty-row filter uses 'Buyer Entity Name' (after forward-fill),
    not column 0 — so a leading 'Unnamed: 0' / SAP-PO column no longer
    breaks the row count.
  * Header columns (buyer / vendor / PO-level) are FORWARD-FILLED within
    each ERP PO ID group, so multi-item POs whose continuation rows leave
    the header blank are assembled correctly.
  * Currency / Item Unit codes (e.g. 'USD', 'KG') are resolved to backend
    UUIDs via a drop-in 'mappings.json'. Values already in UUID form pass
    through untouched. Unresolvable codes => row is flagged (never sent).
  * 'Incoterm-2' (port / incoterm detail) and 'Document type' are captured
    and folded into the item's additional-details text (configurable),
    since the backend has no dedicated field for them.

Backend contract verified against:
  Factwise-Backend/factwise/openapi/views/po_views.py
  (PurchaseOrderBulkCreateAPI / CreatePOBaseInputSerializer)
"""

import os
import re
import sys
import json
import time
import glob
import signal
import requests
import pandas as pd
from datetime import datetime, date

# ─── CONFIG ───────────────────────────────────────────────────────────────────
BASE_URL    = "https://factwise-prod-apim-new.azure-api.net/"
SUBSCRIPTION_KEY = "a71c1f411dea45139a31e5a05ddec9a4"
BATCH_SIZE  = 10
POLL_INTERVAL = 3600  # seconds between status polls
POLL_TIMEOUT  = 10800 # max seconds to wait for a batch

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
MAPPING_FILE = os.path.join(os.path.dirname(__file__), "mappings.json")

# Header columns that are forward-filled within an ERP PO ID group.
# (Everything that describes the PO/buyer/vendor, NOT the per-line item.)
HEADER_FILL_COLS = [
    "Buyer Entity Name", "Buyer Billing Address",
    # NOTE: "Buyer Shipping Address" is intentionally NOT forward-filled.
    # In SAP-style sheets it is a PER-ITEM ship-to (different items of one PO
    # ship to different addresses), so it must stay row-specific and flow into
    # each item's `shipping_address`. Forward-filling would flatten those
    # differences. See row_to_item() + buyer_details below.
    "Buyer Identifications", "Buyer Contacts",
    "Vendor Factwise Code", "Vendor ERP Code", "Vendor Address ID",
    "Vendor Address Text", "Vendor ID Type", "Vendor ID Value", "Vendor Contacts",
    "Creator Email", "Document type", "Status", "Template Name", "Issued Date",
    "Currency", "TnC Name", "TnC Data", "Accepted Date", "PO Notes", "Event",
    "Incoterm", "Prepayment %", "Payment Type", "Payment Terms",
    "Lead Time", "Lead Time Period", "PO Custom Sections",
]

# Fold these extra columns (no dedicated backend field) into the item's
# additional-details text instead of dropping them. Set to [] to drop.
FOLD_INTO_ITEM_DETAILS = ["Incoterm-2", "Document type"]


# Short exact markers for legend/sample preamble rows whose ERP PO ID cell is a
# single token (so the space-heuristic below won't catch them).
PREAMBLE_ERP_PO_MARKERS = {
    "po#",          # legend/sample row
    "erp po id",    # stray duplicate header
    "erp_po_id",
}

UUID_RE = re.compile(r"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-"
                     r"[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$")

# ─── MAPPINGS (code -> UUID) ───────────────────────────────────────────────────

_MAPPINGS = None
_UNRESOLVED = {"currency_code": set(), "measurement_unit": set()}
BLANK_TOKENS = {"", "nan", "none", "null", "na", "n/a"}

def is_blank_value(val):
    if val is None or (isinstance(val, float) and pd.isna(val)):
        return True
    return str(val).strip().lower() in BLANK_TOKENS

def load_mappings():
    global _MAPPINGS
    if _MAPPINGS is not None:
        return _MAPPINGS
    if os.path.exists(MAPPING_FILE):
        with open(MAPPING_FILE, "r", encoding="utf-8") as f:
            raw = json.load(f)
        # normalise keys to lowercase/trimmed for case-insensitive lookup
        _MAPPINGS = {}
        for kind in ("currency_code", "measurement_unit"):
            _MAPPINGS[kind] = {
                str(k).strip().lower(): v
                for k, v in (raw.get(kind) or {}).items()
            }
        print(f"Loaded mappings from {os.path.basename(MAPPING_FILE)} "
              f"({len(_MAPPINGS['currency_code'])} currencies, "
              f"{len(_MAPPINGS['measurement_unit'])} units)")
    else:
        _MAPPINGS = {"currency_code": {}, "measurement_unit": {}}
        print(f"  (no {os.path.basename(MAPPING_FILE)} found — values must "
              f"already be UUIDs)")
    return _MAPPINGS

def resolve_uuid(val, kind):
    """Resolve a currency/unit value to a UUID.
    - None/blank -> None
    - already a UUID -> returned as-is
    - found in mappings -> mapped UUID
    - otherwise -> None, and the code is recorded in _UNRESOLVED[kind]
    """
    s = str(val).strip()
    if is_blank_value(val):
        return None
    if UUID_RE.match(s):
        return s
    mp = load_mappings().get(kind, {})
    hit = mp.get(s.lower())
    if hit and UUID_RE.match(str(hit)):
        return str(hit)
    _UNRESOLVED[kind].add(s)
    return None

# ─── HELPERS ──────────────────────────────────────────────────────────────────

def get_headers():
    return {
        "Ocp-Apim-Subscription-Key": SUBSCRIPTION_KEY,
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
    if is_blank_value(val):
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

    # Fallback: single schedule from item quantity (delivery_schedules is required, min_length=1)
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

def _folded_details(row):
    """Build the item additional-details string, folding in extra columns
    (Incoterm-2, Document type) that have no dedicated backend field."""
    base = safe_str(row.get("Item Additional Details")) or ""
    extras = []
    for col in FOLD_INTO_ITEM_DETAILS:
        v = safe_str(row.get(col))
        if v:
            extras.append(f"{col}: {v}")
    if extras:
        suffix = " | ".join(extras)
        return (base + (" | " if base else "") + suffix)
    return base


def row_to_item(row):
    """Extract just the PO item from a DataFrame row (dict)."""
    def g(col):
        return row.get(col)

    return {
        "ERP_item_code": safe_str(g("Item ERP Code")),
        "factwise_item_code": safe_str(g("Item Factwise Code")),
        # Item-level ship-to (recently added to the OpenAPI item serializer:
        # purchase_order_items[].shipping_address). Each row carries its OWN
        # shipping address, so different items on the same PO can ship to
        # different places. Prefer a dedicated 'Item Shipping Address' column
        # if the sheet has one; otherwise fall back to 'Buyer Shipping Address'
        # which, in SAP sheets, is per-row (= per-item).
        "shipping_address": safe_str(g("Item Shipping Address")) or safe_str(g("Buyer Shipping Address")),
        "item_additional_details": _folded_details(row),
        "internal_notes": safe_str(g("Item Internal Notes")) or "",
        "external_notes": safe_str(g("Item External Notes")) or "",
        "price": safe_float(g("Item Price")) or 0,
        "quantity": safe_float(g("Item Quantity")) or 0,
        "measurement_unit": resolve_uuid(g("Item Unit"), "measurement_unit"),
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


def row_to_purchase_order(row):
    """Convert a DataFrame row (dict) to a full PO payload dict (single item)."""
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
    fw_vendor_code  = safe_str(g("Vendor Factwise Code"))
    erp_vendor_code = safe_str(g("Vendor ERP Code"))
    if fw_vendor_code:
        erp_vendor_code = None  # prefer factwise, never send ERP when factwise is present
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
        "currency_code": resolve_uuid(g("Currency"), "currency_code"),
        "notes": safe_str(g("PO Notes")) or "",
        "event": safe_str(g("Event")),
        # TnC: send the sheet's "TnC Name" as terms_and_conditions_id so the
        # backend resolves an ALREADY-CONFIGURED T&C by its name/nickname.
        # (name/data are only used to create an inline T&C; the configured
        # path reads terms_and_conditions_id.)
        "terms_and_conditions": {
            "terms_and_conditions_id": safe_str(g("TnC Name")),
            "name": safe_str(g("TnC Name")) or "NA",
            "data": safe_str(g("TnC Data")) or "NA",
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

    return {
        "buyer_details": buyer_details,
        "seller_details": seller_details,
        "purchase_order_details": purchase_order_details,
        "purchase_order_items": [row_to_item(row)],
        "attachments": [],
    }


# ─── SHEET READ + PREAMBLE STRIPPING ──────────────────────────────────────────

def read_sheet(filepath, sheet):
    """Read a sheet with row 0 as the header, then strip any description /
    legend preamble rows. Replaces the v1 hardcoded skiprows=[1], which only
    removed ONE preamble row and broke on templates that ship two (description
    + legend)."""
    if filepath.endswith(".csv"):
        df = pd.read_csv(filepath, dtype=str, keep_default_na=False)
    else:
        df = pd.read_excel(filepath, sheet_name=sheet, dtype=str,
                           keep_default_na=False, engine="openpyxl")
    before = len(df)
    df = drop_preamble_rows(df)
    dropped = before - len(df)
    if dropped:
        print(f"  Dropped {dropped} preamble/legend row(s)")
    return df.reset_index(drop=True)


def _is_preamble_erp_value(v):
    """A leading row is preamble if its ERP PO ID is blank, a known marker,
    or sentence-like (contains a space / too long to be a PO id). Real PO ids
    are single tokens like '4400020527' or '4300062347'."""
    if v == "":
        return True
    if v in PREAMBLE_ERP_PO_MARKERS:
        return True
    if " " in v:           # description text such as "Unique PO ID from your ERP ..."
        return True
    if len(v) > 40:        # absurdly long for a real PO id
        return True
    return False


def drop_preamble_rows(df):
    """Drop leading description/legend rows. Only CONTIGUOUS leading rows that
    look like preamble are removed, so real data further down is never touched.
    Uses a heuristic on 'ERP PO ID' so it works across templates whose helper
    text differs (File 1 vs File 2 ship different descriptions)."""
    if "ERP PO ID" not in df.columns:
        return df
    erp = df["ERP PO ID"].astype(str).str.strip().str.lower()
    keep_from = 0
    for idx in range(len(df)):
        if _is_preamble_erp_value(erp.iloc[idx]):
            keep_from = idx + 1
        else:
            break
    return df.iloc[keep_from:]


# ─── SAP-LAYOUT PREP: forward-fill header within each ERP PO ID group ──────────

def forward_fill_headers(df):
    """
    SAP exports leave buyer/vendor/PO header columns blank on continuation
    rows of a multi-item PO. Forward-fill those columns *within* each
    ERP PO ID group so every row of a PO carries the full header.

    Rows are processed in sheet order. A blank ERP PO ID inherits the
    previous non-blank one (SAP continuation rows often blank the ID too).
    """
    df = df.copy()

    # 1) forward-fill the grouping key itself (blank continuation IDs)
    erp = df["ERP PO ID"].astype(str).str.strip().replace("", pd.NA)
    erp = erp.ffill()
    df["__erp_po_group__"] = erp

    # 2) within each group, ffill the header columns (treat blank as NA)
    fill_cols = [c for c in HEADER_FILL_COLS if c in df.columns]
    for c in fill_cols:
        s = df[c].astype(str).str.strip().replace("", pd.NA)
        df[c] = s.groupby(df["__erp_po_group__"]).ffill()

    # restore plain strings (NA -> "") so downstream safe_str works as before
    for c in fill_cols + ["ERP PO ID"]:
        if c in df.columns:
            df[c] = df[c].astype("object").where(df[c].notna(), "").astype(str)
            df[c] = df[c].replace("nan", "").replace("<NA>", "")

    # write the filled group id back into ERP PO ID where it was blank
    df["ERP PO ID"] = df["__erp_po_group__"].astype("object").where(
        df["__erp_po_group__"].notna(), "").astype(str)
    df.drop(columns=["__erp_po_group__"], inplace=True)
    return df


def group_rows_into_pos(batch_rows):
    """
    Group DataFrame rows by ERP PO ID so that multiple rows sharing the same
    PO ID become a single PO with multiple items in purchase_order_items.
    Returns a list of (po_dict, [original_row_indices]) tuples.
    """
    from collections import OrderedDict
    groups = OrderedDict()  # erp_po_id -> {"po": po_dict, "indices": [int], "vendors": set, "erp_po_id": str}

    for idx, row_data in batch_rows.iterrows():
        row = row_data.to_dict()
        erp_po_id = safe_str(row.get("ERP PO ID")) or f"__no_id_{idx}__"
        # vendor on THIS row (factwise preferred, else ERP)
        row_vendor = safe_str(row.get("Vendor Factwise Code")) or safe_str(row.get("Vendor ERP Code"))

        if erp_po_id not in groups:
            po = row_to_purchase_order(row)
            groups[erp_po_id] = {"po": po, "indices": [idx], "vendors": set(), "erp_po_id": erp_po_id}
        else:
            # Same PO — just append the new item
            new_item = row_to_item(row)
            groups[erp_po_id]["po"]["purchase_order_items"].append(new_item)
            groups[erp_po_id]["indices"].append(idx)
        if row_vendor:
            groups[erp_po_id]["vendors"].add(row_vendor)

    # A single ERP PO ID must map to a SINGLE vendor. Rows of one PO carrying
    # different vendors is invalid data (SAP export artifact / wrong PO numbering)
    # — reject the whole PO and report it instead of silently using row 1's vendor.
    valid, rejected = [], []
    for g in groups.values():
        if len(g["vendors"]) > 1:
            rejected.append(g)
        else:
            valid.append(g)
    return valid, rejected

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
    filename = f"batch_{safe_sheet}_{batch_num:04d}{RUN_SUFFIX}.json"
    path = os.path.join(PAYLOADS_DIR, filename)
    with open(path, "w") as f:
        json.dump({"purchase_orders": purchase_orders}, f, indent=2, default=str)
    print(f"  Payload saved -> payloads/{filename}")

def save_response(batch_num, sheet, data):
    os.makedirs(RESPONSES_DIR, exist_ok=True)
    safe_sheet = str(sheet).replace("/", "-").replace("\\", "-")
    filename = f"response_{safe_sheet}_{batch_num:04d}{RUN_SUFFIX}.json"
    path = os.path.join(RESPONSES_DIR, filename)
    with open(path, "w") as f:
        json.dump(data, f, indent=2)
    print(f"  Response saved -> responses/{filename}")


def write_failure_report(folder, results):
    """Write a Markdown report of every PO that did NOT succeed (failed / send
    error / parse error / timeout), grouped by the reason, with counts. Saved as
    upload_failures_runN.md next to the script. Returns the path, or None if
    there were no failures."""
    from collections import OrderedDict, Counter
    failed = [r for r in results if r.get("status") != "success"]
    if not failed:
        return None

    # group by (status, error message)
    groups = OrderedDict()
    for r in failed:
        key = (r.get("status", "failed"), (r.get("error") or "").strip() or "(no error message returned)")
        groups.setdefault(key, []).append(r)

    total = len(results)
    ok = sum(1 for r in results if r.get("status") == "success")
    status_counts = Counter(r.get("status", "failed") for r in failed)

    lines = []
    lines.append(f"# PO Upload — Failure Report (RUN #{RUN_NUMBER})")
    lines.append("")
    lines.append(f"- Total PO rows processed: **{total}**")
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
    # sort groups by size, biggest first
    for (st, err), rows in sorted(groups.items(), key=lambda kv: -len(kv[1])):
        lines.append(f"### [{st}] {err}  ({len(rows)} PO(s))")
        lines.append("")
        lines.append("| ERP PO ID | sheet row |")
        lines.append("|---|---|")
        for r in rows:
            lines.append(f"| {r.get('erp_po_id') or r.get('erp_purchase_order_code') or '-'} | {r.get('row','-')} |")
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
            print(f"  Task {task_id} not found yet, retrying...")
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

def fire_batch(purchase_orders, batch_num=0, sheet=None):
    """Send a batch of POs. Returns (task_id, results_if_sync)."""
    save_payload(batch_num, sheet or "unknown", purchase_orders)
    if DRY_RUN:
        print(f"  [DRY RUN] Skipping API call - payload saved only")
        return None, {"successful_count": 0, "failed_count": 0, "successful": [], "failed": []}
    url = BASE_URL + "api/purchase_order/bulk-create/"
    headers = get_headers()
    payload = {"purchase_orders": purchase_orders}
    try:
        resp = requests.post(url, json=payload, headers=headers, timeout=120)
    except requests.exceptions.RequestException as e:
        raise RuntimeError(f"Network error sending batch: {e}") from e

    if resp.status_code == 202:
        try:
            data = resp.json()
        except Exception:
            raise RuntimeError(f"202 response but non-JSON body: {resp.text[:300]}")
        task_id = data.get("task_id")
        print(f"  -> Async task_id: {task_id}")
        return task_id, None
    elif resp.status_code == 207:
        try:
            data = resp.json()
        except Exception:
            raise RuntimeError(f"207 response but non-JSON body: {resp.text[:300]}")
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
                    "row": "retry", "sheet": "retry", "status": "send_error",
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
                "row": "retry", "sheet": "retry", "status": "success",
                "purchase_order_code": s.get("purchase_order_code"),
                "purchase_order_id": s.get("purchase_order_id"),
                "erp_purchase_order_code": s.get("erp_purchase_order_code"),
                "erp_po_id": chunk[ri].get("purchase_order_details", {}).get("ERP_po_id", "") if ri < len(chunk) else "",
            })
        for f in failed:
            ri = f.get("index", 0)
            state["results"].append({
                "row": "retry", "sheet": "retry", "status": "failed",
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
    print("  Factwise Bulk Purchase Order Upload — v2 (SAP-aware)")
    print(f"  RUN #{RUN_NUMBER}  (outputs suffixed {RUN_SUFFIX})")
    print("=" * 60)

    load_mappings()
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
            _current_state = state
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

        df = read_sheet(filepath, sheet)

        if "ERP PO ID" not in df.columns:
            print("  X Sheet has no 'ERP PO ID' column — cannot group/forward-fill. Skipping.")
            continue

        # SAP-layout prep: forward-fill header columns within each PO group
        df = forward_fill_headers(df)

        # Keep only rows that resolve to a real PO. We key off ERP PO ID (after
        # forward-fill above), NOT Buyer Entity Name — in SAP sheets the entity
        # column is blank on ~half the rows even though those rows are real
        # items/POs, so filtering on entity name silently drops them.
        df = df[df["ERP PO ID"].astype(str).str.strip() != ""].reset_index(drop=True)

        total_rows = len(df)
        print(f"Total data rows (after forward-fill + filter): {total_rows}")

        # Group ALL rows first so multi-item POs are never split across batch boundaries
        try:
            all_groups, rejected_groups = group_rows_into_pos(df)
        except Exception as e:
            print(f"  X Grouping error: {e}")
            continue
        total_pos = len(all_groups)
        print(f"Total POs after grouping: {total_pos}")

        # Reject POs whose rows carry more than one vendor (invalid data).
        if rejected_groups:
            print(f"  Rejected {len(rejected_groups)} PO(s): same ERP PO ID with multiple vendors")
            for g in rejected_groups:
                for orig_idx in g["indices"]:
                    state["results"].append({
                        "row": orig_idx + 2, "sheet": sheet, "status": "failed",
                        "error": f"Same ERP PO ID has multiple vendors: {sorted(g['vendors'])}",
                        "erp_po_id": g["erp_po_id"],
                    })
            save_state(state)

        # Report any unresolved currency/unit codes BEFORE sending anything
        if _UNRESOLVED["currency_code"] or _UNRESOLVED["measurement_unit"]:
            print("\n  ⚠ UNRESOLVED codes (no UUID in mappings.json) — these will be sent as null:")
            if _UNRESOLVED["currency_code"]:
                print(f"     currency_code: {sorted(_UNRESOLVED['currency_code'])}")
            if _UNRESOLVED["measurement_unit"]:
                print(f"     measurement_unit: {sorted(_UNRESOLVED['measurement_unit'])}")
            cont = ask("  Continue anyway? (y/n): ")
            if cont.lower() != "y":
                print("  Aborting so you can complete mappings.json.")
                sys.exit(1)

        if state.get("current_sheet") == sheet:
            start = state.get("last_batch_start", 0)
        else:
            start = 0
            state["current_sheet"] = sheet
            state["last_batch_start"] = 0
            state["total_pos"] = total_pos
            save_state(state)

        if start > 0:
            print(f"Resuming from PO index {start}...")

        batch_num = start // BATCH_SIZE
        i = start
        while i < total_pos:
            batch_end = min(i + BATCH_SIZE, total_pos)
            batch_groups = all_groups[i:batch_end]
            batch_num += 1

            print(f"\nBatch {batch_num}: POs {i+1}-{batch_end} ({batch_end - i} POs)")

            purchase_orders = []
            row_indices = []
            for group in batch_groups:
                purchase_orders.append(group["po"])
                row_indices.append(group["indices"])

            if not purchase_orders:
                i = batch_end
                state["current_sheet"] = sheet
                state["last_batch_start"] = i
                state["current_po_index"] = f"{i}/{total_pos}"
                save_state(state)
                continue

            try:
                task_id, sync_result = fire_batch(purchase_orders, batch_num=batch_num, sheet=sheet)
            except Exception as e:
                print(f"  X Batch fire error: {e}")
                for ri, po in enumerate(purchase_orders):
                    for orig_idx in row_indices[ri]:
                        state["results"].append({
                            "row": orig_idx + 2, "sheet": sheet, "status": "send_error",
                            "error": str(e),
                            "erp_po_id": po.get("purchase_order_details", {}).get("ERP_po_id", ""),
                            "_payload": po,
                        })
                i = batch_end
                state["last_batch_start"] = i
                state["current_po_index"] = f"{i}/{total_pos}"
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
                indices = row_indices[ri] if ri < len(row_indices) else []
                for orig_idx in indices:
                    state["results"].append({
                        "row": orig_idx + 2, "sheet": sheet, "status": "success",
                        "purchase_order_code": s.get("purchase_order_code"),
                        "purchase_order_id": s.get("purchase_order_id"),
                        "erp_purchase_order_code": s.get("erp_purchase_order_code"),
                        "erp_po_id": purchase_orders[ri].get("purchase_order_details", {}).get("ERP_po_id", "") if ri < len(purchase_orders) else "",
                    })

            for f in failed:
                ri = f.get("index", 0)
                indices = row_indices[ri] if ri < len(row_indices) else []
                for orig_idx in indices:
                    state["results"].append({
                        "row": orig_idx + 2, "sheet": sheet, "status": "failed",
                        "error": f.get("error", ""),
                        "erp_purchase_order_code": f.get("erp_purchase_order_code"),
                        "erp_po_id": purchase_orders[ri].get("purchase_order_details", {}).get("ERP_po_id", "") if ri < len(purchase_orders) else "",
                        "_payload": purchase_orders[ri] if ri < len(purchase_orders) else None,
                    })

            print(f"  Done - {len(successful)} success, {len(failed)} failed")

            i = batch_end
            state["current_sheet"] = sheet
            state["last_batch_start"] = i
            state["current_po_index"] = f"{i}/{total_pos}"
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

    summary_file = os.path.join(folder, f"upload_results{RUN_SUFFIX}.json")
    with open(summary_file, "w") as f:
        json.dump(results, f, indent=2)
    print(f"Results also saved to: {summary_file}")

    # Failure report — every PO that didn't succeed, grouped by reason.
    report = write_failure_report(folder, results)
    if report:
        print(f"Failure report (missing/invalid data) saved to: {report}")
    else:
        print("No failures — all POs succeeded.")

if __name__ == "__main__":
    main()
