// ─── Admin Shared Utilities ──────────────────────────────────────────────────
const API = 'http://localhost:5000';

function getToken() { return localStorage.getItem('admin_token'); }
function getUsername() { return localStorage.getItem('admin_username'); }
function logout() { localStorage.removeItem('admin_token'); localStorage.removeItem('admin_username'); window.location.href = 'index.html'; }

// Auth guard — call on every protected page
async function requireAuth() {
    const token = getToken();
    if (!token) { window.location.href = 'index.html'; return false; }
    try {
        const r = await fetch(`${API}/api/admin/verify`, { headers: { Authorization: 'Bearer ' + token } });
        if (!r.ok) { logout(); return false; }
        const d = await r.json();
        document.querySelectorAll('.admin-username').forEach(el => el.textContent = d.username);
        return true;
    } catch { logout(); return false; }
}

// Authenticated fetch helper
function apiFetch(path, opts = {}) {
    opts.headers = { ...opts.headers, Authorization: 'Bearer ' + getToken(), 'Content-Type': 'application/json' };
    return fetch(API + path, opts);
}

// Toast notifications
function toast(msg, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    const el = document.createElement('div');
    const icons = { success: '✅', error: '❌', info: 'ℹ️' };
    el.className = `toast ${type}`;
    el.innerHTML = `<span>${icons[type] || ''}</span><span>${msg}</span>`;
    container.appendChild(el);
    setTimeout(() => el.remove(), 3500);
}

// Format currency
function fmtPrice(v) { return '₹' + Number(v).toLocaleString('en-IN'); }

// Format date
function fmtDate(d) { return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }); }

// Add days to a date
function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

// Status pill HTML
function statusPill(status) {
    const cls = {
        'Confirmed': 'status-confirmed',
        'Shipped': 'status-shipped',
        'Out for Delivery': 'status-outfordelivery',
        'Delivered': 'status-delivered',
        'Cancelled': 'status-cancelled'
    }[status] || 'status-confirmed';
    return `<span class="status ${cls}">${status}</span>`;
}

// Confirm dialog
function confirmAction(msg) { return window.confirm(msg); }

// Active nav
function setActiveNav(id) {
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const el = document.getElementById(id);
    if (el) el.classList.add('active');
}
