/**
 * Reporting Module Component
 * Renders data aggregations and export options
 */

const renderReports = (store) => {
    const metrics = store.getMetrics();
    const assetByCategory = store.getAssetCategoryReport();
    const ticketsByStatus = store.getTicketStatusReport();
    const licenses = store.getLicenses();

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
    };

    return `
        <div class="animate-fade-in">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <h2 style="font-size: 1.5rem;">Reporting & Analytics</h2>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="btn btn-primary glass-btn" onclick="window.print()">
                        <i class="ph ph-printer"></i> Print
                    </button>
                    <button class="btn btn-primary" onclick="window.downloadReport()">
                        <i class="ph ph-download-simple"></i> Export CSV
                    </button>
                </div>
            </div>

            <div class="dashboard-grid" style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));">
                
                <!-- Assets by Category Report -->
                <div class="glass-panel" style="padding: 1.5rem;">
                    <h3 style="margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                        <i class="ph ph-chart-pie-slice" style="color: var(--color-primary);"></i>
                        Assets by Category
                    </h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="border-bottom: 1px solid rgba(255,255,255,0.1); text-align: left;">
                                <th style="padding-bottom: 0.5rem;">Category</th>
                                <th style="padding-bottom: 0.5rem;">Count</th>
                                <th style="padding-bottom: 0.5rem;">Total Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${assetByCategory.length > 0 ? assetByCategory.map(row => `
                                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                                    <td style="padding: 0.75rem 0; text-transform: capitalize;">${row.category}</td>
                                    <td style="padding: 0.75rem 0;">${row.count}</td>
                                    <td style="padding: 0.75rem 0; font-weight: 500;">${formatCurrency(row.totalValue)}</td>
                                </tr>
                            `).join('') : `<tr><td colspan="3" style="padding: 1rem 0; text-align: center; color: var(--color-text-muted);">No data available</td></tr>`}
                        </tbody>
                        <tfoot>
                            <tr style="border-top: 1px solid rgba(255,255,255,0.2);">
                                <td style="padding: 0.75rem 0; font-weight: 600;">Total</td>
                                <td style="padding: 0.75rem 0; font-weight: 600;">${metrics.totalAssets}</td>
                                <td style="padding: 0.75rem 0; font-weight: 600;">${formatCurrency(metrics.totalValue)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <!-- Helpdesk Summary -->
                <div class="glass-panel" style="padding: 1.5rem;">
                    <h3 style="margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                        <i class="ph ph-lifebuoy" style="color: var(--color-warning);"></i>
                        Helpdesk Status
                    </h3>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: rgba(0,0,0,0.2); border-radius: var(--radius-md);">
                            <span>Open Tickets</span>
                            <span style="font-size: 1.5rem; font-weight: 600; color: var(--color-danger);">${ticketsByStatus.open}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: rgba(0,0,0,0.2); border-radius: var(--radius-md);">
                            <span>In Progress</span>
                            <span style="font-size: 1.5rem; font-weight: 600; color: var(--color-warning);">${ticketsByStatus['in-progress']}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: rgba(0,0,0,0.2); border-radius: var(--radius-md);">
                            <span>Resolved / Closed</span>
                            <span style="font-size: 1.5rem; font-weight: 600; color: var(--color-success);">${ticketsByStatus.resolved}</span>
                        </div>
                    </div>
                </div>

                <!-- License Utilization -->
                <div class="glass-panel" style="padding: 1.5rem; grid-column: 1 / -1;">
                    <h3 style="margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                        <i class="ph ph-shield-check" style="color: var(--color-success);"></i>
                        License Utilization Summary
                    </h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="border-bottom: 1px solid rgba(255,255,255,0.1); text-align: left;">
                                <th style="padding-bottom: 0.5rem;">Software</th>
                                <th style="padding-bottom: 0.5rem;">Usage Metrics</th>
                                <th style="padding-bottom: 0.5rem;">Compliance Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${licenses.length > 0 ? licenses.map(lic => {
        const utilizationPercent = Math.round((lic.seatsUsed / lic.seatsTotal) * 100) || 0;
        const isOverAllocated = utilizationPercent > 100;

        return `
                                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                                    <td style="padding: 1rem 0;">
                                        <strong>${lic.name}</strong><br>
                                        <span style="font-size: 0.75rem; color: var(--color-text-muted);">${lic.vendor}</span>
                                    </td>
                                    <td style="padding: 1rem 0; width: 40%;">
                                        <div style="display: flex; justify-content: space-between; font-size: 0.875rem; margin-bottom: 0.25rem;">
                                            <span>${lic.seatsUsed} of ${lic.seatsTotal} Seats Used</span>
                                            <span>${utilizationPercent}%</span>
                                        </div>
                                        <div style="width: 100%; height: 6px; background: rgba(255,255,255,0.1); border-radius: 6px; overflow: hidden;">
                                            <div style="width: ${Math.min(utilizationPercent, 100)}%; height: 100%; background: ${isOverAllocated ? 'var(--color-danger)' : 'var(--color-success)'};"></div>
                                        </div>
                                    </td>
                                    <td style="padding: 1rem 0;">
                                        ${isOverAllocated
                ? '<span style="color: var(--color-danger); display: flex; align-items: center; gap: 0.25rem;"><i class="ph ph-warning"></i> Audit Required</span>'
                : '<span style="color: var(--color-success); display: flex; align-items: center; gap: 0.25rem;"><i class="ph ph-check-circle"></i> Compliant</span>'}
                                    </td>
                                </tr>
                            `;
    }).join('') : `<tr><td colspan="3" style="padding: 1rem 0; text-align: center; color: var(--color-text-muted);">No license data available</td></tr>`}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    `;
};

window.renderReports = renderReports;
