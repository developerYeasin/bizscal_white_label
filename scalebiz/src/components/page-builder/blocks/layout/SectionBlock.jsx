"use client";

import React from "react";

/**
 * Section Block Component
 *
 * A full-width wrapper container that provides:
 * - Background color/image/gradient
 * - Padding and margin controls
 * - Minimum height
 * - Optional container inner wrapper
 *
 * Can contain any other blocks as children.
 */
const SectionBlock = ({ data, children }) => {
  const {
    backgroundColor = "#ffffff",
    backgroundImage = "",
    backgroundSize = "cover",
    backgroundPosition = "center",
    padding = { top: 40, right: 20, bottom: 40, left: 20 },
    margin = { top: 0, right: 0, bottom: 0, left: 0 },
    minHeight = "auto",
    container = false, // If true, wraps children in a max-width container
    className = "",
  } = data || {};

  // Build background style
  const backgroundStyle = {
    backgroundColor: backgroundImage ? undefined : backgroundColor,
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
    backgroundSize,
    backgroundPosition,
    backgroundRepeat: backgroundImage ? "no-repeat" : undefined,
  };

  const sectionStyle = {
    backgroundColor: backgroundImage ? undefined : backgroundColor,
    padding: `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`,
    margin: `${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px`,
    minHeight: typeof minHeight === "number" ? `${minHeight}px` : minHeight,
    ...backgroundStyle,
  };

  // Inner container wrapper (for boxed layout)
  const innerStyle = {
    maxWidth: container ? "1200px" : "100%",
    margin: "0 auto",
    width: "100%",
  };

  const sectionClasses = className ? `page-builder-section ${className}` : "page-builder-section";

  return (
    <section className={sectionClasses} style={sectionStyle}>
      {container ? <div style={innerStyle}>{children}</div> : children}
    </section>
  );
};

export default SectionBlock;
