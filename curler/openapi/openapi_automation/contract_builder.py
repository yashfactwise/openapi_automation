#!/usr/bin/env python3
"""
Contract Payload Builder - Interactive Script
Creates contract payloads for Factwise OpenAPI based on approved flow V2
"""

import json
import re
from datetime import date, timedelta, datetime
from pathlib import Path


# Default configuration from CURL payload
DEFAULT_CONFIG = {
    "created_by_user_email": "globalfieldsETE@gmail.com",
    "entity_name": "FactWise",
    "buyer_contact": "globalfieldsETE@gmail.com",
    "buyer_address": "Main address",
    "buyer_identifications": ["GST"],
    "factwise_vendor_code": "V001",
    "ERP_vendor_code": None,
    "vendor_contact": "dimple@factwise.io",
    "vendor_address": {"address_id": None, "full_address": "432 Tool Ave, Chicago"},
    "vendor_identifications": [{"identification_name": "Precision Tools Corp.", "identification_value": "901234567"}],
    "template_name": "Syrma Open API",
    "incoterm": "CFR",
    "project": "P000039",
    "additional_costs": [],
    "taxes": [],
    "discounts": [],
    "prepayment_percentage": 10,
    "payment_type": "PER_INVOICE_ITEM",
    "payment_terms": {"term": 1, "period": "MONTHS", "applied_from": "INVOICE_DATE"},
    "deliverables_payment_terms": [],
    "lead_time": "10",
    "lead_time_period": "DAYS",
    "custom_sections": [
        {"name": "Contract Details", "custom_fields": []},
        {"name": "Essential Terms", "section_type": "ITEM", "custom_fields": []},
        {"name": "Payment and Delivery Terms", "section_type": "ITEM", "custom_fields": []}
    ],
    "attachments": [],
    "terms_and_conditions": {"data": "", "name": "FactWise Default TNC"},
}

# Currency mapping (from actual CURL payload)
CURRENCY_MAP = {
    "INR": "a8c3e3fd-b05f-4d09-bd2f-9fedd07d0ec3",  # From your payload
    "USD": "a8c3e3fd-b05f-4d09-bd2f-9fedd07d0ec3",  # TODO: Get actual USD UUID
    "AED": "a8c3e3fd-b05f-4d09-bd2f-9fedd07d0ec3",  # TODO: Get actual AED UUID
}

CURRENCY_SYMBOLS = {
    "INR": "₹",
    "USD": "$",
    "AED": "د.إ",
}

# Measurement unit mapping (from actual CURL payload)
MEASUREMENT_UNIT_MAP = {
    "unit": "21213178-90a1-4663-bd7c-8b79dedc295a",  # From your payload - default unit
    "Kilogram": "f16d124e-db59-48fe-a2b8-19f625745cbf",  # From latest example
    "Meter": "21213178-90a1-4663-bd7c-8b79dedc295a",  # TODO: Get actual Meter UUID
    "Piece": "21213178-90a1-4663-bd7c-8b79dedc295a",  # TODO: Get actual Piece UUID
    "Liter": "21213178-90a1-4663-bd7c-8b79dedc295a",  # TODO: Get actual Liter UUID
}

# Default measurement unit
DEFAULT_MEASUREMENT_UNIT = "unit"
DEFAULT_MEASUREMENT_UNIT_ID = "21213178-90a1-4663-bd7c-8b79dedc295a"

VALID_INCOTERMS = ["EXW", "FCA", "CPT", "CIP", "DAP", "DPU", "DDP", "FAS", "FOB", "CFR", "CIF"]


def clear_screen():
    """Clear terminal screen"""
    import os
    os.system('cls' if os.name == 'nt' else 'clear')


def print_header(title):
    """Print formatted header"""
    print("\n" + "═" * 70)
    print(f"  {title}")
    print("═" * 70 + "\n")


def print_section(title):
    """Print section header"""
    print("\n" + "─" * 70)
    print(f"  {title}")
    print("─" * 70 + "\n")


def validate_date(date_str):
    """Validate date format YYYY-MM-DD"""
    try:
        datetime.strptime(date_str, '%Y-%m-%d')
        return True
    except ValueError:
        return False


def validate_uuid(uuid_str):
    """Validate UUID format"""
    uuid_pattern = re.compile(r'^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$', re.IGNORECASE)
    return bool(uuid_pattern.match(uuid_str))


def get_measurement_unit_id(input_str):
    """Get measurement unit ID from name or UUID"""
    # Check if it's a UUID
    if validate_uuid(input_str):
        return input_str
    
    # Try to find in mapping
    if input_str in MEASUREMENT_UNIT_MAP:
        return MEASUREMENT_UNIT_MAP[input_str]
    
    return None


