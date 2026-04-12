import React from 'react';

/**
 * Section Block Component
 * Full-width container with customizable background, padding, and margin.
 * Supports layout modes: full-width, boxed, container.
 */
const Section = ({ data, children }) => {
  const {
    layout = "full-width",
    container = false,
    backgroundType = "color",
    backgroundColor = "#ffffff",
    backgroundImage = "",
    backgroundGradient = "",
    padding = { top: 40, right: 0, bottom: 40, left: 0 },
    margin = { top: 0, right: 0, bottom: 0, left: 0 },
    className = "",
  } = data || {};

  // Build style object
  const style = {
    paddingTop: `${padding.top}px`,
    paddingRight: `${padding.right}px`,
    paddingBottom: `${padding.bottom}px`,
    paddingLeft: `${padding.left}px`,
    marginTop: `${margin.top}px`,
    marginRight: `${margin.right}px`,
    marginBottom: `${margin.bottom}px`,
    marginLeft: `${margin.left}px`,
    backgroundColor: backgroundType === "color" ? backgroundColor : undefined,
  };

  if (backgroundType === "image" && backgroundImage) {
    style.backgroundImage = `url(${backgroundImage})`;
    style.backgroundSize = "cover";
    style.backgroundPosition = "center";
  } else if (backgroundType === "gradient" && backgroundGradient) {
    style.background = backgroundGradient;
  }

  // Layout classes
  let layoutClass = className;
  if (layout === "container" || container) {
    layoutClass += " container mx-auto px-4";
  } else if (layout === "boxed") {
    layoutClass += " max-w-[1200px] mx-auto px-4";
  }

  return (
    <section className={layoutClass} style={style}>
      {children}
    </section>
  );
};

export default Section;
