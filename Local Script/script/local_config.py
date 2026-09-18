"""
Shared LOCAL config for all the upload scripts in this folder.
================================================================

These are TEST copies that hit a LOCAL backend instead of AWS prod.

How local OpenAPI auth works (see Factwise-Backend/.../middleware.py):
  * There is NO x-api-key / api-id check locally.
  * The enterprise the OpenAPI acts on is HARDCODED in middleware.py
    (UserContextMiddleware -> request.enterprise_id = "<enterprise id>").
  * So locally you just POST to the same /api/... paths with plain
    accept + content-type headers. That's it.

=> Before testing: set the enterprise_id of the company you want to test
   against in middleware.py, start the backend on 0.0.0.0:8000, then run a
   script in this folder.

Pointing at your machine (so a teammate on the same WiFi can test too):
  Option A — edit LOCAL_HOST below to your LAN IP, e.g. "http://192.168.1.42:8000/".
  Option B — leave it and set an env var before running, e.g.:
       (PowerShell)  $env:FW_LOCAL_HOST = "http://192.168.1.42:8000/"
       (bash)        export FW_LOCAL_HOST="http://192.168.1.42:8000/"

  Find your IP:  (Windows) ipconfig  ->  IPv4 Address
  Run the backend so the LAN can reach it:
       python manage.py runserver 0.0.0.0:8000
"""

import os

# Default local host. Override with the FW_LOCAL_HOST env var, or edit this.
# MUST end with a trailing slash — scripts append "api/...".
LOCAL_HOST = os.environ.get("FW_LOCAL_HOST", "http://localhost:8000/")

if not LOCAL_HOST.endswith("/"):
    LOCAL_HOST += "/"

# Base URL every local script uses. Same "api/..." suffix as prod, so the
# endpoint paths are identical (e.g. BASE_URL + "api/purchase_order/bulk-create/").
BASE_URL = LOCAL_HOST


def get_headers():
    """Local headers only — no x-api-key / api-id (middleware hardcodes the
    enterprise locally). Matches the example curl: accept + content-type."""
    return {
        "accept": "application/json",
        "content-type": "application/json",
    }


def banner():
    return f"[LOCAL MODE] target = {BASE_URL}  (auth via middleware.py enterprise_id)"
