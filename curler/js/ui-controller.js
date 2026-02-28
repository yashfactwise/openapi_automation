/**
 * UI Controller - Coordinates UI updates and user interactions
 * REFACTORED: Vertical Layout + Dashboard + Sticky Footer
 */

class UIController {
    constructor(environmentManager, accountStore, tokenManager, moduleRegistry, payloadBuilder, curlGenerator, apiClient, itemValidator, itemValidationUI, factwiseIntegration, templateManager) {
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
        this.templateManager = templateManager;

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
            btnGenerateScript: document.getElementById('btn-generate-script'),
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
        if (this.elements.btnGenerateScript) this.elements.btnGenerateScript.addEventListener('click', () => this.handleGenerateScript());
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
            // Ensure sidebar group is expanded
            const moduleGroup = sidebarItem.closest('.module-group');
            if (moduleGroup) {
                moduleGroup.classList.remove('collapsed');
            }
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
                    <input type="text" name="contract_name" class="input-field" required value="TestAPI 220126">
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>ERP Contract ID</label>
                        <input type="text" name="ERP_contract_id" class="input-field" value="ERPTEST22">
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
                            <option value="DRAFT">DRAFT - Contract is in draft state</option>
                            <option value="SUBMITTED">SUBMITTED - Contract is in submitted state</option>
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
                        <input type="email" name="buyer_contact" class="input-field" required value="${this.currentAccount?.user_email || 'globalfieldsETE@gmail.com'}">
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
                    <input type="email" name="vendor_contact" class="input-field" required value="dimple@factwise.io">
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Vendor Identification Name *</label>
                        <input type="text" name="vendor_identification_name" class="input-field" required value="Precision Tools Corp.">
                    </div>
                    <div class="form-group">
                        <label>Vendor Identification Value *</label>
                        <input type="text" name="vendor_identification_value" class="input-field" required value="901234567">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Vendor Address ID</label>
                        <input type="text" name="vendor_address_id" class="input-field">
                    </div>
                    <div class="form-group">
                        <label>Vendor Full Address</label>
                        <input type="text" name="vendor_full_address" class="input-field" value="432 Tool Ave, Chicago">
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
                        <input type="text" name="project" class="input-field" value="P000039">
                    </div>
                    <div class="form-group">
                        <label>Prepayment %</label>
                        <input type="number" name="prepayment_percentage" class="input-field" value="0" min="0" max="100" step="0.01">
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
                            <option value="DRAFT">DRAFT - Contract is in draft state</option>
                            <option value="SUBMITTED">SUBMITTED - Contract is in submitted state</option>
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
        } else if (module.id === 'items' && operation.id === 'bulk_create') {
            bodyInputsHtml = `
                <!-- ① Shared Config -->
                <div class="cc-config-box">
                    <p class="cc-config-box-title">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                        Shared Configuration
                    </p>
                    <div class="cc-config-panel" style="border-left: none;">
                    <!-- Top row: email + entity + count -->
                    <div class="form-row">
                        <div class="form-group">
                            <label>Created By Email *</label>
                            <input type="email" name="bi_created_by" class="input-field" required
                                value="${this.currentAccount?.user_email || 'globalfieldsETE@gmail.com'}">
                        </div>
                        <div class="form-group">
                            <label>Entity Name *</label>
                            <input type="text" name="bi_entity_name" class="input-field" required value="FactWise">
                        </div>
                        <div class="form-group" style="max-width:120px;">
                            <label>No. of Items</label>
                            <input type="number" name="bi_item_count" class="input-field" value="1" min="1" max="500"
                                style="text-align:center;">
                        </div>
                        <div class="form-group" style="align-self:flex-end;">
                            <button type="button"
                                onclick="window.uiController._generateBulkItemCards()"
                                style="width:100%; padding:9px 14px; background:#6366f1; color:white; border:none; border-radius:5px; cursor:pointer; font-weight:500; font-size:13px;">
                                &#9889; Generate Items
                            </button>
                        </div>
                    </div>

                    <!-- Section toggles -->
                    <div style="margin-top:12px; padding-top:12px; border-top:1px solid #e2e8f0;">
                        <p style="margin:0 0 8px; font-size:11px; font-weight:600; color:#64748b; text-transform:uppercase; letter-spacing:0.5px;">Include Sections (toggle off to hide fields &amp; send null in payload)</p>
                        <div class="cc-toggles-grid">
                            <label class="cc-toggle-row">
                                <span class="cc-toggle-switch">
                                    <input type="checkbox" id="bi-global-buyer" checked
                                        onchange="window.uiController._updateBulkItemSections()">
                                    <span class="cc-toggle-slider"></span>
                                </span>
                                <span class="cc-toggle-text">Buyer Pricing</span>
                            </label>
                            <label class="cc-toggle-row">
                                <span class="cc-toggle-switch">
                                    <input type="checkbox" id="bi-global-seller" checked
                                        onchange="window.uiController._updateBulkItemSections()">
                                    <span class="cc-toggle-slider"></span>
                                </span>
                                <span class="cc-toggle-text">Seller Pricing</span>
                            </label>
                            <label class="cc-toggle-row">
                                <span class="cc-toggle-switch">
                                    <input type="checkbox" id="bi-global-tags" checked
                                        onchange="window.uiController._updateBulkItemSections()">
                                    <span class="cc-toggle-slider"></span>
                                </span>
                                <span class="cc-toggle-text">Tags</span>
                            </label>
                            <label class="cc-toggle-row">
                                <span class="cc-toggle-switch">
                                    <input type="checkbox" id="bi-global-attributes"
                                        onchange="window.uiController._updateBulkItemSections()">
                                    <span class="cc-toggle-slider"></span>
                                </span>
                                <span class="cc-toggle-text">Attributes</span>
                            </label>
                            <label class="cc-toggle-row">
                                <span class="cc-toggle-switch">
                                    <input type="checkbox" id="bi-global-hsn" checked
                                        onchange="window.uiController._updateBulkItemSections()">
                                    <span class="cc-toggle-slider"></span>
                                </span>
                                <span class="cc-toggle-text">HSN / Custom IDs</span>
                            </label>
                            <label class="cc-toggle-row">
                                <span class="cc-toggle-switch">
                                    <input type="checkbox" id="bi-global-vendor" checked
                                        onchange="window.uiController._updateBulkItemSections()">
                                    <span class="cc-toggle-slider"></span>
                                </span>
                                <span class="cc-toggle-text">Preferred Vendor</span>
                            </label>
                        </div>
                    </div>
                    </div>
                </div>

                <!-- ② Items Header -->
                <div style="display:flex; align-items:center; justify-content:space-between; margin: 20px 0 10px 0; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">
                    <h4 style="margin:0; color:#334155;">&#x1F4E6; Items <span id="bulk-item-count" style="font-size:13px;font-weight:400;color:#64748b;"></span></h4>
                    <button type="button" onclick="window.uiController._addBulkItem()"
                        style="font-size:13px; padding:6px 14px; background:#3b82f6; color:white; border:none; border-radius:5px; cursor:pointer; font-weight:500;">
                        + Add Item
                    </button>
                </div>

                <!-- ③ Item Cards -->
                <div id="bulk-items-container"></div>
            `;

        } else if (module.id === 'vendors' && operation.id === 'contacts_create') {
            bodyInputsHtml = `
                <!-- ① Basic Information -->
                <div class="form-section-title no-margin-top">
                    <span class="fst-icon">👤</span>
                    <h4>Contact Information</h4>
                    <span class="fst-badge">Required</span>
                </div>

                <div class="form-group">
                    <label>Created By User Email *</label>
                    <input type="email" name="created_by_user_email" class="input-field" required
                        value="${this.currentAccount?.user_email || 'admin@example.com'}">
                    <small style="color: #64748b; font-size: 11px;">Must be an admin user in the enterprise</small>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Full Name *</label>
                        <input type="text" name="full_name" class="input-field" required placeholder="e.g., John Doe">
                    </div>
                    <div class="form-group">
                        <label>Primary Email *</label>
                        <input type="email" name="primary_email" class="input-field" required placeholder="e.g., john@vendor.com">
                    </div>
                </div>

                <div class="form-group">
                    <label>Entity Name *</label>
                    <input type="text" name="entity_name" class="input-field" required placeholder="e.g., FactWise Demo" value="FactWise Demo">
                    <small style="color: #64748b; font-size: 11px;">Entity must exist in the enterprise</small>
                </div>

                <!-- ② Vendor Identification -->
                <div class="form-section-title">
                    <span class="fst-icon">🏢</span>
                    <h4>Vendor Identification</h4>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>ERP Vendor Code</label>
                        <input type="text" name="ERP_vendor_code" class="input-field" placeholder="e.g., MDvendorcreate7">
                        <small style="color: #64748b; font-size: 11px;">Either ERP or Factwise code required</small>
                    </div>
                    <div class="form-group">
                        <label>Factwise Vendor Code</label>
                        <input type="text" name="factwise_vendor_code" class="input-field" placeholder="e.g., FacVENDOR120620240416">
                        <small style="color: #64748b; font-size: 11px;">Either ERP or Factwise code required</small>
                    </div>
                </div>

                <!-- ③ Additional Contact Details -->
                <div class="form-section-title">
                    <span class="fst-icon">📞</span>
                    <h4>Additional Contact Details</h4>
                    <span class="fst-badge" style="background: #94a3b8;">Optional</span>
                </div>

                <div class="form-group">
                    <label>Phone Numbers (comma-separated)</label>
                    <input type="text" name="phone_numbers" class="input-field" placeholder="e.g., 1234567890, 9876543210">
                    <small style="color: #64748b; font-size: 11px;">Max 12 characters per phone number</small>
                </div>

                <!-- ④ Additional Emails -->
                <div class="form-section-title">
                    <span class="fst-icon">📧</span>
                    <h4>Additional Emails</h4>
                    <span class="fst-badge" style="background: #94a3b8;">Optional</span>
                </div>

                <div id="additional-emails-container"></div>
                <button type="button" class="btn-add-row" onclick="window.uiController._addVendorContactEmail()">＋ Add Email</button>
            `;
        } else if (module.id === 'vendors' && operation.id === 'contacts_update') {
            bodyInputsHtml = `
                <!-- ① Basic Information -->
                <div class="form-section-title no-margin-top">
                    <span class="fst-icon">👤</span>
                    <h4>Contact Information</h4>
                    <span class="fst-badge">Required</span>
                </div>

                <div class="form-group">
                    <label>Modified By User Email *</label>
                    <input type="email" name="modified_by_user_email" class="input-field" required
                        value="${this.currentAccount?.user_email || 'admin@example.com'}">
                    <small style="color: #64748b; font-size: 11px;">Must be an admin user in the enterprise</small>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Full Name *</label>
                        <input type="text" name="full_name" class="input-field" required placeholder="e.g., John Doe" value="ZOsari">
                    </div>
                    <div class="form-group">
                        <label>Primary Email *</label>
                        <input type="email" name="primary_email" class="input-field" required placeholder="e.g., john@vendor.com" value="za@fw.com">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Entity Name *</label>
                        <input type="text" name="entity_name" class="input-field" required placeholder="e.g., FactWise Demo" value="FactWise Demo - EMS">
                        <small style="color: #64748b; font-size: 11px;">Entity must exist in the enterprise</small>
                    </div>
                    <div class="form-group">
                        <label>Is Primary Contact *</label>
                        <select name="is_primary" class="input-field" required>
                            <option value="true" selected>Yes</option>
                            <option value="false">No</option>
                        </select>
                        <small style="color: #64748b; font-size: 11px;">Whether this is the primary contact</small>
                    </div>
                </div>

                <!-- ② Vendor Identification -->
                <div class="form-section-title">
                    <span class="fst-icon">🏢</span>
                    <h4>Vendor Identification</h4>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>ERP Vendor Code</label>
                        <input type="text" name="ERP_vendor_code" class="input-field" placeholder="e.g., MDvendorcreate7" value="MDvendorcreate7">
                        <small style="color: #64748b; font-size: 11px;">Either ERP or Factwise code required</small>
                    </div>
                    <div class="form-group">
                        <label>Factwise Vendor Code</label>
                        <input type="text" name="factwise_vendor_code" class="input-field" placeholder="e.g., FacVENDOR120620240416" value="FacVENDOR120620240416">
                        <small style="color: #64748b; font-size: 11px;">Either ERP or Factwise code required</small>
                    </div>
                </div>

                <!-- ③ Additional Contact Details -->
                <div class="form-section-title">
                    <span class="fst-icon">📞</span>
                    <h4>Additional Contact Details</h4>
                    <span class="fst-badge" style="background: #94a3b8;">Optional</span>
                </div>

                <div class="form-group">
                    <label>Phone Numbers (comma-separated)</label>
                    <input type="text" name="phone_numbers" class="input-field" placeholder="e.g., 1234567890, 9876543210" value="9819186167">
                    <small style="color: #64748b; font-size: 11px;">Max 12 characters per phone number</small>
                </div>

                <!-- ④ Additional Emails -->
                <div class="form-section-title">
                    <span class="fst-icon">📧</span>
                    <h4>Additional Emails</h4>
                    <span class="fst-badge" style="background: #94a3b8;">Optional</span>
                </div>

                <div id="additional-emails-container-update"></div>
                <button type="button" class="btn-add-row" onclick="window.uiController._addVendorContactEmailUpdate()">＋ Add Email</button>
            `;
        } else if (module.id === 'vendors' && operation.id === 'contacts_delete') {
            bodyInputsHtml = `
                <!-- ① Basic Information -->
                <div class="form-section-title no-margin-top">
                    <span class="fst-icon">🗑️</span>
                    <h4>Delete Contact Information</h4>
                    <span class="fst-badge" style="background: #ef4444;">Delete</span>
                </div>

                <div class="form-group">
                    <label>Deleted By User Email *</label>
                    <input type="email" name="deleted_by_user_email" class="input-field" required
                        value="${this.currentAccount?.user_email || 'admin@example.com'}">
                    <small style="color: #64748b; font-size: 11px;">Must be an admin user in the enterprise</small>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Primary Email *</label>
                        <input type="email" name="primary_email" class="input-field" required placeholder="e.g., contact@vendor.com" value="zaa@fw.com">
                        <small style="color: #64748b; font-size: 11px;">Email of the contact to delete</small>
                    </div>
                    <div class="form-group">
                        <label>Entity Name *</label>
                        <input type="text" name="entity_name" class="input-field" required placeholder="e.g., FactWise Demo" value="FactWise Demo">
                        <small style="color: #64748b; font-size: 11px;">Entity must exist in the enterprise</small>
                    </div>
                </div>

                <!-- ② Vendor Identification -->
                <div class="form-section-title">
                    <span class="fst-icon">🏢</span>
                    <h4>Vendor Identification</h4>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>ERP Vendor Code</label>
                        <input type="text" name="ERP_vendor_code" class="input-field" placeholder="e.g., MDvendorcreate7" value="MDvendorcreate7">
                        <small style="color: #64748b; font-size: 11px;">Either ERP or Factwise code required</small>
                    </div>
                    <div class="form-group">
                        <label>Factwise Vendor Code</label>
                        <input type="text" name="factwise_vendor_code" class="input-field" placeholder="e.g., FacVENDOR120620240416" value="FacVENDOR120620240416">
                        <small style="color: #64748b; font-size: 11px;">Either ERP or Factwise code required</small>
                    </div>
                </div>

                <!-- Warning Message -->
                <div style="margin-top: 20px; padding: 15px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px;">
                    <div style="display: flex; align-items: center; gap: 10px; color: #991b1b;">
                        <span style="font-size: 20px;">⚠️</span>
                        <div>
                            <strong>Warning: This action cannot be undone</strong>
                            <p style="margin: 5px 0 0 0; font-size: 13px; color: #dc2626;">
                                Deleting a vendor contact will permanently remove it from the system. Make sure you have the correct contact information before proceeding.
                            </p>
                        </div>
                    </div>
                </div>
            `;
        } else if (module.id === 'vendors' && operation.id === 'state') {
            bodyInputsHtml = `
                <!-- ① Vendor Identification -->
                <div class="form-section-title no-margin-top">
                    <span class="fst-icon">🔍</span>
                    <h4>Vendor Identification</h4>
                    <span class="fst-badge">Required</span>
                </div>

                <div class="form-group">
                    <label>Modified By User Email *</label>
                    <input type="email" name="modified_by_user_email" class="input-field" required
                        value="${this.currentAccount?.user_email || 'globalfieldsETE@gmail.com'}">
                    <small style="color: #64748b; font-size: 11px;">Must be an admin user in the enterprise</small>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>ERP Vendor Code</label>
                        <input type="text" name="ERP_vendor_code" class="input-field" placeholder="e.g., MDvendorcreate7" value="MDvendorcreate7">
                        <small style="color: #64748b; font-size: 11px;">Either ERP or Factwise code required</small>
                    </div>
                    <div class="form-group">
                        <label>Factwise Vendor Code</label>
                        <input type="text" name="factwise_vendor_code" class="input-field" placeholder="e.g., FacVENDOR120620240416" value="FacVENDOR120620240416">
                        <small style="color: #64748b; font-size: 11px;">Either ERP or Factwise code required</small>
                    </div>
                </div>

                <!-- ② Status Update -->
                <div class="form-section-title">
                    <span class="fst-icon">📊</span>
                    <h4>Status Update</h4>
                </div>

                <div class="form-group">
                    <label>Status *</label>
                    <select name="status" class="input-field" required>
                        <option value="">Select Status...</option>
                        <option value="INVITED">INVITED - Vendor has been invited to the platform</option>
                        <option value="PENDING">PENDING - Vendor registration is pending</option>
                        <option value="ACTIVE" selected>ACTIVE - Vendor is active and can participate in transactions</option>
                        <option value="INACTIVE">INACTIVE - Vendor is inactive and cannot participate</option>
                        <option value="APPROVED">APPROVED - Vendor has been approved by the enterprise</option>
                        <option value="REJECTED">REJECTED - Vendor has been rejected by the enterprise</option>
                    </select>
                    <small style="color: #64748b; font-size: 11px;">Select the new status for the vendor</small>
                </div>

                <!-- Info Box -->
                <div style="margin-top: 20px; padding: 15px; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px;">
                    <div style="display: flex; align-items: center; gap: 10px; color: #1e40af;">
                        <span style="font-size: 20px;">ℹ️</span>
                        <div>
                            <strong>Status Information</strong>
                            <p style="margin: 5px 0 0 0; font-size: 13px; color: #1e3a8a;">
                                Changing vendor status will affect their ability to participate in transactions and receive orders.
                            </p>
                        </div>
                    </div>
                </div>
            `;
        } else if (module.id === 'vendors' && operation.id === 'create') {
            bodyInputsHtml = `
                <!-- ① Basic Information -->
                <div class="form-section-title no-margin-top">
                    <span class="fst-icon">🏢</span>
                    <h4>Vendor Information</h4>
                    <span class="fst-badge">Required</span>
                </div>

                <div class="form-group">
                    <label>Created By User Email *</label>
                    <input type="email" name="created_by_user_email" class="input-field" required
                        value="${this.currentAccount?.user_email || 'globalfieldsETE@gmail.com'}">
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Vendor Name *</label>
                        <input type="text" name="vendor_name" class="input-field" required placeholder="e.g., API Test Vendor" value="API Test Vendor">
                    </div>
                    <div class="form-group">
                        <label>ERP Vendor Code *</label>
                        <input type="text" name="ERP_vendor_code" class="input-field" required placeholder="e.g., ERPV01" value="ERPV01">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Notes</label>
                        <input type="text" name="notes" class="input-field" placeholder="Optional notes" value="this is notes">
                    </div>
                    <div class="form-group">
                        <label>Tags (comma-separated)</label>
                        <input type="text" name="tags" class="input-field" placeholder="e.g., Test, Supplier" value="Test">
                    </div>
                </div>

                <!-- ② Primary Contact -->
                <div class="form-section-title">
                    <span class="fst-icon">👤</span>
                    <h4>Primary Contact</h4>
                    <span class="fst-badge">Required</span>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Full Name *</label>
                        <input type="text" name="primary_full_name" class="input-field" required value="Ashir Ansari">
                    </div>
                    <div class="form-group">
                        <label>Primary Email *</label>
                        <input type="email" name="primary_email" class="input-field" required value="ashir@factwise.io">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Phone Numbers (comma-separated)</label>
                        <input type="text" name="primary_phone_numbers" class="input-field" value="8928219571">
                    </div>
                    <div class="form-group">
                        <label>Email Type</label>
                        <select name="primary_email_type" class="input-field">
                            <option value="TO">TO</option>
                            <option value="CC" selected>CC</option>
                            <option value="BCC">BCC</option>
                        </select>
                    </div>
                </div>

                <!-- ③ Seller Information -->
                <div class="form-section-title">
                    <span class="fst-icon">📍</span>
                    <h4>Seller Information</h4>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Address Information (comma-separated)</label>
                        <input type="text" name="seller_address_information" class="input-field" value="Mumbai">
                    </div>
                    <div class="form-group">
                        <label>Identification Name</label>
                        <input type="text" name="identification_name" class="input-field" value="Name">
                    </div>
                </div>

                <div class="form-group">
                    <label>Identification Value</label>
                    <input type="text" name="identification_value" class="input-field" value="a50">
                </div>

                <!-- ④ Entities -->
                <div class="form-section-title">
                    <span class="fst-icon">🏭</span>
                    <h4>Entities</h4>
                    <span class="fst-badge">Required</span>
                </div>

                <div class="form-group">
                    <label>Entity Names (comma-separated) *</label>
                    <input type="text" name="entity_names" class="input-field" required value="Global fields ETE">
                    <small style="color: #64748b; font-size: 11px;">Entities must exist in the enterprise</small>
                </div>

                <!-- ⑤ Custom Fields from Template -->
                <div id="vendor-custom-fields-container"></div>

                <!-- ⑥ Additional Costs -->
                <div class="form-section-title">
                    <span class="fst-icon">💰</span>
                    <h4>Additional Costs</h4>
                    <span class="fst-badge" style="background: #94a3b8;">Optional</span>
                </div>

                <div id="vendor-costs-container"></div>
                <button type="button" class="btn-add-row" onclick="window.uiController._addVendorCost()">＋ Add Cost</button>

                <!-- ⑦ Secondary Contacts -->
                <div class="form-section-title">
                    <span class="fst-icon">👥</span>
                    <h4>Secondary Contacts</h4>
                    <span class="fst-badge" style="background: #94a3b8;">Optional</span>
                </div>

                <div id="vendor-secondary-contacts-container"></div>
                <button type="button" class="btn-add-row" onclick="window.uiController._addVendorSecondaryContact()">＋ Add Secondary Contact</button>

                <!-- ⑧ Custom Sections -->
                <div class="form-section-title">
                    <span class="fst-icon">🔧</span>
                    <h4>Custom Sections</h4>
                    <span class="fst-badge" style="background: #94a3b8;">Optional</span>
                </div>

                <div id="vendor-custom-sections-container"></div>
                <button type="button" class="btn-add-row" onclick="window.uiController._addVendorCustomSection()">＋ Add Custom Section</button>
            `;
        } else if (module.id === 'items' && operation.id === 'update_state') {
            bodyInputsHtml = `
                <!-- ① Item Identification -->
                <div class="form-section-title no-margin-top">
                    <span class="fst-icon">🔍</span>
                    <h4>Item Identification</h4>
                    <span class="fst-badge">Required</span>
                </div>

                <div class="form-group">
                    <label>Modified By User Email *</label>
                    <input type="email" name="modified_by_user_email" class="input-field" required
                        value="${this.currentAccount?.user_email || 'globalfieldsETE@gmail.com'}">
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>ERP Item Code</label>
                        <input type="text" name="ERP_item_code" class="input-field" placeholder="e.g., ERP1234567" value="ERP1234567">
                        <small style="color: #64748b; font-size: 11px;">Either ERP or Factwise code required</small>
                    </div>
                    <div class="form-group">
                        <label>Factwise Item Code</label>
                        <input type="text" name="factwise_item_code" class="input-field" placeholder="e.g., ITEM001">
                        <small style="color: #64748b; font-size: 11px;">Either ERP or Factwise code required</small>
                    </div>
                </div>

                <!-- ② Status Update -->
                <div class="form-section-title">
                    <span class="fst-icon">📊</span>
                    <h4>Status Update</h4>
                </div>

                <div class="form-group">
                    <label>Status *</label>
                    <select name="status" class="input-field" required>
                        <option value="">Select Status...</option>
                        <option value="ACTIVE" selected>ACTIVE - Item is active and available</option>
                        <option value="INACTIVE">INACTIVE - Item is inactive and unavailable</option>
                    </select>
                    <small style="color: #64748b; font-size: 11px;">Select the new status for the item</small>
                </div>

                <!-- Info Box -->
                <div style="margin-top: 20px; padding: 15px; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px;">
                    <div style="display: flex; align-items: center; gap: 10px; color: #1e40af;">
                        <span style="font-size: 20px;">ℹ️</span>
                        <div>
                            <strong>Status Information</strong>
                            <p style="margin: 5px 0 0 0; font-size: 13px; color: #1e3a8a;">
                                Changing item status will affect its availability in the system and for transactions.
                            </p>
                        </div>
                    </div>
                </div>
            `;
        } else if (module.id === 'items' && operation.id === 'create') {
            bodyInputsHtml = `
                <!-- ① Basic Information -->
                <div class="form-section-title no-margin-top">
                    <span class="fst-icon">📦</span>
                    <h4>Item Information</h4>
                    <span class="fst-badge">Required</span>
                </div>

                <div class="form-group">
                    <label>Created By User Email *</label>
                    <input type="email" name="created_by_user_email" class="input-field" required
                        value="${this.currentAccount?.user_email || 'globalfieldsETE@gmail.com'}">
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Item Name *</label>
                        <input type="text" name="name" class="input-field" required value="Natural Rubber - TSNR - TSR10">
                    </div>
                    <div class="form-group">
                        <label>ERP Item Code</label>
                        <input type="text" name="ERP_item_code" class="input-field" value="ERP-BKT-01111">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Factwise Item Code</label>
                        <input type="text" name="factwise_item_code" class="input-field" value="PIR_00000000001100000122">
                    </div>
                    <div class="form-group">
                        <label>Measurement Unit ID *</label>
                        <input type="text" name="measurement_units" class="input-field" required value="f16d124e-db59-48fe-a2b8-19f625745cbf">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Item Type *</label>
                        <select name="item_type" class="input-field" required>
                            <option value="RAW_MATERIAL" selected>RAW_MATERIAL</option>
                            <option value="FINISHED_GOODS">FINISHED_GOODS</option>
                            <option value="SEMI_FINISHED_GOODS">SEMI_FINISHED_GOODS</option>
                            <option value="CONSUMABLES">CONSUMABLES</option>
                            <option value="SERVICES">SERVICES</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Status *</label>
                        <select name="status" class="input-field" required>
                            <option value="ACTIVE" selected>ACTIVE - Item is active and available</option>
                            <option value="INACTIVE">INACTIVE - Item is inactive and unavailable</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label>Description</label>
                    <textarea name="description" class="form-textarea" rows="2"></textarea>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Notes</label>
                        <input type="text" name="notes" class="input-field">
                    </div>
                    <div class="form-group">
                        <label>Internal Notes</label>
                        <input type="text" name="internal_notes" class="input-field">
                    </div>
                </div>

                <!-- ② Pricing -->
                <div class="form-section-title">
                    <span class="fst-icon">💰</span>
                    <h4>Pricing Information</h4>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label style="display: flex; align-items: center; gap: 8px;">
                            <input type="checkbox" name="is_buyer" value="true" checked>
                            <span>Is Buyer</span>
                        </label>
                    </div>
                    <div class="form-group">
                        <label style="display: flex; align-items: center; gap: 8px;">
                            <input type="checkbox" name="is_seller" value="true">
                            <span>Is Seller</span>
                        </label>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Buyer Price</label>
                        <input type="number" name="buyer_price" class="input-field" step="0.01" value="78">
                    </div>
                    <div class="form-group">
                        <label>Buyer Currency ID</label>
                        <input type="text" name="buyer_currency_code_id" class="input-field" value="a8c3e3fd-b05f-4d09-bd2f-9fedd07d0ec3">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Seller Price</label>
                        <input type="number" name="seller_price" class="input-field" step="0.01" value="170">
                    </div>
                    <div class="form-group">
                        <label>Seller Currency ID</label>
                        <input type="text" name="seller_currency_code_id" class="input-field" value="a8c3e3fd-b05f-4d09-bd2f-9fedd07d0ec3">
                    </div>
                </div>

                <!-- ③ Additional Information -->
                <div class="form-section-title">
                    <span class="fst-icon">🏷️</span>
                    <h4>Additional Information</h4>
                </div>

                <div class="form-group">
                    <label>Tags (comma-separated)</label>
                    <input type="text" name="tags" class="input-field" value="Project EcoConscious">
                </div>

                <div class="form-group">
                    <label>HSN Code</label>
                    <input type="text" name="hsn_code" class="input-field" value="40012200">
                </div>

                <!-- ④ Entities -->
                <div class="form-section-title">
                    <span class="fst-icon">🏭</span>
                    <h4>Entities</h4>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Entity Name *</label>
                        <input type="text" name="entity_name" class="input-field" required value="FactWise">
                    </div>
                    <div class="form-group">
                        <label>Preferred Vendors (comma-separated)</label>
                        <input type="text" name="preferred_vendors" class="input-field" value="V0003">
                    </div>
                </div>

                <!-- ⑤ Attributes -->
                <div class="form-section-title">
                    <span class="fst-icon">📋</span>
                    <h4>Attributes</h4>
                    <span class="fst-badge" style="background: #94a3b8;">Optional</span>
                </div>

                <div id="item-attributes-container"></div>
                <button type="button" class="btn-add-row" onclick="window.uiController._addItemAttribute()">＋ Add Attribute</button>

                <!-- ⑥ Custom Fields from Template -->
                <div id="item-create-custom-fields-container"></div>
            `;
        } else if (module.id === 'projects' && operation.id === 'create') {
            bodyInputsHtml = `
                <!-- ① Basic Information -->
                <div class="form-section-title no-margin-top">
                    <span class="fst-icon">📋</span>
                    <h4>Project Information</h4>
                    <span class="fst-badge">Required</span>
                </div>

                <div class="form-group">
                    <label>Created By User Email *</label>
                    <input type="email" name="created_by_user_email" class="input-field" required
                        value="${this.currentAccount?.user_email || 'globalfieldsETE@gmail.com'}">
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Project Name *</label>
                        <input type="text" name="project_name" class="input-field" required value="API Test Project">
                    </div>
                    <div class="form-group">
                        <label>Entity Name *</label>
                        <input type="text" name="entity_name" class="input-field" required value="FactWise">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Project Code</label>
                        <input type="text" name="project_code" class="input-field" placeholder="Internal project code">
                    </div>
                    <div class="form-group">
                        <label>ERP Project Code</label>
                        <input type="text" name="ERP_project_code" class="input-field" value="ERP9701">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Customer Code</label>
                        <input type="text" name="customer_code" class="input-field" value="CXJKU05">
                    </div>
                    <div class="form-group">
                        <label>Template Name</label>
                        <input type="text" name="template_name" class="input-field" value="API Test">
                    </div>
                </div>

                <div class="form-group">
                    <label>Project Status *</label>
                    <select name="project_status" class="input-field" required>
                        <option value="">Select Status...</option>
                        <option value="DRAFT" selected>DRAFT - Project is in draft state</option>
                        <option value="SUBMITTED">SUBMITTED - Project has been submitted</option>
                        <option value="EXPIRED">EXPIRED - Project has expired</option>
                    </select>
                </div>

                <!-- ② Dates -->
                <div class="form-section-title">
                    <span class="fst-icon">📅</span>
                    <h4>Project Timeline</h4>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Validity From</label>
                        <input type="datetime-local" name="validity_from" class="input-field">
                    </div>
                    <div class="form-group">
                        <label>Validity To</label>
                        <input type="datetime-local" name="validity_to" class="input-field">
                    </div>
                </div>

                <!-- ③ Additional Information -->
                <div class="form-section-title">
                    <span class="fst-icon">📝</span>
                    <h4>Additional Information</h4>
                </div>

                <div class="form-group">
                    <label>Description</label>
                    <textarea name="description" class="form-textarea" rows="3" placeholder="Project description"></textarea>
                </div>

                <div class="form-group">
                    <label>Internal Notes</label>
                    <textarea name="internal_notes" class="form-textarea" rows="3" placeholder="Internal notes (not visible to vendors)"></textarea>
                </div>

                <!-- ④ Custom Fields from Template -->
                <div id="project-create-custom-fields-container"></div>
            `;
        } else if (module.id === 'projects' && operation.id === 'bulk_create') {
            bodyInputsHtml = `
                <!-- Project Bulk Create Form -->
                <div class="form-section-title no-margin-top">
                    <span class="fst-icon">📋</span>
                    <h4>Bulk Project Configuration</h4>
                    <span class="fst-badge">Required</span>
                </div>

                <div class="form-group">
                    <label>Created By User Email *</label>
                    <input type="email" name="bp_created_by" class="input-field" required
                        value="${this.currentAccount?.user_email || 'globalfieldsETE@gmail.com'}">
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Entity Name *</label>
                        <input type="text" name="bp_entity_name" class="input-field" required value="FactWise">
                    </div>
                    <div class="form-group">
                        <label>Number of Projects *</label>
                        <input type="number" name="bp_project_count" class="input-field" required min="1" max="100" value="2">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Template Name</label>
                        <input type="text" name="bp_template_name" class="input-field" value="API Test">
                    </div>
                    <div class="form-group">
                        <label>Project Status *</label>
                        <select name="bp_project_status" class="input-field" required>
                            <option value="DRAFT" selected>DRAFT - Project is in draft state</option>
                            <option value="SUBMITTED">SUBMITTED - Project has been submitted</option>
                            <option value="EXPIRED">EXPIRED - Project has expired</option>
                        </select>
                    </div>
                </div>

                <!-- Projects Container -->
                <div class="form-section-title">
                    <span class="fst-icon">📦</span>
                    <h4>Projects</h4>
                </div>

                <div id="bulk-projects-container"></div>

                <button type="button" class="btn-add-row" onclick="window.uiController._addBulkProject()" style="margin-top: 12px;">
                    ＋ Add Project
                </button>
            `;
        } else if (module.id === 'purchase_order' && operation.id === 'create') {
            bodyInputsHtml = `
                <!-- Template Selection -->
                <div class="form-section-title no-margin-top">
                    <span class="fst-icon">📋</span>
                    <h4>Template Selection</h4>
                    <span class="fst-badge">Required</span>
                </div>

                <div class="form-group">
                    <label>PO Template *</label>
                    <select id="po_template_select" name="template_name" class="input-field" required>
                        <option value="">Loading templates...</option>
                    </select>
                    <small style="color: #64748b; font-size: 11px;">Select a PO template to load custom fields</small>
                </div>

                <!-- ① PO Details -->
                <div class="form-section-title">
                    <span class="fst-icon">📄</span>
                    <h4>Purchase Order Details</h4>
                    <span class="fst-badge">Required</span>
                </div>

                <div class="form-group">
                    <label>Created By User Email *</label>
                    <input type="email" name="created_by_user_email" class="input-field" required
                        value="${this.currentAccount?.user_email || 'globalfieldsETE@gmail.com'}">
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>ERP PO ID *</label>
                        <input type="text" name="ERP_po_id" class="input-field" required value="E5PPicinF04311">
                    </div>
                    <div class="form-group">
                        <label>Status *</label>
                        <select name="po_status" class="input-field" required>
                            <option value="ISSUED" selected>ISSUED - Purchase Order is issued</option>
                            <option value="ONGOING">ONGOING - Purchase Order is ongoing</option>
                        </select>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Currency Code (UUID) *</label>
                        <input type="text" name="currency_code" class="input-field" required value="a8c3e3fd-b05f-4d09-bd2f-9fedd07d0ec3">
                    </div>
                    <div class="form-group">
                        <label>Issue Date</label>
                        <input type="date" name="issue_date" class="input-field" value="2025-06-26">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Accepted Date</label>
                        <input type="date" name="accepted_date" class="input-field" value="2025-05-27">
                    </div>
                    <div class="form-group">
                        <label>Event</label>
                        <input type="text" name="po_event" class="input-field" placeholder="Event name (optional)">
                    </div>
                </div>

                <div class="form-group">
                    <label>Notes</label>
                    <textarea name="po_notes" class="form-textarea" rows="3" placeholder="Purchase order notes"></textarea>
                </div>

                <!-- ② Buyer Details -->
                <div class="form-section-title">
                    <span class="fst-icon">🏢</span>
                    <h4>Buyer Details</h4>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Entity Name *</label>
                        <input type="text" name="buyer_entity_name" class="input-field" required value="FactWise">
                    </div>
                    <div class="form-group">
                        <label>Billing Address ID *</label>
                        <input type="text" name="buyer_billing_address" class="input-field" required value="Main address">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Shipping Address ID *</label>
                        <input type="text" name="buyer_shipping_address" class="input-field" required value="Main address">
                    </div>
                    <div class="form-group">
                        <label>Identifications (comma-separated)</label>
                        <input type="text" name="buyer_identifications" class="input-field" value="GST" placeholder="GST, PAN, etc.">
                    </div>
                </div>

                <div class="form-group">
                    <label>Contacts (comma-separated)</label>
                    <input type="text" name="buyer_contacts" class="input-field" value="8928219571" placeholder="Phone numbers">
                </div>

                <!-- ③ Seller Details -->
                <div class="form-section-title">
                    <span class="fst-icon">🏭</span>
                    <h4>Seller Details</h4>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>ERP Vendor Code</label>
                        <input type="text" name="seller_erp_vendor_code" class="input-field" value="ERPV002">
                    </div>
                    <div class="form-group">
                        <label>Factwise Vendor Code</label>
                        <input type="text" name="seller_factwise_vendor_code" class="input-field" placeholder="Factwise vendor code">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Seller Address ID</label>
                        <input type="text" name="seller_address_id" class="input-field" placeholder="Address ID">
                    </div>
                    <div class="form-group">
                        <label>Seller Full Address</label>
                        <input type="text" name="seller_full_address" class="input-field" value="Mumbai">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Seller Identifications (comma-separated)</label>
                        <input type="text" name="seller_identifications" class="input-field" value="GST">
                    </div>
                    <div class="form-group">
                        <label>Seller Contacts (comma-separated)</label>
                        <input type="text" name="seller_contacts" class="input-field" value="8928219571">
                    </div>
                </div>

                <!-- Custom Fields from Template -->
                <div id="po-custom-fields-container"></div>

                <!-- ④ PO Items -->
                <div class="form-section-title">
                    <span class="fst-icon">📦</span>
                    <h4>Purchase Order Items</h4>
                </div>

                <div id="po-items-container"></div>

                <button type="button" class="btn-add-row" onclick="window.uiController._addPOItem()">
                    ＋ Add Item
                </button>

                <!-- ⑤ Terms & Conditions -->
                <div class="form-section-title">
                    <span class="fst-icon">📋</span>
                    <h4>Terms & Conditions</h4>
                </div>

                <div class="form-group">
                    <label>T&C Name</label>
                    <input type="text" name="tnc_name" class="input-field" value="FactWise Default TNC">
                </div>

                <div class="form-group">
                    <label>T&C Data (HTML)</label>
                    <textarea name="tnc_data" class="form-textarea" rows="3" placeholder="Terms and conditions HTML"><p>Acceptance of order...</p></textarea>
                </div>
            `;
        } else if (module.id === 'purchase_order' && operation.id === 'terminate') {
            bodyInputsHtml = `
                <!-- PO Terminate Form -->
                <div class="form-section-title no-margin-top">
                    <span class="fst-icon">⚠️</span>
                    <h4>Terminate Purchase Order</h4>
                    <span class="fst-badge" style="background: #ef4444;">Termination</span>
                </div>

                <div class="form-group">
                    <label>Modified By User Email *</label>
                    <input type="email" name="modified_by_user_email" class="input-field" required
                        value="${this.currentAccount?.user_email || 'globalfieldsETE@gmail.com'}">
                </div>

                <!-- PO Identification -->
                <div class="form-section-title">
                    <span class="fst-icon">🔍</span>
                    <h4>PO Identification</h4>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>ERP PO ID</label>
                        <input type="text" name="ERP_po_id" class="input-field" placeholder="ERP PO ID">
                    </div>
                    <div class="form-group">
                        <label>Factwise PO ID</label>
                        <input type="text" name="factwise_po_id" class="input-field" value="PO000171">
                    </div>
                </div>

                <div style="margin: 16px 0; padding: 12px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; color: #991b1b;">
                    <strong>⚠️ Note:</strong> At least one PO ID (ERP or Factwise) is required
                </div>

                <!-- Termination Details -->
                <div class="form-section-title">
                    <span class="fst-icon">📋</span>
                    <h4>Termination Details</h4>
                </div>

                <div class="form-group">
                    <label>Status *</label>
                    <select name="termination_status" class="input-field" required>
                        <option value="">Select Status...</option>
                        <option value="ACCEPTED" selected>ACCEPTED - The request to terminate a PO will be accepted by the seller</option>
                        <option value="REQUESTED">REQUESTED - A request have been made to terminate the PO by buyer</option>
                        <option value="REVOKED">REVOKED - The request to terminate a PO is been revoked by the seller</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Notes</label>
                    <textarea name="termination_notes" class="form-textarea" rows="3" placeholder="Termination notes">aise hi</textarea>
                </div>

                <!-- Warning Box -->
                <div style="margin-top: 20px; padding: 16px; background: #fef2f2; border: 2px solid #ef4444; border-radius: 8px;">
                    <div style="display: flex; align-items: center; gap: 12px; color: #991b1b;">
                        <span style="font-size: 24px;">⚠️</span>
                        <div>
                            <strong style="font-size: 14px;">Warning: Termination Action</strong>
                            <p style="margin: 5px 0 0 0; font-size: 13px; color: #7f1d1d;">
                                This action will terminate the purchase order. Please ensure all details are correct before proceeding.
                            </p>
                        </div>
                    </div>
                </div>
            `;
        } else if (module.id === 'purchase_order' && operation.id === 'state') {
            bodyInputsHtml = `
                <!-- PO State Update Form -->
                <div class="form-section-title no-margin-top">
                    <span class="fst-icon">📊</span>
                    <h4>Update Purchase Order Status</h4>
                    <span class="fst-badge" style="background: #3b82f6;">Status Update</span>
                </div>

                <div class="form-group">
                    <label>Modified By User Email *</label>
                    <input type="email" name="modified_by_user_email" class="input-field" required
                        value="${this.currentAccount?.user_email || 'globalfieldsETE@gmail.com'}">
                </div>

                <!-- PO Identification -->
                <div class="form-section-title">
                    <span class="fst-icon">🔍</span>
                    <h4>PO Identification</h4>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>ERP PO ID</label>
                        <input type="text" name="ERP_po_id" class="input-field" placeholder="ERP PO ID">
                    </div>
                    <div class="form-group">
                        <label>Factwise PO ID</label>
                        <input type="text" name="factwise_po_id" class="input-field" placeholder="Factwise PO ID">
                    </div>
                </div>

                <div style="margin: 16px 0; padding: 12px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; color: #991b1b;">
                    <strong>⚠️ Note:</strong> At least one PO ID (ERP or Factwise) is required
                </div>

                <!-- Status Update -->
                <div class="form-section-title">
                    <span class="fst-icon">🔄</span>
                    <h4>Status Update</h4>
                </div>

                <div class="form-group">
                    <label>Status *</label>
                    <select name="po_state_status" class="input-field" required>
                        <option value="">Select Status...</option>
                        <option value="ONGOING" selected>ONGOING - Purchase Order is ongoing</option>
                        <option value="ISSUED">ISSUED - Purchase Order is issued</option>
                        <option value="RESCINDED">RESCINDED - Purchase Order has been rescinded</option>
                        <option value="DECLINED">DECLINED - Purchase Order has been declined</option>
                    </select>
                    <small style="color: #64748b; font-size: 11px;">Select the new status for the purchase order</small>
                </div>

                <div class="form-group">
                    <label>Notes</label>
                    <textarea name="po_state_notes" class="form-textarea" rows="3" placeholder="Optional notes about the status change"></textarea>
                </div>

                <!-- Info Box -->
                <div style="margin-top: 20px; padding: 15px; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px;">
                    <div style="display: flex; align-items: center; gap: 10px; color: #1e40af;">
                        <span style="font-size: 20px;">ℹ️</span>
                        <div>
                            <strong>Status Update Information</strong>
                            <p style="margin: 5px 0 0 0; font-size: 13px; color: #1e3a8a;">
                                The PO must be in ISSUED status to update. Status changes affect the PO lifecycle and availability.
                            </p>
                        </div>
                    </div>
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
        } else if (module.id === 'items' && operation.id === 'bulk_create') {
            // Expose this instance globally so inline onclick handlers can call methods on it
            window.uiController = this;
            // Show the Generate Script button only for this operation
            if (this.elements.btnGenerateScript) this.elements.btnGenerateScript.classList.remove('hidden');

            // Load item templates and then add first item
            this._loadItemTemplates().then(() => {
                this._addBulkItem();
            });
        } else if (module.id === 'vendors' && operation.id === 'contacts_create') {
            // Expose this instance globally for vendor contact create
            window.uiController = this;
        } else if (module.id === 'vendors' && operation.id === 'contacts_update') {
            // Expose this instance globally for vendor contact update
            window.uiController = this;
        } else if (module.id === 'vendors' && operation.id === 'contacts_delete') {
            // Expose this instance globally for vendor contact delete
            window.uiController = this;
        } else if (module.id === 'vendors' && operation.id === 'state') {
            // Expose this instance globally for vendor state
            window.uiController = this;
        } else if (module.id === 'vendors' && operation.id === 'create') {
            // Expose this instance globally for vendor create
            window.uiController = this;
            // Load vendor templates and populate custom fields
            this._loadVendorTemplates().then((config) => {
                if (config && config.customFields && config.customFields.length > 0) {
                    this._populateVendorCustomFields(config.customFields);
                }
            });
        } else if (module.id === 'items' && operation.id === 'update_state') {
            // Expose this instance globally for item state
            window.uiController = this;
        } else if (module.id === 'items' && operation.id === 'create') {
            // Expose this instance globally for item create
            window.uiController = this;
            // Load item templates and populate custom fields
            this._loadItemTemplates().then((config) => {
                if (config && config.customFields && config.customFields.length > 0) {
                    this._populateItemCreateCustomFields(config.customFields);
                }
            });
        } else if (module.id === 'projects' && operation.id === 'create') {
            // Expose this instance globally for project create
            window.uiController = this;
            // Load project templates and populate custom fields
            this._loadProjectTemplates().then((config) => {
                if (config && config.customFields && config.customFields.length > 0) {
                    this._populateProjectCreateCustomFields(config.customFields);
                }
            });
        } else if (module.id === 'projects' && operation.id === 'bulk_create') {
            // Expose this instance globally for project bulk create
            window.uiController = this;

            // Load project templates and then add first project
            this._loadProjectTemplates().then(() => {
                this._addBulkProject();
            });
        } else if (module.id === 'purchase_order' && operation.id === 'create') {
            // Expose this instance globally for PO create
            window.uiController = this;

            // Load PO templates
            this._loadPOTemplates();

            // Template selector change listener
            const templateSelect = document.getElementById('po_template_select');
            if (templateSelect) {
                templateSelect.addEventListener('change', async (e) => {
                    const templateName = e.target.value;
                    if (templateName) {
                        console.log('PO template selected:', templateName);
                        const config = this.templateManager.parsePOTemplateConfig(templateName);
                        if (config && config.customFields && config.customFields.length > 0) {
                            this._populatePOCustomFields(config.customFields);
                        }
                    }
                });
            }
            // Expose this instance globally for PO create
            window.uiController = this;
            // Add first PO item
            this._addPOItem();
        }

        // Hide Generate Script button on non-applicable operations
        if (!(module.id === 'items' && operation.id === 'bulk_create')) {
            if (this.elements.btnGenerateScript) this.elements.btnGenerateScript.classList.add('hidden');
        }
    }

    // ============================================================
    // ITEMS BULK CREATE HELPERS
    // ============================================================

    /**
     * Reads the global section toggles and returns an object of booleans.
     * Used by item card generation and payload collection.
     */
    _getBulkToggles() {
        return {
            buyer: !!document.getElementById('bi-global-buyer')?.checked,
            seller: !!document.getElementById('bi-global-seller')?.checked,
            tags: !!document.getElementById('bi-global-tags')?.checked,
            attributes: !!document.getElementById('bi-global-attributes')?.checked,
            hsn: !!document.getElementById('bi-global-hsn')?.checked,
            vendor: !!document.getElementById('bi-global-vendor')?.checked,
        };
    }

    /**
     * After a global toggle changes, show/hide the relevant sections
     * in ALL existing item cards.
     */
    _updateBulkItemSections() {
        const t = this._getBulkToggles();
        const container = document.getElementById('bulk-items-container');
        if (!container) return;
        container.querySelectorAll('.bi-item-card').forEach(card => {
            const show = (cls, visible) => {
                card.querySelectorAll(`.bi-section-${cls}`).forEach(el => {
                    el.style.display = visible ? '' : 'none';
                });
            };
            show('buyer', t.buyer);
            show('seller', t.seller);
            show('tags', t.tags);
            show('attributes', t.attributes);
            show('hsn', t.hsn);
            show('vendor', t.vendor);
        });
    }

    /**
     * Reads the "No. of Items" input and generates that many item cards,
     * clearing existing cards first.
     */
    _generateBulkItemCards() {
        const container = document.getElementById('bulk-items-container');
        if (!container) return;
        const countEl = document.querySelector('[name="bi_item_count"]');
        const count = Math.max(1, Math.min(500, parseInt(countEl?.value) || 1));
        container.innerHTML = '';
        for (let i = 0; i < count; i++) {
            this._addBulkItem();
        }
    }

    /**
     * Adds a single item card. Fields are dynamically generated from template.
     */
    _addBulkItem() {
        const container = document.getElementById('bulk-items-container');
        if (!container) return;

        const itemIndex = container.querySelectorAll('.bi-item-card').length;
        const n = itemIndex + 1;

        // Get template config
        const config = this.templateManager?.itemTemplateConfig;

        if (!config) {
            console.warn('No item template config available, using fallback');
            this._addBulkItemFallback(itemIndex, n);
            return;
        }

        console.log('Generating item card with template config:', config);

        const card = document.createElement('div');
        card.className = 'bi-item-card cc-item-card';
        card.dataset.itemIndex = itemIndex;

        // Generate dynamic fields HTML
        let fieldsHTML = '';

        // Core required fields (always show)
        fieldsHTML += `
            <div class="form-row">
                <div class="form-group">
                    <label>Item Name *</label>
                    <input type="text" name="bi_item_${itemIndex}_name" class="input-field" required
                        placeholder="e.g. Steel Bucket" value="Test Item ${n}">
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <input type="text" name="bi_item_${itemIndex}_description" class="input-field"
                        placeholder="Item description" value="Item created via open API">
                </div>
            </div>
        `;

        // ERP Code and Factwise Code
        fieldsHTML += `<div class="form-row">`;
        if (config.hasERPCode) {
            fieldsHTML += `
                <div class="form-group">
                    <label>ERP Item Code</label>
                    <input type="text" name="bi_item_${itemIndex}_erp_code" class="input-field"
                        placeholder="ERP-ITEM-001" value="ERP-ITEM-00${n}">
                </div>
            `;
        }
        fieldsHTML += `
            <div class="form-group">
                <label>Factwise Item Code</label>
                <input type="text" name="bi_item_${itemIndex}_fw_code" class="input-field"
                    placeholder="BKT-1088" value="BKT-${1088 + itemIndex}">
            </div>
        </div>`;

        // Item Type and Status
        fieldsHTML += `
            <div class="form-row">
                <div class="form-group">
                    <label>Item Type</label>
                    <select name="bi_item_${itemIndex}_item_type" class="input-field">
                        <option value="RAW_MATERIAL" selected>RAW_MATERIAL</option>
                        <option value="FINISHED_GOODS">FINISHED_GOODS</option>
                        <option value="SERVICES">SERVICES</option>
                        <option value="CAPITAL_GOODS">CAPITAL_GOODS</option>
                        <option value="CONSUMABLES">CONSUMABLES</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Status</label>
                    <select name="bi_item_${itemIndex}_status" class="input-field">
                        <option value="ACTIVE" selected>ACTIVE - Item is active and available</option>
                        <option value="INACTIVE">INACTIVE - Item is inactive and unavailable</option>
                    </select>
                </div>
            </div>
        `;

        // Measurement Unit and Currency
        fieldsHTML += `
            <div class="form-row">
                <div class="form-group">
                    <label>Measurement Unit ID *</label>
                    <input type="text" name="bi_item_${itemIndex}_unit_id" class="input-field" required
                        placeholder="UUID" value="66d42245-5a0d-4801-8cb2-43bf627f7cbe">
                </div>
                <div class="form-group">
                    <label>Currency Code ID *</label>
                    <input type="text" name="bi_item_${itemIndex}_currency_id" class="input-field" required
                        placeholder="UUID" value="0f6c64c3-0ec3-482e-9dc2-7e20b6431bda">
                </div>
            </div>
        `;

        // HSN, MPN, CPN codes (from template)
        if (config.hasHSN || config.hasMPN || config.hasCPN) {
            fieldsHTML += `<div class="form-row">`;
            if (config.hasHSN) {
                fieldsHTML += `
                    <div class="form-group">
                        <label>HSN Code</label>
                        <input type="text" name="bi_item_${itemIndex}_hsn" class="input-field" value="8471">
                    </div>
                `;
            }
            if (config.hasMPN) {
                fieldsHTML += `
                    <div class="form-group">
                        <label>MPN Code</label>
                        <input type="text" name="bi_item_${itemIndex}_mpn" class="input-field">
                    </div>
                `;
            }
            if (config.hasCPN) {
                fieldsHTML += `
                    <div class="form-group">
                        <label>CPN Code</label>
                        <input type="text" name="bi_item_${itemIndex}_cpn" class="input-field">
                    </div>
                `;
            }
            fieldsHTML += `</div>`;
        }

        // Custom fields from template
        if (config.customFields && config.customFields.length > 0) {
            fieldsHTML += `<p class="cc-sub-title" style="margin-top: 16px;">🔧 Custom Fields</p>`;

            // Group custom fields in rows of 2
            for (let i = 0; i < config.customFields.length; i += 2) {
                fieldsHTML += `<div class="form-row">`;
                fieldsHTML += this.templateManager.generateFieldHTML(config.customFields[i], itemIndex);
                if (i + 1 < config.customFields.length) {
                    fieldsHTML += this.templateManager.generateFieldHTML(config.customFields[i + 1], itemIndex);
                }
                fieldsHTML += `</div>`;
            }
        }

        // Buyer/Seller Pricing (toggle-controlled)
        fieldsHTML += `
            <div class="bi-section-buyer">
                <p class="cc-sub-title" style="margin-top: 16px;">💰 Buyer Pricing</p>
                <div class="form-row">
                    <div class="form-group">
                        <label>Buyer Price</label>
                        <input type="number" name="bi_item_${itemIndex}_buyer_price" class="input-field" value="1000" step="0.01">
                    </div>
                    <div class="form-group">
                        <label>Buyer Currency ID</label>
                        <input type="text" name="bi_item_${itemIndex}_buyer_currency" class="input-field"
                            value="0f6c64c3-0ec3-482e-9dc2-7e20b6431bda">
                    </div>
                </div>
            </div>

            <div class="bi-section-seller">
                <p class="cc-sub-title" style="margin-top: 16px;">💰 Seller Pricing</p>
                <div class="form-row">
                    <div class="form-group">
                        <label>Seller Price</label>
                        <input type="number" name="bi_item_${itemIndex}_seller_price" class="input-field" value="1200" step="0.01">
                    </div>
                    <div class="form-group">
                        <label>Seller Currency ID</label>
                        <input type="text" name="bi_item_${itemIndex}_seller_currency" class="input-field"
                            value="0f6c64c3-0ec3-482e-9dc2-7e20b6431bda">
                    </div>
                </div>
            </div>
        `;

        // Tags (if available in template)
        if (config.hasTags) {
            fieldsHTML += `
                <div class="bi-section-tags">
                    <div class="form-group">
                        <label>Tags (comma-separated)</label>
                        <input type="text" name="bi_item_${itemIndex}_tags" class="input-field" value="API, NG_TEST">
                    </div>
                </div>
            `;
        }

        // Attributes (if available in template)
        if (config.hasAttributes) {
            fieldsHTML += `
                <div class="bi-section-attributes" style="display:none;">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Attribute Name</label>
                            <input type="text" name="bi_item_${itemIndex}_attr_name" class="input-field" value="color">
                        </div>
                        <div class="form-group">
                            <label>Attribute Value</label>
                            <input type="text" name="bi_item_${itemIndex}_attr_value" class="input-field" value="Red">
                        </div>
                    </div>
                </div>
            `;
        }

        // Preferred Vendor
        fieldsHTML += `
            <div class="bi-section-vendor">
                <div class="form-group">
                    <label>Preferred Vendor Code</label>
                    <input type="text" name="bi_item_${itemIndex}_vendor" class="input-field" value="V0029">
                </div>
            </div>
        `;

        // Notes (always shown)
        fieldsHTML += `
            <div class="form-row">
                <div class="form-group">
                    <label>Notes</label>
                    <input type="text" name="bi_item_${itemIndex}_notes" class="input-field"
                        value="Testing taxes and additional costs">
                </div>
                <div class="form-group">
                    <label>Internal Notes</label>
                    <input type="text" name="bi_item_${itemIndex}_internal_notes" class="input-field"
                        value="Internal testing item">
                </div>
            </div>
        `;

        card.innerHTML = `
            <div class="cc-item-card-header">
                <div class="cc-item-card-badge">${n}</div>
                <div class="cc-item-card-title cc-item-label" style="font-weight: 600;">Item #${n}</div>
                <button type="button" class="btn-remove-item"
                    onclick="this.closest('.bi-item-card').remove(); window.uiController._refreshBulkItemLabels();"
                    title="Remove item" style="margin-left: auto; background: #ef4444; color: white; border: none; border-radius: 4px; padding: 6px 12px; cursor: pointer; font-size: 12px;">✕ Remove Item</button>
            </div>
            <div class="cc-item-card-body">${fieldsHTML}</div>
        `;

        container.appendChild(card);
        this._refreshBulkItemLabels();
    }

    /**
     * Fallback method for adding bulk item when template is not available
     */
    _addBulkItemFallback(itemIndex, n) {
        const container = document.getElementById('bulk-items-container');
        if (!container) return;

        const card = document.createElement('div');
        card.className = 'bi-item-card cc-item-card';
        card.dataset.itemIndex = itemIndex;
        card.innerHTML = `
            <div class="cc-item-card-header">
                <div class="cc-item-card-badge">${n}</div>
                <div class="cc-item-card-title cc-item-label" style="font-weight: 600;">Item #${n}</div>
                <button type="button" class="btn-remove-item"
                    onclick="this.closest('.bi-item-card').remove(); window.uiController._refreshBulkItemLabels();"
                    title="Remove item" style="margin-left: auto; background: #ef4444; color: white; border: none; border-radius: 4px; padding: 6px 12px; cursor: pointer; font-size: 12px;">✕ Remove Item</button>
            </div>
            <div class="cc-item-card-body">

            <!-- Row 1: Identifying fields -->
            <div class="form-row">
                <div class="form-group">
                    <label>Item Name *</label>
                    <input type="text" name="bi_item_${itemIndex}_name" class="input-field" required
                        placeholder="e.g. Steel Bucket" value="Test Item ${n}">
                </div>
                <div class="form-group">
                    <label>ERP Item Code</label>
                    <input type="text" name="bi_item_${itemIndex}_erp_code" class="input-field"
                        placeholder="ERP-ITEM-001" value="ERP-ITEM-00${n}">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Factwise Item Code</label>
                    <input type="text" name="bi_item_${itemIndex}_fw_code" class="input-field"
                        placeholder="BKT-1088" value="BKT-${1088 + itemIndex}">
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <input type="text" name="bi_item_${itemIndex}_description" class="input-field"
                        placeholder="Item description" value="Item created via open API">
                </div>
            </div>

            <!-- Row 2: Type / Status / Unit / Currency -->
            <div class="form-row">
                <div class="form-group">
                    <label>Item Type</label>
                    <select name="bi_item_${itemIndex}_item_type" class="input-field">
                        <option value="RAW_MATERIAL" selected>RAW_MATERIAL</option>
                        <option value="FINISHED_GOODS">FINISHED_GOODS</option>
                        <option value="SERVICES">SERVICES</option>
                        <option value="CAPITAL_GOODS">CAPITAL_GOODS</option>
                        <option value="CONSUMABLES">CONSUMABLES</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Status</label>
                    <select name="bi_item_${itemIndex}_status" class="input-field">
                        <option value="ACTIVE" selected>ACTIVE - Item is active and available</option>
                        <option value="INACTIVE">INACTIVE - Item is inactive and unavailable</option>
                    </select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Measurement Unit ID *</label>
                    <input type="text" name="bi_item_${itemIndex}_unit_id" class="input-field" required
                        placeholder="UUID" value="66d42245-5a0d-4801-8cb2-43bf627f7cbe">
                </div>
                <div class="form-group">
                    <label>Currency Code ID *</label>
                    <input type="text" name="bi_item_${itemIndex}_currency_id" class="input-field" required
                        placeholder="UUID" value="0f6c64c3-0ec3-482e-9dc2-7e20b6431bda">
                </div>
            </div>

            <!-- Buyer Pricing (global-toggle-controlled) -->
            <div class="bi-section-buyer">
                <div class="form-row">
                    <div class="form-group">
                        <label>Buyer Price</label>
                        <input type="number" name="bi_item_${itemIndex}_buyer_price" class="input-field" value="1000" step="0.01">
                    </div>
                    <div class="form-group">
                        <label>Buyer Currency ID</label>
                        <input type="text" name="bi_item_${itemIndex}_buyer_currency" class="input-field"
                            value="0f6c64c3-0ec3-482e-9dc2-7e20b6431bda">
                    </div>
                </div>
            </div>

            <!-- Seller Pricing (global-toggle-controlled) -->
            <div class="bi-section-seller">
                <div class="form-row">
                    <div class="form-group">
                        <label>Seller Price</label>
                        <input type="number" name="bi_item_${itemIndex}_seller_price" class="input-field" value="1200" step="0.01">
                    </div>
                    <div class="form-group">
                        <label>Seller Currency ID</label>
                        <input type="text" name="bi_item_${itemIndex}_seller_currency" class="input-field"
                            value="0f6c64c3-0ec3-482e-9dc2-7e20b6431bda">
                    </div>
                </div>
            </div>

            <!-- Tags (global-toggle-controlled) -->
            <div class="bi-section-tags">
                <div class="form-group">
                    <label>Tags (comma-separated)</label>
                    <input type="text" name="bi_item_${itemIndex}_tags" class="input-field" value="API, NG_TEST">
                </div>
            </div>

            <!-- Attributes (global-toggle-controlled, off by default) -->
            <div class="bi-section-attributes" style="display:none;">
                <div class="form-row">
                    <div class="form-group">
                        <label>Attribute Name</label>
                        <input type="text" name="bi_item_${itemIndex}_attr_name" class="input-field" value="color">
                    </div>
                    <div class="form-group">
                        <label>Attribute Value</label>
                        <input type="text" name="bi_item_${itemIndex}_attr_value" class="input-field" value="Red">
                    </div>
                </div>
            </div>

            <!-- HSN / Custom IDs (global-toggle-controlled) -->
            <div class="bi-section-hsn">
                <div class="form-group">
                    <label>HSN Code (custom_ids)</label>
                    <input type="text" name="bi_item_${itemIndex}_hsn" class="input-field" value="8471">
                </div>
            </div>

            <!-- Preferred Vendor (global-toggle-controlled) -->
            <div class="bi-section-vendor">
                <div class="form-group">
                    <label>Preferred Vendor Code</label>
                    <input type="text" name="bi_item_${itemIndex}_vendor" class="input-field" value="V0029">
                </div>
            </div>

            <!-- Notes (always shown) -->
            <div class="form-row">
                <div class="form-group">
                    <label>Notes</label>
                    <input type="text" name="bi_item_${itemIndex}_notes" class="input-field"
                        value="Testing taxes and additional costs">
                </div>
                <div class="form-group">
                    <label>Internal Notes</label>
                    <input type="text" name="bi_item_${itemIndex}_internal_notes" class="input-field"
                        value="Internal testing item">
                </div>
            </div>
            </div>
        `;
        container.appendChild(card);
        this._refreshBulkItemLabels();
    }

    /** Re-numbers item cards after removal */
    _refreshBulkItemLabels() {
        const container = document.getElementById('bulk-items-container');
        if (!container) return;
        const cards = container.querySelectorAll('.bi-item-card');
        cards.forEach((card, i) => {
            const label = card.querySelector('.cc-item-label');
            if (label) label.textContent = `Item #${i + 1}`;
            const badge = card.querySelector('.cc-item-card-badge');
            if (badge) badge.textContent = i + 1;
        });
        const counter = document.getElementById('bulk-item-count');
        if (counter) counter.textContent = `(${cards.length} item${cards.length !== 1 ? 's' : ''})`;
    }

    /**
     * Collects per-item data + shared config from the form
     * and returns { items: [...] } ready for buildItemsBulkCreatePayload.
     */
    _buildItemsBulkCreatePayload() {
        const form = this.elements.operationForm;
        const get = (name) => form.querySelector(`[name="${name}"]`)?.value?.trim() || '';

        const createdBy = get('bi_created_by');
        const entityName = get('bi_entity_name') || 'FactWise';
        const t = this._getBulkToggles();

        const container = document.getElementById('bulk-items-container');
        const cards = container ? container.querySelectorAll('.bi-item-card') : [];

        const items = [];
        cards.forEach((card, i) => {
            const cget = (suffix) => card.querySelector(`[name="bi_item_${i}_${suffix}"]`)?.value?.trim() || '';
            const cnum = (suffix) => parseFloat(cget(suffix)) || 0;

            const tags = t.tags
                ? (cget('tags') ? cget('tags').split(',').map(s => s.trim()).filter(Boolean) : [])
                : null;

            const attributes = t.attributes
                ? [{ attribute_name: cget('attr_name'), attribute_type: 'TEXT', attribute_value: [{ value: cget('attr_value') }] }]
                : null;

            const customIds = t.hsn && cget('hsn') ? [{ name: 'HSN', value: cget('hsn') }] : null;

            const entity = {
                entity_name: entityName,
                ERP_preferred_vendors: [],
                factwise_preferred_vendors: (t.vendor && cget('vendor')) ? [cget('vendor')] : []
            };

            const item = {
                created_by_user_email: createdBy,
                name: cget('name'),
                ERP_item_code: cget('erp_code') || null,
                factwise_item_code: cget('fw_code') || null,
                description: cget('description'),
                notes: cget('notes'),
                internal_notes: cget('internal_notes'),
                measurement_units: cget('unit_id') ? [cget('unit_id')] : [],
                item_type: cget('item_type') || 'RAW_MATERIAL',
                status: cget('status') || 'ACTIVE',
                attributes: attributes,
                is_buyer: t.buyer,
                is_seller: t.seller,
                custom_ids: customIds,
                tags: tags,
                entities: [entity],
                custom_sections: []
            };

            if (t.buyer) {
                item.buyer_pricing_information = {
                    price: cnum('buyer_price'),
                    currency_code_id: cget('buyer_currency') || cget('currency_id'),
                    additional_costs: [],
                    taxes: []
                };
            } else {
                item.buyer_pricing_information = null;
            }

            if (t.seller) {
                item.seller_pricing_information = {
                    price: cnum('seller_price'),
                    currency_code_id: cget('seller_currency') || cget('currency_id'),
                    additional_costs: [],
                    taxes: []
                };
            } else {
                item.seller_pricing_information = null;
            }

            items.push(item);
        });

        return this.payloadBuilder.buildItemsBulkCreatePayload(this.currentAccount, { items });
    }

    /**
     * Builds the payload for vendor contact create operation.
     * Collects form data and formats it according to the API requirements.
     */
    _buildVendorContactCreatePayload() {
        const form = this.elements.operationForm;
        const get = (name) => form.querySelector(`[name="${name}"]`)?.value?.trim() || '';

        // Collect basic fields
        const payload = {
            created_by_user_email: get('created_by_user_email'),
            full_name: get('full_name'),
            primary_email: get('primary_email'),
            entity_name: get('entity_name')
        };

        // Add vendor codes (at least one required)
        const erpCode = get('ERP_vendor_code');
        const factwiseCode = get('factwise_vendor_code');

        if (erpCode) payload.ERP_vendor_code = erpCode;
        if (factwiseCode) payload.factwise_vendor_code = factwiseCode;

        // Validate at least one vendor code is provided
        if (!erpCode && !factwiseCode) {
            throw new Error('Either ERP Vendor Code or Factwise Vendor Code is required');
        }

        // Collect phone numbers (comma-separated)
        const phoneNumbersStr = get('phone_numbers');
        if (phoneNumbersStr) {
            payload.phone_numbers = phoneNumbersStr.split(',')
                .map(p => p.trim())
                .filter(p => p.length > 0)
                .map(p => parseInt(p));
        } else {
            payload.phone_numbers = [];
        }

        // Collect additional emails
        const emailsContainer = document.getElementById('additional-emails-container');
        const emails = [];
        if (emailsContainer) {
            const emailCards = emailsContainer.querySelectorAll('.cc-custom-item');
            emailCards.forEach((card, index) => {
                const email = card.querySelector(`[name="contact_email_${index}_address"]`)?.value?.trim();
                const type = card.querySelector(`[name="contact_email_${index}_type"]`)?.value || 'CC';
                if (email) {
                    emails.push({ email, type });
                }
            });
        }
        payload.emails = emails;

        return payload;
    }

    /**
     * Builds the payload for vendor contact update operation.
     * Collects form data and formats it according to the API requirements.
     */
    _buildVendorContactUpdatePayload() {
        const form = this.elements.operationForm;
        const get = (name) => form.querySelector(`[name="${name}"]`)?.value?.trim() || '';

        // Collect basic fields
        const payload = {
            modified_by_user_email: get('modified_by_user_email'),
            full_name: get('full_name'),
            primary_email: get('primary_email'),
            entity_name: get('entity_name'),
            is_primary: get('is_primary') === 'true'
        };

        // Add vendor codes (at least one required)
        const erpCode = get('ERP_vendor_code');
        const factwiseCode = get('factwise_vendor_code');

        if (erpCode) payload.ERP_vendor_code = erpCode;
        if (factwiseCode) payload.factwise_vendor_code = factwiseCode;

        // Validate at least one vendor code is provided
        if (!erpCode && !factwiseCode) {
            throw new Error('Either ERP Vendor Code or Factwise Vendor Code is required');
        }

        // Collect phone numbers (comma-separated)
        const phoneNumbersStr = get('phone_numbers');
        if (phoneNumbersStr) {
            payload.phone_numbers = phoneNumbersStr.split(',')
                .map(p => p.trim())
                .filter(p => p.length > 0)
                .map(p => parseInt(p));
        } else {
            payload.phone_numbers = [];
        }

        // Collect additional emails
        const emailsContainer = document.getElementById('additional-emails-container-update');
        const emails = [];
        if (emailsContainer) {
            const emailCards = emailsContainer.querySelectorAll('.cc-custom-item');
            emailCards.forEach((card, index) => {
                const email = card.querySelector(`[name="contact_email_update_${index}_address"]`)?.value?.trim();
                const type = card.querySelector(`[name="contact_email_update_${index}_type"]`)?.value || 'CC';
                if (email) {
                    emails.push({ email, type });
                }
            });
        }
        payload.emails = emails;

        return payload;
    }

    /**
     * Builds the payload for vendor contact delete operation.
     * Collects form data and formats it according to the API requirements.
     */
    _buildVendorContactDeletePayload() {
        const form = this.elements.operationForm;
        const get = (name) => form.querySelector(`[name="${name}"]`)?.value?.trim() || '';

        // Collect basic fields
        const payload = {
            deleted_by_user_email: get('deleted_by_user_email'),
            primary_email: get('primary_email'),
            entity_name: get('entity_name')
        };

        // Add vendor codes (at least one required)
        const erpCode = get('ERP_vendor_code');
        const factwiseCode = get('factwise_vendor_code');

        if (erpCode) payload.ERP_vendor_code = erpCode;
        if (factwiseCode) payload.factwise_vendor_code = factwiseCode;

        // Validate at least one vendor code is provided
        if (!erpCode && !factwiseCode) {
            throw new Error('Either ERP Vendor Code or Factwise Vendor Code is required');
        }

        return payload;
    }

    /**
     * Builds the payload for vendor state update operation.
     * Collects form data and formats it according to the API requirements.
     */
    _buildVendorStatePayload() {
        const form = this.elements.operationForm;
        const get = (name) => form.querySelector(`[name="${name}"]`)?.value?.trim() || '';

        // Collect basic fields
        const payload = {
            modified_by_user_email: get('modified_by_user_email'),
            status: get('status')
        };

        // Add vendor codes (at least one required)
        const erpCode = get('ERP_vendor_code');
        const factwiseCode = get('factwise_vendor_code');

        if (erpCode) payload.ERP_vendor_code = erpCode;
        if (factwiseCode) payload.factwise_vendor_code = factwiseCode;

        // Validate at least one vendor code is provided
        if (!erpCode && !factwiseCode) {
            throw new Error('Either ERP Vendor Code or Factwise Vendor Code is required');
        }

        // Validate status is selected
        if (!payload.status) {
            throw new Error('Status is required');
        }

        return payload;
    }

    /**
     * Builds the payload for vendor create operation.
     */
    _buildVendorCreatePayload() {
        const form = this.elements.operationForm;
        const get = (name) => form.querySelector(`[name="${name}"]`)?.value?.trim() || '';

        const payload = {
            created_by_user_email: get('created_by_user_email'),
            vendor_name: get('vendor_name'),
            ERP_vendor_code: get('ERP_vendor_code'),
            notes: get('notes') || null,
            tags: get('tags') ? get('tags').split(',').map(t => t.trim()).filter(t => t) : [],
            seller_address_information: get('seller_address_information') ? get('seller_address_information').split(',').map(a => a.trim()).filter(a => a) : [],
            seller_identifications: [],
            additional_costs: [],
            primary_contact: {},
            secondary_contacts: [],
            entities: [],
            custom_sections: []
        };

        // Primary contact
        const primaryPhones = get('primary_phone_numbers');
        payload.primary_contact = {
            full_name: get('primary_full_name'),
            phone_numbers: primaryPhones ? primaryPhones.split(',').map(p => parseInt(p.trim())).filter(p => !isNaN(p)) : [],
            emails: [{
                primary_email: get('primary_email'),
                type: get('primary_email_type')
            }]
        };

        // Seller identifications
        if (get('identification_name') && get('identification_value')) {
            payload.seller_identifications.push({
                identification_name: get('identification_name'),
                identification_value: get('identification_value')
            });
        }

        // Entities
        const entityNames = get('entity_names');
        if (entityNames) {
            entityNames.split(',').forEach(name => {
                const trimmed = name.trim();
                if (trimmed) {
                    payload.entities.push({ entity_name: trimmed });
                }
            });
        }

        // Additional costs
        const costsContainer = document.getElementById('vendor-costs-container');
        if (costsContainer) {
            const costCards = costsContainer.querySelectorAll('.cc-custom-item');
            costCards.forEach((card, index) => {
                const name = card.querySelector(`[name="cost_${index}_name"]`)?.value?.trim();
                const value = card.querySelector(`[name="cost_${index}_value"]`)?.value;
                if (name && value) {
                    payload.additional_costs.push({
                        name: name,
                        value: parseFloat(value)
                    });
                }
            });
        }

        // Secondary contacts
        const secondaryContainer = document.getElementById('vendor-secondary-contacts-container');
        if (secondaryContainer) {
            const contactCards = secondaryContainer.querySelectorAll('.cc-custom-item');
            contactCards.forEach((card, index) => {
                const fullName = card.querySelector(`[name="secondary_${index}_full_name"]`)?.value?.trim();
                const email = card.querySelector(`[name="secondary_${index}_email"]`)?.value?.trim();
                const phoneNumbers = card.querySelector(`[name="secondary_${index}_phone_numbers"]`)?.value?.trim();
                const emailType = card.querySelector(`[name="secondary_${index}_email_type"]`)?.value;

                if (fullName && email) {
                    payload.secondary_contacts.push({
                        full_name: fullName,
                        phone_numbers: phoneNumbers ? phoneNumbers.split(',').map(p => parseInt(p.trim())).filter(p => !isNaN(p)) : [],
                        emails: [{
                            email: email,
                            type: emailType
                        }]
                    });
                }
            });
        }

        // Custom sections
        const customContainer = document.getElementById('vendor-custom-sections-container');
        if (customContainer) {
            const sectionCards = customContainer.querySelectorAll('.cc-custom-item');
            sectionCards.forEach((card, index) => {
                const sectionName = card.querySelector(`[name="custom_section_${index}_name"]`)?.value?.trim();
                const fieldsJson = card.querySelector(`[name="custom_section_${index}_fields"]`)?.value?.trim();

                if (sectionName && fieldsJson) {
                    try {
                        const customFields = JSON.parse(fieldsJson);
                        payload.custom_sections.push({
                            name: sectionName,
                            custom_fields: customFields
                        });
                    } catch (e) {
                        console.error('Invalid JSON in custom section:', e);
                    }
                }
            });
        }

        return payload;
    }

    /**
     * Builds the payload for item state update operation.
     */
    _buildItemStatePayload() {
        const form = this.elements.operationForm;
        const get = (name) => form.querySelector(`[name="${name}"]`)?.value?.trim() || '';

        const payload = {
            modified_by_user_email: get('modified_by_user_email'),
            status: get('status')
        };

        // Add item codes (at least one required)
        const erpCode = get('ERP_item_code');
        const factwiseCode = get('factwise_item_code');

        if (erpCode) payload.ERP_item_code = erpCode;
        if (factwiseCode) payload.factwise_item_code = factwiseCode;

        // Validate at least one item code is provided
        if (!erpCode && !factwiseCode) {
            throw new Error('Either ERP Item Code or Factwise Item Code is required');
        }

        // Validate status is selected
        if (!payload.status) {
            throw new Error('Status is required');
        }

        return payload;
    }

    /**
     * Builds the payload for item create operation.
     */
    _buildItemCreatePayload() {
        const form = this.elements.operationForm;
        const get = (name) => form.querySelector(`[name="${name}"]`)?.value?.trim() || '';

        // Basic required fields
        const payload = {
            created_by_user_email: get('created_by_user_email'),
            name: get('name'),
            description: get('description') || '',
            notes: get('notes') || '',
            internal_notes: get('internal_notes') || '',
            item_type: get('item_type'),
            status: get('status')
        };

        // Item codes (at least one required)
        const erpCode = get('ERP_item_code');
        const factwiseCode = get('factwise_item_code');
        if (erpCode) payload.ERP_item_code = erpCode;
        if (factwiseCode) payload.factwise_item_code = factwiseCode;

        // Validate at least one item code
        if (!erpCode && !factwiseCode) {
            throw new Error('Either ERP Item Code or Factwise Item Code is required');
        }

        // Measurement units (required, comma-separated UUIDs)
        const measurementUnits = get('measurement_units');
        if (measurementUnits) {
            payload.measurement_units = measurementUnits.split(',').map(u => u.trim()).filter(u => u);
        } else {
            payload.measurement_units = [];
        }

        // Attributes
        const attributeRows = form.querySelectorAll('.item-attribute-row');
        payload.attributes = [];
        attributeRows.forEach(row => {
            const attrName = row.querySelector('[name$="_attribute_name"]')?.value?.trim();
            const attrType = row.querySelector('[name$="_attribute_type"]')?.value?.trim() || 'TEXT';
            const attrValue = row.querySelector('[name$="_attribute_value"]')?.value?.trim();

            if (attrName && attrValue) {
                payload.attributes.push({
                    attribute_name: attrName,
                    attribute_type: attrType,
                    attribute_value: [{ value: attrValue }]
                });
            }
        });

        // Buyer pricing information
        const isBuyer = get('is_buyer');
        payload.is_buyer = isBuyer === 'true';

        if (payload.is_buyer) {
            const buyerPrice = get('buyer_price');
            const buyerCurrency = get('buyer_currency_code_id');

            if (buyerPrice || buyerCurrency) {
                payload.buyer_pricing_information = {
                    price: buyerPrice ? parseFloat(buyerPrice) : 0,
                    currency_code_id: buyerCurrency || null,
                    additional_costs: [],
                    taxes: []
                };
            }
        }

        // Seller pricing information
        const isSeller = get('is_seller');
        payload.is_seller = isSeller === 'true';

        if (payload.is_seller) {
            const sellerPrice = get('seller_price');
            const sellerCurrency = get('seller_currency_code_id');

            if (sellerPrice || sellerCurrency) {
                payload.seller_pricing_information = {
                    price: sellerPrice ? parseFloat(sellerPrice) : 0,
                    currency_code_id: sellerCurrency || null,
                    additional_costs: [],
                    taxes: []
                };
            }
        }

        // Custom IDs
        const customIds = get('custom_ids');
        payload.custom_ids = [];
        if (customIds) {
            const pairs = customIds.split(',').map(p => p.trim()).filter(p => p);
            pairs.forEach(pair => {
                const [name, value] = pair.split(':').map(s => s.trim());
                if (name && value) {
                    payload.custom_ids.push({ name, value });
                }
            });
        }

        // Tags (comma-separated)
        const tags = get('tags');
        payload.tags = tags ? tags.split(',').map(t => t.trim()).filter(t => t) : [];

        // Entities
        const entities = get('entities');
        payload.entities = [];
        if (entities) {
            const entityNames = entities.split(',').map(e => e.trim()).filter(e => e);
            entityNames.forEach(entityName => {
                const preferredVendors = get(`entity_${entityName}_preferred_vendors`);
                payload.entities.push({
                    entity_name: entityName,
                    preferred_vendors: preferredVendors ? preferredVendors.split(',').map(v => v.trim()).filter(v => v) : []
                });
            });
        }

        // Custom sections from template
        payload.custom_sections = [];
        const customSectionContainers = form.querySelectorAll('[data-custom-section]');
        customSectionContainers.forEach(container => {
            const sectionName = container.dataset.customSection;
            const customFields = [];

            const fieldElements = container.querySelectorAll('[data-custom-field]');
            fieldElements.forEach(fieldEl => {
                const fieldName = fieldEl.dataset.customField;
                const fieldType = fieldEl.dataset.fieldType;
                let value = null;

                if (fieldType === 'BOOLEAN') {
                    const checkbox = fieldEl.querySelector('input[type="checkbox"]');
                    value = checkbox ? checkbox.checked : false;
                } else if (fieldType === 'CHOICE') {
                    const select = fieldEl.querySelector('select');
                    value = select ? select.value : '';
                } else {
                    const input = fieldEl.querySelector('input, textarea');
                    value = input ? input.value : '';
                }

                if (value !== null && value !== '') {
                    customFields.push({
                        name: fieldName,
                        value: fieldType === 'FLOAT' || fieldType === 'PERCENTAGE' ? parseFloat(value) : value
                    });
                }
            });

            if (customFields.length > 0) {
                payload.custom_sections.push({
                    name: sectionName,
                    custom_fields: customFields
                });
            }
        });

        return payload;
    }

    /**
     * Builds the payload for project create operation.
     */
    _buildProjectCreatePayload() {
        const form = this.elements.operationForm;
        const get = (name) => form.querySelector(`[name="${name}"]`)?.value?.trim() || '';

        // Basic required fields
        const payload = {
            created_by_user_email: get('created_by_user_email'),
            project_name: get('project_name'),
            entity_name: get('entity_name'),
            project_status: get('project_status')
        };

        // Project codes (at least one required)
        const projectCode = get('project_code');
        const erpProjectCode = get('ERP_project_code');
        if (projectCode) payload.project_code = projectCode;
        if (erpProjectCode) payload.ERP_project_code = erpProjectCode;

        // Validate at least one project code
        if (!projectCode && !erpProjectCode) {
            throw new Error('Either Project Code or ERP Project Code is required');
        }

        // Optional fields
        const customerCode = get('customer_code');
        const templateName = get('template_name');
        const description = get('description');
        const internalNotes = get('internal_notes');

        if (customerCode) payload.customer_code = customerCode;
        if (templateName) payload.template_name = templateName;
        if (description) payload.description = description;
        if (internalNotes) payload.internal_notes = internalNotes;

        // Dates (convert to ISO format)
        const validityFrom = get('validity_from');
        const validityTo = get('validity_to');

        if (validityFrom) {
            payload.validity_from = new Date(validityFrom).toISOString();
        } else {
            payload.validity_from = null;
        }

        if (validityTo) {
            payload.validity_to = new Date(validityTo).toISOString();
        } else {
            payload.validity_to = null;
        }

        // Custom sections from template
        payload.custom_sections = [];
        const customSectionContainers = form.querySelectorAll('[data-custom-section]');
        customSectionContainers.forEach(container => {
            const sectionName = container.dataset.customSection;
            const customFields = [];

            const fieldElements = container.querySelectorAll('[data-custom-field]');
            fieldElements.forEach(fieldEl => {
                const fieldName = fieldEl.dataset.customField;
                const fieldType = fieldEl.dataset.fieldType;
                let value = null;

                if (fieldType === 'BOOLEAN') {
                    const checkbox = fieldEl.querySelector('input[type="checkbox"]');
                    value = checkbox ? checkbox.checked : false;
                } else if (fieldType === 'CHOICE') {
                    const isMulti = fieldEl.querySelectorAll('input[type="checkbox"]').length > 0;
                    if (isMulti) {
                        // Multi-select: collect all checked values
                        const checkboxes = fieldEl.querySelectorAll('input[type="checkbox"]:checked');
                        value = Array.from(checkboxes).map(cb => cb.value);
                    } else {
                        const select = fieldEl.querySelector('select');
                        value = select ? select.value : '';
                    }
                } else if (fieldType === 'DATETIME') {
                    const input = fieldEl.querySelector('input');
                    if (input && input.value) {
                        value = new Date(input.value).toISOString();
                    }
                } else if (fieldType === 'DATE') {
                    const input = fieldEl.querySelector('input');
                    value = input ? input.value : '';
                } else {
                    const input = fieldEl.querySelector('input, textarea');
                    value = input ? input.value : '';
                }

                if (value !== null && value !== '' && !(Array.isArray(value) && value.length === 0)) {
                    customFields.push({
                        name: fieldName,
                        value: fieldType === 'FLOAT' || fieldType === 'PERCENTAGE' ? parseFloat(value) : value
                    });
                }
            });

            if (customFields.length > 0) {
                payload.custom_sections.push({
                    name: sectionName,
                    custom_fields: customFields
                });
            }
        });

        return payload;
    }

    /**
     * Adds a single project card for bulk create
     */
    _addBulkProject() {
        const container = document.getElementById('bulk-projects-container');
        if (!container) return;

        const projectIndex = container.querySelectorAll('.bp-project-card').length;
        const n = projectIndex + 1;

        const card = document.createElement('div');
        card.className = 'bp-project-card cc-item-card';
        card.dataset.projectIndex = projectIndex;

        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <h4 style="margin: 0; color: #1e293b; font-size: 14px; font-weight: 600;">
                    📋 Project ${n}
                </h4>
                <button type="button" onclick="window.uiController._removeBulkProject(${projectIndex})"
                    class="btn-remove-item" title="Remove Project">
                    ✕
                </button>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label>Project Name *</label>
                    <input type="text" name="bp_project_${projectIndex}_name" class="input-field" required
                        value="API Test Project ${n}">
                </div>
                <div class="form-group">
                    <label>Project Code</label>
                    <input type="text" name="bp_project_${projectIndex}_code" class="input-field"
                        placeholder="Internal code">
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label>ERP Project Code</label>
                    <input type="text" name="bp_project_${projectIndex}_erp_code" class="input-field"
                        value="ERP970${n}">
                </div>
                <div class="form-group">
                    <label>Customer Code</label>
                    <input type="text" name="bp_project_${projectIndex}_customer_code" class="input-field"
                        value="CXJKU0${n}">
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label>Validity From</label>
                    <input type="datetime-local" name="bp_project_${projectIndex}_validity_from" class="input-field">
                </div>
                <div class="form-group">
                    <label>Validity To</label>
                    <input type="datetime-local" name="bp_project_${projectIndex}_validity_to" class="input-field">
                </div>
            </div>

            <div class="form-group">
                <label>Description</label>
                <textarea name="bp_project_${projectIndex}_description" class="form-textarea" rows="2"
                    placeholder="Project description"></textarea>
            </div>

            <div class="form-group">
                <label>Internal Notes</label>
                <textarea name="bp_project_${projectIndex}_internal_notes" class="form-textarea" rows="2"
                    placeholder="Internal notes"></textarea>
            </div>

            <!-- Custom Fields Container -->
            <div id="bp-project-${projectIndex}-custom-fields"></div>
        `;

        container.appendChild(card);

        // Populate custom fields for this project card
        const config = this.templateManager?.projectTemplateConfig;
        if (config && config.customFields && config.customFields.length > 0) {
            this._populateBulkProjectCustomFields(projectIndex, config.customFields);
        }

        this._updateBulkProjectCount();
    }

    /**
     * Remove a project card from bulk create
     */
    _removeBulkProject(projectIndex) {
        const container = document.getElementById('bulk-projects-container');
        if (!container) return;

        const card = container.querySelector(`[data-project-index="${projectIndex}"]`);
        if (card) {
            card.remove();
            this._updateBulkProjectCount();
        }
    }

    /**
     * Update the project count display
     */
    _updateBulkProjectCount() {
        const container = document.getElementById('bulk-projects-container');
        if (!container) return;

        const count = container.querySelectorAll('.bp-project-card').length;
        // Update count field if needed
        const countField = document.querySelector('[name="bp_project_count"]');
        if (countField) {
            countField.value = count;
        }
    }

    /**
     * Populate custom fields for a bulk project card
     */
    _populateBulkProjectCustomFields(projectIndex, customFields) {
        const container = document.getElementById(`bp-project-${projectIndex}-custom-fields`);
        if (!container || !customFields || customFields.length === 0) return;

        // Group by section
        const fieldsBySection = {};
        customFields.forEach(field => {
            const sectionName = field.section_name || 'Custom Fields';
            if (!fieldsBySection[sectionName]) {
                fieldsBySection[sectionName] = [];
            }
            fieldsBySection[sectionName].push(field);
        });

        // Generate HTML for each section
        Object.entries(fieldsBySection).forEach(([sectionName, fields]) => {
            const sectionHTML = `
                <p class="cc-sub-title" style="margin-top: 16px;">🔧 ${sectionName}</p>
                <div data-custom-section="${sectionName}">
                    ${fields.map(field => this._generateBulkProjectFieldHTML(field, projectIndex)).join('')}
                </div>
            `;
            container.insertAdjacentHTML('beforeend', sectionHTML);
        });
    }

    /**
     * Generate HTML for a bulk project custom field
     */
    _generateBulkProjectFieldHTML(field, projectIndex) {
        const fieldType = field.field_type;
        const fieldName = field.name;
        const constraints = field.constraints || {};
        const inputName = `bp_project_${projectIndex}_custom_${fieldName}`;

        let inputHTML = '';

        switch (fieldType) {
            case 'SHORTTEXT':
            case 'LONGTEXT':
                const maxLength = constraints.max_limit || 500;
                if (fieldType === 'LONGTEXT') {
                    inputHTML = `<textarea name="${inputName}" class="form-textarea" rows="2" maxlength="${maxLength}" data-custom-field="${fieldName}" data-field-type="${fieldType}"></textarea>`;
                } else {
                    inputHTML = `<input type="text" name="${inputName}" class="input-field" maxlength="${maxLength}" data-custom-field="${fieldName}" data-field-type="${fieldType}">`;
                }
                break;

            case 'FLOAT':
            case 'PERCENTAGE':
                const step = '0.01';
                inputHTML = `<input type="number" name="${inputName}" class="input-field" step="${step}" data-custom-field="${fieldName}" data-field-type="${fieldType}">`;
                break;

            case 'DATE':
            case 'DATETIME':
                const dateType = fieldType === 'DATETIME' ? 'datetime-local' : 'date';
                inputHTML = `<input type="${dateType}" name="${inputName}" class="input-field" data-custom-field="${fieldName}" data-field-type="${fieldType}">`;
                break;

            case 'BOOLEAN':
                inputHTML = `
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                        <input type="checkbox" name="${inputName}" value="true" data-custom-field="${fieldName}" data-field-type="${fieldType}">
                        <span>Yes</span>
                    </label>
                `;
                break;

            case 'CHOICE':
                const choices = constraints.choices || [];
                const isMulti = constraints.choice_type === 'MULTI_SELECT';

                if (isMulti) {
                    const optionsHTML = choices.map(choice =>
                        `<label style="display: flex; align-items: center; gap: 6px; padding: 4px 0;">
                            <input type="checkbox" name="${inputName}" value="${choice}" data-custom-field="${fieldName}" data-field-type="${fieldType}">
                            <span>${choice}</span>
                        </label>`
                    ).join('');
                    inputHTML = `<div style="border: 1px solid #d1d5db; border-radius: 4px; padding: 8px; max-height: 120px; overflow-y: auto;">${optionsHTML}</div>`;
                } else {
                    const optionsHTML = choices.map(choice => `<option value="${choice}">${choice}</option>`).join('');
                    inputHTML = `<select name="${inputName}" class="input-field" data-custom-field="${fieldName}" data-field-type="${fieldType}">
                        <option value="">Select...</option>
                        ${optionsHTML}
                    </select>`;
                }
                break;

            default:
                inputHTML = `<input type="text" name="${inputName}" class="input-field" data-custom-field="${fieldName}" data-field-type="${fieldType}">`;
        }

        return `
            <div class="form-group">
                <label>${field.alternate_name || fieldName}</label>
                ${inputHTML}
            </div>
        `;
    }

    /**
     * Builds the payload for project bulk create operation
     */
    _buildProjectsBulkCreatePayload() {
        const form = this.elements.operationForm;
        const get = (name) => form.querySelector(`[name="${name}"]`)?.value?.trim() || '';

        // Get shared configuration
        const createdBy = get('bp_created_by');
        const entityName = get('bp_entity_name');
        const templateName = get('bp_template_name');
        const projectStatus = get('bp_project_status');

        const projects = [];
        const container = document.getElementById('bulk-projects-container');
        if (!container) {
            throw new Error('Projects container not found');
        }

        const cards = container.querySelectorAll('.bp-project-card');
        if (cards.length === 0) {
            throw new Error('At least one project is required');
        }

        cards.forEach((card, index) => {
            const projectIndex = card.dataset.projectIndex;
            const pget = (suffix) => card.querySelector(`[name="bp_project_${projectIndex}_${suffix}"]`)?.value?.trim() || '';

            const project = {
                created_by_user_email: createdBy,
                project_name: pget('name'),
                entity_name: entityName,
                project_status: projectStatus
            };

            // Project codes
            const projectCode = pget('code');
            const erpProjectCode = pget('erp_code');
            if (projectCode) project.project_code = projectCode;
            if (erpProjectCode) project.ERP_project_code = erpProjectCode;

            // Validate at least one code
            if (!projectCode && !erpProjectCode) {
                throw new Error(`Project ${index + 1}: Either Project Code or ERP Project Code is required`);
            }

            // Optional fields
            const customerCode = pget('customer_code');
            const description = pget('description');
            const internalNotes = pget('internal_notes');

            if (customerCode) project.customer_code = customerCode;
            if (templateName) project.template_name = templateName;
            if (description) project.description = description;
            if (internalNotes) project.internal_notes = internalNotes;

            // Dates
            const validityFrom = pget('validity_from');
            const validityTo = pget('validity_to');

            project.validity_from = validityFrom ? new Date(validityFrom).toISOString() : null;
            project.validity_to = validityTo ? new Date(validityTo).toISOString() : null;

            // Custom sections
            project.custom_sections = [];
            const customSectionContainers = card.querySelectorAll('[data-custom-section]');
            customSectionContainers.forEach(sectionContainer => {
                const sectionName = sectionContainer.dataset.customSection;
                const customFields = [];

                const fieldElements = sectionContainer.querySelectorAll('[data-custom-field]');
                fieldElements.forEach(fieldEl => {
                    const fieldName = fieldEl.dataset.customField;
                    const fieldType = fieldEl.dataset.fieldType;
                    let value = null;

                    if (fieldType === 'BOOLEAN') {
                        const checkbox = fieldEl.querySelector('input[type="checkbox"]');
                        value = checkbox ? checkbox.checked : false;
                    } else if (fieldType === 'CHOICE') {
                        const isMulti = fieldEl.querySelectorAll('input[type="checkbox"]').length > 0;
                        if (isMulti) {
                            const checkboxes = fieldEl.querySelectorAll('input[type="checkbox"]:checked');
                            value = Array.from(checkboxes).map(cb => cb.value);
                        } else {
                            const select = fieldEl.querySelector('select');
                            value = select ? select.value : '';
                        }
                    } else if (fieldType === 'DATETIME') {
                        const input = fieldEl.querySelector('input');
                        if (input && input.value) {
                            value = new Date(input.value).toISOString();
                        }
                    } else if (fieldType === 'DATE') {
                        const input = fieldEl.querySelector('input');
                        value = input ? input.value : '';
                    } else {
                        const input = fieldEl.querySelector('input, textarea');
                        value = input ? input.value : '';
                    }

                    if (value !== null && value !== '' && !(Array.isArray(value) && value.length === 0)) {
                        customFields.push({
                            name: fieldName,
                            value: fieldType === 'FLOAT' || fieldType === 'PERCENTAGE' ? parseFloat(value) : value
                        });
                    }
                });

                if (customFields.length > 0) {
                    project.custom_sections.push({
                        name: sectionName,
                        custom_fields: customFields
                    });
                }
            });

            projects.push(project);
        });

        return { projects };
    }

    /**
     * Add a PO item card
     */
    _addPOItem() {
        const container = document.getElementById('po-items-container');
        if (!container) return;

        const itemIndex = container.querySelectorAll('.po-item-card').length;

        const card = document.createElement('div');
        card.className = 'po-item-card cc-item-card';
        card.dataset.itemIndex = itemIndex;

        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <h4 style="margin: 0; font-size: 14px;">📦 Item ${itemIndex + 1}</h4>
                <button type="button" onclick="this.closest('.po-item-card').remove()" class="btn-remove-item">✕</button>
            </div>

            <!-- Item Identification -->
            <div class="form-row">
                <div class="form-group">
                    <label>ERP Item Code</label>
                    <input type="text" name="po_item_${itemIndex}_erp_code" class="input-field" placeholder="ERP code">
                </div>
                <div class="form-group">
                    <label>Factwise Item Code</label>
                    <input type="text" name="po_item_${itemIndex}_fw_code" class="input-field" value="ADGA0001">
                </div>
            </div>

            <!-- Price & Quantity -->
            <div class="form-row">
                <div class="form-group">
                    <label>Price *</label>
                    <input type="number" name="po_item_${itemIndex}_price" class="input-field" required value="78.9" step="0.01">
                </div>
                <div class="form-group">
                    <label>Quantity *</label>
                    <input type="number" name="po_item_${itemIndex}_quantity" class="input-field" required value="100" step="0.01">
                </div>
            </div>

            <div class="form-group">
                <label>Measurement Unit (UUID) *</label>
                <input type="text" name="po_item_${itemIndex}_unit" class="input-field" required value="f16d124e-db59-48fe-a2b8-19f625745cbf">
            </div>

            <!-- Notes -->
            <div class="form-row">
                <div class="form-group">
                    <label>Item Additional Details</label>
                    <input type="text" name="po_item_${itemIndex}_additional_details" class="input-field" placeholder="Additional details">
                </div>
                <div class="form-group">
                    <label>Internal Notes</label>
                    <input type="text" name="po_item_${itemIndex}_internal_notes" class="input-field" placeholder="Internal notes">
                </div>
            </div>

            <div class="form-group">
                <label>External Notes</label>
                <input type="text" name="po_item_${itemIndex}_external_notes" class="input-field" placeholder="External notes">
            </div>

            <!-- Delivery & Payment -->
            <p class="cc-sub-title" style="margin-top: 16px;">🚚 Delivery & Payment</p>

            <div class="form-row">
                <div class="form-group">
                    <label>Incoterm</label>
                    <select name="po_item_${itemIndex}_incoterm" class="input-field">
                        <option value="DAP" selected>DAP</option>
                        <option value="FOB">FOB</option>
                        <option value="CIF">CIF</option>
                        <option value="EXW">EXW</option>
                        <option value="DDP">DDP</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Prepayment %</label>
                    <input type="number" name="po_item_${itemIndex}_prepayment" class="input-field" value="10" step="0.01" min="0" max="100">
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label>Lead Time</label>
                    <input type="number" name="po_item_${itemIndex}_lead_time" class="input-field" value="10" step="0.01">
                </div>
                <div class="form-group">
                    <label>Lead Time Period</label>
                    <select name="po_item_${itemIndex}_lead_time_period" class="input-field">
                        <option value="DAYS" selected>DAYS</option>
                        <option value="WEEKS">WEEKS</option>
                        <option value="MONTHS">MONTHS</option>
                    </select>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label>Payment Type</label>
                    <select name="po_item_${itemIndex}_payment_type" class="input-field">
                        <option value="PER_INVOICE_ITEM" selected>PER_INVOICE_ITEM</option>
                        <option value="PER_DELIVERABLE">PER_DELIVERABLE</option>
                        <option value="ADVANCE">ADVANCE</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Payment Term (number)</label>
                    <input type="number" name="po_item_${itemIndex}_payment_term" class="input-field" value="2">
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label>Payment Period</label>
                    <select name="po_item_${itemIndex}_payment_period" class="input-field">
                        <option value="MONTHS" selected>MONTHS</option>
                        <option value="WEEKS">WEEKS</option>
                        <option value="DAYS">DAYS</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Payment Applied From</label>
                    <select name="po_item_${itemIndex}_payment_applied_from" class="input-field">
                        <option value="INVOICE_DATE" selected>INVOICE_DATE</option>
                        <option value="DISPATCH_DATE">DISPATCH_DATE</option>
                        <option value="RECEIPT_DATE">RECEIPT_DATE</option>
                    </select>
                </div>
            </div>

            <!-- Delivery Schedule -->
            <p class="cc-sub-title" style="margin-top: 16px;">📅 Delivery Schedule</p>

            <div class="form-row">
                <div class="form-group">
                    <label>Delivery Date *</label>
                    <input type="date" name="po_item_${itemIndex}_delivery_date" class="input-field" required value="2026-06-30">
                </div>
                <div class="form-group">
                    <label>Delivery Quantity *</label>
                    <input type="number" name="po_item_${itemIndex}_delivery_quantity" class="input-field" required value="100" step="0.01">
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label>Cost Centre ID</label>
                    <input type="text" name="po_item_${itemIndex}_cost_centre" class="input-field" placeholder="Cost centre ID (optional)">
                </div>
                <div class="form-group">
                    <label>General Ledger ID</label>
                    <input type="text" name="po_item_${itemIndex}_gl" class="input-field" placeholder="GL ID (optional)">
                </div>
            </div>

            <div class="form-group">
                <label>Project ID</label>
                <input type="text" name="po_item_${itemIndex}_project" class="input-field" placeholder="Project ID (optional)">
            </div>
        `;

        container.appendChild(card);
    }

    /**
     * Build PO create payload
     */
    _buildPOCreatePayload() {
        const form = this.elements.operationForm;
        const get = (name) => form.querySelector(`[name="${name}"]`)?.value?.trim() || '';

        // Buyer details
        const buyer_details = {
            entity_name: get('buyer_entity_name'),
            billing_address_id: get('buyer_billing_address'),
            shipping_address_id: get('buyer_shipping_address'),
            identifications: get('buyer_identifications') ? get('buyer_identifications').split(',').map(s => s.trim()).filter(s => s) : [],
            contacts: get('buyer_contacts') ? get('buyer_contacts').split(',').map(s => s.trim()).filter(s => s) : []
        };

        // Seller details
        const seller_details = {
            ERP_vendor_code: get('seller_erp_vendor_code') || null,
            factwise_vendor_code: get('seller_factwise_vendor_code') || null,
            seller_address_id: get('seller_address_id') || null,
            seller_full_address: get('seller_full_address') || "",
            identifications: get('seller_identifications') ? get('seller_identifications').split(',').map(s => s.trim()).filter(s => s) : [],
            contacts: get('seller_contacts') ? get('seller_contacts').split(',').map(s => s.trim()).filter(s => s) : []
        };

        // PO details
        const purchase_order_details = {
            created_by_user_email: get('created_by_user_email'),
            ERP_po_id: get('ERP_po_id'),
            status: get('po_status'),
            template_name: get('template_name') || null,
            issue_date: get('issue_date') || null,
            accepted_date: get('accepted_date') || null,
            currency_code: get('currency_code'),
            notes: get('po_notes') || "",
            event: get('po_event') || null,
            terms_and_conditions: {
                name: get('tnc_name') || "FactWise Default TNC",
                data: get('tnc_data') || "<p>Acceptance of order...</p>"
            },
            additional_costs: [],
            taxes: [],
            discounts: [],
            custom_sections: []
        };

        // PO items
        const purchase_order_items = [];
        const container = document.getElementById('po-items-container');
        if (container) {
            const cards = container.querySelectorAll('.po-item-card');
            cards.forEach(card => {
                const idx = card.dataset.itemIndex;
                const iget = (suffix) => card.querySelector(`[name="po_item_${idx}_${suffix}"]`)?.value?.trim() || '';

                const item = {
                    ERP_item_code: iget('erp_code') || null,
                    factwise_item_code: iget('fw_code') || null,
                    item_additional_details: iget('additional_details') || "",
                    internal_notes: iget('internal_notes') || "",
                    external_notes: iget('external_notes') || "",
                    price: parseFloat(iget('price')) || 0,
                    quantity: parseFloat(iget('quantity')) || 0,
                    measurement_unit: iget('unit'),
                    incoterm: iget('incoterm') || null,
                    prepayment_percentage: parseFloat(iget('prepayment')) || 0,
                    lead_time: iget('lead_time') || null,
                    lead_time_period: iget('lead_time_period') || null,
                    payment_type: iget('payment_type') || null,
                    payment_terms: {
                        term: parseInt(iget('payment_term')) || 0,
                        period: iget('payment_period') || "MONTHS",
                        applied_from: iget('payment_applied_from') || "INVOICE_DATE"
                    },
                    deliverables_payment_terms: [],
                    delivery_schedules: [{
                        delivery_date: iget('delivery_date') || null,
                        quantity: iget('delivery_quantity') || iget('quantity') || "0",
                        cost_centre_id: iget('cost_centre') || null,
                        general_ledger_id: iget('gl') || null,
                        project_id: iget('project') || null
                    }],
                    additional_costs: [],
                    taxes: [],
                    discounts: [],
                    custom_sections: [],
                    attachments: []
                };

                purchase_order_items.push(item);
            });
        }

        if (purchase_order_items.length === 0) {
            throw new Error('At least one PO item is required');
        }

        return {
            buyer_details,
            seller_details,
            purchase_order_details,
            purchase_order_items,
            attachments: []
        };
    }

    /**
     * Build PO terminate payload
     */
    _buildPOTerminatePayload() {
        const form = this.elements.operationForm;
        const get = (name) => form.querySelector(`[name="${name}"]`)?.value?.trim() || '';

        const payload = {
            modified_by_user_email: get('modified_by_user_email'),
            status: get('termination_status'),
            notes: get('termination_notes') || ""
        };

        // PO IDs (at least one required)
        const erpPoId = get('ERP_po_id');
        const factwisePoId = get('factwise_po_id');

        if (erpPoId) payload.ERP_po_id = erpPoId;
        if (factwisePoId) payload.factwise_po_id = factwisePoId;

        // Validate at least one PO ID
        if (!erpPoId && !factwisePoId) {
            throw new Error('Either ERP PO ID or Factwise PO ID is required');
        }

        // Validate status is selected
        if (!payload.status) {
            throw new Error('Status is required');
        }

        return payload;
    }

    /**
     * Build PO state update payload
     */
    _buildPOStatePayload() {
        const form = this.elements.operationForm;
        const get = (name) => form.querySelector(`[name="${name}"]`)?.value?.trim() || '';

        const payload = {
            modified_by_user_email: get('modified_by_user_email'),
            status: get('po_state_status'),
            notes: get('po_state_notes') || ""
        };

        // PO IDs (at least one required)
        const erpPoId = get('ERP_po_id');
        const factwisePoId = get('factwise_po_id');

        if (erpPoId) payload.ERP_po_id = erpPoId;
        if (factwisePoId) payload.factwise_po_id = factwisePoId;

        // Validate at least one PO ID
        if (!erpPoId && !factwisePoId) {
            throw new Error('Either ERP PO ID or Factwise PO ID is required');
        }

        // Validate status is selected
        if (!payload.status) {
            throw new Error('Status is required');
        }

        return payload;
    }

    /**
     * Generates a Postman pre-request script that dynamically builds the bulk payload.
     * Reads shared config + first item card as the template, then generates a loop.
     */
    _generateBulkItemScript() {
        const form = this.elements.operationForm;
        const get = (name) => form.querySelector(`[name="${name}"]`)?.value?.trim() || '';
        const t = this._getBulkToggles();

        const createdBy = get('bi_created_by');
        const entityName = get('bi_entity_name') || 'FactWise';

        // Use the item count field for the script range
        const count = Math.max(1, parseInt(get('bi_item_count')) || 1);

        // Pull default values from first item card
        const container = document.getElementById('bulk-items-container');
        const cards = container ? container.querySelectorAll('.bi-item-card') : [];
        const cget = (suffix) => cards[0]?.querySelector(`[name="bi_item_0_${suffix}"]`)?.value?.trim() || '';

        const unitId = cget('unit_id') || '66d42245-5a0d-4801-8cb2-43bf627f7cbe';
        const currencyId = cget('buyer_currency') || cget('currency_id') || '0f6c64c3-0ec3-482e-9dc2-7e20b6431bda';
        const itemType = cget('item_type') || 'RAW_MATERIAL';
        const status = cget('status') || 'ACTIVE';
        const buyerPrice = parseFloat(cget('buyer_price')) || 1000;
        const sellerPrice = parseFloat(cget('seller_price')) || 1200;
        const tagsRaw = cget('tags') || 'API, NG_TEST';
        const hsn = cget('hsn') || '8471';
        const vendor = cget('vendor') || 'V0029';
        const attrName = cget('attr_name') || 'color';
        const attrValue = cget('attr_value') || 'Red';

        const tags = tagsRaw.split(',').map(s => s.trim()).filter(Boolean);

        // Build conditional blocks
        const buyerBlock = t.buyer ? `
        is_buyer: true,
        buyer_pricing_information: {
            price: ${buyerPrice},
            currency_code_id: "${currencyId}",
            additional_costs: [],
            taxes: []
        },` : `
        is_buyer: false,
        buyer_pricing_information: null,`;

        const sellerBlock = t.seller ? `
        is_seller: true,
        seller_pricing_information: {
            price: ${sellerPrice},
            currency_code_id: "${currencyId}",
            additional_costs: [],
            taxes: []
        },` : `
        is_seller: false,
        seller_pricing_information: null,`;

        const tagsLine = t.tags ? JSON.stringify(tags) : 'null';
        const attrLine = t.attributes
            ? `[{ attribute_name: "${attrName}", attribute_type: "TEXT", attribute_value: [{ value: "${attrValue}" }] }]`
            : 'null';
        const customIds = (t.hsn && hsn) ? `[{ name: "HSN", value: "${hsn}" }]` : 'null';
        const vendorArr = (t.vendor && vendor) ? `["${vendor}"]` : '[]';

        const script = `// Postman Pre-request Script — Items Bulk Create
// Generated by The cURLer at ${new Date().toISOString()}
// Adjust startIndex and endIndex to control how many items are created.

const startIndex = 1;
const endIndex = ${count};

function generateItem(i) {
    return {
        created_by_user_email: "${createdBy}",
        name: \`Test Item Bulk \${i}\`,
        ERP_item_code: \`ERP-ITEM-BULK-\${Date.now()}-\${i}\`,
        factwise_item_code: \`BKT-BULK-\${Date.now()}-\${i}\`,
        description: "Item created via open API",
        notes: "Testing taxes and additional costs",
        internal_notes: "Internal testing item",
        measurement_units: ["${unitId}"],
        item_type: "${itemType}",
        status: "${status}",
        attributes: ${attrLine},${buyerBlock}${sellerBlock}
        custom_ids: ${customIds},
        tags: ${tagsLine},
        entities: [
            {
                entity_name: "${entityName}",
                ERP_preferred_vendors: [],
                factwise_preferred_vendors: ${vendorArr}
            }
        ],
        custom_sections: []
    };
}

const items = [];
for (let i = startIndex; i <= endIndex; i++) {
    items.push(generateItem(i));
}

pm.variables.set("bulkPayload", JSON.stringify({ items }, null, 2));
// In your Postman request body, set Body > raw > JSON to: {{bulkPayload}}
`;
        return script;
    }

    /**
     * Handles the "Generate Script" button click.
     * Shows the generated Postman script in the cURL output panel.
     */
    handleGenerateScript() {
        try {
            const script = this._generateBulkItemScript();

            // Show in the cURL panel (re-using it for script output)
            const panel = this.elements.actionsSection;
            const display = this.elements.curlDisplay;
            const header = panel.querySelector('h3');
            if (header) header.textContent = 'Generated Postman Script';

            display.innerHTML = `<pre><code>${this._escapeHtml(script)}</code></pre>`;
            panel.classList.remove('hidden');
            this.elements.responseSection.classList.add('hidden');

            panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } catch (err) {
            this._displayError(err.message);
        }
    }

    _setupContractCreateListeners() {
        // Store reference to this for use in global functions
        window.uiController = this;

        // Load templates dropdown
        this._loadTemplates();

        // Template selector change listener
        const templateSelect = document.getElementById('template_name_select');
        if (templateSelect) {
            templateSelect.addEventListener('change', (e) => {
                this._handleTemplateChange(e.target.value);
            });
        }

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
                                       value="BKT112">
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
                                <input type="number" name="item_${itemIndex}_rate" class="input-field" value="10" step="0.01">
                            </div>
                            <div class="form-group">
                                <label>Quantity</label>
                                <input type="number" name="item_${itemIndex}_quantity" class="input-field" value="1000" step="0.01">
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
                            <input type="number" name="item_${itemIndex}_tier_${i}_rate" class="input-field" value="10" step="0.01">
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

    // ============================================================
    // VENDOR CONTACT CREATE HELPERS
    // ============================================================

    _addVendorContactEmail() {
        const container = document.getElementById('additional-emails-container');
        const index = container.children.length;
        const html = `
            <div class="cc-custom-item" style="display: flex; gap: 10px; align-items: flex-start; margin-bottom: 10px;">
                <div class="form-group" style="flex: 2; margin: 0;">
                    <label>Email Address</label>
                    <input type="email" name="contact_email_${index}_address" class="input-field" placeholder="e.g., contact@vendor.com">
                </div>
                <div class="form-group" style="flex: 1; margin: 0;">
                    <label>Type</label>
                    <select name="contact_email_${index}_type" class="input-field">
                        <option value="TO">TO</option>
                        <option value="CC">CC</option>
                        <option value="BCC">BCC</option>
                    </select>
                </div>
                <button type="button" onclick="this.parentElement.remove()" 
                    style="margin-top: 24px; padding: 8px 12px; background: #ef4444; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    ✕
                </button>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', html);
    }

    _addVendorContactEmailUpdate() {
        const container = document.getElementById('additional-emails-container-update');
        const index = container.children.length;
        const html = `
            <div class="cc-custom-item" style="display: flex; gap: 10px; align-items: flex-start; margin-bottom: 10px;">
                <div class="form-group" style="flex: 2; margin: 0;">
                    <label>Email Address</label>
                    <input type="email" name="contact_email_update_${index}_address" class="input-field" placeholder="e.g., contact@vendor.com">
                </div>
                <div class="form-group" style="flex: 1; margin: 0;">
                    <label>Type</label>
                    <select name="contact_email_update_${index}_type" class="input-field">
                        <option value="TO">TO</option>
                        <option value="CC">CC</option>
                        <option value="BCC">BCC</option>
                    </select>
                </div>
                <button type="button" onclick="this.parentElement.remove()" 
                    style="margin-top: 24px; padding: 8px 12px; background: #ef4444; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    ✕
                </button>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', html);
    }

    _addVendorCost() {
        const container = document.getElementById('vendor-costs-container');
        const index = container.children.length;
        const html = `
            <div class="cc-custom-item" style="display: flex; gap: 10px; align-items: flex-start; margin-bottom: 10px;">
                <div class="form-group" style="flex: 2; margin: 0;">
                    <label>Cost Name</label>
                    <input type="text" name="cost_${index}_name" class="input-field" placeholder="e.g., ffff">
                </div>
                <div class="form-group" style="flex: 1; margin: 0;">
                    <label>Value</label>
                    <input type="number" name="cost_${index}_value" class="input-field" step="0.01" placeholder="e.g., 10">
                </div>
                <button type="button" onclick="this.parentElement.remove()" 
                    style="margin-top: 24px; padding: 8px 12px; background: #ef4444; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    ✕
                </button>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', html);
    }

    _addVendorSecondaryContact() {
        const container = document.getElementById('vendor-secondary-contacts-container');
        const index = container.children.length;
        const html = `
            <div class="cc-custom-item" style="padding: 15px; border: 1px solid #e2e8f0; border-radius: 6px; margin-bottom: 10px;">
                <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 10px;">
                    <strong>Secondary Contact ${index + 1}</strong>
                    <button type="button" onclick="this.parentElement.parentElement.remove()" 
                        style="padding: 4px 8px; background: #ef4444; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
                        Remove
                    </button>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Full Name</label>
                        <input type="text" name="secondary_${index}_full_name" class="input-field">
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" name="secondary_${index}_email" class="input-field">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Phone Numbers (comma-separated)</label>
                        <input type="text" name="secondary_${index}_phone_numbers" class="input-field">
                    </div>
                    <div class="form-group">
                        <label>Email Type</label>
                        <select name="secondary_${index}_email_type" class="input-field">
                            <option value="TO">TO</option>
                            <option value="CC">CC</option>
                            <option value="BCC">BCC</option>
                        </select>
                    </div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', html);
    }

    _addVendorCustomSection() {
        const container = document.getElementById('vendor-custom-sections-container');
        const index = container.children.length;
        const html = `
            <div class="cc-custom-item" style="padding: 15px; border: 1px solid #e2e8f0; border-radius: 6px; margin-bottom: 10px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <strong>Custom Section ${index + 1}</strong>
                    <button type="button" onclick="this.parentElement.parentElement.remove()" 
                        style="padding: 4px 8px; background: #ef4444; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
                        Remove
                    </button>
                </div>
                <div class="form-group">
                    <label>Section Name</label>
                    <input type="text" name="custom_section_${index}_name" class="input-field" placeholder="e.g., Item Details">
                </div>
                <div class="form-group">
                    <label>Custom Fields (JSON format)</label>
                    <textarea name="custom_section_${index}_fields" class="form-textarea" rows="3" placeholder='[{"name":"Field Name","value":"Field Value"}]'></textarea>
                    <small style="color: #64748b; font-size: 11px;">Enter custom fields as JSON array</small>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', html);
    }

    _populateVendorCustomFields(customFields) {
        const container = document.getElementById('vendor-custom-fields-container');
        if (!container || !customFields || customFields.length === 0) return;

        // Add section title
        const sectionTitle = `
            <div class="form-section-title">
                <span class="fst-icon">🔧</span>
                <h4>Custom Fields</h4>
                <span class="fst-badge" style="background: #94a3b8;">From Template</span>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', sectionTitle);

        // Generate fields in rows of 2
        let fieldsHTML = '<div class="form-row">';
        customFields.forEach((field, index) => {
            const fieldHTML = this.templateManager.generateFieldHTML(field, 'vendor');
            fieldsHTML += fieldHTML;

            // Close row after every 2 fields
            if ((index + 1) % 2 === 0 && index < customFields.length - 1) {
                fieldsHTML += '</div><div class="form-row">';
            }
        });
        fieldsHTML += '</div>';

        container.insertAdjacentHTML('beforeend', fieldsHTML);
        console.log('✓ Populated', customFields.length, 'custom fields for vendor');
    }

    _addItemAttribute() {
        const container = document.getElementById('item-attributes-container');
        const index = container.children.length;
        const html = `
            <div class="cc-custom-item" style="display: flex; gap: 10px; align-items: flex-start; margin-bottom: 10px;">
                <div class="form-group" style="flex: 1; margin: 0;">
                    <label>Attribute Name</label>
                    <input type="text" name="attr_${index}_name" class="input-field" placeholder="e.g., Raw material">
                </div>
                <div class="form-group" style="flex: 1; margin: 0;">
                    <label>Attribute Type</label>
                    <select name="attr_${index}_type" class="input-field">
                        <option value="TEXT">TEXT</option>
                        <option value="NUMBER">NUMBER</option>
                        <option value="DATE">DATE</option>
                    </select>
                </div>
                <div class="form-group" style="flex: 1; margin: 0;">
                    <label>Attribute Value</label>
                    <input type="text" name="attr_${index}_value" class="input-field" placeholder="e.g., Coagulum">
                </div>
                <button type="button" onclick="this.parentElement.remove()" 
                    style="margin-top: 24px; padding: 8px 12px; background: #ef4444; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    ✕
                </button>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', html);
    }

    _populateItemCreateCustomFields(customFields) {
        const container = document.getElementById('item-create-custom-fields-container');
        if (!container || !customFields || customFields.length === 0) return;

        // Add section title
        const sectionTitle = `
            <div class="form-section-title">
                <span class="fst-icon">🔧</span>
                <h4>Custom Fields</h4>
                <span class="fst-badge" style="background: #94a3b8;">From Template</span>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', sectionTitle);

        // Generate fields in rows of 2
        let fieldsHTML = '<div class="form-row">';
        customFields.forEach((field, index) => {
            const fieldHTML = this.templateManager.generateFieldHTML(field, 'item_create');
            fieldsHTML += fieldHTML;

            // Close row after every 2 fields
            if ((index + 1) % 2 === 0 && index < customFields.length - 1) {
                fieldsHTML += '</div><div class="form-row">';
            }
        });
        fieldsHTML += '</div>';

        container.insertAdjacentHTML('beforeend', fieldsHTML);
        console.log('✓ Populated', customFields.length, 'custom fields for item create');
    }

    /**
     * Load project templates from API
     * @private
     */
    async _loadProjectTemplates() {
        try {
            // Get token
            let token = this.factwiseIntegration?.getToken() || this.tokenManager.getToken();

            if (!token) {
                console.error('No token available for project templates API');
                return null;
            }

            const baseUrl = this.environmentManager.getFactwiseBaseUrl();
            const url = `${baseUrl}module_templates/?template_type=PROJECT`;

            console.log('✓ Fetching project templates from:', url);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                console.error('Failed to fetch project templates:', response.status, response.statusText);
                return null;
            }

            const data = await response.json();
            console.log('✓ Loaded project templates response:', data);

            // API returns an array with one object containing templates
            const responseData = Array.isArray(data) ? data[0] : data;
            const templates = responseData.templates || [];
            console.log('✓ Project templates array:', templates);

            // Store templates in templateManager
            if (this.templateManager && templates.length > 0) {
                this.templateManager.projectTemplates = templates;
                console.log('✓ Stored', templates.length, 'project templates in TemplateManager');

                // Parse the first (default) template
                const defaultTemplate = templates[0];
                const config = this.templateManager.parseProjectTemplateConfig(defaultTemplate);
                this.templateManager.projectTemplateConfig = config;
                console.log('✓ Parsed project template config:', config);

                return config;
            }

            return null;

        } catch (error) {
            console.error('Error loading project templates:', error);
            return null;
        }
    }

    /**
     * Populate custom fields for project create form
     * @param {Array} customFields - Array of custom field definitions from template
     * @private
     */
    _populateProjectCreateCustomFields(customFields) {
        const container = document.getElementById('project-create-custom-fields-container');
        if (!container || !customFields || customFields.length === 0) return;

        // Group custom fields by section
        const fieldsBySection = {};
        customFields.forEach(field => {
            const sectionName = field.section_name || 'Custom Fields';
            if (!fieldsBySection[sectionName]) {
                fieldsBySection[sectionName] = [];
            }
            fieldsBySection[sectionName].push(field);
        });

        // Generate HTML for each section
        Object.entries(fieldsBySection).forEach(([sectionName, fields]) => {
            const sectionHTML = `
                <div class="form-section-title">
                    <span class="fst-icon">🔧</span>
                    <h4>${sectionName}</h4>
                    <span class="fst-badge" style="background: #94a3b8;">From Template</span>
                </div>
                <div data-custom-section="${sectionName}">
                    ${fields.map(field => this._generateProjectCustomFieldHTML(field)).join('')}
                </div>
            `;
            container.insertAdjacentHTML('beforeend', sectionHTML);
        });

        console.log('✓ Populated', customFields.length, 'custom fields for project create');
    }

    /**
     * Generate HTML for a project custom field
     * @param {Object} field - Field configuration
     * @returns {string} HTML string
     * @private
     */
    _generateProjectCustomFieldHTML(field) {
        const fieldType = field.field_type;
        const fieldName = field.name;
        const constraints = field.constraints || {};

        let inputHTML = '';

        switch (fieldType) {
            case 'SHORTTEXT':
            case 'LONGTEXT':
                const maxLength = constraints.max_limit || 500;
                const inputType = fieldType === 'LONGTEXT' ? 'textarea' : 'input';
                if (inputType === 'textarea') {
                    inputHTML = `<textarea name="custom_${fieldName}" class="form-textarea" rows="3" maxlength="${maxLength}" data-custom-field="${fieldName}" data-field-type="${fieldType}"></textarea>`;
                } else {
                    inputHTML = `<input type="text" name="custom_${fieldName}" class="input-field" maxlength="${maxLength}" data-custom-field="${fieldName}" data-field-type="${fieldType}">`;
                }
                break;

            case 'FLOAT':
            case 'PERCENTAGE':
                const step = fieldType === 'PERCENTAGE' ? '0.01' : '0.01';
                inputHTML = `<input type="number" name="custom_${fieldName}" class="input-field" step="${step}" data-custom-field="${fieldName}" data-field-type="${fieldType}">`;
                break;

            case 'DATE':
            case 'DATETIME':
                const dateType = fieldType === 'DATETIME' ? 'datetime-local' : 'date';
                inputHTML = `<input type="${dateType}" name="custom_${fieldName}" class="input-field" data-custom-field="${fieldName}" data-field-type="${fieldType}">`;
                break;

            case 'BOOLEAN':
                inputHTML = `
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                        <input type="checkbox" name="custom_${fieldName}" value="true" data-custom-field="${fieldName}" data-field-type="${fieldType}">
                        <span>Yes</span>
                    </label>
                `;
                break;

            case 'CHOICE':
                const choices = constraints.choices || [];
                const isMulti = constraints.choice_type === 'MULTI_SELECT';

                if (isMulti) {
                    const optionsHTML = choices.map(choice =>
                        `<label style="display: flex; align-items: center; gap: 6px; padding: 4px 0;">
                            <input type="checkbox" name="custom_${fieldName}" value="${choice}" data-custom-field="${fieldName}" data-field-type="${fieldType}">
                            <span>${choice}</span>
                        </label>`
                    ).join('');
                    inputHTML = `<div style="border: 1px solid #d1d5db; border-radius: 4px; padding: 8px; max-height: 150px; overflow-y: auto;">${optionsHTML}</div>`;
                } else {
                    const optionsHTML = choices.map(choice => `<option value="${choice}">${choice}</option>`).join('');
                    inputHTML = `<select name="custom_${fieldName}" class="input-field" data-custom-field="${fieldName}" data-field-type="${fieldType}">
                        <option value="">Select...</option>
                        ${optionsHTML}
                    </select>`;
                }
                break;

            default:
                inputHTML = `<input type="text" name="custom_${fieldName}" class="input-field" data-custom-field="${fieldName}" data-field-type="${fieldType}">`;
        }

        return `
            <div class="form-group" data-custom-field="${fieldName}" data-field-type="${fieldType}">
                <label>${field.alternate_name || fieldName}</label>
                ${inputHTML}
            </div>
        `;
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
        const invalidFields = [];

        // Remove all existing error classes first
        this.elements.operationForm.querySelectorAll('.field-error').forEach(field => {
            field.classList.remove('field-error');
        });

        inputs.forEach(input => {
            if (!input.value.trim()) {
                allValid = false;
                invalidFields.push(input);
            }
        });

        // Update Button Text (but NEVER disable - this is a testing tool!)
        if (this.elements.btnExecute) {
            this.elements.btnExecute.textContent = allValid ? "Execute Request" : "Execute Incomplete Request";
            // Execute button is ALWAYS enabled - users can test with incomplete data
        }

        if (this.elements.btnGenerate) {
            this.elements.btnGenerate.textContent = allValid ? "Generate cURL" : "Generate Incomplete cURL";
            // Generate button is ALWAYS enabled
        }

        return { valid: allValid, invalidFields };
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
        // Check form validity and highlight incomplete fields
        const validationResult = this.checkFormValidity();

        // If form is incomplete, add error styling to invalid fields
        if (!validationResult.valid && validationResult.invalidFields) {
            validationResult.invalidFields.forEach(field => {
                field.classList.add('field-error');

                // Remove error class when user starts typing
                const removeError = () => {
                    field.classList.remove('field-error');
                    field.removeEventListener('input', removeError);
                    field.removeEventListener('change', removeError);
                };
                field.addEventListener('input', removeError);
                field.addEventListener('change', removeError);
            });

            // Scroll to first invalid field
            if (validationResult.invalidFields.length > 0) {
                validationResult.invalidFields[0].scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        }

        // Generate cURL (even if incomplete - will use null for missing values)
        const curl = this._generateCurlCommand();
        this.elements.curlDisplay.innerHTML = `<pre><code>${this._escapeHtml(curl)}</code></pre>`;

        // Reset panel header (may have been changed by Generate Script)
        const panelHeader = this.elements.actionsSection.querySelector('h3');
        if (panelHeader) panelHeader.textContent = 'Generated cURL';

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
        // Check form validity and highlight incomplete fields (non-blocking)
        const validationResult = this.checkFormValidity();

        // If form is incomplete, add error styling to invalid fields (but still allow execution)
        if (!validationResult.valid && validationResult.invalidFields) {
            validationResult.invalidFields.forEach(field => {
                field.classList.add('field-error');

                // Remove error class when user starts typing
                const removeError = () => {
                    field.classList.remove('field-error');
                    field.removeEventListener('input', removeError);
                    field.removeEventListener('change', removeError);
                };
                field.addEventListener('input', removeError);
                field.addEventListener('change', removeError);
            });

            // Scroll to first invalid field
            if (validationResult.invalidFields.length > 0) {
                validationResult.invalidFields[0].scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        }

        try {
            // Get current environment and operation
            const env = this.environmentManager.getCurrentEnvironment();
            const op = this.moduleRegistry.getOperation(this.currentModule, this.currentOperation);

            if (!op) {
                throw new Error('Operation not found');
            }

            console.log('handleExecute - Module:', this.currentModule, 'Operation:', this.currentOperation);

            // Build payload based on operation
            let payload = null;
            if (this.currentModule === 'contract') {
                payload = this._buildContractPayload(op);
            } else if (this.currentModule === 'items' && this.currentOperation === 'bulk_create') {
                payload = this._buildItemsBulkCreatePayload();
            } else if (this.currentModule === 'items' && this.currentOperation === 'create') {
                payload = this._buildItemCreatePayload();
            } else if (this.currentModule === 'vendors' && this.currentOperation === 'contacts_create') {
                payload = this._buildVendorContactCreatePayload();
            } else if (this.currentModule === 'vendors' && this.currentOperation === 'contacts_update') {
                payload = this._buildVendorContactUpdatePayload();
            } else if (this.currentModule === 'vendors' && this.currentOperation === 'contacts_delete') {
                payload = this._buildVendorContactDeletePayload();
            } else if (this.currentModule === 'vendors' && this.currentOperation === 'state') {
                payload = this._buildVendorStatePayload();
            } else if (this.currentModule === 'vendors' && this.currentOperation === 'create') {
                payload = this._buildVendorCreatePayload();
            } else if (this.currentModule === 'items' && this.currentOperation === 'update_state') {
                payload = this._buildItemStatePayload();
            } else if (this.currentModule === 'projects' && this.currentOperation === 'create') {
                payload = this._buildProjectCreatePayload();
            } else if (this.currentModule === 'projects' && this.currentOperation === 'bulk_create') {
                payload = this._buildProjectsBulkCreatePayload();
            } else if (this.currentModule === 'purchase_order' && this.currentOperation === 'create') {
                console.log('Building PO create payload...');
                payload = this._buildPOCreatePayload();
            } else if (this.currentModule === 'purchase_order' && this.currentOperation === 'terminate') {
                console.log('Building PO terminate payload...');
                payload = this._buildPOTerminatePayload();
            } else if (this.currentModule === 'purchase_order' && this.currentOperation === 'state') {
                console.log('Building PO state payload...');
                payload = this._buildPOStatePayload();
            } else {
                // For non-Contract operations, use form inputs (Phase 1 behavior)
                payload = this._collectFormData();
            }

            console.log('Built payload:', payload);

            // Generate cURL
            const curl = this._generateCurlCommandWithPayload(env, op, payload);
            this.elements.curlDisplay.innerHTML = `<pre><code>${this._escapeHtml(curl)}</code></pre>`;

            // Show both panels
            this.elements.actionsSection.classList.remove('hidden');
            this.elements.responseSection.classList.remove('hidden');

            // Execute real API call for Contract + Items + Vendor + Project + PO operations
            const shouldExecuteAPI = this.currentModule === 'contract' ||
                (this.currentModule === 'items' && ['bulk_create', 'update_state', 'create'].includes(this.currentOperation)) ||
                (this.currentModule === 'vendors' && ['contacts_create', 'contacts_update', 'contacts_delete', 'state', 'create'].includes(this.currentOperation)) ||
                (this.currentModule === 'projects' && ['create', 'bulk_create'].includes(this.currentOperation)) ||
                (this.currentModule === 'purchase_order' && ['create', 'terminate', 'state'].includes(this.currentOperation));

            console.log('Should execute API?', shouldExecuteAPI, 'Module:', this.currentModule, 'Op:', this.currentOperation);

            if (shouldExecuteAPI) {
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
            // Build payload matching the expected API format from PAYLOAD_EXAMPLES.md
            const payload = {
                created_by_user_email: form.querySelector('[name="buyer_contact"]')?.value || this.currentAccount?.user_email || null,
                contract_name: form.querySelector('[name="contract_name"]')?.value || null,
                ERP_contract_id: form.querySelector('[name="ERP_contract_id"]')?.value || null,
                factwise_contract_id: form.querySelector('[name="factwise_contract_id"]')?.value || null,
                contract_start_date: form.querySelector('[name="contract_start_date"]')?.value || null,
                contract_end_date: form.querySelector('[name="contract_end_date"]')?.value || null,
                entity_name: form.querySelector('[name="entity_name"]')?.value || null,
                status: form.querySelector('[name="status"]')?.value || null,
                template_name: form.querySelector('[name="template_name"]')?.value || "Default Template",
                buyer_identifications: (form.querySelector('[name="buyer_identifications"]')?.value || '').split(',').map(s => s.trim()).filter(s => s),
                buyer_address: form.querySelector('[name="buyer_address"]')?.value || null,
                buyer_contact: form.querySelector('[name="buyer_contact"]')?.value || null,
                factwise_vendor_code: form.querySelector('[name="factwise_vendor_code"]')?.value || null,
                ERP_vendor_code: form.querySelector('[name="ERP_vendor_code"]')?.value || null,
                vendor_contact: form.querySelector('[name="vendor_contact"]')?.value || null,
                vendor_identifications: [
                    {
                        identification_name: form.querySelector('[name="vendor_identification_name"]')?.value || null,
                        identification_value: form.querySelector('[name="vendor_identification_value"]')?.value || null
                    }
                ],
                vendor_address: {
                    address_id: form.querySelector('[name="vendor_address_id"]')?.value || null,
                    full_address: form.querySelector('[name="vendor_full_address"]')?.value || null
                },
                project: form.querySelector('[name="project"]')?.value || null,
                additional_costs: [],
                taxes: [],
                discounts: [],
                prepayment_percentage: parseFloat(form.querySelector('[name="prepayment_percentage"]')?.value) || 0,
                payment_type: form.querySelector('[name="payment_type"]')?.value || null,
                payment_terms: {
                    term: parseInt(form.querySelector('[name="payment_term"]')?.value) || 0,
                    period: form.querySelector('[name="payment_period"]')?.value || "MONTHS",
                    applied_from: form.querySelector('[name="payment_applied_from"]')?.value || "INVOICE_DATE"
                },
                deliverables_payment_terms: [],
                incoterm: form.querySelector('[name="incoterm"]')?.value || null,
                lead_time: form.querySelector('[name="lead_time"]')?.value || null,
                lead_time_period: form.querySelector('[name="lead_time_period"]')?.value || null,
                custom_sections: [],
                attachments: [],
                terms_and_conditions: {
                    data: "",
                    name: "FactWise Default TNC"
                },
                contract_items: []
            };

            // Collect contract-level costs if enabled
            const contractCostsContainer = form.querySelector('#contract-costs-container');
            if (contractCostsContainer) {
                const costRows = contractCostsContainer.querySelectorAll('.cc-cost-row');
                costRows.forEach(row => {
                    const type = row.querySelector('[name$="_type"]')?.value;
                    const name = row.querySelector('[name$="_name"]')?.value;
                    const value = parseFloat(row.querySelector('[name$="_value"]')?.value);

                    if (name && !isNaN(value)) {
                        const costItem = { name, value };
                        if (type === 'cost') payload.additional_costs.push(costItem);
                        else if (type === 'tax') payload.taxes.push(costItem);
                        else if (type === 'discount') payload.discounts.push(costItem);
                    }
                });
            }

            // Collect contract-level custom sections if enabled
            const contractCustomContainer = form.querySelector('#contract-custom-container');
            if (contractCustomContainer) {
                const customSections = contractCustomContainer.querySelectorAll('.cc-custom-section');
                customSections.forEach(section => {
                    const sectionName = section.querySelector('[name$="_section_name"]')?.value;
                    if (sectionName) {
                        payload.custom_sections.push({
                            name: sectionName,
                            custom_fields: []
                        });
                    }
                });
            }

            // Collect contract items
            const itemsContainer = form.querySelector('#contract-items-container');
            if (itemsContainer) {
                const itemCards = itemsContainer.querySelectorAll('.cc-item-card');
                itemCards.forEach((card, index) => {
                    const item = {
                        ERP_item_code: card.querySelector(`[name="item_${index}_erp_code"]`)?.value || null,
                        factwise_item_code: card.querySelector(`[name="item_${index}_factwise_code"]`)?.value,
                        currency_code_id: card.querySelector(`[name="item_${index}_currency_id"]`)?.value,
                        measurement_unit_id: card.querySelector(`[name="item_${index}_unit_id"]`)?.value,
                        attributes: [],
                        rate: parseFloat(card.querySelector(`[name="item_${index}_rate"]`)?.value) || 0,
                        quantity: parseFloat(card.querySelector(`[name="item_${index}_quantity"]`)?.value) || 0,
                        pricing_tiers: [],
                        prepayment_percentage: parseFloat(card.querySelector(`[name="item_${index}_prepayment"]`)?.value) || 0,
                        payment_type: card.querySelector(`[name="item_${index}_payment_type"]`)?.value || "PER_INVOICE_ITEM",
                        payment_terms: {
                            term: parseInt(card.querySelector(`[name="item_${index}_payment_term"]`)?.value) || 1,
                            period: card.querySelector(`[name="item_${index}_payment_period"]`)?.value || "MONTHS",
                            applied_from: card.querySelector(`[name="item_${index}_payment_applied_from"]`)?.value || "INVOICE_DATE"
                        },
                        deliverables_payment_terms: [],
                        incoterm: card.querySelector(`[name="item_${index}_incoterm"]`)?.value || "NA",
                        lead_time: card.querySelector(`[name="item_${index}_lead_time"]`)?.value || null,
                        lead_time_period: card.querySelector(`[name="item_${index}_lead_time_period"]`)?.value || null,
                        additional_costs: [],
                        taxes: [],
                        discounts: [],
                        attachments: [],
                        custom_sections: []
                    };

                    // Collect pricing tiers for this item
                    const tiersContainer = card.querySelector(`#tiers-container-${index}`);
                    if (tiersContainer) {
                        const tierRows = tiersContainer.querySelectorAll('.cc-tier-card');
                        tierRows.forEach((tierRow, tierIndex) => {
                            const tier = {
                                min_quantity: parseInt(tierRow.querySelector(`[name="item_${index}_tier_${tierIndex}_min"]`)?.value) || 0,
                                max_quantity: parseInt(tierRow.querySelector(`[name="item_${index}_tier_${tierIndex}_max"]`)?.value) || 0,
                                rate: parseFloat(tierRow.querySelector(`[name="item_${index}_tier_${tierIndex}_rate"]`)?.value) || 0,
                                additional_costs: [],
                                taxes: [],
                                discounts: []
                            };

                            // Collect tier-level costs if enabled
                            const tierCostsContainer = tierRow.querySelector(`#item-${index}-tier-${tierIndex}-costs`);
                            if (tierCostsContainer) {
                                const costRows = tierCostsContainer.querySelectorAll('.cc-tier-cost-row');
                                costRows.forEach(costRow => {
                                    const type = costRow.querySelector('[name$="_type"]')?.value;
                                    const name = costRow.querySelector('[name$="_name"]')?.value;
                                    const value = parseFloat(costRow.querySelector('[name$="_value"]')?.value);

                                    if (name && !isNaN(value)) {
                                        const costItem = { name, value };
                                        if (type === 'cost') tier.additional_costs.push(costItem);
                                        else if (type === 'tax') tier.taxes.push(costItem);
                                        else if (type === 'discount') tier.discounts.push(costItem);
                                    }
                                });
                            }

                            item.pricing_tiers.push(tier);
                        });
                    }

                    // Collect item-level costs
                    const itemCostsContainer = card.querySelector(`#item-${index}-costs`);
                    if (itemCostsContainer) {
                        const costRows = itemCostsContainer.querySelectorAll('.cc-item-cost-row');
                        costRows.forEach(costRow => {
                            const type = costRow.querySelector('[name$="_type"]')?.value;
                            const name = costRow.querySelector('[name$="_name"]')?.value;
                            const value = parseFloat(costRow.querySelector('[name$="_value"]')?.value);

                            if (name && !isNaN(value)) {
                                const costItem = { name, value };
                                if (type === 'cost') item.additional_costs.push(costItem);
                                else if (type === 'tax') item.taxes.push(costItem);
                                else if (type === 'discount') item.discounts.push(costItem);
                            }
                        });
                    }

                    // Collect item-level custom sections if enabled
                    const itemCustomContainer = card.querySelector(`#item-${index}-custom`);
                    if (itemCustomContainer) {
                        const customSections = itemCustomContainer.querySelectorAll('.cc-item-custom-section');
                        customSections.forEach(section => {
                            const sectionName = section.querySelector('[name$="_section_name"]')?.value;
                            if (sectionName) {
                                item.custom_sections.push({
                                    name: sectionName,
                                    custom_fields: []
                                });
                            }
                        });
                    }

                    payload.contract_items.push(item);
                });
            }

            console.log('Built contract create payload:', payload);
            return payload;

        } else if (operation.id === 'update') {
            // Build payload matching the expected API format for update
            const payload = {
                created_by_user_email: form.querySelector('[name="buyer_contact"]')?.value || this.currentAccount?.user_email,
                contract_name: form.querySelector('[name="contract_name"]')?.value,
                ERP_contract_id: form.querySelector('[name="ERP_contract_id"]')?.value || null,
                factwise_contract_id: form.querySelector('[name="factwise_contract_id"]')?.value || null,
                contract_start_date: form.querySelector('[name="contract_start_date"]')?.value,
                contract_end_date: form.querySelector('[name="contract_end_date"]')?.value,
                entity_name: form.querySelector('[name="entity_name"]')?.value,
                status: form.querySelector('[name="status"]')?.value,
                buyer_identifications: form.querySelector('[name="buyer_identifications"]')?.value.split(',').map(s => s.trim()).filter(s => s),
                buyer_address: form.querySelector('[name="buyer_address"]')?.value || null,
                buyer_contact: form.querySelector('[name="buyer_contact"]')?.value,
                factwise_vendor_code: form.querySelector('[name="factwise_vendor_code"]')?.value || null,
                ERP_vendor_code: form.querySelector('[name="ERP_vendor_code"]')?.value || null,
                vendor_contact: form.querySelector('[name="vendor_contact"]')?.value,
                vendor_identifications: [
                    {
                        identification_name: form.querySelector('[name="vendor_identification_name"]')?.value,
                        identification_value: form.querySelector('[name="vendor_identification_value"]')?.value
                    }
                ],
                vendor_address: {
                    address_id: form.querySelector('[name="vendor_address_id"]')?.value || null,
                    full_address: form.querySelector('[name="vendor_full_address"]')?.value || null
                },
                project: form.querySelector('[name="project"]')?.value || null,
                additional_costs: [],
                taxes: [],
                discounts: [],
                prepayment_percentage: parseFloat(form.querySelector('[name="prepayment_percentage"]')?.value) || 0,
                payment_type: form.querySelector('[name="payment_type"]')?.value || null,
                payment_terms: {
                    term: parseInt(form.querySelector('[name="payment_term"]')?.value) || 0,
                    period: form.querySelector('[name="payment_period"]')?.value || "MONTHS",
                    applied_from: form.querySelector('[name="payment_applied_from"]')?.value || "INVOICE_DATE"
                },
                deliverables_payment_terms: [],
                incoterm: form.querySelector('[name="incoterm"]')?.value,
                lead_time: form.querySelector('[name="lead_time"]')?.value || null,
                lead_time_period: form.querySelector('[name="lead_time_period"]')?.value || null,
                custom_sections: [],
                attachments: [],
                terms_and_conditions: {
                    data: "",
                    name: "FactWise Default TNC"
                },
                contract_items: []
            };

            // Collect contract-level costs if enabled
            const contractCostsContainer = form.querySelector('#contract-costs-container-update');
            if (contractCostsContainer) {
                const costRows = contractCostsContainer.querySelectorAll('.cc-cost-row');
                costRows.forEach(row => {
                    const type = row.querySelector('[name$="_type"]')?.value;
                    const name = row.querySelector('[name$="_name"]')?.value;
                    const value = parseFloat(row.querySelector('[name$="_value"]')?.value);

                    if (name && !isNaN(value)) {
                        const costItem = { name, value };
                        if (type === 'cost') payload.additional_costs.push(costItem);
                        else if (type === 'tax') payload.taxes.push(costItem);
                        else if (type === 'discount') payload.discounts.push(costItem);
                    }
                });
            }

            // Collect contract-level custom sections if enabled
            const contractCustomContainer = form.querySelector('#contract-custom-container-update');
            if (contractCustomContainer) {
                const customSections = contractCustomContainer.querySelectorAll('.cc-custom-section');
                customSections.forEach(section => {
                    const sectionName = section.querySelector('[name$="_section_name"]')?.value;
                    if (sectionName) {
                        payload.custom_sections.push({
                            name: sectionName,
                            custom_fields: []
                        });
                    }
                });
            }

            // Collect contract items (same logic as create)
            const itemsContainer = form.querySelector('#contract-items-container-update');
            if (itemsContainer) {
                const itemCards = itemsContainer.querySelectorAll('.cc-item-card');
                itemCards.forEach((card, index) => {
                    const item = {
                        ERP_item_code: card.querySelector(`[name="item_${index}_erp_code"]`)?.value || null,
                        factwise_item_code: card.querySelector(`[name="item_${index}_factwise_code"]`)?.value,
                        currency_code_id: card.querySelector(`[name="item_${index}_currency_id"]`)?.value,
                        measurement_unit_id: card.querySelector(`[name="item_${index}_unit_id"]`)?.value,
                        attributes: [],
                        rate: parseFloat(card.querySelector(`[name="item_${index}_rate"]`)?.value) || 0,
                        quantity: parseFloat(card.querySelector(`[name="item_${index}_quantity"]`)?.value) || 0,
                        pricing_tiers: [],
                        prepayment_percentage: parseFloat(card.querySelector(`[name="item_${index}_prepayment"]`)?.value) || 0,
                        payment_type: card.querySelector(`[name="item_${index}_payment_type"]`)?.value || "PER_INVOICE_ITEM",
                        payment_terms: {
                            term: parseInt(card.querySelector(`[name="item_${index}_payment_term"]`)?.value) || 1,
                            period: card.querySelector(`[name="item_${index}_payment_period"]`)?.value || "MONTHS",
                            applied_from: card.querySelector(`[name="item_${index}_payment_applied_from"]`)?.value || "INVOICE_DATE"
                        },
                        deliverables_payment_terms: [],
                        incoterm: card.querySelector(`[name="item_${index}_incoterm"]`)?.value || "NA",
                        lead_time: card.querySelector(`[name="item_${index}_lead_time"]`)?.value || null,
                        lead_time_period: card.querySelector(`[name="item_${index}_lead_time_period"]`)?.value || null,
                        additional_costs: [],
                        taxes: [],
                        discounts: [],
                        attachments: [],
                        custom_sections: []
                    };

                    // Collect pricing tiers for this item
                    const tiersContainer = card.querySelector(`#tiers-container-update-${index}`);
                    if (tiersContainer) {
                        const tierRows = tiersContainer.querySelectorAll('.cc-tier-card');
                        tierRows.forEach((tierRow, tierIndex) => {
                            const tier = {
                                min_quantity: parseInt(tierRow.querySelector(`[name="item_${index}_tier_${tierIndex}_min"]`)?.value) || 0,
                                max_quantity: parseInt(tierRow.querySelector(`[name="item_${index}_tier_${tierIndex}_max"]`)?.value) || 0,
                                rate: parseFloat(tierRow.querySelector(`[name="item_${index}_tier_${tierIndex}_rate"]`)?.value) || 0,
                                additional_costs: [],
                                taxes: [],
                                discounts: []
                            };

                            // Collect tier-level costs if enabled
                            const tierCostsContainer = tierRow.querySelector(`#item-${index}-tier-${tierIndex}-costs`);
                            if (tierCostsContainer) {
                                const costRows = tierCostsContainer.querySelectorAll('.cc-tier-cost-row');
                                costRows.forEach(costRow => {
                                    const type = costRow.querySelector('[name$="_type"]')?.value;
                                    const name = costRow.querySelector('[name$="_name"]')?.value;
                                    const value = parseFloat(costRow.querySelector('[name$="_value"]')?.value);

                                    if (name && !isNaN(value)) {
                                        const costItem = { name, value };
                                        if (type === 'cost') tier.additional_costs.push(costItem);
                                        else if (type === 'tax') tier.taxes.push(costItem);
                                        else if (type === 'discount') tier.discounts.push(costItem);
                                    }
                                });
                            }

                            item.pricing_tiers.push(tier);
                        });
                    }

                    // Collect item-level costs
                    const itemCostsContainer = card.querySelector(`#item-${index}-costs`);
                    if (itemCostsContainer) {
                        const costRows = itemCostsContainer.querySelectorAll('.cc-item-cost-row');
                        costRows.forEach(costRow => {
                            const type = costRow.querySelector('[name$="_type"]')?.value;
                            const name = costRow.querySelector('[name$="_name"]')?.value;
                            const value = parseFloat(costRow.querySelector('[name$="_value"]')?.value);

                            if (name && !isNaN(value)) {
                                const costItem = { name, value };
                                if (type === 'cost') item.additional_costs.push(costItem);
                                else if (type === 'tax') item.taxes.push(costItem);
                                else if (type === 'discount') item.discounts.push(costItem);
                            }
                        });
                    }

                    // Collect item-level custom sections if enabled
                    const itemCustomContainer = card.querySelector(`#item-${index}-custom`);
                    if (itemCustomContainer) {
                        const customSections = itemCustomContainer.querySelectorAll('.cc-item-custom-section');
                        customSections.forEach(section => {
                            const sectionName = section.querySelector('[name$="_section_name"]')?.value;
                            if (sectionName) {
                                item.custom_sections.push({
                                    name: sectionName,
                                    custom_fields: []
                                });
                            }
                        });
                    }

                    payload.contract_items.push(item);
                });
            }

            console.log('Built contract update payload:', payload);
            return payload;

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
        } else if (this.currentModule === 'items' && this.currentOperation === 'bulk_create') {
            try {
                body = this._buildItemsBulkCreatePayload();
            } catch (error) {
                return `Error: ${error.message}`;
            }
        } else if (this.currentModule === 'vendors' && this.currentOperation === 'contacts_create') {
            try {
                body = this._buildVendorContactCreatePayload();
            } catch (error) {
                return `Error: ${error.message}`;
            }
        } else if (this.currentModule === 'vendors' && this.currentOperation === 'contacts_update') {
            try {
                body = this._buildVendorContactUpdatePayload();
            } catch (error) {
                return `Error: ${error.message}`;
            }
        } else if (this.currentModule === 'vendors' && this.currentOperation === 'contacts_delete') {
            try {
                body = this._buildVendorContactDeletePayload();
            } catch (error) {
                return `Error: ${error.message}`;
            }
        } else if (this.currentModule === 'vendors' && this.currentOperation === 'state') {
            try {
                body = this._buildVendorStatePayload();
            } catch (error) {
                return `Error: ${error.message}`;
            }
        } else if (this.currentModule === 'vendors' && this.currentOperation === 'create') {
            try {
                body = this._buildVendorCreatePayload();
            } catch (error) {
                return `Error: ${error.message}`;
            }
        } else if (this.currentModule === 'items' && this.currentOperation === 'update_state') {
            try {
                body = this._buildItemStatePayload();
            } catch (error) {
                return `Error: ${error.message}`;
            }
        } else if (this.currentModule === 'items' && this.currentOperation === 'create') {
            try {
                body = this._buildItemCreatePayload();
            } catch (error) {
                return `Error: ${error.message}`;
            }
        } else if (this.currentModule === 'projects' && this.currentOperation === 'create') {
            try {
                body = this._buildProjectCreatePayload();
            } catch (error) {
                return `Error: ${error.message}`;
            }
        } else if (this.currentModule === 'projects' && this.currentOperation === 'bulk_create') {
            try {
                body = this._buildProjectsBulkCreatePayload();
            } catch (error) {
                return `Error: ${error.message}`;
            }
        } else if (this.currentModule === 'purchase_order' && this.currentOperation === 'create') {
            try {
                body = this._buildPOCreatePayload();
            } catch (error) {
                return `Error: ${error.message}`;
            }
        } else if (this.currentModule === 'purchase_order' && this.currentOperation === 'terminate') {
            try {
                body = this._buildPOTerminatePayload();
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
            <div class="module-group collapsed" data-module-id="${mod.id}">
                <div class="module-header">
                    ${mod.name}
                    <svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="18 15 12 9 6 15"></polyline>
                    </svg>
                </div>
                <div class="operation-list">
                    ${mod.operations.map(op => `
                        <div class="operation-item" data-module-id="${mod.id}" data-operation-id="${op.id}">
                            ${op.name}
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
        this.elements.moduleNavigator.innerHTML = html;

        // Add accordion click handlers to module headers
        this.elements.moduleNavigator.querySelectorAll('.module-header').forEach(header => {
            header.addEventListener('click', (e) => {
                const clickedGroup = header.parentElement;
                const wasCollapsed = clickedGroup.classList.contains('collapsed');

                // Collapse all other groups (accordion behavior)
                this.elements.moduleNavigator.querySelectorAll('.module-group').forEach(group => {
                    if (group !== clickedGroup) {
                        group.classList.add('collapsed');
                    }
                });

                // Toggle the clicked group
                if (wasCollapsed) {
                    clickedGroup.classList.remove('collapsed');
                } else {
                    clickedGroup.classList.add('collapsed');
                }
            });
        });

        // Expand the group that contains the currently selected operation
        if (this.currentModule) {
            const activeGroup = this.elements.moduleNavigator.querySelector(`.module-group .operation-item[data-module-id="${this.currentModule}"]`);
            if (activeGroup) {
                activeGroup.closest('.module-group').classList.remove('collapsed');
            }
        }
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

            // Store templates in templateManager for later use
            if (this.templateManager && templates.length > 0) {
                this.templateManager.templates = templates;
                console.log('✓ Stored', templates.length, 'templates in TemplateManager');
            }

            // Populate dropdown
            const select = document.getElementById('template_name_select');
            if (select && templates && templates.length > 0) {
                select.innerHTML = templates.map(t => {
                    // Use name field from API response
                    const name = t.name || t.template_name || 'Unnamed Template';
                    const templateId = t.template_id;
                    return `<option value="${templateId}">${name}</option>`;
                }).join('');
                select.selectedIndex = 0;
                console.log('✓ Populated dropdown with', templates.length, 'templates');

                // Load the first template by default
                const firstTemplateId = templates[0].template_id;
                await this._handleTemplateChange(firstTemplateId);
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

    /**
     * Load item templates from API
     * @private
     */
    async _loadItemTemplates() {
        try {
            // Get token
            let token = this.factwiseIntegration?.getToken() || this.tokenManager.getToken();

            if (!token) {
                console.error('No token available for item templates API');
                return null;
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
            const url = `${baseUrl}module_templates/?entity_id=${entityId}&template_type=ITEM`;

            console.log('✓ Fetching item templates from:', url);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                console.error('Failed to fetch item templates:', response.status, response.statusText);
                return null;
            }

            const data = await response.json();
            console.log('✓ Loaded item templates response:', data);

            // API returns an array with one object containing templates
            const responseData = Array.isArray(data) ? data[0] : data;
            const templates = responseData.templates || [];
            console.log('✓ Item templates array:', templates);

            // Store templates in templateManager
            if (this.templateManager && templates.length > 0) {
                this.templateManager.itemTemplates = templates;
                console.log('✓ Stored', templates.length, 'item templates in TemplateManager');

                // Parse the first (default) template
                const defaultTemplate = templates[0];
                const config = this.templateManager.parseItemTemplateConfig(defaultTemplate);
                this.templateManager.itemTemplateConfig = config;
                console.log('✓ Parsed item template config:', config);

                return config;
            }

            return null;

        } catch (error) {
            console.error('Error loading item templates:', error);
            return null;
        }
    }

    /**
     * Handle template selection change
     * Updates form visibility based on template configuration
     * @private
     */
    async _handleTemplateChange(templateId) {
        console.log('Template changed to ID:', templateId);

        if (!this.templateManager || !this.templateManager.templates) {
            console.warn('TemplateManager not initialized or no templates loaded');
            return;
        }

        // Find the selected template from stored templates
        const template = this.templateManager.templates.find(t => t.template_id === templateId);

        if (!template) {
            console.warn('Template not found:', templateId);
            return;
        }

        console.log('✓ Found template:', template.name);
        console.log('✓ Template has', template.section_list?.length || 0, 'sections');

        // Parse template configuration
        const config = this.templateManager.parseTemplateConfig(template);
        console.log('✓ Parsed template config:', config);

        // Update form visibility based on template
        this._updateFormVisibilityFromTemplate(config);
    }

    /**
     * Load vendor templates from API
     * Similar to _loadItemTemplates but for VENDOR template type
     * @private
     */
    async _loadVendorTemplates() {
        try {
            // Get token
            let token = this.factwiseIntegration?.getToken() || this.tokenManager.getToken();

            if (!token) {
                console.error('No token available for vendor templates API');
                return null;
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
            const url = `${baseUrl}module_templates/?entity_id=${entityId}&template_type=VENDOR`;

            console.log('✓ Fetching vendor templates from:', url);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                console.error('Failed to fetch vendor templates:', response.status, response.statusText);
                return null;
            }

            const data = await response.json();
            console.log('✓ Loaded vendor templates response:', data);

            // API returns an array with one object containing templates
            const responseData = Array.isArray(data) ? data[0] : data;
            const templates = responseData.templates || [];
            console.log('✓ Vendor templates array:', templates);

            // Store templates in templateManager
            if (this.templateManager && templates.length > 0) {
                this.templateManager.vendorTemplates = templates;
                console.log('✓ Stored', templates.length, 'vendor templates in TemplateManager');

                // Parse the first (default) template
                const defaultTemplate = templates[0];
                const config = this.templateManager.parseVendorTemplateConfig(defaultTemplate);
                this.templateManager.vendorTemplateConfig = config;
                console.log('✓ Parsed vendor template config:', config);

                return config;
            }

            return null;

        } catch (error) {
            console.error('Error loading vendor templates:', error);
            return null;
        }
    }

    /**
     * Load PO templates from API
     * @private
     */
    async _loadPOTemplates() {
        try {
            // Get token
            let token = this.factwiseIntegration?.getToken() || this.tokenManager.getToken();

            if (!token) {
                console.error('No token available for PO templates API');
                const select = document.getElementById('po_template_select');
                if (select) {
                    select.innerHTML = '<option value="">No templates available</option>';
                }
                return null;
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
            const url = `${baseUrl}module_templates/?entity_id=${entityId}&template_type=PO_GROUP`;

            console.log('✓ Fetching PO templates from:', url);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                console.error('Failed to fetch PO templates:', response.status, response.statusText);
                const select = document.getElementById('po_template_select');
                if (select) {
                    select.innerHTML = '<option value="">Failed to load templates</option>';
                }
                return null;
            }

            const data = await response.json();
            console.log('✓ Loaded PO templates response:', data);

            // API returns an array with one object containing templates
            const responseData = Array.isArray(data) ? data[0] : data;
            const templates = responseData.templates || [];
            console.log('✓ PO templates array:', templates);

            // Store templates in templateManager
            if (this.templateManager && templates.length > 0) {
                this.templateManager.poTemplates = templates;
                console.log('✓ Stored', templates.length, 'PO templates in TemplateManager');

                // Populate dropdown
                const select = document.getElementById('po_template_select');
                if (select) {
                    select.innerHTML = templates.map(t => {
                        const name = t.name || t.template_name || 'Unnamed Template';
                        return `<option value="${name}">${name}</option>`;
                    }).join('');
                    select.selectedIndex = 0;
                    console.log('✓ Populated PO template dropdown with', templates.length, 'templates');

                    // Parse the first (default) template
                    const defaultTemplate = templates[0];
                    const config = this.templateManager.parsePOTemplateConfig(defaultTemplate);
                    this.templateManager.poTemplateConfig = config;
                    console.log('✓ Parsed PO template config:', config);

                    // Populate custom fields if any
                    if (config && config.customFields && config.customFields.length > 0) {
                        this._populatePOCustomFields(config.customFields);
                    }

                    return config;
                }
            } else {
                const select = document.getElementById('po_template_select');
                if (select) {
                    select.innerHTML = '<option value="">No templates available</option>';
                }
            }

            return null;

        } catch (error) {
            console.error('Error loading PO templates:', error);
            const select = document.getElementById('po_template_select');
            if (select) {
                select.innerHTML = '<option value="">Error loading templates</option>';
            }
            return null;
        }
    }

    /**
     * Populate PO custom fields from template
     * @private
     */
    _populatePOCustomFields(customFields) {
        const container = document.getElementById('po-custom-fields-container');
        if (!container) return;

        container.innerHTML = '';

        // Group fields by section
        const sections = {};
        customFields.forEach(field => {
            const sectionName = field.section || 'Additional Fields';
            if (!sections[sectionName]) {
                sections[sectionName] = [];
            }
            sections[sectionName].push(field);
        });

        // Render each section
        Object.keys(sections).forEach(sectionName => {
            const sectionHTML = `
                <div class="form-section-title">
                    <span class="fst-icon">⚙️</span>
                    <h4>${sectionName}</h4>
                    <span class="fst-badge" style="background: #8b5cf6;">Custom</span>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', sectionHTML);

            sections[sectionName].forEach(field => {
                const fieldHTML = this._generatePOCustomFieldHTML(field);
                container.insertAdjacentHTML('beforeend', fieldHTML);
            });
        });

        console.log('✓ Populated PO custom fields');
    }

    /**
     * Generate HTML for a PO custom field
     * @private
     */
    _generatePOCustomFieldHTML(field) {
        const fieldName = `po_custom_${field.name.replace(/\s+/g, '_')}`;
        const required = field.required ? 'required' : '';
        const requiredStar = field.required ? ' *' : '';

        switch (field.type) {
            case 'SHORTTEXT':
                return `
                    <div class="form-group">
                        <label>${field.name}${requiredStar}</label>
                        <input type="text" name="${fieldName}" class="input-field" ${required} 
                            placeholder="${field.name}">
                    </div>
                `;
            case 'LONGTEXT':
                return `
                    <div class="form-group">
                        <label>${field.name}${requiredStar}</label>
                        <textarea name="${fieldName}" class="form-textarea" rows="3" ${required}
                            placeholder="${field.name}"></textarea>
                    </div>
                `;
            case 'FLOAT':
            case 'PERCENTAGE':
                return `
                    <div class="form-group">
                        <label>${field.name}${requiredStar}</label>
                        <input type="number" step="0.01" name="${fieldName}" class="input-field" ${required}
                            placeholder="${field.name}">
                    </div>
                `;
            case 'DATE':
                return `
                    <div class="form-group">
                        <label>${field.name}${requiredStar}</label>
                        <input type="date" name="${fieldName}" class="input-field" ${required}>
                    </div>
                `;
            case 'BOOLEAN':
                return `
                    <div class="form-group">
                        <label>${field.name}${requiredStar}</label>
                        <select name="${fieldName}" class="input-field" ${required}>
                            <option value="">Select...</option>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                    </div>
                `;
            case 'CHOICE':
                const options = field.choices || [];
                return `
                    <div class="form-group">
                        <label>${field.name}${requiredStar}</label>
                        <select name="${fieldName}" class="input-field" ${required}>
                            <option value="">Select...</option>
                            ${options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                        </select>
                    </div>
                `;
            default:
                return `
                    <div class="form-group">
                        <label>${field.name}${requiredStar}</label>
                        <input type="text" name="${fieldName}" class="input-field" ${required}
                            placeholder="${field.name}">
                    </div>
                `;
        }
    }

    /**
     * Update form visibility based on template configuration
     * @param {Object} config - Template configuration from TemplateManager
     * @private
     */
    _updateFormVisibilityFromTemplate(config) {
        console.log('Updating form visibility from template config...');

        // Contract-level costs
        const contractCostsToggle = document.getElementById('toggle-contract-costs');
        if (contractCostsToggle) {
            const hasContractCosts = config.contractLevel.additionalCosts ||
                config.contractLevel.taxes ||
                config.contractLevel.discounts;

            // Enable/disable toggle based on template
            contractCostsToggle.disabled = !hasContractCosts;

            // Add visual feedback and tooltip
            const toggleRow = contractCostsToggle.closest('.cc-toggle-row');
            if (toggleRow) {
                if (!hasContractCosts) {
                    toggleRow.style.opacity = '0.5';
                    toggleRow.style.cursor = 'not-allowed';
                    toggleRow.title = 'Not available in selected template';
                } else {
                    toggleRow.style.opacity = '1';
                    toggleRow.style.cursor = 'pointer';
                    toggleRow.title = '';
                }
            }

            if (!hasContractCosts) {
                contractCostsToggle.checked = false;
                const section = document.getElementById('contract-costs-section');
                if (section) section.classList.remove('visible');
            }

            console.log('  Contract-level costs:', hasContractCosts ? 'ENABLED' : 'DISABLED');
        }

        // Item-level costs (affects tier costs too)
        const tierCostsToggle = document.getElementById('toggle-tier-costs');
        if (tierCostsToggle) {
            const hasItemCosts = config.itemLevel.additionalCosts ||
                config.itemLevel.taxes ||
                config.itemLevel.discounts;

            tierCostsToggle.disabled = !hasItemCosts;

            // Add visual feedback and tooltip
            const toggleRow = tierCostsToggle.closest('.cc-toggle-row');
            if (toggleRow) {
                if (!hasItemCosts) {
                    toggleRow.style.opacity = '0.5';
                    toggleRow.style.cursor = 'not-allowed';
                    toggleRow.title = 'Not available in selected template';
                } else {
                    toggleRow.style.opacity = '1';
                    toggleRow.style.cursor = 'pointer';
                    toggleRow.title = '';
                }
            }

            if (!hasItemCosts) {
                tierCostsToggle.checked = false;
                // Re-render items to hide tier costs
                this._renderContractItems();
            }

            console.log('  Tier-level costs:', hasItemCosts ? 'ENABLED' : 'DISABLED');
        }

        // Contract custom sections
        const contractCustomToggle = document.getElementById('toggle-contract-custom');
        if (contractCustomToggle) {
            const hasContractCustom = config.contractLevel.customSections.length > 0;
            contractCustomToggle.disabled = !hasContractCustom;

            // Add visual feedback and tooltip
            const toggleRow = contractCustomToggle.closest('.cc-toggle-row');
            if (toggleRow) {
                if (!hasContractCustom) {
                    toggleRow.style.opacity = '0.5';
                    toggleRow.style.cursor = 'not-allowed';
                    toggleRow.title = 'Not available in selected template';
                } else {
                    toggleRow.style.opacity = '1';
                    toggleRow.style.cursor = 'pointer';
                    toggleRow.title = '';
                }
            }

            if (!hasContractCustom) {
                contractCustomToggle.checked = false;
                const section = document.getElementById('contract-custom-section');
                if (section) section.classList.remove('visible');
            }

            console.log('  Contract custom fields:', hasContractCustom ? 'ENABLED' : 'DISABLED');
        }

        // Item custom sections
        const itemCustomToggle = document.getElementById('toggle-item-custom');
        if (itemCustomToggle) {
            const hasItemCustom = config.itemLevel.customSections.length > 0;
            itemCustomToggle.disabled = !hasItemCustom;

            // Add visual feedback and tooltip
            const toggleRow = itemCustomToggle.closest('.cc-toggle-row');
            if (toggleRow) {
                if (!hasItemCustom) {
                    toggleRow.style.opacity = '0.5';
                    toggleRow.style.cursor = 'not-allowed';
                    toggleRow.title = 'Not available in selected template';
                } else {
                    toggleRow.style.opacity = '1';
                    toggleRow.style.cursor = 'pointer';
                    toggleRow.title = '';
                }
            }

            if (!hasItemCustom) {
                itemCustomToggle.checked = false;
                this._renderContractItems();
            }

            console.log('  Item custom fields:', hasItemCustom ? 'ENABLED' : 'DISABLED');
        }

        console.log('✓ Form visibility updated based on template');
    }
}
