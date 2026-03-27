import Script from "next/script";

const APP_HTML = String.raw`
<div class="app-container">
  <aside class="sidebar glass-panel">
    <div class="sidebar-header">
      <div class="logo">
        <i class="ph-fill ph-hexagon"></i>
        <span>NexusAssets</span>
      </div>
    </div>
    <nav class="sidebar-nav">
      <a href="#" class="nav-item active" data-view="dashboard">
        <i class="ph ph-squares-four"></i>
        <span>Dashboard</span>
      </a>
      <a href="#" class="nav-item" data-view="assets">
        <i class="ph ph-database"></i>
        <span>All Assets</span>
      </a>
      <a href="#" class="nav-item" data-view="tickets">
        <i class="ph ph-ticket"></i>
        <span>Support Tickets</span>
      </a>
      <a href="#" class="nav-item" data-view="licenses">
        <i class="ph ph-key"></i>
        <span>Software Licenses</span>
      </a>
      <a href="#" class="nav-item" data-view="procurement">
        <i class="ph ph-shopping-cart"></i>
        <span>Procurement</span>
      </a>
      <a href="#" class="nav-item" data-view="reports">
        <i class="ph ph-chart-line-up"></i>
        <span>Reports</span>
      </a>
      <div class="sidebar-divider"></div>
      <a href="#" class="nav-item" data-view="settings">
        <i class="ph ph-gear"></i>
        <span>System Settings</span>
      </a>
    </nav>
    <div class="sidebar-footer">
      <div class="user-profile">
        <img
          src="https://ui-avatars.com/api/?name=Admin+User&background=6366f1&color=fff"
          alt="User Avatar"
          class="avatar"
        >
        <div class="user-info">
          <span class="user-name">Admin User</span>
          <span class="user-role">Workspace Owner</span>
        </div>
      </div>
      <button
        id="btn-reset-data"
        class="btn glass-btn reset-btn"
      >
        <i class="ph ph-arrows-clockwise"></i> Refresh Data
      </button>
      <div class="reset-help">
        Reload the latest records from Supabase.
      </div>
    </div>
  </aside>

  <main class="main-content">
    <header class="top-header">
      <div class="search-bar glass-input-wrapper">
        <i class="ph ph-magnifying-glass"></i>
        <input type="text" placeholder="Search assets, categories, or tags..." class="glass-input">
      </div>
      <div class="header-actions">
        <button class="icon-btn glass-btn" aria-label="Notifications">
          <i class="ph ph-bell"></i>
          <span class="badge"></span>
        </button>
        <button class="btn btn-primary" id="btn-add-asset" aria-label="Add New Asset">
          <i class="ph ph-plus"></i>
          <span>New Asset</span>
        </button>
      </div>
    </header>

    <div id="view-container" class="view-container"></div>
  </main>
</div>

<div class="modal-backdrop" id="asset-modal">
  <div class="modal glass-panel">
    <div class="modal-header">
      <h2 class="modal-title">Add New Asset</h2>
      <button class="icon-btn modal-close" id="btn-close-modal">
        <i class="ph ph-x"></i>
      </button>
    </div>
    <div class="modal-body">
      <form id="asset-form" class="form">
        <div class="form-group">
          <label for="asset-name">Asset Name</label>
          <input type="text" id="asset-name" class="glass-input" required placeholder="e.g. MacBook Pro M3">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="asset-manufacturer">Manufacturer</label>
            <input type="text" id="asset-manufacturer" class="glass-input" required placeholder="e.g. Apple, Dell">
          </div>
          <div class="form-group">
            <label for="asset-model">Model / Specs</label>
            <input type="text" id="asset-model" class="glass-input" required placeholder="e.g. 14-inch, 32GB RAM">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="asset-serial">Serial Number</label>
            <input type="text" id="asset-serial" class="glass-input" required placeholder="e.g. C02YM123K34L">
          </div>
          <div class="form-group">
            <label for="asset-category">Category</label>
            <select id="asset-category" class="glass-input" required></select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="asset-value">Cost ($)</label>
            <input type="number" id="asset-value" class="glass-input" required min="0" step="0.01" placeholder="2000.00">
          </div>
          <div class="form-group">
            <label for="asset-status">Status</label>
            <select id="asset-status" class="glass-input" required></select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="asset-purchase-date">Purchase Date</label>
            <input type="text" id="asset-purchase-date" class="glass-input datepicker-input" data-datepicker="true" required placeholder="Select purchase date" autocomplete="off">
          </div>
          <div class="form-group">
            <label for="asset-assignee">Assigned To</label>
            <input type="text" id="asset-assignee" class="glass-input" placeholder="e.g. John Doe (Optional)">
          </div>
        </div>
        <div class="form-actions">
          <button type="button" class="btn glass-btn" id="btn-cancel-modal">Cancel</button>
          <button type="submit" class="btn btn-primary">Save Asset</button>
        </div>
      </form>
    </div>
  </div>
</div>

<div class="modal-backdrop" id="ticket-modal">
  <div class="modal glass-panel">
    <div class="modal-header">
      <h2 class="modal-title">Create Support Ticket</h2>
      <button class="icon-btn modal-close" id="btn-close-ticket-modal">
        <i class="ph ph-x"></i>
      </button>
    </div>
    <div class="modal-body">
      <form id="ticket-form" class="form">
        <div class="form-group">
          <label for="ticket-title">Issue Title</label>
          <input type="text" id="ticket-title" class="glass-input" required placeholder="e.g. Keyboard sticking">
        </div>
        <div class="form-group">
          <label for="ticket-asset">Hardware / Asset</label>
          <select id="ticket-asset" class="glass-input" required></select>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="ticket-priority">Priority</label>
            <select id="ticket-priority" class="glass-input" required>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div class="form-group">
            <label for="ticket-status">Status</label>
            <select id="ticket-status" class="glass-input" required>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label for="ticket-description">Issue Description</label>
          <textarea id="ticket-description" class="glass-input" rows="3" required placeholder="Describe the problem..."></textarea>
        </div>
        <div class="form-actions">
          <button type="button" class="btn glass-btn" id="btn-cancel-ticket-modal">Cancel</button>
          <button type="submit" class="btn btn-primary">Save Ticket</button>
        </div>
      </form>
    </div>
  </div>
</div>

<div class="modal-backdrop" id="license-modal">
  <div class="modal glass-panel">
    <div class="modal-header">
      <h2 class="modal-title">Add Software License</h2>
      <button class="icon-btn modal-close" id="btn-close-license-modal">
        <i class="ph ph-x"></i>
      </button>
    </div>
    <div class="modal-body">
      <form id="license-form" class="form">
        <div class="form-row">
          <div class="form-group">
            <label for="license-name">Software Name</label>
            <input type="text" id="license-name" class="glass-input" required placeholder="e.g. Office 365">
          </div>
          <div class="form-group">
            <label for="license-vendor">Vendor Publisher</label>
            <input type="text" id="license-vendor" class="glass-input" required placeholder="e.g. Microsoft">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="license-type">License Model</label>
            <select id="license-type" class="glass-input" required>
              <option value="subscription">Subscription (SaaS)</option>
              <option value="named">Named User</option>
              <option value="concurrent">Concurrent Users</option>
              <option value="device">Device-Based</option>
              <option value="perpetual">Perpetual (Lifetime)</option>
            </select>
          </div>
          <div class="form-group">
            <label for="license-status">Status</label>
            <select id="license-status" class="glass-input" required>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="license-seats-total">Seats Purchased</label>
            <input type="number" id="license-seats-total" class="glass-input" required min="1" value="1">
          </div>
          <div class="form-group">
            <label for="license-seats-used">Seats Currently Used</label>
            <input type="number" id="license-seats-used" class="glass-input" required min="0" value="0">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="license-cost">Cost (per seat)</label>
            <input type="number" id="license-cost" class="glass-input" required min="0" step="0.01" placeholder="0.00">
          </div>
          <div class="form-group">
            <label for="license-expiration">Expiration / Renewal Date</label>
            <input type="text" id="license-expiration" class="glass-input datepicker-input" data-datepicker="true" placeholder="Select expiration date" autocomplete="off">
          </div>
        </div>
        <div class="form-actions">
          <button type="button" class="btn glass-btn" id="btn-cancel-license-modal">Cancel</button>
          <button type="submit" class="btn btn-primary">Save License</button>
        </div>
      </form>
    </div>
  </div>
</div>

<div class="modal-backdrop" id="handover-modal">
  <div class="modal glass-panel">
    <div class="modal-header">
      <h2 class="modal-title">Asset Handover</h2>
      <button class="icon-btn modal-close" id="btn-close-handover-modal">
        <i class="ph ph-x"></i>
      </button>
    </div>
    <div class="modal-body">
      <form id="handover-form" class="form">
        <input type="hidden" id="handover-asset-id">
        <div class="form-group">
          <label>Asset</label>
          <input type="text" id="handover-asset-name" class="glass-input handover-asset-input" disabled>
        </div>
        <div class="form-group">
          <label for="handover-employee">Assign To (Employee Name)</label>
          <input type="text" id="handover-employee" class="glass-input" required placeholder="e.g. Emily Chen">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="handover-department">Department</label>
            <select id="handover-department" class="glass-input" required>
              <option value="">-- Select Department --</option>
              <option value="engineering">Engineering</option>
              <option value="sales">Sales</option>
              <option value="marketing">Marketing</option>
              <option value="hr">Human Resources</option>
              <option value="finance">Finance</option>
              <option value="operations">Operations</option>
              <option value="executive">Executive</option>
            </select>
          </div>
          <div class="form-group">
            <label for="handover-location">Location / Desk / Office</label>
            <input type="text" id="handover-location" class="glass-input" required placeholder="e.g. NYC HQs - Desk 42">
          </div>
        </div>
        <div class="form-group">
          <label for="handover-date">Handover Date</label>
          <input type="text" id="handover-date" class="glass-input datepicker-input" data-datepicker="true" required placeholder="Select handover date" autocomplete="off">
        </div>
        <div class="form-actions">
          <button type="button" class="btn glass-btn" id="btn-cancel-handover-modal">Cancel</button>
          <button type="submit" class="btn btn-primary">Confirm Handover</button>
        </div>
      </form>
    </div>
  </div>
</div>

<div class="modal-backdrop" id="vendor-modal">
  <div class="modal glass-panel">
    <div class="modal-header">
      <h2 class="modal-title">Add Vendor</h2>
      <button class="icon-btn modal-close" id="btn-close-vendor-modal">
        <i class="ph ph-x"></i>
      </button>
    </div>
    <div class="modal-body">
      <form id="vendor-form" class="form">
        <div class="form-group">
          <label for="vendor-name">Vendor Name</label>
          <input type="text" id="vendor-name" class="glass-input" required placeholder="e.g. CDW Corporation">
        </div>
        <div class="form-group">
          <label for="vendor-contact">Primary Contact Name</label>
          <input type="text" id="vendor-contact" class="glass-input" required placeholder="e.g. Jane Smith">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="vendor-email">Support Email</label>
            <input type="email" id="vendor-email" class="glass-input" required placeholder="support@vendor.com">
          </div>
          <div class="form-group">
            <label for="vendor-phone">Phone Number</label>
            <input type="text" id="vendor-phone" class="glass-input" required placeholder="1-800-555-0199">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="vendor-sla">Service Level Agreement (SLA)</label>
            <input type="text" id="vendor-sla" class="glass-input" required placeholder="e.g. Next Business Day">
          </div>
          <div class="form-group">
            <label for="vendor-status">Status</label>
            <select id="vendor-status" class="glass-input" required>
              <option value="active">Active Parter</option>
              <option value="inactive">Inactive / Former</option>
            </select>
          </div>
        </div>
        <div class="form-actions">
          <button type="button" class="btn glass-btn" id="btn-cancel-vendor-modal">Cancel</button>
          <button type="submit" class="btn btn-primary">Save Vendor</button>
        </div>
      </form>
    </div>
  </div>
</div>

<div class="modal-backdrop" id="po-modal">
  <div class="modal glass-panel">
    <div class="modal-header">
      <h2 class="modal-title">Log Purchase Order</h2>
      <button class="icon-btn modal-close" id="btn-close-po-modal">
        <i class="ph ph-x"></i>
      </button>
    </div>
    <div class="modal-body">
      <form id="po-form" class="form">
        <div class="form-row">
          <div class="form-group">
            <label for="po-number">PO Number</label>
            <input type="text" id="po-number" class="glass-input" required placeholder="e.g. PO-2024-001">
          </div>
          <div class="form-group">
            <label for="po-vendor">Linked Vendor</label>
            <select id="po-vendor" class="glass-input" required></select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="po-date">Order Date</label>
            <input type="text" id="po-date" class="glass-input datepicker-input" data-datepicker="true" required placeholder="Select order date" autocomplete="off">
          </div>
          <div class="form-group">
            <label for="po-amount">Total Amount ($)</label>
            <input type="number" id="po-amount" class="glass-input" required min="0" step="0.01" placeholder="5000.00">
          </div>
        </div>
        <div class="form-group">
          <label for="po-status">Order Status</label>
          <select id="po-status" class="glass-input" required>
            <option value="pending">Pending Approval</option>
            <option value="approved">Approved &amp; Sent</option>
            <option value="fulfilled">Fulfilled / Received</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div class="form-actions">
          <button type="button" class="btn glass-btn" id="btn-cancel-po-modal">Cancel</button>
          <button type="submit" class="btn btn-primary">Save PO</button>
        </div>
      </form>
    </div>
  </div>
</div>

<div class="modal-backdrop" id="category-modal">
  <div class="modal glass-panel">
    <div class="modal-header">
      <h2 class="modal-title">New Category</h2>
      <button class="icon-btn modal-close" id="btn-close-cat-modal">
        <i class="ph ph-x"></i>
      </button>
    </div>
    <div class="modal-body">
      <form id="category-form" class="form">
        <div class="form-group">
          <label for="cat-name">Category Name</label>
          <input type="text" id="cat-name" class="glass-input" required placeholder="e.g. Mobile Device">
        </div>
        <div class="form-group">
          <label for="cat-desc">Description</label>
          <input type="text" id="cat-desc" class="glass-input" required placeholder="e.g. Phones and tablets">
        </div>
        <div class="form-group">
          <label for="cat-color">Color Theme</label>
          <select id="cat-color" class="glass-input" required>
            <option value="primary">Blue (Primary)</option>
            <option value="success">Green (Success)</option>
            <option value="warning">Yellow (Warning)</option>
            <option value="danger">Red (Danger)</option>
            <option value="muted">Gray (Muted)</option>
          </select>
        </div>
        <div class="form-actions">
          <button type="button" class="btn glass-btn" id="btn-cancel-cat-modal">Cancel</button>
          <button type="submit" class="btn btn-primary">Save Category</button>
        </div>
      </form>
    </div>
  </div>
</div>

<div class="modal-backdrop" id="status-modal">
  <div class="modal glass-panel">
    <div class="modal-header">
      <h2 class="modal-title">New Status Label</h2>
      <button class="icon-btn modal-close" id="btn-close-status-modal">
        <i class="ph ph-x"></i>
      </button>
    </div>
    <div class="modal-body">
      <form id="status-form" class="form">
        <div class="form-group">
          <label for="status-name">Status Label</label>
          <input type="text" id="status-name" class="glass-input" required placeholder="e.g. On Leave">
        </div>
        <div class="form-group">
          <label for="status-color">Condition Color</label>
          <select id="status-color" class="glass-input" required>
            <option value="success">Green (Good/Active)</option>
            <option value="warning">Yellow (Warning/Repair)</option>
            <option value="danger">Red (Critical/Lost)</option>
            <option value="muted">Gray (Inactive/Retired)</option>
            <option value="primary">Blue (Informational)</option>
          </select>
        </div>
        <div class="form-actions">
          <button type="button" class="btn glass-btn" id="btn-cancel-status-modal">Cancel</button>
          <button type="submit" class="btn btn-primary">Save Status</button>
        </div>
      </form>
    </div>
  </div>
</div>
`;

export default function Home() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ?? "";

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/flatpickr/dist/themes/dark.css"
      />
      <div dangerouslySetInnerHTML={{ __html: APP_HTML }} />
      <Script
        id="app-config"
        strategy="beforeInteractive"
      >{`window.__APP_CONFIG__ = ${JSON.stringify({
        supabaseUrl,
        supabaseKey,
      })};`}</Script>
      <Script src="https://unpkg.com/@phosphor-icons/web" strategy="afterInteractive" />
      <Script
        src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"
        strategy="afterInteractive"
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/flatpickr"
        strategy="afterInteractive"
      />
      <Script src="/js/store.js" strategy="afterInteractive" />
      <Script src="/js/components/dashboard.js" strategy="afterInteractive" />
      <Script src="/js/components/assetList.js" strategy="afterInteractive" />
      <Script src="/js/components/tickets.js" strategy="afterInteractive" />
      <Script src="/js/components/licenses.js" strategy="afterInteractive" />
      <Script src="/js/components/reports.js" strategy="afterInteractive" />
      <Script src="/js/components/procurement.js" strategy="afterInteractive" />
      <Script src="/js/components/settings.js" strategy="afterInteractive" />
      <Script src="/js/app.js" strategy="afterInteractive" />
    </>
  );
}
