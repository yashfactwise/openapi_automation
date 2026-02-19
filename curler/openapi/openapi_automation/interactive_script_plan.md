# Interactive Contract Payload Builder - Planning Document

## Purpose
Create an interactive Python script that guides users through building a complete contract creation payload step-by-step, with validation and helpful prompts.

---

## Script Goals

1. **User-Friendly**: Guide users through complex payload creation with clear prompts
2. **Validation**: Validate inputs at each step to catch errors early
3. **Flexibility**: Allow users to skip optional fields or provide minimal data
4. **Reusability**: Save and load partial payloads for iterative building
5. **Output**: Generate valid JSON payload ready for API submission
6. **CURL Generation**: Optionally generate a complete CURL command

---

## Script Architecture

### High-Level Flow
```
1. Welcome & Mode Selection
   ├─ Create New Contract
   ├─ Load Existing Draft
   └─ Exit

2. Basic Contract Information
   ├─ Enterprise & User Details
   ├─ Contract Metadata
   ├─ Dates
   └─ Status

3. Buyer Information
   ├─ Entity Selection
   ├─ Identifications
   ├─ Address
   └─ Contact

4. Vendor Information
   ├─ Vendor Code Selection
   ├─ Identifications
   ├─ Address
   └─ Contact

5. Contract Details
   ├─ Template Selection
   ├─ Project (optional)
   ├─ Payment Terms
   ├─ Incoterm
   ├─ Lead Time
   └─ Terms & Conditions

6. Overall Costs
   ├─ Additional Costs
   ├─ Taxes
   └─ Discounts

7. Contract Items (Loop)
   ├─ Item Selection
   ├─ Currency & UOM
   ├─ Attributes
   ├─ Pricing Tiers (Loop)
   │   ├─ Rate & Quantity Range
   │   └─ Tier Costs
   ├─ Item Payment Terms
   ├─ Item Incoterm
   └─ Custom Sections

8. Custom Sections (Contract Level)

9. Attachments

10. Review & Confirm
    ├─ Display Summary
    ├─ Edit Sections
    └─ Confirm

11. Output Generation
    ├─ Save JSON Payload
    ├─ Generate CURL Command
    └─ Save Draft for Later
```

---

## Module Structure

### File Organization
```
factwise/openapi/openapi_automation/
├── contract_payload_builder.py          # Main script entry point
├── modules/
│   ├── __init__.py
│   ├── validators.py                    # Input validation functions
│   ├── prompts.py                       # User prompt functions
│   ├── data_fetchers.py                 # API/DB data fetching (if needed)
│   ├── payload_builder.py               # Payload construction logic
│   ├── curl_generator.py                # CURL command generation
│   └── file_manager.py                  # Save/load draft functionality
├── templates/
│   └── contract_template.json           # Empty template structure
├── drafts/                               # Saved draft payloads
└── outputs/                              # Generated payloads and CURL commands
```

---

## Key Features

### 1. Interactive Prompts
- Clear, numbered steps
- Show current progress (e.g., "Step 3 of 11")
- Display default values where applicable
- Allow "skip" for optional fields
- Provide examples for complex inputs

### 2. Input Validation
- Email format validation
- Date format validation (YYYY-MM-DD)
- UUID format validation
- Enum value validation (with suggestions)
- Decimal/numeric validation
- Required field enforcement

### 3. Smart Defaults
- Auto-populate enterprise_id from config/environment
- Suggest common values (e.g., "DRAFT" status for new contracts)
- Remember previous inputs within session
- Load defaults from configuration file

### 4. Data Lookup Helpers
- List available entities
- List available templates
- List available currencies
- List available measurement units
- List available incoterms
- Search for items by code/name

### 5. Multi-Item Support
- Add multiple contract items
- Clone item configuration for similar items
- Edit/delete items before finalizing
- Display item summary table

### 6. Pricing Tier Builder
- Add multiple tiers per item
- Validate quantity ranges don't overlap
- Calculate effective rates (if possible)
- Display tier summary

### 7. Cost Management
- Add/edit/remove costs at each level
- Validate cost names against available costs
- Support percentage and fixed costs
- Display cost summary

### 8. Review & Edit
- Display complete payload summary in readable format
- Navigate back to any section to edit
- Validate complete payload before output
- Show validation errors with suggestions

### 9. Output Options
- Save as JSON file
- Generate CURL command with authentication
- Save as draft for later editing
- Copy to clipboard (if supported)
- Display payload in terminal

---

## User Experience Design

### Welcome Screen
```
╔════════════════════════════════════════════════════════════╗
║     Contract Payload Builder - OpenAPI Automation         ║
║                                                            ║
║  This tool helps you create a valid contract payload      ║
║  for the Factwise OpenAPI.                                ║
╚════════════════════════════════════════════════════════════╝

What would you like to do?
  1. Create a new contract payload
  2. Load an existing draft
  3. View documentation
  4. Exit

Enter your choice [1-4]:
```

### Progress Indicator
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Step 3 of 11: Buyer Information
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Input Prompts
```
Enter buyer entity name: _
  (Required) The name of the buyer entity in your enterprise
  Example: "Acme Corporation - Manufacturing Division"
```

### Validation Feedback
```
✗ Invalid email format
  Please enter a valid email address (e.g., user@example.com)
```

### Summary Display
```
╔════════════════════════════════════════════════════════════╗
║                    Contract Summary                        ║
╚════════════════════════════════════════════════════════════╝

Contract Name: Q1 2026 Supply Agreement
Status: DRAFT
Start Date: 2026-01-01
End Date: 2026-12-31

Buyer: Acme Corporation
Vendor: Supplier Inc. (VEND001)

Items: 3
  1. Widget A (1000 units @ $10.00)
  2. Widget B (500 units @ $25.00)
  3. Widget C (2000 units @ $5.00)

Total Value: $35,000.00

Is this correct? [Y/n]:
```

