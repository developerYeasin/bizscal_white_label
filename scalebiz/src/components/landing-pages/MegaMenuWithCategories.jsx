import React from "react";
import { Button } from "@/components/ui/button.jsx";
import { Badge } from "@/components/ui/badge.jsx";

/**
 * Axon Theme - Mega Menu with Categories Component
 * Multi-level navigation with sidebar categories
 */
const MegaMenuWithCategories = ({ data }) => {
  const {
    menuItems = [
      { title: "Furniture", path: "/furniture" },
      { title: "Cooking", path: "/cooking" },
      { title: "Fashion", path: "/fashion" },
      { title: "Accessories", path: "/accessories" },
      { title: "Clocks", path: "/clocks" },
      { title: "Lighting", path: "/lighting" },
      { title: "Toys", path: "/toys" },
      { title: "Hand Made", path: "/hand-made" },
      { title: "Minimalism", path: "/minimalism" },
      { title: "Electronics", path: "/electronics" },
    ],
    backgroundColor = "#E63946",
    textColor = "#FFFFFF",
  } = data || {};

  return (
    <nav
      className="bg-[#E63946] text-white py-3 px-4"
      style={{ backgroundColor, color: textColor }}
    >
      <div className="flex items-center gap-4">
        {/* Categories Dropdown */}
        <div className="relative group">
          <button className="flex items-center gap-2 font-semibold hover:opacity-80">
            <span>☰</span>
            <span>ALL CATEGORIES</span>
            <span>▼</span>
          </button>
          <div className="absolute left-0 top-full mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div className="py-2">
              {menuItems.map((item, index) => (
                <a
                  key={index}
                  href={item.path}
                  className="block px-4 py-2 hover:bg-gray-100 text-sm"
                >
                  {item.title}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-4">
          <a href="/" className="hover:opacity-80 text-sm font-medium">
            HOME
          </a>
          <a href="/shop" className="hover:opacity-80 text-sm font-medium">
            SHOP
          </a>
          <a href="/blog" className="hover:opacity-80 text-sm font-medium">
            BLOG
          </a>
          <a href="/pages" className="hover:opacity-80 text-sm font-medium">
            PAGES
          </a>
          <a href="/elementor" className="hover:opacity-80 text-sm font-medium">
            ELEMENTOR LIVE
          </a>
          <Button className="bg-white text-[#E63946] hover:bg-gray-100 text-sm">
            BUY
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default MegaMenuWithCategories;
