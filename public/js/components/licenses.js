/**
 * Software License Management Component
 * Renders the license inventory and utilization metrics
 */

const renderLicenses = (store) => {
    let licenses = store.getLicenses ? store.getLicenses() : [];

    // Sort by name
    licenses = licenses.sort((a, b) => a.name.localeCompare(b.name));

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
    };

    const getStatusPillClass = (status, total, used) => {
        if (status === 'expired') return 'status-retired';
        if (status === 'over-allocated' || used > total) return 'status-retired'; // Red if using more than bought
        if (used === total) return 'status-maintenance'; // Orange if maxed out
        return 'status-active'; // Green otherwise
    };

    return `
        <div class="animate-fade-in">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <h2 style="font-size: 1.5rem;">Software Licenses</h2>
                <button class="btn btn-primary" id="btn-add-license">
                    <i class="ph ph-plus"></i> Add License
                </button>
            </div>
            
            <div class="glass-panel">
                <div class="table-container">
                    ${licenses.length > 0 ? `
                        <table id="license-table">
                            <thead>
                                <tr>
                                    <th>Software Details</th>
                                    <th>Model</th>
                                    <th>Utilization</th>
                                    <th>Cost / Seat</th>
                                    <th>Expiration</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${licenses.map(lic => {
        const utilizationPercent = Math.round((lic.seatsUsed / lic.seatsTotal) * 100) || 0;
        const progressColor = utilizationPercent > 100 ? 'var(--color-danger)' : (utilizationPercent === 100 ? 'var(--color-warning)' : 'var(--color-success)');

        return `
                                    <tr>
                                        <td>
                                            <div style="display: flex; flex-direction: column; gap: 0.25rem;">
                                                <strong>${lic.name}</strong>
                                                <span style="font-size: 0.75rem; color: var(--color-text-muted);">${lic.vendor}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div style="display: flex; align-items: center; gap: 0.5rem; text-transform: capitalize;">
                                                <i class="ph ph-shield-check"></i>
                                                ${lic.type}
                                            </div>
                                        </td>
                                        <td>
                                            <div style="display: flex; flex-direction: column; gap: 0.25rem; width: 100px;">
                                                <div style="display: flex; justify-content: space-between; font-size: 0.75rem;">
                                                    <span>${lic.seatsUsed} / ${lic.seatsTotal}</span>
                                                    <span style="color: ${progressColor}">${utilizationPercent}%</span>
                                                </div>
                                                <div style="width: 100%; height: 4px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden;">
                                                    <div style="width: ${Math.min(utilizationPercent, 100)}%; height: 100%; background: ${progressColor};"></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>${formatCurrency(lic.costPerSeat)}</td>
                                        <td>${lic.expirationDate ? new Date(lic.expirationDate).toLocaleDateString() : '<span class="text-muted">Perpetual</span>'}</td>
                                        <td>
                                            <span class="status-pill ${getStatusPillClass(lic.status, lic.seatsTotal, lic.seatsUsed)}">
                                                ${lic.seatsUsed > lic.seatsTotal ? 'OVER ALLOCATED' : lic.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td>
                                            <div class="action-group">
                                                <button class="action-btn delete" onclick="window.deleteLicense('${lic.id}')" title="Delete License">
                                                    <i class="ph ph-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    `;
    }).join('')}
                            </tbody>
                        </table>
                    ` : `
                        <div class="empty-state">
                            <i class="ph ph-key"></i>
                            <p>No software licenses configured.</p>
                            <span style="font-size: 0.875rem;">Track your SaaS subscriptions and perpetual keys here.</span>
                        </div>
                    `}
                </div>
            </div>
        </div>
    `;
};

window.renderLicenses = renderLicenses;
