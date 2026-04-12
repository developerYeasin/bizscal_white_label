"use client";

import React from "react";
import { useStoreConfig } from "@/contexts/StoreConfigurationContext.jsx";
import { ChevronDown } from "lucide-react";

/**
 * SystemHeader Block Component for Page Builder
 *
 * Simplified preview of the storefront header based on layout_settings.header
 */
const SystemHeader = ({ data, config }) => {
  const { config: storeConfig, isLoading } = useStoreConfig();

  if (isLoading || (!storeConfig && !data)) {
    return (
      <div className="w-full bg-background border-b h-16 flex items-center justify-center text-sm text-muted-foreground">
        Loading header...
      </div>
    );
  }

  const header = data ? (data.mainNav || data) : (storeConfig.layout_settings?.header || {});
  const topBar = data ? (data.topBar || {}) : (storeConfig.layout_settings?.header?.topBar || {});
  const utilityBar = header.utilityBar || {};
  const mainNav = header;
  const navItems = data ? (data.navItems || data.mainNav?.navItems || []) : (storeConfig.layout_settings?.header?.navItems || []);

  const storeName = storeConfig?.store_name || "Store";
  const logoUrl = mainNav.logoUrl;

  // Helper to render nav item with possible dropdown
  const renderNavItem = (item, idx) => {
    const hasDropdown = item.type === "dropdown" && item.subLinks && item.subLinks.length > 0;
    const hasMegaMenu = item.type === "mega-menu" && item.menuColumns && item.menuColumns.length > 0;

    if (hasDropdown) {
      return (
        <div key={idx} className="relative group">
          <span className="cursor-pointer flex items-center gap-1 text-sm">
            {item.title} <ChevronDown className="h-3 w-3" />
          </span>
          {/* Simple dropdown preview */}
          <div className="absolute left-0 top-full hidden group-hover:block bg-white border shadow-sm min-w-[150px] z-10">
            {item.subLinks.map((sub, i) => (
              <a key={i} href={sub.path} className="block px-3 py-2 text-xs hover:bg-gray-50">{sub.title}</a>
            ))}
          </div>
        </div>
      );
    }

    if (hasMegaMenu) {
      return (
        <div key={idx} className="relative group">
          <span className="cursor-pointer flex items-center gap-1 text-sm">
            {item.title} <ChevronDown className="h-3 w-3" />
          </span>
          {/* Simple mega menu preview */}
          <div className="absolute left-0 top-full hidden group-hover:block bg-white border shadow-sm min-w-[400px] z-10 p-4 grid grid-cols-3 gap-4">
            {item.menuColumns.map((col, ci) => (
              <div key={ci}>
                <p className="text-xs font-semibold mb-2">{col.title}</p>
                {col.subCategories && col.subCategories.map((sub, si) => (
                  <a key={si} href={sub.path} className="block px-1 py-1 text-xs hover:underline">{sub.title}</a>
                ))}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <a key={idx} href={item.path} className="text-sm hover:underline">
        {item.title}
      </a>
    );
  };

  return (
    <div className="w-full bg-background border-b">
      {/* Top Bar */}
      {topBar.enabled && topBar.messages && topBar.messages.length > 0 && (
        <div className="bg-muted py-1 px-4 text-xs text-center space-x-4">
          {topBar.messages.filter(Boolean).map((msg, i) => (
            <span key={i}>{msg}</span>
          ))}
        </div>
      )}

      {/* Utility Bar */}
      {utilityBar.enabled && (
        <div className="bg-primary/10 py-1 px-4 flex items-center justify-between text-xs">
          <span className="truncate flex-1">{utilityBar.announcementText}</span>
          <div className="flex items-center gap-2 ml-4">
            {utilityBar.showLanguageSelector && <span>🌐 EN</span>}
            {utilityBar.showCurrencySelector && <span>$ USD</span>}
            {utilityBar.showAuthLinks && (
              <>
                <a href="/login" className="hover:underline">Login</a>
                <a href="/register" className="hover:underline">Register</a>
              </>
            )}
          </div>
        </div>
      )}

      {/* Main Navigation */}
      {mainNav.enabled && (
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="h-8 object-contain" />
            ) : (
              <span className="font-bold text-lg">{storeName}</span>
            )}
          </div>

          {/* Nav Items */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item, i) => renderNavItem(item, i))}
          </nav>

          {/* Utility Icons */}
          <div className="flex items-center gap-3">
            {mainNav.showSearchIcon && (
              <button className="p-1 hover:bg-muted rounded"><svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></button>
            )}
            {mainNav.showCartIcon && (
              <button className="p-1 hover:bg-muted rounded"><svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg></button>
            )}
            {mainNav.showWishlistIcon && (
              <button className="p-1 hover:bg-muted rounded"><svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg></button>
            )}
            {mainNav.showCompareIcon && (
              <button className="p-1 hover:bg-muted rounded"><svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg></button>
            )}
            {mainNav.showGridIcon && (
              <button className="p-1 hover:bg-muted rounded"><svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg></button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemHeader;
