/**
 * UI Controller - Coordinates UI updates and user interactions
 * REFACTORED: Vertical Layout + Dashboard + Sticky Footer
 */

class UIController {
    constructor(environmentManager, accountStore, tokenManager, moduleRegistry, payloadBuilder, curlGenerator, apiClient, itemValidator, itemValidationUI, factwiseIntegration) {
        this.environmentManager = environmentManager;
        this.accountStore = accountStore;
        this.tokenManager = tokenManager;
        this.moduleRegistry = moduleRegistry;
        this.payloadBuilder = payloadBuilder;
        this.curlGenerator = curlGenerator;
        this.apiClient = apiClient;
        this.itemValidator = itemValidator;
        this.itemValidationUI = itemValidationUI;
        this.factwiseIntegration = factwiseIntegration;

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
        let bodyInputsHtml = '';

        // ── Contract Create Form ──────────────────────────────────────────────
        if (module.id === 'contract' && operation.id === 'create') {
            bodyInputsHtml = `
                <!-- ① Config Box -->
                <div class="cc-config-box">
                    <p class="cc-config-box-title">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M4.93 19.07l1.41-1.41M19.07 19.07l-1.41-1.41M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>
                        Payload Configuration
                    </p>
                    <div class="cc-config-grid">
                        <!-- Template Selector -->
                        <div class="cc-config-panel">
                            <span class="cc-config-panel-label">Contract Template</span>
                            <div style="padding: 4px 0;">
                                <select id="template_name_select" name="template_name" class="input-field" required style="margin-top: 4px;">
                                    <option value="Default Template">Loading templates...</option>
                                </select>
                            </div>
                        </div>

                        <!-- Feature Toggles -->
                        <div class="cc-config-panel">
                            <span class="cc-config-panel-label">Optional Features</span>
                            <div class="cc-toggles-grid">
                                <label class="cc-toggle-row">
                                    <span class="cc-toggle-switch">
                                        <input type="checkbox" id="toggle-contract-costs">
                                        <span class="cc-toggle-slider"></span>
                                    </span>
                                    <span class="cc-toggle-text">Contract-Level Costs</span>
                                </label>
                                <label class="cc-toggle-row">
                                    <span class="cc-toggle-switch">
                                        <input type="checkbox" id="toggle-tier-costs">
                                        <span class="cc-toggle-slider"></span>
                                    </span>
                                    <span class="cc-toggle-text">Tier-Level Costs</span>
                                </label>
                                <label class="cc-toggle-row">
                                    <span class="cc-toggle-switch">
                                        <input type="checkbox" id="toggle-contract-custom">
                                        <span class="cc-toggle-slider"></span>
                                    </span>
                                    <span class="cc-toggle-text">Contract Custom Fields</span>
                                </label>
                                <label class="cc-toggle-row">
                                    <span class="cc-toggle-switch">
                                        <input type="checkbox" id="toggle-item-custom">
                                        <span class="cc-toggle-slider"></span>
                                    </span>
                                    <span class="cc-toggle-text">Item Custom Fields</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ② Basic Information -->
                <div class="form-section-title no-margin-top">
                    <span class="fst-icon">📋</span>
                    <h4>Basic Information</h4>
                    <span class="fst-badge">Required</span>
                </div>

                <div class="form-group">
                    <label>Contract Name *</label>
                    <input type="text" name="contract_name" class="input-field" required value="Test Contract">
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>ERP Contract ID</label>
                        <input type="text" name="ERP_contract_id" class="input-field" value="ERP_CONTRACT_001">
                    </div>
                    <div class="form-group">
                        <label>Factwise Contract ID</label>
                        <input type="text" name="factwise_contract_id" class="input-field" value="C000001">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Start Date *</label>
                        <input type="date" name="contract_start_date" class="input-field" required>
                    </div>
                    <div class="form-group">
                        <label>End Date *</label>
                        <input type="date" name="contract_end_date" class="input-field" required>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Entity Name *</label>
                        <input type="text" name="entity_name" class="input-field" required value="FactWise">
                    </div>
                    <div class="form-group">
                        <label>Status *</label>
                        <select name="status" class="input-field" required>
                            <option value="DRAFT">DRAFT</option>
                            <option value="SUBMITTED">SUBMITTED</option>
                        </select>
                    </div>
                </div>


                <!-- ③ Buyer Details -->
                <div class="form-section-title">
                    <span class="fst-icon">🏢</span>
                    <h4>Buyer Details</h4>
                </div>

                <div class="form-group">
                    <label>Buyer Identifications (comma-separated) *</label>
                    <input type="text" name="buyer_identifications" class="input-field" required value="GST" placeholder="GST, PAN, etc.">
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Buyer Address</label>
                        <input type="text" name="buyer_address" class="input-field" value="Main address">
                    </div>
                    <div class="form-group">
                        <label>Buyer Contact *</label>
                        <input type="email" name="buyer_contact" class="input-field" required value="${this.currentAccount?.user_email || 'buyer@example.com'}">
                    </div>
                </div>

                <!-- ④ Vendor Details -->
                <div class="form-section-title">
                    <span class="fst-icon">🤝</span>
                    <h4>Vendor Details</h4>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Factwise Vendor Code</label>
                        <input type="text" name="factwise_vendor_code" class="input-field" value="V001">
                    </div>
                    <div class="form-group">
                        <label>ERP Vendor Code</label>
                        <input type="text" name="ERP_vendor_code" class="input-field">
                    </div>
                </div>

                <div class="form-group">
                    <label>Vendor Contact *</label>
                    <input type="email" name="vendor_contact" class="input-field" required value="vendor@example.com">
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Vendor Identification Name *</label>
                        <input type="text" name="vendor_identification_name" class="input-field" required value="Vendor Corp">
                    </div>
                    <div class="form-group">
                        <label>Vendor Identification Value *</label>
                        <input type="text" name="vendor_identification_value" class="input-field" required value="123456789">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Vendor Address ID</label>
                        <input type="text" name="vendor_address_id" class="input-field">
                    </div>
                    <div class="form-group">
                        <label>Vendor Full Address</label>
                        <input type="text" name="vendor_full_address" class="input-field" value="123 Vendor St">
                    </div>
                </div>

                <!-- ⑤ Payment & Terms -->
                <div class="form-section-title">
                    <span class="fst-icon">💳</span>
                    <h4>Payment &amp; Terms</h4>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Project</label>
                        <input type="text" name="project" class="input-field" value="P000001">
                    </div>
                    <div class="form-group">
                        <label>Prepayment %</label>
                        <input type="number" name="prepayment_percentage" class="input-field" value="10" min="0" max="100" step="0.01">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Payment Type</label>
                        <select name="payment_type" class="input-field">
                            <option value="">Select...</option>
                            <option value="PER_INVOICE_ITEM" selected>PER_INVOICE_ITEM</option>
                            <option value="PER_INVOICE">PER_INVOICE</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Incoterm *</label>
                        <select name="incoterm" class="input-field" required>
                            <option value="CFR" selected>CFR</option>
                            <option value="DAP">DAP</option>
                            <option value="NA">NA</option>
                            <option value="FOB">FOB</option>
                            <option value="CIF">CIF</option>
                        </select>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Lead Time</label>
                        <input type="number" name="lead_time" class="input-field" value="10" step="0.1">
                    </div>
                    <div class="form-group">
                        <label>Lead Time Period</label>
                        <select name="lead_time_period" class="input-field">
                            <option value="">Select...</option>
                            <option value="DAYS" selected>DAYS</option>
                            <option value="WEEKS">WEEKS</option>
                            <option value="MONTHS">MONTHS</option>
                        </select>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Payment Term</label>
                        <input type="number" name="payment_term" class="input-field" value="1" min="0">
                    </div>
                    <div class="form-group">
                        <label>Payment Period</label>
                        <select name="payment_period" class="input-field">
                            <option value="DAYS">DAYS</option>
                            <option value="WEEKS">WEEKS</option>
                            <option value="MONTHS" selected>MONTHS</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Applied From</label>
                        <input type="text" name="payment_applied_from" class="input-field" value="INVOICE_DATE">
                    </div>
                </div>

                <!-- ⑥ Contract-Level Additional Costs (conditional) -->
                <div id="contract-costs-section" class="cc-conditional-section">
                    <div class="form-section-title">
                        <span class="fst-icon">💰</span>
                        <h4>Contract-Level Costs</h4>
                    </div>
                    <div id="contract-costs-container"></div>
                    <button type="button" class="btn-add-row" onclick="window.uiController._addContractCost()">＋ Add Cost / Tax / Discount</button>
                </div>

                <!-- ⑦ Contract-Level Custom Fields (conditional) -->
                <div id="contract-custom-section" class="cc-conditional-section">
                    <div class="form-section-title">
                        <span class="fst-icon">🔧</span>
                        <h4>Contract Custom Sections</h4>
                    </div>
                    <div id="contract-custom-container"></div>
                    <button type="button" class="btn-add-row" onclick="window.uiController._addContractCustomSection()">＋ Add Custom Section</button>
                </div>

                <!-- Contract Items -->
                <h4 style="margin: 20px 0 10px 0; color: #334155; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px;">
                    <span>📦 Contract Items</span>
                    <button type="button" class="btn-secondary" onclick="window.uiController._addContractItem()" style="font-size: 13px; padding: 6px 12px; margin-left: 15px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;">
                        + Add Item
                    </button>
                </h4>
                <div id="contract-items-container"></div>
            `;
        }
        // Contract Update Form
        else if (module.id === 'contract' && operation.id === 'update') {
            bodyInputsHtml = `
                <!-- Import Button -->
                <div style="margin-bottom: 20px;">
                    <button type="button" id="btn-show-import-modal" class="btn-secondary" style="display: inline-flex; align-items: center; gap: 8px;">
                        <span>📥</span>
                        <span>Import from Create Payload</span>
                    </button>
                </div>

                <!-- ① Config Box -->
                <div class="cc-config-box">
                    <p class="cc-config-box-title">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M4.93 19.07l1.41-1.41M19.07 19.07l-1.41-1.41M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>
                        Payload Configuration
                    </p>
                    <div class="cc-config-grid">
                        <!-- Feature Toggles -->
                        <div class="cc-config-panel">
                            <span class="cc-config-panel-label">Optional Features</span>
                            <div class="cc-toggles-grid">
                                <label class="cc-toggle-row">
                                    <span class="cc-toggle-switch">
                                        <input type="checkbox" id="toggle-contract-costs-update">
                                        <span class="cc-toggle-slider"></span>
                                    </span>
                                    <span class="cc-toggle-text">Contract-Level Costs</span>
                                </label>
                                <label class="cc-toggle-row">
                                    <span class="cc-toggle-switch">
                                        <input type="checkbox" id="toggle-tier-costs-update">
                                        <span class="cc-toggle-slider"></span>
                                    </span>
                                    <span class="cc-toggle-text">Tier-Level Costs</span>
                                </label>
                                <label class="cc-toggle-row">
                                    <span class="cc-toggle-switch">
                                        <input type="checkbox" id="toggle-contract-custom-update">
                                        <span class="cc-toggle-slider"></span>
                                    </span>
                                    <span class="cc-toggle-text">Contract Custom Fields</span>
                                </label>
                                <label class="cc-toggle-row">
                                    <span class="cc-toggle-switch">
                                        <input type="checkbox" id="toggle-item-custom-update">
                                        <span class="cc-toggle-slider"></span>
                                    </span>
                                    <span class="cc-toggle-text">Item Custom Fields</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ② Basic Information -->
                <div class="form-section-title no-margin-top">
                    <span class="fst-icon">📋</span>
                    <h4>Basic Information</h4>
                    <span class="fst-badge">Required</span>
                </div>

                <div class="form-group">
                    <label>Contract Name *</label>
                    <input type="text" name="contract_name" class="input-field" required value="Test Contract Update">
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>ERP Contract ID</label>
                        <input type="text" name="ERP_contract_id" class="input-field" value="ERP_CONTRACT_001">
                    </div>
                    <div class="form-group">
                        <label>Factwise Contract ID *</label>
                        <input type="text" name="factwise_contract_id" class="input-field" required value="C000001">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Start Date *</label>
                        <input type="date" name="contract_start_date" class="input-field" required>
                    </div>
                    <div class="form-group">
                        <label>End Date *</label>
                        <input type="date" name="contract_end_date" class="input-field" required>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Entity Name *</label>
                        <input type="text" name="entity_name" class="input-field" required value="FactWise">
                    </div>
                    <div class="form-group">
                        <label>Status *</label>
                        <select name="status" class="input-field" required>
                            <option value="DRAFT">DRAFT</option>
                            <option value="SUBMITTED">SUBMITTED</option>
                        </select>
                    </div>
                </div>

                <!-- ③ Buyer Details -->
                <div class="form-section-title">
                    <span class="fst-icon">🏢</span>
                    <h4>Buyer Details</h4>
                </div>

                <div class="form-group">
                    <label>Buyer Identifications (comma-separated) *</label>
                    <input type="text" name="buyer_identifications" class="input-field" required value="GST" placeholder="GST, PAN, etc.">
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Buyer Address</label>
                        <input type="text" name="buyer_address" class="input-field" value="Main address">
                    </div>
                    <div class="form-group">
                        <label>Buyer Contact *</label>
                        <input type="email" name="buyer_contact" class="input-field" required value="${this.currentAccount?.user_email || 'buyer@example.com'}">
                    </div>
                </div>

                <!-- ④ Vendor Details -->
                <div class="form-section-title">
                    <span class="fst-icon">🤝</span>
                    <h4>Vendor Details</h4>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Factwise Vendor Code</label>
                        <input type="text" name="factwise_vendor_code" class="input-field" value="V001">
                    </div>
                    <div class="form-group">
                        <label>ERP Vendor Code</label>
                        <input type="text" name="ERP_vendor_code" class="input-field">
                    </div>
                </div>

                <div class="form-group">
                    <label>Vendor Contact *</label>
                    <input type="email" name="vendor_contact" class="input-field" required value="vendor@example.com">
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Vendor Identification Name *</label>
                        <input type="text" name="vendor_identification_name" class="input-field" required value="Vendor Corp">
                    </div>
                    <div class="form-group">
                        <label>Vendor Identification Value *</label>
                        <input type="text" name="vendor_identification_value" class="input-field" required value="123456789">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Vendor Address ID</label>
                        <input type="text" name="vendor_address_id" class="input-field">
                    </div>
                    <div class="form-group">
                        <label>Vendor Full Address</label>
                        <input type="text" name="vendor_full_address" class="input-field" value="123 Vendor St">
                    </div>
                </div>

                <!-- ⑤ Payment & Terms -->
                <div class="form-section-title">
                    <span class="fst-icon">💳</span>
                    <h4>Payment &amp; Terms</h4>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Project</label>
                        <input type="text" name="project" class="input-field" value="P000001">
                    </div>
                    <div class="form-group">
                        <label>Prepayment %</label>
                        <input type="number" name="prepayment_percentage" class="input-field" value="10" min="0" max="100" step="0.01">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Payment Type</label>
                        <select name="payment_type" class="input-field">
                            <option value="">Select...</option>
                            <option value="PER_INVOICE_ITEM" selected>PER_INVOICE_ITEM</option>
                            <option value="PER_INVOICE">PER_INVOICE</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Incoterm *</label>
                        <select name="incoterm" class="input-field" required>
                            <option value="CFR" selected>CFR</option>
                            <option value="DAP">DAP</option>
                            <option value="NA">NA</option>
                            <option value="FOB">FOB</option>
                            <option value="CIF">CIF</option>
                        </select>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Lead Time</label>
                        <input type="number" name="lead_time" class="input-field" value="10" step="0.1">
                    </div>
                    <div class="form-group">
                        <label>Lead Time Period</label>
                        <select name="lead_time_period" class="input-field">
                            <option value="">Select...</option>
                            <option value="DAYS" selected>DAYS</option>
                            <option value="WEEKS">WEEKS</option>
                            <option value="MONTHS">MONTHS</option>
                        </select>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Payment Term</label>
                        <input type="number" name="payment_term" class="input-field" value="1" min="0">
                    </div>
                    <div class="form-group">
                        <label>Payment Period</label>
                        <select name="payment_period" class="input-field">
                            <option value="DAYS">DAYS</option>
                            <option value="WEEKS">WEEKS</option>
                            <option value="MONTHS" selected>MONTHS</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Applied From</label>
                        <input type="text" name="payment_applied_from" class="input-field" value="INVOICE_DATE">
                    </div>
                </div>

                <!-- ⑥ Contract-Level Additional Costs (conditional) -->
                <div id="contract-costs-section-update" class="cc-conditional-section">
                    <div class="form-section-title">
                        <span class="fst-icon">💰</span>
                        <h4>Contract-Level Costs</h4>
                    </div>
                    <div id="contract-costs-container-update"></div>
                    <button type="button" class="btn-add-row" onclick="window.uiController._addContractCostUpdate()">＋ Add Cost / Tax / Discount</button>
                </div>

                <!-- ⑦ Contract-Level Custom Fields (conditional) -->
                <div id="contract-custom-section-update" class="cc-conditional-section">
                    <div class="form-section-title">
                        <span class="fst-icon">🔧</span>
                        <h4>Contract Custom Sections</h4>
                    </div>
                    <div id="contract-custom-container-update"></div>
                    <button type="button" class="btn-add-row" onclick="window.uiController._addContractCustomSectionUpdate()">＋ Add Custom Section</button>
                </div>

                <!-- Contract Items -->
                <h4 style="margin: 20px 0 10px 0; color: #334155; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px;">
                    <span>📦 Contract Items</span>
                    <button type="button" class="btn-secondary" onclick="window.uiController._addContractItemUpdate()" style="font-size: 13px; padding: 6px 12px; margin-left: 15px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;">
                        + Add Item
                    </button>
                </h4>
                <div id="contract-items-container-update"></div>
            `;
        }
        // Contract State Form
        else if (module.id === 'contract' && operation.id === 'state') {
            bodyInputsHtml = `
                <div class="form-section-title no-margin-top">
                    <span class="fst-icon">🔍</span>
                    <h4>Contract Identification</h4>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label>Factwise Contract ID</label>
                        <input type="text" name="factwise_contract_id" class="input-field" placeholder="e.g., C000189" value="C000000">
                        <small style="color: #64748b; font-size: 11px;">Either Factwise or ERP Contract ID is required</small>
                    </div>
                    <div class="form-group">
                        <label>ERP Contract ID</label>
                        <input type="text" name="ERP_contract_id" class="input-field" placeholder="e.g., CONTRACT_001">
                        <small style="color: #64748b; font-size: 11px;">Either Factwise or ERP Contract ID is required</small>
                    </div>
                </div>

                <div style="background: #fffbeb; border: 1px solid #fde68a; padding: 10px 12px; margin: 15px 0; border-radius: 6px; display: flex; align-items: start; gap: 8px;">
                    <span style="font-weight: 600; color: #d97706; font-size: 14px;">i</span>
                    <p style="margin: 0; color: #78716c; font-size: 12px; line-height: 1.5;">
                        Cannot terminate contracts in <strong>DRAFT</strong> state. Only SUBMITTED or ACTIVE contracts can be terminated.
                    </p>
                </div>

                <div class="form-section-title">
                    <span class="fst-icon">🚫</span>
                    <h4>Termination Details</h4>
                </div>
                
                <div class="form-group">
                    <label>Modified By User Email *</label>
                    <input type="email" name="modified_by_user_email" class="input-field" required value="${this.currentAccount?.user_email || 'user@example.com'}">
                </div>
                
                <div class="form-group">
                    <label>Status *</label>
                    <select name="status" class="input-field" required>
                        <option value="TERMINATED" selected>TERMINATED</option>
                    </select>
                </div>

                <div style="background: #fffbeb; border: 1px solid #fde68a; padding: 10px 12px; margin: 15px 0; border-radius: 6px; display: flex; align-items: start; gap: 8px;">
                    <span style="font-weight: 600; color: #d97706; font-size: 14px;">i</span>
                    <p style="margin: 0; color: #78716c; font-size: 12px; line-height: 1.5;">
                        Only <strong>TERMINATED</strong> status is supported by this API.
                    </p>
                </div>
                
                <div class="form-group">
                    <label>Notes</label>
                    <textarea name="notes" class="form-textarea" rows="3" placeholder="Reason for termination..."></textarea>
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

        this.elements.operationForm.innerHTML = bodyInputsHtml;

        // Add event listeners for Contract forms
        if (module.id === 'contract' && operation.id === 'create') {
            this._setupContractCreateListeners();
        } else if (module.id === 'contract' && operation.id === 'update') {
            this._setupContractUpdateListeners();
        }
    }

    _setupContractCreateListeners() {
        // Store reference to this for use in global functions
        window.uiController = this;

        // Load templates dropdown
        this._loadTemplates();

        // Toggle listeners
        const toggleContractCosts = document.getElementById('toggle-contract-costs');
        const toggleTierCosts = document.getElementById('toggle-tier-costs');
        const toggleContractCustom = document.getElementById('toggle-contract-custom');
        const toggleItemCustom = document.getElementById('toggle-item-custom');

        if (toggleContractCosts) {
            toggleContractCosts.addEventListener('change', (e) => {
                const section = document.getElementById('contract-costs-section');
                section.classList.toggle('visible', e.target.checked);
                if (e.target.checked && document.getElementById('contract-costs-container').children.length === 0) {
                    this._addContractCost();
                }
            });
        }

        if (toggleContractCustom) {
            toggleContractCustom.addEventListener('change', (e) => {
                const section = document.getElementById('contract-custom-section');
                section.classList.toggle('visible', e.target.checked);
                if (e.target.checked && document.getElementById('contract-custom-container').children.length === 0) {
                    this._addContractCustomSection();
                }
            });
        }

        if (toggleTierCosts || toggleItemCustom) {
            // Re-render items when these toggles change
            [toggleTierCosts, toggleItemCustom].forEach(toggle => {
                if (toggle) {
                    toggle.addEventListener('change', () => this._renderContractItems());
                }
            });
        }

        // Event delegation for Add Tier buttons
        const itemsContainer = document.getElementById('contract-items-container');
        if (itemsContainer) {
            itemsContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('btn-add-tier')) {
                    const itemIndex = parseInt(e.target.dataset.itemIndex);
                    this._addPricingTier(itemIndex);
                }
            });
        }

        // Initial render of contract items
        this._renderContractItems();

        // Set default dates after form is ready
        if (typeof setDefaultDates === 'function') setTimeout(setDefaultDates, 50);
    }

    _addPricingTier(itemIndex) {
        const itemCard = document.querySelector(`.cc-item-card[data-item-index="${itemIndex}"]`);
        if (!itemCard) return;

        const currentTiers = parseInt(itemCard.dataset.tiersCount || 1);
        const newTierCount = currentTiers + 1;

        // Update tier count
        itemCard.dataset.tiersCount = newTierCount;

        // Get settings
        const showTierCosts = document.getElementById('toggle-tier-costs')?.checked || false;

        // Read max of the last tier to use as next tier's min
        const tiersContainer = document.getElementById(`tiers-container-${itemIndex}`);
        let lastTierMax = 0;
        if (tiersContainer) {
            const lastMaxInput = tiersContainer.querySelector(
                `input[name="item_${itemIndex}_tier_${currentTiers - 1}_max"]`
            );
            lastTierMax = lastMaxInput ? (parseFloat(lastMaxInput.value) || 0) : 0;
        }

        // Render all tiers (pass lastTierMax for new tier's min prefill)
        if (tiersContainer) {
            tiersContainer.innerHTML = this._renderPricingTiers(itemIndex, newTierCount, showTierCosts, lastTierMax);
            this._attachTierMaxListeners(tiersContainer, itemIndex, false);
        }
    }

    _loadContractTemplate(template) {
        // Deprecated - keeping for compatibility
        console.log('_loadContractTemplate is deprecated');
    }


    _renderContractItems() {
        const container = document.getElementById('contract-items-container');
        if (!container) return;

        // If container is empty, add first item
        if (container.children.length === 0) {
            this._addContractItem();
        } else {
            // Re-render existing items with updated config
            const itemCount = container.children.length;
            container.innerHTML = '';
            for (let i = 0; i < itemCount; i++) {
                this._addContractItem();
            }
        }
    }

    _addContractItem() {
        const container = document.getElementById('contract-items-container');
        if (!container) return;

        const itemIndex = container.children.length;
        const tiersCount = 1; // Start with 1 tier per item
        const showTierCosts = document.getElementById('toggle-tier-costs')?.checked || false;
        const showItemCustom = document.getElementById('toggle-item-custom')?.checked || false;

        const itemHtml = `
                <div class="cc-item-card" data-item-index="${itemIndex}" data-tiers-count="${tiersCount}">
                    <div class="cc-item-card-header">
                        <div class="cc-item-card-badge">${itemIndex + 1}</div>
                        <div class="cc-item-card-title">Contract Item #${itemIndex + 1}</div>
                        ${itemIndex > 0 ? `
                            <button type="button" onclick="this.closest('.cc-item-card').remove()" style="margin-left: auto; background: #ef4444; color: white; border: none; border-radius: 4px; padding: 6px 12px; cursor: pointer; font-size: 12px;">
                                ✕ Remove Item
                            </button>
                        ` : ''}
                    </div>
                    <div class="cc-item-card-body">

                        <p class="cc-sub-title">📌 Item Identification</p>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Factwise Item Code</label>
                                <input type="text" 
                                       id="item_${itemIndex}_factwise_code" 
                                       name="item_${itemIndex}_factwise_code" 
                                       class="input-field item-code-input" 
                                       data-validate-item="true"
                                       data-currency-field="item_${itemIndex}_currency_id"
                                       data-unit-field="item_${itemIndex}_unit_id"
                                       value="ITEM_00${itemIndex + 1}">
                            </div>
                            <div class="form-group">
                                <label>ERP Item Code</label>
                                <input type="text" name="item_${itemIndex}_erp_code" class="input-field">
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label>Currency Code ID *</label>
                                <input type="text" 
                                       id="item_${itemIndex}_currency_id" 
                                       name="item_${itemIndex}_currency_id" 
                                       class="input-field" 
                                       required 
                                       value="a8c3e3fd-b05f-4d09-bd2f-9fedd07d0ec3">
                            </div>
                            <div class="form-group">
                                <label>Measurement Unit ID *</label>
                                <input type="text" 
                                       id="item_${itemIndex}_unit_id" 
                                       name="item_${itemIndex}_unit_id" 
                                       class="input-field" 
                                       required 
                                       value="f16d124e-db59-48fe-a2b8-19f625745cbf">
                            </div>
                        </div>

                        <p class="cc-sub-title">💲 Pricing &amp; Quantities</p>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Rate</label>
                                <input type="number" name="item_${itemIndex}_rate" class="input-field" value="15" step="0.01">
                            </div>
                            <div class="form-group">
                                <label>Quantity</label>
                                <input type="number" name="item_${itemIndex}_quantity" class="input-field" value="200" step="0.01">
                            </div>
                        </div>

                        <p class="cc-sub-title">💳 Payment &amp; Shipping</p>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Prepayment %</label>
                                <input type="number" name="item_${itemIndex}_prepayment" class="input-field" value="100" min="0" max="100" step="0.01">
                            </div>
                            <div class="form-group">
                                <label>Payment Type</label>
                                <select name="item_${itemIndex}_payment_type" class="input-field">
                                    <option value="PER_INVOICE_ITEM" selected>PER_INVOICE_ITEM</option>
                                    <option value="PER_INVOICE">PER_INVOICE</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label>Incoterm *</label>
                                <select name="item_${itemIndex}_incoterm" class="input-field" required>
                                    <option value="NA" selected>NA</option>
                                    <option value="CFR">CFR</option>
                                    <option value="DAP">DAP</option>
                                    <option value="FOB">FOB</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Lead Time</label>
                                <input type="number" name="item_${itemIndex}_lead_time" class="input-field" value="10" step="0.1">
                            </div>
                            <div class="form-group">
                                <label>Lead Time Period</label>
                                <select name="item_${itemIndex}_lead_time_period" class="input-field">
                                    <option value="DAYS" selected>DAYS</option>
                                    <option value="WEEKS">WEEKS</option>
                                    <option value="MONTHS">MONTHS</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label>Payment Term</label>
                                <input type="number" name="item_${itemIndex}_payment_term" class="input-field" value="1" min="0">
                            </div>
                            <div class="form-group">
                                <label>Payment Period</label>
                                <select name="item_${itemIndex}_payment_period" class="input-field">
                                    <option value="MONTHS" selected>MONTHS</option>
                                    <option value="DAYS">DAYS</option>
                                    <option value="WEEKS">WEEKS</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Applied From</label>
                                <input type="text" name="item_${itemIndex}_payment_applied_from" class="input-field" value="INVOICE_DATE">
                            </div>
                        </div>

                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                            <p class="cc-sub-title" style="margin: 0;">📊 Pricing Tiers</p>
                            <button type="button" class="btn-add-tier" data-item-index="${itemIndex}" style="background: #3b82f6; color: white; border: none; border-radius: 4px; padding: 6px 12px; cursor: pointer; font-size: 12px;">
                                + Add Tier
                            </button>
                        </div>
                        <div id="tiers-container-${itemIndex}">
                            ${this._renderPricingTiers(itemIndex, tiersCount, showTierCosts)}
                        </div>

                        ${showItemCustom ? `
                            <p class="cc-sub-title">🔧 Item Custom Sections</p>
                            <div class="form-group">
                                <label>Custom Section Name</label>
                                <input type="text" name="item_${itemIndex}_custom_section_name" class="input-field" value="Essential Terms">
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;

        container.insertAdjacentHTML('beforeend', itemHtml);

        // Attach item validation to the newly added item code input
        this._attachItemValidation(itemIndex);

        // Attach tier max→next-min live link
        const tiersContainer = document.getElementById(`tiers-container-${itemIndex}`);
        if (tiersContainer) this._attachTierMaxListeners(tiersContainer, itemIndex, false);
    }

    /**
     * Attach item validation to item code input
     * @private
     */
    _attachItemValidation(itemIndex) {
        // Wait for DOM to update
        setTimeout(() => {
            const itemCodeInput = document.getElementById(`item_${itemIndex}_factwise_code`);
            const currencyField = document.getElementById(`item_${itemIndex}_currency_id`);
            const unitField = document.getElementById(`item_${itemIndex}_unit_id`);

            if (itemCodeInput && this.itemValidationUI) {
                this.itemValidationUI.attachToInput(itemCodeInput, {
                    currencyField: currencyField,
                    unitField: unitField,
                    onValidated: (isValid, itemData) => {
                        console.log(`Item ${itemIndex} validation:`, isValid, itemData);
                    }
                });
            }
        }, 100);
    }


    _renderPricingTiers(itemIndex, count, showCosts, lastAddedMax) {
        let html = '';
        for (let i = 0; i < count; i++) {
            // Tier 1 min is always 0 (locked)
            // Subsequent tiers: min = previous tier max (readonly, auto-linked)
            const isFirstTier = i === 0;
            // For newly appended tier (count > 1 and i is last), prefill min from lastAddedMax
            const minVal = isFirstTier ? 0 : (i === count - 1 && lastAddedMax !== undefined ? lastAddedMax : '');
            const minReadonly = isFirstTier ? 'readonly style="background:#f1f5f9;cursor:not-allowed;"' : 'readonly style="background:#f1f5f9;cursor:not-allowed;" title="Auto-set from previous tier max"';
            html += `
                <div class="cc-tier-card">
                    <p class="cc-tier-card-title"><span class="tier-dot"></span>Tier ${i + 1}</p>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Min Quantity *${isFirstTier ? ' <small style="color:#6366f1;font-size:10px">(always 0)</small>' : ' <small style="color:#6366f1;font-size:10px">(= prev max)</small>'}</label>
                            <input type="number" name="item_${itemIndex}_tier_${i}_min" class="input-field tier-min" required value="${minVal}" step="0.01" ${minReadonly}>
                        </div>
                        <div class="form-group">
                            <label>Max Quantity *</label>
                            <input type="number" name="item_${itemIndex}_tier_${i}_max" class="input-field tier-max" required value="${i === 0 ? 100 : ''}" step="0.01" data-item="${itemIndex}" data-tier="${i}">
                        </div>
                        <div class="form-group">
                            <label>Rate</label>
                            <input type="number" name="item_${itemIndex}_tier_${i}_rate" class="input-field" value="5" step="0.01">
                        </div>
                    </div>
                    ${showCosts ? `
                        <div class="form-row">
                            <div class="form-group">
                                <label>Additional Cost Name</label>
                                <input type="text" name="item_${itemIndex}_tier_${i}_cost_name" class="input-field" placeholder="e.g., Shipping">
                            </div>
                            <div class="form-group">
                                <label>Additional Cost Value</label>
                                <input type="number" name="item_${itemIndex}_tier_${i}_cost_value" class="input-field" step="0.01">
                            </div>
                        </div>
                    ` : ''}
                </div>
            `;
        }
        return html;
    }

    _addContractCost() {
        const container = document.getElementById('contract-costs-container');
        const index = container.children.length;
        const html = `
            <div class="cc-cost-item">
                <div class="form-row">
                    <div class="form-group">
                        <label>Type</label>
                        <select name="contract_cost_${index}_type" class="input-field">
                            <option value="additional_costs">Additional Cost</option>
                            <option value="taxes">Tax</option>
                            <option value="discounts">Discount</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Name</label>
                        <input type="text" name="contract_cost_${index}_name" class="input-field" placeholder="e.g., GST">
                    </div>
                    <div class="form-group">
                        <label>Value</label>
                        <input type="number" name="contract_cost_${index}_value" class="input-field" step="0.01">
                    </div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', html);
    }

    _addContractCustomSection() {
        const container = document.getElementById('contract-custom-container');
        const index = container.children.length;
        const html = `
            <div class="cc-custom-item">
                <div class="form-group">
                    <label>Section Name</label>
                    <input type="text" name="contract_custom_${index}_name" class="input-field" value="Contract Details">
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', html);
    }

    // ============================================================
    // CONTRACT UPDATE METHODS
    // ============================================================

    _setupContractUpdateListeners() {
        // Store reference to this for use in global functions
        window.uiController = this;

        // Import button - show modal
        const btnShowImport = document.getElementById('btn-show-import-modal');
        if (btnShowImport) {
            btnShowImport.addEventListener('click', () => this._showImportModal());
        }

        // Toggle listeners
        const toggleContractCosts = document.getElementById('toggle-contract-costs-update');
        const toggleTierCosts = document.getElementById('toggle-tier-costs-update');
        const toggleContractCustom = document.getElementById('toggle-contract-custom-update');
        const toggleItemCustom = document.getElementById('toggle-item-custom-update');

        if (toggleContractCosts) {
            toggleContractCosts.addEventListener('change', (e) => {
                const section = document.getElementById('contract-costs-section-update');
                section.classList.toggle('visible', e.target.checked);
                if (e.target.checked && document.getElementById('contract-costs-container-update').children.length === 0) {
                    this._addContractCostUpdate();
                }
            });
        }

        if (toggleContractCustom) {
            toggleContractCustom.addEventListener('change', (e) => {
                const section = document.getElementById('contract-custom-section-update');
                section.classList.toggle('visible', e.target.checked);
                if (e.target.checked && document.getElementById('contract-custom-container-update').children.length === 0) {
                    this._addContractCustomSectionUpdate();
                }
            });
        }

        if (toggleTierCosts || toggleItemCustom) {
            // Re-render items when these toggles change
            [toggleTierCosts, toggleItemCustom].forEach(toggle => {
                if (toggle) {
                    toggle.addEventListener('change', () => this._renderContractItemsUpdate());
                }
            });
        }

        // Event delegation for Add Tier buttons
        const itemsContainerUpdate = document.getElementById('contract-items-container-update');
        if (itemsContainerUpdate) {
            itemsContainerUpdate.addEventListener('click', (e) => {
                if (e.target.classList.contains('btn-add-tier-update')) {
                    const itemIndex = parseInt(e.target.dataset.itemIndex);
                    this._addPricingTierUpdate(itemIndex);
                }
            });
        }

        // Initial render of contract items
        this._renderContractItemsUpdate();

        // Set default dates after form is ready
        if (typeof setDefaultDates === 'function') setTimeout(setDefaultDates, 50);
    }

    _addPricingTierUpdate(itemIndex) {
        const itemCard = document.querySelector(`.cc-item-card[data-item-index="${itemIndex}"]`);
        if (!itemCard) return;

        const currentTiers = parseInt(itemCard.dataset.tiersCount || 1);
        const newTierCount = currentTiers + 1;

        // Update tier count
        itemCard.dataset.tiersCount = newTierCount;

        // Get settings
        const showTierCosts = document.getElementById('toggle-tier-costs-update')?.checked || false;

        // Read max of the last tier to use as next tier's min
        const tiersContainer = document.getElementById(`tiers-container-update-${itemIndex}`);
        let lastTierMax = 0;
        if (tiersContainer) {
            const lastMaxInput = tiersContainer.querySelector(
                `input[name="item_${itemIndex}_tier_${currentTiers - 1}_max"]`
            );
            lastTierMax = lastMaxInput ? (parseFloat(lastMaxInput.value) || 0) : 0;
        }

        if (tiersContainer) {
            tiersContainer.innerHTML = this._renderPricingTiersUpdate(itemIndex, newTierCount, showTierCosts, lastTierMax);
            this._attachTierMaxListeners(tiersContainer, itemIndex, true);
        }
    }

    _renderContractItemsUpdate() {
        const container = document.getElementById('contract-items-container-update');
        if (!container) return;

        // If container is empty, add first item
        if (container.children.length === 0) {
            this._addContractItemUpdate();
        } else {
            // Re-render existing items with updated config
            const itemCount = container.children.length;
            container.innerHTML = '';
            for (let i = 0; i < itemCount; i++) {
                this._addContractItemUpdate();
            }
        }
    }

    _addContractItemUpdate() {
        const container = document.getElementById('contract-items-container-update');
        if (!container) return;

        const itemIndex = container.children.length;
        const tiersCount = 1; // Start with 1 tier per item
        const showTierCosts = document.getElementById('toggle-tier-costs-update')?.checked || false;
        const showItemCustom = document.getElementById('toggle-item-custom-update')?.checked || false;

        const itemHtml = `
                <div class="cc-item-card" data-item-index="${itemIndex}" data-tiers-count="${tiersCount}">
                    <div class="cc-item-card-header">
                        <div class="cc-item-card-badge">${itemIndex + 1}</div>
                        <div class="cc-item-card-title">Contract Item #${itemIndex + 1}</div>
                        ${itemIndex > 0 ? `
                            <button type="button" onclick="this.closest('.cc-item-card').remove()" style="margin-left: auto; background: #ef4444; color: white; border: none; border-radius: 4px; padding: 6px 12px; cursor: pointer; font-size: 12px;">
                                ✕ Remove Item
                            </button>
                        ` : ''}
                    </div>
                    <div class="cc-item-card-body">

                        <p class="cc-sub-title">📌 Item Identification</p>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Factwise Item Code</label>
                                <input type="text" 
                                       id="item_update_${itemIndex}_factwise_code" 
                                       name="item_${itemIndex}_factwise_code" 
                                       class="input-field item-code-input" 
                                       data-validate-item="true"
                                       data-currency-field="item_update_${itemIndex}_currency_id"
                                       data-unit-field="item_update_${itemIndex}_unit_id"
                                       value="ITEM_00${itemIndex + 1}">
                            </div>
                            <div class="form-group">
                                <label>ERP Item Code</label>
                                <input type="text" name="item_${itemIndex}_erp_code" class="input-field">
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label>Currency Code ID *</label>
                                <input type="text" 
                                       id="item_update_${itemIndex}_currency_id" 
                                       name="item_${itemIndex}_currency_id" 
                                       class="input-field" 
                                       required 
                                       value="a8c3e3fd-b05f-4d09-bd2f-9fedd07d0ec3">
                            </div>
                            <div class="form-group">
                                <label>Measurement Unit ID *</label>
                                <input type="text" 
                                       id="item_update_${itemIndex}_unit_id" 
                                       name="item_${itemIndex}_unit_id" 
                                       class="input-field" 
                                       required 
                                       value="f16d124e-db59-48fe-a2b8-19f625745cbf">
                            </div>
                        </div>

                        <p class="cc-sub-title">💲 Pricing &amp; Quantities</p>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Rate</label>
                                <input type="number" name="item_${itemIndex}_rate" class="input-field" value="15" step="0.01">
                            </div>
                            <div class="form-group">
                                <label>Quantity</label>
                                <input type="number" name="item_${itemIndex}_quantity" class="input-field" value="200" step="0.01">
                            </div>
                        </div>

                        <p class="cc-sub-title">💳 Payment &amp; Shipping</p>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Prepayment %</label>
                                <input type="number" name="item_${itemIndex}_prepayment" class="input-field" value="100" min="0" max="100" step="0.01">
                            </div>
                            <div class="form-group">
                                <label>Payment Type</label>
                                <select name="item_${itemIndex}_payment_type" class="input-field">
                                    <option value="PER_INVOICE_ITEM" selected>PER_INVOICE_ITEM</option>
                                    <option value="PER_INVOICE">PER_INVOICE</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label>Incoterm *</label>
                                <select name="item_${itemIndex}_incoterm" class="input-field" required>
                                    <option value="NA" selected>NA</option>
                                    <option value="CFR">CFR</option>
                                    <option value="DAP">DAP</option>
                                    <option value="FOB">FOB</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Lead Time</label>
                                <input type="number" name="item_${itemIndex}_lead_time" class="input-field" value="10" step="0.1">
                            </div>
                            <div class="form-group">
                                <label>Lead Time Period</label>
                                <select name="item_${itemIndex}_lead_time_period" class="input-field">
                                    <option value="DAYS" selected>DAYS</option>
                                    <option value="WEEKS">WEEKS</option>
                                    <option value="MONTHS">MONTHS</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label>Payment Term</label>
                                <input type="number" name="item_${itemIndex}_payment_term" class="input-field" value="1" min="0">
                            </div>
                            <div class="form-group">
                                <label>Payment Period</label>
                                <select name="item_${itemIndex}_payment_period" class="input-field">
                                    <option value="MONTHS" selected>MONTHS</option>
                                    <option value="DAYS">DAYS</option>
                                    <option value="WEEKS">WEEKS</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Applied From</label>
                                <input type="text" name="item_${itemIndex}_payment_applied_from" class="input-field" value="INVOICE_DATE">
                            </div>
                        </div>

                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                            <p class="cc-sub-title" style="margin: 0;">📊 Pricing Tiers</p>
                            <button type="button" class="btn-add-tier-update" data-item-index="${itemIndex}" style="background: #3b82f6; color: white; border: none; border-radius: 4px; padding: 6px 12px; cursor: pointer; font-size: 12px;">
                                + Add Tier
                            </button>
                        </div>
                        <div id="tiers-container-update-${itemIndex}">
                            ${this._renderPricingTiersUpdate(itemIndex, tiersCount, showTierCosts)}
                        </div>

                        ${showItemCustom ? `
                            <p class="cc-sub-title">🔧 Item Custom Sections</p>
                            <div class="form-group">
                                <label>Custom Section Name</label>
                                <input type="text" name="item_${itemIndex}_custom_section_name" class="input-field" value="Essential Terms">
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;

        container.insertAdjacentHTML('beforeend', itemHtml);

        // Attach item validation to the newly added item code input
        this._attachItemValidationUpdate(itemIndex);

        // Attach tier max→next-min live link
        const tiersContainerU = document.getElementById(`tiers-container-update-${itemIndex}`);
        if (tiersContainerU) this._attachTierMaxListeners(tiersContainerU, itemIndex, true);
    }

    /**
     * Attach item validation to item code input (Update form)
     * @private
     */
    _attachItemValidationUpdate(itemIndex) {
        // Wait for DOM to update
        setTimeout(() => {
            const itemCodeInput = document.getElementById(`item_update_${itemIndex}_factwise_code`);
            const currencyField = document.getElementById(`item_update_${itemIndex}_currency_id`);
            const unitField = document.getElementById(`item_update_${itemIndex}_unit_id`);

            if (itemCodeInput && this.itemValidationUI) {
                this.itemValidationUI.attachToInput(itemCodeInput, {
                    currencyField: currencyField,
                    unitField: unitField,
                    onValidated: (isValid, itemData) => {
                        console.log(`Item Update ${itemIndex} validation:`, isValid, itemData);
                    }
                });
            }
        }, 100);
    }

    _renderPricingTiersUpdate(itemIndex, count, showCosts, lastAddedMax) {
        let html = '';
        for (let i = 0; i < count; i++) {
            const isFirstTier = i === 0;
            const minVal = isFirstTier ? 0 : (i === count - 1 && lastAddedMax !== undefined ? lastAddedMax : '');
            const minReadonly = isFirstTier ? 'readonly style="background:#f1f5f9;cursor:not-allowed;"' : 'readonly style="background:#f1f5f9;cursor:not-allowed;" title="Auto-set from previous tier max"';
            html += `
                <div class="cc-tier-card">
                    <p class="cc-tier-card-title"><span class="tier-dot"></span>Tier ${i + 1}</p>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Min Quantity *${isFirstTier ? ' <small style="color:#6366f1;font-size:10px">(always 0)</small>' : ' <small style="color:#6366f1;font-size:10px">(= prev max)</small>'}</label>
                            <input type="number" name="item_${itemIndex}_tier_${i}_min" class="input-field tier-min" required value="${minVal}" step="0.01" ${minReadonly}>
                        </div>
                        <div class="form-group">
                            <label>Max Quantity *</label>
                            <input type="number" name="item_${itemIndex}_tier_${i}_max" class="input-field tier-max" required value="${i === 0 ? 100 : ''}" step="0.01" data-item="${itemIndex}" data-tier="${i}">
                        </div>
                        <div class="form-group">
                            <label>Rate</label>
                            <input type="number" name="item_${itemIndex}_tier_${i}_rate" class="input-field" value="5" step="0.01">
                        </div>
                    </div>
                    ${showCosts ? `
                        <div class="form-row">
                            <div class="form-group">
                                <label>Additional Cost Name</label>
                                <input type="text" name="item_${itemIndex}_tier_${i}_cost_name" class="input-field" placeholder="e.g., Shipping">
                            </div>
                            <div class="form-group">
                                <label>Additional Cost Value</label>
                                <input type="number" name="item_${itemIndex}_tier_${i}_cost_value" class="input-field" step="0.01">
                            </div>
                        </div>
                    ` : ''}
                </div>
            `;
        }
        return html;
    }

    /**
     * Attaches live listeners so that when a tier's Max changes,
     * the next tier's Min is automatically updated (readonly field).
     * @param {HTMLElement} tiersContainer - The container element holding tier cards
     * @param {number} itemIndex - The item index
     * @param {boolean} isUpdate - Whether this is the update form variant
     * @private
     */
    _attachTierMaxListeners(tiersContainer, itemIndex, isUpdate) {
        const maxInputs = tiersContainer.querySelectorAll('.tier-max');
        maxInputs.forEach((maxInput) => {
            // Remove any prior listener to avoid duplicates
            const clone = maxInput.cloneNode(true);
            maxInput.parentNode.replaceChild(clone, maxInput);
            clone.addEventListener('input', () => {
                const tierIndex = parseInt(clone.dataset.tier);
                const nextTierMinName = `item_${itemIndex}_tier_${tierIndex + 1}_min`;
                const nextMinInput = tiersContainer.querySelector(`input[name="${nextTierMinName}"]`);
                if (nextMinInput) {
                    nextMinInput.value = clone.value;
                }
            });
        });
    }

    _addContractCostUpdate() {
        const container = document.getElementById('contract-costs-container-update');
        const index = container.children.length;
        const html = `
            <div class="cc-cost-item">
                <div class="form-row">
                    <div class="form-group">
                        <label>Type</label>
                        <select name="contract_cost_${index}_type" class="input-field">
                            <option value="additional_costs">Additional Cost</option>
                            <option value="taxes">Tax</option>
                            <option value="discounts">Discount</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Name</label>
                        <input type="text" name="contract_cost_${index}_name" class="input-field" placeholder="e.g., GST">
                    </div>
                    <div class="form-group">
                        <label>Value</label>
                        <input type="number" name="contract_cost_${index}_value" class="input-field" step="0.01">
                    </div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', html);
    }

    _addContractCustomSectionUpdate() {
        const container = document.getElementById('contract-custom-container-update');
        const index = container.children.length;
        const html = `
            <div class="cc-custom-item">
                <div class="form-group">
                    <label>Section Name</label>
                    <input type="text" name="contract_custom_${index}_name" class="input-field" value="Contract Details">
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', html);
    }

    _showImportModal() {
        // Create modal overlay
        const modal = document.createElement('div');
        modal.id = 'import-modal';
        modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
            `;

        modal.innerHTML = `
                <div style="background: white; border-radius: 8px; padding: 0; width: 90%; max-width: 600px; max-height: 80vh; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);">
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid #e5e7eb;">
                        <h3 style="margin: 0; color: #111827; font-size: 16px; font-weight: 600;">📥 Import Contract Create Payload</h3>
                        <button id="close-modal" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #6b7280; line-height: 1; padding: 0; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 4px; transition: all 0.2s;">&times;</button>
                    </div>
                    <div style="padding: 24px; overflow-y: auto; max-height: calc(80vh - 140px);">
                        <p style="color: #6b7280; font-size: 13px; margin-bottom: 16px; line-height: 1.5;">
                            Paste the payload you used for Contract Create here. You can paste either the full cURL command or just the JSON payload. All fields will be auto-filled so you can easily modify what you need.
                        </p>
                        <textarea id="import-curl-input" placeholder="Paste your cURL command or JSON payload here..." style="width: 100%; min-height: 200px; padding: 12px; border: 1px solid #d1d5db; border-radius: 4px; font-family: 'JetBrains Mono', 'Courier New', monospace; font-size: 12px; resize: vertical; transition: border-color 0.2s, box-shadow 0.2s;"></textarea>
                        <div id="import-status" style="margin-top: 12px; font-size: 12px; min-height: 20px;"></div>
                    </div>
                    <div style="display: flex; gap: 12px; padding: 16px 24px; border-top: 1px solid #e5e7eb; background: #f9fafb; justify-content: flex-end;">
                        <button id="cancel-import" class="btn-secondary" style="padding: 8px 16px; font-size: 13px;">
                            Cancel
                        </button>
                        <button id="btn-import-curl" class="btn-primary" style="padding: 8px 16px; font-size: 13px;">
                            Import & Populate
                        </button>
                    </div>
                </div>
            `;

        document.body.appendChild(modal);

        // Add hover effect to close button
        const closeBtn = document.getElementById('close-modal');
        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.background = '#f3f4f6';
        });
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.background = 'none';
        });

