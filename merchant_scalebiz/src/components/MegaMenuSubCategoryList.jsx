"use client";

import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useStorePath } from "@/hooks/use-store-path";

const MegaMenuSubCategoryList = ({ items, onLinkClick, level = 0 }) => {
  const getPath = useStorePath();

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <ul className={cn("space-y-1", level > 1 && "pl-4 border-l border-border ml-2")}>
      {items.map((item) => (
        <li key={item.id}>
          <Link
            to={getPath(item.path || `/collections/${item.slug}`)}
            onClick={onLinkClick}
            className={cn(
              "block py-1 text-sm transition-colors",
              level === 1 // Direct children of the column header
                ? "font-medium text-foreground hover:text-dynamic-primary-color"
                : "text-muted-foreground hover:text-dynamic-primary-color" // Deeper nested items
            )}
          >
            {item.name}
          </Link>
          {item.subCategories && item.subCategories.length > 0 && (
            <MegaMenuSubCategoryList items={item.subCategories} onLinkClick={onLinkClick} level={level + 1} />
          )}
        </li>
      ))}
    </ul>
  );
};

export default MegaMenuSubCategoryList;