"use client";

import React from "react";

/**
 * Column Block Component
 *
 * Vertical container meant to be placed inside a Row.
 * Provides width control (percentage), padding, margin, background.
 * Can also contain other blocks (creating nested layouts).
 */
const ColumnBlock = ({ data, children }) => {
  const {
    width = 100, // percentage (1-100)
    order = 0, // flex order
    alignSelf = "auto", // 'auto' | 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline'
    padding = { top: 16, right: 16, bottom: 16, left: 16 },
    margin = { top: 0, right: 0, bottom: 0, left: 0 },
    backgroundColor = "transparent",
    minHeight = "auto",
    className = "",
  } = data || {};

  const columnStyle = {
    flexBasis: `${width}%`,
    flexGrow: width > 0 ? 1 : 0,
    flexShrink: 1,
    order,
    alignSelf,
    padding: `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`,
    margin: `${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px`,
    backgroundColor,
    minHeight: typeof minHeight === "number" ? `${minHeight}px` : minHeight,
    display: "flex",
    flexDirection: "column",
  };

  const columnClasses = className ? `page-builder-column ${className}` : "page-builder-column";

  return (
    <div className={columnClasses} style={columnStyle} data-is-container="true">
      {children}
    </div>
  );
};

export default ColumnBlock;
