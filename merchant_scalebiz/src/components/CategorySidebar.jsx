"use client";

import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  ChevronRight,
  Sofa, // Furniture
  CookingPot, // Cooking
  Shirt, // Fashion
  Gem, // Accessories (using Gem for jewelry/accessories)
  Clock, // Clocks
  Lightbulb, // Lighting
  Gamepad, // Toys
  Hand, // Hand Made
  Sparkles, // Minimalism (using sparkles for clean/minimal)
  Laptop, // Electronics
  MoreHorizontal, // Show More
  Info, // For general info/placeholder
  Headphones, // For support
  ChevronUp, // For 'Show Less'
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@/lib/api.js";
import { cn } from "@/lib/utils";
import MegaMenuContentColumns from "./MegaMenuContentColumns"; // Import MegaMenuContentColumns
import { useTranslation } from "react-i18next"; // Import useTranslation
import { useStorePath } from "@/hooks/use-store-path"; // Import useStorePath

// Map category slugs to Lucide icons
const categoryIconMap = {
  furniture: Sofa,
  cooking: CookingPot,
  fashion: Shirt,
  accessories: Gem,
  clocks: Clock,
  lighting: Lightbulb,
  toys: Gamepad,
  "hand-made": Hand,
  minimalism: Sparkles,
  electronics: Laptop,
  apparel: Shirt, // Added for common categories
  footwear: Gamepad, // Using Gamepad as a placeholder for footwear
  outerwear: Shirt, // Using Shirt as a placeholder for outerwear
  bags: Gem, // Using Gem as a placeholder for bags
  watches: Clock, // Using Clock for watches
  "home-goods": Sofa, // Using Sofa for home goods
  "t-shirt": Shirt, // Specific product type
  "drop-shoulder": Shirt,
  "normal-tee": Shirt,
  // Add more mappings as needed
};

const CategorySidebar = ({ onLinkClick, className }) => { // Added className prop
  const { t } = useTranslation(); // Initialize useTranslation
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, bottom: "auto" }); // State for dynamic positioning
  const hoverTimeoutRef = useRef(null);
  const categoryRefs = useRef({}); // To store refs for each category item
  const getPath = useStorePath(); // Initialize useStorePath

  const {
    data: categories,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
  

  const handleMouseEnter = (category, event) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setHoveredCategory(category);

    // Calculate position
    const liElement = event.currentTarget;
    if (liElement) {
      const liRect = liElement.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const estimatedMenuHeight = 400; // A reasonable estimate for the mega menu's max height

      // Check if there's enough space below
      if (
        liRect.bottom + estimatedMenuHeight > viewportHeight &&
        liRect.top > estimatedMenuHeight
      ) {
        // Not enough space below, and enough space above: position upwards
        setMenuPosition({ bottom: 0, top: "auto" });
      } else {
        // Enough space below, or not enough space above: position downwards
        setMenuPosition({ top: 0, bottom: "auto" });
      }
    }
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredCategory(null);
    }, 100);
  };

  if (isLoading) {
    return (
      <div className={cn("bg-card p-4 rounded-md", className)}> {/* Apply className here */}
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-6 bg-muted rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    console.error("Error fetching categories:", error);
    return (
      <div className={cn("bg-card p-4 rounded-md text-destructive", className)}> {/* Apply className here */}
        {t('error_loading_categories')}
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div className={cn("relative", className)}>
      {/* ALL CATEGORIES Dropdown Button */}
      <div className="relative">
        <button
          className="flex items-center justify-between w-full p-3 px-5 text-base font-medium bg-[#111111] text-white hover:bg-[#222222] transition-colors"
          onMouseEnter={() => setHoveredCategory('all-categories')}
          onMouseLeave={handleMouseLeave}
        >
          <span className="flex items-center">
            <Menu className="h-4 w-4 mr-2" />
            ALL CATEGORIES
          </span>
          <ChevronRight className="h-4 w-4" />
        </button>

        {/* Mega Menu for all categories, appears on hover */}
        {(hoveredCategory === 'all-categories' || hoveredCategory?.id === 'all-categories') && (
          <div
            className="absolute left-full ml-2 w-[800px] bg-white border border-gray-200 shadow-lg z-50 animate-in fade-in-0 zoom-in-95 flex"
            style={{ top: 0, bottom: 'auto' }}
            onMouseEnter={() => setHoveredCategory('all-categories')}
            onMouseLeave={handleMouseLeave}
          >
            <MegaMenuContentColumns
              categories={categories}
              onLinkClick={onLinkClick}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CategorySidebar;