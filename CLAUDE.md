# Curler — Claude Context

## What this project is
A frontend testing tool for the **Factwise OpenAPI** (procurement/CLM platform). It lets developers send arbitrary API payloads — including intentionally malformed ones — to test edge cases. The backend API is the source of truth; the frontend should **never block submission**.

The actual Factwise OpenAPI lives in `openapi/` (Python/Django). **Do NOT touch that folder** — it's the API under test.

The UI is in `curler/js/` and `curler/index.html`.

---

## Architecture

### Key files
- `curler/js/ui-controller.js` — **main file**, all form rendering, payload building, API calls
- `curler/js/template-manager.js` — template parsing (`parseTemplateConfig`, `parseVendorTemplateConfig`, etc.)
- `curler/js/api-client.js` — HTTP request execution
- `curler/js/curl-generator.js` — generates cURL command display
- `curler/js/main.js` — entry point, instantiates UIController
- `curler/index.html` — single-page app

### Template files (API response examples)
- `contract-template.md` — CLM template API response (list of templates with section_list)
- `item-template.md` — item template structure
- `po-template.md` — PO template structure
- `project-template.md` — project template structure
- `vendor-template.md` — vendor template structure

---

## Factwise API patterns

### Base URL
`https://api-newdbtest.factwise.io` (configured in environment manager)

### Authentication
Bearer token — managed by `token-manager.js`

### Template loading
- List templates: `GET /api/CLM/template/` → returns array of `{ template_id, name, status, section_list, ... }`
- Template statuses: `ONGOING` (usable), `DRAFT`/`REVISED` (disabled — cannot create contracts from these)

### Template structure
Each template has `section_list[]` → `section_items[]`. Key fields on each item:
- `is_builtin_field` — true for standard fields, false for custom
- `field_level` — `"ITEM"` (per item/tier) or `"OTHER"` (contract level)
- `section_type` — `"ITEM"` or `"OTHER"`
- `additional_information.is_hidden` — if true, field is hidden/disabled in this template
- `additional_information.additional_cost_information` → this is an **additional cost** field
- `additional_information.taxes_information` → this is a **tax** field
- `additional_information.discount_information` → this is a **discount** field
- Non-builtin fields without any of the above → **custom fields**

### `parseTemplateConfig(template)` in template-manager.js
Returns `{ contractLevel, itemLevel, tierLevel }` each with:
- `costFields[]`, `taxFields[]`, `discountFields[]` — non-builtin typed cost fields
- `customSections[]` — non-builtin custom fields
- `additionalCosts`, `taxes`, `discounts` — booleans

### Contract Create API
`POST /api/CLM/contract/` → `201` response: `{ "custom_contract_id": "C859755" }` (NOT a UUID)

To get the UUID for deep-linking, use the Dashboard API (see below).

### Dashboard API
`POST /dashboard/` with `{ dashboard_view: "contract_buyer", tab: "all" }` (tab is required)
Returns array of records each with `{ contract_id (UUID), template_id (UUID), custom_contract_id, ... }`

Valid tab values: `drafts`, `ongoing`, `finished`, `submitted`, `renewed`, `expired`, `terminated`, `all`

### View Contract URL
`https://factwise-newdbtest.netlify.app/buyer/CLM/template/{template_id}/contract/{contract_id}`

---

## Contract Create form — current state

### Toggles (4 total)
Toggles are disabled with tooltip if the selected template has no fields for that type.
If template has **mandatory** fields for a type, the toggle is forced ON and cannot be turned off.
Disabled toggle = `opacity: 0.5`, `cursor: not-allowed`, `title: "Not available in selected template"`.
Locked toggle = `opacity: 1`, `cursor: default`, `title: "Required by template — cannot be turned off"`.

1. **Additional Costs** (`toggle-additional-costs`) — enabled if `config.itemLevel.costFields.length > 0`, locked ON if any have `is_mandatory`
2. **Taxes** (`toggle-taxes`) — enabled if `config.itemLevel.taxFields.length > 0`, locked ON if any have `is_mandatory`
3. **Contract Custom Fields** (`toggle-contract-custom`) — enabled if `config.contractLevel.customSections.length > 0`
4. **Item Custom Fields** (`toggle-item-custom`) — enabled if `config.itemLevel.customSections.length > 0`

**Discounts** have no toggle — auto show/hide based on `config.itemLevel.discountFields.length > 0`.

Update form uses same IDs with `-update` suffix: `toggle-additional-costs-update`, etc.

Toggle state is applied by `_updateFormVisibilityFromTemplate(config)` via helper `applyToggleState(toggleId, enabled, rerender, forcedOn)`:
- If disabled, unchecks the toggle and calls `_updateTierCostButtons()` if `rerender=true`
- Contract custom toggle also hides the `#contract-custom-section` if disabled

### How toggling works (critical — no re-render)
Toggling costs/taxes/discounts calls `_updateTierCostButtons(isUpdate=false)`:
- Reads current state of all 3 cost toggles
- Walks every `.cc-tier-card` in the items container
- Creates `.tier-costs-section` if it doesn't exist yet (lazy)
- Shows/hides `.tier-costs-section` based on whether any cost toggle is on
- Rebuilds the `+Additional Cost`, `+Tax`, `+Discount` buttons in `.tier-cost-btns` per toggle state
- **Does NOT re-render items** — preserves all form data

Toggling item custom calls `_updateItemCustomVisibility(isUpdate=false)`:
- Shows/hides every `.cc-item-custom-section-wrapper` inside `.cc-item-card`

### Tier defaults
- Tier 1: min=0, max=100
- Tier 2: min=101, max=200
- Tier 3: min=201, max=300
- Formula: `defaultMin = i*100 + (i>0 ? 1 : 0)`, `defaultMax = (i+1)*100`
- **Do NOT use a `lastAddedMax` variable** — always derive from index

