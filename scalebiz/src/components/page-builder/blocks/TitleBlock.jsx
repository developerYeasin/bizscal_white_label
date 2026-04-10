"use client";

import React from "react";

/**
 * Title Block Component
 */
const TitleBlock = ({ data }) => {
  const {
    text = "Enter Title Here",
    tag = "h2", // h1, h2, h3, h4, h5, h6
    align = "left", // left, center, right
    color = "inherit",
    fontSize = "",
    fontWeight = "600",
    letterSpacing = "0",
    lineHeight = "1.2",
    marginTop = 0,
    marginBottom = 16,
    className = "",
  } = data || {};

  const Tag = tag;

  const style = {
    textAlign: align,
    color: color,
    fontSize: fontSize ? (typeof fontSize === 'number' ? `${fontSize}px` : fontSize) : undefined,
    fontWeight: fontWeight,
    letterSpacing: letterSpacing ? (typeof letterSpacing === 'number' ? `${letterSpacing}px` : letterSpacing) : undefined,
    lineHeight: lineHeight,
    marginTop: `${marginTop}px`,
    marginBottom: `${marginBottom}px`,
  };

  return (
    <Tag className={`title-block ${className}`} style={style}>
      {text}
    </Tag>
  );
};

export default TitleBlock;
