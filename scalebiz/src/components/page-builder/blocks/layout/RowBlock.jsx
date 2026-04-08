"use client";

import React from "react";

/**
 * Row Block Component
 *
 * Horizontal flex container for laying out child blocks in a row.
 * Provides:
 * - Flexbox alignment and justification
 * - Gap (spacing between children)
 * - Wrapping behavior
 * - Padding and margin
 * - Background color
 */
const RowBlock = ({ data, children }) => {
  const {
    justifyContent = "flex-start", // 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly'
    alignItems = "stretch", // 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline'
    flexWrap = "wrap", // 'wrap' | 'nowrap' | 'wrap-reverse'
    gap = 16, // pixels between children
    padding = { top: 16, right: 16, bottom: 16, left: 16 },
    margin = { top: 0, right: 0, bottom: 0, left: 0 },
    backgroundColor = "transparent",
    className = "",
  } = data || {};

  const rowStyle = {
    display: "flex",
    flexDirection: "row",
    justifyContent,
    alignItems,
    flexWrap,
    gap: `${gap}px`,
    padding: `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`,
    margin: `${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px`,
    backgroundColor,
    width: "100%",
  };

  const rowClasses = className ? `page-builder-row ${className}` : "page-builder-row";

  // Row is a container - it should be rendered as a sortable context
  return (
    <div className={rowClasses} style={rowStyle} data-is-container="true">
      {children}
    </div>
  );
};

export default RowBlock;
