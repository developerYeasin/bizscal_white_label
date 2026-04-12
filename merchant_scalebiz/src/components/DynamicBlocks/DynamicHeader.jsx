"use client";

import React from "react";
import { Link } from "react-router-dom";
import { useStorePath } from "@/hooks/use-store-path";
import { useStore } from "@/context/StoreContext.jsx";
import { ShoppingCart, Search, Menu, User, Globe, Grid as GridIcon, GitCompare, Heart } from "lucide-react";

const DynamicHeader = ({ data }) => {
  const getPath = useStorePath();
  const { storeConfig } = useStore();
  const storeConfiguration = storeConfig?.storeConfiguration || {};
  
  // Get header settings from data prop (this is where the builder saves header settings)
  const topBar = data?.topBar || {};
  const mainNav = data?.mainNav || {};
  const navItems = mainNav.navItems || [];

  return (
    <header className="w-full flex flex-col">
      {/* Top Bar */}
      {topBar?.enabled && topBar.messages?.length > 0 && (
        <div className="bg-black text-white py-2 px-4 text-center text-sm overflow-hidden whitespace-nowrap">
          <div className="animate-marquee inline-block">
            {topBar.messages.map((msg, i) => (
              <span key={i} className="mx-8">{msg}</span>
            ))}
          </div>
        </div>
      )}

      {/* Main Navigation */}
      {mainNav?.enabled && (
        <div className="border-b bg-white py-4 px-4 sticky top-0 z-50 shadow-sm">
          <div className="container mx-auto flex justify-between items-center">
            {/* Logo */}
            <Link to={getPath("/")} className="flex-shrink-0">
              {mainNav.logoUrl ? (
                <img src={mainNav.logoUrl} alt="Logo" className="h-8 md:h-10 w-auto object-contain" />
              ) : (
                <span className="text-xl font-bold">{storeConfiguration?.storeName || "Store"}</span>
              )}
            </Link>

            {/* Desktop Nav Items */}
            <nav className="hidden md:flex items-center gap-8">
              {navItems?.map((item, index) => (
                <div key={index} className="relative group">
                  {item.type === "dropdown" ? (
                    <div className="flex items-center gap-1 cursor-pointer hover:text-primary font-medium uppercase tracking-wider text-sm">
                      {item.title}
                      <Menu className="w-3 h-3" />
                      {/* Sublinks */}
                      <div className="absolute top-full left-0 mt-2 w-48 bg-white border shadow-lg hidden group-hover:block z-50">
                        {item.subLinks?.map((sub, si) => (
                          <Link
                            key={si}
                            to={getPath(sub.path)}
                            className="block px-4 py-2 text-sm hover:bg-gray-100"
                          >
                            {sub.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      to={getPath(item.path)}
                      className="hover:text-primary font-medium uppercase tracking-wider text-sm"
                    >
                      {item.title}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Icons */}
            <div className="flex items-center gap-4 md:gap-6">
              {mainNav.showSearchIcon && (
                <button className="hover:text-primary transition-colors">
                  <Search className="w-5 h-5" />
                </button>
              )}
              {mainNav.showGridIcon && (
                <button className="hover:text-primary transition-colors hidden sm:block">
                  <GridIcon className="w-5 h-5" />
                </button>
              )}
              {mainNav.showWishlistIcon && (
                <button className="hover:text-primary transition-colors hidden sm:block relative">
                  <Heart className="w-5 h-5" />
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">0</span>
                </button>
              )}
              {mainNav.showCompareIcon && (
                <button className="hover:text-primary transition-colors hidden sm:block">
                  <GitCompare className="w-5 h-5" />
                </button>
              )}
              {mainNav.showCartIcon && (
                <button className="hover:text-primary transition-colors relative">
                  <ShoppingCart className="w-5 h-5" />
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">0</span>
                </button>
              )}
              {/* Mobile Menu Icon */}
              <button className="md:hidden hover:text-primary">
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default DynamicHeader;
