const STORAGE_KEY = 'electrofull_data_v1';

const defaultState = {
  users: [
    { id: crypto.randomUUID(), name: 'System Admin', username: 'admin', password: 'admin123', role: 'admin' },
    { id: crypto.randomUUID(), name: 'Warehouse User', username: 'user', password: 'user123', role: 'user' }
  ],
  clients: [
    { id: crypto.randomUUID(), name: 'Nova Retail', email: 'nova@retail.com', phone: '+1-555-1020' }
  ],
  products: [
    { id: crypto.randomUUID(), name: 'Circuit Breaker 20A', sku: 'EL-1001', category: 'Electrical', price: 12.5, stock: 42 },
    { id: crypto.randomUUID(), name: 'LED Panel 60x60', sku: 'EL-2004', category: 'Lighting', price: 28, stock: 16 }
  ],
  movements: [],
  sales: [],
  counts: []
};

let state = loadState();
let currentUser = null;

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : structuredClone(defaultState);
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function formatDate(date = new Date()) {
  return new Date(date).toLocaleString();
}

function byId(id) { return document.getElementById(id); }
function productById(id) { return state.products.find((p) => p.id === id); }
function escapeHTML(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function showMessage(msg) { alert(msg); }

function login(username, password) {
  return state.users.find((u) => u.username === username && u.password === password) || null;
}

function updateRoleVisibility() {
  const isAdmin = currentUser?.role === 'admin';
  document.querySelectorAll('.admin-only').forEach((el) => {
    el.style.display = isAdmin ? '' : 'none';
  });
  if (!isAdmin && document.querySelector('.section.active')?.id === 'sales') {
    activateSection('dashboard');
  }
}

function activateSection(sectionId) {
  document.querySelectorAll('.section').forEach((s) => s.classList.remove('active'));
  byId(sectionId).classList.add('active');
  document.querySelectorAll('.nav-link').forEach((btn) => btn.classList.toggle('active', btn.dataset.section === sectionId));
  byId('sectionTitle').textContent = sectionId === 'counting' ? 'Inventory Count' : sectionId[0].toUpperCase() + sectionId.slice(1);
  byId('sidebar').classList.remove('open');
}

function populateProductSelects() {
  ['movementProduct', 'saleProduct', 'countProduct'].forEach((selectId) => {
    const select = byId(selectId);
    select.innerHTML = state.products.map((p) => `
      <option value="${escapeHTML(p.id)}">${escapeHTML(p.name)} (${p.stock})</option>
    `).join('');
  });
}

function populateClientSelect() {
  byId('saleClient').innerHTML = state.clients.map((c) => `
    <option value="${escapeHTML(c.id)}">${escapeHTML(c.name)}</option>
  `).join('');
}

function renderDashboard() {
  byId('totalProducts').textContent = state.products.length;
  byId('lowStock').textContent = state.products.filter((p) => p.stock < 10).length;
  byId('totalUnits').textContent = state.products.reduce((acc, p) => acc + p.stock, 0);

  const today = new Date().toDateString();
  const salesToday = state.sales.filter((s) => new Date(s.date).toDateString() === today).length;
  byId('salesToday').textContent = salesToday;

  byId('recentMovementsBody').innerHTML = state.movements.slice(-8).reverse().map((m) => `
    <tr>
      <td>${formatDate(m.date)}</td>
      <td>${escapeHTML(m.type)}</td>
      <td>${escapeHTML(m.productName)}</td>
      <td>${m.qty}</td>
      <td>${escapeHTML(m.user)}</td>
    </tr>
  `).join('') || '<tr><td colspan="5">No movements yet.</td></tr>';
}

function renderProducts() {
  byId('productsBody').innerHTML = state.products.map((p) => `
    <tr>
      <td>${escapeHTML(p.name)}</td><td>${escapeHTML(p.sku)}</td><td>${escapeHTML(p.category)}</td>
      <td>$${p.price.toFixed(2)}</td><td>${p.stock}</td>
      <td><button class="action-btn edit-product-btn" data-product-id="${escapeHTML(p.id)}"><i class="fa-solid fa-pen"></i></button></td>
    </tr>
  `).join('');
  document.querySelectorAll('.edit-product-btn').forEach((button) => {
    button.addEventListener('click', () => editProduct(button.dataset.productId));
  });
}

window.editProduct = function editProduct(id) {
  const p = productById(id);
  byId('productFormTitle').textContent = 'Edit Product';
  byId('productId').value = p.id;
  byId('productName').value = p.name;
  byId('productSku').value = p.sku;
  byId('productCategory').value = p.category;
  byId('productPrice').value = p.price;
  byId('productStock').value = p.stock;
};

function renderMovements() {
  byId('movementsBody').innerHTML = state.movements.slice().reverse().map((m) => `
    <tr><td>${formatDate(m.date)}</td><td>${escapeHTML(m.type)}</td><td>${escapeHTML(m.productName)}</td><td>${m.qty}</td><td>${escapeHTML(m.note || '-')}</td><td>${escapeHTML(m.user)}</td></tr>
  `).join('') || '<tr><td colspan="6">No movement records.</td></tr>';
}

function renderSales() {
  byId('salesBody').innerHTML = state.sales.slice().reverse().map((s) => `
    <tr><td>${formatDate(s.date)}</td><td>${escapeHTML(s.clientName)}</td><td>${escapeHTML(s.productName)}</td><td>${s.qty}</td><td>$${s.total.toFixed(2)}</td><td>${escapeHTML(s.user)}</td></tr>
  `).join('') || '<tr><td colspan="6">No sales registered.</td></tr>';
}

function renderCounts() {
  byId('countBody').innerHTML = state.counts.slice().reverse().map((c) => `
    <tr><td>${formatDate(c.date)}</td><td>${escapeHTML(c.productName)}</td><td>${c.oldStock}</td><td>${c.counted}</td><td>${c.diff > 0 ? '+' : ''}${c.diff}</td><td>${escapeHTML(c.user)}</td></tr>
  `).join('') || '<tr><td colspan="6">No count adjustments yet.</td></tr>';
}

function renderUsers() {
  byId('usersBody').innerHTML = state.users.map((u) => `
    <tr><td>${escapeHTML(u.name)}</td><td>${escapeHTML(u.username)}</td><td>${escapeHTML(u.role)}</td></tr>
  `).join('');
}

function renderClients() {
  byId('clientsBody').innerHTML = state.clients.map((c) => `
    <tr><td>${escapeHTML(c.name)}</td><td>${escapeHTML(c.email)}</td><td>${escapeHTML(c.phone)}</td></tr>
  `).join('');
}

function renderAll() {
  renderDashboard();
  renderProducts();
  renderMovements();
  renderSales();
  renderCounts();
  renderUsers();
  renderClients();
  populateProductSelects();
  populateClientSelect();
  saveState();
}

byId('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const user = login(byId('username').value.trim(), byId('password').value);
  if (!user) return showMessage('Invalid credentials');
  currentUser = user;
  byId('currentUserLabel').textContent = `${user.name} (${user.role})`;
  byId('loginView').classList.add('hidden');
  byId('appView').classList.remove('hidden');
  updateRoleVisibility();
  renderAll();
});

