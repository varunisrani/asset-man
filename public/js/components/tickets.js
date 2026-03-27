/**
 * Ticket List Component
 * Renders the helpdesk ticketing board module
 */

const renderTickets = (store) => {
    let tickets = store.getTickets ? store.getTickets() : [];

    // Sort by newest first
    tickets = tickets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const getPriorityColor = (priority) => {
        const colors = {
            'low': 'var(--color-success)',
            'medium': 'var(--color-warning)',
            'high': 'var(--color-danger)'
        };
        return colors[priority] || 'var(--color-text-muted)';
    };

    const getStatusPillClass = (status) => {
        const classes = {
            'open': 'status-retired', // red-ish
            'in-progress': 'status-maintenance', // orange-ish
            'resolved': 'status-active' // green-ish
        };
        return classes[status] || 'status-default';
    };

    return `
        <div class="animate-fade-in">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <h2 style="font-size: 1.5rem;">Support Tickets</h2>
                <button class="btn btn-primary" id="btn-add-ticket">
                    <i class="ph ph-plus"></i> New Ticket
                </button>
            </div>
            
            <div class="glass-panel">
                <div class="table-container">
                    ${tickets.length > 0 ? `
                        <table id="ticket-table">
                            <thead>
                                <tr>
                                    <th>Ticket details</th>
                                    <th>Linked Asset</th>
                                    <th>Priority</th>
                                    <th>Status</th>
                                    <th>Assignee</th>
                                    <th>Created On</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${tickets.map(ticket => `
                                    <tr>
                                        <td>
                                            <div style="display: flex; flex-direction: column; gap: 0.25rem;">
                                                <strong>${ticket.title}</strong>
                                                <span style="font-size: 0.75rem; color: var(--color-text-muted); max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${ticket.description}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                                <i class="ph ph-link"></i>
                                                ${ticket.assetName || '<span class="text-muted">None</span>'}
                                            </div>
                                        </td>
                                        <td>
                                            <div style="display: flex; align-items: center; gap: 0.5rem; color: ${getPriorityColor(ticket.priority)}; text-transform: capitalize; font-weight: 500;">
                                                <i class="ph ph-warning-circle"></i>
                                                ${ticket.priority}
                                            </div>
                                        </td>
                                        <td>
                                            <span class="status-pill ${getStatusPillClass(ticket.status)}">
                                                ${ticket.status.replace('-', ' ').toUpperCase()}
                                            </span>
                                        </td>
                                        <td>${ticket.assignee || 'Unassigned'}</td>
                                        <td>${new Date(ticket.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    ` : `
                        <div class="empty-state">
                            <i class="ph ph-ticket"></i>
                            <p>No support tickets found.</p>
                            <span style="font-size: 0.875rem;">Everything is running smoothly!</span>
                        </div>
                    `}
                </div>
            </div>
        </div>
    `;
};

window.renderTickets = renderTickets;
