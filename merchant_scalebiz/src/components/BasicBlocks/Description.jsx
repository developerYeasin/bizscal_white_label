import React from "react";

const Description = ({ data }) => {
  const {
    text = "",
    textAlign = "left",
    color = "inherit",
    fontSize = "",
    lineHeight = "1.6",
    margin = { top: 0, right: 0, bottom: 16, left: 0 },
    className = "",
  } = data || {};

  const style = {
    textAlign,
    color,
    fontSize: fontSize ? `${fontSize}px` : undefined,
    lineHeight,
    marginTop: `${margin.top}px`,
    marginRight: `${margin.right}px`,
    marginBottom: `${margin.bottom}px`,
    marginLeft: `${margin.left}px`,
  };

  return (
    <div className={className} style={style}>
      {text}
    </div>
  );
};

export default Description;