def step1_global_fields():
    """Step 1: Global Contract Fields"""
    today = date.today()
    two_weeks_later = today + timedelta(weeks=2)
    
    contract_name = "OpenAPI - Test Automation"
    start_date = today.strftime('%Y-%m-%d')
    end_date = two_weeks_later.strftime('%Y-%m-%d')
    
    while True:
        clear_screen()
        print_header("GLOBAL CONTRACT FIELDS")
        
        print("Hi! Let's make a CURL request for your dev server account.\n")
        print("I've set some smart defaults:\n")
        print(f"  1. Contract Name:       {contract_name}")
        print(f"  2. Contract Start Date: {start_date} (today)")
        print(f"  3. Contract End Date:   {end_date} (2 weeks from today)")
        print()
        print("  4. Continue →")
        print()
        
        choice = input("Enter 1-3 to change, or 4 to continue: ").strip()
        
        if choice == "1":
            contract_name = input("Enter contract name: ").strip()
            if not contract_name:
                print("  ⚠ Contract name cannot be empty")
                input("Press Enter to continue...")
        elif choice == "2":
            new_date = input("Enter start date (YYYY-MM-DD): ").strip()
            if validate_date(new_date):
                start_date = new_date
            else:
                print("  ⚠ Invalid format. Use YYYY-MM-DD (e.g., 2026-02-13)")
                input("Press Enter to continue...")
        elif choice == "3":
            new_date = input("Enter end date (YYYY-MM-DD): ").strip()
            if validate_date(new_date):
                if new_date > start_date:
                    end_date = new_date
                else:
                    print("  ⚠ End date must be after start date")
                    input("Press Enter to continue...")
            else:
                print("  ⚠ Invalid format. Use YYYY-MM-DD (e.g., 2026-02-13)")
                input("Press Enter to continue...")
        elif choice == "4":
            return contract_name, start_date, end_date
        else:
            print("  ⚠ Invalid choice. Enter 1-4.")
            input("Press Enter to continue...")


def step2_status():
    """Step 2: Contract Status"""
    while True:
        clear_screen()
        print_header("CONTRACT STATUS")
        
        print("What should be the contract status?\n")
        print("  1. DRAFT")
        print("  2. SUBMITTED")
        print()
        
        choice = input("Enter 1 or 2: ").strip()
        
        if choice == "1":
            return "DRAFT"
        elif choice == "2":
            return "SUBMITTED"
        else:
            print("  ⚠ Invalid choice. Enter 1 or 2.")
            input("Press Enter to continue...")


def step3_template():
    """Step 3: Template Name"""
    default_template = DEFAULT_CONFIG["template_name"]
    
    while True:
        clear_screen()
        print_header("TEMPLATE NAME")
        
        print(f"Current template: {default_template}\n")
        print("  1. Keep current template")
        print("  2. Change template name")
        print()
        
        choice = input("Enter 1 or 2: ").strip()
        
        if choice == "1":
            return default_template
        elif choice == "2":
            new_template = input("Enter template name: ").strip()
            if new_template:
                return new_template
            else:
                print("  ⚠ Template name cannot be empty")
                input("Press Enter to continue...")
        else:
            print("  ⚠ Invalid choice. Enter 1 or 2.")
            input("Press Enter to continue...")


def step4_incoterm():
    """Step 4: Incoterm"""
    default_incoterm = DEFAULT_CONFIG["incoterm"]
    
    while True:
        clear_screen()
        print_header("INCOTERM")
        
        print(f"Current incoterm: {default_incoterm}\n")
        print(f"Valid: {', '.join(VALID_INCOTERMS)}\n")
        print("  1. Keep current (CFR)")
        print("  2. Change incoterm")
        print()
        
        choice = input("Enter 1 or 2: ").strip()
        
        if choice == "1":
            return default_incoterm
        elif choice == "2":
            new_incoterm = input("Enter incoterm: ").strip().upper()
            if new_incoterm in VALID_INCOTERMS:
                return new_incoterm
            else:
                print(f"  ⚠ Invalid. Valid: {', '.join(VALID_INCOTERMS)}")
                input("Press Enter to continue...")
        else:
            print("  ⚠ Invalid choice. Enter 1 or 2.")
            input("Press Enter to continue...")


