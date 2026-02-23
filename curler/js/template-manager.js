/**
 * Template Manager - Handles contract template loading and parsing
 * 
 * Responsibilities:
 * - Load templates from API or local data
 * - Parse template structure to determine visible fields
 * - Provide configuration for dynamic form rendering
 */

class TemplateManager {
    constructor() {
        this.templates = [];
        this.currentTemplate = null;
        this.templateConfig = null;
    }

    /**
     * Load templates (from templates.md data or API)
     * For now, we'll use the templates.md data structure
     */
    async loadTemplates() {
        // TODO: Replace with actual API call when endpoint is available
        // For now, return mock templates based on templates.md structure
        this.templates = [
            {
                template_id: "1ddd7337-ebed-4909-b67e-3c915350b870",
                name: "Default Contract",
                type: "CLM",
                is_default: true
            },
            {
                template_id: "89c58d0e-d495-4385-bc7a-8e557e47ad5d",
                name: "Open API Test",
                type: "CLM",
                is_default: false
            }
        ];

        return this.templates;
    }

    /**
     * Get template details including section configuration
     * @param {string} templateId - Template ID or name
     * @returns {Object} Template with section_list
     */
    async getTemplateDetails(templateId) {
        // TODO: Replace with actual API call
        // For now, return a mock template structure based on templates.md

        // This is a simplified version - in production, fetch from API
        const template = {
            template_id: templateId,
            name: templateId === "1ddd7337-ebed-4909-b67e-3c915350b870" ? "Default Contract" : "Open API Test",
            section_list: [
                {
                    section_id: "contract-details",
                    name: "Contract Details",
                    section_type: "OTHER",
                    section_items: []
                },
                {
                    section_id: "essential-terms",
                    name: "Essential Terms",
                    section_type: "ITEM",
                    section_items: [
                        {
                            section_item_id: "taxes",
                            name: "Taxes",
                            constraints: { field_type: "COLLECTION" },
                            is_builtin_field: true,
                            field_level: "ITEM",
                            additional_information: {
                                is_hidden: true, // Change based on template
                                is_visible: false,
                                is_negotiable: false
                            }
                        },
                        {
                            section_item_id: "additional-costs",
                            name: "Additional costs",
                            constraints: { field_type: "COLLECTION" },
                            is_builtin_field: true,
                            field_level: "ITEM",
                            additional_information: {
                                is_hidden: true, // Change based on template
                                is_visible: false,
                                is_negotiable: false
                            }
                        },
                        {
                            section_item_id: "discounts",
                            name: "Discount information",
                            constraints: { field_type: "COLLECTION" },
                            is_builtin_field: true,
                            field_level: "ITEM",
                            additional_information: {
                                is_hidden: true, // Change based on template
                                is_visible: false,
                                is_negotiable: false
                            }
                        }
                    ]
                },
                {
                    section_id: "payment-delivery",
                    name: "Payment and Delivery Terms",
                    section_type: "ITEM",
                    section_items: []
                }
            ]
        };

        this.currentTemplate = template;
        this.templateConfig = this.parseTemplateConfig(template);
        return template;
    }