byId('logoutBtn').addEventListener('click', () => {
  currentUser = null;
  byId('appView').classList.add('hidden');
  byId('loginView').classList.remove('hidden');
});

byId('mobileMenu').addEventListener('click', () => byId('sidebar').classList.toggle('open'));

document.querySelectorAll('.nav-link').forEach((btn) => btn.addEventListener('click', () => activateSection(btn.dataset.section)));

byId('productForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const id = byId('productId').value;
  const payload = {
    name: byId('productName').value.trim(),
    sku: byId('productSku').value.trim(),
    category: byId('productCategory').value.trim(),
    price: Number(byId('productPrice').value),
    stock: Number(byId('productStock').value)
  };
  if (id) {
    const idx = state.products.findIndex((p) => p.id === id);
    state.products[idx] = { ...state.products[idx], ...payload };
  } else {
    state.products.push({ id: crypto.randomUUID(), ...payload });
  }
  e.target.reset();
  byId('productId').value = '';
  byId('productFormTitle').textContent = 'Create Product';
  renderAll();
});

byId('movementForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const type = byId('movementType').value;
  const product = productById(byId('movementProduct').value);
  const qty = Number(byId('movementQty').value);

  if (!product) return;
  if (type === 'outbound' && product.stock < qty) return showMessage('Not enough stock for this outbound movement.');

  product.stock += type === 'inbound' ? qty : -qty;
  state.movements.push({
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    type,
    productId: product.id,
    productName: product.name,
    qty,
    note: byId('movementNote').value.trim(),
    user: currentUser.name
  });
  e.target.reset();
  renderAll();
});

byId('salesForm').addEventListener('submit', (e) => {
  e.preventDefault();
  if (currentUser.role !== 'admin') return showMessage('Only admins can register sales.');

  const product = productById(byId('saleProduct').value);
  const client = state.clients.find((c) => c.id === byId('saleClient').value);
  const qty = Number(byId('saleQty').value);

  if (!product || !client) return;
  if (product.stock < qty) return showMessage('Not enough stock to register sale.');

  product.stock -= qty;
  const total = qty * product.price;

  state.sales.push({
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    clientName: client.name,
    productName: product.name,
    qty,
    total,
    user: currentUser.name
  });

  state.movements.push({
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    type: 'sale',
    productId: product.id,
    productName: product.name,
    qty,
    note: `Sale to ${client.name}`,
    user: currentUser.name
  });

  e.target.reset();
  renderAll();
});

byId('countForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const product = productById(byId('countProduct').value);
  const counted = Number(byId('countQty').value);
  if (!product) return;

  const oldStock = product.stock;
  const diff = counted - oldStock;
  product.stock = counted;

  state.counts.push({
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    productName: product.name,
    oldStock,
    counted,
    diff,
    user: currentUser.name
  });

  state.movements.push({
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    type: 'adjustment',
    productId: product.id,
    productName: product.name,
    qty: Math.abs(diff),
    note: `Adjustment ${diff > 0 ? '+' : ''}${diff}`,
    user: currentUser.name
  });

  e.target.reset();
  renderAll();
});

byId('userForm').addEventListener('submit', (e) => {
  e.preventDefault();
  if (currentUser.role !== 'admin') return showMessage('Only admins can manage users.');

  const username = byId('newUsername').value.trim();
  if (state.users.some((u) => u.username === username)) return showMessage('Username already exists.');

  state.users.push({
    id: crypto.randomUUID(),
    name: byId('newUserName').value.trim(),
    username,
    password: byId('newPassword').value,
    role: byId('newUserRole').value
  });
  e.target.reset();
  renderAll();
});

byId('clientForm').addEventListener('submit', (e) => {
  e.preventDefault();
  state.clients.push({
    id: crypto.randomUUID(),
    name: byId('clientName').value.trim(),
    email: byId('clientEmail').value.trim(),
    phone: byId('clientPhone').value.trim()
  });
  e.target.reset();
  renderAll();
});
