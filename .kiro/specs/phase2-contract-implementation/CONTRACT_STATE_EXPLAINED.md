# Contract State API - Explained

## What is Contract State?

The Contract State API (`PUT /openapi/contract/state/`) is used to **terminate contracts**. It's a simple endpoint with limited functionality.

## Supported Status

**Only ONE status is supported:**
- ✅ **TERMINATED** - Marks the contract as terminated/ended

## Why Only TERMINATED?

Looking at the API code:
```python
status = serializers.ChoiceField(
    choices=[
        (ContractState.CONTRACT_TERMINATED.value, ContractState.CONTRACT_TERMINATED.name),
    ]
)
```

The API explicitly only allows `TERMINATED` status. This is by design - the Contract State endpoint is specifically for terminating contracts, not for general status updates.

## Other Contract Statuses

If you look at Contract Create/Update APIs, they support different statuses:
- **DRAFT** - Contract is being drafted
- **SUBMITTED** - Contract has been submitted for approval
- **TERMINATED** - Contract has been terminated

But the **State API only handles termination**.

## Required Fields

1. **Contract ID** (one of):
   - `factwise_contract_id` - The Factwise system contract ID
   - `ERP_contract_id` - The ERP system contract ID
   - At least ONE must be provided

2. **Status**:
   - Must be `"TERMINATED"`
   - This is the only valid value

3. **Notes** (optional):
   - Reason for termination or additional context

## Example Payload

```json
{
  "factwise_contract_id": "C000189",
  "status": "TERMINATED",
  "notes": "Contract ended due to vendor non-performance"
}
```

Or with ERP ID:

```json
{
  "ERP_contract_id": "CONTRACT_001",
  "status": "TERMINATED",
  "notes": "Project cancelled"
}
```

## Updated Form

The Contract State form now:
1. ✅ Shows a warning that only TERMINATED status is supported
2. ✅ Has separate fields for Factwise Contract ID and ERP Contract ID
3. ✅ Explains that at least one ID is required
4. ✅ Has status dropdown with only TERMINATED option
5. ✅ Has notes field for termination reason

## Comparison with Your Example

Your example payload was actually for **Purchase Order Terminate**, not Contract State:
```json
{
  "modified_by_user_email": "globalfieldsETE@gmail.com",
  "status": "ACCEPTED",  // ← This is PO status, not contract
  "factwise_po_id": "PO000146-R3",
  "ERP_po_id": "PO_CREATE-3",
  "notes": "aise hi"
}
```

The actual Contract State API is simpler and only supports termination.

## Why "ACCEPTED" in Your Example?

"ACCEPTED" is a **Purchase Order status**, not a Contract status. Purchase Orders have different statuses like:
- DRAFT
- ISSUED
- ACCEPTED
- REJECTED
- etc.

But Contracts only have DRAFT, SUBMITTED, and TERMINATED.

## Summary

- **Contract State API** = Terminate contracts only
- **Only status**: TERMINATED
- **Required**: Either factwise_contract_id OR ERP_contract_id
- **Optional**: notes
- **Use case**: When you need to end/cancel a contract

