/**
 * UI Controller - Coordinates UI updates and user interactions
 * REFACTORED: Vertical Layout + Dashboard + Sticky Footer
 */

class UIController {
    constructor(environmentManager, accountStore, tokenManager, moduleRegistry, payloadBuilder, curlGenerator, apiClient) {
        this.environmentManager = environmentManager;
        this.accountStore = accountStore;
        this.tokenManager = tokenManager;
        this.moduleRegistry = moduleRegistry;
        this.payloadBuilder = payloadBuilder;
        this.curlGenerator = curlGenerator;
        this.apiClient = apiClient;

        // Track current state
        this.currentAccount = null;
        this.currentModule = null;
        this.currentOperation = null;
        this.expandedAccountId = null; // Track which account is expanded

        // Cache DOM elements
        this.elements = {};
    }

    init() {
        this.elements = {
            // Sidebar
            environmentSelector: document.getElementById('environment-selector'),
            accountManager: document.getElementById('account-manager'),
            moduleNavigator: document.getElementById('module-navigator'),
            moduleSection: document.getElementById('module-section'), // The container to hide/show

            // Main Content
            mainContent: document.querySelector('.main-content'),
            topBar: document.querySelector('.top-bar'),
            contentGrid: document.querySelector('.content-grid'),
            dashboardContainer: document.getElementById('dashboard-container'),
            operationView: document.getElementById('operation-view'),

            // Operation View Components
            operationForm: document.getElementById('operation-form'),
            formSection: document.getElementById('form-section'),
            actionsSection: document.getElementById('actions-section'), // cURL panel
            responseSection: document.getElementById('response-section'), // Response panel
            responseDisplay: document.getElementById('response-display'),
            curlDisplay: document.getElementById('curl-display'),

            // Footer Actions
            bottomBar: document.querySelector('.bottom-bar'),
            btnReset: document.getElementById('btn-reset'),
            btnGenerate: document.getElementById('btn-generate'),
            btnExecute: document.getElementById('btn-execute'),

            // Panel Actions
            btnCopyCurlPanel: document.getElementById('btn-copy-curl-panel'),
            btnDownloadCurlPanel: document.getElementById('btn-download-curl-panel')
        };

        // Render Sidebar Components
        this.renderEnvironmentSelector();
        this.renderAccountManager();
        this.renderModuleNavigator();

        // Initial Routing
        this.handleRoute();
        window.addEventListener('hashchange', () => this.handleRoute());

        // Event Listeners
        this.setupEventListeners();

        console.log('UIController initialized (Refactored)');
    }