    /**
     * Parse template to extract configuration for form rendering
     * @param {Object} template - Template object with section_list
     * @returns {Object} Configuration object
     */
    parseTemplateConfig(template) {
        const config = {
            contractLevel: {
                additionalCosts: false,
                taxes: false,
                discounts: false,
                customSections: []
            },
            itemLevel: {
                additionalCosts: false,
                taxes: false,
                discounts: false,
                customSections: []
            },
            tierLevel: {
                additionalCosts: false,
                taxes: false,
                discounts: false
            }
        };

        if (!template || !template.section_list) {
            return config;
        }

        // Parse sections
        template.section_list.forEach(section => {
            const isItemLevel = section.section_type === "ITEM";
            const isContractLevel = section.section_type === "OTHER";

            section.section_items.forEach(item => {
                const isHidden = item.additional_information?.is_hidden;
                const isVisible = !isHidden;

                // Map field names to config
                if (item.name === "Additional costs" && isVisible) {
                    if (isItemLevel) {
                        config.itemLevel.additionalCosts = true;
                        config.tierLevel.additionalCosts = true; // Tiers inherit from item
                    } else if (isContractLevel) {
                        config.contractLevel.additionalCosts = true;
                    }
                }

                if (item.name === "Taxes" && isVisible) {
                    if (isItemLevel) {
                        config.itemLevel.taxes = true;
                        config.tierLevel.taxes = true;
                    } else if (isContractLevel) {
                        config.contractLevel.taxes = true;
                    }
                }

                if (item.name === "Discount information" && isVisible) {
                    if (isItemLevel) {
                        config.itemLevel.discounts = true;
                        config.tierLevel.discounts = true;
                    } else if (isContractLevel) {
                        config.contractLevel.discounts = true;
                    }
                }

                // Custom fields (non-builtin)
                if (!item.is_builtin_field && isVisible) {
                    const customField = {
                        name: item.name,
                        alternate_name: item.alternate_name,
                        field_type: item.constraints?.field_type,
                        section_name: section.name
                    };

                    if (isItemLevel) {
                        config.itemLevel.customSections.push(customField);
                    } else if (isContractLevel) {
                        config.contractLevel.customSections.push(customField);
                    }
                }
            });
        });

        return config;
    }

    /**
     * Get current template configuration
     * @returns {Object} Current template config
     */
    getCurrentConfig() {
        return this.templateConfig || {
            contractLevel: { additionalCosts: false, taxes: false, discounts: false, customSections: [] },
            itemLevel: { additionalCosts: false, taxes: false, discounts: false, customSections: [] },
            tierLevel: { additionalCosts: false, taxes: false, discounts: false }
        };
    }

    /**
     * Check if a specific feature is enabled in current template
     * @param {string} level - 'contract', 'item', or 'tier'
     * @param {string} feature - 'additionalCosts', 'taxes', 'discounts', or 'customSections'
     * @returns {boolean}
     */
    isFeatureEnabled(level, feature) {
        const config = this.getCurrentConfig();
        const levelKey = level + 'Level';

        if (!config[levelKey]) return false;

        if (feature === 'customSections') {
            return config[levelKey].customSections.length > 0;
        }

        return config[levelKey][feature] === true;
    }

    /**
     * Get custom sections for a specific level
     * @param {string} level - 'contract' or 'item'
     * @returns {Array} Array of custom section definitions
     */
    getCustomSections(level) {
        const config = this.getCurrentConfig();
        const levelKey = level + 'Level';
        return config[levelKey]?.customSections || [];
    }

    /**
     * Parse item template to extract field configuration
     * @param {Object} template - Item template with section_list
     * @returns {Object} Configuration object with fields
     */
    parseItemTemplateConfig(template) {
        const config = {
            builtInFields: [],
            customFields: [],
            additionalCosts: [],
            taxes: [],
            hasHSN: false,
            hasMPN: false,
            hasCPN: false,
            hasERPCode: false,
            hasCustomIds: false,
            hasTags: false,
            hasAttributes: false,
            hasAdditionalCosts: false,
            hasTaxes: false
        };

        if (!template || !template.section_list) {
            return config;
        }

        // Parse sections
        template.section_list.forEach(section => {
            section.section_items.forEach(item => {
                const isHidden = item.additional_information?.is_hidden;
                const isVisible = !isHidden;

                if (!isVisible) return; // Skip hidden fields

                // Built-in fields
                if (item.is_builtin_field) {
                    const fieldName = item.name;

                    // Check for specific built-in fields
                    if (fieldName === 'HSN Code') config.hasHSN = true;
                    if (fieldName === 'MPN Code') config.hasMPN = true;
                    if (fieldName === 'CPN Code') config.hasCPN = true;
                    if (fieldName === 'ERP Code') config.hasERPCode = true;
                    if (fieldName === 'Custom identification') config.hasCustomIds = true;
                    if (fieldName === 'Tag') config.hasTags = true;
                    if (fieldName === 'Specification') config.hasAttributes = true;
                    if (fieldName === 'Additional costs') config.hasAdditionalCosts = true;
                    if (fieldName === 'Taxes') config.hasTaxes = true;

                    config.builtInFields.push({
                        id: item.section_item_id,
                        name: item.name,
                        alternate_name: item.alternate_name,
                        field_type: item.constraints?.field_type,
                        constraints: item.constraints,
                        parent: item.parent_section_item
                    });
                }
                // Custom fields
                else {
                    const fieldInfo = {
                        id: item.section_item_id,
                        name: item.name,
                        alternate_name: item.alternate_name,
                        field_type: item.constraints?.field_type,
                        constraints: item.constraints,
                        parent: item.parent_section_item
                    };

                    // Check if it's an additional cost or tax
                    if (item.additional_information?.additional_cost_information) {
                        config.additionalCosts.push({
                            ...fieldInfo,
                            cost_info: item.additional_information.additional_cost_information
                        });
                    } else if (item.additional_information?.taxes_information) {
                        config.taxes.push({
                            ...fieldInfo,
                            tax_info: item.additional_information.taxes_information
                        });
                    } else {
                        config.customFields.push(fieldInfo);
                    }
                }
            });
        });

        return config;
    }