def step5_items(contract_incoterm):
    """Step 5: Contract Items"""
    items = []
    
    while True:
        clear_screen()
        print_header("CONTRACT ITEMS")
        
        print(f"Current items: {len(items)}\n")
        
        if items:
            print("Items added:")
            for idx, item in enumerate(items, 1):
                item_code = item.get('factwise_item_code', 'Unknown')
                num_tiers = len(item.get('pricing_tiers', []))
                print(f"  {idx}. {item_code} ({num_tiers} tier{'s' if num_tiers != 1 else ''})")
            print()
        
        print("  1. Add new item")
        print("  2. Continue to review →")
        print()
        
        choice = input("Enter 1 or 2: ").strip()
        
        if choice == "1":
            item = create_item(len(items) + 1, contract_incoterm)
            if item:
                items.append(item)
                # Show item complete summary
                show_item_complete(item, len(items))
        elif choice == "2":
            if len(items) > 0:
                return items
            else:
                print("  ⚠ You must add at least one item")
                input("Press Enter to continue...")
        else:
            print("  ⚠ Invalid choice. Enter 1 or 2.")
            input("Press Enter to continue...")


def create_item(item_number, contract_incoterm):
    """Create a single item"""
    clear_screen()
    print_header(f"ITEM #{item_number}")
    
    # Ask for item code (REQUIRED)
    while True:
        item_code = input("Enter Factwise Item Code (required): ").strip()
        if item_code:
            break
        print("  ⚠ Item code is required")
    
    # Ask for measurement unit (OPTIONAL - has default)
    print("\n  Common measurement units: unit (default), Kilogram, Meter, Piece, Liter")
    print("  Or enter UUID for other units")
    measurement_unit_input = input(f"Measurement Unit [unit]: ").strip()
    if not measurement_unit_input:
        measurement_unit_input = DEFAULT_MEASUREMENT_UNIT
        measurement_unit_id = DEFAULT_MEASUREMENT_UNIT_ID
    else:
        unit_id = get_measurement_unit_id(measurement_unit_input)
        if unit_id:
            measurement_unit_id = unit_id
        else:
            print("  ⚠ Unit not recognized, using default 'unit'")
            measurement_unit_input = DEFAULT_MEASUREMENT_UNIT
            measurement_unit_id = DEFAULT_MEASUREMENT_UNIT_ID
    
    # Ask for currency (OPTIONAL - has default)
    print("\n  Currency options: INR (default), USD, AED")
    print("  Or enter UUID for other currencies")
    currency = input("Currency [INR]: ").strip().upper()
    if not currency:
        currency = "INR"
    elif currency not in CURRENCY_MAP and not validate_uuid(currency.lower()):
        print("  ⚠ Currency not recognized, using default INR")
        currency = "INR"
    elif validate_uuid(currency.lower()):
        # User entered UUID directly
        CURRENCY_MAP[currency] = currency
    
    print(f"\n  ✓ Item Code: {item_code}")
    print(f"  ✓ Measurement Unit: {measurement_unit_input}")
    print(f"  ✓ Currency: {currency}")
    print()
    input("Press Enter to continue to pricing tiers...")
    
    # Create pricing tiers
    tiers = create_pricing_tiers(item_number, currency)
    if tiers:
        return {
            "ERP_item_code": None,
            "factwise_item_code": item_code,
            "currency_code_id": CURRENCY_MAP[currency],
            "measurement_unit_id": measurement_unit_id,
            "attributes": [],
            "prepayment_percentage": 100,
            "payment_type": "PER_INVOICE_ITEM",
            "payment_terms": {"term": 1, "period": "MONTHS", "applied_from": "INVOICE_DATE"},
            "deliverables_payment_terms": [],
            "lead_time": "10",
            "lead_time_period": "DAYS",
            "pricing_tiers": tiers,
            "additional_costs": [],
            "taxes": [],
            "discounts": [],
            "attachments": [],
            "custom_sections": [
                {"name": "Essential Terms", "custom_fields": []},
                {"name": "Payment and Delivery Terms", "custom_fields": []}
            ],
            "_display_unit": measurement_unit_input,
            "_display_currency": currency
        }
    else:
        return None


def create_pricing_tiers(item_number, currency):
    """Create pricing tiers for an item"""
    clear_screen()
    print_section("PRICING TIERS")
    
    while True:
        num_tiers_input = input("How many pricing tiers? [1]: ").strip()
        if not num_tiers_input:
            num_tiers = 1
            break
        try:
            num_tiers = int(num_tiers_input)
            if num_tiers > 0:
                break
            else:
                print("  ⚠ Must be a positive number")
        except ValueError:
            print("  ⚠ Must be a number")
    
    tiers = []
    for i in range(num_tiers):
        tier = create_single_tier(i + 1, num_tiers, item_number, currency, tiers)
        if tier:
            tiers.append(tier)
        else:
            return None
    
    return tiers


