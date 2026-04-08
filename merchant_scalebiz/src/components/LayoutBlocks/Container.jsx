import React from 'react';

/**
 * Container Block Component
 * Boxed container with max-width and alignment.
 */
const Container = ({ data, children }) => {
  const {
    maxWidth = '1200',
    alignment = 'center',
    padding = { top: 20, right: 20, bottom: 20, left: 20 },
    margin = { top: 0, right: 'auto', bottom: 0, left: 'auto' },
  } = data || {};

  const style = {
    maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
    marginTop: margin.top ?? 0,
    marginRight: margin.right ?? 'auto',
    marginBottom: margin.bottom ?? 0,
    marginLeft: margin.left ?? 'auto',
    paddingTop: padding.top ?? 0,
    paddingRight: padding.right ?? 0,
    paddingBottom: padding.bottom ?? 0,
    paddingLeft: padding.left ?? 0,
    width: '100%',
  };

  return <div className="w-full" style={style}>{children}</div>;
};

export default Container;
