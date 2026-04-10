"use client";

import React from "react";

/**
 * Description Block Component
 */
const DescriptionBlock = ({ data }) => {
  const {
    text = "Add your description text here. This is a perfect place to provide more details about your section or product.",
    align = "left", // left, center, right
    color = "#666666",
    fontSize = "16px",
    fontWeight = "400",
    lineHeight = "1.6",
    marginTop = 0,
    marginBottom = 16,
    className = "",
  } = data || {};

  const style = {
    textAlign: align,
    color: color,
    fontSize: fontSize ? (typeof fontSize === 'number' ? `${fontSize}px` : fontSize) : undefined,
    fontWeight: fontWeight,
    lineHeight: lineHeight,
    marginTop: `${marginTop}px`,
    marginBottom: `${marginBottom}px`,
  };

  return (
    <p className={`description-block ${className}`} style={style}>
      {text}
    </p>
  );
};

export default DescriptionBlock;
