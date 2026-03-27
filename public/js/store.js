/**
 * Supabase-backed data store
 */

const generateId = () => {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') {
        return window.crypto.randomUUID();
    }

    return `id_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
};

class SupabaseStore {
    constructor() {
        this.assets = [];
        this.tickets = [];
        this.licenses = [];
        this.vendors = [];
        this.purchaseOrders = [];
        this.categories = [];
        this.statuses = [];
        this.users = [];
        this.listeners = [];
        this.client = null;
        this.config = window.__APP_CONFIG__ || {};
    }

    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter((l) => l !== listener);
        };
    }

    notify() {
        this.listeners.forEach((listener) => listener(this.assets));
    }

    async init() {
        if (!this.config.supabaseUrl || !this.config.supabaseKey) {
            this.handleError('Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY.');
            return false;
        }

        await this.ensureSupabaseLoaded();
        this.client = window.supabase.createClient(this.config.supabaseUrl, this.config.supabaseKey);
        return this.refreshAll();
    }

    async ensureSupabaseLoaded() {
        if (window.supabase && typeof window.supabase.createClient === 'function') {
            return;
        }

        await new Promise((resolve, reject) => {
            let attempts = 0;
            const interval = window.setInterval(() => {
                attempts += 1;
                if (window.supabase && typeof window.supabase.createClient === 'function') {
                    window.clearInterval(interval);
                    resolve();
                    return;
                }

                if (attempts > 100) {
                    window.clearInterval(interval);
                    reject(new Error('Supabase client failed to load.'));
                }
            }, 100);
        });
    }

    handleError(message, error) {
        console.error(message, error || '');

        if (typeof window !== 'undefined' && typeof window.alert === 'function') {
            const details = error && error.message ? `\n\n${error.message}` : '';
            window.alert(`${message}${details}`);
        }
    }

    async refreshAll(showError = true) {
        try {
            const [
                assetsResult,
                ticketsResult,
                licensesResult,
                vendorsResult,
                purchaseOrdersResult,
                categoriesResult,
                statusesResult,
                usersResult,
            ] = await Promise.all([
                this.client.from('assets').select('*').order('created_at', { ascending: false }),
                this.client.from('support_tickets').select('*').order('created_at', { ascending: false }),
                this.client.from('software_licenses').select('*').order('created_at', { ascending: false }),
                this.client.from('vendors').select('*').order('created_at', { ascending: false }),
                this.client.from('purchase_orders').select('*').order('created_at', { ascending: false }),
                this.client.from('asset_categories').select('*').order('name', { ascending: true }),
                this.client.from('asset_status_labels').select('*').order('name', { ascending: true }),
                this.client.from('workspace_users').select('*').order('name', { ascending: true }),
            ]);

            const results = [
                assetsResult,
                ticketsResult,
                licensesResult,
                vendorsResult,
                purchaseOrdersResult,
                categoriesResult,
                statusesResult,
                usersResult,
            ];

            const failed = results.find((result) => result.error);
            if (failed && failed.error) {
                throw failed.error;
            }

            this.assets = (assetsResult.data || []).map((row) => this.mapAsset(row));
            this.tickets = (ticketsResult.data || []).map((row) => this.mapTicket(row));
            this.licenses = (licensesResult.data || []).map((row) => this.mapLicense(row));
            this.vendors = (vendorsResult.data || []).map((row) => this.mapVendor(row));
            this.purchaseOrders = (purchaseOrdersResult.data || []).map((row) => this.mapPurchaseOrder(row));
            this.categories = (categoriesResult.data || []).map((row) => this.mapCategory(row));
            this.statuses = (statusesResult.data || []).map((row) => this.mapStatus(row));
            this.users = (usersResult.data || []).map((row) => this.mapUser(row));

            this.notify();
            return true;
        } catch (error) {
            if (showError) {
                this.handleError('Unable to load data from Supabase. Check that the tables exist and Row Level Security policies allow access.', error);
            }
            return false;
        }
    }

    async runAction(action, message) {
        try {
            const result = await action();
            return result;
        } catch (error) {
            this.handleError(message, error);
            return null;
        }
    }

    mapAsset(row) {
        const assignmentExists = row.assignment_employee || row.assignment_department || row.assignment_location || row.assignment_date;

        return {
            id: row.id,
            name: row.name,
            manufacturer: row.manufacturer || '',
            model: row.model || '',
            serial: row.serial || '',
            category: row.category || '',
            status: row.status || '',
            value: Number(row.value) || 0,
            purchaseDate: row.purchase_date || '',
            assignee: row.assignee || '',
            assignment: assignmentExists ? {
                employee: row.assignment_employee || '',
                department: row.assignment_department || '',
                location: row.assignment_location || '',
                date: row.assignment_date || '',
            } : undefined,
            createdAt: row.created_at || new Date().toISOString(),
        };
    }

    mapTicket(row) {
        return {
            id: row.id,
            assetId: row.asset_id || '',
            assetName: row.asset_name || '',
            title: row.title || '',
            description: row.description || '',
            priority: row.priority || 'low',
            status: row.status || 'open',
            assignee: row.assignee || '',
            createdAt: row.created_at || new Date().toISOString(),
        };
    }

    mapLicense(row) {
        return {
            id: row.id,
            name: row.name || '',
            vendor: row.vendor || '',
            type: row.type || '',
            seatsTotal: Number(row.seats_total) || 0,
            seatsUsed: Number(row.seats_used) || 0,
            costPerSeat: Number(row.cost_per_seat) || 0,
            expirationDate: row.expiration_date || '',
            status: row.status || 'active',
            createdAt: row.created_at || new Date().toISOString(),
        };
    }

    mapVendor(row) {
        return {
            id: row.id,
            name: row.name || '',
            contact: row.contact || '',
            email: row.email || '',
            phone: row.phone || '',
            sla: row.sla || '',
            status: row.status || 'active',
            createdAt: row.created_at || new Date().toISOString(),
        };
    }

    mapPurchaseOrder(row) {
        return {
            id: row.id,
            poNumber: row.po_number || '',
            vendorId: row.vendor_id || '',
            vendorName: row.vendor_name || '',
            orderDate: row.order_date || '',
            amount: Number(row.amount) || 0,
            status: row.status || 'pending',
            createdAt: row.created_at || new Date().toISOString(),
        };
    }

    mapCategory(row) {
        return {
            id: row.id,
            name: row.name || '',
            description: row.description || '',
            color: row.color || 'primary',
            createdAt: row.created_at || new Date().toISOString(),
        };
    }

    mapStatus(row) {
        return {
            id: row.id,
            name: row.name || '',
            color: row.color || 'muted',
            createdAt: row.created_at || new Date().toISOString(),
        };
    }

    mapUser(row) {
        return {
            id: row.id,
            name: row.name || '',
            email: row.email || '',
            role: row.role || '',
            department: row.department || '',
            createdAt: row.created_at || new Date().toISOString(),
        };
    }

    serializeAsset(asset) {
        return {
            id: asset.id || generateId(),
            name: asset.name,
            manufacturer: asset.manufacturer || null,
            model: asset.model || null,
            serial: asset.serial || null,
            category: asset.category,
            status: asset.status,
            value: Number(asset.value) || 0,
            purchase_date: asset.purchaseDate || null,
            assignee: asset.assignee || null,
            assignment_employee: asset.assignment?.employee || null,
            assignment_department: asset.assignment?.department || null,
            assignment_location: asset.assignment?.location || null,
            assignment_date: asset.assignment?.date || null,
            created_at: asset.createdAt || new Date().toISOString(),
        };
    }

    getAll() {
        return [...this.assets];
    }

    getTickets() {
        return [...this.tickets];
    }

    getLicenses() {
        return [...this.licenses];
    }

    getVendors() {
        return [...this.vendors];
    }

    getPurchaseOrders() {
        return [...this.purchaseOrders];
    }

    getCategories() {
        return [...this.categories];
    }

    getStatuses() {
        return [...this.statuses];
    }

    getUsers() {
        return [...this.users];
    }

    add(asset) {
        return this.runAction(async () => {
            const payload = this.serializeAsset({
                ...asset,
                id: generateId(),
                createdAt: new Date().toISOString(),
            });

            const { data, error } = await this.client.from('assets').insert(payload).select('*').single();
            if (error) throw error;

            this.assets.unshift(this.mapAsset(data));
            this.notify();
            return this.assets[0];
        }, 'Unable to add asset.');
    }

    remove(id) {
        return this.runAction(async () => {
            const { error } = await this.client.from('assets').delete().eq('id', id);
            if (error) throw error;

            this.assets = this.assets.filter((asset) => asset.id !== id);
            this.tickets = this.tickets.filter((ticket) => ticket.assetId !== id);
            this.notify();
            return true;
        }, 'Unable to delete asset.');
    }

    assignAsset(id, assignmentData) {
        return this.runAction(async () => {
            const updatePayload = {
                assignee: assignmentData.employee,
                assignment_employee: assignmentData.employee,
                assignment_department: assignmentData.department,
                assignment_location: assignmentData.location,
                assignment_date: assignmentData.date,
            };

            const { data, error } = await this.client
                .from('assets')
                .update(updatePayload)
                .eq('id', id)
                .select('*')
                .single();

            if (error) throw error;

            const updatedAsset = this.mapAsset(data);
            this.assets = this.assets.map((asset) => asset.id === id ? updatedAsset : asset);
            this.notify();
            return updatedAsset;
        }, 'Unable to assign asset.');
    }

    addTicket(ticket) {
        return this.runAction(async () => {
            const payload = {
                id: generateId(),
                asset_id: ticket.assetId || null,
                asset_name: ticket.assetName || null,
                title: ticket.title,
                description: ticket.description || null,
                priority: ticket.priority,
                status: ticket.status,
                assignee: ticket.assignee || null,
                created_at: new Date().toISOString(),
            };

            const { data, error } = await this.client.from('support_tickets').insert(payload).select('*').single();
            if (error) throw error;

            this.tickets.unshift(this.mapTicket(data));
            this.notify();
            return this.tickets[0];
        }, 'Unable to create support ticket.');
    }

    removeTicket(id) {
        return this.runAction(async () => {
            const { error } = await this.client.from('support_tickets').delete().eq('id', id);
            if (error) throw error;

            this.tickets = this.tickets.filter((ticket) => ticket.id !== id);
            this.notify();
            return true;
        }, 'Unable to delete support ticket.');
    }

    addLicense(license) {
        return this.runAction(async () => {
            const payload = {
                id: generateId(),
                name: license.name,
                vendor: license.vendor,
                type: license.type,
                seats_total: Number(license.seatsTotal) || 0,
                seats_used: Number(license.seatsUsed) || 0,
                cost_per_seat: Number(license.costPerSeat) || 0,
                expiration_date: license.expirationDate || null,
                status: license.status,
                created_at: new Date().toISOString(),
            };

            const { data, error } = await this.client.from('software_licenses').insert(payload).select('*').single();
            if (error) throw error;

            this.licenses.unshift(this.mapLicense(data));
            this.notify();
            return this.licenses[0];
        }, 'Unable to add software license.');
    }

    removeLicense(id) {
        return this.runAction(async () => {
            const { error } = await this.client.from('software_licenses').delete().eq('id', id);
            if (error) throw error;

            this.licenses = this.licenses.filter((license) => license.id !== id);
            this.notify();
            return true;
        }, 'Unable to delete software license.');
    }

    addVendor(vendor) {
        return this.runAction(async () => {
            const payload = {
                id: generateId(),
                name: vendor.name,
                contact: vendor.contact || null,
                email: vendor.email || null,
                phone: vendor.phone || null,
                sla: vendor.sla || null,
                status: vendor.status,
                created_at: new Date().toISOString(),
            };

            const { data, error } = await this.client.from('vendors').insert(payload).select('*').single();
            if (error) throw error;

            this.vendors.unshift(this.mapVendor(data));
            this.notify();
            return this.vendors[0];
        }, 'Unable to add vendor.');
    }

    removeVendor(id) {
        return this.runAction(async () => {
            const { error } = await this.client.from('vendors').delete().eq('id', id);
            if (error) throw error;

            this.vendors = this.vendors.filter((vendor) => vendor.id !== id);
            await this.refreshAll(false);
            return true;
        }, 'Unable to delete vendor.');
    }

    addPurchaseOrder(po) {
        return this.runAction(async () => {
            const payload = {
                id: generateId(),
                po_number: po.poNumber,
                vendor_id: po.vendorId || null,
                vendor_name: po.vendorName || null,
                order_date: po.orderDate,
                amount: Number(po.amount) || 0,
                status: po.status,
                created_at: new Date().toISOString(),
            };

            const { data, error } = await this.client.from('purchase_orders').insert(payload).select('*').single();
            if (error) throw error;

            this.purchaseOrders.unshift(this.mapPurchaseOrder(data));
            this.notify();
            return this.purchaseOrders[0];
        }, 'Unable to add purchase order.');
    }

    removePurchaseOrder(id) {
        return this.runAction(async () => {
            const { error } = await this.client.from('purchase_orders').delete().eq('id', id);
            if (error) throw error;

            this.purchaseOrders = this.purchaseOrders.filter((po) => po.id !== id);
            this.notify();
            return true;
        }, 'Unable to delete purchase order.');
    }

    addCategory(cat) {
        return this.runAction(async () => {
            const payload = {
                id: generateId(),
                name: cat.name,
                description: cat.description || null,
                color: cat.color || 'primary',
                created_at: new Date().toISOString(),
            };

            const { data, error } = await this.client.from('asset_categories').insert(payload).select('*').single();
            if (error) throw error;

            this.categories = [...this.categories, this.mapCategory(data)];
            this.notify();
            return data;
        }, 'Unable to add category.');
    }

    removeCategory(id) {
        return this.runAction(async () => {
            const { error } = await this.client.from('asset_categories').delete().eq('id', id);
            if (error) throw error;

            this.categories = this.categories.filter((category) => category.id !== id);
            this.notify();
            return true;
        }, 'Unable to delete category.');
    }

    addStatus(status) {
        return this.runAction(async () => {
            const payload = {
                id: generateId(),
                name: status.name,
                color: status.color || 'muted',
                created_at: new Date().toISOString(),
            };

            const { data, error } = await this.client.from('asset_status_labels').insert(payload).select('*').single();
            if (error) throw error;

            this.statuses = [...this.statuses, this.mapStatus(data)];
            this.notify();
            return data;
        }, 'Unable to add status.');
    }

    removeStatus(id) {
        return this.runAction(async () => {
            const { error } = await this.client.from('asset_status_labels').delete().eq('id', id);
            if (error) throw error;

            this.statuses = this.statuses.filter((status) => status.id !== id);
            this.notify();
            return true;
        }, 'Unable to delete status.');
    }

    getAssetCategoryReport() {
        const report = {};
        this.assets.forEach((asset) => {
            if (!report[asset.category]) {
                report[asset.category] = { count: 0, totalValue: 0 };
            }
            report[asset.category].count += 1;
            report[asset.category].totalValue += Number(asset.value) || 0;
        });

        return Object.keys(report)
            .map((category) => ({
                category,
                count: report[category].count,
                totalValue: report[category].totalValue,
            }))
            .sort((a, b) => b.totalValue - a.totalValue);
    }

    getTicketStatusReport() {
        const report = { open: 0, 'in-progress': 0, resolved: 0 };
        this.tickets.forEach((ticket) => {
            if (report[ticket.status] !== undefined) {
                report[ticket.status] += 1;
            }
        });
        return report;
    }

    getExportData() {
        const headers = ['ID', 'Name', 'Manufacturer', 'Model', 'Serial', 'Category', 'Status', 'Value', 'Purchase Date', 'Assignee'];
        const rows = this.assets.map((asset) => [
            asset.id,
            `"${asset.name}"`,
            `"${asset.manufacturer || ''}"`,
            `"${asset.model || ''}"`,
            `"${asset.serial || ''}"`,
            asset.category,
            asset.status,
            asset.value,
            asset.purchaseDate,
            `"${asset.assignee || ''}"`,
        ]);

        return [headers, ...rows].map((entry) => entry.join(',')).join('\n');
    }

    getMetrics() {
        const totalValue = this.assets.reduce((sum, asset) => sum + Number(asset.value), 0);
        const activeCount = this.assets.filter((asset) => asset.status === 'active').length;
        const maintenanceCount = this.assets.filter((asset) => asset.status === 'maintenance').length;
        const openTickets = this.tickets.filter((ticket) => ticket.status === 'open' || ticket.status === 'in-progress').length;
        const activeLicenses = this.licenses.filter((license) => license.status === 'active' || license.status === 'over-allocated').length;

        return {
            totalAssets: this.assets.length,
            totalValue,
            activeCount,
            maintenanceCount,
            openTickets,
            activeLicenses,
        };
    }
}

window.appStore = new SupabaseStore();
