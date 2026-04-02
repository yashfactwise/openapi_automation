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
        this.currentMode = 'single'; // Track mode for ALL operations: 'single' or 'bulk'

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
            btnCopyScript: document.getElementById('btn-copy-script'),
            btnExecuteScript: document.getElementById('btn-execute-script'),
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
        if (this.elements.btnCopyScript) this.elements.btnCopyScript.addEventListener('click', () => this.handleCopyScript());
        if (this.elements.btnExecuteScript) this.elements.btnExecuteScript.addEventListener('click', () => this.handleExecuteScript());
        if (this.elements.btnExecute) this.elements.btnExecute.addEventListener('click', () => this.handleExecute());

        // Form Validation Monitoring
        // We use delegation on operationForm because inputs are injected dynamically
        this.elements.operationForm.addEventListener('input', () => this.checkFormValidity());
        this.elements.operationForm.addEventListener('change', () => this.checkFormValidity());

        // Curl panel toggle (wired once at init)
        const curlToggle = document.getElementById('curl-panel-toggle');
        if (curlToggle) {
            curlToggle.addEventListener('click', (e) => {
                if (e.target.closest('#btn-copy-curl-panel, #btn-download-curl-panel')) return;
                const isHidden = this.elements.curlDisplay.style.display === 'none';
                this._setCurlCollapsed(!isHidden);
            });
        }

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
                <!-- Mode Toggle -->
                <div style="margin-bottom: 20px; padding: 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
                    <div style="display: flex; align-items: center; gap: 16px;">
                        <span style="font-weight: 600; color: #475569;">Create Mode:</span>
                        <div class="mode-toggle-group">
                            <button type="button" class="mode-toggle-btn active" data-mode="single" onclick="window.uiController._switchContractMode('single')">
                                📄 Single Contract
                            </button>
                            <button type="button" class="mode-toggle-btn" data-mode="bulk" onclick="window.uiController._switchContractMode('bulk')">
                                📦 Bulk Contracts
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Single Mode Form -->
                <div id="contract-single-form">
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
                                        <input type="checkbox" id="toggle-additional-costs">
                                        <span class="cc-toggle-slider"></span>
                                    </span>
                                    <span class="cc-toggle-text">Additional Costs</span>
                                </label>
                                <label class="cc-toggle-row">
                                    <span class="cc-toggle-switch">
                                        <input type="checkbox" id="toggle-taxes">
                                        <span class="cc-toggle-slider"></span>
                                    </span>
                                    <span class="cc-toggle-text">Taxes</span>
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
                        <input type="text" name="ERP_contract_id" class="input-field" id="contract_erp_id_input">
                    </div>
                    <div class="form-group">
                        <label>Factwise Contract ID</label>
                        <input type="text" name="factwise_contract_id" class="input-field" id="contract_fw_id_input">
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
                            <option value="PER_DELIVERABLE">PER_DELIVERABLE</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Incoterm *</label>
                        <select name="incoterm" class="input-field" required>
                            <option value="EXW">EXW</option>
                            <option value="FCA">FCA</option>
                            <option value="FAS">FAS</option>
                            <option value="FOB">FOB</option>
                            <option value="CFR" selected>CFR</option>
                            <option value="CIF">CIF</option>
                            <option value="CPT">CPT</option>
                            <option value="CIP">CIP</option>
                            <option value="DAP">DAP</option>
                            <option value="DAT">DAT</option>
                            <option value="DDP">DDP</option>
                            <option value="NA">NA</option>
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
                            <option value="YEARS">YEARS</option>
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
                            <option value="YEARS">YEARS</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Applied From</label>
                        <select name="payment_applied_from" class="input-field">
                            <option value="INVOICE_DATE" selected>INVOICE_DATE</option>
                            <option value="RECEIPT_DATE">RECEIPT_DATE</option>
                            <option value="DISPATCH_DATE">DISPATCH_DATE</option>
                        </select>
                    </div>
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

                <!-- ⑧ Terms & Conditions -->
                <div class="form-section-title">
                    <span class="fst-icon">📜</span>
                    <h4>Terms &amp; Conditions</h4>
                </div>
                <div class="form-group">
                    <label>T&C Template</label>
                    <select id="tnc_name_select" name="tnc_name" class="input-field">
                        <option value="">None (skip)</option>
                    </select>
                </div>
                <div id="tnc-data-wrapper" style="display:none;margin-bottom:16px;">
                    <div id="tnc-data-toggle" style="cursor:pointer;display:flex;align-items:center;gap:6px;padding:8px 0;color:#64748b;font-size:12px;font-weight:500;">
                        <svg id="tnc-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="transition:transform 0.2s;transform:rotate(-90deg);"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        T&C Content
                    </div>
                    <div id="tnc-data-content" style="display:none;background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:12px;font-size:12px;color:#475569;max-height:300px;overflow-y:auto;white-space:pre-wrap;"></div>
                </div>

                <!-- Contract Items -->
                <h4 style="margin: 20px 0 10px 0; color: #334155; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px;">
                    <span>📦 Contract Items</span>
                    <button type="button" class="btn-secondary" onclick="window.uiController._addContractItem()" style="font-size: 13px; padding: 6px 12px; margin-left: 15px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;">
                        + Add Item
                    </button>
                </h4>
                <div id="contract-items-container"></div>
                </div>

                <!-- Bulk Mode Form -->
                <div id="contract-bulk-form" style="display: none;"></div>
            `;
        }
        // Contract Update Form
        else if (module.id === 'contract' && operation.id === 'update') {
            bodyInputsHtml = `
                <!-- Load Contract -->
                <div style="margin-bottom: 20px; padding: 16px; background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px;">
                    <p style="margin: 0 0 10px 0; font-size: 13px; font-weight: 600; color: #0369a1;">🔍 Load Existing Contract</p>
                    <p style="margin: 0 0 10px 0; font-size: 12px; color: #64748b;">Search by contract ID or name — selecting a contract will pre-fill all fields below.</p>
                    <div style="position: relative;">
                        <input type="text" id="load-contract-search" class="input-field" placeholder="Search contract ID or name..." autocomplete="off" style="padding-right: 40px;">
                        <span id="load-contract-spinner" style="display:none; position:absolute; right:10px; top:50%; transform:translateY(-50%); font-size:14px;">⏳</span>
                    </div>
                    <div id="load-contract-status" style="margin-top: 8px; font-size: 12px; color: #64748b;"></div>
                </div>

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
                                        <input type="checkbox" id="toggle-additional-costs-update">
                                        <span class="cc-toggle-slider"></span>
                                    </span>
                                    <span class="cc-toggle-text">Additional Costs</span>
                                </label>
                                <label class="cc-toggle-row">
                                    <span class="cc-toggle-switch">
                                        <input type="checkbox" id="toggle-taxes-update">
                                        <span class="cc-toggle-slider"></span>
                                    </span>
                                    <span class="cc-toggle-text">Taxes</span>
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
                            <option value="PER_DELIVERABLE">PER_DELIVERABLE</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Incoterm *</label>
                        <select name="incoterm" class="input-field" required>
                            <option value="EXW">EXW</option>
                            <option value="FCA">FCA</option>
                            <option value="FAS">FAS</option>
                            <option value="FOB">FOB</option>
                            <option value="CFR" selected>CFR</option>
                            <option value="CIF">CIF</option>
                            <option value="CPT">CPT</option>
                            <option value="CIP">CIP</option>
                            <option value="DAP">DAP</option>
                            <option value="DAT">DAT</option>
                            <option value="DDP">DDP</option>
                            <option value="NA">NA</option>
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
                            <option value="YEARS">YEARS</option>
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
                            <option value="YEARS">YEARS</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Applied From</label>
                        <select name="payment_applied_from" class="input-field">
                            <option value="INVOICE_DATE" selected>INVOICE_DATE</option>
                            <option value="RECEIPT_DATE">RECEIPT_DATE</option>
                            <option value="DISPATCH_DATE">DISPATCH_DATE</option>
                        </select>
                    </div>
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
                ${this._bulkModeToggleHTML()}
                <!-- ① Shared Config -->
                <div id="bulk-payload-mode">
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
                </div><!-- /bulk-payload-mode -->

                <!-- Script Mode (hidden by default) -->
                <div id="bulk-script-mode" style="display:none;">
                    ${this._bulkScriptModeHTML('items')}
                </div>
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
                <!-- Mode Toggle -->
                <div style="margin-bottom: 20px; padding: 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
                    <div style="display: flex; align-items: center; gap: 16px;">
                        <span style="font-weight: 600; color: #475569;">Create Mode:</span>
                        <div class="mode-toggle-group">
                            <button type="button" class="mode-toggle-btn active" data-mode="single" onclick="window.uiController._switchVendorMode('single')">
                                📄 Single Vendor
                            </button>
                            <button type="button" class="mode-toggle-btn" data-mode="bulk" onclick="window.uiController._switchVendorMode('bulk')">
                                📦 Bulk Vendors
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Single Mode Form -->
                <div id="vendor-single-form">
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
                </div>

                <!-- Bulk Mode Form -->
                <div id="vendor-bulk-form" style="display: none;"></div>
            `;
        } else if (module.id === 'items' && operation.id === 'update_state') {
            bodyInputsHtml = `
                <!-- Mode Toggle -->
                <div style="margin-bottom: 20px; padding: 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
                    <div style="display: flex; align-items: center; gap: 16px;">
                        <span style="font-weight: 600; color: #475569;">Update Mode:</span>
                        <div class="mode-toggle-group">
                            <button type="button" class="mode-toggle-btn active" data-mode="single" onclick="window.uiController._switchMode('single')">
                                📄 Single Item
                            </button>
                            <button type="button" class="mode-toggle-btn" data-mode="bulk" onclick="window.uiController._switchMode('bulk')">
                                📦 Bulk Items
                            </button>
                        </div>
                    </div>
                </div>

                <div id="operation-single-form">
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
                </div>

                <div id="operation-bulk-form" style="display: none;"></div>
            `;
        } else if (module.id === 'items' && operation.id === 'create') {
            bodyInputsHtml = `
                <!-- Mode Toggle -->
                <div style="margin-bottom: 20px; padding: 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
                    <div style="display: flex; align-items: center; gap: 16px;">
                        <span style="font-weight: 600; color: #475569;">Create Mode:</span>
                        <div class="mode-toggle-group">
                            <button type="button" class="mode-toggle-btn active" data-mode="single" onclick="window.uiController._switchItemMode('single')">
                                📄 Single Item
                            </button>
                            <button type="button" class="mode-toggle-btn" data-mode="bulk" onclick="window.uiController._switchItemMode('bulk')">
                                📦 Bulk Items
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Single Mode Form -->
                <div id="item-single-form">
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

                <!-- ⑦ Additional Costs from Template -->
                <div id="item-create-additional-costs-container"></div>
                </div>

                <!-- Bulk Mode Form (hidden by default) -->
                <div id="item-bulk-form" style="display: none;"></div>
            `;
        } else if (module.id === 'projects' && operation.id === 'create') {
            bodyInputsHtml = `
                <!-- Mode Toggle -->
                <div style="margin-bottom: 20px; padding: 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
                    <div style="display: flex; align-items: center; gap: 16px;">
                        <span style="font-weight: 600; color: #475569;">Create Mode:</span>
                        <div class="mode-toggle-group">
                            <button type="button" class="mode-toggle-btn active" data-mode="single" onclick="window.uiController._switchProjectMode('single')">
                                📄 Single Project
                            </button>
                            <button type="button" class="mode-toggle-btn" data-mode="bulk" onclick="window.uiController._switchProjectMode('bulk')">
                                📦 Bulk Projects
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Single Mode Form -->
                <div id="project-single-form">
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
                        <select id="project_template_select" name="template_name" class="input-field">
                            <option value="">Loading templates...</option>
                        </select>
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
                </div>

                <!-- Bulk Mode Form (hidden by default) -->
                <div id="project-bulk-form" style="display: none;"></div>
            `;
        } else if (module.id === 'projects' && operation.id === 'bulk_create') {
            bodyInputsHtml = `
                ${this._bulkModeToggleHTML()}
                <div id="bulk-payload-mode">
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
                        <select id="bp_project_template_select" name="bp_template_name" class="input-field">
                            <option value="">Loading templates...</option>
                        </select>
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
                </div><!-- /bulk-payload-mode -->

                <div id="bulk-script-mode" style="display:none;">
                    ${this._bulkScriptModeHTML('projects')}
                </div>
            `;
        } else if (module.id === 'purchase_order' && operation.id === 'create') {
            bodyInputsHtml = `
                <!-- Mode Toggle -->
                <div style="margin-bottom: 20px; padding: 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
                    <div style="display: flex; align-items: center; gap: 16px;">
                        <span style="font-weight: 600; color: #475569;">Create Mode:</span>
                        <div class="mode-toggle-group">
                            <button type="button" class="mode-toggle-btn active" data-mode="single" onclick="window.uiController._switchPOMode('single')">
                                📄 Single PO
                            </button>
                            <button type="button" class="mode-toggle-btn" data-mode="bulk" onclick="window.uiController._switchPOMode('bulk')">
                                📦 Bulk POs
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Single Mode Form -->
                <div id="po-single-form">
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
                        <input type="text" name="ERP_po_id" class="input-field" required value="SS-ERP-35565">
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
                    <input type="text" name="buyer_contacts" class="input-field" value="globalfielsETE@gmail.com" placeholder="Emails or phone numbers">
                </div>

                <!-- ③ Seller Details -->
                <div class="form-section-title">
                    <span class="fst-icon">🏭</span>
                    <h4>Seller Details</h4>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Factwise Vendor Code <span style="color:#64748b;font-weight:400;">(preferred)</span></label>
                        <input type="text" name="seller_factwise_vendor_code" class="input-field" placeholder="Factwise vendor code">
                    </div>
                    <div class="form-group">
                        <label>ERP Vendor Code</label>
                        <input type="text" name="seller_erp_vendor_code" class="input-field" placeholder="ERP vendor code">
                        <small id="erp-vendor-warning" style="color:#dc2626;display:none;">⚠ ERP code only — may fail if multiple vendors share this code</small>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Seller Address ID</label>
                        <input type="text" name="seller_address_id" class="input-field" placeholder="Address ID">
                    </div>
                    <div class="form-group">
                        <label>Seller Full Address</label>
                        <input type="text" name="seller_full_address" class="input-field" placeholder="Full address text">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Seller ID Type (e.g. GST)</label>
                        <input type="text" name="seller_id_name" class="input-field" placeholder="e.g. GST, PAN">
                    </div>
                    <div class="form-group">
                        <label>Seller ID Value</label>
                        <input type="text" name="seller_id_value" class="input-field" placeholder="e.g. 29ABCDE1234F1Z5">
                    </div>
                </div>

                <div class="form-group">
                    <label>Seller Contacts (comma-separated)</label>
                    <input type="text" name="seller_contacts" class="input-field" placeholder="vendor@example.com">
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
                </div>

                <!-- Bulk Mode Form -->
                <div id="po-bulk-form" style="display: none;"></div>
            `;
        } else if (module.id === 'purchase_order' && operation.id === 'terminate') {
            bodyInputsHtml = `
                <!-- Mode Toggle -->
                <div style="margin-bottom: 20px; padding: 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
                    <div style="display: flex; align-items: center; gap: 16px;">
                        <span style="font-weight: 600; color: #475569;">Terminate Mode:</span>
                        <div class="mode-toggle-group">
                            <button type="button" class="mode-toggle-btn active" data-mode="single" onclick="window.uiController._switchMode('single')">
                                📄 Single PO
                            </button>
                            <button type="button" class="mode-toggle-btn" data-mode="bulk" onclick="window.uiController._switchMode('bulk')">
                                📦 Bulk POs
                            </button>
                        </div>
                    </div>
                </div>

                <div id="po-single-form">
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
                </div>

                <div id="po-bulk-form" style="display: none;"></div>
            `;
        } else if (module.id === 'purchase_order' && operation.id === 'state') {
            bodyInputsHtml = `
                <!-- Mode Toggle -->
                <div style="margin-bottom: 20px; padding: 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
                    <div style="display: flex; align-items: center; gap: 16px;">
                        <span style="font-weight: 600; color: #475569;">Update Mode:</span>
                        <div class="mode-toggle-group">
                            <button type="button" class="mode-toggle-btn active" data-mode="single" onclick="window.uiController._switchMode('single')">
                                📄 Single PO
                            </button>
                            <button type="button" class="mode-toggle-btn" data-mode="bulk" onclick="window.uiController._switchMode('bulk')">
                                📦 Bulk POs
                            </button>
                        </div>
                    </div>
                </div>

                <div id="po-single-form">
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
        } else if (module.id === 'items' && operation.id === 'update') {
            // ── Items Update Form ──
            bodyInputsHtml = `
                <div class="form-section-title no-margin-top">
                    <span class="fst-icon">📦</span>
                    <h4>Item Update</h4>
                    <span class="fst-badge">Bulk Wrapper</span>
                </div>
                <div class="form-group">
                    <label>Modified By User Email *</label>
                    <input type="email" name="modified_by_user_email" class="input-field" required
                        value="${this.currentAccount?.user_email || 'globalfieldsETE@gmail.com'}">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Item Name *</label>
                        <input type="text" name="name" class="input-field" required value="Natural Rubber - TSNR - TSR10">
                    </div>
                    <div class="form-group">
                        <label>ERP Item Code *</label>
                        <input type="text" name="ERP_item_code" class="input-field" required value="ERP-BKT-01111">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Factwise Item Code *</label>
                        <input type="text" name="factwise_item_code" class="input-field" required value="">
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
                            <option value="FINISHED_GOOD">FINISHED_GOOD</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Entity Name *</label>
                        <input type="text" name="entity_name" class="input-field" required value="FactWise">
                    </div>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea name="description" class="form-textarea" rows="2"></textarea>
                </div>
                <div class="form-row">
                    <div class="form-group"><label>Notes</label><input type="text" name="notes" class="input-field"></div>
                    <div class="form-group"><label>Internal Notes</label><input type="text" name="internal_notes" class="input-field"></div>
                </div>
                <div class="form-section-title"><span class="fst-icon">💰</span><h4>Pricing Information</h4></div>
                <div class="form-row">
                    <div class="form-group">
                        <label style="display:flex;align-items:center;gap:8px;"><input type="checkbox" name="is_buyer" value="true" checked><span>Is Buyer *</span></label>
                    </div>
                    <div class="form-group">
                        <label style="display:flex;align-items:center;gap:8px;"><input type="checkbox" name="is_seller" value="true"><span>Is Seller *</span></label>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group"><label>Buyer Price</label><input type="number" name="buyer_price" class="input-field" step="0.01" value="78"></div>
                    <div class="form-group"><label>Buyer Currency ID</label><input type="text" name="buyer_currency_code_id" class="input-field" value="a8c3e3fd-b05f-4d09-bd2f-9fedd07d0ec3"></div>
                </div>
                <div class="form-row">
                    <div class="form-group"><label>Seller Price</label><input type="number" name="seller_price" class="input-field" step="0.01"></div>
                    <div class="form-group"><label>Seller Currency ID</label><input type="text" name="seller_currency_code_id" class="input-field"></div>
                </div>
                <div class="form-section-title"><span class="fst-icon">🏷️</span><h4>Additional Information</h4></div>
                <div class="form-group"><label>Tags (comma-separated)</label><input type="text" name="tags" class="input-field"></div>
                <div class="form-group"><label>Custom IDs (name:value, comma-separated)</label><input type="text" name="custom_ids" class="input-field" placeholder="e.g. HSN:40012200"></div>
                <div class="form-section-title"><span class="fst-icon">🏭</span><h4>Entities</h4></div>
                <div class="form-group"><label>Preferred Vendors (comma-separated ERP codes)</label><input type="text" name="preferred_vendors" class="input-field"></div>
                <div class="form-section-title"><span class="fst-icon">🔧</span><h4>Custom Sections</h4><span class="fst-badge" style="background:#94a3b8;">Optional</span></div>
                <div id="item-update-custom-sections-container"></div>
                <button type="button" class="btn-add-row" onclick="window.uiController._addGenericCustomSection('item-update-custom-sections-container','iu_cs')">＋ Add Custom Section</button>
            `;
        } else if (module.id === 'vendors' && operation.id === 'update') {
            // ── Vendors Update Form ──
            bodyInputsHtml = `
                <div class="form-section-title no-margin-top"><span class="fst-icon">🏢</span><h4>Vendor Update</h4><span class="fst-badge">Bulk Wrapper</span></div>
                <div class="form-group">
                    <label>Modified By User Email *</label>
                    <input type="email" name="modified_by_user_email" class="input-field" required value="${this.currentAccount?.user_email || 'globalfieldsETE@gmail.com'}">
                </div>
                <div class="form-row">
                    <div class="form-group"><label>Vendor Name *</label><input type="text" name="vendor_name" class="input-field" required value="API Test Vendor"></div>
                    <div class="form-group"><label>ERP Vendor Code *</label><input type="text" name="ERP_vendor_code" class="input-field" required value="ERPV01"></div>
                </div>
                <div class="form-row">
                    <div class="form-group"><label>Factwise Vendor Code *</label><input type="text" name="factwise_vendor_code" class="input-field" required value=""></div>
                    <div class="form-group"><label>Notes</label><input type="text" name="notes" class="input-field"></div>
                </div>
                <div class="form-group"><label>Tags (comma-separated)</label><input type="text" name="tags" class="input-field"></div>
                <div class="form-section-title"><span class="fst-icon">👤</span><h4>Primary Contact</h4><span class="fst-badge">Required</span></div>
                <div class="form-row">
                    <div class="form-group"><label>Full Name *</label><input type="text" name="primary_full_name" class="input-field" required value="Ashir Ansari"></div>
                    <div class="form-group"><label>Primary Email *</label><input type="email" name="primary_email" class="input-field" required value="ashir@factwise.io"></div>
                </div>
                <div class="form-row">
                    <div class="form-group"><label>Phone Numbers (comma-separated)</label><input type="text" name="primary_phone_numbers" class="input-field" value="8928219571"></div>
                    <div class="form-group"><label>Email Type</label><select name="primary_email_type" class="input-field"><option value="TO">TO</option><option value="CC" selected>CC</option></select></div>
                </div>
                <div class="form-section-title"><span class="fst-icon">📍</span><h4>Seller Information</h4></div>
                <div class="form-row">
                    <div class="form-group"><label>Address Information (comma-separated)</label><input type="text" name="seller_address_information" class="input-field" value="Mumbai"></div>
                    <div class="form-group"><label>Identification Name</label><input type="text" name="identification_name" class="input-field"></div>
                </div>
                <div class="form-group"><label>Identification Value</label><input type="text" name="identification_value" class="input-field"></div>
                <div class="form-section-title"><span class="fst-icon">🏭</span><h4>Entities</h4><span class="fst-badge">Required</span></div>
                <div class="form-group"><label>Entity Names (comma-separated) *</label><input type="text" name="entity_names" class="input-field" required value="Global fields ETE"></div>
                <div class="form-section-title"><span class="fst-icon">💰</span><h4>Additional Costs</h4><span class="fst-badge" style="background:#94a3b8;">Optional</span></div>
                <div id="vendor-update-costs-container"></div>
                <button type="button" class="btn-add-row" onclick="window.uiController._addGenericCostRow('vendor-update-costs-container','vu_cost')">＋ Add Cost</button>
                <div class="form-section-title"><span class="fst-icon">🔧</span><h4>Custom Sections</h4><span class="fst-badge" style="background:#94a3b8;">Optional</span></div>
                <div id="vendor-update-custom-sections-container"></div>
                <button type="button" class="btn-add-row" onclick="window.uiController._addGenericCustomSection('vendor-update-custom-sections-container','vu_cs')">＋ Add Custom Section</button>
            `;
        } else if (module.id === 'projects' && operation.id === 'update') {
            // ── Project Update Form (duplicate of create) ──
            bodyInputsHtml = `
                <div class="form-section-title no-margin-top"><span class="fst-icon">📋</span><h4>Project Update</h4><span class="fst-badge">Bulk Wrapper</span></div>
                <div class="form-group">
                    <label>Created By User Email *</label>
                    <input type="email" name="created_by_user_email" class="input-field" required value="${this.currentAccount?.user_email || 'globalfieldsETE@gmail.com'}">
                </div>
                <div class="form-row">
                    <div class="form-group"><label>Project Name *</label><input type="text" name="project_name" class="input-field" required value="API Test Project"></div>
                    <div class="form-group"><label>Entity Name *</label><input type="text" name="entity_name" class="input-field" required value="FactWise"></div>
                </div>
                <div class="form-row">
                    <div class="form-group"><label>Project Code</label><input type="text" name="project_code" class="input-field"></div>
                    <div class="form-group"><label>ERP Project Code</label><input type="text" name="ERP_project_code" class="input-field" value="ERP9701"></div>
                </div>
                <div class="form-row">
                    <div class="form-group"><label>Customer Code</label><input type="text" name="customer_code" class="input-field" value="CXJKU05"></div>
                    <div class="form-group"><label>Template Name</label><input type="text" name="template_name" class="input-field"></div>
                </div>
                <div class="form-group">
                    <label>Project Status *</label>
                    <select name="project_status" class="input-field" required>
                        <option value="DRAFT" selected>DRAFT</option><option value="SUBMITTED">SUBMITTED</option><option value="EXPIRED">EXPIRED</option>
                    </select>
                </div>
                <div class="form-section-title"><span class="fst-icon">📅</span><h4>Project Timeline</h4></div>
                <div class="form-row">
                    <div class="form-group"><label>Validity From</label><input type="datetime-local" name="validity_from" class="input-field"></div>
                    <div class="form-group"><label>Validity To</label><input type="datetime-local" name="validity_to" class="input-field"></div>
                </div>
                <div class="form-section-title"><span class="fst-icon">📝</span><h4>Additional Information</h4></div>
                <div class="form-group"><label>Description</label><textarea name="description" class="form-textarea" rows="3"></textarea></div>
                <div class="form-group"><label>Internal Notes</label><textarea name="internal_notes" class="form-textarea" rows="3"></textarea></div>
                <div class="form-section-title"><span class="fst-icon">🔧</span><h4>Custom Sections</h4><span class="fst-badge" style="background:#94a3b8;">Optional</span></div>
                <div id="project-update-custom-sections-container"></div>
                <button type="button" class="btn-add-row" onclick="window.uiController._addGenericCustomSection('project-update-custom-sections-container','pu_cs')">＋ Add Custom Section</button>
            `;
        } else if (module.id === 'requisitions' && operation.id === 'create') {
            // ── Requisition Create Form ──
            bodyInputsHtml = `
                <div class="form-section-title no-margin-top"><span class="fst-icon">📝</span><h4>Requisition Create</h4><span class="fst-badge">Bulk Wrapper</span></div>
                <div class="form-group">
                    <label>Created By User Email *</label>
                    <input type="email" name="created_by_user_email" class="input-field" required value="${this.currentAccount?.user_email || 'globalfieldsETE@gmail.com'}">
                </div>
                <div class="form-row">
                    <div class="form-group"><label>Requisition Name *</label><input type="text" name="requisition_name" class="input-field" required value="API Test Requisition"></div>
                    <div class="form-group"><label>ERP Requisition ID *</label><input type="text" name="ERP_requisition_id" class="input-field" required value="ERPREQ001"></div>
                </div>
                <div class="form-row">
                    <div class="form-group"><label>Currency Code ID *</label><input type="text" name="currency_code_id" class="input-field" required value="a8c3e3fd-b05f-4d09-bd2f-9fedd07d0ec3"></div>
                    <div class="form-group"><label>Entity Name *</label><input type="text" name="entity_name" class="input-field" required value="FactWise"></div>
                </div>
                <div class="form-row">
                    <div class="form-group"><label>Template Name *</label><input type="text" name="template_name" class="input-field" required></div>
                    <div class="form-group">
                        <label>Status *</label>
                        <select name="status" class="input-field" required>
                            <option value="DRAFTED" selected>DRAFTED</option><option value="SUBMITTED">SUBMITTED</option><option value="ONGOING">ONGOING</option><option value="TERMINATED">TERMINATED</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group"><label>Project Code</label><input type="text" name="project_code" class="input-field"></div>
                    <div class="form-group"><label>Notes</label><input type="text" name="notes" class="input-field"></div>
                </div>
                <div class="form-section-title"><span class="fst-icon">📦</span><h4>Requisition Items</h4><span class="fst-badge" style="background:#94a3b8;">Optional</span></div>
                <div id="req-create-items-container"></div>
                <button type="button" class="btn-add-row" onclick="window.uiController._addRequisitionItem('req-create-items-container','rc_item')">＋ Add Item</button>
                <div class="form-section-title"><span class="fst-icon">🔧</span><h4>Custom Sections</h4><span class="fst-badge" style="background:#94a3b8;">Optional</span></div>
                <div id="req-create-custom-sections-container"></div>
                <button type="button" class="btn-add-row" onclick="window.uiController._addGenericCustomSection('req-create-custom-sections-container','rc_cs')">＋ Add Custom Section</button>
            `;
        } else if (module.id === 'requisitions' && operation.id === 'update') {
            // ── Requisition Update Form ──
            bodyInputsHtml = `
                <div class="form-section-title no-margin-top"><span class="fst-icon">📝</span><h4>Requisition Update</h4><span class="fst-badge">Bulk Wrapper</span></div>
                <div class="form-group">
                    <label>Modified By User Email *</label>
                    <input type="email" name="modified_by_user_email" class="input-field" required value="${this.currentAccount?.user_email || 'globalfieldsETE@gmail.com'}">
                </div>
                <div class="form-row">
                    <div class="form-group"><label>Requisition Name *</label><input type="text" name="requisition_name" class="input-field" required value="API Test Requisition"></div>
                    <div class="form-group"><label>ERP Requisition ID *</label><input type="text" name="ERP_requisition_id" class="input-field" required></div>
                </div>
                <div class="form-row">
                    <div class="form-group"><label>Factwise Requisition ID *</label><input type="text" name="factwise_requisition_id" class="input-field" required></div>
                    <div class="form-group"><label>Currency Code ID *</label><input type="text" name="currency_code_id" class="input-field" required value="a8c3e3fd-b05f-4d09-bd2f-9fedd07d0ec3"></div>
                </div>
                <div class="form-row">
                    <div class="form-group"><label>Entity Name *</label><input type="text" name="entity_name" class="input-field" required value="FactWise"></div>
                    <div class="form-group">
                        <label>Status *</label>
                        <select name="status" class="input-field" required>
                            <option value="DRAFTED">DRAFTED</option><option value="SUBMITTED" selected>SUBMITTED</option><option value="ONGOING">ONGOING</option><option value="TERMINATED">TERMINATED</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group"><label>Project Code</label><input type="text" name="project_code" class="input-field"></div>
                    <div class="form-group"><label>Notes</label><input type="text" name="notes" class="input-field"></div>
                </div>
                <div class="form-section-title"><span class="fst-icon">📦</span><h4>Requisition Items</h4><span class="fst-badge">Required</span></div>
                <div id="req-update-items-container"></div>
                <button type="button" class="btn-add-row" onclick="window.uiController._addRequisitionItem('req-update-items-container','ru_item')">＋ Add Item</button>
                <div class="form-section-title"><span class="fst-icon">🔧</span><h4>Custom Sections</h4><span class="fst-badge" style="background:#94a3b8;">Optional</span></div>
                <div id="req-update-custom-sections-container"></div>
                <button type="button" class="btn-add-row" onclick="window.uiController._addGenericCustomSection('req-update-custom-sections-container','ru_cs')">＋ Add Custom Section</button>
            `;
        } else if (module.id === 'requisitions' && operation.id === 'terminate') {
            // ── Requisition Terminate Form ──
            bodyInputsHtml = `
                <div class="form-section-title no-margin-top"><span class="fst-icon">🚫</span><h4>Requisition Terminate</h4><span class="fst-badge">Bulk Wrapper</span></div>
                <div class="form-group">
                    <label>Modified By User Email *</label>
                    <input type="email" name="modified_by_user_email" class="input-field" required value="${this.currentAccount?.user_email || 'globalfieldsETE@gmail.com'}">
                </div>
                <div class="form-row">
                    <div class="form-group"><label>ERP Requisition ID *</label><input type="text" name="ERP_requisition_id" class="input-field" required></div>
                    <div class="form-group"><label>Factwise Requisition ID *</label><input type="text" name="factwise_requisition_id" class="input-field" required></div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Status *</label>
                        <select name="status" class="input-field" required><option value="TERMINATED" selected>TERMINATED</option></select>
                    </div>
                    <div class="form-group"><label>Notes</label><input type="text" name="notes" class="input-field"></div>
                </div>
            `;
        } else if (module.id === 'costing_sheet' && operation.id === 'create') {
            // ── Costing Sheet Create Form ──
            bodyInputsHtml = `
                <div class="form-section-title no-margin-top"><span class="fst-icon">📊</span><h4>Costing Sheet Create</h4><span class="fst-badge">Single Object</span></div>
                <div class="form-group">
                    <label>Created By User Email *</label>
                    <input type="email" name="created_by_user_email" class="input-field" required value="${this.currentAccount?.user_email || 'globalfieldsETE@gmail.com'}">
                </div>
                <div class="form-row">
                    <div class="form-group"><label>Name *</label><input type="text" name="name" class="input-field" required value="API Test Quote"></div>
                    <div class="form-group"><label>ERP Costing Sheet ID</label><input type="text" name="ERP_costing_sheet_id" class="input-field"></div>
                </div>
                <div class="form-row">
                    <div class="form-group"><label>Factwise Costing Sheet Code</label><input type="text" name="factwise_costing_sheet_code" class="input-field"></div>
                    <div class="form-group"><label>Template Name</label><input type="text" name="template_name" class="input-field"></div>
                </div>
                <div class="form-row">
                    <div class="form-group"><label>Seller Entity Name</label><input type="text" name="seller_entity_name" class="input-field" value="FactWise"></div>
                    <div class="form-group"><label>Customer Entity Name</label><input type="text" name="customer_entity_name" class="input-field"></div>
                </div>
                <div class="form-row">
                    <div class="form-group"><label>Currency Code ID</label><input type="text" name="currency_code_id" class="input-field" value="a8c3e3fd-b05f-4d09-bd2f-9fedd07d0ec3"></div>
                    <div class="form-group"><label>Project Code</label><input type="text" name="project_code" class="input-field"></div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Status</label>
                        <select name="status" class="input-field"><option value="DRAFT" selected>DRAFT</option><option value="SUBMITTED">SUBMITTED</option><option value="APPROVED">APPROVED</option></select>
                    </div>
                    <div class="form-group"><label>Modified By User Email</label><input type="email" name="modified_by_user_email" class="input-field"></div>
                </div>
                <div class="form-row">
                    <div class="form-group"><label>Validity Datetime</label><input type="datetime-local" name="validity_datetime" class="input-field"></div>
                    <div class="form-group"><label>Deadline Datetime</label><input type="datetime-local" name="deadline_datetime" class="input-field"></div>
                </div>
                <div class="form-group"><label>Customer Contact Emails (comma-separated)</label><input type="text" name="customer_contact_emails" class="input-field"></div>
                <div class="form-row">
                    <div class="form-group"><label>Internal Notes</label><textarea name="internal_notes" class="form-textarea" rows="2"></textarea></div>
                    <div class="form-group"><label>External Notes</label><textarea name="external_notes" class="form-textarea" rows="2"></textarea></div>
                </div>
                <div class="form-group"><label>Status Notes</label><input type="text" name="status_notes" class="input-field"></div>
                <div class="form-section-title"><span class="fst-icon">💰</span><h4>Additional Costs</h4><span class="fst-badge" style="background:#94a3b8;">Optional</span></div>
                <div id="cs-create-costs-container"></div>
                <button type="button" class="btn-add-row" onclick="window.uiController._addGenericCostRow('cs-create-costs-container','cs_cost')">＋ Add Cost</button>
                <div class="form-section-title"><span class="fst-icon">📦</span><h4>Costing Sheet Items</h4><span class="fst-badge" style="background:#94a3b8;">Optional</span></div>
                <div id="cs-create-items-container"></div>
                <button type="button" class="btn-add-row" onclick="window.uiController._addCostingSheetItem()">＋ Add Item</button>
                <div class="form-section-title"><span class="fst-icon">🔧</span><h4>Custom Sections</h4><span class="fst-badge" style="background:#94a3b8;">Optional</span></div>
                <div id="cs-create-custom-sections-container"></div>
                <button type="button" class="btn-add-row" onclick="window.uiController._addGenericCustomSection('cs-create-custom-sections-container','cs_cs')">＋ Add Custom Section</button>
            `;
        } else if (module.id === 'costing_sheet' && operation.id === 'mapping') {
            // ── Costing Sheet Mapping Form ──
            bodyInputsHtml = `
                <div class="form-section-title no-margin-top"><span class="fst-icon">🔗</span><h4>Costing Sheet ERP Mapping</h4><span class="fst-badge">Bulk Wrapper</span></div>
                <div id="cs-mapping-container"></div>
                <button type="button" class="btn-add-row" onclick="window.uiController._addCostingSheetMapping()">＋ Add Mapping</button>
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
        } else if (module.id === 'contract' && operation.id === 'state') {
            setTimeout(() => this._setupContractLookup(this.elements.operationForm, ['ongoing']), 50);
        } else if (module.id === 'items' && operation.id === 'bulk_create') {
            // Expose this instance globally so inline onclick handlers can call methods on it
            window.uiController = this;

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
                if (config) {
                    if (config.customFields && config.customFields.length > 0) {
                        this._populateItemCreateCustomFields(config.customFields);
                    }
                    if (config.additionalCosts && config.additionalCosts.length > 0) {
                        this._populateItemCreateAdditionalCosts(config.additionalCosts);
                    }
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
                    if (templateName && this.templateManager?.poTemplates) {
                        console.log('PO template selected:', templateName);
                        const template = this.templateManager.poTemplates.find(t => (t.name || t.template_name) === templateName);
                        if (template) {
                            const config = this.templateManager.parsePOTemplateConfig(template);
                            this.templateManager.poTemplateConfig = config;
                            if (config && config.customFields && config.customFields.length > 0) {
                                this._populatePOCustomFields(config.customFields);
                            }
                        }
                    }
                });
            }
            // Expose this instance globally for PO create
            window.uiController = this;
            // Add first PO item
            this._addPOItem();

            // Vendor lookup and item search for PO
            setTimeout(() => {
                const form = this.elements.operationForm;
                this._setupVendorLookupPO(form);
                this._setupPOItemSearchDropdowns(form);

                // Show warning if only ERP code filled, no Factwise code
                const fwInput = form.querySelector('[name="seller_factwise_vendor_code"]');
                const erpInput = form.querySelector('[name="seller_erp_vendor_code"]');
                const erpWarning = form.querySelector('#erp-vendor-warning');
                const checkVendorWarning = () => {
                    if (erpWarning) {
                        erpWarning.style.display = (!fwInput?.value?.trim() && erpInput?.value?.trim()) ? 'block' : 'none';
                    }
                };
                fwInput?.addEventListener('input', checkVendorWarning);
                erpInput?.addEventListener('input', checkVendorWarning);
            }, 50);
        } else if (module.id === 'items' && operation.id === 'update') {
            window.uiController = this;
        } else if (module.id === 'vendors' && operation.id === 'update') {
            window.uiController = this;
        } else if (module.id === 'projects' && operation.id === 'update') {
            window.uiController = this;
        } else if (module.id === 'requisitions') {
            window.uiController = this;
        } else if (module.id === 'costing_sheet' && operation.id === 'create') {
            window.uiController = this;
        } else if (module.id === 'costing_sheet' && operation.id === 'mapping') {
            window.uiController = this;
            // Add first mapping row
            this._addCostingSheetMapping();
        }

        // Script buttons only visible in bulk mode — always hide on initial render (default is single)
        if (this.elements.btnCopyScript) this.elements.btnCopyScript.classList.add('hidden');
        if (this.elements.btnExecuteScript) this.elements.btnExecuteScript.classList.add('hidden');
        this._currentBulkMode = 'payload';
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

        // Custom fields from template — grouped by section, collected via data-custom-section
        if (config.customFields && config.customFields.length > 0) {
            fieldsHTML += `<p class="cc-sub-title" style="margin-top: 16px;">🔧 Custom Fields</p>`;

            const cfSections = {};
            config.customFields.forEach(field => {
                const key = field.section_alternate_name || field.section_name || 'Custom Fields';
                if (!cfSections[key]) cfSections[key] = { displayName: field.section_name || key, fields: [] };
                cfSections[key].fields.push(field);
            });

            Object.entries(cfSections).forEach(([sectionKey, { fields }]) => {
                fieldsHTML += `<div data-custom-section="${sectionKey}"><div class="form-row">`;
                fields.forEach((field, fi) => {
                    const altName = field.alternate_name || field.name;
                    const ft = field.field_type || 'SHORTTEXT';
                    const c = field.constraints || {};
                    let inp = '';
                    if (ft === 'BOOLEAN') {
                        inp = `<label style="display:flex;align-items:center;gap:8px;cursor:pointer;"><input type="checkbox" value="true"><span>${altName}</span></label>`;
                    } else if (ft === 'CHOICE') {
                        const isMulti = c.choice_type === 'MULTI_SELECT';
                        const opts = (c.choices || []).map(ch => `<option value="${ch}">${ch}</option>`).join('');
                        if (isMulti) {
                            inp = `<div style="border:1px solid #d1d5db;border-radius:4px;padding:8px;">${(c.choices||[]).map(ch=>`<label style="display:flex;align-items:center;gap:6px;"><input type="checkbox" value="${ch}"><span>${ch}</span></label>`).join('')}</div>`;
                        } else {
                            inp = `<select class="input-field"><option value="">Select...</option>${opts}</select>`;
                        }
                    } else if (ft === 'DATE') {
                        inp = `<input type="date" class="input-field">`;
                    } else if (ft === 'FLOAT' || ft === 'PERCENTAGE') {
                        inp = `<input type="number" class="input-field" step="0.01" min="${c.min_limit||0}" max="${c.max_limit||''}" placeholder="${altName}">`;
                    } else {
                        inp = `<input type="text" class="input-field" placeholder="${altName}" maxlength="${c.max_limit||500}">`;
                    }
                    fieldsHTML += `<div class="form-group" data-custom-field="${altName}" data-field-type="${ft}"><label>${altName}${ft==='PERCENTAGE'?' (%)':''}</label>${inp}</div>`;
                    if ((fi + 1) % 2 === 0 && fi < fields.length - 1) fieldsHTML += `</div><div class="form-row">`;
                });
                fieldsHTML += `</div></div>`;
            });
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

        // Additional Costs from template (if present)
        if (config.additionalCosts && config.additionalCosts.length > 0) {
            const acOptions = config.additionalCosts.map(f => {
                const valueType = f.cost_info?.cost_type === 'PERCENTAGE' ? 'pct' : 'abs';
                const alloc = f.cost_info?.allocation_type ? ` (${f.cost_info.allocation_type.replace('_', ' ')})` : '';
                return `<option value="${f.alternate_name}" data-value-type="${valueType}">${f.name}${alloc}</option>`;
            }).join('');
            const acOptionsEscaped = acOptions.replace(/'/g, "\\'");
            fieldsHTML += `
                <p class="cc-sub-title" style="margin-top:16px;">💰 Additional Costs</p>
                <div id="bi-item-${itemIndex}-ac-rows"></div>
                <button type="button" class="btn-add-row" onclick="window.uiController._addBulkItemCostRow(${itemIndex}, '${acOptionsEscaped}')">+ Add Cost</button>
            `;
        }

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
    _addBulkItemCostRow(itemIndex, optionsHTML) {
        const container = document.getElementById(`bi-item-${itemIndex}-ac-rows`);
        if (!container) return;
        const index = container.children.length;
        const html = `
            <div class="bi-item-cost-row" style="display:flex;gap:8px;align-items:flex-end;margin-bottom:8px;">
                <div class="form-group" style="flex:2;margin:0;">
                    <select name="bi_item_${itemIndex}_ac_${index}_name" class="input-field cc-cost-select" onchange="window.uiController._onItemCostSelectChange(this)">
                        <option value="">-- Select --</option>
                        ${optionsHTML}
                    </select>
                </div>
                <div class="form-group" style="flex:1;margin:0;">
                    <label class="item-ac-value-label">Value</label>
                    <input type="number" name="bi_item_${itemIndex}_ac_${index}_value" class="input-field" step="0.01" placeholder="0">
                </div>
                <button type="button" onclick="this.parentElement.remove()" style="padding:6px 10px;background:#ef4444;color:white;border:none;border-radius:4px;cursor:pointer;margin-bottom:2px;">✕</button>
            </div>`;
        container.insertAdjacentHTML('beforeend', html);
    }

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
                custom_sections: this._collectCustomSections(card)
            };

            // Collect additional costs from template-driven rows
            const acContainer = card.querySelector(`#bi-item-${i}-ac-rows`);
            const additionalCosts = [];
            if (acContainer) {
                acContainer.querySelectorAll('.bi-item-cost-row').forEach((row, acIdx) => {
                    const name = row.querySelector(`[name="bi_item_${i}_ac_${acIdx}_name"]`)?.value;
                    const value = parseFloat(row.querySelector(`[name="bi_item_${i}_ac_${acIdx}_value"]`)?.value);
                    if (name && !isNaN(value)) additionalCosts.push({ name, value });
                });
            }

            if (t.buyer) {
                item.buyer_pricing_information = {
                    price: cnum('buyer_price'),
                    currency_code_id: cget('buyer_currency') || cget('currency_id'),
                    additional_costs: [...additionalCosts],
                    taxes: []
                };
            } else {
                item.buyer_pricing_information = null;
            }

            if (t.seller) {
                item.seller_pricing_information = {
                    price: cnum('seller_price'),
                    currency_code_id: cget('seller_currency') || cget('currency_id'),
                    additional_costs: [...additionalCosts],
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

        // Collect additional costs from template-driven rows
        const additionalCostRows = form.querySelectorAll('.item-cost-row');
        const collectedAdditionalCosts = [];
        additionalCostRows.forEach((row, i) => {
            const name = row.querySelector(`[name="item_ac_${i}_name"]`)?.value;
            const value = parseFloat(row.querySelector(`[name="item_ac_${i}_value"]`)?.value);
            if (name && !isNaN(value)) {
                collectedAdditionalCosts.push({ name, value });
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
                    additional_costs: [...collectedAdditionalCosts],
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
                    additional_costs: [...collectedAdditionalCosts],
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

        payload.custom_sections = this._collectCustomSections(form);

        return payload;
    }

    _collectCustomSections(root) {
        const result = [];
        root.querySelectorAll('[data-custom-section]').forEach(container => {
            const sectionName = container.dataset.customSection;
            const customFields = [];

            container.querySelectorAll('[data-custom-field]').forEach(fieldEl => {
                const fieldName = fieldEl.dataset.customField;
                const fieldType = fieldEl.dataset.fieldType;
                let value = null;

                if (fieldType === 'BOOLEAN') {
                    const checkbox = fieldEl.querySelector('input[type="checkbox"]');
                    value = checkbox ? checkbox.checked : false;
                } else if (fieldType === 'CHOICE') {
                    const isMulti = fieldEl.querySelectorAll('input[type="checkbox"]').length > 0;
                    if (isMulti) {
                        const checked = [...fieldEl.querySelectorAll('input[type="checkbox"]:checked')].map(cb => cb.value);
                        value = checked.length > 0 ? checked : null;
                    } else {
                        const select = fieldEl.querySelector('select');
                        value = select ? select.value : '';
                    }
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
                result.push({ name: sectionName, custom_fields: customFields });
            }
        });
        return result;
    }

    // ============================================================
    // NEW BULK API PAYLOAD BUILDERS & HELPERS
    // ============================================================

    /**
     * Generic helper: add a cost row (name + value) to any container
     */
    _addGenericCostRow(containerId, prefix) {
        const container = document.getElementById(containerId);
        if (!container) return;
        const idx = container.querySelectorAll('.cc-custom-item').length;
        const card = document.createElement('div');
        card.className = 'cc-custom-item';
        card.style.cssText = 'padding:12px;border:1px solid #e2e8f0;border-radius:8px;margin-bottom:8px;position:relative;';
        card.innerHTML = `
            <button type="button" onclick="this.parentElement.remove()" style="position:absolute;top:4px;right:8px;background:none;border:none;cursor:pointer;color:#ef4444;font-size:16px;">✕</button>
            <div class="form-row">
                <div class="form-group"><label>Cost Name</label><input type="text" name="${prefix}_${idx}_name" class="input-field" placeholder="e.g. Freight"></div>
                <div class="form-group"><label>Value</label><input type="number" name="${prefix}_${idx}_value" class="input-field" step="0.01" value="0"></div>
            </div>`;
        container.appendChild(card);
    }

    /**
     * Generic helper: add a custom section row (section name + JSON fields) to any container
     */
    _addGenericCustomSection(containerId, prefix) {
        const container = document.getElementById(containerId);
        if (!container) return;
        const idx = container.querySelectorAll('.cc-custom-item').length;
        const card = document.createElement('div');
        card.className = 'cc-custom-item';
        card.style.cssText = 'padding:12px;border:1px solid #e2e8f0;border-radius:8px;margin-bottom:8px;position:relative;';
        card.innerHTML = `
            <button type="button" onclick="this.parentElement.remove()" style="position:absolute;top:4px;right:8px;background:none;border:none;cursor:pointer;color:#ef4444;font-size:16px;">✕</button>
            <div class="form-group"><label>Section Name</label><input type="text" name="${prefix}_${idx}_name" class="input-field" placeholder="e.g. Item details"></div>
            <div class="form-group"><label>Custom Fields (JSON array)</label><textarea name="${prefix}_${idx}_fields" class="form-textarea" rows="2" placeholder='[{"name":"field1","value":"val1"}]'></textarea></div>`;
        container.appendChild(card);
    }

    /**
     * Collect generic cost rows from a container
     */
    _collectGenericCosts(containerId, prefix) {
        const container = document.getElementById(containerId);
        if (!container) return [];
        const costs = [];
        container.querySelectorAll('.cc-custom-item').forEach((card, i) => {
            const name = card.querySelector(`[name="${prefix}_${i}_name"]`)?.value?.trim();
            const value = card.querySelector(`[name="${prefix}_${i}_value"]`)?.value;
            if (name && value) costs.push({ name, value: parseFloat(value) });
        });
        return costs;
    }

    /**
     * Collect generic custom sections from a container
     */
    _collectGenericCustomSections(containerId, prefix) {
        const container = document.getElementById(containerId);
        if (!container) return [];
        const sections = [];
        container.querySelectorAll('.cc-custom-item').forEach((card, i) => {
            const sectionName = card.querySelector(`[name="${prefix}_${i}_name"]`)?.value?.trim();
            const fieldsJson = card.querySelector(`[name="${prefix}_${i}_fields"]`)?.value?.trim();
            if (sectionName && fieldsJson) {
                try {
                    sections.push({ name: sectionName, custom_fields: JSON.parse(fieldsJson) });
                } catch (e) { console.error('Invalid JSON in custom section:', e); }
            }
        });
        return sections;
    }

    /**
     * Items Update payload builder
     */
    _buildItemUpdatePayload() {
        const form = this.elements.operationForm;
        const get = (name) => form.querySelector(`[name="${name}"]`)?.value?.trim() || '';

        const payload = {
            modified_by_user_email: get('modified_by_user_email'),
            name: get('name'),
            ERP_item_code: get('ERP_item_code'),
            factwise_item_code: get('factwise_item_code'),
            item_type: get('item_type'),
            is_buyer: !!form.querySelector('[name="is_buyer"]')?.checked,
            is_seller: !!form.querySelector('[name="is_seller"]')?.checked,
            measurement_units: get('measurement_units') ? get('measurement_units').split(',').map(u => u.trim()).filter(u => u) : []
        };

        const desc = get('description'); if (desc) payload.description = desc;
        const notes = get('notes'); if (notes) payload.notes = notes;
        const intNotes = get('internal_notes'); if (intNotes) payload.internal_notes = intNotes;

        // Buyer pricing
        if (payload.is_buyer) {
            const bp = get('buyer_price'), bc = get('buyer_currency_code_id');
            if (bp || bc) payload.buyer_pricing_information = { price: bp ? parseFloat(bp) : 0, currency_code_id: bc || null, additional_costs: [], taxes: [] };
        }
        // Seller pricing
        if (payload.is_seller) {
            const sp = get('seller_price'), sc = get('seller_currency_code_id');
            if (sp || sc) payload.seller_pricing_information = { price: sp ? parseFloat(sp) : 0, currency_code_id: sc || null, additional_costs: [], taxes: [] };
        }

        // Tags
        const tags = get('tags');
        payload.tags = tags ? tags.split(',').map(t => t.trim()).filter(t => t) : [];

        // Custom IDs
        payload.custom_ids = [];
        const customIds = get('custom_ids');
        if (customIds) {
            customIds.split(',').forEach(pair => {
                const [n, v] = pair.split(':').map(s => s.trim());
                if (n && v) payload.custom_ids.push({ name: n, value: v });
            });
        }

        // Entities
        const entityName = get('entity_name');
        const prefVendors = get('preferred_vendors');
        payload.entities = [{
            entity_name: entityName,
            ERP_preferred_vendors: prefVendors ? prefVendors.split(',').map(v => v.trim()).filter(v => v) : []
        }];

        // Custom sections
        payload.custom_sections = this._collectGenericCustomSections('item-update-custom-sections-container', 'iu_cs');

        return { items: [payload] };
    }

    /**
     * Vendors Update payload builder
     */
    _buildVendorUpdatePayload() {
        const form = this.elements.operationForm;
        const get = (name) => form.querySelector(`[name="${name}"]`)?.value?.trim() || '';

        const payload = {
            modified_by_user_email: get('modified_by_user_email'),
            vendor_name: get('vendor_name'),
            ERP_vendor_code: get('ERP_vendor_code'),
            factwise_vendor_code: get('factwise_vendor_code'),
            notes: get('notes') || null,
            tags: get('tags') ? get('tags').split(',').map(t => t.trim()).filter(t => t) : [],
            seller_address_information: get('seller_address_information') ? get('seller_address_information').split(',').map(a => a.trim()).filter(a => a) : [],
            seller_identifications: [],
            additional_costs: [],
            entities: [],
            primary_contact: {},
            custom_sections: []
        };

        // Primary contact
        const primaryPhones = get('primary_phone_numbers');
        payload.primary_contact = {
            full_name: get('primary_full_name'),
            phone_numbers: primaryPhones ? primaryPhones.split(',').map(p => parseInt(p.trim())).filter(p => !isNaN(p)) : [],
            emails: [{ email: get('primary_email'), type: get('primary_email_type') }]
        };

        // Identifications
        if (get('identification_name') && get('identification_value')) {
            payload.seller_identifications.push({ identification_name: get('identification_name'), identification_value: get('identification_value') });
        }

        // Entities
        const entityNames = get('entity_names');
        if (entityNames) entityNames.split(',').forEach(n => { const t = n.trim(); if (t) payload.entities.push({ entity_name: t }); });

        // Costs
        payload.additional_costs = this._collectGenericCosts('vendor-update-costs-container', 'vu_cost');

        // Custom sections
        payload.custom_sections = this._collectGenericCustomSections('vendor-update-custom-sections-container', 'vu_cs');

        return { vendors: [payload] };
    }

    /**
     * Project Update payload builder (duplicate of create logic)
     */
    _buildProjectUpdatePayload() {
        const form = this.elements.operationForm;
        const get = (name) => form.querySelector(`[name="${name}"]`)?.value?.trim() || '';

        const payload = {
            created_by_user_email: get('created_by_user_email'),
            project_name: get('project_name'),
            entity_name: get('entity_name'),
            project_status: get('project_status')
        };

        const pc = get('project_code'); if (pc) payload.project_code = pc;
        const epc = get('ERP_project_code'); if (epc) payload.ERP_project_code = epc;
        const cc = get('customer_code'); if (cc) payload.customer_code = cc;
        const tn = get('template_name'); if (tn) payload.template_name = tn;
        const desc = get('description'); if (desc) payload.description = desc;
        const intNotes = get('internal_notes'); if (intNotes) payload.internal_notes = intNotes;

        const vf = get('validity_from');
        payload.validity_from = vf ? new Date(vf).toISOString() : null;
        const vt = get('validity_to');
        payload.validity_to = vt ? new Date(vt).toISOString() : null;

        payload.custom_sections = this._collectGenericCustomSections('project-update-custom-sections-container', 'pu_cs');

        return { projects: [payload] };
    }

    /**
     * Add a requisition item row
     */
    _addRequisitionItem(containerId, prefix) {
        const container = document.getElementById(containerId);
        if (!container) return;
        const idx = container.querySelectorAll('.cc-custom-item').length;
        const card = document.createElement('div');
        card.className = 'cc-custom-item';
        card.style.cssText = 'padding:12px;border:1px solid #e2e8f0;border-radius:8px;margin-bottom:8px;position:relative;';
        card.innerHTML = `
            <button type="button" onclick="this.parentElement.remove()" style="position:absolute;top:4px;right:8px;background:none;border:none;cursor:pointer;color:#ef4444;font-size:16px;">✕</button>
            <div style="font-weight:600;margin-bottom:8px;color:#1e293b;">Item ${idx + 1}</div>
            <div class="form-row">
                <div class="form-group"><label>ERP Item Code</label><input type="text" name="${prefix}_${idx}_erp_item_code" class="input-field"></div>
                <div class="form-group"><label>Factwise Item Code</label><input type="text" name="${prefix}_${idx}_fw_item_code" class="input-field"></div>
            </div>
            <div class="form-row">
                <div class="form-group"><label>Measurement Unit ID</label><input type="text" name="${prefix}_${idx}_measurement_unit_id" class="input-field" placeholder="UUID"></div>
                <div class="form-group"><label>Quantity</label><input type="number" name="${prefix}_${idx}_quantity" class="input-field" step="0.01" value="1"></div>
            </div>
            <div class="form-row">
                <div class="form-group"><label>Desired Price</label><input type="number" name="${prefix}_${idx}_desired_price" class="input-field" step="0.01"></div>
                <div class="form-group"><label>Shipping Address ID</label><input type="text" name="${prefix}_${idx}_shipping_address_id" class="input-field"></div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Incoterm</label>
                    <select name="${prefix}_${idx}_incoterm" class="input-field">
                        <option value="NA (NONE)" selected>NA (NONE)</option><option value="FOB (Free On Board)">FOB</option><option value="CIF (Cost, Insurance and Frieght)">CIF</option>
                        <option value="EXW (Ex Works)">EXW</option><option value="DDP (Delivered Duty Paid)">DDP</option><option value="FCA (Free Carrier)">FCA</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Payment Type</label>
                    <select name="${prefix}_${idx}_payment_type" class="input-field">
                        <option value="PER_INVOICE_TERM" selected>PER_INVOICE_TERM</option><option value="PER_PO_TERM">PER_PO_TERM</option>
                    </select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group"><label>Lead Time</label><input type="number" name="${prefix}_${idx}_lead_time" class="input-field" min="1" max="31"></div>
                <div class="form-group">
                    <label>Lead Time Period</label>
                    <select name="${prefix}_${idx}_lead_time_period" class="input-field">
                        <option value="DAYS" selected>DAYS</option><option value="WEEKS">WEEKS</option><option value="MONTHS">MONTHS</option>
                    </select>
                </div>
            </div>
            <div class="form-group"><label>Prepayment %</label><input type="number" name="${prefix}_${idx}_prepayment" class="input-field" step="0.01" min="0" max="100"></div>
            <div class="form-row">
                <div class="form-group"><label>ERP Vendor Codes (comma-sep)</label><input type="text" name="${prefix}_${idx}_erp_vendor_codes" class="input-field"></div>
                <div class="form-group"><label>Factwise Vendor Codes (comma-sep)</label><input type="text" name="${prefix}_${idx}_fw_vendor_codes" class="input-field"></div>
            </div>`;
        container.appendChild(card);
    }

    /**
     * Collect requisition items from a container
     */
    _collectRequisitionItems(containerId, prefix) {
        const container = document.getElementById(containerId);
        if (!container) return [];
        const items = [];
        container.querySelectorAll('.cc-custom-item').forEach((card, i) => {
            const get = (suffix) => card.querySelector(`[name="${prefix}_${i}_${suffix}"]`)?.value?.trim() || '';
            const item = {};

            const erp = get('erp_item_code'); if (erp) item.ERP_item_code = erp;
            const fw = get('fw_item_code'); if (fw) item.factwise_item_code = fw;
            const mu = get('measurement_unit_id'); if (mu) item.measurement_unit_id = mu.split(',').map(u => u.trim());
            const qty = get('quantity'); if (qty) item.quantity = parseFloat(qty);
            const dp = get('desired_price'); if (dp) item.desired_price = parseFloat(dp);
            const sa = get('shipping_address_id'); if (sa) item.shipping_address_id = sa;
            const ic = get('incoterm'); if (ic) item.incoterm = ic;
            const pt = get('payment_type'); if (pt) item.payment_type = pt;
            const lt = get('lead_time'); if (lt) item.lead_time = parseInt(lt);
            const ltp = get('lead_time_period'); if (ltp) item.lead_time_period = ltp;
            const pp = get('prepayment'); if (pp) item.prepayment_percentage = parseFloat(pp);

            const erpVendors = get('erp_vendor_codes');
            if (erpVendors) item.ERP_vendor_codes = erpVendors.split(',').map(v => v.trim()).filter(v => v);
            const fwVendors = get('fw_vendor_codes');
            if (fwVendors) item.factwise_vendor_codes = fwVendors.split(',').map(v => v.trim()).filter(v => v);

            if (Object.keys(item).length > 0) items.push(item);
        });
        return items;
    }

    /**
     * Requisition Create payload builder
     */
    _buildRequisitionCreatePayload() {
        const form = this.elements.operationForm;
        const get = (name) => form.querySelector(`[name="${name}"]`)?.value?.trim() || '';

        const payload = {
            created_by_user_email: get('created_by_user_email'),
            requisition_name: get('requisition_name'),
            ERP_requisition_id: get('ERP_requisition_id'),
            currency_code_id: get('currency_code_id'),
            entity_name: get('entity_name'),
            template_name: get('template_name'),
            status: get('status')
        };

        const pc = get('project_code'); if (pc) payload.project_code = pc;
        const notes = get('notes'); if (notes) payload.notes = notes;

        payload.requisitions_items = this._collectRequisitionItems('req-create-items-container', 'rc_item');
        payload.custom_sections = this._collectGenericCustomSections('req-create-custom-sections-container', 'rc_cs');

        return { requisitions: [payload] };
    }

    /**
     * Requisition Update payload builder
     */
    _buildRequisitionUpdatePayload() {
        const form = this.elements.operationForm;
        const get = (name) => form.querySelector(`[name="${name}"]`)?.value?.trim() || '';

        const payload = {
            modified_by_user_email: get('modified_by_user_email'),
            requisition_name: get('requisition_name'),
            ERP_requisition_id: get('ERP_requisition_id'),
            factwise_requisition_id: get('factwise_requisition_id'),
            currency_code_id: get('currency_code_id'),
            entity_name: get('entity_name'),
            status: get('status')
        };

        const pc = get('project_code'); if (pc) payload.project_code = pc;
        const notes = get('notes'); if (notes) payload.notes = notes;

        payload.requisition_items = this._collectRequisitionItems('req-update-items-container', 'ru_item');
        payload.custom_sections = this._collectGenericCustomSections('req-update-custom-sections-container', 'ru_cs');

        return { requisitions: [payload] };
    }

    /**
     * Requisition Terminate payload builder
     */
    _buildRequisitionTerminatePayload() {
        const form = this.elements.operationForm;
        const get = (name) => form.querySelector(`[name="${name}"]`)?.value?.trim() || '';

        const payload = {
            modified_by_user_email: get('modified_by_user_email'),
            ERP_requisition_id: get('ERP_requisition_id'),
            factwise_requisition_id: get('factwise_requisition_id'),
            status: get('status')
        };

        const notes = get('notes'); if (notes) payload.notes = notes;

        return { requisitions: [payload] };
    }

    /**
     * Add a costing sheet item row
     */
    _addCostingSheetItem() {
        const container = document.getElementById('cs-create-items-container');
        if (!container) return;
        const idx = container.querySelectorAll('.cc-custom-item').length;
        const card = document.createElement('div');
        card.className = 'cc-custom-item';
        card.style.cssText = 'padding:12px;border:1px solid #e2e8f0;border-radius:8px;margin-bottom:8px;position:relative;';
        card.innerHTML = `
            <button type="button" onclick="this.parentElement.remove()" style="position:absolute;top:4px;right:8px;background:none;border:none;cursor:pointer;color:#ef4444;font-size:16px;">✕</button>
            <div style="font-weight:600;margin-bottom:8px;color:#1e293b;">Item ${idx + 1}</div>
            <div class="form-row">
                <div class="form-group"><label>ERP Item Code</label><input type="text" name="cs_item_${idx}_erp_code" class="input-field"></div>
                <div class="form-group"><label>Factwise Item Code</label><input type="text" name="cs_item_${idx}_fw_code" class="input-field"></div>
            </div>
            <div class="form-row">
                <div class="form-group"><label>Name</label><input type="text" name="cs_item_${idx}_name" class="input-field"></div>
                <div class="form-group"><label>Measurement Unit ID</label><input type="text" name="cs_item_${idx}_mu_id" class="input-field" placeholder="UUID"></div>
            </div>
            <div class="form-row">
                <div class="form-group"><label>Quantity *</label><input type="number" name="cs_item_${idx}_quantity" class="input-field" step="0.01" value="1"></div>
                <div class="form-group"><label>Rate *</label><input type="number" name="cs_item_${idx}_rate" class="input-field" step="0.01" value="0"></div>
            </div>
            <div class="form-row">
                <div class="form-group"><label>Vendor Entity Name</label><input type="text" name="cs_item_${idx}_vendor_entity" class="input-field"></div>
                <div class="form-group"><label>Vendor Rate *</label><input type="number" name="cs_item_${idx}_vendor_rate" class="input-field" step="0.01" value="0"></div>
            </div>
            <div class="form-row">
                <div class="form-group"><label>Vendor Currency ID *</label><input type="text" name="cs_item_${idx}_vendor_currency" class="input-field" placeholder="UUID"></div>
                <div class="form-group"><label>Total</label><input type="number" name="cs_item_${idx}_total" class="input-field" step="0.01"></div>
            </div>
            <div class="form-row">
                <div class="form-group"><label>Lead Time</label><input type="number" name="cs_item_${idx}_lead_time" class="input-field"></div>
                <div class="form-group">
                    <label>Lead Time Period</label>
                    <select name="cs_item_${idx}_lead_time_period" class="input-field"><option value="DAYS">DAYS</option><option value="WEEKS">WEEKS</option><option value="MONTHS">MONTHS</option></select>
                </div>
            </div>
            <div class="form-group"><label>Notes</label><input type="text" name="cs_item_${idx}_notes" class="input-field"></div>
            <div class="form-group"><label>Description</label><input type="text" name="cs_item_${idx}_description" class="input-field"></div>`;
        container.appendChild(card);
    }

    /**
     * Costing Sheet Create payload builder
     */
    _buildCostingSheetCreatePayload() {
        const form = this.elements.operationForm;
        const get = (name) => form.querySelector(`[name="${name}"]`)?.value?.trim() || '';

        const payload = {
            created_by_user_email: get('created_by_user_email'),
            name: get('name'),
            status: get('status')
        };

        const addIfPresent = (key, name) => { const v = get(name); if (v) payload[key] = v; };
        addIfPresent('ERP_costing_sheet_id', 'ERP_costing_sheet_id');
        addIfPresent('factwise_costing_sheet_code', 'factwise_costing_sheet_code');
        addIfPresent('template_name', 'template_name');
        addIfPresent('seller_entity_name', 'seller_entity_name');
        addIfPresent('customer_entity_name', 'customer_entity_name');
        addIfPresent('currency_code_id', 'currency_code_id');
        addIfPresent('project_code', 'project_code');
        addIfPresent('modified_by_user_email', 'modified_by_user_email');
        addIfPresent('internal_notes', 'internal_notes');
        addIfPresent('external_notes', 'external_notes');
        addIfPresent('status_notes', 'status_notes');

        const vd = get('validity_datetime'); if (vd) payload.validity_datetime = new Date(vd).toISOString();
        const dd = get('deadline_datetime'); if (dd) payload.deadline_datetime = new Date(dd).toISOString();

        const emails = get('customer_contact_emails');
        if (emails) payload.customer_contact_emails = emails.split(',').map(e => e.trim()).filter(e => e);

        // Additional costs
        payload.additional_costs = this._collectGenericCosts('cs-create-costs-container', 'cs_cost');

        // Costing sheet items
        const itemsContainer = document.getElementById('cs-create-items-container');
        payload.costing_sheet_items = [];
        if (itemsContainer) {
            itemsContainer.querySelectorAll('.cc-custom-item').forEach((card, i) => {
                const g = (s) => card.querySelector(`[name="cs_item_${i}_${s}"]`)?.value?.trim() || '';
                const item = {};
                const erp = g('erp_code'); if (erp) item.erp_item_code = erp;
                const fw = g('fw_code'); if (fw) item.factwise_item_code = fw;
                const nm = g('name'); if (nm) item.name = nm;
                const mu = g('mu_id'); if (mu) item.measurement_unit_id = mu;
                const qty = g('quantity'); if (qty) item.quantity = parseFloat(qty);
                const rate = g('rate'); if (rate) item.rate = parseFloat(rate);
                const ve = g('vendor_entity'); if (ve) item.vendor_entity_name = ve;
                const vr = g('vendor_rate'); if (vr) item.vendor_rate = parseFloat(vr);
                const vc = g('vendor_currency'); if (vc) item.vendor_currency_id = vc;
                const total = g('total'); if (total) item.total = parseFloat(total);
                const lt = g('lead_time'); if (lt) item.lead_time = parseInt(lt);
                const ltp = g('lead_time_period'); if (ltp) item.lead_time_period = ltp;
                const notes = g('notes'); if (notes) item.notes = notes;
                const desc = g('description'); if (desc) item.description = desc;
                if (Object.keys(item).length > 0) payload.costing_sheet_items.push(item);
            });
        }

        // Custom sections
        payload.custom_sections = this._collectGenericCustomSections('cs-create-custom-sections-container', 'cs_cs');

        return payload; // No bulk wrapper for costing sheet create
    }

    /**
     * Add a costing sheet mapping row
     */
    _addCostingSheetMapping() {
        const container = document.getElementById('cs-mapping-container');
        if (!container) return;
        const idx = container.querySelectorAll('.cc-custom-item').length;
        const card = document.createElement('div');
        card.className = 'cc-custom-item';
        card.style.cssText = 'padding:12px;border:1px solid #e2e8f0;border-radius:8px;margin-bottom:8px;position:relative;';
        card.innerHTML = `
            <button type="button" onclick="this.parentElement.remove()" style="position:absolute;top:4px;right:8px;background:none;border:none;cursor:pointer;color:#ef4444;font-size:16px;">✕</button>
            <div class="form-row">
                <div class="form-group"><label>Factwise ID *</label><input type="text" name="cs_map_${idx}_fw_id" class="input-field" placeholder="Factwise costing sheet ID"></div>
                <div class="form-group"><label>ERP ID *</label><input type="text" name="cs_map_${idx}_erp_id" class="input-field" placeholder="ERP costing sheet ID"></div>
            </div>`;
        container.appendChild(card);
    }

    /**
     * Costing Sheet Mapping payload builder
     */
    _buildCostingSheetMappingPayload() {
        const container = document.getElementById('cs-mapping-container');
        const mappings = [];
        if (container) {
            container.querySelectorAll('.cc-custom-item').forEach((card, i) => {
                const fwId = card.querySelector(`[name="cs_map_${i}_fw_id"]`)?.value?.trim();
                const erpId = card.querySelector(`[name="cs_map_${i}_erp_id"]`)?.value?.trim();
                if (fwId && erpId) mappings.push({ factwise_id: fwId, erp_id: erpId });
            });
        }
        return { mappings };
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
            const sectionKey = field.section_alternate_name || field.section_name || 'Custom Fields';
            if (!fieldsBySection[sectionKey]) {
                fieldsBySection[sectionKey] = [];
            }
            fieldsBySection[sectionKey].push(field);
        });

        // Generate HTML for each section
        Object.entries(fieldsBySection).forEach(([sectionKey, fields]) => {
            const sectionDisplayName = fields[0].section_name || sectionKey;
            const sectionHTML = `
                <p class="cc-sub-title" style="margin-top: 16px;">🔧 ${sectionDisplayName}</p>
                <div data-custom-section="${sectionKey}">
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
        const fieldName = field.alternate_name || field.name;
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
     * Builds the payload for vendor bulk create operation
     */
    _buildVendorsBulkCreatePayload() {
        const form = this.elements.operationForm;
        const createdBy = form.querySelector('[name="bv_created_by"]')?.value || this.currentAccount?.user_email;
        const entityName = form.querySelector('[name="bv_entity_name"]')?.value || 'FactWise';

        const container = document.getElementById('bulk-vendors-container');
        if (!container) throw new Error('Vendor bulk container not found');

        const cards = container.querySelectorAll('.bulk-vendor-card');
        const vendors = [];

        cards.forEach((card) => {
            const idx = card.dataset.vendorIndex;
            const vendor = {
                created_by_user_email: createdBy,
                vendor_name: form.querySelector(`[name="bv_${idx}_vendor_name"]`)?.value || '',
                ERP_vendor_code: form.querySelector(`[name="bv_${idx}_ERP_vendor_code"]`)?.value || '',
                notes: form.querySelector(`[name="bv_${idx}_notes"]`)?.value || '',
                primary_contact: {
                    full_name: form.querySelector(`[name="bv_${idx}_contact_name"]`)?.value || '',
                    primary_email: form.querySelector(`[name="bv_${idx}_contact_email"]`)?.value || '',
                },
                entity_names: (form.querySelector(`[name="bv_${idx}_entity_names"]`)?.value || entityName).split(',').map(s => s.trim()).filter(Boolean),
            };
            vendors.push(vendor);
        });

        return vendors.length === 1 ? vendors[0] : { vendors };
    }

    /**
     * Generic bulk payload builder for any operation
     * Builds payload from bulk-records-container
     */
    _buildBulkPayload() {
        const container = document.getElementById('bulk-records-container');
        if (!container) {
            throw new Error('Bulk records container not found');
        }

        const cards = container.querySelectorAll('.bulk-record-card');
        if (cards.length === 0) {
            throw new Error('At least one record is required');
        }

        const userEmail = document.querySelector('input[name="bulk_user_email"]')?.value || this.currentAccount?.user_email;
        const records = [];

        cards.forEach((card, idx) => {
            const recordIndex = card.dataset.recordIndex;
            const record = { modified_by_user_email: userEmail };

            // Collect all inputs from this card
            const inputs = card.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                const name = input.name;
                if (name && name.startsWith(`bulk_${recordIndex}_`)) {
                    const fieldName = name.replace(`bulk_${recordIndex}_`, '');
                    let value = input.value;

                    // Handle different input types
                    if (input.type === 'checkbox') {
                        value = input.checked;
                    } else if (input.type === 'number') {
                        value = parseFloat(value) || 0;
                    }

                    record[fieldName] = value;
                }
            });

            records.push(record);
        });

        // Return appropriate wrapper based on module
        const module = this.currentModule;
        if (module === 'items') {
            return { items: records };
        } else if (module === 'vendors') {
            return { vendors: records };
        } else if (module === 'purchase_order') {
            return { purchase_orders: records };
        } else if (module === 'contract') {
            return { contracts: records };
        } else if (module === 'projects') {
            return { projects: records };
        }

        return { records };
    }

    /**
     * Builds the payload for PO bulk create operation
     */
    _buildPOsBulkCreatePayload() {
        const form = this.elements.operationForm;
        const createdBy = form.querySelector('[name="bpo_created_by"]')?.value || this.currentAccount?.user_email;
        const entityName = form.querySelector('[name="bpo_entity_name"]')?.value || 'FactWise';

        const container = document.getElementById('bulk-pos-container');
        if (!container) throw new Error('PO bulk container not found');

        const cards = container.querySelectorAll('.bulk-po-card');
        const pos = [];

        cards.forEach((card) => {
            const idx = card.dataset.poIndex;
            const po = {
                created_by_user_email: createdBy,
                ERP_po_id: form.querySelector(`[name="bpo_${idx}_ERP_po_id"]`)?.value || '',
                status: form.querySelector(`[name="bpo_${idx}_status"]`)?.value || 'ISSUED',
                currency_code_id: form.querySelector(`[name="bpo_${idx}_currency_code_id"]`)?.value || '',
                entity_name: entityName,
                ERP_vendor_code: form.querySelector(`[name="bpo_${idx}_ERP_vendor_code"]`)?.value || '',
                buyer_billing_address_id: form.querySelector(`[name="bpo_${idx}_billing_address"]`)?.value || '',
                buyer_shipping_address_id: form.querySelector(`[name="bpo_${idx}_shipping_address"]`)?.value || '',
                purchase_order_items: [],
            };

            // Collect PO items
            const itemsContainer = card.querySelector(`#bpo-${idx}-items-container`);
            if (itemsContainer) {
                const itemCards = itemsContainer.querySelectorAll('.cc-tier-card');
                itemCards.forEach((itemCard, itemIdx) => {
                    const item = {
                        ERP_item_code: form.querySelector(`[name="bpo_${idx}_item_${itemIdx}_erp_code"]`)?.value || '',
                        factwise_item_code: form.querySelector(`[name="bpo_${idx}_item_${itemIdx}_factwise_code"]`)?.value || '',
                        price: parseFloat(form.querySelector(`[name="bpo_${idx}_item_${itemIdx}_price"]`)?.value) || 0,
                        quantity: parseFloat(form.querySelector(`[name="bpo_${idx}_item_${itemIdx}_quantity"]`)?.value) || 0,
                        measurement_unit_id: form.querySelector(`[name="bpo_${idx}_item_${itemIdx}_unit_id"]`)?.value || '',
                        incoterm: form.querySelector(`[name="bpo_${idx}_item_${itemIdx}_incoterm"]`)?.value || 'DAP',
                        delivery_schedule: [{
                            delivery_date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
                            quantity: parseFloat(form.querySelector(`[name="bpo_${idx}_item_${itemIdx}_delivery_qty"]`)?.value) || 0,
                        }],
                    };
                    po.purchase_order_items.push(item);
                });
            }

            pos.push(po);
        });

        return pos.length === 1 ? pos[0] : { purchase_orders: pos };
    }

    /**
     * Builds the payload for contract bulk create operation
     */
    _buildContractsBulkCreatePayload() {
        const form = this.elements.operationForm;
        const sharedBuyerContact = form.querySelector('[name="bc_buyer_contact"]')?.value || this.currentAccount?.user_email || '';
        const sharedEntityName = form.querySelector('[name="bc_entity_name"]')?.value || 'FactWise';
        const sharedBuyerIdentifications = (form.querySelector('[name="bc_buyer_identifications"]')?.value || '').split(',').map(s => s.trim()).filter(s => s);
        const sharedBuyerAddress = form.querySelector('[name="bc_buyer_address"]')?.value || null;
        const sharedTemplateName = (() => {
            const s = form.querySelector('[name="bc_template_name"]');
            return s?.options[s.selectedIndex]?.dataset?.name || s?.value || 'Default Template';
        })();

        const container = document.getElementById('bulk-contracts-container');
        if (!container) throw new Error('Contract bulk container not found');

        const cards = container.querySelectorAll('.bulk-contract-card');
        const contracts = [];

        cards.forEach((card) => {
            const idx = card.dataset.contractIndex;
            const g = (name) => card.querySelector(`[name="bc_${idx}_${name}"]`)?.value || null;

            const contract = {
                created_by_user_email: sharedBuyerContact,
                contract_name: g('contract_name'),
                factwise_contract_id: g('factwise_contract_id'),
                ERP_contract_id: g('ERP_contract_id'),
                contract_start_date: g('start_date'),
                contract_end_date: g('end_date'),
                entity_name: sharedEntityName,
                status: g('status') || 'DRAFT',
                template_name: sharedTemplateName,
                buyer_contact: sharedBuyerContact,
                buyer_identifications: sharedBuyerIdentifications,
                buyer_address: sharedBuyerAddress,
                factwise_vendor_code: g('factwise_vendor_code'),
                ERP_vendor_code: g('ERP_vendor_code'),
                vendor_contact: g('vendor_contact'),
                vendor_identifications: [
                    {
                        identification_name: g('vendor_id_name'),
                        identification_value: g('vendor_id_value')
                    }
                ],
                vendor_address: {
                    address_id: g('vendor_address_id'),
                    full_address: null
                },
                project: g('project'),
                prepayment_percentage: parseFloat(g('prepayment_percentage')) || 0,
                payment_type: g('payment_type') || 'PER_INVOICE_ITEM',
                payment_terms: {
                    term: parseInt(g('payment_term')) || 1,
                    period: g('payment_period') || 'MONTHS',
                    applied_from: g('payment_applied_from') || 'INVOICE_DATE'
                },
                deliverables_payment_terms: [],
                incoterm: g('incoterm') || 'NA',
                lead_time: g('lead_time'),
                lead_time_period: g('lead_time_period'),
                additional_costs: [],
                taxes: [],
                discounts: [],
                custom_sections: [],
                attachments: [],
                terms_and_conditions: { data: '', name: 'FactWise Default TNC' },
                contract_items: []
            };

            // Collect contract items
            const itemsContainer = card.querySelector(`#bc-${idx}-items-container`);
            if (itemsContainer) {
                const itemCards = itemsContainer.querySelectorAll('.cc-tier-card');
                itemCards.forEach((itemCard, itemIdx) => {
                    const gi = (name) => itemCard.querySelector(`[name="bc_${idx}_item_${itemIdx}_${name}"]`)?.value || null;

                    const item = {
                        factwise_item_code: gi('factwise_code'),
                        ERP_item_code: gi('erp_code'),
                        quantity: parseFloat(gi('quantity')) || 0,
                        currency_code_id: gi('currency_id'),
                        measurement_unit_id: gi('unit_id'),
                        attributes: [],
                        pricing_tiers: [],
                        additional_costs: [],
                        taxes: [],
                        discounts: [],
                        prepayment_percentage: parseFloat(gi('prepayment')) || 0,
                        payment_type: gi('payment_type') || 'PER_INVOICE_ITEM',
                        payment_terms: {
                            term: parseInt(gi('payment_term')) || 1,
                            period: gi('payment_period') || 'MONTHS',
                            applied_from: gi('payment_applied_from') || 'INVOICE_DATE'
                        },
                        deliverables_payment_terms: [],
                        incoterm: gi('incoterm') || 'NA',
                        lead_time: gi('lead_time'),
                        lead_time_period: gi('lead_time_period'),
                        attachments: [],
                        custom_sections: []
                    };

                    // Collect tiers
                    const tiersContainer = itemCard.querySelector(`#bc-${idx}-item-${itemIdx}-tiers`);
                    if (tiersContainer) {
                        const tierRows = tiersContainer.querySelectorAll('.form-row');
                        tierRows.forEach((tierRow, t) => {
                            const tier = {
                                min_quantity: parseFloat(tierRow.querySelector(`[name="bc_${idx}_item_${itemIdx}_tier_${t}_min"]`)?.value) || 0,
                                max_quantity: parseFloat(tierRow.querySelector(`[name="bc_${idx}_item_${itemIdx}_tier_${t}_max"]`)?.value) || 0,
                                rate: parseFloat(tierRow.querySelector(`[name="bc_${idx}_item_${itemIdx}_tier_${t}_rate"]`)?.value) || 0,
                                additional_costs: [],
                                taxes: [],
                                discounts: []
                            };
                            item.pricing_tiers.push(tier);
                        });
                    }

                    contract.contract_items.push(item);
                });
            }

            contracts.push(contract);
        });

        return contracts.length === 1 ? contracts[0] : { contracts };
    }

    /**
     * Add a bulk vendor card
     */
    _addBulkVendor() {
        const container = document.getElementById('bulk-vendors-container');
        if (!container) return;

        const vendorIndex = container.querySelectorAll('.bv-vendor-card').length;
        const n = vendorIndex + 1;

        const card = document.createElement('div');
        card.className = 'bv-vendor-card cc-item-card';
        card.dataset.vendorIndex = vendorIndex;

        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <h4 style="margin: 0; color: #1e293b; font-size: 14px; font-weight: 600;">
                    🏢 Vendor ${n}
                </h4>
                <button type="button" onclick="window.uiController._removeBulkVendor(${vendorIndex})"
                    class="btn-remove-item" title="Remove Vendor">
                    ✕
                </button>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label>Vendor Name *</label>
                    <input type="text" name="bv_vendor_${vendorIndex}_name" class="input-field" required
                        value="Bulk Vendor ${n}">
                </div>
                <div class="form-group">
                    <label>ERP Vendor Code *</label>
                    <input type="text" name="bv_vendor_${vendorIndex}_erp_code" class="input-field" required
                        value="ERPV0${n}">
                </div>
            </div>
        `;

        container.appendChild(card);
    }

    /**
     * Remove a bulk vendor card
     */
    _removeBulkVendor(index) {
        const card = document.querySelector(`.bv-vendor-card[data-vendor-index="${index}"]`);
        if (card) card.remove();
    }

    /**
     * Add a bulk PO card
     */
    _addBulkPO() {
        const container = document.getElementById('bulk-pos-container');
        if (!container) return;

        const poIndex = container.querySelectorAll('.bpo-po-card').length;
        const n = poIndex + 1;

        const card = document.createElement('div');
        card.className = 'bpo-po-card cc-item-card';
        card.dataset.poIndex = poIndex;

        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <h4 style="margin: 0; color: #1e293b; font-size: 14px; font-weight: 600;">
                    📄 PO ${n}
                </h4>
                <button type="button" onclick="window.uiController._removeBulkPO(${poIndex})"
                    class="btn-remove-item" title="Remove PO">
                    ✕
                </button>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label>ERP PO ID *</label>
                    <input type="text" name="bpo_po_${poIndex}_erp_id" class="input-field" required
                        value="ERPPO0${n}">
                </div>
                <div class="form-group">
                    <label>Status *</label>
                    <select name="bpo_po_${poIndex}_status" class="input-field" required>
                        <option value="ISSUED" selected>ISSUED</option>
                        <option value="ONGOING">ONGOING</option>
                    </select>
                </div>
            </div>
        `;

        container.appendChild(card);
    }

    /**
     * Remove a bulk PO card
     */
    _removeBulkPO(index) {
        const card = document.querySelector(`.bpo-po-card[data-po-index="${index}"]`);
        if (card) card.remove();
    }

    /**
     * Add a bulk contract card
     */
    _addBulkContract() {
        const container = document.getElementById('bulk-contracts-container');
        if (!container) return;

        const contractIndex = container.querySelectorAll('.bc-contract-card').length;
        const n = contractIndex + 1;

        const card = document.createElement('div');
        card.className = 'bc-contract-card cc-item-card';
        card.dataset.contractIndex = contractIndex;

        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <h4 style="margin: 0; color: #1e293b; font-size: 14px; font-weight: 600;">
                    📋 Contract ${n}
                </h4>
                <button type="button" onclick="window.uiController._removeBulkContract(${contractIndex})"
                    class="btn-remove-item" title="Remove Contract">
                    ✕
                </button>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label>Contract Name *</label>
                    <input type="text" name="bc_contract_${contractIndex}_name" class="input-field" required
                        value="Bulk Contract ${n}">
                </div>
                <div class="form-group">
                    <label>ERP Contract ID *</label>
                    <input type="text" name="bc_contract_${contractIndex}_erp_id" class="input-field" required
                        value="ERPC0${n}">
                </div>
            </div>
        `;

        container.appendChild(card);
    }

    /**
     * Remove a bulk contract card
     */
    _removeBulkContract(index) {
        const card = document.querySelector(`.bc-contract-card[data-contract-index="${index}"]`);
        if (card) card.remove();
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
                    <input type="text" name="po_item_${itemIndex}_fw_code" class="input-field item-code-input" value="AA-FW-01">
                </div>
            </div>

            <!-- Price & Quantity -->
            <div class="form-row">
                <div class="form-group">
                    <label>Price *</label>
                    <input type="number" name="po_item_${itemIndex}_price" class="input-field" required value="10" step="0.01">
                </div>
                <div class="form-group">
                    <label>Quantity *</label>
                    <input type="number" name="po_item_${itemIndex}_quantity" class="input-field" required value="10" step="0.01">
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
                    <input type="number" name="po_item_${itemIndex}_delivery_quantity" class="input-field" required value="10" step="0.01">
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
        // If factwise_vendor_code is present, always prefer it and null out ERP code.
        // If only ERP code is given, send it (may fail if backend has duplicate ERP codes).
        const sellerIdName = get('seller_id_name');
        const sellerIdValue = get('seller_id_value');
        const fwVendorCode = get('seller_factwise_vendor_code') || null;
        const erpVendorCode = get('seller_erp_vendor_code') || null;
        const seller_details = {
            ERP_vendor_code: fwVendorCode ? null : erpVendorCode,
            factwise_vendor_code: fwVendorCode,
            seller_address_id: get('seller_address_id') || null,
            seller_full_address: get('seller_full_address') || "",
            identifications: sellerIdName ? [{ identification_name: sellerIdName, identification_value: sellerIdValue || "" }] : [],
            contacts: get('seller_contacts') ? get('seller_contacts').split(',').map(s => s.trim()).filter(s => s) : []
        };

        // PO details
        const purchase_order_details = {
            created_by_user_email: get('created_by_user_email'),
            ERP_po_id: get('ERP_po_id'),
            status: get('po_status'),
            template_name: get('template_name') || null,
            issued_date: get('issue_date') || null,
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
            custom_sections: (() => {
                const config = this.templateManager?.poTemplateConfig;
                const fields = config?.poLevel?.customSections || [];
                const seen = new Set();
                return fields.map(f => f.section_name).filter(n => n && !seen.has(n) && seen.add(n)).map(name => ({ name, custom_fields: [] }));
            })()
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
                    custom_sections: (() => {
                        const config = this.templateManager?.poTemplateConfig;
                        const fields = config?.itemLevel?.customSections || [];
                        const seen = new Set();
                        return fields.map(f => f.section_name).filter(n => n && !seen.has(n) && seen.add(n)).map(name => ({ name, custom_fields: [] }));
                    })(),
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
    _bulkModeToggleHTML() {
        return `
        <div style="margin-bottom: 20px; padding: 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
            <div style="display: flex; align-items: center; gap: 16px;">
                <span style="font-weight: 600; color: #475569;">Bulk Mode:</span>
                <div class="mode-toggle-group">
                    <button type="button" class="mode-toggle-btn active" data-bulk-mode="payload" onclick="window.uiController._switchBulkMode('payload')">
                        📋 Payload Mode
                    </button>
                    <button type="button" class="mode-toggle-btn" data-bulk-mode="script" onclick="window.uiController._switchBulkMode('script')">
                        📜 Script Mode
                    </button>
                </div>
            </div>
        </div>`;
    }

    _bulkScriptModeHTML(type) {
        const fields = {
            items: [
                { key: 'name', label: 'Item Name', default: 'Test Item', canIncrement: true },
                { key: 'ERP_item_code', label: 'ERP Item Code', default: 'ERP-ITEM-001', canIncrement: true },
                { key: 'factwise_item_code', label: 'Factwise Item Code', default: 'BKT-001', canIncrement: true },
                { key: 'description', label: 'Description', default: 'Item created via script', canIncrement: false },
                { key: 'measurement_units', label: 'Measurement Unit ID', default: '66d42245-5a0d-4801-8cb2-43bf627f7cbe', canIncrement: false },
                { key: 'item_type', label: 'Item Type', default: 'RAW_MATERIAL', canIncrement: false },
                { key: 'buyer_price', label: 'Buyer Price', default: '1000', canIncrement: false },
                { key: 'seller_price', label: 'Seller Price', default: '1200', canIncrement: false },
            ],
            projects: [
                { key: 'project_name', label: 'Project Name', default: 'Test Project', canIncrement: true },
                { key: 'project_code', label: 'Project Code', default: 'PRJ-001', canIncrement: true },
                { key: 'ERP_project_code', label: 'ERP Project Code', default: 'ERP-PRJ-001', canIncrement: true },
                { key: 'project_status', label: 'Status', default: 'DRAFT', canIncrement: false },
                { key: 'description', label: 'Description', default: 'Project created via script', canIncrement: false },
            ],
            contracts: [
                { key: 'contract_name', label: 'Contract Name', default: 'Test Contract', canIncrement: true },
                { key: 'ERP_contract_id', label: 'ERP Contract ID', default: 'ERP-CON-001', canIncrement: true },
                { key: 'factwise_contract_id', label: 'Factwise Contract ID', default: 'FW-CON-001', canIncrement: true },
                { key: 'entity_name', label: 'Entity Name', default: 'FactWise', canIncrement: false },
                { key: 'status', label: 'Status', default: 'DRAFT', canIncrement: false },
                { key: 'template_name', label: 'Template Name', default: 'Default Template', canIncrement: false },
                { key: 'buyer_contact', label: 'Buyer Contact Email', default: '', canIncrement: false },
                { key: 'vendor_contact', label: 'Vendor Contact Email', default: '', canIncrement: false },
                { key: 'ERP_vendor_code', label: 'ERP Vendor Code', default: '', canIncrement: false },
                { key: 'incoterm', label: 'Incoterm', default: 'NA', canIncrement: false },
            ],
            vendors: [
                { key: 'vendor_name', label: 'Vendor Name', default: 'Test Vendor', canIncrement: true },
                { key: 'ERP_vendor_code', label: 'ERP Vendor Code', default: 'V-001', canIncrement: true },
                { key: 'entity_name', label: 'Entity Name', default: 'FactWise', canIncrement: false },
                { key: 'contact_name', label: 'Contact Full Name', default: 'Test Contact', canIncrement: true },
                { key: 'contact_email', label: 'Contact Email', default: 'vendor001@test.com', canIncrement: true },
            ],
            purchase_order: [
                { key: 'ERP_po_id', label: 'ERP PO ID', default: 'PO-001', canIncrement: true },
                { key: 'entity_name', label: 'Entity Name', default: 'FactWise', canIncrement: false },
                { key: 'status', label: 'Status', default: 'ISSUED', canIncrement: false },
                { key: 'currency_code_id', label: 'Currency Code ID', default: 'a8c3e3fd-b05f-4d09-bd2f-9fedd07d0ec3', canIncrement: false },
                { key: 'ERP_vendor_code', label: 'ERP Vendor Code', default: '', canIncrement: false },
            ],
        };

        const typeFields = fields[type] || [];
        const fieldRows = this._renderScriptFieldRows(typeFields);

        // Build extra sections for complex types
        let extraSections = '';

        if (type === 'contracts') {
            extraSections = this._contractScriptItemsSection();
        } else if (type === 'purchase_order') {
            extraSections = this._poScriptItemsSection();
        }

        return `
            <div class="cc-config-box">
                <p class="cc-config-box-title">📜 Script Configuration</p>
                <div class="cc-config-panel" style="border-left:none;">
                    <div class="form-row">
                        <div class="form-group">
                            <label>How many?</label>
                            <input type="number" name="script_count" class="input-field" value="5" min="1" max="1000">
                        </div>
                        <div class="form-group">
                            <label>Start index</label>
                            <input type="number" name="script_start_index" class="input-field" value="1" min="0">
                        </div>
                    </div>
                    <p style="font-size:12px;color:#64748b;margin:8px 0 12px;">Fields marked "Increment" will have the counter appended (e.g. <code>ERP-ITEM-001</code> → <code>ERP-ITEM-002</code>). Step controls how much to add per iteration.</p>
                    ${fieldRows}
                </div>
            </div>
            ${extraSections}`;
    }

    _renderScriptFieldRows(fields) {
        return fields.map(f => `
            <div class="form-row" style="align-items:center;gap:8px;margin-bottom:6px;">
                <div class="form-group" style="flex:2;margin:0;">
                    <label style="font-size:12px;">${f.label}</label>
                    <input type="text" name="script_field_${f.key}" class="input-field" value="${f.default}" style="font-size:12px;">
                </div>
                ${f.canIncrement ? `
                <div class="form-group" style="flex:0 0 auto;margin:0;display:flex;align-items:center;gap:6px;padding-top:18px;">
                    <label style="font-size:11px;color:#64748b;white-space:nowrap;">
                        <input type="checkbox" name="script_increment_${f.key}" checked> Increment
                    </label>
                    <input type="number" name="script_step_${f.key}" value="1" min="1" style="width:50px;" class="input-field" title="Step">
                </div>` : '<div style="flex:0 0 130px;"></div>'}
            </div>`).join('');
    }

    /**
     * Contract script mode: items section where user adds N items (same across all contracts)
     * Each item can have tiers and costs with optional increment
     */
    _contractScriptItemsSection() {
        return `
            <div class="cc-config-box" style="margin-top:16px;">
                <p class="cc-config-box-title">📦 Contract Items (same items in every contract)</p>
                <div class="cc-config-panel" style="border-left:none;">
                    <div id="script-contract-items-container"></div>
                    <button type="button" class="btn-add-row" onclick="window.uiController._addScriptContractItem()" style="margin-top:8px;">
                        + Add Item
                    </button>
                </div>
            </div>

            <div class="cc-config-box" style="margin-top:16px;">
                <p class="cc-config-box-title">💰 Contract-Level Costs (same across all contracts)</p>
                <div class="cc-config-panel" style="border-left:none;">
                    <div id="script-contract-costs-container"></div>
                    <button type="button" class="btn-add-row" onclick="window.uiController._addScriptCostRow('script-contract-costs-container', 'sc_cost')" style="margin-top:8px;">
                        + Add Cost / Tax / Discount
                    </button>
                </div>
            </div>`;
    }

    _addScriptContractItem() {
        const container = document.getElementById('script-contract-items-container');
        if (!container) return;
        const idx = container.children.length;

        const card = document.createElement('div');
        card.className = 'cc-item-card';
        card.dataset.scriptItemIndex = idx;
        card.innerHTML = `
            <div class="cc-item-card-header">
                <div class="cc-item-card-badge">${idx + 1}</div>
                <div class="cc-item-card-title">Item #${idx + 1}</div>
                ${idx > 0 ? `<button type="button" onclick="this.closest('.cc-item-card').remove()" style="margin-left:auto;background:#ef4444;color:white;border:none;border-radius:4px;padding:6px 12px;cursor:pointer;font-size:12px;">✕ Remove</button>` : ''}
            </div>
            <div class="cc-item-card-body">
                <p class="cc-sub-title">📌 Item Identification</p>
                <div class="form-row">
                    <div class="form-group">
                        <label style="font-size:12px;">Factwise Item Code</label>
                        <input type="text" name="sc_item_${idx}_factwise_code" class="input-field" value="BKT-${String(idx + 1).padStart(3, '0')}" style="font-size:12px;">
                    </div>
                    <div class="form-group">
                        <label style="font-size:12px;">ERP Item Code</label>
                        <input type="text" name="sc_item_${idx}_erp_code" class="input-field" value="" style="font-size:12px;">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label style="font-size:12px;">Currency Code ID</label>
                        <input type="text" name="sc_item_${idx}_currency_id" class="input-field" value="a8c3e3fd-b05f-4d09-bd2f-9fedd07d0ec3" style="font-size:12px;">
                    </div>
                    <div class="form-group">
                        <label style="font-size:12px;">Measurement Unit ID</label>
                        <input type="text" name="sc_item_${idx}_unit_id" class="input-field" value="f16d124e-db59-48fe-a2b8-19f625745cbf" style="font-size:12px;">
                    </div>
                </div>

                <p class="cc-sub-title">💲 Pricing & Quantity</p>
                <div class="form-row">
                    <div class="form-group">
                        <label style="font-size:12px;">Rate</label>
                        <input type="number" name="sc_item_${idx}_rate" class="input-field" value="10" step="0.01" style="font-size:12px;">
                    </div>
                    <div class="form-group">
                        <label style="font-size:12px;">Quantity</label>
                        <input type="number" name="sc_item_${idx}_quantity" class="input-field" value="1000" step="0.01" style="font-size:12px;">
                    </div>
                    <div class="form-group">
                        <label style="font-size:12px;">Incoterm</label>
                        <select name="sc_item_${idx}_incoterm" class="input-field" style="font-size:12px;">
                            <option value="NA" selected>NA</option>
                            <option value="CFR">CFR</option>
                            <option value="DAP">DAP</option>
                            <option value="FOB">FOB</option>
                        </select>
                    </div>
                </div>

                <p class="cc-sub-title">📊 Pricing Tiers</p>
                <div id="sc-item-${idx}-tiers-container">
                    ${this._renderScriptTier(idx, 0)}
                </div>
                <button type="button" class="btn-add-row" style="font-size:11px;padding:4px 10px;" onclick="window.uiController._addScriptTier(${idx})">+ Add Tier</button>

                <p class="cc-sub-title" style="margin-top:12px;">💰 Item Costs / Taxes</p>
                <div id="sc-item-${idx}-costs-container"></div>
                <button type="button" class="btn-add-row" style="font-size:11px;padding:4px 10px;" onclick="window.uiController._addScriptCostRow('sc-item-${idx}-costs-container', 'sc_item_${idx}_cost')">+ Add Cost / Tax</button>
            </div>
        `;
        container.appendChild(card);
    }

    _renderScriptTier(itemIdx, tierIdx) {
        return `
            <div class="cc-tier-card" data-script-tier-index="${tierIdx}">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                    <p class="cc-tier-card-title" style="margin:0;"><span class="tier-dot"></span>Tier ${tierIdx + 1}</p>
                    ${tierIdx > 0 ? `<button type="button" onclick="this.closest('.cc-tier-card').remove()" style="background:#ef4444;color:white;border:none;border-radius:4px;padding:4px 8px;cursor:pointer;font-size:11px;">✕</button>` : ''}
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label style="font-size:12px;">Min Qty</label>
                        <input type="number" name="sc_item_${itemIdx}_tier_${tierIdx}_min" class="input-field" value="${tierIdx === 0 ? 0 : ''}" step="0.01" style="font-size:12px;">
                    </div>
                    <div class="form-group">
                        <label style="font-size:12px;">Max Qty</label>
                        <input type="number" name="sc_item_${itemIdx}_tier_${tierIdx}_max" class="input-field" value="${tierIdx === 0 ? 100 : ''}" step="0.01" style="font-size:12px;">
                    </div>
                    <div class="form-group">
                        <label style="font-size:12px;">Rate</label>
                        <input type="number" name="sc_item_${itemIdx}_tier_${tierIdx}_rate" class="input-field" value="10" step="0.01" style="font-size:12px;">
                    </div>
                </div>
                <div id="sc-item-${itemIdx}-tier-${tierIdx}-costs-container"></div>
                <button type="button" class="btn-add-row" style="font-size:11px;padding:3px 8px;" onclick="window.uiController._addScriptCostRow('sc-item-${itemIdx}-tier-${tierIdx}-costs-container', 'sc_item_${itemIdx}_tier_${tierIdx}_cost')">+ Tier Cost</button>
            </div>`;
    }

    _addScriptTier(itemIdx) {
        const container = document.getElementById(`sc-item-${itemIdx}-tiers-container`);
        if (!container) return;
        const tierIdx = container.children.length;
        container.insertAdjacentHTML('beforeend', this._renderScriptTier(itemIdx, tierIdx));
    }

    /**
     * Generic script cost row adder - works for contract-level, item-level, and tier-level costs
     * @param {string} containerId - DOM id of the costs container
     * @param {string} prefix - Name prefix for inputs (e.g., 'sc_cost', 'sc_item_0_cost', 'sc_item_0_tier_0_cost')
     */
    _addScriptCostRow(containerId, prefix) {
        const container = document.getElementById(containerId);
        if (!container) return;
        const idx = container.children.length;

        const html = `
            <div class="sc-cost-row" style="display:flex;gap:8px;align-items:flex-end;margin-bottom:6px;">
                <div class="form-group" style="flex:1;margin:0;">
                    <label style="font-size:11px;">Type</label>
                    <select name="${prefix}_${idx}_type" class="input-field" style="font-size:12px;">
                        <option value="cost">Cost</option>
                        <option value="tax">Tax</option>
                        <option value="discount">Discount</option>
                    </select>
                </div>
                <div class="form-group" style="flex:2;margin:0;">
                    <label style="font-size:11px;">Name</label>
                    <input type="text" name="${prefix}_${idx}_name" class="input-field" placeholder="e.g., GST" style="font-size:12px;">
                </div>
                <div class="form-group" style="flex:1;margin:0;">
                    <label style="font-size:11px;">Value</label>
                    <input type="number" name="${prefix}_${idx}_value" class="input-field" step="0.01" value="0" style="font-size:12px;">
                </div>
                <div class="form-group" style="flex:0 0 auto;margin:0;display:flex;align-items:center;gap:4px;padding-top:16px;">
                    <label style="font-size:11px;color:#64748b;white-space:nowrap;">
                        <input type="checkbox" name="${prefix}_${idx}_increment"> Incr
                    </label>
                    <input type="number" name="${prefix}_${idx}_step" value="1" min="1" style="width:40px;font-size:11px;" class="input-field" title="Step">
                </div>
                <button type="button" onclick="this.parentElement.remove()" style="padding:4px 8px;background:#ef4444;color:white;border:none;border-radius:4px;cursor:pointer;margin-bottom:2px;font-size:11px;">✕</button>
            </div>`;
        container.insertAdjacentHTML('beforeend', html);
    }

    /**
     * PO script mode: items section
     */
    _poScriptItemsSection() {
        return `
            <div class="cc-config-box" style="margin-top:16px;">
                <p class="cc-config-box-title">📦 PO Items (same items in every PO)</p>
                <div class="cc-config-panel" style="border-left:none;">
                    <div id="script-po-items-container"></div>
                    <button type="button" class="btn-add-row" onclick="window.uiController._addScriptPOItem()" style="margin-top:8px;">
                        + Add Item
                    </button>
                </div>
            </div>`;
    }

    _addScriptPOItem() {
        const container = document.getElementById('script-po-items-container');
        if (!container) return;
        const idx = container.children.length;

        const card = document.createElement('div');
        card.className = 'cc-item-card';
        card.dataset.scriptItemIndex = idx;
        card.innerHTML = `
            <div class="cc-item-card-header">
                <div class="cc-item-card-badge">${idx + 1}</div>
                <div class="cc-item-card-title">PO Item #${idx + 1}</div>
                ${idx > 0 ? `<button type="button" onclick="this.closest('.cc-item-card').remove()" style="margin-left:auto;background:#ef4444;color:white;border:none;border-radius:4px;padding:6px 12px;cursor:pointer;font-size:12px;">✕ Remove</button>` : ''}
            </div>
            <div class="cc-item-card-body">
                <div class="form-row">
                    <div class="form-group">
                        <label style="font-size:12px;">ERP Item Code</label>
                        <input type="text" name="sc_poitem_${idx}_erp_code" class="input-field" value="" style="font-size:12px;">
                    </div>
                    <div class="form-group">
                        <label style="font-size:12px;">Factwise Item Code</label>
                        <input type="text" name="sc_poitem_${idx}_factwise_code" class="input-field" value="BKT-${String(idx + 1).padStart(3, '0')}" style="font-size:12px;">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label style="font-size:12px;">Price</label>
                        <input type="number" name="sc_poitem_${idx}_price" class="input-field" value="100" step="0.01" style="font-size:12px;">
                    </div>
                    <div class="form-group">
                        <label style="font-size:12px;">Quantity</label>
                        <input type="number" name="sc_poitem_${idx}_quantity" class="input-field" value="100" step="0.01" style="font-size:12px;">
                    </div>
                    <div class="form-group">
                        <label style="font-size:12px;">Unit ID</label>
                        <input type="text" name="sc_poitem_${idx}_unit_id" class="input-field" value="f16d124e-db59-48fe-a2b8-19f625745cbf" style="font-size:12px;">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label style="font-size:12px;">Incoterm</label>
                        <select name="sc_poitem_${idx}_incoterm" class="input-field" style="font-size:12px;">
                            <option value="DAP" selected>DAP</option>
                            <option value="FOB">FOB</option>
                            <option value="CIF">CIF</option>
                            <option value="EXW">EXW</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label style="font-size:12px;">Delivery Qty</label>
                        <input type="number" name="sc_poitem_${idx}_delivery_qty" class="input-field" value="100" step="0.01" style="font-size:12px;">
                    </div>
                </div>
            </div>
        `;
        container.appendChild(card);
    }

    _switchBulkMode(mode) {
        const payloadDiv = document.getElementById('bulk-payload-mode');
        const scriptDiv = document.getElementById('bulk-script-mode');
        if (!payloadDiv || !scriptDiv) return;

        const isScript = mode === 'script';
        payloadDiv.style.display = isScript ? 'none' : '';
        scriptDiv.style.display = isScript ? '' : 'none';

        // Update toggle buttons using the same CSS class pattern as single/bulk toggle
        const toggleBtns = document.querySelectorAll('[data-bulk-mode]');
        toggleBtns.forEach(btn => {
            if (btn.dataset.bulkMode === mode) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        this._currentBulkMode = mode;

        // Script buttons only visible in bulk script mode
        if (this.elements.btnCopyScript) {
            this.elements.btnCopyScript.classList.toggle('hidden', !isScript);
        }
        if (this.elements.btnExecuteScript) {
            this.elements.btnExecuteScript.classList.toggle('hidden', !isScript);
        }
    }

    _generateBulkScript() {
        const form = this.elements.operationForm;
        const get = (name) => form.querySelector(`[name="${name}"]`)?.value?.trim() || '';
        const checked = (name) => form.querySelector(`[name="${name}"]`)?.checked ?? false;

        const count = parseInt(get('script_count')) || 5;
        const startIndex = parseInt(get('script_start_index')) || 1;

        const env = this.environmentManager.getEnvironment();
        const account = this.currentAccount;
        const token = account?.token || 'YOUR_TOKEN_HERE';
        const baseUrl = env?.curlerBaseUrl || 'http://localhost:8000/dev/api';

        const mod = this.currentModule;
        const endpointMap = {
            items: `${baseUrl}/items/bulk-create/`,
            projects: `${baseUrl}/project/bulk-create/`,
            contract: `${baseUrl}/contract/create/`,
            vendors: `${baseUrl}/vendors/create/`,
            purchase_order: `${baseUrl}/purchase_order/create/`,
        };
        const endpoint = endpointMap[mod] || `${baseUrl}/${mod}/create/`;

        // Collect top-level script fields
        const fieldInputs = form.querySelectorAll('[name^="script_field_"]');
        const fields = [];
        fieldInputs.forEach(input => {
            const key = input.name.replace('script_field_', '');
            const value = input.value;
            const increment = checked(`script_increment_${key}`);
            const step = parseInt(get(`script_step_${key}`)) || 1;
            fields.push({ key, value, increment, step });
        });

        // Helper: generate bash expression for a field value
        const bashVal = (f, indent) => {
            if (f.increment) {
                const match = f.value.match(/^(.*?)(\d+)([^0-9]*)$/);
                if (match) {
                    const prefix = match[1];
                    const num = parseInt(match[2]);
                    const suffix = match[3];
                    const padLen = match[2].length;
                    return `${indent}"${f.key}": "${prefix}$(printf '%0${padLen}d' $((${num} + (i - ${startIndex}) * ${f.step})))${suffix}"`;
                }
                return `${indent}"${f.key}": "${f.value}_$i"`;
            }
            return `${indent}"${f.key}": "${f.value}"`;
        };

        // For complex types, use JSON-based approach via jq or heredoc
        if (mod === 'contract') {
            return this._generateContractScript(form, fields, count, startIndex, token, endpoint);
        } else if (mod === 'purchase_order') {
            return this._generatePOScript(form, fields, count, startIndex, token, endpoint);
        } else if (mod === 'vendors') {
            return this._generateVendorScript(form, fields, count, startIndex, token, endpoint);
        }

        // Simple types: items, projects (bulk endpoint)
        const fieldLines = fields.map(f => bashVal(f, '    ')).join(',\n');
        const hasBulkEndpoint = ['items', 'projects'].includes(mod);

        if (hasBulkEndpoint) {
            const payloadKey = mod === 'items' ? 'items' : mod + 's';
            return `#!/bin/bash
# Bulk ${mod} create script
# Generated by The cURLer at ${new Date().toISOString()}
# Count: ${count}, Start: ${startIndex}

TOKEN="${token}"
ENDPOINT="${endpoint}"

ITEMS=""
for i in $(seq ${startIndex} $((${startIndex} + ${count} - 1))); do
  [ -n "$ITEMS" ] && ITEMS="$ITEMS,"
  ITEMS="$ITEMS
  {
${fieldLines}
  }"
done

PAYLOAD='{"${payloadKey}": ['"$ITEMS"']}'

curl -s -X POST "$ENDPOINT" \\
  -H "Authorization: Bearer $TOKEN" \\
  -H "Content-Type: application/json" \\
  -d "$PAYLOAD"

echo ""
echo "[Done: ${count} ${mod} records via bulk endpoint]"
`;
        } else {
            return `#!/bin/bash
# Sequential ${mod} create script
# Generated by The cURLer at ${new Date().toISOString()}
# Count: ${count}, Start: ${startIndex}

TOKEN="${token}"
ENDPOINT="${endpoint}"

echo "Creating ${count} ${mod} records..."
for i in $(seq ${startIndex} $((${startIndex} + ${count} - 1))); do
  echo ""
  echo "--- Record $i ---"
  PAYLOAD='{
${fieldLines}
  }'
  curl -s -X POST "$ENDPOINT" \\
    -H "Authorization: Bearer $TOKEN" \\
    -H "Content-Type: application/json" \\
    -d "$PAYLOAD"
  echo ""
done

echo ""
echo "[Done: ${count} ${mod} records created sequentially]"
`;
        }
    }

    /**
     * Collect script cost rows from a container and return JSON array fragments
     * Supports optional increment on cost value
     */
    _collectScriptCosts(form, prefix, startIndex) {
        const costs = { additional_costs: [], taxes: [], discounts: [] };
        let idx = 0;
        while (true) {
            const nameEl = form.querySelector(`[name="${prefix}_${idx}_name"]`);
            if (!nameEl) break;
            const type = form.querySelector(`[name="${prefix}_${idx}_type"]`)?.value || 'cost';
            const name = nameEl.value;
            const value = form.querySelector(`[name="${prefix}_${idx}_value"]`)?.value || '0';
            const increment = form.querySelector(`[name="${prefix}_${idx}_increment"]`)?.checked || false;
            const step = parseInt(form.querySelector(`[name="${prefix}_${idx}_step"]`)?.value) || 1;

            if (name) {
                const valExpr = increment
                    ? `$(echo "${value} + (i - ${startIndex}) * ${step}" | bc)`
                    : value;
                const entry = `{"name": "${name}", "value": ${valExpr}}`;
                const target = type === 'tax' ? 'taxes' : type === 'discount' ? 'discounts' : 'additional_costs';
                costs[target].push(entry);
            }
            idx++;
        }
        return costs;
    }

    _generateContractScript(form, fields, count, startIndex, token, endpoint) {
        // Build top-level field lines with bash arithmetic for increments
        const topFields = fields.map(f => {
            if (f.increment) {
                const match = f.value.match(/^(.*?)(\d+)([^0-9]*)$/);
                if (match) {
                    return `    "${f.key}": "${match[1]}$(printf '%0${match[2].length}d' $((${parseInt(match[2])} + (i - ${startIndex}) * ${f.step})))${match[3]}"`;
                }
                return `    "${f.key}": "${f.value}_$i"`;
            }
            return `    "${f.key}": "${f.value}"`;
        }).join(',\n');

        // Collect contract-level costs
        const contractCosts = this._collectScriptCosts(form, 'sc_cost', startIndex);

        // Collect contract items from script form
        const itemCards = form.querySelectorAll('#script-contract-items-container > .cc-item-card');
        let itemsJson = '';

        itemCards.forEach((card, itemIdx) => {
            const fwCode = form.querySelector(`[name="sc_item_${itemIdx}_factwise_code"]`)?.value || '';
            const erpCode = form.querySelector(`[name="sc_item_${itemIdx}_erp_code"]`)?.value || '';
            const currencyId = form.querySelector(`[name="sc_item_${itemIdx}_currency_id"]`)?.value || '';
            const unitId = form.querySelector(`[name="sc_item_${itemIdx}_unit_id"]`)?.value || '';
            const rate = form.querySelector(`[name="sc_item_${itemIdx}_rate"]`)?.value || '10';
            const quantity = form.querySelector(`[name="sc_item_${itemIdx}_quantity"]`)?.value || '1000';
            const incoterm = form.querySelector(`[name="sc_item_${itemIdx}_incoterm"]`)?.value || 'NA';

            // Collect tiers
            const tierCards = card.querySelectorAll(`#sc-item-${itemIdx}-tiers-container > .cc-tier-card`);
            let tiersJson = '';
            tierCards.forEach((tierCard, tierIdx) => {
                const tMin = form.querySelector(`[name="sc_item_${itemIdx}_tier_${tierIdx}_min"]`)?.value || '0';
                const tMax = form.querySelector(`[name="sc_item_${itemIdx}_tier_${tierIdx}_max"]`)?.value || '100';
                const tRate = form.querySelector(`[name="sc_item_${itemIdx}_tier_${tierIdx}_rate"]`)?.value || '10';

                // Tier costs
                const tierCosts = this._collectScriptCosts(form, `sc_item_${itemIdx}_tier_${tierIdx}_cost`, startIndex);

                if (tiersJson) tiersJson += ',';
                tiersJson += `
          {
            "min_quantity": ${tMin},
            "max_quantity": ${tMax},
            "rate": ${tRate},
            "additional_costs": [${tierCosts.additional_costs.join(',')}],
            "taxes": [${tierCosts.taxes.join(',')}],
            "discounts": [${tierCosts.discounts.join(',')}]
          }`;
            });

            // Item costs
            const itemCosts = this._collectScriptCosts(form, `sc_item_${itemIdx}_cost`, startIndex);

            if (itemsJson) itemsJson += ',';
            itemsJson += `
      {
        "factwise_item_code": "${fwCode}",
        "ERP_item_code": "${erpCode}",
        "currency_code_id": "${currencyId}",
        "measurement_unit_id": "${unitId}",
        "rate": ${rate},
        "quantity": ${quantity},
        "incoterm": "${incoterm}",
        "pricing_tiers": [${tiersJson}],
        "additional_costs": [${itemCosts.additional_costs.join(',')}],
        "taxes": [${itemCosts.taxes.join(',')}],
        "discounts": [${itemCosts.discounts.join(',')}],
        "prepayment_percentage": 100,
        "payment_type": "PER_INVOICE_ITEM",
        "payment_terms": {"term": 1, "period": "MONTHS", "applied_from": "INVOICE_DATE"}
      }`;
        });

        return `#!/bin/bash
# Sequential contract create script
# Generated by The cURLer at ${new Date().toISOString()}
# Count: ${count}, Start: ${startIndex}

TOKEN="${token}"
ENDPOINT="${endpoint}"

echo "Creating ${count} contracts..."
for i in $(seq ${startIndex} $((${startIndex} + ${count} - 1))); do
  echo ""
  echo "--- Contract $i ---"
  PAYLOAD='{
${topFields},
    "additional_costs": [${contractCosts.additional_costs.join(',')}],
    "taxes": [${contractCosts.taxes.join(',')}],
    "discounts": [${contractCosts.discounts.join(',')}],
    "contract_items": [${itemsJson}],
    "custom_sections": [],
    "attachments": [],
    "terms_and_conditions": {"data": "", "name": "FactWise Default TNC"}
  }'
  curl -s -X POST "$ENDPOINT" \\
    -H "Authorization: Bearer $TOKEN" \\
    -H "Content-Type: application/json" \\
    -d "$PAYLOAD"
  echo ""
done

echo ""
echo "[Done: ${count} contracts created sequentially]"
`;
    }

    _generatePOScript(form, fields, count, startIndex, token, endpoint) {
        const topFields = fields.map(f => {
            if (f.increment) {
                const match = f.value.match(/^(.*?)(\d+)([^0-9]*)$/);
                if (match) {
                    return `    "${f.key}": "${match[1]}$(printf '%0${match[2].length}d' $((${parseInt(match[2])} + (i - ${startIndex}) * ${f.step})))${match[3]}"`;
                }
                return `    "${f.key}": "${f.value}_$i"`;
            }
            return `    "${f.key}": "${f.value}"`;
        }).join(',\n');

        // Collect PO items
        const itemCards = form.querySelectorAll('#script-po-items-container > .cc-item-card');
        let itemsJson = '';

        itemCards.forEach((card, idx) => {
            const erpCode = form.querySelector(`[name="sc_poitem_${idx}_erp_code"]`)?.value || '';
            const fwCode = form.querySelector(`[name="sc_poitem_${idx}_factwise_code"]`)?.value || '';
            const price = form.querySelector(`[name="sc_poitem_${idx}_price"]`)?.value || '100';
            const qty = form.querySelector(`[name="sc_poitem_${idx}_quantity"]`)?.value || '100';
            const unitId = form.querySelector(`[name="sc_poitem_${idx}_unit_id"]`)?.value || '';
            const incoterm = form.querySelector(`[name="sc_poitem_${idx}_incoterm"]`)?.value || 'DAP';
            const deliveryQty = form.querySelector(`[name="sc_poitem_${idx}_delivery_qty"]`)?.value || qty;

            if (itemsJson) itemsJson += ',';
            itemsJson += `
      {
        "ERP_item_code": "${erpCode}",
        "factwise_item_code": "${fwCode}",
        "price": ${price},
        "quantity": ${qty},
        "measurement_unit_id": "${unitId}",
        "incoterm": "${incoterm}",
        "delivery_schedule": [{"delivery_date": "$(date -d '+30 days' +%Y-%m-%d 2>/dev/null || date -v+30d +%Y-%m-%d)", "quantity": ${deliveryQty}}]
      }`;
        });

        return `#!/bin/bash
# Sequential PO create script
# Generated by The cURLer at ${new Date().toISOString()}
# Count: ${count}, Start: ${startIndex}

TOKEN="${token}"
ENDPOINT="${endpoint}"

echo "Creating ${count} purchase orders..."
for i in $(seq ${startIndex} $((${startIndex} + ${count} - 1))); do
  echo ""
  echo "--- PO $i ---"
  PAYLOAD='{
${topFields},
    "purchase_order_items": [${itemsJson}]
  }'
  curl -s -X POST "$ENDPOINT" \\
    -H "Authorization: Bearer $TOKEN" \\
    -H "Content-Type: application/json" \\
    -d "$PAYLOAD"
  echo ""
done

echo ""
echo "[Done: ${count} purchase orders created sequentially]"
`;
    }

    _generateVendorScript(form, fields, count, startIndex, token, endpoint) {
        const topFields = fields.map(f => {
            if (f.increment) {
                const match = f.value.match(/^(.*?)(\d+)([^0-9]*)$/);
                if (match) {
                    return `    "${f.key}": "${match[1]}$(printf '%0${match[2].length}d' $((${parseInt(match[2])} + (i - ${startIndex}) * ${f.step})))${match[3]}"`;
                }
                return `    "${f.key}": "${f.value}_$i"`;
            }
            return `    "${f.key}": "${f.value}"`;
        }).join(',\n');

        return `#!/bin/bash
# Sequential vendor create script
# Generated by The cURLer at ${new Date().toISOString()}
# Count: ${count}, Start: ${startIndex}

TOKEN="${token}"
ENDPOINT="${endpoint}"

echo "Creating ${count} vendors..."
for i in $(seq ${startIndex} $((${startIndex} + ${count} - 1))); do
  echo ""
  echo "--- Vendor $i ---"
  PAYLOAD='{
${topFields}
  }'
  curl -s -X POST "$ENDPOINT" \\
    -H "Authorization: Bearer $TOKEN" \\
    -H "Content-Type: application/json" \\
    -d "$PAYLOAD"
  echo ""
done

echo ""
echo "[Done: ${count} vendors created sequentially]"
`;
    }

    handleCopyScript() {
        try {
            if (this._currentBulkMode !== 'script') {
                this._displayError('Switch to Script Mode first to generate a script.');
                return;
            }
            const script = this._generateBulkScript();
            navigator.clipboard.writeText(script).then(() => {
                const btn = this.elements.btnCopyScript;
                const orig = btn.textContent;
                btn.textContent = 'Copied!';
                setTimeout(() => btn.textContent = orig, 2000);
            });
            // Also show in curl panel
            this.elements.curlDisplay.innerHTML = `<pre><code>${this._escapeHtml(script)}</code></pre>`;
            const header = this.elements.actionsSection.querySelector('h3');
            if (header) header.textContent = 'Generated Bash Script';
            this.elements.actionsSection.classList.remove('hidden');
            this.elements.responseSection.classList.add('hidden');
            this.elements.actionsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } catch (err) {
            this._displayError(err.message);
        }
    }

    async handleExecuteScript() {
        try {
            if (this._currentBulkMode !== 'script') {
                this._displayError('Switch to Script Mode first to generate a script.');
                return;
            }
            const script = this._generateBulkScript();

            // Show script first
            this.elements.curlDisplay.innerHTML = `<pre><code>${this._escapeHtml(script)}</code></pre>`;
            const header = this.elements.actionsSection.querySelector('h3');
            if (header) header.textContent = 'Executing Script...';
            this.elements.actionsSection.classList.remove('hidden');
            this.elements.responseSection.classList.remove('hidden');
            this.elements.responseSection.innerHTML = '<pre style="color:#64748b;">Running...</pre>';

            const env = this.environmentManager.getEnvironment();
            const executeUrl = `${env?.curlerBaseUrl?.replace('/dev/api', '') || 'http://localhost:8000'}/dev/api/execute-script/`;

            const response = await fetch(executeUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ script })
            });

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let output = '';
            this.elements.responseSection.innerHTML = '<pre id="script-output" style="white-space:pre-wrap;font-family:monospace;font-size:12px;"></pre>';
            const outputEl = document.getElementById('script-output');

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                output += decoder.decode(value, { stream: true });
                if (outputEl) outputEl.textContent = output;
            }

            if (header) header.textContent = 'Script Output';
        } catch (err) {
            this._displayError(err.message);
        }
    }

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
        const toggleAdditionalCosts = document.getElementById('toggle-additional-costs');
        const toggleTaxes = document.getElementById('toggle-taxes');
        const toggleContractCustom = document.getElementById('toggle-contract-custom');
        const toggleItemCustom = document.getElementById('toggle-item-custom');

        if (toggleContractCustom) {
            toggleContractCustom.addEventListener('change', (e) => {
                const section = document.getElementById('contract-custom-section');
                section.classList.toggle('visible', e.target.checked);
                if (e.target.checked && document.getElementById('contract-custom-container').children.length === 0) {
                    this._addContractCustomSection();
                }
            });
        }

        if (toggleAdditionalCosts) toggleAdditionalCosts.addEventListener('change', () => this._updateTierCostButtons());
        if (toggleTaxes) toggleTaxes.addEventListener('change', () => this._updateTierCostButtons());
        if (toggleItemCustom) toggleItemCustom.addEventListener('change', () => this._updateItemCustomVisibility());

        // Event delegation for Add Tier buttons
        const itemsContainer = document.getElementById('contract-items-container');
        if (itemsContainer) {
            itemsContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('btn-add-tier')) {
                    const itemIndex = parseInt(e.target.dataset.itemIndex);
                    this._addPricingTier(itemIndex);
                }
                if (e.target.classList.contains('btn-remove-tier')) {
                    const itemIndex = parseInt(e.target.dataset.itemIndex);
                    const tierIndex = parseInt(e.target.dataset.tierIndex);
                    this._removePricingTier(itemIndex, tierIndex);
                }
            });
        }

        // Initial render of contract items
        this._renderContractItems();

        // Set default dates after form is ready
        if (typeof setDefaultDates === 'function') setTimeout(setDefaultDates, 50);

        // Auto-increment contract IDs
        this._setContractIdDefaults();

        // Load T&C dropdown
        this._loadTermsAndConditions();

        // T&C data expand/collapse toggle
        const tncToggle = document.getElementById('tnc-data-toggle');
        if (tncToggle) {
            tncToggle.addEventListener('click', () => {
                const content = document.getElementById('tnc-data-content');
                const chevron = document.getElementById('tnc-chevron');
                const isHidden = content.style.display === 'none';
                content.style.display = isHidden ? '' : 'none';
                if (chevron) chevron.style.transform = isHidden ? 'rotate(0deg)' : 'rotate(-90deg)';
            });
        }

        // Attach inline field validation
        this._attachContractInlineValidation();
    }

    _setFieldHint(input, msg) {
        let hint = input.nextElementSibling;
        if (!hint || !hint.classList.contains('field-hint-error')) {
            hint = document.createElement('span');
            hint.className = 'field-hint-error';
            hint.style.cssText = 'display:block;color:#ef4444;font-size:11px;margin-top:3px;';
            input.insertAdjacentElement('afterend', hint);
        }
        if (msg) {
            hint.textContent = msg;
            input.classList.add('field-error');
        } else {
            hint.textContent = '';
            input.classList.remove('field-error');
        }
    }

    _setContractIdDefaults() {
        const now = Math.floor(Date.now() / 1000); // epoch seconds — unique per user per moment
        const short = String(now).slice(-6);       // last 6 digits fits within 20-char FW limit

        const erpEl = document.getElementById('contract_erp_id_input');
        const fwEl = document.getElementById('contract_fw_id_input');

        if (erpEl) erpEl.value = `OPENAPIERP${now}`;
        if (fwEl) fwEl.value = `C${short}`;
    }

    _attachContractInlineValidation() {
        const form = this.elements.operationForm;
        if (!form) return;

        const watch = (name, fn, event = 'input') => {
            const el = form.querySelector(`[name="${name}"]`);
            if (!el) return;
            const check = () => fn(el);
            el.addEventListener(event, check);
            el.addEventListener('blur', check);
        };

        // contract_name: required, max 200
        watch('contract_name', el => {
            if (!el.value.trim()) this._setFieldHint(el, 'Contract name is required.');
            else if (el.value.length > 200) this._setFieldHint(el, 'Cannot exceed 200 characters.');
            else this._setFieldHint(el, '');
        });

        // dates: required + end must be after start
        const checkDates = () => {
            const startEl = form.querySelector('[name="contract_start_date"]');
            const endEl = form.querySelector('[name="contract_end_date"]');
            if (!startEl || !endEl) return;
            if (!startEl.value) { this._setFieldHint(startEl, 'Start date is required.'); }
            else { this._setFieldHint(startEl, ''); }
            if (!endEl.value) { this._setFieldHint(endEl, 'End date is required.'); }
            else if (startEl.value && endEl.value <= startEl.value) { this._setFieldHint(endEl, 'End date must be after start date.'); }
            else { this._setFieldHint(endEl, ''); }
        };
        const startEl = form.querySelector('[name="contract_start_date"]');
        const endEl = form.querySelector('[name="contract_end_date"]');
        if (startEl) { startEl.addEventListener('change', checkDates); startEl.addEventListener('blur', checkDates); }
        if (endEl) { endEl.addEventListener('change', checkDates); endEl.addEventListener('blur', checkDates); }

        // entity_name: required
        watch('entity_name', el => {
            this._setFieldHint(el, el.value.trim() ? '' : 'Entity name is required.');
        });

        // buyer_contact: required, email
        watch('buyer_contact', el => {
            if (!el.value.trim()) this._setFieldHint(el, 'Buyer contact email is required.');
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value)) this._setFieldHint(el, 'Enter a valid email address.');
            else this._setFieldHint(el, '');
        });

        // vendor_contact: required, email
        watch('vendor_contact', el => {
            if (!el.value.trim()) this._setFieldHint(el, 'Vendor contact email is required.');
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value)) this._setFieldHint(el, 'Enter a valid email address.');
            else this._setFieldHint(el, '');
        });

        // vendor codes: at least one required — check both on change of either
        const checkVendorCodes = () => {
            const fwEl = form.querySelector('[name="factwise_vendor_code"]');
            const erpEl = form.querySelector('[name="ERP_vendor_code"]');
            if (!fwEl || !erpEl) return;
            const missing = !fwEl.value.trim() && !erpEl.value.trim();
            this._setFieldHint(fwEl, missing ? 'At least one of Factwise or ERP vendor code is required.' : '');
            this._setFieldHint(erpEl, missing ? 'At least one of Factwise or ERP vendor code is required.' : '');
        };
        const fwEl = form.querySelector('[name="factwise_vendor_code"]');
        const erpEl = form.querySelector('[name="ERP_vendor_code"]');
        if (fwEl) { fwEl.addEventListener('input', checkVendorCodes); fwEl.addEventListener('blur', checkVendorCodes); }
        if (erpEl) { erpEl.addEventListener('input', checkVendorCodes); erpEl.addEventListener('blur', checkVendorCodes); }

        // prepayment_percentage: 0–100
        watch('prepayment_percentage', el => {
            const v = parseFloat(el.value);
            if (el.value !== '' && (isNaN(v) || v < 0 || v > 100))
                this._setFieldHint(el, 'Must be between 0 and 100.');
            else this._setFieldHint(el, '');
        });

        // lead_time: > 0 if provided
        watch('lead_time', el => {
            const v = parseFloat(el.value);
            if (el.value !== '' && (isNaN(v) || v <= 0))
                this._setFieldHint(el, 'Lead time must be greater than 0.');
            else this._setFieldHint(el, '');
        });

        // Run all checks immediately on load so empty required fields are red from the start
        setTimeout(() => {
            ['contract_name', 'entity_name', 'buyer_contact', 'vendor_contact', 'prepayment_percentage', 'lead_time'].forEach(name => {
                const el = form.querySelector(`[name="${name}"]`);
                if (el) el.dispatchEvent(new Event('blur'));
            });
            checkDates();
            checkVendorCodes();
        }, 100);

        // Vendor code lookup — auto-fill vendor fields and contacts dropdown
        this._setupVendorLookup(form);

        // Item code search dropdowns on all item code inputs
        this._setupItemSearchDropdowns(form);
    }

    // ── Shared autocomplete dropdown ──────────────────────────────────────────

    _attachSearchDropdown(inputEl, fetchResults, onSelect) {
        let debounceTimer = null;
        let dropdownEl = null;

        const close = () => {
            if (dropdownEl) { dropdownEl.remove(); dropdownEl = null; }
        };

        const show = (results) => {
            close();
            if (!results.length) return;

            dropdownEl = document.createElement('div');
            dropdownEl.style.cssText = `
                position:absolute; z-index:9999; background:#fff; border:1px solid #cbd5e1;
                border-radius:6px; box-shadow:0 4px 12px rgba(0,0,0,0.12);
                max-height:220px; overflow-y:auto; width:${inputEl.offsetWidth}px;
                font-size:12px;
            `;

            results.forEach(r => {
                const item = document.createElement('div');
                item.style.cssText = 'padding:8px 12px; cursor:pointer; border-bottom:1px solid #f1f5f9; color:#1e293b;';
                item.innerHTML = r.html;
                item.addEventListener('mouseenter', () => item.style.background = '#f8fafc');
                item.addEventListener('mouseleave', () => item.style.background = '');
                item.addEventListener('mousedown', (e) => {
                    e.preventDefault(); // prevent blur before click
                    onSelect(r);
                    close();
                });
                dropdownEl.appendChild(item);
            });

            // Position below the input
            inputEl.parentElement.style.position = 'relative';
            inputEl.parentElement.appendChild(dropdownEl);
            dropdownEl.style.top = `${inputEl.offsetTop + inputEl.offsetHeight + 2}px`;
            dropdownEl.style.left = `${inputEl.offsetLeft}px`;
        };

        const doSearch = (q) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(async () => {
                const results = await fetchResults(q);
                show(results);
            }, q.length === 0 ? 0 : 400);
        };

        inputEl.addEventListener('input', () => {
            const q = inputEl.value.trim();
            if (q.length === 0) { doSearch(''); return; }
            doSearch(q);
        });

        inputEl.addEventListener('focus', () => {
            if (!dropdownEl) doSearch(inputEl.value.trim());
        });

        inputEl.addEventListener('blur', () => setTimeout(close, 150));
        inputEl.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
    }

    // ── Item search dropdowns ─────────────────────────────────────────────────

    _setupItemSearchDropdowns(form) {
        // Attach to all existing item code inputs; also re-attach when items are re-rendered
        const attach = () => {
            form.querySelectorAll('.item-code-input').forEach(input => {
                if (input.dataset.searchAttached) return;
                input.dataset.searchAttached = '1';

                const fetch = (q) => this._searchItems(q);
                const onSelect = (r) => {
                    input.value = r.code;
                    // Trigger existing item validation / autofill
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                    input.dispatchEvent(new Event('blur', { bubbles: true }));
                };
                this._attachSearchDropdown(input, fetch, onSelect);
            });
        };

        attach();
        // Re-attach after items are added (observer on the container)
        const container = form.querySelector('#contract-items-container');
        if (container) {
            new MutationObserver(attach).observe(container, { childList: true, subtree: true });
        }
    }

    async _searchItems(q) {
        const token = this.factwiseIntegration?.getToken() || this.tokenManager?.getToken();
        if (!token) return [];
        const baseUrl = this.environmentManager.getFactwiseBaseUrl();
        try {
            const res = await fetch(`${baseUrl}dashboard/`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    dashboard_view: 'enterprise_item', tab: 'active',
                    page_number: 1, items_per_page: 8,
                    sort_fields: [], search_text: q, filters: null
                })
            });
            if (!res.ok) return [];
            const data = await res.json();
            return (data.data || []).map(i => ({
                code: i.code,
                html: `<strong>${i.code}</strong> <span style="color:#64748b;">— ${i.name || ''}</span>`,
            }));
        } catch { return []; }
    }

    async _lookupContractFromDashboard(customContractId) {
        const token = this.factwiseIntegration?.getToken() || this.tokenManager?.getToken();
        if (!token) return null;
        const baseUrl = this.environmentManager.getFactwiseBaseUrl();
        const search = async () => {
            try {
                const res = await fetch(`${baseUrl}dashboard/`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        dashboard_view: 'contract_buyer',
                        items_per_page: 5, page_number: 1,
                        query_data: {}, search_text: customContractId,
                        sort_fields: [], filters: null, tab: 'all'
                    })
                });
                if (!res.ok) return null;
                const data = await res.json();
                const records = data?.data || data?.results || [];
                const match = records.find(c => c.custom_contract_id === customContractId) || records[0];
                if (match?.contract_id) return match;
                return null;
            } catch { return null; }
        };

        for (let attempt = 0; attempt < 3; attempt++) {
            if (attempt > 0) await new Promise(r => setTimeout(r, 2000));
            const match = await search();
            if (match) return { contractId: match.contract_id, templateId: match.template_id };
        }
        return null;
    }

    // ── Contract search dropdown ──────────────────────────────────────────────

    _setupContractLookup(form, tabs = ['ongoing']) {
        if (!form) return;

        const mapRecords = (records) => records.map(c => ({
            contract: c,
            html: `<strong>${c.custom_contract_id || c.factwise_contract_id || ''}</strong>${c.ERP_contract_id ? ` / ${c.ERP_contract_id}` : ''} <span style="color:#64748b;">— ${c.contract_name || ''}</span>`
        }));

        const fetchForTab = async (q, tab) => {
            const token = this.factwiseIntegration?.getToken() || this.tokenManager?.getToken();
            if (!token) return [];
            const baseUrl = this.environmentManager.getFactwiseBaseUrl();
            try {
                const res = await fetch(`${baseUrl}dashboard/`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        dashboard_view: 'contract_buyer',
                        items_per_page: 8, page_number: 1,
                        query_data: {}, search_text: q,
                        sort_fields: [], filters: null, tab
                    })
                });
                if (!res.ok) return [];
                const data = await res.json();
                return data?.data || data?.results || (Array.isArray(data) ? data : []);
            } catch { return []; }
        };

        const fetchContracts = async (q) => {
            const allResults = await Promise.all(tabs.map(tab => fetchForTab(q, tab)));
            const merged = allResults.flat();
            // Deduplicate by custom_contract_id
            const seen = new Set();
            const unique = merged.filter(c => {
                const key = c.custom_contract_id || c.contract_id || JSON.stringify(c);
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
            });
            return mapRecords(unique.slice(0, 10));
        };

        const onSelect = (r) => {
            const c = r.contract;
            const fwEl = form.querySelector('[name="factwise_contract_id"]');
            const erpEl = form.querySelector('[name="ERP_contract_id"]');
            if (fwEl) fwEl.value = c.custom_contract_id || c.factwise_contract_id || '';
            if (erpEl) erpEl.value = c.ERP_contract_id || '';
        };

        const fwEl = form.querySelector('[name="factwise_contract_id"]');
        const erpEl = form.querySelector('[name="ERP_contract_id"]');
        if (fwEl) this._attachSearchDropdown(fwEl, fetchContracts, onSelect);
        if (erpEl) this._attachSearchDropdown(erpEl, fetchContracts, onSelect);
    }

    // ── Vendor search dropdown ────────────────────────────────────────────────

    _setupVendorLookup(form) {
        const fetchVendors = async (q) => {
            const token = this.factwiseIntegration?.getToken() || this.tokenManager?.getToken();
            if (!token) return [];
            const baseUrl = this.environmentManager.getFactwiseBaseUrl();
            try {
                const res = await fetch(`${baseUrl}dashboard/`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        dashboard_view: 'enterprise_vendor', tab: 'active',
                        page_number: 1, items_per_page: 8,
                        sort_fields: [], search_text: q,
                        query_data: { vendor_entity_status: null }, filters: null
                    })
                });
                if (!res.ok) return [];
                const data = await res.json();
                const records = data?.data || data?.results || (Array.isArray(data) ? data : []);
                return records.map(v => ({
                    vendor: v,
                    code: v.vendor_code,
                    html: `<strong>${v.vendor_code}</strong>${v.ERP_vendor_code ? ` / ${v.ERP_vendor_code}` : ''} <span style="color:#64748b;">— ${v.vendor_name || ''}</span>`
                }));
            } catch { return []; }
        };

        const onSelect = (r) => this._fillVendorFromRecord(form, r.vendor);

        const fwEl = form.querySelector('[name="factwise_vendor_code"]');
        const erpEl = form.querySelector('[name="ERP_vendor_code"]');
        if (fwEl) this._attachSearchDropdown(fwEl, fetchVendors, onSelect);
        if (erpEl) this._attachSearchDropdown(erpEl, fetchVendors, onSelect);
    }

    async _fillVendorFromRecord(form, vendor) {
        // Step 1: fill codes immediately from dashboard result
        const fwEl = form.querySelector('[name="factwise_vendor_code"]');
        const erpEl = form.querySelector('[name="ERP_vendor_code"]');
        if (fwEl && vendor.vendor_code) fwEl.value = vendor.vendor_code;
        if (erpEl && vendor.ERP_vendor_code) erpEl.value = vendor.ERP_vendor_code;

        this._setVendorTag(`Loading ${vendor.vendor_name || vendor.vendor_code}...`, '#64748b', form);

        // Step 2: fetch admin detail API for full data
        let detail = vendor;
        const masterId = vendor.enterprise_vendor_master_id;
        if (masterId) {
            try {
                const token = this.factwiseIntegration?.getToken() || this.tokenManager?.getToken();
                const baseUrl = this.environmentManager.getFactwiseBaseUrl();
                const res = await fetch(`${baseUrl}organization/vendor_master/${masterId}/admin/`, {
                    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
                });
                if (res.ok) detail = await res.json();
            } catch (e) {
                console.warn('Vendor admin fetch failed, using dashboard data', e);
            }
        }

        // Step 3: identification from seller_identifications[0]
        const vidNameEl = form.querySelector('[name="vendor_identification_name"]');
        const vidValEl = form.querySelector('[name="vendor_identification_value"]');
        const firstId = detail.seller_identifications?.[0];
        if (vidNameEl) vidNameEl.value = firstId?.identification_name || '';
        if (vidValEl) vidValEl.value = firstId?.identification_value || '';

        // Step 4: address from seller_address_information[0] (string or object)
        const addrEl = form.querySelector('[name="vendor_full_address"]');
        const firstAddr = detail.seller_address_information?.[0];
        if (addrEl && firstAddr) {
            if (typeof firstAddr === 'string') {
                addrEl.value = firstAddr;
            } else {
                const parts = [firstAddr.address1, firstAddr.address2, firstAddr.city, firstAddr.state_or_territory, firstAddr.country].filter(Boolean);
                addrEl.value = parts.join(', ');
            }
        }

        // Step 5: contacts dropdown (primary + secondary, deduplicated by email)
        const seen = new Set();
        const contacts = [];
        if (detail.primary_vendor_contact?.primary_email) {
            const c = detail.primary_vendor_contact;
            seen.add(c.primary_email);
            contacts.push({ email: c.primary_email, label: `${c.full_name || ''} (${c.primary_email}) — Primary` });
        }
        (detail.secondary_vendor_contacts || []).forEach(c => {
            if (c.primary_email && !seen.has(c.primary_email)) {
                seen.add(c.primary_email);
                contacts.push({ email: c.primary_email, label: `${c.full_name || ''} (${c.primary_email})` });
            }
        });

        const vcEl = form.querySelector('[name="vendor_contact"]');
        if (vcEl && contacts.length > 0) {
            const currentVal = vcEl.value;
            const select = document.createElement('select');
            select.name = 'vendor_contact';
            select.className = vcEl.className;
            select.innerHTML = contacts.map(c =>
                `<option value="${c.email}" ${c.email === currentVal ? 'selected' : ''}>${c.label}</option>`
            ).join('');
            vcEl.replaceWith(select);
            this._setFieldHint(select, '');
        }

        this._setVendorTag(`✓ ${detail.vendor_name || detail.vendor_code} — filled`, '#16a34a', form);
    }

    _setVendorTag(text, color, form) {
        let tag = document.getElementById('vendor-lookup-tag');
        if (!tag) {
            tag = document.createElement('div');
            tag.id = 'vendor-lookup-tag';
            tag.style.cssText = 'font-size:11px;margin-top:4px;';
            const refEl = form.querySelector('[name="factwise_vendor_code"]') || form.querySelector('[name="ERP_vendor_code"]') || form.querySelector('[name="seller_factwise_vendor_code"]') || form.querySelector('[name="seller_erp_vendor_code"]');
            refEl?.closest('.form-row')?.insertAdjacentElement('afterend', tag);
        }
        tag.style.color = color;
        tag.textContent = text;
    }

    // ── PO Vendor Lookup ────────────────────────────────────────────────────

    _setupVendorLookupPO(form) {
        const fetchVendors = async (q) => {
            const token = this.factwiseIntegration?.getToken() || this.tokenManager?.getToken();
            if (!token) return [];
            const baseUrl = this.environmentManager.getFactwiseBaseUrl();
            try {
                const res = await fetch(`${baseUrl}dashboard/`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        dashboard_view: 'enterprise_vendor', tab: 'active',
                        page_number: 1, items_per_page: 8,
                        sort_fields: [], search_text: q,
                        query_data: { vendor_entity_status: null }, filters: null
                    })
                });
                if (!res.ok) return [];
                const data = await res.json();
                const records = data?.data || data?.results || (Array.isArray(data) ? data : []);
                return records.map(v => ({
                    vendor: v,
                    code: v.vendor_code,
                    html: `<strong>${v.vendor_code}</strong>${v.ERP_vendor_code ? ` / ${v.ERP_vendor_code}` : ''} <span style="color:#64748b;">— ${v.vendor_name || ''}</span>`
                }));
            } catch { return []; }
        };

        const onSelect = (r) => this._fillVendorFromRecordPO(form, r.vendor);

        const fwEl = form.querySelector('[name="seller_factwise_vendor_code"]');
        const erpEl = form.querySelector('[name="seller_erp_vendor_code"]');
        if (fwEl) this._attachSearchDropdown(fwEl, fetchVendors, onSelect);
        if (erpEl) this._attachSearchDropdown(erpEl, fetchVendors, onSelect);
    }

    async _fillVendorFromRecordPO(form, vendor) {
        const fwEl = form.querySelector('[name="seller_factwise_vendor_code"]');
        const erpEl = form.querySelector('[name="seller_erp_vendor_code"]');
        if (fwEl && vendor.vendor_code) fwEl.value = vendor.vendor_code;
        if (erpEl && vendor.ERP_vendor_code) erpEl.value = vendor.ERP_vendor_code;

        this._setVendorTag(`Loading ${vendor.vendor_name || vendor.vendor_code}...`, '#64748b', form);

        let detail = vendor;
        const masterId = vendor.enterprise_vendor_master_id;
        if (masterId) {
            try {
                const token = this.factwiseIntegration?.getToken() || this.tokenManager?.getToken();
                const baseUrl = this.environmentManager.getFactwiseBaseUrl();
                const res = await fetch(`${baseUrl}organization/vendor_master/${masterId}/admin/`, {
                    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
                });
                if (res.ok) detail = await res.json();
            } catch (e) {
                console.warn('Vendor admin fetch failed, using dashboard data', e);
            }
        }

        // Identifications — fill name + value fields
        const idNameEl = form.querySelector('[name="seller_id_name"]');
        const idValueEl = form.querySelector('[name="seller_id_value"]');
        const firstSellerId = detail.seller_identifications?.[0];
        if (firstSellerId) {
            if (idNameEl) idNameEl.value = typeof firstSellerId === 'string' ? firstSellerId : (firstSellerId.identification_name || '');
            if (idValueEl) idValueEl.value = typeof firstSellerId === 'string' ? '' : (firstSellerId.identification_value || '');
        }

        // Address
        const addrIdEl = form.querySelector('[name="seller_address_id"]');
        const addrFullEl = form.querySelector('[name="seller_full_address"]');
        const firstAddr = detail.seller_address_information?.[0];
        if (firstAddr) {
            if (addrIdEl && firstAddr.address_id) addrIdEl.value = firstAddr.address_id;
            if (addrFullEl) {
                if (typeof firstAddr === 'string') {
                    addrFullEl.value = firstAddr;
                } else {
                    const parts = [firstAddr.address1, firstAddr.address2, firstAddr.city, firstAddr.state_or_territory, firstAddr.country].filter(Boolean);
                    addrFullEl.value = parts.join(', ');
                }
            }
        }

        // Contacts — comma-separated emails
        const contactsEl = form.querySelector('[name="seller_contacts"]');
        if (contactsEl) {
            const emails = [];
            if (detail.primary_vendor_contact?.primary_email) {
                emails.push(detail.primary_vendor_contact.primary_email);
            }
            (detail.secondary_vendor_contacts || []).forEach(c => {
                if (c.primary_email && !emails.includes(c.primary_email)) {
                    emails.push(c.primary_email);
                }
            });
            if (emails.length > 0) contactsEl.value = emails.join(', ');
        }

        this._setVendorTag(`✓ ${detail.vendor_name || detail.vendor_code} — filled`, '#16a34a', form);
    }

    // ── PO Item search dropdowns ──────────────────────────────────────────────

    _setupPOItemSearchDropdowns(form) {
        const attach = () => {
            form.querySelectorAll('.item-code-input').forEach(input => {
                if (input.dataset.searchAttached) return;
                input.dataset.searchAttached = '1';

                const fetchFn = (q) => this._searchItems(q);
                const onSelect = (r) => {
                    input.value = r.code;
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                    input.dispatchEvent(new Event('blur', { bubbles: true }));
                };
                this._attachSearchDropdown(input, fetchFn, onSelect);
            });
        };

        attach();
        const container = form.querySelector('#po-items-container');
        if (container) {
            new MutationObserver(attach).observe(container, { childList: true, subtree: true });
        }
    }

    _addPricingTier(itemIndex) {
        const itemCard = document.querySelector(`.cc-item-card[data-item-index="${itemIndex}"]`);
        if (!itemCard) return;

        const currentTiers = parseInt(itemCard.dataset.tiersCount || 1);
        const newTierCount = currentTiers + 1;

        // Update tier count
        itemCard.dataset.tiersCount = newTierCount;

        // Get settings
        const showAdditionalCosts = document.getElementById('toggle-additional-costs')?.checked || false;
        const showTaxes = document.getElementById('toggle-taxes')?.checked || false;
        const showDiscounts = (this.templateManager?.getCurrentConfig?.()?.itemLevel?.discountFields?.length || 0) > 0;

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
            tiersContainer.innerHTML = this._renderPricingTiers(itemIndex, newTierCount, showAdditionalCosts, showTaxes, showDiscounts, lastTierMax);
            this._attachTierMaxListeners(tiersContainer, itemIndex, false);
        }
    }

    _removePricingTier(itemIndex, tierIndex) {
        const itemCard = document.querySelector(`.cc-item-card[data-item-index="${itemIndex}"]`);
        if (!itemCard) return;

        const currentTiers = parseInt(itemCard.dataset.tiersCount || 1);
        if (currentTiers <= 1) return; // Don't allow removing the last tier

        const newTierCount = currentTiers - 1;
        itemCard.dataset.tiersCount = newTierCount;

        // Get settings
        const showAdditionalCosts = document.getElementById('toggle-additional-costs')?.checked || false;
        const showTaxes = document.getElementById('toggle-taxes')?.checked || false;
        const showDiscounts = (this.templateManager?.getCurrentConfig?.()?.itemLevel?.discountFields?.length || 0) > 0;

        // Re-render all tiers except the removed one
        const tiersContainer = document.getElementById(`tiers-container-${itemIndex}`);
        if (tiersContainer) {
            tiersContainer.innerHTML = this._renderPricingTiers(itemIndex, newTierCount, showAdditionalCosts, showTaxes, showDiscounts);
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
        const showAdditionalCosts = document.getElementById('toggle-additional-costs')?.checked || false;
        const showTaxes = document.getElementById('toggle-taxes')?.checked || false;
        const showDiscounts = (this.templateManager?.getCurrentConfig?.()?.itemLevel?.discountFields?.length || 0) > 0;
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
                                    <option value="PER_DELIVERABLE">PER_DELIVERABLE</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label>Incoterm *</label>
                                <select name="item_${itemIndex}_incoterm" class="input-field" required>
                                    <option value="EXW">EXW</option>
                                    <option value="FCA">FCA</option>
                                    <option value="FAS">FAS</option>
                                    <option value="FOB">FOB</option>
                                    <option value="CFR">CFR</option>
                                    <option value="CIF">CIF</option>
                                    <option value="CPT">CPT</option>
                                    <option value="CIP">CIP</option>
                                    <option value="DAP">DAP</option>
                                    <option value="DAT">DAT</option>
                                    <option value="DDP">DDP</option>
                                    <option value="NA" selected>NA</option>
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
                                    <option value="YEARS">YEARS</option>
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
                                    <option value="DAYS">DAYS</option>
                                    <option value="WEEKS">WEEKS</option>
                                    <option value="MONTHS" selected>MONTHS</option>
                                    <option value="YEARS">YEARS</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Applied From</label>
                                <select name="item_${itemIndex}_payment_applied_from" class="input-field">
                                    <option value="INVOICE_DATE" selected>INVOICE_DATE</option>
                                    <option value="RECEIPT_DATE">RECEIPT_DATE</option>
                                    <option value="DISPATCH_DATE">DISPATCH_DATE</option>
                                </select>
                            </div>
                        </div>

                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                            <p class="cc-sub-title" style="margin: 0;">📊 Pricing Tiers</p>
                            <button type="button" class="btn-add-tier" data-item-index="${itemIndex}" style="background: #3b82f6; color: white; border: none; border-radius: 4px; padding: 6px 12px; cursor: pointer; font-size: 12px;">
                                + Add Tier
                            </button>
                        </div>
                        <div id="tiers-container-${itemIndex}">
                            ${this._renderPricingTiers(itemIndex, tiersCount, showAdditionalCosts, showTaxes, showDiscounts)}
                        </div>

                        ${this._renderItemCostsSection(itemIndex)}

                        <div class="cc-item-custom-section-wrapper" style="display:${showItemCustom ? '' : 'none'}">
                            <p class="cc-sub-title">🔧 Item Custom Sections</p>
                            <div id="item-${itemIndex}-custom">
                                ${this._renderItemCustomSectionRow(itemIndex, 0)}
                            </div>
                            <button type="button" class="btn-add-row" onclick="window.uiController._addItemCustomSection(${itemIndex})">+ Add Custom Section</button>
                        </div>
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


    _renderPricingTiers(itemIndex, count, showAdditionalCosts, showTaxes, showDiscounts, lastAddedMax) {
        let html = '';
        for (let i = 0; i < count; i++) {
            const isFirstTier = i === 0;
            const defaultMin = i * 100 + (i > 0 ? 1 : 0);
            const defaultMax = (i + 1) * 100;
            const mandatory = this._renderMandatoryCostRows(itemIndex, i);
            const hasMandatory = mandatory.count > 0;
            const showAnyCosts = showAdditionalCosts || showTaxes || showDiscounts || hasMandatory;
            html += `
                <div class="cc-tier-card" data-tier-index="${i}">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <p class="cc-tier-card-title" style="margin: 0;"><span class="tier-dot"></span>Tier ${i + 1}</p>
                        ${count > 1 ? `
                            <button type="button" class="btn-remove-tier" data-item-index="${itemIndex}" data-tier-index="${i}" style="background: #ef4444; color: white; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer; font-size: 11px;">
                                ✕ Remove
                            </button>
                        ` : ''}
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Min Quantity${isFirstTier ? ' <small style="color:#6366f1;font-size:10px">(default: 0)</small>' : ' <small style="color:#64748b;font-size:10px">(prev max + 1)</small>'}</label>
                            <input type="number" name="item_${itemIndex}_tier_${i}_min" class="input-field tier-min" value="${defaultMin}" step="0.01">
                        </div>
                        <div class="form-group">
                            <label>Max Quantity</label>
                            <input type="number" name="item_${itemIndex}_tier_${i}_max" class="input-field tier-max" value="${defaultMax}" step="0.01" data-item="${itemIndex}" data-tier="${i}">
                        </div>
                        <div class="form-group">
                            <label>Rate</label>
                            <input type="number" name="item_${itemIndex}_tier_${i}_rate" class="input-field" value="10" step="0.01">
                        </div>
                    </div>
                    ${showAnyCosts ? `
                        <p style="font-size:12px;color:#64748b;margin:8px 0 4px;">Tier Costs</p>
                        ${mandatory.html}
                        <div id="item-${itemIndex}-tier-${i}-costs"></div>
                        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">
                            ${showAdditionalCosts ? `<button type="button" class="btn-add-row" style="font-size:11px;padding:3px 8px;" onclick="window.uiController._addTierCostRow(${itemIndex},${i},'cost')">+ Additional Cost</button>` : ''}
                            ${showTaxes ? `<button type="button" class="btn-add-row" style="font-size:11px;padding:3px 8px;" onclick="window.uiController._addTierCostRow(${itemIndex},${i},'tax')">+ Tax</button>` : ''}
                            ${showDiscounts ? `<button type="button" class="btn-add-row" style="font-size:11px;padding:3px 8px;" onclick="window.uiController._addTierCostRow(${itemIndex},${i},'discount')">+ Discount</button>` : ''}
                        </div>
                    ` : ''}
                </div>
            `;
        }
        return html;
    }

    _buildCostOptions(level, costType) {
        const config = this.templateManager?.getCurrentConfig?.() || {};
        const levelConfig = config[level + 'Level'] || {};

        let fields = [];
        if (costType === 'cost') fields = levelConfig.costFields || [];
        else if (costType === 'tax') fields = levelConfig.taxFields || [];
        else if (costType === 'discount') fields = levelConfig.discountFields || [];

        if (fields.length === 0) return null;

        return fields.map(f => {
            const vt = f.cost_type === 'PERCENTAGE' ? 'pct' : 'abs';
            const typeLabel = f.cost_type === 'PERCENTAGE' ? '%' : 'Flat';
            const allocLabel = f.allocation_type === 'OVERALL' ? 'Overall' : f.allocation_type === 'PER_ITEM' ? 'Per Item' : (f.allocation_type || '');
            const badge = allocLabel ? `[${typeLabel} · ${allocLabel}]` : `[${typeLabel}]`;
            return `<option value="${f.alternate_name}" data-type="${costType}" data-value-type="${vt}">${f.name}  ${badge}</option>`;
        }).join('');
    }

    // Returns the single field if only 1 option exists for this cost type, else null
    _getSingleCostField(level, costType) {
        const config = this.templateManager?.getCurrentConfig?.() || {};
        const levelConfig = config[level + 'Level'] || {};
        let fields = [];
        if (costType === 'cost') fields = levelConfig.costFields || [];
        else if (costType === 'tax') fields = levelConfig.taxFields || [];
        else if (costType === 'discount') fields = levelConfig.discountFields || [];
        return fields.length === 1 ? fields[0] : null;
    }

    // Returns the single custom field if only 1 option in that section, else null
    _getSingleCustomField(level, sectionAltName) {
        const config = this.templateManager?.getCurrentConfig?.() || {};
        const allFields = level === 'contract' ? config.contractLevel?.customSections || [] : config.itemLevel?.customSections || [];
        const fields = allFields.filter(f => f.section_alternate_name === sectionAltName);
        return fields.length === 1 ? fields[0] : null;
    }

    _addContractCost() {
        const container = document.getElementById('contract-costs-container');
        const index = container.children.length;
        const optionsHTML = this._buildCostOptions('contract');

        let html;
        if (optionsHTML) {
            html = `
            <div class="cc-cost-row" style="display:flex;gap:8px;align-items:flex-end;margin-bottom:8px;">
                <div class="form-group" style="flex:2;margin:0;">
                    <label>Cost / Tax / Discount</label>
                    <select name="contract_cost_${index}_name" class="input-field cc-cost-select" onchange="window.uiController._onCostSelectChange(this)">
                        <option value="">-- Select --</option>
                        ${optionsHTML}
                    </select>
                    <input type="hidden" name="contract_cost_${index}_type" value="">
                </div>
                <div class="form-group" style="flex:1;margin:0;">
                    <label class="cc-cost-value-label">Value</label>
                    <input type="number" name="contract_cost_${index}_value" class="input-field" step="0.01" placeholder="0">
                </div>
                <button type="button" onclick="this.parentElement.remove()" style="padding:6px 10px;background:#ef4444;color:white;border:none;border-radius:4px;cursor:pointer;margin-bottom:2px;">✕</button>
            </div>`;
        } else {
            html = `
            <div class="cc-cost-row" style="display:flex;gap:8px;align-items:flex-end;margin-bottom:8px;">
                <div class="form-group" style="flex:1;margin:0;">
                    <label>Type</label>
                    <select name="contract_cost_${index}_type" class="input-field">
                        <option value="cost">Additional Cost</option>
                        <option value="tax">Tax</option>
                        <option value="discount">Discount</option>
                    </select>
                </div>
                <div class="form-group" style="flex:2;margin:0;">
                    <label>Name</label>
                    <input type="text" name="contract_cost_${index}_name" class="input-field" placeholder="e.g., GST">
                </div>
                <div class="form-group" style="flex:1;margin:0;">
                    <label>Value</label>
                    <input type="number" name="contract_cost_${index}_value" class="input-field" step="0.01">
                </div>
                <button type="button" onclick="this.parentElement.remove()" style="padding:6px 10px;background:#ef4444;color:white;border:none;border-radius:4px;cursor:pointer;margin-bottom:2px;">✕</button>
            </div>`;
        }
        container.insertAdjacentHTML('beforeend', html);
    }

    /**
     * Build a small type badge string for cost fields.
     * e.g. "% · Per Item" or "Flat · Overall"
     */
    _costTypeBadgeText(valueType, allocationType) {
        const vt = valueType === 'pct' ? '%' : 'Flat';
        const at = allocationType === 'OVERALL' ? 'Overall' : allocationType === 'PER_ITEM' ? 'Per Item' : '';
        return at ? `${vt} · ${at}` : vt;
    }

    /**
     * Build a small type badge string for custom fields.
     * e.g. "Short Text", "Decimal", "Date", etc.
     */
    _fieldTypeBadgeText(fieldType) {
        const map = { 'SHORTTEXT': 'Short Text', 'LONGTEXT': 'Long Text', 'FLOAT': 'Decimal', 'PERCENTAGE': 'Percentage', 'DATE': 'Date', 'BOOLEAN': 'Yes/No', 'CHOICE': 'Choice', 'INTEGER': 'Number' };
        return map[fieldType] || fieldType || 'Text';
    }

    /**
     * Renders a type badge span element.
     */
    _typeBadgeHtml(text) {
        return `<span class="cc-type-badge" style="display:inline-block;font-size:10px;font-weight:500;color:#6366f1;background:#eef2ff;border:1px solid #c7d2fe;border-radius:3px;padding:1px 5px;margin-left:4px;vertical-align:middle;">${text}</span>`;
    }

    _onCostSelectChange(selectEl) {
        const row = selectEl.closest('.cc-cost-row') || selectEl.closest('.cc-tier-cost-row');
        if (!row) return;
        const selected = selectEl.options[selectEl.selectedIndex];
        const type = selected?.dataset?.type || '';
        const valueType = selected?.dataset?.valueType || 'abs';

        // Update hidden type input
        const typeInput = row.querySelector('input[name$="_type"]');
        if (typeInput) typeInput.value = type;

        // Update value label and percentage warning for percentage fields
        const valueLabel = row.querySelector('.cc-cost-value-label');
        const valueInput = row.querySelector('input[name$="_value"]');
        // Remove old warning if switching types
        const oldWarn = row.querySelector('.cc-pct-warning');
        if (oldWarn) oldWarn.remove();
        // Remove old type badge
        const oldBadge = row.querySelector('.cc-type-badge');
        if (oldBadge) oldBadge.remove();

        // Look up allocation_type from the template config
        const config = this.templateManager?.getCurrentConfig?.() || {};
        const levelConfig = config.itemLevel || {};
        let allocationType = '';
        const fieldLists = [...(levelConfig.costFields || []), ...(levelConfig.taxFields || []), ...(levelConfig.discountFields || [])];
        const matchedField = fieldLists.find(f => f.alternate_name === selected?.value);
        if (matchedField) allocationType = matchedField.allocation_type || '';

        // Show type badge next to the value label
        if (selected?.value && valueLabel) {
            const badgeText = this._costTypeBadgeText(valueType, allocationType);
            valueLabel.insertAdjacentHTML('afterend', this._typeBadgeHtml(badgeText));
        }

        if (valueType === 'pct') {
            if (valueLabel) valueLabel.textContent = 'Value (%)';
            if (valueInput) {
                valueInput.removeAttribute('max');
                valueInput.removeAttribute('min');
                // Add warning span
                const warn = document.createElement('span');
                warn.className = 'cc-pct-warning';
                warn.style.cssText = 'color:#f59e0b;font-size:10px;display:none;margin-top:2px;';
                valueInput.parentElement.appendChild(warn);
                const checkPct = () => {
                    const v = parseFloat(valueInput.value);
                    if (isNaN(v)) { warn.style.display = 'none'; return; }
                    if (v === 0) { warn.textContent = '⚠ Value is 0%'; warn.style.display = 'block'; }
                    else if (v > 100) { warn.textContent = `⚠ Value exceeds 100% (${v}%)`; warn.style.display = 'block'; }
                    else { warn.style.display = 'none'; }
                };
                valueInput.addEventListener('input', checkPct);
            }
        } else {
            if (valueLabel) valueLabel.textContent = 'Value';
            if (valueInput) { valueInput.removeAttribute('max'); valueInput.removeAttribute('min'); }
        }

        // Refresh sibling dropdowns to disable this newly-selected value
        const tierCostsContainer = row.closest('[id*="-tier-"][id*="-costs"]') || row.closest('[id*="-costs"]');
        if (tierCostsContainer) this._refreshTierCostDropdowns(tierCostsContainer);
    }

    _buildCustomFieldOptions(level, sectionAltName) {
        const config = this.templateManager?.getCurrentConfig?.() || {};
        const allFields = level === 'contract' ? config.contractLevel?.customSections || [] : config.itemLevel?.customSections || [];
        const fields = allFields.filter(f => f.section_alternate_name === sectionAltName);
        if (!fields.length) return null;
        // store field_type and constraints as data attrs so we can render correct input on change
        return fields.map(f => {
            const constraintsJson = JSON.stringify(f.constraints || {}).replace(/"/g, '&quot;');
            const ft = f.field_type || 'SHORTTEXT';
            const typeLabels = { 'SHORTTEXT': 'Short Text', 'LONGTEXT': 'Long Text', 'FLOAT': 'Decimal', 'PERCENTAGE': 'Percentage', 'DATE': 'Date', 'BOOLEAN': 'Yes/No', 'CHOICE': 'Choice', 'INTEGER': 'Number' };
            const typeBadge = typeLabels[ft] || ft;
            return `<option value="${f.alternate_name}" data-type="${ft}" data-constraints="${constraintsJson}">${f.name}  [${typeBadge}]</option>`;
        }).join('');
    }

    _customFieldValueInput(fieldType, name, constraints) {
        const c = constraints || {};
        switch (fieldType) {
            case 'FLOAT': case 'PERCENTAGE':
                return `<input type="number" name="${name}" class="input-field cc-custom-val" step="0.01" style="font-size:12px;" placeholder="0">`;
            case 'DATE':
                return `<input type="date" name="${name}" class="input-field cc-custom-val" style="font-size:12px;">`;
            case 'BOOLEAN':
                return `<select name="${name}" class="input-field cc-custom-val" style="font-size:12px;"><option value="">--</option><option value="true">True</option><option value="false">False</option></select>`;
            case 'CHOICE': {
                const choices = c.choices || [];
                const isMulti = c.choice_type === 'MULTI_SELECT';
                if (isMulti) {
                    const opts = choices.map(ch => `<option value="${ch}">${ch}</option>`).join('');
                    return `<select name="${name}" class="input-field cc-custom-val" multiple style="font-size:12px;min-height:60px;">${opts}</select>`;
                } else {
                    const opts = choices.map(ch => `<option value="${ch}">${ch}</option>`).join('');
                    return `<select name="${name}" class="input-field cc-custom-val" style="font-size:12px;"><option value="">-- Select --</option>${opts}</select>`;
                }
            }
            default:
                return `<input type="text" name="${name}" class="input-field cc-custom-val" style="font-size:12px;" placeholder="Value">`;
        }
    }

    _onCustomFieldSelectChange(selectEl) {
        const row = selectEl.closest('.cc-custom-field-row');
        const valContainer = row.querySelector('.cc-custom-val-container');
        if (!valContainer) return;
        const opt = selectEl.selectedOptions[0];
        const fieldType = opt?.dataset?.type || 'SHORTTEXT';
        const constraints = opt?.dataset?.constraints ? JSON.parse(opt.dataset.constraints) : {};
        const valName = selectEl.name.replace('_name', '_value');
        valContainer.innerHTML = this._customFieldValueInput(fieldType, valName, constraints);

        // Show type badge next to the value container
        const oldBadge = row.querySelector('.cc-type-badge');
        if (oldBadge) oldBadge.remove();
        if (opt?.value) {
            const badgeText = this._fieldTypeBadgeText(fieldType);
            const valLabel = valContainer.closest('.form-group');
            if (valLabel) valLabel.insertAdjacentHTML('afterbegin', `<label style="font-size:11px;color:#64748b;">Value ${this._typeBadgeHtml(badgeText)}</label>`);
        }

        // Refresh sibling field dropdowns to disable this newly-selected value
        const fieldsContainer = row.closest('.cc-custom-fields-container');
        if (fieldsContainer) this._refreshCustomFieldDropdowns(fieldsContainer);
    }

    _addCustomFieldRow(containerEl, level, sectionAltName, sectionIdx) {
        // Check if all fields in this section are already used
        const config = this.templateManager?.getCurrentConfig?.() || {};
        const allFields = level === 'contract' ? config.contractLevel?.customSections || [] : config.itemLevel?.customSections || [];
        const sectionFields = allFields.filter(f => f.section_alternate_name === sectionAltName);
        if (sectionFields.length > 0) {
            const usedNames = new Set();
            containerEl.querySelectorAll('.cc-custom-field-row').forEach(row => {
                const sel = row.querySelector('select[name$="_name"]');
                const hid = row.querySelector('input[type="hidden"][name$="_name"]');
                if (sel && sel.value) usedNames.add(sel.value);
                else if (hid && hid.value) usedNames.add(hid.value);
            });
            const remaining = sectionFields.filter(f => !usedNames.has(f.alternate_name));
            if (remaining.length === 0) return;
        }

        const fieldIndex = containerEl.children.length;
        const optionsHtml = this._buildCustomFieldOptions(level, sectionAltName);
        const singleField = this._getSingleCustomField(level, sectionAltName);
        const valName = `cc_custom_${sectionIdx}_field_${fieldIndex}_value`;
        let fieldSelectHtml, defaultValHtml;

        if (singleField) {
            // Only 1 field in section — show as static label, no dropdown
            const constraints = singleField.constraints || {};
            const ft = singleField.field_type || 'SHORTTEXT';
            const badge = this._typeBadgeHtml(this._fieldTypeBadgeText(ft));
            fieldSelectHtml = `<span class="input-field" style="display:block;background:#f1f5f9;color:#334155;padding:6px 8px;font-size:12px;">${singleField.name} ${badge}</span>
                <input type="hidden" name="cc_custom_${sectionIdx}_field_${fieldIndex}_name" value="${singleField.alternate_name}">`;
            defaultValHtml = this._customFieldValueInput(ft, valName, constraints);
        } else if (optionsHtml) {
            // get first field's type and constraints for default value input
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = `<select>${optionsHtml}</select>`;
            const firstOpt = tempDiv.querySelector('option');
            const firstType = firstOpt?.dataset?.type || 'SHORTTEXT';
            const firstConstraints = firstOpt?.dataset?.constraints ? JSON.parse(firstOpt.dataset.constraints) : {};
            fieldSelectHtml = `<select name="cc_custom_${sectionIdx}_field_${fieldIndex}_name" class="input-field" style="font-size:12px;" onchange="window.uiController._onCustomFieldSelectChange(this)">
                <option value="">-- Select Field --</option>
                ${optionsHtml}
            </select>`;
            defaultValHtml = this._customFieldValueInput(firstType, valName, firstConstraints);
        } else {
            fieldSelectHtml = `<input type="text" name="cc_custom_${sectionIdx}_field_${fieldIndex}_name" class="input-field" style="font-size:12px;" placeholder="Field name">`;
            defaultValHtml = `<input type="text" name="${valName}" class="input-field cc-custom-val" style="font-size:12px;" placeholder="Value">`;
        }

        const html = `
            <div class="cc-custom-field-row" style="display:flex;gap:8px;align-items:flex-end;margin-bottom:6px;">
                <div class="form-group" style="flex:2;margin:0;">${fieldSelectHtml}</div>
                <div class="form-group cc-custom-val-container" style="flex:1;margin:0;">${defaultValHtml}</div>
                <button type="button" onclick="this.parentElement.remove()" style="padding:6px 10px;background:#ef4444;color:white;border:none;border-radius:4px;cursor:pointer;margin-bottom:2px;">✕</button>
            </div>`;
        containerEl.insertAdjacentHTML('beforeend', html);
        this._refreshCustomFieldDropdowns(containerEl);
    }

    /**
     * Disable already-selected custom fields in sibling dropdowns within the same section.
     */
    _refreshCustomFieldDropdowns(fieldsContainer) {
        if (!fieldsContainer) return;
        const rows = fieldsContainer.querySelectorAll('.cc-custom-field-row');
        const usedValues = new Set();
        rows.forEach(row => {
            const select = row.querySelector('select[name$="_name"]');
            const hidden = row.querySelector('input[type="hidden"][name$="_name"]');
            if (select && select.value) usedValues.add(select.value);
            else if (hidden && hidden.value) usedValues.add(hidden.value);
        });
        rows.forEach(row => {
            const select = row.querySelector('select[name$="_name"]');
            if (!select) return;
            const currentVal = select.value;
            Array.from(select.options).forEach(opt => {
                if (!opt.value) return;
                opt.disabled = (opt.value !== currentVal && usedValues.has(opt.value));
            });
        });
        // Patch remove buttons
        rows.forEach(row => {
            const removeBtn = row.querySelector('button[onclick*="this.parentElement.remove()"]');
            if (removeBtn && !removeBtn.dataset.patchedRefresh) {
                removeBtn.dataset.patchedRefresh = 'true';
                const container = fieldsContainer;
                removeBtn.removeAttribute('onclick');
                removeBtn.addEventListener('click', () => {
                    row.remove();
                    window.uiController._refreshCustomFieldDropdowns(container);
                });
            }
        });
    }

    /**
     * Disable already-used custom sections in sibling section dropdowns.
     */
    _refreshCustomSectionDropdowns(sectionsContainer) {
        if (!sectionsContainer) return;
        const sections = sectionsContainer.querySelectorAll('.cc-custom-section, .cc-item-custom-section');
        const usedValues = new Set();
        sections.forEach(sec => {
            const select = sec.querySelector('.cc-custom-section-select, select[name$="_section_name"]');
            if (select && select.value) usedValues.add(select.value);
        });
        sections.forEach(sec => {
            const select = sec.querySelector('.cc-custom-section-select, select[name$="_section_name"]');
            if (!select) return;
            const currentVal = select.value;
            Array.from(select.options).forEach(opt => {
                if (!opt.value) return;
                opt.disabled = (opt.value !== currentVal && usedValues.has(opt.value));
            });
        });
        // Patch remove buttons
        sections.forEach(sec => {
            const removeBtn = sec.querySelector('button[onclick*="closest"]');
            if (removeBtn && !removeBtn.dataset.patchedRefresh) {
                removeBtn.dataset.patchedRefresh = 'true';
                const container = sectionsContainer;
                removeBtn.removeAttribute('onclick');
                removeBtn.addEventListener('click', () => {
                    sec.remove();
                    window.uiController._refreshCustomSectionDropdowns(container);
                });
            }
        });
    }

    _addContractCustomSection() {
        const container = document.getElementById('contract-custom-container');
        if (!container) return;
        const index = container.children.length;
        const config = this.templateManager?.getCurrentConfig?.() || {};
        const customSections = config.contractLevel?.customSections || [];
        const seen = new Set();
        const uniqueSections = customSections.filter(f => { if (seen.has(f.section_alternate_name)) return false; seen.add(f.section_alternate_name); return true; });

        // Check if all sections are already added
        if (uniqueSections.length > 0) {
            const usedSections = new Set();
            container.querySelectorAll('.cc-custom-section').forEach(sec => {
                const sel = sec.querySelector('select[name$="_section_name"], input[name$="_section_name"]');
                if (sel && sel.value) usedSections.add(sel.value);
            });
            const remaining = uniqueSections.filter(s => !usedSections.has(s.section_alternate_name));
            if (remaining.length === 0) return;
        }

        const sectionOptions = uniqueSections.map(f => `<option value="${f.section_alternate_name}">${f.section_name}</option>`).join('');
        const firstSectionAlt = uniqueSections[0]?.section_alternate_name || '';

        const sectionSelectHtml = sectionOptions
            ? `<select name="cc_custom_${index}_section_name" class="input-field cc-custom-section-select" data-level="contract" data-index="${index}" onchange="window.uiController._refreshCustomSectionDropdowns(this.closest('[id$=-container]'))">${sectionOptions}</select>`
            : `<input type="text" name="cc_custom_${index}_section_name" class="input-field" placeholder="Section name">`;

        const html = `
            <div class="cc-custom-section" style="margin-bottom:12px;padding:8px;border:1px solid #e5e7eb;border-radius:6px;">
                <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px;">
                    <div class="form-group" style="flex:1;margin:0;">${sectionSelectHtml}</div>
                    <button type="button" onclick="this.closest('.cc-custom-section').remove()" style="padding:6px 10px;background:#ef4444;color:white;border:none;border-radius:4px;cursor:pointer;">✕</button>
                </div>
                <div class="cc-custom-fields-container"></div>
                <button type="button" class="btn-add-row" style="font-size:11px;padding:3px 8px;" onclick="window.uiController._addCustomFieldRow(this.previousElementSibling, 'contract', '${firstSectionAlt}', ${index})">+ Add Field</button>
            </div>`;
        container.insertAdjacentHTML('beforeend', html);
        this._refreshCustomSectionDropdowns(container);
    }

    _renderItemCostsSection(itemIndex) {
        const optionsHTML = this._buildCostOptions('item');
        if (!optionsHTML) return '';
        return `
            <p class="cc-sub-title">💰 Item Costs / Taxes</p>
            <div id="item-${itemIndex}-costs"></div>
            <button type="button" class="btn-add-row" onclick="window.uiController._addItemCostRow(${itemIndex})">+ Add Cost / Tax</button>
        `;
    }

    _addItemCostRow(itemIndex) {
        const container = document.getElementById(`item-${itemIndex}-costs`);
        if (!container) return;
        const index = container.children.length;
        const optionsHTML = this._buildCostOptions('item');

        let html;
        if (optionsHTML) {
            html = `
            <div class="cc-item-cost-row" style="display:flex;gap:8px;align-items:flex-end;margin-bottom:8px;">
                <div class="form-group" style="flex:2;margin:0;">
                    <label>Cost / Tax</label>
                    <select name="item_${itemIndex}_cost_${index}_name" class="input-field cc-cost-select" onchange="window.uiController._onCostSelectChange(this)">
                        <option value="">-- Select --</option>
                        ${optionsHTML}
                    </select>
                    <input type="hidden" name="item_${itemIndex}_cost_${index}_type" value="">
                </div>
                <div class="form-group" style="flex:1;margin:0;">
                    <label class="cc-cost-value-label">Value</label>
                    <input type="number" name="item_${itemIndex}_cost_${index}_value" class="input-field" step="0.01" placeholder="0">
                </div>
                <button type="button" onclick="this.parentElement.remove()" style="padding:6px 10px;background:#ef4444;color:white;border:none;border-radius:4px;cursor:pointer;margin-bottom:2px;">✕</button>
            </div>`;
        } else {
            html = `
            <div class="cc-item-cost-row" style="display:flex;gap:8px;align-items:flex-end;margin-bottom:8px;">
                <div class="form-group" style="flex:1;margin:0;">
                    <label>Type</label>
                    <select name="item_${itemIndex}_cost_${index}_type" class="input-field">
                        <option value="cost">Cost</option>
                        <option value="tax">Tax</option>
                    </select>
                </div>
                <div class="form-group" style="flex:2;margin:0;">
                    <label>Name</label>
                    <input type="text" name="item_${itemIndex}_cost_${index}_name" class="input-field" placeholder="e.g., GST">
                </div>
                <div class="form-group" style="flex:1;margin:0;">
                    <label>Value</label>
                    <input type="number" name="item_${itemIndex}_cost_${index}_value" class="input-field" step="0.01">
                </div>
                <button type="button" onclick="this.parentElement.remove()" style="padding:6px 10px;background:#ef4444;color:white;border:none;border-radius:4px;cursor:pointer;margin-bottom:2px;">✕</button>
            </div>`;
        }
        container.insertAdjacentHTML('beforeend', html);
    }

    _renderItemCustomSectionRow(itemIndex, rowIndex) {
        const config = this.templateManager?.getCurrentConfig?.() || {};
        const customSections = config.itemLevel?.customSections || [];
        const seen = new Set();
        const uniqueSections = customSections.filter(f => { if (seen.has(f.section_alternate_name)) return false; seen.add(f.section_alternate_name); return true; });
        const sectionOptions = uniqueSections.map(f => `<option value="${f.section_alternate_name}">${f.section_name}</option>`).join('');
        const firstSectionAlt = uniqueSections[0]?.section_alternate_name || '';
        const sectionKey = `item_${itemIndex}_csec_${rowIndex}`;

        const sectionSelectHtml = sectionOptions
            ? `<select name="${sectionKey}_section_name" class="input-field" onchange="window.uiController._refreshCustomSectionDropdowns(this.closest('[id$=-custom]'))">${sectionOptions}</select>`
            : `<input type="text" name="${sectionKey}_section_name" class="input-field" placeholder="e.g., Essential Terms">`;

        return `
            <div class="cc-item-custom-section" style="margin-bottom:12px;padding:8px;border:1px solid #e5e7eb;border-radius:6px;">
                <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px;">
                    <div class="form-group" style="flex:1;margin:0;">${sectionSelectHtml}</div>
                    <button type="button" onclick="this.closest('.cc-item-custom-section').remove()" style="padding:6px 10px;background:#ef4444;color:white;border:none;border-radius:4px;cursor:pointer;">✕</button>
                </div>
                <div class="cc-custom-fields-container"></div>
                <button type="button" class="btn-add-row" style="font-size:11px;padding:3px 8px;" onclick="window.uiController._addCustomFieldRow(this.previousElementSibling, 'item', '${firstSectionAlt}', '${sectionKey}')">+ Add Field</button>
            </div>`;
    }

    // Pre-fills mandatory field rows inside a .cc-custom-section card
    _preFillMandatoryCustomFields(sectionEl, level) {
        if (!sectionEl) return;
        const sectionAltName = sectionEl.querySelector('[name$="_section_name"]')?.value;
        if (!sectionAltName) return;
        const config = this.templateManager?.getCurrentConfig?.() || {};
        const allFields = level === 'contract' ? config.contractLevel?.customSections || [] : config.itemLevel?.customSections || [];
        const mandatoryFields = allFields.filter(f => f.section_alternate_name === sectionAltName && f.is_mandatory);
        const container = sectionEl.querySelector('.cc-custom-fields-container');
        if (!container || mandatoryFields.length === 0) return;
        const sectionIdx = sectionEl.closest('[id$="-container"]')?.children.length - 1 || 0;
        mandatoryFields.forEach((field, fi) => {
            const valName = `cc_custom_${sectionIdx}_field_${fi}_value`;
            const constraints = field.constraints || {};
            const ft = field.field_type || 'SHORTTEXT';
            const badge = this._typeBadgeHtml(this._fieldTypeBadgeText(ft));
            const valHtml = this._customFieldValueInput(ft, valName, constraints);
            const html = `
                <div class="cc-custom-field-row" data-mandatory="true" style="display:flex;gap:8px;align-items:flex-end;margin-bottom:6px;background:#f0fdf4;border-radius:4px;padding:4px;">
                    <div class="form-group" style="flex:2;margin:0;">
                        <label style="font-size:11px;color:#16a34a;">★ ${field.name} ${badge} <small>(required)</small></label>
                        <span class="input-field" style="display:block;background:#f1f5f9;color:#334155;padding:6px 8px;font-size:12px;">${field.name}</span>
                        <input type="hidden" name="cc_custom_${sectionIdx}_field_${fi}_name" value="${field.alternate_name}">
                    </div>
                    <div class="form-group cc-custom-val-container" style="flex:1;margin:0;">${valHtml}</div>
                </div>`;
            container.insertAdjacentHTML('beforeend', html);
        });
    }

    _readCustomFieldValue(valEl) {
        if (!valEl) return '';
        if (valEl.tagName === 'SELECT' && valEl.multiple) {
            return Array.from(valEl.selectedOptions).map(o => o.value).filter(v => v);
        }
        return valEl.value || '';
    }

    _addItemCustomSection(itemIndex) {
        const container = document.getElementById(`item-${itemIndex}-custom`);
        if (!container) return;

        // Check if all sections are already added
        const config = this.templateManager?.getCurrentConfig?.() || {};
        const customSections = config.itemLevel?.customSections || [];
        const seen = new Set();
        const uniqueSections = customSections.filter(f => { if (seen.has(f.section_alternate_name)) return false; seen.add(f.section_alternate_name); return true; });
        if (uniqueSections.length > 0) {
            const usedSections = new Set();
            container.querySelectorAll('.cc-item-custom-section').forEach(sec => {
                const sel = sec.querySelector('select[name$="_section_name"], input[name$="_section_name"]');
                if (sel && sel.value) usedSections.add(sel.value);
            });
            const remaining = uniqueSections.filter(s => !usedSections.has(s.section_alternate_name));
            if (remaining.length === 0) return;
        }

        const index = container.children.length;
        container.insertAdjacentHTML('beforeend', this._renderItemCustomSectionRow(itemIndex, index));
        this._refreshCustomSectionDropdowns(container);
    }

    _getMandatoryFields(costType) {
        const config = this.templateManager?.getCurrentConfig?.() || {};
        const fields = costType === 'cost' ? config.itemLevel?.costFields
                     : costType === 'tax' ? config.itemLevel?.taxFields
                     : config.itemLevel?.discountFields;
        return (fields || []).filter(f => f.is_mandatory);
    }

    _renderMandatoryCostRows(itemIndex, tierIndex) {
        let html = '';
        let rowIdx = 0;
        const renderField = (field, costType) => {
            const vt = field.cost_type === 'PERCENTAGE' ? 'pct' : 'abs';
            const valLabel = vt === 'pct' ? 'Value (%)' : 'Value';
            const badgeText = this._costTypeBadgeText(vt, field.allocation_type || '');
            const badge = this._typeBadgeHtml(badgeText);
            html += `
            <div class="cc-tier-cost-row" data-mandatory="true" style="display:flex;gap:8px;align-items:flex-end;margin-bottom:6px;background:#f0fdf4;border-radius:4px;padding:4px;">
                <div class="form-group" style="flex:2;margin:0;">
                    <label style="font-size:11px;color:#16a34a;">★ ${field.name} <small>(required)</small></label>
                    <input type="hidden" name="item_${itemIndex}_tier_${tierIndex}_cost_${rowIdx}_name" value="${field.alternate_name}">
                    <input type="hidden" name="item_${itemIndex}_tier_${tierIndex}_cost_${rowIdx}_type" value="${costType}">
                    <span class="input-field" style="display:block;background:#f1f5f9;color:#334155;padding:6px 8px;font-size:12px;cursor:default;">${field.name}</span>
                </div>
                <div class="form-group" style="flex:1;margin:0;">
                    <label style="font-size:11px;color:#64748b;" class="cc-cost-value-label">${valLabel} ${badge}</label>
                    <input type="number" name="item_${itemIndex}_tier_${tierIndex}_cost_${rowIdx}_value" class="input-field" step="0.01" placeholder="0"
                        ${vt === 'pct' ? `oninput="(function(el){var w=el.parentElement.querySelector('.cc-pct-warning');if(!w){w=document.createElement('span');w.className='cc-pct-warning';w.style.cssText='color:#f59e0b;font-size:10px;display:none;margin-top:2px;';el.parentElement.appendChild(w);}var v=parseFloat(el.value);if(isNaN(v)){w.style.display='none';}else if(v===0){w.textContent='⚠ Value is 0%';w.style.display='block';}else if(v>100){w.textContent='⚠ Value exceeds 100% ('+v+'%)';w.style.display='block';}else{w.style.display='none';}})(this)"` : ''}>
                </div>
            </div>`;
            rowIdx++;
        };

        for (const f of this._getMandatoryFields('cost')) renderField(f, 'cost');
        for (const f of this._getMandatoryFields('tax')) renderField(f, 'tax');
        for (const f of this._getMandatoryFields('discount')) renderField(f, 'discount');
        return { html, count: rowIdx };
    }

    _addTierCostRow(itemIndex, tierIndex, costType) {
        const container = document.getElementById(`item-${itemIndex}-tier-${tierIndex}-costs`);
        if (!container) return;

        // Check if all fields of this costType are already used in this tier
        const config = this.templateManager?.getCurrentConfig?.() || {};
        const levelConfig = config.itemLevel || {};
        const availableFields = costType === 'cost' ? levelConfig.costFields || []
            : costType === 'tax' ? levelConfig.taxFields || []
            : levelConfig.discountFields || [];

        if (availableFields.length > 0) {
            // Collect all used field names in this tier (from both mandatory and dynamic rows)
            const tierCard = container.closest('.cc-tier-card');
            const usedNames = new Set();
            if (tierCard) {
                tierCard.querySelectorAll('.cc-tier-cost-row').forEach(row => {
                    // Check hidden type input to only count rows of the same costType
                    const typeInput = row.querySelector('input[type="hidden"][name$="_type"]');
                    if (typeInput && typeInput.value !== costType) return;
                    const select = row.querySelector('.cc-cost-select');
                    const hidden = row.querySelector('input[type="hidden"][name$="_name"]');
                    if (select && select.value) usedNames.add(select.value);
                    else if (hidden && hidden.value) usedNames.add(hidden.value);
                });
            }
            const remaining = availableFields.filter(f => !usedNames.has(f.alternate_name));
            if (remaining.length === 0) {
                // All fields of this type are already added
                return;
            }
        }

        // Offset by mandatory row count so indices don't collide
        const mandatoryCount = container.closest('.cc-tier-card')?.querySelectorAll('.cc-tier-cost-row[data-mandatory]')?.length || 0;
        const index = container.children.length + mandatoryCount;
        const optionsHTML = this._buildCostOptions('item', costType);
        const singleField = this._getSingleCostField('item', costType);
        const label = costType === 'tax' ? 'Tax' : costType === 'discount' ? 'Discount' : 'Additional Cost';

        let html;
        if (singleField) {
            // Only 1 option — show as static label, no dropdown
            const vt = singleField.cost_type === 'PERCENTAGE' ? 'pct' : 'abs';
            const badgeText = this._costTypeBadgeText(vt, singleField.allocation_type || '');
            const badge = this._typeBadgeHtml(badgeText);
            html = `
            <div class="cc-tier-cost-row" style="display:flex;gap:8px;align-items:flex-end;margin-bottom:6px;">
                <div class="form-group" style="flex:2;margin:0;">
                    <label style="font-size:11px;color:#64748b;">${label}</label>
                    <span class="input-field" style="display:block;background:#f1f5f9;color:#334155;padding:6px 8px;font-size:12px;">${singleField.name}</span>
                    <input type="hidden" name="item_${itemIndex}_tier_${tierIndex}_cost_${index}_name" value="${singleField.alternate_name}">
                    <input type="hidden" name="item_${itemIndex}_tier_${tierIndex}_cost_${index}_type" value="${costType}">
                </div>
                <div class="form-group" style="flex:1;margin:0;">
                    <label style="font-size:11px;color:#64748b;" class="cc-cost-value-label">${vt === 'pct' ? 'Value (%)' : 'Value'} ${badge}</label>
                    <input type="number" name="item_${itemIndex}_tier_${tierIndex}_cost_${index}_value" class="input-field" step="0.01" placeholder="0">
                </div>
                <button type="button" onclick="this.parentElement.remove()" style="padding:6px 10px;background:#ef4444;color:white;border:none;border-radius:4px;cursor:pointer;margin-bottom:2px;">✕</button>
            </div>`;
        } else if (optionsHTML) {
            html = `
            <div class="cc-tier-cost-row" style="display:flex;gap:8px;align-items:flex-end;margin-bottom:6px;">
                <div class="form-group" style="flex:2;margin:0;">
                    <label style="font-size:11px;color:#64748b;">${label}</label>
                    <select name="item_${itemIndex}_tier_${tierIndex}_cost_${index}_name" class="input-field cc-cost-select" onchange="window.uiController._onCostSelectChange(this)">
                        <option value="">-- Select --</option>
                        ${optionsHTML}
                    </select>
                    <input type="hidden" name="item_${itemIndex}_tier_${tierIndex}_cost_${index}_type" value="${costType}">
                </div>
                <div class="form-group" style="flex:1;margin:0;">
                    <label style="font-size:11px;color:#64748b;" class="cc-cost-value-label">Value</label>
                    <input type="number" name="item_${itemIndex}_tier_${tierIndex}_cost_${index}_value" class="input-field" step="0.01" placeholder="0">
                </div>
                <button type="button" onclick="this.parentElement.remove()" style="padding:6px 10px;background:#ef4444;color:white;border:none;border-radius:4px;cursor:pointer;margin-bottom:2px;">✕</button>
            </div>`;
        } else {
            html = `
            <div class="cc-tier-cost-row" style="display:flex;gap:8px;align-items:flex-end;margin-bottom:6px;">
                <div class="form-group" style="flex:2;margin:0;">
                    <label style="font-size:11px;color:#64748b;">${label}</label>
                    <input type="text" name="item_${itemIndex}_tier_${tierIndex}_cost_${index}_name" class="input-field" placeholder="e.g., ${label}">
                    <input type="hidden" name="item_${itemIndex}_tier_${tierIndex}_cost_${index}_type" value="${costType}">
                </div>
                <div class="form-group" style="flex:1;margin:0;">
                    <label style="font-size:11px;color:#64748b;">Value</label>
                    <input type="number" name="item_${itemIndex}_tier_${tierIndex}_cost_${index}_value" class="input-field" step="0.01">
                </div>
                <button type="button" onclick="this.parentElement.remove()" style="padding:6px 10px;background:#ef4444;color:white;border:none;border-radius:4px;cursor:pointer;margin-bottom:2px;">✕</button>
            </div>`;
        }
        container.insertAdjacentHTML('beforeend', html);
        this._refreshTierCostDropdowns(container);
    }

    /**
     * Disable already-selected cost/tax/discount options in sibling dropdowns within the same tier.
     * Also updates remove buttons to refresh on removal.
     */
    _refreshTierCostDropdowns(tierCostsContainer) {
        if (!tierCostsContainer) return;
        const rows = tierCostsContainer.querySelectorAll('.cc-tier-cost-row');
        // Collect all currently selected values (from dropdowns and hidden inputs for single/mandatory fields)
        const usedValues = new Set();
        rows.forEach(row => {
            const select = row.querySelector('.cc-cost-select');
            const hidden = row.querySelector('input[type="hidden"][name$="_name"]');
            if (select && select.value) usedValues.add(select.value);
            else if (hidden && hidden.value) usedValues.add(hidden.value);
        });

        // Disable used options in all dropdowns
        rows.forEach(row => {
            const select = row.querySelector('.cc-cost-select');
            if (!select) return;
            const currentVal = select.value;
            Array.from(select.options).forEach(opt => {
                if (!opt.value) return; // skip placeholder
                // Disable if used by another row, but keep enabled if it's this row's own selection
                opt.disabled = (opt.value !== currentVal && usedValues.has(opt.value));
            });
        });

        // Patch remove buttons to also refresh dropdowns on removal
        rows.forEach(row => {
            const removeBtn = row.querySelector('button[onclick*="this.parentElement.remove()"]');
            if (removeBtn && !removeBtn.dataset.patchedRefresh) {
                removeBtn.dataset.patchedRefresh = 'true';
                const container = tierCostsContainer;
                removeBtn.removeAttribute('onclick');
                removeBtn.addEventListener('click', () => {
                    row.remove();
                    window.uiController._refreshTierCostDropdowns(container);
                });
            }
        });
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
        const toggleAdditionalCostsU = document.getElementById('toggle-additional-costs-update');
        const toggleTaxesU = document.getElementById('toggle-taxes-update');
        const toggleContractCustom = document.getElementById('toggle-contract-custom-update');
        const toggleItemCustom = document.getElementById('toggle-item-custom-update');

        if (toggleContractCustom) {
            toggleContractCustom.addEventListener('change', (e) => {
                const section = document.getElementById('contract-custom-section-update');
                section.classList.toggle('visible', e.target.checked);
                if (e.target.checked && document.getElementById('contract-custom-container-update').children.length === 0) {
                    this._addContractCustomSectionUpdate();
                }
            });
        }

        if (toggleAdditionalCostsU) toggleAdditionalCostsU.addEventListener('change', () => this._updateTierCostButtons(true));
        if (toggleTaxesU) toggleTaxesU.addEventListener('change', () => this._updateTierCostButtons(true));
        if (toggleItemCustom) toggleItemCustom.addEventListener('change', () => this._updateItemCustomVisibility(true));

        // Event delegation for Add Tier buttons
        const itemsContainerUpdate = document.getElementById('contract-items-container-update');
        if (itemsContainerUpdate) {
            itemsContainerUpdate.addEventListener('click', (e) => {
                if (e.target.classList.contains('btn-add-tier-update')) {
                    const itemIndex = parseInt(e.target.dataset.itemIndex);
                    this._addPricingTierUpdate(itemIndex);
                }
                if (e.target.classList.contains('btn-remove-tier-update')) {
                    const itemIndex = parseInt(e.target.dataset.itemIndex);
                    const tierIndex = parseInt(e.target.dataset.tierIndex);
                    this._removePricingTierUpdate(itemIndex, tierIndex);
                }
            });
        }

        // Initial render of contract items
        this._renderContractItemsUpdate();

        // Set default dates after form is ready
        if (typeof setDefaultDates === 'function') setTimeout(setDefaultDates, 50);

        // Load contract search
        setTimeout(() => this._setupLoadContractSearch(), 50);
    }

    _setupLoadContractSearch() {
        const input = document.getElementById('load-contract-search');
        if (!input) return;

        const fetchContracts = async (q) => {
            const token = this.factwiseIntegration?.getToken() || this.tokenManager?.getToken();
            if (!token) return [];
            const baseUrl = this.environmentManager.getFactwiseBaseUrl();
            try {
                const res = await fetch(`${baseUrl}dashboard/`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        dashboard_view: 'contract_buyer', tab: 'all',
                        items_per_page: 10, page_number: 1,
                        query_data: {}, search_text: q,
                        sort_fields: [], filters: null
                    })
                });
                if (!res.ok) return [];
                const data = await res.json();
                const records = data?.data || [];
                return records.map(c => ({
                    contract: c,
                    html: `<strong>${c.custom_contract_id || ''}</strong>${c.ERP_contract_id ? ` / ${c.ERP_contract_id}` : ''} <span style="color:#64748b;">— ${c.contract_name || ''}</span>`
                }));
            } catch { return []; }
        };

        const onSelect = (r) => {
            this._loadContractIntoUpdateForm(r.contract);
        };

        this._attachSearchDropdown(input, fetchContracts, onSelect);
    }

    async _loadContractIntoUpdateForm(contract) {
        const form = this.elements.operationForm;
        const status = document.getElementById('load-contract-status');
        const spinner = document.getElementById('load-contract-spinner');
        if (spinner) spinner.style.display = 'inline';
        if (status) status.textContent = 'Loading contract details...';

        // Store for "View Contract" link after successful update
        this._loadedContractId = contract.contract_id;
        this._loadedTemplateId = contract.additional_details?.template_id;

        // --- Fill header fields ---
        const set = (name, val) => {
            const el = form.querySelector(`[name="${name}"]`);
            if (el && val !== undefined && val !== null) el.value = val;
        };
        const setSelect = (name, val) => {
            const el = form.querySelector(`[name="${name}"]`);
            if (el && val) {
                const opt = [...el.options].find(o => o.value === val);
                if (opt) el.value = val;
            }
        };

        set('factwise_contract_id', contract.custom_contract_id || '');
        set('ERP_contract_id', contract.ERP_contract_id || '');
        set('contract_name', contract.contract_name || '');
        set('contract_start_date', contract.contract_start_date || '');
        set('contract_end_date', contract.contract_end_date || '');
        set('entity_name', contract.buyer_entity_details?.buyer_entity_name || '');
        setSelect('status', contract.status);

        // Buyer
        const buyerIds = (contract.buyer_identifications_details || []).map(b => b.identification_name).join(', ');
        set('buyer_identifications', buyerIds);
        set('buyer_address', contract.buyer_address_information?.full_address || '');
        set('buyer_contact', contract.buyer_contact_information?.buyer_contact_email || '');

        // Vendor
        set('factwise_vendor_code', contract.vendor_contacts?.[0]?.enterprise_vendor_master?.vendor_code || '');
        set('vendor_contact', contract.vendor_contact_information?.vendor_contact_email || '');
        set('vendor_identification_name', contract.vendor_identifications?.[0]?.identification_name || '');
        set('vendor_identification_value', contract.vendor_identifications?.[0]?.identification_value || '');
        set('vendor_address_id', contract.vendor_address_information?.address_id || '');
        set('vendor_full_address', contract.vendor_address_information?.full_address || '');

        // Payment & Terms
        set('project', contract.project_information?.project_code || '');
        set('prepayment_percentage', contract.prepayment_percentage ?? '');
        setSelect('payment_type', contract.payment_type);
        set('payment_term', contract.payment_terms?.term ?? '');
        setSelect('payment_period', contract.payment_terms?.period);
        setSelect('payment_applied_from', contract.payment_terms?.applied_from);
        set('lead_time', contract.lead_time ?? '');
        setSelect('lead_time_period', contract.lead_time_period);

        // Store contract_id (UUID) for items lookup
        const contractUUID = contract.contract_id;

        // --- Fetch items ---
        try {
            const token = this.factwiseIntegration?.getToken() || this.tokenManager?.getToken();
            const baseUrl = this.environmentManager.getFactwiseBaseUrl();
            const res = await fetch(`${baseUrl}dashboard/`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    dashboard_view: 'contract_items', tab: 'all',
                    items_per_page: 50, page_number: 1,
                    query_data: { contract_id: contractUUID },
                    sort_fields: [], search_text: '', filters: null
                })
            });
            const data = await res.json();
            const items = data?.data || [];

            // Re-render items container with fetched items
            const container = document.getElementById('contract-items-container-update');
            if (container && items.length > 0) {
                container.innerHTML = '';
                for (let i = 0; i < items.length; i++) {
                    this._addContractItemUpdate();
                }
                // Fill each item's fields
                items.forEach((item, i) => {
                    const setItem = (name, val) => {
                        const el = form.querySelector(`[name="item_${i}_${name}"]`);
                        if (el && val !== undefined && val !== null) el.value = val;
                    };
                    const setItemSelect = (name, val) => {
                        const el = form.querySelector(`[name="item_${i}_${name}"]`);
                        if (el && val) {
                            const opt = [...el.options].find(o => o.value === val);
                            if (opt) el.value = val;
                        }
                    };

                    setItem('factwise_code', item.enterprise_item_details?.code || '');
                    setItem('erp_code', item.enterprise_item_details?.ERP_item_code || '');
                    setItem('currency_id', item.currency || '');
                    setItem('unit_id', item.measurement_unit || '');
                    setItem('prepayment', item.prepayment_percentage ?? '');
                    setItemSelect('payment_type', item.payment_type);
                    setItem('lead_time', item.procurement_information?.lead_time ?? '');
                    setItemSelect('lead_time_period', item.procurement_information?.lead_time_period);
                    setItem('payment_term', item.payment_terms?.term ?? '');
                    setItemSelect('payment_period', item.payment_terms?.period);
                    setItemSelect('payment_applied_from', item.payment_terms?.applied_from);

                    // Fill pricing tiers
                    const tiers = item.pricing_tiers || [];
                    if (tiers.length > 0) {
                        const itemCard = container.querySelector(`.cc-item-card[data-item-index="${i}"]`);
                        if (itemCard) {
                            // Add extra tiers if needed (first one already exists)
                            for (let t = 1; t < tiers.length; t++) {
                                this._addPricingTierUpdate(i);
                            }
                            tiers.forEach((tier, t) => {
                                setItem(`tier_${t}_min`, tier.min_quantity ?? '');
                                setItem(`tier_${t}_max`, tier.max_quantity ?? '');
                                setItem(`tier_${t}_rate`, tier.rate ?? '');
                            });
                        }
                    }
                });
            }

            if (status) status.innerHTML = `<span style="color:#16a34a;">✓ Loaded: <strong>${contract.contract_name}</strong> (${items.length} item${items.length !== 1 ? 's' : ''})</span>`;
        } catch (e) {
            if (status) status.innerHTML = `<span style="color:#dc2626;">Failed to load contract items: ${e.message}</span>`;
        } finally {
            if (spinner) spinner.style.display = 'none';
        }
    }

    _addPricingTierUpdate(itemIndex) {
        const itemCard = document.querySelector(`.cc-item-card[data-item-index="${itemIndex}"]`);
        if (!itemCard) return;

        const currentTiers = parseInt(itemCard.dataset.tiersCount || 1);
        const newTierCount = currentTiers + 1;

        // Update tier count
        itemCard.dataset.tiersCount = newTierCount;

        // Get settings
        const showAdditionalCosts = document.getElementById('toggle-additional-costs-update')?.checked || false;
        const showTaxes = document.getElementById('toggle-taxes-update')?.checked || false;
        const showDiscounts = (this.templateManager?.getCurrentConfig?.()?.itemLevel?.discountFields?.length || 0) > 0;

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
            tiersContainer.innerHTML = this._renderPricingTiersUpdate(itemIndex, newTierCount, showAdditionalCosts, showTaxes, showDiscounts, lastTierMax);
            this._attachTierMaxListeners(tiersContainer, itemIndex, true);
        }
    }

    _removePricingTierUpdate(itemIndex, tierIndex) {
        const itemCard = document.querySelector(`.cc-item-card[data-item-index="${itemIndex}"]`);
        if (!itemCard) return;

        const currentTiers = parseInt(itemCard.dataset.tiersCount || 1);
        if (currentTiers <= 1) return; // Don't allow removing the last tier

        const newTierCount = currentTiers - 1;
        itemCard.dataset.tiersCount = newTierCount;

        // Get settings
        const showAdditionalCosts = document.getElementById('toggle-additional-costs-update')?.checked || false;
        const showTaxes = document.getElementById('toggle-taxes-update')?.checked || false;
        const showDiscounts = (this.templateManager?.getCurrentConfig?.()?.itemLevel?.discountFields?.length || 0) > 0;

        // Re-render all tiers except the removed one
        const tiersContainer = document.getElementById(`tiers-container-update-${itemIndex}`);
        if (tiersContainer) {
            tiersContainer.innerHTML = this._renderPricingTiersUpdate(itemIndex, newTierCount, showAdditionalCosts, showTaxes, showDiscounts);
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
        const showAdditionalCosts = document.getElementById('toggle-additional-costs-update')?.checked || false;
        const showTaxes = document.getElementById('toggle-taxes-update')?.checked || false;
        const showDiscounts = (this.templateManager?.getCurrentConfig?.()?.itemLevel?.discountFields?.length || 0) > 0;
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
                                    <option value="PER_DELIVERABLE">PER_DELIVERABLE</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label>Incoterm *</label>
                                <select name="item_${itemIndex}_incoterm" class="input-field" required>
                                    <option value="EXW">EXW</option>
                                    <option value="FCA">FCA</option>
                                    <option value="FAS">FAS</option>
                                    <option value="FOB">FOB</option>
                                    <option value="CFR">CFR</option>
                                    <option value="CIF">CIF</option>
                                    <option value="CPT">CPT</option>
                                    <option value="CIP">CIP</option>
                                    <option value="DAP">DAP</option>
                                    <option value="DAT">DAT</option>
                                    <option value="DDP">DDP</option>
                                    <option value="NA" selected>NA</option>
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
                                    <option value="YEARS">YEARS</option>
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
                                    <option value="DAYS">DAYS</option>
                                    <option value="WEEKS">WEEKS</option>
                                    <option value="MONTHS" selected>MONTHS</option>
                                    <option value="YEARS">YEARS</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Applied From</label>
                                <select name="item_${itemIndex}_payment_applied_from" class="input-field">
                                    <option value="INVOICE_DATE" selected>INVOICE_DATE</option>
                                    <option value="RECEIPT_DATE">RECEIPT_DATE</option>
                                    <option value="DISPATCH_DATE">DISPATCH_DATE</option>
                                </select>
                            </div>
                        </div>

                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                            <p class="cc-sub-title" style="margin: 0;">📊 Pricing Tiers</p>
                            <button type="button" class="btn-add-tier-update" data-item-index="${itemIndex}" style="background: #3b82f6; color: white; border: none; border-radius: 4px; padding: 6px 12px; cursor: pointer; font-size: 12px;">
                                + Add Tier
                            </button>
                        </div>
                        <div id="tiers-container-update-${itemIndex}">
                            ${this._renderPricingTiersUpdate(itemIndex, tiersCount, showAdditionalCosts, showTaxes, showDiscounts)}
                        </div>

                        ${this._renderItemCostsSection(itemIndex)}

                        <div class="cc-item-custom-section-wrapper" style="display:${showItemCustom ? '' : 'none'}">
                            <p class="cc-sub-title">🔧 Item Custom Sections</p>
                            <div id="item-${itemIndex}-custom">
                                ${this._renderItemCustomSectionRow(itemIndex, 0)}
                            </div>
                            <button type="button" class="btn-add-row" onclick="window.uiController._addItemCustomSection(${itemIndex})">+ Add Custom Section</button>
                        </div>
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

    _renderPricingTiersUpdate(itemIndex, count, showAdditionalCosts, showTaxes, showDiscounts, lastAddedMax) {
        let html = '';
        for (let i = 0; i < count; i++) {
            const isFirstTier = i === 0;
            const defaultMin = i * 100 + (i > 0 ? 1 : 0);
            const defaultMax = (i + 1) * 100;
            const mandatory = this._renderMandatoryCostRows(itemIndex, i);
            const hasMandatory = mandatory.count > 0;
            const showAnyCosts = showAdditionalCosts || showTaxes || showDiscounts || hasMandatory;
            html += `
                <div class="cc-tier-card" data-tier-index="${i}">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <p class="cc-tier-card-title" style="margin: 0;"><span class="tier-dot"></span>Tier ${i + 1}</p>
                        ${count > 1 ? `
                            <button type="button" class="btn-remove-tier-update" data-item-index="${itemIndex}" data-tier-index="${i}" style="background: #ef4444; color: white; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer; font-size: 11px;">
                                ✕ Remove
                            </button>
                        ` : ''}
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Min Quantity${isFirstTier ? ' <small style="color:#6366f1;font-size:10px">(default: 0)</small>' : ' <small style="color:#64748b;font-size:10px">(prev max + 1)</small>'}</label>
                            <input type="number" name="item_${itemIndex}_tier_${i}_min" class="input-field tier-min" value="${defaultMin}" step="0.01">
                        </div>
                        <div class="form-group">
                            <label>Max Quantity</label>
                            <input type="number" name="item_${itemIndex}_tier_${i}_max" class="input-field tier-max" value="${defaultMax}" step="0.01" data-item="${itemIndex}" data-tier="${i}">
                        </div>
                        <div class="form-group">
                            <label>Rate</label>
                            <input type="number" name="item_${itemIndex}_tier_${i}_rate" class="input-field" value="10" step="0.01">
                        </div>
                    </div>
                    ${showAnyCosts ? `
                        <p style="font-size:12px;color:#64748b;margin:8px 0 4px;">Tier Costs</p>
                        ${mandatory.html}
                        <div id="item-${itemIndex}-tier-${i}-costs"></div>
                        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">
                            ${showAdditionalCosts ? `<button type="button" class="btn-add-row" style="font-size:11px;padding:3px 8px;" onclick="window.uiController._addTierCostRow(${itemIndex},${i},'cost')">+ Additional Cost</button>` : ''}
                            ${showTaxes ? `<button type="button" class="btn-add-row" style="font-size:11px;padding:3px 8px;" onclick="window.uiController._addTierCostRow(${itemIndex},${i},'tax')">+ Tax</button>` : ''}
                            ${showDiscounts ? `<button type="button" class="btn-add-row" style="font-size:11px;padding:3px 8px;" onclick="window.uiController._addTierCostRow(${itemIndex},${i},'discount')">+ Discount</button>` : ''}
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
        const optionsHTML = this._buildCostOptions('contract');

        let html;
        if (optionsHTML) {
            html = `
            <div class="cc-cost-row" style="display:flex;gap:8px;align-items:flex-end;margin-bottom:8px;">
                <div class="form-group" style="flex:2;margin:0;">
                    <label>Cost / Tax / Discount</label>
                    <select name="contract_cost_${index}_name" class="input-field cc-cost-select" onchange="window.uiController._onCostSelectChange(this)">
                        <option value="">-- Select --</option>
                        ${optionsHTML}
                    </select>
                    <input type="hidden" name="contract_cost_${index}_type" value="">
                </div>
                <div class="form-group" style="flex:1;margin:0;">
                    <label class="cc-cost-value-label">Value</label>
                    <input type="number" name="contract_cost_${index}_value" class="input-field" step="0.01" placeholder="0">
                </div>
                <button type="button" onclick="this.parentElement.remove()" style="padding:6px 10px;background:#ef4444;color:white;border:none;border-radius:4px;cursor:pointer;margin-bottom:2px;">✕</button>
            </div>`;
        } else {
            html = `
            <div class="cc-cost-row" style="display:flex;gap:8px;align-items:flex-end;margin-bottom:8px;">
                <div class="form-group" style="flex:1;margin:0;">
                    <label>Type</label>
                    <select name="contract_cost_${index}_type" class="input-field">
                        <option value="cost">Additional Cost</option>
                        <option value="tax">Tax</option>
                        <option value="discount">Discount</option>
                    </select>
                </div>
                <div class="form-group" style="flex:2;margin:0;">
                    <label>Name</label>
                    <input type="text" name="contract_cost_${index}_name" class="input-field" placeholder="e.g., GST">
                </div>
                <div class="form-group" style="flex:1;margin:0;">
                    <label>Value</label>
                    <input type="number" name="contract_cost_${index}_value" class="input-field" step="0.01">
                </div>
                <button type="button" onclick="this.parentElement.remove()" style="padding:6px 10px;background:#ef4444;color:white;border:none;border-radius:4px;cursor:pointer;margin-bottom:2px;">✕</button>
            </div>`;
        }
        container.insertAdjacentHTML('beforeend', html);
    }

    _addContractCustomSectionUpdate() {
        const container = document.getElementById('contract-custom-container-update');
        if (!container) return;
        const index = container.children.length;
        const config = this.templateManager?.getCurrentConfig?.() || {};
        const customSections = config.contractLevel?.customSections || [];
        const seen = new Set();
        const uniqueSections = customSections.filter(f => { if (seen.has(f.section_alternate_name)) return false; seen.add(f.section_alternate_name); return true; });

        // Check if all sections are already added
        if (uniqueSections.length > 0) {
            const usedSections = new Set();
            container.querySelectorAll('.cc-custom-section').forEach(sec => {
                const sel = sec.querySelector('select[name$="_section_name"], input[name$="_section_name"]');
                if (sel && sel.value) usedSections.add(sel.value);
            });
            const remaining = uniqueSections.filter(s => !usedSections.has(s.section_alternate_name));
            if (remaining.length === 0) return;
        }

        const sectionOptions = uniqueSections.map(f => `<option value="${f.section_alternate_name}">${f.section_name}</option>`).join('');
        const firstSectionAlt = uniqueSections[0]?.section_alternate_name || '';

        const sectionSelectHtml = sectionOptions
            ? `<select name="cc_custom_${index}_section_name" class="input-field cc-custom-section-select" data-level="contract" data-index="${index}" onchange="window.uiController._refreshCustomSectionDropdowns(this.closest('[id$=-container]'))">${sectionOptions}</select>`
            : `<input type="text" name="cc_custom_${index}_section_name" class="input-field" placeholder="Section name">`;

        const html = `
            <div class="cc-custom-section" style="margin-bottom:12px;padding:8px;border:1px solid #e5e7eb;border-radius:6px;">
                <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px;">
                    <div class="form-group" style="flex:1;margin:0;">${sectionSelectHtml}</div>
                    <button type="button" onclick="this.closest('.cc-custom-section').remove()" style="padding:6px 10px;background:#ef4444;color:white;border:none;border-radius:4px;cursor:pointer;">✕</button>
                </div>
                <div class="cc-custom-fields-container"></div>
                <button type="button" class="btn-add-row" style="font-size:11px;padding:3px 8px;" onclick="window.uiController._addCustomFieldRow(this.previousElementSibling, 'contract', '${firstSectionAlt}', ${index})">+ Add Field</button>
            </div>`;
        container.insertAdjacentHTML('beforeend', html);
        this._refreshCustomSectionDropdowns(container);
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

        // Group by section_alternate_name
        const sections = {};
        customFields.forEach(field => {
            const key = field.section_alternate_name || field.section_name || 'Custom Fields';
            if (!sections[key]) sections[key] = { displayName: field.section_name || key, fields: [] };
            sections[key].fields.push(field);
        });

        let html = `
            <div class="form-section-title">
                <span class="fst-icon">🔧</span>
                <h4>Custom Fields</h4>
                <span class="fst-badge" style="background: #94a3b8;">From Template</span>
            </div>`;

        Object.entries(sections).forEach(([sectionKey, { displayName, fields }]) => {
            html += `<div data-custom-section="${sectionKey}"><p class="cc-sub-title">${displayName}</p><div class="form-row">`;
            fields.forEach((field, index) => {
                const fieldAlternateName = field.alternate_name || field.name;
                const fieldType = field.field_type || 'SHORTTEXT';
                const constraints = field.constraints || {};
                let inputHTML = '';

                if (fieldType === 'BOOLEAN') {
                    inputHTML = `<label style="display:flex;align-items:center;gap:8px;cursor:pointer;"><input type="checkbox" value="true"><span>${fieldAlternateName}</span></label>`;
                } else if (fieldType === 'CHOICE') {
                    const isMulti = constraints.choice_type === 'MULTI_SELECT';
                    const choices = (constraints.choices || []).map(c => `<option value="${c}">${c}</option>`).join('');
                    if (isMulti) {
                        inputHTML = (constraints.choices || []).map(c =>
                            `<label style="display:flex;align-items:center;gap:6px;"><input type="checkbox" value="${c}"><span>${c}</span></label>`
                        ).join('');
                        inputHTML = `<div style="border:1px solid #d1d5db;border-radius:4px;padding:8px;">${inputHTML}</div>`;
                    } else {
                        inputHTML = `<select class="input-field"><option value="">Select...</option>${choices}</select>`;
                    }
                } else if (fieldType === 'DATE') {
                    inputHTML = `<input type="date" class="input-field">`;
                } else if (fieldType === 'FLOAT' || fieldType === 'PERCENTAGE') {
                    inputHTML = `<input type="number" class="input-field" step="0.01" min="${constraints.min_limit || 0}" max="${constraints.max_limit || ''}" placeholder="${fieldAlternateName}">`;
                } else {
                    inputHTML = `<input type="text" class="input-field" placeholder="${fieldAlternateName}" maxlength="${constraints.max_limit || 500}">`;
                }

                html += `
                    <div class="form-group" data-custom-field="${fieldAlternateName}" data-field-type="${fieldType}">
                        <label>${fieldAlternateName}${fieldType === 'PERCENTAGE' ? ' (%)' : ''}</label>
                        ${inputHTML}
                    </div>`;

                if ((index + 1) % 2 === 0 && index < fields.length - 1) {
                    html += '</div><div class="form-row">';
                }
            });
            html += '</div></div>';
        });

        container.innerHTML = html;
        console.log('✓ Populated', customFields.length, 'custom fields for item create');
    }

    _populateItemCreateAdditionalCosts(additionalCosts) {
        const container = document.getElementById('item-create-additional-costs-container');
        if (!container || !additionalCosts || additionalCosts.length === 0) return;

        // Build options from template cost fields
        const optionsHTML = additionalCosts.map(f => {
            const valueType = f.cost_info?.cost_type === 'PERCENTAGE' ? 'pct' : 'abs';
            const alloc = f.cost_info?.allocation_type ? ` (${f.cost_info.allocation_type.replace('_', ' ')})` : '';
            return `<option value="${f.alternate_name}" data-value-type="${valueType}">${f.name}${alloc}</option>`;
        }).join('');

        container.innerHTML = `
            <div class="form-section-title">
                <span class="fst-icon">💰</span>
                <h4>Additional Costs</h4>
                <span class="fst-badge" style="background: #94a3b8;">From Template</span>
            </div>
            <div id="item-additional-costs-rows"></div>
            <button type="button" class="btn-add-row" onclick="window.uiController._addItemAdditionalCostRow('${optionsHTML.replace(/'/g, "\\'")}')">+ Add Additional Cost</button>
        `;
    }

    _addItemAdditionalCostRow(optionsHTML) {
        const container = document.getElementById('item-additional-costs-rows');
        if (!container) return;
        const index = container.children.length;
        const html = `
            <div class="item-cost-row" style="display:flex;gap:8px;align-items:flex-end;margin-bottom:8px;">
                <div class="form-group" style="flex:2;margin:0;">
                    <label>Cost</label>
                    <select name="item_ac_${index}_name" class="input-field cc-cost-select" onchange="window.uiController._onItemCostSelectChange(this)">
                        <option value="">-- Select --</option>
                        ${optionsHTML}
                    </select>
                </div>
                <div class="form-group" style="flex:1;margin:0;">
                    <label class="item-ac-value-label">Value</label>
                    <input type="number" name="item_ac_${index}_value" class="input-field" step="0.01" placeholder="0">
                </div>
                <button type="button" onclick="this.parentElement.remove()" style="padding:6px 10px;background:#ef4444;color:white;border:none;border-radius:4px;cursor:pointer;margin-bottom:2px;">✕</button>
            </div>`;
        container.insertAdjacentHTML('beforeend', html);
    }

    _onItemCostSelectChange(selectEl) {
        const row = selectEl.closest('.item-cost-row');
        if (!row) return;
        const selected = selectEl.options[selectEl.selectedIndex];
        const valueType = selected?.dataset?.valueType || 'abs';
        const label = row.querySelector('.item-ac-value-label');
        if (label) label.textContent = valueType === 'pct' ? 'Value (%)' : 'Value';
    }

    /**
     * Switch between single and bulk mode for items create
     * @param {string} mode - 'single' or 'bulk'
     */
    _switchItemMode(mode) {
        const singleForm = document.getElementById('item-single-form');
        const bulkForm = document.getElementById('item-bulk-form');
        const toggleBtns = document.querySelectorAll('.mode-toggle-btn');

        // Update toggle buttons
        toggleBtns.forEach(btn => {
            if (btn.dataset.mode === mode) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        if (mode === 'single') {
            singleForm.style.display = 'block';
            bulkForm.style.display = 'none';
            this.currentMode = 'single';
        } else {
            singleForm.style.display = 'none';
            bulkForm.style.display = 'block';
            this.currentMode = 'bulk';

            // Load bulk form if not already loaded
            if (!bulkForm.innerHTML.trim()) {
                this._loadItemBulkForm();
            }
        }

        console.log('Switched to', mode, 'mode for items');
    }

    /**
     * Load the bulk items form dynamically
     */
    _loadItemBulkForm() {
        const bulkForm = document.getElementById('item-bulk-form');
        if (!bulkForm) return;

        bulkForm.innerHTML = `
            <!-- Bulk Items Form - Same as old bulk_create -->
            <div class="cc-config-box">
                <p class="cc-config-box-title">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                    Shared Configuration
                </p>
                <div class="cc-config-panel" style="border-left: none;">
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
                    <div style="margin-top:12px; padding-top:12px; border-top:1px solid #e2e8f0;">
                        <p style="margin:0 0 8px; font-size:11px; font-weight:600; color:#64748b; text-transform:uppercase; letter-spacing:0.5px;">Include Sections</p>
                        <div class="cc-toggles-grid">
                            <label class="cc-toggle-row">
                                <span class="cc-toggle-switch">
                                    <input type="checkbox" id="bi-global-buyer" checked onchange="window.uiController._updateBulkItemSections()">
                                    <span class="cc-toggle-slider"></span>
                                </span>
                                <span class="cc-toggle-text">Buyer Pricing</span>
                            </label>
                            <label class="cc-toggle-row">
                                <span class="cc-toggle-switch">
                                    <input type="checkbox" id="bi-global-seller" checked onchange="window.uiController._updateBulkItemSections()">
                                    <span class="cc-toggle-slider"></span>
                                </span>
                                <span class="cc-toggle-text">Seller Pricing</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <div class="form-section-title">
                <span class="fst-icon">📦</span>
                <h4>Items</h4>
            </div>

            <div id="bulk-items-container"></div>
        `;

        // Load templates first, then add first item
        this._loadItemTemplates().then(() => {
            this._addBulkItem();
        });

        console.log('✓ Loaded bulk items form');
    }

    /**
     * Switch between single and bulk mode for projects create
     * @param {string} mode - 'single' or 'bulk'
     */
    _switchProjectMode(mode) {
        const singleForm = document.getElementById('project-single-form');
        const bulkForm = document.getElementById('project-bulk-form');
        const toggleBtns = document.querySelectorAll('.mode-toggle-btn');

        // Update toggle buttons
        toggleBtns.forEach(btn => {
            if (btn.dataset.mode === mode) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        if (mode === 'single') {
            singleForm.style.display = 'block';
            bulkForm.style.display = 'none';
            this.currentMode = 'single';
        } else {
            singleForm.style.display = 'none';
            bulkForm.style.display = 'block';
            this.currentMode = 'bulk';

            // Load bulk form if not already loaded
            if (!bulkForm.innerHTML.trim()) {
                this._loadProjectBulkForm();
            }
        }

        console.log('Switched to', mode, 'mode for projects');
    }

    /**
     * Load the bulk projects form dynamically
     */
    _loadProjectBulkForm() {
        const bulkForm = document.getElementById('project-bulk-form');
        if (!bulkForm) return;

        bulkForm.innerHTML = `
            <!-- Bulk Projects Form -->
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

            <div class="form-section-title">
                <span class="fst-icon">📦</span>
                <h4>Projects</h4>
            </div>

            <div id="bulk-projects-container"></div>

            <button type="button" class="btn-add-row" onclick="window.uiController._addBulkProject()" style="margin-top: 12px;">
                ＋ Add Project
            </button>
        `;

        // Load templates and add first project
        this._loadProjectTemplates().then(() => {
            this._addBulkProject();
        });

        console.log('✓ Loaded bulk projects form');
    }

    /**
     * Load bulk contract create form with proper record cards
     */
    _loadContractBulkForm(targetForm) {
        const email = this.currentAccount?.user_email || 'globalfieldsETE@gmail.com';
        targetForm.innerHTML = `
            ${this._bulkModeToggleHTML()}
            <div id="bulk-payload-mode">
                <div class="form-section-title no-margin-top">
                    <span class="fst-icon">📋</span>
                    <h4>Bulk Contract Configuration</h4>
                    <span class="fst-badge">Required</span>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Buyer Contact Email *</label>
                        <input type="email" name="bc_buyer_contact" class="input-field" required value="${email}">
                    </div>
                    <div class="form-group">
                        <label>Entity Name *</label>
                        <input type="text" name="bc_entity_name" class="input-field" required value="FactWise">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Buyer Identifications</label>
                        <input type="text" name="bc_buyer_identifications" class="input-field" value="GST" placeholder="GST, PAN, etc.">
                    </div>
                    <div class="form-group">
                        <label>Buyer Address</label>
                        <input type="text" name="bc_buyer_address" class="input-field" placeholder="Main address">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Contract Template</label>
                        <select id="bc_template_select" name="bc_template_name" class="input-field">
                            <option value="">Loading templates...</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Number of Contracts *</label>
                        <input type="number" name="bc_contract_count" class="input-field" required min="1" max="100" value="2">
                    </div>
                    <div class="form-group" style="align-self:flex-end;">
                        <button type="button" onclick="window.uiController._generateBulkContractCards()"
                            style="width:100%;padding:9px 14px;background:#6366f1;color:white;border:none;border-radius:5px;cursor:pointer;font-weight:500;font-size:13px;">
                            Generate Contracts
                        </button>
                    </div>
                </div>

                <div class="form-section-title">
                    <span class="fst-icon">📦</span>
                    <h4>Contracts</h4>
                </div>
                <div id="bulk-contracts-container"></div>
                <button type="button" class="btn-add-row" onclick="window.uiController._addBulkContractCard()" style="margin-top:12px;">+ Add Contract</button>
            </div><!-- /bulk-payload-mode -->
            <div id="bulk-script-mode" style="display:none;">
                ${this._bulkScriptModeHTML('contracts')}
            </div>
        `;

        this._addBulkContractCard();
        this._populateBulkTemplateSelect('bc_template_select', 'CLM');
        console.log('Loaded bulk contracts form');
    }

    /**
     * Populate a bulk form's template dropdown from already-loaded templates or fetch them
     * @param {string} selectId - DOM id of the <select> element
     * @param {string} templateType - 'CLM', 'VENDOR', 'PO_GROUP'
     */
    async _populateBulkTemplateSelect(selectId, templateType) {
        const select = document.getElementById(selectId);
        if (!select) return;

        // Check if templates are already loaded in templateManager
        const typeMap = {
            'CLM': 'templates',
            'VENDOR': 'vendorTemplates',
            'PO_GROUP': 'poTemplates',
        };
        const storeKey = typeMap[templateType] || 'templates';
        let templates = this.templateManager?.[storeKey];

        // If not loaded yet, fetch them
        if (!templates || templates.length === 0) {
            try {
                let token = this.factwiseIntegration?.getToken() || this.tokenManager.getToken();
                if (!token) {
                    select.innerHTML = '<option value="">No token available</option>';
                    return;
                }
                let entityId = '20d11e41-5ee0-40f1-9f01-a619d20e74e3';
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    entityId = payload.entity_id || payload['custom:entityId'] || entityId;
                } catch (e) {}

                const baseUrl = this.environmentManager.getFactwiseBaseUrl();
                const url = `${baseUrl}module_templates/?entity_id=${entityId}&template_type=${templateType}`;
                const response = await fetch(url, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
                });

                if (response.ok) {
                    const data = await response.json();
                    const responseData = Array.isArray(data) ? (data[0] || {}) : data;
                    templates = responseData.templates || [];
                    if (this.templateManager && templates.length > 0) {
                        this.templateManager[storeKey] = templates;
                    }
                }
            } catch (err) {
                console.error(`Error fetching ${templateType} templates:`, err);
            }
        }

        if (templates && templates.length > 0) {
            select.innerHTML = templates.map(t => {
                const name = t.name || t.template_name || 'Unnamed Template';
                const id = t.template_id || name;
                return `<option value="${name}">${name}</option>`;
            }).join('');
            select.selectedIndex = 0;
        } else {
            select.innerHTML = '<option value="Default Template">Default Template</option>';
        }
    }

    _generateBulkContractCards() {
        const count = parseInt(document.querySelector('[name="bc_contract_count"]')?.value) || 2;
        const container = document.getElementById('bulk-contracts-container');
        if (!container) return;
        container.innerHTML = '';
        for (let i = 0; i < count; i++) this._addBulkContractCard();
    }

    _addBulkContractCard() {
        const container = document.getElementById('bulk-contracts-container');
        if (!container) return;
        const n = container.children.length;
        const idx = n;
        const today = new Date().toISOString().split('T')[0];
        const nextYear = new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0];
        const email = this.currentAccount?.user_email || 'globalfieldsETE@gmail.com';

        const card = document.createElement('div');
        card.className = 'cc-item-card bulk-contract-card';
        card.dataset.contractIndex = idx;
        card.innerHTML = `
            <div class="cc-item-card-header">
                <div class="cc-item-card-badge">${n + 1}</div>
                <div class="cc-item-card-title">Contract #${n + 1}</div>
                ${n > 0 ? `<button type="button" onclick="this.closest('.cc-item-card').remove()" style="margin-left:auto;background:#ef4444;color:white;border:none;border-radius:4px;padding:6px 12px;cursor:pointer;font-size:12px;">✕ Remove</button>` : ''}
            </div>
            <div class="cc-item-card-body">

                <p class="cc-sub-title">📌 Basic Information</p>
                <div class="form-row">
                    <div class="form-group">
                        <label>Contract Name *</label>
                        <input type="text" name="bc_${idx}_contract_name" class="input-field" value="Test Contract ${n + 1}">
                    </div>
                    <div class="form-group">
                        <label>Factwise Contract ID</label>
                        <input type="text" name="bc_${idx}_factwise_contract_id" class="input-field" value="FW-CON-${String(n + 1).padStart(3, '0')}">
                    </div>
                    <div class="form-group">
                        <label>ERP Contract ID</label>
                        <input type="text" name="bc_${idx}_ERP_contract_id" class="input-field" value="ERP-CON-${String(n + 1).padStart(3, '0')}">
                    </div>
                    <div class="form-group">
                        <label>Status</label>
                        <select name="bc_${idx}_status" class="input-field">
                            <option value="DRAFT" selected>DRAFT</option>
                            <option value="SUBMITTED">SUBMITTED</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Start Date *</label>
                        <input type="date" name="bc_${idx}_start_date" class="input-field" value="${today}">
                    </div>
                    <div class="form-group">
                        <label>End Date *</label>
                        <input type="date" name="bc_${idx}_end_date" class="input-field" value="${nextYear}">
                    </div>
                    <div class="form-group">
                        <label>Project</label>
                        <input type="text" name="bc_${idx}_project" class="input-field" placeholder="Project name">
                    </div>
                </div>

                <p class="cc-sub-title">🏢 Vendor Details</p>
                <div class="form-row">
                    <div class="form-group">
                        <label>Factwise Vendor Code</label>
                        <input type="text" name="bc_${idx}_factwise_vendor_code" class="input-field" placeholder="e.g., FacVENDOR001">
                    </div>
                    <div class="form-group">
                        <label>ERP Vendor Code</label>
                        <input type="text" name="bc_${idx}_ERP_vendor_code" class="input-field" placeholder="e.g., ERPV001">
                    </div>
                    <div class="form-group">
                        <label>Vendor Contact Email</label>
                        <input type="email" name="bc_${idx}_vendor_contact" class="input-field" placeholder="vendor@example.com">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Vendor ID Name</label>
                        <input type="text" name="bc_${idx}_vendor_id_name" class="input-field" placeholder="GST">
                    </div>
                    <div class="form-group">
                        <label>Vendor ID Value</label>
                        <input type="text" name="bc_${idx}_vendor_id_value" class="input-field" placeholder="27AABCU9603R1ZX">
                    </div>
                    <div class="form-group">
                        <label>Vendor Address ID</label>
                        <input type="text" name="bc_${idx}_vendor_address_id" class="input-field" placeholder="Address UUID">
                    </div>
                </div>

                <p class="cc-sub-title">💳 Payment & Delivery</p>
                <div class="form-row">
                    <div class="form-group">
                        <label>Prepayment %</label>
                        <input type="number" name="bc_${idx}_prepayment_percentage" class="input-field" value="0" step="0.01">
                    </div>
                    <div class="form-group">
                        <label>Payment Type</label>
                        <select name="bc_${idx}_payment_type" class="input-field">
                            <option value="PER_INVOICE_ITEM" selected>PER_INVOICE_ITEM</option>
                            <option value="PER_DELIVERY">PER_DELIVERY</option>
                            <option value="ADVANCE">ADVANCE</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Incoterm</label>
                        <select name="bc_${idx}_incoterm" class="input-field">
                            <option value="NA" selected>NA</option>
                            <option value="CFR">CFR</option>
                            <option value="CIF">CIF</option>
                            <option value="CPT">CPT</option>
                            <option value="DAP">DAP</option>
                            <option value="DDP">DDP</option>
                            <option value="EXW">EXW</option>
                            <option value="FAS">FAS</option>
                            <option value="FCA">FCA</option>
                            <option value="FOB">FOB</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Payment Term</label>
                        <input type="number" name="bc_${idx}_payment_term" class="input-field" value="1">
                    </div>
                    <div class="form-group">
                        <label>Payment Period</label>
                        <select name="bc_${idx}_payment_period" class="input-field">
                            <option value="MONTHS" selected>MONTHS</option>
                            <option value="DAYS">DAYS</option>
                            <option value="WEEKS">WEEKS</option>
                            <option value="YEARS">YEARS</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Applied From</label>
                        <select name="bc_${idx}_payment_applied_from" class="input-field">
                            <option value="INVOICE_DATE" selected>INVOICE_DATE</option>
                            <option value="DELIVERY_DATE">DELIVERY_DATE</option>
                            <option value="ORDER_DATE">ORDER_DATE</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Lead Time</label>
                        <input type="number" name="bc_${idx}_lead_time" class="input-field" placeholder="e.g., 7">
                    </div>
                    <div class="form-group">
                        <label>Lead Time Period</label>
                        <select name="bc_${idx}_lead_time_period" class="input-field">
                            <option value="DAYS" selected>DAYS</option>
                            <option value="WEEKS">WEEKS</option>
                            <option value="MONTHS">MONTHS</option>
                        </select>
                    </div>
                </div>

                <p class="cc-sub-title">📦 Contract Items</p>
                <div id="bc-${idx}-items-container"></div>
                <button type="button" class="btn-add-row" style="font-size:12px;" onclick="window.uiController._addBulkContractItemCard(${idx})">+ Add Item</button>
            </div>
        `;
        container.appendChild(card);
        this._addBulkContractItemCard(idx);
    }

    _addBulkContractItemCard(contractIdx) {
        const container = document.getElementById(`bc-${contractIdx}-items-container`);
        if (!container) return;
        const itemIdx = container.children.length;

        const div = document.createElement('div');
        div.className = 'cc-tier-card';
        div.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                <p style="margin:0;font-weight:600;font-size:12px;color:#475569;">Item ${itemIdx + 1}</p>
                ${itemIdx > 0 ? `<button type="button" onclick="this.closest('.cc-tier-card').remove()" style="background:#ef4444;color:white;border:none;border-radius:4px;padding:3px 8px;cursor:pointer;font-size:11px;">✕</button>` : ''}
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label style="font-size:12px;">Factwise Item Code</label>
                    <input type="text" name="bc_${contractIdx}_item_${itemIdx}_factwise_code" class="input-field" value="BKT-${String(itemIdx + 1).padStart(3, '0')}" style="font-size:12px;">
                </div>
                <div class="form-group">
                    <label style="font-size:12px;">ERP Item Code</label>
                    <input type="text" name="bc_${contractIdx}_item_${itemIdx}_erp_code" class="input-field" placeholder="ERP item code" style="font-size:12px;">
                </div>
                <div class="form-group">
                    <label style="font-size:12px;">Quantity</label>
                    <input type="number" name="bc_${contractIdx}_item_${itemIdx}_quantity" class="input-field" value="1000" step="0.01" style="font-size:12px;">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label style="font-size:12px;">Currency ID</label>
                    <input type="text" name="bc_${contractIdx}_item_${itemIdx}_currency_id" class="input-field" value="a8c3e3fd-b05f-4d09-bd2f-9fedd07d0ec3" style="font-size:12px;">
                </div>
                <div class="form-group">
                    <label style="font-size:12px;">Unit ID</label>
                    <input type="text" name="bc_${contractIdx}_item_${itemIdx}_unit_id" class="input-field" value="f16d124e-db59-48fe-a2b8-19f625745cbf" style="font-size:12px;">
                </div>
                <div class="form-group">
                    <label style="font-size:12px;">Prepayment %</label>
                    <input type="number" name="bc_${contractIdx}_item_${itemIdx}_prepayment" class="input-field" value="0" step="0.01" style="font-size:12px;">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label style="font-size:12px;">Payment Type</label>
                    <select name="bc_${contractIdx}_item_${itemIdx}_payment_type" class="input-field" style="font-size:12px;">
                        <option value="PER_INVOICE_ITEM" selected>PER_INVOICE_ITEM</option>
                        <option value="PER_DELIVERY">PER_DELIVERY</option>
                        <option value="ADVANCE">ADVANCE</option>
                    </select>
                </div>
                <div class="form-group">
                    <label style="font-size:12px;">Incoterm</label>
                    <select name="bc_${contractIdx}_item_${itemIdx}_incoterm" class="input-field" style="font-size:12px;">
                        <option value="NA" selected>NA</option>
                        <option value="CFR">CFR</option>
                        <option value="CIF">CIF</option>
                        <option value="DAP">DAP</option>
                        <option value="DDP">DDP</option>
                        <option value="EXW">EXW</option>
                        <option value="FOB">FOB</option>
                    </select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label style="font-size:12px;">Payment Term</label>
                    <input type="number" name="bc_${contractIdx}_item_${itemIdx}_payment_term" class="input-field" value="1" style="font-size:12px;">
                </div>
                <div class="form-group">
                    <label style="font-size:12px;">Payment Period</label>
                    <select name="bc_${contractIdx}_item_${itemIdx}_payment_period" class="input-field" style="font-size:12px;">
                        <option value="MONTHS" selected>MONTHS</option>
                        <option value="DAYS">DAYS</option>
                        <option value="WEEKS">WEEKS</option>
                    </select>
                </div>
                <div class="form-group">
                    <label style="font-size:12px;">Applied From</label>
                    <select name="bc_${contractIdx}_item_${itemIdx}_payment_applied_from" class="input-field" style="font-size:12px;">
                        <option value="INVOICE_DATE" selected>INVOICE_DATE</option>
                        <option value="DELIVERY_DATE">DELIVERY_DATE</option>
                        <option value="ORDER_DATE">ORDER_DATE</option>
                    </select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label style="font-size:12px;">Lead Time</label>
                    <input type="number" name="bc_${contractIdx}_item_${itemIdx}_lead_time" class="input-field" placeholder="e.g., 7" style="font-size:12px;">
                </div>
                <div class="form-group">
                    <label style="font-size:12px;">Lead Time Period</label>
                    <select name="bc_${contractIdx}_item_${itemIdx}_lead_time_period" class="input-field" style="font-size:12px;">
                        <option value="DAYS" selected>DAYS</option>
                        <option value="WEEKS">WEEKS</option>
                        <option value="MONTHS">MONTHS</option>
                    </select>
                </div>
            </div>
            <div style="margin-top:6px;">
                <p style="font-size:11px;font-weight:600;color:#64748b;margin:4px 0;">Pricing Tiers</p>
                <div id="bc-${contractIdx}-item-${itemIdx}-tiers"></div>
                <button type="button" class="btn-add-row" style="font-size:11px;padding:3px 8px;" onclick="window.uiController._addBulkContractTier(${contractIdx}, ${itemIdx})">+ Add Tier</button>
            </div>
        `;
        container.appendChild(div);
        this._addBulkContractTier(contractIdx, itemIdx);
    }

    _addBulkContractTier(contractIdx, itemIdx) {
        const container = document.getElementById(`bc-${contractIdx}-item-${itemIdx}-tiers`);
        if (!container) return;
        const tierIdx = container.children.length;
        const defaultMin = tierIdx * 100 + (tierIdx > 0 ? 1 : 0);
        const defaultMax = (tierIdx + 1) * 100;

        const div = document.createElement('div');
        div.className = 'form-row';
        div.style.cssText = 'background:#f8fafc;padding:6px;border-radius:4px;margin-bottom:4px;';
        div.innerHTML = `
            <div class="form-group" style="margin:0;">
                <label style="font-size:11px;">Min</label>
                <input type="number" name="bc_${contractIdx}_item_${itemIdx}_tier_${tierIdx}_min" class="input-field" value="${defaultMin}" step="0.01" style="font-size:12px;">
            </div>
            <div class="form-group" style="margin:0;">
                <label style="font-size:11px;">Max</label>
                <input type="number" name="bc_${contractIdx}_item_${itemIdx}_tier_${tierIdx}_max" class="input-field" value="${defaultMax}" step="0.01" style="font-size:12px;">
            </div>
            <div class="form-group" style="margin:0;">
                <label style="font-size:11px;">Rate</label>
                <input type="number" name="bc_${contractIdx}_item_${itemIdx}_tier_${tierIdx}_rate" class="input-field" value="10" step="0.01" style="font-size:12px;">
            </div>
            ${tierIdx > 0 ? `<button type="button" onclick="this.parentElement.remove()" style="padding:3px 6px;background:#ef4444;color:white;border:none;border-radius:4px;cursor:pointer;font-size:11px;align-self:flex-end;margin-bottom:2px;">✕</button>` : '<div style="width:28px;"></div>'}
        `;
        container.appendChild(div);
    }

    _addBulkContractCostRow(contractIdx) {
        // kept for backwards compat but no longer called from card HTML
        const container = document.getElementById(`bc-${contractIdx}-costs-container`);
        if (!container) return;
        const idx = container.children.length;
        const html = `
            <div class="form-row" style="margin-bottom:6px;">
                <div class="form-group" style="flex:1;margin:0;">
                    <label style="font-size:11px;">Type</label>
                    <select name="bc_${contractIdx}_cost_${idx}_type" class="input-field" style="font-size:12px;">
                        <option value="cost">Cost</option>
                        <option value="tax">Tax</option>
                        <option value="discount">Discount</option>
                    </select>
                </div>
                <div class="form-group" style="flex:2;margin:0;">
                    <label style="font-size:11px;">Name</label>
                    <input type="text" name="bc_${contractIdx}_cost_${idx}_name" class="input-field" placeholder="e.g., GST" style="font-size:12px;">
                </div>
                <div class="form-group" style="flex:1;margin:0;">
                    <label style="font-size:11px;">Value</label>
                    <input type="number" name="bc_${contractIdx}_cost_${idx}_value" class="input-field" step="0.01" value="0" style="font-size:12px;">
                </div>
                <button type="button" onclick="this.parentElement.remove()" style="padding:4px 8px;background:#ef4444;color:white;border:none;border-radius:4px;cursor:pointer;font-size:11px;align-self:flex-end;margin-bottom:2px;">✕</button>
            </div>`;
        container.insertAdjacentHTML('beforeend', html);
    }

    /**
     * Load bulk vendor create form with proper record cards
     */
    _loadVendorBulkForm(targetForm) {
        const email = this.currentAccount?.user_email || 'globalfieldsETE@gmail.com';
        targetForm.innerHTML = `
            ${this._bulkModeToggleHTML()}
            <div id="bulk-payload-mode">
                <div class="form-section-title no-margin-top">
                    <span class="fst-icon">📋</span>
                    <h4>Bulk Vendor Configuration</h4>
                    <span class="fst-badge">Required</span>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Created By User Email *</label>
                        <input type="email" name="bv_created_by" class="input-field" required value="${email}">
                    </div>
                    <div class="form-group">
                        <label>Entity Name *</label>
                        <input type="text" name="bv_entity_name" class="input-field" required value="FactWise">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Vendor Template</label>
                        <select id="bv_template_select" name="bv_template_name" class="input-field">
                            <option value="">Loading templates...</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Number of Vendors *</label>
                        <input type="number" name="bv_vendor_count" class="input-field" required min="1" max="100" value="2">
                    </div>
                    <div class="form-group" style="align-self:flex-end;">
                        <button type="button" onclick="window.uiController._generateBulkVendorCards()"
                            style="width:100%;padding:9px 14px;background:#6366f1;color:white;border:none;border-radius:5px;cursor:pointer;font-weight:500;font-size:13px;">
                            Generate Vendors
                        </button>
                    </div>
                </div>

                <div class="form-section-title">
                    <span class="fst-icon">📦</span>
                    <h4>Vendors</h4>
                </div>
                <div id="bulk-vendors-container"></div>
                <button type="button" class="btn-add-row" onclick="window.uiController._addBulkVendorCard()" style="margin-top:12px;">+ Add Vendor</button>
            </div><!-- /bulk-payload-mode -->
            <div id="bulk-script-mode" style="display:none;">
                ${this._bulkScriptModeHTML('vendors')}
            </div>
        `;

        this._addBulkVendorCard();
        this._populateBulkTemplateSelect('bv_template_select', 'VENDOR');
        console.log('Loaded bulk vendors form');
    }

    _generateBulkVendorCards() {
        const count = parseInt(document.querySelector('[name="bv_vendor_count"]')?.value) || 2;
        const container = document.getElementById('bulk-vendors-container');
        if (!container) return;
        container.innerHTML = '';
        for (let i = 0; i < count; i++) this._addBulkVendorCard();
    }

    _addBulkVendorCard() {
        const container = document.getElementById('bulk-vendors-container');
        if (!container) return;
        const n = container.children.length;
        const idx = n;

        const card = document.createElement('div');
        card.className = 'cc-item-card bulk-vendor-card';
        card.dataset.vendorIndex = idx;
        card.innerHTML = `
            <div class="cc-item-card-header">
                <div class="cc-item-card-badge">${n + 1}</div>
                <div class="cc-item-card-title">Vendor #${n + 1}</div>
                ${n > 0 ? `<button type="button" onclick="this.closest('.cc-item-card').remove()" style="margin-left:auto;background:#ef4444;color:white;border:none;border-radius:4px;padding:6px 12px;cursor:pointer;font-size:12px;">✕ Remove</button>` : ''}
            </div>
            <div class="cc-item-card-body">
                <p class="cc-sub-title">📌 Vendor Information</p>
                <div class="form-row">
                    <div class="form-group">
                        <label>Vendor Name *</label>
                        <input type="text" name="bv_${idx}_vendor_name" class="input-field" value="Test Vendor ${n + 1}">
                    </div>
                    <div class="form-group">
                        <label>ERP Vendor Code *</label>
                        <input type="text" name="bv_${idx}_ERP_vendor_code" class="input-field" value="V-${String(n + 1).padStart(3, '0')}">
                    </div>
                </div>
                <div class="form-group">
                    <label>Notes</label>
                    <textarea name="bv_${idx}_notes" class="form-textarea" rows="2" placeholder="Optional notes" style="font-size:12px;"></textarea>
                </div>

                <p class="cc-sub-title">👤 Primary Contact</p>
                <div class="form-row">
                    <div class="form-group">
                        <label>Full Name *</label>
                        <input type="text" name="bv_${idx}_contact_name" class="input-field" value="Contact ${n + 1}">
                    </div>
                    <div class="form-group">
                        <label>Email *</label>
                        <input type="email" name="bv_${idx}_contact_email" class="input-field" value="vendor${n + 1}@test.com">
                    </div>
                </div>

                <p class="cc-sub-title">🏢 Entity</p>
                <div class="form-group">
                    <label>Entity Names (comma-separated) *</label>
                    <input type="text" name="bv_${idx}_entity_names" class="input-field" value="FactWise">
                </div>
            </div>
        `;
        container.appendChild(card);
    }

    /**
     * Load bulk PO create form with proper record cards
     */
    _loadPOBulkForm(targetForm) {
        const email = this.currentAccount?.user_email || 'globalfieldsETE@gmail.com';
        targetForm.innerHTML = `
            ${this._bulkModeToggleHTML()}
            <div id="bulk-payload-mode">
                <div class="form-section-title no-margin-top">
                    <span class="fst-icon">📋</span>
                    <h4>Bulk PO Configuration</h4>
                    <span class="fst-badge">Required</span>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Created By Email *</label>
                        <input type="email" name="bpo_created_by" class="input-field" required value="${email}">
                    </div>
                    <div class="form-group">
                        <label>Entity Name *</label>
                        <input type="text" name="bpo_entity_name" class="input-field" required value="FactWise">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>PO Template</label>
                        <select id="bpo_template_select" name="bpo_template_name" class="input-field">
                            <option value="">Loading templates...</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Number of POs *</label>
                        <input type="number" name="bpo_po_count" class="input-field" required min="1" max="100" value="2">
                    </div>
                    <div class="form-group" style="align-self:flex-end;">
                        <button type="button" onclick="window.uiController._generateBulkPOCards()"
                            style="width:100%;padding:9px 14px;background:#6366f1;color:white;border:none;border-radius:5px;cursor:pointer;font-weight:500;font-size:13px;">
                            Generate POs
                        </button>
                    </div>
                </div>

                <div class="form-section-title">
                    <span class="fst-icon">📦</span>
                    <h4>Purchase Orders</h4>
                </div>
                <div id="bulk-pos-container"></div>
                <button type="button" class="btn-add-row" onclick="window.uiController._addBulkPOCard()" style="margin-top:12px;">+ Add PO</button>
            </div><!-- /bulk-payload-mode -->
            <div id="bulk-script-mode" style="display:none;">
                ${this._bulkScriptModeHTML('purchase_order')}
            </div>
        `;

        this._addBulkPOCard();
        this._populateBulkTemplateSelect('bpo_template_select', 'PO_GROUP');
        console.log('Loaded bulk POs form');
    }

    _generateBulkPOCards() {
        const count = parseInt(document.querySelector('[name="bpo_po_count"]')?.value) || 2;
        const container = document.getElementById('bulk-pos-container');
        if (!container) return;
        container.innerHTML = '';
        for (let i = 0; i < count; i++) this._addBulkPOCard();
    }

    _addBulkPOCard() {
        const container = document.getElementById('bulk-pos-container');
        if (!container) return;
        const n = container.children.length;
        const idx = n;

        const card = document.createElement('div');
        card.className = 'cc-item-card bulk-po-card';
        card.dataset.poIndex = idx;
        card.innerHTML = `
            <div class="cc-item-card-header">
                <div class="cc-item-card-badge">${n + 1}</div>
                <div class="cc-item-card-title">PO #${n + 1}</div>
                ${n > 0 ? `<button type="button" onclick="this.closest('.cc-item-card').remove()" style="margin-left:auto;background:#ef4444;color:white;border:none;border-radius:4px;padding:6px 12px;cursor:pointer;font-size:12px;">✕ Remove</button>` : ''}
            </div>
            <div class="cc-item-card-body">
                <p class="cc-sub-title">📌 PO Details</p>
                <div class="form-row">
                    <div class="form-group">
                        <label>ERP PO ID *</label>
                        <input type="text" name="bpo_${idx}_ERP_po_id" class="input-field" value="PO-${String(n + 1).padStart(3, '0')}">
                    </div>
                    <div class="form-group">
                        <label>Status</label>
                        <select name="bpo_${idx}_status" class="input-field">
                            <option value="ISSUED" selected>ISSUED</option>
                            <option value="ONGOING">ONGOING</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Currency Code ID</label>
                        <input type="text" name="bpo_${idx}_currency_code_id" class="input-field" value="a8c3e3fd-b05f-4d09-bd2f-9fedd07d0ec3">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>ERP Vendor Code</label>
                        <input type="text" name="bpo_${idx}_ERP_vendor_code" class="input-field" value="">
                    </div>
                    <div class="form-group">
                        <label>Billing Address ID</label>
                        <input type="text" name="bpo_${idx}_billing_address" class="input-field" value="">
                    </div>
                    <div class="form-group">
                        <label>Shipping Address ID</label>
                        <input type="text" name="bpo_${idx}_shipping_address" class="input-field" value="">
                    </div>
                </div>

                <p class="cc-sub-title">📦 PO Items</p>
                <div id="bpo-${idx}-items-container"></div>
                <button type="button" class="btn-add-row" style="font-size:12px;" onclick="window.uiController._addBulkPOItemCard(${idx})">+ Add Item</button>
            </div>
        `;
        container.appendChild(card);
        this._addBulkPOItemCard(idx);
    }

    _addBulkPOItemCard(poIdx) {
        const container = document.getElementById(`bpo-${poIdx}-items-container`);
        if (!container) return;
        const itemIdx = container.children.length;

        const div = document.createElement('div');
        div.className = 'cc-tier-card';
        div.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                <p style="margin:0;font-weight:600;font-size:12px;color:#475569;">Item ${itemIdx + 1}</p>
                ${itemIdx > 0 ? `<button type="button" onclick="this.closest('.cc-tier-card').remove()" style="background:#ef4444;color:white;border:none;border-radius:4px;padding:3px 8px;cursor:pointer;font-size:11px;">✕</button>` : ''}
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label style="font-size:12px;">ERP Item Code</label>
                    <input type="text" name="bpo_${poIdx}_item_${itemIdx}_erp_code" class="input-field" value="" style="font-size:12px;">
                </div>
                <div class="form-group">
                    <label style="font-size:12px;">Factwise Item Code</label>
                    <input type="text" name="bpo_${poIdx}_item_${itemIdx}_factwise_code" class="input-field" value="BKT-${String(itemIdx + 1).padStart(3, '0')}" style="font-size:12px;">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label style="font-size:12px;">Price *</label>
                    <input type="number" name="bpo_${poIdx}_item_${itemIdx}_price" class="input-field" value="100" step="0.01" style="font-size:12px;">
                </div>
                <div class="form-group">
                    <label style="font-size:12px;">Quantity *</label>
                    <input type="number" name="bpo_${poIdx}_item_${itemIdx}_quantity" class="input-field" value="100" step="0.01" style="font-size:12px;">
                </div>
                <div class="form-group">
                    <label style="font-size:12px;">Unit ID</label>
                    <input type="text" name="bpo_${poIdx}_item_${itemIdx}_unit_id" class="input-field" value="f16d124e-db59-48fe-a2b8-19f625745cbf" style="font-size:12px;">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label style="font-size:12px;">Incoterm</label>
                    <select name="bpo_${poIdx}_item_${itemIdx}_incoterm" class="input-field" style="font-size:12px;">
                        <option value="DAP" selected>DAP</option>
                        <option value="FOB">FOB</option>
                        <option value="CIF">CIF</option>
                        <option value="EXW">EXW</option>
                    </select>
                </div>
                <div class="form-group">
                    <label style="font-size:12px;">Delivery Qty</label>
                    <input type="number" name="bpo_${poIdx}_item_${itemIdx}_delivery_qty" class="input-field" value="100" step="0.01" style="font-size:12px;">
                </div>
            </div>
        `;
        container.appendChild(div);
    }

    /**
     * Universal mode switcher for ALL operations
     * @param {string} mode - 'single' or 'bulk'
     */
    _switchMode(mode) {
        // Try generic IDs first
        let singleForm = document.getElementById('operation-single-form');
        let bulkForm = document.getElementById('operation-bulk-form');

        // Fallback to module-specific IDs for backward compatibility
        if (!singleForm || !bulkForm) {
            const module = this.currentModule;
            const specificIds = {
                'contract': ['contract-single-form', 'contract-bulk-form'],
                'purchase_order': ['po-single-form', 'po-bulk-form'],
                'items': ['item-single-form', 'item-bulk-form'],
                'vendors': ['vendor-single-form', 'vendor-bulk-form'],
                'projects': ['project-single-form', 'project-bulk-form']
            };

            if (specificIds[module]) {
                singleForm = document.getElementById(specificIds[module][0]);
                bulkForm = document.getElementById(specificIds[module][1]);
            }
        }

        if (!singleForm || !bulkForm) {
            console.error('Form containers not found for', this.currentModule, this.currentOperation);
            return;
        }

        const toggleBtns = document.querySelectorAll('.mode-toggle-btn');

        // Update toggle buttons
        toggleBtns.forEach(btn => {
            if (btn.dataset.mode === mode) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        if (mode === 'single') {
            singleForm.style.display = 'block';
            bulkForm.style.display = 'none';
            this.currentMode = 'single';
            // Hide script buttons in single mode
            if (this.elements.btnCopyScript) this.elements.btnCopyScript.classList.add('hidden');
            if (this.elements.btnExecuteScript) this.elements.btnExecuteScript.classList.add('hidden');
        } else {
            singleForm.style.display = 'none';
            bulkForm.style.display = 'block';
            this.currentMode = 'bulk';
            // Script buttons only show when in bulk script mode (not payload mode)
            // _switchBulkMode will control their visibility when user switches sub-mode

            // Load bulk form if not already loaded
            if (!bulkForm.innerHTML.trim()) {
                this._loadBulkForm();
            }
        }

        console.log(`Switched to ${mode} mode for ${this.currentModule}/${this.currentOperation}`);
    }

    /**
     * Load bulk form dynamically based on current operation
     * @private
     */
    _loadBulkForm() {
        const bulkForm = document.getElementById('operation-bulk-form');
        const module = this.currentModule;
        const operation = this.currentOperation;

        // Check for module-specific bulk form containers
        const specificBulkForms = {
            'items': 'item-bulk-form',
            'projects': 'project-bulk-form',
            'vendors': 'vendor-bulk-form',
            'purchase_order': 'po-bulk-form',
            'contract': 'contract-bulk-form'
        };

        const specificBulkForm = specificBulkForms[module] ? document.getElementById(specificBulkForms[module]) : null;
        const targetForm = specificBulkForm || bulkForm;

        if (!targetForm) {
            console.error('No bulk form container found');
            return;
        }

        // Use specific loaders for create operations (they have detailed forms)
        if (module === 'items' && operation === 'create') {
            this._loadItemBulkForm();
            return;
        } else if (module === 'projects' && operation === 'create') {
            this._loadProjectBulkForm();
            return;
        } else if (module === 'contract' && operation === 'create') {
            this._loadContractBulkForm(targetForm);
            return;
        } else if (module === 'vendors' && operation === 'create') {
            this._loadVendorBulkForm(targetForm);
            return;
        } else if (module === 'purchase_order' && operation === 'create') {
            this._loadPOBulkForm(targetForm);
            return;
        }

        // Determine if this is a create operation (gets script mode toggle)
        const isCreateOp = operation === 'create';

        // Determine script type key for _bulkScriptModeHTML
        const scriptTypeMap = { 'contract': 'contracts', 'vendors': 'vendors', 'purchase_order': 'purchase_order' };
        const scriptType = scriptTypeMap[module] || module;

        // For all other operations, generate generic bulk form
        targetForm.innerHTML = `
            ${isCreateOp ? this._bulkModeToggleHTML() : ''}
            ${isCreateOp ? '<div id="bulk-payload-mode">' : ''}
            <div class="form-section-title no-margin-top">
                <span class="fst-icon">📦</span>
                <h4>Bulk ${operation.charAt(0).toUpperCase() + operation.slice(1)} Configuration</h4>
                <span class="fst-badge">Required</span>
            </div>

            <div class="form-group">
                <label>${operation.includes('create') ? 'Created' : 'Modified'} By User Email *</label>
                <input type="email" name="bulk_user_email" class="input-field" required
                    value="${this.currentAccount?.user_email || 'globalfieldsETE@gmail.com'}">
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label>Number of Records *</label>
                    <input type="number" name="bulk_count" class="input-field" required min="1" max="100" value="2">
                </div>
                <div class="form-group" style="align-self: flex-end;">
                    <button type="button" onclick="window.uiController._generateBulkRecords()"
                        style="width:100%; padding:9px 14px; background:#6366f1; color:white; border:none; border-radius:5px; cursor:pointer; font-weight:500; font-size:13px;">
                        ⚡ Generate Records
                    </button>
                </div>
            </div>

            <div class="form-section-title">
                <span class="fst-icon">📋</span>
                <h4>Records</h4>
            </div>

            <div id="bulk-records-container"></div>
            ${isCreateOp ? '</div><!-- /bulk-payload-mode -->' : ''}
            ${isCreateOp ? `<div id="bulk-script-mode" style="display:none;">${this._bulkScriptModeHTML(scriptType)}</div>` : ''}
        `;

        // Add first record
        this._addBulkRecord();

        console.log(`✓ Loaded bulk form for ${module}/${operation}`);
    }

    /**
     * Generate bulk records based on count input
     */
    _generateBulkRecords() {
        const countInput = document.querySelector('input[name="bulk_count"]');
        const count = parseInt(countInput?.value || 1);
        const container = document.getElementById('bulk-records-container');

        if (!container) return;

        // Clear existing records
        container.innerHTML = '';

        // Add specified number of records
        for (let i = 0; i < count; i++) {
            this._addBulkRecord();
        }
    }

    /**
     * Add a single bulk record card
     */
    _addBulkRecord() {
        const container = document.getElementById('bulk-records-container');
        if (!container) return;

        const recordIndex = container.querySelectorAll('.bulk-record-card').length;
        const n = recordIndex + 1;

        const card = document.createElement('div');
        card.className = 'bulk-record-card cc-item-card';
        card.dataset.recordIndex = recordIndex;

        // Generate fields based on current operation
        const fields = this._getBulkRecordFields(recordIndex, n);

        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <h4 style="margin: 0; color: #1e293b; font-size: 14px; font-weight: 600;">
                    📄 Record ${n}
                </h4>
                <button type="button" onclick="window.uiController._removeBulkRecord(${recordIndex})"
                    class="btn-remove-item" title="Remove Record">
                    ✕
                </button>
            </div>
            ${fields}
        `;

        container.appendChild(card);
    }

    /**
     * Remove a bulk record card
     */
    _removeBulkRecord(index) {
        const card = document.querySelector(`.bulk-record-card[data-record-index="${index}"]`);
        if (card) card.remove();
    }

    /**
     * Get bulk record fields HTML based on current operation
     */
    _getBulkRecordFields(index, n) {
        const module = this.currentModule;
        const operation = this.currentOperation;

        // Return appropriate fields based on operation
        if (module === 'items' && operation === 'update_state') {
            return `
                <div class="form-row">
                    <div class="form-group">
                        <label>ERP Item Code</label>
                        <input type="text" name="bulk_${index}_erp_code" class="input-field" value="ERP${n}">
                    </div>
                    <div class="form-group">
                        <label>Status *</label>
                        <select name="bulk_${index}_status" class="input-field" required>
                            <option value="ACTIVE" selected>ACTIVE</option>
                            <option value="INACTIVE">INACTIVE</option>
                        </select>
                    </div>
                </div>
            `;
        } else if (module === 'vendors' && operation === 'state') {
            return `
                <div class="form-row">
                    <div class="form-group">
                        <label>ERP Vendor Code</label>
                        <input type="text" name="bulk_${index}_erp_code" class="input-field" value="ERPV${n}">
                    </div>
                    <div class="form-group">
                        <label>Status *</label>
                        <select name="bulk_${index}_status" class="input-field" required>
                            <option value="ACTIVE" selected>ACTIVE</option>
                            <option value="INACTIVE">INACTIVE</option>
                        </select>
                    </div>
                </div>
            `;
        } else if (module === 'purchase_order' && operation === 'terminate') {
            return `
                <div class="form-row">
                    <div class="form-group">
                        <label>ERP PO ID *</label>
                        <input type="text" name="bulk_${index}_erp_po_id" class="input-field" required value="ERPPO${n}">
                    </div>
                    <div class="form-group">
                        <label>Status *</label>
                        <select name="bulk_${index}_status" class="input-field" required>
                            <option value="ACCEPTED" selected>ACCEPTED</option>
                            <option value="REQUESTED">REQUESTED</option>
                            <option value="REVOKED">REVOKED</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Notes</label>
                    <textarea name="bulk_${index}_notes" class="form-textarea" rows="2"></textarea>
                </div>
            `;
        }

        // Default generic fields
        return `
            <div class="form-group">
                <label>ID/Code *</label>
                <input type="text" name="bulk_${index}_id" class="input-field" required value="REC${n}">
            </div>
        `;
    }

    /**
     * Switch between single and bulk mode for vendors
     * @param {string} mode - 'single' or 'bulk'
     * @deprecated Use _switchMode() instead
     */
    _switchVendorMode(mode) {
        this._switchMode(mode);
    }

    /**
     * Switch between single and bulk mode for POs
     * @deprecated Use _switchMode() instead
     */
    _switchPOMode(mode) {
        this._switchMode(mode);
    }

    /**
     * Switch between single and bulk mode for contracts
     * @deprecated Use _switchMode() instead
     */
    _switchContractMode(mode) {
        this._switchMode(mode);
    }

    /**
     * Switch between single and bulk mode for items
     * @param {string} mode - 'single' or 'bulk'
     */
    _switchItemMode(mode) {
        const singleForm = document.getElementById('item-single-form');
        const bulkForm = document.getElementById('item-bulk-form');
        const toggleBtns = document.querySelectorAll('.mode-toggle-btn');

        if (!singleForm || !bulkForm) {
            console.error('Item form containers not found');
            return;
        }

        // Update toggle buttons
        toggleBtns.forEach(btn => {
            if (btn.dataset.mode === mode) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        if (mode === 'single') {
            singleForm.style.display = 'block';
            bulkForm.style.display = 'none';
            this.currentMode = 'single';
        } else {
            singleForm.style.display = 'none';
            bulkForm.style.display = 'block';
            this.currentMode = 'bulk';

            // Load bulk form if not already loaded
            if (!bulkForm.innerHTML.trim()) {
                this._loadItemBulkForm();
            }
        }

        console.log('Switched to', mode, 'mode for items');
    }

    /**
     * Switch between single and bulk mode for projects
     * @param {string} mode - 'single' or 'bulk'
     */
    _switchProjectMode(mode) {
        const singleForm = document.getElementById('project-single-form');
        const bulkForm = document.getElementById('project-bulk-form');
        const toggleBtns = document.querySelectorAll('.mode-toggle-btn');

        if (!singleForm || !bulkForm) {
            console.error('Project form containers not found');
            return;
        }

        // Update toggle buttons
        toggleBtns.forEach(btn => {
            if (btn.dataset.mode === mode) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        if (mode === 'single') {
            singleForm.style.display = 'block';
            bulkForm.style.display = 'none';
            this.currentMode = 'single';
        } else {
            singleForm.style.display = 'none';
            bulkForm.style.display = 'block';
            this.currentMode = 'bulk';

            // Load bulk form if not already loaded
            if (!bulkForm.innerHTML.trim()) {
                this._loadProjectBulkForm();
            }
        }

        console.log('Switched to', mode, 'mode for projects');
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
            const responseData = Array.isArray(data) ? (data.length > 0 ? data[0] : {}) : data;
            const templates = responseData.templates || [];
            console.log('✓ Project templates array:', templates);

            // Store templates in templateManager
            if (this.templateManager && templates.length > 0) {
                this.templateManager.projectTemplates = templates;
                console.log('✓ Stored', templates.length, 'project templates in TemplateManager');

                // Populate dropdowns
                const optionsHTML = templates.map(t => {
                    const name = t.name || t.template_name || 'Unnamed Template';
                    return `<option value="${name}">${name}</option>`;
                }).join('');
                const singleSelect = document.getElementById('project_template_select');
                const bulkSelect = document.getElementById('bp_project_template_select');
                if (singleSelect) singleSelect.innerHTML = optionsHTML;
                if (bulkSelect) bulkSelect.innerHTML = optionsHTML;

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
            const sectionKey = field.section_alternate_name || field.section_name || 'Custom Fields';
            if (!fieldsBySection[sectionKey]) {
                fieldsBySection[sectionKey] = [];
            }
            fieldsBySection[sectionKey].push(field);
        });

        // Generate HTML for each section
        Object.entries(fieldsBySection).forEach(([sectionKey, fields]) => {
            const sectionDisplayName = fields[0].section_name || sectionKey;
            const sectionHTML = `
                <div class="form-section-title">
                    <span class="fst-icon">🔧</span>
                    <h4>${sectionDisplayName}</h4>
                    <span class="fst-badge" style="background: #94a3b8;">From Template</span>
                </div>
                <div data-custom-section="${sectionKey}">
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
        const fieldName = field.alternate_name || field.name;
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
                // Extract headers: -H / --header with single or double quotes
                const headerMatches = inputText.matchAll(/(?:-H|--header)\s+'([^:]+):\s*([^']*)'|(?:-H|--header)\s+"([^:]+):\s*([^"]*)"/g);
                for (const match of headerMatches) {
                    const key = (match[1] || match[3]).toLowerCase();
                    const value = match[2] || match[4];
                    headers[key] = value;
                }

                // Extract payload: -d / --data / --data-raw with single/double quotes or multi-line JSON
                let jsonStr = null;
                // Try single-quoted (may be multi-line)
                const singleQuoteMatch = inputText.match(/(?:--data-raw|--data|-d)\s+'([\s\S]*?)'/);
                if (singleQuoteMatch) jsonStr = singleQuoteMatch[1];
                // Try double-quoted
                if (!jsonStr) {
                    const doubleQuoteMatch = inputText.match(/(?:--data-raw|--data|-d)\s+"([\s\S]*?)"/);
                    if (doubleQuoteMatch) jsonStr = doubleQuoteMatch[1];
                }
                // Try unquoted JSON block
                if (!jsonStr) {
                    const unquotedMatch = inputText.match(/(?:--data-raw|--data|-d)\s+(\{[\s\S]*\})/);
                    if (unquotedMatch) jsonStr = unquotedMatch[1];
                }
                if (jsonStr) {
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
        // vendor_identifications can come as array (from create payload) or flat fields
        if (payload.vendor_identifications?.length > 0) {
            const vi = payload.vendor_identifications[0];
            const nameField = document.querySelector('input[name="vendor_identification_name"]');
            const valField = document.querySelector('input[name="vendor_identification_value"]');
            if (nameField) nameField.value = vi.identification_name || '';
            if (valField) valField.value = vi.identification_value || '';
        } else {
            if (payload.vendor_identification_name) {
                const field = document.querySelector('input[name="vendor_identification_name"]');
                if (field) field.value = payload.vendor_identification_name;
            }
            if (payload.vendor_identification_value) {
                const field = document.querySelector('input[name="vendor_identification_value"]');
                if (field) field.value = payload.vendor_identification_value;
            }
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
        // payment_terms can be nested (create payload) or flat
        const pt = payload.payment_terms || payload;
        if (pt.term !== undefined || payload.payment_term !== undefined) {
            const field = document.querySelector('input[name="payment_term"]');
            if (field) field.value = pt.term ?? payload.payment_term ?? '';
        }
        if (pt.period || payload.payment_period) {
            const field = document.querySelector('select[name="payment_period"]');
            if (field) field.value = pt.period || payload.payment_period;
        }
        if (pt.applied_from || payload.payment_applied_from) {
            const field = document.querySelector('[name="payment_applied_from"]');
            if (field) field.value = pt.applied_from || payload.payment_applied_from;
        }

        // Contract items
        const items = payload.contract_items;
        if (Array.isArray(items) && items.length > 0) {
            const container = document.getElementById('contract-items-container-update');
            if (container) {
                container.innerHTML = '';
                for (let i = 0; i < items.length; i++) {
                    this._addContractItemUpdate();
                }
                items.forEach((item, i) => {
                    const setItem = (name, val) => {
                        const el = document.querySelector(`[name="item_${i}_${name}"]`);
                        if (el && val !== undefined && val !== null) el.value = val;
                    };
                    const setItemSelect = (name, val) => {
                        const el = document.querySelector(`[name="item_${i}_${name}"]`);
                        if (el && val) { const opt = [...el.options].find(o => o.value === val); if (opt) el.value = val; }
                    };

                    setItem('factwise_code', item.factwise_item_code || '');
                    setItem('erp_code', item.ERP_item_code || '');
                    setItem('currency_id', item.currency_code_id || '');
                    setItem('unit_id', item.measurement_unit_id || '');
                    setItem('prepayment', item.prepayment_percentage ?? '');
                    setItemSelect('payment_type', item.payment_type);
                    setItem('lead_time', item.lead_time ?? '');
                    setItemSelect('lead_time_period', item.lead_time_period);
                    setItem('payment_term', item.payment_terms?.term ?? '');
                    setItemSelect('payment_period', item.payment_terms?.period);
                    setItemSelect('payment_applied_from', item.payment_terms?.applied_from);
                    setItemSelect('incoterm', item.incoterm);

                    const tiers = item.pricing_tiers || [];
                    if (tiers.length > 1) {
                        for (let t = 1; t < tiers.length; t++) {
                            this._addPricingTierUpdate(i);
                        }
                    }
                    tiers.forEach((tier, t) => {
                        setItem(`tier_${t}_min`, tier.min_quantity ?? '');
                        setItem(`tier_${t}_max`, tier.max_quantity ?? '');
                        setItem(`tier_${t}_rate`, tier.rate ?? '');
                    });
                });
            }
        }
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

        // Contract-specific: vendor code pair (at least one required)
        if (this.currentModule === 'contract' && this.currentOperation === 'create') {
            const fwEl = this.elements.operationForm.querySelector('[name="factwise_vendor_code"]');
            const erpEl = this.elements.operationForm.querySelector('[name="ERP_vendor_code"]');
            if (fwEl && erpEl && !fwEl.value.trim() && !erpEl.value.trim()) {
                allValid = false;
                invalidFields.push(fwEl);
                invalidFields.push(erpEl);
            }
        }

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

    _setCurlCollapsed(collapsed) {
        this.elements.curlDisplay.style.display = collapsed ? 'none' : '';
        const icon = document.getElementById('curl-collapse-icon');
        if (icon) icon.style.transform = collapsed ? 'rotate(-90deg)' : 'rotate(0deg)';
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

        // Clear response meta
        const responseMeta = document.getElementById('response-meta');
        if (responseMeta) responseMeta.innerHTML = '';

        // Show cURL panel expanded
        this.elements.actionsSection.classList.remove('hidden');
        this.elements.responseSection.classList.add('hidden');
        this._setCurlCollapsed(false);

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
            if (this.currentModule === 'contract' && this.currentOperation === 'create') {
                // Check mode for contracts
                if (this.currentMode === 'bulk') {
                    console.log('Building contracts bulk create payload...');
                    payload = this._buildContractsBulkCreatePayload();
                    // Override endpoint for bulk
                    op = { ...op, endpoint: '/dev/api/contract/bulk-create/' };
                } else {
                    console.log('Building contract create payload...');
                    payload = this._buildContractPayload(op);
                    const warnings = this._getContractWarnings(payload);
                    this._showContractWarnings(warnings);
                }
            } else if (this.currentModule === 'contract') {
                payload = this._buildContractPayload(op);
            } else if (this.currentModule === 'items' && this.currentOperation === 'create') {
                // Check mode for items
                if (this.currentMode === 'bulk') {
                    console.log('Building items bulk create payload...');
                    payload = this._buildItemsBulkCreatePayload();
                    // Override endpoint for bulk
                    op = { ...op, endpoint: '/dev/api/items/bulk-create/' };
                } else {
                    console.log('Building item create payload...');
                    payload = this._buildItemCreatePayload();
                }
            } else if (this.currentModule === 'items' && this.currentOperation === 'update_state') {
                // Check mode for items update state
                if (this.currentMode === 'bulk') {
                    console.log('Building items bulk update state payload...');
                    payload = this._buildBulkPayload();
                    // Override endpoint for bulk
                    op = { ...op, endpoint: '/dev/api/items/bulk-update/state/' };
                } else {
                    payload = this._buildItemStatePayload();
                }
            } else if (this.currentModule === 'projects' && this.currentOperation === 'create') {
                // Check mode for projects
                if (this.currentMode === 'bulk') {
                    console.log('Building projects bulk create payload...');
                    payload = this._buildProjectsBulkCreatePayload();
                    // Override endpoint for bulk
                    op = { ...op, endpoint: '/dev/api/project/bulk-create/' };
                } else {
                    console.log('Building project create payload...');
                    payload = this._buildProjectCreatePayload();
                }
            } else if (this.currentModule === 'vendors' && this.currentOperation === 'contacts_create') {
                payload = this._buildVendorContactCreatePayload();
            } else if (this.currentModule === 'vendors' && this.currentOperation === 'contacts_update') {
                payload = this._buildVendorContactUpdatePayload();
            } else if (this.currentModule === 'vendors' && this.currentOperation === 'contacts_delete') {
                payload = this._buildVendorContactDeletePayload();
            } else if (this.currentModule === 'vendors' && this.currentOperation === 'state') {
                // Check mode for vendor state
                if (this.currentMode === 'bulk') {
                    console.log('Building vendors bulk state payload...');
                    payload = this._buildBulkPayload();
                    // Override endpoint for bulk
                    op = { ...op, endpoint: '/dev/api/vendors/bulk-state/' };
                } else {
                    payload = this._buildVendorStatePayload();
                }
            } else if (this.currentModule === 'vendors' && this.currentOperation === 'create') {
                // Check mode for vendors
                if (this.currentMode === 'bulk') {
                    console.log('Building vendors bulk create payload...');
                    payload = this._buildVendorsBulkCreatePayload();
                    // Override endpoint for bulk
                    op = { ...op, endpoint: '/dev/api/vendors/bulk-create/' };
                } else {
                    console.log('Building vendor create payload...');
                    payload = this._buildVendorCreatePayload();
                }
            } else if (this.currentModule === 'items' && this.currentOperation === 'update_state') {
                payload = this._buildItemStatePayload();
            } else if (this.currentModule === 'projects' && this.currentOperation === 'create') {
                payload = this._buildProjectCreatePayload();
            } else if (this.currentModule === 'projects' && this.currentOperation === 'bulk_create') {
                payload = this._buildProjectsBulkCreatePayload();
            } else if (this.currentModule === 'purchase_order' && this.currentOperation === 'create') {
                // Check mode for POs
                if (this.currentMode === 'bulk') {
                    console.log('Building POs bulk create payload...');
                    payload = this._buildPOsBulkCreatePayload();
                    // Override endpoint for bulk
                    op = { ...op, endpoint: '/dev/api/purchase_order/bulk-create/' };
                } else {
                    console.log('Building PO create payload...');
                    payload = this._buildPOCreatePayload();
                }
            } else if (this.currentModule === 'purchase_order' && this.currentOperation === 'terminate') {
                // Check mode for PO terminate
                if (this.currentMode === 'bulk') {
                    console.log('Building POs bulk terminate payload...');
                    payload = this._buildBulkPayload();
                    // Override endpoint for bulk
                    op = { ...op, endpoint: '/dev/api/purchase_order/bulk-terminate/' };
                } else {
                    console.log('Building PO terminate payload...');
                    payload = this._buildPOTerminatePayload();
                }
            } else if (this.currentModule === 'purchase_order' && this.currentOperation === 'state') {
                // Check mode for PO state
                if (this.currentMode === 'bulk') {
                    console.log('Building POs bulk state payload...');
                    payload = this._buildBulkPayload();
                    // Override endpoint for bulk
                    op = { ...op, endpoint: '/dev/api/purchase_order/bulk-state/' };
                } else {
                    console.log('Building PO state payload...');
                    payload = this._buildPOStatePayload();
                }
            } else if (this.currentModule === 'items' && this.currentOperation === 'update') {
                payload = this._buildItemUpdatePayload();
            } else if (this.currentModule === 'vendors' && this.currentOperation === 'update') {
                payload = this._buildVendorUpdatePayload();
            } else if (this.currentModule === 'projects' && this.currentOperation === 'update') {
                payload = this._buildProjectUpdatePayload();
            } else if (this.currentModule === 'requisitions' && this.currentOperation === 'create') {
                payload = this._buildRequisitionCreatePayload();
            } else if (this.currentModule === 'requisitions' && this.currentOperation === 'update') {
                payload = this._buildRequisitionUpdatePayload();
            } else if (this.currentModule === 'requisitions' && this.currentOperation === 'terminate') {
                payload = this._buildRequisitionTerminatePayload();
            } else if (this.currentModule === 'costing_sheet' && this.currentOperation === 'create') {
                payload = this._buildCostingSheetCreatePayload();
            } else if (this.currentModule === 'costing_sheet' && this.currentOperation === 'mapping') {
                payload = this._buildCostingSheetMappingPayload();
            } else {
                // For non-Contract operations, use form inputs (Phase 1 behavior)
                payload = this._collectFormData();
            }

            console.log('Built payload:', payload);

            // Generate cURL
            const curl = this._generateCurlCommandWithPayload(env, op, payload);
            this.elements.curlDisplay.innerHTML = `<pre><code>${this._escapeHtml(curl)}</code></pre>`;

            // Show both panels — curl collapsed, response on top with waiting state
            this.elements.actionsSection.classList.remove('hidden');
            this.elements.responseSection.classList.remove('hidden');
            this._setCurlCollapsed(true);

            // Show waiting state in response
            this.elements.responseDisplay.innerHTML = `
                <div style="display:flex;align-items:center;gap:10px;padding:20px;color:#64748b;">
                    <div style="width:16px;height:16px;border:2px solid #e2e8f0;border-top-color:#6366f1;border-radius:50%;animation:spin 0.8s linear infinite;flex-shrink:0;"></div>
                    <span style="font-size:14px;">Waiting for response...</span>
                </div>
            `;

            // Scroll to response
            this.elements.responseSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

            // Execute real API call for Contract + Items + Vendor + Project + PO operations
            const shouldExecuteAPI = this.currentModule === 'contract' ||
                (this.currentModule === 'items' && ['bulk_create', 'update_state', 'create', 'update'].includes(this.currentOperation)) ||
                (this.currentModule === 'vendors' && ['contacts_create', 'contacts_update', 'contacts_delete', 'state', 'create', 'update'].includes(this.currentOperation)) ||
                (this.currentModule === 'projects' && ['create', 'bulk_create', 'update'].includes(this.currentOperation)) ||
                (this.currentModule === 'purchase_order' && ['create', 'terminate', 'state'].includes(this.currentOperation)) ||
                this.currentModule === 'requisitions' ||
                this.currentModule === 'costing_sheet';

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

        } catch (error) {
            this._displayError(error.message);
        }
    }

    _getContractWarnings(payload) {
        const warnings = [];
        const items = payload.contract_items || [];

        items.forEach((item, itemIdx) => {
            const label = `Item ${itemIdx + 1}`;

            if (!item.factwise_item_code && !item.ERP_item_code) {
                warnings.push(`${label}: Both factwise_item_code and ERP_item_code are empty — API requires at least one.`);
            }

            const tiers = item.pricing_tiers || [];
            if (tiers.length === 0) {
                warnings.push(`${label}: No pricing tiers — API requires at least one.`);
            }

        });

        if (!payload.ERP_vendor_code && !payload.factwise_vendor_code) {
            warnings.push('Contract: Both ERP_vendor_code and factwise_vendor_code are empty — API requires at least one.');
        }

        return warnings;
    }

    _showContractWarnings(warnings) {
        // Find or create warning container inside the operation form
        let container = document.getElementById('contract-warnings-box');
        if (!container) {
            const form = this.elements?.operationForm;
            if (!form) return;
            container = document.createElement('div');
            container.id = 'contract-warnings-box';
            form.prepend(container);
        }

        if (!warnings || warnings.length === 0) {
            container.innerHTML = '';
            return;
        }

        container.innerHTML = `
            <div style="background:#fffbeb;border:1px solid #f59e0b;border-radius:6px;padding:12px 16px;margin-bottom:16px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                    <strong style="color:#b45309;font-size:13px;">⚠ Warnings (non-blocking — payload will still be sent)</strong>
                    <button type="button" onclick="document.getElementById('contract-warnings-box').innerHTML=''" style="background:none;border:none;cursor:pointer;color:#b45309;font-size:16px;line-height:1;">✕</button>
                </div>
                <ul style="margin:0;padding-left:18px;color:#92400e;font-size:12px;">
                    ${warnings.map(w => `<li style="margin-bottom:3px;">${w}</li>`).join('')}
                </ul>
            </div>
        `;
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
                template_name: (() => { const s = form.querySelector('[name="template_name"]'); return s?.options[s.selectedIndex]?.dataset?.name || s?.value || "Default Template"; })(),
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
                terms_and_conditions: (() => {
                    const tncName = form.querySelector('[name="tnc_name"]')?.value;
                    if (!tncName) return null;
                    const tncRecord = (this._tncList || []).find(t =>
                        t.name === tncName
                    );
                    return {
                        name: tncName,
                        data: tncRecord?.data || ''
                    };
                })(),
                contract_items: []
            };

            // Collect contract-level custom sections if enabled
            const contractCustomContainer = form.querySelector('#contract-custom-container');
            if (contractCustomContainer) {
                const customSections = contractCustomContainer.querySelectorAll('.cc-custom-section');
                customSections.forEach(section => {
                    const sectionName = section.querySelector('[name$="_section_name"]')?.value;
                    if (sectionName) {
                        const customFields = [];
                        section.querySelectorAll('.cc-custom-field-row').forEach(fieldRow => {
                            const fname = fieldRow.querySelector('[name$="_field_name"]')?.value;
                            const fvalEl = fieldRow.querySelector('[name$="_field_value"]');
                            const fval = this._readCustomFieldValue(fvalEl);
                            if (fname) customFields.push({ name: fname, value: fval });
                        });
                        payload.custom_sections.push({
                            name: sectionName,
                            custom_fields: customFields
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

                            // Collect tier-level costs — both mandatory rows and user-added rows
                            const allCostRows = tierRow.querySelectorAll('.cc-tier-cost-row');
                            allCostRows.forEach(costRow => {
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
                                const customFields = [];
                                section.querySelectorAll('.cc-custom-field-row').forEach(fieldRow => {
                                    const fname = fieldRow.querySelector('[name$="_field_name"]')?.value;
                                    const fvalEl = fieldRow.querySelector('[name$="_field_value"]');
                                    const fval = this._readCustomFieldValue(fvalEl);
                                    if (fname) customFields.push({ name: fname, value: fval });
                                });
                                item.custom_sections.push({
                                    name: sectionName,
                                    custom_fields: customFields
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
                modified_by_user_email: form.querySelector('[name="buyer_contact"]')?.value || this.currentAccount?.user_email,
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
                terms_and_conditions: (() => {
                    const tncName = form.querySelector('[name="tnc_name"]')?.value;
                    if (!tncName) return null;
                    const tncRecord = (this._tncList || []).find(t =>
                        t.name === tncName
                    );
                    return {
                        name: tncName,
                        data: tncRecord?.data || ''
                    };
                })(),
                contract_items: []
            };

            // Collect contract-level custom sections if enabled
            const contractCustomContainer = form.querySelector('#contract-custom-container-update');
            if (contractCustomContainer) {
                const customSections = contractCustomContainer.querySelectorAll('.cc-custom-section');
                customSections.forEach(section => {
                    const sectionName = section.querySelector('[name$="_section_name"]')?.value;
                    if (sectionName) {
                        const customFields = [];
                        section.querySelectorAll('.cc-custom-field-row').forEach(fieldRow => {
                            const fname = fieldRow.querySelector('[name$="_field_name"]')?.value;
                            const fvalEl = fieldRow.querySelector('[name$="_field_value"]');
                            const fval = this._readCustomFieldValue(fvalEl);
                            if (fname) customFields.push({ name: fname, value: fval });
                        });
                        payload.custom_sections.push({
                            name: sectionName,
                            custom_fields: customFields
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

                            // Collect tier-level costs — both mandatory rows and user-added rows
                            const allCostRows = tierRow.querySelectorAll('.cc-tier-cost-row');
                            allCostRows.forEach(costRow => {
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
                                const customFields = [];
                                section.querySelectorAll('.cc-custom-field-row').forEach(fieldRow => {
                                    const fname = fieldRow.querySelector('[name$="_field_name"]')?.value;
                                    const fvalEl = fieldRow.querySelector('[name$="_field_value"]');
                                    const fval = this._readCustomFieldValue(fvalEl);
                                    if (fname) customFields.push({ name: fname, value: fval });
                                });
                                item.custom_sections.push({
                                    name: sectionName,
                                    custom_fields: customFields
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

            // After contract create, regenerate IDs so next execute doesn't duplicate
            if (this.currentModule === 'contract' && this.currentOperation === 'create' && this.currentMode !== 'bulk') {
                if (response.status >= 200 && response.status < 300) {
                    this._setContractIdDefaults();
                }
            }
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

        // For error responses, show a plain-English translation above the raw JSON
        let translationHtml = '';
        if (response.status >= 400) {
            const errorResults = this._translateApiErrors(bodyToDisplay, response.status);
            if (errorResults.length > 0) {
                this._highlightErrorFields(errorResults);
                const items = errorResults.map(({ path, msg }) => {
                    const where = path.length ? `<span style="color:#9ca3af;font-weight:400;">[${path.join(' › ')}]</span> ` : '';
                    return `<li style="margin-bottom:5px;">${where}${this._escapeHtml(msg)}</li>`;
                }).join('');
                translationHtml = `
                    <div style="background:#fef2f2;border:1px solid #fca5a5;border-radius:6px;padding:12px 16px;margin-bottom:12px;">
                        <div style="font-weight:600;color:#b91c1c;margin-bottom:8px;font-size:13px;">❌ What went wrong</div>
                        <ul style="margin:0;padding-left:18px;color:#7f1d1d;font-size:12px;line-height:1.8;">
                            ${items}
                        </ul>
                    </div>`;
            }
        }

        this.elements.responseDisplay.innerHTML = `${translationHtml}<pre><code class="language-json">${jsonStr}</code></pre>`;

        // "View Contract" button — for successful contract create or update
        if (this.currentModule === 'contract'
            && (this.currentOperation === 'create' || this.currentOperation === 'update')
            && response.status >= 200 && response.status < 300) {

            const btnWrapper = document.createElement('div');
            btnWrapper.style.cssText = 'margin-top:12px;text-align:center;';
            this.elements.responseDisplay.appendChild(btnWrapper);

            // If user loaded a contract (update), we already have the IDs — no lookup needed
            if (this.currentOperation === 'update' && this._loadedContractId && this._loadedTemplateId) {
                const contractUrl = `https://factwise-newdbtest.netlify.app/buyer/CLM/template/${this._loadedTemplateId}/contract/${this._loadedContractId}`;
                btnWrapper.innerHTML = `
                    <a href="${contractUrl}" target="_blank" rel="noopener noreferrer"
                       style="display:inline-flex;align-items:center;gap:8px;padding:10px 20px;background:#3b82f6;color:#fff;border-radius:6px;text-decoration:none;font-size:13px;font-weight:500;cursor:pointer;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                        View Contract on Factwise
                    </a>`;
            } else {
                // Fallback: lookup via dashboard (create response has custom_contract_id, or user typed it manually)
                const customContractId = bodyToDisplay?.custom_contract_id
                    || this.elements.operationForm?.querySelector('[name="factwise_contract_id"]')?.value;
                if (customContractId) {
                    btnWrapper.innerHTML = `<span style="color:#64748b;font-size:12px;">Looking up contract...</span>`;
                    this._lookupContractFromDashboard(customContractId).then(result => {
                        const tplId = result?.templateId || document.getElementById('template_name_select')?.value;
                        if (result?.contractId && tplId) {
                            const contractUrl = `https://factwise-newdbtest.netlify.app/buyer/CLM/template/${tplId}/contract/${result.contractId}`;
                            btnWrapper.innerHTML = `
                                <a href="${contractUrl}" target="_blank" rel="noopener noreferrer"
                                   style="display:inline-flex;align-items:center;gap:8px;padding:10px 20px;background:#3b82f6;color:#fff;border-radius:6px;text-decoration:none;font-size:13px;font-weight:500;cursor:pointer;">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                                    View Contract on Factwise
                                </a>`;
                        } else {
                            btnWrapper.innerHTML = `<span style="color:#94a3b8;font-size:12px;">Contract ${this.currentOperation === 'create' ? 'created' : 'updated'} but could not resolve link</span>`;
                        }
                    });
                }
            }
        }
    }

    // Walk a DRF validation error object and collect { path, msg } pairs
    _extractDrfErrors(node, pathParts, results) {
        if (typeof node === 'string') {
            // Strip Python ErrorDetail repr → plain message
            const m = node.match(/ErrorDetail\(string='([^']+)'/);
            results.push({ path: pathParts.filter(Boolean), msg: m ? m[1] : node });
        } else if (Array.isArray(node)) {
            node.forEach((item, idx) => {
                const nextParts = (typeof item === 'object' && item !== null && !Array.isArray(item))
                    ? [...pathParts, `#${idx + 1}`] : pathParts;
                this._extractDrfErrors(item, nextParts, results);
            });
        } else if (node && typeof node === 'object') {
            Object.entries(node).forEach(([key, val]) => {
                this._extractDrfErrors(val, [...pathParts, key], results);
            });
        }
    }

    _translateApiErrors(body, status) {
        if (!body) return [];

        // body.detail = simple DRF auth/permission error string
        if (body.detail && typeof body.detail === 'string') {
            return [{ path: [], msg: body.detail }];
        }

        // body is a plain string (raw traceback from server)
        if (typeof body === 'string') {
            // Try pulling ErrorDetail messages first
            const re = /ErrorDetail\(string='([^']+)'/g;
            const results = [];
            let m;
            while ((m = re.exec(body)) !== null) results.push({ path: [], msg: m[1] });
            if (results.length) return results;
            // Otherwise find the first non-traceback line
            const line = body.split('\n').find(l => l.trim() && !l.includes('File "') && !l.includes('/site-packages/') && !l.includes('Traceback'));
            return line ? [{ path: [], msg: line.trim() }] : [];
        }

        // body is an object — check if it's the custom {"ErrorCode": ..., "Cause": ...} wrapper
        if (body.ErrorCode !== undefined) {
            // ErrorCode may itself be a nested DRF error object or a string
            const results = [];
            if (typeof body.ErrorCode === 'object') {
                this._extractDrfErrors(body.ErrorCode, [], results);
            } else if (typeof body.ErrorCode === 'string') {
                // Strip ErrorDetail repr if present
                const m = body.ErrorCode.match(/ErrorDetail\(string='([^']+)'/);
                results.push({ path: [], msg: m ? m[1] : body.ErrorCode });
            }
            return results;
        }

        // Standard DRF validation error object — walk it
        const results = [];
        this._extractDrfErrors(body, [], results);
        return results;
    }

    _highlightErrorFields(errorResults) {
        // Remove previous red highlights
        document.querySelectorAll('.input-field.api-error').forEach(el => {
            el.classList.remove('api-error');
            el.style.outline = '';
        });

        let firstEl = null;
        errorResults.forEach(({ path }) => {
            if (!path.length) return;
            // Try to find a matching input by name fragments
            // path like ['contract_items', '#1', 'pricing_tiers', '#1', 'min_quantity']
            // map to input name like item_0_tier_0_min
            const fieldName = path[path.length - 1];
            const indexHints = path.filter(p => p.startsWith('#')).map(p => parseInt(p.slice(1)) - 1);

            let el = null;

            // Try exact name match variants
            const itemIdx = indexHints[0] ?? 0;
            const tierIdx = indexHints[1] ?? 0;

            const candidates = [
                `[name="item_${itemIdx}_tier_${tierIdx}_${fieldName}"]`,
                `[name="item_${itemIdx}_${fieldName}"]`,
                `[name="${fieldName}"]`,
            ];

            for (const sel of candidates) {
                el = document.querySelector(sel);
                if (el) break;
            }

            if (el) {
                el.classList.add('api-error');
                el.style.outline = '2px solid #ef4444';
                if (!firstEl) firstEl = el;
            }
        });

        if (firstEl) {
            firstEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
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
        } else if (this.currentModule === 'items' && this.currentOperation === 'update') {
            try { body = this._buildItemUpdatePayload(); } catch (error) { return `Error: ${error.message}`; }
        } else if (this.currentModule === 'vendors' && this.currentOperation === 'update') {
            try { body = this._buildVendorUpdatePayload(); } catch (error) { return `Error: ${error.message}`; }
        } else if (this.currentModule === 'projects' && this.currentOperation === 'update') {
            try { body = this._buildProjectUpdatePayload(); } catch (error) { return `Error: ${error.message}`; }
        } else if (this.currentModule === 'requisitions' && this.currentOperation === 'create') {
            try { body = this._buildRequisitionCreatePayload(); } catch (error) { return `Error: ${error.message}`; }
        } else if (this.currentModule === 'requisitions' && this.currentOperation === 'update') {
            try { body = this._buildRequisitionUpdatePayload(); } catch (error) { return `Error: ${error.message}`; }
        } else if (this.currentModule === 'requisitions' && this.currentOperation === 'terminate') {
            try { body = this._buildRequisitionTerminatePayload(); } catch (error) { return `Error: ${error.message}`; }
        } else if (this.currentModule === 'costing_sheet' && this.currentOperation === 'create') {
            try { body = this._buildCostingSheetCreatePayload(); } catch (error) { return `Error: ${error.message}`; }
        } else if (this.currentModule === 'costing_sheet' && this.currentOperation === 'mapping') {
            try { body = this._buildCostingSheetMappingPayload(); } catch (error) { return `Error: ${error.message}`; }
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

            // Store for template detail API calls
            this._entityId = entityId;
            this._templateDetailCache = this._templateDetailCache || {};

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
            const allTemplates = (responseData.templates || []).filter(t => (t.status || '') !== '');
            console.log('✓ Templates array:', allTemplates.length);

            // Store only usable templates in templateManager
            const usableTemplates = allTemplates.filter(t => {
                const s = (t.status || '').toUpperCase();
                return s !== 'DRAFT' && s !== 'REVISED';
            });
            if (this.templateManager && usableTemplates.length > 0) {
                this.templateManager.templates = usableTemplates;
                console.log('✓ Stored', usableTemplates.length, 'usable templates in TemplateManager');
            }

            // Populate dropdown — show all, disable draft/revised
            const select = document.getElementById('template_name_select');
            if (select && allTemplates.length > 0) {
                select.innerHTML = allTemplates.map(t => {
                    const name = t.name || t.template_name || 'Unnamed Template';
                    const s = (t.status || '').toUpperCase();
                    const isDraft = s === 'DRAFT';
                    const isRevised = s === 'REVISED';
                    const disabled = isDraft || isRevised;
                    const hint = isDraft ? 'Publish this template to use it'
                                : isRevised ? 'Template has been revised — publish to use it'
                                : '';
                    const suffix = disabled ? ` (${s.toLowerCase()})` : '';
                    return `<option value="${t.template_id}" data-name="${name}" ${disabled ? 'disabled' : ''} title="${hint}">${name}${suffix}</option>`;
                }).join('');

                // Select first usable template
                const firstUsable = allTemplates.find(t => {
                    const s = (t.status || '').toUpperCase();
                    return s !== 'DRAFT' && s !== 'REVISED';
                });
                if (firstUsable) {
                    select.value = firstUsable.template_id;
                    await this._handleTemplateChange(firstUsable.template_id);
                }
                console.log('✓ Populated dropdown with', allTemplates.length, 'templates');
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

    async _loadTermsAndConditions() {
        try {
            const token = this.factwiseIntegration?.getToken() || this.tokenManager.getToken();
            if (!token) {
                console.warn('No token for T&C API');
                return;
            }

            const baseUrl = this.environmentManager.getFactwiseBaseUrl();
            const url = `${baseUrl}organization/terms_and_conditions/admin/?type=PURCHASE_ORDER`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                console.error('Failed to fetch T&C:', response.status);
                return;
            }

            const data = await response.json();
            const allTnc = Array.isArray(data) ? data : (data.results || []);
            const tncList = allTnc.filter(t => t.status === 'ACTIVE');
            this._tncList = tncList;

            const select = document.getElementById('tnc_name_select');
            if (select && tncList.length > 0) {
                select.innerHTML = '<option value="">None (skip)</option>' +
                    tncList.map(tnc => `<option value="${tnc.name}">${tnc.name}</option>`).join('');

                // When user selects a TNC, show its data
                select.addEventListener('change', () => {
                    const wrapper = document.getElementById('tnc-data-wrapper');
                    const content = document.getElementById('tnc-data-content');
                    const selected = tncList.find(t => t.name === select.value);
                    if (selected && select.value) {
                        content.textContent = selected.data || '';
                        wrapper.style.display = '';
                    } else {
                        wrapper.style.display = 'none';
                    }
                });
            }
        } catch (error) {
            console.error('Error loading T&C:', error);
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
            const responseData = Array.isArray(data) ? (data.length > 0 ? data[0] : {}) : data;
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

        // Fetch template detail (with is_required / is_mandatory per field) if not cached
        if (!this._templateDetailCache) this._templateDetailCache = {};
        if (!this._templateDetailCache[templateId]) {
            try {
                const token = this.factwiseIntegration?.getToken() || this.tokenManager?.getToken();
                const baseUrl = this.environmentManager.getFactwiseBaseUrl();
                const entityId = this._entityId || '20d11e41-5ee0-40f1-9f01-a619d20e74e3';
                const detailUrl = `${baseUrl}module_templates/${entityId}/${templateId}/`;
                console.log('Fetching template detail:', detailUrl);
                const res = await fetch(detailUrl, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
                });
                if (res.ok) {
                    const detail = await res.json();
                    this._templateDetailCache[templateId] = detail;
                    console.log('✓ Cached template detail for', templateId);
                } else {
                    console.warn('Template detail fetch failed:', res.status, '— using list data');
                }
            } catch (e) {
                console.warn('Template detail fetch error:', e.message, '— using list data');
            }
        }

        // Merge detail section_list if available (has is_required per field)
        const detail = this._templateDetailCache[templateId];
        if (detail?.section_list) {
            template.section_list = detail.section_list;
        }

        console.log('✓ Template has', template.section_list?.length || 0, 'sections');

        // Parse template configuration and store it
        const config = this.templateManager.parseTemplateConfig(template);
        this.templateManager.templateConfig = config;
        this.templateManager.currentTemplate = template;
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
            const responseData = Array.isArray(data) ? (data.length > 0 ? data[0] : {}) : data;
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

        // Helper to apply enabled/disabled/locked state to a toggle
        const applyToggleState = (toggleId, enabled, rerender, forcedOn = false) => {
            const toggle = document.getElementById(toggleId);
            if (!toggle) return;
            const row = toggle.closest('.cc-toggle-row');

            if (forcedOn) {
                // Mandatory fields exist — lock toggle ON
                toggle.checked = true;
                toggle.disabled = true;
                if (row) {
                    row.style.opacity = '1';
                    row.style.cursor = 'default';
                    row.title = 'Required by template — cannot be turned off';
                }
                if (rerender) this._updateTierCostButtons();
                return;
            }

            toggle.disabled = !enabled;
            if (row) {
                row.style.opacity = enabled ? '1' : '0.5';
                row.style.cursor = enabled ? 'pointer' : 'not-allowed';
                row.title = enabled ? '' : 'Not available in selected template';
            }
            if (!enabled) {
                toggle.checked = false;
                if (rerender) this._updateTierCostButtons();
            }
        };

        const hasCostFields = config.itemLevel.costFields?.length > 0;
        const hasTaxFields = config.itemLevel.taxFields?.length > 0;
        const hasMandatoryCosts = (config.itemLevel.costFields || []).some(f => f.is_mandatory);
        const hasMandatoryTaxes = (config.itemLevel.taxFields || []).some(f => f.is_mandatory);

        applyToggleState('toggle-additional-costs', hasCostFields, true, hasMandatoryCosts);
        applyToggleState('toggle-taxes', hasTaxFields, true, hasMandatoryTaxes);
        // No discount toggle — auto-managed by template config

        // Also apply to update form toggles
        applyToggleState('toggle-additional-costs-update', hasCostFields, true, hasMandatoryCosts);
        applyToggleState('toggle-taxes-update', hasTaxFields, true, hasMandatoryTaxes);

        // Discount: auto-update tier buttons since there's no toggle
        this._updateTierCostButtons();
        this._updateTierCostButtons(true);

        // Contract custom — also hide section when disabled
        const contractCustomHas = config.contractLevel.customSections.length > 0;
        const hasMandatoryContractCustom = (config.contractLevel.customSections || []).some(f => f.is_mandatory);
        applyToggleState('toggle-contract-custom', contractCustomHas, false, hasMandatoryContractCustom);
        applyToggleState('toggle-contract-custom-update', contractCustomHas, false, hasMandatoryContractCustom);
        if (!contractCustomHas) {
            const section = document.getElementById('contract-custom-section');
            if (section) section.classList.remove('visible');
            const sectionU = document.getElementById('contract-custom-section-update');
            if (sectionU) sectionU.classList.remove('visible');
        } else if (hasMandatoryContractCustom) {
            // Auto-open and pre-populate mandatory contract custom sections
            const section = document.getElementById('contract-custom-section');
            if (section) section.classList.add('visible');
            const container = document.getElementById('contract-custom-container');
            if (container && container.children.length === 0) {
                this._addContractCustomSection();
                this._preFillMandatoryCustomFields(container.lastElementChild, 'contract');
            }
        }

        const itemCustomHas = config.itemLevel.customSections.length > 0;
        const hasMandatoryItemCustom = (config.itemLevel.customSections || []).some(f => f.is_mandatory);
        applyToggleState('toggle-item-custom', itemCustomHas, false, hasMandatoryItemCustom);
        applyToggleState('toggle-item-custom-update', itemCustomHas, false, hasMandatoryItemCustom);
        if (!itemCustomHas) {
            this._updateItemCustomVisibility();
            this._updateItemCustomVisibility(true);
        } else if (hasMandatoryItemCustom) {
            // Show item custom sections (toggle is locked on — make visible)
            this._updateItemCustomVisibility();
            this._updateItemCustomVisibility(true);
        }

        console.log('✓ Form visibility updated based on template');
    }

    _updateTierCostButtons(isUpdate = false) {
        const suffix = isUpdate ? '-update' : '';
        const showCost = document.getElementById(`toggle-additional-costs${suffix}`)?.checked || false;
        const showTax = document.getElementById(`toggle-taxes${suffix}`)?.checked || false;
        // Discount has no toggle — auto-derived from template config
        const showDiscount = (this.templateManager?.getCurrentConfig?.()?.itemLevel?.discountFields?.length || 0) > 0;
        const showAny = showCost || showTax || showDiscount;

        const container = document.getElementById(isUpdate ? 'contract-items-container-update' : 'contract-items-container');
        if (!container) return;

        container.querySelectorAll('.cc-tier-card').forEach(tierCard => {
            const itemIndex = tierCard.closest('.cc-item-card')?.dataset.itemIndex;
            const tierIndex = tierCard.dataset.tierIndex;

            // Show/hide the whole costs section
            let costsSection = tierCard.querySelector('.tier-costs-section');
            if (showAny && !costsSection) {
                // Create the costs section if it doesn't exist yet
                costsSection = document.createElement('div');
                costsSection.className = 'tier-costs-section';
                // Auto-add mandatory cost/tax/discount rows
                const mandatory = this._renderMandatoryCostRows(parseInt(itemIndex), parseInt(tierIndex));
                costsSection.innerHTML = `
                    <p style="font-size:12px;color:#64748b;margin:8px 0 4px;">Tier Costs</p>
                    ${mandatory.html}
                    <div id="item-${itemIndex}-tier-${tierIndex}-costs"></div>
                    <div class="tier-cost-btns" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;"></div>`;
                tierCard.appendChild(costsSection);
            }
            if (costsSection) costsSection.style.display = showAny ? '' : 'none';

            const btnContainer = tierCard.querySelector('.tier-cost-btns');
            if (!btnContainer) return;

            // Update buttons
            const mkBtn = (type, label) => {
                const b = document.createElement('button');
                b.type = 'button';
                b.className = 'btn-add-row';
                b.style.cssText = 'font-size:11px;padding:3px 8px;';
                b.textContent = `+ ${label}`;
                b.onclick = () => window.uiController._addTierCostRow(parseInt(itemIndex), parseInt(tierIndex), type);
                b.dataset.costType = type;
                return b;
            };

            // Remove existing buttons and re-add only enabled ones
            btnContainer.innerHTML = '';
            if (showCost) btnContainer.appendChild(mkBtn('cost', 'Additional Cost'));
            if (showTax) btnContainer.appendChild(mkBtn('tax', 'Tax'));
            if (showDiscount) btnContainer.appendChild(mkBtn('discount', 'Discount'));
        });
    }

    _updateItemCustomVisibility(isUpdate = false) {
        const suffix = isUpdate ? '-update' : '';
        const show = document.getElementById(`toggle-item-custom${suffix}`)?.checked || false;
        const container = document.getElementById(isUpdate ? 'contract-items-container-update' : 'contract-items-container');
        if (!container) return;
        container.querySelectorAll('.cc-item-custom-section-wrapper').forEach(el => {
            el.style.display = show ? '' : 'none';
        });
    }
}