        // Add focus effect to textarea
        const textarea = document.getElementById('import-curl-input');
        textarea.addEventListener('focus', () => {
            textarea.style.borderColor = '#4f46e5';
            textarea.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)';
        });
        textarea.addEventListener('blur', () => {
            textarea.style.borderColor = '#d1d5db';
            textarea.style.boxShadow = 'none';
        });

        // Event listeners
        closeBtn.addEventListener('click', () => modal.remove());
        document.getElementById('cancel-import').addEventListener('click', () => modal.remove());
        document.getElementById('btn-import-curl').addEventListener('click', () => {
            this._handleImportCurl();
        });

        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }


    _handleImportCurl() {
        const input = document.getElementById('import-curl-input');
        const statusDiv = document.getElementById('import-status');
        const modal = document.getElementById('import-modal');

        if (!input || !input.value.trim()) {
            statusDiv.innerHTML = '<span style="color: #ef4444;">⚠️ Please paste a cURL command or JSON payload</span>';
            return;
        }

        const inputText = input.value.trim();
        let payload = null;
        let headers = {};

        try {
            // Try to parse as JSON first (direct payload)
            if (inputText.startsWith('{')) {
                payload = JSON.parse(inputText);
                statusDiv.innerHTML = '<span style="color: #10b981;">✓ JSON payload detected</span>';
            }
            // Parse as cURL command
            else if (inputText.startsWith('curl')) {
                // Extract headers
                const headerMatches = inputText.matchAll(/--header\s+'([^:]+):\s*([^']+)'|--header\s+"([^:]+):\s*([^"]+)"/g);
                for (const match of headerMatches) {
                    const key = (match[1] || match[3]).toLowerCase();
                    const value = match[2] || match[4];
                    headers[key] = value;
                }

                // Extract payload from --data-raw
                const dataMatch = inputText.match(/--data-raw\s+'([^']+)'|--data-raw\s+"([^"]+)"|--data-raw\s+(\{[^}]+\})/s);
                if (dataMatch) {
                    const jsonStr = dataMatch[1] || dataMatch[2] || dataMatch[3];
                    payload = JSON.parse(jsonStr);
                }

                // Validate headers match current account (GlobalFields)
                const currentApiId = this.currentAccount?.api_id;
                const currentApiKey = this.currentAccount?.api_key;

                if (headers['api-id'] && headers['api-id'] !== currentApiId) {
                    statusDiv.innerHTML = '<span style="color: #ef4444;">⚠️ This request is not for GlobalFields account. API ID mismatch.</span>';
                    return;
                }

                if (headers['x-api-key'] && headers['x-api-key'] !== currentApiKey) {
                    statusDiv.innerHTML = '<span style="color: #ef4444;">⚠️ This request is not for GlobalFields account. API Key mismatch.</span>';
                    return;
                }

                statusDiv.innerHTML = '<span style="color: #10b981;">✓ cURL command parsed and validated</span>';
            } else {
                statusDiv.innerHTML = '<span style="color: #ef4444;">⚠️ Invalid format. Please paste a cURL command or JSON payload</span>';
                return;
            }

            if (!payload) {
                statusDiv.innerHTML = '<span style="color: #ef4444;">⚠️ Could not extract payload from input</span>';
                return;
            }

            // Populate form fields from payload
            this._populateUpdateFormFromPayload(payload);
            statusDiv.innerHTML = '<span style="color: #10b981;">✓ Fields populated successfully!</span>';

            // Close modal after 1 second
            setTimeout(() => {
                if (modal) modal.remove();
            }, 1000);

        } catch (error) {
            console.error('Import error:', error);
            statusDiv.innerHTML = `<span style="color: #ef4444;">⚠️ Parse error: ${error.message}</span>`;
        }
    }

    _populateUpdateFormFromPayload(payload) {
        // Basic Information
        if (payload.contract_name) {
            const field = document.querySelector('input[name="contract_name"]');
            if (field) field.value = payload.contract_name;
        }
        if (payload.ERP_contract_id) {
            const field = document.querySelector('input[name="ERP_contract_id"]');
            if (field) field.value = payload.ERP_contract_id;
        }
        if (payload.factwise_contract_id) {
            const field = document.querySelector('input[name="factwise_contract_id"]');
            if (field) field.value = payload.factwise_contract_id;
        }
        if (payload.contract_start_date) {
            const field = document.querySelector('input[name="contract_start_date"]');
            if (field) field.value = payload.contract_start_date;
        }
        if (payload.contract_end_date) {
            const field = document.querySelector('input[name="contract_end_date"]');
            if (field) field.value = payload.contract_end_date;
        }
        if (payload.entity_name) {
            const field = document.querySelector('input[name="entity_name"]');
            if (field) field.value = payload.entity_name;
        }
        if (payload.status) {
            const field = document.querySelector('select[name="status"]');
            if (field) field.value = payload.status;
        }
        if (payload.template_name) {
            const field = document.querySelector('input[name="template_name"]');
            if (field) field.value = payload.template_name;
        }

        // Buyer Details
        if (payload.buyer_identifications) {
            const field = document.querySelector('input[name="buyer_identifications"]');
            if (field) field.value = Array.isArray(payload.buyer_identifications) ? payload.buyer_identifications.join(', ') : payload.buyer_identifications;
        }
        if (payload.buyer_address) {
            const field = document.querySelector('input[name="buyer_address"]');
            if (field) field.value = payload.buyer_address;
        }
        if (payload.buyer_contact) {
            const field = document.querySelector('input[name="buyer_contact"]');
            if (field) field.value = payload.buyer_contact;
        }

        // Vendor Details
        if (payload.factwise_vendor_code) {
            const field = document.querySelector('input[name="factwise_vendor_code"]');
            if (field) field.value = payload.factwise_vendor_code;
        }
        if (payload.ERP_vendor_code) {
            const field = document.querySelector('input[name="ERP_vendor_code"]');
            if (field) field.value = payload.ERP_vendor_code;
        }
        if (payload.vendor_contact) {
            const field = document.querySelector('input[name="vendor_contact"]');
            if (field) field.value = payload.vendor_contact;
        }
        if (payload.vendor_identification_name) {
            const field = document.querySelector('input[name="vendor_identification_name"]');
            if (field) field.value = payload.vendor_identification_name;
        }
        if (payload.vendor_identification_value) {
            const field = document.querySelector('input[name="vendor_identification_value"]');
            if (field) field.value = payload.vendor_identification_value;
        }
        if (payload.vendor_address_id) {
            const field = document.querySelector('input[name="vendor_address_id"]');
            if (field) field.value = payload.vendor_address_id;
        }
        if (payload.vendor_full_address) {
            const field = document.querySelector('input[name="vendor_full_address"]');
            if (field) field.value = payload.vendor_full_address;
        }

        // Payment & Terms
        if (payload.project) {
            const field = document.querySelector('input[name="project"]');
            if (field) field.value = payload.project;
        }
        if (payload.prepayment_percentage !== undefined) {
            const field = document.querySelector('input[name="prepayment_percentage"]');
            if (field) field.value = payload.prepayment_percentage;
        }
        if (payload.payment_type) {
            const field = document.querySelector('select[name="payment_type"]');
            if (field) field.value = payload.payment_type;
        }
        if (payload.incoterm) {
            const field = document.querySelector('select[name="incoterm"]');
            if (field) field.value = payload.incoterm;
        }
        if (payload.lead_time !== undefined) {
            const field = document.querySelector('input[name="lead_time"]');
            if (field) field.value = payload.lead_time;
        }
        if (payload.lead_time_period) {
            const field = document.querySelector('select[name="lead_time_period"]');
            if (field) field.value = payload.lead_time_period;
        }
        if (payload.payment_term !== undefined) {
            const field = document.querySelector('input[name="payment_term"]');
            if (field) field.value = payload.payment_term;
        }
        if (payload.payment_period) {
            const field = document.querySelector('select[name="payment_period"]');
            if (field) field.value = payload.payment_period;
        }
        if (payload.payment_applied_from) {
            const field = document.querySelector('input[name="payment_applied_from"]');
            if (field) field.value = payload.payment_applied_from;
        }

        // TODO: Handle items, tiers, costs, and custom fields if present in payload
        // This would require more complex logic to dynamically add items/tiers
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

        // Clear response meta
        const responseMeta = document.getElementById('response-meta');
        if (responseMeta) responseMeta.innerHTML = '';

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
                const mockMeta = document.getElementById('response-meta');
                if (mockMeta) {
                    mockMeta.innerHTML = `
                        <span class="res-status-badge success">200 OK</span>
                        <span class="res-timing-chip">~mock~</span>
                    `;
                }
                this.elements.responseDisplay.innerHTML = `<pre><code class="language-json">${JSON.stringify({
                    status: 'success',
                    data: { id: `op_${Math.floor(Math.random() * 10000)}`, timestamp: new Date().toISOString() }
                }, null, 2)}</code></pre>`;
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
            // Collect all input values from the form
            const inputs = form.querySelectorAll('input, select, textarea');
            const data = {};

            inputs.forEach(input => {
                if (input.name) {
                    data[input.name] = input.value;
                }
            });

            console.log('Collected form data:', data);

            // For now, return the collected data as-is
            // The payload builder will need to be updated to handle this format
            return data;

        } else if (operation.id === 'update') {
            // Collect all input values from the update form
            const inputs = form.querySelectorAll('input, select, textarea');
            const data = {};

            inputs.forEach(input => {
                if (input.name) {
                    data[input.name] = input.value;
                }
            });

            console.log('Collected update form data:', data);
            return data;

        } else if (operation.id === 'state') {
            const params = {
                modified_by_user_email: form.querySelector('[name="modified_by_user_email"]')?.value,
                status: form.querySelector('[name="status"]')?.value
            };

            // Add contract IDs
            const factwiseId = form.querySelector('[name="factwise_contract_id"]')?.value;
            const erpId = form.querySelector('[name="ERP_contract_id"]')?.value;
            const notes = form.querySelector('[name="notes"]')?.value;

            if (factwiseId) params.factwise_contract_id = factwiseId;
            if (erpId) params.ERP_contract_id = erpId;
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
            // Build headers with API key authentication (not bearer token)
            const headers = {
                'Content-Type': 'application/json'
            };

            if (this.currentAccount) {
                if (this.currentAccount.api_id) headers['api-id'] = this.currentAccount.api_id;
                if (this.currentAccount.api_key) headers['x-api-key'] = this.currentAccount.api_key;
                if (this.currentAccount.enterprise_id) headers['enterprise-id'] = this.currentAccount.enterprise_id;
            }

            // Construct URL
            const url = `${env.baseUrl}${operation.endpoint}`;

            console.log('Executing API call:', {
                method: operation.method,
                url: url,
                headers: headers,
                payload: payload
            });

            // Execute API call directly using request method
            const startTime = Date.now();
            const response = await this.apiClient.request({
                method: operation.method,
                url: url,
                headers: headers,
                body: payload
            });
            const executionTime = Date.now() - startTime;

            console.log('API Response:', response);

            // Display response
            this._displayResponse(response, executionTime);
        } catch (error) {
            console.error('API call error:', error);
            this._displayError(error.message);
        }
    }

    _displayResponse(response, executionTime) {
        console.log('Displaying response:', response);

        // Check if there's a network error (status 0 usually means CORS or network issue)
        if (response.status === 0 || response.error) {
            const errorMsg = response.error || 'Network request failed';

            // Check if it's a CORS proxy access issue
            if (this.environmentManager.isCorsProxyEnabled() && (errorMsg.includes('cors-anywhere') || errorMsg.includes('403'))) {
                const detailedMsg = `CORS Proxy Access Required\n\nThe CORS proxy needs temporary access to be enabled.\n\nSteps:\n1. Visit: https://cors-anywhere.herokuapp.com/corsdemo\n2. Click "Request temporary access to the demo server"\n3. Return here and try your request again\n\nAlternatively, use the generated cURL command in Postman or your terminal (works without CORS restrictions).`;
                this._displayError(detailedMsg);
            } else if (response.status === 0) {
                const detailedMsg = `${errorMsg}\n\nThis is a CORS (Cross-Origin Resource Sharing) issue. The API server doesn't allow requests from your browser.\n\nSolutions:\n1. Use the generated cURL command in Postman or terminal (recommended)\n2. Enable CORS proxy: Visit https://cors-anywhere.herokuapp.com/corsdemo\n3. Ask the API team to enable CORS for your domain`;
                this._displayError(detailedMsg);
            } else {
                this._displayError(errorMsg);
            }
            return;
        }

        const statusClass = response.status >= 200 && response.status < 300 ? 'success' :
            response.status >= 300 && response.status < 400 ? 'warning' : 'error';

        // Populate the response meta bar (status badge + timing)
        const responseMeta = document.getElementById('response-meta');
        if (responseMeta) {
            responseMeta.innerHTML = `
                <span class="res-status-badge ${statusClass}">
                    ${response.status} ${response.statusText || ''}
                </span>
                <span class="res-timing-chip">${executionTime}ms</span>
            `;
        }

        // JSON body inside the dark code block
        const bodyToDisplay = response.body || { message: 'No response body' };
        const jsonStr = this._escapeHtml(JSON.stringify(bodyToDisplay, null, 2));
        this.elements.responseDisplay.innerHTML = `<pre><code class="language-json">${jsonStr}</code></pre>`;
    }

    _displayError(message) {
        console.error('Displaying error:', message);

        this.elements.actionsSection.classList.remove('hidden');
        this.elements.responseSection.classList.remove('hidden');

        // Show error badge in the meta bar
        const responseMeta = document.getElementById('response-meta');
        if (responseMeta) {
            responseMeta.innerHTML = `<span class="res-status-badge error">Error</span>`;
        }

        // Show styled error box inside the panel (light area, not dark code block)
        this.elements.responseDisplay.innerHTML = `
            <div class="res-error-box">
                <strong>Request Failed</strong>
                <p>${this._escapeHtml(message)}</p>
                <p style="margin-top: 10px; font-size: 12px; color: #64748b;">
                    Check the browser console (F12) for more details.
                </p>
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
        // Use raw base URL for cURL (no CORS proxy needed in terminal/Postman)
        const baseUrl = this.environmentManager.getRawBaseUrl();
        const url = `${baseUrl}${operation.endpoint}`;
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

        if (!this.currentAccount && accounts.length > 0) {
            this.currentAccount = accounts[0];
        }

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


    async _loadTemplates() {
        try {
            // Get token - same logic as item validator
            let token = this.factwiseIntegration?.getToken() || this.tokenManager.getToken();

            if (!token) {
                console.error('No token available for templates API');
                const select = document.getElementById('template_name_select');
                if (select) {
                    select.innerHTML = '<option value="Default Template">Default Template</option>';
                }
                return;
            }

            let entityId = '20d11e41-5ee0-40f1-9f01-a619d20e74e3'; // Default

            // Try to extract from token
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                entityId = payload.entity_id || payload['custom:entityId'] || entityId;
            } catch (e) {
                console.warn('Could not parse token for entity_id');
            }

            const baseUrl = this.environmentManager.getFactwiseBaseUrl();
            const url = `${baseUrl}module_templates/?entity_id=${entityId}&template_type=CLM`;

            console.log('✓ Fetching templates from:', url);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                console.error('Failed to fetch templates:', response.status, response.statusText);
                const select = document.getElementById('template_name_select');
                if (select) {
                    select.innerHTML = '<option value="Default Template">Default Template</option>';
                }
                return;
            }

            const data = await response.json();
            console.log('✓ Loaded templates response:', data);

            // API returns an array with one object containing templates
            const responseData = Array.isArray(data) ? data[0] : data;
            const templates = responseData.templates || [];
            console.log('✓ Templates array:', templates);
            console.log('✓ First template structure:', templates[0]);

            // Populate dropdown
            const select = document.getElementById('template_name_select');
            if (select && templates && templates.length > 0) {
                select.innerHTML = templates.map(t => {
                    // Use name field from API response
                    const name = t.name || t.template_name || 'Unnamed Template';
                    const value = t.name || t.template_name || t.template_id;
                    return `<option value="${value}">${name}</option>`;
                }).join('');
                select.selectedIndex = 0;
                console.log('✓ Populated dropdown with', templates.length, 'templates');
            } else if (select) {
                select.innerHTML = '<option value="Default Template">Default Template</option>';
            }

        } catch (error) {
            console.error('Error loading templates:', error);
            const select = document.getElementById('template_name_select');
            if (select) {
                select.innerHTML = '<option value="Default Template">Default Template</option>';
            }
        }
    }

}
