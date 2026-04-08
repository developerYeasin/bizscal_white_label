# ScaleBiz Deployment Summary

## Date
2026-04-06

## Changes Deployed

### 1. Page Builder V2 - Header/Footer Integration

**New Files Created:**
- `scalebiz/src/components/page-builder/blocks/SystemHeader.jsx` - Live header preview
- `scalebiz/src/components/page-builder/blocks/SystemFooter.jsx` - Live footer preview
- `scalebiz/src/components/page-builder/settings/SystemHeaderSettings.jsx` - Header settings adapter
- `scalebiz/src/components/page-builder/settings/SystemFooterSettings.jsx` - Footer settings adapter

**Modified Files:**
- `scalebiz/src/components/page-builder/index.js` - Exports new blocks
- `scalebiz/src/components/page-builder/Canvas.jsx` - Renders header/footer, handles selection
- `scalebiz/src/pages/PageBuilderV2.jsx` - Added toggles, state management, settings mapping

### 2. Features Added

- **Header/Footer Toggles**: Top of right sidebar in Page Builder
- **Live Preview**: Header and footer render in canvas when enabled
- **Editable Settings**: Click header/footer to edit all settings (nav, links, colors, etc.)
- **Per-Page Visibility**: Each custom page can show/hide header and footer independently
- **System Blocks**: Header and Footer are first-class citizens in the page builder

## Deployment Steps Performed

1. ✅ Built dashboard (scalebiz): `npm run build`
2. ✅ Built storefront (merchant_scalebiz): `npm run build`
3. ✅ Copied dashboard to `/var/www/scalebiz`
4. ✅ Copied storefront to `/var/www/merchant-scalebiz`
5. ✅ Reloaded Nginx
6. ✅ Restarted backend service

## Access URLs

- **Dashboard (Admin)**: http://187.124.88.66:8085/
- **Storefront**: http://187.124.88.66:8080/
- **Backend API**: http://187.124.88.66:4000/api

## How to Test

1. Log into Dashboard at http://187.124.88.66:8085/auth/login
   - Default: admin@example.com / admin123

2. Navigate to **Page Builder V2**: 
   - URL: `/custom-pages-v2` 
   - (Note: The old Page Builder is at `/custom-pages`)

3. Click **"Create New Page"**

4. **Observe the Right Sidebar**:
   - At the top, you'll see a panel with two toggle switches:
     - `[Toggle] Header` (with PanelTop icon)
     - `[Toggle] Footer` (with PanelBottom icon)

5. **Canvas Preview**:
   - When toggled ON, the header and footer render around your content blocks
   - When toggled OFF, they are hidden

6. **Edit Header/Footer**:
   - Click directly on the header or footer in the canvas
   - A blue border appears showing it's selected
   - The Properties Panel (bottom right) now shows the full **Header Settings** or **Footer Settings** form
   - Edit any field (logo, navigation, colors, links, etc.)
   - Changes are saved globally when you click "Save Settings" in that panel
   - The preview updates in real-time

7. **Save Page**:
   - Click "Publish" or "Save Draft" in the Toolbar
   - The `showHeader` and `showFooter` preferences are saved with the page

## Notes

- The header/footer settings are **global** - editing them affects all pages where header/footer are shown
- The visibility toggles are **per-page** - you can hide header/footer on specific pages
- System blocks cannot be deleted or duplicated (buttons disabled)
- The implementation uses the existing Header and Footer components from the storefront, ensuring consistency

## Backward Compatibility

- Old `PageBuilder.jsx` at `/custom-pages` remains unchanged (legacy)
- All existing custom pages continue to work
- New `showHeader`/`showFooter` fields default to `true` for existing pages (backward compatible)

## Next Steps (Optional)

1. Integrate header/footer into **Product Landing Page Editor** (`/products/:id/landing-page`)
2. Add more system blocks (e.g., Announcement Bar as separate block)
3. Extend per-page overrides for header/footer config (not just visibility)
