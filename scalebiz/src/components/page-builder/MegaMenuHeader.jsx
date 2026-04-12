"use client";

import React from "react";
import { cn } from "@/lib/utils.js";

/**
 * MegaMenuHeader - A mega menu header component
 */
const MegaMenuHeader = ({ data = {}, className = "" }) => {
  const {
    backgroundColor = "#f97316",
    textColor = "#ffffff",
    padding = "medium",
  } = data;

  // Padding sizes
  const paddingSizes = {
    small: "py-2 px-4",
    medium: "py-3 px-6",
    large: "py-4 px-8",
    xlarge: "py-5 px-10",
  };

  return (
    <header
      className={cn(
        "w-full",
        paddingSizes[padding] || paddingSizes.medium,
        className
      )}
      style={{
        backgroundColor: backgroundColor,
        color: textColor,
      }}
    >
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-orange-500 font-bold">A</span>
            </div>
            <span className="text-xl font-bold">AXON</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl mx-8">
          <div className="flex">
            <input
              type="text"
              placeholder="Enter your keyword..."
              className="flex-1 px-4 py-2 rounded-l-lg text-gray-900 focus:outline-none"
            />
            <button className="px-6 py-2 bg-gray-900 text-white rounded-r-lg hover:bg-gray-800">
              Search
            </button>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span>USD</span>
            <span>EN</span>
          </div>
          <div className="flex items-center gap-2">
            <span>My account</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🛒</span>
            <span>0</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="container mx-auto mt-4">
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded">
            <span>☰</span>
            <span>ALL CATEGORIES</span>
          </button>
          <div className="flex items-center gap-6">
            <a href="#" className="text-white hover:text-gray-200">HOME</a>
            <a href="#" className="text-white hover:text-gray-200">SHOP</a>
            <a href="#" className="text-white hover:text-gray-200">BLOG</a>
            <a href="#" className="text-white hover:text-gray-200">PAGES</a>
            <a href="#" className="text-white hover:text-gray-200">ELEMENTOR LIVE</a>
            <a href="#" className="text-white hover:text-gray-200">BUY</a>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default MegaMenuHeader;
