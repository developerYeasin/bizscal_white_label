"use client";

import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import NestedCategoryMenu from "./NestedCategoryMenu"; // Re-using the existing nested menu logic
import { useStorePath } from "@/hooks/use-store-path";

const MegaMenuContentColumns = ({ categories, onLinkClick }) => {
  const getPath = useStorePath();

  if (!categories || categories.length === 0) {
    return (
      <div className="p-6 text-muted-foreground text-center">
        No sub-categories available.
      </div>
    );
  }

  // Determine number of columns. Max 4 for visual balance.
  const numColumns = Math.min(categories.length, 4);
  const columnClass = `grid-cols-${numColumns}`;

  return (
    <div className={cn("grid gap-x-8 gap-y-4 p-6", columnClass)}>
      {categories.map((columnCategory, colIndex) => (
        <div key={colIndex} className="flex flex-col space-y-2">
          <h3 className="font-bold text-dynamic-primary-color text-lg mb-2">
            <Link to={getPath(columnCategory.path || '#')} className="hover:underline" onClick={onLinkClick}>
              {columnCategory.name}
            </Link>
          </h3>
          {columnCategory.subCategories && columnCategory.subCategories.length > 0 && (
            <NestedCategoryMenu items={columnCategory.subCategories} onLinkClick={onLinkClick} level={1} />
          )}
        </div>
      ))}
    </div>
  );
};

export default MegaMenuContentColumns;