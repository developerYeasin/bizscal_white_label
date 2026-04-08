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
    <div className={cn("relative bg-card", className)}> {/* Apply className here, removed w-full */}
      {/* <ul className="space-y-1"> */}
      <ul className="">
        {categories.map((category) => {
          const IconComponent =
            categoryIconMap[category.slug] || MoreHorizontal;
          const hasSubCategories =
            category.subCategories && category.subCategories.length > 0;
          const isHovered = hoveredCategory?.id === category.id;

          return (
            <li
              key={category.id}
              className="relative m-0 mt-0"
              ref={(el) => (categoryRefs.current[category.id] = el)} // Assign ref
              onMouseEnter={(e) => handleMouseEnter(category, e)}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                to={getPath(category.path)}
                onClick={onLinkClick}
                className={cn(
                  "flex items-center justify-between p-3 px-5 text-base font-medium transition-colors border-b border-[#11111112]",
                  isHovered
                    ? "bg-accent text-dynamic-primary-color"
                    : "text-foreground hover:bg-accent hover:text-dynamic-primary-color"
                )}
              >
                <span className="flex items-center">
                  {/* <IconComponent className="h-4 w-4 mr-3" /> */}
                  <img src={category?.imageUrl} alt={category?.name} className="h-6 w-6 mr-3" />
                  {category?.name}
                </span>
                {hasSubCategories && (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </Link>

              {/* Mega Menu for subcategories, appears on hover */}
              {isHovered && hasSubCategories && (
                <div
                  className="absolute left-full ml-2 w-[800px] bg-background border border-border shadow-lg z-50 animate-in fade-in-0 zoom-in-95 flex"
                  style={menuPosition} // Apply dynamic style
                  onMouseEnter={() =>
                    handleMouseEnter(category, {
                      currentTarget: categoryRefs.current[category.id],
                    })
                  } // Pass stored ref
                  onMouseLeave={handleMouseLeave}
                >
                  <MegaMenuContentColumns
                    categories={category.subCategories}
                    onLinkClick={onLinkClick}
                  />
                  {/* Optional: Add a promotional image/banner here if desired, similar to the original request */}
                  {/* <div
                    className="w-1/3 bg-cover bg-center flex items-center justify-center text-white"
                    style={{ backgroundImage: `url('https://elessi.b-cdn.net/elementor/wp-content/uploads/2019/02/megamenu-banner.jpg')` }}
                  >
                    <div className="text-center p-4 bg-black/30 rounded-md">
                      <h3 className="text-2xl font-bold">Mega Menu Banner</h3>
                      <p className="text-sm">Shop the latest trends</p>
                    </div>
                  </div> */}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CategorySidebar;