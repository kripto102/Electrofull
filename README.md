# Electrofull Inventory Management Web App

A complete, beginner-friendly, responsive inventory management web app for **Electrofull** built with plain **HTML, CSS, and JavaScript**.

## Features

### Authentication and Roles
- Login system with role-based access:
  - **Admin**
  - **User**
- Demo credentials included on the login screen.

### Admin Dashboard
- Sidebar navigation with icons.
- Summary cards for:
  - Total products
  - Low stock items
  - Total stock units
  - Sales today
- Recent movement table.

### Product Management
- Create products.
- Edit products.
- Product list with SKU, category, price, and stock.

### Inventory Movements
- Register **inbound** and **outbound** movements.
- Automatic stock updates.
- Movement history table.

### Sales Registration
- Sales registration section.
- **Only admins can register sales**.
- Sales reduce stock automatically and create a related movement.

### Inventory Counting and Adjustments
- Count physical stock for any product.
- Apply adjustment and track stock differences.
- Adjustment history.

### User Management
- Admin-only user creation.
- User list with role information.

### Client Catalog
- Add clients.
- Client list with contact details.

### UI / Design
- Modern blue-white-gray color palette.
- Card-based layout with soft shadows and rounded corners.
- Clean tables and polished forms.
- Responsive mobile and desktop sidebar behavior.
- Professional typography and visual hierarchy.

---

## Folder Structure

```text
Electrofull/
├── index.html          # Main app structure (login + dashboard sections)
├── css/
│   └── styles.css      # Styling, layout, responsive design
├── js/
│   └── app.js          # Application logic (auth, CRUD, inventory, sales)
└── README.md           # Project documentation
```

---

## Technologies Used
- HTML5
- CSS3
- Vanilla JavaScript (ES6+)
- `localStorage` for data persistence
- Font Awesome (icons via CDN)
- Google Fonts (Inter)

---

## How to Run (Step by Step)

### Option 1 (recommended): Python local server
1. Open a terminal.
2. Navigate to the project folder:
   ```bash
   cd /workspace/Electrofull
   ```
3. Start a local server:
   ```bash
   python3 -m http.server 8080
   ```
4. Open your browser and go to:
   ```
   http://localhost:8080
   ```
5. Log in with one of the demo accounts:
   - Admin: `admin` / `admin123`
   - User: `user` / `user123`

### Option 2: Open directly
You can open `index.html` directly in your browser, but a local server is recommended.

---

## Notes for Beginners
- All data is stored in your browser (`localStorage`).
- Data persists after refresh, in the same browser.
- To reset demo data, clear browser local storage for the app origin.

---

## Future Improvements (Optional)
- Replace localStorage with a real backend (Node.js + database).
- Add password hashing and secure sessions.
- Export reports to CSV/PDF.
- Add charts for movement and sales trends.
