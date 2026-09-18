# Local Script — test the upload scripts against a LOCAL backend

These are **test copies** of the prod upload scripts, pointed at a **local
backend** instead of AWS. Use them to confirm a script actually produces correct
data before running the real one against prod.

## Layout

Each script lives in its **own subfolder** so their input sheets, state files,
`payloads/` and `responses/` never mix. `local_config.py` is shared at the top.

```
Local Script/
├── local_config.py          ← shared host + headers (edit once)
├── README.md
├── PO v2/
│   ├── local_create_po_v2.py
│   └── mappings.example.json
├── PO v1/
│   └── local_create_po_v1.py
├── Contract/
│   └── local_upload_contracts.py
└── Inventory/
    └── local_backfill_inventory.py
```

| Folder / script | What it uploads | Endpoint |
|---|---|---|
| `PO v2/local_create_po_v2.py` | Purchase Orders (SAP-aware: forward-fill, item-level shipping, UUID mapping) | `api/purchase_order/bulk-create/` |
| `PO v1/local_create_po_v1.py` | Purchase Orders (original) | `api/purchase_order/bulk-create/` |
| `Contract/local_upload_contracts.py` | Contracts | `api/contract/bulk-create/` |
| `Inventory/local_backfill_inventory.py` | Inventory entries | `api/inventory/bulk-update/` |
| `local_config.py` | **Shared config** — host + headers for all of the above | — |
| `PO v2/mappings.example.json` | currency/unit code → UUID lookup (for PO v2) | — |

Each script finds the shared `local_config.py` automatically (it adds the parent
folder to its import path), so you run a script **from inside its own folder**.

## How local auth works (important)

Locally there is **no api-key / api-id**. The backend's `middleware.py` hardcodes
which enterprise the OpenAPI acts on:

```python
# UserContextMiddleware in middleware.py
else:
    request.enterprise_id = "83e8366d-c133-49a6-bafa-6c7cb53cd243"
```

So testing is a 3-step setup:

### 1. Point the backend at the enterprise you want to test
Edit that line in `middleware.py` to the enterprise_id of the company you want
the data created under. Restart the backend.

### 2. Start the backend so the LAN can reach it
```bash
python manage.py runserver 0.0.0.0:8000
```
`0.0.0.0` (not `127.0.0.1`) is what lets a teammate on the same WiFi hit your IP.

### 3. Tell the scripts where the backend is
Default is `http://localhost:8000/`. To use your machine's IP (so others can
test against it), either:

- **Env var (no code edit):**
  ```powershell
  # PowerShell
  $env:FW_LOCAL_HOST = "http://192.168.1.42:8000/"
  python local_create_po_v2.py
  ```
  ```bash
  # bash
  export FW_LOCAL_HOST="http://192.168.1.42:8000/"
  python local_create_po_v2.py
  ```
- **or** edit `LOCAL_HOST` in `local_config.py`.

Find your IP with `ipconfig` (Windows) → IPv4 Address.

A teammate runs the **same scripts** with `FW_LOCAL_HOST` set to **your** IP.

## Running

1. Put the `.xlsx` you want to test **in that script's own subfolder** (each
   script lists files in its own directory).
2. `cd` into the subfolder and run the script, e.g.:
   ```bash
   cd "PO v2"
   python local_create_po_v2.py
   ```
   It prints a `[LOCAL MODE] target = http://...` banner at the top so you can
   confirm you're NOT hitting prod.
3. It prompts for file → sheet → resume, then uploads in batches and saves
   `payloads/` and `responses/` **inside that subfolder** (no mixing between
   scripts).

### PO v2 needs mappings.json (only if currency/unit are codes)
If your sheet has currency as `USD`/`EUR` and units as `KG`/`SET` (not UUIDs):
copy `mappings.example.json` → `mappings.json` and fill in the real UUIDs.
The script lists any unresolved codes before sending anything.

## Runs don't overwrite each other (auto run-numbering)

Every launch is a **new numbered run**. The script auto-picks the next number by
looking at existing `upload_results_run*.json` files, and **suffixes every output**
with `_runN`:

```
Run 1 →  payloads/batch_Sheet1_0001_run1.json
         responses/response_Sheet1_0001_run1.json
         upload_state_run1.json
         upload_results_run1.json
Run 2 →  ..._run2.json   (run 1's files are untouched)
```

It prints `RUN #N` at startup. So your workflow works cleanly: run it → it
fails → delete the bad rows from the DB → run again, and the new attempt writes
`_run2` files instead of clobbering `_run1`. Nothing is ever overwritten.

## Safe to re-run
Each script keeps its own state/results files (e.g. `upload_state.json`) in this
folder — separate from the prod folders. Delete those if you want a clean test.

## What's different from the prod scripts
Only the config: `BASE_URL` comes from `local_config.py` (your local host) and
the prod `x-api-key`/`api-id` headers are dropped (local middleware ignores them).
All upload logic is identical to the prod versions.
