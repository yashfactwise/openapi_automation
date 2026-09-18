# Factwise Script API Config

Use this as the quick reference for the bulk upload scripts in this folder.

## Auth Header

All APIM calls use this header name:

```text
Ocp-Apim-Subscription-Key
```

No `x-api-key` or `api-id` header is used for APIM.

## Subscription Keys

Default/current script key:

```text
m9PXj91DWMalPufOh6kUo3Way6zPKByT2rHmleRD
```

Syrma prod:

```text
e253b336821245ca88dc15d7c8f5eb97
```

BKT test:

```text
a71c1f411dea45139a31e5a05ddec9a4
```

## Base URLs

Dev:

```text
https://factwiserestapi.azure-api.net/
```

Prod:

```text
https://factwise-prod-apim-new.azure-api.net/
```

## Example URLs

Dev purchase order lookup:

```text
https://factwiserestapi.azure-api.net/api/purchase_orders/?ERP_po_id=4600038915
```

Prod purchase orders by date range:

```text
https://factwise-prod-apim-new.azure-api.net/api/purchase_orders/?start_datetime=2026-01-15T08%3A00%3A00Z&end_datetime=2026-05-15T09%3A00%3A00Z
```

## Script Endpoint Suffixes

The current upload scripts build URLs by appending these paths to `BASE_URL`:

```text
api/contract/bulk-create/
api/purchase_order/bulk-create/
api/tasks/{task_id}/
```
