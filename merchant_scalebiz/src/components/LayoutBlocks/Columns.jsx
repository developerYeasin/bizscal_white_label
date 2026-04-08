import React from 'react';
import { useDroppable } from '@dnd-kit/core';

/**
 * Columns Block Component
 * Creates a multi-column layout: 1-6 columns, with optional custom widths and gap.
 * Also acts as a droppable zone for each column.
 */
const Columns = ({ data, children }) => {
  const {
    columns = 2,
    gap = 'medium',
    columnWidths = [], // array of strings like ['50', '50']
    stackOnMobile = true,
  } = data || {};

  // Map gap size to Tailwind classes
  const gapClass = {
    none: 'gap-0',
    small: 'gap-2',
    medium: 'gap-4',
    large: 'gap-6',
    xl: 'gap-8',
  }[gap] || 'gap-4';

  // Determine flex direction
  const flexDirection = stackOnMobile ? 'flex-col md:flex-row' : 'flex-row';

  // Number of children (should ideally match columns, but we handle gracefully)
  const childCount = React.Children.count(children);

  // Build column widths: If custom columnWidths provided, use them; otherwise divide equally.
  const getColumnWidth = (index) => {
    if (columnWidths && columnWidths[index]) {
      return {
        flex: `0 0 ${columnWidths[index]}%`,
        maxWidth: `${columnWidths[index]}%`,
      };
    }
    // Equal width
    const width = 100 / columns;
    return {
      flex: `0 0 ${width}%`,
      maxWidth: `${width}%`,
    };
  };

  return (
    <div className={`flex ${flexDirection} ${gapClass}`}>
      {React.Children.map(children, (child, index) => (
        <div
          key={index}
          className="column flex-1"
          style={getColumnWidth(index)}
        >
          {/* Each column is also a droppable area for nested blocks */}
          {child}
        </div>
      ))}
    </div>
  );
};

export default Columns;
