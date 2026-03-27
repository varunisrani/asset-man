/**
 * Dashboard Component
 * Renders the overview metrics and recent activity
 */

const renderDashboard = (store) => {
    const metrics = store.getMetrics();
    const assets = store.getAll();

    // Get 5 most recent assets
    const recentAssets = [...assets]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

    // Format currency
    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
    };

    return `
        <div class="animate-fade-in">
            <h2 style="margin-bottom: 1.5rem; font-size: 1.5rem;">Dashboard Overview</h2>
            
            <div class="dashboard-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));">
                <!-- Total Assets -->
                <div class="stat-card glass-panel">
                    <div class="stat-header">
                        <span class="stat-title">Total Assets</span>
                        <div class="stat-icon">
                            <i class="ph ph-database"></i>
                        </div>
                    </div>
                    <div class="stat-value">${metrics.totalAssets}</div>
                    <div class="stat-trend trend-up">
                        <i class="ph ph-trend-up"></i>
                        <span>Active tracking is up to date</span>
                    </div>
                </div>
                
                <!-- Total Value -->
                <div class="stat-card glass-panel">
                    <div class="stat-header">
                        <span class="stat-title">Total Value</span>
                        <div class="stat-icon" style="color: var(--color-success)">
                            <i class="ph ph-currency-dollar"></i>
                        </div>
                    </div>
                    <div class="stat-value">${formatCurrency(metrics.totalValue)}</div>
                    <div class="stat-trend trend-up">
                        <i class="ph ph-trend-up"></i>
                        <span>+2.4% from last month</span>
                    </div>
                </div>

                <!-- Active Assets -->
                <div class="stat-card glass-panel">
                    <div class="stat-header">
                        <span class="stat-title">Active Assets</span>
                        <div class="stat-icon" style="color: var(--color-warning)">
                            <i class="ph ph-check-circle"></i>
                        </div>
                    </div>
                    <div class="stat-value">${metrics.activeCount}</div>
                    <div class="stat-trend text-muted">
                        <span>${metrics.totalAssets > 0 ? Math.round((metrics.activeCount / metrics.totalAssets) * 100) : 0}% of inventory</span>
                    </div>
                </div>
                
                <!-- In Maintenance -->
                <div class="stat-card glass-panel">
                    <div class="stat-header">
                        <span class="stat-title">In Maintenance</span>
                        <div class="stat-icon" style="color: var(--color-danger)">
                            <i class="ph ph-wrench"></i>
                        </div>
                    </div>
                    <div class="stat-value">${metrics.maintenanceCount}</div>
                    <div class="stat-trend ${metrics.maintenanceCount > 0 ? 'trend-down' : 'trend-up'}">
                        <span>Requires attention</span>
                    </div>
                </div>
                <!-- Open Tickets -->
                <div class="stat-card glass-panel" style="cursor: pointer;" onclick="window.appRouter.navigate('tickets')">
                    <div class="stat-header">
                        <span class="stat-title">Open Tickets</span>
                        <div class="stat-icon" style="color: var(--color-warning)">
                            <i class="ph ph-ticket"></i>
                        </div>
                    </div>
                    <div class="stat-value">${metrics.openTickets}</div>
                    <div class="stat-trend ${metrics.openTickets > 0 ? 'trend-down' : 'trend-up'}">
                        <span>${metrics.openTickets > 0 ? 'Requires attention in Helpdesk' : 'All clear'}</span>
                    </div>
                </div>

                <!-- Active Subscriptions -->
                <div class="stat-card glass-panel" style="cursor: pointer;" onclick="window.appRouter.navigate('licenses')">
                    <div class="stat-header">
                        <span class="stat-title">Active Licenses</span>
                        <div class="stat-icon" style="color: var(--color-primary)">
                            <i class="ph ph-key"></i>
                        </div>
                    </div>
                    <div class="stat-value">${metrics.activeLicenses}</div>
                    <div class="stat-trend trend-up">
                        <span>SaaS & Software Subscriptions</span>
                    </div>
                </div>
            </div>

            <!-- Recent Activity Table -->
            <div class="glass-panel" style="margin-top: 1rem;">
                <div class="table-container">
                    <div class="table-header">
                        <h3 class="table-title">Recently Added Assets</h3>
                        <button class="btn glass-btn" onclick="window.appRouter.navigate('assets')">View All</button>
                    </div>
                    ${recentAssets.length > 0 ? `
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Value</th>
                                    <th>Status</th>
                                    <th>Date Added</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${recentAssets.map(asset => `
                                    <tr>
                                        <td><strong>${asset.name}</strong></td>
                                        <td style="text-transform: capitalize;">${asset.category}</td>
                                        <td>${formatCurrency(asset.value)}</td>
                                        <td>
                                            <span class="status-pill status-${asset.status}">
                                                ${asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}
                                            </span>
                                        </td>
                                        <td class="text-muted">${new Date(asset.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    ` : `
                        <div class="empty-state">
                            <i class="ph ph-tray"></i>
                            <p>No assets found in the system yet.</p>
                            <button class="btn btn-primary" id="btn-add-dashboard">Add Your First Asset</button>
                        </div>
                    `}
                </div>
            </div>
        </div>
    `;
};

window.renderDashboard = renderDashboard;
