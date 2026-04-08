import React from 'react';

/**
 * Grid Block Component
 * Flexible grid layout with auto-fit or fixed columns.
 */
const Grid = ({ data, children }) => {
  const {
    columns = 3,
    gap = 'medium',
    autoFit = true,
    minColumnWidth = 250,
  } = data || {};

  // Map gap to Tailwind classes
  const gapClass = {
    none: 'gap-0',
    small: 'gap-2',
    medium: 'gap-4',
    large: 'gap-6',
    xl: 'gap-8',
  }[gap] || 'gap-4';

  // Grid template columns
  const gridStyle = {
    display: 'grid',
    gap: `var(--gap, ${gap === 'none' ? 0 : gap === 'small' ? '0.5rem' : gap === 'medium' ? '1rem' : gap === 'large' ? '1.5rem' : '2rem'}`,
  };

  if (autoFit) {
    gridStyle.gridTemplateColumns = `repeat(auto-fit, minmax(${minColumnWidth}px, 1fr))`;
  } else {
    gridStyle.gridTemplateColumns = `repeat(${columns}, 1fr)`;
  }

  return (
    <div className="grid w-full" style={gridStyle}>
      {children}
    </div>
  );
};

export default Grid;
