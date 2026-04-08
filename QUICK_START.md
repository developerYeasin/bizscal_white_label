# Quick Start Guide

## Running the Application

### 1. Backend
```bash
cd bizscal_white_label/scalebiz_backend
npm install
npm start
```
Runs on http://localhost:3001

### 2. Frontend
```bash
cd bizscal_white_label/scalebiz
npm install
npm run dev
```
Runs on http://localhost:5173

### 3. Hostnames Setup (for mode detection)

Add to your `/etc/hosts`:
```
127.0.0.1 localhost
127.0.0.1 admin.localhost
```

Then access:
- **Admin Portal**: http://admin.localhost:5173/login
- **Storefront**: http://localhost:5173

(Or use `?mode=admin` or `?mode=storefront` query parameter to override)

---

## Key Features Overview

### For Store Owners (Admin)

1. **Dashboard** - Overview of your store
2. **Products** - Add, edit, manage products
3. **Customize Theme** (`/customize-theme`)
   - Split-view editor
   - Change colors, fonts, buttons
   - Live preview that updates instantly
   - Mobile/desktop toggle
4. **Theme Marketplace** (`/theme-marketplace`)
   - Browse themes
   - Apply one-click
5. **Page Builder** (`/custom-pages`)
   - Drag-and-drop blocks
   - Live canvas preview
   - Undo/Redo support
   - Block properties editing
6. **Shop Settings** - Configure header, footer, policies, payments

### For Customers (Storefront)

1. **Home** - Dynamic landing page with blocks
2. **Products** - Browse catalog with filters
3. **Product Detail** - View, select variants, add to cart
4. **Cart** - Review items, update quantities
5. **Checkout** - Multi-step: info → shipping → payment → review
6. **Custom Pages** - Any pages created in Page Builder

---

## How It Works

### Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Single React App                       │
│                                                         │
│  Hostname Detection:                                    │
│  • admin.localhost → Admin Portal                      │
│  • localhost → Storefront                              │
└─────────────────────────────────────────────────────────┘
                            │
                            │ shares
                            ▼
┌─────────────────────────────────────────────────────────┐
│                  Backend API (Node.js)                  │
│  • Multi-tenant (store_id from hostname)               │
│  • RESTful endpoints                                   │
│  • MySQL database                                      │
└─────────────────────────────────────────────────────────┘
```

### State Management

- **React Query** - Server state (products, cart, config)
- **Contexts** - Auth, StoreConfig, ThemeSettings
- **Local State** - UI state (forms, selections)

### Data Flow

1. Store owner customizes theme → updates `store_configurations` table
2. Storefront reads `store_configurations` on load → applies styles
3. Page Builder edits `pages` table with block JSON
4. Storefront renders pages using `ComponentResolver`

---

## Custom Code Injection

In **Customize Theme → Code tab**, you can add:

**CSS** (injected into `<head>`):
```css
.product-card {
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
```

**JavaScript** (injected before `</body>`):
```javascript
console.log('Store initialized');
// Custom tracking, analytics, etc.
```

---

## Block Types (for Page Builder)

Available from current theme:

1. Hero Banner - Full-width image with title, subtitle, CTA
2. Product Carousel - Carousel or grid of products
3. Featured Categories - Grid of category cards
4. Hero Banner Slider - Multiple banner slides
5. Marketing Banner - Promotional banner
6. Feature Blocks - Icon + text feature highlights
7. Product Section - Tabbed or single product display
8. Brand Showcase - Brand logo grid
9. Latest News - Blog posts
10. Category Sidebar - Category navigation
11. Promotional Banners - Multiple promotional images
12. Mid Page Call to Action - CTA section
13. Newsletter Subscription - Email signup form
14. Blog Posts Section - Recent blog posts

---

## Tips & Tricks

### Preview Changes Instantly
- In **Customize Theme**, changes to colors/fonts update the right preview immediately
- No need to save to see changes
- Click **Save Changes** when satisfied

### Test Storefront
- While in admin, click **Open Storefront** in the theme preview
- Or visit http://localhost:5173 directly (in dev)
- Changes in admin are reflected immediately

### Undo Mistakes
- In **Page Builder** and **Customize Theme**, use Undo/Redo buttons
- Up to 50 states remembered

### Create Custom Pages
- Go to **Page Builder** → **Create New Page**
- Add blocks from left sidebar
- Drag to reorder
- Click a block to edit its properties
- Publish when ready
- Page accessible at `/pages/your-slug`

---

## Troubleshooting

### "No theme configuration found"
- Apply a theme first from **Theme Marketplace**
- Then go to **Customize Theme**

### "No products to display"
- Add products in **Products** → **Add Product**
- Ensure products are **Published** (not Draft)

### Preview not updating
- Check that store configuration is loaded (spinner should disappear)
- Try saving changes in Customize Theme
- Hard refresh (Ctrl+Shift+R)

### Cart not working
- Ensure backend is running on port 3001
- Check browser console for CORS errors
- API endpoint `/cart` must be accessible

---

## API Endpoints

### Public (Storefront)
- `GET /products` - List products (with filters)
- `GET /products/:id` - Single product
- `GET /categories` - All categories
- `GET /cart` - Get cart
- `POST /cart/items` - Add to cart
- `PUT /cart/items/:id` - Update quantity
- `DELETE /cart/items/:id` - Remove item
- `POST /orders/incomplete` - Create order
- `PUT /orders/:id` - Update order
- `GET /pages/:slug` - Custom page

### Owner (Admin)
- `GET /owner/store-configuration` - Get store config
- `PUT /owner/store-configuration` - Update config
- `GET /owner/products` - Owner's products
- `POST /owner/products` - Create product
- `PUT /owner/products/:id` - Update product
- `GET /owner/custom-pages` - List pages
- `POST /owner/custom-pages` - Create page
- `PUT /owner/custom-pages/:id` - Update page
- `DELETE /owner/custom-pages/:id` - Delete page
- `GET /owner/themes` - List themes
- `POST /owner/themes/apply` - Apply theme

---

## Next Steps

1. **Seed database** with sample products and categories
2. **Configure payment gateways** (bKash, Nagad, SSLCommerz) in settings
3. **Set up email** (nodemailer) for order confirmations
4. **Customize theme** to match your brand
5. **Create pages** (About, Contact, FAQ) using Page Builder
6. **Test checkout** end-to-end
7. **Deploy** to production (set proper hostnames, SSL)

---

Enjoy your new Shopify-like white-label platform! 🎉