def create_single_tier(tier_number, total_tiers, item_number, currency, previous_tiers):
    """Create a single pricing tier"""
    clear_screen()
    print_header(f"TIER #{tier_number} of {total_tiers} (Item #{item_number})")
    
    # Suggest min quantity from previous tier
    suggested_min = None
    if previous_tiers:
        suggested_min = previous_tiers[-1]["max_quantity"]
    
    # Ask for min quantity (REQUIRED)
    while True:
        if suggested_min:
            min_input = input(f"Min Quantity [{suggested_min}]: ").strip()
            if not min_input:
                min_qty = str(suggested_min)
                break
        else:
            min_input = input("Min Quantity (required): ").strip()
        
        if min_input:
            try:
                float(min_input)
                min_qty = min_input
                break
            except ValueError:
                print("  ⚠ Must be a number")
        elif not suggested_min:
            print("  ⚠ Min quantity is required")
    
    # Ask for max quantity (REQUIRED)
    while True:
        max_input = input("Max Quantity (required): ").strip()
        if max_input:
            try:
                max_val = float(max_input)
                if max_val <= float(min_qty):
                    print("  ⚠ Max must be greater than min")
                else:
                    max_qty = max_input
                    break
            except ValueError:
                print("  ⚠ Must be a number")
        else:
            print("  ⚠ Max quantity is required")
    
    # Ask for rate (REQUIRED)
    while True:
        rate_input = input("Rate per unit (required): ").strip()
        if rate_input:
            try:
                float(rate_input)
                rate = rate_input
                break
            except ValueError:
                print("  ⚠ Must be a number")
        else:
            print("  ⚠ Rate is required")
    
    # Ask for discounts (OPTIONAL)
    discounts = []
    while True:
        print(f"\n  Current discounts: {len(discounts)}")
        add_more = input("Add discount? (y/n) [n]: ").strip().lower()
        if add_more == 'y':
            discount = add_discount()
            if discount:
                discounts.append(discount)
        else:
            break
    
    print(f"\n  ✓ Tier {tier_number}: {min_qty}-{max_qty} units @ {rate}/unit")
    if discounts:
        for d in discounts:
            print(f"    - {d['name']}: {d['value']}%")
    
    return {
        "min_quantity": min_qty,
        "max_quantity": max_qty,
        "rate": rate,
        "additional_costs": [],
        "taxes": [],
        "discounts": discounts
    }


def show_item_complete(item, item_number):
    """Show item complete summary"""
    clear_screen()
    print_section(f"ITEM #{item_number} COMPLETE")
    
    item_code = item.get('factwise_item_code', 'Unknown')
    unit = item.get('_display_unit', 'Unknown')
    currency = item.get('_display_currency', 'INR')
    currency_symbol = CURRENCY_SYMBOLS.get(currency, '')
    tiers = item.get('pricing_tiers', [])
    
    print(f"  ✓ Item: {item_code}")
    print(f"  ✓ Measurement Unit: {unit}")
    print(f"  ✓ Currency: {currency}")
    print(f"  ✓ Tiers: {len(tiers)}")
    
    for idx, tier in enumerate(tiers, 1):
        min_qty = tier.get('min_quantity', '?')
        max_qty = tier.get('max_quantity', '?')
        rate = tier.get('rate', '?')
        discounts = tier.get('discounts', [])
        
        tier_str = f"    - Tier {idx}: {min_qty}-{max_qty} units @ {currency_symbol}{rate}/unit"
        if discounts:
            discount_str = ", ".join([f"{d['name']}: {d['value']}%" for d in discounts])
            tier_str += f" ({discount_str})"
        print(tier_str)
    
    print()
    input("Press Enter to continue...")


def add_discount():
    """Add discount to tier"""
    print("\nAdd discount?")
    print("  1. Yes - add discount")
    print("  2. No - skip")
    
    choice = input("Enter 1 or 2: ").strip()
    
    if choice == "1":
        name = input("Enter discount name [Discount]: ").strip()
        if not name:
            name = "Discount"
        
        value = input("Enter discount value (percentage): ").strip()
        try:
            float(value)
            return {"name": name, "value": value}
        except ValueError:
            print("  ⚠ Must be a number")
            return None
    
    return None