    /**
     * Generate HTML input field based on field type
     * @param {Object} field - Field configuration
     * @param {number} itemIndex - Item index for name attribute
     * @returns {string} HTML string for the input field
     */
    generateFieldHTML(field, itemIndex) {
        const fieldName = `bi_item_${itemIndex}_${field.id}`;
        const label = field.alternate_name || field.name;
        const constraints = field.constraints || {};

        switch (field.field_type) {
            case 'SHORTTEXT':
            case 'LONGTEXT':
                const maxLength = constraints.max_limit || 200;
                return `
                        <div class="form-group">
                            <label>${label}</label>
                            <input type="text" name="${fieldName}" class="input-field" 
                                   maxlength="${maxLength}" placeholder="${label}">
                        </div>
                    `;

            case 'FLOAT':
            case 'PERCENTAGE':
                const min = constraints.min_limit || 0;
                const max = constraints.max_limit || 999999999;
                const step = field.field_type === 'PERCENTAGE' ? '0.01' : '0.01';
                return `
                        <div class="form-group">
                            <label>${label}${field.field_type === 'PERCENTAGE' ? ' (%)' : ''}</label>
                            <input type="number" name="${fieldName}" class="input-field" 
                                   min="${min}" max="${max}" step="${step}" placeholder="${label}">
                        </div>
                    `;

            case 'DATE':
                return `
                        <div class="form-group">
                            <label>${label}</label>
                            <input type="date" name="${fieldName}" class="input-field">
                        </div>
                    `;

            case 'BOOLEAN':
                return `
                        <div class="form-group">
                            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                <input type="checkbox" name="${fieldName}" value="true">
                                <span>${label}</span>
                            </label>
                        </div>
                    `;

            case 'CHOICE':
                const choices = constraints.choices || [];
                const isMulti = constraints.choice_type === 'MULTI_SELECT';

                if (isMulti) {
                    const optionsHTML = choices.map(choice =>
                        `<label style="display: flex; align-items: center; gap: 6px; padding: 4px 0;">
                                <input type="checkbox" name="${fieldName}" value="${choice}">
                                <span>${choice}</span>
                            </label>`
                    ).join('');
                    return `
                            <div class="form-group">
                                <label>${label}</label>
                                <div style="border: 1px solid #d1d5db; border-radius: 4px; padding: 8px; max-height: 150px; overflow-y: auto;">
                                    ${optionsHTML}
                                </div>
                            </div>
                        `;
                } else {
                    const optionsHTML = choices.map(choice =>
                        `<option value="${choice}">${choice}</option>`
                    ).join('');
                    return `
                            <div class="form-group">
                                <label>${label}</label>
                                <select name="${fieldName}" class="input-field">
                                    <option value="">Select...</option>
                                    ${optionsHTML}
                                </select>
                            </div>
                        `;
                }

            default:
                return `
                        <div class="form-group">
                            <label>${label}</label>
                            <input type="text" name="${fieldName}" class="input-field" placeholder="${label}">
                        </div>
                    `;
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TemplateManager;
} else {
    window.TemplateManager = TemplateManager;
}
