"use client";

import React from "react";

/**
 * Text Block Component
 * Can be used for multi-line text or simple HTML content.
 */
const TextBlock = ({ data }) => {
  const {
    content = "<p>Add your content here...</p>",
    align = "left",
    color = "inherit",
    fontSize = "16px",
    lineHeight = "1.6",
    paddingTop = 0,
    paddingBottom = 0,
    className = "",
  } = data || {};

  const style = {
    textAlign: align,
    color: color,
    fontSize: fontSize ? (typeof fontSize === 'number' ? `${fontSize}px` : fontSize) : undefined,
    lineHeight: lineHeight,
    paddingTop: `${paddingTop}px`,
    paddingBottom: `${paddingBottom}px`,
  };

  return (
    <div 
      className={`text-block prose prose-sm max-w-none ${className}`} 
      style={style}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default TextBlock;