---

## Implementation Phases

### Phase 1: Core Structure (MVP)
- Basic script structure
- Simple prompts for required fields only
- Minimal validation
- JSON output
- No draft saving

**Deliverable**: Working script that creates minimal valid payload

### Phase 2: Enhanced Validation
- Comprehensive input validation
- Enum validation with suggestions
- Format validation (email, date, UUID)
- Required field enforcement
- Error messages with examples

**Deliverable**: Robust validation preventing invalid payloads

### Phase 3: Multi-Item Support
- Add multiple contract items
- Pricing tier builder
- Item-level costs
- Item summary display

**Deliverable**: Full support for complex multi-item contracts

### Phase 4: Advanced Features
- Draft save/load functionality
- Data lookup helpers
- Smart defaults
- Configuration file support
- Progress indicators

**Deliverable**: User-friendly interactive experience

### Phase 5: Output Generation
- CURL command generation
- Multiple output formats
- Clipboard support
- Pretty-printed JSON
- Validation report

**Deliverable**: Complete output generation suite

### Phase 6: Polish & Documentation
- Help system
- Documentation viewer
- Example payloads
- Error recovery
- Undo functionality

**Deliverable**: Production-ready tool

---

## Technical Considerations

### Dependencies
```python
# Standard library
import json
import uuid
import re
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Any

# Third-party (minimal)
import click  # For CLI interface (optional, can use input())
# or use rich for better terminal UI
```

### Configuration File
```json
{
  "api_base_url": "https://api.factwise.com",
  "default_enterprise_id": "uuid",
  "default_user_email": "user@example.com",
  "default_status": "DRAFT",
  "default_incoterm": "EXW",
  "drafts_directory": "./drafts",
  "outputs_directory": "./outputs"
}
```

### Draft File Format
```json
{
  "version": "1.0",
  "created_at": "2026-02-13T10:30:00Z",
  "last_modified": "2026-02-13T11:45:00Z",
  "completion_percentage": 65,
  "completed_sections": [
    "basic_info",
    "buyer_info",
    "vendor_info"
  ],
  "payload": {
    // Partial payload data
  }
}
```

---

## Validation Rules

### Email Validation
```python
def validate_email(email: str) -> bool:
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None
```

### Date Validation
```python
def validate_date(date_str: str) -> bool:
    try:
        datetime.strptime(date_str, '%Y-%m-%d')
        return True
    except ValueError:
        return False
```

### UUID Validation
```python
def validate_uuid(uuid_str: str) -> bool:
    try:
        uuid.UUID(uuid_str)
        return True
    except ValueError:
        return False
```

### Enum Validation
```python
def validate_enum(value: str, valid_values: List[str]) -> bool:
    return value in valid_values

def suggest_enum(value: str, valid_values: List[str]) -> List[str]:
    # Fuzzy matching for suggestions
    return [v for v in valid_values if value.lower() in v.lower()]
```

---

## CURL Generation

### Template
```bash
curl -X POST "https://api.factwise.com/openapi/contracts/create/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "X-Enterprise-ID: {enterprise_id}" \
  -d '{payload_json}'
```

### Features
- Escape special characters in JSON
- Pretty-print for readability
- Include authentication headers
- Add comments for clarity
- Support for environment variables

---

## Error Handling

### User Input Errors
- Invalid format → Show example and retry
- Missing required field → Prompt again with emphasis
- Invalid enum → Show valid options and suggest closest match

### System Errors
- File I/O errors → Graceful fallback
- JSON parsing errors → Show error location
- Validation errors → Detailed error messages

### Recovery Options
- Retry current step
- Skip to next section (if optional)
- Save draft and exit
- Restart from beginning

---

## Testing Strategy

### Unit Tests
- Validation functions
- Payload builder functions
- CURL generator
- File manager

### Integration Tests
- Complete payload generation flow
- Draft save/load cycle
- Multi-item scenarios

### User Acceptance Tests
- Create minimal contract
- Create complex multi-item contract
- Edit and resume draft
- Generate CURL command

---

## Future Enhancements

### Phase 7+
- Web UI version
- API integration for data lookup
- Batch contract creation from CSV
- Template library
- Contract cloning
- Diff viewer for drafts
- Export to Excel/PDF
- Integration with contract management system

---

## Success Criteria

### Must Have
- ✓ Generate valid contract payload
- ✓ Validate all required fields
- ✓ Support multi-item contracts
- ✓ Output JSON file
- ✓ Clear error messages

### Should Have
- ✓ Draft save/load
- ✓ CURL generation
- ✓ Input validation with suggestions
- ✓ Progress indicators
- ✓ Summary display

### Nice to Have
- ✓ Data lookup helpers
- ✓ Configuration file
- ✓ Clipboard support
- ✓ Undo functionality
- ✓ Help system

---

## Next Steps

1. **Review this plan** with stakeholders
2. **Refine requirements** based on feedback
3. **Start Phase 1 implementation** (MVP)
4. **Test with real data** from the system
5. **Iterate based on user feedback**

---

**Status**: Planning Complete  
**Ready for Implementation**: Yes  
**Estimated Effort**: 
- Phase 1 (MVP): 4-6 hours
- Phase 2-3: 8-10 hours
- Phase 4-6: 12-16 hours
- **Total**: 24-32 hours

**Last Updated**: 2026-02-13
