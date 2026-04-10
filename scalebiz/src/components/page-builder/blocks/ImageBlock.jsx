"use client";

import React from "react";

/**
 * Image Block Component
 */
const ImageBlock = ({ data }) => {
  const {
    src = "https://via.placeholder.com/800x400?text=Placeholder+Image",
    alt = "",
    width = "100%",
    maxWidth = "100%",
    height = "auto",
    align = "center", // left, center, right
    borderRadius = 0,
    marginTop = 0,
    marginBottom = 16,
    className = "",
  } = data || {};

  const containerStyle = {
    textAlign: align,
    marginTop: `${marginTop}px`,
    marginBottom: `${marginBottom}px`,
  };

  const imageStyle = {
    width: width,
    maxWidth: maxWidth,
    height: height,
    borderRadius: `${borderRadius}px`,
    display: align === "center" ? "inline-block" : "block",
  };

  return (
    <div className={`image-block ${className}`} style={containerStyle}>
      <img 
        src={src} 
        alt={alt} 
        style={imageStyle}
        className="max-w-full"
      />
    </div>
  );
};

export default ImageBlock;
