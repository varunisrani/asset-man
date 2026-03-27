/**
 * App Main Entry & Routing Logic
 */

const bootApp = () => {
    // DOM Elements
    const viewContainer = document.getElementById('view-container');
    const navItems = document.querySelectorAll('.nav-item');

    // Modal Elements
    const modal = document.getElementById('asset-modal');
    const btnAddAsset = document.getElementById('btn-add-asset');
    const btnCloseModal = document.getElementById('btn-close-modal');
    const btnCancelModal = document.getElementById('btn-cancel-modal');
    const assetForm = document.getElementById('asset-form');

    // Ticket Modal Elements
    const ticketModal = document.getElementById('ticket-modal');
    const btnAddTicket = document.getElementById('btn-add-ticket');
    const btnCloseTicketModal = document.getElementById('btn-close-ticket-modal');
    const btnCancelTicketModal = document.getElementById('btn-cancel-ticket-modal');
    const ticketForm = document.getElementById('ticket-form');
    const ticketAssetSelect = document.getElementById('ticket-asset');

    // Asset Handover Modal Elements
    const handoverModal = document.getElementById('handover-modal');
    const btnCloseHandoverModal = document.getElementById('btn-close-handover-modal');
    const btnCancelHandoverModal = document.getElementById('btn-cancel-handover-modal');
    const handoverForm = document.getElementById('handover-form');
    const handoverAssetId = document.getElementById('handover-asset-id');
    const handoverAssetName = document.getElementById('handover-asset-name');

    // License Modal Elements
    const licenseModal = document.getElementById('license-modal');
    const btnAddLicense = document.getElementById('btn-add-license');
    const btnCloseLicenseModal = document.getElementById('btn-close-license-modal');
    const btnCancelLicenseModal = document.getElementById('btn-cancel-license-modal');
    const licenseForm = document.getElementById('license-form');

    // Vendor Modal Elements
    const vendorModal = document.getElementById('vendor-modal');
    const btnCloseVendorModal = document.getElementById('btn-close-vendor-modal');
    const btnCancelVendorModal = document.getElementById('btn-cancel-vendor-modal');
    const vendorForm = document.getElementById('vendor-form');

    // PO Modal Elements
    const poModal = document.getElementById('po-modal');
    const btnClosePoModal = document.getElementById('btn-close-po-modal');
    const btnCancelPoModal = document.getElementById('btn-cancel-po-modal');
    const poForm = document.getElementById('po-form');
    const poVendorSelect = document.getElementById('po-vendor');

    // Settings Modal Elements
    const categoryModal = document.getElementById('category-modal');
    const btnCloseCatModal = document.getElementById('btn-close-cat-modal');
    const btnCancelCatModal = document.getElementById('btn-cancel-cat-modal');
    const categoryForm = document.getElementById('category-form');

    const statusModal = document.getElementById('status-modal');
    const btnCloseStatusModal = document.getElementById('btn-close-status-modal');
    const btnCancelStatusModal = document.getElementById('btn-cancel-status-modal');
    const statusForm = document.getElementById('status-form');

    // Search Element
    const searchInput = document.querySelector('.search-bar input');

    // Current State
    let currentView = 'dashboard';
    let currentSearchTerm = '';

    const initDatePickers = () => {
        const dateInputs = document.querySelectorAll('[data-datepicker="true"]');
        if (!dateInputs.length) return;

        if (typeof window.flatpickr !== 'function') {
            window.setTimeout(initDatePickers, 100);
            return;
        }

        dateInputs.forEach((input) => {
            if (input.dataset.datepickerBound === 'true') return;

            window.flatpickr(input, {
                altInput: true,
                altFormat: 'F j, Y',
                dateFormat: 'Y-m-d',
                allowInput: true,
                disableMobile: true,
                monthSelectorType: 'static',
                position: 'auto center'
            });

            input.dataset.datepickerBound = 'true';
        });
    };

    const clearDatePicker = (input) => {
        if (input && input._flatpickr) {
            input._flatpickr.clear();
        }
    };

    // Init Logic
    const init = async () => {
        const loaded = await window.appStore.init();
        if (!loaded) {
            viewContainer.innerHTML = `
                <div class="animate-fade-in empty-state glass-panel">
                    <i class="ph ph-database"></i>
                    <h2>Unable to load data</h2>
                    <p style="margin-top: 1rem;">Check Supabase connection, table names, and RLS policies.</p>
                </div>
            `;
        } else {
            render();
        }

        setupEventListeners();
        initDatePickers();

        // Listen to store changes to re-render UI
        window.appStore.subscribe(() => {
            render();
        });

        // Refresh Data Utility
        const btnResetData = document.getElementById('btn-reset-data');
        if (btnResetData) {
            btnResetData.addEventListener('click', async () => {
                await window.appStore.refreshAll();
            });
        }
    };

    // Render the active view
    const render = () => {
        if (currentView === 'dashboard') {
            viewContainer.innerHTML = window.renderDashboard(window.appStore);

            // Attach specific dashboard events
            const dashAddBtn = document.getElementById('btn-add-dashboard');
            if (dashAddBtn) dashAddBtn.addEventListener('click', openModal);

        } else if (currentView === 'assets') {
            viewContainer.innerHTML = window.renderAssetList(window.appStore, currentSearchTerm);
        } else if (currentView === 'tickets') {
            viewContainer.innerHTML = window.renderTickets(window.appStore);

            // Re-attach local event listener since DOM was replaced
            const localAddTicketBtn = document.getElementById('btn-add-ticket');
            if (localAddTicketBtn) {
                localAddTicketBtn.addEventListener('click', openTicketModal);
            }
        } else if (currentView === 'licenses') {
            viewContainer.innerHTML = window.renderLicenses(window.appStore);

            // Re-attach local event listener since DOM was replaced
            const localAddLicenseBtn = document.getElementById('btn-add-license');
            if (localAddLicenseBtn) {
                localAddLicenseBtn.addEventListener('click', openLicenseModal);
            }
        } else if (currentView === 'procurement') {
            viewContainer.innerHTML = window.renderProcurement(window.appStore);

            const localAddVendorBtn = document.getElementById('btn-add-vendor');
            if (localAddVendorBtn) localAddVendorBtn.addEventListener('click', openVendorModal);

            const localAddPoBtn = document.getElementById('btn-add-po');
            if (localAddPoBtn) localAddPoBtn.addEventListener('click', openPoModal);

        } else if (currentView === 'reports') {
            viewContainer.innerHTML = window.renderReports(window.appStore);
        } else if (currentView === 'settings') {
            viewContainer.innerHTML = window.renderSettings(window.appStore);

            const localAddCatBtn = document.getElementById('btn-add-category');
            if (localAddCatBtn) localAddCatBtn.addEventListener('click', () => categoryModal.classList.add('show'));

            const localAddStatusBtn = document.getElementById('btn-add-status');
            if (localAddStatusBtn) localAddStatusBtn.addEventListener('click', () => statusModal.classList.add('show'));
        } else {
            viewContainer.innerHTML = `
                <div class="animate-fade-in empty-state glass-panel">
                    <i class="ph ph-wrench"></i>
                    <h2>Under Construction</h2>
                    <p style="margin-top: 1rem;">The ${currentView} module is coming soon.</p>
                </div>
            `;
        }

        // Update navigation active states
        navItems.forEach(item => {
            if (item.dataset.view === currentView) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    };

    // Setup DOM Listeners
    const setupEventListeners = () => {
        // Navigation clicks
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const view = item.dataset.view;
                if (view) {
                    navigate(view);
                }
            });
        });

        // Search Input
        searchInput.addEventListener('input', (e) => {
            currentSearchTerm = e.target.value;
            if (currentSearchTerm && currentView === 'dashboard') {
                currentView = 'assets';
            }
            render();
        });

        // Modal triggers
        btnAddAsset.addEventListener('click', openModal);
        btnCloseModal.addEventListener('click', closeModal);
        btnCancelModal.addEventListener('click', closeModal);

        // Ticket Modal triggers - attached dynamically inside render but also here if exist on load
        if (btnAddTicket) btnAddTicket.addEventListener('click', openTicketModal);
        btnCloseTicketModal.addEventListener('click', closeTicketModal);
        btnCancelTicketModal.addEventListener('click', closeTicketModal);
        ticketForm.addEventListener('submit', handleTicketFormSubmit);

        // License Modal triggers
        if (btnAddLicense) btnAddLicense.addEventListener('click', openLicenseModal);
        btnCloseLicenseModal.addEventListener('click', closeLicenseModal);
        btnCancelLicenseModal.addEventListener('click', closeLicenseModal);
        licenseForm.addEventListener('submit', handleLicenseFormSubmit);

        // Vendor Modal triggers
        btnCloseVendorModal.addEventListener('click', closeVendorModal);
        btnCancelVendorModal.addEventListener('click', closeVendorModal);
        vendorForm.addEventListener('submit', handleVendorFormSubmit);

        // PO Modal triggers
        btnClosePoModal.addEventListener('click', closePoModal);
        btnCancelPoModal.addEventListener('click', closePoModal);
        poForm.addEventListener('submit', handlePoFormSubmit);

        // Handover Modal triggers
        btnCloseHandoverModal.addEventListener('click', closeHandoverModal);
        btnCancelHandoverModal.addEventListener('click', closeHandoverModal);
        handoverForm.addEventListener('submit', handleHandoverFormSubmit);

        // Settings Modals triggers
        btnCloseCatModal.addEventListener('click', closeCatModal);
        btnCancelCatModal.addEventListener('click', closeCatModal);
        categoryForm.addEventListener('submit', handleCategoryFormSubmit);

        btnCloseStatusModal.addEventListener('click', closeStatusModal);
        btnCancelStatusModal.addEventListener('click', closeStatusModal);
        statusForm.addEventListener('submit', handleStatusFormSubmit);

        // Asset Form Submission
        assetForm.addEventListener('submit', handleFormSubmit);
    };

    // Routing Simulation
    const navigate = (view) => {
        currentView = view;
        if (view === 'dashboard') {
            currentSearchTerm = '';
            searchInput.value = '';
        }
        render();
    };

    // Expose router to global scope for inline onclicks
    window.appRouter = { navigate };

    // --- Modal Logic ---
    const populateAssetDropdowns = () => {
        const catSelect = document.getElementById('asset-category');
        const statusSelect = document.getElementById('asset-status');

        // Populate Categories
        const categories = window.appStore.getCategories();
        catSelect.innerHTML = '<option value="">-- Select Category --</option>';
        categories.forEach(c => {
            const option = document.createElement('option');
            option.value = c.name.toLowerCase();
            option.textContent = c.name;
            catSelect.appendChild(option);
        });

        // Populate Statuses
        const statuses = window.appStore.getStatuses();
        statusSelect.innerHTML = '<option value="">-- Select Status --</option>';
        statuses.forEach(s => {
            const option = document.createElement('option');
            option.value = s.name.toLowerCase();
            option.textContent = s.name;
            statusSelect.appendChild(option);
        });
    };

    const openModal = () => {
        populateAssetDropdowns();
        modal.classList.add('show');
    };

    const closeModal = () => {
        modal.classList.remove('show');
        assetForm.reset();
        clearDatePicker(document.getElementById('asset-purchase-date'));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        const newAsset = {
            name: document.getElementById('asset-name').value,
            manufacturer: document.getElementById('asset-manufacturer').value,
            model: document.getElementById('asset-model').value,
            serial: document.getElementById('asset-serial').value,
            category: document.getElementById('asset-category').value,
            status: document.getElementById('asset-status').value,
            value: parseFloat(document.getElementById('asset-value').value),
            purchaseDate: document.getElementById('asset-purchase-date').value,
            assignee: document.getElementById('asset-assignee').value,
        };

        window.appStore.add(newAsset);
        closeModal();
    };

    // --- Ticket Modal Logic ---
    const populateTicketAssetDropdown = () => {
        const assets = window.appStore.getAll();
        ticketAssetSelect.innerHTML = '<option value="">-- Select Asset --</option>';
        assets.forEach(asset => {
            const option = document.createElement('option');
            option.value = asset.id;
            option.textContent = `${asset.name} (${asset.serial || asset.id})`;
            ticketAssetSelect.appendChild(option);
        });
    };

    const openTicketModal = () => {
        populateTicketAssetDropdown();
        ticketModal.classList.add('show');
    };

    const closeTicketModal = () => {
        ticketModal.classList.remove('show');
        ticketForm.reset();
    };

    const handleTicketFormSubmit = (e) => {
        e.preventDefault();

        const assetId = ticketAssetSelect.value;
        const selectedAsset = window.appStore.getAll().find(a => a.id === assetId);

        const newTicket = {
            title: document.getElementById('ticket-title').value,
            assetId: assetId,
            assetName: selectedAsset ? selectedAsset.name : 'Unknown',
            priority: document.getElementById('ticket-priority').value,
            status: document.getElementById('ticket-status').value,
            description: document.getElementById('ticket-description').value,
            assignee: 'Unassigned',
        };

        window.appStore.addTicket(newTicket);
        closeTicketModal();
    };

    // --- License Modal Logic ---
    const openLicenseModal = () => {
        licenseModal.classList.add('show');
    };

    const closeLicenseModal = () => {
        licenseModal.classList.remove('show');
        licenseForm.reset();
        clearDatePicker(document.getElementById('license-expiration'));
    };

    const handleLicenseFormSubmit = (e) => {
        e.preventDefault();

        const newLicense = {
            name: document.getElementById('license-name').value,
            vendor: document.getElementById('license-vendor').value,
            type: document.getElementById('license-type').value,
            status: document.getElementById('license-status').value,
            seatsTotal: parseInt(document.getElementById('license-seats-total').value, 10),
            seatsUsed: parseInt(document.getElementById('license-seats-used').value, 10),
            costPerSeat: parseFloat(document.getElementById('license-cost').value) || 0,
            expirationDate: document.getElementById('license-expiration').value,
        };

        window.appStore.addLicense(newLicense);
        closeLicenseModal();
    };

    // --- Procurement Modals Logic ---
    const openVendorModal = () => {
        vendorModal.classList.add('show');
    };

    const closeVendorModal = () => {
        vendorModal.classList.remove('show');
        vendorForm.reset();
    };

    const handleVendorFormSubmit = (e) => {
        e.preventDefault();
        const newVendor = {
            name: document.getElementById('vendor-name').value,
            contact: document.getElementById('vendor-contact').value,
            email: document.getElementById('vendor-email').value,
            phone: document.getElementById('vendor-phone').value,
            sla: document.getElementById('vendor-sla').value,
            status: document.getElementById('vendor-status').value
        };
        window.appStore.addVendor(newVendor);
        closeVendorModal();
    };

    const populatePoVendorDropdown = () => {
        const vendors = window.appStore.getVendors();
        poVendorSelect.innerHTML = '<option value="">-- Select Vendor --</option>';
        vendors.forEach(v => {
            const option = document.createElement('option');
            option.value = v.id;
            option.textContent = v.name;
            poVendorSelect.appendChild(option);
        });
    };

    const openPoModal = () => {
        populatePoVendorDropdown();
        poModal.classList.add('show');
    };

    const closePoModal = () => {
        poModal.classList.remove('show');
        poForm.reset();
        clearDatePicker(document.getElementById('po-date'));
    };

    const handlePoFormSubmit = (e) => {
        e.preventDefault();
        const vendorId = poVendorSelect.value;
        const vendorObj = window.appStore.getVendors().find(v => v.id === vendorId);

        const newPO = {
            poNumber: document.getElementById('po-number').value,
            vendorId: vendorId,
            vendorName: vendorObj ? vendorObj.name : 'Unknown',
            orderDate: document.getElementById('po-date').value,
            amount: parseFloat(document.getElementById('po-amount').value),
            status: document.getElementById('po-status').value
        };
        window.appStore.addPurchaseOrder(newPO);
        closePoModal();
    };

    // --- Handover Modal Logic ---
    window.openHandoverModal = (id, name) => {
        handoverAssetId.value = id;
        handoverAssetName.value = name;
        handoverModal.classList.add('show');
    };

    const closeHandoverModal = () => {
        handoverModal.classList.remove('show');
        handoverForm.reset();
        clearDatePicker(document.getElementById('handover-date'));
    };

    const handleHandoverFormSubmit = (e) => {
        e.preventDefault();

        const assetId = handoverAssetId.value;
        const assignmentData = {
            employee: document.getElementById('handover-employee').value,
            department: document.getElementById('handover-department').value,
            location: document.getElementById('handover-location').value,
            date: document.getElementById('handover-date').value
        };

        window.appStore.assignAsset(assetId, assignmentData);
        closeHandoverModal();
    };

    // --- Settings Modal Logic ---
    const closeCatModal = () => {
        categoryModal.classList.remove('show');
        categoryForm.reset();
    };

    const handleCategoryFormSubmit = (e) => {
        e.preventDefault();
        const newCat = {
            name: document.getElementById('cat-name').value,
            description: document.getElementById('cat-desc').value,
            color: document.getElementById('cat-color').value
        };
        window.appStore.addCategory(newCat);
        closeCatModal();
    };

    const closeStatusModal = () => {
        statusModal.classList.remove('show');
        statusForm.reset();
    };

    const handleStatusFormSubmit = (e) => {
        e.preventDefault();
        const newStatus = {
            name: document.getElementById('status-name').value,
            color: document.getElementById('status-color').value
        };
        window.appStore.addStatus(newStatus);
        closeStatusModal();
    };

    // Global action handlers
    window.deleteAsset = (id) => {
        if (confirm('Are you sure you want to delete this asset?')) {
            window.appStore.remove(id);
        }
    };

    window.deleteLicense = (id) => {
        if (confirm('Are you sure you want to delete this license?')) {
            window.appStore.removeLicense(id);
        }
    };

    window.deleteVendor = (id) => {
        if (confirm('Are you sure you want to delete this vendor?')) {
            window.appStore.removeVendor(id);
        }
    };

    window.deletePurchaseOrder = (id) => {
        if (confirm('Are you sure you want to delete this purchase order?')) {
            window.appStore.removePurchaseOrder(id);
        }
    };

    window.deleteCategory = (id) => {
        if (confirm('Are you sure you want to delete this system category?')) {
            window.appStore.removeCategory(id);
        }
    };

    window.deleteStatus = (id) => {
        if (confirm('Are you sure you want to delete this status label?')) {
            window.appStore.removeStatus(id);
        }
    };

    window.clearSearch = () => {
        currentSearchTerm = '';
        searchInput.value = '';
        render();
    };

    window.downloadReport = () => {
        const csvContent = window.appStore.getExportData();
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `nexus_asset_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Boot app
    init();
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootApp);
} else {
    bootApp();
}
