import React from 'react';

/**
 * Section Block Component
 * Full-width container with customizable background, padding, and margin.
 * Supports layout modes: full-width, boxed, container.
 */
const Section = ({ data, children }) => {
  const {
    layout = 'full-width',
    backgroundType = 'color',
    backgroundColor = '#ffffff',
    backgroundImage = '',
    backgroundGradient = '',
    padding = { top: 40, right: 0, bottom: 40, left: 0 },
    margin = { top: 0, right: 0, bottom: 0, left: 0 },
  } = data || {};

  // Build style object
  const style = {
    paddingTop: padding.top ?? 0,
    paddingRight: padding.right ?? 0,
    paddingBottom: padding.bottom ?? 0,
    paddingLeft: padding.left ?? 0,
    marginTop: margin.top ?? 0,
    marginRight: margin.right ?? 0,
    marginBottom: margin.bottom ?? 0,
    marginLeft: margin.left ?? 0,
  };

  // Background
  if (backgroundType === 'color' && backgroundColor) {
    style.backgroundColor = backgroundColor;
  } else if (backgroundType === 'image' && backgroundImage) {
    style.backgroundImage = `url(${backgroundImage})`;
    style.backgroundSize = 'cover';
    style.backgroundPosition = 'center';
    style.backgroundRepeat = 'no-repeat';
  } else if (backgroundType === 'gradient' && backgroundGradient) {
    style.background = backgroundGradient;
  }

  // Layout classes
  let layoutClass = '';
  if (layout === 'container') {
    layoutClass = 'container mx-auto';
  } else if (layout === 'boxed') {
    layoutClass = 'max-w-[1200px] mx-auto';
  }
  // full-width has no extra class

  return (
    <section className={layoutClass} style={style}>
      {children}
    </section>
  );
};

export default Section;