    setupEventListeners() {
        // Sidebar Navigation (Delegation)
        this.elements.moduleNavigator.addEventListener('click', (e) => {
            const item = e.target.closest('.operation-item');
            if (item) {
                const moduleId = item.dataset.moduleId;
                const opId = item.dataset.operationId;
                window.location.hash = `#${moduleId}/${opId}`;
            }
        });

        // Brand Click -> Home
        const brand = document.querySelector('.brand');
        if (brand) {
            brand.style.cursor = 'pointer';
            brand.addEventListener('click', () => {
                window.location.hash = '';
            });
        }

        // Dashboard Navigation (Delegation)
        this.elements.dashboardContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('dashboard-op-btn')) {
                const moduleId = e.target.dataset.module;
                const opId = e.target.dataset.op;
                window.location.hash = `#${moduleId}/${opId}`;
            }
        });

        // Footer Actions
        if (this.elements.btnReset) this.elements.btnReset.addEventListener('click', () => this.handleReset());
        if (this.elements.btnGenerate) this.elements.btnGenerate.addEventListener('click', () => this.handleGenerate());
        if (this.elements.btnExecute) this.elements.btnExecute.addEventListener('click', () => this.handleExecute());

        // Form Validation Monitoring
        // We use delegation on operationForm because inputs are injected dynamically
        this.elements.operationForm.addEventListener('input', () => this.checkFormValidity());
        this.elements.operationForm.addEventListener('change', () => this.checkFormValidity());

        // Panel Actions
        if (this.elements.btnCopyCurlPanel) this.elements.btnCopyCurlPanel.addEventListener('click', () => this.handleCopyCurl());
        if (this.elements.btnDownloadCurlPanel) this.elements.btnDownloadCurlPanel.addEventListener('click', () => this.handleDownloadCurl());
    }

    // ============================================================
    // ROUTING & VIEW MANAGEMENT
    // ============================================================

    handleRoute() {
        const hash = window.location.hash.slice(1); // remove #

        if (!hash || hash === 'home') {
            this.renderDashboard();
        } else {
            const [moduleId, opId] = hash.split('/');
            if (moduleId && opId) {
                this.renderOperation(moduleId, opId);
            } else {
                this.renderDashboard();
            }
        }
    }

    renderDashboard() {
        // Hide Operation View
        this.elements.operationView.classList.add('hidden');
        this.elements.topBar.classList.add('hidden');
        this.elements.bottomBar.classList.add('hidden');

        // Hide Sidebar Modules List (Per user request)
        if (this.elements.moduleSection) this.elements.moduleSection.classList.add('hidden');
        this.elements.moduleNavigator.classList.add('hidden');

        // Show Dashboard
        this.elements.dashboardContainer.classList.remove('hidden');

        // Populate Dashboard if empty
        if (!this.elements.dashboardContainer.querySelector('.dashboard-grid')) {
            const modules = this.moduleRegistry.getAllModules();
            let gridHtml = `
                <div class="dashboard-header text-center mb-2">
                    <h2 style="font-size:24px; font-weight:600; margin-bottom:8px;">API Operations</h2>
                    <p class="text-secondary">Select an operation to generate a request</p>
                </div>
                <div class="dashboard-grid">
            `;

            modules.forEach(mod => {
                let opsHtml = '';
                mod.operations.forEach(op => {
                    opsHtml += `<button class="dashboard-op-btn" data-module="${mod.id}" data-op="${op.id}">${op.name}</button>`;
                });

                gridHtml += `
                    <div class="dashboard-module">
                        <div class="module-header">
                            <span>${mod.name}</span>
                            <span style="font-size: 11px; font-weight: 400; color: #64748b;">${mod.operations.length} ops</span>
                        </div>
                        <div class="module-operations">
                            ${opsHtml}
                        </div>
                    </div>
                `;
            });
            gridHtml += `</div>`;
            this.elements.dashboardContainer.innerHTML = gridHtml;
        }
    }

    renderOperation(moduleId, opId) {
        const operation = this.moduleRegistry.getOperation(moduleId, opId);
        const module = this.moduleRegistry.getModule(moduleId);
        if (!operation) return;

        // Update State
        this.currentModule = moduleId;
        this.currentOperation = opId;

        // Show Sidebar Modules (for context)
        if (this.elements.moduleSection) this.elements.moduleSection.classList.remove('hidden');
        this.elements.moduleNavigator.classList.remove('hidden');

        // Show Operation View components
        this.elements.dashboardContainer.classList.add('hidden');
        this.elements.operationView.classList.remove('hidden');
        this.elements.topBar.classList.remove('hidden');
        this.elements.bottomBar.classList.remove('hidden');

        // Update active state in sidebar
        document.querySelectorAll('.operation-item').forEach(el => el.classList.remove('selected', 'active'));
        const sidebarItem = document.querySelector(`.operation-item[data-module-id="${moduleId}"][data-operation-id="${opId}"]`);
        if (sidebarItem) {
            sidebarItem.classList.add('selected');
            // Ensure sidebar group is expanded if we add collapsing later
        }

        // Update Header
        const headerTitle = this.elements.topBar.querySelector('.current-operation');
        if (headerTitle) {
            headerTitle.innerHTML = `${module.name} / <span style="color:var(--accent-color)">${operation.name}</span>`;
        }

        // Render Form Inputs
        this.renderFormInputs(module, operation);

        // Reset Outputs
        this.elements.actionsSection.classList.add('hidden');
        this.elements.responseSection.classList.add('hidden');

        // Scroll to top
        this.elements.contentGrid.scrollTop = 0;

        // Check Validity
        this.checkFormValidity();
    }

    renderFormInputs(module, operation) {
        // Show account context header for ALL operations
        const accountContextHtml = `
            <div class="account-context" style="margin-bottom: 20px; font-size: 13px; color: #64748b;">
                <p style="margin-bottom: 8px;">Headers are being used for <strong>${this.currentAccount ? this.currentAccount.entity_name : 'No Account Selected'}</strong></p>
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; padding: 10px;">
                    <div style="display: grid; grid-template-columns: auto 1fr; gap: 4px 12px; font-size: 12px;">
                        <span style="color: #94a3b8;">API ID:</span>
                        <span style="font-family: monospace;">${this.currentAccount?.api_id || 'Not Set'}</span>
                        
                        <span style="color: #94a3b8;">Enterprise ID:</span>
                        <span style="font-family: monospace;">${this.currentAccount?.enterprise_id || 'Not Set'}</span>
                        
                        <span style="color: #94a3b8;">Buyer ID:</span>
                        <span style="font-family: monospace;">${this.currentAccount?.buyer_id || 'Not Set'}</span>

                        <span style="color: #94a3b8;">API Key:</span>
                        <span style="font-family: monospace;">${this.currentAccount?.api_key ? (this.currentAccount.api_key.length > 8 ? this.currentAccount.api_key.substring(0, 4) + '...' + this.currentAccount.api_key.slice(-4) : '****') : 'Not Set'}</span>
                    </div>
                </div>
            </div>

            <div class="section-divider" style="margin: 15px 0 10px 0; border-bottom: 1px solid #eee; padding-bottom: 5px;">
                <strong>Body Payload</strong>
            </div>
        `;

        let bodyInputsHtml = '';

        // Contract Create Form
        if (module.id === 'contract' && operation.id === 'create') {
            bodyInputsHtml = `
                <div class="form-group">
                    <label>Template</label>
                    <select id="contract-template-selector" class="input-field">
                        <option value="">Select a template...</option>
                        <option value="1-tier">1 Tier Contract</option>
                        <option value="2-tier">2 Tier Contract</option>
                        <option value="custom">Custom</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Contract Name *</label>
                    <input type="text" name="contract_name" class="input-field" required>
                </div>
                <div class="form-group">
                    <label>Vendor ID *</label>
                    <input type="text" name="vendor_id" class="input-field" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Start Date *</label>
                        <input type="date" name="start_date" class="input-field" required>
                    </div>
                    <div class="form-group">
                        <label>End Date *</label>
                        <input type="date" name="end_date" class="input-field" required>
                    </div>
                </div>
                <div id="tiers-container"></div>
            `;
        }
        // Contract Update Form
        else if (module.id === 'contract' && operation.id === 'update') {
            bodyInputsHtml = `
                <div class="form-group">
                    <label>Contract ID *</label>
                    <input type="text" name="contract_id" class="input-field" required>
                </div>
                <div class="form-group">
                    <label>Contract Name</label>
                    <input type="text" name="contract_name" class="input-field">
                </div>
                <div class="form-group">
                    <label>Vendor ID</label>
                    <input type="text" name="vendor_id" class="input-field">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Start Date</label>
                        <input type="date" name="start_date" class="input-field">
                    </div>
                    <div class="form-group">
                        <label>End Date</label>
                        <input type="date" name="end_date" class="input-field">
                    </div>
                </div>
            `;
        }
        // Contract State Form
        else if (module.id === 'contract' && operation.id === 'state') {
            bodyInputsHtml = `
                <div class="form-group">
                    <label>Contract ID *</label>
                    <input type="text" name="contract_id" class="input-field" required>
                </div>
                <div class="form-group">
                    <label>Action *</label>
                    <select id="contract-action-selector" name="action" class="input-field" required>
                        <option value="">Select action...</option>
                        <option value="update_status">Update Status</option>
                        <option value="terminate">Terminate</option>
                    </select>
                </div>
                <div class="form-group" id="status-field" style="display: none;">
                    <label>Status *</label>
                    <select name="status" class="input-field">
                        <option value="">Select status...</option>
                        <option value="DRAFT">DRAFT</option>
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="SUSPENDED">SUSPENDED</option>
                        <option value="COMPLETED">COMPLETED</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Notes</label>
                    <textarea name="notes" class="form-textarea" rows="3"></textarea>
                </div>
            `;
        } else {
            // Generic placeholder for other operations
            bodyInputsHtml = `
                <div class="phase-message">
                    Phase 1 Prototype: Placeholder inputs for ${operation.name}
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Entity Name *</label>
                        <input type="text" name="entity_name" class="input-field" required placeholder="e.g. Factwise">
                    </div>
                     <div class="form-group">
                        <label>Username *</label>
                        <input type="text" name="username" class="input-field" required placeholder="username">
                    </div>
                </div>
                <div class="form-group">
                    <label>Operation Context</label>
                    <input type="text" class="input-field" value="${operation.endpoint}" readonly title="Endpoint">
                </div>
                <div class="form-group">
                    <label>Notes (Optional)</label>
                    <textarea name="notes" class="form-textarea" rows="3" placeholder="Add additional details..."></textarea>
                </div>
            `;
        }

        this.elements.operationForm.innerHTML = accountContextHtml + bodyInputsHtml;

        // Add event listeners for Contract forms
        if (module.id === 'contract' && operation.id === 'create') {
            this._setupContractCreateListeners();
        } else if (module.id === 'contract' && operation.id === 'state') {
            this._setupContractStateListeners();
        }
    }

    _setupContractCreateListeners() {
        const templateSelector = document.getElementById('contract-template-selector');
        if (templateSelector) {
            templateSelector.addEventListener('change', (e) => {
                const template = e.target.value;
                if (template === '1-tier') {
                    this._loadContractTemplate(this.payloadBuilder.getContractCreate1TierTemplate());
                } else if (template === '2-tier') {
                    this._loadContractTemplate(this.payloadBuilder.getContractCreate2TierTemplate());
                }
            });
        }
    }

    _loadContractTemplate(template) {
        // Populate basic fields
        const form = this.elements.operationForm;
        form.querySelector('[name="contract_name"]').value = template.contract_name;
        form.querySelector('[name="vendor_id"]').value = template.vendor_id;
        form.querySelector('[name="start_date"]').value = template.start_date;
        form.querySelector('[name="end_date"]').value = template.end_date;

        // Render tiers
        const tiersContainer = document.getElementById('tiers-container');
        tiersContainer.innerHTML = '';

        template.tiers.forEach((tier, tierIndex) => {
            const tierHtml = `
                <div class="tier-section" data-tier-index="${tierIndex}" style="border: 1px solid #e2e8f0; border-radius: 4px; padding: 15px; margin-top: 15px; background: #f8fafc;">
                    <h4 style="margin: 0 0 10px 0; color: #334155;">Tier ${tier.tier_number}</h4>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Min Quantity *</label>
                            <input type="number" name="tier_${tierIndex}_min" class="input-field" value="${tier.min_quantity}" required>
                        </div>
                        <div class="form-group">
                            <label>Max Quantity *</label>
                            <input type="number" name="tier_${tierIndex}_max" class="input-field" value="${tier.max_quantity}" required>
                        </div>
                    </div>
                    <div class="items-container" data-tier-index="${tierIndex}">
                        ${tier.items.map((item, itemIndex) => `
                            <div class="item-section" style="border-left: 3px solid #3b82f6; padding-left: 10px; margin-top: 10px;">
                                <h5 style="margin: 0 0 8px 0; color: #475569; font-size: 13px;">Item ${itemIndex + 1}</h5>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>Item ID *</label>
                                        <input type="text" name="tier_${tierIndex}_item_${itemIndex}_id" class="input-field" value="${item.item_id}" required>
                                    </div>
                                    <div class="form-group">
                                        <label>Item Name *</label>
                                        <input type="text" name="tier_${tierIndex}_item_${itemIndex}_name" class="input-field" value="${item.item_name}" required>
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>Unit Price *</label>
                                        <input type="number" step="0.01" name="tier_${tierIndex}_item_${itemIndex}_price" class="input-field" value="${item.unit_price}" required>
                                    </div>
                                    <div class="form-group">
                                        <label>Quantity *</label>
                                        <input type="number" name="tier_${tierIndex}_item_${itemIndex}_qty" class="input-field" value="${item.quantity}" required>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            tiersContainer.insertAdjacentHTML('beforeend', tierHtml);
        });
    }

    _setupContractStateListeners() {
        const actionSelector = document.getElementById('contract-action-selector');
        const statusField = document.getElementById('status-field');

        if (actionSelector && statusField) {
            actionSelector.addEventListener('change', (e) => {
                if (e.target.value === 'update_status') {
                    statusField.style.display = 'block';
                    statusField.querySelector('select').required = true;
                } else {
                    statusField.style.display = 'none';
                    statusField.querySelector('select').required = false;
                }
            });
        }
    }

    // ============================================================
    // FORM & ACTION HANDLERS
    // ============================================================

    checkFormValidity() {
        if (!this.elements.operationForm) return;

        const inputs = this.elements.operationForm.querySelectorAll('input[required], select[required], textarea[required]');
        let allValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) allValid = false;
        });

        // Update Buttons
        if (this.elements.btnExecute) {
            this.elements.btnExecute.disabled = !allValid;
        }

        if (this.elements.btnGenerate) {
            this.elements.btnGenerate.textContent = allValid ? "Generate cURL" : "Generate Incomplete cURL";
            // Note: Generate button remains enabled even if invalid
        }

        return allValid;
    }

    handleReset() {
        // Clear all inputs (except readonly ones perhaps?)
        const inputs = this.elements.operationForm.querySelectorAll('input:not([readonly]), textarea, select');
        inputs.forEach(input => input.value = '');

        // Hide outputs
        this.elements.actionsSection.classList.add('hidden');
        this.elements.responseSection.classList.add('hidden');

        this.checkFormValidity();
    }

    handleGenerate() {
        // Generate cURL (Mock for now)
        const curl = this._generateCurlCommand();
        this.elements.curlDisplay.innerHTML = `<pre><code>${this._escapeHtml(curl)}</code></pre>`;

        // Show cURL panel
        this.elements.actionsSection.classList.remove('hidden');
        this.elements.responseSection.classList.add('hidden'); // Hide response

        // Scroll to it
        this.elements.actionsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }





    handleExecute() {
        try {
            // Get current environment and operation
            const env = this.environmentManager.getCurrentEnvironment();
            const op = this.moduleRegistry.getOperation(this.currentModule, this.currentOperation);

            if (!op) {
                throw new Error('Operation not found');
            }

            // Build payload based on operation
            let payload = null;
            if (this.currentModule === 'contract') {
                payload = this._buildContractPayload(op);
            } else {
                // For non-Contract operations, use form inputs (Phase 1 behavior)
                payload = this._collectFormData();
            }

            // Generate cURL
            const curl = this._generateCurlCommandWithPayload(env, op, payload);
            this.elements.curlDisplay.innerHTML = `<pre><code>${this._escapeHtml(curl)}</code></pre>`;

            // Show both panels
            this.elements.actionsSection.classList.remove('hidden');
            this.elements.responseSection.classList.remove('hidden');

            // Execute real API call for Contract operations
            if (this.currentModule === 'contract') {
                this._executeRealApiCall(env, op, payload);
            } else {
                // Mock response for other operations (Phase 1 behavior)
                this.elements.responseDisplay.innerHTML = `
                    <pre><code class="language-json">{
  "status": "success",
  "data": {
    "id": "op_${Math.floor(Math.random() * 10000)}",
    "timestamp": "${new Date().toISOString()}"
  }
}</code></pre>
                `;
            }

            // Scroll to outputs
            this.elements.actionsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } catch (error) {
            this._displayError(error.message);
        }
    }

    _buildContractPayload(operation) {
        const form = this.elements.operationForm;

        if (operation.id === 'create') {
            // Collect tier data
            const tiers = [];
            const tierSections = form.querySelectorAll('.tier-section');

            tierSections.forEach((tierSection, tierIndex) => {
                const tier = {
                    tier_number: tierIndex + 1,
                    min_quantity: parseInt(form.querySelector(`[name="tier_${tierIndex}_min"]`).value),
                    max_quantity: parseInt(form.querySelector(`[name="tier_${tierIndex}_max"]`).value),
                    items: []
                };

                // Collect items for this tier
                const itemInputs = tierSection.querySelectorAll('.item-section');
                itemInputs.forEach((itemSection, itemIndex) => {
                    tier.items.push({
                        item_id: form.querySelector(`[name="tier_${tierIndex}_item_${itemIndex}_id"]`).value,
                        item_name: form.querySelector(`[name="tier_${tierIndex}_item_${itemIndex}_name"]`).value,
                        unit_price: parseFloat(form.querySelector(`[name="tier_${tierIndex}_item_${itemIndex}_price"]`).value),
                        quantity: parseInt(form.querySelector(`[name="tier_${tierIndex}_item_${itemIndex}_qty"]`).value)
                    });
                });

                tiers.push(tier);
            });

            return this.payloadBuilder.buildContractCreatePayload(this.currentAccount, {
                contract_name: form.querySelector('[name="contract_name"]').value,
                vendor_id: form.querySelector('[name="vendor_id"]').value,
                start_date: form.querySelector('[name="start_date"]').value,
                end_date: form.querySelector('[name="end_date"]').value,
                tiers: tiers
            });
        } else if (operation.id === 'update') {
            const params = {
                contract_id: form.querySelector('[name="contract_id"]').value
            };

            // Add optional fields if provided
            const contractName = form.querySelector('[name="contract_name"]').value;
            const vendorId = form.querySelector('[name="vendor_id"]').value;
            const startDate = form.querySelector('[name="start_date"]').value;
            const endDate = form.querySelector('[name="end_date"]').value;

            if (contractName) params.contract_name = contractName;
            if (vendorId) params.vendor_id = vendorId;
            if (startDate) params.start_date = startDate;
            if (endDate) params.end_date = endDate;

            return this.payloadBuilder.buildContractUpdatePayload(this.currentAccount, params);
        } else if (operation.id === 'state') {
            const params = {
                contract_id: form.querySelector('[name="contract_id"]').value,
                action: form.querySelector('[name="action"]').value
            };

            const status = form.querySelector('[name="status"]').value;
            const notes = form.querySelector('[name="notes"]').value;

            if (status) params.status = status;
            if (notes) params.notes = notes;

            return this.payloadBuilder.buildContractStatePayload(this.currentAccount, params);
        }
    }

    _collectFormData() {
        const body = {};
        const inputs = this.elements.operationForm.querySelectorAll('input[name], textarea[name], select[name]');
        inputs.forEach(input => {
            body[input.name] = input.value || '';
        });
        return body;
    }

    async _executeRealApiCall(env, operation, payload) {
        try {
            // Get token
            const token = await this.tokenManager.getToken(env.id, this.currentAccount);

            // Execute API call
            const startTime = Date.now();
            const response = await this.apiClient.executeOperation(env, operation, payload, token);
            const executionTime = Date.now() - startTime;

            // Display response
            this._displayResponse(response, executionTime);
        } catch (error) {
            this._displayError(error.message);
        }
    }

    _displayResponse(response, executionTime) {
        const statusClass = response.status >= 200 && response.status < 300 ? 'success' :
            response.status >= 300 && response.status < 400 ? 'warning' : 'error';

        const statusColor = statusClass === 'success' ? '#10b981' :
            statusClass === 'warning' ? '#f59e0b' : '#ef4444';

        this.elements.responseDisplay.innerHTML = `
            <div style="margin-bottom: 15px;">
                <span style="background: ${statusColor}; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;">
                    ${response.status} ${response.statusText || ''}
                </span>
                <span style="margin-left: 10px; color: #64748b; font-size: 13px;">
                    ${executionTime}ms
                </span>
            </div>
            <pre><code class="language-json">${JSON.stringify(response.data, null, 2)}</code></pre>
        `;
    }

    _displayError(message) {
        this.elements.actionsSection.classList.remove('hidden');
        this.elements.responseSection.classList.remove('hidden');

        this.elements.responseDisplay.innerHTML = `
            <div style="background: #fee; border: 1px solid #fcc; border-radius: 4px; padding: 15px; color: #c00;">
                <strong>Error:</strong> ${this._escapeHtml(message)}
            </div>
        `;
    }

    _generateCurlCommand() {
        // dynamic generator based on form inputs
        const env = this.environmentManager.getCurrentEnvironment();
        const op = this.moduleRegistry.getOperation(this.currentModule, this.currentOperation);

        if (!op) return 'Error: Operation not found';

        // For Contract operations, use payload builder
        let body = null;
        if (this.currentModule === 'contract') {
            try {
                body = this._buildContractPayload(op);
            } catch (error) {
                return `Error: ${error.message}`;
            }
        } else {
            // For other operations, collect form data
            body = this._collectFormData();
        }

        return this._generateCurlCommandWithPayload(env, op, body);
    }

    _generateCurlCommandWithPayload(env, operation, body) {
        const url = `${env.baseUrl}${operation.endpoint}`;
        const method = operation.method || 'POST';

        const headers = {
            'Content-Type': 'application/json'
        };

        // Add headers from current account if available
        if (this.currentAccount) {
            if (this.currentAccount.api_id) headers['api-id'] = this.currentAccount.api_id;
            if (this.currentAccount.api_key) headers['x-api-key'] = this.currentAccount.api_key;
        }

        // Generate using CurlGenerator
        return this.curlGenerator.generate({
            method: method,
            url: url,
            headers: headers,
            body: body
        });
    }

    handleCopyCurl() {
        const curl = this._generateCurlCommand();
        if (!curl) return;

        navigator.clipboard.writeText(curl).then(() => {
            const originalText = this.elements.btnCopyCurlPanel.textContent;
            this.elements.btnCopyCurlPanel.textContent = 'Copied!';
            this.elements.btnCopyCurlPanel.disabled = true;

            setTimeout(() => {
                this.elements.btnCopyCurlPanel.textContent = originalText;
                this.elements.btnCopyCurlPanel.disabled = false;
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            alert('Failed to copy to clipboard');
        });
    }

    handleDownloadCurl() {
        const curl = this._generateCurlCommand();
        if (!curl) return;

        const blob = new Blob([curl], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');

        a.href = url;
        // User requested .curl extension
        a.download = `request-${this.currentModule}-${this.currentOperation}.curl`;
        document.body.appendChild(a);
        a.click();

        // Cleanup
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    _escapeHtml(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // ============================================================
    // COMPONENT RENDERING (Legacy/Existing Support)
    // ============================================================

    // Kept from previous implementation to ensure Environment/Account logic still works

    renderEnvironmentSelector() {
        const currentEnv = this.environmentManager.getCurrentEnvironment();
        this.elements.environmentSelector.innerHTML = `
            <div class="environment-toggle">
                <button class="env-button ${currentEnv.id === 'dev' ? 'active' : ''}" data-env="dev">Development</button>
                <button class="env-button ${currentEnv.id === 'prod' ? 'active' : ''}" data-env="prod">Production</button>
            </div>
            <div class="environment-info">
                ${currentEnv.baseUrl}
            </div>
        `;

        this.elements.environmentSelector.querySelectorAll('.env-button').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleEnvironmentChange(e.target.dataset.env));
        });
    }

    handleEnvironmentChange(newEnv) {
        if (this.environmentManager.getCurrentEnvironment().id === newEnv) return;

        // Switch environment
        this.environmentManager.setEnvironment(newEnv);

        // Reset expansion
        this.expandedAccountId = null;

        // Get accounts for new environment
        const accounts = this.accountStore.getAccounts(newEnv);

        // Auto-select first account in new environment
        if (accounts.length > 0) {
            this.currentAccount = accounts[0];
        } else {
            this.currentAccount = null;
        }

        // Re-render everything
        this.renderEnvironmentSelector();
        this.renderAccountManager();

        // Refresh form if active to show new account headers
        if (this.currentModule && this.currentOperation) {
            this.renderOperation(this.currentModule, this.currentOperation);
        }
    }

    renderAccountManager() {
        const currentEnv = this.environmentManager.getCurrentEnvironment();
        const accounts = this.accountStore.getAccounts(currentEnv.id);

        if (!this.currentAccount && accounts.length > 0) this.currentAccount = accounts[0];

        const listHtml = accounts.map(acc => {
            const isSelected = this.currentAccount && this.currentAccount.id === acc.id;
            const isExpanded = isSelected && this.expandedAccountId === acc.id;

            return `
                <div class="account-item ${isSelected ? 'selected' : ''}" data-id="${acc.id}">
                    <div class="account-main">
                        <div class="account-name">${acc.entity_name}</div>
                        <div class="account-email">${acc.user_email}</div>
                    </div>
                    <div class="account-headers ${isExpanded ? 'expanded' : ''}">
                        <div class="header-row">
                            <span class="header-label">API ID:</span>
                            <span class="header-value">${acc.api_id || 'N/A'}</span>
                        </div>
                        <div class="header-row">
                            <span class="header-label">Enterprise:</span>
                            <span class="header-value">${acc.enterprise_id || 'N/A'}</span>
                        </div>
                        <div class="header-row">
                            <span class="header-label">Buyer:</span>
                            <span class="header-value">${acc.buyer_id || 'N/A'}</span>
                        </div>
                        <div class="header-row">
                            <span class="header-label">API Key:</span>
                            <span class="header-value">${acc.api_key ? (acc.api_key.length > 8 ? acc.api_key.substring(0, 4) + '...' + acc.api_key.slice(-4) : '****') : 'N/A'}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        this.elements.accountManager.innerHTML = `
            <div class="account-list">${listHtml}</div>
        `;

        // Listeners for account selection and expansion
        this.elements.accountManager.querySelectorAll('.account-item').forEach(el => {
            el.addEventListener('click', () => {
                const accId = el.dataset.id;
                const wasExpanded = this.expandedAccountId === accId;

                // Select the account
                this.currentAccount = this.accountStore.getAccount(currentEnv.id, accId);

                // Toggle expansion
                if (wasExpanded) {
                    this.expandedAccountId = null; // Collapse
                } else {
                    this.expandedAccountId = accId; // Expand
                }

                this.renderAccountManager();

                // Refresh form if active to update account context display
                if (this.currentModule && this.currentOperation) {
                    this.renderOperation(this.currentModule, this.currentOperation);
                }
            });
        });
    }

    renderModuleNavigator() {
        const modules = this.moduleRegistry.getAllModules();
        const html = modules.map(mod => `
            <div class="module-group">
                <div class="module-header">${mod.name}</div>
                ${mod.operations.map(op => `
                    <div class="operation-item" data-module-id="${mod.id}" data-operation-id="${op.id}">
                        ${op.name}
                    </div>
                `).join('')}
            </div>
        `).join('');
        this.elements.moduleNavigator.innerHTML = html;
    }
}
