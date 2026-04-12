import React from "react";

const Column = ({ data, children }) => {
  const {
    width = 100,
    order = 0,
    alignSelf = "auto",
    padding = { top: 0, right: 0, bottom: 0, left: 0 },
    margin = { top: 0, right: 0, bottom: 0, left: 0 },
    backgroundColor = "transparent",
    minHeight = "auto",
    className = "",
  } = data || {};

  // Handle fractional widths like "1/2" from the user's API response
  let calculatedWidth = width;
  if (typeof width === "string" && width.includes("/")) {
    const [num, den] = width.split("/").map(Number);
    calculatedWidth = (num / den) * 100;
  }

  const columnStyle = {
    flexBasis: `${calculatedWidth}%`,
    flexGrow: calculatedWidth > 0 ? 1 : 0,
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

  return (
    <div className={`page-builder-column ${className}`} style={columnStyle}>
      {children}
    </div>
  );
};

export default Column;