### Contract-level costs
Removed entirely from form and payload. `additional_costs: []`, `taxes: []`, `discounts: []` are hardcoded empty arrays in the contract-level payload. No `#contract-costs-section` div exists.

### Tier costs in payload
`PricingTierInputSerializer` has `additional_costs[]`, `taxes[]`, `discounts[]` per tier.
`AdditionalCostInputSerializer`: `{ name, value }` — same shape for all 3 types.

### Cost dropdowns (`_buildCostOptions(level, costType)`)
- `level` = `'item'` or `'contract'`
- `costType` = `'cost'` | `'tax'` | `'discount'`
- Returns `<option>` HTML from `templateConfig[level+'Level'].costFields/taxFields/discountFields`
- Returns `null` if no fields → caller falls back to free text input
- **Requires `templateConfig` to be set** — if it's null, dropdowns silently fall back to text

### Adding a tier cost row (`_addTierCostRow(itemIndex, tierIndex, costType)`)
- Called from `+Additional Cost`, `+Tax`, `+Discount` buttons
- Gets options via `_buildCostOptions('item', costType)`
- If options exist: renders a `<select>` dropdown with those fields
- If no options (null): renders free text `<input>` fallback
- Hidden `<input type="hidden" name="...type">` pre-set to `costType`

### After successful create (201)
Shows "View Contract on Factwise" button. Uses `_lookupContractFromDashboard(customContractId)`:
```js
// POST /dashboard/ with:
{ dashboard_view: 'contract_buyer', items_per_page: 5, page_number: 1,
  query_data: {}, search_text: customContractId, sort_fields: [], filters: null, tab: 'all' }
// Returns: { contractId: match.contract_id, templateId: match.template_id }
```
- Retries up to 3 times with 2s delay between attempts
- Shows "Looking up contract..." while fetching
- On success: blue "View Contract on Factwise" anchor tag
- On failure: shows "Contract created but could not resolve link"

---

## Contract Terminate / Update — contract search

Both forms use `_setupContractLookup(form, tabs)` (set up with `setTimeout(..., 50)` after render):
- Terminate (line ~2329): `_setupContractLookup(form, ['ongoing'])`
- Update (line ~2327): `_setupContractLookup(form, ['all'])`

How it works:
- Fires on both `input` and `focus` events (focus shows 10 latest even with empty query)
- Fetches dashboard API per tab in parallel (`Promise.all`), merges and deduplicates by `custom_contract_id`
- Shows up to 10 results
- Dropdown item shows: `custom_contract_id / ERP_contract_id — contract_name`
- On select: fills in the contract ID fields in the form

---

## Template dropdown behavior (`_loadTemplates`)
- Fetches `GET /api/CLM/template/` with Bearer token
- Shows ALL templates (not filtered by status)
- DRAFT and REVISED templates: `<option disabled>` with tooltip text "Template is in DRAFT/REVISED status"
- Usable templates: `<option value="${t.template_id}" data-name="${t.name}">`
- Auto-selects first usable (non-disabled) template and calls `_handleTemplateChange`
- Template name in payload uses `select.options[select.selectedIndex].dataset.name` (not `.value` which is the UUID)

### `_handleTemplateChange(templateId)` (line ~10965)
```js
const template = this.templateManager.templates.find(t => t.template_id === templateId);
const config = this.templateManager.parseTemplateConfig(template);
this.templateManager.templateConfig = config;   // MUST set this
this.templateManager.currentTemplate = template; // MUST set this
this._updateFormVisibilityFromTemplate(config);
```
Both assignments are required. Missing either one breaks cost dropdowns or toggle states.

---

## Known gotchas / past bugs

1. **`_handleTemplateChange` missing storage**: Was calling `parseTemplateConfig` but not storing result back. Always set BOTH `this.templateManager.templateConfig` and `this.templateManager.currentTemplate` after parsing.

2. **Toggling wipes form**: Toggle listeners must call `_updateTierCostButtons()` / `_updateItemCustomVisibility()`, NOT `_renderContractItems()`. The latter destroys innerHTML and loses all entered data.

3. **Dashboard `tab` required**: Always pass `tab` explicitly as a literal string. The pattern `...(tab ? { tab } : {})` caused "tab required" API errors when tab was falsy. Always include `tab: 'all'` or a specific tab value.

4. **Contract UUID vs code**: Create API returns `custom_contract_id` (like "C859755"), NOT a UUID. Dashboard API must be called post-create to get `contract_id` (UUID) and `template_id` for the deep-link URL.

5. **Cost dropdown showing text input**: Root cause was `_buildCostOptions` returning null because `templateConfig` was null (not stored in `_handleTemplateChange`). Fix: always store config. Secondary cause: calling `_buildCostOptions` with only 1 arg when 2 are required (`level`, `costType`).

6. **Tier min/max consecutive regression**: Was passing `lastAddedMax` and doing `+1` only for the last new tier. Fix: use index-based formula — never derive from previous tier's state.

7. **"Could not resolve link" after create**: Was searching only `tab: 'drafts'` but a just-created contract might land in any tab. Fix: always use `tab: 'all'` in the post-create dashboard lookup.

8. **Disabled toggles still showing all 3 buttons**: Was using a single `showTierCosts` bool — if any toggle was on, all 3 buttons showed. Fix: split into 3 booleans (`showAdditionalCosts`, `showTaxes`, `showDiscounts`) passed separately to `_renderPricingTiers`.

---

## Do NOT touch
- `openapi/` — this is the actual API under test
- The non-blocking philosophy: frontend should never block submission, API errors are expected and fine
