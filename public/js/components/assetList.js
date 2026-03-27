/**
 * Asset List Component
 * Renders the full grid of assets
 */

const renderAssetList = (store, searchTerm = '') => {
    let assets = store.getAll();

    // Sort by newest first
    assets = assets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Filter by search term if provided
    if (searchTerm) {
        const lowerSearch = searchTerm.toLowerCase();
        assets = assets.filter(a =>
            a.name.toLowerCase().includes(lowerSearch) ||
            a.category.toLowerCase().includes(lowerSearch) ||
            (a.assignee && a.assignee.toLowerCase().includes(lowerSearch))
        );
    }

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
    };

    const getCategoryIcon = (cat) => {
        const icons = {
            'hardware': 'ph-laptop',
            'software': 'ph-code',
            'furniture': 'ph-armchair',
            'vehicle': 'ph-car',
            'other': 'ph-box'
        };
        return icons[cat] || 'ph-box';
    };

    return `
        <div class="animate-fade-in">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <h2 style="font-size: 1.5rem;">Asset Inventory</h2>
                <span style="color: var(--color-text-muted);">${assets.length} items found</span>
            </div>
            
            <div class="glass-panel">
                <div class="table-container">
                    ${assets.length > 0 ? `
                        <table id="asset-table">
                            <thead>
                                <tr>
                                    <th>Asset Details</th>
                                    <th>Specs & Serial</th>
                                    <th>Category</th>
                                    <th>Assigned To</th>
                                    <th>Purchase Date</th>
                                    <th>Status</th>
                                    <th>Value</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${assets.map(asset => `
                                    <tr>
                                        <td>
                                            <div style="display: flex; flex-direction: column; gap: 0.25rem;">
                                                <strong>${asset.name}</strong>
                                                <span style="font-size: 0.75rem; color: var(--color-text-muted);">${asset.manufacturer || 'Unknown'}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div style="display: flex; flex-direction: column; gap: 0.25rem;">
                                                <span>${asset.model || '-'}</span>
                                                <span style="font-size: 0.75rem; color: var(--color-text-muted);">SN: ${asset.serial || '-'}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div style="display: flex; align-items: center; gap: 0.5rem; text-transform: capitalize;">
                                                <i class="ph ${getCategoryIcon(asset.category)}"></i>
                                                ${asset.category}
                                            </div>
                                        </td>
                                        <td>
                                            ${asset.assignment ? `
                                                <div style="display: flex; flex-direction: column; gap: 0.25rem;">
                                                    <strong>${asset.assignment.employee}</strong>
                                                    <span style="font-size: 0.75rem; color: var(--color-text-muted); text-transform: capitalize;"><i class="ph ph-buildings" style="margin-right: 0.25rem;"></i>${asset.assignment.department} - ${asset.assignment.location}</span>
                                                </div>
                                            ` : (asset.assignee || '<span style="color: var(--color-text-muted); font-style: italic;">Unassigned</span>')}
                                        </td>
                                        <td>${new Date(asset.purchaseDate).toLocaleDateString()}</td>
                                        <td>
                                            <span class="status-pill status-${asset.status}">
                                                ${asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}
                                            </span>
                                        </td>
                                        <td><strong>${formatCurrency(asset.value)}</strong></td>
                                        <td>
                                            <div class="action-group">
                                                <button class="action-btn" title="View Details" onclick="alert('View Details feature coming soon!')">
                                                    <i class="ph ph-eye"></i>
                                                </button>
                                                <button class="action-btn" onclick="window.openHandoverModal('${asset.id}', '${asset.name.replace(/'/g, "\\'")}')" title="Assign Handover">
                                                    <i class="ph ph-handshake"></i>
                                                </button>
                                                <button class="action-btn delete" onclick="window.deleteAsset('${asset.id}')" title="Delete Asset">
                                                    <i class="ph ph-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    ` : `
                        <div class="empty-state">
                            <i class="ph ph-magnifying-glass"></i>
                            <p>No assets found matching your criteria.</p>
                            ${searchTerm ? `<button class="btn btn-primary" onclick="window.clearSearch()">Clear Search</button>` : ''}
                        </div>
                    `}
                </div>
            </div>
        </div>
    `;
};

window.renderAssetList = renderAssetList;
