# Contract Template Integration Summary

## Overview

I've implemented a dynamic template-based form system for the Contract Create operation. The system allows the form to adapt based on the selected contract template, showing or hiding cost fields and custom sections based on the template configuration.

## What Was Implemented

### 1. Template Manager (`curler/js/template-manager.js`)

A new module that handles:
- Loading templates from the API
- Parsing template structure to determine which fields are visible
- Providing configuration for dynamic form rendering

**Key Methods:**
- `loadTemplates()` - Fetches available templates
- `getTemplateDetails(templateId)` - Gets full template with section_list
- `parseTemplateConfig(template)` - Parses template to extract field visibility
- `isFeatureEnabled(level, feature)` - Checks if a feature is available
- `getCustomSections(level)` - Gets custom sections for a level

### 2. Template Configuration Structure

The template config identifies which fields are visible at three levels:

```javascript
{
    contractLevel: {
        additionalCosts: boolean,
        taxes: boolean,
        discounts: boolean,
        customSections: []
    },
    itemLevel: {
        additionalCosts: boolean,
        taxes: boolean,
        discounts: boolean,
        customSections: []
    },
    tierLevel: {
        additionalCosts: boolean,
        taxes: boolean,
        discounts: boolean
    }
}
```

### 3. UI Controller Updates

**Added:**
- `templateManager` parameter to constructor
- `_handleTemplateChange(templateName)` - Handles template selection
- `_updateFormVisibilityFromTemplate(config)` - Updates form based on template config
- Template change event listener in `_setupContractCreateListeners()`

### 4. Integration Points

**Files Modified:**
- `curler/index.html` - Added template-manager.js script tag
- `curler/js/main.js` - Initialize TemplateManager and pass to UIController
- `curler/js/ui-controller.js` - Added template handling logic

## How It Works

### Current Implementation (Phase 1)

1. **Template Loading:**
   - When Contract Create form loads, `_loadTemplates()` fetches templates from API
   - Populates dropdown with available templates
   - API endpoint: `{baseUrl}/module_templates/?entity_id={entityId}&template_type=CLM`

2. **Template Selection:**
   - User selects a template from dropdown
   - `_handleTemplateChange()` is triggered
   - Currently logs the change (full implementation pending API availability)

3. **Form Adaptation (Ready for Phase 2):**
   - `_updateFormVisibilityFromTemplate()` method is ready
   - Will enable/disable toggles based on template configuration
   - Will show/hide form sections dynamically

### Template Structure (from templates.md)

Templates contain `section_list` with sections like:

```javascript
{
    "section_id": "essential-terms",
    "name": "Essential Terms",
    "section_type": "ITEM",  // or "OTHER" for contract-level
    "section_items": [
        {
            "name": "Additional costs",
            "constraints": { "field_type": "COLLECTION" },
            "is_builtin_field": true,
            "field_level": "ITEM",
            "additional_information": {
                "is_hidden": true,  // ← This determines visibility
                "is_visible": false,
                "is_negotiable": false
            }
        }
    ]
}
```

## What Changes Based on Template

### Contract-Level (section_type: "OTHER")
- Additional costs visibility
- Taxes visibility
- Discounts visibility
- Custom sections/fields

### Item-Level (section_type: "ITEM")
- Additional costs visibility
- Taxes visibility
- Discounts visibility
- Custom sections/fields

### Tier-Level (inside pricing_tiers)
- Inherits from item-level configuration
- Additional costs visibility
- Taxes visibility
- Discounts visibility

## What Stays the Same

- Basic contract structure (dates, vendor info, etc.)
- 1-tier vs 2-tier is just about `pricing_tiers` array length
- Core required fields

## Next Steps for Full Implementation

### Phase 2: Complete Template Integration

1. **Fetch Full Template Details:**
   ```javascript
   // In _handleTemplateChange()
   const template = await this.templateManager.getTemplateDetails(templateId);
   const config = this.templateManager.parseTemplateConfig(template);
   this._updateFormVisibilityFromTemplate(config);
   ```

2. **API Endpoint Needed:**
   - Endpoint to get full template details with `section_list`
   - Currently using: `/module_templates/?entity_id={id}&template_type=CLM`
   - May need: `/module_templates/{template_id}/` for full details

3. **Dynamic Form Rendering:**
   - Enable/disable toggles based on `is_hidden` field
   - Show/hide cost sections automatically
   - Render custom fields from template
   - Update payload builder to respect template config

4. **Payload Building:**
   - Only include fields that are visible in template
   - Validate against template constraints
   - Handle custom sections properly

## Testing the Current Implementation

1. **Open Contract Create form**
2. **Check template dropdown** - Should show "Loading templates..." then populate with actual templates
3. **Select different templates** - Check browser console for "Template changed to: {name}"
4. **Verify toggles work** - Contract-Level Costs, Tier-Level Costs, etc.

## API Configuration

The template API is already configured in the existing code:

```javascript
// In _loadTemplates()
const baseUrl = this.environmentManager.getFactwiseBaseUrl();
const url = `${baseUrl}module_templates/?entity_id=${entityId}&template_type=CLM`;

const response = await fetch(url, {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});
```

## Benefits

1. **Dynamic Forms** - Form adapts to template configuration automatically
2. **Reduced Errors** - Only show fields that are valid for the template
3. **Better UX** - Users don't see irrelevant fields
4. **Maintainable** - Template changes in backend automatically reflect in UI
5. **Scalable** - Same pattern can be used for other modules (PO, Items, etc.)

## Architecture

```
User selects template
        ↓
_handleTemplateChange()
        ↓
TemplateManager.getTemplateDetails()
        ↓
TemplateManager.parseTemplateConfig()
        ↓
_updateFormVisibilityFromTemplate()
        ↓
Form sections show/hide dynamically
        ↓
Payload builder respects template config
```

## Summary

The foundation for dynamic template-based forms is now in place. The system:

✅ Loads templates from API
✅ Populates dropdown with available templates
✅ Detects template changes
✅ Has infrastructure for parsing template configuration
✅ Has methods ready for dynamic form updates

🔄 Pending (Phase 2):
- Full template details API integration
- Automatic form field visibility updates
- Custom field rendering from template
- Payload validation against template

The current implementation provides the structure needed for full template integration once the complete template details API is available.
