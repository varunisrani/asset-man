/**
 * Procurement & Vendor Management Component
 */

const renderProcurement = (store) => {
    let vendors = store.getVendors();
    let purchaseOrders = store.getPurchaseOrders();

    // Sort newest first
    vendors = vendors.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    purchaseOrders = purchaseOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
    };

    return `
        <div class="animate-fade-in">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                <div>
                    <h2 style="font-size: 1.5rem; margin-bottom: 0.5rem;">Procurement & Vendors</h2>
                    <p style="color: var(--color-text-muted);">Manage external vendors, contracts, and purchase orders.</p>
                </div>
            </div>
            
            <div class="grid" style="grid-template-columns: 1fr; gap: 2rem;">
                
                <!-- Purchase Orders Section -->
                <div class="glass-panel" style="padding: 1.5rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <i class="ph ph-receipt" style="color: var(--color-primary); font-size: 1.25rem;"></i>
                            <h3 style="font-size: 1.1rem; font-weight: 500;">Purchase Orders</h3>
                        </div>
                        <button class="btn btn-primary" id="btn-add-po" style="padding: 0.5rem 1rem;">
                            <i class="ph ph-plus"></i> New PO
                        </button>
                    </div>
                    
                    <div class="table-container">
                        ${purchaseOrders.length > 0 ? `
                            <table id="po-table">
                                <thead>
                                    <tr>
                                        <th>PO Number</th>
                                        <th>Vendor</th>
                                        <th>Order Date</th>
                                        <th>Status</th>
                                        <th>Total Amount</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${purchaseOrders.map(po => `
                                        <tr>
                                            <td><strong>${po.poNumber}</strong></td>
                                            <td>${po.vendorName}</td>
                                            <td>${new Date(po.orderDate).toLocaleDateString()}</td>
                                            <td>
                                                <span class="status-pill status-${po.status}">
                                                    ${po.status.charAt(0).toUpperCase() + po.status.slice(1)}
                                                </span>
                                            </td>
                                            <td><strong>${formatCurrency(po.amount)}</strong></td>
                                            <td>
                                                <div class="action-group">
                                                    <button class="action-btn delete" onclick="window.deletePurchaseOrder('${po.id}')" title="Delete PO">
                                                        <i class="ph ph-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        ` : `
                            <div class="empty-state" style="padding: 2rem 0;">
                                <i class="ph ph-receipt"></i>
                                <p>No purchase orders found.</p>
                            </div>
                        `}
                    </div>
                </div>

                <!-- Vendors Section -->
                <div class="glass-panel" style="padding: 1.5rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <i class="ph ph-storefront" style="color: var(--color-primary); font-size: 1.25rem;"></i>
                            <h3 style="font-size: 1.1rem; font-weight: 500;">Vendor Directory</h3>
                        </div>
                        <button class="btn glass-btn" id="btn-add-vendor" style="padding: 0.5rem 1rem;">
                            <i class="ph ph-plus"></i> New Vendor
                        </button>
                    </div>
                    
                    <div class="table-container">
                        ${vendors.length > 0 ? `
                            <table id="vendor-table">
                                <thead>
                                    <tr>
                                        <th>Vendor / Partner</th>
                                        <th>Primary Contact</th>
                                        <th>Support SLA</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${vendors.map(vendor => `
                                        <tr>
                                            <td><strong>${vendor.name}</strong></td>
                                            <td>
                                                <div style="display: flex; flex-direction: column; gap: 0.25rem;">
                                                    <span>${vendor.contact}</span>
                                                    <span style="font-size: 0.75rem; color: var(--color-text-muted);"><a href="mailto:${vendor.email}" style="color: inherit;">${vendor.email}</a> • ${vendor.phone}</span>
                                                </div>
                                            </td>
                                            <td>${vendor.sla}</td>
                                            <td>
                                                <span class="status-pill status-${vendor.status}">
                                                    ${vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                                                </span>
                                            </td>
                                            <td>
                                                <div class="action-group">
                                                    <button class="action-btn delete" onclick="window.deleteVendor('${vendor.id}')" title="Delete Vendor">
                                                        <i class="ph ph-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        ` : `
                            <div class="empty-state" style="padding: 2rem 0;">
                                <i class="ph ph-storefront"></i>
                                <p>No vendors registered.</p>
                            </div>
                        `}
                    </div>
                </div>
                
            </div>
        </div>
    `;
};

window.renderProcurement = renderProcurement;
