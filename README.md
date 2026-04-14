# Electrofull Web App

Electrofull is a **frontend-only inventory and sales web application** for automotive air conditioning parts and repair products.
It runs directly from `index.html` and stores demo data in the browser using `localStorage`.

## What this app includes

- Login with role-based access (admin/client)
- Dashboard with business metrics
- Product catalog with stock status badges
- Manual stock adjustments with movement history
- Manual sales registration with multi-item support
- Automatic stock deduction when saving sales
- Clients and users management (admin)
- Basic reports (top products, low stock, movements)
- Responsive modern SaaS-style UI

## Demo users

Use these credentials on the login screen:

- **Admin**: `admin` / `admin123`
- **Client**: `cliente` / `cliente123`

## Role behavior

### Admin can access:
- Dashboard
- Products
- Inventory
- Sales
- Clients
- Users
- Reports
- Settings

### Client can access:
- Dashboard (limited)
- Products (catalog)
- Availability / stock view
- My sales/orders history

## How login works

- On successful login, the selected user is stored in `localStorage` under a session key.
- The app restores the session after refresh.
- Logout clears only the session key.

## Data persistence (localStorage)

The app uses these keys:
- `electrofull_users`
- `electrofull_products`
- `electrofull_clients`
- `electrofull_sales`
- `electrofull_movements`
- `electrofull_session`

Seed data is created **only if keys are missing**.

## Initial seed data

Includes:
- 2 demo users (admin/client)
- 6 automotive AC products
- 3 sample clients
- Empty sales and inventory movement history

## Editing products and users

- **Products**: open `Products` section (admin), use add/edit/delete actions.
- **Users**: open `Users` section (admin), create demo users and assign role.
- **Clients**: open `Clients` section (admin), add/edit/delete clients.

## Frontend-only limitation

This version is intended for demos and GitHub Pages deployment.
There is **no backend** and no secure password hashing, so credentials are only for local demo usage.

## Run

Open `index.html` in a browser (or deploy on GitHub Pages).
No build step or framework is required.
