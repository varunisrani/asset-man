/**
 * System Settings Configuration Component
 */

const renderSettings = (store) => {
    let categories = store.getCategories();
    let statuses = store.getStatuses();
    let users = store.getUsers();

    // Sort alphabetically by name
    categories = categories.sort((a, b) => a.name.localeCompare(b.name));
    statuses = statuses.sort((a, b) => a.name.localeCompare(b.name));
    users = users.sort((a, b) => a.name.localeCompare(b.name));

    return `
        <div class="animate-fade-in">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                <div>
                    <h2 style="font-size: 1.5rem; margin-bottom: 0.5rem;">System Settings</h2>
                    <p style="color: var(--color-text-muted);">Configure dynamic dropdowns and manage workspace access.</p>
                </div>
            </div>
            
            <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
                
                <!-- Asset Categories -->
                <div class="glass-panel" style="padding: 1.5rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <h3 style="font-size: 1.1rem; font-weight: 500;">Asset Categories</h3>
                        <button class="btn glass-btn" id="btn-add-category" style="padding: 0.4rem 0.8rem; font-size: 0.85rem;">
                            <i class="ph ph-plus"></i> Add
                        </button>
                    </div>
                    <div style="max-height: 400px; overflow-y: auto;">
                        <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem;">
                            ${categories.map(cat => `
                                <li style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px;">
                                    <div style="display: flex; flex-direction: column;">
                                        <span style="font-weight: 500;">${cat.name}</span>
                                        <span style="font-size: 0.75rem; color: var(--color-text-muted);">${cat.description}</span>
                                    </div>
                                    <button class="action-btn delete" onclick="window.deleteCategory('${cat.id}')" title="Delete Category">
                                        <i class="ph ph-trash"></i>
                                    </button>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>

                <!-- Asset Status Tags -->
                <div class="glass-panel" style="padding: 1.5rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <h3 style="font-size: 1.1rem; font-weight: 500;">Status Labels</h3>
                        <button class="btn glass-btn" id="btn-add-status" style="padding: 0.4rem 0.8rem; font-size: 0.85rem;">
                            <i class="ph ph-plus"></i> Add
                        </button>
                    </div>
                    <div style="max-height: 400px; overflow-y: auto;">
                        <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem;">
                            ${statuses.map(stat => `
                                <li style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px;">
                                    <span class="status-pill status-${stat.color}">${stat.name}</span>
                                    <button class="action-btn delete" onclick="window.deleteStatus('${stat.id}')" title="Delete Status">
                                        <i class="ph ph-trash"></i>
                                    </button>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>

                <!-- User Directory -->
                <div class="glass-panel" style="padding: 1.5rem; grid-column: 1 / -1;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <h3 style="font-size: 1.1rem; font-weight: 500;">Workspace Users</h3>
                        <button class="btn glass-btn" style="padding: 0.4rem 0.8rem; font-size: 0.85rem;" disabled title="Enterprise feature">
                            <i class="ph ph-user-plus"></i> Invite User
                        </button>
                    </div>
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Department</th>
                                    <th>Access Level</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${users.map(user => `
                                    <tr>
                                        <td>
                                            <div style="display: flex; align-items: center; gap: 0.75rem;">
                                                <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=3b82f6&color=fff" style="width: 32px; height: 32px; border-radius: 50%;">
                                                <div style="display: flex; flex-direction: column;">
                                                    <strong>${user.name}</strong>
                                                    <span style="font-size: 0.75rem; color: var(--color-text-muted);">${user.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>${user.department}</td>
                                        <td>
                                            <span style="padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: 500; background: rgba(255,255,255,0.1);">
                                                ${user.role}
                                            </span>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    `;
};

window.renderSettings = renderSettings;
