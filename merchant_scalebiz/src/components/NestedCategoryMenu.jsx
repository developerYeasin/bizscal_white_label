"use client";

import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStorePath } from "@/hooks/use-store-path";

const NestedCategoryMenu = ({ items, onLinkClick, level = 0 }) => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const timeoutRef = useRef(null);
  const getPath = useStorePath();

  const handleMouseEnter = (item) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setHoveredItem(item);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHoveredItem(null);
    }, 100); // Short delay to prevent flickering
  };

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <ul className="space-y-1">
      {items.map((item) => {
        const hasSubCategories = item.subCategories && item.subCategories.length > 0;
        const isHovered = hoveredItem?.id === item.id;

        return (
          <li
            key={item.id}
            className="relative"
            onMouseEnter={() => handleMouseEnter(item)}
            onMouseLeave={handleMouseLeave}
          >
            <Link
              to={getPath(item.path || `/collections/${item.slug}`)}
              onClick={onLinkClick}
              className={cn(
                "flex items-center justify-between p-2 text-sm transition-colors rounded-md",
                level === 0 ? "font-medium text-foreground hover:bg-accent hover:text-dynamic-primary-color" : "text-muted-foreground hover:bg-accent hover:text-dynamic-primary-color"
              )}
            >
              <span>{item.name}</span>
              {hasSubCategories && (
                <ChevronRight className="h-4 w-4 text-muted-foreground ml-2" />
              )}
            </Link>

            {isHovered && hasSubCategories && (
              <div
                className={cn(
                  "absolute top-0 left-full ml-2 bg-card border border-border rounded-md shadow-md p-2 z-50 animate-in fade-in-0 zoom-in-95 min-w-[200px]",
                  level > 0 ? "min-w-[180px]" : "min-w-[220px]" // Adjust width based on level
                )}
                onMouseEnter={() => handleMouseEnter(item)} // Keep open if mouse re-enters popup
                onMouseLeave={handleMouseLeave} // Allow closing if mouse leaves popup
              >
                <NestedCategoryMenu items={item.subCategories} onLinkClick={onLinkClick} level={level + 1} />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default NestedCategoryMenu;