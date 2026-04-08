"use client";

import React from "react";

/**
 * Grid Block Component
 *
 * CSS Grid container for creating multi-column layouts.
 * Configurable:
 * - Number of columns (2-6)
 * - Gap between grid items
 * - Responsive column counts (optional)
 * - Padding, margin, background
 */
const GridBlock = ({ data, children }) => {
  const {
    columns = 2, // 1-6
    gap = 16,
    padding = { top: 16, right: 16, bottom: 16, left: 16 },
    margin = { top: 0, right: 0, bottom: 0, left: 0 },
    backgroundColor = "transparent",
    columnMinWidth, // optional: use auto-fill with min width instead of fixed columns
    responsive = false, // if true, columns field becomes object { desktop: 3, tablet: 2, mobile: 1 }
    className = "",
  } = data || {};

  // Build grid style
  const gridStyle = {
    display: "grid",
    gap: `${gap}px`,
    padding: `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`,
    margin: `${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px`,
    backgroundColor,
  };

  // Determine grid template columns
  if (columnMinWidth) {
    gridStyle.gridTemplateColumns = `repeat(auto-fill, minmax(${columnMinWidth}px, 1fr))`;
  } else {
    const colCount = typeof columns === "number" ? columns : 2;
    gridStyle.gridTemplateColumns = `repeat(${colCount}, 1fr)`;
  }

  const gridClasses = className ? `page-builder-grid ${className}` : "page-builder-grid";

  return (
    <div className={gridClasses} style={gridStyle} data-is-container="true">
      {children}
    </div>
  );
};

export default GridBlock;
