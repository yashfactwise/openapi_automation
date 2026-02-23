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
}
