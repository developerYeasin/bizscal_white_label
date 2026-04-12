import React from "react";
import { Button } from "@/components/ui/button.jsx";
import { Badge } from "@/components/ui/badge.jsx";

/**
 * Ghorer Bazar Theme - Category Navigation Component
 * Horizontal category menu
 */
const CategoryNavigation = ({ data }) => {
  const {
    categories = [
      { name: "OFFER ZONE", path: "/offer-zone" },
      { name: "Best Seller", path: "/best-seller" },
      { name: "Mustard Oil", path: "/mustard-oil" },
      { name: "Ghee (ঘি)", path: "/ghee" },
      { name: "Dates (খেজুর)", path: "/dates" },
      { name: "খোজরা গুড়", path: "/khajorgur" },
      { name: "Honey", path: "/honey" },
      { name: "Masala", path: "/masala" },
      { name: "Nuts & Seeds", path: "/nuts-seeds" },
      { name: "Tea/Coffee", path: "/tea-coffee" },
      { name: "Honeycomb", path: "/honeycomb" },
      { name: "Organic Zone", path: "/organic-zone" },
    ],
    backgroundColor = "#FF6B35",
    textColor = "#FFFFFF",
  } = data || {};

  return (
    <nav
      className="bg-[#FF6B35] text-white py-2 px-4"
      style={{ backgroundColor, color: textColor }}
    >
      <div className="flex items-center gap-4 overflow-x-auto">
        {categories.map((category, index) => (
          <a
            key={index}
            href={category.path}
            className="whitespace-nowrap text-sm font-medium hover:opacity-80 hover:underline"
          >
            {category.name}
          </a>
        ))}
      </div>
    </nav>
  );
};

export default CategoryNavigation;
