import React from "react";

const Row = ({ data, children }) => {
  const {
    justifyContent = "flex-start",
    alignItems = "stretch",
    flexWrap = "wrap",
    gap = 16,
    padding = { top: 0, right: 0, bottom: 0, left: 0 },
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

  return (
    <div className={`page-builder-row ${className}`} style={rowStyle}>
      {children}
    </div>
  );
};

export default Row;
