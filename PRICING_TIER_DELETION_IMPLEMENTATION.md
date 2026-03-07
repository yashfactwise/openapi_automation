# Pricing Tier Removal Implementation

## Overview
Added UI support for removing pricing tiers in contract create and update forms. Users can now add and remove pricing tiers just like they can with contract items.

## Changes Made

### 1. Frontend - UI Controller (`curler/js/ui-controller.js`)

#### Updated Pricing Tier Rendering
- Modified `_renderPricingTiers()` - Added remove button for each tier (when more than 1 tier exists)
- Modified `_renderPricingTiersUpdate()` - Added remove button for update form tiers

#### Added Remove Functions
- `_removePricingTier(itemIndex, tierIndex)` - Removes a pricing tier from create form
- `_removePricingTierUpdate(itemIndex, tierIndex)` - Removes a pricing tier from update form

#### Updated Event Listeners
- Modified `_setupContractCreateListeners()` - Added listener for remove tier button clicks
- Modified `_setupContractUpdateListeners()` - Added listener for remove tier button clicks

### 2. Backend - Serializer (`curler/openapi/serializers.py`)
- Added optional `pricing_tier_id` field to `PricingTierInputSerializer` for identifying existing tiers during updates

### 3. Backend - Contract Services (`curler/openapi/services/contract_services.py`)
- Added tier deletion logic in the contract update workflow
- Automatically deletes associated additional costs when a tier is removed
- Maintains data integrity through cascade deletion

## Features

### Create Form
- Click "+ Add Tier" to add new pricing tiers
- Click "✕ Remove" button on any tier (except when only 1 tier exists) to remove it
- Tier numbering updates automatically

### Update Form
- Same add/remove functionality as create form
- Existing tiers can be removed by clicking "✕ Remove"
- New tiers can be added with "+ Add Tier"

### Constraints
- At least 1 pricing tier must exist per contract item
- Remove button only appears when there are 2+ tiers
- Removing a tier automatically removes all associated costs (taxes, discounts, fees)

## User Experience
- Remove buttons appear inline with tier headers
- Red color (#ef4444) indicates destructive action
- Smooth re-rendering when tiers are added/removed
- Tier indices automatically adjust after removal