def step6_review(payload, items):
    """Step 6: Review & Generate"""
    while True:
        clear_screen()
        print_header("REVIEW YOUR CONTRACT")
        
        print("Contract Summary:\n")
        print(f"  Name:     {payload['contract_name']}")
        print(f"  Period:   {payload['contract_start_date']} to {payload['contract_end_date']}")
        print(f"  Status:   {payload['status']}")
        print(f"  Buyer:    {payload['entity_name']}")
        print(f"  Vendor:   {payload['factwise_vendor_code']}")
        print(f"  Template: {payload['template_name']}")
        print(f"  Incoterm: {payload['incoterm']}")
        print(f"  Items:    {len(items)}")
        print()
        
        for idx, item in enumerate(items, 1):
            item_code = item.get('factwise_item_code', 'Unknown')
            num_tiers = len(item.get('pricing_tiers', []))
            print(f"  {idx}. {item_code} ({num_tiers} tier{'s' if num_tiers != 1 else ''})")
        
        print()
        print("  1. Edit items")
        print("  2. Generate payload →")
        print("  3. Cancel")
        print()
        
        choice = input("Enter 1, 2, or 3: ").strip()
        
        if choice == "1":
            return "edit"
        elif choice == "2":
            return "generate"
        elif choice == "3":
            return "cancel"
        else:
            print("  ⚠ Invalid choice. Enter 1, 2, or 3.")
            input("Press Enter to continue...")


def generate_output(payload):
    """Step 7: Generate output files"""
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    
    # Create output directory
    output_dir = Path("factwise/openapi/openapi_automation/outputs")
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Clean up display fields from items
    for item in payload.get('contract_items', []):
        item.pop('_display_unit', None)
        item.pop('_display_currency', None)
    
    # Save JSON payload
    json_file = output_dir / f"contract_payload_{timestamp}.json"
    with open(json_file, 'w') as f:
        json.dump(payload, f, indent=2)
    
    # Generate CURL command
    curl_file = output_dir / f"contract_curl_{timestamp}.sh"
    curl_command = generate_curl_command(payload)
    with open(curl_file, 'w') as f:
        f.write(curl_command)
    
    clear_screen()
    print_header("SUCCESS!")
    
    print("  ✓ Payload generated!\n")
    print(f"  JSON File: {json_file}")
    print(f"  CURL File: {curl_file}")
    print()
    print("=" * 70)
    print("  CURL COMMAND (Copy-paste to Postman or terminal)")
    print("=" * 70)
    print()
    print(curl_command)
    print()
    print("=" * 70)
    print()
    print("  💡 Tip: Update YOUR_API_KEY and YOUR_API_ID before running")
    print()
    input("Press Enter to exit...")


def generate_curl_command(payload):
    """Generate CURL command"""
    api_url = "https://n29p4xri95.execute-api.us-east-1.amazonaws.com/dev/api/contract/create/"
    payload_json = json.dumps(payload, indent=2)
    
    curl = f"""curl --location '{api_url}' \\
--header 'Content-Type: application/json' \\
--header 'api-id: h7kbdchbl2' \\
--header 'x-api-key: G620jT6lwx3IbKQKFtmlw9zNYvqVZLQQ5HHCexBj' \\
--data-raw '{payload_json}'"""
    
    return curl


def main():
    """Main execution"""
    clear_screen()
    print("\n")
    print("╔════════════════════════════════════════════════════════════════════╗")
    print("║                                                                    ║")
    print("║        Contract Payload Builder - OpenAPI Automation              ║")
    print("║                                                                    ║")
    print("║  This tool helps you create contract payloads for your            ║")
    print("║  dev server account with smart defaults.                          ║")
    print("║                                                                    ║")
    print("╚════════════════════════════════════════════════════════════════════╝")
    print("\n")
    input("Press Enter to start...")
    
    # Step 1: Global fields
    contract_name, start_date, end_date = step1_global_fields()
    
    # Step 2: Status
    status = step2_status()
    
    # Step 3: Template
    template_name = step3_template()
    
    # Step 4: Incoterm
    incoterm = step4_incoterm()
    
    # Step 5: Items
    items = step5_items(incoterm)
    
    # Build payload
    payload = {
        **DEFAULT_CONFIG,
        "contract_name": contract_name,
        "contract_start_date": start_date,
        "contract_end_date": end_date,
        "status": status,
        "template_name": template_name,
        "incoterm": incoterm,
        "ERP_contract_id": None,
        "contract_items": items
    }
    
    # Step 6: Review
    while True:
        action = step6_review(payload, items)
        if action == "edit":
            items = step5_items(incoterm)
            payload["contract_items"] = items
        elif action == "generate":
            generate_output(payload)
            break
        elif action == "cancel":
            print("\nCancelled.")
            break


if __name__ == "__main__":
    main()
