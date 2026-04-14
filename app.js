(() => {
  const KEY = {
    users: 'electrofull_users',
    products: 'electrofull_products',
    clients: 'electrofull_clients',
    sales: 'electrofull_sales',
    movements: 'electrofull_movements',
    session: 'electrofull_session'
  };

  const ICONS = {
    dashboard: '📊', products: '🧰', inventory: '📦', sales: '💳', clients: '👥', users: '🔐', reports: '📈', settings: '⚙️', logout: '🚪'
  };

  const adminSections = ['dashboard', 'products', 'inventory', 'sales', 'clients', 'users', 'reports', 'settings', 'logout'];
  const clientSections = ['dashboard', 'products', 'inventory', 'sales', 'logout'];
  const sectionLabels = {
    dashboard: 'Dashboard', products: 'Products', inventory: 'Availability', sales: 'Sales', clients: 'Clients', users: 'Users', reports: 'Reports', settings: 'Settings', logout: 'Logout'
  };

  const loginView = document.getElementById('loginView');
  const appView = document.getElementById('appView');
  const navMenu = document.getElementById('navMenu');
  const sectionContainer = document.getElementById('sectionContainer');
  const sectionTitle = document.getElementById('sectionTitle');
  const sectionSubtitle = document.getElementById('sectionSubtitle');
  const userChip = document.getElementById('userChip');

  const state = {
    user: null,
    activeSection: 'dashboard',
    flash: { type: '', text: '' }
  };

  const uid = () => `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  const money = (value) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value || 0);
  const today = () => new Date().toISOString().slice(0, 10);

  function load(key, fallback = []) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }
  function save(key, value) { localStorage.setItem(key, JSON.stringify(value)); }

  function stockStatus(product) {
    if (product.stock <= 0) return { text: 'Out of stock', className: 'danger' };
    if (product.stock <= product.minStock) return { text: 'Low stock', className: 'warn' };
    return { text: 'In stock', className: 'ok' };
  }

  function seedIfNeeded() {
    if (!localStorage.getItem(KEY.users)) {
      save(KEY.users, [
        { id: 'u-admin', username: 'admin', password: 'admin123', role: 'admin', name: 'System Admin', clientId: null },
        { id: 'u-client', username: 'cliente', password: 'cliente123', role: 'client', name: 'Cliente Demo', clientId: 'c-001' }
      ]);
    }
    if (!localStorage.getItem(KEY.clients)) {
      save(KEY.clients, [
        { id: 'c-001', name: 'Taller Rodriguez', company: 'Rodriguez Motors', phone: '+54 11 4422 1100', email: 'compras@rodriguezmotors.com', address: 'Av. Mitre 1220, Avellaneda', notes: 'Cliente mayorista' },
        { id: 'c-002', name: 'Lucia Perez', company: 'Autoclimas LP', phone: '+54 11 5211 9900', email: 'lucia@autoclimaslp.com', address: 'Laprida 90, CABA', notes: 'Compra mensual' },
        { id: 'c-003', name: 'Taller Norte', company: 'Norte Refrigeracion', phone: '+54 341 555 1289', email: 'ventas@norterefri.com', address: 'San Martin 540, Rosario', notes: 'Pago transferencia' }
      ]);
    }
    if (!localStorage.getItem(KEY.products)) {
      save(KEY.products, [
        { id: 'p-001', name: 'Compressor Sanden SD7H15', category: 'Compressor', sku: 'AC-001', description: 'Heavy-duty compressor for automotive AC retrofit and replacement.', purchasePrice: 260000, salePrice: 320000, stock: 8, minStock: 3, status: 'active', image: '🧊' },
        { id: 'p-002', name: 'Condenser for Peugeot 208', category: 'Condenser', sku: 'AC-002', description: 'High efficiency condenser assembly for Peugeot 208 models.', purchasePrice: 145000, salePrice: 185000, stock: 5, minStock: 3, status: 'active', image: '🚗' },
        { id: 'p-003', name: 'Expansion Valve Universal', category: 'Valve', sku: 'AC-003', description: 'Universal expansion valve for R134a systems.', purchasePrice: 32000, salePrice: 48000, stock: 18, minStock: 6, status: 'active', image: '🔩' },
        { id: 'p-004', name: 'Cabin Blower Motor 12V', category: 'Blower Motor', sku: 'AC-004', description: '12V blower motor with balanced shaft and low vibration.', purchasePrice: 67000, salePrice: 97000, stock: 10, minStock: 4, status: 'active', image: '🌀' },
        { id: 'p-005', name: 'R134a Service Hose Kit', category: 'Service Tools', sku: 'AC-005', description: 'Three-color reinforced hose kit for diagnostics and recharge.', purchasePrice: 51000, salePrice: 76000, stock: 12, minStock: 5, status: 'active', image: '🧰' },
        { id: 'p-006', name: 'Air Conditioning Repair Kit O-Rings and Seals', category: 'Repair Kit', sku: 'AC-006', description: 'O-rings, seals and fittings for leak repair and maintenance.', purchasePrice: 14000, salePrice: 22000, stock: 25, minStock: 8, status: 'active', image: '🛠️' }
      ]);
    }
    if (!localStorage.getItem(KEY.sales)) save(KEY.sales, []);
    if (!localStorage.getItem(KEY.movements)) save(KEY.movements, []);
  }

  function getData() {
    return {
      users: load(KEY.users),
      products: load(KEY.products),
      clients: load(KEY.clients),
      sales: load(KEY.sales),
      movements: load(KEY.movements)
    };
  }

  function renderLogin(error = '') {
    loginView.innerHTML = `
      <article class="login-card">
        <h2>Electrofull Login</h2>
        <p style="margin-top:0.5rem;color:#60709a;">Sign in to manage inventory, sales and operations.</p>
        <form id="loginForm" class="form-grid">
          <div><label for="username">Username</label><input id="username" required /></div>
          <div><label for="password">Password</label><input id="password" type="password" required /></div>
          <button type="submit">Login</button>
        </form>
        ${error ? `<div class="error-box">${error}</div>` : ''}
        <div class="login-help">
          <strong>Demo credentials</strong><br/>
          Admin: <code>admin / admin123</code><br/>
          Client: <code>cliente / cliente123</code>
        </div>
      </article>`;

    document.getElementById('loginForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value.trim();
      const users = load(KEY.users, []);
      const found = users.find((u) => u.username === username && u.password === password);
      if (!found) {
        renderLogin('Invalid credentials. Try one of the demo users.');
        return;
      }
      state.user = found;
      save(KEY.session, found);
      showApp();
    });
  }

  function allowedSections() {
    return state.user.role === 'admin' ? adminSections : clientSections;
  }

  function showApp() {
    loginView.classList.add('hidden');
    appView.classList.remove('hidden');
    state.activeSection = 'dashboard';
    renderNav();
    renderActiveSection();
  }

  function renderNav() {
    const sections = allowedSections();
    navMenu.innerHTML = sections.map((section) => `
      <li><button class="nav-link ${section === state.activeSection ? 'active' : ''}" data-section="${section}">${ICONS[section] || '•'} ${sectionLabels[section]}</button></li>
    `).join('');

    navMenu.querySelectorAll('.nav-link').forEach((button) => {
      button.addEventListener('click', () => {
        const target = button.dataset.section;
        if (target === 'logout') {
          localStorage.removeItem(KEY.session);
          state.user = null;
          appView.classList.add('hidden');
          loginView.classList.remove('hidden');
          renderLogin();
          return;
        }
        state.activeSection = target;
        renderNav();
        renderActiveSection();
      });
    });
  }

  function notify(type, text) {
    state.flash = { type, text };
  }

  function flashHtml() {
    if (!state.flash.text) return '';
    const cls = state.flash.type === 'error' ? 'error-box' : 'success-box';
    const html = `<div class="${cls}">${state.flash.text}</div>`;
    state.flash = { type: '', text: '' };
    return html;
  }

  function renderActiveSection() {
    const { users } = getData();
    const me = users.find((u) => u.id === state.user.id) || state.user;
    state.user = me;
    userChip.textContent = `${me.name} · ${me.role}`;
    sectionTitle.textContent = sectionLabels[state.activeSection] || 'Section';
    sectionSubtitle.textContent = me.role === 'admin' ? 'Administrative workspace' : 'Client workspace';

    if (state.activeSection === 'dashboard') renderDashboard();
    else if (state.activeSection === 'products') renderProducts();
    else if (state.activeSection === 'inventory') renderInventory();
    else if (state.activeSection === 'sales') renderSales();
    else if (state.activeSection === 'clients') renderClients();
    else if (state.activeSection === 'users') renderUsers();
    else if (state.activeSection === 'reports') renderReports();
    else if (state.activeSection === 'settings') renderSettings();
  }

  function renderDashboard() {
    const { products, sales, movements } = getData();
    const lowStock = products.filter((p) => p.stock <= p.minStock).length;
    const totalStock = products.reduce((acc, p) => acc + p.stock, 0);
    const todaySales = sales.filter((s) => s.date === today());
    const salesTodayAmount = todaySales.reduce((acc, s) => acc + s.total, 0);

    if (state.user.role === 'client') {
      const mySales = sales.filter((s) => s.clientId === state.user.clientId);
      sectionContainer.innerHTML = `
        <div class="cards-grid">
          <article class="card"><h3>Available products</h3><p class="value">${products.length}</p></article>
          <article class="card"><h3>Products in stock</h3><p class="value">${products.filter((p) => p.stock > 0).length}</p></article>
          <article class="card"><h3>My orders</h3><p class="value">${mySales.length}</p></article>
        </div>
        <article class="panel">
          <h3>Welcome back, ${state.user.name}</h3>
          <p style="margin-top:0.5rem;color:#60709a;">You can browse product availability and review your purchase history.</p>
          ${mySales.length ? `<div class="table-wrap" style="margin-top:0.8rem;"><table><thead><tr><th>Date</th><th>Items</th><th>Total</th></tr></thead><tbody>${mySales.slice(-5).reverse().map((s) => `<tr><td>${s.date}</td><td>${s.items.length}</td><td>${money(s.total)}</td></tr>`).join('')}</tbody></table></div>` : '<div class="empty-state" style="margin-top:0.8rem;">No orders yet.</div>'}
        </article>
      `;
      return;
    }

    sectionContainer.innerHTML = `
      <div class="cards-grid">
        <article class="card"><h3>Total products</h3><p class="value">${products.length}</p></article>
        <article class="card"><h3>Total stock units</h3><p class="value">${totalStock}</p></article>
        <article class="card"><h3>Low stock products</h3><p class="value">${lowStock}</p></article>
        <article class="card"><h3>Sales today</h3><p class="value">${todaySales.length}</p></article>
        <article class="card"><h3>Total sales amount</h3><p class="value">${money(sales.reduce((a, s) => a + s.total, 0))}</p></article>
        <article class="card"><h3>Today amount</h3><p class="value">${money(salesTodayAmount)}</p></article>
      </div>

      <article class="panel">
        <div class="panel-header"><h3>Quick actions</h3></div>
        <div class="row-actions">
          <button data-go="sales">Register sale</button>
          <button data-go="products">Add product</button>
          <button data-go="inventory">Adjust stock</button>
          <button data-go="clients">Add client</button>
        </div>
      </article>

      <div class="cards-grid" style="grid-template-columns: 1fr 1fr;">
        <article class="panel">
          <h3>Recent sales</h3>
          ${sales.length ? `<div class="table-wrap" style="margin-top:0.8rem;"><table><thead><tr><th>Date</th><th>Client</th><th>Total</th></tr></thead><tbody>${sales.slice(-5).reverse().map((s) => `<tr><td>${s.date}</td><td>${(getData().clients.find((c) => c.id === s.clientId) || {}).name || 'N/A'}</td><td>${money(s.total)}</td></tr>`).join('')}</tbody></table></div>` : '<div class="empty-state" style="margin-top:0.8rem;">No sales registered.</div>'}
        </article>

        <article class="panel">
          <h3>Recent inventory movements</h3>
          ${movements.length ? `<div class="table-wrap" style="margin-top:0.8rem;"><table><thead><tr><th>Date</th><th>Type</th><th>Product</th><th>Qty</th></tr></thead><tbody>${movements.slice(-5).reverse().map((m) => `<tr><td>${m.date}</td><td>${m.type}</td><td>${(products.find((p) => p.id === m.productId) || {}).name || ''}</td><td>${m.quantity}</td></tr>`).join('')}</tbody></table></div>` : '<div class="empty-state" style="margin-top:0.8rem;">No movements yet.</div>'}
        </article>
      </div>
    `;

    sectionContainer.querySelectorAll('[data-go]').forEach((button) => {
      button.addEventListener('click', () => {
        state.activeSection = button.dataset.go;
        renderNav();
        renderActiveSection();
      });
    });
  }

  function renderProducts() {
    const { products } = getData();
    const canManage = state.user.role === 'admin';
    sectionContainer.innerHTML = `
      <article class="panel">
        <div class="panel-header"><h3>${canManage ? 'Products management' : 'Catalog'}</h3></div>
        ${canManage ? `<form id="productForm" class="inline-form">
          <input name="name" placeholder="Product name" required />
          <input name="category" placeholder="Category" required />
          <input name="sku" placeholder="SKU" required />
          <input name="salePrice" type="number" min="0" placeholder="Sale price" required />
          <input name="purchasePrice" type="number" min="0" placeholder="Purchase price" required />
          <input name="stock" type="number" min="0" placeholder="Stock" required />
          <input name="minStock" type="number" min="0" placeholder="Min stock" required />
          <input name="image" placeholder="Icon (emoji)" value="🧊" />
          <input name="description" placeholder="Description" required />
          <button type="submit">Add product</button>
        </form>` : ''}
        ${flashHtml()}
      </article>

      <article class="panel">
        <div class="table-wrap">
          <table>
            <thead><tr><th>Item</th><th>SKU</th><th>Category</th><th>Purchase</th><th>Sale</th><th>Stock</th><th>Status</th>${canManage ? '<th>Actions</th>' : ''}</tr></thead>
            <tbody>
              ${products.map((p) => {
                const status = stockStatus(p);
                return `<tr><td>${p.image} ${p.name}<br/><small>${p.description}</small></td><td>${p.sku}</td><td>${p.category}</td><td>${money(p.purchasePrice)}</td><td>${money(p.salePrice)}</td><td>${p.stock}</td><td><span class="badge ${status.className}">${status.text}</span></td>${canManage ? `<td><div class="row-actions"><button class="secondary" data-edit="${p.id}">Edit</button><button class="danger" data-delete="${p.id}">Delete</button></div></td>` : ''}</tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </article>
    `;

    if (canManage) {
      document.getElementById('productForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const data = Object.fromEntries(new FormData(form).entries());
        const productsData = load(KEY.products, []);
        productsData.push({
          id: uid(),
          name: data.name,
          category: data.category,
          sku: data.sku,
          description: data.description,
          purchasePrice: Number(data.purchasePrice),
          salePrice: Number(data.salePrice),
          stock: Number(data.stock),
          minStock: Number(data.minStock),
          status: 'active',
          image: data.image || '🧊'
        });
        save(KEY.products, productsData);
        notify('success', 'Product added successfully.');
        renderProducts();
      });

      sectionContainer.querySelectorAll('[data-delete]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const productsData = load(KEY.products, []).filter((p) => p.id !== btn.dataset.delete);
          save(KEY.products, productsData);
          notify('success', 'Product deleted.');
          renderProducts();
        });
      });

      sectionContainer.querySelectorAll('[data-edit]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const productsData = load(KEY.products, []);
          const current = productsData.find((p) => p.id === btn.dataset.edit);
          const newPrice = window.prompt('New sale price', current.salePrice);
          if (newPrice === null) return;
          current.salePrice = Number(newPrice);
          save(KEY.products, productsData);
          notify('success', 'Product updated.');
          renderProducts();
        });
      });
    }
  }

  function renderInventory() {
    const { products, movements } = getData();
    const canManage = state.user.role === 'admin';
    sectionContainer.innerHTML = `
      <article class="panel">
        <div class="panel-header"><h3>Current stock by product</h3></div>
        <div class="table-wrap"><table><thead><tr><th>Product</th><th>Stock</th><th>Min</th><th>Status</th></tr></thead><tbody>
          ${products.map((p) => { const status = stockStatus(p); return `<tr><td>${p.name}</td><td>${p.stock}</td><td>${p.minStock}</td><td><span class="badge ${status.className}">${status.text}</span></td></tr>`; }).join('')}
        </tbody></table></div>
      </article>

      ${canManage ? `<article class="panel"><h3>Manual stock adjustment</h3>
        <form id="movementForm" class="inline-form" style="margin-top:0.8rem;">
          <select name="productId" required>${products.map((p) => `<option value="${p.id}">${p.name}</option>`).join('')}</select>
          <select name="type" required><option value="stock_in">Stock in</option><option value="stock_out">Stock out</option></select>
          <input name="quantity" type="number" min="1" placeholder="Quantity" required />
          <input name="date" type="date" value="${today()}" required />
          <input name="reason" placeholder="Reason" required />
          <button type="submit">Save movement</button>
        </form>
        ${flashHtml()}
      </article>` : ''}

      <article class="panel"><h3>Movement history</h3>
      ${movements.length ? `<div class="table-wrap" style="margin-top:0.8rem;"><table><thead><tr><th>Date</th><th>Product</th><th>Type</th><th>Qty</th><th>Reason</th></tr></thead><tbody>
      ${movements.slice().reverse().map((m) => `<tr><td>${m.date}</td><td>${(products.find((p) => p.id === m.productId) || {}).name || ''}</td><td>${m.type}</td><td>${m.quantity}</td><td>${m.reason}</td></tr>`).join('')}
      </tbody></table></div>` : '<div class="empty-state" style="margin-top:0.8rem;">No stock movements registered.</div>'}
      </article>
    `;

    if (canManage) {
      document.getElementById('movementForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.currentTarget).entries());
        const productsData = load(KEY.products, []);
        const product = productsData.find((p) => p.id === data.productId);
        const qty = Number(data.quantity);
        if (data.type === 'stock_out' && product.stock < qty) {
          notify('error', 'Stock out rejected: insufficient stock.');
          renderInventory();
          return;
        }
        product.stock += data.type === 'stock_in' ? qty : -qty;
        save(KEY.products, productsData);
        const movs = load(KEY.movements, []);
        movs.push({ id: uid(), productId: data.productId, type: data.type, quantity: qty, reason: data.reason, date: data.date });
        save(KEY.movements, movs);
        notify('success', 'Inventory movement saved successfully.');
        renderInventory();
      });
    }
  }

  function renderSales() {
    const { products, sales, clients } = getData();
    const isAdmin = state.user.role === 'admin';
    const list = isAdmin ? sales : sales.filter((s) => s.clientId === state.user.clientId);

    sectionContainer.innerHTML = `
      ${isAdmin ? `<article class="panel"><h3>New sale</h3>
      <form id="saleForm" class="form-grid" style="margin-top:0.8rem;">
        <div class="inline-form">
          <select name="clientId" required><option value="">Select client</option>${clients.map((c) => `<option value="${c.id}">${c.name}</option>`).join('')}</select>
          <input name="date" type="date" value="${today()}" required />
          <select name="paymentMethod"><option>Cash</option><option>Transfer</option><option>Card</option><option>Credit</option></select>
        </div>
        <div id="saleItems"></div>
        <div class="row-actions"><button class="secondary" id="addItem" type="button">Add product</button><button type="submit">Save sale</button></div>
        <textarea name="notes" placeholder="Notes"></textarea>
      </form>
      ${flashHtml()}
      </article>` : ''}

      <article class="panel"><h3>${isAdmin ? 'Sales history' : 'My orders'}</h3>
      ${list.length ? `<div class="table-wrap" style="margin-top:0.8rem;"><table><thead><tr><th>Date</th><th>Client</th><th>Items</th><th>Payment</th><th>Total</th></tr></thead><tbody>
      ${list.slice().reverse().map((s) => `<tr><td>${s.date}</td><td>${(clients.find((c) => c.id === s.clientId) || {}).name || ''}</td><td>${s.items.map((i) => `${(products.find((p) => p.id === i.productId) || {}).sku || ''} x${i.qty}`).join(', ')}</td><td>${s.paymentMethod}</td><td>${money(s.total)}</td></tr>`).join('')}
      </tbody></table></div>` : '<div class="empty-state" style="margin-top:0.8rem;">No sales available.</div>'}
      </article>
    `;

    if (!isAdmin) return;

    const itemsHost = document.getElementById('saleItems');
    const addLine = () => {
      const row = document.createElement('div');
      row.className = 'inline-form';
      row.style.marginBottom = '0.5rem';
      row.innerHTML = `
        <select name="productId" required><option value="">Product</option>${products.map((p) => `<option value="${p.id}" data-price="${p.salePrice}" data-stock="${p.stock}">${p.name} (${p.stock}u)</option>`).join('')}</select>
        <input name="qty" type="number" min="1" value="1" required />
        <input name="unitPrice" type="number" min="0" placeholder="Unit price" required />
        <button class="danger" type="button">Remove</button>
      `;
      row.querySelector('select[name="productId"]').addEventListener('change', (e) => {
        const opt = e.target.selectedOptions[0];
        row.querySelector('input[name="unitPrice"]').value = opt?.dataset.price || '';
      });
      row.querySelector('button').addEventListener('click', () => row.remove());
      itemsHost.appendChild(row);
    };

    addLine();
    document.getElementById('addItem').addEventListener('click', addLine);

    document.getElementById('saleForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const clientId = formData.get('clientId');
      const date = formData.get('date');
      const paymentMethod = formData.get('paymentMethod');
      const notes = formData.get('notes');
      const rows = [...itemsHost.querySelectorAll('.inline-form')];
      const items = rows.map((row) => ({
        productId: row.querySelector('select[name="productId"]').value,
        qty: Number(row.querySelector('input[name="qty"]').value),
        unitPrice: Number(row.querySelector('input[name="unitPrice"]').value)
      })).filter((i) => i.productId && i.qty > 0);

      if (!clientId || !items.length) {
        notify('error', 'Complete client and at least one product line.');
        renderSales();
        return;
      }

      const productsData = load(KEY.products, []);
      for (const item of items) {
        const product = productsData.find((p) => p.id === item.productId);
        if (!product || product.stock < item.qty) {
          notify('error', `Insufficient stock for ${product ? product.name : 'selected product'}.`);
          renderSales();
          return;
        }
      }

      items.forEach((item) => {
        const product = productsData.find((p) => p.id === item.productId);
        product.stock -= item.qty;
      });
      save(KEY.products, productsData);

      const subtotal = items.reduce((acc, i) => acc + i.qty * i.unitPrice, 0);
      const sale = { id: uid(), clientId, date, paymentMethod, notes, items, subtotal, total: subtotal, createdBy: state.user.id };
      const salesData = load(KEY.sales, []);
      salesData.push(sale);
      save(KEY.sales, salesData);

      const movementsData = load(KEY.movements, []);
      items.forEach((item) => {
        movementsData.push({ id: uid(), productId: item.productId, type: 'stock_out', quantity: item.qty, reason: `Sale ${sale.id}`, date });
      });
      save(KEY.movements, movementsData);

      notify('success', `Sale saved successfully. Total: ${money(sale.total)}.`);
      renderSales();
    });
  }

  function renderClients() {
    const { clients } = getData();
    sectionContainer.innerHTML = `
      <article class="panel"><h3>Clients</h3>
      <form id="clientForm" class="inline-form" style="margin-top:0.8rem;">
        <input name="name" placeholder="Name" required />
        <input name="company" placeholder="Company" required />
        <input name="phone" placeholder="Phone" required />
        <input name="email" type="email" placeholder="Email" required />
        <input name="address" placeholder="Address" required />
        <input name="notes" placeholder="Notes" />
        <button type="submit">Add client</button>
      </form>
      ${flashHtml()}
      </article>

      <article class="panel"><div class="table-wrap"><table><thead><tr><th>Name</th><th>Company</th><th>Phone</th><th>Email</th><th>Address</th><th>Notes</th><th>Actions</th></tr></thead><tbody>
      ${clients.map((c) => `<tr><td>${c.name}</td><td>${c.company}</td><td>${c.phone}</td><td>${c.email}</td><td>${c.address}</td><td>${c.notes || ''}</td><td><div class="row-actions"><button class="secondary" data-edit="${c.id}">Edit</button><button class="danger" data-delete="${c.id}">Delete</button></div></td></tr>`).join('')}
      </tbody></table></div></article>
    `;

    document.getElementById('clientForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(e.currentTarget).entries());
      const clientsData = load(KEY.clients, []);
      clientsData.push({ id: uid(), ...data });
      save(KEY.clients, clientsData);
      notify('success', 'Client added.');
      renderClients();
    });
    sectionContainer.querySelectorAll('[data-delete]').forEach((btn) => btn.addEventListener('click', () => {
      save(KEY.clients, load(KEY.clients, []).filter((c) => c.id !== btn.dataset.delete));
      notify('success', 'Client removed.');
      renderClients();
    }));
    sectionContainer.querySelectorAll('[data-edit]').forEach((btn) => btn.addEventListener('click', () => {
      const clientsData = load(KEY.clients, []);
      const client = clientsData.find((c) => c.id === btn.dataset.edit);
      const newPhone = window.prompt('Update phone', client.phone);
      if (newPhone === null) return;
      client.phone = newPhone;
      save(KEY.clients, clientsData);
      notify('success', 'Client updated.');
      renderClients();
    }));
  }

  function renderUsers() {
    const { users, clients } = getData();
    sectionContainer.innerHTML = `
      <article class="panel"><h3>System users</h3>
      <form id="userForm" class="inline-form" style="margin-top:0.8rem;">
        <input name="name" placeholder="Full name" required />
        <input name="username" placeholder="Username" required />
        <input name="password" placeholder="Password" required />
        <select name="role"><option value="admin">Admin</option><option value="client">Client</option></select>
        <select name="clientId"><option value="">Client link (optional)</option>${clients.map((c) => `<option value="${c.id}">${c.name}</option>`).join('')}</select>
        <button type="submit">Add user</button>
      </form>
      ${flashHtml()}
      </article>

      <article class="panel"><div class="table-wrap"><table><thead><tr><th>Name</th><th>Username</th><th>Role</th><th>Linked client</th><th>Actions</th></tr></thead><tbody>
      ${users.map((u) => `<tr><td>${u.name}</td><td>${u.username}</td><td><span class="badge role-${u.role}">${u.role}</span></td><td>${(clients.find((c) => c.id === u.clientId) || {}).name || '-'}</td><td><div class="row-actions"><button class="secondary" data-role="${u.id}">Toggle role</button></div></td></tr>`).join('')}
      </tbody></table></div></article>
    `;

    document.getElementById('userForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(e.currentTarget).entries());
      const usersData = load(KEY.users, []);
      if (usersData.some((u) => u.username === data.username)) {
        notify('error', 'Username already exists.');
        renderUsers();
        return;
      }
      usersData.push({ id: uid(), name: data.name, username: data.username, password: data.password, role: data.role, clientId: data.clientId || null });
      save(KEY.users, usersData);
      notify('success', 'User created.');
      renderUsers();
    });

    sectionContainer.querySelectorAll('[data-role]').forEach((btn) => btn.addEventListener('click', () => {
      const usersData = load(KEY.users, []);
      const user = usersData.find((u) => u.id === btn.dataset.role);
      user.role = user.role === 'admin' ? 'client' : 'admin';
      save(KEY.users, usersData);
      notify('success', 'User role updated.');
      renderUsers();
    }));
  }

  function renderReports() {
    const { products, sales, movements } = getData();
    const byProduct = {};
    sales.forEach((sale) => sale.items.forEach((item) => {
      byProduct[item.productId] = (byProduct[item.productId] || 0) + item.qty;
    }));
    const top = Object.entries(byProduct)
      .map(([productId, qty]) => ({ product: products.find((p) => p.id === productId)?.name || 'Unknown', qty }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);

    sectionContainer.innerHTML = `
      <div class="cards-grid">
        <article class="card"><h3>Low stock list</h3><p class="value">${products.filter((p) => p.stock <= p.minStock).length}</p></article>
        <article class="card"><h3>Recent movements</h3><p class="value">${movements.length}</p></article>
        <article class="card"><h3>Sales records</h3><p class="value">${sales.length}</p></article>
      </div>

      <article class="panel"><h3>Top selling products</h3>
      ${top.length ? `<div class="table-wrap" style="margin-top:0.8rem;"><table><thead><tr><th>Product</th><th>Units sold</th></tr></thead><tbody>${top.map((t) => `<tr><td>${t.product}</td><td>${t.qty}</td></tr>`).join('')}</tbody></table></div>` : '<div class="empty-state" style="margin-top:0.8rem;">No sales to analyze yet.</div>'}
      </article>

      <article class="panel"><h3>Sales by product</h3>
      <div class="table-wrap" style="margin-top:0.8rem;"><table><thead><tr><th>Product</th><th>Units sold</th><th>Stock now</th></tr></thead><tbody>
      ${products.map((p) => `<tr><td>${p.name}</td><td>${byProduct[p.id] || 0}</td><td>${p.stock}</td></tr>`).join('')}
      </tbody></table></div>
      </article>
    `;
  }

  function renderSettings() {
    sectionContainer.innerHTML = `
      <article class="panel">
        <h3>Settings</h3>
        <p style="margin-top:0.5rem;color:#60709a;">Frontend demo settings for this localStorage version.</p>
        <div class="row-actions" style="margin-top:0.8rem;">
          <button id="resetData" class="danger">Reset demo data</button>
        </div>
      </article>
    `;

    document.getElementById('resetData').addEventListener('click', () => {
      localStorage.clear();
      seedIfNeeded();
      localStorage.removeItem(KEY.session);
      state.user = null;
      appView.classList.add('hidden');
      loginView.classList.remove('hidden');
      renderLogin('Data reset complete. Please login again.');
    });
  }

  function init() {
    seedIfNeeded();
    const session = load(KEY.session, null);
    if (session?.id) {
      state.user = session;
      showApp();
    } else {
      renderLogin();
    }
  }

  init();
})();
