/**
 * Account Store - Manages test account data persistence
 * 
 * Phase 1: FULLY IMPLEMENTED
 * - Account CRUD operations (Create, Read, Update, Delete)
 * - Default account generation for dev and prod environments
 * - localStorage persistence of account data
 * - Account retrieval by environment and ID
 * 
 * This component is complete in Phase 1 and requires no changes in future phases.
 * 
 * Related specs:
 * - Requirements: .kiro/specs/api-curl-generator-webapp/requirements.md (Requirement 2, 11)
 * - Design: .kiro/specs/api-curl-generator-webapp/design.md (Component 2)
 */

class AccountStore {
    constructor() {
        // Initialize accounts structure
        this.accounts = {
            dev: [],
            prod: []
        };

        // Load accounts from localStorage
        // this.loadFromStorage(); // DISABLED: Force update to new defaults for this update

        // Get default accounts
        const defaults = this._getDefaultAccounts();

        // Force reset to new defaults (User Request)
        this.accounts = defaults;

        // Save initial state if defaults were created
        this.saveToStorage();
    }

    /**
     * Get all accounts for a specific environment
     * @param {string} environment - 'dev' or 'prod'
     * @returns {Array} Array of account objects
     */
    getAccounts(environment) {
        return this.accounts[environment] || [];
    }

    /**
     * Get a specific account by ID
     * @param {string} environment - 'dev' or 'prod'
     * @param {string} accountId - Account UUID
     * @returns {Object|null} Account object or null if not found
     */
    getAccount(environment, accountId) {
        const accounts = this.accounts[environment] || [];
        return accounts.find(acc => acc.id === accountId) || null;
    }

    /**
     * Add a new account to an environment
     * @param {string} environment - 'dev' or 'prod'
     * @param {Object} account - Account data (without id, created_at, updated_at)
     * @returns {Object} The created account with generated fields
     */
    addAccount(environment, account) {
        const newAccount = {
            id: this._generateUUID(),
            ...account,
            created_at: Date.now(),
            updated_at: Date.now()
        };

        this.accounts[environment].push(newAccount);
        this.saveToStorage();
        return newAccount;
    }

    /**
     * Update an existing account
     * @param {string} environment - 'dev' or 'prod'
     * @param {string} accountId - Account UUID
     * @param {Object} updates - Fields to update
     * @returns {Object|null} Updated account or null if not found
     */
    updateAccount(environment, accountId, updates) {
        const accounts = this.accounts[environment] || [];
        const index = accounts.findIndex(acc => acc.id === accountId);

        if (index === -1) {
            return null;
        }

        // Update account with new values and timestamp
        this.accounts[environment][index] = {
            ...this.accounts[environment][index],
            ...updates,
            id: accountId, // Preserve ID
            created_at: this.accounts[environment][index].created_at, // Preserve creation time
            updated_at: Date.now()
        };

        this.saveToStorage();
        return this.accounts[environment][index];
    }

    /**
     * Delete an account
     * @param {string} environment - 'dev' or 'prod'
     * @param {string} accountId - Account UUID
     * @returns {boolean} True if deleted, false if not found
     */
    deleteAccount(environment, accountId) {
        const accounts = this.accounts[environment] || [];
        const index = accounts.findIndex(acc => acc.id === accountId);

        if (index === -1) {
            return false;
        }

        this.accounts[environment].splice(index, 1);
        this.saveToStorage();
        return true;
    }

    /**
     * Get or create a default account for an environment
     * @returns {Object} Default account object
     */
    _getDefaultAccounts() {
        return {
            'dev': [
                {
                    id: 'globalfield',
                    name: 'Global Field',
                    entity_name: 'Global Field',
                    user_email: 'globalfieldsete',
                    enterprise_id: 'ent_dev_001',
                    buyer_id: 'buy_dev_001'
                }
            ],
            'prod': [
                {
                    id: 'syrma_sgs',
                    name: 'Syrma SGS',
                    entity_name: 'Syrma SGS',
                    user_email: 'syrma_sgs',
                    enterprise_id: 'ent_prod_001',
                    buyer_id: 'buy_prod_001'
                }
            ]
        };
    }
    /**
     * Save accounts to localStorage
     */
    saveToStorage() {
        try {
            localStorage.setItem('curler_accounts', JSON.stringify(this.accounts));
        } catch (error) {
            console.error('Failed to save accounts to localStorage:', error);
            // Graceful degradation - continue with in-memory data
        }
    }

    /**
     * Load accounts from localStorage
     */
    loadFromStorage() {
        try {
            const stored = localStorage.getItem('curler_accounts');
            if (stored) {
                this.accounts = JSON.parse(stored);
            }
        } catch (error) {
            console.error('Failed to load accounts from localStorage:', error);
            // Continue with empty accounts structure
        }
    }

    /**
     * Generate a simple UUID v4
     * @private
     * @returns {string} UUID string
     */
    _generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AccountStore;
}